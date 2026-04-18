import { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";

const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
    return useContext(AppContext);
}

const AppContextProvider = ({ children }) => {
    const [appLoading, setAppLoading] = useState(true);
    const [user, setUser] = useState({ isAuthenticated: false, data: null });

    const getUserDetails = async () => {
        try {
            setAppLoading(true);
            const resp = await axiosInstance.get("/users");
            if (resp.data.isSuccess) {
                setUser({
                    isAuthenticated: true,
                    data: resp.data.data.user,
                });
            } else {
                setUser({ isAuthenticated: false, data: null });
                ErrorToast("User validation failed", resp.data.message);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                console.warn("🔐 Unauthorized - clearing user state");
            }
            setUser({ isAuthenticated: false, data: null });
        } finally {
            setAppLoading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const valueObj = {
        appLoading,
        user,
        setAppLoading,
    };

    return (
        <AppContext.Provider value={valueObj}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContextProvider };
