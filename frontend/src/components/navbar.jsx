import { Link } from "react-router";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";

const Navbar = () => {
    const { user = {} } = useAppContext();
    const { isAuthenticated } = user;

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/auth/logout");
            window.location.reload();
        } catch (err) {
            ErrorToast(`Logout: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(7, 13, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '0 32px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 34, height: 34,
                        borderRadius: 9,
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(245,158,11,0.3)',
                        fontSize: 16, fontWeight: 700, color: '#0a0f1e',
                    }}>₹</div>
                    <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>FinTrack</span>
                </div>
            </Link>

            {/* Center Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[
                    { to: '/', label: 'Dashboard' },
                    { to: '/expense', label: 'Expenses' },
                    { to: '/income', label: 'Income' },
                ].map(({ to, label }) => (
                    <Link key={to} to={to} style={{
                        padding: '6px 16px',
                        borderRadius: 8,
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={e => { e.target.style.color = '#f59e0b'; e.target.style.background = 'rgba(245,158,11,0.08)'; }}
                    onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
                    >{label}</Link>
                ))}
            </div>

            {/* Right: Auth */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" style={{
                            padding: '8px 20px', borderRadius: 8,
                            border: '1px solid rgba(245,158,11,0.4)',
                            color: '#f59e0b', textDecoration: 'none',
                            fontSize: '0.875rem', fontWeight: 600,
                            transition: 'all 0.2s',
                        }}>Login</Link>
                        <Link to="/signup" className="btn-primary" style={{
                            padding: '8px 20px', fontSize: '0.875rem',
                        }}>Sign Up</Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile" style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '6px 14px', borderRadius: 8,
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)', textDecoration: 'none',
                            fontSize: '0.875rem', fontWeight: 500,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <div style={{
                                width: 24, height: 24, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f59e0b33, #3b82f633)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, color: '#f59e0b', fontWeight: 700,
                            }}>P</div>
                            Profile
                        </Link>
                        <button onClick={handleLogout} style={{
                            padding: '8px 18px', borderRadius: 8,
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            color: '#ef4444', fontSize: '0.875rem',
                            fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'var(--font-body)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        >Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export { Navbar };
