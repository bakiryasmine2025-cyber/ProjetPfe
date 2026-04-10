import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `Tu es l'assistant officiel de la Fédération Tunisienne de Rugby (Rugby Tunisie).
Tu aides les utilisateurs avec:
- Les informations sur les clubs de rugby tunisiens
- Les compétitions et matchs
- Les licences et inscriptions
- La gestion des équipes et joueurs
- La plateforme de gestion sportive Rugby Tunisie
- Les règles du rugby
Réponds toujours en français. Sois concis, amical et professionnel.
Si tu ne sais pas quelque chose de spécifique à la fédération, dis-le honnêtement.`;

export default function ChatBot() {
    const [open, setOpen]           = useState(false);
    const [messages, setMessages]   = useState([
        { role: 'assistant', content: 'Bonjour ! 🏉 Je suis l\'assistant Rugby Tunisie. Comment puis-je vous aider ?' }
    ]);
    const [input, setInput]         = useState('');
    const [loading, setLoading]     = useState(false);
    const messagesEndRef             = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3.2:latest',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...newMessages.map(m => ({
                            role: m.role,
                            content: m.content
                        }))
                    ],
                    stream: false
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message?.content || 'Désolé, je n\'ai pas pu répondre.'
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Erreur. Vérifiez qu\'Ollama est lancé.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickQuestions = [
        'Les clubs disponibles',
        'Comment s\'inscrire ?',
        'Les compétitions 2025',
    ];

    return (
        <>
            {/* ── Chat Window ── */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: 90, right: 24,
                    width: 380, height: 520,
                    background: '#fff', borderRadius: 20,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 9999, overflow: 'hidden',
                    border: '1px solid #eee'
                }}>
                    {/* Header */}
                    <div style={{
                        background: '#E63030', padding: '16px 20px',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: 18
                            }}>🏉</div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                                    Assistant Rugby Tunisie
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>
                                    {loading ? 'En train d\'écrire...' : '🟢 En ligne'}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} style={{
                            background: 'none', border: 'none',
                            color: '#fff', fontSize: 20,
                            cursor: 'pointer', opacity: 0.8
                        }}>✕</button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: 'auto',
                        padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        background: '#fafafa'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end', gap: 8
                            }}>
                                {msg.role === 'assistant' && (
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: '#E63030', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: 14, flexShrink: 0
                                    }}>🏉</div>
                                )}
                                <div style={{
                                    maxWidth: '75%',
                                    padding: '10px 14px',
                                    borderRadius: msg.role === 'user'
                                        ? '18px 18px 4px 18px'
                                        : '18px 18px 18px 4px',
                                    background: msg.role === 'user' ? '#E63030' : '#fff',
                                    color: msg.role === 'user' ? '#fff' : '#111',
                                    fontSize: 13, lineHeight: 1.6,
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: '#E63030', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontSize: 14
                                }}>🏉</div>
                                <div style={{
                                    background: '#fff', padding: '12px 16px',
                                    borderRadius: '18px 18px 18px 4px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    display: 'flex', gap: 5, alignItems: 'center'
                                }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{
                                            width: 7, height: 7, borderRadius: '50%',
                                            background: '#E63030',
                                            animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick questions */}
                    {messages.length === 1 && (
                        <div style={{
                            padding: '8px 12px',
                            display: 'flex', gap: 6, flexWrap: 'wrap',
                            background: '#fafafa',
                            borderTop: '1px solid #f0f0f0'
                        }}>
                            {quickQuestions.map(q => (
                                <button key={q} onClick={() => {
                                    setInput(q);
                                    setTimeout(sendMessage, 50);
                                }} style={{
                                    padding: '5px 12px', borderRadius: 20,
                                    border: '1px solid #E63030',
                                    background: '#fff', color: '#E63030',
                                    fontSize: 12, fontWeight: 600, cursor: 'pointer'
                                }}>{q}</button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{
                        padding: '12px 16px',
                        borderTop: '1px solid #f0f0f0',
                        display: 'flex', gap: 8,
                        background: '#fff', alignItems: 'center'
                    }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Posez votre question..."
                            disabled={loading}
                            style={{
                                flex: 1, padding: '10px 14px',
                                border: '1.5px solid #eee', borderRadius: 12,
                                fontSize: 13, outline: 'none',
                                background: loading ? '#f9f9f9' : '#fff'
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: (!input.trim() || loading) ? '#f0f0f0' : '#E63030',
                                border: 'none',
                                cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
                                color: (!input.trim() || loading) ? '#bbb' : '#fff',
                                fontSize: 18, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, transition: 'all 0.2s'
                            }}
                        >➤</button>
                    </div>
                </div>
            )}

            {/* ── Toggle Button ── */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: 'fixed', bottom: 24, right: 24,
                    width: 58, height: 58, borderRadius: '50%',
                    background: open ? '#333' : '#E63030',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(230,48,48,0.4)',
                    cursor: 'pointer', fontSize: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                {open ? '✕' : '🏉'}
            </button>

            {/* Animations */}
            <style>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                }
            `}</style>
        </>
    );
}