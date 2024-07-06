const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.signup = async (req, res) => {
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const { name, gender, contact, email, password, referring_code } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Validate the referring_code
        let referredByUser = null;
        if (referring_code) {
            const referringUser = await prisma.user.findUnique({
                where: { referral_code: referring_code },
            });
            if (!referringUser) {
                return res.status(400).json({ message: 'Invalid referral code.'});
            }
            referredByUser = referringUser;
        }

        // Create the new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const uniqueCode = `RFRL-${Date.now()}-${Math.floor(Math.random() * 100)}`;

        let userData = {
            name,
            gender,
            contact,
            email,
            password: hashedPassword,
            referral_code: uniqueCode,
            referredById: referredByUser ? referredByUser.id : null,
        };

        const user = await prisma.user.create({
            data: userData,
        });

        // Update the referrer's total referrals if applicable
        if (referredByUser) {
            await prisma.user.update({
                where: { id: referredByUser.id },
                data: { 
                    total_referral: { increment: 1 },
                    total_earning: { increment: 100 },
                    balance: { increment: 100 },
                 },
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(201).json({ status: 'success', message: "User created successfully", user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid Email/password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ status: 'success',message: "User login successfully", user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}