import { useRouter } from "next/router";
import User from "../../models/users"
import { useState } from "react";
import accountService from "../../services/account";
import toast from "react-hot-toast";
import AuthToken from "../../models/auth_tokens";

function MemberSignup({ authorized_user, member_details, admin_id }) {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const clientMemberData = JSON.parse(member_details);

    async function handlePasswordAddSubmit(e) {
        e.preventDefault();

        toast.dismiss();
        if (!password) return toast.error("Password required");

        try {
            const response = await accountService.completeClientMemberSignup(admin_id, clientMemberData._id, password, router.query?.jwt);

            if (response.status === 200) {
                toast.success("Account created successfully!");
                router.push("/login");
            }

        } catch (e) {
            console.log(e.response||e);
        }
    }

    if (!authorized_user) {
        return (
            <div>
                <h1 className="text-center font-bold text-xl">🤬️🤬️🤬️🤬️🤬️🤬️🤬️🤬️🤬️ UnAuthorized User 🤬️🤬️🤬️🤬️🤬️🤬️🤬️</h1>
            </div>
        )
    }

    return (
        <div className="h-[100vh] flex items-center justify-center">
            <form onSubmit={handlePasswordAddSubmit}>
                <label className="form-label">Password</label>
                <input type="text" className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="yellow-lg-action-button">Submit</button>
            </form>
        </div>
    )
}

export default MemberSignup;

export async function getServerSideProps(context) {

    const token = context.query?.jwt;
    
    try {

        const tokenVerify = await AuthToken.findOne({ auth_token: token });

        if (!tokenVerify) {
            return {
                props: {
                    authorized_user: false,
                    member_details: null,
                    admin_id: null
                }
            }
        }
        const member = await User.findOne({ _id: tokenVerify?.body.client_member_id, role: "client_member" }, { password: 0 });
        console.log(member);
        return {
            props: {
                authorized_user: true,
                member_details: JSON.stringify(member),
                admin_id: tokenVerify?.body.client_admin_id
            }
        }

    } catch (e) {
        console.log(e);
        return {
            props: {
                authorized_user: false,
                member_details: null,
                admin_id: null
            }
        }
    }
}

MemberSignup.getLayout = function LoginLayout({ children }) {


    return (
        <>
            {
                children
            }
        </>
    )
}