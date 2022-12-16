import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { deleteResource } from '../../services/resources'
import ConfirmAlert from "../../components/common/ConfirmAlert"
import toast from 'react-hot-toast';
import { BsTrash } from 'react-icons/bs';
import { HiOutlinePencilAlt } from "react-icons/hi";

function ResourceRow({ resource, listResources }) {

    const router = useRouter();
    const [showAlert, setShowAlert] = useState(false)


    async function deleteResourceHandler(state) {
        try {
            const confirmDelete = state

            if (!confirmDelete) {
                return;
            }

            const { status } = await deleteResource(resource?._id);

            listResources(router.query?.page);

        } catch (e) {
            let { data } = e.response || {};
            toast.error(data.error || "Something went wrong!");
        }
    }

    return (
        <tr className='border'>
            <td className="text-center text-dark font-medium text-base py-5 px-2 bg-gray-100 md:px-1 md:py-1 ">
                {resource.first_name}
            </td>
            <td className="text-center text-dark font-medium text-base py-5 px-2 bg-white">
                {resource.last_name}
            </td>
            <td className="text-center text-dark font-medium text-base py-5 px-2 bg-gray-100 md:px-1 md:py-1 ">
                {resource.email}
            </td>
            <td className="text-center text-dark font-medium text-base py-5 px-2 bg-white">
                {resource.mobile_number ? resource.mobile_number : "Not Provided!"}
            </td>
            <td className="text-center text-dark font-medium text-base py-5 px-2 bg-gray-100 md:px-1 md:py-1 ">
                {resource.role}
            </td>
            <td className="text-center text-dark font-medium text-base py-5 px-2 bg-white">
                <Link href={`/super-admin/resources/edit/${resource?._id}`}>
                    <button className="border border-primary py-2 px-6 text-primary inline-block rounded hover:bg-primary hover:bg-gray-100 md:px-1 md:py-1">
                        <HiOutlinePencilAlt className='h-7 w-7 text-primary-blue' />
                    </button>
                </Link>
                <button onClick={() => setShowAlert(true)} className="border border-primary py-2 px-6 ml-3 text-primary inline-block rounded hover:bg-primary hover:bg-gray-100 md:px-1 md:py-1">
                    <BsTrash className='h-7 w-7 text-red' />
                </button>
                {showAlert && <ConfirmAlert
                    content={"Are you sure to delete this resource!"}
                    handleCancel={() => setShowAlert(false)}
                    handleConfirm={async () => {
                        await deleteResourceHandler(true);
                        setShowAlert(false);
                    }}
                />
                }
            </td>
        </tr>
    )
}

export default ResourceRow