const sendSuccessEmail = async (email) => {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.APP_PASSWORD,
        },
        connectionTimeout: 10000
    });

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: 'Accredian referral Successful',
        text: `Your referral operation was successful. You have earned 100 points.
        You can login using your email id and password: ${process.env.REFERRAL_PASSWORD}`,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Success Email Sent', result);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendSuccessEmail };