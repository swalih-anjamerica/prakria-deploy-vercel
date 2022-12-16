import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ButtonLoader from '../../components/common/ButtonLoader';
import { useAuth } from '../../hooks/useAuth'
import { useAuthLayout } from '../../hooks/useAuthLayout';
import accountService from "../../services/account";

function PasswordReset() {
    const { role, user } = useAuth();
    const [ passwordForm, setPasswordForm ] = useState({
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
    });
    const router = useRouter();
    const [ passwordErr, setPasswordErr ] = useState("");
    const { setHeaderMessage } = useAuthLayout();
    const [ changingPassword, setChangingPassword ] = useState(false);
    const [ sendingForgotLink, setSendingForgotLink ] = useState(false);

    const handlePasswordOnChange = async (e) => {
        setPasswordErr("");
        const targetName = e.target.name;
        setPasswordForm((prev) => ({ ...prev, [ targetName ]: e.target.value }));

    }
    const handleChangePassword = async () => {
        if (!passwordForm.currentPassword)
            return setPasswordErr("Enter current password");
        if (!passwordForm.newPassword) return setPasswordErr("Enter new password");
        if (!passwordForm.newPasswordConfirm)
            return setPasswordErr("Confirm your new password");
        if (passwordForm.newPassword !== passwordForm.newPasswordConfirm)
            return setPasswordErr("confirm password not match");
        try {
            setChangingPassword(true);
            const { currentPassword, newPassword } = passwordForm;
            const response = await accountService.changeUserPasswordService(
                currentPassword,
                newPassword
            );
            setChangingPassword(false);
            toast.success("Password changed successfully.");
            router.push("/account");
            setPasswordForm({});
        } catch (e) {
            setChangingPassword(false);
            if (e?.response?.status === 400) {
                setPasswordErr(e?.response?.data?.error);
            }
        }
    }

    const handleResetPasswordSendLink = async (e) => {
        if (!user.email) return;
        if (sendingForgotLink) return;
        try {
            setSendingForgotLink(true);
            toast.loading("Sending reset link");
            const response = await accountService.forgotPasswordLinkSendService(user.email);
            setSendingForgotLink(false);
            toast.dismiss();
            toast.success("A reset has sent to your email")
        } catch (e) {
            console.log(e);
            setSendingForgotLink(false);
            toast.dismiss()
            toast.error("Please try again later");
        }
    }
    useEffect(() => {
        setHeaderMessage("You can reset your password here");
        return () => {
            setHeaderMessage(null);
        };
    }, []);

    return (
        <div>
            <div className={`${role == "designer" || role == "project_manager" ? "bg-primary-white w-full border-y-2 border-primary-grey gap-4" : "bg-primary-white w-full border-y-2 border-primary-grey gap-4"} w-full h-14 pl-6 xl:pl-10 flex justify-between`}>
                <ul className="flex flex-1 gap-3 xl:gap-12 self-center w-full px-0">
                    <li className="mr-12 -ml-1">
                        <a className={"active-horizontal-nav-item-textstyle"}>Password Reset</a>
                    </li>

                </ul>
            </div>

            <div className="flex flex-col pl-6 xl:pl-10 text-[#414040] text-lg">
                <h1 className=' font-semibold  mt-6'>Reset your password</h1>
                <div className='grid grid-cols-12 gap-4 w-full max-w-[580px] mt-7'>
                    <label className="mt-3 col-span-4">Current</label>
                    <input
                        className="w-full col-span-8  rounded-md h-10 focus:outline-none px-2 bg-[#E1E1E1]"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordOnChange}
                        type="password"
                    />
                    <label className=" mt-3 col-span-4">New</label>
                    <input
                        className="w-full col-span-8  rounded-md h-10 focus:outline-none px-2 bg-[#E1E1E1]"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordOnChange}
                        type="password"
                    />
                    <label className=" mt-3 col-span-4">Re-type New</label>
                    <input
                        className="w-full col-span-8 rounded-md h-10 focus:outline-none px-2 bg-[#E1E1E1]"
                        name="newPasswordConfirm"
                        value={passwordForm.newPasswordConfirm}
                        onChange={handlePasswordOnChange}
                    />
                    <span className="text-red mt-2 text-center col-span-12">{passwordErr}</span>
                </div>

                <div className='flex mt-9 items-center pr-9'>
                    <p className='text-[#3B85F5] flex-1 cursor-pointer' onClick={handleResetPasswordSendLink}>
                        Forgot your password?
                    </p>
                    <button className="w-[200px] text-[#151515] font-semibold rounded-[12px] bg-light-yellow px-3 py-2 my-5 text-lg" onClick={handleChangePassword} disabled={changingPassword}>
                        {
                            changingPassword ?
                                <ButtonLoader />
                                :
                                " Save Changes"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset