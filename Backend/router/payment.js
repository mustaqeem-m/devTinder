// routes/payment.js
const express = require('express');
const razorpayInstance = require('../utils/razorPay');
const paymentRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const Payment = require('../model/payment');
const memberShipAmount = require('../utils/constants');
const crypto = require('crypto');
const { User } = require('../model/user');

// =======================
//  CREATE ORDER
// =======================
paymentRouter.post('/payment/createOrder', userAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    const { memberShipType } = req.body;

    const amountValue = memberShipAmount[memberShipType];
    if (
      typeof amountValue !== 'number' ||
      isNaN(amountValue) ||
      amountValue <= 0
    ) {
      return res.status(400).json({ error: 'Invalid memberShipType' });
    }

    const order = await razorpayInstance.orders.create({
      amount: amountValue * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        firstName,
        lastName,
        emailId,
        memberShipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      receipt: order.receipt,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // send keyId to frontend
    const keyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEYID ||
      process.env.RAZORPAY_KEY ||
      process.env.RAZORPAY_KEY_PUBLIC;

    return res.status(201).json({ ...savedPayment.toJSON(), keyId });
  } catch (err) {
    console.error('Create order error:', err);
    if (err.statusCode === 401 || err.status === 401) {
      return res
        .status(401)
        .json({ error: 'Authentication to payment provider failed' });
    }
    return res
      .status(500)
      .json({ error: 'Could not create order', details: err.message });
  }
});

// =======================
//  WEBHOOK ENDPOINT
// =======================
// NOTE: Ensure in app.js you use this BEFORE routes:
// app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
paymentRouter.post(
  '/payment/webhook',
  express.raw({ type: 'application/json', inflate: true, limit: '256kb' }),
  async (req, res) => {
    try {
      // req.body is a Buffer because of express.raw()
      const rawBodyBuffer = req.body;
      if (!rawBodyBuffer || !Buffer.isBuffer(rawBodyBuffer)) {
        console.error('No raw body buffer present');
        return res
          .status(400)
          .json({ status: 'error', message: 'No raw body' });
      }

      // Convert to string only for logging/parsing AFTER signature check
      const rawBodyString = rawBodyBuffer.toString('utf8');

      console.log('Webhook headers:', req.headers);
      const receivedSignature = req.get('x-razorpay-signature');
      if (!receivedSignature) {
        console.error('Missing x-razorpay-signature header');
        return res.status(400).json({
          status: 'error',
          message: 'Missing x-razorpay-signature header',
        });
      }

      // Validate signature format (hex string)
      if (!/^[0-9a-fA-F]+$/.test(receivedSignature)) {
        console.warn('Invalid signature format (not hex)');
        return res.status(400).json({ status: 'invalid signature format' });
      }

      // Compute expected signature (hex)
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBodyBuffer) // IMPORTANT: use Buffer (raw bytes)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'hex');
      const receivedBuf = Buffer.from(receivedSignature, 'hex');

      // Must be same length for timingSafeEqual
      if (
        expectedBuf.length !== receivedBuf.length ||
        !crypto.timingSafeEqual(expectedBuf, receivedBuf)
      ) {
        console.warn('❌ Invalid webhook signature', {
          expected: expectedSignature,
          received: receivedSignature,
        });
        return res.status(400).json({ status: 'invalid signature' });
      }

      console.log('✅ Webhook verified successfully');

      // Parse JSON AFTER verification
      let bodyJson;
      try {
        bodyJson = JSON.parse(rawBodyString);
      } catch (e) {
        console.warn('Invalid JSON payload after signature verification', e);
        return res.status(400).json({ status: 'invalid json' });
      }

      // Extract payment details (Razorpay structure)
      const paymentDetails = bodyJson?.payload?.payment?.entity;
      if (!paymentDetails) {
        console.warn('Webhook missing payment details');
        return res.status(400).json({ status: 'missing payment details' });
      }

      const orderId = paymentDetails.order_id;
      if (!orderId) {
        console.warn('Webhook missing orderId');
        return res.status(400).json({ status: 'missing order id' });
      }

      // DB updates (unchanged from your logic) — example:
      const payment = await Payment.findOne({ orderId });
      if (!payment) {
        console.warn('No payment record for orderId:', orderId);
        // respond 200 to stop Razorpay retries if you intentionally ignore unknown orders
        return res.status(200).json({ status: 'no matching order' });
      }

      if (payment.paymentId !== paymentDetails.id) {
        payment.paymentId = paymentDetails.id;
      }

      if (payment.status !== paymentDetails.status) {
        payment.status = paymentDetails.status;
        payment.rawPayload = bodyJson;
        await payment.save();
      } else {
        console.log('Webhook already processed for order:', orderId);
      }

      if (
        bodyJson.event === 'payment.captured' ||
        paymentDetails.status === 'captured'
      ) {
        const user = await User.findById(payment.userId);
        if (user && !user.isPremium) {
          user.isPremium = true;
          if (paymentDetails.notes?.memberShipType) {
            user.memberShipType = paymentDetails.notes.memberShipType;
          }
          await user.save();
          console.log(`✅ User ${user._id} upgraded to premium`);
        }
      }

      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      console.error('Webhook processing error:', err);
      return res.status(500).json({ status: 'error', message: err.message });
    }
  }
);

module.exports = paymentRouter;
