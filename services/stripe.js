import API from "./api"

export const createSubscription = async (params) => {
    return API.post("/client/stripe/subscribe", params).then(response => response);
}

export const createPaymentIntent = async (email, amount, stripe_id, name, postal_code, address, city, state, country) => {
    const body = {
        id: stripe_id,
        email,
        amount,
        name,
        postal_code,
        address,
        city,
        state,
        country
    }

    return API.post("/client/stripe/payment-intent", body).then(response => response);
}


export const updateSubscriptionService = async (price_id, plan_id, plan_duration) => {
    return API.post('/client/stripe/update-subscription', { price_id, plan_id, plan_duration })
}

export const addNewSubscriptionStripeSecret = async (stripe_price_id, params) => {
    return API.post("/client/stripe/new-subscription-secret", { stripe_price_id, ...params });
}

export const createNormalPaymentIntentService = async (amount, currency, stripe_customer_id, description, stripe_card_id) => {
    return API.post("/client/stripe/normal-intent", { amount, currency, stripe_customer_id, description, stripe_card_id })
}

export const listSavedCardsService = async () => {
    return API.get("/client/stripe/list-saved-cards");
}

export const addNewCreditCardService = async (cardNumber, exp_month, exp_year, cvc) => {
    return API.post("/client/stripe/add-new-card", {
        cardNumber, exp_month, exp_year, cvc
    })
}

export const deleteCardService = async (customer_id, card_id) => {
    const body = { customer_id, card_id };
    return API.post("/client/stripe/delete-card", body);
}


export const stripeRemoveAccountService = async (params) => {
    return API.post("/client/stripe/remove-account-on-error", params);
}

export const stripeGetLatestInvoiceService = async () => {
    return API.get("/client/stripe/retrive-latest-invoice");
}