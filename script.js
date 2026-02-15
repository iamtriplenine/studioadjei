// --- DONNÉES ---
const mesPhotos = [
    { url: "https://i.postimg.cc/j2b1R1vT/IMG_1680.jpg", titre: "Mariage", categorie: "mariage" },
    { url: "https://i.postimg.cc/vTsKGKXG/IMG_1681.jpg", titre: "Portrait", categorie: "homme" },
    { url: "https://i.postimg.cc/L5pWmWvH/IMG_1682.jpg", titre: "Enfant", categorie: "enfant" },
    { url: "https://i.postimg.cc/L5pWmWvH/IMG_1682.jpg", titre: "Enfant", categorie: "enfant" }
];

const anciensClients = [
    { nom: "Famille Martin", adresse: "Rue de la Libération, 75010 Paris" },
    { nom: "Entreprise Tech", adresse: "Quai des Orfèvres, 69002 Lyon" }
];

// --- INITIALISATION ---
// --- INITIALISATION ---
// Remplacez votre bloc d'initialisation
document.addEventListener('DOMContentLoaded', () => {
    chargerGalerie();
    chargerClients();
    initDarkMode();
    initFilters();
    initSideMenu(); // Nouvelle fonction à appeler
});

// Nouvelle fonction pour le menu
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

// Mise à jour de la fonction Dark Mode (bouton déplacé)
function initDarkMode() {
    const btn = document.getElementById('theme-toggle-menu');
    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        btn.innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
}






// Charger les images dans la grille
function chargerGalerie() {
    const container = document.getElementById('galerie');
    container.innerHTML = mesPhotos.map(p => `
        <div class="photo-item">
            <img src="${p.url}" alt="${p.titre}" loading="lazy">
        </div>
    `).join('');
}

// Charger les clients avec ADRESSE (obligatoire)
function chargerClients() {
    const ul = document.getElementById('clients-ul');
    ul.innerHTML = anciensClients.map(c => `
        <li><strong>${c.nom}</strong> — ${c.adresse}</li>
    `).join('');
}

// Gestion du Mode Sombre (Toggle)






function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Gérer le style visuel des boutons
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');

            // 2. Filtrer les photos
            const category = btn.getAttribute('data-category');
            filtrerGalerie(category);
        });
    });
}

function filtrerGalerie(category) {
    const container = document.getElementById('galerie');
    
    // Si "all", on prend tout, sinon on filtre
    const photosFiltrees = category === 'all' 
        ? mesPhotos 
        : mesPhotos.filter(p => p.categorie === category);

    // Ré-afficher la galerie avec animation
    container.style.opacity = '0';
    setTimeout(() => {
        container.innerHTML = photosFiltrees.map(p => `
            <div class="photo-item">
                <img src="${p.url}" alt="${p.titre}" loading="lazy">
            </div>
        `).join('');
        container.style.opacity = '1';
    }, 200);
}

// N'oublie pas d'ajouter initFilters() dans ton document.addEventListener('DOMContentLoaded', ...)
