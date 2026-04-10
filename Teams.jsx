import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

// ─── Constants ───────────────────────────────────────────────
const CATEGORIES = ['U18', 'U20', 'Cadet', 'Junior', 'Senior'];

const TYPE_STYLES = {
    MASCULIN: { label: '♂ Homme', bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
    FEMININ:  { label: '♀ Femme', bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
};

const STATUT_STYLES = {
    EN_ATTENTE: { label: '⏳ En attente', bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
    VALIDEE:    { label: '✅ Validée',    bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    BLOQUEE:    { label: '🚫 Bloquée',   bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
};

const Badge = ({ style }) => (
    <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
        {style.label}
    </span>
);

// ─── TeamTable component ──────────────────────────────────────
function TeamTable({ teams, isFed, menuOpen, setMenuOpen, menuItems, genre }) {
    const filtered = teams.filter(t => t.genre === genre);
    const isM = genre === 'MASCULIN';

    return (
        <div style={{ marginBottom: 32 }}>
            {/* Section header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
                padding: '12px 20px',
                background: isM ? '#eff6ff' : '#fdf4ff',
                borderRadius: 12,
                border: `1px solid ${isM ? '#bfdbfe' : '#e9d5ff'}`,
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: isM ? '#dbeafe' : '#ede9fe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18
                }}>
                    {isM ? '♂' : '♀'}
                </div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: isM ? '#1e40af' : '#7e22ce' }}>
                        Équipes {isM ? 'Masculines' : 'Féminines'}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
                        {filtered.length} équipe{filtered.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'visible' }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>👕</div>
                        <p style={{ fontSize: 14 }}>Aucune équipe {isM ? 'masculine' : 'féminine'}</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                            <th style={thSt}>NOM</th>
                            {isFed && <th style={thSt}>CLUB</th>}
                            <th style={thSt}>CATÉGORIE</th>
                            <th style={thSt}>JOUEURS</th>
                            <th style={thSt}>STATUT</th>
                            {isFed && <th style={thSt}>COMPÉTITION</th>}
                            <th style={thSt}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((t, idx) => {
                            const s = STATUT_STYLES[t.statut] || STATUT_STYLES.EN_ATTENTE;
                            return (
                                <tr key={t.id}
                                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseOut={e  => e.currentTarget.style.background = '#fff'}>

                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                                background: isM ? '#eff6ff' : '#fdf4ff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 16
                                            }}>👕</div>
                                            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{t.nom}</div>
                                        </div>
                                    </td>

                                    {isFed && (
                                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#555' }}>
                                            {t.club?.nom || '—'}
                                        </td>
                                    )}

                                    <td style={{ padding: '14px 16px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: '#f3f4f6', color: '#374151' }}>
                                                {t.categorie}
                                            </span>
                                    </td>

                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>
                                        {(t.joueurs || []).length} joueur{(t.joueurs || []).length !== 1 ? 's' : ''}
                                    </td>

                                    <td style={{ padding: '14px 16px' }}>
                                        <Badge style={s} />
                                    </td>

                                    {isFed && (
                                        <td style={{ padding: '14px 16px', fontSize: 13 }}>
                                            {t.competition
                                                ? <span style={{ padding: '3px 8px', background: '#eff6ff', color: '#1e40af', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>🏆 {t.competition.nom}</span>
                                                : <span style={{ color: '#ccc', fontSize: 12 }}>—</span>}
                                        </td>
                                    )}

                                    <td data-menu="true" style={{ padding: '14px 16px', position: 'relative' }}>
                                        <button data-menu="true"
                                                onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === t.id ? null : t.id); }}
                                                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>⋮
                                        </button>
                                        {menuOpen === t.id && (
                                            <div data-menu="true" style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid #eee', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 220, overflow: 'hidden' }}>
                                                {menuItems(t).map((item, i) => (
                                                    <button key={i} data-menu="true" onClick={item.action}
                                                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: item.danger ? '#E63030' : '#333', borderTop: i > 0 ? '1px solid #f5f5f5' : 'none' }}
                                                            onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                                                            onMouseOut={e  => e.currentTarget.style.background = 'none'}>
                                                        {item.label}
                                                    </button>
                                                ))}
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
        </div>
    );
}

// ─── Main component ──────────────────────────────────────────
export default function Teams({ userRole = 'CLUB_ADMIN' }) {
    const isFed = userRole === 'FEDERATION_ADMIN' || userRole === 'SUPER_ADMIN';

    const [teams,        setTeams]        = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [clubJoueurs,  setClubJoueurs]  = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState('');
    const [modal,        setModal]        = useState(null);
    const [editId,       setEditId]       = useState(null);
    const [form,         setForm]         = useState({
        nom: '', categorie: 'U18', genre: 'MASCULIN', joueurIds: [],
    });
    const [saving,       setSaving]       = useState(false);
    const [menuOpen,     setMenuOpen]     = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedCompetition, setSelectedCompetition] = useState('');

    const [allJoueurs,  setAllJoueurs]  = useState([]);
    const [loadingEff,  setLoadingEff]  = useState(false);
    const [resultats,   setResultats]   = useState([]);
    const [loadingRes,  setLoadingRes]  = useState(false);

    // KPI
    const totalMasculin = teams.filter(t => t.genre === 'MASCULIN').length;
    const totalFeminin  = teams.filter(t => t.genre === 'FEMININ').length;
    const totalValides  = teams.filter(t => t.statut === 'VALIDEE').length;
    const totalJoueurs  = teams.reduce((acc, t) => acc + (t.joueurs?.length || 0), 0);

    useEffect(() => {
        fetchTeams();
        fetchClubJoueurs();
        if (isFed) fetchCompetitions();
        const h = (e) => { if (!e.target.closest('[data-menu]')) setMenuOpen(null); };
        document.addEventListener('click', h);
        return () => document.removeEventListener('click', h);
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const endpoint = isFed ? '/federation/equipes' : '/club-admin/equipes';
            const res = await api.get(endpoint);
            setTeams(res.data);
        } catch { setError('Impossible de charger les équipes.'); }
        finally  { setLoading(false); }
    };

    const fetchClubJoueurs = async () => {
        try {
            const res = await api.get('/club-admin/joueurs');
            setClubJoueurs(res.data);
        } catch { setClubJoueurs([]); }
    };

    const fetchCompetitions = async () => {
        try {
            const res = await api.get('/federation/competitions');
            setCompetitions(res.data);
        } catch { setCompetitions([]); }
    };

    const openCreate = () => {
        setForm({ nom: '', categorie: 'U18', genre: 'MASCULIN', joueurIds: [] });
        setEditId(null);
        setModal('create');
    };

    const openEdit = (team) => {
        setForm({
            nom: team.nom || '',
            categorie: team.categorie || 'U18',
            genre: team.genre || 'MASCULIN',
            joueurIds: (team.joueurs || []).map(j => j.id),
        });
        setEditId(team.id);
        setModal('edit');
        setMenuOpen(null);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const toggleJoueur = (joueurId) => {
        setForm(prev => ({
            ...prev,
            joueurIds: prev.joueurIds.includes(joueurId)
                ? prev.joueurIds.filter(id => id !== joueurId)
                : [...prev.joueurIds, joueurId],
        }));
    };

    const handleSave = async () => {
        if (!form.nom.trim()) { setError('Le nom est requis'); return; }
        setSaving(true);
        try {
            if (modal === 'create') {
                const res = await api.post('/club-admin/equipes', {
                    nom: form.nom, categorie: form.categorie, genre: form.genre,
                });
                const newEquipe = res.data;
                await Promise.all(
                    form.joueurIds.map(jId => api.post(`/club-admin/equipes/${newEquipe.id}/joueurs/${jId}`))
                );
            } else {
                await api.put(`/club-admin/equipes/${editId}`, {
                    nom: form.nom, categorie: form.categorie, genre: form.genre,
                });
                const teamData = teams.find(t => t.id === editId);
                const currentIds = (teamData?.joueurs || []).map(j => j.id);
                const toAdd    = form.joueurIds.filter(id => !currentIds.includes(id));
                const toRemove = currentIds.filter(id => !form.joueurIds.includes(id));
                await Promise.all([
                    ...toAdd.map(jId    => api.post(`/club-admin/equipes/${editId}/joueurs/${jId}`)),
                    ...toRemove.map(jId => api.delete(`/club-admin/equipes/${editId}/joueurs/${jId}`)),
                ]);
            }
            setModal(null);
            fetchTeams();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur enregistrement');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette équipe ?')) return;
        try {
            await api.delete(`/club-admin/equipes/${id}`);
            setMenuOpen(null);
            fetchTeams();
        } catch { setError('Erreur suppression'); }
    };

    const openEffectifs = async (team) => {
        setSelectedTeam(team);
        setModal('effectifs');
        setMenuOpen(null);
        setLoadingEff(true);
        try {
            const res = await api.get('/club-admin/joueurs');
            setAllJoueurs(res.data);
        } catch { setError('Erreur chargement joueurs'); }
        finally  { setLoadingEff(false); }
    };

    const addJoueurToEquipe = async (joueurId) => {
        try {
            await api.post(`/club-admin/equipes/${selectedTeam.id}/joueurs/${joueurId}`);
            await refreshSelectedTeam();
        } catch { setError('Erreur ajout joueur'); }
    };

    const removeJoueurFromEquipe = async (joueurId) => {
        try {
            await api.delete(`/club-admin/equipes/${selectedTeam.id}/joueurs/${joueurId}`);
            await refreshSelectedTeam();
        } catch { setError('Erreur retrait joueur'); }
    };

    const refreshSelectedTeam = async () => {
        const res = await api.get('/club-admin/equipes');
        const updated = res.data.find(t => t.id === selectedTeam.id);
        setSelectedTeam(updated);
        setTeams(res.data);
    };

    const openResultats = async (team) => {
        setSelectedTeam(team);
        setModal('resultats');
        setMenuOpen(null);
        setLoadingRes(true);
        try {
            const res = await api.get(`/club-admin/equipes/${team.id}/matches`);
            setResultats(res.data);
        } catch { setResultats([]); }
        finally  { setLoadingRes(false); }
    };

    const handleValider = async (id) => {
        try { await api.put(`/federation/equipes/${id}/valider`); fetchTeams(); setMenuOpen(null); }
        catch { setError('Erreur validation'); }
    };

    const handleBloquer = async (id) => {
        try { await api.put(`/federation/equipes/${id}/bloquer`); fetchTeams(); setMenuOpen(null); }
        catch { setError('Erreur blocage'); }
    };

    const openInscrire = (team) => {
        setSelectedTeam(team);
        setSelectedCompetition(team.competition?.id || '');
        setModal('inscrire');
        setMenuOpen(null);
    };

    const handleInscrire = async () => {
        if (!selectedCompetition) return;
        setSaving(true);
        try {
            await api.put(`/federation/equipes/${selectedTeam.id}/inscrire/${selectedCompetition}`);
            setModal(null);
            fetchTeams();
        } catch { setError('Erreur inscription'); }
        finally  { setSaving(false); }
    };

    const handleDesinscrire = async (id) => {
        try { await api.delete(`/federation/equipes/${id}/competition`); fetchTeams(); setMenuOpen(null); }
        catch { setError('Erreur désinscription'); }
    };

    const closeModal = () => setModal(null);
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

    const clubAdminMenu = (t) => [
        { label: '👥 Gérer effectifs', action: () => openEffectifs(t) },
        { label: '📊 Voir résultats',  action: () => openResultats(t) },
        { label: '✏️ Modifier',        action: () => openEdit(t) },
        { label: '🗑️ Supprimer',       action: () => handleDelete(t.id), danger: true },
    ];

    const fedMenu = (t) => [
        { label: '👥 Voir effectifs',  action: () => openEffectifs(t) },
        { label: '📊 Voir résultats',  action: () => openResultats(t) },
        ...(t.statut !== 'VALIDEE' ? [{ label: '✅ Valider',  action: () => handleValider(t.id) }] : []),
        ...(t.statut !== 'BLOQUEE' ? [{ label: '🚫 Bloquer',  action: () => handleBloquer(t.id), danger: true }] : []),
        { label: '🏆 Inscrire en compétition', action: () => openInscrire(t) },
        ...(t.competition ? [{ label: '❌ Désinscrire', action: () => handleDesinscrire(t.id), danger: true }] : []),
    ];

    const menuItems = (t) => isFed ? fedMenu(t) : clubAdminMenu(t);

    // ─── Render ───────────────────────────────────────────────
    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                        {isFed ? 'Toutes les équipes' : 'Mes équipes'}
                    </h1>
                    <p style={{ color: '#888', fontSize: 14 }}>{teams.length} équipe{teams.length !== 1 ? 's' : ''}</p>
                </div>
                {!isFed && (
                    <button onClick={openCreate} style={{ background: '#E63030', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                        + Créer une équipe
                    </button>
                )}
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                    { label: 'Total équipes', value: teams.length,   bg: '#fef2f2', color: '#E63030', icon: '👕' },
                    { label: '♂ Masculines',  value: totalMasculin,  bg: '#eff6ff', color: '#1e40af', icon: '♂' },
                    { label: '♀ Féminines',   value: totalFeminin,   bg: '#fdf4ff', color: '#7e22ce', icon: '♀' },
                    { label: 'Total joueurs', value: totalJoueurs,   bg: '#f0fdf4', color: '#166534', icon: '🏉' },
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

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    {error}
                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>✕</button>
                </div>
            )}

            {loading ? (
                <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Chargement...</div>
            ) : (
                <>
                    {/* ── Équipes Masculines ── */}
                    <TeamTable
                        teams={teams} isFed={isFed}
                        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
                        menuItems={menuItems} genre="MASCULIN"
                    />
                    {/* ── Équipes Féminines ── */}
                    <TeamTable
                        teams={teams} isFed={isFed}
                        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
                        menuItems={menuItems} genre="FEMININ"
                    />
                </>
            )}

            {/* ── Modals ── */}
            {(modal === 'create' || modal === 'edit') && (
                <div style={overlay}>
                    <div style={{ ...modalBox, width: 560, maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>
                            {modal === 'create' ? '👕 Créer une équipe' : '✏️ Modifier l\'équipe'}
                        </h3>
                        <p style={{ fontSize: 12, color: '#888', marginBottom: 20 }}>
                            Les joueurs proposés sont uniquement ceux de votre club.
                        </p>
                        <div style={{ display: 'grid', gap: 16 }}>
                            <div>
                                <label style={labelSt}>Nom de l'équipe *</label>
                                <input name="nom" value={form.nom} onChange={handleChange} placeholder="Ex: Seniors A" style={inputSt} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelSt}>Catégorie *</label>
                                    <select name="categorie" value={form.categorie} onChange={handleChange} style={inputSt}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelSt}>Type *</label>
                                    <select name="genre" value={form.genre} onChange={handleChange} style={inputSt}>
                                        <option value="MASCULIN">♂ Homme</option>
                                        <option value="FEMININ">♀ Femme</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={labelSt}>
                                    Composition &nbsp;
                                    <span style={{ fontWeight: 400, color: '#888' }}>({form.joueurIds.length} sélectionné{form.joueurIds.length !== 1 ? 's' : ''})</span>
                                </label>
                                {clubJoueurs.length === 0 ? (
                                    <div style={{ padding: '12px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, color: '#92400e' }}>
                                        ⚠️ Aucun joueur dans votre club pour le moment.
                                    </div>
                                ) : (
                                    <div style={{ border: '1.5px solid #e0e0e0', borderRadius: 8, overflow: 'hidden', maxHeight: 220, overflowY: 'auto' }}>
                                        {clubJoueurs.map((j, idx) => {
                                            const selected = form.joueurIds.includes(j.id);
                                            return (
                                                <div key={j.id} onClick={() => toggleJoueur(j.id)}
                                                     style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', background: selected ? '#eff6ff' : idx % 2 === 0 ? '#fff' : '#fafafa', borderBottom: idx < clubJoueurs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                                    <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, border: selected ? 'none' : '1.5px solid #d0d0d0', background: selected ? '#E63030' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {selected && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
                                                    </div>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: selected ? '#dbeafe' : '#f3f4f6', color: selected ? '#1e40af' : '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                                                        {(j.prenom?.[0] || '') + (j.nom?.[0] || '')}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{j.prenom} {j.nom}</div>
                                                        {j.poste && <div style={{ fontSize: 11, color: '#888' }}>{j.poste}</div>}
                                                    </div>
                                                    {selected && <span style={{ fontSize: 11, color: '#1e40af', fontWeight: 600 }}>Sélectionné</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                            <button onClick={closeModal} style={btnSec}>Annuler</button>
                            <button onClick={handleSave} disabled={saving} style={btnPri}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
                        </div>
                    </div>
                </div>
            )}

            {modal === 'effectifs' && (
                <div style={overlay}>
                    <div style={{ ...modalBox, width: 620, maxHeight: '85vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                            <div>
                                <h3 style={{ fontWeight: 800, fontSize: 20 }}>👥 Effectifs — {selectedTeam?.nom}</h3>
                                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Retirer un joueur de l'équipe ne le supprime pas du club.</p>
                            </div>
                            <button onClick={closeModal} style={btnClose}>✕</button>
                        </div>
                        {loadingEff ? <div style={{ textAlign: 'center', padding: 40 }}>Chargement...</div> : (
                            <>
                                <h4 style={secTitle}>Dans l'équipe ({(selectedTeam?.joueurs || []).length})</h4>
                                {(selectedTeam?.joueurs || []).length === 0 ? (
                                    <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 20 }}>Aucun joueur dans cette équipe.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                        {(selectedTeam?.joueurs || []).map(j => (
                                            <div key={j.id} style={rowGreen}>
                                                <div>
                                                    <span style={{ fontWeight: 600, fontSize: 13 }}>{j.prenom} {j.nom}</span>
                                                    {j.poste && <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>— {j.poste}</span>}
                                                </div>
                                                <button onClick={() => removeJoueurFromEquipe(j.id)} style={btnRetirer}>Retirer</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <h4 style={secTitle}>Disponibles ({allJoueurs.filter(j => !(selectedTeam?.joueurs || []).map(x => x.id).includes(j.id)).length})</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {allJoueurs.filter(j => !(selectedTeam?.joueurs || []).map(x => x.id).includes(j.id)).map(j => (
                                        <div key={j.id} style={rowGray}>
                                            <div>
                                                <span style={{ fontWeight: 600, fontSize: 13 }}>{j.prenom} {j.nom}</span>
                                                {j.poste && <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>— {j.poste}</span>}
                                            </div>
                                            <button onClick={() => addJoueurToEquipe(j.id)} style={btnAjouter}>+ Ajouter</button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {modal === 'resultats' && (
                <div style={overlay}>
                    <div style={{ ...modalBox, width: 620, maxHeight: '85vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontWeight: 800, fontSize: 20 }}>📊 Résultats — {selectedTeam?.nom}</h3>
                            <button onClick={closeModal} style={btnClose}>✕</button>
                        </div>
                        {loadingRes ? <div style={{ textAlign: 'center', padding: 40 }}>Chargement...</div> : (
                            resultats.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>🏉</div>
                                    <p>Aucun match pour cette équipe.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {resultats.map(m => (
                                        <div key={m.id} style={{ padding: 16, background: '#fafafa', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <span style={{ fontSize: 12, color: '#888' }}>{formatDate(m.dateMatch)}</span>
                                                <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: m.statut === 'TERMINE' ? '#f0fdf4' : '#eff6ff', color: m.statut === 'TERMINE' ? '#166534' : '#1e40af' }}>{m.statut}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                                                <span style={{ fontWeight: 700, fontSize: 14 }}>{m.equipeDomicileNom}</span>
                                                <span style={{ fontWeight: 800, fontSize: 18, padding: '4px 12px', background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                                                    {m.scoreDomicile != null ? `${m.scoreDomicile} - ${m.scoreExterieur}` : 'vs'}
                                                </span>
                                                <span style={{ fontWeight: 700, fontSize: 14 }}>{m.equipeExterieureNom}</span>
                                            </div>
                                            {m.lieu && <div style={{ textAlign: 'center', fontSize: 12, color: '#888', marginTop: 8 }}>📍 {m.lieu}</div>}
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {modal === 'inscrire' && (
                <div style={overlay}>
                    <div style={{ ...modalBox, width: 440 }}>
                        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>🏆 Inscrire à une compétition</h3>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>{selectedTeam?.nom}</p>
                        {selectedTeam?.competition && (
                            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#166534' }}>
                                ✅ Actuellement inscrite : <strong>{selectedTeam.competition.nom}</strong>
                            </div>
                        )}
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelSt}>Choisir une compétition *</label>
                            <select value={selectedCompetition} onChange={e => setSelectedCompetition(e.target.value)} style={inputSt}>
                                <option value="">— Sélectionner —</option>
                                {competitions.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={closeModal} style={btnSec}>Annuler</button>
                            <button onClick={handleInscrire} disabled={saving || !selectedCompetition} style={btnPri}>{saving ? 'Inscription...' : 'Inscrire'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────
const overlay    = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalBox   = { background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' };
const labelSt    = { fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 };
const inputSt    = { width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', fontSize: 14, boxSizing: 'border-box' };
const btnPri     = { flex: 1, padding: 12, borderRadius: 10, background: '#E63030', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' };
const btnSec     = { flex: 1, padding: 12, borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer' };
const btnClose   = { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' };
const btnRetirer = { background: '#fef2f2', color: '#E63030', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' };
const btnAjouter = { background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' };
const thSt       = { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 };
const secTitle   = { fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 12 };
const rowGreen   = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #86efac' };
const rowGray    = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fafafa', borderRadius: 8, border: '1px solid #e5e7eb' };