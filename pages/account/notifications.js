import React, { useEffect, useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useRouter } from "next/router";
import { readNotificationService } from "../../services/notifications";
import utils from "../../helpers/utils";
import { useAuthLayout } from "../../hooks/useAuthLayout";


export default function Notifications() {
    const { showUnReadMessage, setShowUnReadMessage, notifications = [], listNotifications } = useNotifications();
    const router = useRouter();
    const {setShowWelcomeHeader}=useAuthLayout();

    useEffect(()=>{
      setShowWelcomeHeader(false);

      return ()=>{
        setShowWelcomeHeader(true);
      }
    }, [])
    async function handleReadMessage(notification) {
      if (!notification.is_read) {
        try {
          await readNotificationService(notification._id);
          await listNotifications();
        } catch (e) {
          console.log(e.response || e);
        }
      }
      if (notification.path) {
        router.push(notification.path);
        // setShowNotification(false);
      }
    }
  return (
    <div>
      <div className="bg-primary-white w-full border-b-2 border-primary-grey gap-4 h-14 px-10 flex justify-between border-y-2 border-primary-grey">
        <ul className="flex flex-1  self-center w-full">
          <li className="mr-12 ">
            <a
              className={
                !showUnReadMessage ? "active-horizontal-nav-item-textstyle" : ""
              }
              onClick={(e) => setShowUnReadMessage(false)}
              style={{ cursor: "pointer" }}
            >
              All
            </a>
          </li>
          <li className="mr-12 ">
            <a
              className={
                showUnReadMessage ? "active-horizontal-nav-item-textstyle" : ""
              }
              onClick={(e) => setShowUnReadMessage(true)}
              style={{ cursor: "pointer" }}
            >
              Unread
            </a>
          </li>
        </ul>
      </div>
      <div className="p-4 mb-2">
        
        {
        notifications?.length<1?
        <h1 className="component-heading">No new notifications</h1>
        :
        notifications.map((item) => {
          return (
            <div
              className="flex flex-row gap-2 mt-4 cursor-pointer"
              key={item._id}
              onClick={() => {
                handleReadMessage(item);
              }}
            >
              <div className="text-2xl font-semibold flex rounded-full w-10 h-10 m-2 bg-secondary-gray text-primary-white justify-center items-center uppercase">
                P
              </div>
              <div className="flex flex-col flex-1">
                <div className="font-semibold text-[#414040] text-sm self-start">
                  Prakria
                </div>
                <div className="text-sm font-thin text-left">
                  {item.message}
                </div>
                <div className="text-primary-blue text-sm mt-2 self-start">
                  {utils.notificationTime(item.created_at)}
                </div>
              </div>
              <div>
                {!item.is_read && (
                  <div className="rounded-full bg-primary-blue w-0.5 h-0.5 p-2 mt-4"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
