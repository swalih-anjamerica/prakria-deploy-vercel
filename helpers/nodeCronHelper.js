const cron = require("node-cron");
const axios = require("axios").default;
const notificationUrl = process.env.NOTIFICATION_URL || "http://localhost:3000";

function main() {
  
    // client incomplete company details notification && prakria complete account notification
    cron.schedule('20 8 * * *', async () => {
        try {
            await axios.post(notificationUrl + "/api/users/notifications/notify-incomplete-company-client");
            await axios.post(notificationUrl + "/api/users/notifications/prakria-incomplete-account");
        } catch (e) {
            // console.log(e.message);
        }
    });

    // need any assistance notification
    cron.schedule("5 10 * * *", async () => {
        try {
            await axios.post(notificationUrl + "/api/users/notifications/notify-assistant");
        } catch (e) {
            // console.log(e.message);
        }
    })

    // expire notification run at every 6 hours
    cron.schedule("0 */6 * * *", async () => {
        try {
            await axios.post(notificationUrl + "/api/users/notifications//plan-expiry-ntfn");
        } catch (e) {
            // console.log(e.message);
        }
    })

}

module.exports = main;