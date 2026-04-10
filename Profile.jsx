import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

const ROLE_LABELS = {
    SUPER_ADMIN:      'Super Admin',
    FEDERATION_ADMIN: 'Admin Fédération',
    CLUB_ADMIN:       'Admin Club',
    FAN:              'Fan',
};

export default function Profile() {
    const { user } = useAuth();
    const [tab, setTab]         = useState('info'); // 'info' | 'password'
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Info form
    const [infoForm, setInfoForm]   = useState({ nom: '', telephone: '' });
    const [infoSaving, setInfoSaving] = useState(false);
    const [infoSuccess, setInfoSuccess] = useState('');
    const [infoError, setInfoError]   = useState('');

    // Password form
    const [pwdForm, setPwdForm]     = useState({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' });
    const [pwdSaving, setPwdSaving] = useState(false);
    const [pwdSuccess, setPwdSuccess] = useState('');
    const [pwdError, setPwdError]   = useState('');

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setProfile(res.data);
            setInfoForm({ nom: res.data.nom || '', telephone: res.data.telephone || '' });
        } catch { }
        finally { setLoading(false); }
    };

    const saveInfo = async () => {
        setInfoSaving(true); setInfoError(''); setInfoSuccess('');
        try {
            await api.put('/users/profile', infoForm);
            setInfoSuccess('Informations mises à jour !');
            fetchProfile();
            setTimeout(() => setInfoSuccess(''), 3000);
        } catch (err) {
            setInfoError(err.response?.data?.message || 'Erreur mise à jour');
        } finally { setInfoSaving(false); }
    };

    const savePassword = async () => {
        setPwdSaving(true); setPwdError(''); setPwdSuccess('');
        if (pwdForm.nouveauMotDePasse !== pwdForm.confirmation) {
            setPwdError('Les mots de passe ne correspondent pas');
            setPwdSaving(false); return;
        }
        try {
            await api.put('/users/profile/password', pwdForm);
            setPwdSuccess('Mot de passe modifié avec succès !');
            setPwdForm({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' });
            setTimeout(() => setPwdSuccess(''), 3000);
        } catch (err) {
            setPwdError(err.response?.data?.message || 'Erreur changement mot de passe');
        } finally { setPwdSaving(false); }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chargement...</div>;

    const initiale = (profile?.nom || user?.nom || 'U').charAt(0).toUpperCase();

    const inputStyle = {
        width: '100%', padding: '14px 16px',
        border: '1.5px solid #e5e7eb', borderRadius: 10,
        fontSize: 15, outline: 'none', background: '#f9fafb',
        color: '#111', fontFamily: 'inherit'
    };

    return (
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E63030', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏉</div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>Mon Profil</h1>
            </div>

            {/* Avatar Card */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '24px 28px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: '#E63030', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 800
                }}>{initiale}</div>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 4 }}>
                        {profile?.nom || 'Utilisateur'}
                    </h2>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ background: '#fef2f2', color: '#E63030', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                            {ROLE_LABELS[profile?.role || user?.role] || user?.role}
                        </span>
                        <span style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                            {profile?.statut || 'ACTIVE'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ background: '#f3f4f6', borderRadius: 12, padding: 4, display: 'flex', marginBottom: 16 }}>
                {[
                    { key: 'info', icon: '👤', label: 'Informations' },
                    { key: 'password', icon: '🔒', label: 'Mot de passe' },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        flex: 1, padding: '11px', borderRadius: 9, border: 'none',
                        background: tab === t.key ? '#fff' : 'transparent',
                        fontWeight: 600, fontSize: 14, cursor: 'pointer',
                        color: tab === t.key ? '#111' : '#888',
                        boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 0.15s'
                    }}>
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            {/* Info Tab */}
            {tab === 'info' && (
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '28px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 4 }}>Modifier mes informations</h3>
                    <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 28 }}>Mettez à jour votre nom et numéro de téléphone</p>

                    {infoSuccess && (
                        <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                            ✅ {infoSuccess}
                        </div>
                    )}
                    {infoError && (
                        <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                            ❌ {infoError}
                        </div>
                    )}

                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ color: '#6b7280' }}>👤</span>
                            <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Nom complet</label>
                        </div>
                        <input value={infoForm.nom} onChange={e => setInfoForm({ ...infoForm, nom: e.target.value })}
                               placeholder="Votre nom" style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ color: '#6b7280' }}>📞</span>
                            <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Téléphone</label>
                        </div>
                        <input value={infoForm.telephone} onChange={e => setInfoForm({ ...infoForm, telephone: e.target.value })}
                               placeholder="+216 XX XXX XXX" style={inputStyle} />
                    </div>

                    <button onClick={saveInfo} disabled={infoSaving} style={{
                        width: '100%', padding: '14px', borderRadius: 10,
                        background: '#E63030', color: '#fff', border: 'none',
                        fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}>
                        💾 {infoSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            )}

            {/* Password Tab */}
            {tab === 'password' && (
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #eee', padding: '28px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 4 }}>Changer le mot de passe</h3>
                    <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 28 }}>Saisissez votre ancien et nouveau mot de passe</p>

                    {pwdSuccess && (
                        <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                            ✅ {pwdSuccess}
                        </div>
                    )}
                    {pwdError && (
                        <div style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                            ❌ {pwdError}
                        </div>
                    )}

                    {[
                        { label: 'Mot de passe actuel', key: 'ancienMotDePasse' },
                        { label: 'Nouveau mot de passe', key: 'nouveauMotDePasse' },
                        { label: 'Confirmer le mot de passe', key: 'confirmation' },
                    ].map(f => (
                        <div key={f.key} style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 14, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>{f.label}</label>
                            <input type="password" value={pwdForm[f.key]}
                                   onChange={e => setPwdForm({ ...pwdForm, [f.key]: e.target.value })}
                                   style={inputStyle} />
                        </div>
                    ))}

                    <button onClick={savePassword} disabled={pwdSaving} style={{
                        width: '100%', padding: '14px', borderRadius: 10,
                        background: '#E63030', color: '#fff', border: 'none',
                        fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        marginTop: 8
                    }}>
                        🔒 {pwdSaving ? 'Modification...' : 'Changer le mot de passe'}
                    </button>
                </div>
            )}
        </div>
    );
}