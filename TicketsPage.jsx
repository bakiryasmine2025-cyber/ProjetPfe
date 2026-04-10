import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  :root {
    --red: #c0392b; --red2: #e74c3c;
    --dark: #1a1a1a; --bg: #f2f2f0;
    --white: #ffffff; --border: #e2e2e0; --muted: #888;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); }

  .nav-rt { background: var(--white); border-bottom: 1.5px solid var(--border); padding: 0 32px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .nav-brand { display: flex; align-items: center; gap: 10px; font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 2px; color: var(--dark); }
  .nav-logo { width: 32px; height: 32px; background: var(--red); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-family: 'Bebas Neue', sans-serif; }
  .btn-connect { background: var(--red); color: #fff; border: none; padding: 8px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; border-radius: 4px; cursor: pointer; }
  .btn-connect:hover { background: var(--red2); }

  .page-wrap { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; gap: 16px; }
  .page-title { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 1px; color: var(--dark); display: flex; align-items: center; gap: 12px; }
  .page-sub { color: var(--muted); font-size: 14px; margin-top: 4px; }

  .btn-pay-top { background: var(--red); color: #fff; border: none; padding: 12px 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background .15s, transform .1s; white-space: nowrap; flex-shrink: 0; }
  .btn-pay-top:hover { background: var(--red2); transform: translateY(-1px); }
  .btn-pay-top:disabled { background: #ccc; cursor: not-allowed; transform: none; }

  .match-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
  .match-badge { display: inline-flex; align-items: center; gap: 6px; border: 1.5px solid var(--red); color: var(--red); font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 14px; }
  .match-info { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
  .team-logo { width: 44px; height: 44px; border-radius: 8px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; border: 1px solid var(--border); }
  .match-title { font-size: 22px; font-weight: 700; color: var(--dark); }
  .match-title .vs { color: var(--muted); font-weight: 400; font-size: 18px; margin: 0 8px; }
  .match-title .team2 { color: var(--red); }
  .match-meta { display: flex; gap: 20px; color: var(--muted); font-size: 13px; margin-bottom: 20px; flex-wrap: wrap; }
  .match-meta span { display: flex; align-items: center; gap: 5px; }
  .divider { height: 1px; background: var(--border); margin-bottom: 20px; }

  .categories { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
  .cat-card { border: 1.5px solid var(--border); border-radius: 10px; padding: 18px 16px; text-align: center; transition: border-color .15s; }
  .cat-card:hover { border-color: #ccc; }
  .cat-name { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: var(--muted); text-transform: uppercase; margin-bottom: 10px; }
  .cat-price { font-size: 24px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
  .cat-places { display: flex; align-items: center; justify-content: center; gap: 5px; color: var(--muted); font-size: 13px; margin-bottom: 14px; }
  .qty-ctrl { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 12px; }
  .qty-btn { width: 28px; height: 28px; border: 1.5px solid var(--border); border-radius: 50%; background: var(--white); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: var(--dark); transition: border-color .15s; }
  .qty-btn:hover { border-color: var(--red); }
  .qty-val { font-size: 15px; font-weight: 600; min-width: 20px; text-align: center; }
  .btn-reserver { width: 100%; background: var(--red); color: #fff; border: none; padding: 9px 0; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transition: background .15s; }
  .btn-reserver:hover { background: var(--red2); }

  /* OVERLAY */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.52); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .18s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* PAYMENT MODAL */
  .pay-modal { background: var(--white); border-radius: 14px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 32px 28px; animation: slideUp .22s ease; box-shadow: 0 24px 64px rgba(0,0,0,0.22); }
  .pay-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .pay-modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; color: var(--dark); }
  .modal-close { background: none; border: none; font-size: 20px; color: var(--muted); cursor: pointer; line-height: 1; padding: 4px 8px; border-radius: 4px; }
  .modal-close:hover { color: var(--dark); background: #f0f0f0; }

  .order-summary { background: #fafafa; border: 1.5px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 22px; }
  .order-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .order-item:last-of-type { border-bottom: none; }
  .order-item-name { font-size: 14px; font-weight: 500; color: var(--dark); }
  .order-item-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .order-item-price { font-size: 14px; font-weight: 600; color: var(--dark); white-space: nowrap; }
  .order-total { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; margin-top: 4px; border-top: 1.5px solid var(--border); }
  .order-total-label { font-size: 15px; font-weight: 700; }
  .order-total-price { font-size: 18px; font-weight: 700; color: var(--red); }

  /* PAYMENT METHOD SELECTOR */
  .method-label { font-size: 13px; font-weight: 600; color: var(--dark); margin-bottom: 10px; display: block; }
  .method-options { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 22px; }
  .method-opt { border: 2px solid var(--border); border-radius: 10px; padding: 14px 10px; text-align: center; cursor: pointer; transition: border-color .15s, background .15s; background: #fafafa; }
  .method-opt:hover { border-color: #ccc; background: #fff; }
  .method-opt.active { border-color: var(--red); background: #fff5f5; }
  .method-opt-icon { font-size: 24px; margin-bottom: 6px; }
  .method-opt-name { font-size: 12px; font-weight: 600; color: var(--dark); }
  .method-opt-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* FORM FIELDS */
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 13px; font-weight: 600; color: var(--dark); margin-bottom: 7px; display: block; }
  .form-input { width: 100%; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif; background: #fafafa; color: var(--dark); outline: none; transition: border .15s; }
  .form-input:focus { border-color: var(--red); background: #fff; }
  .form-input::placeholder { color: #bbb; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* EDINAR SPECIFIC */
  .edinar-badge { display: inline-flex; align-items: center; gap: 6px; background: #e8f5e9; color: #2e7d32; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; margin-bottom: 16px; }
  .edinar-info { background: #f0f7ff; border: 1.5px solid #b3d4f5; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 13px; color: #1565c0; line-height: 1.6; }

  /* MOBILE SPECIFIC */
  .mobile-operators { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 16px; }
  .op-btn { border: 2px solid var(--border); border-radius: 8px; padding: 10px 6px; text-align: center; cursor: pointer; transition: border-color .15s, background .15s; background: #fafafa; font-size: 12px; font-weight: 600; color: var(--dark); }
  .op-btn:hover { border-color: #ccc; background: #fff; }
  .op-btn.active { border-color: var(--red); background: #fff5f5; color: var(--red); }
  .op-emoji { font-size: 20px; display: block; margin-bottom: 4px; }

  /* CONFIRM BUTTON */
  .btn-confirm { width: 100%; background: var(--red); color: #fff; border: none; padding: 13px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; border-radius: 8px; cursor: pointer; margin-top: 8px; transition: background .15s, transform .1s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-confirm:hover { background: var(--red2); transform: translateY(-1px); }
  .btn-confirm:disabled { background: #ccc; cursor: not-allowed; transform: none; }

  /* QR MODAL */
  .qr-modal { background: var(--white); border-radius: 14px; width: 100%; max-width: 420px; padding: 36px 28px; text-align: center; animation: slideUp .22s ease; box-shadow: 0 24px 64px rgba(0,0,0,0.22); }
  .qr-success-icon { width: 60px; height: 60px; background: #e8f5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px; }
  .qr-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 1px; color: var(--dark); margin-bottom: 6px; }
  .qr-sub { color: var(--muted); font-size: 14px; margin-bottom: 24px; }
  .qr-box { background: #fff; border: 2px solid var(--border); border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 16px; }
  .qr-grid { display: grid; grid-template-columns: repeat(19, 14px); grid-template-rows: repeat(19, 14px); gap: 1.5px; }
  .qr-cell { width: 14px; height: 14px; border-radius: 1.5px; }
  .qr-cell.b { background: var(--dark); }
  .qr-cell.w { background: #fff; }
  .qr-code-text { font-family: monospace; font-size: 11px; color: var(--muted); background: #f5f5f5; padding: 6px 12px; border-radius: 6px; margin-bottom: 16px; word-break: break-all; }
  .qr-ticket-info { background: #fafafa; border: 1.5px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; text-align: left; }
  .qr-ticket-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
  .qr-ticket-row span:first-child { color: var(--muted); }
  .qr-ticket-row span:last-child { font-weight: 600; color: var(--dark); }
  .btn-download { width: 100%; background: var(--dark); color: #fff; border: none; padding: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px; transition: background .15s; }
  .btn-download:hover { background: #333; }
  .btn-close-qr { width: 100%; background: transparent; color: var(--muted); border: 1.5px solid var(--border); padding: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; border-radius: 8px; cursor: pointer; transition: border-color .15s, color .15s; }
  .btn-close-qr:hover { border-color: var(--dark); color: var(--dark); }
`;

const QR_PATTERN = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
    [0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0],
    [1,0,1,1,0,1,1,0,0,1,0,0,1,0,1,1,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,0],
];

const MATCHES = [
    { id:1, competition:"Championnat National", logo:"🏟️", team1:"Club Africain", team2:"Espérance de Tunis", date:"dimanche 12 avril 2026", time:"15:00", stade:"Stade El Menzah, Tunis",
        cats:[{name:"TRIBUNE VIP",prix:50,places:30},{name:"TRIBUNE CENTRALE",prix:25,places:120},{name:"VIRAGE",prix:10,places:350}]},
    { id:2, competition:"Tournoi Maghrébin", logo:"TN", team1:"Tunisie XV", team2:"Algérie XV", date:"lundi 20 avril 2026", time:"17:00", stade:"Stade Olympique, Radès",
        cats:[{name:"TRIBUNE VIP",prix:80,places:15},{name:"TRIBUNE CENTRALE",prix:40,places:85},{name:"VIRAGE",prix:20,places:500}]},
    { id:3, competition:"Coupe de Tunisie", logo:"🥇", team1:"Zitouna RC", team2:"RC Hammam-Lif", date:"dimanche 3 mai 2026", time:"14:00", stade:"Stade Municipal, La Marsa",
        cats:[{name:"TRIBUNE VIP",prix:35,places:50},{name:"TRIBUNE CENTRALE",prix:15,places:200},{name:"VIRAGE",prix:8,places:400}]},
];

const PAYMENT_METHODS = [
    { id:"carte",   icon:"💳", name:"Carte bancaire",   sub:"Visa / Mastercard" },
    { id:"edinar",  icon:"🏦", name:"E-Dinar",          sub:"Poste Tunisienne" },
    { id:"mobile",  icon:"📱", name:"Paiement mobile",  sub:"Sobflous / D17" },
];

const OPERATORS = [
    { id:"sobflous", icon:"📲", name:"Sobflous" },
    { id:"d17",      icon:"💰", name:"D17" },
    { id:"flouci",   icon:"🔵", name:"Flouci" },
];

export default function TicketsPage() {
    const [qty, setQty]             = useState({});
    const [showPay, setShowPay]     = useState(false);
    const [showQR, setShowQR]       = useState(false);
    const [paying, setPaying]       = useState(false);
    const [paidTicket, setPaidTicket] = useState(null);
    const [method, setMethod]       = useState("carte");
    const [operator, setOperator]   = useState("sobflous");
    const [form, setForm]           = useState({ nom:"", carte:"", exp:"", cvv:"", edinarNum:"", mobileNum:"" });

    const getQty = (mId, cIdx) => qty[`${mId}-${cIdx}`] || 0;
    const setQ   = (mId, cIdx, val) => setQty(prev => ({ ...prev, [`${mId}-${cIdx}`]: Math.max(0, val) }));

    const panier = [];
    MATCHES.forEach(m => m.cats.forEach((c, i) => {
        const q = getQty(m.id, i);
        if (q > 0) panier.push({ match:`${m.team1} vs ${m.team2}`, cat:c.name, prix:c.prix, qty:q });
    }));
    const total        = panier.reduce((s,i) => s + i.prix * i.qty, 0);
    const totalBillets = panier.reduce((s,i) => s + i.qty, 0);

    const isFormValid = () => {
        if (method === "carte")  return form.nom && form.carte && form.exp && form.cvv;
        if (method === "edinar") return form.edinarNum.length >= 8;
        if (method === "mobile") return form.mobileNum.length >= 8;
        return false;
    };

    const handlePay = async () => {
        if (!isFormValid()) return;
        setPaying(true);
        await new Promise(r => setTimeout(r, 1200));
        setPaying(false);
        setShowPay(false);
        const fakeCode = "TKT-" + Math.random().toString(36).substring(2,10).toUpperCase();
        setPaidTicket({ code: fakeCode, match: panier[0]?.match || "Match", cat: panier[0]?.cat || "", total, method });
        setShowQR(true);
        setQty({});
        setForm({ nom:"", carte:"", exp:"", cvv:"", edinarNum:"", mobileNum:"" });
    };

    const openModal = () => { setMethod("carte"); setShowPay(true); };

    return (
        <>
            <style>{styles}</style>

            {/* NAV */}
            <nav className="nav-rt">
                <div className="nav-brand">
                    <div className="nav-logo">RT</div>
                    RUGBY TUNISIE
                </div>
                <button className="btn-connect">Se connecter</button>
            </nav>

            {/* PAGE */}
            <div className="page-wrap">
                <div className="page-header">
                    <div>
                        <div className="page-title">🎟 Matchs disponibles</div>
                        <div className="page-sub">Réservez vos billets pour les prochains matchs de rugby en Tunisie</div>
                    </div>
                    <button className="btn-pay-top" disabled={totalBillets === 0} onClick={openModal}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        {totalBillets === 0 ? "Payer" : `Payer (${totalBillets} billet${totalBillets>1?"s":""} — ${total} TND)`}
                    </button>
                </div>

                {MATCHES.map(m => (
                    <div className="match-card" key={m.id}>
                        <div className="match-badge">🏉 {m.competition}</div>
                        <div className="match-info">
                            <div className="team-logo">{m.logo}</div>
                            <div className="match-title">{m.team1} <span className="vs">vs</span> <span className="team2">{m.team2}</span></div>
                        </div>
                        <div className="match-meta">
                            <span><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{m.date}</span>
                            <span><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>{m.time}</span>
                            <span><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{m.stade}</span>
                        </div>
                        <div className="divider"/>
                        <div className="categories">
                            {m.cats.map((c, i) => {
                                const q = getQty(m.id, i);
                                return (
                                    <div className="cat-card" key={i}>
                                        <div className="cat-name">{c.name}</div>
                                        <div className="cat-price">{c.prix} TND</div>
                                        <div className="cat-places">
                                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                            {c.places} places
                                        </div>
                                        {q === 0 ? (
                                            <button className="btn-reserver" onClick={() => setQ(m.id, i, 1)}>
                                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="1" y="6" width="22" height="14" rx="2"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                                Réserver
                                            </button>
                                        ) : (
                                            <>
                                                <div className="qty-ctrl">
                                                    <button className="qty-btn" onClick={() => setQ(m.id, i, q-1)}>−</button>
                                                    <span className="qty-val">{q}</span>
                                                    <button className="qty-btn" onClick={() => setQ(m.id, i, q+1)}>+</button>
                                                </div>
                                                <button className="btn-reserver" style={{background:"#333"}} onClick={() => setQ(m.id, i, 0)}>Retirer</button>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── PAYMENT MODAL ── */}
            {showPay && (
                <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setShowPay(false); }}>
                    <div className="pay-modal">
                        <div className="pay-modal-header">
                            <div className="pay-modal-title">🎟 Récapitulatif & Paiement</div>
                            <button className="modal-close" onClick={() => setShowPay(false)}>✕</button>
                        </div>

                        {/* Résumé */}
                        <div className="order-summary">
                            {panier.map((item, i) => (
                                <div className="order-item" key={i}>
                                    <div>
                                        <div className="order-item-name">{item.match}</div>
                                        <div className="order-item-sub">{item.cat} × {item.qty}</div>
                                    </div>
                                    <div className="order-item-price">{item.prix * item.qty} TND</div>
                                </div>
                            ))}
                            <div className="order-total">
                                <span className="order-total-label">Total</span>
                                <span className="order-total-price">{total} TND</span>
                            </div>
                        </div>

                        {/* Mode de paiement — 3 choix */}
                        <span className="method-label">Mode de paiement</span>
                        <div className="method-options">
                            {PAYMENT_METHODS.map(pm => (
                                <div key={pm.id} className={`method-opt ${method===pm.id?"active":""}`} onClick={() => setMethod(pm.id)}>
                                    <div className="method-opt-icon">{pm.icon}</div>
                                    <div className="method-opt-name">{pm.name}</div>
                                    <div className="method-opt-sub">{pm.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* ── CARTE BANCAIRE ── */}
                        {method === "carte" && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Nom sur la carte</label>
                                    <input className="form-input" placeholder="Mohamed Ben Ali"
                                           value={form.nom} onChange={e => setForm(f=>({...f,nom:e.target.value}))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Numéro de carte</label>
                                    <input className="form-input" placeholder="•••• •••• •••• ••••" maxLength={19}
                                           value={form.carte}
                                           onChange={e => {
                                               let v = e.target.value.replace(/\D/g,"").substring(0,16);
                                               v = v.replace(/(.{4})/g,"$1 ").trim();
                                               setForm(f=>({...f,carte:v}));
                                           }} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Expiration</label>
                                        <input className="form-input" placeholder="MM/AA" maxLength={5}
                                               value={form.exp}
                                               onChange={e => {
                                                   let v = e.target.value.replace(/\D/g,"").substring(0,4);
                                                   if(v.length>2) v = v.slice(0,2)+"/"+v.slice(2);
                                                   setForm(f=>({...f,exp:v}));
                                               }} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">CVV</label>
                                        <input className="form-input" placeholder="•••" maxLength={3}
                                               value={form.cvv}
                                               onChange={e => setForm(f=>({...f,cvv:e.target.value.replace(/\D/g,"").substring(0,3)}))} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── E-DINAR ── */}
                        {method === "edinar" && (
                            <>
                                <div className="edinar-badge">🏦 Poste Tunisienne — E-Dinar</div>
                                <div className="edinar-info">
                                    Entrez votre numéro de carte E-Dinar. Le montant sera débité directement de votre compte Poste.
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Numéro de carte E-Dinar</label>
                                    <input className="form-input" placeholder="Ex: 1234 5678 9012"
                                           maxLength={16}
                                           value={form.edinarNum}
                                           onChange={e => setForm(f=>({...f,edinarNum:e.target.value.replace(/\D/g,"").substring(0,16)}))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Code secret (4 chiffres)</label>
                                    <input className="form-input" placeholder="••••" maxLength={4} type="password"
                                           value={form.edinarPin||""}
                                           onChange={e => setForm(f=>({...f,edinarPin:e.target.value.replace(/\D/g,"").substring(0,4)}))} />
                                </div>
                            </>
                        )}

                        {/* ── PAIEMENT MOBILE ── */}
                        {method === "mobile" && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Choisir l'opérateur</label>
                                    <div className="mobile-operators">
                                        {OPERATORS.map(op => (
                                            <div key={op.id} className={`op-btn ${operator===op.id?"active":""}`} onClick={() => setOperator(op.id)}>
                                                <span className="op-emoji">{op.icon}</span>
                                                {op.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Numéro de téléphone</label>
                                    <input className="form-input" placeholder="Ex: 20 123 456"
                                           maxLength={8}
                                           value={form.mobileNum}
                                           onChange={e => setForm(f=>({...f,mobileNum:e.target.value.replace(/\D/g,"").substring(0,8)}))} />
                                </div>
                                <div className="edinar-info" style={{background:"#fff8e1",border:"1.5px solid #ffe082",color:"#e65100"}}>
                                    Un code de confirmation sera envoyé sur votre téléphone via {OPERATORS.find(o=>o.id===operator)?.name}.
                                </div>
                            </>
                        )}

                        <button className="btn-confirm" onClick={handlePay} disabled={paying || !isFormValid()}>
                            {paying ? (
                                <>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{animation:"spin .8s linear infinite"}}>
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                    </svg>
                                    Traitement en cours...
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
                                    Confirmer — {total} TND
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* ── QR CODE MODAL ── */}
            {showQR && paidTicket && (
                <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setShowQR(false); }}>
                    <div className="qr-modal">
                        <div className="qr-success-icon">✅</div>
                        <div className="qr-title">Ticket confirmé !</div>
                        <div className="qr-sub">Présentez ce QR Code à l'entrée du stade</div>
                        <div className="qr-box">
                            <div className="qr-grid">
                                {QR_PATTERN.map((row, ri) => row.map((cell, ci) => (
                                    <div key={`${ri}-${ci}`} className={`qr-cell ${cell?"b":"w"}`} />
                                )))}
                            </div>
                        </div>
                        <div className="qr-code-text">{paidTicket.code}</div>
                        <div className="qr-ticket-info">
                            <div className="qr-ticket-row"><span>Match</span><span>{paidTicket.match}</span></div>
                            <div className="qr-ticket-row"><span>Catégorie</span><span>{paidTicket.cat}</span></div>
                            <div className="qr-ticket-row"><span>Montant payé</span><span style={{color:"var(--red)"}}>{paidTicket.total} TND</span></div>
                            <div className="qr-ticket-row">
                                <span>Paiement</span>
                                <span>{PAYMENT_METHODS.find(p=>p.id===paidTicket.method)?.name}</span>
                            </div>
                            <div className="qr-ticket-row"><span>Statut</span><span style={{color:"#2e7d32",fontWeight:700}}>✓ PAYÉ</span></div>
                        </div>
                        <button className="btn-download">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Télécharger le ticket
                        </button>
                        <button className="btn-close-qr" onClick={() => setShowQR(false)}>Fermer</button>
                    </div>
                </div>
            )}
        </>
    );
}