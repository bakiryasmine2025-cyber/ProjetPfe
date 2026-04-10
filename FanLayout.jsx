import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FanNavbar from '../components/FanNavbar';

const navItems = [
    { path: '/fan',             icon: '🏠', label: 'Accueil'     },
    { path: '/fan/feed',  icon: '📰', label: 'Mon Feed'   },
    { path: '/fan/clubs',       icon: '🛡️', label: 'Clubs'       },
    { path: '/fan/shop',        icon: '🛒', label: 'Boutique'    },
    { path: '/fan/billetterie', icon: '🎟️', label: 'TicketsPage' },
];

// Pages qui utilisent la FanNavbar (style boutique) — sans sidebar
const SHOP_PAGES = ['/fan/shop', '/fan/home', '/fan/checkout', '/fan/panier'];

export default function FanLayout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Vérifier si on est sur une page boutique
    const isShopPage = SHOP_PAGES.some(p => location.pathname.startsWith(p));

    // ── Layout Boutique (FanNavbar) ──────────────────────────────────────────
    if (isShopPage) {
        return (
            <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
                <FanNavbar />
                <main>
                    {children}
                </main>
            </div>
        );
    }

    // ── Layout Sidebar (pages Rugby standard) ───────────────────────────────
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Sidebar */}
            <aside style={{
                width: 260, background: '#0D0D0D',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0,
                height: '100vh', zIndex: 50,
            }}>
                {/* Logo */}
                <div style={{
                    padding: '22px 20px', borderBottom: '1px solid #1f1f1f',
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#E63030', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>🏉</div>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>
                        RUGBY TUNISIE
                    </span>
                </div>

                {/* User info */}
                <div style={{
                    padding: '16px 20px', borderBottom: '1px solid #1f1f1f',
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#E63030', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 14,
                    }}>
                        {user?.nom?.charAt(0)?.toUpperCase() || 'F'}
                    </div>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{user?.nom}</div>
                        <div style={{ color: '#E63030', fontSize: 11, fontWeight: 600 }}>Fan</div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 0' }}>
                    {navItems.map(item => (
                        <NavLink key={item.path} to={item.path} end={item.path === '/fan'}
                                 style={({ isActive }) => ({
                                     display: 'flex', alignItems: 'center',
                                     gap: 12, padding: '11px 20px',
                                     margin: '2px 8px', borderRadius: 8,
                                     textDecoration: 'none',
                                     background: isActive ? '#E63030' : 'transparent',
                                     color: isActive ? '#fff' : '#aaa',
                                     fontWeight: isActive ? 700 : 400,
                                     fontSize: 14, transition: 'all 0.15s',
                                 })}>
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid #1f1f1f' }}>
                    <button onClick={logout} style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        gap: 12, padding: '11px 20px', borderRadius: 8,
                        background: 'transparent', border: 'none',
                        color: '#666', fontSize: 14, cursor: 'pointer',
                    }}
                            onMouseOver={e => e.currentTarget.style.color = '#fff'}
                            onMouseOut={e => e.currentTarget.style.color = '#666'}
                    >
                        <span>→</span> Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ marginLeft: 260, flex: 1, padding: '36px 40px', minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    );
}