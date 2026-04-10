import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

export default function PublicClubs() {
    const [clubs, setClubs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchClubs(); }, []);

    useEffect(() => {
        if (!search) { setFiltered(clubs); return; }
        setFiltered(clubs.filter(c =>
            c.nom?.toLowerCase().includes(search.toLowerCase()) ||
            c.ville?.toLowerCase().includes(search.toLowerCase())
        ));
    }, [search, clubs]);

    const fetchClubs = async () => {
        try {
            const res = await api.get('/public/clubs');
            setClubs(res.data);
            setFiltered(res.data);
        } catch { setError('Impossible de charger les clubs.'); }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: 80, color: '#888' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Chargement...
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111', marginBottom: 8 }}>
                    🛡️ Clubs de Rugby
                </h1>
                <p style={{ color: '#888', fontSize: 15 }}>
                    Découvrez les clubs de la Fédération Tunisienne de Rugby
                </p>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 24 }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: 24, maxWidth: 400 }}>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>🔍</span>
                    <input
                        placeholder="Rechercher un club..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 16px 10px 36px',
                            border: '1.5px solid #e0e0e0', borderRadius: 10,
                            fontSize: 14, background: '#fff', outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af', gridColumn: '1/-1' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
                        <p>Aucun club trouvé</p>
                    </div>
                ) : filtered.map(club => (
                    <div key={club.id} style={{
                        background: '#fff', borderRadius: 16, padding: 24,
                        border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'transform 0.2s ease'
                    }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{
                            width: 56, height: 56, borderRadius: '50%',
                            background: '#E63030', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 24, marginBottom: 16
                        }}>🛡️</div>

                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>{club.nom}</h3>
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
                            <Link to="/register" style={{
                                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                                background: '#E63030', color: '#fff', textDecoration: 'none'
                            }}>
                                Rejoindre
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: 60, textAlign: 'center', padding: '40px',
                background: '#0D0D0D', borderRadius: 16
            }}>
                <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
                    Vous êtes fan de rugby ? 🏉
                </h2>
                <p style={{ color: '#888', marginBottom: 24 }}>
                    Créez un compte fan pour suivre vos clubs favoris et rester informé
                </p>
                <Link to="/register" style={{
                    background: '#E63030', color: '#fff', textDecoration: 'none',
                    padding: '12px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700
                }}>
                    Créer un compte
                </Link>
            </div>
        </div>
    );
}