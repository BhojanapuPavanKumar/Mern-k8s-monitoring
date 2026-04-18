import { Dashboard } from "../components/Dashboard.jsx";
import { Navbar } from "../components/navbar";

const HomePage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <Dashboard />
        </div>
    );
};

export { HomePage };
