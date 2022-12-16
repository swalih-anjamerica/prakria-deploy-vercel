import { MdClose } from "react-icons/md";
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import validator from "validator";
import { useAuth } from '../../../hooks/useAuth';
import API from '../../../services/api';
import ButtonLoader from "../../common/ButtonLoader";

export const AddMember = ({ toggleOpen = () => { }, sendFunc, setClientMemberFetchTime }) => {

	const { user } = useAuth();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [designation, setDesignation] = useState("");
	const [memberAddLoading, setMemberAddLoading] = useState(false);
	const [formErr, setFormErr] = useState({ firstNameErr: "", lastNameErr: "", emailErr: "", designationErr: "", formErr: "" })

	async function handleMemberAddForm(e) {
		e.preventDefault();
		setFormErr({});
		if (!firstName) return setFormErr(prev => ({ ...prev, firstNameErr: "This field is required." }))
		if (!lastName) return setFormErr(prev => ({ ...prev, lastNameErr: "This field is required." }))
		if (!email) return setFormErr(prev => ({ ...prev, emailErr: "This field is required." }))
		if (!designation) return setFormErr(prev => ({ ...prev, designationErr: "This field is required." }))
		if (!validator.isEmail(email)) return setFormErr(prev => ({ ...prev, emailErr: "Email is not valid." }))
		try {
			setMemberAddLoading(true);
			const body = {
				client_id: user._id,
				first_name: firstName,
				last_name: lastName,
				email: email,
				designation: designation
			}
			await API.post("/client/members", body);
			setMemberAddLoading(false);
			toast.success("New member added.");
			toggleOpen(false)
			setClientMemberFetchTime(Date.now());
		} catch (e) {
			setMemberAddLoading(false);
			setFormErr(prev => ({ ...prev, formErr: e?.response?.data?.error || "Some error occured. please try again later." }));
		}
	}

	return (
		<div
			className="fixed z-10 inset-0 overflow-y-auto"
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

				<form className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[90%] xl:w-[40%] sm:w-full" style={{ maxWidth: "60%", marginBottom: "0" }} onSubmit={handleMemberAddForm}>
					{/* Content Starts Here */}
					<div className="p-10 bg-secondry-gray w-full grid grid-cols-12 my-auto gap-4">
						<div className="col-span-12 mb-5 flex justify-between">
							<h1 className="component-heading">Add Member</h1>
							<button onClick={() => toggleOpen(false)}>
								<MdClose className="h-5 w-5" />
							</button>
						</div>
						<div className="col-span-6">
							<div className="flex-col  w-full ">
								<label className="form-label" htmlFor="Company name">
									First name
								</label>
								<input className=" form-input " id="username" type="text" value={firstName} onChange={e => {
									setFirstName(e.target.value);
									setFormErr(prev => ({ ...prev, firstNameErr: "" }))
								}} />
								<span className='text-[#cc0000]'>{formErr?.firstNameErr}</span>
							</div>
						</div>
						<div className="col-span-6">
							<div className="flex-col  w-full ">
								<label className="form-label" htmlFor="Website">
									Last name
								</label>
								<input className="form-input " id="username" type="text" value={lastName} onChange={e => {
									setLastName(e.target.value);
									setFormErr(prev => ({ ...prev, lastNameErr: "" }))
								}} />
								<span className='text-[#cc0000]'>{formErr?.lastNameErr}</span>
							</div>
						</div>
						<div className="col-span-6">
							<div className="flex-col  w-full ">
								<label className="form-label" htmlFor="Address">
									Company Email
								</label>
								<input className=" form-input" id="username" type="text" value={email} onChange={e => {
									setEmail(e.target.value);
									setFormErr(prev => ({ ...prev, emailErr: "" }))
								}} />
								<span className='text-[#cc0000]'>{formErr?.emailErr}</span>
							</div>
						</div>
						<div className="col-span-6">
							<div className="flex-col  w-full ">
								<label className="form-label" htmlFor="Country">
									Designation
								</label>
								<input className=" form-input " id="username" type="text" value={designation} onChange={e => {
									setDesignation(e.target.value);
									setFormErr(prev => ({ ...prev, designationErr: "" }))
								}} />
								<span className='text-[#cc0000]'>{formErr?.designationErr}</span>
							</div>
						</div>
						<div className="col-span-12 mt-6">
							{
								memberAddLoading ?
									<button className="yellow-lg-action-button">
										<ButtonLoader />
									</button>
									:
									<button
										className="yellow-lg-action-button"
										type='submit'>
										Save
									</button>
							}
							<span className='text-[#cc0000] text-center block'>{formErr?.formErr}</span>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};
