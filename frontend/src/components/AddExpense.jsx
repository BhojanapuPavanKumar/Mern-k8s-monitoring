import { useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { SuccessToast, ErrorToast } from "../utils/toastHelper";
import { useNavigate } from "react-router";
import { useAppContext } from "../contexts/appContext";

const CATEGORIES = [
    { value: "grocery", label: "🛒 Grocery" },
    { value: "food", label: "🍔 Food" },
    { value: "transport", label: "🚗 Transport" },
    { value: "utilities", label: "⚡ Utilities" },
    { value: "entertainment", label: "🎬 Entertainment" },
];

const AddExpense = () => {
    const navigate = useNavigate();
    const { setAppLoading } = useAppContext();
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async e => {
        setAppLoading(true);
        e.preventDefault();
        if (!title || !amount || !category || !date) {
            setAppLoading(false); ErrorToast("All fields are required"); return;
        }
        try {
            const res = await axiosInstance.post("/expense/add", { title, amount, category, date });
            if (res.data.isSuccess) {
                setAppLoading(false);
                SuccessToast("Expense Added Successfully");
                setTitle(""); setAmount(""); setCategory(""); setDate("");
                navigate("/");
            }
        } catch (err) {
            setAppLoading(false);
            ErrorToast(err?.response?.data?.message || err.message);
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
    const focus = e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)'; };
    const blur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

    return (
        <div className="glass-card" style={{ padding: '32px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>💸</div>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #ef4444, #f87171)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Add New Expense</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Lunch, Bus ticket" style={inputStyle}
                            onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                        <label style={labelStyle}>Amount (₹)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                            placeholder="0.00" style={inputStyle} onFocus={focus} onBlur={blur} />
                    </div>
                </div>

                {/* Category pills */}
                <div>
                    <label style={labelStyle}>Category</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {CATEGORIES.map(cat => (
                            <button key={cat.value} type="button"
                                onClick={() => setCategory(cat.value)}
                                style={{
                                    padding: '8px 14px', borderRadius: 50,
                                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.85rem',
                                    cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
                                    background: category === cat.value ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                                    borderColor: category === cat.value ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)',
                                    color: category === cat.value ? '#f87171' : 'var(--text-secondary)',
                                    boxShadow: category === cat.value ? '0 0 12px rgba(239,68,68,0.15)' : 'none',
                                }}
                            >{cat.label}</button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                        style={{ ...inputStyle, colorScheme: 'dark' }} onFocus={focus} onBlur={blur} />
                </div>

                <button type="submit" style={{
                    padding: '14px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none', color: '#fff', fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                    transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(239,68,68,0.22)',
                }}
                    onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(239,68,68,0.3)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 20px rgba(239,68,68,0.22)'; }}
                >Add Expense</button>
            </form>
        </div>
    );
};

export { AddExpense };
