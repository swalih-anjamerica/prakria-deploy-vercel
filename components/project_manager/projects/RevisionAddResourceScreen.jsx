import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md';
import { useAuth } from '../../../hooks/useAuth';
import { useLibraries } from '../../../hooks/useLibraries';
import rivisionService from '../../../services/rivision';
import Loader from '../../layouts/Loader';
import { GoSearch } from "react-icons/go";
import { BiChevronDown } from "react-icons/bi";
import ResourceAssignModal from '../../user/projects/ResourceAssignModal';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ButtonLoader from '../../common/ButtonLoader';



function RevisionAddResourceScreen({ showModal, setShowModal, skills, projectId }) {

    const { role } = useAuth();
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [skillType, setSkillType] = useState(undefined);
    const [resources, setResources] = useState(null);
    const [resourceLoading, setResourceLoading] = useState(false);
    const [resourceDetails, setResourceDetails] = useState(null);
    const [listResourceUpdateTime, setListResourceUpdateTime] = useState(null);
    const [creatingRevisionLoading, setCreatingRevisionLoading] = useState(null);
    const [title, setTitle] = useState("");
    const router = useRouter();

    // function handleShowAssignModal(resource) {
    //     if (!resource) return;
    //     setResourceDetails(resource);
    //     setShowAssignModal(true);
    // }

    async function handleCreateRivision(resource) {

        if (!resource) return;
        if (!projectId) return;

        try {
            setCreatingRevisionLoading(resource._id);
            const response = await rivisionService.createNewRivision(projectId, title, resource._id, "")

            if (response.status === 200) {
                toast.success("Revision created successfully");
                setTimeout(() => {
                    setCreatingRevisionLoading(null);
                    router.push(`/projects/${projectId}?tab=REVIEW`);
                }, 800);
            }
        } catch (e) {
            setCreatingRevisionLoading(null);
            if (e?.response?.data?.error) {
                toast.error(e.response.data.error)
            } else {
            }

        }
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


    if (!showModal) return null;

    return (
        <div
            className={`fixed z-10 inset-0 overflow-y-auto modal-animation`}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-black opacity-40 transition-opacity"
                    aria-hidden="true"
                    onClick={() => setShowModal(false)}
                />
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true">
                    &#8203;
                </span>
                <div className={`relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[80%] modal-body-animation`}>
                    <div className="p-10 flex flex-col bg-secondry-gray w-full  my-auto gap-4">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="">
                                <span className="component-heading">Assign resource</span>
                            </div>
                            <div className="">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                    }}>
                                    <MdClose className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        {/* body */}
                        {/* resource filter and search */}
                        <div className="px-0 flex justify-between gap-4 items-center">
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
                                        {JSON.parse(skills)?.map((skill) => {
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
                        <div className=" w-full flex-1 min-h-[55vh] max-h-[55vh] overflow-auto min-w-[60vw]">
                            {resourceLoading ? (
                                <Loader height={"55vh"} />
                            ) : !resources ? (
                                <div className=" w-full flex-1">
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
                                                <div className="select-none rounded flex w-full  items-center justify-between bg-secondry-gray p-4 px-0 mt-3 md:flex-row text-[14px]">
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
                                                            className="black-action-button md:p-2 md:w-fit cursor-pointer"
                                                            onClick={(e) => handleCreateRivision(user)}
                                                            disabled={creatingRevisionLoading}
                                                        >
                                                            {
                                                                user._id === creatingRevisionLoading ?
                                                                    <ButtonLoader message={"creating revision..."} />
                                                                    :
                                                                    "Assign Project"
                                                            }
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RevisionAddResourceScreen