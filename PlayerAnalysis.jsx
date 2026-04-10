import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

export default function PlayerAnalysis() {
    const [joueurs, setJoueurs]       = useState([]);
    const [selected, setSelected]     = useState(null);
    const [analysis, setAnalysis]     = useState('');
    const [loading, setLoading]       = useState(false);
    const [loadingJoueurs, setLoadingJoueurs] = useState(true);

    useEffect(() => { fetchJoueurs(); }, []);

    const fetchJoueurs = async () => {
        try {
            const res = await api.get('/club-admin/joueurs');
            setJoueurs(res.data);
        } catch { }
        finally { setLoadingJoueurs(false); }
    };

    const analyzePlayer = async () => {
        if (!selected) return;
        setLoading(true);
        setAnalysis('');
        try {
            const res = await fetch('http://localhost:8080/api/chat/analyze-player', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom: selected.nom,
                    prenom: selected.prenom,
                    poste: selected.poste || 'Non défini',
                    categorie: selected.categorie || 'Non définie',
                    saison: selected.saison || 'Non définie',
                    statut: selected.statut || 'Actif',
                })
            });
            const data = await res.json();
            // Parse Ollama response
            const content = typeof data === 'string'
                ? JSON.parse(data)?.message?.content
                : data?.message?.content;
            setAnalysis(content || 'Analyse non disponible');
        } catch {
            setAnalysis(' Erreur — Vérifiez qu\'Ollama est lancé');
        } finally { setLoading(false); }
    };

    const getPosteColor = (poste) => {
        const colors = {
            'PILIER': '#fef3c7', 'TALONNEUR': '#fef3c7',
            'DEUXIEME_LIGNE': '#dbeafe', 'TROISIEME_LIGNE': '#dbeafe',
            'DEMI_MELEE': '#dcfce7', 'DEMI_OUVERTURE': '#dcfce7',
            'CENTRE': '#f3e8ff', 'AILIER': '#f3e8ff', 'ARRIERE': '#f3e8ff',
        };
        return colors[poste] || '#f3f4f6';
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                     Analyse IA des Joueurs
                </h1>
                <p style={{ color: '#888', fontSize: 14 }}>
                    Sélectionnez un joueur pour obtenir une analyse personnalisée
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>

                {/* Liste Joueurs */}
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: 15, color: '#111' }}>
                         Joueurs ({joueurs.length})
                    </div>
                    <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 260px)' }}>
                        {loadingJoueurs ? (
                            <div style={{ padding: 30, textAlign: 'center', color: '#888' }}>Chargement...</div>
                        ) : joueurs.length === 0 ? (
                            <div style={{ padding: 30, textAlign: 'center', color: '#9ca3af' }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}></div>
                                <p style={{ fontSize: 13 }}>Aucun joueur</p>
                            </div>
                        ) : joueurs.map(j => (
                            <div key={j.id} onClick={() => { setSelected(j); setAnalysis(''); }}
                                 style={{
                                     padding: '14px 20px',
                                     borderLeft: selected?.id === j.id ? '3px solid #E63030' : '3px solid transparent',
                                     borderBottom: '1px solid #f5f5f5',
                                     cursor: 'pointer',
                                     background: selected?.id === j.id ? '#fef9f9' : '#fff',
                                     transition: 'all 0.15s'
                                 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: '#E63030', color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: 16, flexShrink: 0
                                    }}>
                                        {j.prenom?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>
                                            {j.prenom} {j.nom}
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                            {j.poste && (
                                                <span style={{
                                                    fontSize: 11, fontWeight: 600, padding: '2px 8px',
                                                    borderRadius: 4, background: getPosteColor(j.poste), color: '#374151'
                                                }}>{j.poste}</span>
                                            )}
                                            {j.categorie && (
                                                <span style={{ fontSize: 11, color: '#9ca3af' }}>{j.categorie}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analyse Panel */}
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden' }}>
                    {!selected ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', padding: 60 }}>
                            <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.4 }}></div>
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                                Sélectionnez un joueur
                            </h3>
                            <p style={{ fontSize: 14, textAlign: 'center' }}>
                                Choisissez un joueur dans la liste pour obtenir une analyse IA personnalisée
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Player Header */}
                            <div style={{ padding: '20px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{
                                        width: 52, height: 52, borderRadius: '50%',
                                        background: '#E63030', color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: 20
                                    }}>
                                        {selected.prenom?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                                            {selected.prenom} {selected.nom}
                                        </h2>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {selected.poste && (
                                                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: getPosteColor(selected.poste), color: '#374151' }}>
                                                    {selected.poste}
                                                </span>
                                            )}
                                            {selected.categorie && (
                                                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: '#f3f4f6', color: '#6b7280' }}>
                                                    {selected.categorie}
                                                </span>
                                            )}
                                            {selected.statut && (
                                                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: '#f0fdf4', color: '#166534', border: '1px solid #86efac' }}>
                                                    {selected.statut}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={analyzePlayer} disabled={loading} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '11px 22px', background: loading ? '#f3f4f6' : '#E63030',
                                    color: loading ? '#9ca3af' : '#fff', border: 'none',
                                    borderRadius: 10, fontWeight: 700, fontSize: 14,
                                    cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s'
                                }}>
                                    {loading ? (
                                        <>
                                            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                                            Analyse en cours...
                                        </>
                                    ) : (
                                        <> Analyser avec IA</>
                                    )}
                                </button>
                            </div>

                            {/* Profil Info */}
                            <div style={{ padding: '20px 28px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                                    {[
                                        { label: 'Saison', value: selected.saison || '—', icon: '📅' },
                                        { label: 'Catégorie', value: selected.categorie || '—', icon: '🏷️' },
                                        { label: 'Statut', value: selected.statut || '—', icon: '✅' },
                                    ].map(info => (
                                        <div key={info.label} style={{ background: '#fafafa', borderRadius: 10, padding: '14px 16px', border: '1px solid #f0f0f0' }}>
                                            <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                                                {info.icon} {info.label}
                                            </div>
                                            <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{info.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Analysis Result */}
                            <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
                                {!analysis && !loading && (
                                    <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                                        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>🤖</div>
                                        <p style={{ fontSize: 14 }}>Cliquez sur "Analyser avec IA" pour obtenir une analyse personnalisée</p>
                                    </div>
                                )}

                                {loading && (
                                    <div style={{ textAlign: 'center', padding: 40 }}>
                                        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
                                        <p style={{ color: '#888', fontSize: 14 }}>L'IA analyse le profil du joueur...</p>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                                            {[0, 1, 2].map(i => (
                                                <div key={i} style={{
                                                    width: 8, height: 8, borderRadius: '50%', background: '#E63030',
                                                    animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysis && !loading && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                            <span style={{ fontSize: 20 }}></span>
                                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>Analyse IA</h3>
                                            <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>
                                                Propulsé par Llama 3.2
                                            </span>
                                        </div>
                                        <div style={{
                                            background: '#fafafa', borderRadius: 12,
                                            padding: '20px 24px', border: '1px solid #f0f0f0',
                                            fontSize: 14, color: '#333', lineHeight: 1.8,
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {analysis}
                                        </div>
                                        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                                            <button onClick={analyzePlayer} style={{
                                                padding: '9px 18px', borderRadius: 8,
                                                border: '1.5px solid #e5e7eb', background: '#fff',
                                                fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151'
                                            }}>🔄 Relancer l'analyse</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}