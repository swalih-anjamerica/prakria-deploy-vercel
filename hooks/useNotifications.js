import React, { createContext, useEffect, useMemo, useState } from "react";
import { listNotificationService, readAllNotificationService, seenAllNotificationService } from "../services/notifications";
import { useAuth } from "./useAuth";
import { useLibraries } from "./useLibraries";

const NotificationContext = createContext();

// provider
export const NotificationContextProvider = ({ children }) => {
    let values = GetCommonContextValues();

    return (
        <NotificationContext.Provider value={values}>
            {
                children
            }
        </NotificationContext.Provider>
    )
}

// consumer
export const useNotifications = () => {
    return React.useContext(NotificationContext);
}

function GetCommonContextValues() {
    const [notifications, setNotifications] = useState([]);
    const [unreadLength, setUnReadLength] = useState(0);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [moreNotficationLoading, setMoreNotificationLoading] = useState(false);
    const [hasUser, setHasUser] = useState(false);
    const [showUnReadMessage, setShowUnReadMessage] = useState(false);
    const [totalCount, setTotalCount] = useState(null);
    const [page, setPage] = useState(1);
    const { user } = useAuth();
    const { pusher } = useLibraries();
    const notLimit = 10;

    const hasMore = useMemo(() => {
        if (notifications.length < totalCount) {
            return true;
        } else {
            return false;
        }
    }, [notifications, totalCount])

    const listNotifications = async (reloading = true) => {
        let type;
        if (showUnReadMessage) {
            type = "un_read";
        }
        else type = "";

        try {
            setNotificationsLoading(true);
            const body = { type, page };
            const response = await listNotificationService(body);
            setNotificationsLoading(false);
            if (response.status !== 200) return;
            const { notifications: notificationData, count, total } = response.data;
            if (reloading) {
                setNotifications(notificationData);
            }
            else {
                setNotifications(prev => [...prev, ...notificationData]);
            }
            setTotalCount(total)
            setUnReadLength(count);
            setMoreNotificationLoading(false);
        } catch (e) {
            setNotificationsLoading(false);
        }
    }

    const readAllNotifications = async () => {
        try {
            await readAllNotificationService();
            listNotifications();
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleNotificationPagination = () => {
        if (!hasMore) return;
        setMoreNotificationLoading(true);
        setPage(prev => prev += 1);
    }

    const seenAllNotifications = async () => {
        try {
            await seenAllNotificationService();
            listNotifications();
        } catch (e) {
            console.log(e.message);
        }
    }

    const initNotificationPusher = async () => {
        let notificationChannel;
        try {
            notificationChannel = pusher.subscribe(user._id);
            notificationChannel.bind("common-notifications", (data) => {
                listNotifications(true);
                if (data.receiver != user._id) return;
                let audio = document.createElement("audio");
                audio.src = "/assets/notification-audio.mp3";
                audio.play();
            });
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (!user) {
            return setHasUser(false);
        }
        setHasUser(true);
    }, [user])


    useEffect(() => {
        if (!hasUser) {
            return;
        }
        initNotificationPusher();
    }, [hasUser])

    useEffect(() => {
        if (!user) return;
        if (page === 1) listNotifications();
        else listNotifications(false);
    }, [showUnReadMessage, user, page])


    // useEffect(()=>{
    //     listNotifications(false);
    // }, [page])


    const handleShowUnReadMessage = (value) => {
        setPage(1);
        setShowUnReadMessage(value);
    }

    return {
        unreadLength,
        notifications,
        showUnReadMessage,
        notificationsLoading,
        hasMore,
        moreNotficationLoading,
        setShowUnReadMessage: handleShowUnReadMessage,
        listNotifications,
        readAllNotifications,
        seenAllNotifications,
        handleNotificationPagination
    }
}