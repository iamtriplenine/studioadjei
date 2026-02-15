// --- DONNÉES ---
const mesPhotos = [
    { url: "https://i.postimg.cc/qv7wrrcz/IMG_1686.jpg", titre: "couple", categorie: "couple" },
    { url: "https://i.postimg.cc/vTsKGKXG/IMG_1681.jpg", titre: "Portrait", categorie: "homme" },
    { url: "https://i.postimg.cc/L5pWmWvH/IMG_1682.jpg", titre: "Traditionnelle", categorie: "traditionnelle" }
];

const anciensClients = [
    { nom: "Abidjan(Yopougon)", adresse: "Palais de justice; BEAGO" },
    { nom: "+225 0705292570", adresse: "" }
];

// --- INITIALISATION UNIQUE ---
document.addEventListener('DOMContentLoaded', () => {
    chargerGalerie();
    chargerClients();
    initDarkMode();
    initFilters();
    initSideMenu();
    initBanner();
    initParallax(); // <--- Activé
    initSearch();   // <--- Activé
});

// Gestion du Mode Sombre (Bouton dans le menu overlay)
function initDarkMode() {
    const btnMenu = document.getElementById('theme-toggle-menu'); // Le bouton dans l'overlay
    
    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            // Change l'icône selon le mode
            btnMenu.innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }
}

// Menu Latéral
function initSideMenu() {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    const openBtn = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');

    const toggleMenu = (isOpen) => {
        if (isOpen) {
            sideMenu.classList.add('open');
            overlay.classList.add('active');
        } else {
            sideMenu.classList.remove('open');
            overlay.classList.remove('active');
        }
    };

    openBtn.addEventListener('click', () => toggleMenu(true));
    closeBtn.addEventListener('click', () => toggleMenu(false));
    overlay.addEventListener('click', () => toggleMenu(false));
}

// Affichage initial des albums
function chargerGalerie() {
    const container = document.getElementById('galerie');
    if (!container) return;
    
    container.innerHTML = mesPhotos.map(p => {
        const albumLink = p.titre.toLowerCase().replace(/ /g, "_") + ".html";
        return `
            <div class="photo-item">
                <a href="${albumLink}">
                    <img src="${p.url}" alt="${p.titre}">
                    <div class="album-overlay">
                        <span>${p.titre}</span>
                    </div>
                </a>
            </div>`;
    }).join('');
}

// Filtrage (Correction : Garde la structure d'album)
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            filtrerGalerie(btn.getAttribute('data-category'));
        });
    });
}

function filtrerGalerie(category) {
    const container = document.getElementById('galerie');
    const photosFiltrees = category === 'all' 
        ? mesPhotos 
        : mesPhotos.filter(p => p.categorie === category);

    container.style.opacity = '0';
    setTimeout(() => {
        container.innerHTML = photosFiltrees.map(p => {
            const albumLink = p.titre.toLowerCase().replace(/ /g, "_") + ".html";
            return `
                <div class="photo-item">
                    <a href="${albumLink}">
                        <img src="${p.url}" alt="${p.titre}">
                        <div class="album-overlay">
                            <span>${p.titre}</span>
                        </div>
                    </a>
                </div>`;
        }).join('');
        container.style.opacity = '1';
    }, 200);
}

function chargerClients() {
    const ul = document.getElementById('clients-ul');
    if (ul) {
        ul.innerHTML = anciensClients.map(c => `
            <li><strong>${c.nom}</strong> — ${c.adresse}</li>
        `).join('');
    }
}

function initBanner() {
    const banner = document.getElementById('banner-bottom');
    const closeBtn = document.getElementById('close-banner');
    if (banner) {
        setTimeout(() => { banner.classList.add('show'); }, 1000);
        setTimeout(() => { banner.classList.remove('show'); }, 6000);
        closeBtn.addEventListener('click', () => { banner.classList.remove('show'); });
    }
}


function initSearch() {
    const searchInput = document.getElementById('photo-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const container = document.getElementById('galerie');
            
            // On filtre les photos basées sur le titre
            const resultats = mesPhotos.filter(p => 
                p.titre.toLowerCase().includes(term) || 
                p.categorie.toLowerCase().includes(term)
            );

            // Mise à jour de l'affichage avec animation fluide
            container.innerHTML = resultats.map(p => {
                const albumLink = p.titre.toLowerCase().replace(/ /g, "_") + ".html";
                return `
                    <div class="photo-item">
                        <a href="${albumLink}">
                            <img src="${p.url}" alt="${p.titre}">
                            <div class="album-overlay">
                                <span>${p.titre}</span>
                            </div>
                        </a>
                    </div>`;
            }).join('');
            
            // On relance le parallaxe pour les nouveaux éléments
            initParallax(); 
        });
    }
}
