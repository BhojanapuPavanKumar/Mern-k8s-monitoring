import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";

const IncomeList = () => {
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", amount: "", date: "", note: "" });

    const fetchIncome = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/income/get");
            setIncomeData(res.data.data || []);
        } catch (err) { ErrorToast(`Failed to fetch income: ${err.message}`); }
        finally { setLoading(false); }
    };

    const startEditing = item => {
        setEditingId(item._id);
        setEditForm({ title: item.title || "", amount: item.amount || "", date: item.date?.slice(0, 10) || "", note: item.note || "" });
    };

    const handleEditSubmit = async id => {
        try {
            await axiosInstance.patch(`/income/update/${id}`, editForm);
            SuccessToast("Income updated!");
            setEditingId(null);
            fetchIncome();
        } catch (err) { ErrorToast(`Update failed: ${err.message}`); }
    };

    const handleDelete = async id => {
        try {
            await axiosInstance.delete(`/income/delete/${id}`);
            SuccessToast("Income record deleted.");
            fetchIncome();
        } catch (err) { ErrorToast(`Delete failed: ${err.message}`); }
    };

    useEffect(() => { fetchIncome(); }, []);

    const inputStyle = {
        width: '100%', padding: '9px 12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, color: '#f1f5f9',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', outline: 'none',
    };

    return (
        <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>📋</div>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Income History</h2>
                <span style={{
                    marginLeft: 'auto', padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
                    color: '#10b981', fontSize: '0.78rem', fontWeight: 600,
                }}>{incomeData.length} records</span>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', fontStyle: 'italic' }}>Loading records...</p>
            ) : incomeData.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', fontStyle: 'italic' }}>No income records found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {incomeData.map(item => (
                        <div key={item._id} style={{
                            padding: '16px 18px',
                            background: 'rgba(255,255,255,0.025)',
                            borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                        >
                            {editingId === item._id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title</label>
                                            <input type="text" value={editForm.title}
                                                onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Amount</label>
                                            <input type="number" value={editForm.amount}
                                                onChange={e => setEditForm({ ...editForm, amount: e.target.value })} style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Date</label>
                                            <input type="date" value={editForm.date}
                                                onChange={e => setEditForm({ ...editForm, date: e.target.value })} style={{ ...inputStyle, colorScheme: 'dark' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Note</label>
                                            <input type="text" value={editForm.note}
                                                onChange={e => setEditForm({ ...editForm, note: e.target.value })} style={inputStyle} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                        <button className="btn-success" onClick={() => handleEditSubmit(item._id)}>Save</button>
                                        <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.875rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 3 }}>{item.title}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            {item.note && (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontStyle: 'italic' }}>— {item.note}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <p style={{ fontWeight: 700, fontSize: '1.15rem', color: '#10b981' }}>₹{Number(item.amount).toLocaleString()}</p>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn-edit" onClick={() => startEditing(item)}>Edit</button>
                                            <button className="btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export { IncomeList };
