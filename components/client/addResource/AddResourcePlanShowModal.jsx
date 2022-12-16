import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { listSkills } from "../../../services/skills";
import {
  createNormalPaymentIntentService,
  listSavedCardsService,
} from "../../../services/stripe";
import Loader from "../../layouts/Loader";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import ButtonLoader from "../../common/ButtonLoader";
import { useAuth } from "../../../hooks/useAuth";
import accountService, { renewResourceService } from "../../../services/account";
import { useRouter } from "next/router";
import { MdClose } from "react-icons/md";
import { HiOutlineCheckCircle } from "react-icons/hi"
import utils from "../../../helpers/utils";

function AddResourcePlanShowModal({ setShowModal, skillId, resourceExpirDate = null, resourceRenew = false }) {
  const [activeTab, setActiveTab] = useState("plans")
  const { user } = useAuth();
  const [amount, setAmount] = useState(null);
  const [duration, setDuration] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [payingAmount, setPayingAmount] = useState(false);
  const [payingMessage, setPayingMessage] = useState("");
  const [stripePayCardId, setStripePayCardId] = useState(null);
  const stripe = useStripe();
  const { data: skillResponse, isLoading } = useQuery("skill-details", () => {
    return listSkills(skillId);
  })
  const { data: creditCards } = useQuery("credit-cards", () => {
    return listSavedCardsService();
  }, {
    select: items => items.data
  })
  const router = useRouter();
  
  useEffect(() => {
    if (!creditCards) {
      return;
    }
    setStripePayCardId(creditCards?.default_source)
  }, [creditCards])

  useEffect(() => {
    return () => {
      setPayingAmount(false);
    }
  }, [])

  const handleResourceRenew = async () => {
    if (!skillResponse?.data) return;
    if (!amount || !duration || !skillId || !currency || !user?.account_details?.stripe_customer_id || !stripePayCardId) {
      return;
    }
    // const isConfirm = confirm("Add new resource?");
    // if (!isConfirm) return;
    try {
      setPayingAmount(true);
      setPayingMessage("Creating payment");
      const skillData = skillResponse?.data;
      const description = `${skillData.skill_name} - ${duration} renew`;
      const intentCreateResponse = await createNormalPaymentIntentService(amount, currency, user?.account_details?.stripe_customer_id, description, stripePayCardId);
      setPayingMessage("Confirming payment");
      const confirmResponse = await stripe.confirmCardPayment(intentCreateResponse.data?.payment_intent_secret);
      if (confirmResponse.error) {
        setPayingAmount(false);
        setPayingMessage("");
        toast(confirmResponse.error.message + " 🚫️", {
          duration: 15000,
          style: { minWidth: "40%" }
        });
        return;
      }
      setPayingMessage("Renewing resource");

      const stripeData = {
        stripe_payment_method_id: confirmResponse.paymentIntent.payment_method,
        stripe_amount: confirmResponse.paymentIntent.amount,
        stripe_currency: confirmResponse.paymentIntent.currency,
        stripe_payment_id: confirmResponse.paymentIntent.id,
        stripe_client_secret: confirmResponse.paymentIntent.client_secret
      }

      // resource renew func
      await renewResourceService(skillId, duration, resourceExpirDate, stripeData);

      toast.success("resource renewed successfully.");
      setTimeout(() => {
        router.reload();
      }, 800)
    } catch (e) {
      setPayingMessage("");
      setPayingAmount(false);
    }
  }

  const handleAddResourcePayment = async () => {
    if (!skillResponse?.data) return;
    if (!amount || !duration || !skillId || !currency || !user?.account_details?.stripe_customer_id || !stripePayCardId) {
      return;
    }
    // const isConfirm = confirm("Add new resource?");
    // if (!isConfirm) return;
    try {
      setPayingAmount(true);
      setPayingMessage("Creating payment");
      const skillData = skillResponse?.data;
      const description = `${skillData.skill_name} - ${duration}`;
      const intentCreateResponse = await createNormalPaymentIntentService(amount, currency, user?.account_details?.stripe_customer_id, description, stripePayCardId);
      setPayingMessage("Confirming payment");
      const confirmResponse = await stripe.confirmCardPayment(intentCreateResponse.data?.payment_intent_secret);
      if (confirmResponse.error) {
        setPayingAmount(false);
        setPayingMessage("");
        toast(confirmResponse.error.message + " 🚫️", {
          duration: 15000,
          style: { minWidth: "40%" }
        });
        return;
      }
      setPayingMessage("Updating account");
      const stripeData = {
        stripe_payment_method_id: confirmResponse.paymentIntent.payment_method,
        stripe_amount: confirmResponse.paymentIntent.amount,
        stripe_currency: confirmResponse.paymentIntent.currency,
        stripe_payment_id: confirmResponse.paymentIntent.id,
        stripe_client_secret: confirmResponse.paymentIntent.client_secret
      }
      await accountService.addNewResourceService(skillId, duration, confirmResponse.paymentIntent?.id, stripeData);
      toast.success("resource added successfully.");
      setTimeout(() => {
        router.push("/account?tab=plan");
      }, 300)
    } catch (e) {
      setPayingMessage("");
      setPayingAmount(false);
    }
  }


  if (isLoading) {
    return (
      <div
        className={`fixed z-10 inset-0 overflow-y-auto `}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div
        className={`fixed z-10 inset-0 overflow-y-auto  modal-animation`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            aria-hidden="true"
          />
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="relative inline-block align-bottom bg-primary-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[80%] xl:w-[60%] modal-body-animation">
            <div className="p-10 bg-primary-white  my-auto gap-4">
              <div className="col-span-12 mb-5 flex justify-between">
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  <MdClose className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-center items-center">
                {activeTab == "plans" ? (
                  <div className="mr-8 flex p-6 font-medium text-xl">
                    {skillResponse?.data?.pricing?.map((skill, index) => {
                      const amount = skill.amount?.find(
                        (value) => value.currency == "gbp"
                      );
                      return (
                        <React.Fragment key={index}>
                          <span className="flex-col text-center text-[#414040]">
                            <p>£{amount?.amount}</p>
                            <p>{utils.numberLetterSepratForResource(skill.duration_name)}</p>
                            <button
                              className="btn-ylw-rsc-mdl  "
                              onClick={() => {
                                setAmount(amount?.amount);
                                setCurrency(amount?.currency);
                                setDuration(skill.duration_name);
                                setActiveTab("card");
                              }}
                              style={{ fontWeight: "600" }}
                            >
                              {
                                resourceRenew ?
                                  `Renew To ${skill.duration_name}`
                                  :
                                  "Add To Plan"
                              }
                            </button>
                          </span>
                          {index < 2 && (
                            <div className="w-0.5 h-28 mx-6  bg-primary-black my-auto"></div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-[80%] flex flex-col justify-center items-center">
                    <div className="flex w-full justify-center text-xl mb-10">
                      <label className="">Saved Cards</label>
                    </div>
                    {/* Default */}
                    {creditCards?.cards?.map((card, index) => {
                      return (
                        <div
                          className="flex w-full items-center gap-3 mb-7 cursor-pointer"
                          key={index}
                          onClick={() => {
                            setStripePayCardId(card.id);
                          }}
                        >
                          {card.id === stripePayCardId && (
                            <HiOutlineCheckCircle className="h-10 w-10 text-green-500" />
                          )}
                          <div className="flex h-min justify-between w-full bg-primary-gray px-5 py-3 rounded-md">
                            <span className="">
                              XXXX &nbsp;&nbsp;XXXX &nbsp;&nbsp;{card.last4}
                            </span>
                            <span className="">
                              {card.exp_month < 10
                                ? "0" + card.exp_month
                                : card.exp_month}
                              /{card.exp_year?.toString().substring(2, 4)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex w-full justify-end  gap-3">
                      <div className="my-5">
                        {payingAmount ? (
                          <button
                            className="bg-primary-yellow px-3 py-2 my-1 rounded text-lg"
                            onClick={handleAddResourcePayment}
                          >
                            <ButtonLoader message={payingMessage} />
                          </button>
                        ) : (
                          <button
                            className="bg-primary-yellow px-3 py-2 my-1 rounded text-lg"
                            onClick={resourceRenew ? handleResourceRenew : handleAddResourcePayment}
                          >
                            Continue Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddResourcePlanShowModal;