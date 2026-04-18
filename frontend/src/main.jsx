import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./contexts/appContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AppContextProvider>
            <App />
            <ToastContainer
                position="bottom-right"
                autoClose={3500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="dark"
                toastStyle={{
                    background: "#121e34",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f1f5f9",
                    fontFamily: "'DM Sans', sans-serif",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                progressStyle={{ background: "#f59e0b" }}
            />
        </AppContextProvider>
    </StrictMode>
);
