import mailTransport from "../../lib/nodemailerTransport";

const sendMail = async (params) => {
    const { email, subject, text, html } = params;
    const response = await mailTransport.sendMail({
        to: email,
        from: process.env.SEND_EMAIL_ID,
        subject,
        text,
        html
    })
    return response;
}

const mailUtils = {
    sendMail
}

export default mailUtils;