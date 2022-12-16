import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useAuthLayout } from "../../hooks/useAuthLayout";
import { useProtectRouteAuth } from "../../hooks/useRequireAuth";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Loader from "./Loader";
import accountService from "../../services/account";

function AuthLayout({ children }) {
  let { isAuthenticated } = useProtectRouteAuth();

  let authLayout = useAuthLayout();

  const { user } = useAuth();

  async function handleSendEmailVerificationLinkClient() {
    try {
      toast.dismiss();
      toast.loading("sending verification email");
      const response = await accountService.sendClientVerificationEmailService(
        user._id
      );
      toast.dismiss();
      toast.success("Verification email send successfully.");
    } catch (e) {
      toast.dismiss();
    }
  }

  /***** Authentication Loader *****/
  if (!isAuthenticated) {
    return <Loader />;
  }

  return (
    <div className="relative  flex select-none">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden flex-col">
        {/* Unverified warning */}
        {user?.role == "client_admin" && user?.is_verified == false && (
          <div className="w-full h-10 bg-[#D9D9D9] flex items-center font-semibold text-primary-black justify-center">
            <span className="px-3 py-2">
              Your email is not verified yet. Please click{" "}
              <button
                className="hover:opacity-80"
                onClick={handleSendEmailVerificationLinkClient}
              >
                <span className="underline underline-offset-2 text-primary-black font-semibold">
                  here
                </span>
              </button>{" "}
              to verify
            </span>
          </div>
        )}
        <div className="h-screen overflow-y-scroll overflow-placeholder-hidden" id="auth-body">
          {authLayout?.showWelcomeHeader && <Header />}
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
