import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig.js';

export default function FederationJoueurs() {
    const [joueurs, setJoueurs]               = useState([]);
    const [clubs, setClubs]                   = useState([]);
    const [clubAdmins, setClubAdmins]         = useState([]);
    const [loading, setLoading]               = useState(true);
    const [loadingAdmins, setLoadingAdmins]   = useState(true);
    const [error, setError]                   = useState('');
    const [search, setSearch]                 = useState('');
    const [filterStatut, setFilterStatut]     = useState('');
    const [expandedClubs, setExpandedClubs]   = useState({});

    useEffect(() => {
        fetchJoueurs();
        fetchClubs();
        fetchClubAdmins();
    }, []);

    const fetchJoueurs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/federation/joueurs');
            setJoueurs(res.data);
        } catch { setError('Erreur chargement joueurs'); }
        finally { setLoading(false); }
    };

    const fetchClubs = async () => {
        try {
            const res = await api.get('/federation/clubs');
            setClubs(res.data || []);
        } catch {}
    };

    const fetchClubAdmins = async () => {
        setLoadingAdmins(true);
        try {
            const res = await api.get('/federation/club-admins/en-attente');
            setClubAdmins(res.data);
        } catch { setError('Erreur chargement demandes admins'); }
        finally { setLoadingAdmins(false); }
    };

    const accepterJoueur = async (id) => {
        try { await api.put(`/federation/joueurs/${id}/accepter`); await fetchJoueurs(); }
        catch { setError('Erreur acceptation joueur'); }
    };

    const bloquerJoueur = async (id) => {
        try { await api.put(`/federation/joueurs/${id}/bloquer`); await fetchJoueurs(); }
        catch { setError('Erreur blocage joueur'); }
    };

    const accepterAdmin = async (id) => {
        try { await api.put(`/federation/club-admins/${id}/accepter`); await fetchClubAdmins(); }
        catch { setError('Erreur acceptation admin'); }
    };

    const refuserAdmin = async (id) => {
        try { await api.put(`/federation/club-admins/${id}/refuser`); await fetchClubAdmins(); }
        catch { setError('Erreur refus admin'); }
    };

    const toggleClub = (clubNom) => {
        setExpandedClubs(prev => ({ ...prev, [clubNom]: !prev[clubNom] }));
    };

    const expandAll = () => {
        const all = {};
        Object.keys(joueursByClub).forEach(k => all[k] = true);
        setExpandedClubs(all);
    };

    const collapseAll = () => setExpandedClubs({});

    const initiales = (nom, prenom) =>
        `${nom?.[0] ?? ''}${prenom?.[0] ?? ''}`.toUpperCase();

    const statutStyle = (statut) => {
        if (statut === 'ACCEPTE') return { bg: '#f0fdf4', color: '#166534', label: 'Accepté' };
        if (statut === 'BLOQUE')  return { bg: '#fef2f2', color: '#991b1b', label: 'Bloqué' };
        return                           { bg: '#fffbeb', color: '#92400e', label: 'En attente' };
    };

    // Filtrer les joueurs
    const filteredJoueurs = joueurs.filter(j => {
        const matchSearch = !search ||
            j.nom?.toLowerCase().includes(search.toLowerCase()) ||
            j.prenom?.toLowerCase().includes(search.toLowerCase());
        const matchStatut = !filterStatut || j.statut === filterStatut;
        return matchSearch && matchStatut;
    });

    // Grouper par club
    const joueursByClub = filteredJoueurs.reduce((acc, j) => {
        const club = j.clubNom || 'Sans club';
        if (!acc[club]) acc[club] = [];
        acc[club].push(j);
        return acc;
    }, {});

    // Stats globales
    const totalJoueurs    = joueurs.length;
    const totalAccepte    = joueurs.filter(j => j.statut === 'ACCEPTE').length;
    const totalEnAttente  = joueurs.filter(j => j.statut === 'EN_ATTENTE').length;
    const totalBloque     = joueurs.filter(j => j.statut === 'BLOQUE').length;
    const totalClubs      = Object.keys(joueursByClub).length;
    const villes          = [...new Set(clubs.map(c => c.ville).filter(Boolean))].length;

    return (
        <div>

            {/* ── DEMANDES CLUB ADMINS ── */}
            {clubAdmins.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>
                            Demandes Club Admins
                        </h2>
                        <span style={{ background: '#E63030', color: '#fff', borderRadius: 999, fontSize: 12, fontWeight: 700, padding: '3px 10px' }}>
                            {clubAdmins.length} en attente
                        </span>
                    </div>
                    {loadingAdmins ? (
                        <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>Chargement...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {clubAdmins.map(admin => (
                                <div key={admin.id} style={{ background: '#fff', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#92400e', flexShrink: 0 }}>
                                            {initiales(admin.nom, admin.prenom)}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#111' }}>{admin.nom} {admin.prenom}</p>
                                            <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{admin.email}{admin.telephone && ` · ${admin.telephone}`}</p>
                                            {admin.clubNom && (
                                                <span style={{ marginTop: 4, display: 'inline-block', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                                                     {admin.clubNom}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => accepterAdmin(admin.id)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✓ Accepter</button>
                                        <button onClick={() => refuserAdmin(admin.id)}  style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2', color: '#991b1b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✕ Refuser</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── HEADER ── */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>Gestion des Joueurs</h1>
                <p style={{ color: '#888', fontSize: 14 }}>Vue par club — toutes clubs confondus</p>
            </div>

            {/* ── KPI CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👥</div>
                    <div>
                        <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 4 }}>Total Joueurs</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#111', lineHeight: 1 }}>{totalJoueurs}</div>
                    </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>️</div>
                    <div>
                        <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 4 }}>Total Clubs</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#111', lineHeight: 1 }}>{totalClubs}</div>
                    </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}></div>
                    <div>
                        <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 4 }}>Villes</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#111', lineHeight: 1 }}>{villes || '—'}</div>
                    </div>
                </div>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: 16 }}></button>
                </div>
            )}

            {/* ── FILTRES ── */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>🔍</span>
                    <input
                        placeholder="Rechercher un joueur..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 16px 10px 36px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
                <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
                        style={{ padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff', minWidth: 160, cursor: 'pointer' }}>
                    <option value="">Tous les statuts</option>
                    <option value="EN_ATTENTE">⏳ En attente</option>
                    <option value="ACCEPTE">✓ Accepté</option>
                    <option value="BLOQUE">✕ Bloqué</option>
                </select>
                {(search || filterStatut) && (
                    <button onClick={() => { setSearch(''); setFilterStatut(''); }}
                            style={{ padding: '10px 16px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 13, background: '#fff', cursor: 'pointer', color: '#666' }}>
                        ✕ Reset
                    </button>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button onClick={expandAll}   style={{ padding: '8px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 12, background: '#fff', cursor: 'pointer', color: '#555', fontWeight: 600 }}>▼ Tout ouvrir</button>
                    <button onClick={collapseAll} style={{ padding: '8px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 12, background: '#fff', cursor: 'pointer', color: '#555', fontWeight: 600 }}>▲ Tout fermer</button>
                </div>
            </div>

            {/* ── LISTE PAR CLUB ── */}
            {loading ? (
                <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Chargement...</div>
            ) : Object.keys(joueursByClub).length === 0 ? (
                <div style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: 12, padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}></div>
                    <p>Aucun joueur trouvé</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(joueursByClub)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([clubNom, clubJoueurs]) => {
                            const isOpen = expandedClubs[clubNom];
                            const acceptes   = clubJoueurs.filter(j => j.statut === 'ACCEPTE').length;
                            const enAttente  = clubJoueurs.filter(j => j.statut === 'EN_ATTENTE').length;
                            const bloques    = clubJoueurs.filter(j => j.statut === 'BLOQUE').length;

                            return (
                                <div key={clubNom} style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

                                    {/* Club header — cliquable */}
                                    <div
                                        onClick={() => toggleClub(clubNom)}
                                        style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isOpen ? '#fafafa' : '#fff', borderBottom: isOpen ? '1px solid #f0f0f0' : 'none' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                                        onMouseOut={e => e.currentTarget.style.background = isOpen ? '#fafafa' : '#fff'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            {/* Club icon */}
                                            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="#E63030" opacity="0.15" stroke="#E63030" strokeWidth="1.5"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: 16, color: '#111' }}>{clubNom}</div>
                                                <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                                                    {clubJoueurs.length} joueur{clubJoueurs.length > 1 ? 's' : ''}
                                                    {enAttente > 0 && <span style={{ marginLeft: 8, background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>⏳ {enAttente} en attente</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {/* Mini stats */}
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <span style={{ background: '#fef9c3', color: '#854d0e', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                                                    👥 {clubJoueurs.length} joueurs
                                                </span>
                                                {acceptes > 0 && (
                                                    <span style={{ background: '#f0fdf4', color: '#166534', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                                                        ✓ {acceptes}
                                                    </span>
                                                )}
                                                {bloques > 0 && (
                                                    <span style={{ background: '#fef2f2', color: '#991b1b', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                                                        🚫 {bloques}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Chevron */}
                                            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#888', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                ▼
                                            </div>
                                        </div>
                                    </div>

                                    {/* Joueurs list — expandable */}
                                    {isOpen && (
                                        <div>
                                            {clubJoueurs.map((j, idx) => {
                                                const st = statutStyle(j.statut);
                                                return (
                                                    <div key={j.id} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: idx < clubJoueurs.length - 1 ? '1px solid #f5f5f5' : 'none', background: '#fff' }}
                                                         onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                                         onMouseOut={e => e.currentTarget.style.background = '#fff'}>

                                                        {/* Avatar */}
                                                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: j.genre === 'MASCULIN' ? '#eff6ff' : '#fdf4ff', border: `1px solid ${j.genre === 'MASCULIN' ? '#bfdbfe' : '#e9d5ff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: j.genre === 'MASCULIN' ? '#1e40af' : '#7e22ce', flexShrink: 0 }}>
                                                            {initiales(j.nom, j.prenom)}
                                                        </div>

                                                        {/* Nom + infos */}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{j.nom} {j.prenom}</div>
                                                            <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 10, marginTop: 2, flexWrap: 'wrap' }}>
                                                                {j.poste     && <span> {j.poste}</span>}
                                                                {j.categorie && <span>{j.categorie}</span>}
                                                                {j.telephone && <span> {j.telephone}</span>}
                                                                <span>{j.genre === 'MASCULIN' ? '♂ Masculin' : '♀ Féminin'}</span>
                                                            </div>
                                                        </div>

                                                        {/* Statut */}
                                                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, flexShrink: 0 }}>
                                                            {st.label}
                                                        </span>

                                                        {/* Actions */}
                                                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                                            {j.statut !== 'ACCEPTE' && (
                                                                <button onClick={() => accepterJoueur(j.id)}
                                                                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                                    ✓ Accepter
                                                                </button>
                                                            )}
                                                            {j.statut !== 'BLOQUE' && (
                                                                <button onClick={() => bloquerJoueur(j.id)}
                                                                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #fcd34d', background: '#fffbeb', color: '#92400e', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                                    🚫 Bloquer
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}