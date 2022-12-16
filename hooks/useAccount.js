import { useContext, createContext, useState, useEffect } from "react";
import { listClientActivePlan } from "../services/plans";
import accountService from "../services/account";
import { useAuth } from "./useAuth";


const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const values = getAccountValues();
    return (
        <AccountContext.Provider value={values}>
            {
                children
            }
        </AccountContext.Provider>
    )
}

export const useAccount = () => {
    return useContext(AccountContext);
}

function getAccountValues() {
    const [planUpdateTime, setPlanUpdateTime] = useState(null);
    const [planLoading, setPlanLoading]=useState(false);
    const [activePlan, setActivePlan] = useState(null);
    const [accountDetails, setAccountDetails] = useState(null);
    const [accountUpdateTime, setAccountUpdateTime] = useState(null);
    const [accountLoading, setAccountLoading]=useState(false);
    const {user, role}=useAuth();
    useEffect(async () => {
        if(role!=="client_admin"&&role!=="client_member"){
            return;
        }
        try {
            setPlanLoading(true);
            const response = await listClientActivePlan();
            setPlanLoading(false);
            setActivePlan(response.data);
        } catch (e) {
            setPlanLoading(false);
            console.log(e.message);
        }
    }, [planUpdateTime, role])
    useEffect(async () => {
        try {
            setAccountLoading(true);
            const response = await accountService.getUserAccountDetails();
            setAccountLoading(false);
            setAccountDetails(response.data);
        } catch (e) {
            setAccountLoading(false);
            console.log(e.message);
        }
    }, [accountUpdateTime, user])

    return {
        activePlan,
        accountDetails,
        planLoading,
        accountLoading,
        setPlanUpdateTime
    }
}