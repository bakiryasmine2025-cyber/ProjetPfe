import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const EMPTY_JOUEUR = {
    nom: '', prenom: '', dateNaissance: '', genre: 'MASCULIN',
    telephone: '', email: '', poste: '', categorie: 'SENIOR',
    cin: '', numeroLicence: '', certificatMedical: false
};

const EMPTY_STAFF = {
    nom: '', prenom: '', dateNaissance: '', typeStaff: 'ENTRAINEUR',
    telephone: '', email: '', qualification: '', anneeExperience: 0
};

const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontSize: 14 };
const lbl = { fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 };

export default function ClubManagement() {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [joueurs, setJoueurs]   = useState([]);
    const [staff, setStaff]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [expandedJoueurs, setExpandedJoueurs] = useState(true);
    const [expandedStaff, setExpandedStaff]     = useState(false);

    const [modalJ, setModalJ]   = useState(false);
    const [editIdJ, setEditIdJ] = useState(null);
    const [formJ, setFormJ]     = useState(EMPTY_JOUEUR);
    const [savingJ, setSavingJ] = useState(false);
    const [menuJ, setMenuJ]     = useState(null);
    const [searchJ, setSearchJ] = useState('');

    const [modalS, setModalS]   = useState(false);
    const [editIdS, setEditIdS] = useState(null);
    const [formS, setFormS]     = useState(EMPTY_STAFF);
    const [savingS, setSavingS] = useState(false);
    const [menuS, setMenuS]     = useState(null);

    useEffect(() => {
        fetchAll();
        const h = (e) => { if (!e.target.closest('[data-menu]')) { setMenuJ(null); setMenuS(null); } };
        document.addEventListener('click', h);
        return () => document.removeEventListener('click', h);
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [joueursRes, staffRes, dashRes] = await Promise.all([
                api.get('/club-admin/joueurs'),
                api.get('/club-admin/staff'),
                api.get('/club-admin/dashboard')
            ]);
            setJoueurs(joueursRes.data);
            setStaff(staffRes.data);
            setDashboardStats(dashRes.data);
        } catch (err) {
            const status = err.response?.status;
            if (status === 403) setError("Accès refusé.");
            else if (status === 400) setError("Compte non associé à un club.");
            else setError('Erreur chargement données');
        } finally { setLoading(false); }
    };

    const handleJ = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormJ({ ...formJ, [e.target.name]: val });
    };

    const openCreateJ = () => { setFormJ(EMPTY_JOUEUR); setEditIdJ(null); setModalJ(true); };
    const openEditJ = (j) => {
        setFormJ({
            nom: j.nom || '', prenom: j.prenom || '', dateNaissance: j.dateNaissance || '',
            genre: j.genre || 'MASCULIN', telephone: j.telephone || '',
            email: j.email || '', poste: j.poste || '', categorie: j.categorie || 'SENIOR',
            cin: j.cin || '', numeroLicence: j.numeroLicence || '',
            certificatMedical: j.certificatMedical ?? false
        });
        setEditIdJ(j.id); setModalJ(true); setMenuJ(null);
    };

    const saveJoueur = async () => {
        if (!formJ.cin.trim()) { alert('Le CIN est obligatoire'); return; }
        if (!formJ.numeroLicence.trim()) { alert('Le numéro de licence est obligatoire'); return; }
        if (!formJ.certificatMedical) { alert('Le certificat médical est obligatoire'); return; }
        setSavingJ(true);
        try {
            if (editIdJ) {
                await api.put(`/club-admin/joueurs/${editIdJ}`, formJ);
            } else {
                await api.post('/club-admin/joueurs', formJ);
            }
            setModalJ(false);
            setFormJ(EMPTY_JOUEUR);
            setEditIdJ(null);
            await fetchAll();
        } catch (err) {
            console.log('Error:', err.response?.data);
            setError(err.response?.data?.message || 'Erreur enregistrement joueur');
        } finally {
            setSavingJ(false);
        }


    };

    const deleteJoueur = async (id) => {
        if (!window.confirm('Supprimer ce joueur ?')) return;
        try { await api.delete(`/club-admin/joueurs/${id}`); setMenuJ(null); await fetchAll(); }
        catch { setError('Erreur suppression joueur'); }
    };
    const accepterJoueur = async (id) => {
        try { await api.put(`/club-admin/joueurs/${id}/accepter`); setMenuJ(null); await fetchAll(); }
        catch { setError('Erreur acceptation'); }
    };
    const bloquerJoueur = async (id) => {
        try { await api.put(`/club-admin/joueurs/${id}/bloquer`); setMenuJ(null); await fetchAll(); }
        catch { setError('Erreur blocage'); }
    };

    const openCreateS = () => { setFormS(EMPTY_STAFF); setEditIdS(null); setModalS(true); };
    const openEditS = (s) => {
        setFormS({
            nom: s.nom || '', prenom: s.prenom || '', dateNaissance: s.dateNaissance || '',
            typeStaff: s.typeStaff || 'ENTRAINEUR', telephone: s.telephone || '',
            email: s.email || '', qualification: s.qualification || '',
            anneeExperience: s.anneeExperience || 0
        });
        setEditIdS(s.id); setModalS(true); setMenuS(null);
    };
    const saveStaff = async () => {
        setSavingS(true);
        try {
            if (editIdS) await api.put(`/club-admin/staff/${editIdS}`, formS);
            else await api.post('/club-admin/staff', formS);
            setModalS(false); setFormS(EMPTY_STAFF); setEditIdS(null);
            await fetchAll();
        } catch { setError('Erreur enregistrement staff'); }
        finally { setSavingS(false); }
    };
    const deleteStaff = async (id) => {
        if (!window.confirm('Supprimer ce membre du staff ?')) return;
        try { await api.delete(`/club-admin/staff/${id}`); setMenuS(null); await fetchAll(); }
        catch { setError('Erreur suppression staff'); }
    };

    const filteredJ = joueurs.filter(j =>
        !searchJ || j.nom?.toLowerCase().includes(searchJ.toLowerCase()) ||
        j.prenom?.toLowerCase().includes(searchJ.toLowerCase())
    );

    const statutStyle = (statut) => {
        if (statut === 'ACCEPTE') return { bg: '#f0fdf4', color: '#166534', label: '✓ Accepté' };
        if (statut === 'BLOQUE')  return { bg: '#fef2f2', color: '#991b1b', label: '✕ Bloqué' };
        return { bg: '#fffbeb', color: '#92400e', label: '⏳ En attente' };
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>;

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                    Mon Club
                    {dashboardStats?.nomClub && (
                        <span style={{ fontSize: 18, fontWeight: 500, color: '#888', marginLeft: 12 }}>
                            — {dashboardStats.nomClub}
                        </span>
                    )}
                </h1>
                <p style={{ color: '#888', fontSize: 14 }}>Gérez les joueurs et le staff de votre club</p>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: 16 }}>✕</button>
                </div>
            )}

            {/* Stats rapides */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                    { label: 'Joueurs',     value: dashboardStats?.nombreJoueurs     ?? 0, color: '#1e40af', bg: '#eff6ff' },
                    { label: 'Staff',       value: dashboardStats?.nombreStaff       ?? 0, color: '#166534', bg: '#f0fdf4' },
                    { label: 'Équipes',     value: dashboardStats?.nombreEquipes     ?? 0, color: '#92400e', bg: '#fffbeb' },
                    { label: 'Partenaires', value: dashboardStats?.nombrePartenaires ?? 0, color: '#6b21a8', bg: '#faf5ff' },
                ].map(s => (
                    <div key={s.label} style={{ padding: '16px 20px', background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: s.color, opacity: 0.8 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Section Joueurs ── */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', cursor: 'pointer', borderBottom: expandedJoueurs ? '1px solid #eee' : 'none' }}
                     onClick={() => setExpandedJoueurs(!expandedJoueurs)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Joueurs</span>
                        <span style={{ background: '#E63030', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{joueurs.length}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={(e) => { e.stopPropagation(); openCreateJ(); }}
                                style={{ background: '#E63030', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                            + Ajouter un joueur
                        </button>
                        <span style={{ fontSize: 18, color: '#888' }}>{expandedJoueurs ? '∧' : '∨'}</span>
                    </div>
                </div>

                {expandedJoueurs && (
                    <div>
                        <div style={{ padding: '12px 24px', borderBottom: '1px solid #f5f5f5' }}>
                            <div style={{ position: 'relative', maxWidth: 320 }}>
                                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 14 }}>🔍</span>
                                <input placeholder="Rechercher un joueur..." value={searchJ}
                                       onChange={e => setSearchJ(e.target.value)}
                                       style={{ width: '100%', padding: '8px 12px 8px 30px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#fafafa' }}>
                                {['NOM', 'PRÉNOM', 'CIN', 'GENRE', 'POSTE', 'CATÉGORIE', 'TÉLÉPHONE', 'CERT. MÉD.', 'STATUT', ''].map(h => (
                                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 }}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredJ.length === 0 ? (
                                <tr><td colSpan={10} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                                    <p>Aucun joueur — cliquez sur "+ Ajouter un joueur"</p>
                                </td></tr>
                            ) : filteredJ.map((j) => {
                                const st = statutStyle(j.statut);
                                return (
                                    <tr key={j.id} style={{ borderTop: '1px solid #f5f5f5' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                        onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#111' }}>{j.nom}</td>
                                        <td style={{ padding: '12px 16px', color: '#555' }}>{j.prenom}</td>
                                        <td style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>{j.cin || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: j.genre === 'MASCULIN' ? '#eff6ff' : '#fdf4ff', color: j.genre === 'MASCULIN' ? '#1e40af' : '#7e22ce' }}>
                                                {j.genre === 'MASCULIN' ? '♂ M' : '♀ F'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>{j.poste || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: '#f3f4f6', color: '#374151' }}>{j.categorie || '—'}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#888', fontSize: 13 }}>{j.telephone || '—'}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <span style={{ fontSize: 16 }}>{j.certificatMedical ? '✅' : '❌'}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color }}>{st.label}</span>
                                        </td>
                                        <td data-menu="true" style={{ padding: '12px 16px', position: 'relative' }}>
                                            <button data-menu="true"
                                                    onClick={(e) => { e.stopPropagation(); setMenuJ(menuJ === j.id ? null : j.id); }}
                                                    style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>⋮</button>
                                            {menuJ === j.id && (
                                                <div data-menu="true" style={{ position: 'absolute', right: 8, top: '100%', background: '#fff', border: '1px solid #eee', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 180, overflow: 'hidden' }}>
                                                    <button data-menu="true" onClick={() => openEditJ(j)}
                                                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#333' }}
                                                            onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                                                            onMouseOut={e => e.currentTarget.style.background = 'none'}>✏️ Modifier</button>
                                                    {j.statut !== 'ACCEPTE' && (
                                                        <button data-menu="true" onClick={() => accepterJoueur(j.id)}
                                                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#166534' }}
                                                                onMouseOver={e => e.currentTarget.style.background = '#f0fdf4'}
                                                                onMouseOut={e => e.currentTarget.style.background = 'none'}>✅ Accepter</button>
                                                    )}
                                                    {j.statut !== 'BLOQUE' && (
                                                        <button data-menu="true" onClick={() => bloquerJoueur(j.id)}
                                                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#92400e' }}
                                                                onMouseOver={e => e.currentTarget.style.background = '#fffbeb'}
                                                                onMouseOut={e => e.currentTarget.style.background = 'none'}>🚫 Bloquer</button>
                                                    )}
                                                    <button data-menu="true" onClick={() => deleteJoueur(j.id)}
                                                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#E63030', borderTop: '1px solid #f5f5f5' }}
                                                            onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                                                            onMouseOut={e => e.currentTarget.style.background = 'none'}>🗑️ Supprimer</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Section Staff ── */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', cursor: 'pointer', borderBottom: expandedStaff ? '1px solid #eee' : 'none' }}
                     onClick={() => setExpandedStaff(!expandedStaff)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Staff Technique</span>
                        <span style={{ background: '#1e40af', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{staff.length}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={(e) => { e.stopPropagation(); openCreateS(); }}
                                style={{ background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                            + Ajouter staff
                        </button>
                        <span style={{ fontSize: 18, color: '#888' }}>{expandedStaff ? '∧' : '∨'}</span>
                    </div>
                </div>

                {expandedStaff && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#fafafa' }}>
                            {['NOM', 'PRÉNOM', 'TYPE', 'QUALIFICATION', 'EXP.', 'TÉLÉPHONE', ''].map(h => (
                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {staff.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                                <p>Aucun staff — cliquez sur "+ Ajouter staff"</p>
                            </td></tr>
                        ) : staff.map((s) => (
                            <tr key={s.id} style={{ borderTop: '1px solid #f5f5f5' }}
                                onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#111' }}>{s.nom}</td>
                                <td style={{ padding: '12px 16px', color: '#555' }}>{s.prenom}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: '#f0fdf4', color: '#166534', border: '1px solid #86efac' }}>{s.typeStaff}</span>
                                </td>
                                <td style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>{s.qualification || '—'}</td>
                                <td style={{ padding: '12px 16px', color: '#888', fontSize: 13 }}>{s.anneeExperience != null ? `${s.anneeExperience} ans` : '—'}</td>
                                <td style={{ padding: '12px 16px', color: '#888', fontSize: 13 }}>{s.telephone || '—'}</td>
                                <td data-menu="true" style={{ padding: '12px 16px', position: 'relative' }}>
                                    <button data-menu="true"
                                            onClick={(e) => { e.stopPropagation(); setMenuS(menuS === s.id ? null : s.id); }}
                                            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>⋮</button>
                                    {menuS === s.id && (
                                        <div data-menu="true" style={{ position: 'absolute', right: 8, top: '100%', background: '#fff', border: '1px solid #eee', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 160, overflow: 'hidden' }}>
                                            <button data-menu="true" onClick={() => openEditS(s)}
                                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#333' }}
                                                    onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                                                    onMouseOut={e => e.currentTarget.style.background = 'none'}>✏️ Modifier</button>
                                            <button data-menu="true" onClick={() => deleteStaff(s.id)}
                                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#E63030', borderTop: '1px solid #f5f5f5' }}
                                                    onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                                                    onMouseOut={e => e.currentTarget.style.background = 'none'}>🗑️ Supprimer</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Modal Joueur ── */}
            {modalJ && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
                            {editIdJ ? '✏️ Modifier le joueur' : '🏉 Ajouter un joueur'}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {/* Nom / Prénom */}
                            <div>
                                <label style={lbl}>Nom *</label>
                                <input name="nom" value={formJ.nom} onChange={handleJ} style={inp} />
                            </div>
                            <div>
                                <label style={lbl}>Prénom *</label>
                                <input name="prenom" value={formJ.prenom} onChange={handleJ} style={inp} />
                            </div>

                            {/* CIN — obligatoire */}
                            <div>
                                <label style={lbl}>
                                    CIN * <span style={{ color: '#E63030', fontSize: 11 }}>(obligatoire)</span>
                                </label>
                                <input name="cin" value={formJ.cin} onChange={handleJ}
                                       placeholder="Ex: 12345678" style={inp} />
                            </div>

                            {/* Numéro licence — obligatoire */}
                            <div>
                                <label style={lbl}>
                                    Numéro de licence * <span style={{ color: '#E63030', fontSize: 11 }}>(obligatoire)</span>
                                </label>
                                <input name="numeroLicence" value={formJ.numeroLicence} onChange={handleJ}
                                       placeholder="Ex: LIC-2024-001" style={inp} />
                            </div>

                            {/* Téléphone / Email */}
                            <div>
                                <label style={lbl}>Téléphone</label>
                                <input name="telephone" value={formJ.telephone} onChange={handleJ} style={inp} />
                            </div>
                            <div>
                                <label style={lbl}>Email</label>
                                <input name="email" type="email" value={formJ.email} onChange={handleJ} style={inp} />
                            </div>

                            {/* Poste / Date naissance */}
                            <div>
                                <label style={lbl}>Poste</label>
                                <input name="poste" value={formJ.poste} onChange={handleJ} style={inp} />
                            </div>
                            <div>
                                <label style={lbl}>Date de naissance</label>
                                <input type="date" name="dateNaissance" value={formJ.dateNaissance} onChange={handleJ} style={inp} />
                            </div>

                            {/* Genre / Catégorie */}
                            <div>
                                <label style={lbl}>Genre</label>
                                <select name="genre" value={formJ.genre} onChange={handleJ} style={{ ...inp, background: '#fff' }}>
                                    <option value="MASCULIN">Masculin</option>
                                    <option value="FEMININ">Féminin</option>
                                </select>
                            </div>
                            <div>
                                <label style={lbl}>Catégorie</label>
                                <select name="categorie" value={formJ.categorie} onChange={handleJ} style={{ ...inp, background: '#fff' }}>
                                    <option value="SENIOR">Sénior</option>
                                    <option value="JUNIOR">Junior</option>
                                    <option value="CADET">Cadet</option>
                                    <option value="MINIME">Minime</option>
                                    <option value="ECOLE">École de Rugby</option>
                                </select>
                            </div>

                            {/* Certificat médical — obligatoire */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 16px',
                                    background: formJ.certificatMedical ? '#f0fdf4' : '#fef2f2',
                                    border: `1.5px solid ${formJ.certificatMedical ? '#86efac' : '#fca5a5'}`,
                                    borderRadius: 8, cursor: 'pointer'
                                }} onClick={() => setFormJ({ ...formJ, certificatMedical: !formJ.certificatMedical })}>
                                    <input type="checkbox" name="certificatMedical"
                                           checked={formJ.certificatMedical} onChange={handleJ}
                                           style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#166634' }} />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: formJ.certificatMedical ? '#166534' : '#991b1b' }}>
                                            Certificat médical * <span style={{ fontSize: 11, fontWeight: 400 }}>(obligatoire)</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                            {formJ.certificatMedical ? '✅ Certificat médical fourni' : '❌ Le joueur doit fournir un certificat médical valide'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                            <button onClick={() => { setModalJ(false); setFormJ(EMPTY_JOUEUR); setEditIdJ(null); }}
                                    style={{ flex: 1, padding: 12, borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                                Annuler
                            </button>
                            <button onClick={saveJoueur} disabled={savingJ}
                                    style={{ flex: 1, padding: 12, borderRadius: 10, background: savingJ ? '#f87171' : '#E63030', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                                {savingJ ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Staff ── */}
            {modalS && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
                            {editIdS ? '✏️ Modifier le staff' : '👔 Ajouter un membre staff'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {[
                                { label: 'Nom *', name: 'nom' }, { label: 'Prénom *', name: 'prenom' },
                                { label: 'Téléphone', name: 'telephone' }, { label: 'Email', name: 'email', type: 'email' },
                                { label: 'Qualification', name: 'qualification' },
                            ].map(f => (
                                <div key={f.name}>
                                    <label style={lbl}>{f.label}</label>
                                    <input name={f.name} type={f.type || 'text'} value={formS[f.name]}
                                           onChange={e => setFormS({ ...formS, [e.target.name]: e.target.value })}
                                           style={inp} />
                                </div>
                            ))}
                            <div>
                                <label style={lbl}>Date de naissance</label>
                                <input type="date" name="dateNaissance" value={formS.dateNaissance}
                                       onChange={e => setFormS({ ...formS, dateNaissance: e.target.value })} style={inp} />
                            </div>
                            <div>
                                <label style={lbl}>Années d'expérience</label>
                                <input type="number" name="anneeExperience" value={formS.anneeExperience} min={0}
                                       onChange={e => setFormS({ ...formS, anneeExperience: parseInt(e.target.value) || 0 })} style={inp} />
                            </div>
                            <div>
                                <label style={lbl}>Type</label>
                                <select name="typeStaff" value={formS.typeStaff}
                                        onChange={e => setFormS({ ...formS, typeStaff: e.target.value })}
                                        style={{ ...inp, background: '#fff' }}>
                                    <option value="ENTRAINEUR">Entraîneur</option>
                                    <option value="PREPARATEUR">Préparateur physique</option>
                                    <option value="MEDECIN">Médecin</option>
                                    <option value="KINESITHERAPEUTE">Kinésithérapeute</option>
                                    <option value="AUTRE">Autre</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                            <button onClick={() => { setModalS(false); setFormS(EMPTY_STAFF); setEditIdS(null); }}
                                    style={{ flex: 1, padding: 12, borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                                Annuler
                            </button>
                            <button onClick={saveStaff} disabled={savingS}
                                    style={{ flex: 1, padding: 12, borderRadius: 10, background: savingS ? '#f87171' : '#1e40af', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                                {savingS ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}