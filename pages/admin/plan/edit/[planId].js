import CreatePlanScreen from "../../../../components/admin/screens/CreatePlanScreen";
import EditPlanScreen from "../../../../components/admin/screens/EditPlanScreen";
import { listDuration } from "../../../../controllers/admin/duration";
import { listPlan} from "../../../../controllers/admin/plans";
import { showSkills } from "../../../../controllers/superadmin/skills";

export default function editPlanScreen({  skillData,selectedPlan }) {

    return (
        <>
        <EditPlanScreen  selectedPlan={selectedPlan} skillList={JSON.parse(skillData)}/> 
            {/* <CreatePlanScreen  /> */}
        </>
    )


}



export async function getServerSideProps(context) {
    try {
        const planId = context.query.planId

        let query = {
            planId
        }

       
        const { payload: skillRespone } = await showSkills({}, {})
        // const planResponse = await Plans.findOne({ _id: planId }) 
        const { payload: planResponse } = await listPlan({ query }, {})

  
        const skillData = JSON.stringify(skillRespone)
        const selectedPlan = JSON.stringify(planResponse)
        return {
            props: {
            
                skillData: skillData,
                selectedPlan: selectedPlan

            }, // will be passed to the page component as props
        }
    } catch (e) {
        return {
            props: {
                durationData: [],
                skillData: []
            }
        }
    }
}