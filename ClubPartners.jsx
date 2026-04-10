import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const MODAL_EMPTY = {
    nom: '',
    type: 'SPONSOR',
    secteur: '',
    emailContact: '',
    urlLogo: '',
    siteWeb: '',
    dateDebutContrat: '',
    dateFinContrat: '',
    actif: true
};

const TYPE_STYLES = {
    SPONSOR:        { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    TECHNIQUE:      { bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    MEDIA:          { bg: '#fefce8', color: '#854d0e', border: '#fde047' },
    INSTITUTIONNEL: { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
};

const STATUT_STYLES = {
    EN_ATTENTE: { bg: '#fffbeb', color: '#92400e', border: '#fde68a', label: '⏳ En attente' },
    VALIDE:     { bg: '#f0fdf4', color: '#166534', border: '#86efac', label: '✓ Validé' },
    REFUSE:     { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5', label: '✕ Refusé' },
};

export default function ClubPartners() {
    const { user } = useAuth();
    const isFedAdmin  = user?.role === 'FEDERATION_ADMIN' || user?.role === 'SUPER_ADMIN';
    const isClubAdmin = user?.role === 'CLUB_ADMIN';

    const API_BASE = isFedAdmin ? '/federation/partenaires' : '/club-admin/partenaires';

    const [partners, setPartners]   = useState([]);
    const [filtered, setFiltered]   = useState([]);
    const [search, setSearch]       = useState('');
    const [filterStatut, setFilterStatut] = useState('');
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [modal, setModal]         = useState(null);
    const [editId, setEditId]       = useState(null);
    const [form, setForm]           = useState(MODAL_EMPTY);
    const [saving, setSaving]       = useState(false);
    const [menuOpen, setMenuOpen]   = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        fetchPartners();
        const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null); };
        document.addEventListener('click', h);
        return () => document.removeEventListener('click', h);
    }, []);

    useEffect(() => {
        let data = partners;
        if (search) data = data.filter(p =>
            p.nom?.toLowerCase().includes(search.toLowerCase()) ||
            p.secteur?.toLowerCase().includes(search.toLowerCase())
        );
        if (filterStatut) data = data.filter(p => p.statut === filterStatut);
        setFiltered(data);
    }, [search, filterStatut, partners]);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const res = await api.get(API_BASE);
            setPartners(res.data);
            setFiltered(res.data);
            setError('');
        } catch {
            setError('Impossible de charger les partenaires.');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => { setForm(MODAL_EMPTY); setEditId(null); setModal('create'); };

    const openEdit = (p) => {
        setForm({
            nom: p.nom || '', type: p.type || 'SPONSOR', secteur: p.secteur || '',
            emailContact: p.emailContact || '', urlLogo: p.urlLogo || '', siteWeb: p.siteWeb || '',
            dateDebutContrat: p.dateDebutContrat ? p.dateDebutContrat.split('T')[0] : '',
            dateFinContrat: p.dateFinContrat ? p.dateFinContrat.split('T')[0] : '',
            actif: p.actif ?? true
        });
        setEditId(p.id); setModal('edit'); setMenuOpen(null);
    };

    const handleSave = async () => {
        if (!form.nom.trim()) { setError('Le nom est obligatoire.'); return; }
        setSaving(true);
        setError('');
        try {
            const payload = {
                nom: form.nom.trim(), type: form.type,
                secteur: form.secteur || null, emailContact: form.emailContact || null,
                urlLogo: form.urlLogo || null, siteWeb: form.siteWeb || null,
                dateDebutContrat: form.dateDebutContrat || null,
                dateFinContrat: form.dateFinContrat || null,
                actif: form.actif
            };
            if (modal === 'create') await api.post(API_BASE, payload);
            else await api.put(`${API_BASE}/${editId}`, payload);
            setModal(null);
            fetchPartners();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Erreur lors de l\'enregistrement.';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce partenaire ?')) return;
        try {
            await api.delete(`${API_BASE}/${id}`);
            setMenuOpen(null);
            fetchPartners();
        } catch { setError('Erreur lors de la suppression.'); }
    };

    // ✅ Federation — valider/refuser demandes clubs
    const validerPartenaire = async (id) => {
        try {
            await api.put(`/federation/partenaires/${id}/valider`);
            fetchPartners();
        } catch { setError('Erreur validation'); }
    };

    const refuserPartenaire = async (id) => {
        try {
            await api.put(`/federation/partenaires/${id}/refuser`);
            fetchPartners();
        } catch { setError('Erreur refus'); }
    };

    const handle = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

    const totalEnAttente = partners.filter(p => p.statut === 'EN_ATTENTE').length;

    const renderModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
                    {modal === 'create'
                        ? (isFedAdmin ? '🤝 Ajouter un partenaire fédéral' : '🤝 Soumettre un partenaire')
                        : '✏️ Modifier le partenaire'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nom *</label>
                        <input name="nom" value={form.nom} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Type</label>
                        <select name="type" value={form.type} onChange={handle}
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', background: '#fff' }}>
                            <option value="SPONSOR">SPONSOR</option>
                            <option value="TECHNIQUE">TECHNIQUE</option>
                            <option value="MEDIA">MEDIA</option>
                            <option value="INSTITUTIONNEL">INSTITUTIONNEL</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Secteur</label>
                        <input name="secteur" value={form.secteur} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email Contact</label>
                        <input name="emailContact" type="email" value={form.emailContact} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Site Web</label>
                        <input name="siteWeb" value={form.siteWeb} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>URL Logo</label>
                        <input name="urlLogo" value={form.urlLogo} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Date début contrat</label>
                        <input name="dateDebutContrat" type="date" value={form.dateDebutContrat} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Date fin contrat</label>
                        <input name="dateFinContrat" type="date" value={form.dateFinContrat} onChange={handle}
                               style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none' }} />
                    </div>
                    {/* ✅ Checkbox actif — seulement pour federation */}
                    {isFedAdmin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, gridColumn: '1 / -1' }}>
                            <input type="checkbox" name="actif" checked={form.actif} onChange={handle} id="actif"
                                   style={{ width: 16, height: 16, cursor: 'pointer' }} />
                            <label htmlFor="actif" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Actif</label>
                        </div>
                    )}
                </div>
                {error && (
                    <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 8, padding: '10px 14px', marginTop: 16, fontSize: 13 }}>
                        {error}
                    </div>
                )}
                {/* ✅ Info pour club_admin */}
                {isClubAdmin && modal === 'create' && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', marginTop: 16, fontSize: 13, color: '#92400e' }}>
                        ⏳ Votre demande sera examinée par l'administrateur de la fédération.
                    </div>
                )}
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={() => { setModal(null); setError(''); }}
                            style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                        Annuler
                    </button>
                    <button onClick={handleSave} disabled={saving || !form.nom}
                            style={{ flex: 1, padding: '12px', borderRadius: 10, background: saving || !form.nom ? '#f87171' : '#E63030', color: '#fff', border: 'none', fontWeight: 700, cursor: saving || !form.nom ? 'not-allowed' : 'pointer' }}>
                        {saving ? 'Enregistrement...' : isClubAdmin && modal === 'create' ? 'Soumettre' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                        {isFedAdmin ? 'Partenaires fédéraux' : 'Partenaires du club'}
                    </h1>
                    <p style={{ color: '#888', fontSize: 14 }}>
                        {filtered.length} partenaire{filtered.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button onClick={openCreate}
                        style={{ background: '#E63030', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    🤝 {isFedAdmin ? 'Ajouter partenaire fédéral' : 'Soumettre un partenaire'}
                </button>
            </div>

            {/* ✅ Badge demandes en attente — seulement federation */}
            {isFedAdmin && totalEnAttente > 0 && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#92400e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⏳ <strong>{totalEnAttente}</strong> demande(s) en attente de validation</span>
                    <button onClick={() => setFilterStatut('EN_ATTENTE')}
                            style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #fde68a', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#92400e' }}>
                        Voir les demandes
                    </button>
                </div>
            )}

            {error && !modal && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
                    {error}
                </div>
            )}

            {/* Filtres */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>🔍</span>
                    <input placeholder="Rechercher par nom ou secteur..." value={search}
                           onChange={e => setSearch(e.target.value)}
                           style={{ width: '100%', padding: '10px 16px 10px 36px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {/* ✅ Filtre statut — seulement federation */}
                {isFedAdmin && (
                    <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
                            style={{ padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff', minWidth: 160, cursor: 'pointer' }}>
                        <option value="">Tous les statuts</option>
                        <option value="EN_ATTENTE">⏳ En attente</option>
                        <option value="VALIDE">✓ Validé</option>
                        <option value="REFUSE">✕ Refusé</option>
                    </select>
                )}
                {(search || filterStatut) && (
                    <button onClick={() => { setSearch(''); setFilterStatut(''); }}
                            style={{ padding: '10px 16px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 13, background: '#fff', cursor: 'pointer', color: '#666' }}>
                        ✕ Reset
                    </button>
                )}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'visible' }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                            {[
                                'NOM', 'TYPE', 'EMAIL CONTACT', 'CONTRAT', 'STATUT',
                                // ✅ Colonne actions seulement si federation
                                ...(isFedAdmin ? ['ACTIONS'] : [''])
                            ].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
                                <p style={{ fontWeight: 600, marginBottom: 4 }}>Aucun partenaire trouvé</p>
                                <p style={{ fontSize: 13 }}>{search ? 'Essayez un autre terme' : 'Soumettez votre premier partenaire'}</p>
                            </td></tr>
                        ) : filtered.map((p, idx) => {
                            const tp = TYPE_STYLES[p.type] || TYPE_STYLES.SPONSOR;
                            const st = STATUT_STYLES[p.statut] || STATUT_STYLES.EN_ATTENTE;
                            return (
                                <tr key={p.id}
                                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#111' }}>
                                        {p.nom}
                                        {p.secteur && <div style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>{p.secteur}</div>}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ background: tp.bg, color: tp.color, border: `1px solid ${tp.border}`, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                                            {p.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#555' }}>{p.emailContact || '—'}</td>
                                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#888' }}>
                                        {formatDate(p.dateDebutContrat)} → {formatDate(p.dateFinContrat)}
                                    </td>
                                    {/* ✅ Statut — visible pour les deux */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                                            {st.label}
                                        </span>
                                    </td>
                                    {/* ✅ Actions — seulement federation */}
                                    {isFedAdmin ? (
                                        <td style={{ padding: '14px 16px', position: 'relative' }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                {/* Valider/Refuser les demandes clubs */}
                                                {p.statut === 'EN_ATTENTE' && p.club && (
                                                    <>
                                                        <button onClick={() => validerPartenaire(p.id)}
                                                                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                            ✓ Valider
                                                        </button>
                                                        <button onClick={() => refuserPartenaire(p.id)}
                                                                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fef2f2', color: '#991b1b', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                            ✕ Refuser
                                                        </button>
                                                    </>
                                                )}
                                                {/* Modifier/Supprimer les partenaires fédéraux */}
                                                {!p.club && (
                                                    <>
                                                        <button onClick={() => openEdit(p)}
                                                                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e0e0e0', background: '#fff', color: '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                            ✏️ Modifier
                                                        </button>
                                                        <button onClick={() => handleDelete(p.id)}
                                                                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fef2f2', color: '#E63030', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                            🗑️ Supprimer
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    ) : (
                                        // ✅ Club admin — pas d'actions (read only)
                                        <td style={{ padding: '14px 16px' }} />
                                    )}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>

            {modal && renderModal()}
        </div>
    );
}