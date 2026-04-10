import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

export default function PublicHome() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchMatches(); }, []);

    const fetchMatches = async () => {
        try {
            const res = await api.get('/public/matches');
            setMatches(res.data);
        } catch { setError('Impossible de charger le calendrier.'); }
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
                    📅 Calendrier des Compétitions
                </h1>
                <p style={{ color: '#888', fontSize: 15 }}>
                    Matchs et résultats — Rugby Tunisie
                </p>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 24 }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                {matches.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af', gridColumn: '1/-1' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                        <p>Aucun match disponible</p>
                    </div>
                ) : matches.map(m => {
                    const date = new Date(m.dateMatch);
                    const isTermine = m.statut === 'TERMINE';
                    return (
                        <div key={m.id} style={{
                            background: '#fff', borderRadius: 16, padding: 24,
                            border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>
                                    {m.competitionNom}
                                </span>
                                <span style={{
                                    padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                                    background: isTermine ? '#dcfce7' : '#eff6ff',
                                    color: isTermine ? '#15803d' : '#1d4ed8'
                                }}>
                                    {isTermine ? 'TERMINÉ' : m.statut === 'SCHEDULED' ? 'PLANIFIÉ' : m.statut}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                                <div style={{ flex: 1, textAlign: 'right', fontWeight: 700, fontSize: 15 }}>
                                    {m.equipeDomicile}
                                </div>
                                <div style={{
                                    background: isTermine ? '#0f172a' : '#f3f4f6',
                                    color: isTermine ? '#fff' : '#374151',
                                    padding: '8px 16px', borderRadius: 8,
                                    fontWeight: 800, fontSize: 18, minWidth: 80, textAlign: 'center'
                                }}>
                                    {isTermine ? m.score : 'vs'}
                                </div>
                                <div style={{ flex: 1, textAlign: 'left', fontWeight: 700, fontSize: 15 }}>
                                    {m.equipeExterieur}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
                                <span>🕒 {date.toLocaleDateString('fr-FR')} {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                {m.lieu && <span>📍 {m.lieu}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}