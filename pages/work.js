import Footer from "../components/landing/Footer";
import Faq from "../components/landing/Faq";
import Unsure from "../components/landing/Unsure";
import Link from "next/link";
import { images } from "../utils/common";
import Header from "../components/landing/Header";
import React, { useRef, useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

function Work() {
  const ref = useRef(null);
  const works = [...images.packaging, ...images.dcg];
  const [current, setCurrent] = useState(1);

  const scroll = (dir) => {
    switch (dir) {
      case "left":
        ref.current.scrollLeft -= 1000;
        ref.current.style.animation = "mynewmove 1s	";

        break;
      case "right":
        ref.current.scrollLeft += 1000;
        ref.current.style.animation = "mynewmove 1s	";
        break;
    }
  };

  return (
    <div className="bg-white mx-auto w-full h-full snap-y">
      <Header />
      <div className="h-fit">
        <div className="relative h-[350px] lg:h-[600px] w-[90%] mx-auto">
          <section className="xl:w-[60%] h-[50%] flex flex-col gap-4 mr-auto mt-10 ">
            <p className="landing-heading">
              From Simplicity in Process <br />{" "}
              <span className="text-[#FF5959] tracking-wide">Directly</span> to
              Efficiency in Results
            </p>
            <p className="text-md  md:w-[100%] mt-2">
              Smart tools, the best of creative talent, and transparency in
              workflow are some of
              <br />
              the key ingredients in our recipe for great work. Working with us
              is like having an <br /> in-house creative team at your
              fingertips.
            </p>
            <div className="mt-10 xl:mt-14">
              <Link href="/services">
                <button className="yellow-action-button-landing w-38 2xl:w-44 2xl:text-[16px]">
                  OUR SERVICES
                </button>
              </Link>
            </div>

          </section>
          <img
            src="/assets/landing/createEditRecieve.png"
            className="absolute object-contain hidden lg:block md:w-[65%] xl:bottom-0 right-3  bottom-0"
          />
        </div>
      </div>
      {/* <div className="h-[70vh] max-h-[400px] lg:max-h-[600px] flex justify-between items-center w-full 2xl:px-56 px-20 py-0 bg-[#050F3D]"> */}
      <div className="h-[70vh] max-h-[400px] lg:max-h-[600px] flex justify-between items-center w-full   bg-[#050F3D]">
        <div className="flex w-[95%] mx-auto items-center">
          <div className="flex-1">
            <img
              src="/assets/landing/fastTurn.png"
              className=""
            />
          </div>
          <div className="flex-1 py-28 text-white flex flex-col justify-center">
            <p className="text-4xl 2xl:text-5xl  font-black  leading-10 ">
              Fast Turnaround
            </p>
            <p className="text-sm   md:w-[100]% mt-6">
              Conventional agencies are expensive and slow.<br />
              Freelancers are unreliable. That&apos;s where we come in.<br />
              Create as many projects as you want on our platform.<br />
              We&apos;ll curate a specialized team dedicated to your<br />
              brand. Turnaround time? A whooping 24-48 hrs.<br />
              Cost? 1/10th of a regular creative agency.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 ">
        <div className="flex justify-between items-center w-[90%] mx-auto pt-10">
          <div className="w-[43%] py-28 flex flex-col justify-center">
            <p className="text-4xl 2xl:text-5xl pb-3 font-black leading-10 ">
              Create a Project
            </p>
            <p className="text-sm text-[#464646] font-semibold  md:w-[325px] mt-6">
              Start by submitting infinite creative requests<br />
              on our platform.From the smallest of tasks<br />
              to the biggest of briefs, we&apos;ve got you<br />
              covered.
            </p>
          </div>
          <div className="w-[57%] self-end">
            <img
              src="/assets/landing/Group 61.png"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex justify-between items-center w-[90%] mx-auto ">
          <div className="w-[57%] self-start -mt-[40px]">
            <img
              src="/assets/landing/Group 62.png"
              className="object-contain"
            />
          </div>
          <div className="w-[43%] py-28 flex flex-col justify-center -mt-[80px]">
            <p className="text-4xl w-[80%] 2xl:text-5xl pb-3 font-black leading-10 ">
              Share Infinite <br /> Revisions &amp; <br /> Feedback
            </p>
            <p className="text-sm text-[#464646] font-semibold md:w-[100%] mt-6">
              Sharing feedback no longer comes with the <br />
              hassle of long mail chains. You will receive <br />
              your project within 24-48 hours. If you&apos;re not <br />
              a 100% satisfied, share as many revisions as <br />
              you want on our platform.
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex justify-between items-center w-[90%] mx-auto">
          <div className="w-[43%] py-28 flex flex-col justify-center -mt-[60px]">
            <p className="text-4xl w-[80%] 2xl:text-5xl pb-3 font-black leading-10 ">
              Download <br /> Source Files &amp; <br /> Close
            </p>
            <p className="text-sm text-[#464646] font-semibold md:w-[90%] mt-6">
              Get Direct access to source files straight<br />
              from our platform. No need to wait for<br />
              someone to send you the files to close the<br />
              project. That&apos;s how easy it is. Project closed<br />
              in a click-of-a-button.
            </p>
          </div>
          <div className="w-[57%] self-start -mt-[15px]">
            <img
              src="/assets/landing/Group 63.png"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <section className="bg-[#FFF300] h-[20rem] mt-12">
        <div className="relative h-full w-[90%] mx-auto">
          <div className="absolute flex w-full justify-between top-[15rem] gap-20">
            <div className="relative h-52 lg:h-[15rem] xl:h-[16rem] flex-1">
              <img
                src="/assets/landing/penNpaper.png"
                className="absolute -top-[11rem] left-[50%] translate-x-[-50%] w-52"
              />
              {/* <span className="w-60 h-52 xl:w-72 py-7 px-8 bg-primary-black flex flex-col justify-evenly gap-5 text-white"> */}
              <span className="w-full h-52 lg:h-[15rem] xl:h-[16rem] py-7 px-8 bg-primary-black flex flex-col justify-evenly gap-5 text-white">
                <p className="text-[2vw] self-center font-semibold">
                  Free Consultation
                </p>
                <p className="text-[12px] lg:text-[1vw] text-center">
                  Get in touch with our company experts and choose your perfect plan
                </p>
                <button className="bg-[#FFE147] px-2 py-1 text-primary-black text-xs rounded-sm w-36 font-[600] mx-auto uppercase">
                  <Link
                    href={`https://calendly.com/info-44201/prakria_direct_free_consultation?month=${new Date().getFullYear()}-${new Date().getMonth() + 1
                      }`}
                  >
                    BOOK NOW
                  </Link>
                </button>
              </span>
            </div>
            <div className="relative h-52 lg:h-[15rem] xl:h-[16rem] flex-1">
              <img
                src="/assets/landing/subscribe.png"
                className=" absolute -top-[11.2rem] left-[50%] translate-x-[-50%] w-52"
              />
              {/* <span className="w-60 h-52 xl:w-72 py-7 px-8 bg-primary-black flex flex-col justify-evenly gap-5 text-white"> */}
              <span className="w-full h-52 lg:h-[15rem] xl:h-[16rem] py-7 px-8 bg-primary-black flex flex-col justify-evenly gap-5 text-white">
                <p className="text-[2vw] self-center font-semibold">Subscription</p>
                <p className="text-[12px] lg:text-[1vw] text-center">
                  Recommended for small and medium sized businesses
                </p>
                <Link href={"/pricing#pricing"} scroll={false}>
                  <button className="bg-[#FFE147] px-2 py-1 text-primary-black text-xs rounded-sm w-36 font-[600] mx-auto uppercase">
                    Subscribe Now
                  </button>
                </Link>
              </span>
            </div>
            <div className="relative h-52 lg:h-[15rem] xl:h-[16rem] flex-1">
              <img
                src="/assets/landing/handshake.png"
                className="absolute -top-[11.3rem] left-[50%] translate-x-[-50%] w-52"
              />
              {/* <span className="w-60 h-52 xl:w-72 py-7 px-8 bg-primary-black flex flex-col justify-evenly gap-5 text-white"> */}
              <span className="w-full h-52 lg:h-[15rem] xl:h-[16rem]  py-7 px-8 bg-primary-black flex flex-col justify-evenly gap-5 text-white">
                <p className="text-[2vw] self-center font-semibold">Partner With Us</p>
                <p className="text-[12px] lg:text-[1vw] text-center">
                  Best suited for companies with bulk and unique design requirements
                </p>
                <Link href="/pricing#partner-with-us">
                  <button className="bg-[#FFE147] px-2 py-1 text-primary-black text-xs rounded-sm w-36 font-[600] mx-auto uppercase">
                    Partner benefits
                  </button>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="p-10 md:mt-44 xl:mt-24  2xl:px-28 2xl:mt-44"> */}
      <section className="w-[95%] ml-auto mt-[15rem]">
        <p className="text-4xl font-black leading-10 pb-3">Our Works</p>
      </section>
      <div className="relative h-72 w-[95%] ml-auto">
        <div
          className=" flex flex-row gap-3 overflow-auto h-full pr-28 mb-7  no-scrollbar"
          ref={ref}
        >
          {works.map((img, i) => {
            return (
              <React.Fragment key={i}>
                <img src={img} className="shadow-md" />
                <div>
                  <BsChevronCompactLeft
                    className="absolute-vertical-center h-10 w-10  text-primary-black cursor-pointer"
                    onClick={() => {
                      scroll("left");
                    }}
                  />
                </div>
                <div>
                  <BsChevronCompactRight
                    className="absolute-vertical-center-right h-10 w-10 absolute text-primary-black cursor-pointer"
                    onClick={() => {
                      scroll("right");
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <Faq />
      <Unsure />
      <Footer />
    </div>
  );
}

export default Work;

Work.getLayout = ({ children }) => {
  return <>{children}</>;
};
