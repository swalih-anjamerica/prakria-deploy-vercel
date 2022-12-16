import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { IoMdSettings } from "react-icons/io";
import Link from "next/link";
import { useNotifications } from "../../hooks/useNotifications";
import { useRouter } from "next/router";
import { readNotificationService } from "../../services/notifications";
import utils from "../../helpers/utils";
import ButtonLoader from "./ButtonLoader";

export default function NotificationModal({ setShowNotification }) {
  const [showMore, setShowMore] = useState(false);
  const {
    showUnReadMessage,
    setShowUnReadMessage,
    notifications = [],
    listNotifications,
    seenAllNotifications,
    hasMore: hasMoreNotification,
    handleNotificationPagination,
    moreNotficationLoading
  } = useNotifications();
  const router = useRouter();
  async function handleReadMessage(notification) {
    if (!notification.is_read) {
      try {
        await readNotificationService(notification._id);
        await listNotifications();
      } catch (e) {
      }
    }
    if (notification.path) {
      // router.push(notification.path);
      // setShowNotification(false);
      location.href = notification.path;
    }
  }


  useEffect( () => {
    seenAllNotifications();
  }, [])

  useEffect(() => {
    const body = document.getElementById("auth-body");
    body.style.overflowY = "hidden";
    return ()=>{
      body.style.overflowY="scroll";
    }
  }, [])

  return (
    <>
      <div id="notification-modal-body" className="w-full h-full fixed left-[-9px] top-0"></div>
      <div className="relative w-[35vw] min-w-[22rem] overflow-hidden xl:w-[23.5rem] h-full shadow-xl bg-white rounded-lg" id="notification-modal" >
        <div className="flex justify-between px-4 pt-4">
          <div className="text-primary-black text-xl xl:text-2xl">Notifications</div>
          <button onClick={() => setShowMore(!showMore)}>
            <div>
              <BsThreeDots className="w-10 h-10 text-primary-black" />
            </div>
          </button>
          {showMore && (
            <div className="absolute right-[0%] mr-10 top-[10%] z-10">
              <NotificationMore setShowNotification={setShowNotification} />
            </div>
          )}
        </div>
        <div className="bg-primary-white w-full border-b-2 border-primary-grey gap-4 h-12 px-10 flex justify-between">
          <ul className="flex flex-1  self-center w-full text-sm xl:text-base">
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
        <div className="p-4 mb-2 min-h-[300px] max-h-[60vh] overflow-auto notification-body h-full">
          {/* <div className="text-primary-black text-xl text-left">New</div> */}
          {
            !notifications[0] ?
              <div className="flex items-center flex-col h-full">
                <h1>No notifications found</h1>
              </div>
              :
              notifications?.map((item, index) => {
                const notfColr = item.is_read ? "text-gray-400" : "text-[#414040]";
                return (
                  <div
                    className={"flex flex-row w-full gap-2 mt-4 cursor-pointer relative"}
                    key={item._id}
                    onClick={() => {
                      handleReadMessage(item);
                    }}
                  >
                    <div className="text-xl xl:text-2xl flex rounded-full w-10 h-8 xl:h-10 m-2 text-primary-white justify-center items-center uppercase">
                      <img src="/prakria-logo-2.png" alt="" />
                    </div>
                    <div className="flex flex-col w-[80%]">
                      <div className={"text-sm font-semibold self-start " + notfColr}>
                        PRAKRIA DIRECT
                      </div>
                      <div className="w-full">
                        <p className={"w-full text-sm font-thin text-left whitespace-normal break-words " + notfColr}>{item.message}</p>
                      </div>
                      <div className={`${item.is_read ? "text-gray-400" : "text-primary-blue"} text-sm mt-2 self-start`}>
                        {utils.notificationTime(item.created_at)}
                      </div>
                    </div>
                    <div className="absolute right-0 top-[-12px]">
                      {!item.is_read && (
                        <div className="rounded-full bg-primary-blue w-0.5 h-0.5 p-2 mt-4"></div>
                      )}
                    </div>
                  </div>
                );
              })}
          {
            moreNotficationLoading ?
              <div className="items-center  ">
                <button disabled>
                  <div className="text-primary-blue text-sm mt-2 self-start cursor-pointer">
                    <ButtonLoader />
                  </div>
                </button>
              </div>
              :
              hasMoreNotification && (
                <div className="items-center  ">
                  <button onClick={handleNotificationPagination}>
                    <p className="text-primary-blue text-sm mt-2 self-start cursor-pointer">
                      Show More...
                    </p>
                  </button>
                </div>
              )}
        </div>
      </div>
    </>
  );
}

const NotificationMore = ({ setShowNotification }) => {
  const router = useRouter();
  const { readAllNotifications } = useNotifications();
  function handleReadAllNotifications() {
    readAllNotifications();
    setShowNotification(false);
  }
  return (
    <div className="w-80 h-[5%] py-2 flex flex-col items-start gap-1 bg-primary-white rounded-lg shadow-xl">
      <div className="p-1 mx-2 flex flex-1 flex-row gap-1 rounded-lg hover:bg-[#E1E1E1] w-[96%]">
        {/* <Link href="#"> */}
        <button className="flex flex-1 items-center gap-2" onClick={handleReadAllNotifications}>
          <div>
            <TiTick className="w-4 h-4 text-primary-black" />
          </div>
          <div className="text-sm" >Mark all as read</div>
        </button>
        {/* </Link> */}
      </div>
      <div className="p-1 mx-2 flex flex-row gap-2 rounded-lg hover:bg-[#E1E1E1] w-[96%]">
        <button
          className="flex flex-1 items-center gap-2"
          onClick={() => {
            router.push("/account?tab=notifications");
            setShowNotification(false);
          }}
        >
          <div>
            <IoMdSettings className="w-4 h-4 text-primary-black" />
          </div>
          <div className="text-sm">Notification settings</div>
        </button>
      </div>
    </div>
  );
};
