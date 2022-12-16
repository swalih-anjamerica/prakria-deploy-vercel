import React, { useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth';
import { useAuthLayout } from '../../../hooks/useAuthLayout';
import { listAllPlans } from '../../../services/plans'
import PaymentCardClient from '../../client/account/PaymentCardClient'
import PricingCard from '../cards/ShowPriceCard'

function ShowPlanScreen({ plans }) {

  const { user } = useAuth();
  const {setHeaderMessage} = useAuthLayout();

  useEffect(()=>{
    setHeaderMessage(`Welcome ${user?.first_name?.split(" ")[0]},`);
    return () => {
      setHeaderMessage(null)
    }
  },[])

  return (
    <>
      <div className='p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4 grid-flow-row'>
        {
          plans.map((plan) => {
            return <PricingCard key={plan._id} plan={plan} />
          })
        }
      </div>
    </>
  )
}

export default ShowPlanScreen