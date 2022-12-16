import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { useRouter } from 'next/router';

function Header() {
    const [active, setActive] = useState("/");
    const router = useRouter();

    const handleRoutes = (pathname) => {
        setActive(pathname);
        router.push(pathname);
    }

    useEffect(() => {
        setActive(router.pathname);
    }, [router.pathname])
    return (
        <div className="m-auto flex items-center h-[120px] w-[90%] justify-between ">
            <div>
                <Link href="/">
                    <img src='/assets/prakria_landing_logo.png' className='h-16 w-40 xl:h-20 xl:w-48 object-contain' />
                </Link>
            </div>
            <div className="flex flex-1 gap-1 items-center justify-around ml-[30px] lg:ml-[55px] self-baseline mt-4 max-w-[1300px] text-[12px] lg:text-[14px] xl:text-[1vw]">
                <span className={`cursor-pointer text-center uppercase  font-semibold mx-2 ${active == "/work" ? 'border-b-2 border-black' : ""}`} onClick={() => handleRoutes("/work")}>
                    How We Work
                </span>
                <span className={`cursor-pointer text-center uppercase  font-semibold mx-2 ${active == "/portfolio" ? 'border-b-2 border-black' : ""}`} onClick={() => handleRoutes("/portfolio")}>
                    Our Portfolio
                </span>
                <span className={`cursor-pointer text-center uppercase  font-semibold mx-2 ${active == "/pricing" ? 'border-b-2 border-black' : ""}`} onClick={() => handleRoutes("/pricing")}>
                    Pricing
                </span>
                <span className={`cursor-pointer text-center uppercase  font-semibold mx-2 ${active == "/services" ? 'border-b-2 border-black' : ""}`} onClick={() => handleRoutes("/services")}>
                    Services
                </span>
                <span className={`cursor-pointer text-center uppercase  font-semibold mx-2 ${active == "/about" ? 'border-b-2 border-black' : ""}`} onClick={() => handleRoutes("/about")}>
                    About
                </span>
                <Link href="/login"><span><button className="font-semibold text-[#000000]  bg-[#FFF300]	 transition-colors duration-150 hover:bg-secondry-yellow justify-center items-center rounded-md px-3 w-auto py-2 xl:w-40  uppercase">Login</button></span></Link>
                <Link href="/pricing#pricing"><span><button className="font-semibold text-[#000000]  bg-[#FFF300] transition-colors duration-150 hover:bg-secondry-yellow justify-center items-center rounded-md w-auto px-3 py-2 xl:w-40  uppercase">Sign Up</button></span></Link>
            </div>
        </div>
    )
}

export default Header