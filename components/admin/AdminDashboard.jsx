import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { useAuthLayout } from '../../hooks/useAuthLayout'
import AdminScreen from './screens/ShowPlanScreen'

function AdminDashboard() {
  const { user } = useAuth();
  const {setHeaderMessage} = useAuthLayout();

  useEffect(()=>{
    setHeaderMessage(`Welcome ${user?.first_name?.split(" ")[0]},`);
    return () => {
      setHeaderMessage(null)
    }
  },[])


  return (
    <div>
    </div>
  )
}

export default AdminDashboard