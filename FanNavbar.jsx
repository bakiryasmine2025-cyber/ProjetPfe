import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CART_KEY = 'rugby_cart';

const NAV_ITEMS = [
    {
        label: 'HOMME',
        sous: [
            { label: 'Chaussures',  filter: 'HOMME_CHAUSSURE'  },
            { label: 'Claquettes',  filter: 'HOMME_CLAQUETTE'  },
            { label: 'Vêtements',   filter: 'HOMME_VETEMENT'   },
            { label: 'Accessoires', filter: 'HOMME_ACCESSOIRE' },
        ],
    },
    {
        label: 'FEMME',
        sous: [
            { label: 'Chaussures',  filter: 'FEMME_CHAUSSURE'  },
            { label: 'Claquettes',  filter: 'FEMME_CLAQUETTE'  },
            { label: 'Vêtements',   filter: 'FEMME_VETEMENT'   },
            { label: 'Accessoires', filter: 'FEMME_ACCESSOIRE' },
        ],
    },
    {
        label: 'PROMO',
        promo: true,
        sous: [],
    },
];

export default function FanNavbar() {
    const navigate   = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const timerRef   = useRef(null);

    // Lire le panier depuis localStorage
    useEffect(() => {
        const updateCart = () => {
            try {
                const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
                const total = cart.reduce((s, i) => s + (parseInt(i.qty) || 0), 0);
                setCartCount(total);
            } catch { setCartCount(0); }
        };
        updateCart();
        // Écouter les changements localStorage
        window.addEventListener('storage', updateCart);
        // Refresh toutes les secondes
        const interval = setInterval(updateCart, 1000);
        return () => {
            window.removeEventListener('storage', updateCart);
            clearInterval(interval);
        };
    }, []);

    const handleMouseEnter = (label) => {
        clearTimeout(timerRef.current);
        setOpenMenu(label);
    };
    const handleMouseLeave = () => {
        timerRef.current = setTimeout(() => setOpenMenu(null), 150);
    };

    const goTo = (filter) => {
        setOpenMenu(null);
        navigate('/fan/shop', { state: { filterCategorie: filter } });
    };

    return (
        <>
            {/* ── Bande supérieure bleue ── */}
            <div style={{
                background: '#1a2744',
                color: '#fff',
                textAlign: 'center',
                padding: '9px 24px',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 0.3,
            }}>
                Nous appelez : <strong>99 99 10 48</strong> / <strong>99 99 10 32</strong> / <strong>99 80 77 95</strong>
            </div>

            {/* ── Navbar principale ── */}
            <nav style={{
                background: '#fff',
                borderBottom: '1px solid #e8e8e8',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
                <div style={{
                    maxWidth: 1280, margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex', alignItems: 'center',
                    height: 64, gap: 8,
                }}>

                    {/* ── Logo NEW badge ── */}
                    <div onClick={() => navigate('/fan/home')} style={{
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 10,
                        marginRight: 20, flexShrink: 0,
                    }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                background: '#E63030',
                                color: '#fff',
                                fontWeight: 900,
                                fontSize: 13,
                                padding: '6px 12px',
                                borderRadius: 4,
                                letterSpacing: 1,
                            }}>NEW</div>
                            {/* Triangle bas */}
                            <div style={{
                                position: 'absolute',
                                bottom: -7, left: '50%',
                                transform: 'translateX(-50%)',
                                width: 0, height: 0,
                                borderLeft: '7px solid transparent',
                                borderRight: '7px solid transparent',
                                borderTop: '7px solid #E63030',
                            }} />
                        </div>
                    </div>

                    {/* ── Nav links ── */}
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        {NAV_ITEMS.map(item => (
                            <div
                                key={item.label}
                                onMouseEnter={() => handleMouseEnter(item.label)}
                                onMouseLeave={handleMouseLeave}
                                style={{ position: 'relative' }}
                            >
                                <button
                                    onClick={() => item.promo ? goTo('PROMO') : goTo(item.label)}
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                        fontSize: 14,
                                        fontWeight: openMenu === item.label ? 700 : 600,
                                        color: item.promo ? '#E63030' : '#222',
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        letterSpacing: 0.3,
                                        borderBottom: openMenu === item.label
                                            ? '2.5px solid #E63030'
                                            : '2.5px solid transparent',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = item.promo ? '#c0392b' : '#111'}
                                    onMouseLeave={e => e.currentTarget.style.color = item.promo ? '#E63030' : '#222'}
                                >
                                    {item.label}
                                    {item.sous.length > 0 && (
                                        <span style={{ fontSize: 9, color: '#4caf50', fontWeight: 900 }}>▼</span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {item.sous.length > 0 && openMenu === item.label && (
                                    <div
                                        onMouseEnter={() => handleMouseEnter(item.label)}
                                        onMouseLeave={handleMouseLeave}
                                        style={{
                                            position: 'absolute',
                                            top: '100%', left: 0,
                                            background: '#fff',
                                            border: '1px solid #e8e8e8',
                                            borderTop: '3px solid #E63030',
                                            borderRadius: '0 0 8px 8px',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            minWidth: 180,
                                            zIndex: 2000,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {item.sous.map((s, i) => (
                                            <div
                                                key={s.filter}
                                                onClick={() => goTo(s.filter)}
                                                style={{
                                                    padding: '12px 20px',
                                                    fontSize: 14, fontWeight: 500, color: '#333',
                                                    cursor: 'pointer',
                                                    borderBottom: i < item.sous.length - 1 ? '1px solid #f5f5f5' : 'none',
                                                    transition: 'all 0.1s',
                                                    display: 'flex', alignItems: 'center', gap: 10,
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.background = '#fef2f2';
                                                    e.currentTarget.style.color = '#E63030';
                                                    e.currentTarget.style.paddingLeft = '24px';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.background = '#fff';
                                                    e.currentTarget.style.color = '#333';
                                                    e.currentTarget.style.paddingLeft = '20px';
                                                }}
                                            >
                                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E63030', flexShrink: 0 }} />
                                                {s.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Icônes droite ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {/* Recherche */}
                        <button onClick={() => navigate('/fan/shop')} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '8px 10px', fontSize: 20, color: '#444', borderRadius: 6,
                        }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >🔍</button>

                        {/* Profil */}
                        <button onClick={() => navigate('/fan/home')} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '8px 10px', fontSize: 20, color: '#444', borderRadius: 6,
                        }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >👤</button>

                        {/* Panier */}
                        <button onClick={() => navigate('/fan/panier')} style={{
                            position: 'relative', background: 'none', border: 'none',
                            cursor: 'pointer', padding: '8px 10px',
                            fontSize: 20, color: '#444', borderRadius: 6,
                        }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            🛒
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: 0, right: 0,
                                    background: '#1a2744', color: '#fff',
                                    borderRadius: '50%', width: 18, height: 18,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 10, fontWeight: 800,
                                }}>{cartCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}