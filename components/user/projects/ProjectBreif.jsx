import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import ProjectBreifEditModal from "./ProjectBreifEditModal";
import {HiOutlinePencil} from "react-icons/hi"

function ProjectBreif({ project, setUpdatedTime }) {
  const [showEditBreifModal, setShowEditBreifModal] = useState(false);
  const { role } = useAuth();
  return (
    <>
      {showEditBreifModal && (
        <ProjectBreifEditModal
          setShowModal={setShowEditBreifModal}
          project={project}
          setUpdatedTime={setUpdatedTime}
        />
      )}
      <div className="mt-4  space-y-2 border-b select-text flex-1 font-medium">
        <div className="flex justify-between">
          <p className="text-xl">Brief</p>
          {role != "designer" && (
            <button
              title="edit project breif"
              onClick={() => setShowEditBreifModal(true)}
            >
              <HiOutlinePencil className="h-5 w-5 text-black" />
            </button>
          )}
        </div>
        <div className="max-h-[26rem] overflow-y-auto">
          <p className="text-sm whitespace-normal mb-3 ">
            <span>Title: </span>
            <span className="text-lg text-primary-blue break-words">{project?.title}</span>
          </p>
          <p className="text-sm whitespace-normal mb-3">
            <span>Category: </span>
            {project?.category}
          </p>
          <p className="text-sm whitespace-normal mb-3">
            <span>Type: </span>
            {project?.project_type}
          </p>
          <p className="text-sm whitespace-normal mb-3">
            <span>Sizes: </span>
            {project?.size?.map((size, index) => size+`${index<project.size.length-1?",":""}`)}
          </p>
          <p className="text-sm whitespace-normal mb-3 w-full break-words">
            <span>Message: </span>
            {project?.message ? project?.message : "no messages"}
          </p>
        </div>
      </div>
    </>
  );
}

export default ProjectBreif;
