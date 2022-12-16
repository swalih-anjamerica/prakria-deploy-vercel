import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useQuery } from "react-query";
import ButtonLoader from "../../../components/common/ButtonLoader";
import Loader from "../../../components/layouts/Loader";
import PMAssignModal from "../../../components/su_admin/PMAssignModal";
import utils from "../../../helpers/utils";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import User from "../../../models/users";
import { getClientAllDetails } from "../../../services/clients";
import { listClientPaymentsService } from "../../../services/payments";

function ClientDetails() {
  const router = useRouter();
  const { clientID } = router.query;
  const [tab, setTab] = useState("ACCOUNT_DETAILS");
  const [updateTime, setUpdateTime] = useState(null);
  // react querys
  const { data, isLoading, isError } = useQuery(
    ["list-client-all-details", updateTime],
    () => {
      return getClientAllDetails(clientID);
    },
    {
      enabled: !!clientID,
    }
  );
  const { from, to } = router.query;
  // const [fromDate, setFromDate] = useState();
  // const [endDate, setEndDate] = useState();
  const [page, setPage] = useState(1);
  const [listByMonth, setListByMonth] = useState(false);
  const [showPmAssignModal, setPmAssignModal] = useState(false);

  const { setHeaderMessage } = useAuthLayout();

  useEffect(() => {
    setHeaderMessage("Client Details");
    return () => {
      setHeaderMessage(null);
    };
  }, []);

  const { data: paymentResponse, isLoading: paymentLoading } =
    listClientPaymentsService({ from, to, page, listByMonth, clientID });
  return (
    <>
      <PMAssignModal
        projectManager={data?.data?.project_manager}
        showModal={showPmAssignModal}
        setShowModal={setPmAssignModal}
        account={data?.data?.account_details}
        setUpdateTime={setUpdateTime} />
      <div className="flex justify-center items-center">
        {/* Details */}

        {isLoading ? (
          <Loader />
        ) : (
          <div className="mx-auto w-[90%] rounded-2xl shadow-lg pb-5">
            <div className="flex justify-start gap-3 items-center px-5 bg-gray-100 w-full h-16 rounded-t-2xl">
              <span
                className={`px-5 py-2 cursor-pointer rounded-lg ${tab === "ACCOUNT_DETAILS" ? "bg-white" : ""
                  }`}
                onClick={() => setTab("ACCOUNT_DETAILS")}
              >
                Account Details
              </span>
              {/* <span className={`px-5 py-2 cursor-pointer rounded-lg ${tab === "PROJECT_DETAILS" ? "bg-white" : ""}`} onClick={() => setTab("PROJECT_DETAILS")}>Project Details</span> */}
              <span
                className={`px-5 py-2 cursor-pointer rounded-lg ${tab === "PLAN_DETAILS" ? "bg-white" : ""
                  }`}
                onClick={() => setTab("PLAN_DETAILS")}
              >
                Plan Details
              </span>
              <span
                className={`px-5 py-2 cursor-pointer rounded-lg ${tab === "PAYMENT_DETAILS" ? "bg-white" : ""
                  }`}
                onClick={() => setTab("PAYMENT_DETAILS")}
              >
                Payments
              </span>
            </div>
            <div className="">
              {tab === "ACCOUNT_DETAILS" ? (
                <>
                  <div className="flex justify-around my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        First Name
                      </label>
                      <input
                        value={data?.data?.first_name}
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 md:w-full  px-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">Last Name</label>
                      <input
                        value={data?.data?.last_name}
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 md:w-full px-5"
                      />
                    </div>
                  </div>
                  <div className="flex justify-around my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">Company</label>
                      <input
                        value={
                          data?.data?.account_details?.company_address
                            ?.company_name
                        }
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        Designation
                      </label>
                      <input
                        value={data?.data?.designation}
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                  </div>

                  <div className="flex justify-around my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">Time Zone</label>
                      <input
                        value={data?.data?.time_zone}
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        Phone Number
                      </label>
                      <input
                        value={data?.data?.mobile_number}
                        disabled
                        type="number"
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                  </div>
                  <div className="flex justify-around  my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">Email</label>
                      <input
                        value={data?.data?.email}
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                    {/* <div className=" flex flex-col w-full px-5"></div> */}
                  </div>
                </>
              ) : tab === "PROJECT_DETAILS" ? (
                <>
                  <div className="flex justify-around my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        First Name
                      </label>
                      <input
                        value="Afham"
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">Last Name</label>
                      <input
                        value="K"
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                  </div>
                  <div className="flex justify-around my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">Company</label>
                      <input
                        value="ANJ America"
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        Designation
                      </label>
                      <input
                        value="Developer"
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                  </div>
                  <div className="flex justify-around my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">Time Zone</label>
                      <input
                        value="New delhi"
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        Phone Number
                      </label>
                      <input
                        value="813898768"
                        disabled
                        type="number"
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                  </div>
                  <div className="flex w-full my-10">
                    <div className="flex flex-col self-center">
                      <label className="text-gray-700 text-base">Email</label>
                      <input
                        value="Afham@gmail.com"
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 px-5"
                      />
                    </div>
                    <div className=" flex flex-col w-full px-5"></div>
                  </div>
                </>
              ) : tab === "PLAN_DETAILS" ? (
                <>
                  <div className="flex justify-around my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        Plan Title
                      </label>
                      <input
                        value={data?.data?.plan_details?.title}
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        Plan Duration
                      </label>
                      <input
                        value={data?.data?.account_details?.active_plan?.duration}
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                  </div>

                  <div className="flex justify-around my-10">
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        Project manager Name
                      </label>
                      <div className="flex">
                        <input
                          value={
                            data?.data?.project_manager ?
                              data?.data?.project_manager?.first_name +
                              " " +
                              data?.data?.project_manager?.last_name
                              :
                              "-- --"
                          }
                          disabled
                          className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                        />
                        <button onClick={() => setPmAssignModal(true)}>
                          <BiEdit className="ml-2 h-6 w-6" title="Assign new project manager" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 text-base">
                        Project manager Email
                      </label>
                      <input
                        value={data?.data?.project_manager?.email}
                        disabled
                        className="border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-full px-5"
                      />
                    </div>
                  </div>
                </>
              ) : (
                tab === "PAYMENT_DETAILS" && (
                  <div>
                    {paymentLoading ? (
                      <div className="mt-32">
                        <ButtonLoader />
                      </div>
                    ) : (
                      <div
                        className=" w-full flex-1 p-6 xl:p-11"
                        id="payment-list"
                      >
                        {paymentResponse?.payments?.map((payment, index) => {
                          const date = payment._id;
                          return (
                            <div key={index}>
                              <div className="bg-secondry-gray flex-col mt-8 px-5 py-8 rounded-xl">
                                <div className="component-heading">
                                  {utils.convertNumToMonth(date.month)}
                                  {!listByMonth && "." + date.day}
                                </div>
                                {payment.payments?.map((value, index) => {
                                  const planDetails = value.plan_details;
                                  const resource = value.resource_details;
                                  return (
                                    <div
                                      className="flex justify-between border-b-2 border-primary-text  mt-5 py-2"
                                      key={index}
                                    >
                                      <div className="normal-black-text capitalize">
                                        {planDetails
                                          ? planDetails.title
                                          : resource && resource.skill_name}
                                        {resource &&
                                          " - " + value.resource_duration}
                                      </div>
                                      <div className="normal-black-text ">
                                        ${(value.paid_amount / 100).toFixed(2)}
                                      </div>
                                    </div>
                                  );
                                })}
                                <div className="normal-black-text text-right mt-5 capitalize">
                                  Total - $
                                  {(payment.total_amount / 100).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div className="flex justify-between mt-6">
                          {/* <button className="font-medium text-secondry-text  bg-[#FFE147]	 transition-colors duration-150 hover:bg-secondry-yellow justify-center items-center text-base xl:text-xl rounded-md px-4 py-1 md:40 xl:w-56">PDF download</button> */}
                          {listByMonth ? (
                            <div
                              className="text-primary-text font-medium text-sm self-center cursor-pointer"
                              onClick={(e) => {
                                setListByMonth(false);
                              }}
                            >
                              View more
                            </div>
                          ) : (
                            <div
                              className="text-primary-text font-medium text-sm self-center cursor-pointer"
                              onClick={(e) => {
                                setListByMonth(true);
                              }}
                            >
                              View less
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}


export default ClientDetails;
