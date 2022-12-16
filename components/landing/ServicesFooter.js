import Link from "next/link";
import React from "react";
import { AiFillYoutube, AiFillInstagram } from "react-icons/ai";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

function ServicesFooter() {
  return (
    <div className="flex-col px-8 xl:px-[5%] 2xl:px-[10%]  bg-primary-black text-white">
      <div className="py-10 w-full flex justify-end flex-1 gap-20 items-start  h-52">
        <div className="flex flex-col">
          <span className="font-semibold mb-4">Mobile app</span>
          <span className="text-sm mb-1 ">Features</span>
          <span className="text-sm mb-1 ">Live share</span>
          <span className="text-sm mb-1 ">Video record</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold mb-4">Community</span>
          <span className="text-sm mb-1 ">Featured artists</span>
          <span className="text-sm mb-1 ">The Portal</span>
          <span className="text-sm mb-1 ">Live events</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold mb-4">Company</span>
          <Link href="/about">
            <span className="text-sm mb-1 cursor-pointer">About us</span>
          </Link>
          <Link href={"/pricing#requestQuote"}>
            <span className="text-sm mb-1 cursor-pointer">Contact us</span>
          </Link>
          <span className="text-sm mb-1 ">History</span>
        </div>
        <div className="flex flex-col">
          <span>
            <Link href="/login">
              <button className="yellow-md-action-button w-28 md:w-24 xl:w-40 text-sm">
                Log In
              </button>
            </Link>
          </span>
        </div>
      </div>
      <hr className="mb-5" />
      <div className="flex justify-between items-center py-3 text-xs">
        <div className="mb-5">
          <span>© Prakria Direct. We love our users!</span>
        </div>
        <div>
          <span className="flex items-center gap-4">
            <p>Follow us:</p>
            <a
              href="https://www.facebook.com/Prakria-Direct"
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
        </div>
      </div>
    </div>
  );
}

export default ServicesFooter;
