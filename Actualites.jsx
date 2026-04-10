import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544298621-35a989e4e54a?w=400&q=80';
const EMPTY_FORM   = { titre: '', contenu: '', urlImage: '', categorie: '' };

const CATEGORIES = ['Formation', 'International', 'Club', 'Compétition', 'Fédération'];

// ── Modal Formulaire ──────────────────────────────
function ActualiteModal({ mode, initialData, onClose, onSaved }) {
    const [form, setForm]       = useState(initialData || EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async () => {
        if (!form.titre.trim() || !form.contenu.trim()) {
            setError('Titre et contenu sont obligatoires');
            return;
        }
        setLoading(true);
        setError('');
        try {
            if (mode === 'create') {
                await api.post('/super-admin/actualites', form);
            } else {
                await api.put(`/super-admin/actualites/${initialData.id}`, form);
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '11px 14px',
        border: '1.5px solid #e0e0e0', borderRadius: 10,
        fontSize: 14, outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.2s', fontFamily: 'inherit'
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                background: '#fff', borderRadius: 20, padding: '36px 32px',
                width: 600, boxShadow: '0 16px 60px rgba(0,0,0,0.2)',
                maxHeight: '90vh', overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div>
                        <h2 style={{ fontWeight: 900, fontSize: 22, color: '#111', margin: 0 }}>
                            {mode === 'create' ? '✍️ Nouvelle actualité' : '✏️ Modifier l\'actualité'}
                        </h2>
                        <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>
                            {mode === 'create' ? 'Créez une nouvelle actualité fédération' : 'Modifiez les informations de l\'actualité'}
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        background: '#f5f5f5', border: 'none', borderRadius: 8,
                        width: 36, height: 36, fontSize: 18, cursor: 'pointer', color: '#666'
                    }}>×</button>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2', color: '#c0392b',
                        border: '1px solid #fecaca', borderRadius: 10,
                        padding: '10px 14px', marginBottom: 20, fontSize: 13
                    }}>⚠️ {error}</div>
                )}

                {/* Catégorie */}
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#333', display: 'block', marginBottom: 7 }}>
                        Catégorie
                    </label>
                    <select
                        value={form.categorie}
                        onChange={e => setForm({ ...form, categorie: e.target.value })}
                        style={{ ...inputStyle, background: '#fff' }}
                        onFocus={e => e.target.style.borderColor = '#E63030'}
                        onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    >
                        <option value="">-- Choisir une catégorie --</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Titre */}
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#333', display: 'block', marginBottom: 7 }}>
                        Titre *
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: Championnat National 2025 — Résultats journée 5"
                        value={form.titre}
                        onChange={e => setForm({ ...form, titre: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#E63030'}
                        onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                </div>

                {/* Contenu */}
                <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#333', display: 'block', marginBottom: 7 }}>
                        Contenu *
                    </label>
                    <textarea
                        placeholder="Rédigez le contenu de l'actualité..."
                        value={form.contenu}
                        onChange={e => setForm({ ...form, contenu: e.target.value })}
                        rows={6}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                        onFocus={e => e.target.style.borderColor = '#E63030'}
                        onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                    <div style={{ fontSize: 12, color: '#aaa', marginTop: 4, textAlign: 'right' }}>
                        {form.contenu.length} caractères
                    </div>
                </div>

                {/* URL Image */}
                <div style={{ marginBottom: 28 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#333', display: 'block', marginBottom: 7 }}>
                        URL Image <span style={{ color: '#aaa', fontWeight: 400 }}>(optionnel)</span>
                    </label>
                    <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={form.urlImage}
                        onChange={e => setForm({ ...form, urlImage: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#E63030'}
                        onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                    {form.urlImage && (
                        <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', height: 120, background: '#f5f5f5' }}>
                            <img
                                src={form.urlImage}
                                alt="preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={onClose} style={{
                        flex: 1, padding: '12px 0', borderRadius: 10,
                        border: '1.5px solid #e0e0e0', background: '#fff',
                        fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#555'
                    }}>Annuler</button>
                    <button onClick={handleSubmit} disabled={loading} style={{
                        flex: 2, padding: '12px 0', borderRadius: 10,
                        background: loading ? '#f87171' : '#E63030',
                        border: 'none', color: '#fff',
                        fontWeight: 700, fontSize: 14, cursor: 'pointer'
                    }}>
                        {loading ? 'Sauvegarde...' : mode === 'create' ? '✅ Publier l\'actualité' : '✅ Enregistrer les modifications'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Confirm Delete Modal ──────────────────────────
function DeleteModal({ actu, onClose, onDeleted }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/super-admin/actualites/${actu.id}`);
            onDeleted();
        } catch {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                background: '#fff', borderRadius: 16, padding: '32px 28px',
                width: 420, boxShadow: '0 16px 48px rgba(0,0,0,0.2)', textAlign: 'center'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
                <h3 style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 10 }}>
                    Supprimer l'actualité ?
                </h3>
                <p style={{ color: '#666', fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>
                    Cette action est irréversible.
                </p>
                <p style={{ color: '#E63030', fontWeight: 700, fontSize: 14, marginBottom: 24 }}>
                    "{actu.titre}"
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={onClose} style={{
                        flex: 1, padding: 12, borderRadius: 10,
                        border: '1.5px solid #e0e0e0', background: '#fff',
                        fontWeight: 600, cursor: 'pointer', fontSize: 14
                    }}>Annuler</button>
                    <button onClick={handleDelete} disabled={loading} style={{
                        flex: 1, padding: 12, borderRadius: 10,
                        background: loading ? '#f87171' : '#E63030',
                        border: 'none', color: '#fff',
                        fontWeight: 700, cursor: 'pointer', fontSize: 14
                    }}>
                        {loading ? 'Suppression...' : 'Supprimer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Card Actualité ────────────────────────────────
function ActualiteCard({ actu, onEdit, onDelete }) {
    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';

    return (
        <div style={{
            background: '#fff',
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid #eee',
            transition: 'transform 0.15s, box-shadow 0.15s',
            cursor: 'default'
        }}
             onMouseOver={e => {
                 e.currentTarget.style.transform = 'translateY(-4px)';
                 e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)';
             }}
             onMouseOut={e => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = 'none';
             }}
        >
            {/* Image */}
            <div style={{ position: 'relative', height: 190, overflow: 'hidden', background: '#f0f0f0' }}>
                <img
                    src={actu.urlImage || FALLBACK_IMG}
                    alt={actu.titre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = FALLBACK_IMG; }}
                />
                {/* Badge catégorie */}
                {actu.categorie && (
                    <span style={{
                        position: 'absolute', top: 12, left: 12,
                        background: '#E63030', color: '#fff',
                        fontSize: 11, fontWeight: 700,
                        padding: '4px 11px', borderRadius: 6,
                        letterSpacing: 0.3
                    }}>{actu.categorie}</span>
                )}
                {/* Boutons action */}
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                    <button
                        onClick={() => onEdit(actu)}
                        title="Modifier"
                        style={{
                            background: 'rgba(255,255,255,0.90)', border: 'none',
                            borderRadius: 8, width: 32, height: 32,
                            fontSize: 14, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >✏️</button>
                    <button
                        onClick={() => onDelete(actu)}
                        title="Supprimer"
                        style={{
                            background: 'rgba(255,255,255,0.90)', border: 'none',
                            borderRadius: 8, width: 32, height: 32,
                            fontSize: 14, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >🗑️</button>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 18px 14px' }}>
                <div style={{
                    fontWeight: 700, fontSize: 15, color: '#E63030',
                    lineHeight: 1.4, marginBottom: 8,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                    {actu.titre}
                </div>
                <div style={{
                    fontSize: 13, color: '#777', lineHeight: 1.6, marginBottom: 14,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                    {actu.contenu}
                </div>

                {/* Meta */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid #f5f5f5', paddingTop: 12,
                    fontSize: 12, color: '#aaa'
                }}>
                    <span>📅 {formatDate(actu.datePublication)}</span>
                    <span style={{
                        background: '#fef2f2', color: '#E63030',
                        fontSize: 11, fontWeight: 600,
                        padding: '3px 9px', borderRadius: 20
                    }}>Publié</span>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────
export default function Actualites() {
    const [actualites, setActualites] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [search, setSearch]         = useState('');

    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal]     = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    useEffect(() => { fetchActualites(); }, []);

    const fetchActualites = async () => {
        try {
            setLoading(true);
            const res = await api.get('/super-admin/actualites');
            setActualites(res.data || []);
        } catch {
            setError('Impossible de charger les actualités.');
        } finally {
            setLoading(false);
        }
    };

    const filtered = actualites.filter(a =>
        !search ||
        a.titre?.toLowerCase().includes(search.toLowerCase()) ||
        a.contenu?.toLowerCase().includes(search.toLowerCase())
    );

    const thisMonth = actualites.filter(a => {
        if (!a.datePublication) return false;
        const d = new Date(a.datePublication), now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div>
            {/* ── Header ── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111', marginBottom: 4 }}>
                    Actualités
                </h1>
                <p style={{ color: '#888', fontSize: 14 }}>
                    Gérez les actualités publiées sur la plateforme Rugby Tunisie
                </p>
            </div>

            {/* ── Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                    { label: 'Total actualités', value: actualites.length, color: '#E63030', bg: '#fef2f2' },
                    { label: 'Ce mois',           value: thisMonth, color: '#1d4ed8', bg: '#eff6ff' },
                    { label: 'Avec image',         value: actualites.filter(a => a.urlImage).length, color: '#166534', bg: '#f0fdf4' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: s.bg, borderRadius: 14,
                        border: `1px solid ${s.color}20`,
                        padding: '20px 24px',
                        display: 'flex', alignItems: 'center', gap: 16
                    }}>
                        <span style={{ fontSize: 26 }}>{s.icon}</span>
                        <div>
                            <div style={{ fontWeight: 900, fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: `${s.color}99`, marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Toolbar ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Rechercher une actualité..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 12px 10px 36px',
                            border: '1.5px solid #e0e0e0', borderRadius: 10,
                            fontSize: 14, outline: 'none', boxSizing: 'border-box'
                        }}
                        onFocus={e => e.target.style.borderColor = '#E63030'}
                        onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                </div>
                <button onClick={() => setCreateModal(true)} style={{
                    background: '#E63030', color: '#fff', border: 'none',
                    borderRadius: 10, padding: '10px 22px', fontWeight: 700,
                    fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    whiteSpace: 'nowrap'
                }}>
                    ✍️ Nouvelle actualité
                </button>
            </div>

            {/* ── Error ── */}
            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
                    ⚠️ {error}
                </div>
            )}

            {/* ── Cards Grid ── */}
            {loading ? (
                <div style={{ padding: 80, textAlign: 'center', color: '#888', background: '#fff', borderRadius: 16 }}>
                    Chargement...
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center', color: '#888', background: '#fff', borderRadius: 16, border: '1px dashed #e5e7eb' }}>
                    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📭</div>
                    <p style={{ fontWeight: 600, fontSize: 16 }}>
                        {search ? 'Aucun résultat trouvé' : 'Aucune actualité publiée'}
                    </p>
                    {!search && (
                        <button onClick={() => setCreateModal(true)} style={{
                            marginTop: 16, background: '#E63030', color: '#fff',
                            border: 'none', borderRadius: 10, padding: '10px 24px',
                            fontWeight: 700, fontSize: 14, cursor: 'pointer'
                        }}>
                            + Créer la première actualité
                        </button>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 24
                }}>
                    {filtered.map(a => (
                        <ActualiteCard
                            key={a.id}
                            actu={a}
                            onEdit={setEditModal}
                            onDelete={setDeleteModal}
                        />
                    ))}
                </div>
            )}

            {/* ── Modals ── */}
            {createModal && (
                <ActualiteModal
                    mode="create"
                    onClose={() => setCreateModal(false)}
                    onSaved={() => { setCreateModal(false); fetchActualites(); }}
                />
            )}
            {editModal && (
                <ActualiteModal
                    mode="edit"
                    initialData={editModal}
                    onClose={() => setEditModal(null)}
                    onSaved={() => { setEditModal(null); fetchActualites(); }}
                />
            )}
            {deleteModal && (
                <DeleteModal
                    actu={deleteModal}
                    onClose={() => setDeleteModal(null)}
                    onDeleted={() => { setDeleteModal(null); fetchActualites(); }}
                />
            )}
        </div>
    );
}