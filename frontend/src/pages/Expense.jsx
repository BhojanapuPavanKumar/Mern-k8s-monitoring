import { useState } from "react";
import { AddExpense } from "../components/AddExpense";
import { ExpenseList } from "../components/ExpenseList";
import { Navbar } from "../components/navbar";

const Expense = () => {
    const [activeTab, setActiveTab] = useState("add");

    return (
        <>
            <Navbar />
            <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--bg-primary)', padding: '40px 24px' }}>
                <div style={{ maxWidth: 720, margin: '0 auto' }}>

                    {/* Page Header */}
                    <div className="fade-in" style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: 'rgba(239,68,68,0.12)',
                                border: '1px solid rgba(239,68,68,0.22)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18,
                            }}>💸</div>
                            <h1 style={{
                                fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #ef4444, #f87171)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>Expenses</h1>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: 52 }}>
                            Log and review your spending
                        </p>
                    </div>

                    {/* Tab Bar */}
                    <div className="fade-in-delay-1" style={{
                        display: 'flex', gap: 8, marginBottom: 28,
                        background: 'var(--bg-card)', borderRadius: 12,
                        border: '1px solid var(--border)', padding: 4,
                    }}>
                        {[
                            { key: 'add', label: '+ Add Expense' },
                            { key: 'list', label: '≡ History' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    flex: 1, padding: '10px 20px', borderRadius: 9,
                                    border: 'none', cursor: 'pointer', fontWeight: 600,
                                    fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
                                    transition: 'all 0.25s',
                                    background: activeTab === tab.key
                                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                        : 'transparent',
                                    color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: activeTab === tab.key ? '0 4px 15px rgba(239,68,68,0.22)' : 'none',
                                }}
                            >{tab.label}</button>
                        ))}
                    </div>

                    <div className="fade-in-delay-2">
                        {activeTab === "add" ? <AddExpense /> : <ExpenseList />}
                    </div>
                </div>
            </div>
        </>
    );
};

export { Expense };
