import Loader from "../../components/layouts/Loader";
import { useAuthPageHook } from "../../hooks/useRequireAuth";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AccountForm from "../../components/client/signup/AccountForm";
import BillingForm from "../../components/client/signup/BillingForm";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import validator from "validator";
import { HiOutlineCheckCircle } from "react-icons/hi"
import Link from "next/link";


function SignupPage({ STRIPE_PUBLIC_KEY }) {
    const [tab, setTab] = useState("ACCOUNT_DETAILS")
    // stripe
    const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

    const router = useRouter();

    // context api
    const auth = useAuth();

    // states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [company, setCompany] = useState("");
    const [designation, setDesignation] = useState("");
    const [timezone, setTimezone] = useState("");


    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");

    const [planDetails, setPlanDetails] = useState({});
    const [taxPerc, setTaxPerc] = useState(null);


    // tabe states
    const [showAccountForm, setShowAccountForm] = useState(true);
    const [showBillingForm, setShowBillingForm] = useState(false);

    const [paymentLoading, setPaymentLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    // validation states account details
    const [firstNameErr, setFirstNameErr] = useState("");
    const [lastNameErr, setLastNameErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [designationErr, setDesignationErr] = useState("");
    const [timezoneErr, setTimezoneErr] = useState("");
    const [phoneNumberErr, setPhoneNumberErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");

    // validation state for billing details
    const [billingErrForm, setBillingErrForm] = useState({
        cardholderNameErr: "",
        billingAddressErr: "",
        cityErr: "",
        stateErr: "",
        zipcodeErr: "",
        countryErr: ""
    })

    const accountValidateStates = { firstNameErr, setFirstNameErr, lastNameErr, setLastNameErr, emailErr, setEmailErr, designationErr, setDesignationErr, timezoneErr, setTimezoneErr, phoneNumberErr, setPhoneNumberErr, passwordErr, setPasswordErr };

    function accountTempSave() {

        setFirstNameErr("");
        setLastNameErr("");
        setDesignationErr("");
        setTimezoneErr("");
        setPhoneNumberErr("");
        setEmailErr("");
        setPasswordErr("");

        if (!firstName) return setFirstNameErr("Required!");
        if (!lastName) return setLastNameErr("Required!");
        if (!designation) return setDesignationErr("Required!");
        if (!timezone) return setTimezoneErr("Required!");
        if (!email) return setEmailErr("Required!");
        if (!password) return setPasswordErr("Required!");
        if (!validator.isEmail(email)) return setEmailErr("Invalid email!");
        if (mobileNumber && !validator.isMobilePhone(mobileNumber)) return setPhoneNumberErr("Invalid mobile number!");
        setTab("PLAN_DETAILS")
    }

    async function completePaymentAndSignup(stripeData, user_id) {
        try {
            setLoadingMessage("creating account...");
            const response = await auth.signupClientAdmin({ stripeData, user_id })
            // toast.loading("creating account");
            if (response.status === 200) {
                toast.dismiss();
                toast.success("Account created successfully!");
                setLoadingMessage("redirecting to dashboard..");
                setTimeout(() => router.push("/dashboard"), 1000);
            }
        } catch (e) {
            setPaymentLoading(false);
            toast.dismiss();
            toast.error(e?.response?.data?.message);
        }
    }

    useEffect(() => {
        if (!sessionStorage) return;

        if (!sessionStorage.getItem("plan")) {
            return router.push("/pricing");
        }

        setPlanDetails(JSON.parse(sessionStorage.getItem("plan")))

        return () => {
            sessionStorage.removeItem("plan");
        }
    }, [sessionStorage])


    const accountFormBody = {
        firstName, setFirstName, lastName, setLastName,
        email, setEmail, password, setPassword, mobileNumber, setMobileNumber,
        company, setCompany, designation, setDesignation, timezone, setTimezone
    }
    const billingFormBody = {
        address, setAddress, pincode, setPincode, city, setCity,
        state, setState, country, setCountry, cardHolderName, setCardHolderName,
        email, loadingMessage, setLoadingMessage, paymentLoading, setPaymentLoading
    }

    const cardOptions = {
        style: {
            base: {
                color: "#32325D",
                fontWeight: 500,
                fontFamily: "Inter, Open Sans, Segoe UI, sans-serif",
                fontSize: "16px",
                fontSmoothing: "antialiased",

                "::placeholder": {
                    color: "#CFD7DF"
                }
            },
            invalid: {
                color: "#E25950"
            }
        },
        hidePostalCode: true
    }


    return (
        < div className='h-screen w-screen bg-white relative pt-10 overflow-x-hidden' >
            <Link href="/" passHref><a><img src="/logo.png" className='w-40 ml-10' /></a></Link>
            <div style={{ backgroundImage: `url("/Bg.png")`, backgroundRepeat: "no-repeat" }} className='flex justify-around items-center h-full w-full py-6 bg-white flex-wrap '>

                <div className="w-fit h-fit md:w-[50%] bg-white rounded-2xl shadow-lg pb-5">
                    <div className="flex justify-start gap-3  items-center px-5 bg-gray-100 w-full h-16 rounded-t-2xl">
                        <span className={`px-5 py-2 cursor-pointer rounded-lg ${tab === "ACCOUNT_DETAILS" ? "bg-white" : ""}`} onClick={() =>
                            setTab("ACCOUNT_DETAILS")}>
                            Account Details
                        </span>
                        <span className={`px-5 py-2 cursor-pointer rounded-lg ${tab === "PLAN_DETAILS" ? "bg-white" : ""}`} onClick={accountTempSave}>
                            Plan Details
                        </span>
                    </div>

                    <div className=" ">
                        {
                            tab === "ACCOUNT_DETAILS" ?
                                <AccountForm accountTempSave={accountTempSave} inputStates={accountFormBody} accountValidateStates={accountValidateStates} />
                                :
                                <Elements stripe={stripePromise}>
                                    <BillingForm inputStates={billingFormBody} completePaymentAndSignup={completePaymentAndSignup} planDetails={planDetails} billingErrForm={billingErrForm} setBillingErrForm={setBillingErrForm} cardHolderErr={firstNameErr} setCardHolderErr={setFirstNameErr} accountFormBody={accountFormBody} setTaxPerc={setTaxPerc} />
                                </Elements>

                        }

                    </div>
                </div>
                <div className="w-fit flex flex-col self-center bg-white shadow-xl h-fit  rounded-xl p-16">
                    <div className="border-b border-gray-300  flex flex-col gap-8  pb-5">
                        <div className="flex-shrink-0">
                            <span className="text-6xl font-medium tracking-tight"><span className='text-lg text-red'>£ {" "}</span>
                                {
                                    planDetails.planAmount
                                }
                            </span>
                            <span className="text-primary-text-gray tracking-wider"> /month</span>

                        </div>
                        {/* <div> */}
                        {/* </div> */}
                        <div className="flex flex-col gap-3">
                            <p className='text-2xl tracking-wide'>{planDetails.title}</p>
                            {/* <p className='text-2xl text-gray-500 tracking-wide'>{planDetails.description}</p> */}
                        </div>

                    </div>
                    <div className="flex flex-col gap-3">
                        <p className='text-xl text-gray-800 tracking-wide flex gap-2'><HiOutlineCheckCircle className='h-7 w-7 text-[#3B85F5]' /> {planDetails.duration_name} Pay</p>
                        <p className='text-xl text-gray-800 tracking-wide flex align-bottom gap-2 '><HiOutlineCheckCircle className='h-7 w-7 text-[#3B85F5]' />
                            <span className='text-red text-sm mt-1'>£</span>
                            {
                                planDetails.duration_name == "quarterly" ? planDetails.planAmount * 3
                                    :
                                    planDetails.duration_name === "yearly" ? planDetails.planAmount * 12
                                        :
                                        planDetails.planAmount
                            }
                            {
                                taxPerc && <span>+</span>
                            }
                            {taxPerc && <span className='text-red text-sm mt-1'>£</span>}
                            {
                                taxPerc &&
                                (planDetails.duration_name == "quarterly" ? (planDetails.planAmount * 3) * (taxPerc / 100)
                                    :
                                    planDetails.duration_name === "yearly" ? (planDetails.planAmount * 12) * (taxPerc / 100)
                                        :
                                        (planDetails.planAmount) * (taxPerc / 100))
                            }
                            {/* <p className="text-green-500 text-xs">({taxPerc}% tax)</p> */}
                            {" "}Billed Today
                        </p>

                        {
                            taxPerc &&
                            <p className='text-xl text-gray-800 tracking-wide flex align-bottom gap-2 '>
                                <HiOutlineCheckCircle className='h-7 w-7 text-[#3B85F5]' />
                                <p className="text-green-500">+ {taxPerc}% tax</p>
                            </p>

                        }
                    </div>
                </div>
            </div>
        </div >
    )
}


export async function getServerSideProps(context) {
    return {
        props: {
            STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
            STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY
        }
    }
}


SignupPage.getLayout = function LoginLayout({ children }) {

    let { isAuthenticated, loading } = useAuthPageHook();

    if (isAuthenticated === null || loading) {
        return <Loader />
    }

    return (
        <>
            {
                children
            }
        </>
    )
}

export default SignupPage