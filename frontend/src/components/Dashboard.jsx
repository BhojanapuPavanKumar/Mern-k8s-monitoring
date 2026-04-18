import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { groupByMonth, groupByYear } from "../utils/groupExpense";
import { ErrorToast } from "../utils/toastHelper";
import CircularProgressBar from "../components/CircularProgressBar";
import { useAppContext } from "../contexts/appContext";

const StatCard = ({ title, value, color, icon, glow, delay }) => (
    <div className={`glass-card fade-in-delay-${delay}`} style={{
        padding: '24px 28px',
        borderLeft: `3px solid ${color}`,
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{title}</p>
                <p style={{ fontSize: '1.85rem', fontWeight: 700, color, fontFamily: "'DM Sans', sans-serif" }}>₹{value.toLocaleString()}</p>
            </div>
            <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: glow, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>{icon}</div>
        </div>
    </div>
);

const Dashboard = () => {
    const { setAppLoading } = useAppContext();
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [filter, setFilter] = useState("day");

    const fetchExpenses = async () => {
        setAppLoading(true);
        try {
            const res = await axiosInstance.get("/expense/get");
            setExpenses(res.data.data || []);
        } catch (err) { ErrorToast(`Failed to fetch expenses: ${err.message}`); }
    };

    const fetchIncome = async () => {
        setAppLoading(true);
        try {
            const res = await axiosInstance.get("/income/get");
            setIncome(res.data.data || []);
        } catch (err) { ErrorToast(`Failed to fetch income: ${err.message}`); }
    };

    useEffect(() => {
        fetchExpenses();
        fetchIncome();
        setAppLoading(false);
    }, []);

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalIncome = income.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const balance = totalIncome - totalExpense;
    const overspentAmount = totalExpense > totalIncome ? totalExpense - totalIncome : 0;
    const isOverspending = overspentAmount > 0;
    const spentPercentage = totalIncome ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : totalExpense > 0 ? 100 : 0;
    const balancePercentage = totalIncome ? Math.max(0, 100 - spentPercentage) : 0;

    const ExpenseRow = ({ item }) => (
        <div style={{
            padding: '16px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'all 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        >
            <div>
                <p style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 3 }}>{item.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.category && (
                        <span style={{
                            padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
                            background: 'rgba(239,68,68,0.12)', color: '#f87171',
                            border: '1px solid rgba(239,68,68,0.2)',
                        }}>{item.category}</span>
                    )}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                </div>
            </div>
            <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ef4444' }}>₹{Number(item.amount).toLocaleString()}</p>
        </div>
    );

    return (
        <div style={{ padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>

            {/* Title */}
            <div className="fade-in" style={{ marginBottom: 36 }}>
                <h1 style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    marginBottom: 4,
                }}>Financial Overview</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your complete financial snapshot</p>
            </div>

            {/* Overspend alert */}
            {isOverspending && (
                <div className="fade-in" style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: 12, padding: '14px 20px', marginBottom: 24,
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <span style={{ fontSize: 18 }}>⚠️</span>
                    <p style={{ color: '#f87171', fontWeight: 500 }}>
                        Overspending by <strong>₹{overspentAmount.toLocaleString()}</strong> this period
                    </p>
                </div>
            )}

            {/* Stat cards + Circles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard title="Total Income" value={totalIncome} color="#10b981" icon="💰" glow="rgba(16,185,129,0.12)" delay={1} />
                <StatCard title="Total Expenses" value={totalExpense} color="#ef4444" icon="💸" glow="rgba(239,68,68,0.12)" delay={2} />
                <div className="glass-card fade-in-delay-3" style={{ padding: '24px 28px', borderLeft: `3px solid ${balance >= 0 ? '#10b981' : '#ef4444'}` }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Balance</p>
                    <p style={{ fontSize: '1.85rem', fontWeight: 700, color: balance >= 0 ? '#10b981' : '#ef4444' }}>
                        {balance >= 0 ? '' : '-'}₹{Math.abs(balance).toLocaleString()}
                    </p>
                </div>
                <div className="glass-card fade-in-delay-3" style={{ padding: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <CircularProgressBar percentage={spentPercentage} color="#ef4444" label={isOverspending ? `-₹${overspentAmount}` : "Spent"} />
                    <CircularProgressBar percentage={balancePercentage} color="#10b981" label={isOverspending ? "₹0" : "Left"} />
                </div>
            </div>

            {/* Filter + Expense list */}
            <div className="glass-card fade-in-delay-3">
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <h3 style={{ fontWeight: 600, fontSize: '1rem', color: '#f1f5f9' }}>Expense Breakdown</h3>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{
                            padding: '8px 14px', borderRadius: 8,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.875rem', outline: 'none', cursor: 'pointer',
                        }}
                    >
                        <option value="day">Day-wise</option>
                        <option value="month">Month-wise</option>
                        <option value="year">Year-wise</option>
                    </select>
                </div>

                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filter === "day" && expenses.length === 0 && (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>No expenses recorded yet.</p>
                    )}

                    {filter === "day" && expenses.map(item => <ExpenseRow key={item._id} item={item} />)}

                    {filter === "month" && Object.entries(groupByMonth(expenses)).map(([month, items]) => (
                        <div key={month} style={{ marginBottom: 20 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
                                paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <span style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: '#3b82f6', display: 'inline-block',
                                }} />
                                <h4 style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem' }}>{month}</h4>
                                <span style={{ marginLeft: 'auto', color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                                    ₹{items.reduce((s, i) => s + Number(i.amount), 0).toLocaleString()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {items.map(item => <ExpenseRow key={item._id} item={item} />)}
                            </div>
                        </div>
                    ))}

                    {filter === "year" && Object.entries(groupByYear(expenses)).map(([year, months]) => (
                        <div key={year} style={{ marginBottom: 24 }}>
                            <h3 style={{
                                color: '#10b981', fontWeight: 700, fontSize: '1.05rem', marginBottom: 16,
                                paddingBottom: 10, borderBottom: '1px solid rgba(16,185,129,0.2)',
                            }}>{year}</h3>
                            {Object.entries(months).map(([month, items]) => (
                                <div key={month} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: '2px solid rgba(59,130,246,0.3)' }}>
                                    <h4 style={{ color: '#60a5fa', fontWeight: 600, marginBottom: 8, fontSize: '0.875rem' }}>{month}</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {items.map(item => <ExpenseRow key={item._id} item={item} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { Dashboard };
