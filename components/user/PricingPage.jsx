import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function PricingPage({ plan }) {

    const router = useRouter();

    const { description, duration, title, features, } = plan;

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


    function handleChoosePlan() {
        if (!localStorage) return;

        const planLocalStorageData = { title: plan.title, planAmount, planStripePriceId, planid: plan._id, duration_name: planDurationName }
        sessionStorage.setItem("plan", JSON.stringify(planLocalStorageData));

        router.push("/signup");
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

        <div className='grid justify-items-center mt-10'>
            <div className="flex flex-col w-full max-w-sm px-12 py-8 space-y-6 bg-primary-white rounded-lg shadow-md">

                <div className=' my-2 flex flex-wrap border-2 rounded-2xl'>
                    <ul className="flex flex-wrap">
                        {
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
                        }
                        {
                            planMonthAmount &&
                            <li className="mr-2"
                                onClick={() => {
                                    setPlanWeekShow(false);
                                    setPlanMonthShow(true);
                                    setPlanQuarterlyShow(false);
                                    setPlanYearShow(false);
                                }}
                            >
                                <span className={planMonthShow ? "bg-primary-blue text-primary-white hover:text-primary-white hover:bg-primary-blue inline-block py-1 px-[2px] text-sm font-medium text-center rounded-lg hover:cursor-pointer transition-all" : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue inline-block py-1 px-[2px] text-sm font-medium text-center rounded-lg hover:cursor-pointer transition-all"}>{"monthly"}</span>
                            </li>
                        }
                        {
                            planQuarterlyAmount &&
                            <li className="mr-2"
                                onClick={() => {
                                    setPlanWeekShow(false);
                                    setPlanMonthShow(false);
                                    setPlanQuarterlyShow(true);
                                    setPlanYearShow(false);
                                }}
                            >
                                <span className={planQuarterlyShow ? "bg-primary-blue text-primary-white hover:text-primary-white hover:bg-primary-blue inline-block py-1 px-[2px] text-sm font-medium text-center rounded-lg hover:cursor-pointer transition-all" : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue inline-block py-1 px-[2px] text-sm font-medium text-center rounded-lg hover:cursor-pointer transition-all"}>{"quarterly"}</span>
                            </li>
                        }
                        {
                            planYearAmount &&
                            <li className="mr-2"
                                onClick={() => {
                                    setPlanWeekShow(false);
                                    setPlanMonthShow(false);
                                    setPlanQuarterlyShow(false);
                                    setPlanYearShow(true);
                                }}
                            >
                                <span className={planYearShow ? "bg-primary-blue text-primary-white hover:text-primary-white hover:bg-primary-blue inline-block py-1 px-[2px] text-sm font-medium text-center rounded-lg hover:cursor-pointer transition-all" : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue inline-block py-1 px-[2px] text-sm font-medium text-center rounded-lg hover:cursor-pointer transition-all"}>{"yearly"}</span>
                            </li>
                        }
                    </ul>


                </div>


                {/* Show amount */}
                <div className="flex-shrink-0">
                    <span className="text-4xl font-medium tracking-tight">$
                        {/* {planWeekshow ? planWeekAmount
                                : planMonthShow ? planMonthAmount
                                    : planQuarterlyShow ? planQuarterlyAmount
                                        : planYearShow && planYearAmount
                            } */}
                        {
                            planAmount
                        }
                    </span>
                    <span className="text-primary-text-gray">{planWeekshow ? "/week" : "/month"}</span>
                </div>




                <div className="flex-shrink-0 pb-6 space-y-2 border-b">
                    <h2 className="text-2xl font-normal">{title}</h2>
                    <p className="text-sm text-primary-text-gray">{description}</p>
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


                <div className="flex-shrink-0 pt-4">
                    <button onClick={handleChoosePlan} className="h-8 px-2 m-1 text-sm font-medium text-primary-white transition-colors duration-150 bg-green-500 rounded-lg focus:shadow-outline hover:bg-green-dark">Choose Plan
                    </button>
                </div>
            </div>




        </div>
    )
}

export default PricingPage

