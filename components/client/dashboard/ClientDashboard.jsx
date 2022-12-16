import { useRouter } from "next/router";
import { AiFillCaretRight } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { useQuery } from "react-query";
import { getPusherKeysService } from "../../../services/dev";
import UpdatePlanModal from "../account/UpdatePlanModal";
import Link from "next/link";
import Image from "next/image";

function ClientDashboard() {

  const GetPushersKeys = () => {
    return useQuery("envs", getPusherKeysService, {
      select: data => data.data
    })
  }

  const router = useRouter();
  const { role, user } = useAuth();
  const { setHeaderMessage } = useAuthLayout();
  const [showUpdatePlanModal, setShowUpdatePlanModal] = useState(false);
  const { data: envs } = GetPushersKeys() || {};


  useEffect(() => {
    setHeaderMessage(`Welcome ${user?.first_name?.split(" ")[0]}`);
    return () => {
      setHeaderMessage(null);
    };
  }, []);

  return (
    <>
      {/* plan update modal */}
      {
        (envs && showUpdatePlanModal) &&
        <UpdatePlanModal STRIPE_PUBLIC_KEY={envs?.STRIPE_PUBLIC_KEY} showUpdatePlanModal={showUpdatePlanModal} setShowUpdatePlanModal={setShowUpdatePlanModal} />
      }
      {/* end of plan update modal */}
      <div className="flex-1 min-h-screen ">
        <div className="bg-primary-white w-full px-3 flex border-y-2 border-primary-grey">
          <ul className="flex flex-1 self-center w-full px-9 py-3">
            <li className="mr-12">
              <a
                className="active-horizontal-nav-item-textstyle hover:text-primary-blue"
                href="#"
              >
                Home
              </a>
            </li>
          </ul>
        </div>

        <div className=" w-full flex-1 px-6 xl:px-11 mt-5 mb-5">
          <div className="grid grid-cols-12 gap-5 mt-0">
            <div
              className="w-full px-8 md:col-span-7 lg:col-span-7 py-8 shadow  flex-col  col-span-7 mx-auto rounded-[40px] relative"
              style={{
                background: `url(${"/assets/client-dashboard/blue_banner.png"})`,
                backgroundSize: "100% 100%",
              }}
            >
              <div className="dsh-h1">
                Now Customize Your<br /> Plan according to<br /> your need
              </div>
              <div className=" mt-[6vw] text-primary-white font-medium text-[14px] lg:text-[20px] break-words">
                <button
                  className="hover:opacity-80 py-1 flex items-center font-bold dashboard-text-two"
                  onClick={() => setShowUpdatePlanModal(true)}
                >
                  Update your current plan
                  <AiFillCaretRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <Link href={"/pricing"} passHref>
              <div className="relative shadow  flex-col  col-span-5 w-full bg-primary-gray mx-auto rounded-[40px]">
                <img
                  src="/assets/client-dashboard/Low-Cost_01.png"
                  className="h-full w-full rounded-[40px]"
                />
                <div className="img-gradient rounded-[40px]"></div>
                <span className="absolute bottom-[10%] left-[5%] lg:left-[10%] text-left text-primary-white font-bold text-[20px] xl:text-[25px] 2xl:text-4xl">
                  Get 1/10th the Cost of {"  "} <br /> Conventional Agencies!
                </span>
              </div>
            </Link>
            <div className="relative shadow  flex-col  col-span-5 w-full bg-primary-gray mx-auto rounded-[40px]">
              <img
                src="/assets/client-dashboard/looking-computer.png"
                className="h-full w-full rounded-[40px]"
              />
              {/* <img
                src="/assets/landing/Kohler_Logo.png"
                className="absolute top-8 left-8 h-5 w-28 xl:h-8 xl:w-36"
              /> */}
            </div>
            <div
              className="px-5 xl:px-10  md:col-span-7 lg:col-span-7 py-10 shadow w-full flex-col  col-span-7 mx-auto rounded-[40px] relative"
              style={{
                backgroundImage: `url(${"/assets/landing/bg_dashboard_green_update_plan.png"})`,
                backgroundSize: "100% 100%",
              }}
            >
              <div className="dsh-h1">
                Run Multiple Tasks Simultaneously
              </div>
              <div className=" text-primary-white font-medium text-[14px] lg:text-[20px] 2xl:text-[50px] break-words ">
                <button
                  className="hover:opacity-80 py-1 flex items-center dashboard-text-two"
                  onClick={() => router.push("/projects/create")}
                >
                  Create your project{" "}
                  <AiFillCaretRight className="h-[20px] w-[20px] text-white" />
                </button>
              </div>
            </div>
            <div className="relative shadow  h-full flex-col  col-span-12 w-full bg-primary-gray mx-auto rounded-[40px]">
              <img src="/assets/client-dashboard/multip-computer.png" className="h-full w-full rounded-[40px]"/>
              <div className="absolute top-0 flex flex-col justify-between h-full p-10 break-words text-primary-white font-bold text-[20px] xl:text-[25px] 2xl:text-4xl">
                <p>
                  Our DIRECT mantra: zero hassle,
                  <br />
                  great quality @ high speed
                  <br />
                </p>
                <button
                  className="hover:opacity-80 py-1 flex items-center font-bold dashboard-text-two"
                  onClick={() => router.push("/services")}
                >
                  Know more
                  <AiFillCaretRight className="h-[20px] w-[20px] text-white" />
                </button>
              </div>
            </div>
            <div className="relative shadow   flex-col mb-4 col-span-7 w-full bg-primary-gray mx-auto rounded-xl h-full">
              <img
                src="/assets/landing/icon_grp.jpg"
                className="max-h-full h-full w-full rounded-xl"
              />
              <h1 className="absolute dashboard-text-two top-[10%] left-[40px]">
                We&apos;ve earned the trust<br />
                of some of the best global<br />
                brands for over 2 decades
              </h1>
              <h1 className="absolute dashboard-text-two top-[42%] left-[40px]">It&apos;s time to earn your trust!</h1>
              <button className="hover:opacity-80 py-1 flex items-center dashboard-text-two bottom-[10%] absolute left-[40px]" onClick={() => router.push("/services")}>
                Check out our services  <AiFillCaretRight className="h-[20px] w-[20px] text-white" />
              </button>
            </div>
            <div
              className="relative px-10 py-8 shadow w-full h-full flex-col mb-4 col-span-5 mx-auto rounded-xl"
              style={{
                backgroundImage: `url(${"/assets/client-dashboard/red_banner_two.jpg"})`,
                backgroundSize: "cover",
                marginLeft: "2px",
              }}
            >
              <div className=" dsh-h1">
                Make
                <br /> unlimited <br /> revisions till <br /> you&apos;re fully{" "}
                <br /> satisfied!
              </div>


              <div className="absolute bottom-[10%] dashboard-text-two break-words">
                <button
                  className="hover:opacity-80 py-1 flex items-center font-bold 2xl:text-2xl"
                  onClick={() => router.push("/services")}
                >
                  Open your project
                  <AiFillCaretRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientDashboard;