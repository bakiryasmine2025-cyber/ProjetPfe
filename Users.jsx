import { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABELS = {
    SUPER_ADMIN:      { label: 'Super Admin',      bg: '#111',    color: '#fff'  },
    FEDERATION_ADMIN: { label: 'Admin Fédération', bg: '#e8f0fe', color: '#1a56db' },
    CLUB_ADMIN:       { label: 'Admin Club',        bg: '#f0f0f0', color: '#444'  },
    FAN:              { label: 'Fan',               bg: '#fdf4ff', color: '#7e22ce' },
};

const STATUS_STYLES = {
    ACTIVE:           { label: 'ACTIVE',      bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    INACTIVE:         { label: 'INACTIVE',    bg: '#f9fafb', color: '#6b7280', border: '#d1d5db' },
    SUSPENDED:        { label: 'SUSPENDED',   bg: '#fff7ed', color: '#c2410c', border: '#fdba74' },
    PENDING_APPROVAL: { label: 'EN ATTENTE',  bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
    REJECTED:         { label: 'REJETÉ',      bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
};

export default function Users() {
    const { user: currentUser } = useAuth();
    const [users, setUsers]               = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [filtered, setFiltered]         = useState([]);
    const [search, setSearch]             = useState('');
    const [roleFilter, setRole]           = useState('');
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState('');
    const [menuOpen, setMenuOpen]         = useState(null);
    const menuRef = useRef(null);

    // Modals
    const [addModal, setAddModal]             = useState(false);
    const [addForm, setAddForm]               = useState({ nom: '', email: '', telephone: '', role: '', password: '' });
    const [addLoading, setAddLoading]         = useState(false);

    const [statusModal, setStatusModal]       = useState(null);
    const [statusForm, setStatusForm]         = useState({ statut: '', message: '' });
    const [statusLoading, setStatusLoading]   = useState(false);

    const [msgModal, setMsgModal]             = useState(null);
    const [msgForm, setMsgForm]               = useState({ sujet: '', contenu: '' });
    const [msgLoading, setMsgLoading]         = useState(false);
    const [msgSuccess, setMsgSuccess]         = useState('');

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        let res = [...users];
        if (search) res = res.filter(u =>
            u.nom?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()));
        if (roleFilter) res = res.filter(u => u.role === roleFilter);
        setFiltered(res);
    }, [search, roleFilter, users]);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuOpen(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/superadmin/users');
            setUsers(res.data);

            let resPending;
            if (currentUser?.role === 'SUPER_ADMIN') {
                resPending = await api.get('/superadmin/users/pending');
            } else if (currentUser?.role === 'FEDERATION_ADMIN') {
                resPending = await api.get('/federation/users/pending');
            }
            setPendingUsers(resPending?.data || []);

        } catch { setError('Erreur de chargement des utilisateurs'); }
        finally { setLoading(false); }
    };

    // ✅ FIX: endpoint selon role du currentUser
    const handleApprove = async (userId) => {
        if (!window.confirm("Approuver ce compte ?")) return;
        try {
            const endpoint = currentUser.role === 'SUPER_ADMIN'
                ? `/superadmin/users/${userId}/approuver`
                : `/federation/users/${userId}/approuver`;
            await api.put(endpoint);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data || "Erreur d'approbation");
        }
    };

    // ✅ FIX: encode motif + endpoint selon role
    const handleReject = async (userId) => {
        const motif = window.prompt("Motif du rejet (optionnel) :");
        if (motif === null) return;
        try {
            const endpoint = currentUser.role === 'SUPER_ADMIN'
                ? `/superadmin/users/${userId}/rejeter`
                : `/federation/users/${userId}/rejeter`;
            await api.put(`${endpoint}${motif ? `?motif=${encodeURIComponent(motif)}` : ''}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data || "Erreur lors du rejet");
        }
    };

    const submitAdd = async () => {
        setAddLoading(true);
        try {
            await api.post('/auth/register', addForm);
            setAddModal(false);
            setAddForm({ nom: '', email: '', telephone: '', role: '', password: '' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur création');
        } finally { setAddLoading(false); }
    };

    const openStatusModal = (user) => {
        setStatusModal(user);
        setStatusForm({ statut: user.statut, message: '' });
        setMenuOpen(null);
    };

    const submitStatus = async () => {
        setStatusLoading(true);
        try {
            await api.put(`/superadmin/users/${statusModal.id}/status`, statusForm);
            setStatusModal(null);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur changement statut');
        } finally { setStatusLoading(false); }
    };

    const openMsgModal = (user) => {
        setMsgModal(user);
        setMsgForm({ sujet: '', contenu: '' });
        setMsgSuccess('');
        setMenuOpen(null);
    };

    const submitMsg = async () => {
        setMsgLoading(true);
        try {
            await api.post('/superadmin/messages', {
                receiverId: msgModal.id,
                sujet: msgForm.sujet,
                contenu: msgForm.contenu
            });
            setMsgSuccess('Message envoyé avec succès !');
            setTimeout(() => setMsgModal(null), 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur envoi message');
        } finally { setMsgLoading(false); }
    };

    const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : '—';

    const inputStyle = {
        width: '100%', padding: '11px 14px',
        border: '1.5px solid #e0e0e0', borderRadius: 10,
        fontSize: 14, outline: 'none', marginBottom: 16,
        boxSizing: 'border-box'
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                        Gestion des utilisateurs
                    </h1>
                    <p style={{ color: '#888', fontSize: 14 }}>{filtered.length} utilisateurs enregistrés</p>
                </div>
                {currentUser?.role === 'SUPER_ADMIN' && (
                    <button
                        onClick={() => setAddModal(true)}
                        style={{
                            background: '#E63030', color: '#fff',
                            border: 'none', borderRadius: 10,
                            padding: '11px 20px', fontSize: 14,
                            fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8
                        }}
                    >
                        👤+ Ajouter
                    </button>
                )}
            </div>

            {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
                    ⚠️ {error}
                </div>
            )}

            {/* ── DEMANDES EN ATTENTE ── */}
            {pendingUsers.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#c2410c', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                        ⏳ Demandes d'approbation ({pendingUsers.length})
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                        {pendingUsers.map(u => (
                            <div key={u.id} style={{
                                background: '#fff', borderRadius: 14,
                                border: '1.5px solid #fdba74', padding: 20,
                                boxShadow: '0 4px 12px rgba(251,191,36,0.1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{u.nom}</div>
                                        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{u.email}</div>
                                        {u.clubNom && (
                                            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>🏟️ {u.clubNom}</div>
                                        )}
                                    </div>
                                    <span style={{
                                        background: '#fffbeb', color: '#92400e',
                                        padding: '4px 10px', borderRadius: 6,
                                        fontSize: 11, fontWeight: 700,
                                        border: '1px solid #fde68a', whiteSpace: 'nowrap'
                                    }}>
                                        {ROLE_LABELS[u.role]?.label || u.role}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button
                                        onClick={() => handleApprove(u.id)}
                                        style={{
                                            flex: 1, background: '#166534', color: '#fff',
                                            border: 'none', padding: '10px', borderRadius: 8,
                                            fontWeight: 700, cursor: 'pointer', fontSize: 13
                                        }}
                                    >
                                        ✅ Accepter
                                    </button>
                                    <button
                                        onClick={() => handleReject(u.id)}
                                        style={{
                                            flex: 1, background: '#fff', color: '#991b1b',
                                            border: '1px solid #fecaca', padding: '10px',
                                            borderRadius: 8, fontWeight: 700,
                                            cursor: 'pointer', fontSize: 13
                                        }}
                                    >
                                        🚫 Rejeter
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>🔍</span>
                    <input
                        placeholder="Rechercher par nom ou email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 16px 10px 36px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, background: '#fff', outline: 'none' }}
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => setRole(e.target.value)}
                    style={{ padding: '10px 16px', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 14, background: '#fff', outline: 'none', cursor: 'pointer', minWidth: 160 }}
                >
                    <option value="">Tous les rôles</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="FEDERATION_ADMIN">Admin Fédération</option>
                    <option value="CLUB_ADMIN">Admin Club</option>
                    <option value="FAN">Fan</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>👤</div>
                        <p>Aucun utilisateur trouvé</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                            {['NOM', 'EMAIL', 'TÉLÉPHONE', 'RÔLE', 'STATUT', 'DATE', ''].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((u, idx) => {
                            const role   = ROLE_LABELS[u.role]    || { label: u.role, bg: '#f0f0f0', color: '#444' };
                            const status = STATUS_STYLES[u.statut] || STATUS_STYLES.INACTIVE;
                            return (
                                <tr key={u.id}
                                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f5f5f5' : 'none' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseOut={e => e.currentTarget.style.background = '#fff'}
                                >
                                    <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14, color: '#111' }}>{u.nom}</td>
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>{u.email}</td>
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#666' }}>{u.telephone || '—'}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ background: role.bg, color: role.color, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                                            {role.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}`, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#888' }}>{formatDate(u.dateCreation)}</td>
                                    <td style={{ padding: '14px 16px', position: 'relative' }} ref={menuOpen === u.id ? menuRef : null}>
                                        <button
                                            onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                                            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888', padding: '4px 8px', borderRadius: 6 }}
                                        >⋮</button>
                                        {menuOpen === u.id && (
                                            <div style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid #eee', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 190, overflow: 'hidden' }}>
                                                <button onClick={() => openMsgModal(u)}
                                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#333', textAlign: 'left' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                                                        onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                                    ✉️ Envoyer un message
                                                </button>
                                                {currentUser?.role === 'SUPER_ADMIN' && (
                                                    <button onClick={() => openStatusModal(u)}
                                                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#333', textAlign: 'left' }}
                                                            onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                                                            onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                                        🔄 Changer le statut
                                                    </button>
                                                )}
                                                {/* ✅ Approve/Reject depuis le menu aussi */}
                                                {u.statut === 'PENDING_APPROVAL' && (
                                                    <>
                                                        <div style={{ height: 1, background: '#f0f0f0', margin: '4px 0' }} />
                                                        <button onClick={() => { setMenuOpen(null); handleApprove(u.id); }}
                                                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#166534', textAlign: 'left' }}
                                                                onMouseOver={e => e.currentTarget.style.background = '#f0fdf4'}
                                                                onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                                            ✅ Approuver
                                                        </button>
                                                        <button onClick={() => { setMenuOpen(null); handleReject(u.id); }}
                                                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#991b1b', textAlign: 'left' }}
                                                                onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                                                                onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                                            🚫 Rejeter
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Modal Ajouter Utilisateur ── */}
            {addModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>👤 Ajouter un utilisateur</h3>

                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nom complet *</label>
                        <input value={addForm.nom} onChange={e => setAddForm({ ...addForm, nom: e.target.value })}
                               placeholder="Ahmed Ben Ali" style={inputStyle} />

                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email *</label>
                        <input type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                               placeholder="ahmed@club.tn" style={inputStyle} />

                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Téléphone</label>
                        <input value={addForm.telephone} onChange={e => setAddForm({ ...addForm, telephone: e.target.value })}
                               placeholder="+216 XX XXX XXX" style={inputStyle} />

                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Rôle *</label>
                        <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}
                                style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="">Sélectionner un rôle</option>
                            <option value="FEDERATION_ADMIN">Admin Fédération</option>
                            <option value="CLUB_ADMIN">Admin Club</option>
                            <option value="FAN">Fan</option>
                        </select>

                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Mot de passe *</label>
                        <input type="password" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })}
                               placeholder="Min. 6 caractères" style={{ ...inputStyle, marginBottom: 24 }} />

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setAddModal(false)}
                                    style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                                Annuler
                            </button>
                            <button onClick={submitAdd}
                                    disabled={addLoading || !addForm.nom || !addForm.email || !addForm.role || !addForm.password}
                                    style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#E63030', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: (!addForm.nom || !addForm.email || !addForm.role || !addForm.password) ? 0.6 : 1 }}>
                                {addLoading ? 'Création...' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Changer Statut ── */}
            {statusModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Changer le statut</h3>
                        <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
                            Utilisateur : <strong style={{ color: '#111' }}>{statusModal.nom}</strong>
                        </p>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Nouveau statut</label>
                        <select value={statusForm.statut} onChange={e => setStatusForm({ ...statusForm, statut: e.target.value })}
                                style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="ACTIVE">✅ ACTIVE</option>
                            <option value="INACTIVE">⚠️ INACTIVE</option>
                            <option value="SUSPENDED">🚫 SUSPENDED</option>
                            <option value="PENDING_APPROVAL">⏳ PENDING APPROVAL</option>
                        </select>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setStatusModal(null)}
                                    style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                                Annuler
                            </button>
                            <button onClick={submitStatus} disabled={statusLoading}
                                    style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#E63030', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                                {statusLoading ? 'Enregistrement...' : 'Confirmer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal Envoyer Message ── */}
            {msgModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '32px', width: 460, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>✉️ Envoyer un message</h3>
                        <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
                            À : <strong style={{ color: '#111' }}>{msgModal.nom}</strong>
                        </p>
                        {msgSuccess && (
                            <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px', marginBottom: 16, fontSize: 14 }}>
                                {msgSuccess}
                            </div>
                        )}
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Sujet</label>
                        <input value={msgForm.sujet} onChange={e => setMsgForm({ ...msgForm, sujet: e.target.value })}
                               placeholder="Objet du message..." style={inputStyle} />
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Contenu</label>
                        <textarea value={msgForm.contenu} onChange={e => setMsgForm({ ...msgForm, contenu: e.target.value })}
                                  placeholder="Écrire votre message..." rows={4}
                                  style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', marginBottom: 20 }} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setMsgModal(null)}
                                    style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                                Annuler
                            </button>
                            <button onClick={submitMsg}
                                    disabled={msgLoading || !msgForm.sujet || !msgForm.contenu}
                                    style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#E63030', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: (!msgForm.sujet || !msgForm.contenu) ? 0.6 : 1 }}>
                                {msgLoading ? 'Envoi...' : 'Envoyer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}