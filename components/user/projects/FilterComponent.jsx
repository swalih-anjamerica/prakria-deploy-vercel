import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSearchAlt2 } from "react-icons/bi"
import { PolygonIcon } from "../../../helpers/svgHelper";

export const FilterComponent = ({ files = false, setShowFilter, isDesigner = false }) => {
  const router = useRouter();
  const { status, from, to } = router.query;

  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [statusValue, setStatusValue] = useState(status || "all");

  const handleSearch = () => {
    if ((fromDate && !toDate) || (toDate && !fromDate)) {
      return toast.error("both from and to dates required.");
    }

    setShowFilter(false);
    if (!fromDate) {
      return router.push(`/${isDesigner ? "dashboard" : files ? "files" : "projects"}?status=${statusValue}`);
    }
    setShowFilter(false);
    return router.push(
      `/${isDesigner ? "dashboard" : files ? "files" : "projects"}?status=${statusValue}&from=${fromDate}&to=${toDate}`
    );
  }


  return (
    <>
      <div className="h-full w-full fixed left-[-9px] top-0" id="filter-modal-body"></div>
      <div
        className={`absolute p-4 w-96 bg-[#3B85F5] grid grid-cols-12 gap-4  shadow rounded-xl`}
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
              placeholder="dd-mm-yyy"
              max={
                toDate ?
                  new Date(toDate).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              onChange={(e) => setFromDate(e.target.value)}
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
            // min={
            //   new Date(fromDate).getFullYear() +
            //   "-" +
            //   (new Date(fromDate).getMonth() + 1 < 10
            //     ? "0" + (new Date(fromDate).getMonth() + 1)
            //     : new Date(fromDate).getMonth() + 1) +
            //   "-" +
            //   (new Date(fromDate).getDate() < 10
            //     ? new Date(fromDate).getDate()
            //     : new Date(fromDate).getDate())
            // }
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
                className=" form-input-white appearance-none "
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                <option value="all">All</option>
                {/* <option value="in_progress" className="text-[#FFE147]">In progress</option>
              <option value="completed" className="text-[#0ADEA9]">Completed</option>
              <option value="cancelled" className="text-[#FF0000]">Cancelled</option> */}
                <option value="in_progress" className="text-[#000]">In progress</option>
                <option value="completed" className="text-[#000]">Completed</option>
                <option value="cancelled" className="text-[#000]">Cancelled</option>
              </select>

              <PolygonIcon className="absolute right-4 top-[30%]" />
            </div>
          </div>
        </div>
        <div className="col-span-3 grid place-items-end">
          <div className="flex-col  w-full">
            <button className="yellow-lg-action-button p-4" onClick={handleSearch}>
              <BiSearchAlt2 className="text-[#414040] w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
