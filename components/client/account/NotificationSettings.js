import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { clientPreferenceService } from "../../../services/account";

function NotificationSettings() {
  const router = useRouter();
  const { setHeaderMessage } = useAuthLayout();
  const { user, setUserUpdateTime } = useAuth();
  const { settings = {} } = user;
  const { role } = useAuth();
  const { isClient } = useMemo(() => {
    const isClient = (role === "client_admin" || role === "client_member");
    return {
      isClient
    }
  }, [role])

  async function handleClientPreference(key, value) {
    try {
      await clientPreferenceService(key, value);
      setUserUpdateTime(Date.now());
    } catch (e) {
    }
  }
  useEffect(() => {
    setHeaderMessage("Here are your notification settings");
    return () => {
      setHeaderMessage(null);
    }
  }, [])

  return (
    <div className="w-full flex flex-col my-8 gap-5 h-[80%] p-5 xl:p-9">
      <div className="w-full bg-secondry-gray rounded h-24 flex justify-between px-20 items-center">
        <span className="text-xl ">Status</span>
        <div className="w-1/6">
          <span className={settings?.status_notification ? `yellow-lg-action-button` : `gray-lg-action-button`}
            onClick={() => {
              handleClientPreference("status_notification", !settings?.status_notification);
            }}
          >
            {
              settings?.status_notification ? "On" : "Off"
            }
          </span>
        </div>
      </div>
      <div className="w-full bg-secondry-gray rounded h-24 flex justify-between px-20 items-center">
        <span className="text-xl ">Message</span>
        <div className="w-1/6">
          <span className={settings?.chat_notification ? `yellow-lg-action-button` : `gray-lg-action-button`}
            onClick={() => {
              handleClientPreference("chat_notification", !settings?.chat_notification);
            }}
          >
            {
              settings?.chat_notification ? "On" : "Off"
            }
          </span>
        </div>
      </div>
      <div className="w-full bg-secondry-gray rounded h-24 flex justify-between px-20 items-center">
        <span className="text-xl ">E-Mail</span>
        <div className="w-1/6">
          <span className={settings?.email_notification ? `yellow-lg-action-button` : `gray-lg-action-button`}
            onClick={() => {
              handleClientPreference("email_notification", !settings?.email_notification);
            }}>
            {
              settings?.email_notification ? "On" : "Off"
            }
          </span>
        </div>
      </div>
      {
        isClient &&
        <div className="w-full bg-secondry-gray rounded h-24 flex justify-between px-20 items-center">
          <span className="text-xl ">Auto Renewal</span>
          <div className="w-1/6">
            <span className={settings?.auto_renewl ? `yellow-lg-action-button` : `gray-lg-action-button`}
              onClick={() => {
                handleClientPreference("auto_renewl", !settings?.auto_renewl);
              }}
            >
              {
                settings?.auto_renewl ? "On" : "Off"
              }
            </span>
          </div>
        </div>
      }
    </div>
  );
}

export default NotificationSettings;
