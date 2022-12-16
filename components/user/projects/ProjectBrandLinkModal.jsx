import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getBrands } from '../../../hooks/queryHooks/useBrands';
import { useAuth } from '../../../hooks/useAuth';
import API from '../../../services/api';
import Loader from '../../layouts/Loader';
import { MdClose } from "react-icons/md";
import { useEffect } from 'react';


export const ProjectBrandLinKModal = ({ setShowModal, projectId, setRevisionProjectId, setDontShowRevisin = () => { } }) => {

    const { role, user } = useAuth()
    const router = useRouter();

    useEffect(() => {
        setRevisionProjectId(null);
        return () => {
            setDontShowRevisin(false);
        }
    }, [])

    const {
        data: response = [],
        isLoading: brandLoading,
        isFetching: brandFethcing,
    } = getBrands({ searchQuery: "", projectId }, user);

    const [brandId, setBrandId] = useState("");
    const [brandLinking, setBrandLinking] = useState(false);


    async function handleLinkBrandToProject() {
        try {

            toast.dismiss();
            if (!brandId) return toast.error("please select a brand!");

            setBrandLinking(true);
            const response = await API.put(`/users/projects/${projectId}`, {
                brandId
            })

            setBrandLinking(false);

            if (response.status === 200) {
                toast.success("project linked to brand successfully.");
                setTimeout(() => {
                    router.reload();
                }, 800);

            }
        } catch (e) {
            setBrandLinking(false);
            toast.error("something went wrong!. please try again.")
        }
    }

    if (brandLoading) {
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

                <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Content Starts Here */}
                    <div className="p-10 bg-secondry-gray w-full grid grid-cols-12 my-auto gap-4">
                        <div className="col-span-12 mb-5 flex justify-between">
                            <h1 className="component-heading">Choose brand</h1>
                            <button onClick={() => setShowModal(false)}>
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="col-span-12">
                            <div className="flex-col  w-full ">
                                <label className="form-label" htmlFor="Company name">
                                    Brands
                                </label>
                                <select className=" form-input " defaultValue={""} onChange={e => setBrandId(e.target.value)}>
                                    <option value="" disabled>Select brand</option>
                                    {
                                        response?.map(brand => {
                                            return <option key={brand._id} value={brand._id}>{brand.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-span-12 mt-6">
                            {
                                brandLinking ?
                                    <button className="yellow-lg-action-button">
                                        <svg role="status" className="mr-2 w-7 h-7 text-diabled animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                    </button>
                                    :
                                    <button className="yellow-lg-action-button" onClick={handleLinkBrandToProject}>
                                        Link brand
                                    </button>
                            }
                        </div>
                    </div>
                    {/* <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
						<button
							type="button"
							className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
							Save
						</button>
					</div> */}

                    {/* Content Ends Here */}
                </div>
            </div>
        </div>
    );
};
