import React from 'react'
import ShowPlanScreen from '../../../components/admin/screens/ShowPlanScreen'
import Plans from "../../../models/plans";



function plan({plans}) {

  const allPlans=JSON.parse(plans);

  return (
    <>
    <ShowPlanScreen plans={allPlans}/>
    </>
  )
}

export default plan


export async function getServerSideProps(context){
  try{

    const plans=await Plans.find({});

   

    return {
      props:{
        plans:JSON.stringify(plans)
      }
    }

  }catch(e){
    return {
      props:{
        plans:JSON.stringify([])
      }
    }
  }
}