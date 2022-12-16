import Link from "next/link";
import React, { useEffect, useState } from "react";
import utils from "../../../helpers/utils";
import { ProjectBrandLinKModal } from "../../user/projects/ProjectBrandLinkModal";
import { useAuth } from "../../../hooks/useAuth";
import { FiMessageSquare } from "react-icons/fi";
import { TiFolderDelete } from "react-icons/ti";
import { BsLink45Deg } from "react-icons/bs";
import { FileSizeHElper, projectFileUpdateTime } from "../../../lib/FileHelper";
import ProjectCardFunc from "./ProjectCardFunc";
import ProjectCardFuncGrid from "./ProjectCardFuncGrid";

function ProjectCardGrid({
  project,
  index,
  showDesignerCompletedFlag,
  activeProject,
  isInFile = false,
  setActiveProject = () => { },
  setUpdateTime
}) {


  const [showBrandLinkIcon, setShowBrandLinkIcon] = useState(false);
  const [showBrandLinkModal, setShowBrandLinkModal] = useState(false);
  const { role, user } = useAuth();

  const statusColorUtil = (status) => {
    if (status == "to_be_confirmed") return "bg-[#FFE147]";
    else if (status == "cancelled") return "bg-[#FF0000]";
    else if (status == "completed") return "bg-[#0ADEA9]";
    else if (status == "u_review") return "bg-[#FFE147]";
    else if (status == "in_progress") return "bg-[#FFE147]";
    else if (status === "pause") return "bg-[#FF9900]";
    else return "bg-[#FFE147]";
  };
  return (
    <>
      {showBrandLinkModal && (
        <ProjectBrandLinKModal
          setShowModal={setShowBrandLinkModal}
          projectId={project?._id}
        />
      )}
      <div className="flex gap-2">
        <div className="w-fit h-fit mt-3">
          {activeProject === index ? (
            <svg
              width="6"
              height="35"
              viewBox="0 0 6 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="6" height="35" rx="3" fill="#C4C4C4" />
            </svg>
          ) : (
            <svg
              width="6"
              height="35"
              viewBox="0 0 6 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="5"
                height="34"
                rx="2.5"
                stroke="#C4C4C4"
              />
            </svg>
          )
          }
        </div>
        <div
          className="relative flex flex-row w-full h-full rounded-lg bg-[#F4F4F4] justify-between"
          onMouseOver={() => {
            // designer cannot change the brand
            if (role === "designer") return;
            setShowBrandLinkIcon(true);
          }}
          onMouseLeave={() => setShowBrandLinkIcon(false)}
          onClick={() => {
            setActiveProject(index)
          }}
        >
          <div className="w-full flex flex-col">
            <div className="flex flex-1">
              <div className="pl-3 pt-4 flex flex-col flex-1 cursor-pointer">
                <span className=" text-2xl">
                  <Link href={`/projects/${project._id}?tab=CONNECT`} passHref>
                    <span className="text-base text-[2vw] 2xl:text-[30px] leading-normal text-[#414040] break-words ">
                      {project.title}
                    </span>
                  </Link>
                  {/* {showBrandLinkIcon && (
                    <span
                      className={showBrandLinkIcon ? "visible" : "invisible"}
                      title="link project to a brand"
                      onClick={() => setShowBrandLinkModal(true)}
                    >
                      <BsLink45Deg className="h-5 w-5 ml-2 text-primary-blue" />
                    </span>
                  )} */}
                </span>
                <span className="text-xs lg:text-sm text-primary-blue cursor-pointer mt-2">
                  {project.project_index < 10
                    ? "00" + project.project_index
                    : project.project_index < 100
                      ? "0" + project.project_index
                      : project.project_index}{" "}
                  {project?.brand[0]?.name && (
                    <Link href={`/brands/${project?.brand[0]?._id}`} passHref>
                      <span className="hover:cursor-pointer  hover:underline">
                        {" | " + project?.brand[0]?.name}
                      </span>
                    </Link>
                  )}{" "}
                  | {project.project_type}
                </span>
              </div>
              {/* <div className="flex flex-col flex-1 items-end  pt-2 pr-4 gap-2">
                <Link href={`/files/${project._id}`}>
                  <span>
                    <TiFolderDelete className="h-8 w-8 text-secondary-gray cursor-pointer" />
                  </span>
                </Link>

                <div className="relative mt-2S w-8 z-0 ">
                  <Link href={`/projects/${project._id}`}>
                    <span>
                      <FiMessageSquare className="h-7 w-7 text-secondary-gray cursor-pointer" />
                    </span>
                  </Link>
                </div>
              </div> */}
              <div className="pr-2 pt-1">
                <ProjectCardFuncGrid project={project} setUpdateTime={setUpdateTime} setDontShowRevision={() => { }} />
              </div>
            </div>

            <div className="flex justify-between p-3  text-[#414040] mt-6">
              <div className="gap-1 flex flex-col justify-between text-xs lg:text-base lg:gap-3 flex-1">
                <span className="text-xs lg:text-base">LAST UPDATED</span>
                {isInFile && <span className="text-xs lg:text-base">FILE SIZE</span>}
                {!isInFile && <span className="text-xs lg:text-base">START DATE</span>}
                {!isInFile && <span className="text-xs lg:text-base">DEADLINE</span>
                }
              </div>
              <div className="gap-1 flex flex-col justify-between text-xs lg:text-base lg:gap-3">
                {/* <div className="flex flex-col items-end text-xs lg:text-base text-[#414040] gap-3"> */}
                <span>
                  {
                    isInFile ? projectFileUpdateTime(project.input, project.download) :
                      utils.projectLastUpdateFormate(
                        new Date(
                          project?.update_date
                            ? project.update_date
                            : project?.create_date
                        )
                        , false)
                  }

                </span>
                {!isInFile && <span>
                  {utils.projectLastUpdateFormate(
                    new Date(project?.create_date), false
                  )}
                </span>}
                {!isInFile && <span>
                  {utils.projectLastUpdateFormate(
                    new Date(project?.estimate_date), false
                  )}
                </span>}
              </div>
              <div className="flex flex-col items-end text-xs lg:text-base text-[#414040] gap-3">
                <span>
                  {
                    isInFile && FileSizeHElper([...project.download, ...project.input])
                  }

                </span>

                {/* </div> */}
              </div>
            </div>
          </div>
          <div
            className={`${statusColorUtil(
              project?.project_status
            )} h-full w-8 rounded-r-lg  flex flex-col justify-center items-center`}
          >
            <p className="transform font-medium text-[#2C2C2C] text-xs rotate-90 whitespace-nowrap text-center">
              {utils.projectStatusFormate(project?.project_status)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectCardGrid;
