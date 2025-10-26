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
paymentRouter.post('/payment/webhook', async (req, res) => {
  try {
    console.log('Webhook headers:', req.headers);
    const receivedSignature = req.get('x-razorpay-signature');

    if (!receivedSignature) {
      console.error('Missing x-razorpay-signature header');
      return res.status(400).json({ status: 'error', message: 'Missing x-razorpay-signature header' });
    }

    // Validate signature format
    if (!/^[0-9a-fA-F]+$/.test(receivedSignature)) {
      console.warn('Invalid signature format (not hex)');
      return res.status(400).json({ status: 'invalid signature format' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'hex');
    const receivedBuf = Buffer.from(receivedSignature, 'hex');

    if (
      expectedBuf.length !== receivedBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, receivedBuf)
    ) {
      console.warn('❌ Invalid webhook signature');
      return res.status(400).json({ status: 'invalid signature' });
    }

    console.log('✅ Webhook verified successfully');

    const paymentDetails = req.body?.payload?.payment?.entity;
    if (!paymentDetails) {
      console.warn('Webhook missing payment details');
      return res.status(400).json({ status: 'missing payment details' });
    }

    const orderId = paymentDetails.order_id;
    if (!orderId) {
      console.warn('Webhook missing orderId');
      return res.status(400).json({ status: 'missing order id' });
    }

    // Find payment record
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      console.warn('No payment record for orderId:', orderId);
      // Respond 200 to stop Razorpay retries
      return res.status(200).json({ status: 'no matching order' });
    }

    // Save Razorpay payment id if not already stored
    if (payment.paymentId !== paymentDetails.id) {
      payment.paymentId = paymentDetails.id;
    }

    // Idempotent update of payment status
    if (payment.status !== paymentDetails.status) {
      payment.status = paymentDetails.status;
      payment.rawPayload = req.body;
      await payment.save();
    } else {
      console.log('Webhook already processed for order:', orderId);
    }

    // Mark user as premium ONLY when payment captured
    if (
      req.body.event === 'payment.captured' ||
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
});

module.exports = paymentRouter;
