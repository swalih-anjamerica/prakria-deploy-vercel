import React, { useEffect, useState } from 'react'
import { useAuthLayout } from '../../hooks/useAuthLayout';
import { listAllResources } from '../../services/resources';
import Pagination from '../common/Pagination';
import Loader from '../layouts/Loader';
import ResourceRow from './ResourceRow';

function ResourceList() {

    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const { setHeaderMessage } = useAuthLayout();

    useEffect(() => {
        setHeaderMessage("Here are all resources");
        return () => {
            setHeaderMessage(null);
        }
    })


    useEffect(() => {
        listResources(currentPage);
    }, [currentPage])


    // function for list all users
    async function listResources(page) {
        try {
            setLoading(true);
            const response = await listAllResources(page);
            setLoading(false);
            setResources(response.data?.resources);
            setTotalItems(response.data?.totalItems);
        } catch (e) {
            setLoading(false);
        }
    }

    function handleEditMode(isEditing, setIsEditing) {
        if (!editMode && !isEditing) {
            setIsEditing(true);
            setEditMode(true);
        }
        else if (editMode && isEditing) {
            setEditMode(false);
            setIsEditing(false);
        }
    }

    if (loading) {
        return <Loader />
    }
    return (
        <>
            <div className="pt-5 pb-1 text-center">
                <span className='text-2xl'>All Resources</span>
            </div>
            <section className="bg-white flex justify-center mt-4">

                <div className="container">
                    <div className="flex flex-wrap">
                        <div className="w-full px-4 md:px-2">
                            <div className="max-w-full m-auto overflow-x-auto">
                                {
                                    resources.length < 1 ?
                                        <h1 className='component-heading'>No resources.</h1>
                                        :
                                        <>
                                            <table className="table-auto w-full select-text">
                                                <thead>
                                                    <tr className="bg-primary text-center border border-b-4">
                                                        <th className=" w-1/6 min-w-[160px] text-lg border bg-gray-100 font-semibold text-gray-700 py-4 md:p-3 lg:py-7 px-3 lg:px-4  " >
                                                            First Name
                                                        </th>
                                                        <th className=" w-1/6 min-w-[160px] text-lg border font-semibold text-gray-700 py-4 md:p-4 lg:py-7 px-3 lg:px-4 " >
                                                            Last Name
                                                        </th>
                                                        <th className=" w-1/6 min-w-[160px] text-lg border bg-gray-100 font-semibold text-gray-700 py-4 md:p-4 lg:py-7 px-3 lg:px-4 " >
                                                            Email
                                                        </th>
                                                        <th className=" w-1/6 min-w-[160px] text-lg border font-semibold text-gray-700 py-4 md:p-4 lg:py-7 px-3 lg:px-4 " >
                                                            Mobile
                                                        </th>
                                                        <th className=" w-1/6 min-w-[160px] text-lg border bg-gray-100  font-semibold text-gray-700 py-4 md:p-4 lg:py-7 px-3 lg:px-4 " >
                                                            Role
                                                        </th>
                                                        <th className="w-1/6 min-w-[160px] text-lg border font-semibold text-gray-700 py-4 md:p-4 lg:py-7 px-3 lg:px-4  " >
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        resources.filter(resource => resource.role !== "super_admin").map((resource) => {

                                                            return <ResourceRow key={resource._id} resource={resource} listResources={listResources} />
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                            {
                                                (totalItems && totalItems > 0) &&
                                                <div className='flex  mt-5 justify-center mb-20'>
                                                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} countPerPage={10} total={totalItems} />
                                                </div>
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    )
}

export default ResourceList