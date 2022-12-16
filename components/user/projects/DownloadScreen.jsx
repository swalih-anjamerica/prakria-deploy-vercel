import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import API from "../../../services/api";
import { deleteFileHandler, uploadFile } from "../../../services/fileUpload";
import { FileUploadButton } from "../Brands/fileUploadButton";
import FileCardDown from "../Files/FileCardDown";
import { ProgressBarDownload } from "../../../components/common/ProgressBar";

function DownloadScreen({
  tabLink,
  projectId,
  skills,
  setUpdatedTime,
  project = null,
}) {
  const { role } = useAuth();
  const router = useRouter();


  const [progress, setProgress] = useState(0);

  const uploadFileHandler = async (formData) => {
    toast.loading("uploading file...");
    const { status, data: files } = await uploadFile(
      formData,
      undefined,
      projectId,
      "downloads",
      setProgress,
      role
    );

    if (!status) return toast.dismiss();

    const updateFile = await API.put(
      `/users/projects/all/addFiles?projectId=${projectId}&folder=${"downloads"}`,
      { files }
    );
    toast.dismiss();
    toast.success("Files Uploaded");
    setUpdatedTime(Date.now());
  };

  const FileDeleteHandler = async ({ key }) => {
    try {
      toast.loading("deleting..");
      const deleteResponse = await deleteFileHandler(key, true)
      toast.dismiss();
      toast.success(deleteResponse.data)
      setUpdatedTime(Date.now());
    } catch (error) {
      toast.dismiss();
      toast.error("File Not Deleted")
    }
  }


  return (
    <>
      <div
        className={`${role == "project_manager" || role == "designer"
          ? "bg-primary-white border-y-2 border-primary-grey"
          : "bg-primary-white border-y-2 border-primary-grey"
          } bg-primary-white w-full  flex border-y-2 border-primary-grey gap-4"`}
      >
        <ul className="flex flex-1 gap-10 self-center items-center w-full px-9 h-14">
          {role != "designer" && (
            <Link href={"/projects/" + projectId + "?tab=CONNECT"}>
              <a
                className={
                  tabLink === "CONNECT"
                    ? role == "project_manager" || role == "designer"
                      ? "pm-active-nav"
                      : "active-horizontal-nav-item-textstyle"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                Connect
              </a>
            </Link>
          )}

          <Link href={"/projects/" + projectId + "?tab=REVIEW"}>
            <a className="diabled-horizontal-nav-item-textstyle">Review</a>
          </Link>

          <Link href={"/projects/" + projectId + "?tab=DOWNLOAD"}>
            <a
              className={
                tabLink === "DOWNLOAD"
                  ? role == "project_manager" || role == "designer"
                    ? "active-horizontal-nav-item-textstyle"
                    : "active-horizontal-nav-item-textstyle"
                  : "diabled-horizontal-nav-item-textstyle"
              }
            >
              {role == "designer" ? "Upload" : "Download"}
            </a>
          </Link>

          {role === "project_manager" && (
            <Link href={"/projects/" + projectId + "?tab=ADD_RESOURCE"}>
              <a
                className={
                  tabLink === "ADD_RESOURCE"
                    ? "pm-active-nav"
                    : "diabled-horizontal-nav-item-textstyle"
                }
              >
                Add resource
              </a>
            </Link>
          )}
        </ul>
      </div>
      <ProgressBarDownload progress={progress} />
      <div className=" w-full flex-1 p-8">
        {role == "designer" && (
          <div className="flex items-end justify-between mb-10">
            {
              project?.download?.length < 1 ?
                <h1 className="component-heading">No files found.</h1>
                :
                <h1 className="component-heading"></h1>
            }
            <FileUploadButton
              style={{ fontWeight: 600 }}
              formStyle={{ marginRight: 0 }}
              acceptedFileTypes={
                ".csv,.psd,.zip,.ai,.cdr,.jpg,.png,.svg,.swg,.mp4,.mov,.tga,.avi,.mpeg,.docx,.xlxs,.pptx,.mp3,.wma,.zip,.rar"
              }
              label={"Upload Files"}
              onChange={uploadFileHandler}
              uploadFileName={"file"}
            />
          </div>
        )}

        {(project?.download?.length < 1) ? (
          <div>
            {
              role !== "designer" && <h1 className="component-heading">No files found.</h1>
            }
          </div>
        ) :
          (
            <>
              <div className="flex mb-2 ">
                <div className="grid grid-cols-12 w-full text-center rounded-lg p-4 pb-0 pr-0 z-[1] text-[#414040] ">
                  {/* <div className="col-span-1 py-1 flex"></div> */}
                  <div className="col-span-3 pl-4 py-1 w-full flex">
                    <div className="flex-col text-left my-auto font-medium text-base">
                      <p className="font-medium text-sm xl:text-base break-words w-40 xl:w-[15rem]">
                        FILE
                      </p>
                    </div>
                  </div>
                  <div className="col-span-3 py-1 w-full  flex">
                    <div className="text-left m-auto font-medium text-sm xl:text-base">
                      DATE
                    </div>
                  </div>
                  <div className="col-span-3 py-1 w-full  flex">
                    <div className="text-center m-auto font-medium text-sm xl:text-base">
                      SIZE
                    </div>
                  </div>
                  <div className="col-span-3 w-full py-1 flex gap-5 items-center justify-center font-medium text-sm xl:text-base mr-16">
                    ACTION
                  </div>
                </div>
              </div>
              <ul className="mt-0">
                {project?.download?.map((file, index) => (
                  <FileCardDown
                    setProgress={setProgress}
                    file={file}
                    key={file._id}
                    IsInProject={true}
                    FileDeleteHandler={FileDeleteHandler}
                  />
                ))}
              </ul>
            </>
          )}
      </div>
    </>
  );
}

export default DownloadScreen;
