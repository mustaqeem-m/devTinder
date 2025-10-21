// utils/razorPay.js
const Razorpay = require('razorpay');

const KEY_ID = (
  process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_KEYID ||
  ''
).trim();
const KEY_SECRET = (
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_SECRET ||
  ''
).trim();

if (!KEY_ID || !KEY_SECRET) {
  console.warn(
    'Using dummy Razorpay keys for local dev. Set RAZORPAY_KEY_ID/SECRET in .env for real tests.'
  );
}

module.exports = new Razorpay({
  key_id: KEY_ID || 'rzp_test_dummy',
  key_secret: KEY_SECRET || 'dummy_secret',
});
