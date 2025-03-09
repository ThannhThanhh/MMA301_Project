// cart.js - Cart API Routes
const express = require("express");
const db = require("../models");
const jwt = require("jsonwebtoken");

const cartRouter = express.Router();
const JWT_SECRET = "ABCD123"; // Secret key

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

// Get cart items for the logged-in user
cartRouter.get("/", authenticateToken, async (req, res) => {
    try {
        const cart = await db.Carts.findOne({ userId: req.user.userId }).populate('products.productId');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add item to cart
cartRouter.post("/", authenticateToken, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user.userId },
            { $addToSet: { products: { productId, quantity } } }, // Add product to cart
            { new: true, upsert: true } // Create new cart if it doesn't exist
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Remove item from cart
cartRouter.delete("/:productId", authenticateToken, async (req, res) => {
    try {
        const cart = await db.Carts.findOneAndUpdate(
            { userId: req.user.userId },
            { $pull: { products: { productId: req.params.productId } } }, // Remove product from cart
            { new: true }
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = cartRouter;
