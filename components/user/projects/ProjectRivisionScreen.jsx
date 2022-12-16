import Link from "next/link";
import React, { useEffect, useState } from "react";
import utils from "../../../helpers/utils";
import { useAuth } from "../../../hooks/useAuth";
import { Modal } from "../../common/Modal";
import Loader from "../../layouts/Loader";
import ProjectBreif from "./ProjectBreif";
import projectSerice from "../../../services/projects";
import RevisionFileUploadModal from "./RevisionFileUploadModal";
import { useQuery } from "react-query";
import getFileExtension from "../../../lib/FileHelper";
import { getVideoThumbail } from "../../../helpers/video.helper";
import { useMemo } from "react";
import ButtonLoader from "../../common/ButtonLoader";
import { FileDelIcon, VideoIcon } from "../../../helpers/svgHelper";
import rivisionService from "../../../services/rivision";
import toast from "react-hot-toast";
import { deleteFileHandler } from "../../../services/fileUpload";

function ProjectRivisionScreen({
  tabLink,
  rivisionFetchStuff,
  projectId,
  setUpdatedTime,
  updatedTime,
  project,
}) {
  const { rivisionLoading, rivisions, status, revisionFetching } = rivisionFetchStuff;
  const { role, user } = useAuth();
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [showBrief, setShowBrief] = useState(false);

  // const { data, isLoading: projectDetailsLoading } = useQuery([ "project_details" ], () => projectSerice.fetchProjectDetailsById(projectId), { enabled: !!projectId });

  return (
    <>
      {/* showing file upload modal */}
      {showFileUploadModal && (
        <RevisionFileUploadModal
          setShowModal={setShowFileUploadModal}
          projectId={projectId}
          revisionId={selectedRevision._id}
          setUpdatedTime={setUpdatedTime}
        />
      )}
      <div className="relative min-h-screen flex">
        <div className="flex-1 min-h-screen  h-screen">
          <div
            className={`${role == "project_manager" || role == "designer"
              ? "bg-primary-white border-y-2 border-primary-grey"
              : "bg-primary-white border-y-2 border-primary-grey"
              } bg-primary-white w-full  flex border-y-2 border-primary-grey gap-4"`}
          >
            <ul className="flex flex-1 gap-10 self-center items-center w-full px-9 h-14">
              {role != "designer" && (
                <Link href={"/projects/" + projectId + "?tab=CONNECT"}>
                  <a className="diabled-horizontal-nav-item-textstyle">
                    Connect
                  </a>
                </Link>
              )}
              <Link href={"/projects/" + projectId + "?tab=REVIEW"}>
                <a
                  className={
                    tabLink === "REVIEW"
                      ? role == "project_manager" || role == "designer"
                        ? "active-horizontal-nav-item-textstyle"
                        : "active-horizontal-nav-item-textstyle"
                      : "diabled-horizontal-nav-item-textstyle"
                  }
                >
                  Review
                </a>
              </Link>
              <Link href={"/projects/" + projectId + "?tab=DOWNLOAD"}>
                <a
                  className={
                    tabLink === "DOWNLOAD"
                      ? role == "project_manager"
                        ? "pm-active-nav"
                        : "active-horizontal-nav-item-textstyle"
                      : "diabled-horizontal-nav-item-textstyle"
                  }
                >
                  {role == "designer" ? "Upload" : "Download"}
                </a>
              </Link>

              {role === "project_manager" && (
                <Link href={"/projects/" + projectId + "?tab=ADD_RESOURCE"}>
                  <a className="diabled-horizontal-nav-item-textstyle">
                    Add resource
                  </a>
                </Link>
              )}
            </ul>
          </div>
          {(rivisionLoading || revisionFetching) ? (
            <div className=" w-full flex-1 p-8">
              <Loader height={"40vh"}/>
            </div>
          ) : (!rivisions || rivisions?.length < 1) ? (
            <div className=" w-full flex-1 p-8 pt-4">
              <div className="component-heading">No revision found.</div>
            </div>
          ) : (
            <div className=" w-full flex-1 p-8 pt-4">
              <div className="text-[14px] md:text-[2vw] xl:text-[35px] flex justify-between gap-1 break-words items-center">
                <p>
                  We Save all the Revision Copies,<br />just in case you will need them
                </p>
                {role === "designer" && (
                  <button
                    onClick={() => setShowBrief(true)}
                    className="black-md-action-button md:py-1 md:px-2 md:text-sm w-[100px] lg:w-[160px] h-[30px]"
                  >
                    Show Brief
                  </button>
                )}
              </div>
              {showBrief && role === "designer" && (
                <BriefModal
                  showBrief={showBrief}
                  setShowBrief={setShowBrief}
                  project={project}
                />
              )}
              {role === "designer" ? (
                <div className="flex flex-col gap-11 mt-9">
                  {rivisions?.map((rivision) => {
                    return <DesignerRevisionScreenCard rivision={rivision} key={rivision._id} user={user} project={project} setSelectedRevision={setSelectedRevision} setShowFileUploadModal={setShowFileUploadModal} setUpdatedTime={setUpdatedTime} />
                  })}
                </div>
              ) : (
                <div className="grid grid-flow-row  grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 z-20 mt-10">
                  {rivisions?.map((rivision) => {
                    return <UserRevisionCard rivision={rivision} key={rivision._id} user={user} project={project} setSelectedRevision={setSelectedRevision} />
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const BriefModal = ({ showBrief, setShowBrief, project, }) => {
  return (
    <Modal
      title={project?.title}
      showModal={showBrief}
      setShowModal={setShowBrief}
    >
      <div className="py-5 whitespace-nowrap">
        <div className="font-medium text-xl">Status</div>
        <div className="w-fit p-2 border-2 border-primary-text bg-light-yellow mt-3 flex justify-between">
          <p>
            Estimate :{" "}
            {utils.projectExpectedTimeDateFormate(
              new Date(project?.estimate_date)
            )}
          </p>
        </div>
        <ProjectBreif project={project} />
      </div>
    </Modal>
  );
};

const DesignerRevisionScreenCard = ({ rivision, user = {}, project, setSelectedRevision, setShowFileUploadModal, setUpdatedTime }) => {

  const [deleting, setDeleting] = useState(false);

  const handleFileDelete = async () => {
    try {
      setDeleting(true);
      await deleteFileHandler(rivision.rivision_file);
      await rivisionService.deleteRevisionFileService({ revision_id: rivision._id });
      setDeleting(false);
      setUpdatedTime(Date.now());
      toast.success("Revision file deleted successfully");
    } catch (e) {
      setDeleting(false);
      toast.error("Please try again later");
    }
  }

  const ext = useMemo(() => {
    return rivision.rivision_file
      ? getFileExtension(rivision.rivision_file)
      : null;
  }, [rivision])
  const [imgUrl, setImgUrl] = useState(null);

  const getImageUrl = async () => {
    if (ext == "mp4" || ext == "mkv" || ext == "3gp" || ext == "mov") {
      let thumpnail = await getVideoThumbail(`/api/s3-upload/view/?key=${rivision.rivision_file}`)
      setImgUrl(thumpnail);
    } else if (ext == "jpg" || ext == "jpeg" || ext == 'png' || ext == 'gif' || ext == 'svg' || ext == 'webp') {
      setImgUrl(`/api/s3-upload/view/?key=${rivision.rivision_file}`);
    } else {
      setImgUrl(null);
    }
  };
  useEffect(() => {
    if (!rivision) return;
    getImageUrl();
  }, [rivision, ext])


  return (
    <div
      className="w-full flex items-center justify-between md:px-2 px-10 h-28 rounded-lg bg-[#F4F4F4]"
      key={rivision._id}
    >
      <div className="grid grid-cols-3 md:gap-2 xl:gap-4 w-full">
        <div>
          {rivision?.rivision_file ? (
            <Link href={`/projects/revision/${rivision._id}`} passHref>
              <div className="w-40 bg-[#F4F4F4] h-20 relative">
                {
                  !imgUrl ?
                    <div className="h-full grid place-content-center bg-black">
                      {/* <ButtonLoader message={"loading.."} /> */}
                    </div>
                    :
                    <img
                      src={imgUrl}
                      className="w-full h-full object-contain "
                    />}
                {
                  ((ext == "mp4" || ext == "mkv" || ext == "3gp" || ext == "mov")) && <VideoIcon className={"absolute top-[50%] left-[50%]"} style={{ transform: "translate(-50%, -50%)" }} />
                }
              </div>
            </Link>
          ) : (
            <div className="w-40 bg-primary-gray h-20 flex items-center px-2 justify-center">
              <p className="text-blue-50">No Revisions</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-start">
          <div className="text-2xl">
            <div className="flex flex-col component-heading items-center gap-2">
              <span className="text-base xl:text-xl">{rivision.title}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-start items-center">
          <div className="">
            <p className="form-input uppercase text-gray-600 xl:p-2 md:text-xs">
              {utils.projectStatusFormate(
                rivision.rivision_status
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {(rivision.rivision_status === "in_progress" ||
          (rivision.rivision_status === "prakria_rejected" &&
            rivision.comments?.length < 1)) &&
          project?.resource?._id === user._id ? (
          <button
            className="m-2  font-medium flex flex-col text-[#090909] rounded-md bg-light-yellow  justify-center items-center transition-colors duration-150 hover:bg-secondry-yellow p-2 md:p-1 w-[100px] lg:w-[160px] h-[30px] xl:p-2 md:text-xs  cursor-pointer uppercase"
            onClick={() => {
              setSelectedRevision(rivision);
              setShowFileUploadModal(true);
            }}
          >
            Upload File
          </button>
        )
          :
          <button
            className="m-2  font-medium flex flex-col text-[#090909] rounded-md justify-center items-center transition-colors duration-150 p-2 md:p-1 w-[100px] lg:w-[160px] h-[50px] xl:p-2 md:text-xs uppercase cursor-pointer"
            onClick={handleFileDelete}
            disabled={deleting}
          >
            {
              deleting ?
                <ButtonLoader />
                :
                rivision.rivision_status === "u_review" &&
                <FileDelIcon height={40} width={40} />
            }
          </button>
        }
      </div>


    </div>
  );
}

const UserRevisionCard = ({ rivision, user = {} }) => {
  const ext = useMemo(() => {
    return rivision.rivision_file
      ? getFileExtension(rivision.rivision_file)
      : null;
  }, [rivision])
  const [imgUrl, setImgUrl] = useState(null);

  const getImageUrl = async () => {
    if (ext == "mp4" || ext == "mkv" || ext == "3gp" || ext == "mov") {
      let thumpnail = await getVideoThumbail(`/api/s3-upload/view/?key=${rivision.rivision_file}`)
      setImgUrl(thumpnail);
    } else if (ext == "jpg" || ext == "jpeg" || ext == 'png' || ext == 'gif' || ext == 'svg' || ext == 'webp') {
      setImgUrl(`/api/s3-upload/view/?key=${rivision.rivision_file}`);
    } else {
      setImgUrl(null);
    }
  };

  useEffect(() => {
    getImageUrl();
  }, [rivision, ext])
  return (
    <div className="p-4 w-full bg-secondry-gray">
      {rivision?.rivision_file ? (
        <Link href={`/projects/revision/${rivision._id}`}>
          <div className="w-full bg-secondry-gray h-48 relative">
            {
              !imgUrl ?
                <div className="h-full grid place-content-center bg-black">
                  {/* <ButtonLoader message={"loading"} /> */}
                </div>
                :
                <img
                  src={imgUrl}
                  className="w-full h-full object-contain"
                />
            }

            {
              ((ext == "mp4" || ext == "mkv" || ext == "3gp" || ext == "mov")) && <VideoIcon className={"absolute top-[50%] left-[50%] hover:opacity-80"} style={{ transform: "translate(-50%, -50%)" }} />
            }
          </div>
        </Link>
      ) : (
        <div className="w-full bg-primary-gray h-48 flex items-center px-2 justify-center">
          {/* There is no revision file. */}
          <p className="text-blue-50">No Revision Uploaded</p>
        </div>
      )}
      <div className="mt-4 font-medium capitalize">
        {user?.role === "client_admin" ||
          user?.role === "client_member"
          ? rivision.title?.split(" ")[0] +
          " " +
          parseInt(rivision.title?.split(" ")[1])
          : rivision.title}
      </div>
    </div>
  );
}

export default ProjectRivisionScreen;