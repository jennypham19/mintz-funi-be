require('dotenv').config();
const nodemailer = require('nodemailer');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
        tls: {
        rejectUnauthorized: false // Bỏ kiểm tra CA, tạm dùng cho dev
    }
})
/**
 * Gửi email theo chuẩn
 * @param {Object} options
 * @param {string} options.to - Email người nhận
 * @param {string} options.subject - Tiêu đề email
 * @param {string} options.text - Plain text
 * @param {string} options.html - Nội dung HTML
 */

const sendMail = async({ to, subject, text, html}) => {
    console.log('Using Gmail:', process.env.EMAIL_USER, process.env.EMAIL_PASS);
    const mailOptions = {
        from: `"Mintz Admin" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    };
    
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: ' + info.response);
        return info;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error sending email: " + error.message);
    }
}
module.exports = { sendMail }