import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import NotificationModal from "./NotificationModal";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useAuthLayout } from "../../hooks/useAuthLayout";
import { useNotifications } from "../../hooks/useNotifications";
import Link from "next/link";
import { useAccount } from "../../hooks/useAccount";
import UpdatePlanModal from "../client/account/UpdatePlanModal";
import { useQuery } from "react-query";
import { getPusherKeysService } from "../../services/dev";
import { useRouter } from "next/router";
import { stripeGetLatestInvoiceService } from "../../services/stripe";
import ButtonLoader from "./ButtonLoader";

function Header() {
  const [showUpdatePlanModal, setShowUpdatePlanModal] = useState(false);
  let { role, user, subscription } = useAuth();
  let { headerMessage } = useAuthLayout();
  const { unreadLength, readAllNotifications } = useNotifications();
  const [showNotification, setShowNotification] = useState(false);
  const { activePlan } = useAccount();
  const { data: envs } = useQuery("envs", getPusherKeysService, {
    select: data => data.data
  })
  const router = useRouter();

  const { planTitle } = useMemo(() => {
    return {
      planTitle: activePlan?.plan_details?.title
    }
  }, [activePlan])


  // latest invoice stripe renew
  const [latestInvoiceFetching, setLatestInvoiceFetching] = useState(false);
  async function handleRenewPlanStripe() {
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
    setShowNotification(false);
  }, [router.pathname])
  useEffect(() => {
    const modal = document.getElementById("notification-modal-body");
    modal?.addEventListener("click", e => {
      setShowNotification(false);
    })
  }, [showNotification])

  return (
    <>
      {/* plan update modal */}
      {
        (envs && showUpdatePlanModal) &&
        <UpdatePlanModal STRIPE_PUBLIC_KEY={envs?.STRIPE_PUBLIC_KEY} showUpdatePlanModal={showUpdatePlanModal} setShowUpdatePlanModal={setShowUpdatePlanModal} />
      }
      {/* end of plan update modal */}
      <div
        className={`${(role == "project_manager" || role == "designer" || role == "creative_director") ? "h-[20vh] justify-end pb-5" : "h-[130px]"
          } relative w-full   flex flex-col flex-1 gap-2 pr-9 min-w-full`}
      >
        <div className=" w-full flex text-center justify-between max-w-full min-w-full">
          <div className="flex flex-1 justify-between">
            <h1 className="text-primary-text text-xl xl:text-3xl font-medium tracking-wide self-center whitespace-nowrap pt-8 px-6 xl:px-9">
              {
                headerMessage ?
                  headerMessage
                  : ""
              }
            </h1>
            <div className="flex space-x-4 self-end mb-2">
              <div className="self-center bg-primary-black opacity-20 rounded-full w-8 h-8">
                <Link href="/account?tab=account_details">
                  <div className="text-center font-thin text-2xl text-white cursor-pointer">
                    {user?.first_name[0]?.toUpperCase()}
                  </div>
                </Link>
              </div>
              <div className="flex self-center relative">
                {/* <Link href="/account/notificationcard"> */}
                <button
                  className="ml-5 self-center"
                  onClick={() => {
                    // readAllNotifications();
                    setShowNotification(!showNotification)
                  }}
                  id="notification-icon"
                >
                  <MdOutlineNotificationsActive className="w-8 h-8 opacity-30" id="notification-icon" />
                  {unreadLength > 0 && (
                    <span className="absolute bg-red bottom-[0.125rem] justify-center items-center right-[1.25rem] h-[1rem] w-[1rem] rounded-full">
                      <p className="text-white font-semibold text-xs self-center">{unreadLength}</p>
                    </span>
                  )}
                </button>
                {/* </Link> */}
                {showNotification && (
                  <div className="absolute right-0 z-10 top-[3rem]">
                    <NotificationModal setShowNotification={setShowNotification} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {
          (role === "client_admin") &&
          <div className="flex items-center justify-end my-0">
            <div className="flex items-center px-4 py-2 bg-[#D9D9D9] rounded-lg">
              {
                subscription === "active" ?
                  <div className="flex justify-between items-center gap-4">
                    <div className="text-primary-blue uppercase text-md self-center font-semibold">
                      PLAN : {planTitle}
                    </div>
                    <div>
                      <button className="bg-primary-blue text-primary-white text-md px-4 py-0.5 items-center rounded-sm w-[170px] h-[30px]" onClick={() => {
                        setShowUpdatePlanModal(true);
                      }}>
                        Change Plan
                      </button>
                    </div>
                  </div>
                  :
                  subscription === "past_due" ?
                    <div className="flex justify-between items-center gap-4 ">
                      <div className="text-primary-blue uppercase text-md self-center font-semibold">
                        PLAN : {planTitle}
                      </div>
                      <div>
                        <button className="bg-[#ff9966] text-black text-md px-4 py-0.5 rounded-sm w-[170px] h-[30px] items-center" onClick={handleRenewPlanStripe} disabled={latestInvoiceFetching}>
                          {
                            latestInvoiceFetching ?
                              <ButtonLoader />
                              :
                              "Renew"
                          }
                        </button>
                      </div>
                    </div>
                    :
                    <div className="flex justify-between items-center gap-4 ">
                      <div className="text-red-600 uppercase text-md self-center font-semibold">
                        Subscription Cancelled
                      </div>
                      <div>
                        <button className="bg-primary-blue text-primary-white text-md px-4 py-0.5 rounded-sm w-[170px] h-[30px] items-center" onClick={() => {
                          setShowUpdatePlanModal(true);
                        }}>
                          Add New Plan
                        </button>
                      </div>
                    </div>
              }
            </div>
          </div>
        }
      </div>

    </>
  );
}

export default Header;
