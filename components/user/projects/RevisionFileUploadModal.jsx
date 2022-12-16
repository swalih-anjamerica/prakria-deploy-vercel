import { MdClose } from "react-icons/md";
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { getDocumentType } from '../../../helpers/typeConvert';
import { useAuth } from '../../../hooks/useAuth';
import { uploadFile as uploadFileToAWS } from '../../../services/fileUpload';
import revisionService from "../../../services/rivision";
import ButtonLoader from '../../common/ButtonLoader';
import { ProgressBar } from "../../common/ProgressBar";
import { useRouter } from "next/router";
import ProgressBarV2 from "../../common/ProgressBarV2";

function RevisionFileUploadModal({ setShowModal, projectId, revisionId, setUpdatedTime }) {
    const [uploadFile, setUploadFile] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0)
    const [fileUrl, setFileUrl]=useState(null);
    const router = useRouter();

    const { user } = useAuth();
    async function handleFileUpload(e) {
        e.preventDefault();
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", uploadFile);
            const data = {
                projectId: projectId,
                accountId: user?.account_details?._id,
                formData,
                folder: 'chats',
            };

            const fileAddRes = await uploadFileToAWS(formData, "", projectId, "revision", setProgress);

            if (!fileAddRes?.data[0]?.filekey) return toast.error("File not uploaded");
            const response = await revisionService.addRevisionFileService(revisionId, fileAddRes?.data[0]?.filekey, fileAddRes?.data[0]?.size);
            setUploading(false);
            setUpdatedTime(Date.now())
            toast.success("Revision File upload successfully.");
            // setTimeout(() => router.reload(), 800);
            setShowModal(false);
        } catch (e) {
            setUploading(false);
            toast.error("something went wrong.");
        }
    }
    function handleFileChange(e) {
        if (!e.target?.files[0]) {
            return;
        }

        // Allowing file type
        var allowedExtensions = /(\.mov|\.tga|\.mpeg|\.wma|\.jpg|\.jpeg|\.png|\.webp|\.mp4|\.mkv|\.3gp)$/i; //regex for file type video and image for revision
        let totalFIleSize = 0
        let invalidFileTypeFlag = 0

        Array.from(e.target.files).forEach((file) => {
            totalFIleSize = totalFIleSize + file.size // file size
            if (!allowedExtensions.exec(file.name)) {
                invalidFileTypeFlag++;
            }
        });

        const fileInMB = Math.round((totalFIleSize / Math.pow(1024, 2))) // CONVERTING INTO MB
        toast.dismiss()

        // if (fileInMB > 100) return toast.error("FIle limit 100MB")
        if (invalidFileTypeFlag) return toast.error("Invalid File Type !")
        setUploadFile(e?.target?.files[0]);
        setFileUrl(URL.createObjectURL(e?.target?.files[0]));
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
                <ProgressBarV2 progress={Math.round((progress / 320) * 100)} progressByNumber={true} message="uploading your file.." />

                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[50vw] sm:w-full">
                    <div className="p-10 bg-secondry-gray w-full  my-auto gap-4">
                        <div className="col-span-12 mb-5 flex justify-between">
                            <h1 className="component-heading">{"Upload revision file"}</h1>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                }}>
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>
                        <div>
                            <form className="bg-primary-white w-full justify-center flex-1 p-11 grid place-content-center" onSubmit={handleFileUpload} id="form-create-resource">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept={'jpg,.png,.swg,.mp4,.mov,.avi, .svg, .jpeg'}

                                />
                                {
                                    uploadFile &&
                                    <div className='flex justify-between gap-5'>
                                        <div className='w-72 h-40 mt-6 bg-primary-white'>
                                            {
                                                getDocumentType(uploadFile?.type) === "VIDEO" ?
                                                    <video src={fileUrl}></video>
                                                    :
                                                    getDocumentType(uploadFile?.type) === "IMAGE" &&
                                                    <img src={fileUrl ? fileUrl : "http://accordelectrotechnics.in/img/product/no-preview/no-preview.png"} className="w-full h-full object-contain" alt=""/>
                                            }
                                        </div>
                                        {
                                            uploadFile &&
                                            <div className='self-center'>
                                                {
                                                    uploading ?
                                                        <button className='yellow-lg-action-button' disabled>
                                                            <ButtonLoader message={"Uploading.."} />
                                                        </button>
                                                        :
                                                        <button className='yellow-lg-action-button' type="submit">Upload  File</button>
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RevisionFileUploadModal