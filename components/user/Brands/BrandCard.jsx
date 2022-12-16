import React from "react";
import Link from "next/link";
import { FileSizeHElper } from "../../../lib/FileHelper";
import utils from "../../../helpers/utils";
import { useRouter } from "next/router";
export default function BrandCard({
  brand,
  activeBrand,
  setActiveBrand = () => { },
  index,
}) {
  const router = useRouter()
  if (!brand) return <span className="m-10 text-3xl text-red"> No Brands</span>;


  return (
    <>
      <li
        className="flex mb-2"
        onClick={() => {
          setActiveBrand(index);
        }}
        onDoubleClick={() => { router.push(`/brands/${brand._id}`) }}
      >
        <div className="grid grid-cols-12 items-center w-full bg-secondry-gray py-6 h-28 rounded-[11px] text-[#414040]">
          <div className="mx-7 col-span-1">
            {activeBrand === index ? (
              <svg
                width="33"
                height="26"
                viewBox="0 0 33 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0H24L32.5 13L24 26H0V0Z" fill="#bfbfbf" />
              </svg>
            ) : (
              <svg
                width="33"
                height="26"
                viewBox="0 0 33 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 1.5H23.1886L30.7078 13L23.1886 24.5H1.5V1.5Z"
                  stroke="#C4C4C4"
                  strokeWidth="3"
                />
              </svg>
            )}
          </div>

          <div className="col-span-5 h-full w-full flex justify-between">
            <div className="flex justify-between w-full text-left my-auto pl-6">
              <div className="font-medium text-2xl items-baseline text-left cursor-pointer flex w-full break-words text-[#414040] flex-col ">
                <Link href={`/brands/${brand._id}`}>
                  <p className="truncate">{brand.name}</p>
                </Link>
                {/* <p className="text-primary-blue text-sm lowercase w-[70%] xl:w-[100%] break-words">
                  002 | Swalih Brand | Print
                </p> */}
              </div>

            </div>
          </div>
          <div className="col-span-3">
            <div className="font-medium items-center text-[#414040]  flex w-full break-words">
              <span className="ml-auto my-auto text-[16px] min-w-[160px]">
                {
                  utils.projectStartDateFormate(
                    new Date(
                      brand?.updatedAt
                        ? (brand?.updatedAt)
                        : brand?.createdAt ? brand?.createdAt : "---"
                    )
                  )
                }
              </span>
            </div>
          </div>
          <div className="col-span-3">
            <div className="font-medium text-[16px] text-[#414040] items-center   flex w-full break-words">
              <span className="ml-auto text-left w-fit min-w-[160px]">{<span>
                {FileSizeHElper(brand.files)}
              </span>}</span>
            </div>
          </div>

        </div>
      </li>
    </>
  );
}


{/* <div>
<div className="font-medium text-lg xl:text-xl items-center   flex w-full break-words">
  <span className="">{FileSizeHElper(brand.files)}</span>
</div> */}
{/* <p className="text-primary-blue text-sm lowercase">
  new | brand
  <Link href="#" passHref>
    <span className="hover:cursor-pointer  hover:underline"></span>
  </Link>
</p> */}
{/* </div> */ }