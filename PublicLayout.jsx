import { Link } from 'react-router-dom';

export default function PublicLayout({ children }) {
    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Navbar */}
            <nav style={{
                background: '#0D0D0D', padding: '0 40px',
                height: 64, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', position: 'sticky',
                top: 0, zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#E63030', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 18
                    }}>🏉</div>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>
                        RUGBY TUNISIE
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link to="/public" style={{ color: '#aaa', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
                          onMouseOver={e => e.target.style.color = '#fff'}
                          onMouseOut={e => e.target.style.color = '#aaa'}>
                        Calendrier
                    </Link>
                    <Link to="/public/clubs" style={{ color: '#aaa', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
                          onMouseOver={e => e.target.style.color = '#fff'}
                          onMouseOut={e => e.target.style.color = '#aaa'}>
                        Clubs
                    </Link>
                    <Link to="/login" style={{
                        background: '#E63030', color: '#fff', textDecoration: 'none',
                        padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700
                    }}>
                        Connexion
                    </Link>
                    <Link to="/register" style={{
                        background: 'transparent', color: '#fff', textDecoration: 'none',
                        padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                        border: '1.5px solid #444'
                    }}>
                        S'inscrire
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main style={{ padding: '40px' }}>
                {children}
            </main>
        </div>
    );
}