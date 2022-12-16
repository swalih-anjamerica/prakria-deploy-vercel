import { useRouter } from 'next/router';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import ButtonLoader from '../../components/common/ButtonLoader';
import AuthToken from '../../models/auth_tokens'
import accountService from "../../services/account";

function ResetPassword({ authorized_user, user_id }) {

    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [reseting, setReseting] = useState(false);
    const router = useRouter();
    const { token } = router.query;
    async function handleResetPassword() {
        try {
            setReseting(true);
            const response = await accountService.forgotPasswordResetService(user_id, password, token);
            toast.success("Password reseted successfully.");
            setReseting(false);
            router.push("/login");
        } catch (e) {
            setReseting(false);
            if (e.response?.status === 400) {
                setFormError(e.response.data.error);
            }
            console.log(e.response || e);
        }
    }
    return (
        < div className='h-[93vh] w-screen bg-white relative pt-10' >
            <img src="/logo.png" className='w-40 ml-10' />
            <div style={{ backgroundImage: `url("/Bg.png")`, backgroundRepeat: "no-repeat" }} className='flex justify-around h-full w-full py-16 bg-white flex-wrap '>
                {
                    !authorized_user ?
                        <div>
                            <h1 className='component-heading'>You are not authorized.</h1>
                        </div>
                        :
                        <div className="w-[500px] md:w-[50%]  max-w-7xl bg-white rounded-2xl shadow-lg pb-5 flex justify-center flex-col">
                            <div className='mx-3'>
                                <div className="flex justify-around">
                                    <div className="flex flex-col">
                                        <label className='text-gray-700 text-base'>Enter you new password</label>
                                        <input id="FirstName" type="text" value={password} onChange={e => setPassword(e.target.value)} className='border border-gray-200 focus:outline-none rounded-md my-2 h-10 w-40 xl:w-80 px-5' />
                                        <span className='text-[#cc0000]'>{formError}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='mx-3'>
                                <div className="flex justify-around ">
                                    <div className="flex flex-col">
                                        {
                                            reseting ?
                                                <button className='bg-primary-cyan px-3 py-2 w-[200px] rounded-md' disabled>
                                                    <ButtonLoader message={"reseting..."} />
                                                </button>
                                                :
                                                <button className='bg-primary-cyan px-3 py-2 w-[200px] rounded-md' onClick={handleResetPassword}>Change Password</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div >
    )
}

export default ResetPassword

ResetPassword.getLayout = function LoginLayout({ children }) {
    return (
        <>
            {
                children
            }
        </>
    )
}

export async function getServerSideProps(context) {

    const token = context.query?.token;

    try {

        const tokenVerify = await AuthToken.findOne({ auth_token: token });
        if (!tokenVerify) {
            return {
                props: {
                    authorized_user: false,
                    user_id: null
                }
            }
        }
        console.log()
        return {
            props: {
                authorized_user: true,
                user_id: tokenVerify.body.id?.toString()
            }
        }

    } catch (e) {
        return {
            props: {
                authorized_user: false,
                user_id: null
            }
        }
    }
}
