import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSearchAlt2 } from "react-icons/bi"
import { PolygonIcon } from "../../../helpers/svgHelper";


export const FilterComponentPM = ({ setShowFilter }) => {
  const router = useRouter();
  const { status, from, to } = router.query;

  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [statusValue, setStatusValue] = useState(status || "all");

  function handleSearch() {
    if ((fromDate && !toDate) || (toDate && !fromDate)) {
      return toast.error("both from and to dates required.");
    }
    setShowFilter(false);
    if (!fromDate) {
      return router.push(`/dashboard?status=${statusValue}`);
    }
    setShowFilter(false);
    return router.push(
      `/dashboard?status=${statusValue}&from=${fromDate}&to=${toDate}`
    );
  }

  return (
    <>
      <div className="h-full w-full fixed left-[-9px] top-0" id="filter-modal-body"></div>
      <div
        className={`absolute p-4 w-96 bg-[#3B85F5] grid grid-cols-12 gap-4  shadow rounded-lg`}
      >
        <div className="col-span-12">
          <div className="flex-col w-full text-white text-2xl">Date</div>
        </div>
        <div className="col-span-6 ">
          <div className="flex-col  w-full">
            <label className="form-label-white" htmlFor="Company name">
              From
            </label>
            <input
              className=" form-input-white "
              id="username"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={
                toDate ?
                  new Date(toDate).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
            />
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex-col  w-full ">
            <label className="form-label-white" htmlFor="Website">
              To
            </label>
            <input
              className="form-input-white mt-auto "
              id="username"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={
                fromDate ?
                  new Date(fromDate).toISOString().split("T")[0]
                  : null
              }
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div className="col-span-9">
          <div className="flex-col  w-full ">
            <label className="form-label-white" htmlFor="Status">
              Status
            </label>
            <div className="relative">
              <select
                className=" form-input-white appearance-none"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                <option value="all">All</option>
                <option className="text-[#000]" value="in_progress">In progress</option>
                <option className="text-[#000]" value="completed">Completed</option>
                <option className="text-[#000]" value="cancelled">Cancelled</option>
              </select>

              <PolygonIcon className="absolute right-4 top-[30%]" />
            </div>
          </div>
        </div>
        <div className="col-span-3 grid place-items-end">
          <button className="yellow-lg-action-button p-4" onClick={handleSearch}>
            <BiSearchAlt2 className="text-[#414040] w-7 h-7" />
          </button>
        </div>
      </div>
    </>
  );
};
