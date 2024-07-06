const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'kaviraj.ec21@bitsathy.ac.in',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000
});

const sendSuccessEmail = async (email) => {
    const mailOptions = {
        from: 'kjio6254@gmail.com', 
        to: email, 
        subject: 'Accredian referral Successful', 
        text: `Your referral operation was successful. You have earned 100 points.
        You can login using your email id and password: ${process.env.REFERRAL_PASSWORD}`, 
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Success Email Sent', result);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendSuccessEmail };