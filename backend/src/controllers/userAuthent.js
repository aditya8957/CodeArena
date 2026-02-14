const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true on HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const register = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);

        const token = jwt.sign(
            { _id: user._id, emailId, role: 'user' },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);

        res.status(201).json({
            user: { firstName: user.firstName, emailId, _id: user._id, role: 'user' },
            message: "Registered Successfully"
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) throw new Error("Invalid Credentials");

        const user = await User.findOne({ emailId });
        if (!user) throw new Error("Invalid Credentials");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid Credentials");

        const token = jwt.sign(
            { _id: user._id, emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);

        res.status(200).json({
            user: { firstName: user.firstName, emailId, _id: user._id, role: user.role },
            message: "Logged in Successfully"
        });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (token) {
            const payload = jwt.decode(token);
            await redisClient.set(`token:${token}`, 'Blocked');
            await redisClient.expireAt(`token:${token}`, payload.exp);
        }
        res.clearCookie('token', COOKIE_OPTIONS);
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (err) {
        res.status(503).json({ message: err.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;
        if (!tokenId) return res.status(400).json({ message: "Google token is required" });

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture } = payload;

        let user = await User.findOne({ emailId: email });

        if (!user) {
            user = await User.create({
                firstName: name,
                emailId: email,
                password: await bcrypt.hash(googleId + process.env.JWT_KEY, 10),
                googleId,
                isGoogleAuth: true,
                profilePic: picture,
                role: "user"
            });
        } else if (!user.googleId) {
            user.googleId = googleId;
            user.isGoogleAuth = true;
            if (picture) user.profilePic = picture;
            await user.save();
        }

        const token = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);

        res.status(200).json({
            user: { firstName: user.firstName, emailId: user.emailId, _id: user._id, role: user.role, profilePic: user.profilePic },
            message: "Google Login Successful"
        });
    } catch (err) {
        res.status(500).json({ message: "Google Login Failed", error: err.message });
    }
};

module.exports = { register, login, logout, googleLogin };
