import { useEffect, useState } from 'react';

const CircularProgressBar = ({ percentage, color = '#10b981', label = '' }) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const progress = ((100 - percentage) / 100) * circumference;
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setIsAnimating(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ position: 'relative', width: 96, height: 96 }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle r={radius} cx="50" cy="50" fill="none"
                        stroke="rgba(255,255,255,0.07)" strokeWidth="8"
                        strokeDasharray={circumference}
                    />
                    {/* Progress */}
                    <circle r={radius} cx="50" cy="50" fill="none"
                        stroke={color} strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={isAnimating ? progress : circumference}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        filter={`drop-shadow(0 0 6px ${color}55)`}
                    />
                </svg>
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1.05rem', color,
                    fontFamily: "'DM Sans', sans-serif",
                }}>{percentage}%</div>
            </div>
            {label && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'center', maxWidth: 80 }}>
                    {label}
                </span>
            )}
        </div>
    );
};

export default CircularProgressBar;
