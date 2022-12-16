import React, { useState } from 'react';
import getFileExtension from '../../../lib/FileHelper';
import { Modal } from '../../common/Modal';

const FileCard = ({ file }) => {
	const [ modalShow, setModalShow ] = useState(false);
	const [ viewJSx, setViewJSX ] = useState();

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
			setViewJSX(<img src={`/api/s3-upload/view/?key=${key}`} alt={key} />);
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
				<video controls width={500}>
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
		<li className="flex mb-2 ">
			<div className="grid grid-cols-11 h-16 items-center font-sans w-full rounded-lg bg-secondry-gray">
				<div className="col-span-1 h-full w-full flex">
					<div className="flex items-center m-auto text-primary-gray">
						<svg
							className="m-auto"
							width="30"
							height="25"
							viewBox="0 0 59 43"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<rect y="5" width="55" height="38" fill="#4FC318" />
							<rect x="6" width="53" height="38" fill="#6CFF26" />
							<path d="M33 25L22.6077 16L43.3923 16L33 25Z" fill="#257409" />
						</svg>
					</div>
				</div>
				<div className="col-span-4 h-full w-full flex">
					<div className="flex-col text-left my-auto">
						<p className="font-medium text-xl text-left cursor-pointer">
							{file.filename?.split('.')[ 0 ]}
							<span className="font-semibold text-sm ">
								{file.filename?.split('.').length > 1 &&
									'.' + file.filename?.split('.').pop()}
							</span>
						</p>
					</div>
				</div>
				<div className="col-span-2 h-full w-full  flex">
					<div className="text-center m-auto">
						{file.size / 1024 > 1024
							? (file.size / 1024 / 1024).toFixed(2)
							: (file.size / 1024).toFixed(2)}
						{file.size / 1024 > 1024 ? ' MB' : ' KB'}
					</div>
				</div>
				<div
					className="col-span-2 h-full w-full  flex"
					onClick={() => {	
						viewHandler(file.filekey);
					}}>
					<div className="text-center m-auto">
						<button className="button-whiteInBlue">View</button>
					</div>
				</div>
				<a
				download={`/api/s3-upload/view/?key=${file.filekey}`}
					// href={`/api/s3-upload/view/?key=${file.filekey}`}
					target="_blank"
					rel="noreferrer">
					<div className="col-span-2 h-full w-full  flex">
						<div className="text-center m-auto">
							<button className="button-whiteInBlue">Download</button>
						</div>
					</div>
				</a>
			</div>
			<Modal showModal={modalShow} setShowModal={setModalShow}>
				{viewJSx}
			</Modal>
		</li>
	);
};

export default FileCard;
