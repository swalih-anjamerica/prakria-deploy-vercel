import { GoSearch } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../../layouts/Loader";
import { FilterComponentPM } from "./FilterComponentPM";
import ProjectCard from "../../user/projects/ProjectCard";
import ProjectCardGrid from "../../user/projects/ProjectCardGrid";
import { useAuth } from "../../../hooks/useAuth";
import Pagination from "../../common/Pagination";
import { BsJustify } from "react-icons/bs";
import { FiGrid } from "react-icons/fi";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { useQuery } from "react-query";
import rivisionService from "../../../services/rivision";
import { ProjectListViewIcon } from "../../../helpers/svgHelper";

const ProjectScreenPM = ({
  projects = [],
  status,
  searchText,
  setSearchText,
  projectLoading,
  total,
  page,
  setPage,
  projectFetching
}) => {
  const router = useRouter();
  const { user, role } = useAuth();
  const { setHeaderMessage } = useAuthLayout();
  const { status: projectStatus = "all" } = router.query;
  const [showFilter, setShowFilter] = useState(false);
  const [viewType, setViewType] = useState("List");
  const [activeProject, setActiveProject] = useState(0);
  const [revisionProjectId, setRevisionProjectId] = useState(null);

  const { isLoading: revisionLoading, data: revisions } = useQuery(["revision-on-project-card", revisionProjectId], () => {
    return rivisionService.getRivisionByProjectId(revisionProjectId);
  }, {
    enabled: !!revisionProjectId,
    select: data => data.data
  })
  function handleShowRevisionsMouseOver(project_id) {
    setRevisionProjectId(project_id);
  }
  function handleShowRevisionMouseOut() {
    setRevisionProjectId(null);
  }

  function handleFilterState() {
    setShowFilter(false);
  }
  useEffect(() => {
    setHeaderMessage(`Welcome ${user?.first_name?.split(" ")[0]}`);
    return () => {
      setHeaderMessage(null)
    }
  }, [])
  useEffect(() => {
    setPage(1);
  }, [router.query?.status])

  useEffect(() => {
    const filterModalBody = document.getElementById("filter-modal-body");
    filterModalBody?.addEventListener("click", e => {
      setShowFilter(false);
    })
  }, [showFilter])

  return (
    <div className="flex-1 p-0 min-h-screen ">
      <div
        className={`${role == "project_manager"
          ? "bg-primary-white w-full px-3 flex border-y-2 border-primary-grey"
          : "bg-primary-white w-full px-3 flex border-y-2 border-primary-grey"
          } w-full h-14 px-6 xl:px-9 pr-9 flex justify-between relative`}
      >
        <ul className="flex flex-1 self-center w-full">
          <li className="mr-12 ">
            <Link href="/dashboard?status=all">
              <a
                className={
                  !projectStatus ||
                    projectStatus === "all" ||
                    (projectStatus !== "on_going" &&
                      projectStatus !== "completed")
                    ? "active-horizontal-nav-item-textstyle"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                All
              </a>
            </Link>
          </li>
          <li className="mr-12 ">
            <Link href="/dashboard?status=on_going">
              <a
                className={
                  projectStatus === "on_going"
                    ? "active-horizontal-nav-item-textstyle"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                Active
              </a>
            </Link>
          </li>
          <li className="mr-12 ">
            <Link href="/dashboard?status=completed">
              <a
                className={
                  projectStatus === "completed"
                    ? "active-horizontal-nav-item-textstyle"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                Completed
              </a>
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
            className="yellow-action-button md:w-40 xl:w-48"
            onClick={() => setShowFilter(!showFilter)}
            style={{ fontWeight: "500", opacity: "0.9" }}
          >
            {showFilter ? "Close Filter" : "Filter"}
          </button>
          {showFilter && (
            <div className="absolute right-96 z-10 top-[60px] mr-10">
              <FilterComponentPM setShowFilter={setShowFilter} />
            </div>
          )}
        </div>
      </div>
      <div className="search-bar-container">
        <div className="flex flex-1 items-center border border-primary-gray px-1 py-1">
          <GoSearch className="ml-1 h-5 w-5 text-primary-blue" />
          <input
            type="text"
            className="search-bar "
            placeholder="Search"
            value={searchText}
            onChange={(e) => {
              setPage(1);
              setSearchText(e.target.value);
            }}
          />
        </div>
      </div>
      {(projectLoading || projectFetching) ? (
        <Loader height={"60vh"} />
      ) : (
        <>
          {status === 204 ? (
            <div className=" w-full flex-1 p-11">
              <div className="component-heading">No projects found.</div>
            </div>
          ) : status !== 200 ? (
            <div className=" w-full flex-1 p-11">
              <div className="component-heading">An error occured.</div>
            </div>
          ) : (
            <>
              {viewType == "List" ? (
                <>
                  <div
                    className=" w-full flex-1 p-6 xl:px-9 xl:pb-4"
                    onClick={handleFilterState}
                  >
                    <div className="flex mb-2 h-10 text-[#2E2E2E]" >
                      <div className="self-center mr-3 xl:mr-5 invisible">
                        <svg
                          className="h-[22px] w-[25px] xl:h-[26px] xl:w-[33px]"
                          viewBox="0 0 33 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0 0H24L32.5 13L24 26H0V0Z" fill="#bfbfbf" />
                        </svg>
                      </div>
                      <div className="grid grid-cols-11 items-center w-full rounded-lg text-sm xl:text-base">
                        <div className="col-span-3 h-full w-full flex">
                          <div className="flex-col text-left my-auto pl-6">
                            <div className="font-medium items-center text-left cursor-pointer flex w-[16vw] break-words">
                              <span className="truncate">PROJECT NAME</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 h-full w-full flex justify-center text-sm xl:text-base">
                          <div className="flex-col text-left my-auto min-w-[125px] lg:min-w-[135px]">
                            LAST UPDATE
                          </div>
                        </div>
                        <div className="col-span-2 h-full w-full flex justify-center text-sm xl:text-base">
                          <div className="flex-col text-left my-auto min-w-[125px] lg:min-w-[135px]">
                            START DATE
                          </div>
                        </div>
                        <div className="col-span-2 h-full w-full flex justify-center text-sm xl:text-base">
                          <div className="flex-col text-left my-auto min-w-[125px] lg:min-w-[135px]">
                            DEADLINE
                          </div>
                        </div>
                        <div className="col-span-2 flex h-full">
                        </div>
                      </div>
                    </div>
                    <ul className="">
                      {projects?.map((project, index) => (
                        <ProjectCard
                          activeProject={activeProject}
                          setActiveProject={setActiveProject}
                          key={project._id}
                          project={project}
                          index={index + 1}
                          handleShowRevisionMouseOut={handleShowRevisionMouseOut}
                          handleShowRevisionsMouseOver={handleShowRevisionsMouseOver}
                          revisionProjectId={revisionProjectId}
                          setRevisionProjectId={setRevisionProjectId}
                          revisions={revisions}
                          revisionLoading={revisionLoading}
                        />
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div
                  className=" w-full flex-1 p-4 xl:pl-4 xl:px-9 xl:pb-4"
                  onClick={handleFilterState}
                >
                  <div className="grid grid-flow-row grid-cols-2 mt-4 gap-4 2xl:grid-cols-3">
                    {projects?.map((project, index) => (
                      <ProjectCardGrid
                        key={project._id}
                        project={project}
                        index={index + 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      {
        (total && total > 0) &&
        <div className='flex  mt-5 justify-center mb-20'>
          <Pagination currentPage={page} setCurrentPage={setPage} countPerPage={10} total={total} />
        </div>
      }
    </div>
  );
};
export default ProjectScreenPM;
