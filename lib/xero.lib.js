import { XeroClient } from "xero-node";
import { XERO_CLIENT_ID, XERO_CLIENT_SECRET } from "../constants/env.constants";

const xero = new XeroClient({
    clientId: XERO_CLIENT_ID,
    clientSecret: XERO_CLIENT_SECRET,
    grantType: "client_credentials"
})

export default xero;