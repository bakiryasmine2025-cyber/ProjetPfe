import { useState } from 'react';
import api from '../../api/axiosConfig';

const POSTES = ['Pilier', 'Talonneur', 'Deuxième ligne', 'Troisième ligne', 'Demi de mêlée', 'Demi d\'ouverture', 'Centre', 'Ailier', 'Arrière'];
const TERRAINS = ['Gazon naturel', 'Gazon synthétique', 'Terrain boueux', 'Terrain sec/dur', 'Terrain humide'];
const CONDITIONS = ['Ensoleillé', 'Nuageux', 'Pluie légère', 'Pluie forte', 'Vent fort', 'Brouillard', 'Orage'];
const CATEGORIES = ['U12', 'U14', 'U16', 'U18', 'Espoir', 'Senior', 'Vétéran'];

const RISK_COLORS = {
    'FAIBLE':   { bg: '#f0fdf4', border: '#86efac', text: '#166534', badge: '#22c55e' },
    'MODÉRÉ':   { bg: '#fffbeb', border: '#fde68a', text: '#92400e', badge: '#f59e0b' },
    'ÉLEVÉ':    { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', badge: '#f97316' },
    'CRITIQUE': { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', badge: '#ef4444' },
};

const getRiskLevel = (text) => {
    if (!text) return null;
    const upper = text.toUpperCase();
    if (upper.includes('CRITIQUE')) return 'CRITIQUE';
    if (upper.includes('ÉLEVÉ') || upper.includes('ELEVE')) return 'ÉLEVÉ';
    if (upper.includes('MODÉRÉ') || upper.includes('MODERE')) return 'MODÉRÉ';
    if (upper.includes('FAIBLE')) return 'FAIBLE';
    return null;
};

export default function InjuryPrevention() {
    const [activeTab, setActiveTab] = useState('joueur'); // 'joueur' | 'equipe' | 'meteo'

    // Formulaire joueur
    const [joueur, setJoueur] = useState({
        nom: '', poste: 'Ailier', age: '', categorie: 'Senior',
        temperature: '20', humidite: '50',
        conditions: 'Ensoleillé', terrain: 'Gazon naturel',
    });

    // Formulaire équipe
    const [equipe, setEquipe] = useState({
        temperature: '20', humidite: '50',
        conditions: 'Ensoleillé', terrain: 'Gazon naturel',
        typeMatch: 'Match officiel',
    });

    // Formulaire météo
    const [meteo, setMeteo] = useState({
        temperature: '20', humidite: '50',
        conditions: 'Ensoleillé', terrain: 'Gazon naturel',
    });

    const [result, setResult]   = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    // ── Extraire le texte de la réponse Ollama ────────────────────────────────
    const extractText = (data) => {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            return parsed?.message?.content || parsed?.response || JSON.stringify(parsed);
        } catch {
            return String(data);
        }
    };

    // ── Analyser joueur ───────────────────────────────────────────────────────
    const analyzeJoueur = async () => {
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await api.post('/injury-prevention/analyze', joueur);
            setResult({ type: 'joueur', text: extractText(res.data) });
        } catch (err) {
            setError('Erreur de connexion à Ollama. Vérifiez que le serveur est en marche.');
        } finally { setLoading(false); }
    };

    // ── Analyser équipe ───────────────────────────────────────────────────────
    const analyzeEquipe = async () => {
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await api.post('/injury-prevention/analyze-team', equipe);
            setResult({ type: 'equipe', text: extractText(res.data) });
        } catch (err) {
            setError('Erreur de connexion à Ollama. Vérifiez que le serveur est en marche.');
        } finally { setLoading(false); }
    };

    // ── Conseils météo ────────────────────────────────────────────────────────
    const analyzeMeteo = async () => {
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await api.post('/injury-prevention/weather-advice', meteo);
            setResult({ type: 'meteo', text: extractText(res.data) });
        } catch (err) {
            setError('Erreur de connexion à Ollama. Vérifiez que le serveur est en marche.');
        } finally { setLoading(false); }
    };

    const riskLevel  = result ? getRiskLevel(result.text) : null;
    const riskColors = riskLevel ? RISK_COLORS[riskLevel] : null;

    // ── Styles ────────────────────────────────────────────────────────────────
    const inputStyle = {
        width: '100%', padding: '9px 12px',
        border: '1.5px solid #e5e7eb', borderRadius: 8,
        fontSize: 14, outline: 'none', background: '#fff',
        boxSizing: 'border-box',
    };
    const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' };
    const fieldStyle = { marginBottom: 14 };

    return (
        <div style={{ padding: '0', minHeight: '100vh' }}>

            {/* ── Header ── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>
                    🛡️ Prévention des Blessures IA
                </h1>
                <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
                    Analyse du risque de blessures selon les conditions météo et le terrain — Powered by llama3.2
                </p>
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid #f0f0f0', paddingBottom: 0 }}>
                {[
                    { key: 'joueur', label: '👤 Analyse Joueur',  desc: 'Risque individuel' },
                    { key: 'equipe', label: '👥 Analyse Équipe',  desc: 'Risque collectif'  },
                    { key: 'meteo',  label: '🌤️ Conseils Météo', desc: 'Conditions générales' },
                ].map(tab => (
                    <button key={tab.key} onClick={() => { setActiveTab(tab.key); setResult(null); setError(null); }} style={{
                        padding: '10px 20px', border: 'none', cursor: 'pointer',
                        background: activeTab === tab.key ? '#fff' : 'transparent',
                        borderBottom: activeTab === tab.key ? '2px solid #E63030' : '2px solid transparent',
                        marginBottom: -2,
                        borderRadius: '8px 8px 0 0',
                        fontWeight: activeTab === tab.key ? 700 : 500,
                        fontSize: 14,
                        color: activeTab === tab.key ? '#E63030' : '#666',
                        transition: 'all 0.15s',
                    }}>{tab.label}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' }}>

                {/* ── FORMULAIRE ── */}
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

                    {/* ══ TAB JOUEUR ══ */}
                    {activeTab === 'joueur' && (
                        <>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 20px' }}>
                                Informations du joueur
                            </h3>

                            <div style={{ background: '#f8f8f8', borderRadius: 10, padding: '16px', marginBottom: 20 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                                    👤 Profil joueur
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Nom du joueur</label>
                                    <input value={joueur.nom} onChange={e => setJoueur({...joueur, nom: e.target.value})} placeholder="Ex: Ahmed Ben Ali" style={inputStyle} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Poste</label>
                                        <select value={joueur.poste} onChange={e => setJoueur({...joueur, poste: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                            {POSTES.map(p => <option key={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Catégorie</label>
                                        <select value={joueur.categorie} onChange={e => setJoueur({...joueur, categorie: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Âge</label>
                                    <input type="number" value={joueur.age} onChange={e => setJoueur({...joueur, age: e.target.value})} placeholder="Ex: 24" min="10" max="50" style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ background: '#f0f7ff', borderRadius: 10, padding: '16px', marginBottom: 20 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                                    🌤️ Conditions météo
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Température (°C)</label>
                                        <input type="number" value={joueur.temperature} onChange={e => setJoueur({...joueur, temperature: e.target.value})} min="-10" max="50" style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Humidité (%)</label>
                                        <input type="number" value={joueur.humidite} onChange={e => setJoueur({...joueur, humidite: e.target.value})} min="0" max="100" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Conditions</label>
                                    <select value={joueur.conditions} onChange={e => setJoueur({...joueur, conditions: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Type de terrain</label>
                                    <select value={joueur.terrain} onChange={e => setJoueur({...joueur, terrain: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        {TERRAINS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button onClick={analyzeJoueur} disabled={loading} style={{
                                width: '100%', padding: '13px', borderRadius: 10,
                                background: loading ? '#f3f4f6' : '#E63030',
                                color: loading ? '#9ca3af' : '#fff',
                                border: 'none', fontWeight: 800, fontSize: 15,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}>
                                {loading ? (
                                    <>
                                        <span style={{ width: 16, height: 16, border: '2px solid #9ca3af', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                        Analyse en cours...
                                    </>
                                ) : '🤖 Analyser le risque'}
                            </button>
                        </>
                    )}

                    {/* ══ TAB ÉQUIPE ══ */}
                    {activeTab === 'equipe' && (
                        <>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 20px' }}>
                                Conditions du match
                            </h3>
                            <div style={{ background: '#f0f7ff', borderRadius: 10, padding: '16px', marginBottom: 20 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                                    🌤️ Météo & Terrain
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Température (°C)</label>
                                        <input type="number" value={equipe.temperature} onChange={e => setEquipe({...equipe, temperature: e.target.value})} min="-10" max="50" style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Humidité (%)</label>
                                        <input type="number" value={equipe.humidite} onChange={e => setEquipe({...equipe, humidite: e.target.value})} min="0" max="100" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Conditions</label>
                                    <select value={equipe.conditions} onChange={e => setEquipe({...equipe, conditions: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Type de terrain</label>
                                    <select value={equipe.terrain} onChange={e => setEquipe({...equipe, terrain: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        {TERRAINS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Type de match</label>
                                    <select value={equipe.typeMatch} onChange={e => setEquipe({...equipe, typeMatch: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        {['Match officiel', 'Match amical', 'Entraînement', 'Tournoi', 'Finale'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={analyzeEquipe} disabled={loading} style={{
                                width: '100%', padding: '13px', borderRadius: 10,
                                background: loading ? '#f3f4f6' : '#E63030',
                                color: loading ? '#9ca3af' : '#fff',
                                border: 'none', fontWeight: 800, fontSize: 15,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}>
                                {loading ? (
                                    <>
                                        <span style={{ width: 16, height: 16, border: '2px solid #9ca3af', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                        Analyse en cours...
                                    </>
                                ) : '🤖 Analyser l\'équipe'}
                            </button>
                        </>
                    )}

                    {/* ══ TAB MÉTÉO ══ */}
                    {activeTab === 'meteo' && (
                        <>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 20px' }}>
                                Conditions météorologiques
                            </h3>
                            <div style={{ background: '#f0f7ff', borderRadius: 10, padding: '16px', marginBottom: 20 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Température (°C)</label>
                                        <input type="number" value={meteo.temperature} onChange={e => setMeteo({...meteo, temperature: e.target.value})} min="-10" max="50" style={inputStyle} />
                                    </div>
                                    <div style={fieldStyle}>
                                        <label style={labelStyle}>Humidité (%)</label>
                                        <input type="number" value={meteo.humidite} onChange={e => setMeteo({...meteo, humidite: e.target.value})} min="0" max="100" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Conditions météo</label>
                                    <select value={meteo.conditions} onChange={e => setMeteo({...meteo, conditions: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Type de terrain</label>
                                    <select value={meteo.terrain} onChange={e => setMeteo({...meteo, terrain: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        {TERRAINS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={analyzeMeteo} disabled={loading} style={{
                                width: '100%', padding: '13px', borderRadius: 10,
                                background: loading ? '#f3f4f6' : '#E63030',
                                color: loading ? '#9ca3af' : '#fff',
                                border: 'none', fontWeight: 800, fontSize: 15,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}>
                                {loading ? (
                                    <>
                                        <span style={{ width: 16, height: 16, border: '2px solid #9ca3af', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                        Analyse en cours...
                                    </>
                                ) : '🌤️ Obtenir les conseils'}
                            </button>
                        </>
                    )}
                </div>

                {/* ── RÉSULTAT IA ── */}
                <div>
                    {/* Pas encore d'analyse */}
                    {!result && !loading && !error && (
                        <div style={{
                            background: '#fff', borderRadius: 14, border: '1px dashed #e5e7eb',
                            padding: '60px 40px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 8 }}>
                                Analyse IA prête
                            </h3>
                            <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6 }}>
                                Renseignez les informations du joueur et les conditions météo, puis cliquez sur <strong>Analyser</strong> pour obtenir une évaluation du risque de blessures par l'IA.
                            </p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                                {Object.entries(RISK_COLORS).map(([level, colors]) => (
                                    <span key={level} style={{
                                        padding: '4px 14px', borderRadius: 20,
                                        background: colors.bg, color: colors.text,
                                        border: `1px solid ${colors.border}`,
                                        fontSize: 12, fontWeight: 700,
                                    }}>{level}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #eee',
                            padding: '60px 40px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 20 }}>🤖</div>
                            <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTopColor: '#E63030', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 8 }}>
                                llama3.2 analyse les données...
                            </h3>
                            <p style={{ color: '#888', fontSize: 14 }}>
                                L'IA examine les conditions et calcule le risque de blessures
                            </p>
                        </div>
                    )}

                    {/* Erreur */}
                    {error && (
                        <div style={{
                            background: '#fef2f2', borderRadius: 14, border: '1px solid #fca5a5',
                            padding: '32px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 8 }}>Erreur de connexion</h3>
                            <p style={{ color: '#991b1b', fontSize: 14 }}>{error}</p>
                            <p style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
                                Assurez-vous qu'Ollama est en marche : <code>ollama serve</code>
                            </p>
                        </div>
                    )}

                    {/* Résultat */}
                    {result && !loading && (
                        <div style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #eee',
                            overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                        }}>
                            {/* Header résultat */}
                            <div style={{
                                padding: '20px 24px',
                                background: riskColors ? riskColors.bg : '#f8f8f8',
                                borderBottom: `1px solid ${riskColors ? riskColors.border : '#eee'}`,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 4 }}>
                                        🤖 Analyse IA — llama3.2
                                    </div>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: 0 }}>
                                        {result.type === 'joueur' ? '👤 Analyse Individuelle' :
                                            result.type === 'equipe' ? '👥 Analyse Équipe' :
                                                '🌤️ Conseils Météo'}
                                    </h3>
                                </div>
                                {riskLevel && (
                                    <span style={{
                                        padding: '8px 20px', borderRadius: 20,
                                        background: riskColors?.badge,
                                        color: '#fff', fontWeight: 800, fontSize: 14,
                                        letterSpacing: 0.5,
                                    }}>
                                        {riskLevel}
                                    </span>
                                )}
                            </div>

                            {/* Contenu */}
                            <div style={{ padding: '24px' }}>
                                <div style={{
                                    fontSize: 14, lineHeight: 1.9, color: '#374151',
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'inherit',
                                }}>
                                    {result.text}
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{
                                padding: '14px 24px', borderTop: '1px solid #f0f0f0',
                                background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <span style={{ fontSize: 12, color: '#888' }}>
                                    Généré par llama3.2 via Ollama • Rugby Tunisie IA
                                </span>
                                <button onClick={() => { setResult(null); setError(null); }} style={{
                                    padding: '6px 16px', borderRadius: 6,
                                    border: '1px solid #e5e7eb', background: '#fff',
                                    fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#555',
                                }}>
                                    Nouvelle analyse
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}