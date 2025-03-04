const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const userRouter = express.Router();
const JWT_SECRET = "ABCD123"; 

// Login route
userRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log('Received login request:', { username, password }); 
    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password" });
    }

    try {
      
        const user = await db.Users.findOne({ username });
        console.log('Found user:', user); 

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid); 

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1h", 
        });

        res.json({ message: "Login successful", token, userId: user._id, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.post("/register", async (req, res) => {
    const { username, password, fullName, email, phone, address, role } = req.body;

    if (!username || !password || !fullName || !email || !phone || !address) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const userRole = role === "admin" ? "admin" : "customer";

    try {
        const existingUser = await db.Users.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new db.Users({
            username,
            password: hashedPassword,
            fullName,
            email,
            phone,
            address,
            role: userRole, 
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Change Password route
userRouter.post("/change-password", async (req, res) => {
    const { username, oldPassword, newPassword, confirmPassword } = req.body;

    console.log("Received data:", { username, oldPassword, newPassword, confirmPassword });

    if (!username || !oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    try {
        const user = await db.Users.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isOldPasswordValid) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSameAsOld) {
            return res.status(400).json({ message: "New password must be different from the old password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Forgot Password Route

userRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await db.Users.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; 
    await user.save();
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    const resetLink = `http://192.168.1.16:9999/user/reset-password/${token}`;
    await transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
    });

    res.json({ message: 'Password reset link sent to your email' });
});
userRouter.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    const user = await db.Users.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.password = newPassword; 
    user.resetToken = undefined; 
    user.resetTokenExpiration = undefined; 
    await user.save();

    res.json({ message: 'Password reset successfully' });
});

module.exports = userRouter;
