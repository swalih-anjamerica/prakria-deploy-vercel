import { triggerNotificationServer } from "../../helpers/notificationHelper";
import planService from "../services/plan.services";

const moneyNotDebitNotify=async(params)=>{
    const {plan_id, user_id}=params;
    const plan=await planService.listPlan({planId:plan_id});
    const message=`We did't debit any money from your account for ${plan.title} subscription. You had pending balance amount in previous canceled plan.`;
    await triggerNotificationServer(user_id, message);
}


const planNotifications={
    moneyNotDebitNotify
}

export default planNotifications;