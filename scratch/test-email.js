const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

console.log('Testing SMTP connection with:');
console.log('Host:', process.env.SMTP_HOST);
console.log('User:', process.env.SMTP_USER);
console.log('Port:', process.env.SMTP_PORT);

async function test() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection successful!');
    
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Test Email from Script",
      text: "This is a test email to verify SMTP settings.",
    });
    console.log('✅ Email sent successfully!', info.messageId);
  } catch (err) {
    console.error('❌ Error occurred:', err.message);
    if (err.code === 'EAUTH') {
      console.log('Tip: Check your App Password. Make sure 2FA is on and you didn\'t use the normal password.');
    }
  }
}

test();
