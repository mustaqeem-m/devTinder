const corn = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const sendEmail = require('./sendEmail');
const ConnectionRequestModel = require('../model/request');

corn.schedule('43 * * 12 *', async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingReq = await ConnectionRequestModel.find({
      status: 'interested',
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate('fromUserId toUserId');

    const listOfEmails = [
      ...new Set(pendingReq.map((req) => req.toUserId.emailId)),
    ];

    for (const email of listOfEmails) {
      try {
        const subject = 'Pending Connections';
        const html = `<p>You have pending connection requests on Devstinder.</p>`;
        const text = `You have pending connection requests on Devstinder.`;
        const res = await sendEmail.run({
          to: 'mmmustaqeem1910@gmail.com',
          subject,
          html,
          text,
        });
        console.info('Email sent to', email, 'MessageId', res.messageId);
      } catch (err) {
        console.log('Failed to send email to', email, '->', err.message || err);
      }
    }
  } catch (err) {
    console.log({ Error: err });
  }
});
