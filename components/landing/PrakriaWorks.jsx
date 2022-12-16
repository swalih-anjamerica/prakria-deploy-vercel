import React from 'react'
import { images } from "../../utils/common";
import { useState } from "react";
import ImgSkeltonLoading from '../common/ImgSkeltonLoading';

function PrakriaWorks() {
    const [selectedTab, setSelectedTab] = useState("packaging");
    const [imgLoading, setImgLoading] = useState(false);
    const selectTabClass = "bg-[#FFF300] py-2 text-center border-[1px] border-[#DDDDDD]";
    const unselectTabClass = "py-2 text-center border-[1px] border-[#DDDDDD]";

    function handleSelectTab(tab) {
        if (tab == selectedTab) return;
        setImgLoading(true);
        setSelectedTab(tab);
    }

    return (
        <>
            <section className="flex flex-col items-center justify-center p-20 pt-3 pb-8">
                <p className="landing-heading">We Strive to Give You the Best</p>
                <p className="text-md font-thin w-[70%] xl:w-[60%] text-center">PRAKRIA DIRECT is a platform that gives Direct Access to Enterprises of any size or format to come and get all their creative requirements met through a personalized & vetted team of our in-house Creative Experts without the hassle of typical agencies and the unreliability of Freelancers.</p>
            </section>
            <div className=' mx-auto w-[90%]'>
                <section className="grid grid-cols-6 gap-2 text-[12px] lg:text-[14px] xl:text-[16px] font-[600] cursor-pointer select-none">
                    <div onClick={() => handleSelectTab("packaging")} className={selectedTab == "packaging" ? selectTabClass : unselectTabClass}>
                        PACKAGING
                    </div>
                    <div onClick={() => handleSelectTab("print")} className={selectedTab == "print" ? selectTabClass : unselectTabClass}>
                        PRINT
                    </div>
                    <div onClick={() => handleSelectTab("dcg")} className={selectedTab == "dcg" ? selectTabClass : unselectTabClass}>
                        3D/CG
                    </div>
                    <div onClick={() => handleSelectTab("film")} className={selectedTab == "film" ? selectTabClass : unselectTabClass}>
                        ANIMATION
                    </div>
                    <div onClick={() => handleSelectTab("immersive")} className={selectedTab == "immersive" ? selectTabClass : unselectTabClass}>
                        IMMERSIVE
                    </div>
                    <div onClick={() => handleSelectTab("digital")} className={selectedTab == "digital" ? selectTabClass : unselectTabClass}>
                        DIGITAL
                    </div>
                </section>
                <section className="grid grid-cols-2 gap-5 my-5 items-center">
                    {images[selectedTab]?.map((img, i) => (
                        <span key={i} className="w-full bg-[#000000] relative">
                            <ImgSkeltonLoading isLoading={imgLoading} />

                            {selectedTab != "film" ?
                                <img src={img} className="w-full object-contain" onLoad={() => setImgLoading(false)} /> :
                                <video src={img} className="w-full object-contain" autoPlay loop onLoadStart={() => setImgLoading(false)} />
                            }
                        </span>
                    ))}
                </section>
            </div>
        </>
    )
}

export default PrakriaWorks