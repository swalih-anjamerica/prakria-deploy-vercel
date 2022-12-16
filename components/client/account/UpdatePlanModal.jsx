import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAuth } from "../../../hooks/useAuth";
import { listUpgradePlansService } from "../../../services/plans";
import ButtonLoader from "../../common/ButtonLoader";
import { Modal } from "../../common/Modal";
import Loader from "../../layouts/Loader";
import PaymentCardClient from "./PaymentCardClient";

function UpdatePlanModal({
  setShowUpdatePlanModal,
  STRIPE_PUBLIC_KEY,
  showUpdatePlanModal,
}) {
  const [totalResources, setTotalResources] = useState([]);
  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  const { subscription, role } = useAuth();
  const { data: plans, isLoading } = useQuery(
    "client-update-plans",
    () => {
      return listUpgradePlansService();
    },
    {
      select: (data) => data.data,
      enabled: (role == "client_admin" || role == "client_member") && !!role,
    }
  );


  useEffect(() => {
    if (!plans) return;
    const benefites = plans.reduce((prev, curr) => {
      let skills = curr.skills.filter(skill => !prev.find(item => item.skill_name?.toLowerCase() == skill?.skill_name?.toLowerCase()));
      return [...prev, ...skills];
    }, [])
    setTotalResources(benefites);
  }, [plans])

  return (
    <Modal
      title="Select a plan"
      showModal={showUpdatePlanModal}
      setShowModal={setShowUpdatePlanModal}
      className="w-fit max-w-[100vw]"
    >
      {isLoading ? (
        <div className="grid grid-flow-row grid-cols-1 w-[50vw]  gap-4">
          <Loader height={"50vh"} />
        </div>
      ) : (
        <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-3  gap-4">
          {plans && plans?.length > 0 ? (
            plans?.map((plan, index) => {
              return (
                <Elements stripe={stripePromise} key={index}>
                  <PaymentCardClient
                    setShowModal={setShowUpdatePlanModal}
                    plan={plan}
                    subcriptionStatus={subscription}
                    client={true}
                    STRIPE_PUBLIC_KEY={STRIPE_PUBLIC_KEY}
                    index={index}
                    totalResources={totalResources}
                  />
                </Elements>
              );
            })
          ) : (
            <h1 className="component-heading">No Plans Available!</h1>
          )}
        </div>
      )}
    </Modal>
  );
}

export default UpdatePlanModal;
