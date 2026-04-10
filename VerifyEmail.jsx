import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function VerifyEmail() {
    const { state } = useLocation();
    const navigate  = useNavigate();
    const email     = state?.email || '';

    const [code, setCode]         = useState('');
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState('');
    const [loading, setLoading]   = useState(false);
    const [resending, setResending] = useState(false);

    // ✅ Vérifier le code
    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/verify-email', { email, code });
            setSuccess('Email vérifié ! Redirection...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Code invalide');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Renvoyer le code
    const resend = async () => {
        setError('');
        setSuccess('');
        setResending(true);
        try {
            await api.post(`/auth/resend-code?email=${email}`);
            setSuccess('Nouveau code envoyé !');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors du renvoi');
        } finally {
            setResending(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex' }}>

            {/* LEFT */}
            <div style={{
                width: '50%', background: '#0D0D0D', padding: '40px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#E63030', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 18
                    }}>🏉</div>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>RUGBY TUNISIE</span>
                </div>

                <div>
                    <h2 style={{ color: '#fff', fontSize: 42, fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
                        Vérifiez votre<br />
                        <span style={{ color: '#E63030' }}>adresse email</span>
                    </h2>
                    <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, maxWidth: 340 }}>
                        Un code à 6 chiffres a été envoyé à votre adresse email. Saisissez-le pour activer votre compte.
                    </p>
                </div>

                <div style={{ color: '#444', fontSize: 13 }}>© 2026 Fédération Tunisienne de Rugby</div>
            </div>

            {/* RIGHT */}
            <div style={{
                width: '50%', background: '#f5f5f5',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '40px'
            }}>
                <div style={{
                    background: '#fff', borderRadius: 16,
                    padding: '44px 40px', width: '100%', maxWidth: 440,
                    boxShadow: '0 2px 20px rgba(0,0,0,0.07)'
                }}>
                    <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
                        Entrez votre code
                    </h1>
                    <p style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
                        Code envoyé à <strong style={{ color: '#111' }}>{email}</strong>
                    </p>

                    {error   && <div className="alert-error">{error}</div>}
                    {success && (
                        <div style={{
                            background: '#f0fdf4', color: '#166534',
                            border: '1px solid #bbf7d0', borderRadius: 10,
                            padding: '12px 16px', fontSize: 14, marginBottom: 16
                        }}>{success}</div>
                    )}

                    <form onSubmit={submit}>
                        <div className="input-group">
                            <label>Code de vérification</label>
                            <input
                                type="text"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
                                required
                                style={{ letterSpacing: 8, fontSize: 22, textAlign: 'center' }}
                            />
                        </div>

                        <button type="submit" className="btn-rouge" disabled={loading}>
                            {loading ? 'Vérification...' : 'Vérifier mon email'}
                        </button>
                    </form>

                    <button
                        onClick={resend}
                        disabled={resending}
                        style={{
                            width: '100%', marginTop: 12,
                            background: '#fff', color: '#E63030',
                            border: '1.5px solid #E63030', borderRadius: 10,
                            padding: '13px', fontSize: 15, fontWeight: 700,
                            cursor: resending ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {resending ? 'Envoi...' : '🔄 Renvoyer le code'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#777' }}>
                        <Link to="/register" style={{ color: '#E63030', fontWeight: 600, textDecoration: 'none' }}>
                            ← Retour à l'inscription
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}