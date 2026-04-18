import { Navbar } from "../components/navbar";
import { Link } from "react-router";

const NotFoundPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navbar />
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: 'calc(100vh - 68px)',
                padding: '24px', textAlign: 'center',
            }}>
                <div className="fade-in">
                    <div style={{
                        fontSize: '7rem', fontFamily: "'Playfair Display', serif",
                        fontWeight: 700, lineHeight: 1,
                        background: 'linear-gradient(135deg, #f59e0b, #fcd34d)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        marginBottom: 16,
                    }}>404</div>
                    <h2 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 600, marginBottom: 10 }}>
                        Page not found
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 32 }}>
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export { NotFoundPage };
