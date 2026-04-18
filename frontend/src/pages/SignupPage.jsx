import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { axiosInstance } from "../axios/axiosInstance.js";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";

const SignupPage = () => {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setLoading(true);
        if (isOtpSent) {
            try {
                if (!email || !password || !otp) { ErrorToast("Email, password & otp are required!"); setLoading(false); return; }
                const result = await axiosInstance.post("/auth/signup", { email, password, otp });
                if (result.status === 201) { SuccessToast(result.data.message); navigate("/login"); }
                else ErrorToast(result.data.message);
            } catch (err) {
                ErrorToast(`Cannot signup: ${err.response?.data?.message || err.message}`);
            }
        } else {
            ErrorToast("Cannot signup before sending OTP");
        }
        setLoading(false);
    };

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const resp = await axiosInstance.post("/auth/send-otp", { email });
            if (resp.data.isSuccess) { SuccessToast(resp.data.message); setIsOtpSent(true); }
            else SuccessToast(resp.data.message);
        } catch (err) {
            ErrorToast(`Cannot send OTP: ${err.response?.data?.message || err.message}`);
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%', padding: '14px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, color: '#f1f5f9',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', outline: 'none',
        transition: 'all 0.25s',
    };
    const labelStyle = {
        display: 'block', marginBottom: 6, color: 'var(--text-secondary)',
        fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'var(--bg-primary)',
            padding: '24px', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', top: '-80px', right: '-80px', width: 360, height: 360,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-100px', left: '-80px', width: 320, height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="fade-in" style={{
                width: '100%', maxWidth: 460,
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 24, padding: '48px 40px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                position: 'relative', zIndex: 1,
            }}>
                {/* Steps indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, justifyContent: 'center' }}>
                    {[1, 2].map(step => (
                        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', fontWeight: 700,
                                background: (step === 1 || (step === 2 && isOtpSent))
                                    ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.06)',
                                color: (step === 1 || (step === 2 && isOtpSent)) ? '#0a0f1e' : 'var(--text-muted)',
                                transition: 'all 0.3s',
                            }}>{step}</div>
                            {step === 1 && (
                                <div style={{
                                    width: 40, height: 1,
                                    background: isOtpSent ? 'linear-gradient(90deg, #f59e0b, #fcd34d)' : 'rgba(255,255,255,0.1)',
                                    transition: 'all 0.4s',
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif", fontSize: '1.85rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        marginBottom: 6,
                    }}>{isOtpSent ? "Verify & Complete" : "Create Account"}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isOtpSent ? "Enter the OTP sent to your email" : "Start tracking your finances today"}
                    </p>
                </div>

                {loading && (
                    <div style={{
                        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                        display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        <div style={{
                            width: 16, height: 16, borderRadius: '50%',
                            border: '2px solid #f59e0b', borderTopColor: 'transparent',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <span style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 500 }}>Processing...</span>
                    </div>
                )}

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com" style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    {isOtpSent && (
                        <>
                            <div>
                                <label style={labelStyle}>One-Time Password</label>
                                <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                                    placeholder="Enter OTP" style={{ ...inputStyle, letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.1rem' }}
                                    onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="Create a strong password" style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </>
                    )}

                    <button
                        onClick={isOtpSent ? handleRegister : handleSendOtp}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: 8, padding: '14px', fontSize: '1rem' }}
                    >
                        {isOtpSent ? "Complete Registration" : "Send OTP"}
                    </button>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 28, paddingTop: 20,
                    textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem',
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export { SignupPage };
