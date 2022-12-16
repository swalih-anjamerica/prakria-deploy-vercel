import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmAlert from '../../../components/common/ConfirmAlert';
import FileUploadBoxUI from '../../../components/common/FileUploadBox';
import { Modal } from '../../../components/common/Modal';
import { ProgressBar, ProgressBarDownload } from '../../../components/common/ProgressBar';
import Loader from '../../../components/layouts/Loader';
import FileCard from '../../../components/user/Brands/FileCard';
import { FileUploadButton } from '../../../components/user/Brands/fileUploadButton';
import FileCardDown from '../../../components/user/Files/FileCardDown';
import {
	getSingleBrand,
	useAddFile,
	useDeleteFileFromBrands,
} from '../../../hooks/queryHooks/useBrands';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthLayout } from '../../../hooks/useAuthLayout';

import { deleteFileHandler, uploadFile } from '../../../services/fileUpload';
import DragHere from '../../files/DragHere';

export default function Folder({ brandName }) {
	const router = useRouter();
	let { brandid, folder, tab } = router.query;
	const [progress, setProgress] = useState(0);
	const { role, user } = useAuth()
	const {
		mutate: addFiles,
		isSuccess: addFileIdle,
		isError: addFileError,
		error: fileError,
	} = useAddFile();
	const { data, isLoading: fileLoading } = getSingleBrand(brandid);
	const [upProgress, setUpProgress] = useState(0);
	const [downprogress, setDownProgress] = useState(0);
	const [isDrag, setIsDrag] = useState(false)


	const { setHeaderMessage } = useAuthLayout();
	const { mutate: deleteFileFromBrands } = useDeleteFileFromBrands();



	const uploadFileHandler = async (formData) => {
		toast.loading("uploading file...");
		const { status, data: file } = await uploadFile(formData, brandid, '', folder, setUpProgress);

		let data = {
			file,
			brandId: brandid,
			folder,
		};


		if (status) {
			addFiles(data);
			toast.dismiss();
			if (addFileError) return console.log(addFileError);
			// if (addFileIdle) return toast.success('File(s) Uploaded');
			toast.success("File uploaded successfully");
		} else {
			toast.dismiss();
			toast.error("Something went wrong")
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
		if (e.clientY < rect.top || e.clientY >= rect.bottom || e.clientX < rect.left || e.clientX >= rect.right) {
			setIsDrag(false)
		}
	}
	const fileDeleteHandler = async ({ key: fileKey, fileId, setShowDeleteConfirm }) => {
		try {
			setShowDeleteConfirm(false);
			toast.loading("deleting... ");
			const deleteResponse = await deleteFileHandler(fileKey);
			deleteFileFromBrands({ brand_id: brandid, file_id: fileId })
			toast.dismiss();
			toast.success("File deleted successfully");
		} catch (e) {
			console.log(e);
			toast.dismiss();
			toast.error("something went wrong!");
		}
	}

	if (fileLoading || !data) return <Loader />
	return (
		<>

			<div className="relative flex-1 min-h-screen ">
				<div className="bg-primary-white w-full border-y-2 border-primary-grey gap-4 h-14 pl-6 xl:pl-9 flex justify-between">
					<ul className="flex flex-1 self-center w-full">
						<li className="mr-12 ">
							<Link href={`/brands/${brandid}/${folder}?tab=all`}>
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
							<Link href={`/brands/${brandid}/${folder}?tab=latest`}>
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
					<ProgressBar progress={progress} />
					{role != 'designer' && <FileUploadButton
						acceptedFileTypes={'.csv,.psd,.zip,.ai,.cdr,.jpg,.png,.svg,.swg,.mp4,.mov,.tga,.avi,.mpeg,.docx,.xlxs,.pptx,.mp3,.wma,.zip,.rar'}
						label={<>+  &nbsp;&nbsp;&nbsp;&nbsp;Add Files &nbsp;&nbsp;&nbsp;&nbsp;</>}
						onChange={uploadFileHandler}
						uploadFileName={'file'}
					/>}
				</div>
				<ProgressBar progress={upProgress} />
				<ProgressBarDownload progress={downprogress} />
				{<DragHere className="" brandid={brandid} folder={folder} role={role}>

					<div id="drag" className="w-full h-screen flex-1 p-6 xl:px-9 xl:pr-11"
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onDropCapture={() => setIsDrag(false)}
					>
						<div className="text-[#648CF4] flex"><Link href="/brands" passHref>
							<p className='text-primary-blue'>BRANDS</p>
						</Link> &nbsp;{">"}&nbsp;
							<Link href={`/brands/${data?._id}`} passHref >
								<p className='cursor-pointer uppercase'>
									{"" + data?.name}
								</p>
							</Link>{" > "}{" " + folder}</div>
						{
							data?.files.find(file => file.folder == folder) &&
							<li className="border-gray-400 flex mb-2 ">
								<div className="grid grid-cols-12 w-full text-center rounded-lg p-4 pb-0 pr-0 z-[1] text-[#414040]">
									{/* <div className="col-span-1 py-1 flex"></div> */}
									<div className="col-span-3 pl-4 py-1 w-full flex">
										<div className="flex-col text-left my-auto font-medium text-base">
											FILE NAME
										</div>
									</div>
									<div className="col-span-3 py-1 w-full  flex">
										<p className='mx-auto'>
											DATE
										</p>
									</div>
									<div className="col-span-3 py-1 w-full  flex">
										<p className='mx-auto'>
											SIZE
										</p>
									</div>
									<div className="col-span-3 w-full py-1 flex gap-5 items-center justify-center font-medium text-base mr-16">
										ACTIONS
									</div>

								</div>
							</li>
						}
						<ul className="">
							{tab != 'latest' ? data?.files.map((file, index) => {

								if (file.folder === folder)
									return <FileCardDown setProgress={setDownProgress} FileDeleteHandler={fileDeleteHandler} file={file} key={index}/>
							}) :
								data?.files.slice(0).reverse().map((file, index) => {

									if (file.folder === folder)
										return <FileCardDown setProgress={setDownProgress} FileDeleteHandler={fileDeleteHandler} file={file} key={index}/>
								})
							}
							<li className='flex justify-center p-10'><FileUploadBoxUI isDrag={isDrag} /></li>
						</ul>
					</div>
				</DragHere>}
			</div>
		</>
	);
}
