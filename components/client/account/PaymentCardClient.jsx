import { useElements, useStripe } from "@stripe/react-stripe-js";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LockIconPlan } from "../../../helpers/svgHelper";
import { useAuth } from "../../../hooks/useAuth";
import {
  updateClientSubscriptionDBService,
  updatePlan,
} from "../../../services/plans";
import {
  addNewSubscriptionStripeSecret,
  updateSubscriptionService,
} from "../../../services/stripe";
import ButtonLoader from "../../common/ButtonLoader";
import ConfirmAlert from "../../common/ConfirmAlert";

const PaymentCardClient = ({
  plan,
  client = false,
  landing = false,
  index,
  totalResources
}) => {
  let { description, duration = [], title, features = [], _id, active, } = plan || {};
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
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [showAddNewPlanConfirm, setShowAddNewPlanConfirm] = useState(false);
  const [showUpdatePlanConfirm, setShowUpdatePlanConfirm] = useState(false);

  const { subscription, user } = useAuth();
  const stripe = useStripe();

  async function handleUpgradePlan() {
    try {
      setShowUpdatePlanConfirm(false);
      setUpdatingPlan(true);
      await updateSubscriptionService(
        planStripePriceId,
        plan._id,
        planDurationName
      );
      toast.success("Plan upgraded successfully.");
      setTimeout(() => {
        router.reload();
      }, 800);
    } catch (e) {
      setUpdatingPlan(false);
      if (e.response?.data?.error) {
        toast.error(e.response.data.error);
      }
    }
  }

  async function handleNewSubscription() {
    try {
      setShowAddNewPlanConfirm(false);
      setUpdatingPlan(true);
      const response = await addNewSubscriptionStripeSecret(planStripePriceId, { plan_id: plan._id, plan_duration: planDurationName });
      if (!response.data?.stripe_secret) {
        await updateClientSubscriptionDBService(plan._id, planDurationName, response.data?.stripe_subscription_id, null);
        toast.success("Plan added successfully.");
        setUpdatingPlan(false);
        setTimeout(() => {
          router.reload();
        }, 800);
        return;
      }
      const confirmResponse = await stripe.confirmCardPayment(response.data?.stripe_secret)
      if (confirmResponse.error) {
        setUpdatingPlan(false);
        toast(confirmResponse.error.message + " 🚫️", {
          duration: 15000
        });
        return;
      }
      const stripeData = {
        stripe_payment_method_id: confirmResponse.paymentIntent.payment_method,
        stripe_amount: confirmResponse.paymentIntent.amount,
        stripe_currency: confirmResponse.paymentIntent.currency,
        stripe_payment_id: confirmResponse.paymentIntent.id,
        stripe_client_secret: confirmResponse.paymentIntent.client_secret,
        stripe_paid_date: confirmResponse.paymentIntent.created
      }
      await updateClientSubscriptionDBService(plan._id, planDurationName, response.data?.stripe_subscription_id, stripeData);
      toast.success("Plan added successfully.");
      setTimeout(() => {
        router.reload();
      }, 800);
    } catch (e) {
      setUpdatingPlan(false);
    }
  }

  function handleGotoSignup() {
    if (!sessionStorage) return;
    const planLocalStorageData = {
      title: plan.title,
      planAmount,
      planStripePriceId,
      planid: plan._id,
      duration_name: planDurationName,
    };
    sessionStorage.setItem("plan", JSON.stringify(planLocalStorageData));
    router.push("/signup");
  }

  useEffect(() => {
    return () => {
      setShowAddNewPlanConfirm(false);
      setShowUpdatePlanConfirm(false);
    }
  }, [])
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
    });
  }, []);
  useEffect(() => {
    if (duration.length < 1) {
      return;
    }
    if (planWeekshow) {
      const dur = duration.find((dur) => dur.duration_name === "weekly");
      setPlanAmount(dur.amount);
      setPlanDurationName(dur.duration_name);
      return setPlanStripePriceId(dur.stripe_price_id);
    }
    if (planMonthShow) {
      const dur = duration.find((dur) => dur.duration_name === "monthly");
      setPlanAmount(dur.amount);
      setPlanDurationName(dur.duration_name);
      return setPlanStripePriceId(dur.stripe_price_id);
    }
    if (planQuarterlyShow) {
      const dur = duration.find((dur) => dur.duration_name === "quarterly");
      setPlanAmount(dur.amount);
      setPlanDurationName(dur.duration_name);
      return setPlanStripePriceId(dur.stripe_price_id);
    }
    if (planYearShow) {
      const dur = duration.find((dur) => dur.duration_name === "yearly");
      setPlanAmount(dur.amount);
      setPlanDurationName(dur.duration_name);
      return setPlanStripePriceId(dur.stripe_price_id);
    }
  }, [planWeekshow, planMonthShow, planQuarterlyShow, planYearShow]);

  return (
    <>
      {
        showAddNewPlanConfirm && <ConfirmAlert content={`£${planAmount} will be debited from your account. Do you want to proceed`} handleCancel={() => setShowAddNewPlanConfirm(false)} handleConfirm={handleNewSubscription} />
      }
      {
        showUpdatePlanConfirm && <ConfirmAlert content={`£${planAmount} will be debited from your account. Do you wish to proceed?`} handleCancel={() => setShowUpdatePlanConfirm(false)} handleConfirm={handleUpgradePlan} />
      }
      <div className={`${index == 1 ? 'bg-[#FFE147]' : ''} relative rounded-md pt-10 text-[1vw] px-[1px] ${index === 1 ? ' pb-[1px]' : ''}`}>
        {
          index === 1 && <div className='absolute top-1 w-full text-center text-[#121212] font-semibold text-[17px] xl:text-[20px]'>
            <h1>Most Popular</h1>
          </div>
        }

        <div className={`${landing ? "relative w-full bg-[#050F3D] text-white" : "relative max-w-sm bg-primary-white"} flex flex-col px-4 2xl:px-5 py-8 space-y-6 rounded-lg h-full`}>

          <div className="flex justify-center">
            <div className={`${landing ? "" : "border-2"} my-2 flex w-min justify-center `}>
              {
                planMonthAmount &&
                <span className={`text-[14px] 2xl:text-[16px] py-1 px-2 cursor-pointer ${planMonthShow ? "bg-[#FFE147] text-black font-[600]" : "text-primary-gray "} ${landing && planMonthShow ? "bg-[#00D8DA] text-white" : "text-white "} hover:text-black hover:bg-[#FFE147] hover:opacity-60`}
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
                <span className={`text-[14px] 2xl:text-[16px] py-1 px-2 mx-1 cursor-pointer ${planQuarterlyShow ? "bg-[#FFE147] text-black font-[600]" : "text-primary-gray "} ${landing && planQuarterlyShow ? "bg-[#00D8DA] text-white" : "text-white"} hover:text-black hover:bg-[#FFE147] hover:opacity-60`}
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
                <span className={`text-[14px] 2xl:text-[16px] py-1 px-2 cursor-pointer ${planYearShow ? "bg-[#FFE147] text-black font-[600]" : "text-primary-gray "} ${landing && planYearShow ? "bg-[#00D8DA] text-white" : "text-white "} hover:text-black hover:bg-[#FFE147] hover:opacity-60`}
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
          </div>

          {/* Show amount */}
          <div className={`${landing ? "flex w-full justify-between" : "flex flex-col pt-3"}`}>
            <div className="w-full">
              <div className={`flex-shrink-0 pb-3 space-y-2 w-full ${landing ? "" : "border-none"}`}>
                <h2 className="text-[15px]  font-normal uppercase">{title}</h2>
                <div className="flex-shrink-0">
                  <span className="text-[20px] 2xl:text-[25px] font-[600] tracking-tight">
                    £{planAmount}
                  </span>
                  <span className="text-black text-[20px] 2xl:text-[25px]">&nbsp;{planWeekshow ? "/week" : "/month"}</span>
                </div>
              </div>
              <div className="h-[2px] bg-[#C4C4C4] mb-3"></div>
            </div>
            <h1 className="text-sm mb-3 text-[12px] 2xl:text-[15px]">What you get with <span className="font-[600] uppercase">{title}</span>:</h1>
            <div className="w-full">
              <ul className="">
                {/* {features && features.map((values, index) => {
                  return <React.Fragment key={index}>
                    <li className="flex items-center mb-2">
                      <img src="/assets/plan-check-icon.png" />
                      <span className="ml-3 text-xs 2xl:text-[14px] font-medium w-24 xl:w-40">{values}</span>
                    </li>
                  </React.Fragment>
                })} */}
                {
                  plan?.features?.map((values, index) => {
                    return <React.Fragment key={index}>
                      <li className="flex items-center mb-2">
                        <img src="/assets/plan-check-icon.png" />
                        <span className="ml-3 text-xs 2xl:text-[14px] font-medium w-24 xl:w-40">{values}</span>
                      </li>
                    </React.Fragment>
                  })
                }
                {/* {
                  allFeatures.filter(item => !plan?.features?.includes(item)).map((values, index) => {
                    return <React.Fragment key={index}>
                      <li className="flex items-center mb-2 text-[#A4A4A4]">
                        <LockIconPlan width={10}/>
                        <span className="ml-3 text-xs 2xl:text-[14px] font-medium w-24 xl:w-40">{values}</span>
                      </li>
                    </React.Fragment>
                  })
                } */}
                {
                  totalResources?.
                    filter(resource => plan.skills.find(item => item.skill_name.toLowerCase() === resource.skill_name.toLowerCase())).
                    map((resource, index) => {
                      return (
                        <React.Fragment key={index}>
                          <li className="flex items-center mb-2">
                            <img src="/assets/plan-check-icon.png" />
                            <span className="ml-3 text-xs 2xl:text-[14px] font-medium w-24 xl:w-40">
                              Dedicated <span className='capitalize'>{resource.skill_name}</span>
                            </span>
                          </li>
                        </React.Fragment>
                      )
                    })
                }
                {
                  totalResources?.
                    filter(resource => !plan.skills.find(item => item.skill_name.toLowerCase() === resource.skill_name.toLowerCase())).
                    filter(resource => !plan?.features?.find(item => item.toLowerCase() === "dedicated " + resource.skill_name.toLowerCase())).
                    map((resource, index) => {
                      return (
                        <React.Fragment key={index}>
                          <li className="flex items-center mb-2 text-[#A4A4A4]">
                            <LockIconPlan width={10} />
                            <span className="ml-3 text-xs 2xl:text-[14px] font-medium w-24 xl:w-40">
                              Dedicated <span className='capitalize'>{resource.skill_name}</span>
                            </span>
                          </li>
                        </React.Fragment>
                      )
                    })
                }
              </ul>
            </div>
          </div>

          {landing ?
            <div className="w-full flex justify-evenly">
              {/* <button className="yellow-action-button w-40 mt-4 uppercase">Login</button> */}
              <button className="yellow-action-button-landing w-56 mt-4 uppercase" onClick={handleGotoSignup}>Signup</button>
            </div>
            :
            updatingPlan ?
              <div className="flex w-full justify-center my-10 uppercase z-20">
                <button className="w-[80%] absolute bottom-3 px-10 py-1 bg-[#FFE147] text-black font-[600] rounded-sm">
                  <ButtonLoader />
                </button>
              </div>
              :
              subscription !== "active" ?
                <div className="flex w-full justify-center my-10 uppercase"><button className="w-[80%] absolute bottom-3 px-10 py-1 bg-[#FFE147] text-black font-[600] hover:opacity-80 rounded-sm" onClick={() => {
                  setShowAddNewPlanConfirm(true);
                }}>Add</button></div>
                :
                (user?.account_details?.active_plan?.plan_id == plan?._id && user?.account_details?.active_plan?.duration === planDurationName) ?
                  <div className="flex w-full justify-center my-10 uppercase"><button className="w-[80%] absolute bottom-3 px-10 py-1 bg-gray-400 text-black font-[600] hover:opacity-80 rounded-sm" disabled>Current Plan</button></div>
                  :
                  <div className="flex w-full justify-center my-10 uppercase z-20"><button className="w-[80%] absolute bottom-3 px-10 py-1 bg-[#FFE147] text-black font-[600] hover:opacity-80 rounded-sm" onClick={() => setShowUpdatePlanConfirm(true)}>Update</button></div>
          }
        </div>
      </div>
    </>
  )
}

export default PaymentCardClient;
