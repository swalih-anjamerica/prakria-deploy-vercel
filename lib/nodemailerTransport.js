import nodemailer from "nodemailer";

const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const user = process.env.MAIL_AUTH_USER;
const password = process.env.MAIL_AUTH_PASSWORD;

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user:user,
        pass: password
    }
})

export default transport;