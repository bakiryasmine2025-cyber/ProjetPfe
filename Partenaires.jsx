import { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';

const MODAL_EMPTY = {
    nom: '', type: 'SPONSOR', secteur: '',
    emailContact: '', urlLogo: '', siteWeb: '',
    dateDebutContrat: '', dateFinContrat: '',
    montant: '',
    actif: true
};

const PARTENAIRE_TYPES = ['SPONSOR', 'MEDIA', 'INSTITUTIONNEL', 'TECHNIQUE'];

const typeColor = {
    SPONSOR:        { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    MEDIA:          { bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    INSTITUTIONNEL: { bg: '#fefce8', color: '#854d0e', border: '#fde047' },
    TECHNIQUE:      { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
};

const statutColor = {
    VALIDE:     { bg: '#f0fdf4', color: '#166534', border: '#86efac', label: ' VALIDÉ' },
    REFUSE:     { bg: '#fef2f2', color: '#c0392b', border: '#f5c6cb', label: ' REFUSÉ' },
    EN_ATTENTE: { bg: '#fefce8', color: '#854d0e', border: '#fde047', label: ' EN ATTENTE' },
};

export default function Partenaires() {
    const [partners, setPartners] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch]     = useState('');
    const [filterStatut, setFilterStatut] = useState('TOUS');
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [menuOpen, setMenuOpen] = useState(null);
    const menuRef = useRef(null);

    const [modal, setModal]       = useState(null);
    const [editId, setEditId]     = useState(null);
    const [form, setForm]         = useState(MODAL_EMPTY);
    const [saving, setSaving]     = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => { fetchPartners(); }, []);

    useEffect(() => {
        let result = partners;
        if (search) {
            result = result.filter(p =>
                p.nom?.toLowerCase().includes(search.toLowerCase()) ||
                p.secteur?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterStatut !== 'TOUS') {
            result = result.filter(p => (p.statut || 'EN_ATTENTE') === filterStatut);
        }
        setFiltered(result);
    }, [search, filterStatut, partners]);

    useEffect(() => {
        const h = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(null);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const fetchPartners = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/federation/partenaires');
            setPartners(res.data);
        } catch {
            setError('Impossible de charger les partenaires.');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => { setForm(MODAL_EMPTY); setEditId(null); setModal('create'); };

    const openEdit = (p) => {
        setForm({
            nom:              p.nom || '',
            type:             p.type || 'SPONSOR',
            secteur:          p.secteur || '',
            emailContact:     p.emailContact || '',
            urlLogo:          p.urlLogo || '',
            siteWeb:          p.siteWeb || '',
            dateDebutContrat: p.dateDebutContrat ? p.dateDebutContrat.split('T')[0] : '',
            dateFinContrat:   p.dateFinContrat   ? p.dateFinContrat.split('T')[0]   : '',
            montant:          p.montant || '',
            actif:            p.actif ?? true
        });
        setEditId(p.id);
        setModal('edit');
        setMenuOpen(null);
    };

    const savePartner = async () => {
        setSaving(true);
        setError('');
        try {
            const payload = { ...form };
            if (modal === 'create') {
                await api.post('/federation/partenaires', payload);
            } else {
                await api.put(`/federation/partenaires/${editId}`, payload);
            }
            setModal(null);
            fetchPartners();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const deletePartner = async () => {
        try {
            await api.delete(`/federation/partenaires/${deleteId}`);
            setDeleteId(null);
            fetchPartners();
        } catch {
            setError('Erreur lors de la suppression');
        }
    };

    const validerPartenaire = async (id) => {
        try {
            await api.put(`/federation/partenaires/${id}/valider`);
            setConfirmAction(null);
            setMenuOpen(null);
            fetchPartners();
        } catch {
            setError('Erreur lors de la validation');
        }
    };

    const refuserPartenaire = async (id) => {
        try {
            await api.put(`/federation/partenaires/${id}/refuser`);
            setConfirmAction(null);
            setMenuOpen(null);
            fetchPartners();
        } catch {
            setError('Erreur lors du refus');
        }
    };

    const handle = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

    const stats = {
        total:      partners.length,
        valides:    partners.filter(p => p.statut === 'VALIDE').length,
        enAttente:  partners.filter(p => !p.statut || p.statut === 'EN_ATTENTE').length,
        refuses:    partners.filter(p => p.statut === 'REFUSE').length,
    };

    const menuBtnStyle = (color) => ({
        display: 'block', width: '100%', padding: '10px 16px', border: 'none',
        background: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', color
    });

    const renderModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
                    {modal === 'create' ? ' Ajouter un partenaire' : ' Modifier le partenaire'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                        { label: "Nom de l'entreprise *", name: 'nom', col: '1 / -1' },
                        { label: 'Secteur', name: 'secteur' },
                        { label: 'Email Contact', name: 'emailContact', type: 'email' },
                        { label: 'Site Web', name: 'siteWeb' },
                        { label: 'URL Logo', name: 'urlLogo', col: '1 / -1' },
                        { label: 'Date début contrat', name: 'dateDebutContrat', type: 'date' },
                        { label: 'Date fin contrat', name: 'dateFinContrat', type: 'date' },
                        { label: 'Montant contrat (DT)', name: 'montant', type: 'number' }, 
                    ].map(f => (
                        <div key={f.name} style={{ gridColumn: f.col || 'auto' }}>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#374151' }}>{f.label}</label>
                            <input name={f.name} type={f.type || 'text'} value={form[f.name]} onChange={handle} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                    ))}
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#374151' }}>Type</label>
                        <select name="type" value={form.type} onChange={handle} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
                            {PARTENAIRE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input type="checkbox" name="actif" checked={form.actif} onChange={handle} id="actif" style={{ width: 16, height: 16 }} />
                        <label htmlFor="actif" style={{ fontSize: 14, fontWeight: 600 }}>Actif</label>
                    </div>
                </div>
                {error && <div style={{ background: '#fef2f2', color: '#c0392b', padding: '10px', marginTop: 16, borderRadius: 8, fontSize: 13 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={() => setModal(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600 }}>Annuler</button>
                    <button onClick={savePartner} disabled={saving || !form.nom} style={{ flex: 1, padding: '12px', borderRadius: 10, background: saving ? '#f87171' : '#E63030', color: '#fff', border: 'none', fontWeight: 700 }}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
                </div>
            </div>
        </div>
    );

    const renderDeleteModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 380, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Supprimer le partenaire ?</h3>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff' }}>Annuler</button>
                    <button onClick={deletePartner} style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#E63030', color: '#fff', border: 'none' }}>Supprimer</button>
                </div>
            </div>
        </div>
    );

    const renderConfirmModal = () => {
        if (!confirmAction) return null;
        const isValider = confirmAction.type === 'valider';
        return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 400, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>{isValider ? '✅' : '❌'}</div>
                    <h3 style={{ fontWeight: 800, fontSize: 18 }}>{isValider ? 'Valider ?' : 'Refuser ?'}</h3>
                    <p>{confirmAction.nom}</p>
                    <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                        <button onClick={() => setConfirmAction(null)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd' }}>Annuler</button>
                        <button onClick={() => isValider ? validerPartenaire(confirmAction.id) : refuserPartenaire(confirmAction.id)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: isValider ? '#16a34a' : '#E63030', color: '#fff', border: 'none' }}>Confirmer</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>Partenaires fédéraux</h1>
                    <p style={{ color: '#888' }}>{filtered.length} partenaires</p>
                </div>
                <button onClick={openCreate} style={{ background: '#E63030', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontWeight: 700, cursor: 'pointer' }}>🤝 Ajouter un partenaire</button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                    { label: 'Total', value: stats.total, bg: '#f8fafc', color: '#334155', border: '#e2e8f0' },
                    { label: 'Validés', value: stats.valides, bg: '#f0fdf4', color: '#166534', border: '#86efac' },
                    { label: 'En attente', value: stats.enAttente, bg: '#fefce8', color: '#854d0e', border: '#fde047' },
                    { label: 'Refusés', value: stats.refuses, bg: '#fef2f2', color: '#c0392b', border: '#f5c6cb' },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: '16px 20px' }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '10px', borderRadius: 10, border: '1.5px solid #e0e0e0', flex: 1 }} />
                {['TOUS', 'EN_ATTENTE', 'VALIDE', 'REFUSE'].map(s => (
                    <button key={s} onClick={() => setFilterStatut(s)} style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer', background: filterStatut === s ? '#334155' : '#fff', color: filterStatut === s ? '#fff' : '#888', border: '1px solid #e0e0e0' }}>{s}</button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#fafafa' }}>
                    <tr>
                        {['NOM', 'TYPE', 'MONTANT', 'CONTACT', 'CONTRAT', 'STATUT', 'ACTIF', ''].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#999' }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(p => {
                        const tc = typeColor[p.type] || { bg: '#eee', color: '#333', border: '#ddd' };
                        const sc = statutColor[p.statut || 'EN_ATTENTE'];
                        return (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <td style={{ padding: '14px 16px' }}><strong>{p.nom}</strong></td>
                                <td style={{ padding: '14px 16px' }}><span style={{ background: tc.bg, color: tc.color, padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>{p.type}</span></td>
                                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{p.montant ? `${p.montant} DT` : '0 DT'}</td>
                                <td style={{ padding: '14px 16px', fontSize: 13 }}>{p.emailContact}</td>
                                <td style={{ padding: '14px 16px', fontSize: 12 }}>{formatDate(p.dateDebutContrat)}</td>
                                <td style={{ padding: '14px 16px' }}><span style={{ background: sc.bg, color: sc.color, padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>{sc.label}</span></td>
                                <td style={{ padding: '14px 16px' }}>{p.actif ? '✅' : '❌'}</td>
                                <td style={{ padding: '14px 16px', position: 'relative' }}>
                                    <button onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}>⋮</button>
                                    {menuOpen === p.id && (
                                        <div ref={menuRef} style={{ position: 'absolute', right: 0, background: '#fff', border: '1px solid #eee', borderRadius: 10, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                            <button onClick={() => openEdit(p)} style={menuBtnStyle('#333')}>✏️ Modifier</button>
                                            <button onClick={() => setConfirmAction({ type: 'valider', id: p.id, nom: p.nom })} style={menuBtnStyle('#16a34a')}>✅ Valider</button>
                                            <button onClick={() => setConfirmAction({ type: 'refuser', id: p.id, nom: p.nom })} style={menuBtnStyle('#dc2626')}>❌ Refuser</button>
                                            <button onClick={() => setDeleteId(p.id)} style={menuBtnStyle('#dc2626')}>🗑️ Supprimer</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {modal && renderModal()}
            {deleteId && renderDeleteModal()}
            {confirmAction && renderConfirmModal()}
        </div>
    );
}