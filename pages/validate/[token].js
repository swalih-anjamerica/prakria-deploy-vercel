import { useRouter } from 'next/router';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import ButtonLoader from '../../components/common/ButtonLoader';
import AuthToken from '../../models/auth_tokens';
import accountService from "../../services/account";

function EmaiilTokenValidate({ authorized_user }) {

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { token } = router.query;
    async function handleEmailValidate() {
        if (!token) return;
        try {
            setLoading(true);
            const response = await accountService.verifyClientEmailService(token);
            toast.success("Your email verified successfully.");
            setTimeout(() => {
                router.push("/dashboard");
                setLoading(false);
            }, 700);
        } catch (e) {
            setLoading(false);
        }
    }

    return (
        < div className='h-[93vh] w-screen bg-white relative pt-10' >
            <img src="/logo.png" className='w-40 ml-10' />
            <div style={{ backgroundImage: `url("/Bg.png")`, backgroundRepeat: "no-repeat" }} className='flex justify-center items-center h-full w-full py-16 bg-white flex-wrap '>
                {
                    !authorized_user ?
                        <div>
                            <h1 className='component-heading'>You are not authorized.</h1>
                        </div>
                        :
                        <div className='flex justify-center items-center'>
                            <button className='yellow-lg-action-button' onClick={handleEmailValidate} disabled={loading}>
                                {
                                    loading ?
                                        <ButtonLoader message={"Validating account..."}/>
                                        :
                                        "Validate Your Account"
                                }
                            </button>
                        </div>
                }
            </div>
        </div >
    )
}

export default EmaiilTokenValidate

export async function getServerSideProps(context) {

    const token = context.query?.token;

    try {

        const tokenVerify = await AuthToken.findOne({ auth_token: token });

        if (!tokenVerify) {
            return {
                props: {
                    authorized_user: false,
                }
            }
        }


        return {
            props: {
                authorized_user: true
            }
        }

    } catch (e) {
        return {
            props: {
                authorized_user: false,
            }
        }
    }
}

EmaiilTokenValidate.getLayout = function LoginLayout({ children }) {


    return (
        <>
            {
                children
            }
        </>
    )
}