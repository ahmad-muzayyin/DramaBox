import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import '../index.css';

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <Logo size="small" showText={true} />
            <div className="flex gap-4">
                <Link to="/search" className="btn-ghost" aria-label="Search" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Search size={24} />
                </Link>
            </div>
        </nav>
    );
};
