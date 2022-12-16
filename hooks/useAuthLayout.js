import { useContext, createContext, useState } from "react";


const AuthLayoutContext = createContext();

function contextValues() {

    const [showWelcomeHeader, setShowWelcomeHeader] = useState(true);
    const [headerMessage, setHeaderMessage]=useState(null);
    const [activeLink, setActiveLink]=useState("");
    return {
        showWelcomeHeader,
        headerMessage,
        activeLink,
        setActiveLink,
        setShowWelcomeHeader,
        setHeaderMessage
    }
}

export const AuthLayoutProvider = ({ children }) => {

    const values = contextValues();

    return (
        <AuthLayoutContext.Provider value={values}>
            {
                children
            }
        </AuthLayoutContext.Provider>
    )
}

export const useAuthLayout = () => {
    return useContext(AuthLayoutContext);
}