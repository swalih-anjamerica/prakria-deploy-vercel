import React, { useState, useEffect } from "react";
import { FileBox } from "../Files/FIleBox";
import { BsJustify } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { FiGrid } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "../../layouts/Loader";
import Pagination from "../../common/Pagination";
import { useAuth } from "../../../hooks/useAuth";
import { FilterComponent } from "../projects/FilterComponent";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import ProjectCardGrid from "../projects/ProjectCardGrid";
import FileCardGrid from "../Files/FileCardGrid";
import { ProjectListViewIcon } from "../../../helpers/svgHelper";

export const FIleAssetsSCreen = ({
  projects = [],
  status,
  searchText,
  setSearchText,
  projectLoading,
  total,
  page,
  setPage,
  selectedTab,
}) => {
  const { role } = useAuth();
  const router = useRouter();
  const { status: projectStatus } = router.query;
  const [showFilter, setShowFilter] = useState(false);
  const [viewType, setViewType] = useState("List");
  const [current, setCurrent] = useState(1);
  const { setHeaderMessage } = useAuthLayout();
  const [activeFile, setActiveFile] = useState(0);

  function handleFilterState() {
    setShowFilter(false);
  }
  useEffect(() => {
    if (!role) return;
    if (role === "designer") return router.push("/dashboard");
  }, [role]);

  useEffect(() => {
    const filterModalBody = document.getElementById("filter-modal-body");
    filterModalBody?.addEventListener("click", (e) => {
      setShowFilter(false);
    });
  }, [showFilter]);

  useEffect(() => {
    setHeaderMessage("Find your brand files here");
    return () => {
      setHeaderMessage(null);
    };
  }, []);

  return (
    <div className="flex-1 min-h-screen relative">
      <div
        className={`${role == "designer" || role == "project_manager"
          ? "bg-primary-white w-full border-y-2 border-primary-grey gap-4"
          : "bg-primary-white w-full border-y-2 border-primary-grey gap-4"
          } w-full h-14 pl-6 pr-9 xl:px-9 flex justify-between`}
      >
        <ul className="flex flex-1  self-center w-full px-0">
          <li className="mr-12 ">
            <Link href="/files?tab=all">
              <span
                className={`cursor-pointer ${selectedTab == "all"
                  ? "active-horizontal-nav-item-textstyle"
                  : "diabled-horizontal-nav-item-textstyle"
                  }`}
              >
                All
              </span>
            </Link>
          </li>
          <li className="mr-12 ">
            <Link href="/files?tab=latest">
              <span
                className={`cursor-pointer ${selectedTab == "latest"
                  ? "active-horizontal-nav-item-textstyle"
                  : "diabled-horizontal-nav-item-textstyle"
                  }`}
              >
                Latest
              </span>
            </Link>
          </li>
        </ul>
        <div className="flex flex-1 justify-end items-center gap-4">
          <button onClick={() => setViewType("List")}>
            <ProjectListViewIcon
              className={
                viewType == "List"
                  ? "h-5 w-5 text-primary-black cursor-pointer"
                  : " cursor-pointer text-[#E5E5E5] opacity-30  p-0.5"
              }
            />
          </button>
          <button onClick={() => setViewType("Grid")}>
            <FiGrid
              className={
                viewType == "Grid"
                  ? " h-4 w-4 cursor-pointer text-primary-black "
                  : "h-5 w-5 text-primary-black opacity-30 p-0.5 cursor-pointer"
              }
            />
          </button>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="yellow-action-button w-[160px] h-[30px] rounded-sm flex items-center"
          >
            {showFilter ? "Close Filter" : "Filter"}
          </button>
          {showFilter && (
            <div className="absolute right-96 z-10 top-[60px] mr-10">
              <FilterComponent files={true} setShowFilter={setShowFilter} />
            </div>
          )}
          {/* <div>
            <Link href="../projects/create">
              <button className="w-52 font-medium text-primary-black bg-[#FFE147] transition-colors duration-150 hover:bg-secondry-yellow justify-center text-center xl:text-lg px-2 py-1 rounded-md flex flex-end items-center gap-2">
                <AiOutlinePlus />
                Add Project
              </button>
            </Link>
          </div> */}
        </div>
      </div>

      <div className="search-bar-container">
        <div className="flex flex-1 items-center border border-primary-gray px-1 py-1">
          <GoSearch className="ml-1 h-5 w-5 text-primary-blue" />
          <input
            type="text"
            className="search-bar "
            placeholder="Search"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className=" w-full flex-1 px-5">
        {projectLoading ? (
          <Loader />
        ) : status === 204 ? (
          <div className=" w-full flex-1 px-4 pb-4 mt-4">
            <div className="component-heading">No Files found.</div>
          </div>
        ) : status !== 200 ? (
          <div className="w-full flex-1 px-4 pb-4">
            <div className="component-heading">An error occured.</div>
          </div>
        ) : (
          <div className="flex flex-col mt-2">
            {viewType != "Grid" && (
              <div className="w-full flex-1 mt-5">
                <li
                  className="border-gray-400 flex mb-2 cursor-pointer text-[#414040] text-base"
                >
                  <div className="select-none rounded flex flex-1 text-sm xl:text-base">
                    <div className="flex-1 w-full self-center invisible">
                      <div className="mx-7">
                        <svg
                          width="33"
                          height="26"
                          viewBox="0 0 33 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0 0H24L32.5 13L24 26H0V0Z" fill="#bfbfbf" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-5   w-full self-center ">
                      <div className="flex-col self-center text-left w-[16rem]">
                        <p className="font-medium text-sm xl:text-base truncate">
                          PROJECT NAME
                        </p>
                      </div>
                    </div>
                    <div className="flex-3 text-center  w-full self-center ">
                      <p className=" ml-auto text-left w-fit min-w-[160px]">
                        LAST UPDATE
                      </p>
                    </div>
                    <div className="flex-3 text-center  w-full self-center ">
                      <p className=" ml-auto text-left w-fit min-w-[160px]">
                        FILE SIZE
                      </p>
                    </div>

                  </div>
                </li>
              </div>
            )}
            <ul className="">
              <div
                className="w-full flex-1"
                onClick={handleFilterState}
              >
                {viewType == "List" ? (
                  <>
                    {projects?.map((project, index) => {
                      return (

                        <FileBox
                          isInFile={true}
                          key={project._id}
                          project={project}
                          index={index + 1}
                          activeFile={activeFile}
                          setActiveFile={setActiveFile}
                        />
                      )
                    })}
                  </>
                ) : (
                  <div className="grid grid-flow-row grid-cols-2 mt-4 gap-4 2xl:grid-cols-3">
                    {projects.map((project, index) => {
                      return (
                        <FileCardGrid
                          isInFile={true}
                          key={project._id}
                          project={project}
                          index={index + 1}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </ul>
          </div>
        )}

        {total && total > 0 && (
          <div className="flex  mt-5 justify-center mb-20">
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              countPerPage={10}
              total={total}
            />
          </div>
        )}
      </div>
    </div>
  );
};
