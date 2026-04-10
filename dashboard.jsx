import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

const POWERBI_URL = "https://app.powerbi.com/view?r=eyJrIjoiNDNmNGQ1N2UtNjgzNC00YjY3LWE5YWEtMmRkN2Q3ZTk2MjMzIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [stats, setStats]       = useState(null);
    const [fedStats, setFedStats] = useState(null);
    const [calendar, setCalendar] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const msgRes = await api.get('/users/messages');
            setMessages(msgRes.data?.slice(0, 4) || []);

            if (user?.role === 'CLUB_ADMIN') {
                const [statsRes, calRes] = await Promise.all([
                    api.get('/club-admin/dashboard'),
                    api.get('/club-admin/calendrier'),
                ]);
                setStats(statsRes.data);
                setCalendar(calRes.data?.slice(0, 5) || []);
            }

            if (user?.role === 'FEDERATION_ADMIN' || user?.role === 'SUPER_ADMIN') {
                const [fedRes, calRes] = await Promise.all([
                    api.get('/federation/dashboard'),
                    api.get('/federation/calendrier'),
                ]);
                setFedStats(fedRes.data);
                setCalendar(calRes.data?.slice(0, 5) || []);
            }
        } catch (err) {
            console.error('Dashboard fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }) : '';

    const getStatutStyle = (statut) => {
        switch (statut) {
            case 'TERMINE':  return { bg: '#f0fdf4', color: '#166534', label: 'Terminé' };
            case 'EN_COURS': return { bg: '#eff6ff', color: '#1e40af', label: 'En cours' };
            case 'PLANIFIE': return { bg: '#fffbeb', color: '#92400e', label: 'Planifié' };
            default:         return { bg: '#f3f4f6', color: '#374151', label: statut };
        }
    };

    const StatCard = ({ icon, label, value, sub, color, bg }) => (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
            <div>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#111', lineHeight: 1 }}>{value ?? '—'}</div>
                {sub && <div style={{ fontSize: 12, color, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
            </div>
        </div>
    );

    const CalendarSection = () => (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 800, fontSize: 18, color: '#111' }}>📅 Calendrier des matchs</h3>
                <button onClick={() => navigate('/dashboard/calendar')} style={{ background: 'none', border: 'none', color: '#E63030', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Voir tout →</button>
            </div>
            {calendar.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                    <p style={{ fontSize: 14 }}>Aucun match planifié</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {calendar.map((match, i) => {
                        const st = getStatutStyle(match.statut);
                        return (
                            <div key={match.id || i} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ minWidth: 52, textAlign: 'center', background: '#E63030', borderRadius: 10, padding: '8px 6px', color: '#fff' }}>
                                    <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{match.dateMatch ? new Date(match.dateMatch).getDate() : '—'}</div>
                                    <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.9 }}>{match.dateMatch ? new Date(match.dateMatch).toLocaleDateString('fr-TN', { month: 'short' }).toUpperCase() : ''}</div>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {match.equipeDomicileNom} <span style={{ color: '#E63030' }}>vs</span> {match.equipeExterieureNom}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 12 }}>
                                        <span>🏆 {match.competitionNom || 'Amical'}</span>
                                        <span>📍 {match.lieu || '—'}</span>
                                        <span>🕐 {formatTime(match.dateMatch)}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    {match.statut === 'TERMINE' ? (
                                        <div style={{ fontWeight: 800, fontSize: 18, color: '#111' }}>{match.scoreDomicile ?? 0} – {match.scoreExterieur ?? 0}</div>
                                    ) : (
                                        <span style={{ background: st.bg, color: st.color, padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{st.label}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    // ── CLUB_ADMIN DASHBOARD ──
    if (user?.role === 'CLUB_ADMIN') {
        return (
            <div>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>Tableau de bord</h1>
                    <p style={{ color: '#888', fontSize: 14 }}>{stats?.nomClub ? `🏟️ ${stats.nomClub}` : 'Bienvenue'}</p>
                </div>
                {loading ? <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Chargement...</div> : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                            <StatCard icon="🏉" label="Joueurs"     value={stats?.nombreJoueurs}     color="#E63030" bg="#fef2f2" />
                            <StatCard icon="👕" label="Équipes"     value={stats?.nombreEquipes}     color="#1e40af" bg="#eff6ff" />
                            <StatCard icon="👔" label="Staff"       value={stats?.nombreStaff}       color="#166534" bg="#f0fdf4" />
                            <StatCard icon="🤝" label="Partenaires" value={stats?.nombrePartenaires} color="#7e22ce" bg="#fdf4ff" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                            <CalendarSection />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 20 }}>
                                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111', marginBottom: 16 }}>⚡ Actions rapides</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {[
                                            { icon: '🏉', label: 'Ajouter un joueur',  path: '/dashboard/club-management' },
                                            { icon: '👕', label: 'Gérer les équipes',  path: '/dashboard/teams' },
                                            { icon: '📅', label: 'Voir le calendrier', path: '/dashboard/calendar' },
                                            { icon: '👤', label: 'Mon profil',         path: '/dashboard/profile' },
                                        ].map(a => (
                                            <button key={a.label} onClick={() => navigate(a.path)}
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #eee', background: '#fafafa', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}
                                                    onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
                                                    onMouseOut={e => e.currentTarget.style.background = '#fafafa'}>
                                                <span>{a.icon}</span> {a.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                        <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111' }}>✉️ Messages</h3>
                                        <button onClick={() => navigate('/dashboard/messages')} style={{ background: 'none', border: 'none', color: '#E63030', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Voir tout →</button>
                                    </div>
                                    {messages.length === 0 ? (
                                        <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '16px 0' }}>Aucun message</p>
                                    ) : messages.map((m, i) => (
                                        <div key={i} style={{ padding: '10px 0', borderBottom: i < messages.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                                            <div style={{ fontWeight: m.lu ? 400 : 700, fontSize: 13, color: '#111', marginBottom: 2 }}>{m.sujet || 'Sans sujet'}</div>
                                            <div style={{ fontSize: 12, color: '#888' }}>{m.expediteurNom || '—'} · {formatDate(m.dateEnvoi)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ── FEDERATION_ADMIN / SUPER_ADMIN DASHBOARD ──
    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>Tableau de bord</h1>
                <p style={{ color: '#888', fontSize: 14 }}>Vue d'ensemble de la plateforme</p>
            </div>

            {loading ? <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Chargement...</div> : (
                <>
                    {/* Stats Cards — données réelles */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                        <StatCard icon="👥" label="Utilisateurs"  value={fedStats?.totalUtilisateurs} sub={fedStats?.demandesEnAttente > 0 ? `⏳ ${fedStats.demandesEnAttente} en attente` : null} color="#E63030" bg="#fef2f2" />
                        <StatCard icon="🛡️" label="Clubs"         value={fedStats?.totalClubs}        sub={fedStats?.clubsActifs != null ? `✓ ${fedStats.clubsActifs} actifs` : null} color="#1e40af" bg="#eff6ff" />
                        <StatCard icon="🏆" label="Compétitions"  value={fedStats?.totalCompetitions} sub={fedStats?.competitionsActives != null ? `${fedStats.competitionsActives} en cours` : null} color="#166534" bg="#f0fdf4" />
                        <StatCard icon="🏉" label="Joueurs"       value={fedStats?.totalJoueurs}      color="#7e22ce" bg="#fdf4ff" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                        <StatCard icon="👕" label="Équipes"      value={fedStats?.totalEquipes}     color="#c2410c" bg="#fff7ed" />
                        <StatCard icon="⚽" label="Matchs"       value={fedStats?.totalMatchs}      color="#0f766e" bg="#f0fdfa" />
                        <StatCard icon="📋" label="Licences"     value={fedStats?.totalLicences}    color="#1d4ed8" bg="#eff6ff" />
                        <StatCard icon="🤝" label="Partenaires"  value={fedStats?.totalPartenaires} color="#6b21a8" bg="#faf5ff" />
                    </div>

                    {/* ✅ PowerBI Rapport embed */}
                    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div>
                                <h3 style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 4 }}>
                                    📊 Rapport analytique
                                </h3>
                                <p style={{ fontSize: 13, color: '#888' }}>Données mises à jour automatiquement via Power BI</p>
                            </div>
                            <a href={POWERBI_URL} target="_blank" rel="noreferrer"
                               style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fafafa', fontSize: 13, fontWeight: 600, color: '#555', textDecoration: 'none', cursor: 'pointer' }}>
                                🔗 Ouvrir en plein écran
                            </a>
                        </div>
                        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                            <iframe
                                title="Rapport Power BI"
                                src={POWERBI_URL}
                                width="100%"
                                height="500"
                                frameBorder="0"
                                allowFullScreen={true}
                                style={{ display: 'block' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                        <CalendarSection />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 20 }}>
                                <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111', marginBottom: 16 }}>⚡ Actions rapides</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {[
                                        { icon: '👤', label: 'Gérer les utilisateurs', path: '/dashboard/users',        roles: ['SUPER_ADMIN'] },
                                        { icon: '🛡️', label: 'Gérer les clubs',        path: '/dashboard/clubs',        roles: ['SUPER_ADMIN', 'FEDERATION_ADMIN'] },
                                        { icon: '🏆', label: 'Compétitions',           path: '/dashboard/competitions', roles: ['SUPER_ADMIN', 'FEDERATION_ADMIN'] },
                                        { icon: '🏉', label: 'Joueurs',               path: '/dashboard/joueurs',      roles: ['SUPER_ADMIN', 'FEDERATION_ADMIN'] },
                                        { icon: '👤', label: 'Mon profil',             path: '/dashboard/profile',      roles: ['SUPER_ADMIN', 'FEDERATION_ADMIN'] },
                                    ].filter(a => a.roles.includes(user?.role)).map(a => (
                                        <button key={a.label} onClick={() => navigate(a.path)}
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #eee', background: '#fafafa', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}
                                                onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
                                                onMouseOut={e => e.currentTarget.style.background = '#fafafa'}>
                                            <span>{a.icon}</span> {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#111' }}>✉️ Messages</h3>
                                    <button onClick={() => navigate('/dashboard/messages')} style={{ background: 'none', border: 'none', color: '#E63030', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Voir tout →</button>
                                </div>
                                {messages.length === 0 ? (
                                    <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '16px 0' }}>Aucun message</p>
                                ) : messages.map((m, i) => (
                                    <div key={i} style={{ padding: '10px 0', borderBottom: i < messages.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                                        <div style={{ fontWeight: m.lu ? 400 : 700, fontSize: 13, color: '#111', marginBottom: 2 }}>{m.sujet || 'Sans sujet'}</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>{m.expediteurNom || '—'} · {formatDate(m.dateEnvoi)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}