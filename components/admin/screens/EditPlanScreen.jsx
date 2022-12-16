import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { dateFormatter } from '../../../helpers/dateHelpers'

import { updatePlan } from '../../../services/plans'
import PricingCard from '../cards/PricingCard'
import CreatePlan from '../forms/CreatePlan'

function findSkillName(id, skillList) {

    const skill = skillList.find((skill) => skill._id === id)
    return skill?.skill_name

}

function EditPlanScreen({ durationList, skillList, selectedPlan }) {
    const plan = JSON.parse(selectedPlan)
    const router = useRouter();
    const { planId } = router.query
    const initialResources = plan.resources.map((skill) => {
        return ({
            name: findSkillName(skill.skill_id, skillList),
            skill_id: skill.skill_id,
            count: skill.count
        })

    })
    const { amount: initialMonthAmount, stripe_price_id: monthStripePriceId } = plan.duration.find(v => v.duration_name === 'monthly')
    const { amount: initialQuaterlyAmount, stripe_price_id: quarterlyStripePriceId } = plan.duration.find(v => v.duration_name === 'quarterly')
    const { amount: initialYearlyAmount, stripe_price_id: yearlyStripePriceId } = plan.duration.find(v => v.duration_name === 'yearly')

    const [title, setTitle] = useState(plan.title)
    const [description, setDescription] = useState(plan.description)
    const [monthlyAmount, setMonthlyAmount] = useState(initialMonthAmount)
    const [yearlyAmount, setYearlyAmount] = useState(initialYearlyAmount)
    const [quaterlyAmount, setQuaterlyAmount] = useState(initialQuaterlyAmount)
    const [features, setFeatures] = useState(plan.features)
    const [startDate, setStartDate] = useState(plan.start_date)
    const [endDate, setEndDate] = useState(plan.end_date)
    const [storage, setStorage] = useState(1000)
    const [resources, setResources] = useState(initialResources)
    const [isProjectMan, setIsProjectMan] = useState(plan.has_project_manager)
    const [isCreative, setIsCreative] = useState(plan.has_creative_director)
    const [planUpdating, setPlanUpdating] = useState(false);

    const titleMaxLen = 25
    const amountMaxLim = 1000000000
    const countMaxLim = 10
    const descMaxLen = 70;
    const featureMaxLim = 30

    const createPlanHandler = async (duration) => {
        try {
            setPlanUpdating(true);
            const response = await updatePlan({
                title,
                description,
                features,
                start_date: startDate,
                end_date: endDate,
                storage,
                resources,
                has_creative_director: isCreative,
                has_project_manager: isProjectMan,
                monthlyAmount: parseInt(monthlyAmount),
                quaterlyAmount: parseInt(quaterlyAmount),
                yearlyAmount: parseInt(yearlyAmount)
            }, planId)
            toast.success("plan Updated successfully!");
            router.push("/admin/plan");
            setPlanUpdating(false);
        } catch (error) {
            setPlanUpdating(false);
        }
    }

    return (
        <>

            <div className="flex flex-col items-center justify-center xl:flex-row lg:items-stretch">
                <CreatePlan
                    durationList={durationList}
                    monthStripePriceId={monthStripePriceId}
                    quarterlyStripePriceId={quarterlyStripePriceId}
                    yearlyStripePriceId={yearlyStripePriceId}
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

                    editStartDate={plan.start_date}
                    editEndDate={plan.end_date}
                    planUpdating={planUpdating}
                />
                <PricingCard
                    title={title}
                    description={description}
                    monthlyAmount={monthlyAmount}
                    yearlyAmount={yearlyAmount}
                    quaterlyAmount={quaterlyAmount}
                    features={features}
                />
            </div>
        </>
    )
}

export default EditPlanScreen