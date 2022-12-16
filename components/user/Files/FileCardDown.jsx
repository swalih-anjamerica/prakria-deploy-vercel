import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import utils from '../../../helpers/utils';
import getFileExtension from '../../../lib/FileHelper';
import API from '../../../services/api';
import DownloadLoader from '../../common/DownloadLoader'
import { Modal } from '../../common/Modal';
import { AiOutlineEye, } from "react-icons/ai";
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import { useAuth } from '../../../hooks/useAuth';
import { BiTrash } from 'react-icons/bi';
import { FileDelIcon, FileDownloadIcon, FileViewIcon } from '../../../helpers/svgHelper';
import ConfirmAlert from '../../common/ConfirmAlert';




function FileCardDown({ file, setProgress, IsInProject = false, FileDeleteHandler = () => { } }) {
    const [downloading, setDownLoading] = useState(false)
    const [ showDeleteConfirm, setShowDeleteConfirm]=useState(false);
    const downloadRef = useRef(null)
    const { role, user } = useAuth()

    async function downloadFile(filekey, filename, ext, totalSize) {
        try {
            setDownLoading(true)
            const data = await API.get(`/s3-upload/view/?key=${filekey}`, {
                responseType: 'blob',
                onDownloadProgress: (event) => {
                    setProgress(Math.round((event.loaded * 320) / totalSize));
                }
            })
            const url = window.URL.createObjectURL(new Blob([data.data]))
            downloadRef.current.href = url
            downloadRef.current.setAttribute('download', `${filename}.${ext}`);
            downloadRef.current.click()
            setDownLoading(false)
            toast.dismiss()
            toast.success("Downloaded")


        } catch (error) {
            toast.dismiss()
            toast.error("Download Failed")
            setDownLoading(false)
        }

    }
    const [modalShow, setModalShow] = useState(false);
    const [viewJSx, setViewJSX] = useState();
    const [show, setShow]=useState(true);


    /**
     *
     * @param {String} key
     */

    function viewHandler(key) {
        const ext = getFileExtension(key);
        if (
            ext == 'jpg' ||
            ext == 'jpeg' ||
            ext == 'png' ||
            ext == 'gif' ||
            ext == 'svg'
        ) {
            setViewJSX(<img className='w-full h-full' src={`/api/s3-upload/view/?key=${key}`} alt={key} />);
            return setModalShow(true);
        }

        if (
            ext == 'mp4' ||
            ext == 'mkv' ||
            ext == 'mpeg' ||
            ext == '3gp' ||
            ext == 'mov'
        ) {
            setViewJSX(
                <video controls className='w-full h-full z-50 mb-3'>
                    <source
                        src={`/api/s3-upload/view/?key=${key}`}
                        type={`video/${ext}`}
                    />
                </video>
            );

            return setModalShow(true);
        }

        setViewJSX(<h1>No preview Available. Please download the file!</h1>);

        setModalShow(true);
    }

    return (
        <>
            {
                showDeleteConfirm &&
                <ConfirmAlert
                    content={"Are you sure you want to delete?"}
                    handleCancel={() => setShowDeleteConfirm(false)}
                    handleConfirm={() => FileDeleteHandler({ key: file.filekey, fileId: file._id, setShowDeleteConfirm })}
                />
            }
            <a ref={downloadRef}></a>
            <Modal className='w-[40%]' showModal={modalShow} setShowModal={setModalShow}>
                {viewJSx}
            </Modal>
            <li className="border-gray-400 flex mb-2 ">
                <div className="grid grid-cols-12 bg-secondry-gray w-full text-center rounded-lg p-4 pr-0 z-[1]">
                    {/* <div className="col-span-1 py-1 flex"></div> */}
                    <div className="col-span-3 pl-4 py-1 w-full flex">
                        <div className="flex-col text-left my-auto font-medium text-base">
                            <p className="font-medium text-xl break-words w-40 xl:w-[15rem]">{file.filename?.split('.')[0]}
                                {/* <span className="font-semibold text-sm "> */}
                                {file.filename?.split('.').length > 1 &&
                                    '.' + file.filename?.split('.').pop()}
                            </p>
                            {/* <p className="text-primary-blue text-sm lowercase">
                                india  | america
                            </p> */}
                        </div>
                    </div>
                    <div className="col-span-3 py-1 w-full  flex">
                        <div className="text-left m-auto font-medium text-base">
                            {file.date ? utils.projectLastUpdateFormate(new Date(file.createdAt), true, IsInProject) : "---"}
                        </div>
                    </div>
                    <div className="col-span-3 py-1 w-full  flex">
                        <div className="text-center m-auto font-medium text-base">
                            {file.size / 1024 > 1024
                                ? (file.size / 1024 / 1024).toFixed(2)
                                : (file.size / 1024).toFixed(2)}
                            {file.size / 1024 > 1024 ? ' MB' : ' KB'}
                        </div>
                    </div>
                    <div className="col-span-3 w-full py-1 flex gap-5 items-center justify-center font-medium text-base mr-16">
                        {/* <AiOutlineEye className='h-10 w-10 hover:text-primary-blue cursor-pointer'
                            onClick={() => {
                                viewHandler(file.filekey);
                            }}
                        /> */}
                        <div onClick={() => {
                            viewHandler(file.filekey);
                        }} >
                            <FileViewIcon />
                        </div>
                        {downloading ?
                            <DownloadLoader /> :
                            <div onClick={() => {
                                downloadFile(file.filekey, file.filename?.split('.')[0], file.filename?.split('.').length > 1 &&
                                    '.' + file.filename?.split('.').pop(), file.size)
                            }}>
                                <FileDownloadIcon />
                            </div>
                        }
                        {
                            (file?.user_id && user._id == file.user_id) &&
                            < span className='hover:text-red-dark cursor-pointer' onClick={() => setShowDeleteConfirm(true)} >
                                <FileDelIcon />
                            </span>
                        }
                    </div>
                    {/* <div className="col-span-1 py-1 flex"></div> */}
                </div>
            </li>
        </>
    )
}

export default FileCardDown