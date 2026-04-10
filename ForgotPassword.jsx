import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function ForgotPassword() {
    const navigate    = useNavigate();
    const [email, setEmail]   = useState('');
    const [error, setError]   = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.error || 'Email introuvable');
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

                <h1 className="auth-title">Mot de passe oublié</h1>
                <p className="auth-subtitle">
                    Entrez votre email pour recevoir un code de réinitialisation.
                </p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={submit}>
                    <div className="input-group">
                        <label>Email</label>
                        <span className="input-icon">✉️</span>
                        <input
                            type="email"
                            placeholder="admin@rugbytunisie.tn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-rouge" disabled={loading}>
                        {loading ? 'Envoi...' : 'Envoyer le code'}
                    </button>
                </form>

                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <Link to="/login" style={{
                        color: '#E63030', fontSize: 14,
                        fontWeight: 600, textDecoration: 'none'
                    }}>
                        ← Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}