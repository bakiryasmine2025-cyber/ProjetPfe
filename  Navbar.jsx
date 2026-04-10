import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: '#0D0D0D', padding: '0 40px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', height: '64px'
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#E63030', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 18
                }}>🏉</div>
                <div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>
                        RUGBY TUNISIE
                    </div>
                    <div style={{ color: '#888', fontSize: 11 }}>Plateforme de gestion sportive</div>
                </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link to="/login" style={{
                    color: '#fff', textDecoration: 'none',
                    fontWeight: 600, fontSize: 14
                }}>
                    Connexion
                </Link>
                <Link to="/register" style={{
                    background: '#E63030', color: '#fff',
                    padding: '9px 20px', borderRadius: 8,
                    textDecoration: 'none', fontWeight: 700, fontSize: 14
                }}>
                    Créer un compte
                </Link>
            </div>
        </nav>
    );
}