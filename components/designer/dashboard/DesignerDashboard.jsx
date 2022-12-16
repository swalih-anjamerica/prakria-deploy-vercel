import { BsJustify } from "react-icons/bs";
import { FiGrid } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import React, { useState, useEffect, useMemo } from "react";
import { getDesignerProjectsService } from "../../../services/project";
import Loader from "../../layouts/Loader";
import ProjectCard from "../../user/projects/ProjectCard";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import ProjectCardGrid from "../../user/projects/ProjectCardGrid";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { useLibraries } from "../../../hooks/useLibraries";
import Pagination from "../../common/Pagination";
import rivisionService from "../../../services/rivision";
import { useQuery } from "react-query";
import { ProjectListViewIcon } from "../../../helpers/svgHelper";
import { FilterComponent } from "../../user/projects/FilterComponent";
import { useRouter } from "next/router";

function DesignerDashboard({ }) {
  const [activeProject, setActiveProject] = useState(null);
  const [recentProjects, setRecentProjects] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewType, setViewType] = useState("List");
  const [showFilter, setShowFilter] = useState(false);
  const [projectStatus, setProjectStatus] = useState("ALL");
  const [getProjectUpdatedTime, setGetProjectUpdatedTime] = useState(null);
  const { role, user } = useAuth();
  const { setHeaderMessage } = useAuthLayout();
  const [activeProjectTag, setActiveProjectTag] = useState(0);
  const [page, setPage] = useState(1);
  const [activeCount, setActiveCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const router = useRouter();
  const { status = "", from = "", to = "" } = router.query;

  useEffect(() => {
    const getDesignerProjects = async () => {
      try {
        if (!getProjectUpdatedTime) {
          setProjectsLoading(true);
        }

        const searchBody = {
          page,
          search: searchText,
          status,
          from,
          to
        }
        const response = await getDesignerProjectsService(searchBody);
        setProjectsLoading(false);
        if (response.status !== 200) {
          return;
        }
        const { recentProjects, activeProject, activeCount, recentCount } = response.data;
        setActiveProject(activeProject);
        setRecentProjects(recentProjects);
        setActiveCount(activeCount);
        setRecentCount(recentCount);
      } catch (e) {
        setProjectsLoading(false);
      }
    };
    getDesignerProjects();
  }, [searchText, getProjectUpdatedTime, page, status]);

  const totalPages = useMemo(() => {
    if (projectStatus === "ALL") {
      return activeCount + recentCount;
    }
    if (projectStatus === "ON_GOING") {
      return activeCount;
    }
    if (projectStatus === "COMPLETED") {
      return recentCount;
    }
  }, [activeCount, recentCount, projectStatus, status])

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
  function handleTabChange(tabName){
    setPage(1);
    router.push(router.pathname);
    setProjectStatus(tabName);
  }

  // pusher trigger for realtime assign
  const { pusher } = useLibraries();
  useEffect(() => {
    if (!user?._id && user?.role !== "designer") return;
    if (!pusher) return;
    const channel = pusher.subscribe(user?._id);
    channel.bind("project-new-revision", (data) => {
      toast.dismiss();
      toast("Project Manager added you in new revisions.", {
        duration: 3000,
      });
      setGetProjectUpdatedTime(Date.now());
    });
  }, [user, pusher]);

  useEffect(() => {
    setHeaderMessage(`Welcome ${user?.first_name?.split(" ")[0]},`);
    return () => {
      setHeaderMessage(null);
    };
  }, []);

  useEffect(() => {
    const filterModalBody = document.getElementById("filter-modal-body");
    filterModalBody?.addEventListener("click", (e) => {
      setShowFilter(false);
    });
  }, [showFilter]);

  return (
    <div className="flex-1 p-0 min-h-screen ">
      <div
        className={`${role == "designer"
          ? "bg-primary-white w-full border-y-2 border-primary-grey h-14 px-10 flex justify-between"
          : "bg-primary-white"
          } w-full h-14 px-6 xl:px-9 pr-9 flex justify-between relative`}
      >
        <ul className="flex flex-1 self-center w-full">
          <li className="mr-12 ">
            <button onClick={() => handleTabChange("ALL")}>
              <a
                className={
                  !projectStatus || projectStatus === "ALL"
                    ? "active-horizontal-nav-item-textstyle"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                All
              </a>
            </button>
          </li>
          <li className="mr-12 ">
            <button onClick={() => handleTabChange("ON_GOING")}>
              <a
                className={
                  projectStatus === "ON_GOING"
                    ? "active-horizontal-nav-item-textstyle"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                Ongoing
              </a>
            </button>
          </li>
          <li className="mr-12 ">
            <button onClick={() => handleTabChange("COMPLETED")}>
              <a
                className={
                  projectStatus === "COMPLETED"
                    ? "active-horizontal-nav-item-textstyle"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                Completed
              </a>
            </button>
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
            className="yellow-action-button w-[160px] h-[30px] rounded-sm flex items-center"
            style={{ fontWeight: "500", opacity: "0.9" }}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "Close Filter" : "Filter"}
          </button>
          {showFilter && (
            <div className="absolute right-96 z-10 top-[60px] mr-9">
              <FilterComponent setShowFilter={setShowFilter} isDesigner={true}/>
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

      {projectsLoading ? (
        <Loader />
      ) : (
        <>
          {activeProject?.length < 1 && recentProjects?.length < 1 ? (
            <div className="px-11 pt-0 pb-11">
              <h1 className="component-heading">No projects found</h1>
            </div>
          ) : (
            <>
              {viewType == "List" ? (
                <>
                  <div
                    className=" w-full flex-1 p-6 xl:px-9 xl:pb-4"
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
                      {projectStatus === "ALL" ? (
                        <>
                          {activeProject &&
                            activeProject?.map((project, index) => {
                              return (
                                <ProjectCard project={project} key={index} index={index} activeProject={activeProjectTag} setActiveProject={setActiveProjectTag}
                                  handleShowRevisionMouseOut={handleShowRevisionMouseOut}
                                  handleShowRevisionsMouseOver={handleShowRevisionsMouseOver}
                                  revisionProjectId={revisionProjectId}
                                  setRevisionProjectId={setRevisionProjectId}
                                  revisions={revisions}
                                  revisionLoading={revisionLoading}
                                />
                              );
                            })}
                          {recentProjects?.map((project, index) => {
                            let length = activeProject?.length;
                            return <ProjectCard
                              key={index}
                              project={project}
                              index={length + index}
                              showDesignerCompletedFlag={true}
                              activeProject={activeProjectTag}
                              setActiveProject={setActiveProjectTag}
                              handleShowRevisionMouseOut={handleShowRevisionMouseOut}
                              handleShowRevisionsMouseOver={handleShowRevisionsMouseOver}
                              revisionProjectId={revisionProjectId}
                              setRevisionProjectId={setRevisionProjectId}
                              revisions={revisions}
                              revisionLoading={revisionLoading}
                            />
                          })}
                        </>
                      ) : projectStatus === "COMPLETED" ? (
                        <>
                          {recentProjects?.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                project={project}
                                index={index}
                                showDesignerCompletedFlag={true}
                                activeProject={activeProjectTag}
                                setActiveProject={setActiveProjectTag}
                                handleShowRevisionMouseOut={handleShowRevisionMouseOut}
                                handleShowRevisionsMouseOver={handleShowRevisionsMouseOver}
                                revisionProjectId={revisionProjectId}
                                setRevisionProjectId={setRevisionProjectId}
                                revisions={revisions}
                                revisionLoading={revisionLoading}
                              />
                            );
                          })}
                        </>
                      ) : (
                        projectStatus === "ON_GOING" && (
                          <>
                            {activeProject ? (
                              activeProject?.map((project, index) => {
                                return (
                                  <ProjectCard project={project} key={index} index={index}
                                    activeProject={activeProjectTag}
                                    setActiveProject={setActiveProjectTag}
                                    handleShowRevisionMouseOut={handleShowRevisionMouseOut}
                                    handleShowRevisionsMouseOver={handleShowRevisionsMouseOver}
                                    revisionProjectId={revisionProjectId}
                                    setRevisionProjectId={setRevisionProjectId}
                                    revisions={revisions}
                                    revisionLoading={revisionLoading}
                                  />
                                );
                              })
                            ) : (
                              <h1 className="component-heading">
                                No ongoing project
                              </h1>
                            )}
                          </>
                        )
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <div
                  className=" w-full flex-1 p-4 xl:pl-4 xl:px-9 xl:pb-4"
                >
                  <div className="grid grid-flow-row grid-cols-2 mt-4 gap-4 2xl:grid-cols-3">
                    {projectStatus === "ALL" ? (
                      <>
                        {activeProject &&
                          activeProject?.map((project, index) => {
                            return (
                              <ProjectCardGrid project={project} key={index} />
                            );
                          })}
                        {recentProjects?.map((project, index) => (
                          <ProjectCardGrid
                            key={index}
                            project={project}
                            index={index + 1}
                            showDesignerCompletedFlag={true}
                          />
                        ))}
                      </>
                    ) : projectStatus === "COMPLETED" ? (
                      <>
                        {recentProjects?.map((project, index) => (
                          <ProjectCardGrid
                            key={index}
                            project={project}
                            index={index + 1}
                            showDesignerCompletedFlag={true}
                          />
                        ))}
                      </>
                    ) : (
                      projectStatus === "ON_GOING" && (
                        <>
                          {activeProject ? (
                            activeProject?.map((project, index) => {
                              return (
                                <ProjectCardGrid project={project} key={index} />
                              );
                            })
                          ) : (
                            <h1 className="component-heading">
                              No ongoing project
                            </h1>
                          )}
                        </>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      {
        (totalPages > 0) &&
        <div className='flex  mt-5 justify-center mb-20'>
          <Pagination currentPage={page} setCurrentPage={setPage} countPerPage={10} total={totalPages} />
        </div>
      }
    </div>
  );
}
// ProjectCardGrid
export default DesignerDashboard;
