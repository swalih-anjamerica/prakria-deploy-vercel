import React, { useState, useRef, createRef } from "react";
import Header from "./Header";
import Unsure from "./Unsure";
import Faq from "./Faq";
import Footer from "./Footer";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { images } from "../../utils/common";
import { MdClose } from "react-icons/md";
import ChatBox from "./ChatBox";
import GloablBrands from "./GloablBrands";
import { useEffect } from "react";
import ImgSkeltonLoading from "../common/ImgSkeltonLoading";

function LandingScreen() {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState("packaging");
  const [imgLoading, setImgLoading] = useState(false);
  const [refs, setRefs] = useState({});
  const [imgIndex, setImgIndex] = useState(0);
  const [prevImage, setPrevImage] = useState(images[selectedTab][imgIndex])

  const arrowStyle = "absolute text-white text-3xl z-10 h-12 bg-opacity-70 w-7 rounded-full flex items-center justify-center cursor-pointer";
  const selectTabClass = "bg-[#FFF300] py-4 text-center border-[1px] border-[#DDDDDD]";
  const unselectTabClass = "py-4 text-center border-[1px] border-[#DDDDDD]";

  useEffect(() => {
    setRefs(images[selectedTab].reduce((acc, val, i) => {
      acc[i] = createRef()
      return acc;
    }, {}))
  }, [selectedTab])

  const scrollToImage = (i) => {
    setCurrentImage(i);
    try {
      refs[i].current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    } catch (err) {
    }

  };

  const totalImages = images[selectedTab].length;

  // const nextImage = () => {
  //   if (currentImage >= totalImages - 1) {
  //     scrollToImage(0);
  //   } else {
  //     scrollToImage(currentImage + 1);
  //   }
  // };

  // const previousImage = () => {
  //   if (currentImage === 0) {
  //     scrollToImage(totalImages - 1);
  //   } else {
  //     scrollToImage(currentImage - 1);
  //   }
  // };

  const sliderControl = (isLeft) => (
    <span
      onClick={isLeft ? handlePreviousImage : handleNextImage}
      className={`${arrowStyle} ${isLeft ? "left-2" : "right-2"} bg-black`}
      style={{ top: "40%" }}
    >
      <span role="img" aria-label={`Arrow ${isLeft ? "left" : "right"}`}>
        {isLeft ? <FaChevronLeft /> : <FaChevronRight />}
      </span>
    </span>
  );

  const handlePreviousImage=()=>{
    let end=images[selectedTab].length-1;
    if(imgIndex<=0) setImgIndex(end);
    setImgIndex(prev=>prev-=1);
  }

  const handleNextImage=()=>{
    let end=images[selectedTab].length-1;
    if(imgIndex>=end) setImgIndex(0);
    setImgIndex(prev=>prev+=1);
  }

  const handleSelectTab = (tab) => {
    if (tab == selectedTab) return;
    setImgLoading(true);
    setSelectedTab(tab);
  }


  useEffect(() => {
    setPrevImage(images[selectedTab][imgIndex]);
  }, [selectedTab, imgIndex])

  return (
    <main className="bg-white mx-auto w-full h-full snap-y">
      <Header />
      <section id="landing">
        <div className="ms-3  w-[90%] mx-auto">
          <div className="relative">
            <div className="flex relative mb-20">
              <div className="flex flex-col mt-[70px]">
                <div className="landing-heading ">
                  <h1>
                    <span className="text-text-sec-red">UNLIMITED</span> HIGH
                    QUALITY
                  </h1>
                  <h1 className="font-bold">
                    DESIGNS.<span className="text-text-sec-red"> ZERO</span>{" "}
                    HASSLE.
                  </h1>
                </div>
                <div className="mt-14 xl:mt-16 sm:text-sm md:text-[1rem] lg:text-xl ">
                  <h4 className="mb-1 block ">
                    <span className="text-[#0629CD] font-bold text-base  lg:text-xl 2xl:text-2xl tracking-wider">
                      80%
                    </span>{" "}
                    less{" "}
                    <span className="text-[#0629CD] font-bold text-base  lg:text-xl 2xl:text-2xl tracking">
                      COST
                    </span>{" "}
                    vs regular agencies
                  </h4>
                  <h4 className=" block">
                    <span className="text-[#0629CD] font-bold text-base  lg:text-xl 2xl:text-2xl tracking-wider">
                      5%
                    </span>{" "}
                    more{" "}
                    <span className="text-[#0629CD] font-bold text-base  lg:text-xl 2xl:text-2xl tracking">
                      SPEED
                    </span>{" "}
                    and{" "}
                    <span className="text-[#0629CD] font-bold text-base  lg:text-xl 2xl:text-2xl tracking">
                      RELIABILITY
                    </span>{" "}
                    vs freelancers
                  </h4>
                </div>
                <div className="flex mt-14 xl:mt-16 gap-4">
                  <Link href="/pricing#pricing" scroll={false}>
                    <button className="yellow-action-button-landing w-34 2xl:w-44">
                      SEE PRICING
                    </button>
                  </Link>
                  <Link
                    href={`https://calendly.com/info-44201/prakria_direct_free_consultation?month=${new Date().getFullYear()}-${new Date().getMonth() + 1
                      }`}
                  >
                    <button className="yellow-action-button-landing ">
                      BOOK CONSULTATION
                    </button>
                  </Link>
                </div>
              </div>
              <div className=" w-[550px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px] hidden md:block  absolute right-[-40px] xl:right-[30px] 2xl:right-0 top-0">
                <img
                  src={"/assets/landing/peopleAim.png"}
                  className="w-full h-full  object-contain"
                // className="absolute top-0 md:w-[57%] md:-right-[1rem] lg:w-[55%]  xl:w-[60%] xl:-top-[2rem] 2xl:-right-[8.5rem] 2xl:w-[50%]"
                />
              </div>
            </div>
            <ChatBox />
          </div>
        </div>
      </section>
      <GloablBrands mainMarginClass={"mt-[10rem] xl:mt-[12rem] 2xl:mt-[13rem]"} />
      <section className="flex flex-col w-full bg-[#050F3D] text-white">
        <span className=" text-[1.8vw] mx-auto py-16 font-[600] italic text-center">
          Subscribe to a dedicated design team for your growing business needs.
          <br />
          Create unlimited projects at no extra cost.
        </span>
        <div className="flex justify-evenly w-full mb-10 text-[20px]">
          <div className="flex flex-col">
            <img
              src="/assets/landing/pricing1.png"
              className="w-40 object-contain"
            />
            <span className="text-center mt-10 font-[600]">
              Unlimited
              <br /> designs
            </span>
          </div>
          <div className="flex flex-col">
            <img
              src="/assets/landing/unlimited-revision-icon.png"
              className="w-40 object-contain"
            />
            <span className="text-center mt-10 font-[600]">
              Unlimited
              <br /> revisions
            </span>
          </div>
          <div className="flex flex-col">
            <img
              src="/assets/landing/24Hr.png"
              className="w-40 object-contain"
            />
            <span className="text-center mt-10 font-[600]">
              24-48 hr
              <br />
              turnaround time
            </span>
          </div>
          <div className="flex flex-col">
            <img
              src="/assets/landing/blueCross.png"
              className="w-40 object-contain"
            />
            <span className="text-center mt-10 font-[600]">
              No Contract.Cancel
              <br />
              anytime
            </span>
          </div>
        </div>
      </section>
      <section className="flex flex-col w-full bg-[#FFF300]">
        <div className="flex  w-[80%] mx-auto items-center py-16 justify-evenly">
          <span className="text-4xl font-bold italic w-[40%]">
            Create. Edit.
            <br /> Receive. Repeat.
          </span>
          <span className="w-[50%] text-md text-semibold mx-auto">
            Direct access to a specialized team of creative experts makes for 10
            times more efficient results. No long mail chains, no more
            slow-moving agency process, no more management complexity.
            You&apos;ll always have a single point-of-contact from the team, and
            every development will be transparent, organized, and seamlessly
            managed.
          </span>
        </div>
        <div className="flex justify-evenly w-full mb-10">
          <div className="flex flex-col items-center w-[33%]">
            <img
              src="/assets/landing/submit.png"
              className="w-52 object-contain"
            />
            <span className="text-center mt-10 font-bold mx-10 w-fit lg:w-[230px]">
              Start with submitting unlimited design requests on our platform
            </span>
          </div>
          <div className="flex flex-col items-center w-[33%]">
            <img
              src="/assets/landing/revisionPaper.png"
              className="w-52 object-contain"
            />
            <span className="text-center mt-10 font-bold mx-10 w-fit lg:w-[300px]">
              Receive your design within 24-48 hrs and get as many revisions on
              your project as you like
            </span>
          </div>
          <div className="flex flex-col items-center w-[33%]">
            <img
              src="/assets/landing/thumbs.png"
              className="w-52 object-contain"
            />
            <span className="text-center mt-10 font-bold mx-10 w-fit lg:w-[275px]">
              Give approval on final draft once you&apos;re satisfied and get
              the open source files for your projects right away
            </span>
          </div>
        </div>
      </section>
      <section className="w-[80%] flex flex-col mx-auto mt-16">
        {/* <p className="text-4xl pb-3 font-black italic leading-[3rem] text-center"> */}
        <p className="text-[3vw] pb-3 font-black italic text-center">
          We&apos;re
          <span className="text-[#FF0000]"> experienced</span>. We&apos;re{" "}
          <span className="text-[#FF0000]"> quick</span>. We&apos;re{" "}
          <span className="text-[#FF0000]"> Direct</span>.<br /> And we&apos;re
          hell-of-a-lot creative.
        </p>
        <p className="text-sm text-center font-normal mx-auto w-[70%] mt-2">
          When we say Infinite Creative Possibilities, we mean it. From Print
          Design, Packaging, Branding, to Emailers, Newsletters, &amp; Digital.
          From Stop-motion Animation, Food CGI, to AR Filters &amp; Games. We
          bring together experts in each discipline so you get a complete team
          for all your creative requirements.
        </p>
      </section>
      <section className="w-[80%] mx-auto mt-8 ">
        <div className="grid grid-cols-6 gap-2 text-[12px] lg:text-[14px] xl:text-[16px] font-[600] cursor-pointer select-none">
          <div
            onClick={() => handleSelectTab("packaging")}
            className={
              selectedTab == "packaging" ? selectTabClass : unselectTabClass
            }
          >
            PACKAGING
          </div>
          <div
            onClick={() => handleSelectTab("print")}
            className={
              selectedTab == "print" ? selectTabClass : unselectTabClass
            }
          >
            PRINT
          </div>
          <div
            onClick={() => handleSelectTab("digital")}
            className={
              selectedTab == "digital" ? selectTabClass : unselectTabClass
            }
          >
            DIGITAL
          </div>
          <div
            onClick={() => handleSelectTab("dcg")}
            className={selectedTab == "dcg" ? selectTabClass : unselectTabClass}
          >
            3D/CG
          </div>
          <div
            onClick={() => handleSelectTab("immersive")}
            className={
              selectedTab == "immersive" ? selectTabClass : unselectTabClass
            }
          >
            IMMERSIVE
          </div>
          <div
            onClick={() => handleSelectTab("film")}
            className={
              selectedTab == "film" ? selectTabClass : unselectTabClass
            }
          >
            ANIMATION
          </div>
        </div>
        <div className="flex justify-center w-full items-center select-none">
          <div className="relative w-full">
            <div className="carousel min-h-[400px]">
              <ImgSkeltonLoading isLoading={imgLoading} />
              {sliderControl(true)}
              {images[selectedTab].map((img, i) => (
                <div
                  className="w-full h-fit flex-shrink-0"
                  key={i}
                  ref={refs[i]}
                >
                  {/* {selectedTab != "film" ? (
                    <img src={img} className="w-full object-contain" onLoad={() => setImgLoading(false)} />
                  ) : (
                    <video
                      src={img}
                      autoPlay
                      loop
                      className="w-full object-contain"
                      onLoadStart={()=>setImgLoading(false)}
                    />
                  )} */}
                  {
                    prevImage?.endsWith("mp4") ?
                      <video src={prevImage} className="w-full object-contain" autoPlay loop onLoadStart={e => setImgLoading(false)} />
                      :
                      <img src={prevImage} className="w-full" onLoad={e => {
                        setImgLoading(false);
                      }}
                      />
                  }
                </div>
              ))}
              {sliderControl()}
            </div>
          </div>
        </div>
      </section>
      <div className="flex gap-12 lg:gap-16 w-[80%] mx-auto mt-56">
        <div className="relative h-52 lg:h-[15rem] xl:h-[16rem] flex-1">
          <img
            src="/assets/landing/penNpaper.png"
            className="absolute -top-[11rem] left-[50%] translate-x-[-50%] w-52"
          />

          <div className="w-full h-52 lg:h-[15rem] xl:h-[16rem] py-7 px-5 xl:px-8 bg-primary-black flex flex-col justify-between gap-5 text-white">
            <p className="text-[2vw] text-center font-semibold">
              Free Consultation
            </p>
            <p className="text-[12px] lg:text-[1vw] text-center">
              Get in touch with our company experts and choose your perfect plan
            </p>
            <Link
              href={`https://calendly.com/info-44201/prakria_direct_free_consultation?month=${new Date().getFullYear()}-${new Date().getMonth() + 1
                }`}
            >
              <button className="landing-3consecutive-button">
                BOOK NOW
              </button>
            </Link>
          </div>
        </div>
        <div className="relative h-52 lg:h-[15rem] xl:h-[16rem] flex-1">
          <img
            src="/assets/landing/subscribe.png"
            className=" absolute -top-[11.2rem] left-[50%] translate-x-[-50%] w-52"
          />
          <div className="w-full h-52 lg:h-[15rem] xl:h-[16rem] py-7 px-5 xl:px-8 bg-primary-black flex flex-col justify-between gap-5 text-white">
            <p className="text-[2vw] text-center font-semibold">Subscription</p>
            <p className="text-[12px] lg:text-[1vw] text-center">
              Recommended for small and medium sized businesses
            </p>
            <Link href={"/pricing#pricing"} scroll={false}>
              <button className="landing-3consecutive-button">
                Subscribe Now
              </button>
            </Link>
          </div>
        </div>
        <div className="relative h-52 lg:h-[15rem] xl:h-[16rem] flex-1">
          <img
            src="/assets/landing/handshake.png"
            className="absolute -top-[11.3rem] left-[50%] translate-x-[-50%] w-52"
          />
          <div className="w-full h-52 lg:h-[15rem] xl:h-[16rem]  py-7 px-5 xl:px-8 bg-primary-black flex flex-col justify-between gap-5 text-white">
            <p className="text-[2vw] text-center font-semibold">Partner With Us</p>
            <p className="text-[12px] lg:text-[1vw] text-center">
              Best suited for companies with bulk and unique design requirements
            </p>
            <Link
              href={"/pricing#partner-with-us"}
              scroll={false}
            >
              <button className="landing-3consecutive-button">
                Partner benefits
              </button>
            </Link>

          </div>
        </div>
      </div>
      <div id="faq">
        <Faq />
      </div>
      <Unsure />
      <Footer />
    </main >
  );
}

export default LandingScreen;
