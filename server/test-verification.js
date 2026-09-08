/**
 * Automated Verification Suite for Resume Builder Manual Payment Verification Server
 * Tests all multi-layer screenshot verification rules, anti-tamper heuristics,
 * token gatekeepers, duplicate detection, and password auth.
 */

'use strict';

require('dotenv').config();
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3001';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✕ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('\n=============================================================');
  console.log('RUNNING AUTOMATED MANUAL PAYMENT SCREENSHOT VERIFICATION TESTS');
  console.log('=============================================================\n');

  // Test Suite 1: Health Endpoint & Security Headers
  console.log('--- Test Suite 1: Health & HTTP Security Headers ---');
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.status === 200 && data.status === 'OK', 'Health check returns 200 OK');
    assert(data.mode === 'MANUAL_PAYMENT_VERIFICATION', 'Backend running in MANUAL_PAYMENT_VERIFICATION mode');
    assert(res.headers.get('x-content-type-options') === 'nosniff', 'Security header X-Content-Type-Options: nosniff present');
    assert(res.headers.get('x-frame-options') === 'SAMEORIGIN' || res.headers.has('content-security-policy'), 'Security frame-protection headers present');
  } catch (e) {
    assert(false, `Server unreachable at ${BASE_URL}: ${e.message}`);
    return;
  }

  // Test Suite 2: Secure Password Unlock (Timing-Safe Admin Auth)
  console.log('\n--- Test Suite 2: Timing-Safe Admin Password Authentication ---');
  {
    // Invalid Password
    const badRes = await fetch(`${BASE_URL}/api/auth/unlock-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'WrongPassword123!' })
    });
    assert(badRes.status === 401, 'Incorrect password returns HTTP 401 Unauthorized');
    const badData = await badRes.json();
    assert(badData.success === false, 'Incorrect password returns success=false');

    // Missing Password
    const emptyRes = await fetch(`${BASE_URL}/api/auth/unlock-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(emptyRes.status === 400, 'Empty password returns HTTP 400 Bad Request');

    // Valid Password
    const validRes = await fetch(`${BASE_URL}/api/auth/unlock-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: process.env.ADMIN_DOWNLOAD_PASSWORD || 'Saurav@953474@#6207' })
    });
    assert(validRes.status === 200, 'Correct password returns HTTP 200 OK');
    const validData = await validRes.json();
    assert(validData.success === true && typeof validData.downloadToken === 'string', 'Correct password issues valid downloadToken');

    // Validate the issued token
    const tokenCheck = await fetch(`${BASE_URL}/api/payment/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: validData.downloadToken })
    });
    const tokenCheckData = await tokenCheck.json();
    assert(tokenCheck.status === 200 && tokenCheckData.authorized === true, 'Token issued via password unlocks resume download');
  }

  // Test Suite 3: Token Gatekeeper Security
  console.log('\n--- Test Suite 3: Resume Download Token Gatekeeper ---');
  {
    // Forged Token
    const res = await fetch(`${BASE_URL}/api/payment/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'fake_manipulated_token.123' })
    });
    assert(res.status === 403, 'Fake/manipulated token returns HTTP 403 Forbidden');
    const data = await res.json();
    assert(data.success === false, 'Fake token response indicates success=false');

    // Missing Token
    const resEmpty = await fetch(`${BASE_URL}/api/payment/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(resEmpty.status === 400, 'Missing token returns HTTP 400 Bad Request');
  }

  // Test Suite 4: Screenshot Multi-Layer Verification
  console.log('\n--- Test Suite 4: Multi-Layer Screenshot Verification Engine ---');

  // Test 4a: ₹1 Screenshot (Must be REJECTED with clear amount error)
  {
    const fakeHash1 = crypto.createHash('sha256').update('test_screenshot_1_rupee').digest('hex');
    const res = await fetch(`${BASE_URL}/api/payment/verify-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: 'Payment of ₹1.00 successful to Sulekha Devi UPI ID 6207911534@ibl UTR: 409823145678',
        screenshotHash: fakeHash1,
        imageMeta: { width: 1080, height: 2340, size: 245000 },
        visualSignals: { tamperDetected: false, patchDetected: false }
      })
    });
    assert(res.status === 400, '₹1 payment screenshot returns HTTP 400 rejection');
    const data = await res.json();
    assert(data.success === false, '₹1 screenshot returns success=false');
    assert(data.confidence === 'LOW_CONFIDENCE', '₹1 screenshot marked as LOW_CONFIDENCE');
    assert(data.message.includes('₹1') && data.message.includes('₹11'), 'Clear error message indicating ₹1 was detected and ₹11 is required');
  }

  // Test 4b: Tampered / Edited Screenshot (Must be REJECTED as SUSPICIOUS)
  {
    const fakeHashTampered = crypto.createHash('sha256').update('test_screenshot_tampered').digest('hex');
    const res = await fetch(`${BASE_URL}/api/payment/verify-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: 'Payment of ₹11.00 successful to Sulekha Devi UPI ID 6207911534@ibl UTR: 409823999999',
        screenshotHash: fakeHashTampered,
        imageMeta: { width: 1080, height: 2340, size: 245000 },
        visualSignals: { tamperDetected: true, patchDetected: true }
      })
    });
    assert(res.status === 400, 'Tampered screenshot returns HTTP 400 rejection');
    const data = await res.json();
    assert(data.success === false && data.confidence === 'SUSPICIOUS', 'Tampered screenshot marked as SUSPICIOUS');
    assert(data.details.suspiciousEditing === true, 'Suspicious editing flag flagged true');
  }

  // Test 4c: Wrong Payee Screenshot (Must be REJECTED)
  {
    const fakeHashWrongPayee = crypto.createHash('sha256').update('test_screenshot_wrong_payee').digest('hex');
    const res = await fetch(`${BASE_URL}/api/payment/verify-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: 'Payment of ₹11.00 successful to Random Shop UPI ID random@oksbi UTR: 409823111222',
        screenshotHash: fakeHashWrongPayee,
        imageMeta: { width: 1080, height: 2340, size: 245000 },
        visualSignals: { tamperDetected: false, patchDetected: false }
      })
    });
    assert(res.status === 400, 'Wrong payee screenshot returns HTTP 400 rejection');
    const data = await res.json();
    assert(data.success === false && data.confidence === 'LOW_CONFIDENCE', 'Wrong payee marked as LOW_CONFIDENCE');
  }

  // Test 4d: Genuine ₹11 Screenshot to SULEKHA DEVI (Must PASS with HIGH_CONFIDENCE)
  let verifiedToken = null;
  const genuineHash = crypto.createHash('sha256').update('genuine_screenshot_' + Date.now()).digest('hex');
  const genuineUtr = '409823' + Math.floor(100000 + Math.random() * 900000);
  {
    const res = await fetch(`${BASE_URL}/api/payment/verify-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: `Paid to Sulekha Devi\n₹11\nCompleted\nUPI Ref No: ${genuineUtr}\n6207911534@ibl`,
        screenshotHash: genuineHash,
        imageMeta: { width: 1080, height: 2340, size: 310000 },
        visualSignals: { tamperDetected: false, patchDetected: false }
      })
    });
    assert(res.status === 200, 'Genuine ₹11 payment screenshot returns HTTP 200 OK');
    const data = await res.json();
    assert(data.success === true, 'Verification returns success=true');
    assert(data.confidence === 'HIGH_CONFIDENCE', 'Confidence is HIGH_CONFIDENCE');
    assert(typeof data.downloadToken === 'string' && data.downloadToken.length > 20, 'Cryptographically signed downloadToken issued');
    assert(data.amount === '₹11.00', 'Verified amount is ₹11.00');
    assert(data.payee === 'SULEKHA DEVI', 'Verified payee is SULEKHA DEVI');
    verifiedToken = data.downloadToken;

    // Validate the token against token gatekeeper
    const tokenCheck = await fetch(`${BASE_URL}/api/payment/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verifiedToken })
    });
    const tokenCheckData = await tokenCheck.json();
    assert(tokenCheck.status === 200 && tokenCheckData.authorized === true, 'Token gatekeeper validates verified screenshot token');
  }

  // Test 4e: Forensic checks: Baseline and Font Mismatches (Must be REJECTED as SUSPICIOUS)
  {
    const resBaseline = await fetch(`${BASE_URL}/api/payment/verify-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: 'Payment of ₹11.00 successful to Sulekha Devi UPI ID 6207911534@ibl UTR: 409823999111',
        screenshotHash: crypto.createHash('sha256').update('baseline_test_' + Date.now()).digest('hex'),
        imageMeta: { width: 1080, height: 2340, size: 245000 },
        visualSignals: { baselineMismatch: true }
      })
    });
    assert(resBaseline.status === 400, 'Baseline mismatch returns HTTP 400 rejection');
    const bData = await resBaseline.json();
    assert(bData.confidence === 'SUSPICIOUS', 'Baseline mismatch marked as SUSPICIOUS');

    const resFont = await fetch(`${BASE_URL}/api/payment/verify-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: 'Payment of ₹11.00 successful to Sulekha Devi UPI ID 6207911534@ibl UTR: 409823999222',
        screenshotHash: crypto.createHash('sha256').update('font_test_' + Date.now()).digest('hex'),
        imageMeta: { width: 1080, height: 2340, size: 245000 },
        visualSignals: { fontMismatch: true }
      })
    });
    assert(resFont.status === 400, 'Font/stroke density mismatch returns HTTP 400 rejection');
    const fData = await resFont.json();
    assert(fData.confidence === 'SUSPICIOUS', 'Font mismatch marked as SUSPICIOUS');
  }

  // Test 4f: Anti-Replay: Duplicate Screenshot Submission (Must be REJECTED)
  console.log('\n--- Test Suite 5: Anti-Replay & Duplicate Prevention ---');
  {
    const dupRes = await fetch(`${BASE_URL}/api/payment/verify-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: `Paid to Sulekha Devi\n₹11\nCompleted\nUPI Ref No: 999999999999\n6207911534@ibl`,
        screenshotHash: genuineHash, // Same hash as previously verified
        imageMeta: { width: 1080, height: 2340, size: 310000 },
        visualSignals: { tamperDetected: false, patchDetected: false }
      })
    });
    assert(dupRes.status === 400, 'Duplicate screenshot submission returns HTTP 400 rejection');
    const dupData = await dupRes.json();
    assert(dupData.confidence === 'SUSPICIOUS', 'Duplicate screenshot marked as SUSPICIOUS');
    assert(dupData.message.includes('already submitted'), 'Error message warns of already submitted screenshot');
  }

  // Test 4g: Anti-Replay: Duplicate Transaction / UTR ID (Must be REJECTED)
  {
    const newHash = crypto.createHash('sha256').update('another_screenshot_' + Date.now()).digest('hex');
    const dupTxnRes = await fetch(`${BASE_URL}/api/payment/verify-screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: `Paid to Sulekha Devi\n₹11\nCompleted\nUPI Ref No: ${genuineUtr}\n6207911534@ibl`, // Reusing already claimed UTR
        screenshotHash: newHash,
        imageMeta: { width: 1080, height: 2340, size: 310000 },
        visualSignals: { tamperDetected: false, patchDetected: false }
      })
    });
    assert(dupTxnRes.status === 400, 'Duplicate UTR / Transaction ID returns HTTP 400 rejection');
    const dupTxnData = await dupTxnRes.json();
    assert(dupTxnData.confidence === 'SUSPICIOUS', 'Duplicate UTR marked as SUSPICIOUS');
    assert(dupTxnData.message.includes('already been used'), 'Error message warns of already used transaction ID');
  }

  // Test Suite 6: Persistent Session & Multiple Downloads Support
  console.log('\n--- Test Suite 6: Persistent Session & Multiple Downloads Support ---');
  {
    // First download: record download
    const download1Res = await fetch(`${BASE_URL}/api/payment/consume-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verifiedToken })
    });
    assert(download1Res.status === 200, 'First resume download authorized with HTTP 200 OK');
    const d1Data = await download1Res.json();
    assert(d1Data.authorized === true && d1Data.downloadCount === 1, 'First download recorded (count = 1)');

    // Attempting subsequent downloads with the verified token remains AUTHORIZED (Requirement 9)
    const recheckRes = await fetch(`${BASE_URL}/api/payment/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verifiedToken })
    });
    assert(recheckRes.status === 200, 'Token remains authorized for editing and subsequent downloads');
    const recheckData = await recheckRes.json();
    assert(recheckData.authorized === true, 'Response confirms access remains unlocked across downloads');

    // Second download (e.g. user edits resume or downloads PNG/JPG):
    const download2Res = await fetch(`${BASE_URL}/api/payment/consume-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verifiedToken })
    });
    assert(download2Res.status === 200, 'Second download also authorized without requiring payment re-verification');
    const d2Data = await download2Res.json();
    assert(d2Data.authorized === true && d2Data.downloadCount === 2, 'Second download recorded (count = 2)');

    // Non-existent or forged token must still be strictly rejected
    const badTokenRes = await fetch(`${BASE_URL}/api/payment/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'invalid_forged_token.123' })
    });
    assert(badTokenRes.status === 403, 'Invalid or forged token returns HTTP 403 Forbidden');
  }

  // Summary
  console.log('\n=============================================================');
  console.log(`TEST RESULTS: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('=============================================================\n');
}

runTests();
