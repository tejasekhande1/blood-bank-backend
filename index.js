const express = require("express");
const app = express()
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const userRoutes = require('./routes/Auth')

app.use(express.json());

app.get("/", async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server Starts"
    })
})

const { dbConnect } = require("./config/database");
dbConnect();

app.use("/api/v1/auth", userRoutes);

app.listen(PORT, () => {
    console.log("Server Listening at ", PORT);
});