import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const navItems = [
    { path: '/dashboard',                   icon: '⊞',  label: 'Tableau de bord' },
    { path: '/dashboard/users',             icon: '👤', label: 'Utilisateurs',        roles: ['SUPER_ADMIN'] },
    { path: '/dashboard/messages',          icon: '✉️', label: 'Messages' },
    { path: '/dashboard/arbitre',          icon: '⚖️', label: 'Arbitres',            roles: ['SUPER_ADMIN', 'FEDERATION_ADMIN'] },
    { path: '/dashboard/clubs',             icon: '🛡️', label: 'Clubs',               roles: ['SUPER_ADMIN', 'FEDERATION_ADMIN','CLUB_ADMIN'] },
    { path: '/dashboard/joueurs',           icon: '🏉', label: 'Joueurs',             roles: ['FEDERATION_ADMIN', 'SUPER_ADMIN','CLUB_ADMIN'] },
    { path: '/dashboard/competitions',      icon: '🏆', label: 'Compétitions',         roles: ['SUPER_ADMIN', 'FEDERATION_ADMIN'] },
    { path: '/dashboard/licences',          icon: '🎫', label: 'Licences',             roles: ['SUPER_ADMIN', 'FEDERATION_ADMIN','CLUB_ADMIN'] },
    { path: '/dashboard/club-management',   icon: '⚙️', label: 'Clubs',                roles: ['CLUB_ADMIN'] },
    { path: '/dashboard/teams',             icon: '👕', label: 'Équipes',              roles: ['CLUB_ADMIN','FEDERATION_ADMIN'] },
    { path: '/dashboard/partenaires',       icon: '🤝', label: 'Partenaires',          roles: ['FEDERATION_ADMIN', 'SUPER_ADMIN'] },
    { path: '/dashboard/club-partners',     icon: '🤝', label: 'Partenaires',          roles: ['CLUB_ADMIN'] },
    { path: '/dashboard/calendar',           label: 'Calendrier',           roles: ['CLUB_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'] },

    // ✅ FIX — Actualités: SUPER_ADMIN seulement
    { path: '/dashboard/actualites',        icon: '📰', label: 'Actualités',           roles: ['SUPER_ADMIN'] },

    { path: '/dashboard/fan-feed',          icon: '🏉', label: 'Mon Feed',             roles: ['FAN'] },
    { path: '/dashboard/profile',           icon: '⊙',  label: 'Mon profil' },
    { path: '/dashboard/player-analysis',   icon: '🤖', label: 'Analyse IA',           roles: ['CLUB_ADMIN', 'SUPER_ADMIN'] },
    { path: '/dashboard/injury-prevention', icon: '🛡️', label: 'Prévention Blessures', roles: ['SUPER_ADMIN', 'CLUB_ADMIN'] },
];

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const [unread]         = useState(3);

    const visible = navItems.filter(item =>
        !item.roles || (user?.role && item.roles.includes(user.role))
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: 260, background: '#0D0D0D',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0,
                height: '100vh', zIndex: 50
            }}>
                {/* Logo */}
                <div style={{
                    padding: '22px 20px', borderBottom: '1px solid #1f1f1f',
                    display: 'flex', alignItems: 'center', gap: 10
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#E63030', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 18
                    }}>🏉</div>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>
                        RUGBY TUNISIE
                    </span>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
                    {visible.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center',
                                gap: 12, padding: '11px 20px',
                                margin: '2px 8px', borderRadius: 8,
                                textDecoration: 'none',
                                background: isActive ? '#E63030' : 'transparent',
                                color: isActive ? '#fff' : '#aaa',
                                fontWeight: isActive ? 700 : 400,
                                fontSize: 14, transition: 'all 0.15s',
                                position: 'relative'
                            })}
                        >
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Déconnexion */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid #1f1f1f' }}>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            gap: 12, padding: '11px 20px', borderRadius: 8,
                            background: 'transparent', border: 'none',
                            color: '#666', fontSize: 14, cursor: 'pointer',
                            transition: 'color 0.15s'
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#fff'}
                        onMouseOut={e => e.currentTarget.style.color = '#666'}
                    >
                        <span>→</span> Déconnexion
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main style={{ marginLeft: 260, flex: 1, padding: '36px 40px', minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    );
}