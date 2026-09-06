# Production Payment Gateway & WhatsApp Notification Architecture

This guide details the complete production architecture for integrating automated payment verification (Razorpay / UPI Gateway) and real-time WhatsApp payment notifications for the **Resume Builder & ATS Resume Checker**.

---

## 1. Production Architecture Overview

In a production environment, client-side OCR and screenshot uploads are used strictly as supporting evidence. Automated payment authorization and unlock are driven by **cryptographic server-side webhook verification**.

```
   [User Browser]
         │
         │ 1. Clicks "Pay ₹11 & Download"
         ▼
   [Node.js Backend] ── 2. Create Order (₹11) ──► [Razorpay / UPI Gateway]
         │                                                │
         │ 3. Returns order_id                            │
         ▼                                                │
   [Razorpay Checkout / UPI Intent]                       │ 4. User completes
         │                                                │    ₹11 payment
         ▼                                                │
   [Razorpay Gateway] ─── 5. Server Webhook (HMAC-SHA256) ─┴────────┐
                                                                    ▼
                                                            [Node.js Backend]
                                                                    │
                                         6. Verify Signature & Check Duplicate
                                                                    │
                                         7. Store Transaction in DB/Redis
                                                                    │
                                         8. Send WhatsApp Message (Meta / Twilio API)
                                                                    │
                                         9. Emit SSE / WebSocket "VERIFIED" to Client
                                                                    ▼
                                                            [Browser Downloads Resume]
```

---

## 2. Server Implementation (Node.js / Express)

Create a secure backend service (e.g. `server/index.js`):

```javascript
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const axios = require('axios');
const { Pool } = require('pg'); // or Redis

const app = express();
app.use(express.json());

// Database connection for duplicate transaction tracking
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =========================================================================
// 1. Order Creation Endpoint
// =========================================================================
app.post('/api/create-order', async (req, res) => {
  try {
    const options = {
      amount: 1100, // ₹11 in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { service: 'Resume Download' }
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment order' });
  }
});

// =========================================================================
// 2. Razorpay Webhook Verification & WhatsApp Trigger
// =========================================================================
app.post('/api/payment-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSignature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Cryptographic HMAC-SHA256 signature verification
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(req.body)
    .digest('hex');

  if (expectedSignature !== webhookSignature) {
    console.error('Unauthorized webhook signature mismatch');
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const paymentId = payment.id;
    const orderId = payment.order_id;
    const amount = (payment.amount / 100).toFixed(2); // Convert to ₹
    const utr = payment.acquirer_data?.rrn || payment.acquirer_data?.upi_transaction_id || paymentId;

    // Check duplicate payment ID / UTR in Database
    const existing = await pool.query('SELECT id FROM transactions WHERE transaction_id = $1', [utr]);
    if (existing.rows.length > 0) {
      console.warn(`Duplicate transaction attempt detected: ${utr}`);
      return res.status(200).json({ status: 'ALREADY_PROCESSED' });
    }

    // Record verified transaction in database
    await pool.query(
      'INSERT INTO transactions (transaction_id, order_id, amount, status, service, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [utr, orderId, amount, 'VERIFIED', 'Resume Download']
    );

    // Trigger WhatsApp Notification
    await sendWhatsAppNotification({
      amount: `₹${amount}`,
      transactionId: utr,
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      service: 'Resume Download'
    });
  }

  res.status(200).json({ status: 'OK' });
});

// =========================================================================
// 3. Automated WhatsApp Dispatch via Meta WhatsApp Business Cloud API
// =========================================================================
async function sendWhatsAppNotification({ amount, transactionId, dateTime, service }) {
  const recipientNumber = process.env.OWNER_WHATSAPP_NUMBER; // Configured in .env
  const whatsappApiUrl = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const messageBody = 
    `💰 *New Resume Download Payment*\n\n` +
    `Payment Status: Successful\n` +
    `Amount: ${amount}\n` +
    `Transaction ID: ${transactionId}\n` +
    `Date & Time: ${dateTime}\n` +
    `Service: ${service}\n\n` +
    `Please verify the transaction in the payment dashboard.`;

  try {
    const response = await axios.post(
      whatsappApiUrl,
      {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        type: 'text',
        text: { body: messageBody }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('WhatsApp notification dispatched successfully:', response.data);
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error.response ? error.response.data : error.message);
  }
}

app.listen(process.env.PORT || 3000, () => {
  console.log(`Payment & notification service running on port ${process.env.PORT || 3000}`);
});
```

---

## 3. Environment Configuration (`.env`)

**NEVER** commit `.env` to GitHub or expose credentials in client-side code:

```ini
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_db

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# WhatsApp Cloud API Configuration
WHATSAPP_PHONE_NUMBER_ID=109283746501928
WHATSAPP_ACCESS_TOKEN=EAAG...long_lived_system_user_token
OWNER_WHATSAPP_NUMBER=919876543210
```

---

## 4. Database Schema (PostgreSQL)

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  order_id VARCHAR(100) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  service VARCHAR(100) NOT NULL,
  downloads_remaining INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_txnid ON transactions(transaction_id);
```

---

## 5. Security Checklist

1. **Client Isolation**: Client-side code (`script.js`) never contains API secrets, WhatsApp tokens, or database credentials.
2. **Signature Verification**: Every incoming payment notification is validated using HMAC-SHA256.
3. **Replay & Duplicate Protection**: Every UTR / transaction ID is recorded with a unique constraint in PostgreSQL/Redis. Repeated submissions are rejected.
4. **Screenshot Data Privacy**: Screenshot binary data is analyzed strictly in browser RAM via canvas/Blob URLs and never persisted in `localStorage` or exposed to public buckets.
