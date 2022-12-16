import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import {
  listUpgradePlansService,
} from "../../../services/plans";
import Loader from "../../layouts/Loader";
import utils from "../../../helpers/utils";
import toast from "react-hot-toast";
import API from "../../../services/api";
import { Modal } from "../../../components/common/Modal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../../hooks/useAuth";
import PaymentCardClient from "./PaymentCardClient";
import { useRouter } from "next/router";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { useAccount } from "../../../hooks/useAccount";
import AddResourcePlanShowModal from "../addResource/AddResourcePlanShowModal";
import { stripeGetLatestInvoiceService } from "../../../services/stripe";
import ButtonLoader from "../../common/ButtonLoader";


function PlanScreen({ STRIPE_PUBLIC_KEY }) {
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showUpdatePlanModal, setShowUpdatePlanModal] = useState(false);
  const [resourceExpirDate, setResourceExpirDate] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const [latestInvoiceFetching, setLatestInvoiceFetching] = useState(false);
  const { subscription } = useAuth();
  const { activePlan: activePlanResponse, planLoading, setPlanUpdateTime } = useAccount();
  const router = useRouter();
  const { setHeaderMessage } = useAuthLayout();
  const { data: planResponse } = useQuery("client-update-plans", () => {
    return listUpgradePlansService();
  });
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  
  const handleCancelSubscription = async () => {
    const askPermission = confirm("Are you sure to cancel this subscription!");
    if (!askPermission) return;
    const stripeSubscriptionId = activePlanResponse?.active_plan?.subscription_id;
    if (!stripeSubscriptionId) {
      toast.error("No subscription found");
    }
    try {
      const response = await API.put(`/client/stripe/cancel-subscription`, {
        stripe_subscription_id: stripeSubscriptionId,
      });

      if (response.status === 200) {
        toast.success("Subscription cancelled successfully!");
        setTimeout(() => {
          router.reload();
        }, 800);
      }
    } catch (e) {
      switch (e?.response?.status) {
        case 400:
          toast.error(e?.response?.data?.error);
          break;
        case 405:
          toast("⚠️ You have no access to end this plan subscription.", {
            duration: 2000,
          });
          break;
        default:
          toast.error("Something went wrong! try again later.");
      }
    }
  }
  const handleRenewSkill = (skill_id, expireDate) => {
    setResourceExpirDate(expireDate);
    setSkillId(skill_id);
    setShowAddResourceModal(true);
  }
  const handleRenewPlanStripe = async () => {
    try {
      setLatestInvoiceFetching(true);
      const { data } = await stripeGetLatestInvoiceService();
      if (!data.invoicePaymentUrl) {
        setLatestInvoiceFetching(false);
        return;
      }
      router.push(data.invoicePaymentUrl);
    } catch (e) {
      setLatestInvoiceFetching(false);
    }
  }
  useEffect(() => {
    setPlanUpdateTime(Date.now());
    setHeaderMessage("Here are your plan details");
    return () => {
      setHeaderMessage(null);
    }
  }, [])

  if (planLoading) return <Loader />;
  return (
    <div className="w-full flex-1 p-5 xl:p-9">
      {/* <div className="component-heading">{response?.data?.plan_details?.title}</div> */}
      {showAddResourceModal && (
        <Elements stripe={stripePromise}>
          <AddResourcePlanShowModal
            setShowModal={setShowAddResourceModal}
            skillId={skillId}
            resourceRenew={true}
            resourceExpirDate={resourceExpirDate}
          />
        </Elements>
      )}
      <ul className="mt-5">
        <div className="pb-6">
          <span className="text-[20px] xl:text-[25px] font-bold text-[#414040]">
            Your current plan
          </span>
        </div>
        <li className="border-gray-400 rounded-lg flex-col  mb-6">
          <div className="w-full bg-[#E6E6E6] h-20 xl:h-28 rounded-[11px]">
            <div className="font-medium text-[20px] xl:text-[25px] capitalize flex items-center h-full justify-between px-10">
              <p>{activePlanResponse?.plan_details?.title} - {activePlanResponse?.active_plan?.duration}</p>
              {subscription === "active" ? (
                <button
                  className="plan-scrn-btns bg-[#FFE147]"
                  onClick={handleCancelSubscription}
                >
                  End Subscription
                </button>
              ) :
                subscription == "past_due" ?
                  <div className="flex gap-5">
                    <button
                      className="plan-scrn-btns bg-[#FFE147]"
                      onClick={handleCancelSubscription}
                    >
                      End Subscription
                    </button>
                    <button
                      className="plan-scrn-btns bg-[#ff9966]"
                      onClick={handleRenewPlanStripe}
                      disabled={latestInvoiceFetching}
                    >
                      {
                        latestInvoiceFetching ?
                          <ButtonLoader />
                          :
                          "Renew"
                      }
                    </button>
                  </div>
                  :
                  (
                    <button
                      className="plan-scrn-btns bg-red"
                      style={{ width:"200px", color: "#fff" }}
                    >
                      Subscription canceled
                    </button>
                  )}
            </div>
          </div>

          {showUpdatePlanModal && (
            <Modal
              title="Select a plan"
              showModal={showUpdatePlanModal}
              setShowModal={setShowUpdatePlanModal}
              className="w-[90%] xl:w-[70%]"
            >
              <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4">
                {planResponse.data && planResponse?.data.length > 0 ? (
                  planResponse?.data?.map((plan, index) => {
                    return (
                      <Elements stripe={stripePromise} key={index}>
                        <PaymentCardClient
                          setShowModal={setShowUpdatePlanModal}
                          plan={plan}
                          subcriptionStatus={
                            activePlanResponse?.subscription_status
                          }
                          client={true}
                          STRIPE_PUBLIC_KEY={STRIPE_PUBLIC_KEY}
                        />
                      </Elements>
                    );
                  })
                ) : (
                  <h1 className="component-heading">No Plans Available!</h1>
                )}
              </div>
            </Modal>
          )}
        </li>
        {activePlanResponse?.resources?.map((resource, index) => {
          let addResource = activePlanResponse.added_resources?.find(item => item.skill_id == resource._id) || {};
          return (
            <li
              className="border-gray-400 bg-[#F8F8F8] flex mb-2 px-6"
              key={resource._id}
            >
              <div className="select-none flex justify-between items-center bg-secondry-gray p-4 mt-3 w-full">
                <div>
                  <div className="font-medium text-xl capitalize">
                    {resource.skill_name}
                  </div>
                  <div className="flex items-center text-[#A0A0A0]">
                    Expires{" "}
                    {utils.projectExpectedTimeDateFormate(
                      new Date(addResource.end_date)
                    )}
                  </div>
                </div>

                <div>
                  <button onClick={() => {
                    handleRenewSkill(resource._id, addResource.end_date);
                  }} className="plan-scrn-btns bg-primary-cyan">
                    Renew
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PlanScreen;
