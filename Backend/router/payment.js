// routes/payment.js
const express = require('express');
const razorpayInstance = require('../utils/razorPay');
const paymentRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const Payment = require('../model/payment');
const memberShipAmount = require('../utils/constants');
// removed importing frontend BASE_URL — use server route paths only
const crypto = require('crypto');
const { User } = require('../model/user');

paymentRouter.post('/payment/createOrder', userAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    const { memberShipType } = req.body;

    const amountValue = memberShipAmount[memberShipType];
    // if (!amountValue || typeof amountValue !== 'number') {
    //   return res.status(400).json({ error: 'Invalid memberShipType' });
    // }

    const order = await razorpayInstance.orders.create({
      amount: amountValue * 100,
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

    // when responding after saving order
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

// webhook route — use server path (public URL must point here)
paymentRouter.post('/payment/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret)
      return res.status(500).json({ error: 'Webhook secret not configured' });

    // req.rawBody must be set by express.json verify middleware:
    // app.use(express.json({ verify: (req,res,buf) => { req.rawBody = buf; } }));
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const receivedSignature = req.get('x-razorpay-signature');

    if (!receivedSignature) {
      return res.status(400).json({ status: 'missing signature' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'hex');
    let receivedBuf;
    try {
      receivedBuf = Buffer.from(receivedSignature, 'hex');
    } catch (e) {
      receivedBuf = Buffer.from(receivedSignature);
    }

    if (
      expectedBuf.length !== receivedBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, receivedBuf)
    ) {
      console.log('❌ Invalid webhook signature');
      return res.status(400).json({ status: 'invalid signature' });
    }

    console.log('✅ Webhook verified successfully');

    const paymentDetails = req.body?.payload?.payment?.entity;
    if (!paymentDetails)
      return res.status(400).json({ status: 'missing payment details' });

    const orderId = paymentDetails.order_id;
    if (!orderId) return res.status(400).json({ status: 'missing order id' });

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      console.warn('No payment record for orderId:', orderId);
      // respond 200 to avoid retries if you don't want to create a record here
      return res.status(200).json({ status: 'no matching order' });
    }

    // idempotent update
    if (payment.status !== paymentDetails.status) {
      payment.status = paymentDetails.status;
      payment.rawPayload = req.body;
      await payment.save();
    } else {
      console.log('Webhook already processed for order:', orderId);
    }

    if (
      req.body.event === 'payment.captured' ||
      paymentDetails.status === 'captured'
    ) {
      const user = await User.findById(payment.userId);
      if (user) {
        user.isPremium = true;
        if (paymentDetails.notes && paymentDetails.notes.memberShipType) {
          user.memberShipType = paymentDetails.notes.memberShipType;
        }
        await user.save();
      } else {
        console.warn('User not found for id', payment.userId);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = paymentRouter;
