import Link from "next/link";
import React from "react";
import utils from "../../../helpers/utils";
import { FaFolder } from "react-icons/fa";
import { FileSizeHElper, projectFileUpdateTime } from "../../../lib/FileHelper";

export const FileBox = ({
  project,
  index,
  activeFile,
  isInFile = false,
  setActiveFile = () => { },
}) => {
  const statusColorUtil = (status) => {
    if (status == "to_be_confirmed") return "bg-[#FFE147]";
    else if (status == "cancelled") return "bg-[#FF0000]";
    else if (status == "completed") return "bg-[#0ADEA9]";
    else if (status == "u_review") return "bg-[#FFE147]";
    else if (status == "in_progress") return "bg-[#FFE147]";
    else if (status === "pause") return "bg-[#FF9900]";
    else return "bg-[#FFE147]";
  };

  if (!project)
    return <span className="m-10 text-3xl text-red"> No projects</span>;
  return (
    <li
      className="border-gray-400 flex cursor-pointer"
      onClick={() => setActiveFile(index)}
    >
      <div className="select-none flex flex-1 bg-secondry-gray  mt-3 py-4 h-28 rounded-[11px] text-[#414040] relative">
        <div className="flex-1 w-full self-center ">
          <div className="mx-7">
            {activeFile === index ? (
              <svg
                width="33"
                height="26"
                viewBox="0 0 33 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0H24L32.5 13L24 26H0V0Z" fill="#bfbfbf" />
              </svg>
            ) : (
              <svg
                width="33"
                height="26"
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
          </div>
        </div>
        <div className="flex-5   w-full self-center ">
          <div className="flex-col self-center text-left w-[16rem]">
            <Link href={`/files/${project._id}`}>
              <p className="font-medium text-xl truncate">
                {project.title}
              </p>
            </Link>
            <p className="text-primary-blue text-sm lowercase">
              {project.project_index < 10 ? "00" + project.project_index : project.project_index < 100 ? "0" + project.project_index : project.project_index}{" | "}
              {project?.brand[0]?.name && (
                <Link href={`/brands/${project?.brand[0]?._id}`} passHref>
                  <span className="hover:cursor-pointer  hover:underline">
                    {project?.brand[0]?.name}{" | "}
                  </span>
                </Link>
              )}
              {project.project_type}
            </p>
          </div>
        </div>
        <div className="flex-3 text-center  w-full self-center ">
          <p className=" ml-auto text-left w-fit min-w-[160px]">
            {
              isInFile ? projectFileUpdateTime(project.input, project.download, project) :
                utils.projectStartDateFormate(
                  new Date(
                    project?.update_date
                      ? project.update_date
                      : project?.create_date
                  )
                )
            }
          </p>
        </div>
        <div className="flex-3 text-center  w-full self-center ">
          <p className=" ml-auto text-left w-fit min-w-[160px]">
            {
              FileSizeHElper([...project.download, ...project.input])
            }
          </p>
        </div>
        <div className="h-full absolute right-0 top-0">
          <div
            className={`${statusColorUtil(
              project.project_status
            )} h-full w-8 rounded-r-lg align-center flex justify-center items-center`}
          >
            <p className="transform font-medium text-xs rotate-90 whitespace-nowrap text-center m-[8px] text-[#2C2C2C]">
              {utils.projectStatusFormate(project?.project_status)}
            </p>
          </div>
        </div>
      </div>

    </li>
  );
};
