import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig.js';

export default function FanFeed() {
    const [feed, setFeed]               = useState(null);
    const [clubs, setClubs]             = useState([]);
    const [followedIds, setFollowedIds] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [tab, setTab]                 = useState('actualites');

    useEffect(() => {
        loadAll().catch(console.error);
    }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [feedRes, clubsRes, followedRes] = await Promise.all([
                api.get('/fan/feed'),
                api.get('/public/clubs'),
                api.get('/fan/clubs-suivis')
            ]);
            setFeed(feedRes.data);
            setClubs(clubsRes.data);
            setFollowedIds(followedRes.data);
        } catch { setError('Erreur chargement'); }
        finally { setLoading(false); }
    };

    const followClub = async (clubId) => {
        try {
            await api.post(`/fan/follow/${clubId}`);
            setFollowedIds(prev => [...prev, clubId]);
            await loadAll();
        } catch { setError('Erreur follow'); }
    };

    const unfollowClub = async (clubId) => {
        try {
            await api.post(`/fan/unfollow/${clubId}`);
            setFollowedIds(prev => prev.filter(id => id !== clubId));
            await loadAll();
        } catch { setError('Erreur unfollow'); }
    };

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';

    if (loading) return (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Chargement...
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                    🏉 Mon Feed Rugby
                </h1>
                <p style={{ color: '#888', fontSize: 14 }}>Actualités, résultats et clubs favoris</p>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {[
                    { key: 'actualites', label: '📰 Actualités', count: feed?.actualites?.length ?? 0 },
                    { key: 'resultats',  label: '📊 Résultats',  count: feed?.derniersResultats?.length ?? 0 },
                    { key: 'clubs',      label: '🛡️ Clubs',      count: clubs.length },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        padding: '9px 18px', borderRadius: 10,
                        background: tab === t.key ? '#E63030' : '#fff',
                        color: tab === t.key ? '#fff' : '#555',
                        fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        border: tab === t.key ? 'none' : '1.5px solid #e5e7eb',
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        {t.label}
                        <span style={{
                            background: tab === t.key ? 'rgba(255,255,255,0.3)' : '#f3f4f6',
                            color: tab === t.key ? '#fff' : '#888',
                            borderRadius: 20, padding: '1px 8px', fontSize: 12,
                        }}>{t.count}</span>
                    </button>
                ))}
            </div>

            {/* Actualités */}
            {tab === 'actualites' && (
                <div>
                    {(feed?.actualites || []).length === 0 ? (
                        <EmptyState icon="📰" text="Aucune actualité disponible" sub="Suivez des clubs pour voir leurs actualités" />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                            {(feed?.actualites || []).map(a => (
                                <div key={a.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                    {a.urlImage && (
                                        <img src={a.urlImage} alt={a.titre} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                                    )}
                                    <div style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#E63030', textTransform: 'uppercase' }}>
                                                {a.clubNom}
                                            </span>
                                            <span style={{ fontSize: 11, color: '#bbb' }}>{formatDate(a.datePublication)}</span>
                                        </div>
                                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.4 }}>{a.titre}</h3>
                                        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0,
                                            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {a.contenu}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Résultats */}
            {tab === 'resultats' && (
                <div>
                    {(feed?.derniersResultats || []).length === 0 ? (
                        <EmptyState icon="📊" text="Aucun résultat disponible" sub="Suivez des clubs pour voir leurs résultats" />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {(feed?.derniersResultats || []).map(m => (
                                <div key={m.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                                    <div style={{ minWidth: 80, textAlign: 'center' }}>
                                        <div style={{ fontSize: 12, color: '#888' }}>{formatDate(m.dateMatch)}</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#E63030', marginTop: 4 }}>{m.competitionNom}</div>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                                        <span style={{ fontWeight: 700, fontSize: 15, color: '#111', textAlign: 'right', flex: 1 }}>
                                            {m.equipeDomicileNom}
                                        </span>
                                        <span style={{ fontWeight: 800, fontSize: 20, color: '#111', padding: '6px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', minWidth: 80, textAlign: 'center' }}>
                                            {m.scoreDomicile != null && m.scoreExterieur != null
                                                ? `${m.scoreDomicile} - ${m.scoreExterieur}`
                                                : 'vs'}
                                        </span>
                                        <span style={{ fontWeight: 700, fontSize: 15, color: '#111', textAlign: 'left', flex: 1 }}>
                                            {m.equipeExterieureNom}
                                        </span>
                                    </div>
                                    {m.lieu && (
                                        <div style={{ fontSize: 12, color: '#888', minWidth: 80, textAlign: 'right' }}>
                                            📍 {m.lieu}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Clubs */}
            {tab === 'clubs' && (
                <div>
                    {clubs.length === 0 ? (
                        <EmptyState icon="🛡️" text="Aucun club disponible" />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                            {clubs.map(c => {
                                const isFollowed = followedIds.includes(c.id);
                                return (
                                    <div key={c.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 4 }}>🛡️ {c.nom}</div>
                                            <div style={{ fontSize: 12, color: '#888' }}>{c.ville || '—'}</div>
                                        </div>
                                        <button
                                            onClick={() => isFollowed ? unfollowClub(c.id) : followClub(c.id)}
                                            style={{
                                                padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                                background: isFollowed ? '#fef2f2' : '#eff6ff',
                                                color: isFollowed ? '#E63030' : '#1e40af',
                                                border: `1px solid ${isFollowed ? '#fecaca' : '#bfdbfe'}`,
                                            }}>
                                            {isFollowed ? '✕ Ne plus suivre' : '+ Suivre'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function EmptyState({ icon, text, sub }) {
    return (
        <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af', background: '#fff', borderRadius: 16, border: '1px dashed #e5e7eb' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>{icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{text}</h3>
            {sub && <p style={{ fontSize: 14 }}>{sub}</p>}
        </div>
    );
}