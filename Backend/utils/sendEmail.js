// utils/sendEmail.js
const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { sesClient } = require('./sesClient');

const DEFAULT_FROM = 'no-reply@devstinder.online'; // must be a verified domain/email
const EMAIL_RE = /^\S+@\S+\.\S+$/;

const createSendEmailCommand = ({
  toAddress,
  fromAddress,
  subject,
  html,
  text,
}) => {
  return new SendEmailCommand({
    Destination: { ToAddresses: [toAddress] },
    Message: {
      Body: {
        Html: { Charset: 'UTF-8', Data: html || '' },
        Text: { Charset: 'UTF-8', Data: text || '' },
      },
      Subject: { Charset: 'UTF-8', Data: subject || '(no subject)' },
    },
    Source: fromAddress,
  });
};

/**
 * sendEmail.run({ to, subject, html, text, from })
 * - to: required recipient email
 * - subject: required
 * - html/text: optional content
 * - from: optional (must be verified or domain must be verified)
 */
const run = async ({ to, subject, html, text, from } = {}) => {
  if (!to || typeof to !== 'string' || !EMAIL_RE.test(to)) {
    throw new Error('Invalid recipient email (to).');
  }
  if (!subject || typeof subject !== 'string') {
    throw new Error('Invalid subject.');
  }

  const source =
    typeof from === 'string' && from.includes('@') ? from : DEFAULT_FROM;

  const sendEmailCommand = createSendEmailCommand({
    toAddress: to,
    fromAddress: source,
    subject,
    html,
    text,
  });

  try {
    const res = await sesClient.send(sendEmailCommand);
    // return a small, safe payload (don't return internals or credentials)
    return { messageId: res.MessageId, metadata: res.$metadata };
  } catch (err) {
    // Surface MessageRejected reason if present
    if (err && err.Code === 'MessageRejected') {
      throw new Error(
        `SES MessageRejected: ${err.Message || JSON.stringify(err)}`
      );
    }
    throw err;
  }
};

module.exports = { run };
