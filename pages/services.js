import Header from "../components/landing/Header";
import React, { useEffect, useState } from "react";
import Footer from "../components/landing/Footer";
import { servicePageImages } from "../utils/common";
import Faq from "../components/landing/Faq";
import GloablBrands from "../components/landing/GloablBrands";
import Link from "next/link";
import { useRouter } from "next/router";
import ImgSkeltonLoading from "../components/common/ImgSkeltonLoading";

function Services() {
  const [openTab, setOpenTab] = useState(null);
  const [selectedTab, setSelectedTab] = useState("packaging");
  const [imgIndex, setImgIndex] = useState(0);
  const [prevImage, setPrevImage] = useState(servicePageImages[selectedTab][imgIndex]);
  const [imgLoading, setImgLoading] = useState(false);
  const selectTabClass = "bg-[#FFF300] py-4 text-center border-[1px] border-[#DDDDDD]";
  const unselectTabClass = "py-4 text-center border-[1px] border-[#DDDDDD]";
  const selectIndexClass = "border-[1px] border-white bg-white inline-block w-[15px] h-[15px]";
  const unselectIndexClass = "border-[1px] border-white inline-block w-[15px] h-[15px]";
  const router = useRouter();

  useEffect(() => {
    const { selected = null } = router.query;
    if (!selected) return;
    const tabs = ["packaging", "print", "digital", "dcg", "immersive", "film"];
    if (!tabs.includes(selected)) {
      router.query.selected = "packaging";
      return router.push(router);
    }
    setSelectedTab(selected);
  }, [JSON.stringify(router.query)])

  useEffect(() => {
    setPrevImage(servicePageImages[selectedTab][imgIndex]);
  }, [selectedTab, imgIndex])

  function handleSelectTab(tab) {
    if(tab==selectedTab) return;
    setImgLoading(true);
    setImgIndex(0);
    setSelectedTab(tab);
  }


  return (
    <div className="bg-white mx-auto w-full h-full snap-y">
      <Header />

      {/* section one */}
      <div className="flex gap-4 w-[90%] mx-auto mt-10 lg:mt-12 mb-20 xl:mb-32 2xl:mb-48">
        {/* left side */}
        <div className="pt-4 xl:pt-6 w-[60%] flex flex-col justify-start">
          <h1 className="text-4xl md:text-[3vw] 2xl:text-5xl font-[700] mt-4 leading-snug">Infinite <span className="text-[#FF0000]">Creative</span> <br /> <span className="text-[#FF0000]">Possibilities</span> Under 1 Roof.</h1>
          <p className="text-[14px] lg:text-[18px] xl:text-[20px] font-[400] opacity-70 w-[80%] mt-10 xl:mt-14 ">
            Scale your business with a dedicated team of creative professionals working on your fingertips. We cannot wait to put your creative briefs to action.
          </p>
          {/* action buttons */}
          <div className="mt-12 xl:mt-14  flex gap-4">
            <Link href={"/pricing#pricing"}>
              <button className="yellow-action-button-landing w-38 2xl:w-44">
                SEE PRICING
              </button>
            </Link>
            <Link href={`https://calendly.com/info-44201/prakria_direct_free_consultation?month=${new Date().getFullYear()}-${new Date().getMonth() + 1}`}>
              <button className="yellow-action-button-landing">
                BOOK CONSULTATION
              </button>
            </Link>

          </div>
        </div>
        {/* right side */}
        <div className="mt-32 2xl:mt-32 w-[550px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px] hidden md:block absolute right-[-40px] xl:right-[30px] 2xl:right-0 top-0">
          <img src="/assets/landing/Hard-Work 1.png" className="w-full h-full  object-contain" />
        </div>
      </div>

      {/* section two */}
      <section id="workfolio" className="flex flex-col items-center justify-center p-20 pb-8 w-full mx-auto">
        <p className="text-[3vw] 2xl:text-[55px] font-black mb-8">We Strive to Give You the Best</p>
        <p className="font-thin 2xl:text-[19px] text-[1.2vw] text-center">PRAKRIA DIRECT is a platform that gives Direct Access to Enterprises of any size or format to come and get all their <br /> creative requirements met through a personalized &amp; vetted team of our in-house Creative Experts without the hassle of<br /> typical agencies and the unreliability of Freelancers.</p>
      </section>
      <section className="w-[80%] mx-auto">
        {/* categories */}
        <div className="grid grid-cols-6 gap-2 text-[12px] lg:text-[14px] xl:text-[16px] font-[600] cursor-pointer select-none">
          <div onClick={() => handleSelectTab("packaging")} className={selectedTab == "packaging" ? selectTabClass : unselectTabClass}>
            PACKAGING
          </div>
          <div onClick={() => handleSelectTab("print")} className={selectedTab == "print" ? selectTabClass : unselectTabClass}>
            PRINT
          </div>
          <div onClick={() => handleSelectTab("digital")} className={selectedTab == "digital" ? selectTabClass : unselectTabClass}>
            DIGITAL
          </div>
          <div onClick={() => handleSelectTab("dcg")} className={selectedTab == "dcg" ? selectTabClass : unselectTabClass}>
            3D/CG
          </div>
          <div onClick={() => handleSelectTab("immersive")} className={selectedTab == "immersive" ? selectTabClass : unselectTabClass}>
            IMMERSIVE
          </div>
          <div onClick={() => handleSelectTab("film")} className={selectedTab == "film" ? selectTabClass : unselectTabClass}>
            ANIMATION
          </div>
        </div>
        {/* image section */}
        <div className="relative">
          <div className="min-h-[400px]">
            <ImgSkeltonLoading isLoading={imgLoading}/>
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

          {/* small dots */}
          <div className="flex gap-1 absolute bottom-[20px] left-[20px] cursor-pointer">
            <span className={imgIndex == 0 ? selectIndexClass : unselectIndexClass} onClick={() => setImgIndex(0)} style={{ borderRadius: "50%" }}></span>
            <span className={imgIndex == 1 ? selectIndexClass : unselectIndexClass} onClick={() => setImgIndex(1)} style={{ borderRadius: "50%" }}></span>
            <span className={imgIndex == 2 ? selectIndexClass : unselectIndexClass} onClick={() => setImgIndex(2)} style={{ borderRadius: "50%" }}></span>
            <span className={imgIndex == 3 ? selectIndexClass : unselectIndexClass} onClick={() => setImgIndex(3)} style={{ borderRadius: "50%" }}></span>
          </div>
        </div>
      </section>
      {/* section three */}
      <section className="pt-8 w-[80%] mx-auto" id="list-of-things">
        <h1 className="text-[20px] md:text-[3vw] 2xl:text-[48px] font-[700] mt-4 text-center">Here’s a list of some of the things we currently do…</h1>
        <div className="flex mt-10">
          {/* left side */}
          <div className="w-[50%] flex justify-evenly flex-col gap-8">
            {/* item */}
            <div className="">
              <h1 className="text-[#3B85F5] text-[25px] lg:text-[30px] font-[700]">Graphic Design</h1>
              <p className="font-[400] w-[34rem] text-[14px] lg:text-[16px] 2xl:text-[20px] mt-2">
                Get stunning graphic design services with unlimited<br /> revisions and zero hassle.
              </p>
            </div>
            {/* item */}
            <div className="">
              <h1 className="text-[#0ADEA9] text-[25px] lg:text-[30px] font-[700]">Custom Illustrations</h1>
              <p className="font-[400] w-[34rem]  text-[14px] lg:text-[16px] 2xl:text-[20px] mt-2">
                Illustrations made just for you. Orginal. Brand centric.<br /> Powerful.
              </p>
            </div>
            {/* item */}
            <div className="">
              <h1 className="text-[#3B85F5] text-[25px] lg:text-[30px] font-[700]">Presentation designs</h1>
              <p className="font-[400] w-[37rem] text-[14px] lg:text-[16px] 2xl:text-[20px] mt-2">
                Add zing &amp; brand recall to your presentations that leave a<br /> mark on your audience!
              </p>
            </div>
            {/* item */}
            <div className="">
              <h1 className="text-[#0ADEA9] text-[25px] lg:text-[30px] font-[700]">Motion graphics</h1>
              <p className="font-[400] w-[35rem] text-[14px] lg:text-[16px] 2xl:text-[20px] mt-2">
                Brand oriented jaw dropping graphics that move. Both<br /> literally &amp; figuratively.
              </p>
            </div>
            {/* item */}
            <div className="">
              <h1 className="text-[#3B85F5] text-[25px] lg:text-[30px] font-[700]">Digital Content Design </h1>
              <p className="font-[400] w-[35rem]  text-[14px] lg:text-[16px] 2xl:text-[20px] mt-2">
                Make your brand&apos;s digital presence stand out from the<br /> competition through our unique &amp; powerful digital<br /> content design.
              </p>
            </div>
            {/* item */}
            <div className="">
              <h1 className="text-[#0ADEA9] text-[25px] lg:text-[30px] font-[700]">3D &amp; CG Design</h1>
              <p className="font-[400] w-[34rem] text-[14px] lg:text-[16px] 2xl:text-[20px] mt-2">
                Add a new dimension to your brand&apos;s assets with our <br /> awesome 3D &amp; CG Design Services.
              </p>
            </div>
            {/* item */}
            <div className="">
              <h1 className="text-[#3B85F5] text-[25px] lg:text-[30px] font-[700]">AR &amp; VR Solutions</h1>
              <p className="font-[400] w-[27rem] lg:w-[35rem] text-[14px] lg:text-[16px] 2xl:text-[20px] mt-2">
                Make your brand stand out in the metaverse through technically sound &amp; aesthetically brilliant AR &amp;
                VR Solutions.
              </p>
            </div>
          </div>
          {/* right side */}
          <div className="w-[50%] flex flex-col justify-evenly">
            {/* image 1 */}
            <div>
              <img src="/assets/landing/Download_02 2.png" />
            </div>
            {/* image 2 */}
            <div>
              <img src="/assets/landing/fastTurn.png" />
            </div>
          </div>
        </div>
      </section>
      {/* faq */}
      <Faq />
      {/* brands that trust us */}
      <GloablBrands mainMarginClass={"mt-16"} />
      {/* book now */}
      <div className="w-[90%] mx-auto mt-20">
        <h1 className="text-[20px] md:text-[2vw] 2xl:text-[30px] mb-8 font-[600]">
          Sounds unbelievable? Book a free <br />consultation and find out!
        </h1>
        <Link href={`https://calendly.com/info-44201/prakria_direct_free_consultation?month=${new Date().getFullYear()}-${new Date().getMonth() + 1}`}>
          <button className="bg-[#FFF300] px-4 py-2 rounded-md font-[600] text-[12px] md:text-[1vw]">
            Book Now
          </button>
        </Link>
      </div>
      <div className="">
        <section className="mt-10">
          <Footer />
        </section>
      </div>
    </div>
  );
}

export default Services;

Services.getLayout = ({ children }) => {
  return <>{children}</>;
};
