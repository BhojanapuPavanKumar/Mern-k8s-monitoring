import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";

const ExpenseList = () => {
    const [expenseData, setExpenseData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", amount: "", category: "", date: "", note: "" });
    const [loading, setLoading] = useState(false);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/expense/get");
            setExpenseData(res.data.data || []);
        } catch (err) { ErrorToast(`Failed to fetch expenses: ${err.message}`); }
        finally { setLoading(false); }
    };

    const handleDelete = async id => {
        try {
            await axiosInstance.delete(`/expense/delete/${id}`);
            SuccessToast("Expense deleted.");
            fetchExpenses();
        } catch (err) { ErrorToast(`Delete failed: ${err.message}`); }
    };

    const startEditing = expense => {
        setEditingId(expense._id);
        setEditForm({
            title: expense.title, amount: expense.amount,
            category: expense.category || "", date: expense.date?.split("T")[0] || "", note: expense.note || "",
        });
    };

    const handleEditSubmit = async id => {
        try {
            await axiosInstance.patch(`/expense/update/${id}`, editForm);
            SuccessToast("Expense updated!");
            setEditingId(null);
            fetchExpenses();
        } catch (err) { ErrorToast(`Update failed: ${err.message}`); }
    };

    useEffect(() => { fetchExpenses(); }, []);

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
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>📋</div>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #ef4444, #f87171)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Expense History</h2>
                <span style={{
                    marginLeft: 'auto', padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171', fontSize: '0.78rem', fontWeight: 600,
                }}>{expenseData.length} records</span>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', fontStyle: 'italic' }}>Loading records...</p>
            ) : expenseData.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', fontStyle: 'italic' }}>No expense records found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {expenseData.map(item => (
                        <div key={item._id} style={{
                            padding: '16px 18px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.025)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                        >
                            {editingId === item._id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        {[
                                            { key: 'title', label: 'Title', type: 'text' },
                                            { key: 'amount', label: 'Amount', type: 'number' },
                                            { key: 'category', label: 'Category', type: 'text' },
                                            { key: 'date', label: 'Date', type: 'date' },
                                        ].map(({ key, label, type }) => (
                                            <div key={key}>
                                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{label}</label>
                                                <input type={type} value={editForm[key]}
                                                    onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                                                    style={{ ...inputStyle, colorScheme: type === 'date' ? 'dark' : 'normal' }} />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Note</label>
                                        <textarea rows={2} value={editForm.note}
                                            onChange={e => setEditForm({ ...editForm, note: e.target.value })}
                                            style={{ ...inputStyle, resize: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                        <button className="btn-success" onClick={() => handleEditSubmit(item._id)}>Save</button>
                                        <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.875rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{item.title}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                            {item.category && (
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: 20,
                                                    background: 'rgba(239,68,68,0.1)',
                                                    border: '1px solid rgba(239,68,68,0.2)',
                                                    color: '#f87171', fontSize: '0.72rem', fontWeight: 600,
                                                }}>{item.category}</span>
                                            )}
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            {item.note && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontStyle: 'italic' }}>— {item.note}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ef4444' }}>₹{Number(item.amount).toLocaleString()}</p>
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

export { ExpenseList };
