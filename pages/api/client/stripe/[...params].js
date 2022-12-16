import { addNewCreditCardController, addNewSubscriptionController, cancellStripeSubscription, createNormalPaymentIntentController, createStripeSubscription, deleteCreditCardController, listPaymentSUController, listSavedCardsController, stripeCheckApiController, stripeGetSubscriptionLatestInvoiceController, stripeRemoveAccountErrorController, upgradeSubscriptionController } from "../../../../controllers/client/stripeController";

export default async function handler(req, res) {
    try {
        const params = req.query.params[0];
        const method = req.method;

        if (params === "add-new-card" && method == "POST") {
            const { error, payload, status } = await addNewCreditCardController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "cancel-subscription" && method === "PUT") {
            const { error, payload, status } = await cancellStripeSubscription(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "delete-card" && method === "POST") {
            const { error, payload, status } = await deleteCreditCardController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "list-saved-cards" && method === "GET") {
            const { error, payload, status } = await listSavedCardsController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "new-subscription-secret" && method === "POST") {
            const { error, payload, status } = await addNewSubscriptionController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "normal-intent" && method === "POST") {
            const { error, payload, status } = await createNormalPaymentIntentController(req, res);
            res.status(status).json(error || payload);
        }
      
        else if (params === "subscribe" && method === "POST") {
            const { error, payload, status } = await createStripeSubscription(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "update-subscription" && method === "POST") {
            const { error, payload, status } = await upgradeSubscriptionController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "remove-account-on-error" && method === "POST") {
            const { error, payload, status } = await stripeRemoveAccountErrorController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "retrive-latest-invoice" && method === "GET") {
            const { error, payload, status } = await stripeGetSubscriptionLatestInvoiceController(req, res);
            res.status(status).json(error || payload);
        }
        else if (params === "check-stripe-demo") {
            const { error, payload, status } = await stripeCheckApiController(req, res);
            res.status(status).json(error || payload);
        }
    } catch (e) {
        res.status(500).json({ error: e.error || e.message });
    }
}