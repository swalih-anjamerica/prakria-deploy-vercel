export const getCurrencySympol = (currency) => {
    let currencyIcon="$";
    switch (currency.toLowerCase()) {
        case "inr":
            currencyIcon="₹";
            break;
        case "usd":
            currencyIcon="$"
            break;
        case "gbp":
            currencyIcon="£"
            break;
    }

    return currencyIcon;
}