import React, { useEffect, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"


export default function Pagination({ total, countPerPage = 20, setCurrentPage, currentPage }) {

    const [pageCount, setPageCount] = useState(0)
    const [selected, setSelected] = useState(currentPage)


    useEffect(() => {
        setPageCount(Math.ceil(total / countPerPage))
    }, [countPerPage, total])

    const togglePage = (num) => {
        setCurrentPage(num)
        setSelected(num);
    }

    let items = [];
    let i = 0;

    let startNumber = (selected <= 3) ? 1 : (selected - 2);
    let EndNumber = (pageCount <= (selected + 2)) ? pageCount : (selected + 2);

    for (i = startNumber; i < selected; i++) {
        items.push(
            <Pagination_Button togglePage={togglePage} toPageNumber={i} key={`pagination ${i}`} extraClass={`bg-transparent hover:bg-gray-200 text-gray-900`}>
                {i}
            </Pagination_Button>
        );
    }

    items.push(
        <Pagination_Button togglePage={togglePage} toPageNumber={i} key={`pagination current`} extraClass="bg-blue-200  hover:bg-blue-300 text-white">
            {i}
        </Pagination_Button>
    );

    for (i = (selected + 1); i <= EndNumber; i++) {
        items.push(
            <Pagination_Button togglePage={togglePage} toPageNumber={i} key={`pagination ${i}`} extraClass={`bg-transparent hover:bg-gray-200 text-gray-900`}>
                {i}
            </Pagination_Button>
        );
    }

    return (
        <div className="flex items-center justify-center py-10 px-2 lg:px-10">
            <div className="w-full flex items-center justify-between">
                <div className="">
                    {selected > 1 ?
                        <span onClick={() => togglePage(selected - 1)} className="flex pb-2 items-center justify-center pt-1 hover:bg-white rounded-md text-gray-600 hover:text-primary-blue cursor-pointer w-10 lg:w-16">
                            <BsArrowLeft className="w-5 h-5" />
                            {/* <span className="text-sm font-medium leading-none ">Previous</span> */}
                        </span > :
                        <span className="flex items-center w-10 lg:w-16"></span >
                    }
                </div>
                <div className="sm:flex gap-3 hidden mx-3">
                    {items}
                    {/* {[ ...Array(pageCount) ].map((e, i) => (
                            <span
                                key={i}
                                onClick={() => {
                                    setSelected(i);
                                    togglePage(i);
                                }}
                                className={`text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t  hover:border-indigo-300 pt-3 mr-4 px-2 ${selected == i ? "border-indigo-400" : "border-transparent"}`}
                            >
                                {i + 1}
                            </span>
                        ))} */}

                </div>
                <div className="">
                    {selected != pageCount ?
                        <span onClick={() => togglePage(selected + 1)} className="flex pb-2 items-center justify-center pt-1 text-gray-600 hover:bg-white rounded-md hover:text-primary-blue cursor-pointer w-10 lg:w-16">
                            {/* <span className="text-sm font-medium leading-none ">Next</span> */}
                            <BsArrowRight className="w-5 h-5" />
                        </span > :
                        <span className="flex items-center w-10 lg:w-16">
                        </span >}
                </div>
            </div >
        </div >
    );
}


const Pagination_Button = ({ toPageNumber, children, activeClass, togglePage, extraClass = "" }) => {

    return (
        <button onClick={() => { togglePage(toPageNumber); }} className={`text-sm font-medium rounded-b-md leading-none pb-2 cursor-pointer text-gray-600 hover:text-indigo-700 border-t  hover:border-indigo-300 pt-3 px-1 lg:px-2 ${extraClass}`}
        >
            {children}
        </button>
    );
}