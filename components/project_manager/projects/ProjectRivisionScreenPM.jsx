import Link from 'next/link';
import React from 'react'
import Loader from '../../layouts/Loader';

function ProjectRivisionScreenPM({ tabLink, rivisionFetchStuff, projectId }) {

    const { rivisionLoading, rivisions, status } = rivisionFetchStuff;


    return (
        <>
            <div className="relative min-h-screen flex">

                <div className="flex-1 min-h-screen ">

                    <div className={"bg-primary-blue w-full h-14 px-3 flex"}>
                        <ul className="flex flex-1 self-center w-full px-9">
                            <li className="mr-12 ">
                                <Link href={"/projects/" + projectId + "?tab=CONNECT"}>
                                    <a className="diabled-horizontal-nav-item-textstyle">Connect</a>
                                </Link>
                            </li>
                            <li className="mr-12 ">
                                <Link href={"/projects/" + projectId + "?tab=REVIEW"}>
                                    <a className={tabLink === "REVIEW" ? "active-horizontal-nav-item-textstyle" : "diabled-horizontal-nav-item-textstyle"}>Review</a>
                                </Link>
                            </li>
                            <li className="mr-12 ">
                                <Link href={"/projects/" + projectId + "?tab=DOWNLOAD"}>
                                    <a className="diabled-horizontal-nav-item-textstyle">Download</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {
                        rivisionLoading ?
                            <div className=" w-full flex-1 p-11">
                                <Loader />
                            </div>
                            :
                            status === 204 ?
                                <div className=" w-full flex-1 p-11">
                                    <div className="component-heading">No revision found.</div>
                                </div>
                                :
                                <div className=" w-full flex-1 p-11">
                                    <div className="component-heading">We Save all the Revision Copies ,  just in case you’ll need.</div>
                                    <div className="grid grid-cols-3 gap-11 mt-9">
                                        {
                                            rivisions?.map(rivision => {
                                                return (
                                                    <div className="p-4 bg-secondry-gray m-10" key={rivision._id}>
                                                        <Link href={`/projects/revision/${rivision._id}`}>
                                                            <div className="w-full bg-primary-gray h-48">
                                                                <img src={rivision.rivision_file} className="w-full h-full" />
                                                            </div>
                                                        </Link>
                                                        <div className="mt-4 font-medium">{rivision.title}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                    }
                </div>
            </div>
        </>
    )
}

export default ProjectRivisionScreenPM