import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "react-query";
import ShowPriceCard from "../../components/admin/cards/ShowPriceCard";
import plans from "../../models/plans";
import { listUpgradePlansService } from "../../services/plans";
import Loader from "../../components/layouts/Loader";


export default function PlanAddEdit({ plans, STRIPE_PUBLIC_KEY, STRIPE_PRIVATE_KEY }) {

    const exisingPlan = JSON.parse(plans)
    const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    const { data: planResponse, isLoading } = useQuery("client-update-plans", () => {
        return listUpgradePlansService()
    })
    if (isLoading) {
        return <Loader />
    }
    return (
        <div className="flex-1 min-h-screen ">
            <div className="bg-[#3B85F5] w-full h-14 px-3 flex">
                <ul className="flex flex-1 self-center w-full px-9">
                    <li className="mr-12 ">
                        <a className="active-horizontal-nav-item-textstyle">
                            Plans
                        </a>
                    </li>
                </ul>
            </div>

            <div className="p-10">
                <div className="mx-5 text-2xl mb-5"><span>Select a plan</span></div>
                <div className="flex flex-wrap ">
                    {planResponse?.data?.map((plan, index) => {
                        return (
                            <Elements stripe={stripePromise} key={index}>
                                <ShowPriceCard
                                    plan={plan}
                                    client={true}
                                    STRIPE_PUBLIC_KEY={STRIPE_PUBLIC_KEY}
                                />
                            </Elements>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}



export async function getServerSideProps() {
    try {
        const planDetails = await plans.find({ active: true });
        return {
            props: {
                plans: JSON.stringify(planDetails),
                STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
                STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY
            }
        }
    } catch (e) {
        return {
            props: {
                plans: [],
                STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
                STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY
            }
        }
    }
}