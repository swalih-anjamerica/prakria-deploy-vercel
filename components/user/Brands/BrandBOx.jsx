import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FileSizeHElper } from '../../../lib/FileHelper'
import utils from '../../../helpers/utils'

const BrandBOx = ({ brand }) => {

    const router = useRouter()

    return (
        <div className="bg-secondry-gray shadow-md border-gray-200 border rounded-lg p-5 h-[18rem] lg:h-[20rem] flex-col relative hover:cursor-pointer " onDoubleClick={() => { router.push(`/brands/${brand._id}`) }} >
            {/* top  */}
            <div className='flex justify-between'>
                {/* <div className="absolute bottom-5 left-5 tracking-widest text-[#665858] font-bold">{brand.name.toUpperCase()}</div> */}
                <div>
                    <Link href={`/brands/${brand._id}`} >
                        <div className=" tracking-widest text-[#414040] font-bold">{brand.name.toUpperCase()}</div>
                    </Link>

                    {/* <p className="text-primary-blue text-sm lowercase w-[70%] xl:w-[100%] break-words">
                        002 | Swalih Brand | Print
                    </p> */}
                </div>
                <div>
                    <span className="tracking-widest text-[#414040] ">{FileSizeHElper(brand.files)}</span>
                </div>
            </div>
            {/* bottom */}
            <div className='absolute bottom-[10px] text-sm'>
                <div>
                    <div className='uppercase text-[#414040] mb-2'>Last Update</div>
                    <div className='text-[#414040]'>
                        {utils.projectStartDateFormate(
                            new Date(
                                brand?.updatedAt
                                    ? (brand?.updatedAt)
                                    : brand?.createdAt ? brand?.createdAt : "---"
                            )
                        )}
                    </div>
                </div>
            </div>
            {/* <div className="font-medium text-lg xl:text-xl items-center   flex w-full break-words">
                <span className="">{<span>
                    {utils.projectLastUpdateFormate(
                        new Date(
                            brand?.updatedAt
                                ? (brand?.updatedAt)
                                : brand?.createdAt ? brand?.createdAt : "---"
                        )
                    )}
                </span>}</span>
            </div>
            <div className="font-medium text-lg xl:text-xl items-center   flex w-full break-words">
                <span className="">{FileSizeHElper(brand.files)}</span>
            </div> */}
        </div>
    )
}

export default BrandBOx


