/**
 * rugbyImages.js
 * Solution garantie — images SVG inline encodées en base64
 * Aucune dépendance externe, fonctionne 100% hors ligne
 */

// Génère un placeholder SVG coloré avec icône selon la catégorie
export const getProductImage = (categorie, nom = '') => {
    const configs = {
        MAILLOT: {
            bg: '#E63030',
            bg2: '#c0392b',
            icon: `<text x="100" y="95" text-anchor="middle" font-size="64">👕</text>
                   <text x="100" y="145" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.9)" font-family="Arial">${nom.substring(0, 22)}</text>`,
        },
        EQUIPEMENT: {
            bg: '#1a1a2e',
            bg2: '#16213e',
            icon: `<text x="100" y="95" text-anchor="middle" font-size="64">🏉</text>
                   <text x="100" y="145" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.9)" font-family="Arial">${nom.substring(0, 22)}</text>`,
        },
        ACCESSOIRE: {
            bg: '#2d6a4f',
            bg2: '#1b4332',
            icon: `<text x="100" y="95" text-anchor="middle" font-size="64">🎽</text>
                   <text x="100" y="145" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.9)" font-family="Arial">${nom.substring(0, 22)}</text>`,
        },
    };

    const c = configs[categorie] || configs.EQUIPEMENT;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${c.bg}"/>
                <stop offset="100%" style="stop-color:${c.bg2}"/>
            </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#g)"/>
        <rect x="0" y="155" width="200" height="45" fill="rgba(0,0,0,0.3)"/>
        ${c.icon}
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

// Produits mock avec images SVG inline garanties
export const PRODUITS_MOCK = [
    // ── MAILLOTS ──
    {
        id: "1",
        nom: "Maillot Officiel Rugby Tunisie",
        description: "Maillot officiel de l'équipe nationale, tissu technique respirant",
        prix: 79.90, stock: 50, categorie: "MAILLOT", disponible: true,
        urlImage: null, // sera généré dynamiquement
    },
    {
        id: "2",
        nom: "Maillot Domicile 2025",
        description: "Maillot domicile saison 2025",
        prix: 69.90, stock: 40, categorie: "MAILLOT", disponible: true,
        urlImage: null,
    },
    {
        id: "3",
        nom: "Maillot Training Rugby",
        description: "Maillot d'entraînement léger et respirant",
        prix: 49.90, stock: 30, categorie: "MAILLOT", disponible: true,
        urlImage: null,
    },
    // ── ÉQUIPEMENTS ──
    {
        id: "4",
        nom: "Ballon Rugby Officiel",
        description: "Ballon taille 5 certifié IRB",
        prix: 45.00, stock: 20, categorie: "EQUIPEMENT", disponible: true,
        urlImage: null,
    },
    {
        id: "5",
        nom: "Ballon d'Entraînement",
        description: "Ballon robuste pour les séances intensives",
        prix: 30.00, stock: 15, categorie: "EQUIPEMENT", disponible: true,
        urlImage: null,
    },
    {
        id: "6",
        nom: "Casque de Protection",
        description: "Casque rembourré haute protection en mêlée",
        prix: 55.00, stock: 3, categorie: "EQUIPEMENT", disponible: true,
        urlImage: null,
    },
    {
        id: "7",
        nom: "Chaussures à Crampons",
        description: "Crampons vissés terrain naturel",
        prix: 120.00, stock: 0, categorie: "EQUIPEMENT", disponible: false,
        urlImage: null,
    },
    {
        id: "8",
        nom: "Sac de Sport Rugby",
        description: "Grand sac 50L avec compartiment chaussures",
        prix: 65.00, stock: 12, categorie: "EQUIPEMENT", disponible: true,
        urlImage: null,
    },
    // ── ACCESSOIRES ──
    {
        id: "9",
        nom: "Casquette Officielle Rugby Tunisie",
        description: "Casquette brodée logo officiel, réglable",
        prix: 25.00, stock: 60, categorie: "ACCESSOIRE", disponible: true,
        urlImage: null,
    },
    {
        id: "10",
        nom: "Écharpe Supporter Rouge & Blanc",
        description: "Écharpe jacquard aux couleurs nationales",
        prix: 20.00, stock: 80, categorie: "ACCESSOIRE", disponible: true,
        urlImage: null,
    },
    {
        id: "11",
        nom: "Polo Rugby Tunisie",
        description: "Polo brodé coton piqué, coupe moderne",
        prix: 45.00, stock: 35, categorie: "ACCESSOIRE", disponible: true,
        urlImage: null,
    },
    {
        id: "12",
        nom: "Sweat à Capuche Rugby",
        description: "Sweat molleton doux, logo brodé sur la poitrine",
        prix: 69.00, stock: 2, categorie: "ACCESSOIRE", disponible: true,
        urlImage: null,
    },
    {
        id: "13",
        nom: "Gourde Rugby 750ml",
        description: "Bouteille isotherme, garde froid 12h",
        prix: 18.00, stock: 100, categorie: "ACCESSOIRE", disponible: true,
        urlImage: null,
    },
];