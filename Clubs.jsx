import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const STATUS_STYLES = {
    ACTIF:     { label: 'ACTIF',     bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    INACTIF:   { label: 'INACTIF',   bg: '#f9fafb', color: '#6b7280', border: '#d1d5db' },
    SUSPENDU:  { label: 'SUSPENDU',  bg: '#fff7ed', color: '#c2410c', border: '#fdba74' },
};

const MODAL_EMPTY = {
    nom: '', nomCourt: '', ville: '', region: '',
    anneeFondation: '', email: '', telephone: '',
    adresse: '', statut: 'ACTIF'
};

export default function Clubs() {
    const navigate = useNavigate();

    const [clubs, setClubs]       = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch]     = useState('');
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [menuOpen, setMenuOpen] = useState(null);
    const menuRef = useRef(null);

    const [modal, setModal]       = useState(null);
    const [editId, setEditId]     = useState(null);
    const [form, setForm]         = useState(MODAL_EMPTY);
    const [saving, setSaving]     = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => { fetchClubs(); }, []);

    useEffect(() => {
        if (!search) { setFiltered(clubs); return; }
        setFiltered(clubs.filter(c =>
            c.nom?.toLowerCase().includes(search.toLowerCase()) ||
            c.ville?.toLowerCase().includes(search.toLowerCase())
        ));
    }, [search, clubs]);

    useEffect(() => {
        const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const fetchClubs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/federation/clubs');
            setClubs(res.data);
            setFiltered(res.data);
        } catch { setError('Erreur chargement clubs'); }
        finally { setLoading(false); }
    };

    const openCreate = () => { setForm(MODAL_EMPTY); setEditId(null); setModal('create'); };

    const openEdit = (club) => {
        setForm({
            nom: club.nom || '', nomCourt: club.nomCourt || '',
            ville: club.ville || '', region: club.region || '',
            anneeFondation: club.anneeFondation || '',
            email: club.email || '', telephone: club.telephone || '',
            adresse: club.adresse || '', statut: club.statut || 'ACTIF'
        });
        setEditId(club.id); setModal('edit'); setMenuOpen(null);
    };

    const saveClub = async () => {
        setSaving(true);
        try {
            if (modal === 'create') await api.post('/federation/clubs', form);
            else await api.put(`/federation/clubs/${editId}`, form);
            setModal(null);
            fetchClubs();
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la sauvegarde');
        } finally { setSaving(false); }
    };

    const deleteClub = async () => {
        try {
            await api.delete(`/federation/clubs/${deleteId}`);
            setDeleteId(null);
            fetchClubs();
        } catch { setError('Erreur suppression'); }
    };

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : '—';

    const renderModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
                    {modal === 'create' ? '🛡️ Ajouter un club' : '✏️ Modifier le club'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nom du club *</label>
                        <input name="nom" value={form.nom} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nom court</label>
                        <input name="nomCourt" value={form.nomCourt} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Ville *</label>
                        <input name="ville" value={form.ville} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Région</label>
                        <input name="region" value={form.region} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Année fondation</label>
                        <input name="anneeFondation" type="number" value={form.anneeFondation} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Téléphone</label>
                        <input name="telephone" value={form.telephone} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
                        <input name="email" type="email" value={form.email} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Adresse</label>
                        <input name="adresse" value={form.adresse} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Statut</label>
                        <select name="statut" value={form.statut} onChange={handle}
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', cursor: 'pointer' }}>
                            <option value="ACTIF">ACTIF</option>
                            <option value="INACTIF">INACTIF</option>
                            <option value="SUSPENDU">SUSPENDU</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={() => setModal(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                        Annuler
                    </button>
                    <button onClick={saveClub} disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#E63030', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderDeleteModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Supprimer le club ?</h3>
                <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>Cette action est irréversible.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                        Annuler
                    </button>
                    <button onClick={deleteClub} style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#E63030', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>Gestion des Clubs</h1>
                    <p style={{ color: '#888', fontSize: 14 }}>{filtered.length} clubs enregistrés</p>
                </div>
                <button onClick={openCreate} style={{ background: '#E63030', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    🛡️ Ajouter un club
                </button>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: 16 }}>✕</button>
                </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ position: 'relative', maxWidth: 380 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>🔍</span>
                    <input
                        placeholder="Rechercher par nom ou ville..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 16px 10px 36px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, background: '#fff', outline: 'none' }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'visible' }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                            {['NOM', 'VILLE', 'RÉGION', 'JOUEURS', 'TÉLÉPHONE', 'EMAIL', 'STATUT', 'DATE', ''].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((c, idx) => {
                            const st = STATUS_STYLES[c.statut] || STATUS_STYLES.INACTIF;
                            return (
                                <tr key={c.id}
                                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseOut={e => e.currentTarget.style.background = '#fff'}>

                                    <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 14, color: '#111' }}>
                                        {c.nom}
                                        {c.nomCourt && <span style={{ fontSize: 11, color: '#aaa', marginLeft: 6 }}>({c.nomCourt})</span>}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#555' }}>{c.ville || '—'}</td>
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>{c.region || '—'}</td>

                                    {/* ← Colonne Joueurs cliquable */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <span
                                            onClick={() => navigate(`/dashboard/clubs/${c.id}/joueurs`)}
                                            style={{
                                                padding: '4px 10px', borderRadius: 6, fontSize: 12,
                                                fontWeight: 700, background: '#eff6ff', color: '#1e40af',
                                                border: '1px solid #bfdbfe', cursor: 'pointer',
                                                display: 'inline-flex', alignItems: 'center', gap: 4
                                            }}>
                                            🏉 {c.nombreJoueurs ?? 0} joueurs
                                        </span>
                                    </td>

                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>{c.telephone || '—'}</td>
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>{c.email || '—'}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                                            {st.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#bbb' }}>{formatDate(c.dateCreation)}</td>
                                    <td style={{ padding: '14px 16px', position: 'relative' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === c.id ? null : c.id); }}
                                            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888', padding: '4px 8px' }}>
                                            ⋮
                                        </button>
                                        {menuOpen === c.id && (
                                            <div ref={menuRef} style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid #eee', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 160, overflow: 'hidden' }}>
                                                <button onClick={() => openEdit(c)}
                                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#333', textAlign: 'left' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                                                        onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                                    ✏️ Modifier
                                                </button>
                                                <button onClick={() => { navigate(`/dashboard/clubs/${c.id}/joueurs`); setMenuOpen(null); }}
                                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#333', textAlign: 'left' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                                                        onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                                    🏉 Voir joueurs
                                                </button>
                                                <button onClick={() => { setDeleteId(c.id); setMenuOpen(null); }}
                                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#E63030', textAlign: 'left', borderTop: '1px solid #f5f5f5' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                                                        onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                                    🗑️ Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>

            {modal && renderModal()}
            {deleteId && renderDeleteModal()}
        </div>
    );
}