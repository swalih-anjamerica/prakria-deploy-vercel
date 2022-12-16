import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, QueryClient } from 'react-query';
import Loader from '../../components/layouts/Loader';
import BrandBOx from '../../components/user/Brands/BrandBOx';
import { getBrands, useAddBrand } from '../../hooks/queryHooks/useBrands';
import { useAuth } from "../../hooks/useAuth"

import { Modal } from "../../components/common/Modal"
import API from '../../services/api';
import { useRouter } from 'next/router';

export default function ShowBrands() {
    const [ newBrand, setNewBrand ] = useState();
    const [ newBrandShow, setNewBrandShow ] = useState(false);
    const [ viewType, setViewType ] = useState('List');
    const [ searchQuery, setSearchQuery ] = useState('')
    const [ createBrandPM, setCreateBrandPM ] = useState(false)
    const [ myUsers, setUser ] = useState([])
    const [ accountId, setAccountId ] = useState("")

    const { role, user } = useAuth()

    const router = useRouter()
    const {
        data: BrandData,
        isLoading: brandLoading,
        isFetching: brandFethcing,
    } = getBrands({ searchQuery, projectMan: user?.role == 'project_manager' ? user?._id : "" }, user);
    const {
        mutate,
        isIdle: brandCreated,
        isError: isBrandError,
        error: brandError,
        isLoading: addBrandLoading,
    } = useAddBrand();

    function createBrandHandler() {
        if (!newBrand) {
            toast.dismiss();
            return toast.error('Enter a name');
        }
        mutate({ name: newBrand, accountId: accountId });
        if (brandCreated) {
            toast.success('Brand Created');
            setNewBrand();
            setNewBrandShow(false);
            setCreateBrandPM(false)
            setAccountId()
        }
    }

    function showCreateBrand() {
        setNewBrandShow(!newBrandShow);
    }

    // const{isLaoding,data} =useQuery(),{
    // 	// enabled:!!user
    // })
    // if (!BrandData) return <div>Create a brand</div>;

    useEffect(async () => {
        if (!user || !role) return

        if (role === 'designer') return router.push('/dashboard')
        async function fetch() {

            const res = await API.get(`/users/account/getPMusers?id=${user?._id}`)

            setUser(res.data)
        }

        fetch()


    }, [ user, role ])

    return (
        <div className="flex-1 min-h-screen ">
            <div className="bg-primary-blue w-full h-14 px-3 flex">
                <ul className="flex flex-1 self-center w-full px-9">
                    <li className="mr-12 ">
                        <a className="active-horizontal-nav-item-textstyle" href="#">
                            All Brands
                        </a>
                    </li>
                </ul>
            </div>

            <div className="px-12 flex py-4 gap-4  shadow-lg items-center bg-secondry-gray">
                <div className="flex w-max flex-1 gap-10 overflow-x-auto justify-start items-start cursor-pointer">
                    <span className='truncate '>Guidelines</span>
                    <span className='truncate '>All your Brand Assets</span>
                    <span className='truncate '>Any other</span>
                    <span className='truncate '>something other</span>
                </div>
                <button
                    className="yellow-action-button"
                    onClick={() => role == "project_manager" ? setCreateBrandPM(true) : showCreateBrand()}>
                    Add Section
                </button>
            </div>

            <div className=" w-full flex-1 p-11 ">
                <div className="w-full flex flex-col px-10 border-b-2 border-primary-gray">
                    <div className=" flex justify-between items-center">
                        <span className='text-xl font-thin'>Logo</span>
                        <span>
                            <button
                                className="black-action-button"
                                onClick={() => role == "project_manager" ? setCreateBrandPM(true) : showCreateBrand()}>
                                Upload
                            </button>
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-5 py-10">
                        <div className="flex items-center  justify-center w-56 h-56 bg-secondry-gray rounded-md ">
                            <div className="text-primary-gray">
                                {/* <svg
                                    className="m-auto"
                                    width="30"
                                    height="25"
                                    viewBox="0 0 59 43"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect y="5" width="55" height="38" fill="#4FC318" />
                                    <rect x="6" width="53" height="38" fill="#6CFF26" />
                                    <path d="M33 25L22.6077 16L43.3923 16L33 25Z" fill="#257409" />
                                </svg> */}
                                <span>File name</span>
                            </div>
                        </div>
                        <div className="flex items-center  justify-center w-56 h-56 bg-secondry-gray rounded-md ">
                            <div className="text-primary-gray">
                                {/* <svg
                                    className="m-auto"
                                    width="30"
                                    height="25"
                                    viewBox="0 0 59 43"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect y="5" width="55" height="38" fill="#4FC318" />
                                    <rect x="6" width="53" height="38" fill="#6CFF26" />
                                    <path d="M33 25L22.6077 16L43.3923 16L33 25Z" fill="#257409" />
                                </svg> */}
                                <span>File name</span>
                            </div>
                        </div>
                        <div className="flex items-center  justify-center w-56 h-56 bg-secondry-gray rounded-md ">
                            <div className="text-primary-gray">
                                {/* <svg
                                    className="m-auto"
                                    width="30"
                                    height="25"
                                    viewBox="0 0 59 43"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect y="5" width="55" height="38" fill="#4FC318" />
                                    <rect x="6" width="53" height="38" fill="#6CFF26" />
                                    <path d="M33 25L22.6077 16L43.3923 16L33 25Z" fill="#257409" />
                                </svg> */}
                                <span>File name</span>
                            </div>
                        </div>
                        <div className="flex items-center  justify-center w-56 h-56 bg-secondry-gray rounded-md ">
                            <div className="text-primary-gray">
                                {/* <svg
                                    className="m-auto"
                                    width="30"
                                    height="25"
                                    viewBox="0 0 59 43"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect y="5" width="55" height="38" fill="#4FC318" />
                                    <rect x="6" width="53" height="38" fill="#6CFF26" />
                                    <path d="M33 25L22.6077 16L43.3923 16L33 25Z" fill="#257409" />
                                </svg> */}
                                <span>File name</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="w-full flex flex-col px-10 mt-5">
                    <div className=" flex justify-between items-center">
                        <span className='text-xl font-thin'>Color Schemes</span>
                        <span>
                            <button
                                className="black-action-button"
                                onClick={() => role == "project_manager" ? setCreateBrandPM(true) : showCreateBrand()}>
                                Upload
                            </button>
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-5 py-10">
                        <div className="flex items-center  justify-center w-56 h-56 bg-secondry-gray rounded-md ">
                            <div className="text-primary-gray">
                                {/* <svg
                                    className="m-auto"
                                    width="30"
                                    height="25"
                                    viewBox="0 0 59 43"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect y="5" width="55" height="38" fill="#4FC318" />
                                    <rect x="6" width="53" height="38" fill="#6CFF26" />
                                    <path d="M33 25L22.6077 16L43.3923 16L33 25Z" fill="#257409" />
                                </svg> */}
                                <span>File name</span>
                            </div>
                        </div>
                        <div className="flex items-center  justify-center w-56 h-56 bg-secondry-gray rounded-md ">
                            <div className="text-primary-gray">
                                {/* <svg
                                    className="m-auto"
                                    width="30"
                                    height="25"
                                    viewBox="0 0 59 43"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect y="5" width="55" height="38" fill="#4FC318" />
                                    <rect x="6" width="53" height="38" fill="#6CFF26" />
                                    <path d="M33 25L22.6077 16L43.3923 16L33 25Z" fill="#257409" />
                                </svg> */}
                                <span>File name</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* {!BrandData && <h1>No Brand Here</h1>}
                {(brandLoading || addBrandLoading) ? <Loader />

                    : (<div className="grid grid-cols-2 gap-4 mt-5 ">
                        {BrandData?.map((brand) => {
                            return <BrandBOx key={brand._id} brand={brand} />;
                        })}
                    </div>)} */}
            </div>
        </div>
    );
}

