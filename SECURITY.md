# Security & Privacy

The Resume Builder is a **fully client-side** application. Resume data stays in the browser (`localStorage` and the live preview). PDF download is generated locally with html2pdf.js — there is no login, password, payment, OTP, or download authorization server.

## What this means

- **No download gate**: clicking **Download Resume** exports the current preview immediately (subject only to having entered resume content and the existing one-page layout check).
- **No secrets in the client** for payment or admin unlock — those systems have been removed.
- **XSS sanitization**: preview rendering continues to escape user-supplied text before inserting it into the DOM.
- **No resume upload to a backend** for building or downloading. The ATS checker can parse files in the browser with PDF.js and Mammoth.js.

If you previously ran the payment verification server, it is no longer used. You can delete any leftover `server/.env` file on your machine.
