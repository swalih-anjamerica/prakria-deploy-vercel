import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import PaymentCardClient from "../components/client/account/PaymentCardClient"
import ButtonLoader from "../components/common/ButtonLoader";
import Faq from "../components/landing/Faq";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Plans from "../models/plans";
import API from "../services/api";
import validator from "validator";
import NewPlanScreen from "../components/user/NewPlanCard/NewPlanScreen";

function Pricing({ plans }) {

    const [requestingQuote, setRequestingQuote] = useState(false);
    const [formData, setFormData] = useState({})
    const [formErr, setFormErr] = useState({})

    async function handleRequestQuote(e) {
        e.preventDefault();
        try {
            // validations
            if (!formData.fullname) {
                return setFormErr({ fullnameErr: "required" });
            }
            if (!formData.email) {
                return setFormErr({ emailErr: "required" });
            }
            if (!formData.mobile) {
                return setFormErr({ mobileErr: "required" });
            }
            if (!validator.isEmail(formData.email)) {
                return setFormErr({ emailErr: "Invalid email" });
            }
            if (!validator.isMobilePhone(formData.mobile)) {
                return setFormErr({ mobileErr: "Invalid mobile number" });
            }

            // end of validation
            setRequestingQuote(true);
            await API.post("/su-admin/request-quote-mail", formData)
            setRequestingQuote(false);
            toast.success("Your quote has been submited.");
            e.target.reset()
            setFormData({});
        } catch (e) {
            toast.error("Something went wrong. Try again later");
            setRequestingQuote(false);
        }
    }
    function handleInput(event) {
        setFormErr({});
        let name = event.target.name;
        let value = event.target.value;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className="bg-white mx-auto w-full h-full snap-y">
            <Header />
            <section className="w-[90%] mx-auto py-20">
                <p className="landing-heading">Infinite Projects. One Price.</p>
                {/* <p className="text-2xl font-thin leading-10">1/3rd the price of your conventional agency. Zero hassle.</p> */}
                <p className="text-[1.2rem] leading-7 font-normal mt-3 min-w-[700px]">
                    1/10th the price of your conventional agency. Zero hassle.<br /> No binding contracts. Pay a monthly subscription charge, and complete<br /> a variety of projects under the same account.
                </p>
            </section>
            <section className="w-full lg:w-[75%] xl:w-[70%] mb-[130px] bg-[#050F3D] mr-auto flex items-center relative" >
                <img src="/assets/landing/pricing1.png" className="hidden lg:block w-[500px] absolute -right-72 xl:-right-80 top-[-8rem]" />
                <div className="flex flex-col gap-3 p-[48px] pl-0" style={{ marginLeft: "calc( 1.5rem + 5%)" }}>
                    <div className="flex gap-5 items-center">
                        <img src="/assets/landing/check 1.png" className="w-10 h-10" />
                        <span className="text-[#FFF300] text-2xl font-black">No binding contracts</span>
                    </div>
                    <div className="flex gap-5 items-center">
                        <img src="/assets/landing/check 1.png" className="w-10 h-10" />
                        <span className="text-[#FFF300] text-2xl font-black">No hidden fees</span>
                    </div>
                    <div className="flex gap-5 items-center">
                        <img src="/assets/landing/check 1.png" className="w-10 h-10" />
                        <span className="text-[#FFF300] text-2xl font-black">No required upgrades </span>
                    </div>
                    <div className="flex gap-5 items-center">
                        <img src="/assets/landing/check 1.png" className="w-10 h-10" />
                        <span className="text-[#FFF300] text-2xl font-black">No price per user</span>
                    </div>
                </div>
            </section>
            {/* <section className="w-[90%] mr-auto my-12 mx-14 pl-20" id="pricing">
                <p className="text-2xl font-semibold leading-10">Book a free consultation with us today!</p>
                <button className="yellow-action-button-landing w-56 mt-4"><a href={"https://calendly.com/info-44201"} target="_blank" rel="noreferrer">Book Now</a></button>
            </section> */}
            {/* new plan screen */}
            <NewPlanScreen plans={JSON.parse(plans)} />

            <section className="w-full bg-[#050F3D] mr-auto flex flex-row relative" id="partner-with-us">
                <div className="flex flex-col gap-3 p-10 pt-0 lg:pl-0 ml-[5%] mt-16 text-white">
                    <div className="flex gap-5 items-center">
                        <span className="text-[#FFF300] text-3xl text-[30px] md:text-[3vw] font-[700] 2xl:text-[56px]">Partner with Us</span>
                    </div>
                    <h1 className="text-[1.5vw] lg:mt-10">
                        Want a specifically created plan that&apos;s not on the list?
                    </h1>
                    <p className="text-[1.5vw] mt-5 lg:mt-10">
                        Don&apos;t worry. We got you covered. Let&apos;s discuss your specific needs &amp; requirements, and we will create a specific plan JUST FOR YOU!
                    </p>

                    <Link href={`https://calendly.com/info-44201/partner-with-us?month=${new Date().getFullYear()}-${new Date().getMonth() + 1}`}>
                        <button className="bg-[#FFF300] px-5 py-2 text-black w-[150px] text-sm lg:w-[250px] mt-10 mb-10 rounded-sm font-[600]">
                            TALK TO US!
                        </button>
                    </Link>

                </div>
                <div className="w-full relative">
                    <img src="/assets/landing/handshake.png" className="absolute bottom-[-80px] md:bottom-[-120px] lg:bottom-[-160px]" />
                </div>
            </section>
            <div className="relative h-screen mt-[80px] md:mt-[120px] lg:mt-[160px]" >


                <section>
                    <Faq />
                </section>
                <section className="w-[80%] mr-auto py-12 px-16">
                    <p className="text-2xl font-semibold leading-10">Book a free consultation with us today!</p>
                    <button className="yellow-action-button-landing w-56 mt-4"><Link href={"https://calendly.com/info-44201"}>Book Now</Link></button>
                </section>
                <Footer />
            </div>
        </div>

    )
}

const PricingTable = ({ plans }) => {
    const [tab, setTab] = useState(plans[0]?.title);
    const Card = () => {
        const stripePromise = loadStripe("asdasduayd87qr987huzc");
        const plan = plans?.find(plan => plan.title == tab);
        return (
            <div className="h-full flex flex-col w-full bg-[#050F3D]">
                <Elements stripe={stripePromise}>
                    <PaymentCardClient plan={plan} landing={true} />
                </Elements>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col w-full bg-[#050F3D]">
            <div className="flex justify-evenly cursor-pointer md:text-sm lg:text-[16px]">
                {
                    plans?.map(plan => {
                        const planTitle = plan.title;
                        return <span key={plan._id} className={`${tab == planTitle ? "bg-[#00D8DA]" : "bg-[#050F3D] text-white"} w-full text-center py-3 uppercase`} onClick={() => setTab(planTitle)}>{planTitle}</span>
                    })
                }
            </div>
            <div className="w-full h-full">
                <Card />
            </div>
        </div>
    )



}

export default Pricing;

Pricing.getLayout = ({ children }) => {
    return (
        <>
            {
                children
            }
        </>
    )
}

export async function getServerSideProps() {
    try {
        const planDetails = await Plans.aggregate([
            {
                $match: {
                    active: true
                }
            },
            {
                $lookup: {
                    from: "skills",
                    localField: "resources.skill_id",
                    foreignField: "_id",
                    as: "skills"
                }
            }
        ])
        return {
            props: {
                plans: JSON.stringify(planDetails)
            }
        }
    } catch (e) {
        return {
            props: {
                plans: []
            }
        }
    }
}