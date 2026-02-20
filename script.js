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

    initTheme();              // ✅ switch + localStorage, dark par défaut
    initFilters();
    initSideMenu();
    initBanner();
    initHorizontalScroll();
    initSearch();
    initDraggableContact();
    initAdsScroll();

    initParallax();           // ✅ existe maintenant (léger)
});

/* ---------------------------
   THEME (dark par défaut)
--------------------------- */
function initTheme() {
    const body = document.body;
    const toggle = document.getElementById('theme-toggle');

    // Par défaut: dark (si rien n'est enregistré)
    const saved = localStorage.getItem('theme'); // "dark" | "light" | null
    const isDark = saved ? saved === 'dark' : true;

    body.classList.toggle('dark-mode', isDark);

    if (toggle) {
        toggle.checked = isDark;

        toggle.addEventListener('change', () => {
            const nowDark = toggle.checked;
            body.classList.toggle('dark-mode', nowDark);
            localStorage.setItem('theme', nowDark ? 'dark' : 'light');
        });
    }
}

/* ---------------------------
   GALLERY
--------------------------- */
function renderGalerie(list) {
    const container = document.getElementById('galerie');
    if (!container) return;

    container.innerHTML = list.map(p => {
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

function chargerGalerie() {
    renderGalerie(mesPhotos);
}

function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const active = document.querySelector('.filter-btn.active');
            if (active) active.classList.remove('active');

            btn.classList.add('active');
            filtrerGalerie(btn.getAttribute('data-category'));
        });
    });
}

function filtrerGalerie(category) {
    const container = document.getElementById('galerie');
    if (!container) return;

    const photosFiltrees = category === 'all'
        ? mesPhotos
        : mesPhotos.filter(p => p.categorie === category);

    container.style.opacity = '0';
    setTimeout(() => {
        renderGalerie(photosFiltrees);
        container.style.opacity = '1';
        initParallax();
    }, 200);
}

/* ---------------------------
   CLIENTS
--------------------------- */
function chargerClients() {
    const ul = document.getElementById('clients-ul');
    if (!ul) return;

    ul.innerHTML = anciensClients.map(c => `
        <li><strong>${c.nom}</strong> — ${c.adresse}</li>
    `).join('');
}

/* ---------------------------
   SIDE MENU
--------------------------- */
function initSideMenu() {
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    const openBtn = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');

    if (!sideMenu || !overlay || !openBtn || !closeBtn) return;

    const toggleMenu = (isOpen) => {
        sideMenu.classList.toggle('open', isOpen);
        overlay.classList.toggle('active', isOpen);
    };

    openBtn.addEventListener('click', () => toggleMenu(true));
    closeBtn.addEventListener('click', () => toggleMenu(false));
    overlay.addEventListener('click', () => toggleMenu(false));
}

/* ---------------------------
   BANNER
--------------------------- */
function initBanner() {
    const banner = document.getElementById('banner-bottom');
    const closeBtn = document.getElementById('close-banner');
    if (!banner) return;

    setTimeout(() => banner.classList.add('show'), 1000);
    setTimeout(() => banner.classList.remove('show'), 6000);

    if (closeBtn) {
        closeBtn.addEventListener('click', () => banner.classList.remove('show'));
    }
}

/* ---------------------------
   SEARCH
--------------------------- */
function initSearch() {
    const searchInput = document.getElementById('photo-search');
    const container = document.getElementById('galerie');
    if (!searchInput || !container) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();

        const resultats = mesPhotos.filter(p =>
            p.titre.toLowerCase().includes(term) ||
            p.categorie.toLowerCase().includes(term)
        );

        renderGalerie(resultats);
        initParallax();
    });
}

/* ---------------------------
   Horizontal scroll (ads)
--------------------------- */
function initHorizontalScroll() {
    const slider = document.querySelector('.ads-slider');
    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.6;
        slider.scrollLeft = scrollLeft - walk;
    });
}

/* ---------------------------
   Floating contact drag
--------------------------- */
function initDraggableContact() {
    const el = document.querySelector('.floating-contact');
    if (!el) return;

    let isDragging = false;
    let offset = { x: 0, y: 0 };

    const onStart = (e) => {
        isDragging = true;
        el.style.transition = "none";

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        const rect = el.getBoundingClientRect();
        offset.x = clientX - rect.left;
        offset.y = clientY - rect.top;
    };

    const onMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        let x = clientX - offset.x;
        let y = clientY - offset.y;

        const maxX = window.innerWidth - el.offsetWidth;
        const maxY = window.innerHeight - el.offsetHeight;

        x = Math.min(Math.max(0, x), maxX);
        y = Math.min(Math.max(0, y), maxY);

        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.bottom = 'auto';
        el.style.right = 'auto';
    };

    const onEnd = () => {
        isDragging = false;
        el.style.transition = "transform 0.25s ease, background 0.25s ease, color 0.25s ease";
    };

    el.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    el.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
}

/* ---------------------------
   Ads scroll (si tu veux du drag feel + inertie, ici c'est simple)
--------------------------- */
function initAdsScroll() {
    // Déjà géré dans initHorizontalScroll (mais on garde si tu veux étendre)
}

/* ---------------------------
   Parallax léger (discret)
--------------------------- */
function initParallax() {
    const items = document.querySelectorAll('.photo-item img');
    if (!items.length) return;

    let ticking = false;

    const update = () => {
        const vh = window.innerHeight || 1;

        items.forEach(img => {
            const rect = img.getBoundingClientRect();
            const progress = ((rect.top + rect.height / 2) - (vh / 2)) / (vh / 2);
            const translateY = Math.max(-10, Math.min(10, progress * 10));
            img.style.transform = `translateY(${translateY}px) scale(1.03)`;
        });

        ticking = false;
    };

    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
}
