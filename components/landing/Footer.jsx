import Link from "next/link";
import React from "react";
import { AiFillYoutube, AiFillInstagram } from "react-icons/ai";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    // <div className="flex-col px-1 md:px-[65px] xl:px-[100px] 2xl:px-[10%]  bg-[#050F3D] text-white">
    <div className="flex-col bg-[#050F3D] text-white">
      <div className="py-10 w-[90%] mx-auto flex mb-[20px] pt-[60px]  justify-between items-start  h-64">
        <div className="flex flex-col">
          <Link href="/">
            <img src="/assets/landing/logoWhite.png" className="h-14 w-40" />
          </Link>
          <span className="flex items-center gap-4 mt-8">
            {/* <p className="mr-5 ">Subscribe to our Blog</p> */}
            <a
              href="https://www.facebook.com/Prakria-Direct-107029028706943"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF className="h-4 w-4 text-white" />
            </a>
            <a
              href="https://www.instagram.com/prakria.direct/"
              target="_blank"
              rel="noreferrer"
            >
              <AiFillInstagram className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://www.youtube.com/channel/UC3HmwXvtX7dx7zlCQbe_fWg"
              target="_blank"
              rel="noreferrer"
            >
              <AiFillYoutube className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://www.linkedin.com/company/prakriadirect"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedinIn className="w-5 h-4 text-white" />
            </a>
          </span>
          {/* <span className="border border-white w-full h-10 mt-6 flex justify-between">
            <input
              className="bg-[#050F3D] px-3 focus:outline-none"
              placeholder="Email"
            />
            <span className="w-[30%] items-center flex justify-center h-full cursor-pointer bg-white text-black">
              Sign Up
            </span>
          </span> */}
        </div>
        <div className="flex flex-col text-sm">
          <span className="font-[700] mb-4 text-[16px]">Explore</span>
          <Link href="/work">
            <span className="text-sm mb-1 cursor-pointer ">How we Work</span>
          </Link>
          <Link href="/portfolio">
            <span className="text-sm mb-1 cursor-pointer ">Portfolio</span>
          </Link>
          <Link href="/pricing">
            <span className="text-sm mb-1 cursor-pointer ">Pricing</span>
          </Link>
          <Link href="/services">
            <span className="text-sm mb-1 cursor-pointer ">Services</span>
          </Link>
          <Link href="/about">
            <span className="text-sm mb-1 cursor-pointer ">About</span>
          </Link>
        </div>
        <div className="flex flex-col text-sm">
          <span className="font-[700] mb-4 text-[16px]">Inquire</span>
          <Link href={"/?chatbox=true"}>
            <span className="text-sm mb-1 cursor-pointer">Contact Us </span>
          </Link>
          <Link href="/career">
            <span className="text-sm mb-1 cursor-pointer">Join The Team</span>
          </Link>
        </div>
        <div className="flex flex-col text-sm">
          <Link href="/services">
            <span className="font-[700] mb-4 cursor-pointer text-[16px]">
              Services
            </span>
          </Link>
          {/* <Link href="/services?selected=print#workfolio"> */}
          <span
            className="text-sm mb-1 cursor-pointer "
            onClick={() => {
              location.href = "/services?selected=print#workfolio";
            }}
          >
            Print
          </span>
          {/* </Link> */}
          {/* <Link href="/services?selected=digital#workfolio"> */}
          <span className="text-sm mb-1 cursor-pointer " onClick={() => {
            location.href = "/services?selected=digital#workfolio";
          }}>Digital</span>
          {/* </Link> */}
          {/* <Link href="/services#list-of-things"> */}
          <span className="text-sm mb-1 cursor-pointer " onClick={() => {
            location.href = "/services#list-of-things";
          }}>Presentation</span>
          {/* </Link> */}
        </div>
        <div className="flex flex-col">
          <span className="font-[700] mb-4 text-[16px]">Work With Us</span>
          {/* <Link href="/pricing#pricing"> <span className="text-sm mb-1 ">Subscription</span> </Link> */}
          <Link href="/pricing#pricing" scroll={false}>
            <span className="text-sm mb-1 cursor-pointer">Subscription</span>
          </Link>
          {/* <span className="text-sm mb-1 ">Single Project</span> */}
          {/* <Link href="#">
            <span className="text-sm mb-1 ">Partner With Us</span>
          </Link> */}
        </div>
        <div className="flex flex-col">
          <span>
            <Link href="/login">
              <button className="w-fit   text-primary-black  bg-[#FFE147]	 transition-colors duration-150 hover:bg-secondry-yellow justify-center items-center xl:text-xl rounded-[3px] px-4 py-2 font-semibold md:w-24 xl:w-40 text-sm">
                Log In
              </button>
            </Link>
          </span>
        </div>
      </div>
      <div className="flex gap-6 py-3 pb-6 text-xs w-[90%] mx-auto">
        <span>© Prakria Direct | 2021 We love our users!</span>
        <span>Terms, Privacy Policy</span>
        <span>Designed by Prakria</span>
      </div>
    </div>
  );
}

export default Footer;
