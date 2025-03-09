const mongoose = require("mongoose"); 

const Product = require("./product.model");
const Cart = require("./cart.model");
const Role = require("./role.model");
const User = require("./user.model");
//khoi tao doi tuong CSDL
const db = {};

//Bo sung cac Entity object vao DB
db.Products = Product;
db.Carts = Cart;
db.Roles = Role;
db.Users = User;
//Hanh vi thuc hien ket noi toi CSDL
db.connectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI) 
       .then(() => console.log("Connect to MongoDB successfully"));
    } catch (error) {
        next(error);
        process.exit();
    }
}
module.exports = db;