import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function ResetPassword() {
    const { state } = useLocation();
    const navigate  = useNavigate();
    const email     = state?.email || '';

    const [form, setForm]       = useState({ code: '', newPassword: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, ...form });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Code invalide ou expiré');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: 420 }}>
                <div className="auth-logo">
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#E63030', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 18
                    }}>🏉</div>
                    <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>RUGBY TUNISIE</span>
                </div>

                <h1 className="auth-title">Nouveau mot de passe</h1>
                <p className="auth-subtitle">
                    Entrez le code reçu sur <strong>{email}</strong>
                </p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={submit}>
                    <div className="input-group">
                        <label>Code de vérification</label>
                        <input
                            name="code"
                            placeholder="123456"
                            value={form.code}
                            onChange={handle}
                            maxLength={6}
                            style={{ textAlign: 'center', letterSpacing: 8, fontSize: 20 }}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Nouveau mot de passe</label>
                        <span className="input-icon">🔒</span>
                        <input
                            type={showPwd ? 'text' : 'password'}
                            name="newPassword"
                            placeholder="Min. 6 caractères"
                            value={form.newPassword}
                            onChange={handle}
                            required
                            minLength={6}
                        />
                        <button type="button" className="eye-icon" onClick={() => setShowPwd(!showPwd)}>
                            {showPwd ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <button type="submit" className="btn-rouge" disabled={loading}>
                        {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
}