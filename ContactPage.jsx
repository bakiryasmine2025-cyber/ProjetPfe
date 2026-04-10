import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

export default function ContactPage() {
    const { token } = useAuth();

    const [form, setForm] = useState({
        name: "", email: "", phone: "", subject: "", message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        setError("");
        setIsSubmitting(true);
        try {
            await api.post("/public/contact", {
                nom:       form.name,
                email:     form.email,
                telephone: form.phone,
                sujet:     form.subject,
                message:   form.message
            });
            setSent(true);
        } catch (err) {
            setError(err.response?.data || "Erreur lors de l'envoi. Réessayez.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const infoCards = [
        { icon: "📍", title: "Adresse",   text: "Cité Nationale Sportive, Tunis 1003, Tunisie" },
        { icon: "📞", title: "Téléphone", text: "+216 71 123 456" },
        { icon: "✉️", title: "Email",     text: "contact@rugbytunisie.tn" },
        { icon: "🕐", title: "Horaires",  text: "Lun - Ven : 08h00 - 17h00" },
    ];

    const inputStyle = {
        width: "100%", padding: "10px 14px",
        border: "1.5px solid #dee2e6", borderRadius: 8,
        fontSize: 14, outline: "none", boxSizing: "border-box",
        transition: "border-color 0.2s", background: "#fff"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Inter', sans-serif" }}>

            {/* ── NAVBAR ── */}
            <header style={{
                background: "#1a1a2e", padding: "0 40px", height: 68,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 100,
                borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: "#E63030", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 18
                    }}>🏉</div>
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>
                        RUGBY TUNISIE
                    </span>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                    {[
                        { label: "Accueil",         to: "/" },
                        { label: "Fonctionnalités", to: "/#fonctionnalités" },
                        { label: "Statistiques",    to: "/#statistiques" },
                        { label: "Actualités",      to: "/#actualités" },
                        { label: "Contact",         to: "/contact" },
                    ].map(item => (
                        <Link key={item.label} to={item.to} style={{
                            color: item.label === "Contact" ? "#fff" : "#ccc",
                            textDecoration: "none", fontSize: 14,
                            fontWeight: item.label === "Contact" ? 700 : 500,
                            transition: "color 0.2s"
                        }}
                              onMouseOver={e => e.target.style.color = "#fff"}
                              onMouseOut={e => e.target.style.color = item.label === "Contact" ? "#fff" : "#ccc"}
                        >{item.label}</Link>
                    ))}
                    <Link to={token ? "/dashboard" : "/login"} style={{
                        background: "#E63030", color: "#fff",
                        padding: "9px 22px", borderRadius: 8,
                        textDecoration: "none", fontWeight: 700, fontSize: 14
                    }}>
                        {token ? "Tableau de bord" : "Se connecter"}
                    </Link>
                </div>
            </header>

            {/* ── HERO ── */}
            <div style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                padding: "60px 40px 48px", textAlign: "center"
            }}>
                <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900, marginBottom: 12 }}>
                    Contactez-nous
                </h1>
                <p style={{ color: "#bbb", fontSize: 16, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
                    Une question, une suggestion ou une demande ? L'équipe de la Fédération Tunisienne de Rugby est à votre écoute.
                </p>
            </div>

            {/* ── MAIN ── */}
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>

                    {/* Info Cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {infoCards.map(card => (
                            <div key={card.title} style={{
                                background: "#fff", borderRadius: 12,
                                border: "1px solid #eee", padding: "18px 20px",
                                display: "flex", alignItems: "flex-start", gap: 14,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                            }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: 10,
                                    background: "#fef2f2", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontSize: 20, flexShrink: 0
                                }}>{card.icon}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 4 }}>
                                        {card.title}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>
                                        {card.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Formulaire */}
                    <div style={{
                        background: "#fff", borderRadius: 16,
                        border: "1px solid #eee", padding: "32px 36px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
                    }}>
                        {sent ? (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                                <h3 style={{ fontWeight: 800, fontSize: 22, color: "#111", marginBottom: 8 }}>
                                    Message envoyé !
                                </h3>
                                <p style={{ color: "#666", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                                    Nous vous répondrons dans les plus brefs délais.
                                </p>
                                <button
                                    onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                                    style={{
                                        background: "#E63030", color: "#fff", border: "none",
                                        borderRadius: 10, padding: "12px 28px",
                                        fontWeight: 700, fontSize: 14, cursor: "pointer"
                                    }}
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ fontWeight: 800, fontSize: 20, color: "#111", marginBottom: 4 }}>
                                    Envoyer un message
                                </h3>
                                <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>
                                    Les champs marqués * sont obligatoires
                                </p>

                                {error && (
                                    <div style={{
                                        background: "#fef2f2", color: "#c0392b",
                                        border: "1px solid #fecaca", borderRadius: 8,
                                        padding: "10px 14px", marginBottom: 16, fontSize: 13
                                    }}>
                                        ⚠️ {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                        <div>
                                            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, color: "#333" }}>Nom complet *</label>
                                            <input name="name" value={form.name} onChange={handle} placeholder="Votre nom" style={inputStyle}
                                                   onFocus={e => e.target.style.borderColor = "#E63030"}
                                                   onBlur={e => e.target.style.borderColor = "#dee2e6"} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, color: "#333" }}>Email *</label>
                                            <input type="email" name="email" value={form.email} onChange={handle} placeholder="votre@email.com" style={inputStyle}
                                                   onFocus={e => e.target.style.borderColor = "#E63030"}
                                                   onBlur={e => e.target.style.borderColor = "#dee2e6"} />
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                        <div>
                                            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, color: "#333" }}>Téléphone</label>
                                            <input name="phone" value={form.phone} onChange={handle} placeholder="+216 XX XXX XXX" style={inputStyle}
                                                   onFocus={e => e.target.style.borderColor = "#E63030"}
                                                   onBlur={e => e.target.style.borderColor = "#dee2e6"} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, color: "#333" }}>Sujet *</label>
                                            <select name="subject" value={form.subject} onChange={handle}
                                                    style={{ ...inputStyle, cursor: "pointer" }}
                                                    onFocus={e => e.target.style.borderColor = "#E63030"}
                                                    onBlur={e => e.target.style.borderColor = "#dee2e6"}>
                                                <option value="">Choisir un sujet</option>
                                                <option value="info">Demande d'information</option>
                                                <option value="inscription">Inscription club</option>
                                                <option value="partenariat">Partenariat</option>
                                                <option value="presse">Presse & Médias</option>
                                                <option value="reclamation">Réclamation</option>
                                                <option value="autre">Autre</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 24 }}>
                                        <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, color: "#333" }}>Message *</label>
                                        <textarea name="message" value={form.message} onChange={handle}
                                                  placeholder="Écrivez votre message ici..." rows={5}
                                                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                                                  onFocus={e => e.target.style.borderColor = "#E63030"}
                                                  onBlur={e => e.target.style.borderColor = "#dee2e6"} />
                                    </div>

                                    <button type="submit" disabled={isSubmitting} style={{
                                        width: "100%", padding: "13px",
                                        background: isSubmitting ? "#f87171" : "#E63030",
                                        color: "#fff", border: "none", borderRadius: 10,
                                        fontWeight: 700, fontSize: 15, cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                    }}>
                                        {isSubmitting ? "Envoi en cours..." : <><span>📬</span> Envoyer le message</>}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* Map placeholder */}
                <div style={{
                    marginTop: 32, background: "#fff", borderRadius: 16,
                    border: "1px solid #eee", height: 220,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                    <span style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>📍</span>
                    <p style={{ fontWeight: 700, color: "#555", marginBottom: 4 }}>
                        Cité Nationale Sportive, Tunis
                    </p>
                    <p style={{ fontSize: 13, color: "#aaa" }}>
                        Carte interactive (intégration Google Maps à venir)
                    </p>
                </div>
            </div>
        </div>
    );
}