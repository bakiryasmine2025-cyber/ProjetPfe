import { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig.js';

const NIVEAUX  = ['LOCAL', 'REGIONAL', 'NATIONAL', 'INTERNATIONAL'];
const STATUTS  = ['ACTIF', 'INACTIF', 'SUSPENDU'];
const GENRES   = ['MASCULIN', 'FEMININ'];

const emptyForm = {
    nom: '', prenom: '', email: '', telephone: '',
    adresse: '', dateNaissance: '', genre: 'MASCULIN',
    niveau: 'NATIONAL', qualification: '', certificationDate: '',
    disponibilite: true, anneesExperience: '', federationArbitrage: '',
    statut: 'ACTIF',
};

export default function FederationArbitres() {
    const [arbitres, setArbitres]       = useState([]);
    const [matches, setMatches]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [success, setSuccess]         = useState('');
    const [search, setSearch]           = useState('');
    const [filterStatut, setFilterStatut] = useState('');
    const [filterNiveau, setFilterNiveau] = useState('');

    // Modal états
    const [showForm, setShowForm]       = useState(false);
    const [editId, setEditId]           = useState(null);
    const [form, setForm]               = useState(emptyForm);
    const [certFile, setCertFile]       = useState(null);
    const [saving, setSaving]           = useState(false);

    // Assign modal
    const [showAssign, setShowAssign]   = useState(false);
    const [assignArbitreId, setAssignArbitreId] = useState(null);
    const [assignMatchId, setAssignMatchId]     = useState('');

    // Delete confirm
    const [deleteId, setDeleteId]       = useState(null);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const arbRes = await api.get('/federation/arbitres');
            setArbitres(arbRes.data || []);
        } catch {
            setError('Erreur chargement arbitres');
        }
        try {
            const matchRes = await api.get('/federation/matchs');
            setMatchs(matchRes.data || []);
        } catch {
            // silencieux
        }
        setLoading(false);
    };

    const openCreate = () => {
        setEditId(null);
        setForm(emptyForm);
        setCertFile(null);
        setShowForm(true);
    };

    const openEdit = (a) => {
        setEditId(a.id);
        setForm({
            nom: a.nom || '', prenom: a.prenom || '',
            email: a.email || '', telephone: a.telephone || '',
            adresse: a.adresse || '',
            dateNaissance: a.dateNaissance || '',
            genre: a.genre || 'MASCULIN',
            niveau: a.niveau || 'NATIONAL',
            qualification: a.qualification || '',
            certificationDate: a.certificationDate || '',
            disponibilite: a.disponibilite ?? true,
            anneesExperience: a.anneesExperience || '',
            federationArbitrage: a.federationArbitrage || '',
            statut: a.statut || 'ACTIF',
        });
        setCertFile(null);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.nom || !form.prenom || !form.email) {
            setError('Nom, prénom et email sont obligatoires'); return;
        }
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(form)], { type: 'application/json' }));
            if (certFile) formData.append('certification', certFile);

            if (editId) {
                await api.put(`/federation/arbitres/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setSuccess('Arbitre modifié avec succès');
            } else {
                await api.post('/federation/arbitres', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setSuccess('Arbitre ajouté avec succès');
            }
            setShowForm(false);
            await fetchAll();
        } catch (e) {
            setError(e.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/federation/arbitres/${deleteId}`);
            setSuccess('Arbitre supprimé');
            setDeleteId(null);
            await fetchAll();
        } catch { setError('Erreur suppression'); }
    };

    const handleAssign = async () => {
        if (!assignMatchId) { setError('Sélectionner un matchs'); return; }
        try {
            await api.put(`/federation/arbitres/${assignArbitreId}/assigner/${assignMatchId}`);
            setSuccess('Arbitre assigné au matchs');
            setShowAssign(false);
            setAssignMatchId('');
            await fetchAll();
        } catch { setError('Erreur assignation'); }
    };

    const filtered = arbitres.filter(a => {
        const matchSearch  = !search       ||
            a.nom?.toLowerCase().includes(search.toLowerCase()) ||
            a.prenom?.toLowerCase().includes(search.toLowerCase()) ||
            a.email?.toLowerCase().includes(search.toLowerCase());
        const matchStatut  = !filterStatut || a.statut === filterStatut;
        const matchNiveau  = !filterNiveau || a.niveau === filterNiveau;
        return matchSearch && matchStatut && matchNiveau;
    });

    const statutStyle = (s) => {
        if (s === 'ACTIF')    return { bg: '#f0fdf4', color: '#166534', border: '#86efac' };
        if (s === 'SUSPENDU') return { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' };
        return                       { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
    };

    const niveauStyle = (n) => {
        if (n === 'INTERNATIONAL') return { bg: '#fdf4ff', color: '#7e22ce' };
        if (n === 'NATIONAL')      return { bg: '#eff6ff', color: '#1e40af' };
        if (n === 'REGIONAL')      return { bg: '#f0fdf4', color: '#166534' };
        return                            { bg: '#f3f4f6', color: '#374151' };
    };

    const initiales = (nom, prenom) =>
        `${nom?.[0] ?? ''}${prenom?.[0] ?? ''}`.toUpperCase();

    const totalActifs    = arbitres.filter(a => a.statut === 'ACTIF').length;
    const totalCertifies = arbitres.filter(a => a.cheminCertification).length;
    const totalDispos    = arbitres.filter(a => a.disponibilite).length;

    const inputStyle = {
        width: '100%', padding: '9px 12px', border: '1.5px solid #e0e0e0',
        borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
        background: '#fff',
    };
    const labelStyle = { fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 4, display: 'block' };
    const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 4 };

    return (
        <div>
            {/* ── HEADER ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>Gestion des Arbitres</h1>
                    <p style={{ color: '#888', fontSize: 14 }}>{arbitres.length} arbitre(s) enregistré(s)</p>
                </div>
                <button onClick={openCreate} style={{ padding: '10px 20px', background: '#E63030', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    + Ajouter un arbitre
                </button>
            </div>

            {/* ── KPI CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    {  label: 'Total arbitres', value: arbitres.length, bg: '#fef2f2', color: '#E63030' },
                    {    label: 'Actifs',          value: totalActifs,    bg: '#f0fdf4', color: '#166534' },
                    {    label: 'Certifiés',       value: totalCertifies, bg: '#eff6ff', color: '#1e40af' },
                    {    label: 'Disponibles',     value: totalDispos,    bg: '#fdf4ff', color: '#7e22ce' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#111', lineHeight: 1 }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── ALERTS ── */}
            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b' }}>✕</button>
                </div>
            )}
            {success && (
                <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <span>✅ {success}</span>
                    <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}>✕</button>
                </div>
            )}

            {/* ── FILTRES ── */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>🔍</span>
                    <input placeholder="Rechercher un arbitre..." value={search} onChange={e => setSearch(e.target.value)}
                           style={{ ...inputStyle, paddingLeft: 36 }} />
                </div>
                <select value={filterNiveau} onChange={e => setFilterNiveau(e.target.value)}
                        style={{ ...inputStyle, width: 'auto', minWidth: 160, cursor: 'pointer' }}>
                    <option value="">Tous les niveaux</option>
                    {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
                        style={{ ...inputStyle, width: 'auto', minWidth: 150, cursor: 'pointer' }}>
                    <option value="">Tous les statuts</option>
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {(search || filterStatut || filterNiveau) && (
                    <button onClick={() => { setSearch(''); setFilterStatut(''); setFilterNiveau(''); }}
                            style={{ ...inputStyle, width: 'auto', cursor: 'pointer', color: '#666' }}>✕ Reset</button>
                )}
            </div>

            {/* ── LISTE ARBITRES ── */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Chargement...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>👨‍⚖️</div>
                        <p>Aucun arbitre trouvé</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                            {['ARBITRE', 'CONTACT', 'NIVEAU', 'EXPÉRIENCE', 'FÉDÉRATION', 'CERTIF', 'DISPO', 'STATUT', 'ACTIONS'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((a, idx) => {
                            const st = statutStyle(a.statut);
                            const nv = niveauStyle(a.niveau);
                            return (
                                <tr key={a.id}
                                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseOut={e => e.currentTarget.style.background = '#fff'}>

                                    {/* Arbitre */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#E63030', flexShrink: 0 }}>
                                                {initiales(a.nom, a.prenom)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{a.nom} {a.prenom}</div>
                                                {a.dateNaissance && <div style={{ fontSize: 11, color: '#999' }}>né(e) le {new Date(a.dateNaissance).toLocaleDateString('fr-TN')}</div>}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ fontSize: 13, color: '#555' }}>{a.email}</div>
                                        {a.telephone && <div style={{ fontSize: 12, color: '#999' }}>{a.telephone}</div>}
                                    </td>

                                    {/* Niveau */}
                                    <td style={{ padding: '14px 16px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: nv.bg, color: nv.color }}>
                                                {a.niveau || '—'}
                                            </span>
                                    </td>

                                    {/* Expérience */}
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#555' }}>
                                        {a.anneesExperience ? `${a.anneesExperience} ans` : '—'}
                                    </td>

                                    {/* Fédération */}
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#555', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {a.federationArbitrage || '—'}
                                    </td>

                                    {/* Certification */}
                                    <td style={{ padding: '14px 16px' }}>
                                        {a.cheminCertification ? (
                                            <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#1e40af' }}>📄 Oui</span>
                                        ) : (
                                            <span style={{ fontSize: 12, color: '#ccc' }}>—</span>
                                        )}
                                    </td>

                                    {/* Disponibilité */}
                                    <td style={{ padding: '14px 16px' }}>
                                            <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: a.disponibilite ? '#f0fdf4' : '#f3f4f6', color: a.disponibilite ? '#166534' : '#6b7280' }}>
                                                {a.disponibilite ? '✓ Dispo' : 'Indispo'}
                                            </span>
                                    </td>

                                    {/* Statut */}
                                    <td style={{ padding: '14px 16px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                                {a.statut}
                                            </span>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => openEdit(a)}
                                                    style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                ✏️ Modifier
                                            </button>
                                            <button onClick={() => { setAssignArbitreId(a.id); setShowAssign(true); }}
                                                    style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #a7f3d0', background: '#ecfdf5', color: '#065f46', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                📅 Assigner
                                            </button>
                                            <button onClick={() => setDeleteId(a.id)}
                                                    style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fef2f2', color: '#991b1b', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ══════════════════════════════════════════
                MODAL — FORMULAIRE AJOUT / MODIFICATION
            ══════════════════════════════════════════ */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

                        {/* Modal header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>
                                    {editId ? '✏️ Modifier l\'arbitre' : '➕ Ajouter un arbitre'}
                                </h2>
                                <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Remplir les informations ci-dessous</p>
                            </div>
                            <button onClick={() => setShowForm(false)} style={{ background: '#f5f5f5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#666' }}>✕</button>
                        </div>

                        <div style={{ padding: '24px' }}>

                            {/* ── Section 1: Informations personnelles ── */}
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#E63030', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #fef2f2' }}>
                                    👤 Informations personnelles
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Nom *</label>
                                        <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="Ben Salah" style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Prénom *</label>
                                        <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} placeholder="Ahmed" style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Adresse email *</label>
                                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ahmed@email.com" style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Numéro de téléphone</label>
                                        <input value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} placeholder="+216 XX XXX XXX" style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Date de naissance</label>
                                        <input type="date" value={form.dateNaissance} onChange={e => setForm({...form, dateNaissance: e.target.value})} style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Genre</label>
                                        <select value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} style={inputStyle}>
                                            {GENRES.map(g => <option key={g} value={g}>{g === 'MASCULIN' ? '♂ Masculin' : '♀ Féminin'}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                                        <label style={labelStyle}>Adresse postale</label>
                                        <input value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})} placeholder="12 Rue de la République, Tunis" style={inputStyle} />
                                    </div>
                                </div>
                            </div>

                            {/* ── Section 2: Expérience arbitrage ── */}
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e40af', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #eff6ff' }}>
                                    ⚖️ Expérience en arbitrage
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Niveau d'arbitrage</label>
                                        <select value={form.niveau} onChange={e => setForm({...form, niveau: e.target.value})} style={inputStyle}>
                                            {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Années d'expérience</label>
                                        <input type="number" min="0" value={form.anneesExperience} onChange={e => setForm({...form, anneesExperience: e.target.value})} placeholder="5" style={inputStyle} />
                                    </div>
                                    <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                                        <label style={labelStyle}>Qualification</label>
                                        <input value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} placeholder="ex: Arbitre FIFA, UEFA..." style={inputStyle} />
                                    </div>
                                </div>
                            </div>

                            {/* ── Section 3: Certification ── */}
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#166534', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #f0fdf4' }}>
                                    🏅 Certification d'arbitre
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Avez-vous une certification ?</label>
                                        <select value={form.disponibilite ? 'true' : 'false'}
                                                onChange={e => setForm({...form, disponibilite: e.target.value === 'true'})}
                                                style={inputStyle}>
                                            <option value="true">✓ Oui</option>
                                            <option value="false">✕ Non</option>
                                        </select>
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Date de certification</label>
                                        <input type="date" value={form.certificationDate} onChange={e => setForm({...form, certificationDate: e.target.value})} style={inputStyle} />
                                    </div>
                                    <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                                        <label style={labelStyle}>Fédération d'Arbitrage affiliée</label>
                                        <input value={form.federationArbitrage} onChange={e => setForm({...form, federationArbitrage: e.target.value})} placeholder="ex: Fédération Tunisienne de Rugby" style={inputStyle} />
                                    </div>
                                    <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                                        <label style={labelStyle}>Télécharger une copie de votre certification</label>
                                        <div style={{ border: '2px dashed #e0e0e0', borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
                                             onClick={() => document.getElementById('certInput').click()}>
                                            {certFile ? (
                                                <div style={{ color: '#166534', fontWeight: 600, fontSize: 14 }}>
                                                    📄 {certFile.name}
                                                    <button onClick={e => { e.stopPropagation(); setCertFile(null); }}
                                                            style={{ marginLeft: 8, background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontSize: 14 }}>✕</button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ fontSize: 28, marginBottom: 6 }}>📁</div>
                                                    <div style={{ fontSize: 14, color: '#888' }}>Cliquer pour uploader (PDF, JPG, PNG)</div>
                                                    {form.cheminCertification && <div style={{ fontSize: 12, color: '#1e40af', marginTop: 4 }}>📄 Fichier actuel: {form.cheminCertification}</div>}
                                                </div>
                                            )}
                                        </div>
                                        <input id="certInput" type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                                               onChange={e => setCertFile(e.target.files[0])} />
                                    </div>
                                </div>
                            </div>

                            {/* ── Section 4: Statut ── */}
                            {editId && (
                                <div style={{ marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#92400e', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #fffbeb' }}>
                                        ⚙️ Statut
                                    </h3>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Statut de l'arbitre</label>
                                        <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value})} style={{ ...inputStyle, maxWidth: 200 }}>
                                            {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Boutons */}
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #eee' }}>
                                <button onClick={() => setShowForm(false)}
                                        style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#666' }}>
                                    Annuler
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                        style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: saving ? '#ccc' : '#E63030', color: '#fff', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                                    {saving ? 'Enregistrement...' : editId ? '✓ Modifier' : '✓ Ajouter'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════
                MODAL — ASSIGNER MATCH
            ══════════════════════════════════════════ */}
            {showAssign && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 6 }}>📅 Assigner à un match</h2>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Choisir le match pour cet arbitre</p>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>Sélectionner un match</label>
                            <select value={assignMatchId} onChange={e => setAssignMatchId(e.target.value)} style={inputStyle}>
                                <option value="">-- Choisir un match --</option>
                                {matches
                                    .filter(m => m.statut !== 'TERMINE')
                                    .map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.equipeDomicileNom} vs {m.equipeExterieureNom} — {m.dateMatch ? new Date(m.dateMatch).toLocaleDateString('fr-TN') : '—'} {m.lieu ? `(${m.lieu})` : ''}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                            <button onClick={() => { setShowAssign(false); setAssignMatchId(''); }}
                                    style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#666' }}>
                                Annuler
                            </button>
                            <button onClick={handleAssign}
                                    style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#065f46', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                                ✓ Assigner
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════
                MODAL — CONFIRMATION SUPPRESSION
            ══════════════════════════════════════════ */}
            {deleteId && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 8 }}>Supprimer l'arbitre ?</h2>
                        <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>Cette action est irréversible.</p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button onClick={() => setDeleteId(null)}
                                    style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#666' }}>
                                Annuler
                            </button>
                            <button onClick={handleDelete}
                                    style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#E63030', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                                ✓ Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}