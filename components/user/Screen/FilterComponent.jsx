import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSearchAlt2 } from "react-icons/bi";

export const FilterComponent = ({}) => {
  const router = useRouter();
  const { status, from, to } = router.query;

  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [statusValue, setStatusValue] = useState(status);

  function handleSearch() {
    if ((fromDate && !toDate) || (toDate && !fromDate)) {
      return toast.error("both from and to dates required.");
    }

    if (!fromDate) {
      return router.push(`/projects?status=${statusValue}`);
    }
    return router.push(
      `/projects?status=${statusValue}&from=${fromDate}&to=${toDate}`
    );
  }

  return (
    <div
      className={`absolute p-4 w-96 bg-[#3B85F5] grid grid-cols-12 gap-2  shadow rounded-xl`}
    >
      <div className="col-span-12">
        <div className="flex-col w-full text-white text-2xl">Date</div>
      </div>
      <div className="col-span-5">
        <div className="flex-col  w-full">
          <label className="form-label-white" htmlFor="Company name">
            From
          </label>
          <input
            className=" form-input "
            id="username"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
      </div>
      <div className="col-span-5">
        <div className="flex-col  w-full ">
          <label className="form-label-white" htmlFor="Website">
            To
          </label>
          <input
            className="form-input mt-auto "
            id="username"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            max={
              new Date().getFullYear() +
              "-" +
              (new Date().getMonth() + 1 < 10
                ? "0" + (new Date().getMonth() + 1)
                : new Date().getMonth() + 1) +
              "-" +
              (new Date().getDate() < 10
                ? new Date().getDate()
                : new Date().getDate())
            }
            min={
              new Date(fromDate).getFullYear() +
              "-" +
              (new Date(fromDate).getMonth() + 1 < 10
                ? "0" + (new Date(fromDate).getMonth() + 1)
                : new Date(fromDate).getMonth() + 1) +
              "-" +
              (new Date(fromDate).getDate() < 10
                ? new Date(fromDate).getDate()
                : new Date(fromDate).getDate())
            }
          />
        </div>
      </div>
      <div className="col-span-2 flex items-end">
        <div className="flex-col  w-full">
          <button
            className="yellow-lg-action-button p-4"
            onClick={handleSearch}
          >
            <BiSearchAlt2 className="text-[#414040] w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
