import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router";
import { useAppContext } from "./contexts/appContext";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Dashboard } from "./components/Dashboard";
import { AddExpense } from "./components/AddExpense";
import { Income } from "./pages/Income";
import { Expense } from "./pages/Expense";

/* ── Premium dark loading screen ── */
const LoadingScreen = () => (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        gap: 40,
        position: 'relative',
        overflow: 'hidden',
    }}>
        {/* Ambient glows */}
        <div style={{
            position: 'absolute', top: '-150px', left: '-150px',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
        }} />
        <div style={{
            position: 'absolute', bottom: '-150px', right: '-150px',
            width: 450, height: 450, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
        }} />

        {/* Logo + spinner */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
            {/* Brand mark */}
            <div style={{
                width: 72, height: 72, borderRadius: 18,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, fontWeight: 700, color: '#0a0f1e',
                boxShadow: '0 0 40px rgba(245,158,11,0.3)',
                fontFamily: "'Playfair Display', serif",
            }}>₹</div>

            {/* Spinner ring */}
            <div style={{ position: 'relative', width: 56, height: 56 }}>
                <svg viewBox="0 0 56 56" style={{ width: 56, height: 56 }}>
                    {/* Track */}
                    <circle cx="28" cy="28" r="22" fill="none"
                        stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
                    {/* Animated arc */}
                    <circle cx="28" cy="28" r="22" fill="none"
                        stroke="#f59e0b" strokeWidth="3"
                        strokeDasharray="138" strokeDashoffset="100"
                        strokeLinecap="round"
                        style={{
                            transformOrigin: 'center',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                </svg>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>

            <div style={{ textAlign: 'center' }}>
                <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.5rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    marginBottom: 6,
                }}>FinTrack</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading your finances...</p>
            </div>
        </div>

        {/* Info card */}
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '20px 28px',
            maxWidth: 340, width: '100%', textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 20, marginBottom: 12,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
            }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>Free-tier server</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Backend may take up to <strong style={{ color: '#f1f5f9' }}>2 minutes</strong> to warm up on first load.
            </p>
        </div>
    </div>
);

const App = () => {
    const { appLoading, user } = useAppContext();
    const { isAuthenticated } = user;

    if (appLoading) return <LoadingScreen />;

    if (!isAuthenticated) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/income" element={<Income />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;



//**************************************************************************************************** */

// import { Routes, Route, BrowserRouter } from "react-router-dom";
// import { BounceLoader } from "react-spinners";

// import { SignupPage } from "./pages/SignupPage";
// import { LoginPage } from "./pages/LoginPage";
// import { HomePage } from "./pages/HomePage";
// import { NotFoundPage } from "./pages/NotFoundPage";
// import { ProfilePage } from "./pages/ProfilePage";
// import { Dashboard } from "./components/Dashboard";
// import { AddExpense } from "./components/AddExpense";
// import { Income } from "./pages/Income";
// import { Expense } from "./pages/Expense";

// const App = () => {

//   /*
//   FRONTEND TEST MODE
//   (No backend running)
//   */

//   return (

//     <BrowserRouter>

//       <Routes>

//         <Route path="/" element={<HomePage />} />

//         <Route path="/expense" element={<Expense />} />

//         <Route path="/income" element={<Income />} />

//         <Route path="/profile" element={<ProfilePage />} />

//         <Route path="/dashboard" element={<Dashboard />} />

//         <Route path="/add-expense" element={<AddExpense />} />

//         <Route path="/signup" element={<SignupPage />} />

//         <Route path="/login" element={<LoginPage />} />

//         <Route path="*" element={<NotFoundPage />} />

//       </Routes>

//     </BrowserRouter>

//   );

// };

// export default App;