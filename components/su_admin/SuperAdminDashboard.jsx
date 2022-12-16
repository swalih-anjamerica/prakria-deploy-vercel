import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FilterComponent } from "../user/projects/FilterComponent";
import { listAllClients } from "../../services/clients";
import { useQuery } from "react-query";
import Loader from "../layouts/Loader";
import Pagination from "../common/Pagination";
import { useAuthLayout } from "../../hooks/useAuthLayout";
import { useAuth } from "../../hooks/useAuth";
import { GoSearch } from "react-icons/go";
import { AiOutlineEye } from "react-icons/ai";
import { BsExclamationTriangle } from "react-icons/bs"


function SuperAdminDashboard() {
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewType, setViewType] = useState("List");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery(
    ["list-all-clients", searchText, page],
    async () => {
      return listAllClients(searchText, page);
    }
  );
  const { role, user } = useAuth();
  const { setHeaderMessage } = useAuthLayout();

  let id = 123;

  useEffect(() => {
    setHeaderMessage(`Welcome ${user?.first_name?.split(" ")[0]},`);
    return () => {
      setHeaderMessage(null)
    }
  }, [])

  return (
    <div className="flex flex-col">
      <div className="px-12 flex py-4 gap-4  items-center">
        <div className="flex md:w-52 xl:w-[40%] items-center border border-primary-gray px-1 py-1">
          <GoSearch className="ml-1 h-5 w-5 text-primary-blue" />
          <input
            type="text"
            className="search-bar "
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <div className="pt-5 pb-1 text-center">
        <span className="text-2xl">All Clients</span>
      </div>
      {/* Table */}
      {
        isLoading ? (
          <Loader />
        ) : data?.status === 204 ? (
          <div className="component-heading" style={{ marginLeft: "20px" }}>No Users found.</div>
        ) : data?.status !== 200 ? (
          <div className="component-heading" style={{ marginLeft: "20px" }}>Some error occured.</div>
        )
          :
          <div className="mx-auto w-[93%] rounded-2xl shadow-lg mb-10 ">
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="pinline-block min-w-full">
                  <div className="overflow-hidden rounded-t-xl">
                    <table className="min-w-full">
                      <thead className="bg-blue-400 border-b ">
                        <tr>
                          <th
                            scope="col"
                            className="text-lg font-medium text-white px-6 pl-2 py-4 text-left md:px-3"
                          >
                            First Name
                          </th>
                          <th
                            scope="col"
                            className="text-lg font-medium text-white px-6 py-4 text-left md:px-3"
                          >
                            Last Name
                          </th>
                          <th
                            scope="col"
                            className="text-lg font-medium text-white px-6 py-4 text-left md:px-3"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="text-lg font-medium text-white px-6 py-4 text-left md:px-3"
                          >
                            Mobile No.
                          </th>
                          <th
                            scope="col"
                            className="text-lg font-medium text-white px-6 py-4 text-left md:px-3"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data?.users?.map((user) => {
                          return (
                            <tr
                              key={user._id}
                              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 select-text"
                            >
                              <td className="text-base text-gray-900 font-light px-2 py-4 whitespace-nowrap relative md:px-3">
                                {user.role === "client_admin" &&
                                  !user.account?.account_manager && (
                                    <span
                                      className="absolute left-2 top-2"
                                      title="This user has no project manager."
                                    >
                                      <BsExclamationTriangle className="h-5 w-5 text-light-yellow" />
                                    </span>
                                  )}
                                {user.first_name}
                              </td>
                              <td className="text-base text-gray-900 font-light px-6 py-4 whitespace-nowrap md:px-3">
                                {user.last_name}
                              </td>
                              <td className="text-base text-gray-900 font-light px-6 py-4 whitespace-nowrap md:px-3">
                                {user.email}
                              </td>
                              <td className="text-base text-gray-900 font-light px-6 py-4 whitespace-nowrap md:px-3">
                                {user.mobile_number
                                  ? user.mobile_number
                                  : "No provided."}
                              </td>
                              <td className="text-base text-gray-900 font-light p-5  whitespace-nowrap md:px-0">
                                <div className="px-4 py-2 hover:opacity-80 w-fit rounded-lg">
                                  <Link href={`/super-admin/client/${user._id}`} >
                                    <span><AiOutlineEye className="w-7 h-7 text-primary-blue" /></span>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {
                    (data?.data?.total && data?.data?.total > 0) &&
                    <div className="flex  mt-5 justify-center mb-20">
                      <Pagination
                        total={data?.data?.total}
                        countPerPage={10}
                        setCurrentPage={setPage}
                        currentPage={page}
                      />
                    </div>}
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  );
}

export default SuperAdminDashboard;
