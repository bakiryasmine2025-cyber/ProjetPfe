import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const MODAL_EMPTY = {
    type: 'JOUEUR',
    dateEmission: '',
    dateExpiration: '',
    aptitudeMedicale: true,
    personneId: ''
};

const STATUT_STYLE = {
    ACTIVE:    { bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    APPROVED:  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    PENDING:   { bg: '#fff7ed', color: '#c2410c', border: '#fdba74' },
    SUSPENDED: { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
    REJECTED:  { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' },
    EXPIRED:   { bg: '#f3f4f6', color: '#4b5563', border: '#d1d5db' },
};

const labelStyle     = { fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 };
const inputStyle     = { width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: 14 };
const cancelBtnStyle = { flex: 1, padding: 12, borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 };
const submitBtnStyle = (s) => ({ flex: 1, padding: 12, borderRadius: 10, background: s ? '#f87171' : '#E63030', color: '#fff', border: 'none', fontWeight: 700, cursor: s ? 'not-allowed' : 'pointer', fontSize: 14 });
const btnStyle       = (bg) => ({ padding: '5px 10px', background: bg, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' });
const btnOutlineStyle = (color) => ({ padding: '5px 10px', background: '#fff', color, border: `1.5px solid ${color}`, borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' });

const errMsg = (err, fallback) =>
    typeof err?.response?.data === 'string'
        ? err.response.data
        : err?.response?.data?.message || fallback;

export default function Licences() {
    const { user } = useAuth();
    const isClubAdmin       = user?.role === 'CLUB_ADMIN';
    const isFederationAdmin = user?.role === 'FEDERATION_ADMIN' || user?.role === 'SUPER_ADMIN';

    const [licences, setLicences]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [modal, setModal]           = useState(false);
    const [form, setForm]             = useState(MODAL_EMPTY);
    const [saving, setSaving]         = useState(false);
    const [joueurs, setJoueurs]       = useState([]);
    const [motifModal, setMotifModal] = useState({ open: false, action: null, licenceId: null });
    const [motif, setMotif]           = useState('');

    useEffect(() => {
        if (user) {
            fetchLicences();
            fetchJoueurs();
        }
    }, [user]);

    const fetchLicences = async () => {
        try {
            setLoading(true);
            const endpoint = isClubAdmin ? '/licences/mon-club' : '/licences';
            const res = await axios.get(endpoint);
            setLicences(res.data);
            setError('');
        } catch {
            setError('Erreur lors du chargement des licences.');
        } finally {
            setLoading(false);
        }
    };

    const fetchJoueurs = async () => {
        try {
            const endpoint = isClubAdmin ? '/club-admin/joueurs' : '/federation/joueurs';
            const res = await axios.get(endpoint);
            setJoueurs(res.data);
        } catch {
            console.error('Erreur chargement joueurs');
        }
    };

    const handleSubmit = async () => {
        if (!form.personneId || !form.type || !form.dateEmission || !form.dateExpiration) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        setSaving(true);
        try {
            const endpoint = isClubAdmin ? '/licences' : '/licences/admin';
            await axios.post(endpoint, {
                type:             form.type,
                dateEmission:     form.dateEmission,
                dateExpiration:   form.dateExpiration,
                aptitudeMedicale: form.aptitudeMedicale === 'true' || form.aptitudeMedicale === true,
                personneId:       form.personneId
            });
            setModal(false);
            setForm(MODAL_EMPTY);
            await fetchLicences();
        } catch (err) {
            alert(errMsg(err, 'Erreur lors de la soumission.'));
        } finally {
            setSaving(false);
        }
    };

    const handleApprouver = async (id) => {
        if (!window.confirm('Approuver cette licence ? (PENDING → APPROVED)')) return;
        try {
            await axios.patch(`/licences/${id}/approuver`);
            await fetchLicences();
        } catch (err) {
            alert(errMsg(err, "Erreur lors de l'approbation."));
        }
    };

    const handleActiver = async (id) => {
        if (!window.confirm('Activer cette licence ? (APPROVED → ACTIVE)')) return;
        try {
            await axios.patch(`/licences/${id}/activer`);
            await fetchLicences();
        } catch (err) {
            alert(errMsg(err, "Erreur lors de l'activation."));
        }
    };

    const handleRefuser   = (id) => { setMotifModal({ open: true, action: 'refuser',   licenceId: id }); setMotif(''); };
    const handleSuspendre = (id) => { setMotifModal({ open: true, action: 'suspendre', licenceId: id }); setMotif(''); };

    const handleRenouveler = async (id) => {
        if (!window.confirm('Renouveler cette licence ? (+1 an)')) return;
        try {
            await axios.patch(`/licences/${id}/renouveler`);
            await fetchLicences();
        } catch (err) {
            alert(errMsg(err, 'Erreur lors du renouvellement.'));
        }
    };

    const confirmMotifAction = async () => {
        const { action, licenceId } = motifModal;
        const param = action === 'refuser' ? 'motif' : 'raison';
        try {
            await axios.patch(`/licences/${licenceId}/${action}?${param}=${encodeURIComponent(motif)}`);
            setMotifModal({ open: false, action: null, licenceId: null });
            setMotif('');
            await fetchLicences();
        } catch (err) {
            alert(errMsg(err, 'Erreur.'));
        }
    };

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const renderActions = (l) => {
        if (!isFederationAdmin) return null;
        const btns = [];
        if (l.statut === 'PENDING') {
            btns.push(
                <button key="app" onClick={() => handleApprouver(l.id)} style={btnStyle('#1d4ed8')}>Approuver</button>,
                <button key="ref" onClick={() => handleRefuser(l.id)}   style={btnOutlineStyle('#E63030')}>Refuser</button>
            );
        }
        if (l.statut === 'APPROVED') {
            btns.push(
                <button key="act" onClick={() => handleActiver(l.id)}  style={btnStyle('#166534')}>Activer</button>,
                <button key="ref" onClick={() => handleRefuser(l.id)}  style={btnOutlineStyle('#E63030')}>Refuser</button>
            );
        }
        if (l.statut === 'ACTIVE') {
            btns.push(
                <button key="sus" onClick={() => handleSuspendre(l.id)} style={btnOutlineStyle('#854d0e')}>Suspendre</button>
            );
        }
        if (l.statut === 'SUSPENDED' || l.statut === 'EXPIRED') {
            btns.push(
                <button key="ren" onClick={() => handleRenouveler(l.id)} style={btnStyle('#166534')}>Renouveler</button>
            );
        }
        return <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{btns}</div>;
    };

    const renderFormModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
                    📋 Soumettre une demande de licence
                </h3>
                <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Joueur *</label>
                        <select name="personneId" value={form.personneId} onChange={handle} style={inputStyle}>
                            <option value="">Sélectionner un joueur</option>
                            {joueurs.map(j => (
                                <option key={j.id} value={j.id}>{j.prenom} {j.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Type *</label>
                        <select name="type" value={form.type} onChange={handle} style={inputStyle}>
                            <option value="JOUEUR">JOUEUR</option>
                            <option value="ENTRAINEUR">ENTRAINEUR</option>
                            <option value="ARBITRE">ARBITRE</option>
                            <option value="STAFF_TECHNIQUE">STAFF TECHNIQUE</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Date d'émission *</label>
                            <input name="dateEmission" type="date" value={form.dateEmission} onChange={handle} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Date d'expiration *</label>
                            <input name="dateExpiration" type="date" value={form.dateExpiration} onChange={handle} style={inputStyle} />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Aptitude médicale</label>
                        <select name="aptitudeMedicale" value={form.aptitudeMedicale} onChange={handle} style={inputStyle}>
                            <option value="true">Oui</option>
                            <option value="false">Non</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button onClick={() => { setModal(false); setForm(MODAL_EMPTY); }} style={cancelBtnStyle}>Annuler</button>
                    <button onClick={handleSubmit} disabled={saving} style={submitBtnStyle(saving)}>
                        {saving ? 'Envoi...' : 'Soumettre'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderMotifModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
                    {motifModal.action === 'refuser' ? '❌ Refuser la licence' : '🚫 Suspendre la licence'}
                </h3>
                <label style={labelStyle}>
                    {motifModal.action === 'refuser' ? 'Motif du refus' : 'Raison de la suspension'} (optionnel)
                </label>
                <textarea
                    value={motif}
                    onChange={e => setMotif(e.target.value)}
                    placeholder="Saisir un motif..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', marginTop: 6 }}
                />
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button onClick={() => setMotifModal({ open: false, action: null, licenceId: null })} style={cancelBtnStyle}>Annuler</button>
                    <button onClick={confirmMotifAction} style={submitBtnStyle(false)}>Confirmer</button>
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Chargement...
        </div>
    );

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                        {isClubAdmin ? 'Mes Licences' : 'Gestion des Licences'}
                    </h1>
                    <p style={{ color: '#888', fontSize: 14 }}>
                        {isClubAdmin ? 'Licences de votre club' : `${licences.length} licence${licences.length !== 1 ? 's' : ''} au total`}
                    </p>
                </div>

                {/* ✅ FIX: button visible seulement pour CLUB_ADMIN */}
                {isClubAdmin && (
                    <button onClick={() => setModal(true)} style={{ background: '#E63030', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                        📋 Soumettre une demande
                    </button>
                )}
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
                    {error}
                </div>
            )}

            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                        {['NUMÉRO', 'MEMBRE', 'CLUB', 'TYPE', 'EXPIRATION', 'STATUT',
                            ...(isFederationAdmin ? ['ACTIONS'] : [])
                        ].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {licences.length === 0 ? (
                        <tr>
                            <td colSpan={isFederationAdmin ? 7 : 6} style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                                <p style={{ fontWeight: 600, marginBottom: 4 }}>Aucune licence trouvée</p>
                                <p style={{ fontSize: 13 }}>
                                    {isClubAdmin ? 'Soumettez une demande pour commencer' : 'Aucune licence enregistrée'}
                                </p>
                            </td>
                        </tr>
                    ) : licences.map((l, idx) => {
                        const st = STATUT_STYLE[l.statut] || STATUT_STYLE.PENDING;
                        return (
                            <tr key={l.id}
                                style={{ borderBottom: idx < licences.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                                onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 14, color: '#111' }}>{l.numero}</td>
                                <td style={{ padding: '14px 16px', color: '#555', fontSize: 13 }}>{l.personneNom || '—'}</td>
                                <td style={{ padding: '14px 16px', color: '#555', fontSize: 13 }}>{l.clubNom || '—'}</td>
                                <td style={{ padding: '14px 16px' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                                        {l.type}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 16px', color: '#888', fontSize: 13 }}>
                                    {l.dateExpiration ? new Date(l.dateExpiration).toLocaleDateString('fr-FR') : '—'}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                    <div>
                                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                            {l.statut}
                                        </span>
                                        {l.motifRefus && (
                                            <div style={{ fontSize: 11, color: '#888', marginTop: 4, maxWidth: 160 }}>{l.motifRefus}</div>
                                        )}
                                    </div>
                                </td>
                                {isFederationAdmin && (
                                    <td style={{ padding: '14px 16px' }}>{renderActions(l)}</td>
                                )}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {modal && renderFormModal()}
            {motifModal.open && renderMotifModal()}
        </div>
    );
}