import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --red: #c0392b;
    --red-dark: #96281b;
    --red-light: #e74c3c;
    --dark: #1a1a1a;
    --dark2: #232323;
    --dark3: #2d2d2d;
    --border: #e0e0e0;
    --bg: #f5f5f5;
    --white: #ffffff;
    --text-muted: #888;
    --text: #2d2d2d;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
  }

  .navbar-rugby {
    background: var(--dark);
    padding: 0 24px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid var(--red);
  }

  .navbar-brand-area {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #fff;
  }

  .navbar-brand-area .logo {
    width: 36px;
    height: 36px;
    background: var(--red);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    color: #fff;
    letter-spacing: 1px;
  }

  .navbar-brand-area .brand-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 2px;
    color: #fff;
  }

  .navbar-brand-area .separator {
    color: #555;
    font-size: 18px;
  }

  .navbar-brand-area .page-name {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ccc;
    font-size: 14px;
    font-weight: 500;
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn-nouveau {
    background: var(--red);
    color: #fff;
    border: none;
    padding: 8px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.18s;
  }

  .btn-nouveau:hover { background: var(--red-light); }

  .btn-retour {
    background: transparent;
    color: #fff;
    border: 1.5px solid #fff;
    padding: 7px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.18s, color 0.18s;
  }

  .btn-retour:hover { background: #fff; color: var(--dark); }

  .messagerie-layout {
    display: flex;
    height: calc(100vh - 58px);
  }

  .sidebar {
    width: 350px;
    min-width: 300px;
    background: var(--white);
    border-right: 1.5px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 20px;
    gap: 16px;
  }

  .sidebar-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 1.5px;
    color: var(--dark);
  }

  .sidebar-title svg { color: var(--red); }

  .badge-count {
    background: var(--dark);
    color: #fff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    margin-left: auto;
  }

  .search-box {
    position: relative;
  }

  .search-box input {
    width: 100%;
    padding: 9px 14px 9px 36px;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    background: #fafafa;
    color: var(--text);
    outline: none;
    transition: border 0.15s;
  }

  .search-box input:focus { border-color: var(--red); }

  .search-box .search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 14px;
  }

  .filter-tabs {
    display: flex;
    background: #f0f0f0;
    border-radius: 6px;
    padding: 3px;
    gap: 2px;
  }

  .filter-tab {
    flex: 1;
    padding: 6px 0;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s, color 0.15s;
    color: var(--text-muted);
  }

  .filter-tab.active {
    background: #fff;
    color: var(--dark);
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  .messages-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .message-item {
    padding: 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
    border: 1px solid transparent;
  }

  .message-item:hover {
    background: #f8f8f8;
    border-color: var(--border);
  }

  .message-item.unread {
    background: #fff0ef;
    border-left: 3px solid var(--red);
  }

  .message-item.unread .message-sujet {
    font-weight: 700;
    color: var(--red-dark);
  }

  .message-sujet {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .message-sender {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .message-date {
    font-size: 11px;
    color: var(--text-muted);
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--text-muted);
    font-size: 13px;
    text-align: center;
    padding: 40px 20px;
  }

  .empty-state svg { opacity: 0.35; }

  .main-content {
    flex: 1;
    padding: 32px 40px;
    position: relative;
    overflow-y: auto;
    background: #fafafa;
  }

  .message-detail {
    background: var(--white);
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    max-width: 800px;
    margin: 0 auto;
  }

  .message-detail-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--border);
  }

  .message-detail-sujet {
    font-size: 22px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 12px;
  }

  .message-detail-meta {
    display: flex;
    gap: 20px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .message-detail-contenu {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text);
    white-space: pre-wrap;
  }

  .placeholder-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 12px;
    color: var(--text-muted);
    font-size: 15px;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.18s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

  .modal-box {
    background: var(--white);
    border-radius: 10px;
    width: 680px;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    padding: 32px 36px 28px;
    position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    animation: slideUp 0.22s ease;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .modal-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 1.5px;
    color: var(--dark);
  }

  .modal-title svg { color: var(--red); }

  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 20px;
    line-height: 1;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.15s, background 0.15s;
  }

  .modal-close:hover { color: var(--dark); background: #f0f0f0; }

  .divider {
    height: 1.5px;
    background: var(--border);
    margin-bottom: 24px;
  }

  .form-section { margin-bottom: 22px; }

  .form-label-custom {
    font-size: 13px;
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 10px;
    display: block;
    letter-spacing: 0.3px;
  }

  .form-label-custom span {
    font-weight: 400;
    color: var(--text-muted);
  }

  .role-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .role-btn {
    padding: 8px 18px;
    border-radius: 6px;
    border: 1.5px solid var(--border);
    background: #fafafa;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    color: var(--text);
  }

  .role-btn:hover { border-color: var(--red); color: var(--red); }

  .role-btn.selected {
    background: #fff0ef;
    border-color: var(--red);
    color: var(--red);
    font-weight: 700;
  }

  .input-custom {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    background: #fafafa;
    color: var(--text);
    outline: none;
    transition: border 0.15s, box-shadow 0.15s;
  }

  .input-custom:focus {
    border-color: var(--red);
    box-shadow: 0 0 0 3px rgba(192,57,43,0.1);
    background: #fff;
  }

  .input-custom::placeholder { color: #bbb; }

  textarea.input-custom {
    resize: vertical;
    min-height: 120px;
  }

  .btn-envoyer {
    background: var(--red);
    color: #fff;
    border: none;
    padding: 11px 28px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.18s, transform 0.1s;
    letter-spacing: 0.3px;
    margin-top: 8px;
  }

  .btn-envoyer:hover { background: var(--red-light); transform: translateY(-1px); }
  .btn-envoyer:active { transform: translateY(0); }

  .btn-envoyer:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  .toast-success {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: #1e7e34;
    color: #fff;
    padding: 14px 22px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    animation: slideUp 0.2s ease;
    z-index: 200;
  }

  .error-toast {
    background: #c0392b;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const ROLES = [
    { label: "Fédération Admin", value: "FEDERATION_ADMIN", endpoint: "/to-federation" },
    { label: "Club Admin", value: "CLUB_ADMIN", endpoint: "/to-role/CLUB_ADMIN" },
    { label: "Fan", value: "FAN", endpoint: "/to-role/FAN" }
];

export default function Messagerie() {
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState("tous");
    const [selectedRole, setSelectedRole] = useState(ROLES[0]);
    const [form, setForm] = useState({ destinataireId: "", sujet: "", message: "" });
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", isError: false });
    const [errors, setErrors] = useState({});
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("token");

    // Récupérer le rôle depuis le backend si pas dans localStorage
    const fetchUserRole = async () => {
        try {
            const token = getToken();
            if (!token) return null;

            const response = await fetch("/api/users/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const profile = await response.json();
                const role = profile.role;
                localStorage.setItem("role", role);
                return role;
            }
        } catch (error) {
            console.error("Erreur récupération rôle:", error);
        }
        return null;
    };

    // Déterminer le rôle de l'utilisateur connecté
    useEffect(() => {
        const initRole = async () => {
            let role = localStorage.getItem("role");

            if (!role) {
                role = await fetchUserRole();
            }

            console.log("Rôle récupéré:", role);
            setUserRole(role);
            setLoading(false);
        };

        initRole();
    }, []);

    // Obtenir l'endpoint API selon le rôle
    const getMessagesEndpoint = () => {
        if (userRole === "FEDERATION_ADMIN") {
            return "/api/federation/messages";
        }
        return "/api/users/messages";
    };

    const getUnreadCountEndpoint = () => {
        if (userRole === "FEDERATION_ADMIN") {
            return "/api/federation/messages/unread-count";
        }
        return "/api/users/messages/unread-count";
    };

    const getMarkAsReadEndpoint = (id) => {
        if (userRole === "FEDERATION_ADMIN") {
            return `/api/federation/messages/${id}/read`;
        }
        return `/api/users/messages/${id}/read`;
    };

    // Charger les messages
    const loadMessages = async () => {
        if (!userRole) return;

        try {
            const response = await fetch(getMessagesEndpoint(), {
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Erreur chargement messages:", error);
        }
    };

    // Charger le nombre de messages non lus
    const loadUnreadCount = async () => {
        if (!userRole) return;

        try {
            const response = await fetch(getUnreadCountEndpoint(), {
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            if (response.ok) {
                const count = await response.json();
                setUnreadCount(count);
            }
        } catch (error) {
            console.error("Erreur chargement compteur:", error);
        }
    };

    // Marquer un message comme lu
    const markAsRead = async (messageId) => {
        try {
            await fetch(getMarkAsReadEndpoint(messageId), {
                method: "PUT",
                headers: { "Authorization": `Bearer ${getToken()}` }
            });
            await loadMessages();
            await loadUnreadCount();
        } catch (error) {
            console.error("Erreur marquage lu:", error);
        }
    };

    // Charger les données au démarrage
    useEffect(() => {
        if (userRole) {
            loadMessages();
            loadUnreadCount();
        }
    }, [userRole]);

    // Envoyer un message
    const handleEnvoyer = async (e) => {
        e.preventDefault();

        const e2 = {};
        if (!form.sujet.trim()) e2.sujet = "Le sujet est requis.";
        if (!form.message.trim()) e2.message = "Le message est requis.";

        if (Object.keys(e2).length > 0) {
            setErrors(e2);
            return;
        }

        setErrors({});
        setSending(true);

        try {
            let url = "";
            let body = {};

            // Si c'est SUPER_ADMIN
            if (userRole === "SUPER_ADMIN") {
                if (selectedRole.value === "FEDERATION_ADMIN") {
                    url = "/api/superadmin/messages/to-federation";
                    body = {
                        sujet: form.sujet,
                        contenu: form.message
                    };
                } else if (selectedRole.endpoint) {
                    url = `/api/superadmin/messages${selectedRole.endpoint}`;
                    body = {
                        sujet: form.sujet,
                        contenu: form.message
                    };
                } else {
                    url = "/api/superadmin/messages";
                    body = {
                        receiverId: form.destinataireId || null,
                        sujet: form.sujet,
                        contenu: form.message
                    };
                }
            }
            // Si c'est FEDERATION_ADMIN
            else if (userRole === "FEDERATION_ADMIN") {
                url = "/api/federation/messages";
                body = {
                    receiverId: form.destinataireId,
                    sujet: form.sujet,
                    contenu: form.message
                };
            }

            if (!url) {
                throw new Error("Action non autorisée");
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || "Erreur lors de l'envoi");
            }

            setShowModal(false);
            setForm({ destinataireId: "", sujet: "", message: "" });
            setToast({ show: true, message: "Message envoyé avec succès !", isError: false });
            setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);

        } catch (error) {
            console.error("Erreur envoi:", error);
            setToast({ show: true, message: error.message || "Erreur lors de l'envoi", isError: true });
            setTimeout(() => setToast({ show: false, message: "", isError: false }), 3000);
        } finally {
            setSending(false);
        }
    };

    // Ouvrir un message
    const handleOpenMessage = async (message) => {
        setSelectedMessage(message);
        if (!message.lu) {
            await markAsRead(message.id);
            setSelectedMessage({ ...message, lu: true });
        }
    };

    // Filtrer les messages
    const filteredMessages = messages.filter(msg => {
        const matchesFilter = activeFilter === "nonlus" ? !msg.lu : true;
        const matchesSearch = searchTerm === "" ||
            msg.sujet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.senderNom?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Vérifier si l'utilisateur peut envoyer des messages
    const canSendMessages = userRole === "SUPER_ADMIN" || userRole === "FEDERATION_ADMIN";

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid var(--red)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }}></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{styles}</style>

            <nav className="navbar-rugby">
                <div className="navbar-brand-area">
                    <div className="logo">RT</div>
                    <span className="brand-name">Rugby Tunisie</span>
                    <span className="separator">/</span>
                    <span className="page-name">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v13H4z"/><path d="M4 4l8 8 8-8"/></svg>
                        Messagerie
                    </span>
                </div>
                <div className="navbar-actions">
                    {/* Bouton Nouveau message - visible pour SUPER_ADMIN et FEDERATION_ADMIN */}
                    {canSendMessages && (
                        <button className="btn-nouveau" onClick={() => setShowModal(true)}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/><path d="M17.5 2.5a2.121 2.121 0 0 1 3 3L12 14l-4 1 1-4 7.5-7.5z"/></svg>
                            Nouveau message
                        </button>
                    )}
                    <button className="btn-retour" onClick={() => window.history.back()}>Retour</button>
                </div>
            </nav>

            <div className="messagerie-layout">
                <aside className="sidebar">
                    <div className="sidebar-title">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v13H4z"/><path d="M4 4l8 8 8-8"/></svg>
                        Boîte de réception
                        <span className="badge-count">{unreadCount}</span>
                    </div>

                    <div className="search-box">
                        <span className="search-icon">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Rechercher un message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-tabs">
                        <button className={`filter-tab ${activeFilter === "tous" ? "active" : ""}`} onClick={() => setActiveFilter("tous")}>
                            Tous ({messages.length})
                        </button>
                        <button className={`filter-tab ${activeFilter === "nonlus" ? "active" : ""}`} onClick={() => setActiveFilter("nonlus")}>
                            Non lus ({messages.filter(m => !m.lu).length})
                        </button>
                    </div>

                    {filteredMessages.length === 0 ? (
                        <div className="empty-state">
                            <svg width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16v13H4z"/><path d="M4 4l8 8 8-8"/></svg>
                            <div>Aucun message</div>
                            <small>Votre boîte de réception est vide</small>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {filteredMessages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`message-item ${!msg.lu ? "unread" : ""}`}
                                    onClick={() => handleOpenMessage(msg)}
                                >
                                    <div className="message-sujet">{msg.sujet || "Sans sujet"}</div>
                                    <div className="message-sender">De: {msg.senderNom || "Système"}</div>
                                    <div className="message-date">
                                        {msg.dateEnvoi ? new Date(msg.dateEnvoi).toLocaleString() : "Date inconnue"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </aside>

                <main className="main-content">
                    {selectedMessage ? (
                        <div className="message-detail">
                            <div className="message-detail-header">
                                <div className="message-detail-sujet">{selectedMessage.sujet}</div>
                                <div className="message-detail-meta">
                                    <span>De: {selectedMessage.senderNom || "Système"}</span>
                                    <span>
                                        {selectedMessage.dateEnvoi ? new Date(selectedMessage.dateEnvoi).toLocaleString() : "Date inconnue"}
                                    </span>
                                </div>
                            </div>
                            <div className="message-detail-contenu">
                                {selectedMessage.contenu}
                            </div>
                        </div>
                    ) : (
                        <div className="placeholder-text">
                            <svg width="64" height="64" fill="none" stroke="#ddd" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M4 4h16v13H4z"/><path d="M4 4l8 8 8-8"/></svg>
                            <span style={{ color: "#ccc", fontSize: 14 }}>Sélectionnez un message pour le lire</span>
                        </div>
                    )}
                </main>
            </div>

            {/* MODAL NOUVEAU MESSAGE */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <div className="modal-title">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/><path d="M17.5 2.5a2.121 2.121 0 0 1 3 3L12 14l-4 1 1-4 7.5-7.5z"/></svg>
                                Nouveau message
                            </div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className="divider" />

                        {/* Pour SUPER_ADMIN : choix du rôle */}
                        {userRole === "SUPER_ADMIN" && (
                            <div className="form-section">
                                <label className="form-label-custom">Envoyer à</label>
                                <div className="role-buttons">
                                    {ROLES.map(r => (
                                        <button
                                            key={r.value}
                                            className={`role-btn ${selectedRole.value === r.value ? "selected" : ""}`}
                                            onClick={() => setSelectedRole(r)}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pour FEDERATION_ADMIN : champ ID destinataire obligatoire */}
                        {userRole === "FEDERATION_ADMIN" && (
                            <div className="form-section">
                                <label className="form-label-custom">ID Destinataire <span style={{ color: "red" }}>*</span></label>
                                <input
                                    className={`input-custom ${errors.destinataireId ? "is-invalid" : ""}`}
                                    type="text"
                                    placeholder="ID de l'utilisateur destinataire"
                                    value={form.destinataireId}
                                    onChange={e => setForm(f => ({ ...f, destinataireId: e.target.value }))}
                                    style={errors.destinataireId ? { borderColor: "#c0392b" } : {}}
                                />
                                {errors.destinataireId && <small style={{ color: "#c0392b", fontSize: 12, marginTop: 4, display: "block" }}>{errors.destinataireId}</small>}
                            </div>
                        )}

                        {/* Pour SUPER_ADMIN avec rôle non-fédération : champ ID optionnel */}
                        {userRole === "SUPER_ADMIN" && selectedRole.value !== "FEDERATION_ADMIN" && (
                            <div className="form-section">
                                <label className="form-label-custom">ID Destinataire <span>(optionnel - laisse vide pour envoyer à tout le rôle)</span></label>
                                <input
                                    className="input-custom"
                                    type="text"
                                    placeholder="ID spécifique d'un utilisateur"
                                    value={form.destinataireId}
                                    onChange={e => setForm(f => ({ ...f, destinataireId: e.target.value }))}
                                />
                            </div>
                        )}

                        <div className="form-section">
                            <label className="form-label-custom">Sujet</label>
                            <input
                                className={`input-custom ${errors.sujet ? "is-invalid" : ""}`}
                                type="text"
                                placeholder="Objet du message"
                                value={form.sujet}
                                onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))}
                                style={errors.sujet ? { borderColor: "#c0392b" } : {}}
                            />
                            {errors.sujet && <small style={{ color: "#c0392b", fontSize: 12, marginTop: 4, display: "block" }}>{errors.sujet}</small>}
                        </div>

                        <div className="form-section">
                            <label className="form-label-custom">Message</label>
                            <textarea
                                className={`input-custom ${errors.message ? "is-invalid" : ""}`}
                                placeholder="Écrivez votre message ici..."
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                style={errors.message ? { borderColor: "#c0392b" } : {}}
                            />
                            {errors.message && <small style={{ color: "#c0392b", fontSize: 12, marginTop: 4, display: "block" }}>{errors.message}</small>}
                        </div>

                        <button className="btn-envoyer" onClick={handleEnvoyer} disabled={sending}>
                            {sending ? (
                                <>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                                    Envoi...
                                </>
                            ) : (
                                <>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
                                    Envoyer
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast.show && (
                <div className={`toast-success ${toast.isError ? "error-toast" : ""}`}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        {toast.isError ? (
                            <path d="M18 6L6 18M6 6l12 12"/>
                        ) : (
                            <path d="M20 6 9 17l-5-5"/>
                        )}
                    </svg>
                    {toast.message}
                </div>
            )}
        </>
    );
}