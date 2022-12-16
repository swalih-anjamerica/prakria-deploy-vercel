import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

function PricingCard({
  title,
  description,
  monthlyAmount,
  yearlyAmount,
  quaterlyAmount,
  features,
  duration,
  select = true,
}) {
  const [planMonthShow, setPlanMonthShow] = useState(true);
  const [planQuaterlyShow, setPlanQuaterlyShow] = useState(false);
  const [planYearlyShow, setPlanYearlyShow] = useState(false);

  const [amount, setAmount] = useState(null);
  let { role } = useAuth();

  useEffect(() => {
    if (!duration) return;
    duration.forEach((plan, index) => {
      switch (plan.duration_name) {
        case "weekly":
          setAmount(plan.amount);
          break;
        case "monthly":
          setAmount(plan.amount);
          break;
        case "quarterly":
          setAmount(plan.amount);
          break;
        case "yearly":
          setAmount(plan.amount);
          break;
      }
    });
  }, [planMonthShow, planQuaterlyShow, planYearlyShow]);

  return (
    <div className="flex flex-col w-full max-w-sm px-5 xl:px-12 pb-12 space-y-6 bg-primary-white rounded-lg shadow-xl pt-12">
      <div className="my-2 flex w-min border-2  justify-between rounded-xl">
        <span
          className={`py-1 px-2 rounded-xl cursor-pointer ${
            planMonthShow
              ? "bg-primary-blue text-white"
              : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue hover:opacity-60"
          }`}
          onClick={() => {
            setPlanMonthShow(true);
            setPlanQuaterlyShow(false);
            setPlanYearlyShow(false);
          }}
        >
          Monthly
        </span>
        <span
          className={`py-1 px-2 rounded-xl mx-1 cursor-pointer ${
            planQuaterlyShow
              ? "bg-primary-blue text-white"
              : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue hover:opacity-60"
          }`}
          onClick={() => {
            setPlanMonthShow(false);
            setPlanQuaterlyShow(true);
            setPlanYearlyShow(false);
          }}
        >
          Quarterly
        </span>
        <span
          className={`py-1 px-2 rounded-xl cursor-pointer ${
            planYearlyShow
              ? "bg-primary-blue text-white"
              : "text-primary-text-gray hover:text-primary-white hover:bg-primary-blue hover:opacity-60"
          }`}
          onClick={() => {
            setPlanMonthShow(false);
            setPlanQuaterlyShow(false);
            setPlanYearlyShow(true);
          }}
        >
          Yearly
        </span>
      </div>

      <div className="flex-shrink-0">
        <span className="text-4xl font-bold tracking-tight">
          <span className="text-xl">$&nbsp;</span>
          {duration
            ? amount
            : planMonthShow
            ? monthlyAmount
            : planQuaterlyShow
            ? quaterlyAmount
            : planYearlyShow && yearlyAmount}
        </span>
        <span className="text-primary-text-gray">&nbsp;/month</span>
      </div>

      <div className="flex-shrink-0 pb-6 space-y-2 border-b">
        <h2 className="text-2xl font-normal">{title}</h2>
        <p className="text-sm text-primary-text-gray">{description}</p>
      </div>

      <ul className="flex-1 space-y-4">
        {features &&
          features.map((values, index) => {
            return (
              <React.Fragment key={index}>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-blue"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-3 text-base font-medium">{values}</span>
                </li>
              </React.Fragment>
            );
          })}
      </ul>

      {select && role != "admin" && (
        <div className="flex-shrink-0 pt-4">
          <button className="inline-flex items-center justify-center w-full max-w-xs px-4 py-2 transition-colors border rounded-full focus:outline-none focus:ring-2 select-none  focus:ring-primary-blue hover:bg-primary-blue hover:text-primary-white">
            Select
          </button>
        </div>
      )}
    </div>
  );
}

export default PricingCard;
