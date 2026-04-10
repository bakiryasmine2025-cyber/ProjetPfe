import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function ClubJoueurs() {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [joueurs, setJoueurs] = useState([]);
    const [clubNom, setClubNom] = useState('');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [clubId]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {

            const clubRes = await api.get(`/federation/clubs/${clubId}`);
            setClubNom(clubRes.data?.nom || '');

            try {
                const joueursRes = await api.get(`/federation/clubs/${clubId}/joueurs`);
                setJoueurs(joueursRes.data || []);
            } catch {

                setJoueurs([]);
            }

        } catch (err) {
            console.error(err);
            setError('Erreur chargement des données du club.');
        } finally {
            setLoading(false);
        }
    };

    const filtered = joueurs.filter(j =>
        !search ||
        j.nom?.toLowerCase().includes(search.toLowerCase()) ||
        j.prenom?.toLowerCase().includes(search.toLowerCase())
    );

    const statutStyle = (statut) => {
        if (statut === 'ACCEPTE')   return { bg: '#f0fdf4', color: '#166534', label: '✓ Accepté' };
        if (statut === 'BLOQUE')    return { bg: '#fef2f2', color: '#991b1b', label: '✕ Bloqué' };
        return                             { bg: '#fffbeb', color: '#92400e', label: '⏳ En attente' };
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <button
                        onClick={() => navigate('/dashboard/clubs')}
                        style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', marginBottom: 8, padding: 0 }}
                    >
                        ← Retour aux clubs
                    </button>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                        Joueurs — <span style={{ color: '#E63030' }}>{clubNom || '...'}</span>
                    </h1>
                    <p style={{ color: '#888', fontSize: 14 }}>{joueurs.length} joueurs enregistrés</p>
                </div>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ position: 'relative', maxWidth: 360 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>🔍</span>
                    <input
                        placeholder="Rechercher un joueur..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 16px 10px 36px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                            {['NOM', 'PRÉNOM', 'GENRE', 'POSTE', 'CATÉGORIE', 'TÉLÉPHONE', 'STATUT'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
                                    <div style={{ fontSize: 36, marginBottom: 8 }}></div>
                                    <p>Aucun joueur trouvé</p>
                                </td>
                            </tr>
                        ) : filtered.map((j, idx) => {
                            const st = statutStyle(j.statut);
                            return (
                                <tr key={j.id}
                                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseOut={e => e.currentTarget.style.background = '#fff'}
                                >
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#111' }}>{j.nom}</td>
                                    <td style={{ padding: '14px 16px', color: '#555' }}>{j.prenom}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                                            background: j.genre === 'MASCULIN' ? '#eff6ff' : '#fdf4ff',
                                            color: j.genre === 'MASCULIN' ? '#1e40af' : '#7e22ce'
                                        }}>
                                            {j.genre === 'MASCULIN' ? '♂ M' : '♀ F'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#555', fontSize: 13 }}>{j.poste || '—'}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: '#f3f4f6', color: '#374151' }}>
                                            {j.categorie || '—'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#888', fontSize: 13 }}>{j.telephone || '—'}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color }}>
                                            {st.label}
                                        </span>
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