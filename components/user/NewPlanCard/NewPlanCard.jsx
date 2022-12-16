import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import { LockIconPlan } from '../../../helpers/svgHelper';

function NewPlanCard({ plan = {}, durationName, handleGotoSignup, setLargestDescription, largestDescription, index, totalResources }) {
    const [amount, setAmount] = useState(0);
    const [stripePriceId, setStripePriceId] = useState(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
        const duration = plan.duration?.find(item => item.duration_name === durationName) || {};
        setAmount(duration.amount);
        setStripePriceId(duration.stripe_price_id);
    }, [durationName]);

    useEffect(() => {
        handleCheckDescriptionLength();
        // window.addEventListener("resize", handleCheckDescriptionLength)
    }, [])

    function handleCheckDescriptionLength() {
        let height = descriptionRef.current.clientHeight;
        if (height > largestDescription) {
            setLargestDescription(height);
        }
    }
    function handleSignupGo() {
        handleGotoSignup(plan, stripePriceId, amount)
    }
    return (
        <div className={`${index == 1 ? 'bg-[#FFF300]' : ''} relative rounded-md pt-16 text-[1vw] px-1 ${index === 1 ? ' pb-1' : ''}`}>
            {
                index === 1 && <div className='absolute top-4 w-full text-center text-[#000] font-semibold text-[20px] xl:text-[25px]'>
                    <h1>Most Popular</h1>
                </div>
            }
            <div className='bg-[#EEEEEE] rounded-md p-5 text-[1vw] h-full'>
                <h1 className='font-[600] text-[20px] xl:text-[25px] mt-2 uppercase'>{plan.title}</h1>
                <p className='mt-3 text-[14px] xl:text-[20px] opacity-50' ref={descriptionRef} style={{ minHeight: largestDescription + "px" }}>
                    {plan.description}
                </p>
                <h1 className='text-[30px] xl:text-[40px] font-[600] mt-2'>£{amount} <span className='font-[500] md:text-[14px] lg:text-[16px] 2xl:text-[20px]'>/month</span></h1>

                {/* choose button */}
                <div className='mt-5 bg-[#FFF300] px-6 xl:px-10 py-5 uppercase text-center font-[600] text-[14px] lg:text-[1vw] cursor-pointer' onClick={handleSignupGo}>
                    Choose {plan.title}
                </div>

                <div className='bg-[#C4C4C4] h-[1px] mt-5'></div>

                <p className='mt-8 font-[600] mb-1'>What you get with {plan.title}:</p>
                {
                    plan?.features?.map((feat, index) => {
                        return (
                            <div className='mt-1 flex items-center gap-1' key={index}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#18e618]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <p>
                                    {feat}
                                </p>
                            </div>
                        )
                    })
                }
                {/* {
                    plan?.features?.filter(item => !plan?.features?.includes(item)).map((feat, index) => {
                        let isIn = plan.features.find(item => item.toLowerCase() == feat.toLowerCase());

                        return (
                            <div className='mt-1 flex items-center gap-1 text-[#A4A4A4]' key={index}>
                                <LockIconPlan width={25}/>
                                <p>
                                    {feat}
                                </p>
                            </div>
                        )
                    })
                } */}
                {
                    totalResources.
                        filter(resource => plan.skills.find(item => item.skill_name.toLowerCase() === resource.skill_name.toLowerCase())).
                        map((resource, index) => {
                            return (
                                <div className='mt-1 flex items-center gap-1' key={index}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#18e618]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p>
                                        Dedicated <span className='capitalize'>{resource.skill_name}</span>
                                    </p>
                                </div>
                            )
                        })
                }
                {
                    totalResources.
                        filter(resource => !plan.skills.find(item => item.skill_name.toLowerCase() === resource.skill_name.toLowerCase())).
                        filter(resource => !plan?.features?.find(item => item.toLowerCase() === "dedicated " + resource.skill_name.toLowerCase())).
                        map((resource, index) => {
                            return (
                                <div className='mt-1 flex items-center gap-1 text-[#A4A4A4]' key={index}>
                                    <LockIconPlan width={25} />
                                    <p>
                                        Dedicated <span className='capitalize'>{resource.skill_name}</span>
                                    </p>
                                </div>
                            )
                        })
                }
                {/* {
                    totalResources.map((resource, index) => {
                        const isAlreadyThere = plan?.features?.find(item => item.toLowerCase() === "dedicated " + resource.skill_name.toLowerCase())
                        const isInPlan = plan.skills.find(item => item.skill_name.toLowerCase() === resource.skill_name.toLowerCase())

                        if (isAlreadyThere) return null;
                        if (isInPlan) {
                            return (
                                <div className='mt-1 flex items-center gap-1' key={index}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#18e618]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p>
                                        Dedicated <span className='capitalize'>{isInPlan.skill_name}</span>
                                    </p>
                                </div>
                            )
                        }
                        return (
                            <div className='mt-1 flex items-center gap-1 text-[#A4A4A4]' key={index}>
                                <LockIconPlan width={25} />
                                <p>
                                    Dedicated <span className='capitalize'>{resource.skill_name}</span>
                                </p>
                            </div>
                        )
                    })
                } */}
            </div>
        </div>
    )
}

export default NewPlanCard