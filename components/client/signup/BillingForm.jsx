import React, { useState } from 'react'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import toast from 'react-hot-toast';
import { createSubscription } from '../../../services/stripe';
import validator from '../../../helpers/formValidator';
import { useEffect } from 'react';
import stripeCountrys from '../../../utils/stripeCountrys';

function BillingForm({ inputStates, completePaymentAndSignup, planDetails, billingErrForm, setBillingErrForm, cardHolderErr, setCardHolderErr, accountFormBody, setTaxPerc }) {
    // destructuring inputstates
    const { address, setAddress, pincode, setPincode, city, setCity,
        state, setState, country, setCountry, cardHolderName, setCardHolderName, email, loadingMessage, setLoadingMessage, paymentLoading, setPaymentLoading } = inputStates;
    const { firstName, lastName, password, mobileNumber, company, designation, timezone } = accountFormBody;
    // destructuring planDetails
    const { duration_name, planAmount, planStripePriceId } = planDetails;
    const [paymentMethod, setPaymentMethod] = useState(null);
    // stripe
    const stripe = useStripe();
    const element = useElements();
    const cardOptions = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
        hidePostalCode: true
    }

    async function handleCardDetails() {
        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: element.getElement(CardElement)
            })
            if (!paymentMethod) return;
            const card = paymentMethod.card || {};
            switch (card.country.toLowerCase()) {
                case "gb":
                    setTaxPerc(20);
                    break;
                default:
                    setTaxPerc(null);
                    break;
            }
            setCountry(card.country);
            setPaymentMethod(paymentMethod);
        } catch (e) {
        }
    }
    async function handleFinishAndPayForm(e) {
        e.preventDefault();

        setBillingErrForm({});

        if (!paymentMethod) return toast.error("Invalid card");

        if (!cardHolderName) return setBillingErrForm(prev => {
            return { ...prev, cardholderNameErr: "required." }
        })
        if (!address) return setBillingErrForm(prev => {
            return { ...prev, billingAddressErr: "required." }
        })
        if (!city) return setBillingErrForm(prev => {
            return { ...prev, cityErr: "required." }
        })
        if (!state) return setBillingErrForm(prev => {
            return { ...prev, stateErr: "required." }
        })
        if (!pincode) return setBillingErrForm(prev => {
            return { ...prev, zipcodeErr: "required." }
        })
        if (!country) return setBillingErrForm(prev => {
            return { ...prev, coutnryErr: "required." }
        })

        if (country !== paymentMethod.card?.country) return setBillingErrForm(prev => {
            return { ...prev, coutnryErr: "Card country and country must be equal!" }
        })

        setPaymentLoading(true);
        setLoadingMessage("validating address...");

        const card = element.getElement(CardElement);
        const token = await stripe.createToken(card);
        let user_id;
        try {
            if (paymentMethod) {
                const cardDetails = paymentMethod.card;

                const cardData = {
                    cardholder_name: cardHolderName,
                    card_brand: cardDetails.brand,
                    last_4_degit: cardDetails.last4,
                    card_country: cardDetails.country,
                    exp_month: cardDetails.exp_month,
                    exp_year: cardDetails.exp_year
                }

                // subscription
                setLoadingMessage("starting payment..");
                const userData = {
                    email, first_name: firstName, last_name: lastName, password, mobile_number: mobileNumber, designation, company_name: company,
                    time_stamp: timezone, name: cardHolderName, address, city, state,
                    country: cardDetails.country
                };
                const planData = { plan_id: planDetails.planid, duration: planDetails.duration_name };
                const stripeInitData = { stripe_card_token: token.token.id, stripe_price_id: planStripePriceId };
                // const subscribeResponse = await createSubscription(email, cardHolderName, address, pincode, city, state, country, planStripePriceId, token.token.id)
                const description = `${planDetails?.title} - ${duration_name} based plan`
                const subscribeResponse = await createSubscription({ userData, planData, stripeData: stripeInitData, description })

                user_id = subscribeResponse.data.user_id;
                if (subscribeResponse.status !== 200) {
                    setPaymentLoading(false);
                    return;
                }

                setLoadingMessage("confirming payment..");
                const confirmResponse = await stripe.confirmCardPayment(subscribeResponse.data.stripe_secret, {
                    payment_method: {
                        card: element.getElement(CardElement)
                    }
                });



                if (confirmResponse.error) {
                    setPaymentLoading(false);
                    toast(confirmResponse.error.message + " 🚫️", {
                        duration: 15000
                    });
                    return;
                }
                const stripeData = {
                    stripe_subscription_id: subscribeResponse.data.stripe_subscription_id,
                    stripe_customer_id: subscribeResponse.data.stripe_customer_id,
                    stripe_payment_method_id: confirmResponse.paymentIntent.payment_method,
                    stripe_amount: confirmResponse.paymentIntent.amount,
                    stripe_currency: confirmResponse.paymentIntent.currency,
                    stripe_payment_id: confirmResponse.paymentIntent.id,
                    stripe_client_secret: confirmResponse.paymentIntent.client_secret,
                    stripe_paid_date: confirmResponse.paymentIntent.created
                }
                toast.success("Paid successfully!");
                completePaymentAndSignup(stripeData, subscribeResponse.data.user_id);
            } else {
                setPaymentLoading(false);
                toast.error(error.message);
            }
        } catch (e) {
            setPaymentLoading(false);
            if (e?.response?.data?.error || e?.response?.data?.message) {
                return toast.error(e?.response?.data?.message);
            }
            toast.error("something went wrong!");
        }
    }

    return (
        <div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-10">
                <div className="flex flex-col w-full px-36 my-2">
                    <label className='text-gray-700 text-base'>Credit Card Number</label>
                    <CardElement options={cardOptions} onChange={handleCardDetails} />
                </div>

            </div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-10">
                <div className="flex flex-col">
                    <label className='text-gray-700 text-base'>Card Holder</label>
                    <input className='border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-40 xl:w-80 px-5' id="Card Holder" type="text" value={cardHolderName} onChange={e => {
                        setCardHolderName(e.target.value);
                        validator.nameInputChangeHandler(e.target.value, setCardHolderErr);
                    }} />
                    <span className='text-[#cc0000]'>{billingErrForm?.cardholderNameErr || cardHolderErr}</span>
                </div>
                <div className="flex flex-col">
                    <label className='text-gray-700 text-base'>Billing Address</label>
                    <input className='border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-40 xl:w-80 px-5' id="Billing Address" type="text" value={address} onChange={e => setAddress(e.target.value)} />
                    <span className='text-[#cc0000]'>{billingErrForm?.billingAddressErr}</span>
                </div>
            </div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-10">
                <div className="flex flex-col">
                    <label className='text-gray-700 text-base'>City</label>
                    <input className='border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-40 xl:w-80 px-5' id="City" type="text" value={city} onChange={e => setCity(e.target.value)} />
                    <span className='text-[#cc0000]'>{billingErrForm?.cityErr}</span>
                </div>
                <div className="flex flex-col">
                    <label className='text-gray-700 text-base'>State</label>
                    <input className='border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-40 xl:w-80 px-5' id="State" type="text" value={state} onChange={e => setState(e.target.value)} />
                    <span className='text-[#cc0000]'>{billingErrForm?.stateErr}</span>
                </div>
            </div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-10">
                <div className="flex flex-col">
                    <label className='text-gray-700 text-base'>Zip Code</label>
                    <input className='border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-40 xl:w-80 px-5' id="Zip Code" type="text" value={pincode} onChange={e => setPincode(e.target.value)} />
                    <span className='text-[#cc0000]'>{billingErrForm?.zipcodeErr}</span>
                </div>
                <div className="flex flex-col">
                    <label className="form-label" htmlFor="Country">
                        Country
                    </label>
                    <select className="border bg-white border-gray-200 focus:outline-none rounded-md my-2 h-10 w-40 xl:w-80 px-5" id="username" type="text" value={country} onChange={e => setCountry(e.target.value)}>
                        <option value="" disabled>Select country</option>
                        {
                            stripeCountrys.map((country, index) => {
                                return <option value={country.code} key={index}>{country.country}</option>
                            })
                        }
                    </select>
                    <span className='text-[#cc0000]'>{billingErrForm?.coutnryErr}</span>
                </div>

            </div>
            <div className="flex justify-around md:my-2  xl:my-2 2xl:my-10">
                <div className="flex flex-col  w-40 xl:w-80">
                </div>
                <div className="flex flex-col">
                    {
                        paymentLoading ?
                            <button className="yellow-lg-action-button hover:bg-primary-yellow cursor-wait">
                                <div className='flex'>
                                    <svg role="status" className="mr-2 w-6 h-6 text-primary-white animate-spin dark:text-gray-600 fill-primary-text" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <h1>{loadingMessage}</h1>
                                </div>
                            </button>
                            :
                            <button className="yellow-lg-action-button" onClick={handleFinishAndPayForm}>Finish and pay</button>
                    }
                </div>

            </div>
        </div>
    )
}

export default BillingForm