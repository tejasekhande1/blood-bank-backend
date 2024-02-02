const express = require("express");
const app = express()
require('dotenv').config();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server Starts"
    })
})

app.listen(PORT, () => {
    console.log("Server Listening at ", PORT);
});