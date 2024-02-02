const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, 
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_FROM || "StudyNotion",
            to: email,
            subject: title,
            html: body,
        };

        const emailInfo = await transporter.sendMail(mailOptions);
        console.log("Email sent:", emailInfo.response);
        return emailInfo;
    } catch (e) {
        console.error("Error Occurred while sending email:", e);
        throw e;
    }
};


module.exports = mailSender;