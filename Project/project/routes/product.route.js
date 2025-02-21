const express = require("express");
const mongoose = require("mongoose")
const db = require("../models");

const productRouter = express.Router();

//listall
productRouter.get("/list", async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.brand) {
            filter.brand = req.query.brand;
        }

        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: "i" }; 
        }

        const products = await db.Products.find(filter);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});
productRouter.get("/brands", async (req, res, next) => {
    try {
        const brands = await db.Products.distinct("brand");
        res.status(200).json(brands);
    } catch (error) {
        next(error);
    }
});
productRouter.get("/details/:id", async (req, res, next) => {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }

    try {
        const product = await db.Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

// Add a new product
productRouter.post("/add", async (req, res, next) => {
    try {
        const { name, quantity, price, description, brand, image } = req.body;

        const newProduct = new db.Products({
            name,
            quantity,
            price,
            description,
            brand,
            image
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: { message: "Internal server error", details: error.message } });
    }
});

// Update an existing product by ID
productRouter.put("/update/:id", async (req, res, next) => {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await db.Products.findByIdAndUpdate(
            productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        next(error);
    }
});

// Delete a product by ID
productRouter.delete("/delete/:id", async (req, res, next) => {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }

    try {
        const deletedProduct = await db.Products.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
});

module.exports = productRouter;