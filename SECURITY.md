# Security Architecture & Hardening Guide

## 1. Security Philosophy & Threat Model

The **Resume Builder & Independent ATS Checker** operates on the principle of **Zero Client Trust**:
- **Browser as Untrusted**: All client-side JavaScript, HTML, DOM state, and localStorage are considered untrusted and user-controllable.
- **Server as Single Source of Truth**: All authentication, payment authorizations, download access grants, and cryptographic operations are strictly enforced server-side.
- **Zero Secrets in Frontend**: No API secrets, admin passwords, HMAC secrets, or database credentials ever reach client-side bundles, HTML, or public repositories.
- **Fail-Closed Verification**: The manual screenshot verification engine requires all 7 validation signals to pass with `HIGH_CONFIDENCE`. Any mismatch, low resolution, or anomaly strictly locks access.

---

## 2. Secrets Management & Environment Isolation

### Server Environment Variables (`server/.env`)
All sensitive credentials reside strictly in the server environment. The `.env` file is excluded from Git via `.gitignore`.

| Variable | Scope | Purpose |
|---|---|---|
| `PORT` | Backend | HTTP listening port (Default: `3001`) |
| `NODE_ENV` | Backend | Environment flag (`production` / `development`) |
| `FRONTEND_ORIGIN` | Backend | Allowed CORS origin (e.g., `https://yourdomain.com` or `http://localhost:5500`) |
| `EXPECTED_PAYEE_NAME` | Backend | Expected recipient payee name (`SULEKHA DEVI`) |
| `EXPECTED_UPI_ID` | Backend | Expected recipient UPI ID (`6207911534@ibl`) |
| `EXPECTED_AMOUNT_RUPEES`| Backend | Fixed payment amount (`11.00`) |
| `TOKEN_SECRET` | Backend ONLY | Cryptographic HMAC secret for generating & validating session download tokens |
| `ADMIN_DOWNLOAD_PASSWORD` | Backend ONLY | Server-side password for direct administrative unlock |

> [!CAUTION]
> **Never commit `.env` or production secrets to Git.** Only commit `.env.example` containing placeholder variable names.

---

## 3. Manual Payment & Multi-Layer Screenshot Verification Architecture

```
[Browser Client]
   │ 1. User views ₹11 QR Code (SULEKHA DEVI - 6207911534@ibl)
   │ 2. User pays ₹11 via any UPI App (GPay, PhonePe, Paytm, etc.)
   │ 3. User uploads payment receipt screenshot (PNG/JPG/WEBP)
   ▼
[Client-Side Pre-Processing]
   │ 4. Extract visual metadata (width, height, file size, SHA-256 hash)
   │ 5. Perform edge/patch/color anomaly detection
   │ 6. OCR text parsing with Tesseract.js engine
   ▼
[Express Backend - POST /api/payment/verify-screenshot]
   │ 7. 7-Layer Multi-Signal Verification:
   │    - Layer 1: Image Structure & Resolution Integrity (min 150x150, max 10MB)
   │    - Layer 2: Anti-Replay Duplicate Hash Detection (Set cache)
   │    - Layer 3: Anti-Tampering & Patch Inconsistency Analysis
   │    - Layer 4: Exact ₹11.00 Amount Match (Rejects ₹1, ₹10, ₹12, etc.)
   │    - Layer 5: Payee & UPI ID Match (SULEKHA DEVI / 6207911534@ibl)
   │    - Layer 6: Payment Success State Confirmation (Success / Completed / Paid)
   │    - Layer 7: UTR / Transaction ID Extraction & Anti-Replay Cache Check
   │ 8. Strict Confidence Gate: ONLY HIGH_CONFIDENCE issues signed HMAC downloadToken (TTL: 2h)
   ▼
[Browser Client]
   │ 9. POST /api/payment/validate-token { token: downloadToken }
   ▼
[Express Backend Gatekeeper] ──► [Resume PDF Export Authorized]
```

### Key Security Safeguards:
1. **Strict ₹11 Enforcement**: Payment amounts other than ₹11 (e.g. ₹1) are immediately rejected with descriptive feedback.
2. **Anti-Tampering & Typography Check**: Visual patch analysis detects edited amounts or overlaid text blocks.
3. **Double Anti-Replay Protection**: Both image SHA-256 hashes and 12-digit UTR/transaction reference numbers are cached to prevent proof recycling.
4. **Fail-Closed Security**: Any timeout (hard 18s client timeout), low OCR clarity, or suspicious signal defaults to locked state.
5. **Download Gatekeeper**: Direct calls to resume export require a valid cryptographically signed `downloadToken`. LocalStorage manipulation cannot bypass this server check.

---

## 4. Authentication & Password Security

- **Server-Side Verification**: Option A (Password Unlock) sends the password to `POST /api/auth/unlock-password`. No plaintext passwords exist in client-side code.
- **Timing-Safe Evaluation**: Passwords are compared using SHA-256 hashed constant-time equality (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.
- **Brute-Force Protection**: Strict rate limiting (`authLimiter`) restricts authentication attempts to 10 requests per 15 minutes per IP.

---

## 5. Defense-in-Depth & Application Hardening

### A. HTTP Security Headers (Helmet)
- `Content-Security-Policy`: Restricts script execution to approved CDNs (cdnjs, jsdelivr).
- `X-Frame-Options: SAMEORIGIN` & `frame-ancestors`: Prevents clickjacking attacks.
- `X-Content-Type-Options: nosniff`: Mitigates MIME-type sniffing vulnerabilities.
- `Strict-Transport-Security (HSTS)`: Enforces HTTPS in production.
- `Referrer-Policy: strict-origin-when-cross-origin`: Minimizes referrer leakage.

### B. Cross-Site Scripting (XSS) Prevention
- All user-supplied resume text, contact fields, and ATS analysis outputs are escaped via `escapeText()` before DOM rendering.

### C. Rate Limiting
- `POST /api/auth/unlock-password`: 10 requests / 15 minutes.
- `POST /api/payment/verify-screenshot`: 15 requests / 15 minutes.
- `POST /api/payment/validate-token`: 120 requests / minute.

### D. Safe Error Handling & Logging
- In production, unhandled exceptions return sanitized messages without leaking stack traces, filesystem paths, or environment variables.
- The `safeLog()` utility redacts sensitive keywords (`password`, `secret`, `token`, `key`) from all log outputs.

---

## 6. Secret Rotation Procedure

1. **Download Token Secret (`TOKEN_SECRET`)**:
   - Generate a new 256-bit cryptographically secure secret:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Update `TOKEN_SECRET` in your server environment. Active sessions will naturally re-authenticate upon expiry.

2. **Admin Unlock Password**:
   - Update `ADMIN_DOWNLOAD_PASSWORD` in your server `.env` and restart the server.

---

## 7. Incident Response Protocol

1. **Audit Server Logs**: Review timestamped access logs for suspicious IP patterns, brute-force anomalies, or tampered screenshot hashes.
2. **Invalidate Session Tokens**: Rotate `TOKEN_SECRET` to immediately invalidate all existing download tokens.
3. **Deploy Hotfix**: Run automated verification tests (`node test-verification.js`) to verify zero exposed vulnerabilities and 100% test pass rate.
