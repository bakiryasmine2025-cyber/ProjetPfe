import { useState } from 'react';
import { Link } from 'react-router-dom';

// ── Data ──────────────────────────────────────────
const features = [
    {  title: 'Gestion des Joueurs',     desc: 'Gérez les profils, statistiques et performances de tous les joueurs inscrits.' },
    {  title: 'Compétitions & Tournois', desc: 'Organisez les championnats, coupes et tournois avec classements en temps réel.' },
    {  title: 'Calendrier des Matchs',   desc: 'Planifiez et suivez tous les matchs, entraînements et événements sportifs.' },
    {  title: 'Messagerie Intégrée',     desc: 'Communication directe entre joueurs, entraîneurs et administrateurs.' },
    {  title: 'Gestion des Clubs',       desc: 'Administrez les clubs affiliés avec leurs effectifs et informations.' },
    {  title: 'Statistiques Avancées',   desc: 'Tableaux de bord analytiques pour suivre les performances et tendances.' },
];

const stats = [
    { value: '24+',  label: 'Clubs Affiliés' },
    { value: '500+', label: 'Joueurs Enregistrés' },
    { value: '150+', label: 'Matchs par Saison' },
    { value: '12',   label: 'Régions Couvertes' },
];

const news = [
    {
        tag: 'Compétition', tagColor: '#E63030',
        title: 'Championnat National 2025 : Les résultats de la 5ème journée',
        desc: 'Retour sur les matchs décisifs du week-end avec des résultats surprenants en première division.',
        date: '14 Mars 2025', img: null,
    },
    {
        tag: 'Formation', tagColor: '#E63030',
        title: 'Stage de perfectionnement pour les jeunes espoirs',
        desc: 'Un programme intensif de 2 semaines pour les U18 sélectionnés dans toutes les régions.',
        date: '10 Mars 2025',
        img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
    },
    {
        tag: 'International', tagColor: '#E63030',
        title: "La Tunisie qualifiée pour la Coupe d'Afrique 2025",
        desc: "L'équipe nationale confirme sa place parmi les meilleures nations africaines de rugby.",
        date: '8 Mars 2025',
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    },
];

const footerLinks = {
    'LIENS RAPIDES': ['Accueil', 'Fonctionnalités', 'Actualités', 'À Propos', 'FAQ'],
    'PLATEFORME':    ['Gestion Joueurs', 'Compétitions', 'Messagerie', 'Statistiques', 'Administration'],
};

// ── Navbar ────────────────────────────────────────
function Navbar() {
    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: '#1a1a2e',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px', height: 68,
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: '#E63030', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 900, color: '#fff'
                }}>🏉</div>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>
                    RUGBY TUNISIE
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
                {/* ✅ Liens anchor normaux */}
                {['Accueil', 'Fonctionnalités', 'Statistiques', 'Actualités'].map(item => (
                    <a key={item} href={`#${item.toLowerCase()}`} style={{
                        color: '#ccc', textDecoration: 'none',
                        fontSize: 14, fontWeight: 500, transition: 'color 0.2s'
                    }}
                       onMouseOver={e => e.target.style.color = '#fff'}
                       onMouseOut={e => e.target.style.color = '#ccc'}
                    >{item}</a>
                ))}

                {/* ✅ Contact → Link vers /contact */}
                <Link to="/contact" style={{
                    color: '#ccc', textDecoration: 'none',
                    fontSize: 14, fontWeight: 500, transition: 'color 0.2s'
                }}
                      onMouseOver={e => e.target.style.color = '#fff'}
                      onMouseOut={e => e.target.style.color = '#ccc'}
                >
                    Contact
                </Link>

                <Link to="/login" style={{
                    background: '#E63030', color: '#fff',
                    padding: '9px 22px', borderRadius: 8,
                    textDecoration: 'none', fontWeight: 700, fontSize: 14
                }}>
                    Se connecter
                </Link>
            </div>
        </nav>
    );
}

// ── Register Modal ────────────────────────────────
function RegisterModal({ onClose }) {
    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
             onClick={onClose}
        >
            <div style={{
                background: '#fff', borderRadius: 20,
                padding: '40px 36px', width: 480,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
                 onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: '#E63030', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, color: '#fff'
                        }}>🏉</div>
                        <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>
                            RUGBY TUNISIE
                        </span>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none',
                        fontSize: 22, cursor: 'pointer', color: '#999', lineHeight: 1
                    }}>×</button>
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', marginBottom: 6, marginTop: 16 }}>
                    Créer un compte
                </h2>
                <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
                    Choisissez votre type de compte pour rejoindre la plateforme
                </p>

                <Link to="/register/federation" onClick={onClose} style={{ textDecoration: 'none' }}>
                    <div style={{
                        border: '2px solid #E63030', borderRadius: 14, padding: '22px 24px',
                        marginBottom: 16, cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: 16, background: '#fff'
                    }}
                         onMouseOver={e => { e.currentTarget.style.background = '#E63030'; }}
                         onMouseOut={e => { e.currentTarget.style.background = '#fff'; }}
                    >
                        <div style={{
                            width: 52, height: 52, borderRadius: 12,
                            background: '#fef2f2', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                        }}>🏛️</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: '#111', marginBottom: 4 }}>
                                Administrateur Fédération
                            </div>
                            <div style={{ fontSize: 13, color: '#888', lineHeight: 1.4 }}>
                                Gérez les clubs, compétitions, saisons et partenaires de la fédération nationale.
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', color: '#E63030', fontSize: 20, fontWeight: 700 }}>›</div>
                    </div>
                </Link>

                <Link to="/register/club" onClick={onClose} style={{ textDecoration: 'none' }}>
                    <div style={{
                        border: '2px solid #e0e0e0', borderRadius: 14, padding: '22px 24px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: 16, background: '#fff'
                    }}
                         onMouseOver={e => { e.currentTarget.style.border = '2px solid #111'; e.currentTarget.style.background = '#111'; }}
                         onMouseOut={e => { e.currentTarget.style.border = '2px solid #e0e0e0'; e.currentTarget.style.background = '#fff'; }}
                    >
                        <div style={{
                            width: 52, height: 52, borderRadius: 12,
                            background: '#f5f5f5', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                        }}>🛡️</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: '#111', marginBottom: 4 }}>
                                Administrateur Club
                            </div>
                            <div style={{ fontSize: 13, color: '#888', lineHeight: 1.4 }}>
                                Gérez les joueurs, équipes et effectifs de votre club affilié.
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', color: '#888', fontSize: 20, fontWeight: 700 }}>›</div>
                    </div>
                </Link>

                <div style={{
                    marginTop: 20, padding: '12px 16px', background: '#fffbeb',
                    borderRadius: 10, border: '1px solid #fde68a',
                    display: 'flex', alignItems: 'flex-start', gap: 10
                }}>
                    <span style={{ fontSize: 16 }}>ℹ️</span>
                    <p style={{ fontSize: 12, color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                        Votre compte sera en attente d'activation par le Super Administrateur après votre inscription.
                    </p>
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }}>
                    Déjà un compte ?{' '}
                    <Link to="/login" onClick={onClose} style={{ color: '#E63030', fontWeight: 700, textDecoration: 'none' }}>
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────
export default function LandingPage() {
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff' }}>
            <Navbar />

            {showRegisterModal && (
                <RegisterModal onClose={() => setShowRegisterModal(false)} />
            )}

            {/* ══ HERO ══ */}
            <section style={{
                position: 'relative', minHeight: '100vh',
                display: 'flex', alignItems: 'center',
                overflow: 'hidden', paddingTop: 68
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(10,10,20,0.92) 45%, rgba(10,10,20,0.5) 100%)',
                    zIndex: 1
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(/assets/match.jpg)`,
                    backgroundSize: 'cover', backgroundPosition: 'center right',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(230,48,48,0.2)', border: '1px solid rgba(230,48,48,0.5)',
                        borderRadius: 999, padding: '8px 18px', fontSize: 13, color: '#fff', marginBottom: 28
                    }}>
                        🏉 Fédération Tunisienne de Rugby
                    </div>

                    <h1 style={{
                        color: '#fff', fontSize: 'clamp(36px, 4.5vw, 64px)',
                        fontWeight: 900, lineHeight: 1.1, marginBottom: 24, maxWidth: 600
                    }}>
                        Gérez le rugby{' '}
                        <span style={{ color: '#E63030' }}>tunisien</span>{' '}
                        comme jamais auparavant
                    </h1>

                    <p style={{ color: '#bbb', fontSize: 18, lineHeight: 1.7, maxWidth: 520, marginBottom: 40 }}>
                        La plateforme complète pour la gestion des équipes, joueurs,
                        compétitions et événements du rugby en Tunisie.
                    </p>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowRegisterModal(true)}
                            style={{
                                background: '#E63030', color: '#fff', padding: '15px 32px',
                                borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 8
                            }}
                        >
                            Commencer maintenant ›
                        </button>
                        <Link to="/login" style={{
                            background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.3)',
                            color: '#fff', padding: '15px 32px', borderRadius: 10,
                            textDecoration: 'none', fontWeight: 600, fontSize: 16
                        }}>
                            Se connecter
                        </Link>
                    </div>

                    <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
                        {[
                            {  title: 'Espace Federation', sub: 'Gérer clubs & compétitions' },
                            {  title: 'Espace Club',        sub: 'Gérer joueurs & équipes' },
                        ].map(c => (
                            <button key={c.title} onClick={() => setShowRegisterModal(true)} style={{
                                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center',
                                gap: 12, cursor: 'pointer', color: '#fff', transition: 'background 0.2s', textAlign: 'left'
                            }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            >
                                <span style={{ fontSize: 22 }}>{c.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{c.title}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{c.sub}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FONCTIONNALITÉS ══ */}
            <section id="fonctionnalités" style={{ background: '#f5f5f5', padding: '80px 40px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <p style={{ color: '#E63030', fontWeight: 700, fontSize: 12, letterSpacing: 3, marginBottom: 12 }}>
                            FONCTIONNALITÉS
                        </p>
                        <h2 style={{ fontSize: 42, fontWeight: 900, color: '#111', marginBottom: 16 }}>
                            Tout ce dont vous avez besoin
                        </h2>
                        <p style={{ color: '#666', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
                            Une suite complète d'outils pour digitaliser et moderniser la gestion du rugby en Tunisie.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {features.map((f) => (
                            <div key={f.title} style={{
                                background: '#fff', border: '1px solid #eee',
                                borderRadius: 16, padding: '32px 28px',
                                transition: 'box-shadow 0.2s', cursor: 'default',
                                height: '100%', boxSizing: 'border-box'
                            }}
                                 onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'}
                                 onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div style={{
                                    width: 52, height: 52, borderRadius: 12, background: '#fef2f2',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 22, marginBottom: 20
                                }}>{f.icon}</div>
                                <h3 style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 10 }}>{f.title}</h3>
                                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ STATS ══ */}
            <section id="statistiques" style={{ background: '#E63030', padding: '70px 40px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', color: '#fff', fontSize: 36, fontWeight: 900, marginBottom: 56 }}>
                        Le Rugby Tunisien en Chiffres
                    </h2>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        borderLeft: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {stats.map((s) => (
                            <div key={s.label} style={{
                                textAlign: 'center', padding: '32px 20px',
                                borderRight: '1px solid rgba(255,255,255,0.2)',
                                borderBottom: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <div style={{ fontSize: 'clamp(48px, 5vw, 72px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                                    {s.value}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, letterSpacing: 1, marginTop: 8 }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ ACTUALITÉS ══ */}
            <section id="actualités" style={{ background: '#f5f5f5', padding: '80px 40px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                        <div>
                            <p style={{ color: '#E63030', fontWeight: 700, fontSize: 12, letterSpacing: 3, marginBottom: 8 }}>ACTUALITÉS</p>
                            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#111' }}>Dernières Nouvelles</h2>
                        </div>
                        <a href="#" style={{ color: '#E63030', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>Voir tout →</a>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {news.map((n, i) => (
                            <div key={i} style={{
                                background: '#fff', borderRadius: 16, overflow: 'hidden',
                                border: '1px solid #eee', cursor: 'pointer', transition: 'box-shadow 0.2s'
                            }}
                                 onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)'}
                                 onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div style={{ position: 'relative', height: 220, background: n.img ? 'none' : '#f0f0f0', overflow: 'hidden' }}>
                                    {n.img && <img src={n.img} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    <span style={{
                                        position: 'absolute', top: 14, left: 14,
                                        background: n.tagColor, color: '#fff',
                                        padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700
                                    }}>{n.tag}</span>
                                </div>
                                <div style={{ padding: '20px 24px 24px' }}>
                                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111', lineHeight: 1.4, marginBottom: 10 }}>{n.title}</h3>
                                    <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{n.desc}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#999', fontSize: 13 }}>
                                        🕐 {n.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ══ */}
            <footer style={{ background: '#1a1a2e', padding: '60px 40px 30px' }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto',
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                    gap: 48, marginBottom: 48
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E63030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏉</div>
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>RUGBY TUNISIE</span>
                        </div>
                        <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, maxWidth: 260, marginBottom: 24 }}>
                            La plateforme officielle de gestion du rugby en Tunisie. Digitaliser le sport pour un avenir meilleur.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {['f', 'ig', 'tw'].map((s) => (
                                <div key={s} style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#aaa', fontSize: 14, fontWeight: 700
                                }}>{s}</div>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 style={{ color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: 2, marginBottom: 20 }}>{title}</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {links.map(link => (
                                    <li key={link} style={{ marginBottom: 12 }}>
                                        <a href="#" style={{ color: '#888', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                                           onMouseOver={e => e.target.style.color = '#fff'}
                                           onMouseOut={e => e.target.style.color = '#888'}
                                        >{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h4 style={{ color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: 2, marginBottom: 20 }}>CONTACT</h4>
                        {[
                            { icon: '📍', text: 'Tunis, Tunisie' },
                            { icon: '📞', text: '+216 71 000 000' },
                            { icon: '✉️', text: 'contact@rugbytunisie.tn' },
                        ].map((c) => (
                            <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                <span style={{ fontSize: 16 }}>{c.icon}</span>
                                <span style={{ color: '#888', fontSize: 14 }}>{c.text}</span>
                            </div>
                        ))}
                        {/* ✅ Lien contact dans le footer */}
                        <Link to="/contact" style={{
                            display: 'inline-block', marginTop: 8,
                            color: '#E63030', fontWeight: 700, fontSize: 13,
                            textDecoration: 'none'
                        }}>
                            Contactez-nous →
                        </Link>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: 24, textAlign: 'center', color: '#555', fontSize: 13
                }}>
                    © 2025 Fédération Tunisienne de Rugby. Tous droits réservés.
                </div>
            </footer>
        </div>
    );
}