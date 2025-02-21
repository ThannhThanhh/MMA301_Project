const mongoose = require("mongoose"); 

const Product = require("./product.model");
//khoi tao doi tuong CSDL
const db = {};

//Bo sung cac Entity object vao DB
db.Products = Product;
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