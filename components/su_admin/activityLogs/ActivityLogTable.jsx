import React, { useEffect, useState } from "react";
import utils from "../../../helpers/utils";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { getResourceTimeStampService } from "../../../services/activitylog";
import Loader from "../../layouts/Loader";
import { GoSearch } from "react-icons/go";

function ActivityLogTable() {
  const [resourceTimeStamps, setResourceTimeStamps] = useState(null);
  const [dataFetchError, setDataFetchError] = useState(null);
  const [dataFetchingLoading, setDataFetchLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [page, setPage] = useState(1);
  const { setHeaderMessage } = useAuthLayout();

  useEffect(() => {
    setHeaderMessage("Here are all activity logs");
    return () => {
      setHeaderMessage(null);
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataFetchError(null);
        if (!searchText) {
          setDataFetchLoading(true);
        }
        const response = await getResourceTimeStampService(
          searchDate,
          searchText,
          page
        );
        setDataFetchLoading(false);
        setResourceTimeStamps(response.data);
      } catch (e) {
        setDataFetchLoading(false);
        setDataFetchError("Some error occured");
      }
    };
    fetchData();
  }, [searchText, page, searchDate]);
 
  return (
    <div>
      <div className="px-6 xl:px-12 flex py-4 gap-4  items-center relative">
        <div className="flex justify-between w-full">
          <div className="flex items-center border border-primary-gray px-1 py-1 w-[30%]">
            <GoSearch className="ml-1 h-5 w-5 text-primary-blue" />
            <input
              type="text"
              className="search-bar"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div>
            <button className="font-medium text-primary-black  bg-[#FFE147]	 transition-colors duration-150 justify-center items-center text-base md:text-sm xl:text-xl rounded-md px-4 py-1 relative">
              <input
                type="date"
                id="date-filter"
                value={searchDate}
                className="bg-light-yellow  p-2 outline-none md:p-1"
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </button>
          </div>
        </div>

        {/* {showFilter && (
                    <div className="yellow-action-button relative md:w-32 md:text-xs md:p-1 xl:w-40 xl:text-md">
                        <FilterComponent />
                    </div>
                )} */}
      </div>
      {dataFetchingLoading ? (
        <Loader height={"50vh"} />
      ) : (
        <div className="flex flex-col px-5">
          <div className="">
            <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-t-lg">
                {!resourceTimeStamps || resourceTimeStamps?.length < 1 ? (
                  <div className="mt-10">
                    <h1 className="component-heading">No data found</h1>
                  </div>
                ) : (
                  <table className="min-w-full text-center">
                    <thead className="border-b  bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          First Name
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          Last Name
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          Email
                        </th>
                        {/* <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          Total Projects
                        </th> */}
                        <th
                          scope="col"
                          className="text-sm font-medium text-white px-6 py-4"
                        >
                          Total Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resourceTimeStamps?.map((timeStamps, index) => {
                        return (
                          <tr className="bg-white border-b" key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                              {timeStamps.resource?.first_name}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                              {timeStamps.resource?.last_name}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {timeStamps.resource?.email}
                            </td>
                            {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex gap-2 justify-center">
                              <div>
                                <span>Completed</span> <br />
                                <span>On Going</span>
                              </div>
                              <div>
                                <span>{timeStamps.projects.completed}</span>{" "}
                                <br />
                                <span>{timeStamps.projects.notCompleted}</span>
                              </div>
                            </td> */}
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {utils.convertMilliSecondToHumanRead(
                                timeStamps.total_time
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityLogTable;
