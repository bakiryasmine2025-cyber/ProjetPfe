import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const roles = [
    { value: 'SUPER_ADMIN',      label: '⚙ Super Admin' },
    { value: 'FEDERATION_ADMIN', label: 'Administrateur Fédération' },
    { value: 'CLUB_ADMIN',       label: 'Administrateur Club' },
    { value: 'FAN',              label: ' Fan de Rugby' },
];

export default function Register() {
    const navigate = useNavigate();


    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        role: '',
        password: ''
    });

    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm({...form, [e.target.name]: e.target.value});

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            
            await api.post('/auth/register', form);
            navigate('/verify-email', {state: {email: form.email}});
        } catch (err) {
            // Traite les erreurs de validation (400) ou autres
            setError(err.response?.data?.message || err.response?.data?.error || 'Erreur lors de la création du compte');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#E63030', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 18
                    }}>🏉
                    </div>
                    <span style={{fontWeight: 800, fontSize: 15, letterSpacing: 1}}>RUGBY TUNISIE</span>
                </div>

                <h1 className="auth-title">Créer un compte</h1>
                <p className="auth-subtitle">Rejoignez la plateforme de gestion sportive</p>

                {error && <div className="alert-error" style={{color: 'red', marginBottom: 10}}>{error}</div>}

                <form onSubmit={submit}>
                    {/* Nom + Prenom */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
                        <div className="input-group">
                            <label>Nom</label>
                            <input
                                name="nom"
                                placeholder="Ben Ali"
                                value={form.nom}
                                onChange={handle}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Prénom</label>
                            <input
                                name="prenom"
                                placeholder="Ahmed"
                                value={form.prenom}
                                onChange={handle}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Téléphone</label>
                        <input
                            name="telephone"
                            placeholder="+216 XX XXX XXX"
                            value={form.telephone}
                            onChange={handle}
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="ahmed@club.tn"
                            value={form.email}
                            onChange={handle}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Rôle</label>
                        <select name="role" value={form.role} onChange={handle} required>
                            <option value="">Sélectionner un rôle</option>
                            {roles.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Mot de passe</label>
                        <input
                            type={showPwd ? 'text' : 'password'}
                            name="password"
                            placeholder="Min. 6 caractères"
                            value={form.password}
                            onChange={handle}
                            required
                            minLength={6}
                        />
                        <button type="button" className="eye-icon" onClick={() => setShowPwd(!showPwd)}>
                            {showPwd ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <button type="submit" className="btn-rouge" disabled={loading} style={{width: '100%', padding: '10px', background: '#E63030', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                        {loading ? 'Création...' : 'Créer le compte'}
                    </button>
                </form>

                <p style={{textAlign: 'center', marginTop: 20, fontSize: 14, color: '#777'}}>
                    Déjà un compte ?{' '}
                    <Link to="/login" style={{color: '#E63030', fontWeight: 600, textDecoration: 'none'}}>
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}