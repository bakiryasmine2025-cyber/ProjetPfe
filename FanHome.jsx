import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
    {
        key: 'HOMME',
        titre: 'HOMME',
        sousTitre: 'Chaussures · Vêtements · Accessoires',
        image: '/assets/HOME/chaussures/puma-chaussures-rebound-v6-low.jpg',
        btnLabel: 'Voir la collection Homme',
        filter: 'HOMME',
        align: 'left',
    },
    {
        key: 'FEMME',
        titre: 'FEMME',
        sousTitre: 'Chaussures · Vêtements · Claquettes · Accessoires',
        image: '/assets/FEMME/chaussure/puma-chaussures-carina-30.jpg',
        bg: '#2d1515',
        btnLabel: 'Voir la collection Femme',
        filter: 'FEMME',
        align: 'right',
    },
];

const SOUS_CATEGORIES = [
    {
        label: 'Chaussures Homme',
        image: '/assets/HOME/chaussures/puma-chaussures-rebound-v6-low.jpg',
        filter: 'HOMME_CHAUSSURE',
        bg: '#111',
    },
    {
        label: 'Chaussures Femme',
        image: '/assets/FEMME/chaussure/puma-chaussures-carina-30.jpg',
        filter: 'FEMME_CHAUSSURE',
        bg: '#c0392b',
    },
    {
        label: 'Vêtements',
        image: '/assets/HOME/t-shirt/tshirt.jpg',
        filter: 'HOMME_VETEMENT',
        bg: '#1a2744',
    },
    {
        label: 'Accessoires',
        image: '/assets/HOME/accesoire/accessoire.jpg',
        filter: 'HOMME_ACCESSOIRE',
        bg: '#1e5631',
    },
];

const PRODUITS_PROMO = [
    {
        id: '1',
        nom: 'Puma Rebound V6 Low',
        prix: 129.90,
        prixOrig: 199.90,
        image: '/assets/HOME/chaussures/chaussure-nike-revolution-7-gs.jpg',
    },
    {
        id: '2',
        nom: 'Puma Smash 3.0 L',
        prix: 109.90,
        prixOrig: 169.90,
        image: '/assets/HOME/chaussures/puma-chaussures-smash-30-l.webp',
    },
    {
        id: '3',
        nom: 'US Polo Franco Navy',
        prix: 149.90,
        prixOrig: 229.90,
        image: '/assets/HOME/chaussures/us-polo-chaussures-franco.webp',
    },
    {
        id: '4',
        nom: 'US Polo Pena Blanc',
        prix: 139.90,
        prixOrig: 199.90,
        image: '/assets/HOME/chaussures/us-polo-chaussures-pena.webp',
    },
];

const calcReduction = (prix, prixOrig) =>
    prixOrig ? Math.round((1 - prix / prixOrig) * 100) : 0;

// Placeholder SVG affiché si l'image est introuvable
const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23bbb' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E`;

export default function FanHome() {
    const navigate = useNavigate();
    const [hov, setHov]         = useState(null);
    const [hovPromo, setHovPromo] = useState(null);
    const [hovSous, setHovSous]   = useState(null);

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

            {/* ── HERO — 2 grandes sections HOMME / FEMME ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {SECTIONS.map(s => (
                    <div
                        key={s.key}
                        onClick={() => navigate('/fan/shop', { state: { filterCategorie: s.filter } })}
                        onMouseEnter={() => setHov(s.key)}
                        onMouseLeave={() => setHov(null)}
                        style={{
                            position: 'relative',
                            height: 480,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: s.bg,
                        }}
                    >
                        <img
                            src={s.image}
                            alt={s.titre}
                            style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                opacity: 0.7,
                                transition: 'transform 0.5s, opacity 0.3s',
                                transform: hov === s.key ? 'scale(1.06)' : 'scale(1)',
                            }}
                            onError={e => { e.currentTarget.src = PLACEHOLDER; }}
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: s.align === 'left'
                                ? 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 100%)'
                                : 'linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 100%)',
                        }} />
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '40px 48px',
                            alignItems: s.align === 'left' ? 'flex-start' : 'flex-end',
                        }}>
                            <div style={{
                                fontSize: 11, color: 'rgba(255,255,255,0.7)',
                                letterSpacing: 3, textTransform: 'uppercase',
                                fontWeight: 700, marginBottom: 12,
                            }}>Collection 2025</div>
                            <h2 style={{
                                fontSize: 56, fontWeight: 900, color: '#fff',
                                margin: '0 0 12px', letterSpacing: -2, lineHeight: 1,
                            }}>{s.titre}</h2>
                            <p style={{
                                fontSize: 14, color: 'rgba(255,255,255,0.8)',
                                marginBottom: 28, fontWeight: 500,
                                textAlign: s.align === 'right' ? 'right' : 'left',
                            }}>{s.sousTitre}</p>
                            <button style={{
                                padding: '13px 28px',
                                background: hov === s.key ? '#E63030' : '#fff',
                                color: hov === s.key ? '#fff' : '#111',
                                border: 'none', borderRadius: 4,
                                fontWeight: 800, fontSize: 13,
                                cursor: 'pointer', letterSpacing: 0.5,
                                textTransform: 'uppercase',
                                transition: 'all 0.2s',
                            }}>{s.btnLabel}</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── SOUS-CATÉGORIES ── */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 0' }}>
                <h2 style={{
                    fontSize: 22, fontWeight: 900, color: '#111',
                    marginBottom: 24, letterSpacing: -0.5,
                    textTransform: 'uppercase',
                }}>Nos Catégories</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {SOUS_CATEGORIES.map(c => (
                        <div
                            key={c.label}
                            onClick={() => navigate('/fan/shop', { state: { filterCategorie: c.filter } })}
                            onMouseEnter={() => setHovSous(c.label)}
                            onMouseLeave={() => setHovSous(null)}
                            style={{
                                position: 'relative',
                                height: 200,
                                borderRadius: 10,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                background: c.bg,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                transform: hovSous === c.label ? 'translateY(-4px)' : 'none',
                                boxShadow: hovSous === c.label
                                    ? '0 16px 32px rgba(0,0,0,0.18)'
                                    : '0 2px 8px rgba(0,0,0,0.08)',
                            }}
                        >
                            <img
                                src={c.image}
                                alt={c.label}
                                style={{
                                    position: 'absolute', inset: 0,
                                    width: '100%', height: '100%',
                                    objectFit: 'cover', opacity: 0.65,
                                    transition: 'transform 0.4s',
                                    transform: hovSous === c.label ? 'scale(1.08)' : 'scale(1)',
                                }}
                                onError={e => { e.currentTarget.src = PLACEHOLDER; }}
                            />
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                            }} />
                            <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                                <div style={{
                                    fontSize: 16, fontWeight: 800,
                                    color: '#fff', letterSpacing: 0.5,
                                }}>{c.label}</div>
                                <div style={{
                                    fontSize: 11, color: 'rgba(255,255,255,0.7)',
                                    marginTop: 3, fontWeight: 600,
                                    textTransform: 'uppercase', letterSpacing: 1,
                                }}>Voir →</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SECTION PROMO ── */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 0' }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 24,
                }}>
                    <div>
                        <h2 style={{
                            fontSize: 22, fontWeight: 900, color: '#111',
                            margin: '0 0 4px', letterSpacing: -0.5,
                            textTransform: 'uppercase',
                        }}>🔥 Promotions</h2>
                        <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
                            Offres limitées — ne ratez pas !
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/fan/shop', { state: { filterCategorie: 'PROMO' } })}
                        style={{
                            padding: '9px 20px', border: '1.5px solid #111',
                            background: '#fff', borderRadius: 4,
                            fontWeight: 700, fontSize: 13, cursor: 'pointer',
                            textTransform: 'uppercase', letterSpacing: 0.5,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#111'; }}
                    >Voir tout →</button>
                </div>

                {/* Grille produits promo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    {PRODUITS_PROMO.map(p => (
                        <div
                            key={p.id}
                            onMouseEnter={() => setHovPromo(p.id)}
                            onMouseLeave={() => setHovPromo(null)}
                            onClick={() => navigate('/fan/shop', { state: { filterCategorie: 'PROMO' } })}
                            style={{
                                background: '#fff', borderRadius: 8, overflow: 'hidden',
                                cursor: 'pointer',
                                border: hovPromo === p.id ? '1.5px solid #111' : '1.5px solid #eee',
                                transition: 'all 0.2s',
                                transform: hovPromo === p.id ? 'translateY(-4px)' : 'none',
                                boxShadow: hovPromo === p.id
                                    ? '0 12px 28px rgba(0,0,0,0.1)'
                                    : '0 2px 6px rgba(0,0,0,0.04)',
                            }}
                        >
                            {/* Zone image */}
                            <div style={{
                                position: 'relative',
                                background: '#f8f8f8',
                                aspectRatio: '1',
                                overflow: 'hidden',
                            }}>
                                <img
                                    src={p.image}
                                    alt={p.nom}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',   /* contain → image complète visible */
                                        padding: '12px',
                                        transition: 'transform 0.3s',
                                        transform: hovPromo === p.id ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                    onError={e => { e.currentTarget.src = PLACEHOLDER; }}
                                />
                                {/* Badge réduction */}
                                <div style={{
                                    position: 'absolute', top: 10, left: 10,
                                    background: '#E63030', color: '#fff',
                                    padding: '4px 10px', borderRadius: 3,
                                    fontWeight: 900, fontSize: 13,
                                }}>-{calcReduction(p.prix, p.prixOrig)}%</div>
                                {/* Badge PROMO */}
                                <div style={{
                                    position: 'absolute', top: 10, right: 10,
                                    background: '#1a2744', color: '#fff',
                                    padding: '3px 8px', borderRadius: 3,
                                    fontWeight: 700, fontSize: 10,
                                    textTransform: 'uppercase', letterSpacing: 0.5,
                                }}>PROMO !</div>
                            </div>

                            {/* Infos produit */}
                            <div style={{ padding: '14px 14px 6px' }}>
                                <h3 style={{
                                    fontSize: 13, fontWeight: 700, color: '#111',
                                    margin: '0 0 10px', lineHeight: 1.3,
                                }}>{p.nom}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 17, fontWeight: 900, color: '#E63030' }}>
                                        {p.prix.toFixed(2)} TND
                                    </span>
                                    <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>
                                        {p.prixOrig.toFixed(2)} TND
                                    </span>
                                </div>
                                {/* Étoiles */}
                                <div style={{ marginTop: 6, display: 'flex', gap: 1, alignItems: 'center' }}>
                                    {'★★★★★'.split('').map((s, i) => (
                                        <span key={i} style={{ color: '#f59e0b', fontSize: 11 }}>{s}</span>
                                    ))}
                                    <span style={{ fontSize: 10, color: '#bbb', marginLeft: 4 }}>(0)</span>
                                </div>
                            </div>

                            {/* Bouton panier */}
                            <div style={{ padding: '10px 14px 14px' }}>
                                <div style={{
                                    padding: '10px 0', textAlign: 'center',
                                    background: hovPromo === p.id ? '#1a2744' : '#f5f5f5',
                                    color: hovPromo === p.id ? '#fff' : '#111',
                                    borderRadius: 4, fontWeight: 700, fontSize: 12,
                                    textTransform: 'uppercase', letterSpacing: 0.5,
                                    transition: 'all 0.2s',
                                }}>
                                    AJOUTER AU PANIER
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── BANNER LIVRAISON ── */}
            <div style={{ marginTop: 56, background: '#1a2744', padding: '28px 24px' }}>
                <div style={{
                    maxWidth: 1280, margin: '0 auto',
                    display: 'flex', justifyContent: 'space-around',
                    flexWrap: 'wrap', gap: 20,
                }}>
                    {[
                        { icon: '🚚', text: 'Livraison rapide 2-3 jours' },
                        { icon: '🔁', text: 'Retour sous 30 jours' },
                        { icon: '🛡️', text: 'Paiement 100% sécurisé' },
                        { icon: '📞', text: 'Support 99 99 10 48' },
                    ].map(item => (
                        <div key={item.text} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            color: '#fff',
                        }}>
                            <span style={{ fontSize: 22 }}>{item.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}