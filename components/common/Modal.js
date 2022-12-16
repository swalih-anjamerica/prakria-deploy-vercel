import { MdClose } from 'react-icons/md';


export const Modal = ({

	children,
	title="",
	submitTitle = 'Done',
	setShowModal=()=>{},
	showModal,
	className = "w-full xl:w-[60%]",
	...otherProps

}) => {

	return (
		showModal &&
		<div
			className={`fixed z-10 inset-0 overflow-y-auto modal-animation`}
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true">
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div
					className="fixed inset-0 bg-black opacity-40 transition-opacity"
					aria-hidden="true"
					onClick={()=>setShowModal(false)}
				/>
				<span
					className="hidden sm:inline-block sm:align-middle sm:h-screen"
					aria-hidden="true">
					&#8203;
				</span>
				<div className={`relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[80%] ${className} modal-body-animation`}>
					<div className="p-10 flex flex-col bg-secondry-gray w-full  my-auto gap-4">
						<div className="mb-5 flex items-center justify-between">
							<div className="">
								<span className="component-heading">{title}</span>
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
						<div className="">
							{children}
						</div>
						{/* {submitTitle &&
							<div className="flex w-full justify-end mt-6">
								<button
									className="yellow-lg-action-button"
									onClick={() => {
										setShowModal(false);
									}}>
									{title}
								</button>
							</div>} */}
					</div>
				</div>
			</div>
		</div>
	);
};
