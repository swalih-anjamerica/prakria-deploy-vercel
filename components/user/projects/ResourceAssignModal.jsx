import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import rivisionService from '../../../services/rivision';
import ButtonLoader from '../../common/ButtonLoader';
import Loader from '../../layouts/Loader';
import { MdClose } from "react-icons/md";

function ResourceAssignModal({ setShowModal, resource, projectId, setUpdatedTime }) {

    const router = useRouter();
    const [ title, setTitle ] = useState("");
    const [ titleErr, setTitleErr ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ notCompleteRevision, setNotCompleteRevision ] = useState(null);
    const [ checkingRevisionIncompleted, setCheckingRevisionIncompleted ] = useState(false);
    const [ resourceUpdating, setResourceUpdating ] = useState(false);

    useEffect(() => {
        const checkRevisionIncompleted = async () => {
            try {
                setCheckingRevisionIncompleted(true);
                const response = await rivisionService.checkIncompleteRivision(projectId);

                setCheckingRevisionIncompleted(false);
                if (response.status !== 200) {
                    setNotCompleteRevision(null);
                }

                setNotCompleteRevision(response?.data?.notComplete)
            } catch (e) {
                setCheckingRevisionIncompleted(false);
                setNotCompleteRevision(null);
            }
        }

        checkRevisionIncompleted();
        return () => {
            toast.dismiss();
        }
    }, [])

    async function handleCreateRivision(e) {
        e.preventDefault();
        if (!resource) return;
        if (!projectId) return;
        // setTitleErr("");
        // if (!title) return setTitleErr("Title required");

        try {
            setLoading(true);
            const response = await rivisionService.createNewRivision(projectId, title, resource._id, "")

            if (response.status === 200) {
                toast.success("Revision created successfully");
                setUpdatedTime(Date.now());
                setTimeout(() => {
                    setLoading(false);
                    router.push(`/projects/${projectId}?tab=REVIEW`);
                }, 800);
            }
        } catch (e) {
            setLoading(false);
            if (e?.response?.data?.error) {
                toast.error(e.response.data.error)
            } else {
            }

        }
    }

    async function handleUpdateResource(e) {
        e.preventDefault();
        if (!notCompleteRevision) return;

        try {
            setResourceUpdating(true);
            const response = await rivisionService.updateResource(notCompleteRevision?._id, resource._id);

            if (response.status !== 200) {
                setResourceUpdating(false);
                toast.error("something wrong");
            }
            toast.success("Revision updated successfully");
            setUpdatedTime(Date.now());
            setTimeout(() => {
                setResourceUpdating(false);
                router.push(`/projects/${projectId}?tab=REVIEW`);
            }, 800);
        } catch (e) {
            setResourceUpdating(false);
            if (e.response?.status === 400) {
                toast(`⚠️ ${e.response.data?.error}`)
            }
        }
    }

    if (checkingRevisionIncompleted) {
        return (
            <div
                className="fixed z-10 inset-0 overflow-y-auto"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Loader />
                </div>
            </div>
        )
    }

    return (
        <div
            className={`fixed z-10 inset-0 overflow-y-auto `}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-primary-gray bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                />
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true">
                    &#8203;
                </span>

                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[80%] 2xl:w-[60%]">
                    <div className="p-10 bg-secondry-gray w-full  my-auto gap-4">
                        <div className="col-span-12 mb-5 flex justify-between">
                            <h1 className="text-3xl">Create new revision</h1>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                }}>
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>
                        <div>
                            {
                                // when there is a not complete revision
                                notCompleteRevision ?
                                    <form className="p-10 pl-0 bg-secondry-gray grid grid-cols-12" onSubmit={handleUpdateResource}>
                                        <div className="col-span-12 ">
                                            <div className="flex-col  w-full flex gap-3">
                                                <label className="font-semibold text-[20px] text-[#414040]" htmlFor="Company name">
                                                    Revision title
                                                </label>
                                                <p className='form-input ' style={{ borderRadius: "10px", padding: "20px" }}>{notCompleteRevision?.title}</p>
                                            </div>
                                        </div>
                                        {/* for show old resource */}

                                        <div className="col-span-12">
                                            <div className="select-none rounded flex flex-1 items-center bg-secondry-gray py-6 mt-3  text-[12px]">

                                                <div className="flex-1 pl-1 flex">
                                                    {/* <i className="fa fa-circle fa-3x mr-10 self-center text-red" aria-hidden="true"></i> */}
                                                    <div className="font-semibold text-[20px] self-center text-[#414040]">
                                                        {notCompleteRevision?.resource_id?.first_name + " " + notCompleteRevision?.resource_id?.last_name}
                                                    </div>
                                                </div>
                                                <div className="mr-8 flex max-w-[50%] overflow-hidden hover:overflow-auto">
                                                    <div className="flex-col text-center text-[#8A8A8A] font-semibold">
                                                        <p>{notCompleteRevision?.resource_id?.email}</p>
                                                    </div>
                                                    {
                                                        notCompleteRevision?.resource_skills?.map(skill => {
                                                            return (
                                                                <React.Fragment key={skill._id}>
                                                                    <div className="w-0.5 h-5 mx-3  bg-primary-gray my-auto"></div>
                                                                    <div className="flex-col text-center text-[#8A8A8A] font-semibold">
                                                                        <p>{skill.skill_name}</p>
                                                                    </div>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <button style={{ color: "#585757", background: "#E9E9E9", fontWeight: 600, borderRadius: "10px" }} className="black-md-action-button">
                                                    Previous
                                                </button>
                                            </div>
                                        </div>
                                        {/* for show new resource */}
                                        <div className="col-span-12">
                                            <div className="select-none rounded flex flex-1 items-center bg-secondry-gray py-6 mt-3  text-[12px]">

                                                <div className="flex-1 pl-1 flex">
                                                    {/* <i className="fa fa-circle fa-3x mr-10 self-center text-red" aria-hidden="true"></i> */}
                                                    <div className="font-semibold text-[20px] self-center text-[#414040]">
                                                        {resource?.first_name + " " + resource?.last_name}
                                                    </div>
                                                </div>
                                                <div className="mr-8 flex max-w-[50%] overflow-hidden hover:overflow-auto">
                                                    <div className="flex-col text-center text-[#8A8A8A] font-semibold">
                                                        <p>{resource?.email}</p>
                                                    </div>
                                                    {
                                                        resource?.skills?.map(skill => {
                                                            return (
                                                                <React.Fragment key={skill._id}>
                                                                    <div className="w-0.5 h-5 mx-3  bg-primary-gray my-auto"></div>
                                                                    <div className="flex-col text-center text-[#8A8A8A] font-semibold">
                                                                        <p>{skill.skill_name}</p>
                                                                    </div>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <button style={{ background: "#585757", fontWeight: 600, borderRadius: "10px" }} className="black-md-action-button" onClick={e => setShowModal(false)}>
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-span-8'></div>
                                        <div className="col-span-4 mt-6 flex justify-end">
                                            {
                                                resourceUpdating ?
                                                    <button className="yellow-action-button-landing" style={{ fontWeight: 600, padding: '10px', fontSize: "20px", color: "#414040", borderRadius: "10px" }} disabled>
                                                        <ButtonLoader />
                                                    </button>
                                                    :
                                                    <button className="yellow-action-button-landing" style={{ fontWeight: 600, padding: '10px', fontSize: "20px", color: "#414040", borderRadius: "10px" }} type="submit">Update resource</button>
                                            }
                                        </div>
                                    </form>
                                    :
                                    // when creating a new revision
                                    <form className="lg:p-10 pl-0 lg:pl-0 bg-secondry-gray grid grid-cols-12" onSubmit={handleCreateRivision}>
                                        <div className="col-span-12 ">
                                            <div className="flex-col  w-full ">
                                                {/* <label className="font-semibold text-[20px] text-[#414040]" htmlFor="Company name">
                                                    Revision title
                                                </label> */}
                                                {/* <input className=" form-input " style={{ borderRadius: "10px", padding: "20px" }} id="username" type="text" value={title} onChange={e => setTitle(e.target.value)} />
                                                <p style={{ color: "red" }}>{titleErr}</p> */}
                                            </div>
                                        </div>
                                        <div className="col-span-12">
                                            <div className="select-none rounded flex flex-1 items-center bg-secondry-gray py-6 mt-3  ">
                                                <div className="flex-1 pl-1 mr-16 flex">
                                                    {/* <i className="fa fa-circle fa-3x mr-10 self-center text-red" aria-hidden="true"></i> */}
                                                    <div className="font-semibold text-[20px] self-center text-[#414040]">
                                                        {resource?.first_name + " " + resource?.last_name}
                                                    </div>
                                                </div>
                                                <div className="mr-8 max-w-[50%] overflow-hidden hover:overflow-auto flex">
                                                    <div className="flex-col text-center text-[#8A8A8A] font-semibold">
                                                        <p>{resource?.email}</p>
                                                    </div>
                                                    {
                                                        resource?.skills?.map(skill => {
                                                            return (
                                                                <React.Fragment key={skill._id}>
                                                                    <div className="w-0.5 h-5 mx-3  bg-primary-gray my-auto"></div>
                                                                    <div className="flex-col text-center text-[#8A8A8A] font-semibold">
                                                                        <p>{skill.skill_name}</p>
                                                                    </div>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <button className="black-md-action-button" onClick={e => setShowModal(false)} style={{ borderRadius: "10px", fontWeight: 600 }}>
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-span-8 mt-6'></div>
                                        <div className="col-span-4 mt-6">
                                            {
                                                loading ?
                                                    <button className="yellow-lg-action-button" tyle={{ fontWeight: 600, fontSize: "20px", color: "#414040", borderRadius: "10px" }} disabled>
                                                        <ButtonLoader />
                                                    </button>
                                                    :
                                                    <button className="yellow-lg-action-button" style={{ fontWeight: 600, fontSize: "20px", color: "#414040", borderRadius: "10px" }} type="submit">Assign Resource</button>
                                            }
                                        </div>
                                    </form>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResourceAssignModal

