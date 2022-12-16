import { useRouter } from 'next/router';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { CancelIcon, ChatIcon, FileGreyIcon, PauseIcon, ResumeIcon } from '../../../helpers/svgHelper';
import { useAuth } from '../../../hooks/useAuth'
import { editProjectAllService, pauseProjectService, resumeProjectService } from '../../../services/project';
import ConfirmAlert from '../../common/ConfirmAlert';

function ProjectCardFunc({ setDontShowRevision, project, setUpdateTime = () => { } }) {
    const { role, user } = useAuth();
    const router = useRouter();
    const [showCancelConfirm, setShowCancelConfrim] = useState(false);


    const handleRouteLocation = (location) => {
        setDontShowRevision(true);
        router.push(location);
    }
    const pauseProject = async () => {
        try {
            toast.dismiss();
            setDontShowRevision(true);
            if (role !== "client_admin") return;
            if (project.project_status == "cancelled" || project.project_status == "completed") return;

            const body = {
                project_id: project._id,
                client_name: user.first_name + " " + user.last_name
            }
            await pauseProjectService(body);
            toast.success("Project paused");
            setUpdateTime(Date.now());
        } catch (e) {
            toast.success("Something went wrong");
        }
    }
    const resumeProject = async () => {
        try {
            toast.dismiss();
            setDontShowRevision(true);
            if (role !== "client_admin") return;
            if (project.project_status == "cancelled" || project.project_status == "completed") return;

            const body = {
                project_id: project._id,
                client_name: user.first_name + " " + user.last_name
            }
            await resumeProjectService(body);
            toast.success("Project resumed");
            setUpdateTime(Date.now());
        } catch (e) {
            toast.success("Something went wrong");
        }
    }
    const cancelProject = async () => {
        try {
            toast.dismiss();
            setDontShowRevision(true);
            if (role !== "client_admin") return;
            if (project.project_status == "cancelled" || project.project_status == "completed") return;

            const body = {
                project_id: project._id,
                project_status: "cancelled"
            }
            await editProjectAllService(body);
            toast.success("Project cancelled");
            setUpdateTime(Date.now());
            setShowCancelConfrim(false);
        } catch (e) {
            toast.success("Something went wrong");
        }
    }

    if (role == "designer") {
        return (
            <div className="flex flex-col flex-1 justify-end items-center my-auto w-8">
                <span onClick={() => handleRouteLocation(`/files/${project._id}`)}>
                    <FileGreyIcon className="h-8 w-8 text-secondary-gray cursor-pointer" />
                </span>
            </div>
        )
    }

    if (role === "project_manager"|| role==="creative_director") {
        return (
            <>
                <div className="flex flex-col flex-1 justify-end items-center my-auto w-8">
                    <span onClick={() => handleRouteLocation(`/files/${project._id}`)}>
                        <FileGreyIcon className="h-8 w-8 text-secondary-gray cursor-pointer" />
                    </span>

                    <div className="relative mt-3 w-8 z-0 ">
                        {/* <Link href={`/ projects / ${ project._id }`}> */}
                        <span onClick={() => handleRouteLocation(`/projects/${project._id}`)}>
                            <ChatIcon className="h-7 w-7 text-secondary-gray cursor-pointer" />
                        </span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {
                showCancelConfirm && <ConfirmAlert content={`The project will be canceled permanently. Do you want to proceed?`} handleCancel={() => setShowCancelConfrim(false)} handleConfirm={cancelProject} />
            }
            <div className="flex flex-col flex-1 justify-end items-center my-auto w-8">
                <div className="flex items-center gap-4">
                    <div className="relative mt-3 w-8 z-0 ">
                        <span onClick={() => handleRouteLocation(`/files/${project._id}`)}>
                            <FileGreyIcon className="h-8 w-8 text-secondary-gray cursor-pointer" />
                        </span>
                    </div>
                    <div className="relative mt-3 w-8 z-0 ">
                        {
                            project.project_status == "pause" ?
                                <span onClick={resumeProject}>
                                    <ResumeIcon className="h-7 w-7 text-secondary-gray cursor-pointer" />
                                </span>
                                :
                                <span onClick={pauseProject}>
                                    <PauseIcon className="h-7 w-7 text-secondary-gray cursor-pointer" />
                                </span>
                        }
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative mt-3 w-8 z-0 ">
                        <span onClick={() => handleRouteLocation(`/projects/${project._id}`)}>
                            <ChatIcon className="h-7 w-7 text-secondary-gray cursor-pointer" />
                        </span>
                    </div>
                    <div className="relative mt-3 w-8 z-0 ">
                        <span onClick={()=>{
                            setDontShowRevision(true);
                            setShowCancelConfrim(true)
                        }}>
                            <CancelIcon className="h-7 w-7 text-secondary-gray cursor-pointer" />
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectCardFunc