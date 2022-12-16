import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import ResourceAssignModal from "./ResourceAssignModal";
import rivisionService from "../../../services/rivision";
import Loader from "../../layouts/Loader";
import { useLibraries } from "../../../hooks/useLibraries";
import { GoSearch } from "react-icons/go";
import { BiChevronDown } from "react-icons/bi";
import toast from "react-hot-toast";


function ProjectAddResourceScreen({
  tabLink,
  projectId,
  skills,
  setUpdatedTime,
  project
}) {
  const { role } = useAuth();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [skillType, setSkillType] = useState("");
  const [resources, setResources] = useState(null);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceDetails, setResourceDetails] = useState(null);
  const [listResourceUpdateTime, setListResourceUpdateTime] = useState(null);

  function handleShowAssignModal(resource) {
    if(project.project_status==="completed"||project.project_status==="cancelled") return toast(`Project is ${project.project_status}. You can't create new revisions`);
    if (!resource) return;
    setResourceDetails(resource);
    setShowAssignModal(true);
  }

  useEffect(() => {
    const listDesigners = async () => {
      try {
        if (!listResourceUpdateTime) {
          setResourceLoading(true);
        }
        const response = await rivisionService.listResources(
          skillType,
          1,
          10,
          searchText
        );
        setResourceLoading(false);
        if (response.status === 200) {
          setResources(response.data);
        } else {
          setResources(null);
        }
      } catch (e) {
        setResourceLoading(false);
      }
    };

    listDesigners();
  }, [skillType, searchText, listResourceUpdateTime]);

  // pusher
  const { pusher } = useLibraries();
  useEffect(() => {
    if (!pusher) return;
    const projectChannel = pusher.subscribe(projectId);
    projectChannel.bind("project-update", (data) => {
      setListResourceUpdateTime(Date.now());
    });
  }, [pusher]);

  return (
    <>
      {/* assign resource modal */}
      {showAssignModal && (
        <ResourceAssignModal
          setShowModal={setShowAssignModal}
          resource={resourceDetails}
          projectId={projectId}
          setUpdatedTime={setUpdatedTime}
        />
      )}
      {/* end of assign resource modal */}
      <div
        className={`${role == "project_manager"
          ? "bg-primary-white border-y-2 border-primary-grey"
          : "bg-primary-white border-y-2 border-primary-grey"
          }bg-primary-white w-full  flex border-y-2 border-primary-grey gap-4"`}
      >
        <ul className="flex flex-1 gap-10 self-center items-center w-full px-9 h-14">
          <Link href={"/projects/" + projectId + "?tab=CONNECT"}>
            <a
              className={
                tabLink === "CONNECT"
                  ? "active-horizontal-nav-item-textstyle"
                  : "diabled-horizontal-nav-item-textstyle"
              }
            >
              Connect
            </a>
          </Link>

          <Link href={"/projects/" + projectId + "?tab=REVIEW"}>
            <a className="diabled-horizontal-nav-item-textstyle">Review</a>
          </Link>

          <Link href={"/projects/" + projectId + "?tab=DOWNLOAD"}>
            <a className="diabled-horizontal-nav-item-textstyle">Download</a>
          </Link>

          {role === "project_manager" && (
            <Link href={"/projects/" + projectId + "?tab=ADD_RESOURCE"}>
              <a
                className={
                  tabLink === "ADD_RESOURCE"
                    ? role == "project_manager"
                      ? "active-horizontal-nav-item-textstyle"
                      : "active-horizontal-nav-item-textstyle"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                Add resource
              </a>
            </Link>
          )}
        </ul>
      </div>

      {/* resource filter and search */}
      <div className="px-12 flex justify-between py-4 gap-4 items-center">
        <div className="flex py-4 relative w-[36%]">
          <div className="flex flex-1 items-center border border-primary-gray px-1 py-1">
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

        {/* skill filter select */}
        <div className="flex items-center">
          <div className="w-fit relative">
            <select
              className="form-input appearance-none"
              style={{ background: "#FFD12A", padding: "8px", paddingLeft: "30px" }}
              onChange={(e) => setSkillType(e.target.value)}
              value={skillType}
            >
              <option value={""} className="text-black bg-white">Resources</option>
              {skills?.map((skill) => {
                return (
                  <option value={skill._id} key={skill._id} className="bg-white text-black">
                    {skill.skill_name}
                  </option>
                );
              })}
            </select>

            {/* arrow icon */}
            <span className="absolute left-1 top-2">
              <BiChevronDown />
            </span>
          </div>
        </div>
      </div>

      <div className=" w-full flex-1 p-11">
        {resourceLoading ? (
          <Loader />
        ) : !resources ? (
          <div className=" w-full flex-1 p-11">
            <div className="component-heading">No Resource found.</div>
          </div>
        ) : (
          <ul>
            {resources?.map((user) => {
              const currentProject = user?.project_details?.find(
                (project) => project._id === projectId
              );
              return (
                <li
                  className="border-gray-400 flex mb-2 items-center rounded"
                  key={user?._id}
                >
                  <div className="select-none rounded flex w-full  items-center justify-between bg-secondry-gray p-4 mt-3 md:flex-row text-[14px]">
                    <div className="pl-1 flex items-center">
                      <div className="font-medium text-xl self-center md:text-[20px] md:w-auto">
                        {user?.first_name + " " + user?.last_name}
                      </div>
                      {currentProject ? (
                        <div
                          className={`bg-green-600 ml-2 rounded-sm align-center p-1`}
                        >
                          <p className="font-medium text-xs  whitespace-nowrap text-center text-white ">
                            Assigned
                          </p>
                        </div>
                      ) : (
                        user?.project_details?.length > 0 && (
                          <div
                            className={`bg-red ml-2 rounded-sm align-center p-1`}
                          >
                            <p className="font-medium text-xs  whitespace-nowrap text-center text-white ">
                              Busy
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex items-center gap-5 select-text">
                      <div className=" flex">
                        <div className="w-32 md:break-words lg:w-fit flex-col text-center text-slate-800 ">
                          <p>{user?.email}</p>
                        </div>
                        {user?.skills?.map((skill) => {
                          return (
                            <React.Fragment key={skill._id}>
                              <div className="w-0.5 h-5 mx-3  bg-primary-gray my-auto"></div>
                              <div className="flex text-center text-primary-text-gray">
                                <p>{skill.skill_name}</p>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                      {/* <div className=""> */}
                      <button
                        className="black-action-button md:p-2 md:w-fit"
                        onClick={(e) => handleShowAssignModal(user)}
                      >
                        Assign Project
                      </button>
                      {/* </div> */}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export default ProjectAddResourceScreen;
