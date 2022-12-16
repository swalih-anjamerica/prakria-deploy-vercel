import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSearchAlt2 } from "react-icons/bi";

export const FilterComponent = ({setShowFilter}) => {
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
      setShowFilter(false);
      return router.push(`/projects?status=${statusValue}`);
    }
    setShowFilter(false);
    return router.push(
      `/projects?status=${statusValue}&from=${fromDate}&to=${toDate}`
    );
  }

  return (
    <div
      className={`absolute p-4 w-96 bg-[#3B85F5] grid grid-cols-12 gap-2  shadow rounded-xl`}
    >
      <div className="col-span-12">
        <div className="flex-col w-full text-white text-2xl">Category</div>
      </div>
      <div className="col-span-10 flex">
      <div className="flex-col  w-full ">
          <select
            className=" form-input"
            // value={statusValue}
            // onChange={(e) => setStatusValue(e.target.value)}
          >
          </select>
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


export default FilterComponent;