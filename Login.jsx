import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function Login() {
    const { login } = useAuth();
    const [form, setForm]       = useState({ email: '', password: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', form);
            login(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex'
        }}>
            {/* ── Left Panel ── */}
            <div style={{
                width: '50%', background: '#0D0D0D',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', padding: '40px',
                position: 'relative', overflow: 'hidden'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#E63030', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 18
                    }}>🏉</div>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>
            RUGBY TUNISIE
          </span>
                </div>

                {/* Center text */}
                <div>
                    <h2 style={{
                        color: '#fff', fontSize: 42,
                        fontWeight: 900, lineHeight: 1.1, marginBottom: 16
                    }}>
                        Plateforme de<br />
                        <span style={{ color: '#E63030' }}>Gestion Sportive</span>
                    </h2>
                    <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, maxWidth: 340 }}>
                        Gérez vos clubs, joueurs, matchs et arbitres depuis une interface centralisée et performante.
                    </p>
                </div>

                <div style={{ color: '#444', fontSize: 13 }}>
                    © 2026 Fédération Tunisienne de Rugby
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div style={{
                width: '50%', background: '#f5f5f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px'
            }}>
                <div style={{
                    background: '#fff', borderRadius: 16,
                    padding: '44px 40px', width: '100%', maxWidth: 440,
                    boxShadow: '0 2px 20px rgba(0,0,0,0.07)'
                }}>
                    <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Connexion</h1>
                    <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
                        Accédez à votre espace de gestion
                    </p>

                    {error && <div className="alert-error">{error}</div>}

                    <form onSubmit={submit}>
                        {/* Email */}
                        <div className="input-group">
                            <label>Email</label>
                            <span className="input-icon">✉</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@rugbytunisie.tn"
                                value={form.email}
                                onChange={handle}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label>Mot de passe</label>
                            <span className="input-icon"></span>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handle}
                                required
                            />
                            <button
                                type="button"
                                className="eye-icon"
                                onClick={() => setShowPwd(!showPwd)}
                            >
                                {showPwd ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {/* Remember + Forgot */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 22
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#555' }}>
                                <input type="checkbox" /> Se souvenir de moi
                            </label>
                            <Link to="/forgot-password" style={{ color: '#E63030', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        <button type="submit" className="btn-rouge" disabled={loading}>
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#777' }}>
                        Pas encore de compte ?{' '}
                        <Link to="/register" style={{ color: '#E63030', fontWeight: 600, textDecoration: 'none' }}>
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}