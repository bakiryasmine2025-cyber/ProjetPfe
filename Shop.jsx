import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CART_KEY = 'rugby_cart';

const CAT_LABELS = {
    CHAUSSURE:  'Chaussures',
    CLAQUETTE:  'Claquettes',
    ACCESSOIRE: 'Accessoires',
    VETEMENT:   'Vêtements',
};

// ── TOUS LES PRODUITS ────────────────────────────────────────────────────────
const ALL_PRODUCTS = [

    // ════════════════════════════════════════
    // HOMME — CHAUSSURES
    // ════════════════════════════════════════
    { id:'hc1', genre:'HOMME', cat:'CHAUSSURE', name:'Adidas Run 72',        price:140, prixOrig:199, promo:true,  image:'/assets/Homme/chaussure/chaussure-adidas-run-72.jpg' },
    { id:'hc2', genre:'HOMME', cat:'CHAUSSURE', name:'Adidas Lite Racer',    price:160, prixOrig:null,promo:false, image:'/assets/Homme/chaussure/chaussure-adidas-lite-racer.jpg' },
    { id:'hc3', genre:'HOMME', cat:'CHAUSSURE', name:'Adidas Cloudfoam Go',  price:155, prixOrig:229, promo:true,  image:'/assets/Homme/chaussure/chaussure-adidas-cloudfoam-go.jpg' },
    { id:'hc4', genre:'HOMME', cat:'CHAUSSURE', name:'Nike Downshifter 12',  price:170, prixOrig:null,promo:false, image:'/assets/Homme/chaussure/chaussure-nike-downshifter-12.jpg' },
    { id:'hc5', genre:'HOMME', cat:'CHAUSSURE', name:'Nike Superfly 9 Club', price:190, prixOrig:269, promo:true,  image:'/assets/Homme/chaussure/chaussure-nike-superfly-9-club.jpg' },
    { id:'hc6', genre:'HOMME', cat:'CHAUSSURE', name:'Puma Pounce Lite',     price:130, prixOrig:null,promo:false, image:'/assets/Homme/chaussure/chaussure-puma-pounce-lite.jpg' },
    { id:'hc7', genre:'HOMME', cat:'CHAUSSURE', name:'Puma Pro Classic',     price:150, prixOrig:219, promo:true,  image:'/assets/Homme/chaussure/chaussure-puma-pro-classic.jpg' },
    { id:'hc8', genre:'HOMME', cat:'CHAUSSURE', name:'Puma Flyer Lite 3',    price:125, prixOrig:null,promo:false, image:'/assets/Homme/chaussure/chaussure-puma-flyer-lite-3.jpg' },
    { id:'hc9', genre:'HOMME', cat:'CHAUSSURE', name:'Puma Disperse XT 4',   price:145, prixOrig:199, promo:true,  image:'/assets/Homme/chaussure/chaussure-puma-disperse-xt-4.jpg' },

    // ════════════════════════════════════════
    // HOMME — CLAQUETTES
    // ════════════════════════════════════════
    { id:'hcl1', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Cartago Dakar Gas',        price:45, prixOrig:69,  promo:true,  image:'/assets/Homme/claquette/claquette-cartago-dakar-gas.jpg' },
    { id:'hcl2', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Mormaii Tropical Gr',      price:39, prixOrig:null,promo:false, image:'/assets/Homme/claquette/claquette-mormaii-tropical-gr.jpg' },
    { id:'hcl3', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Mormaii Tropical Gra',     price:39, prixOrig:59,  promo:true,  image:'/assets/Homme/claquette/claquette-mormaii-tropical-gra.jpg' },
    { id:'hcl4', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Nike Calm Slide',          price:55, prixOrig:null,promo:false, image:'/assets/Homme/claquette/claquette-nike-calm-slide.jpg' },
    { id:'hcl5', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Nike Victori One Slide',   price:49, prixOrig:75,  promo:true,  image:'/assets/Homme/claquette/claquette-nike-victori-one-slide.jpg' },
    { id:'hcl6', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Rider Full 86 NBA',        price:59, prixOrig:null,promo:false, image:'/assets/Homme/claquette/claquette-rider-full-86-nba-slide.jpg' },
    { id:'hcl7', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Rider Full 86',            price:55, prixOrig:79,  promo:true,  image:'/assets/Homme/claquette/claquette-rider-full-86-slide.jpg' },
    { id:'hcl8', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Rider Line Plus',          price:45, prixOrig:null,promo:false, image:'/assets/Homme/claquette/claquette-rider-line-plus.jpg' },
    { id:'hcl9', genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Rider Speed',              price:49, prixOrig:69,  promo:true,  image:'/assets/Homme/claquette/claquette-rider-speed.jpg' },
    { id:'hcl10',genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Rider Street Bold NB',     price:55, prixOrig:null,promo:false, image:'/assets/Homme/claquette/claquette-rider-street-bold-nb-thong.jpg' },
    { id:'hcl11',genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Rider Street Ole Inf',     price:49, prixOrig:75,  promo:true,  image:'/assets/Homme/claquette/claquette-rider-street-ole-inf-thong.jpg' },
    { id:'hcl12',genre:'HOMME', cat:'CLAQUETTE', name:'Claquette Victori One Slide',        price:45, prixOrig:null,promo:false, image:'/assets/Homme/claquette/claquette-victori-one-slide.jpg' },

    // ════════════════════════════════════════
    // HOMME — ACCESSOIRES
    // ════════════════════════════════════════
    { id:'ha1', genre:'HOMME', cat:'ACCESSOIRE', name:'Adidas Sac Sport Tiro L Duffle M',   price:129, prixOrig:189, promo:true,  image:'/assets/Homme/accessoire/adidas-sac-de-sport-tiro-l-duffle-m.jpg' },
    { id:'ha2', genre:'HOMME', cat:'ACCESSOIRE', name:'Body Sculpture Ensemble Haltère 19k',price:149, prixOrig:null,promo:false, image:'/assets/Homme/accessoire/body-sculpture-ensemble-halthere-19k.jpg' },
    { id:'ha3', genre:'HOMME', cat:'ACCESSOIRE', name:'Claquette Rider Full 86 Slide',      price:49,  prixOrig:69,  promo:true,  image:'/assets/Homme/accessoire/claquette-rider-full-86-slide.jpg' },
    { id:'ha4', genre:'HOMME', cat:'ACCESSOIRE', name:'Claquette Rider Line Plus',          price:39,  prixOrig:null,promo:false, image:'/assets/Homme/accessoire/claquette-rider-line-plus.jpg' },
    { id:'ha5', genre:'HOMME', cat:'ACCESSOIRE', name:'HML Belli Cap',                      price:35,  prixOrig:55,  promo:true,  image:'/assets/Homme/accessoire/hmlbelli-cap.jpg' },
    { id:'ha6', genre:'HOMME', cat:'ACCESSOIRE', name:'HML Chex Cap',                       price:35,  prixOrig:null,promo:false, image:'/assets/Homme/accessoire/hmlchex-cap.jpg' },
    { id:'ha7', genre:'HOMME', cat:'ACCESSOIRE', name:'Legacy Core Baseball Cap Black',     price:45,  prixOrig:65,  promo:true,  image:'/assets/Homme/accessoire/legacy-core-baseball-cap-black.jpg' },
    { id:'ha8', genre:'HOMME', cat:'ACCESSOIRE', name:'New Kikko Wristband Serre-Poignet',  price:19,  prixOrig:null,promo:false, image:'/assets/Homme/accessoire/new-kikko-wristband-serre-poignet.jpg' },
    { id:'ha9', genre:'HOMME', cat:'ACCESSOIRE', name:'Nike Chaussettes Cush Crew',         price:29,  prixOrig:45,  promo:true,  image:'/assets/Homme/accessoire/nike-chaussettes-mi-haute-cush-crew.jpg' },
    { id:'ha10',genre:'HOMME', cat:'ACCESSOIRE', name:'Nike Chaussettes Everyday Crew',     price:29,  prixOrig:null,promo:false, image:'/assets/Homme/accessoire/nike-chaussettes-mi-haute-everyday-crew.jpg' },
    { id:'ha11',genre:'HOMME', cat:'ACCESSOIRE', name:'Nike Sac Academy Team 23',           price:99,  prixOrig:149, promo:true,  image:'/assets/Homme/accessoire/nike-sac-a-dos-academy-team-23.jpg' },
    { id:'ha12',genre:'HOMME', cat:'ACCESSOIRE', name:'Nike Sac PSG Elemental',             price:119, prixOrig:null,promo:false, image:'/assets/Homme/accessoire/nike-sac-a-dos-psg-elemental.jpg' },
    { id:'ha13',genre:'HOMME', cat:'ACCESSOIRE', name:'Nike Sacoche Heritage Crossbody',    price:89,  prixOrig:129, promo:true,  image:'/assets/Homme/accessoire/nike-sacoche-heritage-crossbody.jpg' },
    { id:'ha14',genre:'HOMME', cat:'ACCESSOIRE', name:'Ballon Street Football',             price:49,  prixOrig:null,promo:false, image:'/assets/Homme/accessoire/street-football-ballon-de-foot.jpg' },
    { id:'ha15',genre:'HOMME', cat:'ACCESSOIRE', name:'Ballon Tango Rosario',               price:59,  prixOrig:89,  promo:true,  image:'/assets/Homme/accessoire/tango-rosario-ballon-de-foot.jpg' },
    { id:'ha16',genre:'HOMME', cat:'ACCESSOIRE', name:'Vision Ballon Mission Size 4',       price:45,  prixOrig:null,promo:false, image:'/assets/Homme/accessoire/vision-ballon-mission-size-4.jpg' },

    // ════════════════════════════════════════
    // HOMME — VÊTEMENTS
    // ════════════════════════════════════════
    { id:'hv1', genre:'HOMME', cat:'VETEMENT', name:'Core XK Polo',                         price:79,  prixOrig:119, promo:true,  image:'/assets/Homme/vetement/core-xk-polo.jpg' },
    { id:'hv2', genre:'HOMME', cat:'VETEMENT', name:'HML Auth Functional Polo',             price:89,  prixOrig:null,promo:false, image:'/assets/Homme/vetement/hml-auth-functional-polo.jpg' },
    { id:'hv3', genre:'HOMME', cat:'VETEMENT', name:'HML Auth Functional Polo V2',          price:89,  prixOrig:129, promo:true,  image:'/assets/Homme/vetement/hml-auth-functional-polo (1).jpg' },
    { id:'hv4', genre:'HOMME', cat:'VETEMENT', name:'HML Leon Polo T-Shirt Black',          price:69,  prixOrig:null,promo:false, image:'/assets/Homme/vetement/hmlleon-polo-t-shirt-s-s-tee-black.jpg' },
    { id:'hv5', genre:'HOMME', cat:'VETEMENT', name:'HML Red Quilted Jacket Marine',        price:149, prixOrig:219, promo:true,  image:'/assets/Homme/vetement/hmlred-quilted-jacket-marine.jpg' },
    { id:'hv6', genre:'HOMME', cat:'VETEMENT', name:'T-Shirt New Balance Logo Tee',         price:59,  prixOrig:null,promo:false, image:'/assets/Homme/vetement/t-shirt-new-balance-logo-tee.jpg' },
    { id:'hv7', genre:'HOMME', cat:'VETEMENT', name:'T-Shirt WLG Tunisia Tee',              price:55,  prixOrig:79,  promo:true,  image:'/assets/Homme/vetement/t-shirt-wlg-tunisia-tee.jpg' },
    { id:'hv8', genre:'HOMME', cat:'VETEMENT', name:'T-Shirt Africa Training Tee',          price:59,  prixOrig:null,promo:false, image:'/assets/Homme/vetement/tshirt-africa-training-tee.jpg' },
    { id:'hv9', genre:'HOMME', cat:'VETEMENT', name:'T-Shirt WLG Tunisia Tee V2',           price:55,  prixOrig:85,  promo:true,  image:'/assets/Homme/vetement/tshirt-wlg-tunisia-tee.jpg' },

    // ════════════════════════════════════════
    // FEMME — CHAUSSURES
    // ════════════════════════════════════════
    { id:'fc1',  genre:'FEMME', cat:'CHAUSSURE', name:'Activitta Casual',                   price:129, prixOrig:null,promo:false, image:'/assets/Femme/chaussure/chaussure-activitta-casual.jpg' },
    { id:'fc2',  genre:'FEMME', cat:'CHAUSSURE', name:'Actvitta Casual Pour Femme',         price:139, prixOrig:199, promo:true,  image:'/assets/Femme/chaussure/chaussure-actvitta-casual-pour-femme.jpg' },
    { id:'fc3',  genre:'FEMME', cat:'CHAUSSURE', name:'New Balance Arishi',                 price:179, prixOrig:null,promo:false, image:'/assets/Femme/chaussure/chaussure-new-balance-arishi.jpg' },
    { id:'fc4',  genre:'FEMME', cat:'CHAUSSURE', name:'New Balance Dynasoft Flash',         price:199, prixOrig:269, promo:true,  image:'/assets/Femme/chaussure/chaussure-new-balance-dynasoft-flash.jpg' },
    { id:'fc5',  genre:'FEMME', cat:'CHAUSSURE', name:'Nike Mystic Fly GS',                 price:159, prixOrig:null,promo:false, image:'/assets/Femme/chaussure/chaussure-nike-mystic-fly-gs.jpg' },
    { id:'fc6',  genre:'FEMME', cat:'CHAUSSURE', name:'Nike Revolution 7 GS',               price:149, prixOrig:219, promo:true,  image:'/assets/Femme/chaussure/chaussure-nike-revolution-7-gs.jpg' },
    { id:'fc7',  genre:'FEMME', cat:'CHAUSSURE', name:'Nike Revolution 8 Easyon',           price:169, prixOrig:null,promo:false, image:'/assets/Femme/chaussure/chaussure-nike-revolution-8-easyon.jpg' },
    { id:'fc8',  genre:'FEMME', cat:'CHAUSSURE', name:'Nike Star Runner 4 NN GS',           price:159, prixOrig:229, promo:true,  image:'/assets/Femme/chaussure/chaussure-nike-star-runner-4-nn-gs.jpg' },
    { id:'fc9',  genre:'FEMME', cat:'CHAUSSURE', name:'Nike Stellar Ride GS',               price:189, prixOrig:null,promo:false, image:'/assets/Femme/chaussure/chaussure-nike-stellar-ride-gs.jpg' },
    { id:'fc10', genre:'FEMME', cat:'CHAUSSURE', name:'Puma Flyer Lite 3 Femme',            price:125, prixOrig:179, promo:true,  image:'/assets/Femme/chaussure/chaussure-puma-flyer-lite-3.jpg' },
    { id:'fc11', genre:'FEMME', cat:'CHAUSSURE', name:'Puma Trinity 2 LT',                  price:149, prixOrig:null,promo:false, image:'/assets/Femme/chaussure/chaussure-puma-trinity-2-lt.jpg' },

    // ════════════════════════════════════════
    // FEMME — CLAQUETTES
    // ════════════════════════════════════════
    { id:'fcl1', genre:'FEMME', cat:'CLAQUETTE', name:'Flip Flop Jr',                       price:39, prixOrig:59,  promo:true,  image:'/assets/Femme/claquette/-flip-flop-jr-.jpg' },
    { id:'fcl2', genre:'FEMME', cat:'CLAQUETTE', name:'Flip Flop Jr Black',                 price:39, prixOrig:null,promo:false, image:'/assets/Femme/claquette/flip-flop-jr-black.jpg' },
    { id:'fcl3', genre:'FEMME', cat:'CLAQUETTE', name:'HML Essential Pool Slide',           price:49, prixOrig:75,  promo:true,  image:'/assets/Femme/claquette/hml-essential-pool-slide.jpg' },
    { id:'fcl4', genre:'FEMME', cat:'CLAQUETTE', name:'Pool Slide Badge White Green',       price:45, prixOrig:null,promo:false, image:'/assets/Femme/claquette/pool-slide-badge-white-green.jpg' },
    { id:'fcl5', genre:'FEMME', cat:'CLAQUETTE', name:'Pool Slide Wmns Cocoon',             price:55, prixOrig:79,  promo:true,  image:'/assets/Femme/claquette/pool-slide-wmns-cocoon.jpg' },

    // ════════════════════════════════════════
    // FEMME — ACCESSOIRES
    // ════════════════════════════════════════
    { id:'fa1', genre:'FEMME', cat:'ACCESSOIRE', name:'Haltères Body Sculpture 2kg',        price:49,  prixOrig:79,  promo:true,  image:'/assets/Femme/accessoire/body-sculpture-halthere-2kg.jpg' },
    { id:'fa2', genre:'FEMME', cat:'ACCESSOIRE', name:'Nike Chaussettes Blanc 3pr',         price:29,  prixOrig:null,promo:false, image:'/assets/Femme/accessoire/nike-chaussettes-mi-haute-everyday-crew-3pr.jpg' },
    { id:'fa3', genre:'FEMME', cat:'ACCESSOIRE', name:'Nike Chaussettes Noir 3pr',          price:29,  prixOrig:45,  promo:true,  image:'/assets/Femme/accessoire/nike-chaussettes-mi-haute-everyday-crew-3pr (1).jpg' },
    { id:'fa4', genre:'FEMME', cat:'ACCESSOIRE', name:'Nike Sac Brasilia Duff 95',          price:149, prixOrig:199, promo:true,  image:'/assets/Femme/accessoire/nike-sac-de-sport-brasilia-s-duff-95.jpg' },
    { id:'fa5', genre:'FEMME', cat:'ACCESSOIRE', name:'Puma Casquette Blanc',               price:39,  prixOrig:null,promo:false, image:'/assets/Femme/accessoire/puma-casquette-ess-metal-cat-bb.jpg' },
    { id:'fa6', genre:'FEMME', cat:'ACCESSOIRE', name:'Puma Casquette Kaki',                price:39,  prixOrig:59,  promo:true,  image:'/assets/Femme/accessoire/puma-casquette-ess-metal-cat-bb (1).jpg' },
    { id:'fa7', genre:'FEMME', cat:'ACCESSOIRE', name:'Puma Casquette Rose',                price:39,  prixOrig:null,promo:false, image:'/assets/Femme/accessoire/puma-casquette-ess-metal-cat-bb (2).jpg' },
    { id:'fa8', genre:'FEMME', cat:'ACCESSOIRE', name:'Puma Sac à Dos Phase',               price:89,  prixOrig:129, promo:true,  image:'/assets/Femme/accessoire/puma-sac-a-dos-phase.jpg' },

    // ════════════════════════════════════════
    // FEMME — VÊTEMENTS
    // ════════════════════════════════════════
    { id:'fv1', genre:'FEMME', cat:'VETEMENT', name:'Capuche Puma Script SS Full Zip',      price:119, prixOrig:169, promo:true,  image:'/assets/Femme/vetement/capuche-puma-script-ss-full-zip-hoodie.jpg' },
    { id:'fv2', genre:'FEMME', cat:'VETEMENT', name:'Crop Hoodie Adidas',                   price:99,  prixOrig:null,promo:false, image:'/assets/Femme/vetement/crop-hoodie-adidas.jpg' },
    { id:'fv3', genre:'FEMME', cat:'VETEMENT', name:'ESS Lin FZ HD Capuche',                price:109, prixOrig:159, promo:true,  image:'/assets/Femme/vetement/ess-lin-fz-hd-capuche.jpg' },
    { id:'fv4', genre:'FEMME', cat:'VETEMENT', name:'Jacket Puma Always On',                price:129, prixOrig:null,promo:false, image:'/assets/Femme/vetement/jacket-puma-always-on.jpg' },
    { id:'fv5', genre:'FEMME', cat:'VETEMENT', name:'Jacket Puma Always On V2',             price:139, prixOrig:199, promo:true,  image:'/assets/Femme/vetement/jacket-puma-always-on (1).jpg' },
    { id:'fv6', genre:'FEMME', cat:'VETEMENT', name:'Pantalon Puma Always On',              price:89,  prixOrig:null,promo:false, image:'/assets/Femme/vetement/pantalon-puma-always-on.jpg' },

    // ════════════════════════════════════════
    // PROMO — produits spéciaux
    // ════════════════════════════════════════
    { id:'pr1', genre:'PROMO', cat:'VETEMENT',   name:'Algiz 20 Lite Spectrum Blue',        price:89,  prixOrig:149, promo:true,  image:'/assets/promo/algiz-20-lite-spectrum-blue.jpg' },
    { id:'pr2', genre:'PROMO', cat:'VETEMENT',   name:'HML Future',                         price:99,  prixOrig:159, promo:true,  image:'/assets/promo/hml-future.jpg' },
    { id:'pr3', genre:'PROMO', cat:'VETEMENT',   name:'HML Future V2',                      price:99,  prixOrig:149, promo:true,  image:'/assets/promo/hml-future (1).jpg' },
    { id:'pr4', genre:'PROMO', cat:'VETEMENT',   name:'HML Authentic Poly Zip Jacket',      price:119, prixOrig:199, promo:true,  image:'/assets/promo/hmlauthentic-poly-zip-jacket.jpg' },
    { id:'pr5', genre:'PROMO', cat:'VETEMENT',   name:'HML Felinos Zip Hoodie Lazuli Blue',  price:129, prixOrig:209, promo:true,  image:'/assets/promo/hmlfelinos-zip-hoodie-lazuli-blue.jpg' },
    { id:'pr6', genre:'PROMO', cat:'VETEMENT',   name:'HML Lead Functional Polo Black',     price:79,  prixOrig:129, promo:true,  image:'/assets/promo/hmllead-functional-polo-black.jpg' },
    { id:'pr7', genre:'PROMO', cat:'VETEMENT',   name:'HML Nelly 20 Zip',                   price:109, prixOrig:179, promo:true,  image:'/assets/promo/hmlnelly-20-zip.jpg' },
    { id:'pr8', genre:'PROMO', cat:'VETEMENT',   name:'HML Promo Short Bench Jacket',       price:99,  prixOrig:159, promo:true,  image:'/assets/promo/hmlpromo-short-bench-jacket.jpg' },
];

const calcRed = (p, o) => o ? Math.round((1 - p/o) * 100) : null;

export default function Shop() {
    const location = useLocation();
    const navigate = useNavigate();

    const stateFilter = location.state?.filterCategorie || 'TOUS';

    const initGenre = () => {
        if (stateFilter === 'PROMO') return 'PROMO';
        if (stateFilter.startsWith('HOMME')) return 'HOMME';
        if (stateFilter.startsWith('FEMME')) return 'FEMME';
        return 'TOUS';
    };
    const initCat = () => {
        if (stateFilter.includes('_')) return stateFilter.split('_')[1];
        return 'TOUS';
    };

    const [genre, setGenre]   = useState(initGenre);
    const [cat, setCat]       = useState(initCat);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [addedId, setAddedId]   = useState(null);

    const [cart, setCart] = useState(() => {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch { return []; }
    });

    useEffect(() => {
        try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
        catch {}
    }, [cart]);

    useEffect(() => {
        const f = location.state?.filterCategorie || 'TOUS';
        if (f === 'PROMO') { setGenre('PROMO'); setCat('TOUS'); }
        else if (f.startsWith('HOMME')) { setGenre('HOMME'); setCat(f.includes('_') ? f.split('_')[1] : 'TOUS'); }
        else if (f.startsWith('FEMME')) { setGenre('FEMME'); setCat(f.includes('_') ? f.split('_')[1] : 'TOUS'); }
        else { setGenre('TOUS'); setCat('TOUS'); }
        setSelected(null);
    }, [location.state]);

    const filtered = ALL_PRODUCTS.filter(p => {
        if (genre === 'PROMO') return p.promo;
        if (genre === 'HOMME' && p.genre !== 'HOMME') return false;
        if (genre === 'FEMME' && p.genre !== 'FEMME') return false;
        if (genre === 'TOUS' && p.genre === 'PROMO') return false;
        if (cat !== 'TOUS' && p.cat !== cat) return false;
        if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);

    const addToCart = (product) => {
        setCart(prev => {
            const ex = prev.find(i => i.id === product.id);
            if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...product, qty: 1 }];
        });
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    const sousCategories = genre === 'HOMME' || genre === 'FEMME'
        ? ['TOUS', 'CHAUSSURE', 'CLAQUETTE', 'ACCESSOIRE', 'VETEMENT']
        : [];

    // ── PAGE DÉTAIL PRODUIT ──────────────────────────────────────────────────
    if (selected) {
        const p   = selected;
        const red = calcRed(p.price, p.prixOrig);
        return (
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 28, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ cursor: 'pointer', color: '#E63030' }} onClick={() => setSelected(null)}>Boutique</span>
                    <span>›</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => setSelected(null)}>{p.genre}</span>
                    <span>›</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => setSelected(null)}>{CAT_LABELS[p.cat]}</span>
                    <span>›</span>
                    <span style={{ color: '#111', fontWeight: 600 }}>{p.name}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
                    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f8f8f8', aspectRatio: '1', position: 'relative', border: '1px solid #eee' }}>
                        {red && (
                            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, background: '#E63030', color: '#fff', padding: '5px 12px', borderRadius: 4, fontWeight: 900, fontSize: 14 }}>
                                -{red}%
                            </div>
                        )}
                        <img src={p.image} alt={p.name}
                             style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }}
                             onError={e => { e.target.onerror = null; e.target.style.opacity = '0.2'; }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#E63030', textTransform: 'uppercase', letterSpacing: 2 }}>
                            {p.genre} · {CAT_LABELS[p.cat]}
                        </span>
                        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111', margin: 0 }}>{p.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 32, fontWeight: 900, color: '#111' }}>{p.price} TND</span>
                            {p.prixOrig && <span style={{ fontSize: 18, color: '#aaa', textDecoration: 'line-through' }}>{p.prixOrig} TND</span>}
                            {red && <span style={{ background: '#fef2f2', color: '#E63030', border: '1px solid #fca5a5', padding: '4px 10px', borderRadius: 6, fontWeight: 800, fontSize: 14 }}>-{red}%</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 18 }}>{s}</span>)}
                            <span style={{ fontSize: 13, color: '#bbb', marginLeft: 6 }}>(0 avis)</span>
                        </div>
                        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#166534' }}>
                            🚚 Livraison estimée : <strong>2-3 jours ouvrables</strong>
                        </div>
                        <button onClick={() => addToCart(p)} style={{
                            padding: '16px 0', borderRadius: 8,
                            background: addedId === p.id ? '#166534' : '#111',
                            color: '#fff', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s',
                        }}>
                            {addedId === p.id ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
                        </button>
                        <button onClick={() => setSelected(null)} style={{ padding: '12px 0', borderRadius: 8, background: '#f5f5f5', color: '#111', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                            ← Retour
                        </button>
                    </div>
                </div>

                {/* Produits similaires */}
                <div style={{ marginTop: 56 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20, textTransform: 'uppercase' }}>Vous pourriez aussi aimer</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                        {ALL_PRODUCTS.filter(pp => pp.id !== p.id && pp.cat === p.cat && pp.genre === p.genre).slice(0, 4)
                            .map(pp => <ProductCard key={pp.id} p={pp} onClick={() => { setSelected(pp); window.scrollTo(0,0); }} addedId={addedId} onAdd={addToCart} />)}
                    </div>
                </div>
            </div>
        );
    }

    // ── PAGE LISTE PRODUITS ──────────────────────────────────────────────────
    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '32px 24px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#111', margin: '0 0 4px', letterSpacing: -1 }}>
                            {genre === 'PROMO' ? '🔥 Promotions' : genre === 'TOUS' ? 'Tous les produits' : genre}
                        </h1>
                        <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
                            {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <div onClick={() => navigate('/fan/checkout')} style={{
                        background: '#fff', padding: '10px 20px', borderRadius: 30,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        🛒 <span style={{ color: '#E63030' }}>{totalItems}</span> article{totalItems > 1 ? 's' : ''}
                    </div>
                </div>

                {/* Filtres genre */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                    {['TOUS', 'HOMME', 'FEMME', 'PROMO'].map(g => (
                        <button key={g} onClick={() => { setGenre(g); setCat('TOUS'); }} style={{
                            padding: '9px 20px', borderRadius: 6,
                            border: genre === g ? 'none' : g === 'PROMO' ? '1.5px solid #E63030' : '1.5px solid #ddd',
                            background: genre === g ? (g === 'PROMO' ? '#E63030' : '#111') : '#fff',
                            color: genre === g ? '#fff' : g === 'PROMO' ? '#E63030' : '#555',
                            fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                        }}>{g === 'PROMO' ? '🔥 PROMO' : g}</button>
                    ))}
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                           placeholder="🔍 Rechercher..."
                           style={{ marginLeft: 'auto', padding: '9px 16px', border: '1.5px solid #ddd', borderRadius: 6, fontSize: 14, outline: 'none', width: 220, background: '#fff' }}
                    />
                </div>

                {/* Sous-catégories */}
                {sousCategories.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
                        {sousCategories.map(c => (
                            <button key={c} onClick={() => setCat(c)} style={{
                                padding: '7px 16px', borderRadius: 20,
                                border: cat === c ? 'none' : '1.5px solid #ddd',
                                background: cat === c ? '#E63030' : '#fff',
                                color: cat === c ? '#fff' : '#555',
                                fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                            }}>{c === 'TOUS' ? 'Tout voir' : CAT_LABELS[c]}</button>
                        ))}
                    </div>
                )}

                {/* Grille */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
                        <p style={{ fontWeight: 600 }}>Aucun produit trouvé</p>
                        <button onClick={() => { setGenre('TOUS'); setCat('TOUS'); setSearch(''); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, background: '#111', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                            Voir tout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                        {filtered.map(p => (
                            <ProductCard key={p.id} p={p}
                                         onClick={() => { setSelected(p); window.scrollTo(0, 0); }}
                                         addedId={addedId} onAdd={addToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Composant carte produit ──────────────────────────────────────────────────
function ProductCard({ p, onClick, addedId, onAdd }) {
    const [hov, setHov] = useState(false);
    const red = calcRed(p.price, p.prixOrig);

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
            background: '#fff', borderRadius: 10, overflow: 'hidden',
            border: hov ? '1.5px solid #111' : '1.5px solid transparent',
            boxShadow: hov ? '0 16px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.2s', transform: hov ? 'translateY(-5px)' : 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
        }}>
            {/* Image */}
            <div onClick={onClick} style={{ height: 220, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', padding: 8 }}>
                <img src={p.image} alt={p.name}
                     style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s', transform: hov ? 'scale(1.06)' : 'scale(1)' }}
                     onError={e => { e.target.onerror = null; e.target.style.opacity = '0.15'; }}
                />
                {red && <div style={{ position: 'absolute', top: 10, left: 10, background: '#E63030', color: '#fff', padding: '3px 9px', borderRadius: 4, fontWeight: 900, fontSize: 11 }}>-{red}%</div>}
                {p.promo && <div style={{ position: 'absolute', top: 10, right: 10, background: '#1a2744', color: '#fff', padding: '3px 8px', borderRadius: 4, fontWeight: 700, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }}>PROMO !</div>}
            </div>

            {/* Infos */}
            <div onClick={onClick} style={{ padding: '14px 14px 8px', flex: 1 }}>
                <div style={{ fontSize: 10, color: '#E63030', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5 }}>{CAT_LABELS[p.cat]}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 10px', lineHeight: 1.3 }}>{p.name}</h3>
                <div style={{ display: 'flex', gap: 1, marginBottom: 10 }}>
                    {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 12 }}>{s}</span>)}
                    <span style={{ fontSize: 10, color: '#ccc', marginLeft: 4 }}>(0)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#111' }}>{p.price} TND</span>
                    {p.prixOrig && <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>{p.prixOrig} TND</span>}
                </div>
            </div>

            {/* Bouton */}
            <div style={{ padding: '0 14px 14px' }}>
                <button onClick={e => { e.stopPropagation(); onAdd(p); }} style={{
                    width: '100%', padding: '10px 0',
                    background: addedId === p.id ? '#166534' : hov ? '#111' : '#f5f5f5',
                    color: addedId === p.id || hov ? '#fff' : '#111',
                    border: `1.5px solid ${hov ? '#111' : '#ddd'}`,
                    borderRadius: 6, fontWeight: 700, fontSize: 12,
                    cursor: 'pointer', transition: 'all 0.2s',
                    textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                    {addedId === p.id ? '✓ Ajouté !' : 'Ajouter au panier'}
                </button>
            </div>
        </div>
    );
}