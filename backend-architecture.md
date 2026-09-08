# Manual UPI Payment & Multi-Layer Screenshot Verification Architecture

This guide details the complete production architecture for the manual ₹11 UPI payment verification engine and download gatekeeper for the **Resume Builder & ATS Resume Checker**.

---

## 1. Production Architecture Overview

The system operates on **Zero Client Trust** and a **Fail-Closed Multi-Signal Verification Pipeline**:

```
   [User Browser]
         │
         │ 1. Clicks "Download Resume"
         ▼
   [Payment Modal] ── 2. Displays QR Code (SULEKHA DEVI - 6207911534@ibl)
         │                Fixed Amount: ₹11.00
         │ 3. User pays ₹11 via any UPI app & uploads screenshot receipt
         ▼
   [Client OCR & Visual Signal Pre-Processing]
         │ 4. Computes SHA-256 hash, runs edge/patch anomaly check & OCR
         ▼
   [Node.js Backend] ── 5. POST /api/payment/verify-screenshot
         │
         ├──► 6. Evaluates 7 Multi-Layer Signals:
         │      - Signal 1: Image Structure & Resolution Integrity (min 150x150, max 10MB)
         │      - Signal 2: Anti-Replay Duplicate Hash Detection (Set cache)
         │      - Signal 3: Visual Anti-Tampering & Patch Anomaly Analysis
         │      - Signal 4: Strict ₹11.00 Amount Match (Rejects ₹1, ₹10, ₹12, etc.)
         │      - Signal 5: Payee & UPI ID Match (SULEKHA DEVI / 6207911534@ibl)
         │      - Signal 6: Payment Success State Confirmation (Success / Completed / Paid)
         │      - Signal 7: UTR / Reference ID Extraction & Anti-Replay Cache Check
         │
         ├──► 7. If all 7 pass with HIGH_CONFIDENCE:
         │      - Issue cryptographically signed HMAC downloadToken (TTL: 24 hours persistent session)
         │      - Record screenshot hash and transaction ID in anti-replay cache
         │      - Persist token in client sessionStorage for seamless re-entry without re-payment
         │
         └──► 8. If any signal fails or is uncertain:
                - Return HTTP 400 with specific error reason (Download remains locked)
         ▼
   [Browser Client] ── 9. POST /api/payment/validate-token { token: downloadToken }
         ▼
   [Node.js Backend Gatekeeper] ── 10. Validates token signature & TTL ──► [Resume Download Unlocked for Session (PDF, PNG, JPG)]
```

---

## 2. Server Implementation (`server/index.js`)

The Node.js/Express backend provides key production endpoints:
- `POST /api/payment/verify-screenshot`: Analyzes screenshot evidence and issues signed tokens upon `HIGH_CONFIDENCE`.
- `POST /api/payment/validate-token`: Gatekeeper that authorizes multi-format downloads (PDF, PNG, JPG) for valid signed tokens during the session.
- `POST /api/payment/consume-token`: Records download audit counts while preserving persistent session access for multiple downloads.
- `POST /api/auth/unlock-password`: Timing-safe admin unlock endpoint using `crypto.timingSafeEqual`.
- `GET /health`: Health check and mode verification endpoint.

---

## 3. Environment Configuration (`server/.env`)

**NEVER** commit `.env` to GitHub or expose credentials in client-side code:

```ini
PORT=3001
NODE_ENV=production
FRONTEND_ORIGIN=http://localhost:5500

# Fixed Payment Details
EXPECTED_PAYEE_NAME=SULEKHA DEVI
EXPECTED_UPI_ID=6207911534@ibl
EXPECTED_PAYEE_PHONE=6207911534
EXPECTED_AMOUNT_RUPEES=11.00

# Cryptographic Token Secret
TOKEN_SECRET=your_long_random_64_character_hex_token_secret

# Admin Direct Unlock Password
ADMIN_DOWNLOAD_PASSWORD=your_secure_admin_password
```

---

## 4. Security Checklist

1. **Client Isolation**: Client-side code (`script.js`) never contains API secrets, HMAC secrets, or database credentials.
2. **Fail-Closed Verification**: Only `HIGH_CONFIDENCE` issues a download token. Any anomaly or mismatch keeps the download locked.
3. **Double Anti-Replay Protection**: Both image SHA-256 hashes and 12-digit UTR/transaction reference numbers are cached. Repeated submissions are rejected.
4. **Finite Timeouts**: Client-side verification enforces a hard 18-second timeout (`AbortController`), completely eliminating infinite loading states.
5. **Sanitized Rendering**: Dynamic DOM text is escaped using `escapeText()` to eliminate XSS risks.

