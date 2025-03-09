const express = require("express");
const Order = require("../models/order.model");

const router = express.Router();

// 1. Tạo đơn hàng (Create Order)
router.post("/", async (req, res) => {
  try {
    const { customerName, address, phone, paymentMethod, items, totalAmount } = req.body;

    if (!customerName || !address || !phone || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      customerName,
      address,
      phone,
      paymentMethod,
      items,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 2. Lấy danh sách tất cả đơn hàng (Get all Orders)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 3. Lấy chi tiết một đơn hàng (Get Order by ID)
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 4. Cập nhật trạng thái đơn hàng (Update Order Status)
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Confirmed", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 5. Xóa đơn hàng (Delete Order)
router.delete("/:orderId", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
