import { useElements, useStripe } from "@stripe/react-stripe-js";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { updateClientSubscriptionDBService, updatePlan } from "../../../services/plans";
import { HiOutlinePencilAlt } from "react-icons/hi"

function PricingCard({ plan, client = false, setShowModal, subcriptionStatus = "" }) {

    const { description, duration, title, features, _id, active } = plan;
    const router = useRouter();
    const [planWeekshow, setPlanWeekShow] = useState(false);
    const [planMonthShow, setPlanMonthShow] = useState(true);
    const [planQuarterlyShow, setPlanQuarterlyShow] = useState(false);
    const [planYearShow, setPlanYearShow] = useState(false);


    const [planWeekAmount, setPlanWeekAmount] = useState(null);
    const [planMonthAmount, setPlanMonthAmount] = useState(null);
    const [planQuarterlyAmount, setPlanQuarterlyAmount] = useState(null);
    const [planYearAmount, setPlanYearAmount] = useState(null);

    const [planStripePriceId, setPlanStripePriceId] = useState("");
    const [planAmount, setPlanAmount] = useState("");
    const [planDurationName, setPlanDurationName] = useState("");

    useEffect(() => {

        if (!duration) return;

        duration.forEach((plan, index) => {

            switch (plan.duration_name) {
                case "weekly":
                    setPlanWeekAmount(plan.amount);
                    break;
                case "monthly":
                    setPlanMonthAmount(plan.amount);
                    break;
                case "quarterly":
                    setPlanQuarterlyAmount(plan.amount);
                    break;
                case "yearly":
                    setPlanYearAmount(plan.amount);
                    break;
            }

        })
    }, [])

    async function planActiveHandler() {
        try {

            const response = await updatePlan({
                active: !active
            }, _id)

            if (response.status === 200) {
                // return alert("success")
                toast.success("plan Updated successfully!");

                setTimeout(() => {
                    router.reload()
                }, 600)
            }
        } catch (error) {
            toast.dismiss()
            toast.error(error?.response?.data?.error);
        }
    }
    
    useEffect(() => {
        if (planWeekshow) {
            const dur = duration.find(dur => dur.duration_name === "weekly");
            setPlanAmount(dur.amount);
            setPlanDurationName(dur.duration_name);
            return setPlanStripePriceId(dur.stripe_price_id);
        }
        if (planMonthShow) {
            const dur = duration.find(dur => dur.duration_name === "monthly");
            setPlanAmount(dur.amount);
            setPlanDurationName(dur.duration_name);
            return setPlanStripePriceId(dur.stripe_price_id);
        }
        if (planQuarterlyShow) {
            const dur = duration.find(dur => dur.duration_name === "quarterly");
            setPlanAmount(dur.amount);
            setPlanDurationName(dur.duration_name);
            return setPlanStripePriceId(dur.stripe_price_id);
        }
        if (planYearShow) {
            const dur = duration.find(dur => dur.duration_name === "yearly");
            setPlanAmount(dur.amount);
            setPlanDurationName(dur.duration_name);
            return setPlanStripePriceId(dur.stripe_price_id);
        }
    }, [planWeekshow, planMonthShow, planQuarterlyShow, planYearShow])

    return (
        <>
            <div className={`relative flex flex-col w-full min-w-min max-w-sm px-12 py-8 space-y-6 bg-primary-white rounded-lg shadow-xl `}>

                <div className='my-2 flex w-min border-2  justify-between rounded-xl'>
                    {/* {
                            planWeekAmount &&
                            <li className="mr-2"
                                onClick={() => {
                                    setPlanWeekShow(true);
                                    setPlanMonthShow(false);
                                    setPlanQuarterlyShow(false);
                                    setPlanYearShow(false);
                                }}
                            >
                                <span className={planWeekshow ? "bg-primary-blue text-primary-white hover:text-primary-white hover:bg-primary-blue inline-block py-1 px-[2px] text-sm font-medium text-center rounded-lg hover:cursor-pointer transition-all" : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue inline-block py-1 px-[2px] text-sm font-medium text-center rounded-lg hover:cursor-pointer transition-all"}>{"weekly"}</span>
                            </li>
                        } */}
                    {
                        planMonthAmount &&
                        <span className={`py-1 px-2 rounded-xl cursor-pointer ${planMonthShow ? "bg-primary-blue text-white" : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue hover:opacity-60"}`}
                            onClick={() => {
                                setPlanWeekShow(false);
                                setPlanMonthShow(true);
                                setPlanQuarterlyShow(false);
                                setPlanYearShow(false);
                            }}
                        >
                            Monthly
                        </span>
                    }
                    {
                        planQuarterlyAmount &&
                        <span className={`py-1 px-2 rounded-xl mx-1 cursor-pointer ${planQuarterlyShow ? "bg-primary-blue text-white" : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue hover:opacity-60"}`}
                            onClick={() => {
                                setPlanWeekShow(false);
                                setPlanMonthShow(false);
                                setPlanQuarterlyShow(true);
                                setPlanYearShow(false);
                            }}
                        >
                            Quarterly
                        </span>
                    }
                    {
                        planYearAmount &&
                        <span className={`py-1 px-2 rounded-xl cursor-pointer ${planYearShow ? "bg-primary-blue text-white" : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue hover:opacity-60"}`}
                            onClick={() => {
                                setPlanWeekShow(false);
                                setPlanMonthShow(false);
                                setPlanQuarterlyShow(false);
                                setPlanYearShow(true);
                            }}
                        >
                            Yearly
                        </span>
                    }
                </div>


                {/* Show amount */}
                <div className="flex-shrink-0">
                    <span className="text-4xl font-bold tracking-tight"><span className="text-xl">£&nbsp;</span>
                        {planAmount}
                    </span>
                    <span className="text-primary-text-gray">&nbsp;{planWeekshow ? "/week" : "/month"}</span>
                </div>
                <div className="flex-shrink-0 pb-6 space-y-2 border-b">
                    <h2 className="text-2xl font-normal">{title}</h2>
                    <p className="text-sm text-primary-text-gray break-words w-60">{description}</p>
                </div>
                <ul className="flex-1 space-y-4">
                    {features && features.map((values, index) => {
                        return <React.Fragment key={index}>
                            <li className="flex items-start">
                                <svg className="w-6 h-6 text-primary-blue" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd" />
                                </svg>
                                <span className="ml-3 text-base font-medium">{values}</span>
                            </li>
                        </React.Fragment>
                    })}
                </ul>


                {!client ? <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" checked={active} className="sr-only" onChange={planActiveHandler} />
                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                            </div>
                        </label>
                        <div className={` ml-3 font-medium text-white px-2 py-1 rounded-xl ${active ? "bg-green-500 " : "bg-red "}`}>
                            {active ? "Active" : "Inactive"}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">

                        <Link href={`/admin/plan/edit/${_id}`} passHref >
                            <button className="h-8 px-2 m-1 text-sm font-medium"><HiOutlinePencilAlt className="h-7 w-7 text-primary-blue" />
                            </button>
                        </Link>
                    </div>

                </div> :
                    subcriptionStatus !== "subscribed" ?
                        <div className="flex w-full justify-center my-10 uppercase"><button className="px-10 py-1 bg-primary-blue text-white hover:opacity-80 rounded-xl" onClick={handleNewSubscription}>Add</button></div>
                        :
                        <div className="flex w-full justify-center my-10 uppercase"><button className="px-10 py-1 bg-primary-blue text-white hover:opacity-80 rounded-xl" onClick={handleUpgradePlan}>Upgrade</button></div>
                }
            </div>

        </>
    )
}

export default PricingCard