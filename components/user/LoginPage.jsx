import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import ButtonLoader from '../common/ButtonLoader';
import accountService from "../../services/account";
import toast from 'react-hot-toast';
import { BsArrowLeft } from 'react-icons/bs';

function LoginPage() {

    // form states
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [formError, setFormError] = useState("");
    let [loginLoading, setLoginLoading] = useState(false);
    let [showPasswordField, setShowPasswordField] = useState(false);
    let [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
    let [forgotPasswordSending, setForgotPasswordSending] = useState(false);

    // router
    let router = useRouter();

    // auth context
    const { login } = useAuth();

    async function handleLogin(e) {
        e.preventDefault();
        if (!email || !password) {
            return setFormError("fileds could not be empty!");
        }
        setFormError("");
        try {
            setLoginLoading(true);
            let response = await login(email, password);

            // setLoginLoading(false)
            if (response.status === 200) {
                router.push("/dashboard");
            }
        } catch (e) {
            setLoginLoading(false)
            let { response } = e;
            setFormError(response?.data?.error);
        }
    }
    async function handleResetPasswordSendLink(e) {
        e.preventDefault();
        if (!email) return;
        setFormError("");
        try {
            setForgotPasswordSending(true);
            const response = await accountService.forgotPasswordLinkSendService(email);
            setForgotPasswordSending(false);
            toast.success("A reset link send to your mail")
        } catch (e) {
            setForgotPasswordSending(false);
            if (e.response?.status === 400) {
                setFormError(e.response?.data?.error);
            }
        }
    }
    function handleShowPasswordField() {
        setShowPasswordField(prev => !prev);
    }
    return (
        <div className='flex'>
            <div className='flex-1 text-center mt-[50px] md:flex-[3]'>

                <Image src="/assets/logo.svg" width={150} height={75} />

                <h1 className='mt-6 font-bold text-xl text-primary-text-gray'>Hello! Welcome back.</h1>
                <h1 className='mt-2 text-primary-text-gray'>Login to your Account!</h1>

                {
                    showPasswordResetForm ?
                        <div className='flex flex-col gap-3 px-5 mt-10' style={{ alignItems: "center" }}>
                            <div className='login-input flex'>
                                <input type="text" placeholder='email' className='flex-1 outline-none' value={email} onChange={e => setEmail(e.target.value)} />
                                <img className='w-[25px] h-[25px]' src="https://img.icons8.com/external-nawicon-glyph-nawicon/64/000000/external-email-communication-nawicon-glyph-nawicon.png" />
                            </div>
                            {
                                forgotPasswordSending ?
                                    <button className='login-btn' disabled>
                                        <ButtonLoader message={"Sending email"} mesageStyle={{ color: "white", fontWeight: "medium" }} svgStyle={{ color: "black", fill: "white" }} />
                                    </button>
                                    :
                                    <button type="submit" className='login-btn'
                                        onClick={handleResetPasswordSendLink}
                                    >
                                        RESET PASSWORD
                                    </button>
                            }
                            <p style={{ color: "red" }}>{formError}</p>
                            <button className='cursor-pointer flex gap-3 items-center hover:text-primary-blue mt-10' onClick={() => setShowPasswordResetForm(false)} type="button"><BsArrowLeft className='h-4 w-4' /> Go back to login</button>
                        </div>
                        :
                        <form className='flex flex-col gap-3 px-5 mt-10' style={{ alignItems: "center" }} onSubmit={handleLogin}>
                            <div className='login-input flex'>
                                <input type="text" placeholder='email' className='flex-1 outline-none md:w-40' value={email} onChange={e => setEmail(e.target.value)} />
                                <img className='w-[25px] h-[25px]' src="https://img.icons8.com/external-nawicon-glyph-nawicon/64/000000/external-email-communication-nawicon-glyph-nawicon.png" />
                            </div>
                            <div className='login-input flex'>
                                <input type={showPasswordField ? "text" : "password"} placeholder='password' value={password} className='flex-1 outline-none md:w-40' onChange={e => setPassword(e.target.value)} />
                                <img className='w-[25px] h-[25px]' src={showPasswordField ? "https://img.icons8.com/external-gradak-royyan-wijaya/24/000000/external-eye-gradak-interface-gradak-royyan-wijaya-2.png" : "https://img.icons8.com/external-free-is-layf-royyan-wijaya/24/000000/external-eye-revamp-3-free-is-layf-royyan-wijaya-2.png"} onClick={handleShowPasswordField} />
                            </div>
                            <div className='text-right w-full cursor-pointer hover:text-primary-blue'>
                                <Link href={"#"}>
                                    <button onClick={() => setShowPasswordResetForm(true)} type="button">Forgot password?</button>
                                </Link>
                            </div>
                            {
                                loginLoading ?
                                    <button className='login-btn' disabled>
                                        <ButtonLoader message={"logging In.."} mesageStyle={{ color: "white", fontWeight: "medium" }} svgStyle={{ color: "black", fill: "white" }} />
                                    </button>
                                    :
                                    <button type="submit" className='login-btn'>
                                        CONTINUE
                                    </button>
                            }
                            <p style={{ color: "red" }}>{formError}</p>
                            <Link href="/pricing#pricing">
                                <span className='cursor-pointer hover:text-primary-blue mt-10'>Don&apos;t have an account? Sign-up</span>
                            </Link>
                        </form>
                }

            </div>
            <div className='hidden h-[100vh] relative md:block md:flex-[7]'>
                <Image
                    // loader={myLoader}
                    src="https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Picture of the author"
                    layout='fill'
                />
            </div>
        </div>
    )
}

export default LoginPage