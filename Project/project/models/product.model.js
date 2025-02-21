const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  quantity:{
    type: Number,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  brand:{
    type: String,
    required: true
  },
  image:{
    type: String
  }
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;