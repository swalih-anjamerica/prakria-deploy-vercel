import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ButtonLoader from "../../common/ButtonLoader";
import { getPaymentInvoiceService, listClientPaymentsService } from '../../../services/payments';
import { GoSearch } from "react-icons/go";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import utils from "../../../helpers/utils";
import toast from "react-hot-toast";
import { useAccount } from "../../../hooks/useAccount";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import { IoMdDownload } from "react-icons/io"
import { getCurrencySympol } from "../../../helpers/currency.helper";
import { HiDownload } from "react-icons/hi";
import { CalanderIcon } from "../../../helpers/svgHelper";


function PaymentScreen() {
  const router = useRouter();
  const { from, to } = router.query;
  const { setHeaderMessage } = useAuthLayout();
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const [fromDate, setFromDate] = useState();
  const [endDate, setEndDate] = useState();
  const [page, setPage] = useState(1);
  const [listByMonth, setListByMonth] = useState(false);
  const { activePlan: activePlanResponse, planLoading, setPlanUpdateTime } = useAccount();
  const { data: response, isLoading, error } = listClientPaymentsService({ from, to, page, listByMonth });
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  function handleQuerys() {
    toast.dismiss();
    if (fromDate && !endDate) {
      toast.error("To date required");
    }
    if (fromDate && endDate) {
      router.push(`/account?tab=payments&from=${fromDate}&to=${endDate}`)
    }
  }

  async function handleDownloadPaymentPdf() {
    try {
      setDownloadingPdf(true);
      const items = document.querySelector("#payment-list");
      let date = new Date();
      var HTML_Width = items.clientWidth;
      var HTML_Height = items.clientHeight;
      var top_left_margin = 15;
      var PDF_Width = HTML_Width + (top_left_margin * 2);
      var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      var canvas_image_width = HTML_Width;
      var canvas_image_height = HTML_Height;
      var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      html2canvas(items, { allowTaint: true, }).then(function (canvas) {
        canvas.getContext('2d');
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) {
          pdf.addPage(PDF_Width, PDF_Height);
          pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }
        pdf.save(`payment_receipt${date.getTime()}.pdf`);
        setDownloadingPdf(false);
      });
    } catch (e) {
      setDownloadingPdf(false);
    }
  }
  async function handleDownloadInvoice(payment_id) {
    try {
      toast.loading("Loading invoice");
      const response = await getPaymentInvoiceService({ payment_id });
      const invoiceUrl = response?.data?.url;
      router.push(invoiceUrl);
    } catch (e) {
      toast.dismiss();
      toast.error("Invoice not found");
    }
  }

  useEffect(() => {
    setHeaderMessage("Here are your payment details");
    // date max limit
    fromDateRef.current.max = new Date().toISOString().split("T")[0];
    toDateRef.current.max = new Date().toISOString().split("T")[0];
    return () => {
      setHeaderMessage(null);
    }
  }, [])

  return (
    <>
      <img src="" id="demo-img" alt="" />
      <div className="pr-7 pl-6 xl:px-9 flex py-4 gap-4">
        <div className="flex flex-1">
          <div className="max-w-[380px] min-w-[200px] flex flex-1 items-center border border-primary-gray px-3 py-1">
            <GoSearch className="-ml-1 h-5 w-5 text-primary-blue" />
            <input type="text" className="search-bar " placeholder="Search" />
          </div>
        </div>
        <label className="flex flex-row items-center gap-2 appearance-none border-none focus:outline-none  py-1 px-2 leading-tight bg-[#F8F8F8] relative">
          <input
            type="date"
            placeholder="24/7/21"
            className="bg-[#F8F8F8] placeholder:text-[#717070] md:w-32 xl:w-48 outline-none new-calendar-icon"
            onChange={e => {
              setFromDate(e.target.value);
              // toDateRef.current?.max = new Date(e.target.value).toISOString().split("T")[0];
            }}
            ref={fromDateRef}
          />
        </label>

        <div className=" flex font-semibold text-[#787878]">
          <p className="self-center">to</p>
        </div>
        <label className="flex flex-row items-center gap-2 appearance-none border-none focus:outline-none  py-1 px-2 leading-tight bg-[#F8F8F8] min-w-[145px] relative">
          <input
            type="date"
            placeholder="24/7/21"
            className="bg-[#F8F8F8] placeholder:text-[#717070] md:w-32 xl:w-48 outline-none new-calendar-icon"
            onChange={e => {
              setEndDate(e.target.value);
              fromDateRef.current.max = new Date(e.target.value).toISOString().split("T")[0];
            }}
            ref={toDateRef}
          />
        </label>
        <button className="yellow-md-action-button md:w-24  xl:w-48" onClick={handleQuerys}>Search</button>
      </div>

      {isLoading ? (
        <div className="mt-32">
          <ButtonLoader />
        </div>
      ) : (
        <div className=" w-full flex-1 p-7 px-6 xl:p-11 x xl:px-9">
          <div className="flex justify-between px-10">
            <p className="font-semibold">Your Billing Date  &nbsp; &nbsp; <span>
              {utils.projectExpectedTimeDateFormate(new Date(activePlanResponse?.stripe_subscription_end))}
            </span></p>
            <p className="text-sm">Subject to change when you pause the plan</p>
          </div>

          <div id="payment-list">
            {
              response?.payments?.map((payment, index) => {
                const date = payment._id;
                return (
                  <div key={index}>
                    <div className="bg-secondry-gray flex-col mt-8 px-10 py-8 rounded-xl">
                      <div className="component-heading">
                        {utils.convertNumToMonth(date.month)}{!listByMonth && " " + date.day}
                      </div>
                      {
                        payment.payments?.map((value, index) => {

                          const planDetails = value.plan_details;
                          const resource = value.resource_details;
                          return (
                            <div className="flex justify-between border-b-2 border-primary-text  mt-5 py-2" key={index} >
                              <div className="normal-black-text capitalize" style={{ color: "#414040" }}>
                                {planDetails ? planDetails.title : resource && resource.skill_name}
                                {
                                  resource && " - " + utils.numberLetterSepratForResource(value.resource_duration)
                                }
                              </div>
                              <div className="normal-black-text flex gap-5" style={{ color: "#414040" }}>
                                <p>
                                  {getCurrencySympol(value.paid_currency)}{(value.paid_amount / 100).toFixed(2)}
                                </p>
                                <div className="cursor-pointer hover:opacity-80" title="Download invoice" onClick={() => handleDownloadInvoice(value.stripe_payment_id)
                                }>
                                  <HiDownload />
                                </div>
                              </div>

                            </div>
                          )
                        })
                      }
                      <div className="normal-black-text text-right mt-5 capitalize mr-5" style={{ color: "#414040", fontWeight: "600" }}>Total &nbsp;&nbsp; {getCurrencySympol(payment.payments[0].paid_currency)}{(payment.total_amount / 100).toFixed(2)}</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="flex justify-between mt-6">
            {
              response?.payments?.length <= 0 &&
              <h1 className="component-heading">No payments found</h1>
            }
            {
              response?.payments?.length > 0 &&
              <button className="font-medium text-[#000000] flex gap-1 bg-[#FFE147]	 transition-colors duration-150 hover:bg-secondry-yellow justify-center items-center text-base xl:text-xl rounded-md px-3 py-1 md:40 xl:w-56" onClick={handleDownloadPaymentPdf}>
                <IoMdDownload />
                {
                  downloadingPdf ? <ButtonLoader message={"Downloading.."} /> : "PDF Download"
                }
              </button>
            }
            {
              response?.payments?.length > 0 &&
              <>
                {
                  listByMonth ?
                    <div className="text-primary-text font-medium text-sm self-center cursor-pointer" onClick={e => {
                      setListByMonth(false);
                    }}>View more</div>
                    :
                    <div className="text-primary-text font-medium text-sm self-center cursor-pointer" onClick={e => {
                      setListByMonth(true);
                    }}>View less</div>
                }
              </>
            }
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentScreen;
