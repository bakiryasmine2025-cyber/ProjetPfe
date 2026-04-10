import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CART_KEY  = 'rugby_cart';
const LIVRAISON = 8.00;

const getQty   = (i) => parseInt(i.qty   ?? i.quantite) || 1;
const getPrice = (i) => parseFloat(i.price ?? i.prix)   || 0;
const getName  = (i) => i.name ?? i.nom  ?? '';
const getImage = (i) => i.image ?? i.urlImage ?? '';

const BORDER = '1px solid #d4edda';
const GREEN  = '#4caf50';

const VILLES_TUNISIE = [
    'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana',
    'Gafsa', 'Monastir', 'Ben Arous', 'Kasserine', 'Médenine', 'Nabeul',
    'Tataouine', 'Béja', 'Jendouba', 'Mahdia', 'Siliana', 'Zaghouan',
    'Kebili', 'Tozeur', 'Manouba', 'Kef', 'Sidi Bouzid',
];

export default function Checkout() {
    const navigate    = useNavigate();
    const { user }    = useAuth();

    const [cart, setCart]           = useState([]);
    const [activeTab, setActiveTab] = useState('client'); // 'identifier' | 'creer' | 'client'
    const [codePromo, setCodePromo] = useState('');
    const [commentaire, setComment] = useState('');
    const [acceptCGU, setAcceptCGU] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [promoApplied, setPromoApplied] = useState(false);
    const [reduction, setReduction] = useState(0);

    // Formulaire adresse
    const [adresse, setAdresse] = useState({
        adresse: '', ville: '', telephone: '', telephonePortable: '',
        autreAdresseFacture: false,
    });

    // Formulaire connexion
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    // Formulaire création compte
    const [registerForm, setRegisterForm] = useState({
        prenom: '', nom: '', email: '', password: '',
    });

    // Formulaire commande client (déjà connecté)
    const [clientForm, setClientForm] = useState({
        prenom: user?.prenom || user?.nom?.split(' ')[0] || '',
        nom:    user?.nom    || '',
        email:  user?.email  || '',
    });

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(CART_KEY)) || [];
            setCart(saved);
        } catch { setCart([]); }
    }, []);

    const updateQty = (id, delta) => {
        const updated = cart.map(i => {
            if (i.id !== id) return i;
            const next = Math.max(1, getQty(i) + delta);
            return { ...i, qty: next, quantite: next };
        });
        setCart(updated);
        try { localStorage.setItem(CART_KEY, JSON.stringify(updated)); } catch {}
    };

    const removeItem = (id) => {
        const updated = cart.filter(i => i.id !== id);
        setCart(updated);
        try { localStorage.setItem(CART_KEY, JSON.stringify(updated)); } catch {}
    };

    const appliquerPromo = () => {
        const code = codePromo.trim().toUpperCase();
        if (code === 'RUGBY10') { setReduction(10); setPromoApplied(true); }
        else if (code === 'SPORT20') { setReduction(20); setPromoApplied(true); }
        else alert('Code de réduction invalide');
    };

    const sousTotal  = cart.reduce((s, i) => s + getPrice(i) * getQty(i), 0);
    const remise     = (sousTotal * reduction) / 100;
    const totalTTC   = sousTotal - remise + (cart.length > 0 ? LIVRAISON : 0);
    const nbArticles = cart.reduce((s, i) => s + getQty(i), 0);

    const terminerCommande = () => {
        if (!acceptCGU) { alert("Veuillez accepter les conditions d'utilisation"); return; }
        if (!adresse.adresse || !adresse.ville || !adresse.telephone) {
            alert('Veuillez remplir tous les champs obligatoires (Adresse, Ville, Téléphone)');
            return;
        }
        setConfirmed(true);
        try { localStorage.setItem(CART_KEY, JSON.stringify([])); } catch {}
    };

    // ── Styles communs ──────────────────────────────────────────────────────
    const cardStyle = {
        background: '#fff', border: BORDER, borderRadius: 8, overflow: 'hidden', marginBottom: 0,
    };
    const cardHeaderStyle = {
        background: '#f8fff8', borderBottom: BORDER,
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
        fontWeight: 800, fontSize: 15, color: '#111',
    };
    const inputStyle = {
        width: '100%', padding: '10px 14px',
        border: '1px solid #ddd', borderRadius: 4,
        fontSize: 13, outline: 'none', boxSizing: 'border-box',
    };
    const labelStyle = {
        fontSize: 13, color: '#555', fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 4,
    };
    const rowStyle = {
        display: 'grid', gridTemplateColumns: '160px 1fr',
        alignItems: 'center', gap: 12, marginBottom: 16,
    };

    // ── Page confirmation ────────────────────────────────────────────────────
    if (confirmed) {
        return (
            <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111', marginBottom: 12 }}>
                    Commande confirmée !
                </h2>
                <p style={{ color: '#888', fontSize: 15, marginBottom: 32 }}>
                    Merci pour votre commande. Livraison à <strong>{adresse.adresse}, {adresse.ville}</strong> sous 1-2 jours.
                </p>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '24px 28px', marginBottom: 32 }}>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Total payé</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: '#166534' }}>{totalTTC.toFixed(2)} TND</div>
                    <div style={{ fontSize: 13, color: '#166534', marginTop: 8 }}>🚚 Livraison entre 1 et 2 jours ouvrables</div>
                </div>
                <button onClick={() => navigate('/fan/shop')} style={{
                    padding: '14px 40px', background: GREEN, color: '#fff',
                    border: 'none', borderRadius: 4, fontWeight: 800,
                    fontSize: 15, cursor: 'pointer',
                }}>CONTINUER LES ACHATS</button>
            </div>
        );
    }

    // ── Panier vide ──────────────────────────────────────────────────────────
    if (cart.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 12 }}>Panier vide</h2>
                <button onClick={() => navigate('/fan/shop')} style={{
                    padding: '13px 32px', background: GREEN, color: '#fff',
                    border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}>Retour boutique</button>
            </div>
        );
    }

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            {/* Breadcrumb */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '10px 24px', fontSize: 13, color: '#888' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/fan/home')}>Accueil</span>
                <span style={{ margin: '0 6px' }}>›</span>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/fan/panier')}>Panier</span>
                <span style={{ margin: '0 6px' }}>›</span>
                <span style={{ color: '#111', fontWeight: 600 }}>Check Out</span>
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

                    {/* ══ COLONNE GAUCHE ══════════════════════════════════════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* ── Votre compte ── */}
                        <div style={cardStyle}>
                            <div style={cardHeaderStyle}>
                                <span>👤</span> Votre compte
                            </div>

                            {/* Tabs */}
                            <div style={{ display: 'flex', borderBottom: BORDER, background: '#fff' }}>
                                {[
                                    { key: 'identifier', label: "S'identifier" },
                                    { key: 'creer',      label: 'Créer un compte' },
                                    { key: 'client',     label: 'Commande client' },
                                ].map(tab => (
                                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                        flex: 1, padding: '12px 8px',
                                        border: 'none', background: 'none',
                                        fontWeight: activeTab === tab.key ? 800 : 400,
                                        color: activeTab === tab.key ? '#111' : '#4caf50',
                                        fontSize: 13, cursor: 'pointer',
                                        borderBottom: activeTab === tab.key ? '2px solid #111' : '2px solid transparent',
                                        transition: 'all 0.15s',
                                    }}>{tab.label}</button>
                                ))}
                            </div>

                            <div style={{ padding: '20px' }}>
                                {/* ── S'identifier ── */}
                                {activeTab === 'identifier' && (
                                    <div>
                                        <div style={rowStyle}>
                                            <label style={labelStyle}>Email <span style={{ color: 'red' }}>*</span></label>
                                            <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} style={inputStyle} />
                                        </div>
                                        <div style={rowStyle}>
                                            <label style={labelStyle}>Mot de passe <span style={{ color: 'red' }}>*</span></label>
                                            <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={inputStyle} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                            <span style={{ fontSize: 13, color: GREEN, cursor: 'pointer' }} onClick={() => navigate('/forgot-password')}>
                                                Mot de passe oublié?
                                            </span>
                                            <button style={{ padding: '11px 28px', background: GREEN, color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                                                SE CONNECTER
                                            </button>
                                        </div>
                                        <div style={{ textAlign: 'center', color: '#888', fontSize: 12, marginBottom: 16, position: 'relative' }}>
                                            <span style={{ background: '#fff', padding: '0 12px', position: 'relative', zIndex: 1 }}>Ou connectez-vous avec</span>
                                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#eee' }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
                                            <button style={{ padding: '10px 20px', background: '#3b5998', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span>f</span> Facebook
                                            </button>
                                            <button style={{ padding: '10px 20px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: '#4285f4', fontWeight: 900 }}>G</span> Google
                                            </button>
                                        </div>
                                        <p style={{ textAlign: 'center', fontSize: 13, color: '#555' }}>
                                            Pas de compte?{' '}
                                            <span style={{ color: GREEN, cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveTab('creer')}>
                                                Créez-en un ici
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {/* ── Créer un compte ── */}
                                {activeTab === 'creer' && (
                                    <div>
                                        <p style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>
                                            Vous avez déjà un compte ?{' '}
                                            <span style={{ color: GREEN, cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveTab('identifier')}>
                                                Connectez-vous plutôt !
                                            </span>
                                        </p>
                                        {[
                                            { label: 'Prénom', key: 'prenom', type: 'text' },
                                            { label: 'Nom de famille', key: 'nom', type: 'text' },
                                            { label: 'Email', key: 'email', type: 'email' },
                                            { label: 'Mot de passe', key: 'password', type: 'password' },
                                        ].map(f => (
                                            <div key={f.key} style={rowStyle}>
                                                <label style={labelStyle}>{f.label} <span style={{ color: 'red' }}>*</span></label>
                                                <input type={f.type} value={registerForm[f.key]} onChange={e => setRegisterForm({...registerForm, [f.key]: e.target.value})} style={inputStyle} />
                                            </div>
                                        ))}
                                        <div style={{ textAlign: 'center', color: '#888', fontSize: 12, margin: '16px 0', position: 'relative' }}>
                                            <span style={{ background: '#fff', padding: '0 12px', position: 'relative', zIndex: 1 }}>Ou connectez-vous avec</span>
                                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#eee' }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                            <button style={{ padding: '10px 20px', background: '#3b5998', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span>f</span> Facebook
                                            </button>
                                            <button style={{ padding: '10px 20px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: '#4285f4', fontWeight: 900 }}>G</span> Google
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── Commande client (déjà connecté) ── */}
                                {activeTab === 'client' && (
                                    <div>
                                        {[
                                            { label: 'Prénom', key: 'prenom', type: 'text' },
                                            { label: 'Nom de famille', key: 'nom', type: 'text' },
                                            { label: 'Email', key: 'email', type: 'email' },
                                        ].map(f => (
                                            <div key={f.key} style={rowStyle}>
                                                <label style={labelStyle}>{f.label} <span style={{ color: 'red' }}>*</span></label>
                                                <input type={f.type} value={clientForm[f.key]} onChange={e => setClientForm({...clientForm, [f.key]: e.target.value})} style={inputStyle} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Adresse ── */}
                        <div style={cardStyle}>
                            <div style={cardHeaderStyle}>
                                <span>📋</span> Adresse
                            </div>
                            <div style={{ padding: '20px' }}>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Adresse <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" value={adresse.adresse} onChange={e => setAdresse({...adresse, adresse: e.target.value})} placeholder="Ex: 10 Rue de la République" style={inputStyle} />
                                </div>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Ville <span style={{ color: 'red' }}>*</span></label>
                                    <select value={adresse.ville} onChange={e => setAdresse({...adresse, ville: e.target.value})} style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}>
                                        <option value="">-- Choisissez s'il vous plaît --</option>
                                        {VILLES_TUNISIE.map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Téléphone <span style={{ color: 'red' }}>*</span></label>
                                    <input type="tel" value={adresse.telephone} onChange={e => setAdresse({...adresse, telephone: e.target.value})} placeholder="+216 XX XXX XXX" style={inputStyle} />
                                </div>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Téléphone portable <span style={{ color: 'red' }}>*</span></label>
                                    <input type="tel" value={adresse.telephonePortable} onChange={e => setAdresse({...adresse, telephonePortable: e.target.value})} placeholder="+216 XX XXX XXX" style={inputStyle} />
                                </div>
                                <p style={{ fontSize: 12, color: '#888', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.5 }}>
                                    L'adresse sélectionnée sera utilisée à la fois comme votre adresse personnelle (pour la facture) et comme votre adresse de livraison.
                                </p>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#555' }}>
                                    <input type="checkbox" checked={adresse.autreAdresseFacture} onChange={e => setAdresse({...adresse, autreAdresseFacture: e.target.checked})} style={{ accentColor: GREEN }} />
                                    Utilisez une autre adresse pour la facture
                                </label>
                            </div>
                        </div>

                        {/* ── Mode de livraison ── */}
                        <div style={cardStyle}>
                            <div style={cardHeaderStyle}>
                                <span>🚚</span> Mode de livraison
                            </div>
                            <div style={{ padding: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                                    <input type="radio" defaultChecked style={{ accentColor: GREEN, width: 16, height: 16 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>Livraison à domicile</div>
                                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>1-2 Jours</div>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>8,00 TND (TTC)</div>
                                </label>
                                <div style={{ marginTop: 12, fontSize: 28 }}>🚚</div>
                            </div>
                        </div>

                        {/* ── Commentaire ── */}
                        <div style={cardStyle}>
                            <div style={cardHeaderStyle}>
                                <span>💬</span> Commentaire de la commande
                            </div>
                            <div style={{ padding: '20px' }}>
                                <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
                                    Vous souhaitez ajouter un commentaire sur votre commande ?
                                </p>
                                <textarea value={commentaire} onChange={e => setComment(e.target.value)}
                                          style={{ width: '100%', height: 100, padding: '10px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                />
                            </div>
                        </div>

                        {/* ── CGU + Bouton commander ── */}
                        <div style={{ background: '#fff', border: BORDER, borderRadius: 8, padding: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
                                <input type="checkbox" checked={acceptCGU} onChange={e => setAcceptCGU(e.target.checked)} style={{ accentColor: GREEN, width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                                    Je suis d'accord avec le{' '}
                                    <span style={{ color: GREEN, cursor: 'pointer', textDecoration: 'underline' }}>conditions d'utilisation</span>{' '}
                                    et les respectera sans condition.
                                </span>
                            </label>
                            <button onClick={terminerCommande} disabled={!acceptCGU} style={{
                                width: '100%', padding: '16px 0',
                                background: acceptCGU ? GREEN : '#ccc',
                                color: '#fff', border: 'none', borderRadius: 4,
                                fontWeight: 900, fontSize: 16,
                                cursor: acceptCGU ? 'pointer' : 'not-allowed',
                                letterSpacing: 1, textTransform: 'uppercase', transition: 'background 0.2s',
                            }}
                                    onMouseEnter={e => { if (acceptCGU) e.currentTarget.style.background = '#388e3c'; }}
                                    onMouseLeave={e => { if (acceptCGU) e.currentTarget.style.background = GREEN; }}
                            >
                                TERMINER MA COMMANDE
                            </button>
                        </div>
                    </div>

                    {/* ══ COLONNE DROITE — PANIER ══════════════════════════════ */}
                    <div style={{ position: 'sticky', top: 84 }}>
                        <div style={cardStyle}>
                            <div style={cardHeaderStyle}>
                                <span>🛒</span> Panier ({nbArticles} article{nbArticles > 1 ? 's' : ''})
                            </div>

                            {/* Produits */}
                            {cart.map((item, idx) => {
                                const qty   = getQty(item);
                                const price = getPrice(item);
                                const name  = getName(item);
                                const image = getImage(item);
                                return (
                                    <div key={item.id ?? idx} style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: '16px 20px',
                                        borderBottom: idx < cart.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    }}>
                                        <div style={{ width: 70, height: 70, flexShrink: 0, background: '#f8f8f8', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {image
                                                ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} onError={e => { e.target.onerror = null; e.target.style.opacity = '0.2'; }} />
                                                : <span style={{ fontSize: 28, opacity: 0.3 }}>👟</span>
                                            }
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 3 }}>{name}</div>
                                            {item.taille && <div style={{ fontSize: 11, color: '#888', marginBottom: 3 }}>Taille : <strong>{item.taille}</strong></div>}
                                            <div style={{ fontSize: 14, fontWeight: 800, color: GREEN }}>{price.toFixed(2)} TND</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden' }}>
                                            <button onClick={() => updateQty(item.id, -1)} style={{ width: 28, height: 28, border: 'none', background: '#f8f8f8', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>−</button>
                                            <div style={{ width: 32, height: 28, borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{qty}</div>
                                            <button onClick={() => updateQty(item.id, 1)} style={{ width: 28, height: 28, border: 'none', background: '#f8f8f8', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>+</button>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: '#111', minWidth: 70, textAlign: 'right' }}>
                                            {(price * qty).toFixed(2)} TND
                                        </div>
                                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 16, padding: 4, transition: 'color 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#E63030'}
                                                onMouseLeave={e => e.currentTarget.style.color = '#bbb'}
                                        >🗑️</button>
                                    </div>
                                );
                            })}

                            {/* Code promo */}
                            <div style={{ padding: '14px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 10, alignItems: 'center' }}>
                                <span style={{ fontSize: 16, color: '#888' }}>✂️</span>
                                <input type="text" value={codePromo} onChange={e => setCodePromo(e.target.value)} placeholder="Code de réduction"
                                       style={{ flex: 1, padding: '9px 14px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, outline: 'none' }}
                                />
                                <button onClick={appliquerPromo} style={{ padding: '9px 18px', background: GREEN, color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                                    AJOUTER
                                </button>
                            </div>

                            {/* Récap prix */}
                            <div style={{ padding: '16px 20px', borderTop: '1px solid #eee', background: '#fafafa' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: '#555' }}>
                                    <span>Sous-total</span>
                                    <span style={{ fontWeight: 600 }}>{sousTotal.toFixed(2)} TND</span>
                                </div>
                                {promoApplied && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: GREEN }}>
                                        <span>Réduction (-{reduction}%)</span>
                                        <span style={{ fontWeight: 600 }}>-{remise.toFixed(2)} TND</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14, color: '#555' }}>
                                    <span>Livraison</span>
                                    <span style={{ fontWeight: 600 }}>{LIVRAISON.toFixed(2)} TND</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #ddd' }}>
                                    <span style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>Total</span>
                                    <span style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>{totalTTC.toFixed(2)} TND</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}