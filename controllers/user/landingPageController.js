import { requestQuoteHtml } from "../../helpers/mailHtmlFiles";
import transport from "../../lib/nodemailerTransport";


export const sendContactUsMsgBoxController = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let htmlFile = requestQuoteHtml(req.body);
            await transport.sendMail({
                from: process.env.SEND_EMAIL_ID,
                to: "info@prakriadirect.com",
                html: htmlFile,
                subject: "Query"
            })
            resolve({ payload: {}, status: 200 });
        } catch (e) {
            reject({ error: e.message });
        }
    })
}