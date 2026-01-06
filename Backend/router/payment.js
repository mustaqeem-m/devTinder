// routes/payment.js
const express = require('express');
const paymentRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const {
  createOrder,
  handleWebhook,
} = require('../controllers/paymentController');

// =======================
//  CREATE ORDER
// =======================
paymentRouter.post('/payment/createOrder', userAuth, createOrder);

// =======================
//  WEBHOOK ENDPOINT
// =======================
paymentRouter.post(
  '/payment/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

module.exports = paymentRouter;
