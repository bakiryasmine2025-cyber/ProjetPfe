import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterClubAdmin() {
    const navigate = useNavigate();
    const [showPwd, setShowPwd] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        telephone: "",
        nomClub: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch(
                "http://localhost:8080/api/auth/register/club-admin",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nom: form.nom,
                        prenom: form.prenom,
                        email: form.email,
                        password: form.password,
                        telephone: form.telephone,
                        nomClub: form.nomClub,
                        // ✅ role supprimé — le backend le force à CLUB_ADMIN automatiquement
                    })
                }
            );

            const data = await res.json().catch(() => ({ message: "Erreur serveur" }));

            if (res.ok) {
                setMessage("success");
                setTimeout(() => navigate("/login"), 2500);
            } else {
                setMessage(data.message || "Erreur lors de l'inscription.");
            }
        } catch {
            setMessage("Erreur serveur. Veuillez réessayer.");
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
                    <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>
                        RUGBY TUNISIE
                    </span>
                </div>

                {/* Badge rôle */}
                <div style={{
                    display: "inline-flex", alignItems: "center",
                    background: "rgba(17,17,17,0.06)", border: "1px solid rgba(17,17,17,0.15)",
                    borderRadius: 999, padding: "6px 14px", fontSize: 13,
                    color: "#111", fontWeight: 600, marginBottom: 12
                }}>
                    Administrateur Club
                </div>

                <h1 className="auth-title">Créer un compte</h1>
                <p className="auth-subtitle">
                    Votre demande sera examinée par l'Admin Fédération avant activation
                </p>

                {message === "success" && (
                    <div className="alert-success-custom">
                        ✅ Demande envoyée ! En attente de validation par la Fédération.
                    </div>
                )}
                {message && message !== "success" && (
                    <div className="alert-error">❌ {message}</div>
                )}

                <form onSubmit={handleSubmit}>

                    <p style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: 1,
                        color: "#999", textTransform: "uppercase", marginBottom: 10
                    }}>
                        Informations personnelles
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div className="input-group">
                            <label>Nom <span style={{ color: "#E63030" }}>*</span></label>
                            <input
                                name="nom" placeholder="Ben Ali"
                                value={form.nom} onChange={handleChange} required
                            />
                        </div>
                        <div className="input-group">
                            <label>Prénom <span style={{ color: "#E63030" }}>*</span></label>
                            <input
                                name="prenom" placeholder="Ahmed"
                                value={form.prenom} onChange={handleChange} required
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div className="input-group">
                            <label>Email <span style={{ color: "#E63030" }}>*</span></label>
                            <input
                                type="email" name="email" placeholder="ahmed@club.tn"
                                value={form.email} onChange={handleChange} required
                            />
                        </div>
                        <div className="input-group">
                            <label>Téléphone</label>
                            <input
                                name="telephone" placeholder="+216 XX XXX XXX"
                                value={form.telephone} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Mot de passe <span style={{ color: "#E63030" }}>*</span></label>
                        <input
                            type={showPwd ? "text" : "password"}
                            name="password" placeholder="Min. 6 caractères"
                            value={form.password} onChange={handleChange}
                            required minLength={6}
                        />
                        <button
                            type="button"
                            className="eye-icon"
                            onClick={() => setShowPwd(!showPwd)}
                        >
                            {showPwd ? "🙈" : "👁️"}
                        </button>
                    </div>

                    <p style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: 1,
                        color: "#999", textTransform: "uppercase", margin: "20px 0 10px"
                    }}>
                        Club
                    </p>

                    <div className="input-group">
                        <label>Nom du club <span style={{ color: "#E63030" }}>*</span></label>
                        <input
                            name="nomClub" placeholder="Ex: Club Rugby Bizerte"
                            value={form.nomClub} onChange={handleChange} required
                        />
                    </div>

                    <div style={{
                        background: "#fffbeb", border: "1px solid #fde68a",
                        borderRadius: 10, padding: "12px 16px",
                        display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20
                    }}>
                        <span style={{ fontSize: 16 }}>⏳</span>
                        <p style={{ fontSize: 12, color: "#92400e", margin: 0, lineHeight: 1.5 }}>
                            Votre demande sera en attente de validation par l'Administrateur Fédération.
                            Vous recevrez une notification par email une fois votre compte activé.
                        </p>
                    </div>

                    <button type="submit" className="btn-rouge" disabled={loading}>
                        {loading ? "Envoi en cours..." : "Soumettre la demande"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#777" }}>
                    Déjà un compte ?{" "}
                    <Link to="/login" style={{ color: "#E63030", fontWeight: 600, textDecoration: "none" }}>
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}