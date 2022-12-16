import stripe from "../../lib/stripe";

const createProduct = async (params) => {
    const { title } = params;
    const stripeProduct = await stripe.products.create({
        name: title
    })
    return stripeProduct;
}

const createPrice = async (params) => {
    const { unit_amount, product_id, tax_behavior, interval } = params;
    const stripePrice = await stripe.prices.create({
        unit_amount: unit_amount,
        currency: 'GBP',
        recurring: interval,
        product: product_id,
        tax_behavior: tax_behavior || "exclusive"
    })
    return stripePrice;
}

const createPricesWithPlanDuration = async (duration, stripeProduct) => {
    const durationData = [];

    for (let i = 0; i < duration.length; i++) {

        let stripePrice;

        if (duration[i].duration_name === "weekly") {
            stripePrice = { id: null }
        } else if (duration[i].duration_name === "monthly") {
            let params = {
                unit_amount: parseInt(duration[i].amount) * 100,
                product_id: stripeProduct.id,
                interval: { interval: 'month' }
            }
            stripePrice = await createPrice(params);
        } else if (duration[i].duration_name === "quarterly") {
            let params = {
                unit_amount: (parseInt(duration[i].amount) * 3) * 100,
                product_id: stripeProduct.id,
                interval: {
                    interval: 'month',
                    interval_count: 3
                }
            }
            stripePrice = await createPrice(params);
        } else if (duration[i].duration_name === "yearly") {
            let params = {
                unit_amount: (parseInt(duration[i].amount) * 12) * 100,
                product_id: stripeProduct.id,
                interval: { interval: 'year' }
            }
            stripePrice =await createPrice(params);
        } else {
            continue;
        }

        let body = {
            duration_name: duration[i].duration_name,
            amount: duration[i].amount,
            stripe_price_id: stripePrice.id
        }

        durationData.push(body);
    }

    return durationData;

}

const updateChangePlanAmounts = async (planDetails, monthlyAmount, yearlyAmount, quaterlyAmount) => {
    if (!monthlyAmount || !yearlyAmount || !quaterlyAmount) {
        return undefined;
    }
    const monthlyData = planDetails?.duration?.find(item => item.duration_name === "monthly");
    const quarterlyData = planDetails?.duration?.find(item => item.duration_name === "quarterly");
    const yearlyData = planDetails?.duration?.find(item => item.duration_name === "yearly");
    let newMonthStripePriceId;
    let newQuarterlyStripePriceId;
    let newYearStripePriceId;
    if (monthlyData.amount !== monthlyAmount) {
        let params = {
            unit_amount: monthlyAmount * 100,
            product_id: planDetails?.stripe_product_id,
            interval: { interval: 'month' }
        }
        newMonthStripePriceId = await createPrice(params);
    }
    if (quarterlyData.amount !== quaterlyAmount) {
        let params = {
            unit_amount: quaterlyAmount * 3 * 100,
            product_id: planDetails?.stripe_product_id,
            interval: {
                interval: 'month',
                interval_count: 3
            }
        }
        newQuarterlyStripePriceId = await createPrice(params);
    }
    if (yearlyData.amount !== yearlyAmount) {
        let params = {
            unit_amount: yearlyAmount * 12 * 100,
            product_id: planDetails?.stripe_product_id,
            interval: { interval: 'year' }
        }
        newYearStripePriceId = await createPrice(params);
    }
    let duration = [
        {
            duration_name: 'monthly',
            amount: monthlyAmount,
            stripe_price_id: newMonthStripePriceId ? newMonthStripePriceId.id : monthlyData.stripe_price_id,
        },
        {
            duration_name: 'quarterly',
            amount: quaterlyAmount,
            stripe_price_id: newQuarterlyStripePriceId ? newQuarterlyStripePriceId.id : quarterlyData.stripe_price_id,
        },
        {
            duration_name: 'yearly',
            amount: yearlyAmount,
            stripe_price_id: newYearStripePriceId ? newYearStripePriceId.id : yearlyData.stripe_price_id,
        },
    ]
    return duration;
}

const retriveSubscription = async (params) => {
    const { id } = params;
    const subscription = await stripe.subscriptions.retrieve(id);
    return subscription;
}

const retriveInvoice = async (params) => {
    const { stripe_customer_id, upcoming } = params;
    let stripeInvoice={};
    console.log(stripe_customer_id)
    if (upcoming) {
        stripeInvoice = await stripe.invoices.retrieveUpcoming({
            customer: stripe_customer_id
        })
    }
    return stripeInvoice;
}

const stripeUtils = {
    createProduct,
    createPrice,
    createPricesWithPlanDuration,
    updateChangePlanAmounts,
    retriveSubscription,
    retriveInvoice
}

export default stripeUtils;