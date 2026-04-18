import { useState } from "react";
import { Link } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { useAppContext } from "../contexts/appContext";

const LoginPage = () => {
    const { setAppLoading } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        setAppLoading(true);
        try {
            if (!email || !password) {
                setAppLoading(false);
                ErrorToast("Email & password are required!");
                return;
            }
            const result = await axiosInstance.post("/auth/login", { email, password });
            if (result.status === 200) {
                setAppLoading(false);
                SuccessToast(result.data.message);
                window.open("/", "_self");
            } else {
                setAppLoading(false);
                ErrorToast(result.data.message);
            }
        } catch (err) {
            setAppLoading(false);
            ErrorToast(`Cannot login: ${err.response?.data?.message || err.message}`);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        color: '#f1f5f9',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.25s',
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Ambient glows */}
            <div style={{
                position: 'absolute', top: '-120px', left: '-120px',
                width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-100px', right: '-100px',
                width: 350, height: 350, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="fade-in" style={{
                width: '100%', maxWidth: 440,
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 24,
                padding: '48px 40px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                position: 'relative', zIndex: 1,
            }}>
                {/* Icon */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, margin: '0 auto 16px',
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, boxShadow: '0 0 30px rgba(245,158,11,0.25)',
                    }}>₹</div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.85rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: 6,
                    }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Sign in to your FinTrack account
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    <button
                        onClick={handleRegister}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: 8, padding: '14px', fontSize: '1rem' }}
                    >
                        Sign In
                    </button>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    marginTop: 28, paddingTop: 20,
                    textAlign: 'center',
                    color: 'var(--text-muted)', fontSize: '0.875rem',
                }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{
                        color: '#f59e0b', fontWeight: 600, textDecoration: 'none',
                    }}>Create one</Link>
                </div>
            </div>
        </div>
    );
};

export { LoginPage };
