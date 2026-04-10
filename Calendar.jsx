import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const MOIS_FR  = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const JOURS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const JOURS_COURT = ['D','L','M','M','J','V','S'];

const TYPE_CONFIG = {
    MATCH:       { color: '#E63030', bg: '#fef2f2', label: 'Match' },
    ENTRAINEMENT:{ color: '#1d4ed8', bg: '#eff6ff', label: 'Entraînement' },
    EVENEMENT:   { color: '#c2410c', bg: '#fff7ed', label: 'Événement' },
    COMPETITION: { color: '#166534', bg: '#f0fdf4', label: 'Compétition' },
};

const STATUS_CONFIG = {
    PROGRAMME: { bg: '#eff6ff', color: '#1d4ed8', label: 'Programmé' },
    EN_COURS:  { bg: '#fefce8', color: '#854d0e', label: 'En cours'  },
    TERMINE:   { bg: '#f0fdf4', color: '#15803d', label: 'Terminé'   },
    REPORTE:   { bg: '#fef2f2', color: '#c0392b', label: 'Reporté'   },
};

const EMPTY_MATCH_FORM = {
    equipeDomicileId: '', equipeExterieurId: '',
    dateMatch: '', lieu: '', competitionId: ''
};

function calendarToEvent(item) {
    const date = item.date ? new Date(item.date) : null;
    return {
        id: item.id, date, title: item.title || '—',
        type: item.type || 'MATCH',
        statut: item.statut?.toString() || 'PROGRAMME',
        competitionNom: item.competitionNom,
        lieu: item.location,
        scoreDomicile: item.scoreDomicile,
        scoreExterieur: item.scoreExterieur,
        equipeDomicileNom: item.equipeDomicile,
        equipeExterieureNom: item.equipeExterieur,
        description: item.description || (item.type === 'COMPETITION' ? 'Compétition officielle' : 'Match officiel'),
        active: item.active,
        competitionCategorie: item.competitionCategorie,
        competitionNiveau: item.competitionNiveau,
    };
}

function matchToEvent(m) {
    return {
        id: m.id,
        date: m.dateMatch ? new Date(m.dateMatch) : null,
        title: `${m.equipeDomicileNom || '?'} vs ${m.equipeExterieureNom || '?'}`,
        type: 'MATCH',
        statut: m.statut || 'PROGRAMME',
        competitionNom: m.competitionNom,
        lieu: m.lieu,
        scoreDomicile: m.scoreDomicile,
        scoreExterieur: m.scoreExterieur,
        equipeDomicileNom: m.equipeDomicileNom,
        equipeExterieureNom: m.equipeExterieureNom,
        description: m.competitionNom || 'Match officiel',
    };
}

function isSameDay(d1, d2) {
    return d1 && d2 &&
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth()    === d2.getMonth()    &&
        d1.getDate()     === d2.getDate();
}

export default function Calendar() {
    const { user } = useAuth();
    const isFedAdmin = user?.role === 'FEDERATION_ADMIN' || user?.role === 'SUPER_ADMIN';

    const [events, setEvents]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [view, setView]               = useState('mois');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [equipes, setEquipes]         = useState([]);
    const [competitions, setCompetitions] = useState([]);

    // ── Filtres CLUB_ADMIN ──
    const [filterEquipe, setFilterEquipe] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo]     = useState('');

    // ── Modal ajouter/modifier match (FED) ──
    const [matchModal, setMatchModal] = useState(null); // null | 'create' | 'edit' | 'reschedule'
    const [matchForm, setMatchForm]   = useState(EMPTY_MATCH_FORM);
    const [editId, setEditId]         = useState(null);
    const [matchLoading, setMatchLoading] = useState(false);
    const [matchError, setMatchError]     = useState('');

    useEffect(() => {
        fetchCalendar();
        if (isFedAdmin) fetchEquipesAndCompetitions();
        else fetchEquipes(); // club_admin a besoin des équipes pour le filtre
    }, []);

    const fetchCalendar = async () => {
        try {
            setLoading(true);
            const endpoint = isFedAdmin ? '/federation/matches' : '/club-admin/calendrier';
            const res = await api.get(endpoint);
            const mapped = isFedAdmin
                ? (res.data || []).map(matchToEvent)
                : (res.data || []).map(calendarToEvent);
            setEvents(mapped);
        } catch {
            setError('Impossible de charger le calendrier.');
        } finally {
            setLoading(false);
        }
    };

    const fetchEquipesAndCompetitions = async () => {
        try {
            const [eqRes, compRes] = await Promise.all([
                api.get('/federation/equipes'),
                api.get('/federation/competitions').catch(() => ({ data: [] }))
            ]);
            setEquipes(eqRes.data || []);
            setCompetitions(compRes.data || []);
        } catch { /* silent */ }
    };

    const fetchEquipes = async () => {
        try {
            const res = await api.get('/club-admin/equipes');
            setEquipes(res.data || []);
        } catch { /* silent */ }
    };

    // ── Filtrage pour CLUB_ADMIN ──
    const filteredEvents = events.filter(ev => {
        if (!isFedAdmin) {
            if (filterEquipe && ev.equipeDomicileNom !== filterEquipe && ev.equipeExterieureNom !== filterEquipe) return false;
            if (filterDateFrom && ev.date && ev.date < new Date(filterDateFrom)) return false;
            if (filterDateTo   && ev.date && ev.date > new Date(filterDateTo + 'T23:59:59')) return false;
        }
        return true;
    });

    const getEventsForDay = (day) => filteredEvents.filter(e => e.date && isSameDay(e.date, day));

    // ── Actions FEDERATION_ADMIN ──
    const openCreate = () => {
        setMatchForm(EMPTY_MATCH_FORM);
        setEditId(null);
        setMatchError('');
        setMatchModal('create');
    };

    const openEdit = (ev) => {
        setMatchForm({
            equipeDomicileId: '',
            equipeExterieurId: '',
            dateMatch: ev.date ? ev.date.toISOString().slice(0, 16) : '',
            lieu: ev.lieu || '',
            competitionId: ''
        });
        setEditId(ev.id);
        setMatchError('');
        setMatchModal('edit');
        setSelectedEvent(null);
    };

    const openReschedule = (ev) => {
        setMatchForm({
            equipeDomicileId: '',
            equipeExterieurId: '',
            dateMatch: ev.date ? ev.date.toISOString().slice(0, 16) : '',
            lieu: ev.lieu || '',
            competitionId: ''
        });
        setEditId(ev.id);
        setMatchError('');
        setMatchModal('reschedule');
        setSelectedEvent(null);
    };

    const handleDeleteMatch = async (id) => {
        if (!window.confirm('Supprimer ce match définitivement ?')) return;
        try {
            await api.delete(`/federation/matches/${id}`);
            setSelectedEvent(null);
            fetchCalendar();
        } catch {
            setError('Erreur lors de la suppression.');
        }
    };

    const submitMatchForm = async () => {
        if (matchModal === 'create') {
            if (!matchForm.equipeDomicileId || !matchForm.equipeExterieurId || !matchForm.dateMatch) {
                setMatchError('Équipes et date obligatoires');
                return;
            }
            if (matchForm.equipeDomicileId === matchForm.equipeExterieurId) {
                setMatchError('Les deux équipes doivent être différentes');
                return;
            }
        } else {
            if (!matchForm.dateMatch) {
                setMatchError('La date est obligatoire');
                return;
            }
        }

        setMatchLoading(true);
        setMatchError('');
        try {
            const dateISO = new Date(matchForm.dateMatch).toISOString().replace('Z', '');
            if (matchModal === 'create') {
                await api.post('/federation/matches', { ...matchForm, dateMatch: dateISO });
            } else if (matchModal === 'edit') {
                await api.put(`/federation/matches/${editId}`, { dateMatch: dateISO, lieu: matchForm.lieu, competitionId: matchForm.competitionId || null });
            } else if (matchModal === 'reschedule') {
                await api.put(`/federation/matches/${editId}/reprogrammer`, { dateMatch: dateISO, lieu: matchForm.lieu });
            }
            setMatchModal(null);
            setMatchForm(EMPTY_MATCH_FORM);
            fetchCalendar();
        } catch (err) {
            setMatchError(err.response?.data?.message || err.response?.data || 'Erreur lors de l\'opération');
        } finally {
            setMatchLoading(false);
        }
    };

    const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.MATCH;

    // ── VUE MOIS ──
    const renderMois = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

        return (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {JOURS_FR.map(j => (
                        <div key={j} style={{ background: '#E63030', color: '#fff', textAlign: 'center', padding: '12px 0', fontWeight: 700, fontSize: 14 }}>{j}</div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {cells.map((day, idx) => {
                        const dayEvents = day ? getEventsForDay(day) : [];
                        const isToday = day && isSameDay(day, today);
                        return (
                            <div key={idx} style={{ minHeight: 100, border: '1px solid #f0f0f0', padding: '8px 6px', background: day ? '#fff' : '#fafafa' }}>
                                {day && (
                                    <>
                                        <div style={{ fontWeight: isToday ? 800 : 400, fontSize: 14, color: isToday ? '#E63030' : '#111', marginBottom: 4, width: 26, height: 26, borderRadius: '50%', background: isToday ? '#fef2f2' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {day.getDate()}
                                        </div>
                                        {dayEvents.slice(0, 2).map((ev, i) => {
                                            const cfg = getTypeConfig(ev.type);
                                            return (
                                                <div key={i} onClick={() => setSelectedEvent(ev)} style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, borderRadius: 4, padding: '2px 6px', marginBottom: 3, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {ev.date?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - Match
                                                </div>
                                            );
                                        })}
                                        {dayEvents.length > 2 && <div style={{ fontSize: 10, color: '#888', paddingLeft: 4 }}>+{dayEvents.length - 2} autres</div>}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // ── VUE SEMAINE ──
    const renderSemaine = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d; });
        const hours = Array.from({ length: 16 }, (_, i) => i + 6);
        const today = new Date();

        return (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee', overflow: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #eee' }}>
                    <div />
                    {days.map((d, i) => {
                        const isToday = isSameDay(d, today);
                        return (
                            <div key={i} style={{ textAlign: 'center', padding: '12px 4px', borderLeft: '1px solid #f0f0f0' }}>
                                <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{JOURS_COURT[d.getDay()]}</div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: isToday ? '#E63030' : '#111', width: 36, height: 36, borderRadius: '50%', background: isToday ? '#fef2f2' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto 0' }}>{d.getDate()}</div>
                            </div>
                        );
                    })}
                </div>
                {hours.map(h => (
                    <div key={h} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid #f5f5f5', minHeight: 48 }}>
                        <div style={{ fontSize: 11, color: '#999', padding: '4px 8px', textAlign: 'right', paddingTop: 6 }}>{h}:00</div>
                        {days.map((d, di) => {
                            const dayEvs = getEventsForDay(d).filter(ev => ev.date?.getHours() === h);
                            return (
                                <div key={di} style={{ borderLeft: '1px solid #f0f0f0', padding: '2px 3px' }}>
                                    {dayEvs.map((ev, i) => {
                                        const cfg = getTypeConfig(ev.type);
                                        return (
                                            <div key={i} onClick={() => setSelectedEvent(ev)} style={{ background: cfg.bg, color: cfg.color, borderLeft: `3px solid ${cfg.color}`, borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600, cursor: 'pointer', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {ev.date?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {ev.title.length > 15 ? ev.title.slice(0, 15) + '…' : ev.title}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    // ── VUE AGENDA ──
    const renderAgenda = () => {
        const sorted = [...filteredEvents].filter(e => e.date).sort((a, b) => a.date - b.date);
        if (sorted.length === 0) return (
            <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af', background: '#fff', borderRadius: 16, border: '1px dashed #e5e7eb' }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>📅</div>
                <p style={{ fontSize: 16, fontWeight: 600 }}>Aucun match prévu</p>
            </div>
        );

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {sorted.map((ev) => {
                    const cfg = getTypeConfig(ev.type);
                    const stCfg = STATUS_CONFIG[ev.statut] || STATUS_CONFIG.PROGRAMME;
                    return (
                        <div key={ev.id} style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}30`, borderLeft: `4px solid ${cfg.color}`, borderRadius: 14, padding: '20px 24px', cursor: 'pointer' }}
                             onClick={() => setSelectedEvent(ev)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ fontSize: 18 }}>🏆</span>
                                        <h3 style={{ fontWeight: 800, fontSize: 17, color: cfg.color, margin: 0 }}>{ev.title}</h3>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: cfg.color }}>
                                            <span>🕐</span>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{ev.date?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                                                <div style={{ opacity: 0.8 }}>{ev.date?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
                                        </div>
                                        {ev.lieu && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: cfg.color }}>
                                                <span>📍</span><span style={{ fontWeight: 600 }}>{ev.lieu}</span>
                                            </div>
                                        )}
                                    </div>
                                    {ev.competitionNom && (
                                        <div style={{ marginTop: 8, fontSize: 12, color: `${cfg.color}99` }}>🏅 {ev.competitionNom}</div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, marginLeft: 20 }}>
                                    <span style={{ background: stCfg.bg, color: stCfg.color, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{stCfg.label}</span>
                                    {/* ✅ Boutons action — FEDERATION_ADMIN seulement */}
                                    {isFedAdmin && (
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
                                                    style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>
                                                ✏️
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); openReschedule(ev); }}
                                                    style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#854d0e' }}>
                                                🔄
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteMatch(ev.id); }}
                                                    style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#E63030' }}>
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const navigate = (dir) => {
        const d = new Date(currentDate);
        if (view === 'mois') d.setMonth(d.getMonth() + dir);
        else if (view === 'semaine') d.setDate(d.getDate() + dir * 7);
        else d.setMonth(d.getMonth() + dir);
        setCurrentDate(d);
    };

    const getTitle = () => {
        if (view === 'semaine') {
            const start = new Date(currentDate);
            start.setDate(currentDate.getDate() - currentDate.getDay());
            return `${MOIS_FR[start.getMonth()]} ${start.getFullYear()}`;
        }
        return `${MOIS_FR[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    };

    const matchModalTitle = matchModal === 'create' ? '🏉 Planifier un match' : matchModal === 'edit' ? '✏️ Modifier le match' : '🔄 Reprogrammer le match';

    return (
        <div>
            {/* HEADER */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>Calendrier</h1>
                <p style={{ color: '#888', fontSize: 14 }}>
                    {isFedAdmin ? 'Gérez les matchs et le calendrier fédéral' : 'Calendrier de votre club'}
                </p>
            </div>

            {/* TOOLBAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                    <span style={{ fontWeight: 700, fontSize: 16, minWidth: 140, textAlign: 'center' }}>{getTitle()}</span>
                    <button onClick={() => navigate(1)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                </div>

                <div style={{ display: 'flex', gap: 4, background: '#f5f5f5', borderRadius: 10, padding: 4 }}>
                    {['mois', 'semaine', 'agenda'].map(v => (
                        <button key={v} onClick={() => setView(v)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: view === v ? '#E63030' : 'transparent', color: view === v ? '#fff' : '#555', fontWeight: 600, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>

                {/* ✅ Bouton ajouter — FEDERATION_ADMIN seulement */}
                {isFedAdmin && (
                    <button onClick={openCreate} style={{ background: '#E63030', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                        + Planifier un match
                    </button>
                )}
            </div>

            {/* ✅ Filtres — CLUB_ADMIN seulement */}
            {!isFedAdmin && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', background: '#f9fafb', borderRadius: 12, padding: '14px 16px', border: '1px solid #eee' }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 4 }}>Équipe</label>
                        <select value={filterEquipe} onChange={e => setFilterEquipe(e.target.value)}
                                style={{ padding: '8px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff', minWidth: 160 }}>
                            <option value="">Toutes les équipes</option>
                            {equipes.map(eq => <option key={eq.id} value={eq.nom}>{eq.nom}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 4 }}>Date de</label>
                        <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
                               style={{ padding: '8px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 4 }}>Date à</label>
                        <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
                               style={{ padding: '8px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                    </div>
                    {(filterEquipe || filterDateFrom || filterDateTo) && (
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button onClick={() => { setFilterEquipe(''); setFilterDateFrom(''); setFilterDateTo(''); }}
                                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#888' }}>
                                ✕ Réinitialiser
                            </button>
                        </div>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{filteredEvents.length} match{filteredEvents.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>⚠️ {error}</div>
            )}

            {loading ? (
                <div style={{ padding: 60, textAlign: 'center', color: '#888', background: '#fff', borderRadius: 16 }}>Chargement...</div>
            ) : (
                <>
                    {view === 'mois'    && renderMois()}
                    {view === 'semaine' && renderSemaine()}
                    {view === 'agenda'  && renderAgenda()}
                </>
            )}

            {/* LEGEND */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
                {[
                    { icon: '🏆', label: 'Matchs',        sub: 'Compétitions officielles', color: '#E63030', bg: '#fef2f2', count: events.filter(e => e.type === 'MATCH').length },
                    { icon: '🔄', label: 'Reportés',       sub: 'À reprogrammer',           color: '#854d0e', bg: '#fefce8', count: events.filter(e => e.statut === 'REPORTE').length },
                    { icon: '✅', label: 'Terminés',       sub: 'Matchs joués',             color: '#166534', bg: '#f0fdf4', count: events.filter(e => e.statut === 'TERMINE').length },
                ].map(l => (
                    <div key={l.label} style={{ background: l.bg, borderRadius: 12, border: `1px solid ${l.color}20`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 24 }}>{l.icon}</span>
                        <div>
                            <div style={{ fontWeight: 700, color: l.color, fontSize: 15 }}>{l.label}</div>
                            <div style={{ fontSize: 12, color: `${l.color}99` }}>{l.sub}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 20, color: l.color }}>{l.count}</div>
                    </div>
                ))}
            </div>

            {/* ✅ MODAL MATCH (create / edit / reschedule) */}
            {matchModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                     onClick={() => setMatchModal(null)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 520, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
                         onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h3 style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>{matchModalTitle}</h3>
                            <button onClick={() => setMatchModal(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#999' }}>×</button>
                        </div>

                        {matchError && (
                            <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>⚠️ {matchError}</div>
                        )}

                        {/* Équipes — seulement à la création */}
                        {matchModal === 'create' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Équipe domicile *</label>
                                    <select value={matchForm.equipeDomicileId} onChange={e => setMatchForm({ ...matchForm, equipeDomicileId: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', background: '#fff', fontSize: 13 }}>
                                        <option value="">Choisir...</option>
                                        {equipes.map(eq => <option key={eq.id} value={eq.id}>{eq.nom}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Équipe extérieur *</label>
                                    <select value={matchForm.equipeExterieurId} onChange={e => setMatchForm({ ...matchForm, equipeExterieurId: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', background: '#fff', fontSize: 13 }}>
                                        <option value="">Choisir...</option>
                                        {equipes.filter(eq => eq.id !== matchForm.equipeDomicileId).map(eq => <option key={eq.id} value={eq.id}>{eq.nom}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                                {matchModal === 'reschedule' ? 'Nouvelle date & heure *' : 'Date & Heure *'}
                            </label>
                            <input type="datetime-local" value={matchForm.dateMatch} onChange={e => setMatchForm({ ...matchForm, dateMatch: e.target.value })}
                                   style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ marginBottom: matchModal === 'reschedule' ? 24 : 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Stade / Lieu</label>
                            <input type="text" placeholder="Stade Ezzahra..." value={matchForm.lieu} onChange={e => setMatchForm({ ...matchForm, lieu: e.target.value })}
                                   style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
                        </div>

                        {matchModal !== 'reschedule' && (
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Compétition (optionnel)</label>
                                <select value={matchForm.competitionId} onChange={e => setMatchForm({ ...matchForm, competitionId: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', background: '#fff', fontSize: 13 }}>
                                    <option value="">Match amical</option>
                                    {competitions.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                                </select>
                            </div>
                        )}

                        {matchModal === 'reschedule' && (
                            <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: 8, padding: '10px 14px', marginBottom: 24, fontSize: 13, color: '#854d0e' }}>
                                ⚠️ Le statut du match sera automatiquement mis à <strong>Reporté</strong>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setMatchModal(null)}
                                    style={{ flex: 1, padding: 12, borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                                Annuler
                            </button>
                            <button onClick={submitMatchForm} disabled={matchLoading}
                                    style={{ flex: 1, padding: 12, borderRadius: 10, background: matchLoading ? '#f87171' : '#E63030', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                                {matchLoading ? 'Enregistrement...' : matchModal === 'create' ? '✅ Planifier' : matchModal === 'reschedule' ? '🔄 Reprogrammer' : '✅ Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DÉTAILS */}
            {selectedEvent && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                     onClick={() => setSelectedEvent(null)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
                         onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>🏆 {selectedEvent.title}</h3>
                            <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#999' }}>×</button>
                        </div>

                        {[
                            { icon: '📅', label: 'Date',        value: selectedEvent.date?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                            { icon: '🕐', label: 'Heure',       value: selectedEvent.date?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
                            { icon: '📍', label: 'Lieu',        value: selectedEvent.lieu || '—' },
                            { icon: '🏅', label: 'Compétition', value: selectedEvent.competitionNom || '—' },
                            { icon: '⚽', label: 'Score',       value: selectedEvent.scoreDomicile != null ? `${selectedEvent.scoreDomicile} – ${selectedEvent.scoreExterieur}` : 'Non disponible' },
                            { icon: '🏠', label: 'Domicile',    value: selectedEvent.equipeDomicileNom || '—' },
                            { icon: '✈️', label: 'Extérieur',   value: selectedEvent.equipeExterieureNom || '—' },
                        ].map(row => (
                            <div key={row.label} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                                <span style={{ fontSize: 16 }}>{row.icon}</span>
                                <div>
                                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 2 }}>{row.label}</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{row.value}</div>
                                </div>
                            </div>
                        ))}

                        {/* ✅ Actions dans le modal détails — FEDERATION_ADMIN seulement */}
                        {isFedAdmin ? (
                            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                                <button onClick={() => openEdit(selectedEvent)}
                                        style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                                    ✏️ Modifier
                                </button>
                                <button onClick={() => openReschedule(selectedEvent)}
                                        style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #fde047', background: '#fefce8', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#854d0e' }}>
                                    🔄 Reprogrammer
                                </button>
                                <button onClick={() => handleDeleteMatch(selectedEvent.id)}
                                        style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontWeight: 700, fontSize: 13, cursor: 'pointer', color: '#E63030' }}>
                                    🗑️ Supprimer
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setSelectedEvent(null)}
                                    style={{ marginTop: 20, width: '100%', padding: 12, borderRadius: 10, background: '#E63030', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                                Fermer
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}