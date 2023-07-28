require('dotenv').config()
const nodemailer = require('nodemailer')


const mailService = {
    async sendEmail ({emailForm, emailTo, emailSubject, emailText}){
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });
        await transporter.sendMail({
            from: emailForm, 
            to: emailTo, 
            subject: emailSubject, 
            text: emailText,
        });
    }
}

Object.freeze(mailService)

module.exports = {
    mailService
}