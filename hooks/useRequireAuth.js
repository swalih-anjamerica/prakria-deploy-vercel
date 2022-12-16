import { useRouter } from "next/router";
import react, { useEffect, useState } from "react";
import Loader from "../components/layouts/Loader";
import { useAuth } from "./useAuth";


// hooks
export const useProtectRouteAuth = () => {
    let auth = useAuth();
    let router = useRouter();
    let [pathName, setPathName] = useState(null);
    useEffect(() => {
        setPathName(router.pathname);
        if (["/", "/login"].includes(router.pathname)) {
            return;
        }
        if (!localStorage) return;
        setTimeout(auth?.checkLogedIn, 700)
    }, [router.pathname])

    if (auth?.isAuthenticated === false && !["/", "/login", "/signup", "/pricing"].includes(router.pathname)) {
        return router.push("/login");
    }


    if (pathName && auth?.role && pathName?.startsWith("/super-admin") && auth?.role !== "super_admin") {
        return router.push("/404");
    }

    if (pathName && auth?.role && pathName?.startsWith("/admin") && auth?.role !== "admin") {
        return router.push("/404")
    }

    // role based routes

    return auth;
}


export const useAuthPageHook = () => {
    let auth = useAuth();
    let [loading, setLoading] = useState(true);
    let router = useRouter();

    useEffect(() => {
        if (!localStorage) return;
        auth?.checkLogedIn();
    }, [router.pathname])

    useEffect(() => {
        return () => setLoading(true);
    }, [])

    useEffect(() => {
        if (auth?.isAuthenticated == false) {
            setLoading(false);
        }
    }, [auth?.isAuthenticated])

    auth.loading = loading;

    if (auth?.isAuthenticated) {
        router.push("/dashboard");
    }


    return auth;
}