const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true, default: "COD" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Shipped", "Delivered"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
