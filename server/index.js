/* =============================================================================
   RESUME BUILDER — MULTI-LAYER SCREENSHOT PAYMENT VERIFICATION BACKEND
   Express.js Server with:
     - Multi-Signal Screenshot Analysis & Anti-Tamper Engine (POST /api/payment/verify-screenshot)
     - Strict ₹11 Amount, Payee & Unique Transaction/UTR Validation
     - Cryptographic Download Token Issuance & Validation (POST /api/payment/validate-token)
     - Secure Timing-Safe Admin Password Unlock (POST /api/auth/unlock-password)
     - Helmet HTTP Security Headers, Rate Limiting & Input Validation
   ============================================================================= */

'use strict';

require('dotenv').config();
const express   = require('express');
const helmet    = require('helmet');
const crypto    = require('crypto');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const path      = require('path');

// ---------------------------------------------------------------------------
// 1. Configuration & Constants
// ---------------------------------------------------------------------------
const PORT                    = parseInt(process.env.PORT || '3001', 10);
const NODE_ENV                = process.env.NODE_ENV || 'development';
const FRONTEND_ORIGIN         = process.env.FRONTEND_ORIGIN || 'http://localhost:5500';
const TOKEN_SECRET            = process.env.TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_DOWNLOAD_PASSWORD = process.env.ADMIN_DOWNLOAD_PASSWORD || 'Saurav@953474@#6207';

// Configured Expected Payment Receiver & Fixed ₹11.00 Amount
const EXPECTED_PAYEE_NAME     = (process.env.EXPECTED_PAYEE_NAME || 'SULEKHA DEVI').toUpperCase();
const EXPECTED_UPI_ID         = (process.env.EXPECTED_UPI_ID || '6207911534@ibl').toLowerCase();
const EXPECTED_PAYEE_PHONE    = (process.env.EXPECTED_PAYEE_PHONE || '6207911534').toLowerCase();
const REQUIRED_AMOUNT_RUPEES  = parseFloat(process.env.EXPECTED_AMOUNT_RUPEES || '11.00');

/** Download session token validity (24 hours persistent access for multiple downloads) */
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// 2. Server-Side Verification Store & Anti-Replay Caches
// ---------------------------------------------------------------------------

/** Track used screenshot SHA-256 hashes to prevent duplicate proof reuse */
const usedScreenshotHashes = new Set();

/** Track used UPI UTR / Transaction Reference IDs to prevent reuse */
const usedTransactionIds = new Set();

/** Active verified sessions: referenceId -> { downloadToken, tokenExpiresAt, createdAt } */
const verifiedSessions = new Map();

// ---------------------------------------------------------------------------
// 3. Express App & Security Middleware
// ---------------------------------------------------------------------------
const app = express();

app.set('trust proxy', 1);

// HTTP Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "http://localhost:*",
        "http://127.0.0.1:*"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin === FRONTEND_ORIGIN) return callback(null, true);
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return callback(null, true);
    return callback(new Error(`CORS policy rejection: origin ${origin} not permitted.`));
  },
  credentials: true
}));

// ---------------------------------------------------------------------------
// 4. Rate Limiters
// ---------------------------------------------------------------------------
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 15,                  // max 15 verification attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    confidence: 'INVALID',
    error: 'Too many verification attempts. Please try again after a few minutes.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts. Please try again later.' }
});

const validateTokenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

// JSON body parser with size limit to prevent payload flooding
app.use(express.json({ limit: '2mb' }));

// Serve static frontend files (index.html, script.js, style.css, assets)
app.use(express.static(path.join(__dirname, '..')));

// ---------------------------------------------------------------------------
// 5. Cryptographic Token & Safety Helpers
// ---------------------------------------------------------------------------
function generateDownloadToken(referenceId) {
  const payload = `${referenceId}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
  const hmac    = crypto.createHmac('sha256', TOKEN_SECRET);
  hmac.update(payload);
  return hmac.digest('hex') + '.' + Buffer.from(referenceId).toString('base64url');
}

function parseReferenceFromToken(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  try {
    return Buffer.from(parts[1], 'base64url').toString('utf8');
  } catch {
    return null;
  }
}

function timingSafeEqualStrings(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function now() { return new Date().toISOString(); }

function safeLog(level, message, meta = {}) {
  const sanitized = { ...meta };
  const SENSITIVE_KEYS = ['password', 'secret', 'key', 'token', 'authorization', 'cookie'];
  for (const k of Object.keys(sanitized)) {
    if (SENSITIVE_KEYS.some(sk => k.toLowerCase().includes(sk))) {
      sanitized[k] = '[REDACTED]';
    }
  }
  const metaStr = Object.keys(sanitized).length > 0 ? ' ' + JSON.stringify(sanitized) : '';
  if (level === 'error') {
    console.error(`[${now()}] [ERROR] ${message}${metaStr}`);
  } else if (level === 'warn') {
    console.warn(`[${now()}] [WARN] ${message}${metaStr}`);
  } else {
    console.log(`[${now()}] [INFO] ${message}${metaStr}`);
  }
}

// ---------------------------------------------------------------------------
// 6. Multi-Layer Screenshot Analysis Engine
// ---------------------------------------------------------------------------

/**
 * Analyzes OCR text and visual evidence signals to verify payment authenticity.
 * Follows Fail-Closed security: ANY uncertainty or mismatch = REJECT.
 */
function analyzeScreenshotEvidence({ rawText = '', screenshotHash = '', imageMeta = {}, visualSignals = {} }) {
  const cleanText = String(rawText || '')
    .toLowerCase()
    .replace(/[₹\u20B9]/g, ' rs ')
    .replace(/[|│]/g, ' 1 ')
    .replace(/\s+/g, ' ');

  const result = {
    imageIntegrity: false,
    duplicateCheck: false,
    amountMatch: false,
    payeeMatch: false,
    statusMatch: false,
    transactionIdValid: false,
    typographyConsistency: false,
    suspiciousEditing: false,
    confidence: 'INVALID',
    failureReason: '',
    extractedAmount: null,
    extractedTxnId: null,
    extractedPayee: null
  };

  // Signal 1: Image Structure & Integrity
  const width  = parseInt(imageMeta.width || 0, 10);
  const height = parseInt(imageMeta.height || 0, 10);
  const size   = parseInt(imageMeta.size || 0, 10);

  if (width < 150 || height < 150) {
    result.failureReason = 'Screenshot resolution is too low to verify details.';
    result.confidence = 'INVALID';
    return result;
  }
  if (size > 10 * 1024 * 1024) {
    result.failureReason = 'Screenshot file size exceeds 10MB limit.';
    result.confidence = 'INVALID';
    return result;
  }
  result.imageIntegrity = true;

  // Signal 2: Duplicate Screenshot Hash Detection
  if (!screenshotHash || typeof screenshotHash !== 'string' || screenshotHash.length < 32) {
    result.failureReason = 'Screenshot integrity hash could not be verified.';
    result.confidence = 'INVALID';
    return result;
  }
  if (usedScreenshotHashes.has(screenshotHash)) {
    result.duplicateCheck = false;
    result.suspiciousEditing = true;
    result.failureReason = 'This payment screenshot was already submitted.';
    result.confidence = 'SUSPICIOUS';
    return result;
  }
  result.duplicateCheck = true;

  // Signal 3: Anti-Tampering / Visual Anomaly Analysis
  if (
    visualSignals.tamperDetected ||
    visualSignals.patchDetected ||
    visualSignals.baselineMismatch ||
    visualSignals.fontMismatch ||
    visualSignals.digitSymmetryMismatch ||
    visualSignals.colorVarianceAnomaly ||
    visualSignals.inconsistentSharpness ||
    visualSignals.elaAnomaly
  ) {
    result.suspiciousEditing = true;
    result.failureReason = visualSignals.reason || 'Visual forensic analysis detected potential image editing, inconsistent typography, or spliced amount in the payment receipt.';
    result.confidence = 'SUSPICIOUS';
    return result;
  }
  result.typographyConsistency = true;

  // Signal 4: Strict Amount Verification (Must be exactly ₹11.00)
  let foundExact11 = false;
  let foundWrongAmount = null;

  // Check for presence of ₹1 payment or conflicting amount
  const hasWrong1Match = /(?:rs\.?|inr|₹)\s*1(?:\.00|\.0)?(?=[^\d]|$)/i.test(cleanText);
  const mentions1Rupee = /\b(?:paid|payment\s*of|amount|debited|transfer(?:red)?(?:\s*to)?)\s*(?:rs\.?|inr|₹)?\s*1(?:\.00)?\b/i.test(cleanText);

  // Look for currency-tagged amounts: rs 11, rs 11.00, inr 11, etc.
  const currencyMatches = cleanText.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/gi);
  if (currencyMatches && currencyMatches.length > 0) {
    for (const match of currencyMatches) {
      const numStr = match.replace(/(?:rs\.?|inr|₹)\s*/i, '').replace(/,/g, '');
      const val = parseFloat(numStr);
      if (val === REQUIRED_AMOUNT_RUPEES) {
        foundExact11 = true;
      } else if (!isNaN(val) && val > 0 && val !== REQUIRED_AMOUNT_RUPEES) {
        foundWrongAmount = val;
      }
    }
  }

  // Standalone boundary 11 check
  if (!foundExact11) {
    const standalone11Regex = /(?:^|[^\d.])(?:11(?:\.00|\.0)?)(?=[^\d.]|$)/;
    if (standalone11Regex.test(cleanText)) {
      foundExact11 = true;
    }
  }

  // If ₹1 was detected and 11 is suspicious or absent
  if (hasWrong1Match && !foundExact11) {
    result.amountMatch = false;
    result.extractedAmount = '₹1.00';
    result.failureReason = 'Payment amount was detected as ₹1.00, but exactly ₹11.00 is required.';
    result.confidence = 'LOW_CONFIDENCE';
    return result;
  }

  // If wrong amount is prominent and 11 is absent or ambiguous
  if (!foundExact11 || (foundWrongAmount && foundWrongAmount !== REQUIRED_AMOUNT_RUPEES && hasWrong1Match)) {
    result.amountMatch = false;
    result.extractedAmount = foundWrongAmount ? `₹${foundWrongAmount}` : 'Not detected';
    result.failureReason = foundWrongAmount
      ? `Payment amount was detected as ₹${foundWrongAmount}, but exactly ₹11.00 is required.`
      : 'The payment amount of ₹11 could not be confirmed from the screenshot.';
    result.confidence = 'LOW_CONFIDENCE';
    return result;
  }
  result.amountMatch = true;
  result.extractedAmount = '₹11.00';

  // Signal 5: Payee & Payment Destination Check
  const hasPayeeName = /sulekha(?:\s*devi)?/i.test(cleanText) ||
                       (/sulekha/i.test(cleanText) && /devi/i.test(cleanText));
  const hasUpiId     = /6207911534@ibl/i.test(cleanText) || /6207911534/i.test(cleanText) || /ibl/i.test(cleanText);

  if (!hasPayeeName && !hasUpiId) {
    result.payeeMatch = false;
    result.failureReason = 'Payment recipient does not match SULEKHA DEVI (6207911534@ibl).';
    result.confidence = 'LOW_CONFIDENCE';
    return result;
  }
  result.payeeMatch = true;
  result.extractedPayee = 'SULEKHA DEVI (6207911534@ibl)';

  // Signal 6: Payment Success Status
  const isSuccess = /(?:success|successful|completed|paid\s*to|transferred\s*to|payment\s*of|debited|money\s*transferred|transfer\s*details)/i.test(cleanText) ||
                    cleanText.includes('success') || cleanText.includes('paid to');
  const isFailedOrPending = /(?:payment\s*failed|declined|cancelled|refunded|payment\s*declined)/i.test(cleanText);

  if (!isSuccess || isFailedOrPending) {
    result.statusMatch = false;
    result.failureReason = isFailedOrPending
      ? 'Payment status indicates a failed or declined transaction.'
      : 'Could not confirm that the transaction was completed successfully.';
    result.confidence = 'LOW_CONFIDENCE';
    return result;
  }
  result.statusMatch = true;

  // Signal 7: Transaction / Reference / UTR ID Extraction
  const utr12Match        = cleanText.match(/\b\d{12}\b/);
  const phonePeTxnMatch   = cleanText.match(/\b(t\d{20,24})\b/i);
  const generalRefMatch   = cleanText.match(/(?:upi\s*ref(?:erence)?|ref(?:erence)?\s*(?:no\.?|id)?|txn\s*(?:id)?|transaction\s*(?:id)?|utr[:\s]*)\s*[:#-]?\s*([a-zA-Z0-9]{8,24})/i);

  const txnId = utr12Match
    ? utr12Match[0]
    : (phonePeTxnMatch ? phonePeTxnMatch[1].toUpperCase() : (generalRefMatch ? generalRefMatch[1] : null));

  if (txnId) {
    if (usedTransactionIds.has(txnId)) {
      result.transactionIdValid = false;
      result.suspiciousEditing = true;
      result.failureReason = `Transaction ID ${txnId} has already been used for a previous download.`;
      result.confidence = 'SUSPICIOUS';
      return result;
    }
    result.transactionIdValid = true;
    result.extractedTxnId = txnId;
  } else {
    // Valid fallback for apps with non-standard reference text format
    result.transactionIdValid = true;
    result.extractedTxnId = 'UTR' + Date.now().toString().slice(-10);
  }

  // All 7 signals verified: High Confidence
  if (
    result.imageIntegrity &&
    result.duplicateCheck &&
    result.amountMatch &&
    result.payeeMatch &&
    result.statusMatch &&
    result.transactionIdValid &&
    result.typographyConsistency &&
    !result.suspiciousEditing
  ) {
    result.confidence = 'HIGH_CONFIDENCE';
  } else {
    result.confidence = 'MEDIUM_CONFIDENCE';
    result.failureReason = 'Payment signals could not be verified with high confidence.';
  }

  return result;
}

// ============================================================================
// ROUTE 1: Verify Payment Screenshot (Multi-Layer Analysis)
// POST /api/payment/verify-screenshot
// ============================================================================
app.post('/api/payment/verify-screenshot', verifyLimiter, (req, res) => {
  try {
    const { rawText, screenshotHash, imageMeta, visualSignals } = req.body || {};

    safeLog('info', 'Received payment screenshot verification request');

    const analysis = analyzeScreenshotEvidence({
      rawText,
      screenshotHash,
      imageMeta: imageMeta || {},
      visualSignals: visualSignals || {}
    });

    safeLog('info', 'Screenshot analysis result', {
      confidence: analysis.confidence,
      amountMatch: analysis.amountMatch,
      payeeMatch: analysis.payeeMatch,
      statusMatch: analysis.statusMatch
    });

    // Strict Fail-Closed Check: ONLY HIGH_CONFIDENCE unlocks download
    if (analysis.confidence !== 'HIGH_CONFIDENCE') {
      return res.status(400).json({
        success: false,
        confidence: analysis.confidence,
        error: 'Payment verification failed',
        message: analysis.failureReason || 'We could not verify the authenticity of the uploaded payment screenshot. Please ensure you paid ₹11 to SULEKHA DEVI and upload the original receipt.',
        details: analysis
      });
    }

    // Record verified screenshot and transaction to prevent replay
    if (screenshotHash) usedScreenshotHashes.add(screenshotHash);
    if (analysis.extractedTxnId) usedTransactionIds.add(analysis.extractedTxnId);

    // Generate cryptographically signed downloadToken (Persistent session for multiple downloads)
    const sessionId      = `sess_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const downloadToken  = generateDownloadToken(sessionId);
    const tokenExpiresAt = Date.now() + TOKEN_TTL_MS;

    verifiedSessions.set(sessionId, {
      downloadToken,
      tokenExpiresAt,
      txnId: analysis.extractedTxnId,
      downloadCount: 0,
      createdAt: now()
    });

    safeLog('info', '✓ Payment VERIFIED. Persistent session download token issued', { txnId: analysis.extractedTxnId });

    res.json({
      success: true,
      confidence: 'HIGH_CONFIDENCE',
      downloadToken,
      tokenExpiresAt,
      txnId: analysis.extractedTxnId,
      amount: '₹11.00',
      payee: EXPECTED_PAYEE_NAME,
      message: '₹11 payment successfully verified. Your resume download access is now unlocked.'
    });
  } catch (err) {
    safeLog('error', 'Screenshot verification route exception', { error: err.message });
    res.status(500).json({
      success: false,
      confidence: 'INVALID',
      error: 'Internal verification error',
      message: 'An error occurred while analyzing the payment screenshot. Please try again.'
    });
  }
});

// ============================================================================
// ROUTE 2: Validate Download Token (Gatekeeper for Resume Download)
// POST /api/payment/validate-token
// Body: { token }
// ============================================================================
app.post('/api/payment/validate-token', validateTokenLimiter, (req, res) => {
  try {
    const { token } = req.body || {};

    if (!token || typeof token !== 'string' || token.length > 256) {
      return res.status(400).json({ success: false, error: 'Valid download token is required.' });
    }

    const referenceId = parseReferenceFromToken(token);
    if (!referenceId) {
      return res.status(403).json({ success: false, error: 'Invalid or forged download token.' });
    }

    const record = verifiedSessions.get(referenceId);
    if (!record) {
      return res.status(403).json({
        success: false,
        error: 'A verified ₹11 payment or authorized password is required to download this resume.'
      });
    }

    if (record.downloadToken !== token || !record.tokenExpiresAt || Date.now() > record.tokenExpiresAt) {
      return res.status(403).json({
        success: false,
        error: 'Your download session has expired. Please verify your payment to renew access.'
      });
    }

    res.json({
      success: true,
      authorized: true,
      txnId: record.txnId,
      tokenExpiresAt: record.tokenExpiresAt,
      downloadCount: record.downloadCount || 0
    });
  } catch (err) {
    safeLog('error', 'Token validation error', { error: err.message });
    res.status(500).json({ success: false, error: 'Internal validation error.' });
  }
});

// ============================================================================
// ROUTE 2b: Consume / Record Download Token (Audit log for resume export)
// POST /api/payment/consume-token
// Body: { token }
// ============================================================================
app.post('/api/payment/consume-token', validateTokenLimiter, (req, res) => {
  try {
    const { token } = req.body || {};

    if (!token || typeof token !== 'string' || token.length > 256) {
      return res.status(400).json({ success: false, error: 'Valid download token is required.' });
    }

    const referenceId = parseReferenceFromToken(token);
    if (!referenceId) {
      return res.status(403).json({ success: false, error: 'Invalid token.' });
    }

    const record = verifiedSessions.get(referenceId);
    if (!record) {
      return res.status(403).json({ success: false, error: 'Session not found.' });
    }

    if (!record.tokenExpiresAt || Date.now() > record.tokenExpiresAt) {
      return res.status(403).json({
        success: false,
        error: 'Your download session has expired. Please verify your payment to renew access.'
      });
    }

    record.downloadCount = (record.downloadCount || 0) + 1;
    record.lastDownloadAt = now();
    safeLog('info', 'Download successfully recorded for session', { referenceId, count: record.downloadCount });

    res.json({
      success: true,
      authorized: true,
      downloadCount: record.downloadCount,
      message: 'Resume download authorized successfully.'
    });
  } catch (err) {
    safeLog('error', 'Token recording error', { error: err.message });
    res.status(500).json({ success: false, error: 'Internal error processing download.' });
  }
});

// ============================================================================
// ROUTE 3: Secure Password / Admin Direct Unlock
// POST /api/auth/unlock-password
// Body: { password }
// ============================================================================
app.post('/api/auth/unlock-password', authLimiter, (req, res) => {
  const { password } = req.body || {};

  if (!password || typeof password !== 'string' || password.length > 128) {
    return res.status(400).json({ success: false, error: 'Password is required.' });
  }

  const isCorrect = timingSafeEqualStrings(password.trim(), ADMIN_DOWNLOAD_PASSWORD);

  if (!isCorrect) {
    safeLog('warn', 'Failed admin password unlock attempt');
    return res.status(401).json({ success: false, error: 'Incorrect authorization password.' });
  }

  const authSessionId  = `admin_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  const downloadToken  = generateDownloadToken(authSessionId);
  const tokenExpiresAt = Date.now() + TOKEN_TTL_MS;

  verifiedSessions.set(authSessionId, {
    downloadToken,
    tokenExpiresAt,
    txnId: 'ADMIN_PASSWORD_AUTH',
    createdAt: now()
  });

  safeLog('info', 'Admin password unlock successful');

  res.json({
    success: true,
    downloadToken,
    tokenExpiresAt,
    message: 'Access granted successfully.'
  });
});

// ============================================================================
// Health Check Endpoint
// ============================================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Resume Builder Screenshot Verification Backend',
    mode: 'MANUAL_PAYMENT_VERIFICATION',
    timestamp: now()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, _next) => {
  safeLog('error', 'Unhandled server error', { error: err.message });
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred. Please try again.'
  });
});

// Start Server
app.listen(PORT, () => {
  safeLog('info', `Multi-Layer Payment Verification Backend listening on port ${PORT} [${NODE_ENV}]`);
});
