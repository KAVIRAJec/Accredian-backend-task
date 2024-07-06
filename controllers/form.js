const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendSuccessEmail } = require('./email');

exports.form = async (req, res) => {
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const { name, gender, contact, email, referral_code } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Validate the referring_code
        let referredByUser;
        const referringUser = await prisma.user.findUnique({
            where: { referral_code: referral_code },
        });
        if (!referringUser) {
            return res.status(400).json({ message: 'Invalid referral code.' });
        }
        referredByUser = referringUser;

        // Create the new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.REFERRAL_PASSWORD, salt);
        const uniqueCode = `RFRL-${Date.now()}-${Math.floor(Math.random() * 100)}`;

        let userData = {
            name,
            gender,
            contact,
            email,
            referral_code: uniqueCode,
            password: hashedPassword,
            referredById: referredByUser.id,
        };

        const user = await prisma.user.create({
            data: userData,
        });

        // Update the referrer's total referrals
        await prisma.user.update({
            where: { id: referredByUser.id },
            data: {
                total_referral: { increment: 1 },
                total_earning: { increment: 100 },
                balance: { increment: 100 },
            },
        });
        console.log("before email");
        await sendSuccessEmail(email);
        console.log("after email");

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(201).json({
            status: 'success',
            message: "User referred successfully",
            user, token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
