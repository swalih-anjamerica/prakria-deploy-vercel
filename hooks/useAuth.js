import { useRouter } from "next/router";
import { useContext, createContext, useState, useEffect } from "react";
import API from "../services/api";


const AuthContext = createContext();

// provider
export const AuthContextProvider = ({ children }) => {

    let values = getContextValues();

    return (
        <AuthContext.Provider value={values}>
            {
                children
            }
        </AuthContext.Provider>
    )
}

// consumer
export const useAuth = () => {
    return useContext(AuthContext);
}

// values
const getContextValues = () => {

    // states
    let [isAuthenticated, setIsAuthenticated] = useState(null);
    let [role, setRole] = useState(null);
    let [user, setUser] = useState(null);
    let [userUpdateTime, setUserUpdateTime] = useState(null);
    let [subscription, setSubscription] = useState(null);
    let router = useRouter();

    async function login(email, password) {
        return API.post("/auth", { email, password }).then(response => {
            const { data } = response;
            localStorage.setItem("token", data.payload);
            setIsAuthenticated(null);
            // setUser(data.user);
            // setRole(data.role);
            return response;
        })
    }
    async function signupClientAdmin(params) {
        return API.post("/client/signup", params).then(response => {
            if (response.status === 200) {
                localStorage.setItem("token", response.data?.token);
                setIsAuthenticated(null);
            }
            return response;
        })
    }

    async function logout() {
        localStorage.removeItem("token");  
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
        router.push({
            pathname: "/login"
        });
    }

    async function checkLogedIn() {
        try {
            const { data } = await API.get("/auth")
            setUser(data?.user);
            setRole(data?.role);
            setSubscription(data?.subscriptionStatus);
            setIsAuthenticated(data.logedin);
        } catch (e) {
            setRole(null);
            setIsAuthenticated(false);
            setUser(null);
        }
    }

    useEffect(() => {
        checkLogedIn();
    }, [userUpdateTime])

    return {
        login,
        logout,
        checkLogedIn,
        signupClientAdmin,
        setUserUpdateTime,
        subscription,
        role,
        user,
        isAuthenticated
    }
}