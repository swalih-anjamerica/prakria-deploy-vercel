import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { editProjectDetails } from "../../../services/project";
import { MdClose } from "react-icons/md";
import ButtonLoader from '../../common/ButtonLoader';

function ProjectBreifEditModal({ setShowModal, project, setUpdatedTime }) {
    const [title, setTitle] = useState(null);
    const [category, setCategory] = useState(null);
    const [type, setType] = useState(null);
    const [sizes, setSizes] = useState(null);
    const [message, setMessage] = useState("");
    const [editingBrief, setEditingBrief] = useState(false);

    useEffect(() => {
        if (!project) return;
        setTitle(project?.title);
        setCategory(project?.category);
        setType(project.project_type);
        setSizes(project?.size);
        setMessage(project?.message);
    }, [project])

    async function handleEditBriefForm(e) {
        e.preventDefault();
        try {
            setEditingBrief(true);
            const response = await editProjectDetails(project._id, undefined, title, type, category, message, sizes);
            toast.success("updated successfully");
            setUpdatedTime(Date.now());
            setTimeout(() => {
                setShowModal(false);
                setEditingBrief(false);
            }, 400);
        } catch (e) {
            setEditingBrief(false);
            toast.error("something went wrong");
        }
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

                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[90%] xl:w-[50%]">
                    <div className="p-5 bg-secondry-gray w-full  my-auto gap-4">
                        <div className="col-span-12 flex justify-between p-5">
                            <h1 className="component-heading">Update Project Brief</h1>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                }}>
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>
                        <div>
                            <form className=" w-full flex-1 p-5 px-0" onSubmit={handleEditBriefForm} id="form-create-resource">
                                <div className="p-5 grid grid-cols-12 gap-4">

                                    <div className="col-span-12">
                                        <div className="flex-col w-full">

                                            <textarea className="form-input" id="input-first-name" type="text" rows={10} value={message} onChange={e => {
                                                setMessage(e.target.value);
                                            }} />

                                        </div>
                                    </div>

                                    <div className="col-span-6 mt-auto col-start-4">
                                        <button className="yellow-lg-action-button uppercase" type='submit' id="btn-create" disabled={editingBrief}>
                                            {
                                                editingBrief ? <ButtonLoader message={"Updating"} /> : "Update"
                                            }
                                        </button>

                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectBreifEditModal