import React from 'react'
import CreatePlanScreen from '../../../components/admin/screens/CreatePlanScreen.jsx'
import { listDuration } from '../../../controllers/admin/duration.js'
import { showSkills } from '../../../controllers/superadmin/skills.js'



function createPlan({ skillData }) {
  return (
    <>
      <CreatePlanScreen  skillList={JSON.parse(skillData)} />
    </>
  )
}

export default createPlan

export async function getServerSideProps(context) {
  try {

    const { payload: skillRespone } = await showSkills({}, {})
    const skillData = JSON.stringify(skillRespone)

    return {
      props: {
        skillData: skillData

      }, // will be passed to the page component as props
    }
  } catch (e) {
    return {
      props: {
        skillData: []
      }
    }
  }
}