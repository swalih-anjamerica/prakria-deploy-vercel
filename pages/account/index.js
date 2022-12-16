import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import AccountDetailScreen from '../../components/client/account/AccountDetailScreen';
import CompanyScreen from '../../components/client/account/CompanyScreen';
import PaymentScreen from '../../components/client/account/PaymentScreen';
import PlanScreen from '../../components/client/account/PlanScreen';
import NotificationSettings from '../../components/client/account/NotificationSettings';
import Loader from '../../components/layouts/Loader';
import { useAuth } from '../../hooks/useAuth';
import accountService from "../../services/account";

function Account({ STRIPE_PUBLIC_KEY, STRIPE_PRIVATE_KEY }) {


    const router = useRouter();
    let { tab } = router.query;
    const [userFetchTime, setUserFetchTime] = useState(null);
    const { role } = useAuth();

    useEffect(() => {
        if (role === "client_admin" || role == "client_member") return;
        if (tab == "account_details" || tab == "notifications") return;
        router.push(router.pathname+"?tab=account_details");
    }, [tab, role]);

    if (!tab) {
        tab = "plan"
    }

    return (
        <>
            <div className={`${role == "designer" || role == "project_manager" ? "bg-primary-white w-full border-y-2 border-primary-grey gap-4" : "bg-primary-white w-full border-y-2 border-primary-grey gap-4"} w-full h-14 pl-6 xl:pl-10 flex justify-between`}>
                {
                    (role === "project_manager" || role === "designer" || role === "creative_director") ?
                        <ul className="flex flex-1 gap-3 xl:gap-12 self-center w-full px-0">
                            <li className="mr-12">
                                <Link href={`/account?tab=account_details`}>
                                    <a className={tab.toUpperCase() === "ACCOUNT_DETAILS" ? role == "designer" || role == "project_manager" ? "active-horizontal-nav-item-textstyle" : "active-horizontal-nav-item-textstyle" : "diabled-horizontal-nav-item-textstyle"}>Profile</a>
                                </Link>
                            </li>
                            <li className="mr-12">
                                <Link href={`/account?tab=notifications`}>
                                    <a className={tab.toUpperCase() === "NOTIFICATIONS" ? role == "designer" || role == "project_manager" ? "active-horizontal-nav-item-textstyle" : "active-horizontal-nav-item-textstyle" : "diabled-horizontal-nav-item-textstyle"}>Notification</a>
                                </Link>
                            </li>
                        </ul>
                        :
                        (role === "client_admin" || role === "client_member") &&
                        <ul className="flex flex-1 gap-3 xl:gap-12 self-center w-full px-0">
                            <li className="mr-12 -ml-1">
                                <Link href={`/account?tab=plan`}>
                                    <a className={tab.toUpperCase() === "PLAN" ? "active-horizontal-nav-item-textstyle" : "diabled-horizontal-nav-item-textstyle"}>Plans</a>
                                </Link>
                            </li>
                            <li className="mr-12">
                                <Link href={`/account?tab=account_details`}>
                                    <a className={tab.toUpperCase() === "ACCOUNT_DETAILS" ? "active-horizontal-nav-item-textstyle" : "diabled-horizontal-nav-item-textstyle"}>Account</a>
                                </Link>
                            </li>
                            <li className="mr-12">
                                <Link href={`/account?tab=company`}>
                                    <a className={tab.toUpperCase() === "COMPANY" ? "active-horizontal-nav-item-textstyle" : "diabled-horizontal-nav-item-textstyle"}>Company</a>
                                </Link>
                            </li>
                            <li className="mr-12">
                                <Link href={`/account?tab=payments`}>
                                    <a className={tab.toUpperCase() === "PAYMENTS" ? "active-horizontal-nav-item-textstyle" : "diabled-horizontal-nav-item-textstyle"}>Payments</a>
                                </Link>
                            </li>
                            <li className="mr-12">
                                <Link href={`/account?tab=notifications`}>
                                    <a className={tab.toUpperCase() === "NOTIFICATIONS" ? "active-horizontal-nav-item-textstyle" : "diabled-horizontal-nav-item-textstyle"}>Notification</a>
                                </Link>
                            </li>
                        </ul>
                }
            </div>


            {

                tab.toUpperCase() === "PLAN" ?
                    <PlanScreen STRIPE_PUBLIC_KEY={STRIPE_PUBLIC_KEY} STRIPE_PRIVATE_KEY={STRIPE_PRIVATE_KEY} />
                    :
                    tab.toUpperCase() === "ACCOUNT_DETAILS" ?
                        <AccountDetailScreen />
                        :
                        tab.toUpperCase() === "COMPANY" ?
                            <CompanyScreen />
                            :
                            tab.toUpperCase() === "PAYMENTS" ?
                                <PaymentScreen />
                                :
                                tab.toUpperCase() === "NOTIFICATIONS" &&
                                <h1><NotificationSettings /></h1>
            }
        </>
    )
}

export default Account


export async function getServerSideProps() {
    try {
        return {
            props: {
                STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
                STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY
            }
        }
    } catch (e) {
        return {
            props: {
                STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
                STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY
            }
        }
    }
}