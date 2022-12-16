import React from 'react'
import { FaFolder } from 'react-icons/fa'

function FileUploadBoxUI({ isDrag = false }) {
    return (
        <div className='h-[427px] w-[414px] left-[43%]' >
            <div className={`flex  mx-auto w-full h-full rounded-full border-2 border-dashed  z-0 flex-col   justify-center items-center ${isDrag ? 'border-blue-400' : 'border-gray-200'}`}>
                <div className="relative mx-auto mb-5">
                    <span className="">
                        <FaFolder className="w-32 h-32 md:w-32 md:h-32 xl:w-40 xl:h-40 text-[#E9E9E9]" />
                    </span>
                    <span>
                        <FaFolder className="absolute w-32 h-32 md:w-32 md:h-32 xl:w-40 xl:h-40 text-[#D9D9D9] top-[31.75px] left-[24px]" />
                    </span>
                </div>
                <div className="justify-center items-center px-16 md:px-16 xl:px-16">
                    <p className="text-xs md:text-xs xl:text-lg text-primary-gray md:text-md md:self-center">
                        Drop the files here or use <br /> the  &quot;+ Add Files&quot; button
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FileUploadBoxUI