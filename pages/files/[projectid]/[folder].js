import { BiHome } from 'react-icons/bi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { ProgressBarDownload } from '../../../components/common/ProgressBar';
import Loader from '../../../components/layouts/Loader';
import FileCard from '../../../components/user/Brands/FileCard';
import { FileUploadButton } from '../../../components/user/Brands/fileUploadButton';
import FileCardDown from '../../../components/user/Files/FileCardDown';
import { getAccountId, getProject } from '../../../hooks/queryHooks/useProjects';
import { useAuth } from '../../../hooks/useAuth';
import API from '../../../services/api';
import { deleteFileHandler, uploadFile } from '../../../services/fileUpload';
import ProjectsService from '../../../services/projects';
import DragHere from '../DragHere';
import FileUploadBoxUI from '../../../components/common/FileUploadBox';
import { useAuthLayout } from '../../../hooks/useAuthLayout';


export default function SingleBrand() {

    const router = useRouter()
    const { role, user } = useAuth()

    let { folder: folderName, projectid, tab } = router.query

    const [folder, setFolder] = useState([])
    const [progress, setProgress] = useState(0)
    const [filesCount, setfilesCount] = useState(0)
    const [isDrag, setIsDrag] = useState(false)
    const { setHeaderMessage } = useAuthLayout();

    const { data: project, isLoading: projectDetailsLoading } = useQuery(["project_details", filesCount, projectid, folderName], () => ProjectsService.fetchProjectDetailsById(projectid), {
        enabled: !!projectid,

        select: (data) => data.data
    });

    const uploadFileHandler = async (formData) => {
        toast.loading("uploading file");
        const { status, data: files } = await uploadFile(formData, undefined, projectid, folderName, setProgress);

        if (!status) return toast.dismiss();

        const updateFile = await API.put(
            `/users/projects/all/addFiles?projectId=${projectid}&folder=${folderName}`,
            { files }
        );
        toast.dismiss()
        toast.success("Files Uploaded")
        return setfilesCount(filesCount + 1)
    }

    const FileDeleteHandler = async ({ key, setShowDeleteConfirm }) => {
        try {
            setShowDeleteConfirm(false);
            toast.dismiss();
            toast.loading("deleting..");
            const deleteResponse = await deleteFileHandler(key, true)
            setfilesCount(filesCount + 1)
            toast.dismiss();
            toast.success(deleteResponse.data)
        } catch (error) {
            console.log(error);
            toast.dismiss();
            toast.error("File Not Deleted")
        }
    }


    useEffect(() => {
        setHeaderMessage("Find your brand files here,");
        return () => {
            setHeaderMessage(null);
        };
    }, []);

    if (!tab || (tab !== "latest" && tab !== "all")) {
        tab = "all";
    }

    let rect = document.getElementById("drag")?.getBoundingClientRect();

    const handleDragEnter = (e) => {
        setIsDrag(true)
    }
    const handleDragLeave = (e) => {
        // console.log("Removed")
        // setIsDrag(false)
        if (e && e.clientY < rect.top || e.clientY >= rect.bottom || e.clientX < rect.left || e.clientX >= rect.right) {
            setIsDrag(false)
        }
    }

    if (projectDetailsLoading) return <Loader />
    return (
        <>
            <div
                className="flex-1 min-h-screen relative"
                onDrag={(e) => e.nativeEvent.preventDefault()}
                onDragOver={(e) => e.preventDefault()}>
                <div className="bg-primary-white w-full border-y-2 border-primary-grey h-14 flex justify-between">
                    <ul className="flex flex-1 self-center w-full px-6 xl:px-9 pr-7">
                        <li className="mr-12 ">
                            <Link href={`/files/${projectid}/${folderName}?tab=all`}>
                                <a className={
                                    tab == "all" ?
                                        "active-horizontal-nav-item-textstyle"
                                        :
                                        "diabled-horizontal-nav-item-textstyle"
                                } >
                                    All
                                </a>
                            </Link>
                        </li>
                        <li className="mr-12 ">
                            <Link href={`/files/${projectid}/${folderName}?tab=latest`}>
                                <a className={
                                    tab == "latest" ?
                                        "active-horizontal-nav-item-textstyle"
                                        :
                                        "diabled-horizontal-nav-item-textstyle"
                                } >
                                    Latest
                                </a>
                            </Link>
                        </li>
                    </ul>
                    {((folderName == 'input' && role != 'designer') || (folderName == 'downloads' && role === 'designer')) && <FileUploadButton
                        acceptedFileTypes={'.csv,.psd,.zip,.ai,.cdr,.jpg,.png,.svg,.swg,.mp4,.mov,.tga,.avi,.mpeg,.docx,.xlxs,.pptx,.mp3,.wma,.zip,.rar'}
                        label={<>+  &nbsp;&nbsp;&nbsp;&nbsp;Add Files &nbsp;&nbsp;&nbsp;&nbsp;</>}
                        onChange={uploadFileHandler}
                        uploadFileName={'file'}
                    />}
                </div>
                {/* Body */}
                <ProgressBarDownload progress={progress} />
                {<DragHere projectid={projectid} folder={folderName} setfilesCount={setfilesCount} role={role} filesCount={filesCount} >
                    <div className=" w-full flex-1 p-6 pr-9 xl:p-9 h-screen"
                        id="drag"
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDropCapture={() => setIsDrag(false)}
                    >
                        {/* {folderName !== 'downloads' && <FileUploadBoxUI isDrag={isDrag} />} */}
                        <div className="text-primary-blue flex">

                            <Link passHref href="/files">
                                <span>
                                    FILES
                                </span>
                            </Link>{">"}&nbsp;

                            <Link passHref href={`/files/${projectid}`}>
                                <p className='cursor-pointer uppercase'>
                                    {
                                        project?.title ?
                                            project.title
                                            :
                                            "loading..."
                                    }
                                </p>
                            </Link>{">"}{" "}

                            {" " + (folderName == "input" ? "UPLOAD ASSETS" : "DOWNLOAD ASSETS")}
                            {/* </Link>{" > "}{" " + folder}*/}
                        </div>

                        {
                            (folderName == 'input' && !project?.input.length) ? <div className='component-heading mt-8'>No file Here</div> :
                                (folderName == 'downloads' && !project?.download.length) ? <div className='component-heading mt-8'>No file Here</div> :
                                    <li className="border-gray-400 flex mb-2 ">
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
                                    </li>
                        }

                        <ul className="">
                            {folderName == 'input' && !project?.input.length ? <div></div> :
                                folderName == 'downloads' && !project?.download.length ? <div></div> :
                                    folderName == 'downloads' && tab != 'latest' ? project?.download?.map((file, index) => {
                                        return <FileCardDown file={file} key={index} setProgress={setProgress} IsInProject={true} FileDeleteHandler={FileDeleteHandler} />;
                                    }) :
                                        folderName == 'downloads' && tab == 'latest' ? project?.download?.slice(0).reverse().map((file, index) => {
                                            return <FileCardDown file={file} key={index} setProgress={setProgress} IsInProject={true} FileDeleteHandler={FileDeleteHandler} />;
                                        }) :
                                            folderName == 'input' && tab != 'latest' ? project?.input?.map((file, index) => {
                                                return <FileCardDown file={file} key={index} setProgress={setProgress} IsInProject={true} FileDeleteHandler={FileDeleteHandler} />;
                                            }) :
                                                folderName == 'input' && tab == 'latest' && project?.input?.slice(0).reverse().map((file, index) => {
                                                    return <FileCardDown file={file} key={index} setProgress={setProgress} IsInProject={true} FileDeleteHandler={FileDeleteHandler} />;
                                                })
                            }
                            <li className='flex justify-center p-10'>{((folderName == 'downloads' && role==="designer" )||(folderName=="input"&&(role==="client_admin"||role==="client_member"||role==="project_manager"))) && <FileUploadBoxUI isDrag={isDrag} />}</li>
                        </ul>
                    </div>
                </DragHere>}
            </div>
        </>
    );
}

