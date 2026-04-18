import { useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { SuccessToast, ErrorToast } from "../utils/toastHelper";
import { useAppContext } from "../contexts/appContext";

const AddIncomeForm = ({ onIncomeAdded }) => {
    const { setAppLoading } = useAppContext();
    const [form, setForm] = useState({ title: "", amount: "", note: "", date: "" });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        setAppLoading(true);
        e.preventDefault();
        if (!form.title || !form.amount || !form.date) return ErrorToast("All fields are required");
        try {
            const res = await axiosInstance.post("/income/add", form);
            SuccessToast(res.data.message);
            setForm({ title: "", amount: "", note: "", date: "" });
            if (onIncomeAdded) onIncomeAdded();
            setAppLoading(false);
        } catch (err) {
            ErrorToast(err.response?.data?.message || "Failed to add income");
            setAppLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '13px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, color: '#f1f5f9',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', outline: 'none',
        transition: 'all 0.25s',
    };
    const labelStyle = {
        display: 'block', marginBottom: 6, color: 'var(--text-secondary)',
        fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
    };
    const focus = e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)'; };
    const blur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

    return (
        <div className="glass-card" style={{ padding: '32px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>💰</div>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Add New Income</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Income Title</label>
                        <input name="title" value={form.title} onChange={handleChange}
                            placeholder="e.g. Salary, Freelance" style={inputStyle}
                            onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                        <label style={labelStyle}>Amount (₹)</label>
                        <input name="amount" value={form.amount} onChange={handleChange}
                            type="number" placeholder="0.00" style={inputStyle}
                            onFocus={focus} onBlur={blur} />
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Date</label>
                    <input name="date" value={form.date} onChange={handleChange}
                        type="date" style={{ ...inputStyle, colorScheme: 'dark' }}
                        onFocus={focus} onBlur={blur} />
                </div>
                <div>
                    <label style={labelStyle}>Note (optional)</label>
                    <textarea name="note" value={form.note} onChange={handleChange}
                        placeholder="Add a note..." rows={3}
                        style={{ ...inputStyle, resize: 'none' }}
                        onFocus={focus} onBlur={blur} />
                </div>
                <button type="submit" style={{
                    padding: '14px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none', color: '#fff', fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                    transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(16,185,129,0.25)',
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(16,185,129,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.25)'; }}
                >Add Income</button>
            </form>
        </div>
    );
};

export default AddIncomeForm;