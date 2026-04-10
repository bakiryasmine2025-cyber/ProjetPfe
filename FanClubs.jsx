import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

export default function FanClubs() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [followedClubs, setFollowedClubs] = useState(new Set());
    const [loadingFollow, setLoadingFollow] = useState(null);

    useEffect(() => { fetchClubs(); }, []);

    const fetchClubs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/federation/clubs');
            setClubs(res.data);
        } catch { setError('Impossible de charger les clubs.'); }
        finally { setLoading(false); }
    };

    const toggleFollow = async (clubId) => {
        setLoadingFollow(clubId);
        try {
            if (followedClubs.has(clubId)) {
                await api.post(`/fan/unfollow/${clubId}`);
                setFollowedClubs(prev => { const n = new Set(prev); n.delete(clubId); return n; });
            } else {
                await api.post(`/fan/follow/${clubId}`);
                setFollowedClubs(prev => new Set([...prev, clubId]));
            }
        } catch { alert('Erreur lors du suivi.'); }
        finally { setLoadingFollow(null); }
    };

    if (loading) return (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Chargement...
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>🛡️ Clubs</h1>
                <p style={{ color: '#888', fontSize: 14 }}>Suivez vos clubs favoris</p>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14 }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {clubs.map(club => {
                    const isFollowed = followedClubs.has(club.id);
                    return (
                        <div key={club.id} style={{
                            background: '#fff', borderRadius: 16, padding: 24,
                            border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            transition: 'transform 0.2s ease'
                        }}
                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            {/* Club Logo */}
                            <div style={{
                                width: 60, height: 60, borderRadius: '50%',
                                background: '#E63030', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: 24, marginBottom: 16
                            }}>🛡️</div>

                            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 4 }}>{club.nom}</h3>
                            <p style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>📍 {club.ville || '—'}</p>
                            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                                Fondé en {club.anneeFondation || '—'}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{
                                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                                    background: club.statut === 'ACTIF' ? '#f0fdf4' : '#f9fafb',
                                    color: club.statut === 'ACTIF' ? '#166534' : '#6b7280'
                                }}>{club.statut}</span>

                                <button
                                    onClick={() => toggleFollow(club.id)}
                                    disabled={loadingFollow === club.id}
                                    style={{
                                        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                                        cursor: 'pointer', border: 'none',
                                        background: isFollowed ? '#f3f4f6' : '#E63030',
                                        color: isFollowed ? '#374151' : '#fff',
                                        transition: 'all 0.2s'
                                    }}>
                                    {loadingFollow === club.id ? '...' : isFollowed ? '✓ Suivi' : '+ Suivre'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {clubs.length === 0 && !error && (
                <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
                    <p>Aucun club disponible</p>
                </div>
            )}
        </div>
    );
}