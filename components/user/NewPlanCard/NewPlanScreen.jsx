import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useState } from 'react';
import NewPlanCard from './NewPlanCard'

function NewPlanScreen({ plans = [] }) {
    const [durationName, setDurationName] = useState("monthly");
    const [largestDescription, setLargestDescription] = useState(20);
    const [totalResources, setTotalResources]=useState([]);

    const selectTabStyle = "bg-[#00D8DA] py-4 uppercase px-10";
    const notSelectTabStyle = "py-4 uppercase px-10 border-[1px] border-[#00D8DA] text-white";

    const router = useRouter();
    function handleGotoSignup(plan, stripePriceId, planAmount) {
        if (!sessionStorage) return;
        const planLocalStorageData = {
            title: plan.title,
            planAmount: planAmount,
            planStripePriceId: stripePriceId,
            planid: plan._id,
            duration_name: durationName,
            description: plan.description
        };
        sessionStorage.setItem("plan", JSON.stringify(planLocalStorageData));
        router.push("/signup");
    }

    useEffect(() => {
        if (!plans) return;
        const benefites=plans.reduce((prev, curr) => {
            let skills=curr.skills.filter(skill=>!prev.find(item=>item.skill_name?.toLowerCase()==skill?.skill_name?.toLowerCase()));
            return [...prev, ...skills];
        }, [])
        setTotalResources(benefites);
    }, [plans])

    return (
        <div className='mt-3 w-[90%] mx-auto mb-16' id="pricing">

            {/* titles */}
            <div className='bg-[#050F3D]   flex flex-col pt-10 rounded-md items-center'>
                <h1 className='text-[#FFF300] font-[700] text-[20px] md:text-[25px] lg:text-[30px] xl:text-[40px] 2xl:text-[50px]'>Affordable Price Plans That Help You Save</h1>
                <div className='flex mt-5 cursor-pointer font-[600]'>
                    <div className={durationName == "monthly" ? selectTabStyle : notSelectTabStyle} onClick={() => {
                        setDurationName("monthly");
                    }}>
                        Monthly
                    </div>
                    <div className={durationName == "quarterly" ? selectTabStyle : notSelectTabStyle} onClick={() => {
                        setDurationName("quarterly")
                    }}>
                        quaterly
                    </div>
                    <div className={durationName == "yearly" ? selectTabStyle : notSelectTabStyle} onClick={() => {
                        setDurationName("yearly");
                    }}>
                        yearly
                    </div>
                </div>
            </div>

            {/* pricing card */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5'>
                {
                    plans.map((plan, index) => {
                        return <NewPlanCard index={index} key={plan._id} plan={plan} durationName={durationName} handleGotoSignup={handleGotoSignup} setLargestDescription={setLargestDescription} largestDescription={largestDescription} totalResources={totalResources} />
                    })
                }
            </div>
        </div>
    )
}

export default NewPlanScreen