import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuthLayout } from '../../../hooks/useAuthLayout'
import { createNewPlan } from '../../../services/plans'
import PricingCard from '../cards/PricingCard'
import CreatePlan from '../forms/CreatePlan'

function CreatePlanScreen({ skillList }) {

    // FORM HANDLING STATES 
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [monthlyAmount, setMonthlyAmount] = useState("")
    const [yearlyAmount, setYearlyAmount] = useState("")
    const [quaterlyAmount, setQuaterlyAmount] = useState("")
    const [features, setFeatures] = useState("")
    const [planOneShow, setPlanOneShow] = useState(false)
    const [planTwoShow, setPlanTwoShow] = useState(false)
    const [planThreeShow, setPlanThreeShow] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [storage, setStorage] = useState(1000)
    const [resources, setResources] = useState([])
    const [isProjectMan, setIsProjectMan] = useState(true)
    const [isCreative, setIsCreative] = useState(false)
    const [planCreating, setPlanCreating] = useState(false);
    const router = useRouter();
    const { setHeaderMessage } = useAuthLayout();

    const titleMaxLen = 25
    const amountMaxLim = 1000000000
    const countMaxLim = 10
    const descMaxLen = 70;
    const featureMaxLim = 30


    const createPlanHandler = async (duration)=>{
        try {
            setPlanCreating(true);
            const response = await createNewPlan({
                title,
                description,
                features,
                start_date: startDate,
                end_date: endDate,
                storage,
                duration,
                resources,
                has_creative_director: isCreative,
                has_project_manager: isProjectMan
            })
            if (response.status === 200) {
                toast.success("plan created successfully!");
                router.push("/admin/plan");
            }
        } catch (error) {
            toast.dismiss();
            setPlanCreating(false);
            let response = error.response;
            if (response && response.status == 400) {
                toast.error(response.data.error);
            }
        }
    }

    useEffect(() => {
        setHeaderMessage("Create Plan,");
        return () => {
            setHeaderMessage(null)
        }
    }, [])



    return (
        <>
            <div className="flex flex-row items-center justify-center my-10 2xl:px-10">
                <div className="">
                    <CreatePlan
                        title={title}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        description={description}
                        monthlyAmount={monthlyAmount}
                        setMonthlyAmount={setMonthlyAmount}
                        yearlyAmount={yearlyAmount}
                        setYearlyAmount={setYearlyAmount}
                        quaterlyAmount={quaterlyAmount}
                        setQuaterlyAmount={setQuaterlyAmount}
                        features={features}
                        setFeatures={setFeatures}
                        createPlanHandler={createPlanHandler}
                        planOneShow={planOneShow}
                        planTwoShow={planTwoShow}
                        planThreeShow={planThreeShow}
                        startDate={startDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        setStartDate={setStartDate}
                        storage={storage}
                        setIsCreative={setIsCreative}
                        setIsProjectMan={setIsProjectMan}
                        isCreative={isCreative}
                        isProjectMan={isProjectMan}
                        resources={resources}
                        setResources={setResources}
                        skillList={skillList}
                        titleMaxLen={titleMaxLen}
                        amountMaxLim={amountMaxLim}
                        countMaxLim={countMaxLim}
                        descMaxLen={descMaxLen}
                        featureMaxLim={featureMaxLim}
                        planUpdating={planCreating}
                    /></div>
                <div className="lg:mt-10">
                    <PricingCard
                        title={title}
                        description={description}
                        monthlyAmount={monthlyAmount}
                        yearlyAmount={yearlyAmount}
                        quaterlyAmount={quaterlyAmount}
                        features={features}
                        select={false}
                    /></div>

            </div >
        </>
    )
}

export default CreatePlanScreen