import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterFederationAdmin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nom: "", email: "", password: "", telephone: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:8080/api/auth/register/federation-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.text();
            if (res.ok) {
                setMessage("success");
                setTimeout(() => navigate("/verify-email", { state: { email: form.email } }), 2000);
            } else {
                setMessage(data);
            }
        } catch {
            setMessage("Erreur serveur");
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "#E63030", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 18
                    }}>🏉</div>
                    <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>RUGBY TUNISIE</span>
                </div>

                {/* Badge rôle */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(230,48,48,0.08)", border: "1px solid rgba(230,48,48,0.25)",
                    borderRadius: 999, padding: "6px 14px", fontSize: 13,
                    color: "#E63030", fontWeight: 600, marginBottom: 12
                }}>
                    🏛️ Administrateur Fédération
                </div>

                <h1 className="auth-title">Créer un compte</h1>
                <p className="auth-subtitle">Votre compte sera activé après validation par le Super Administrateur</p>

                {/* Messages */}
                {message === "success" && (
                    <div className="alert-success-custom">
                        ✅ Inscription réussie ! Vérifiez votre email.
                    </div>
                )}
                {message && message !== "success" && (
                    <div className="alert-error">{message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div className="input-group">
                            <label>Nom complet</label>
                            <span className="input-icon">👤</span>
                            <input
                                name="nom" placeholder="Ahmed Ben Ali"
                                value={form.nom} onChange={handleChange} required
                            />
                        </div>
                        <div className="input-group">
                            <label>Téléphone</label>
                            <span className="input-icon">📞</span>
                            <input
                                name="telephone" placeholder="+216 XX XXX XXX"
                                value={form.telephone} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <span className="input-icon">✉️</span>
                        <input
                            type="email" name="email" placeholder="ahmed@federation.tn"
                            value={form.email} onChange={handleChange} required
                        />
                    </div>

                    <div className="input-group">
                        <label>Mot de passe</label>
                        <span className="input-icon">🔒</span>
                        <input
                            type={showPwd ? "text" : "password"}
                            name="password" placeholder="Min. 6 caractères"
                            value={form.password} onChange={handleChange}
                            required minLength={6}
                        />
                        <button type="button" className="eye-icon" onClick={() => setShowPwd(!showPwd)}>
                            {showPwd ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {/* Info box */}
                    <div style={{
                        background: "#fffbeb", border: "1px solid #fde68a",
                        borderRadius: 10, padding: "12px 16px",
                        display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20
                    }}>
                        <span style={{ fontSize: 16 }}>ℹ️</span>
                        <p style={{ fontSize: 12, color: "#92400e", margin: 0, lineHeight: 1.5 }}>
                            Votre compte sera en attente d'activation par le Super Administrateur après inscription.
                        </p>
                    </div>

                    <button type="submit" className="btn-rouge" disabled={loading}>
                        {loading ? "Création..." : "Créer le compte"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#777" }}>
                    Mauvais type de compte ?{" "}
                    <Link to="/register/club" style={{ color: "#E63030", fontWeight: 600, textDecoration: "none" }}>
                        S'inscrire comme Admin Club
                    </Link>
                </p>
                <p style={{ textAlign: "center", marginTop: 8, fontSize: 13, color: "#777" }}>
                    Déjà un compte ?{" "}
                    <Link to="/login" style={{ color: "#E63030", fontWeight: 600, textDecoration: "none" }}>
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}