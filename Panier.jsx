import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CART_KEY  = 'rugby_cart';
const LIVRAISON = 8.00;

// ── Helper — lire les champs compatibles Shop (qty/price) ET ancien format (quantite/prix)
const getQty   = (i) => parseInt(i.qty   ?? i.quantite) || 1;
const getPrice = (i) => parseFloat(i.price ?? i.prix)   || 0;
const getName  = (i) => i.name ?? i.nom  ?? '';
const getImage = (i) => i.image ?? i.urlImage ?? '';

const SUGGESTIONS = [
    { id:'s1', name:'Puma Pro Classic',     price:150, image:'/assets/Homme/chaussure/chaussure-puma-pro-classic.jpg' },
    { id:'s2', name:'Nike Revolution 7 GS', price:149, image:'/assets/Femme/chaussure/chaussure-nike-revolution-7-gs.jpg' },
    { id:'s3', name:'Adidas Cloudfoam Go',  price:155, image:'/assets/Homme/chaussure/chaussure-adidas-cloudfoam-go.jpg' },
    { id:'s4', name:'HML Future Jacket',    price:99,  image:'/assets/promo/hml-future.jpg' },
];

export default function Panier() {
    const navigate = useNavigate();
    const [cart, setCart]       = useState([]);
    const [hovSug, setHovSug]   = useState(null);
    const [commande, setCommande] = useState(false);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(CART_KEY)) || [];
            setCart(saved);
        } catch { setCart([]); }
    }, []);

    const saveCart = (newCart) => {
        setCart(newCart);
        try { localStorage.setItem(CART_KEY, JSON.stringify(newCart)); }
        catch {}
    };

    const updateQty = (id, delta) => {
        const updated = cart.map(i => {
            if (i.id !== id) return i;
            const current = getQty(i);
            const next    = Math.max(1, current + delta);
            // Mettre à jour les 2 formats pour compatibilité
            return { ...i, qty: next, quantite: next };
        });
        saveCart(updated);
    };

    const removeItem = (id) => saveCart(cart.filter(i => i.id !== id));

    const totalArticles = cart.reduce((s, i) => s + getPrice(i) * getQty(i), 0);
    const totalTTC      = totalArticles + (cart.length > 0 ? LIVRAISON : 0);
    const nbArticles    = cart.reduce((s, i) => s + getQty(i), 0);

    // ── Page confirmation ────────────────────────────────────────────────────
    if (commande) {
        return (
            <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111', marginBottom: 12 }}>
                    Commande confirmée !
                </h2>
                <p style={{ color: '#888', fontSize: 15, marginBottom: 32 }}>
                    Votre commande a été passée avec succès. Livraison sous 2-3 jours ouvrables.
                </p>
                <div style={{
                    background: '#f0fdf4', border: '1px solid #86efac',
                    borderRadius: 12, padding: '20px 28px', marginBottom: 32,
                    display: 'flex', justifyContent: 'space-between',
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Montant total</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: '#111' }}>{totalTTC.toFixed(2)} TND</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Livraison</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#166534' }}>2-3 jours</div>
                    </div>
                </div>
                <button onClick={() => { saveCart([]); navigate('/fan/shop'); }} style={{
                    padding: '14px 40px', background: '#1a2744', color: '#fff',
                    border: 'none', borderRadius: 4, fontWeight: 800,
                    fontSize: 15, cursor: 'pointer', letterSpacing: 0.5,
                }}>
                    CONTINUER LES ACHATS
                </button>
            </div>
        );
    }

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

            {/* Breadcrumb */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '10px 24px', fontSize: 13, color: '#888' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/fan/home')}>Accueil</span>
                <span style={{ margin: '0 8px' }}>›</span>
                <span style={{ color: '#111', fontWeight: 600 }}>Mon Panier</span>
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

                {/* ── Panier vide ── */}
                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', marginBottom: 12 }}>
                            Votre panier est vide
                        </h2>
                        <p style={{ color: '#888', marginBottom: 32 }}>
                            Ajoutez des produits pour commencer vos achats
                        </p>
                        <button onClick={() => navigate('/fan/shop')} style={{
                            padding: '14px 32px', background: '#1a2744', color: '#fff',
                            border: 'none', borderRadius: 4, fontWeight: 800,
                            fontSize: 14, cursor: 'pointer', letterSpacing: 0.5,
                        }}>
                            VOIR LA BOUTIQUE
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

                        {/* ── Liste produits ── */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', margin: 0 }}>
                                    Mon Panier ({nbArticles} article{nbArticles > 1 ? 's' : ''})
                                </h1>
                                <button onClick={() => saveCart([])} style={{
                                    background: 'none', border: 'none', color: '#E63030',
                                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                }}>Vider le panier</button>
                            </div>

                            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', overflow: 'hidden' }}>
                                {cart.map((item, idx) => {
                                    const qty   = getQty(item);
                                    const price = getPrice(item);
                                    const name  = getName(item);
                                    const image = getImage(item);

                                    return (
                                        <div key={item.id ?? idx} style={{
                                            display: 'flex', alignItems: 'center', gap: 20,
                                            padding: '24px',
                                            borderBottom: idx < cart.length - 1 ? '1px solid #f0f0f0' : 'none',
                                        }}>
                                            {/* Image */}
                                            <div style={{
                                                width: 130, height: 130, flexShrink: 0,
                                                background: '#f8f8f8', borderRadius: 6,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden', cursor: 'pointer',
                                            }} onClick={() => navigate('/fan/shop')}>
                                                {image ? (
                                                    <img src={image} alt={name}
                                                         style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
                                                         onError={e => { e.target.onerror = null; e.target.style.opacity = '0.2'; }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: 48, opacity: 0.3 }}>👟</span>
                                                )}
                                            </div>

                                            {/* Infos */}
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 6px' }}>
                                                    {name}
                                                </h3>
                                                {(item.taille || item.categorie) && (
                                                    <p style={{ fontSize: 13, color: '#888', margin: '0 0 12px' }}>
                                                        {item.taille && <span>Taille : <strong>{item.taille}</strong></span>}
                                                        {item.taille && item.categorie && ' · '}
                                                        {item.categorie && <span>{item.categorie}</span>}
                                                    </p>
                                                )}
                                                <p style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: 0 }}>
                                                    {(price * qty).toFixed(2)} TND
                                                </p>
                                                {qty > 1 && (
                                                    <p style={{ fontSize: 12, color: '#aaa', margin: '2px 0 0' }}>
                                                        {price.toFixed(2)} TND × {qty}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Contrôle quantité */}
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden' }}>
                                                <button onClick={() => updateQty(item.id, -1)} style={{
                                                    width: 36, height: 36, border: 'none',
                                                    background: '#f8f8f8', cursor: 'pointer',
                                                    fontSize: 18, color: '#555', fontWeight: 700,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>−</button>
                                                <div style={{
                                                    width: 44, height: 36,
                                                    borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 14, fontWeight: 700, color: '#111',
                                                }}>{qty}</div>
                                                <button onClick={() => updateQty(item.id, 1)} style={{
                                                    width: 36, height: 36, border: 'none',
                                                    background: '#f8f8f8', cursor: 'pointer',
                                                    fontSize: 18, color: '#555', fontWeight: 700,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>+</button>
                                            </div>

                                            {/* Supprimer */}
                                            <button onClick={() => removeItem(item.id)} style={{
                                                background: 'none', border: 'none',
                                                cursor: 'pointer', padding: 8,
                                                color: '#bbb', fontSize: 18, transition: 'color 0.15s',
                                            }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#E63030'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#bbb'}
                                            >🗑️</button>
                                        </div>
                                    );
                                })}
                            </div>

                            <button onClick={() => navigate('/fan/shop')} style={{
                                marginTop: 16, background: 'none', border: 'none',
                                color: '#1a2744', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                                ← Continuer mes achats
                            </button>
                        </div>

                        {/* ── Récapitulatif ── */}
                        <div style={{
                            background: '#fff', borderRadius: 8,
                            border: '1px solid #eee', padding: 24,
                            position: 'sticky', top: 84,
                        }}>
                            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Récapitulatif
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
                                    <span>{nbArticles} article{nbArticles > 1 ? 's' : ''}</span>
                                    <span style={{ fontWeight: 600 }}>{totalArticles.toFixed(2)} TND</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
                                    <span>Livraison</span>
                                    <span style={{ fontWeight: 600 }}>{LIVRAISON.toFixed(2)} TND</span>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #eee', paddingTop: 16, marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>Total TTC</span>
                                    <span style={{ fontSize: 20, fontWeight: 900, color: '#111' }}>
                                        {totalTTC.toFixed(2)} TND
                                    </span>
                                </div>
                            </div>

                            <button onClick={() => setCommande(true)} style={{
                                width: '100%', padding: '15px 0',
                                background: '#1a2744', color: '#fff',
                                border: 'none', borderRadius: 4,
                                fontWeight: 900, fontSize: 15,
                                cursor: 'pointer', letterSpacing: 1,
                                textTransform: 'uppercase', transition: 'background 0.2s',
                            }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#E63030'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#1a2744'}
                            >
                                COMMANDER
                            </button>

                            <div style={{ marginTop: 16, fontSize: 12, color: '#888', textAlign: 'center' }}>
                                🚚 Livraison entre <strong>2 et 3 jours ouvrables</strong>
                            </div>
                            <div style={{ marginTop: 12, padding: '10px 14px', background: '#f8f8f8', borderRadius: 6, fontSize: 12, color: '#888', textAlign: 'center' }}>
                                🛡️ Paiement 100% sécurisé par IA
                            </div>
                        </div>
                    </div>
                )}

                {/* ── VOUS POURRIEZ AUSSI AIMER ── */}
                <div style={{ marginTop: 56 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: '#111', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 28 }}>
                        VOUS POURRIEZ AUSSI AIMER
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                        {SUGGESTIONS.map(p => (
                            <div key={p.id}
                                 onClick={() => navigate('/fan/shop')}
                                 onMouseEnter={() => setHovSug(p.id)}
                                 onMouseLeave={() => setHovSug(null)}
                                 style={{
                                     background: '#fff', borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                                     border: hovSug === p.id ? '1.5px solid #111' : '1.5px solid #eee',
                                     transition: 'all 0.2s',
                                     transform: hovSug === p.id ? 'translateY(-4px)' : 'none',
                                     boxShadow: hovSug === p.id ? '0 12px 28px rgba(0,0,0,0.1)' : 'none',
                                 }}
                            >
                                <div style={{ background: '#f8f8f8', aspectRatio: '1', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={p.image} alt={p.name}
                                         style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s', transform: hovSug === p.id ? 'scale(1.05)' : 'scale(1)' }}
                                         onError={e => { e.target.onerror = null; e.target.style.opacity = '0.15'; }}
                                    />
                                </div>
                                <div style={{ padding: '12px 14px' }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>{p.name}</h3>
                                    <div style={{ display: 'flex', gap: 1, marginBottom: 8 }}>
                                        {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 11 }}>{s}</span>)}
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 900, color: '#111' }}>{p.price} TND</div>
                                </div>
                                <div style={{ padding: '0 14px 14px' }}>
                                    <div style={{
                                        padding: '9px 0', textAlign: 'center',
                                        background: hovSug === p.id ? '#1a2744' : '#f5f5f5',
                                        color: hovSug === p.id ? '#fff' : '#111',
                                        borderRadius: 4, fontWeight: 700, fontSize: 12,
                                        textTransform: 'uppercase', letterSpacing: 0.5, transition: 'all 0.2s',
                                    }}>AJOUTER AU PANIER</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}