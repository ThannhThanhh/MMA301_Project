const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const httpErrors = require("http-errors");
require("dotenv").config();

const db = require("./models");
const {ProductRouter} = require("./routes");
const app = express(); 


app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
    res.status(200).json({ message: "Welcome to RESTFul API - NodeJS" });
});
//DInh tuyen them cac chuc nang thuc te
app.use("/product", ProductRouter);

app.use(async (req, res, next) => {
    next(httpErrors.BadRequest("Error: Bad Request"));
});

app.use(async (err, req, res, next) => {
    res.status = err.status || 500;
    res.send({
        "error": {
            "status": err.status || 500,
            "message": err.message
        }
    });
})

const HOST = process.env.HOSTNAME;
// const HOST = process.env.HOSTNAME || "localhost";

const PORT = process.env.PORT || 8080;

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    //Thuc thi ket noi CSDL
    db.connectDB();
});
