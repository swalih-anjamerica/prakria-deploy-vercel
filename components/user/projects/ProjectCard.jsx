import Link from "next/link";
import React, { useEffect, useState } from "react";
import utils from "../../../helpers/utils";
import { FiMessageSquare } from "react-icons/fi";
import { TiFolderDelete } from "react-icons/ti";
import { BiTag } from "react-icons/bi";
import { ProjectBrandLinKModal } from "../../user/projects/ProjectBrandLinkModal";
import { useAuth } from "../../../hooks/useAuth";
import { BsLink45Deg } from "react-icons/bs";
import ButtonLoader from "../../common/ButtonLoader";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { CancelIcon, ChatIcon, FileGreyIcon, PauseIcon } from "../../../helpers/svgHelper";
import ProjectCardFunc from "./ProjectCardFunc";
import ConfirmAlert from "../../common/ConfirmAlert";

function ProjectCard({ project, index, activeProject, setActiveProject = () => { }, setRevisionProjectId = () => { }, revisionLoading, revisions = [], handleShowRevisionsMouseOver, handleShowRevisionMouseOut, revisionProjectId, setUpdateTime=()=>{} }) {
  const [showBrandLinkIcon, setShowBrandLinkIcon] = useState(false);
  const [showBrandLinkModal, setShowBrandLinkModal] = useState(false);
  const [dontShowRevision, setDontShowRevision] = useState(false);

  const router = useRouter();
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
  const handleRouteToRevision = (revision) => {
    toast.dismiss();
    if (revision.rivision_file) {
      router.push(`/projects/revision/${revision._id}`);
    } else {
      toast("Revision file not uploaded yet");
    }
  }
  const handleRouteLocation = (location) => {
    setDontShowRevision(true);
    router.push(location);
  }
  useEffect(() => {
    return () => {
      setDontShowRevision(false);
    }
  }, [])

  return (
    <>
      {showBrandLinkModal && (
        <ProjectBrandLinKModal
          setShowModal={setShowBrandLinkModal}
          projectId={project?._id}
          setDontShowRevisin={setDontShowRevision}
          setRevisionProjectId={setRevisionProjectId}
        />
      )}

     

      <li className="cursor-pointer" id="card"
        // onMouseLeave={handleShowRevisionMouseOut}
        onClick={() => {
          setActiveProject(index)
        }}
        onDoubleClick={() => {
          setDontShowRevision(true);
          router.push(`/projects/${project._id}`);
        }}
      >
        {/* project card */}
        <div className="flex mb-2 text-[#414040]" >
          <div className="self-center mr-3 xl:mr-5">
            {activeProject === index ? (
              <svg
                className="h-[22px] w-[25px] xl:h-[26px] xl:w-[33px]"
                viewBox="0 0 33 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0H24L32.5 13L24 26H0V0Z" fill="#bfbfbf" />
              </svg>
            ) : (
              <svg
                className="h-[22px] w-[25px] xl:h-[26px] xl:w-[33px]"
                viewBox="0 0 33 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 1.5H23.1886L30.7078 13L23.1886 24.5H1.5V1.5Z"
                  stroke="#C4C4C4"
                  strokeWidth="3"
                />
              </svg>
            )}

            {/* <BiTag className="h-10 w-10 rotate-180 text-[#C4C4C4] hover:font-[#C4C4C4]"/> */}
          </div>
          <div className="grid grid-cols-11 h-28 items-center w-full rounded-[11px] bg-secondry-gray" onClick={(e) => {
            handleShowRevisionsMouseOver(prev => {
              if (prev === project._id) return null;
              return project._id;
            })
          }}>
            <div className="col-span-3 h-full w-full flex">
              <div className="flex-col text-left my-auto pl-6">
                <div className="font-medium text-lg xl:text-xl items-center text-left cursor-pointer flex w-[16vw] break-words">
                  {/* <Link href={`/projects/${project._id}`}> */}
                  <span className="truncate" onClick={() => handleRouteLocation(`/projects/${project._id}`)}>{project.title}</span>
                  {/* </Link> */}
                  {project?.revision_title && (
                    <p className="text-sm h-20">{project?.revision_title}</p>
                  )}

                  {(role != "designer" &&
                    role != "client_member" &&
                    role != "creative_director") && (
                      <span
                        title="link project to a brand"
                        onClick={() => {
                          setDontShowRevision(true);
                          setShowBrandLinkModal(true)
                        }}
                      >
                        <BsLink45Deg className="h-5 w-5 text-primary-gray hover:text-primary-blue" />
                      </span>
                    )}
                </div>

                <p className="text-primary-blue text-xs xl:text-sm lowercase w-full break-words">
                  {project.project_index < 10
                    ? "00" + project.project_index
                    : project.project_index < 100
                      ? "0" + project.project_index
                      : project.project_index}{" "}
                  {project?.brand[0]?.name && (
                    // <Link href={`/brands/${project?.brand[0]?._id}`} passHref>
                    <span onClick={() => handleRouteLocation(`/brands/${project?.brand[0]?._id}`)} className="hover:cursor-pointer  hover:underline">
                      {" | " + project?.brand[0]?.name}{" "}
                    </span>
                    // </Link>
                  )}
                  {project?.client_admin &&
                    " | " + project?.client_admin?.email + " "}
                  | {project.project_type}
                </p>
              </div>
            </div>
            <div className="col-span-2 h-full w-full flex justify-center text-xs lg:text-sm xl:text-base">
              <div className="flex-col text-left my-auto min-w-[125px] lg:min-w-[135px]">
                {utils.projectLastUpdateFormate(
                  new Date(
                    project?.update_date
                      ? project.update_date
                      : project?.create_date
                  )
                )}
              </div>
            </div>
            <div className="col-span-2 h-full w-full flex justify-center text-xs lg:text-sm xl:text-base">
              <div className="flex-col text-left my-auto min-w-[125px] lg:min-w-[135px]">
                {utils.projectStartDateFormate(new Date(project?.create_date))}
              </div>
            </div>
            <div className="col-span-2 h-full w-full flex justify-center text-xs lg:text-sm xl:text-base">
              <div className="flex-col text-left my-auto min-w-[125px] lg:min-w-[135px]">
                {utils.projectStartDateFormate(
                  new Date(project?.estimate_date)
                )}
              </div>
            </div>
            <div className="col-span-2 flex h-full">
              {/* project pause, resume, chat, file buttons */}
              <ProjectCardFunc project={project} setDontShowRevision={setDontShowRevision} setUpdateTime={setUpdateTime}/>

              <div
                className={`${statusColorUtil(
                  project.project_status
                )} h-full w-8 rounded-r-lg align-center flex justify-center items-center`}
              >
                <p className="transform text-xs rotate-90 whitespace-nowrap text-center font-semibold m-[8px] ">
                  {utils.projectStatusFormate(project?.project_status)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* project revision dropdown */}
        {
          (revisionProjectId == project._id && !dontShowRevision) &&
          <div className="relative prj-rvsn-cont">
            {
              revisionLoading ?
                <div className="h-[80px] flex justify-center items-center">
                  <ButtonLoader />
                </div>
                :
                (!revisions || revisions?.length < 1) ?
                  <div className="h-[80px] flex justify-center w-[90%] ml-auto text-[#414040] bg-[#F8F8F8] items-center p-5 mb-2 rounded-xl prj-rvsn">
                    <h1 className="component-heading">No revisions found</h1>
                  </div>
                  :
                  <>
                    {
                      revisions?.map((revision, index) => {
                        if (index === 0) {
                          return (
                            // <Link href={`/ projects / revision / ${revision._id}`} key={revision._id}>
                            <div className="flex relative" onClick={() => handleRouteToRevision(revision)} key={revision._id}>
                              <div className="prj-rvsn-crd-frst">
                                {/* round thing 1 */}
                                <div className="w-[8px] h-[8px] rounded-[50%] bg-[#C4C4C4] absolute left-[-5px]"></div>
                                {/* round thing 2 */}
                                <div className="w-[8px] h-[8px] rounded-[50%] bg-[#C4C4C4] absolute right-[-5px] bottom-[-5px]"></div>
                              </div>
                              <div className="w-[90%] ml-auto grid grid-cols-12 text-[#414040] bg-[#F8F8F8] items-center p-5 mb-2 rounded-xl prj-rvsn">
                                <div className="col-span-3 text-[20px]">
                                  {
                                    (role === "client_admin" ||
                                      role === "client_member")
                                      ? revision.title?.split(" ")[0] +
                                      " " +
                                      parseInt(revision.title?.split(" ")[1])
                                      : revision.title}
                                </div>
                                <div className="col-span-3 ml-2">
                                  {
                                    utils.projectLastUpdateFormate(new Date(revision.revision_start_time))
                                  }
                                </div>
                                <div className="col-span-6 ml-auto">
                                  <div className="bg-[#C4C4C4] h-6 w-6" style={{ borderRadius: "50%" }}></div>
                                </div>
                              </div>
                            </div>
                            // </Link>
                          )
                        } else {
                          return (
                            // <Link href={`/projects/revision/${revision._id}`} key={revision._id}>
                            <div className={`flex relative`} key={revision._id} onClick={() => handleRouteToRevision(revision)}>
                              <div className="prj-rvsn-crd-scnd">
                                {/* round thing 2 */}
                                <div className="w-[8px] h-[8px] rounded-[50%] bg-[#C4C4C4] absolute right-[-5px] bottom-[-5px]"></div>
                              </div>
                              <div className="w-[90%] ml-auto grid grid-cols-12 text-[#414040] bg-[#F8F8F8] items-center p-5 mb-2 rounded-xl prj-rvsn">
                                <div className="col-span-3 text-[20px]">
                                  {
                                    (role === "client_admin" ||
                                      role === "client_member")
                                      ? revision.title?.split(" ")[0] +
                                      " " +
                                      parseInt(revision.title?.split(" ")[1])
                                      : revision.title}
                                </div>
                                <div className="col-span-3 ml-2">
                                  {
                                    utils.projectLastUpdateFormate(new Date(revision.revision_start_time))
                                  }
                                </div>
                                <div className="col-span-6 ml-auto">
                                  <div className="border-[2px] border-[#C4C4C4] h-6 w-6" style={{ borderRadius: "50%" }}></div>
                                </div>
                              </div>
                            </div>
                            // </Link>
                          )
                        }
                        return null;
                      })
                    }
                  </>
            }
            {/* end of revision cards */}
          </div>
        }
      </li>
    </>
  );
}

export default ProjectCard;
