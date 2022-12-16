import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { MdClose } from 'react-icons/md';
import { assignPMToResoureService, listProjectManagersService } from '../../services/resources';
import ButtonLoader from '../common/ButtonLoader';
import Loader from '../layouts/Loader';

function PMAssignModal({ setUpdateTime, projectManager = {}, showModal, setShowModal, account = {} }) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = listProjectManagersService({ page });

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
                <div className={`relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[80%] modal-body-animation w-[100vw] md:w-[50vw]`}>
                    <div className="p-10 flex flex-col bg-secondry-gray w-full  my-auto gap-4">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="">
                                <span className="component-heading">New Project Manager</span>
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
                        <div className=" ">
                            {
                                isLoading ?
                                    <Loader height={"30vh"} />
                                    :
                                    <div className=''>
                                        {
                                            data?.users?.map((user) => {
                                                return <Cards
                                                    user={user}
                                                    key={user._id}
                                                    pm={projectManager}
                                                    account_id={account._id}
                                                    setShowModal={setShowModal} setUpdateTime={setUpdateTime} />
                                            })
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Cards = ({ user, pm, account_id, setShowModal, setUpdateTime }) => {
    const [isLoading, setLoading] = useState(false);
    const handleAssignNewPm = async () => {
        try {
            if (!account_id) return;
            setLoading(true);
            await assignPMToResoureService({ account_id, pm_id: user._id })
            toast.success("Project manager assigned successfully");
            setUpdateTime(Date.now());
            setShowModal(false);
            setLoading(false);
        } catch (e) {
            toast.error("Something went wrong!");
        }
    }
    return (
        <div className='flex p-1 items-center border-[#DBDBDB] border-b-2'>
            <div className='w-[90%]'>{user.email}</div>
            <div>
                {
                    pm?._id === user?._id ?
                        <button style={{ width: "110px", background: "green", color: "white" }} className='yellow-action-button'>Assigned</button>
                        :
                        <button
                            style={{ width: "110px" }}
                            className='yellow-action-button'
                            onClick={handleAssignNewPm}
                            disabled={isLoading}>
                            {
                                isLoading ?
                                    <ButtonLoader message={"Assiging.."} />
                                    :
                                    "Assign"
                            }
                        </button>
                }
            </div>
        </div>
    )
}

export default PMAssignModal