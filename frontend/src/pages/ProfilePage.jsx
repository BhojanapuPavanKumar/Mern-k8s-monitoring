import { useEffect, useState } from "react";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { useNavigate } from "react-router";
import { Navbar } from "../components/navbar";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user = {}, setAppLoading } = useAppContext();
    const [isDetails, issetDetails] = useState(true);
    const [updateDetails, setUpdateDetails] = useState({ name: "", gender: "", role: "" });

    const getDetails = async () => {
        try {
            const resp = await axiosInstance.get("/users/details");
            setAppLoading(false);
            setUpdateDetails(resp.data.data.user);
        } catch (err) {
            setAppLoading(false);
            ErrorToast(`Cannot get details: ${err.response?.data?.message || err.message}`);
        }
    };

    useEffect(() => { getDetails(); }, []);

    const handleEditDetails = async (e) => {
        e.preventDefault();
        setAppLoading(true);
        try {
            const result = await axiosInstance.post("/users/details", updateDetails);
            setAppLoading(false);
            if (result.status === 200 && result.data.isSuccess) {
                SuccessToast(result.data.message);
                issetDetails(true);
                navigate("/profile");
            } else {
                ErrorToast(result.data.message);
            }
        } catch (err) {
            setAppLoading(false);
            ErrorToast(`Cannot edit details: ${err.response?.data?.message || err.message}`);
        }
    };

    const fields = [
        { key: 'name', label: 'Full Name', icon: '👤' },
        { key: 'email', label: 'Email', icon: '✉️', readOnly: true },
        { key: 'gender', label: 'Gender', icon: '⚧' },
        { key: 'role', label: 'Role', icon: '🏷️' },
    ];

    const inputStyle = {
        width: '100%', padding: '12px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, color: '#f1f5f9',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', outline: 'none',
        transition: 'all 0.25s',
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>

                {/* Header */}
                <div className="fade-in" style={{ textAlign: 'center', marginBottom: 36 }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        marginBottom: 6,
                    }}>Your Profile</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your personal information</p>
                </div>

                {/* Profile Card */}
                <div className="glass-card fade-in-delay-1" style={{ padding: '36px' }}>
                    {/* Avatar row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(59,130,246,0.2))',
                            border: '2px solid rgba(245,158,11,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 28, color: '#f59e0b', fontWeight: 700,
                            flexShrink: 0,
                        }}>
                            {updateDetails.name ? updateDetails.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '1.15rem', color: '#f1f5f9' }}>{updateDetails.name || 'User'}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 2 }}>{updateDetails.email || ''}</p>
                            <div style={{
                                display: 'inline-block', marginTop: 8, padding: '3px 10px', borderRadius: 20,
                                background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                                color: '#10b981', fontSize: '0.75rem', fontWeight: 600,
                            }}>Active</div>
                        </div>
                    </div>

                    {isDetails ? (
                        <>
                            <div style={{ display: 'grid', gap: 16 }}>
                                {fields.map(({ key, label, icon }) => (
                                    <div key={key} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
                                        borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: 16 }}>{icon}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</span>
                                        </div>
                                        <span style={{ color: '#f1f5f9', fontWeight: 500, fontSize: '0.95rem' }}>
                                            {updateDetails[key] || '—'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => issetDetails(false)}
                                className="btn-primary"
                                style={{ marginTop: 28, width: '100%', padding: '14px' }}
                            >
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleEditDetails} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {["name", "gender", "role"].map(field => (
                                <div key={field}>
                                    <label style={{
                                        display: 'block', marginBottom: 6,
                                        color: 'var(--text-secondary)', fontSize: '0.8rem',
                                        fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                                    }}>{field}</label>
                                    <input
                                        type="text"
                                        value={updateDetails[field] || ''}
                                        onChange={e => setUpdateDetails({ ...updateDetails, [field]: e.target.value })}
                                        placeholder={`Enter your ${field}`}
                                        style={inputStyle}
                                        onFocus={e => { e.target.style.borderColor = '#f59e0b'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.12)'; }}
                                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '13px' }}>
                                    Save Changes
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => issetDetails(true)} style={{ flex: 1, padding: '13px' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export { ProfilePage };
