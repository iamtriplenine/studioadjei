/* ================================================================
   STUDIO ADJEI — script.js
   ================================================================ */

// ── DATA ─────────────────────────────────────────────────────────
const mesPhotos = [
    { url: "https://i.postimg.cc/qv7wrrcz/IMG_1686.jpg", titre: "Couple", categorie: "couple" },
    { url: "https://i.postimg.cc/vTsKGKXG/IMG_1681.jpg", titre: "Portrait", categorie: "homme" },
    { url: "https://i.postimg.cc/L5pWmWvH/IMG_1682.jpg", titre: "Traditionnelle", categorie: "traditionnelle" }
];

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initColorPicker();
    initSideMenu();
    initSearch();
    initFilters();
    initServicesScroll();
    initFloatingWA();
    renderGalerie(mesPhotos);
    initParallax();
    initPromoStrip();
});

// ── THEME (dark / light) ──────────────────────────────────────────
function initTheme() {
    const body     = document.body;
    const toggle   = document.getElementById('theme-toggle');
    const saved    = localStorage.getItem('sa-theme');
    const isDark   = saved !== null ? saved === 'dark' : true;

    body.classList.toggle('dark-mode', isDark);
    if (toggle) toggle.checked = isDark;

    toggle?.addEventListener('change', () => {
        const nowDark = toggle.checked;
        body.classList.toggle('dark-mode', nowDark);
        localStorage.setItem('sa-theme', nowDark ? 'dark' : 'light');
    });
}

// ── COLOR PICKER ──────────────────────────────────────────────────
function initColorPicker() {
    const dots      = document.querySelectorAll('.color-dot');
    const savedColor = localStorage.getItem('sa-color') || 'blue';

    applyColor(savedColor, false);

    dots.forEach(dot => {
        if (dot.dataset.theme === savedColor) dot.classList.add('active');

        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            applyColor(dot.dataset.theme, true);
        });
    });
}

function applyColor(theme, save) {
    document.documentElement.setAttribute('data-color', theme);
    if (save) localStorage.setItem('sa-color', theme);
}

// ── GALLERY ───────────────────────────────────────────────────────
function renderGalerie(list) {
    const container = document.getElementById('galerie');
    if (!container) return;

    if (!list.length) {
        container.innerHTML = '<p class="gallery-empty">Aucun album trouvé…</p>';
        return;
    }

    container.innerHTML = list.map(p => {
        const slug = p.titre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '_');
        return `
        <div class="photo-item">
            <a href="${slug}.html">
                <img src="${p.url}" alt="${p.titre}" loading="lazy">
                <div class="album-overlay">
                    <span>${p.titre}</span>
                </div>
            </a>
        </div>`;
    }).join('');

    initParallax();
}

// ── FILTERS ───────────────────────────────────────────────────────
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrerGalerie(btn.dataset.category);
        });
    });
}

function filtrerGalerie(cat) {
    const container = document.getElementById('galerie');
    if (!container) return;

    const filtered = cat === 'all' ? mesPhotos : mesPhotos.filter(p => p.categorie === cat);

    container.style.opacity = '0';
    container.style.transform = 'translateY(6px)';

    setTimeout(() => {
        renderGalerie(filtered);
        container.style.transition = 'opacity .3s ease, transform .3s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 220);
}

// ── SEARCH ────────────────────────────────────────────────────────
function initSearch() {
    const input     = document.getElementById('photo-search');
    const toggleBtn = document.getElementById('search-toggle');
    const expandEl  = document.getElementById('search-expand');

    if (toggleBtn && expandEl) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = expandEl.classList.toggle('open');
            if (isOpen) {
                setTimeout(() => input?.focus(), 100);
            }
        });
        // close on outside click
        document.addEventListener('click', e => {
            if (!expandEl.contains(e.target) && e.target !== toggleBtn) {
                expandEl.classList.remove('open');
            }
        });
    }

    input?.addEventListener('input', e => {
        const term = e.target.value.toLowerCase().trim();
        const resultats = mesPhotos.filter(p =>
            p.titre.toLowerCase().includes(term) ||
            p.categorie.toLowerCase().includes(term)
        );
        renderGalerie(resultats);
    });
}

// ── SIDE MENU ─────────────────────────────────────────────────────
function initSideMenu() {
    const menu     = document.getElementById('side-menu');
    const overlay  = document.getElementById('menu-overlay');
    const openBtn  = document.getElementById('open-menu');
    const closeBtn = document.getElementById('close-menu');

    if (!menu || !overlay) return;

    const open  = () => { menu.classList.add('open');    overlay.classList.add('active');    document.body.style.overflow = 'hidden'; };
    const close = () => { menu.classList.remove('open'); overlay.classList.remove('active'); document.body.style.overflow = ''; };

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', close);

    // Swipe to close
    let startX = 0;
    menu.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive:true });
    menu.addEventListener('touchend',   e => {
        if (e.changedTouches[0].clientX - startX < -60) close();
    }, { passive:true });
}

// ── SERVICES HORIZONTAL SCROLL (drag) ────────────────────────────
function initServicesScroll() {
    const slider = document.querySelector('.services-scroll');
    if (!slider) return;

    let isDown = false, startX = 0, scrollLeft = 0;

    slider.addEventListener('mousedown',  e => { isDown = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; slider.style.cursor = 'grabbing'; });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = ''; });
    slider.addEventListener('mouseup',    () => { isDown = false; slider.style.cursor = ''; });
    slider.addEventListener('mousemove',  e => {
        if (!isDown) return;
        e.preventDefault();
        slider.scrollLeft = scrollLeft - (e.pageX - slider.offsetLeft - startX) * 1.5;
    });
}

// ── FLOATING WHATSAPP ─────────────────────────────────────────────
function initFloatingWA() {
    const el = document.querySelector('.floating-wa');
    if (!el) return;

    let isDragging = false, moved = false;
    let ox = 0, oy = 0;

    const start = e => {
        isDragging = true; moved = false;
        el.style.transition = 'none';
        const cx = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const cy = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        const r  = el.getBoundingClientRect();
        ox = cx - r.left; oy = cy - r.top;
    };
    const move = e => {
        if (!isDragging) return;
        e.preventDefault(); moved = true;
        const cx = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const cy = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const x  = Math.min(Math.max(0, cx - ox), window.innerWidth  - el.offsetWidth);
        const y  = Math.min(Math.max(0, cy - oy), window.innerHeight - el.offsetHeight);
        el.style.left = x + 'px'; el.style.top = y + 'px';
        el.style.right = 'auto'; el.style.bottom = 'auto';
    };
    const end = e => {
        isDragging = false;
        el.style.transition = '';
        if (moved) e.preventDefault();
    };

    el.addEventListener('mousedown',  start);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup',   end);
    el.addEventListener('touchstart', start, { passive:false });
    document.addEventListener('touchmove', move, { passive:false });
    document.addEventListener('touchend',  end);
}

// ── PARALLAX ─────────────────────────────────────────────────────
function initParallax() {
    const items = document.querySelectorAll('.photo-item img');
    if (!items.length) return;

    let ticking = false;

    const update = () => {
        const vh = window.innerHeight || 1;
        items.forEach(img => {
            const r   = img.getBoundingClientRect();
            const p   = ((r.top + r.height / 2) - vh / 2) / (vh / 2);
            const ty  = Math.max(-12, Math.min(12, p * 12));
            img.style.transform = `translateY(${ty}px) scale(1.04)`;
        });
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive:true });

    update();
}

// ── PROMO STRIP: pause on hover ───────────────────────────────────
function initPromoStrip() {
    const track = document.querySelector('.promo-track');
    if (!track) return;
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

// ── TOAST HELPER ─────────────────────────────────────────────────
function showToast(msg, duration = 2600) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duration);
}
