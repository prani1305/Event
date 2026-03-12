gsap.registerPlugin(ScrollTrigger);

// =====================
// NAV — scroll behaviour
// =====================
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'var(--pearl)';
        nav.style.boxShadow = '0 4px 20px rgba(49,25,81,0.08)';
    } else {
        nav.style.background = 'linear-gradient(to bottom, var(--pearl), transparent)';
        nav.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// =====================
// HERO entrance
// =====================
gsap.from('.hero-content', {
    opacity: 0, y: 60, duration: 1.6, ease: 'power3.out'
});

// =====================
// HERO PARALLAX IMAGES
// =====================
const heroImgWraps = document.querySelectorAll('.hero-img-wrap');

if (heroImgWraps.length) {
    // Staggered entrance: images float up into position on load
    gsap.from(heroImgWraps, {
        opacity: 0,
        scale: 0.82,
        y: 50,
        duration: 1.4,
        ease: 'power3.out',
        stagger: { each: 0.1, from: 'random' },
        delay: 0.3,
    });

    // Scroll-parallax: each image drifts at its own speed as hero scrolls away
    // Mobile: much smaller movement (images are peeking from edges, less travel needed)
    heroImgWraps.forEach(wrap => {
        const speed = parseFloat(wrap.dataset.speed) || 1.5;
        gsap.to(wrap, {
            y: () => {
                const isMobile = window.innerWidth <= 768;
                const factor = isMobile ? 0.10 : 0.55;
                return (speed - 1) * -window.innerHeight * factor;
            },
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.8,
                invalidateOnRefresh: true,
            },
        });
    });
}

// =====================
// 3D BANNER SCROLL TRIGGERS
// =====================
// Banner 1: push-out (perspectiveOrigin top→bottom as you scroll)
gsap.set('#b3d-1', { perspectiveOrigin: 'center -80vh' });
gsap.to('#b3d-1', {
    scrollTrigger: { trigger: '#b3d-1', scrub: true, start: 'top bottom', end: 'bottom top' },
    perspectiveOrigin: 'center 80vh', ease: 'none'
});

// Banner 2: push-in recessed
gsap.set('#b3d-2', { perspectiveOrigin: 'center -80vh' });
gsap.to('#b3d-2', {
    scrollTrigger: { trigger: '#b3d-2', scrub: true, start: 'top bottom', end: 'bottom top' },
    perspectiveOrigin: 'center 80vh', ease: 'none'
});

// Banner 3: side + image, slight leftward origin
gsap.set('#b3d-3', { perspectiveOrigin: 'right -80vh' });
gsap.to('#b3d-3', {
    scrollTrigger: { trigger: '#b3d-3', scrub: true, start: 'top bottom', end: 'bottom top' },
    perspectiveOrigin: 'right 80vh', ease: 'none'
});

// Banner 4: recessed, origin moves right
gsap.set('#b3d-4', { perspectiveOrigin: 'left -80vh' });
gsap.to('#b3d-4', {
    scrollTrigger: { trigger: '#b3d-4', scrub: true, start: 'top bottom', end: 'bottom top' },
    perspectiveOrigin: 'left 80vh', ease: 'none'
});

// =====================
// SECTION fade-ins
// =====================
gsap.utils.toArray('section, .boxy-scene').forEach(el => {
    gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        opacity: 0, y: 40, duration: 1, ease: 'power2.out'
    });
});

// =====================
// SERVICE CARD and PACKAGE CARD hover (GSAP)
// =====================
document.querySelectorAll('.service-card, .package-card').forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' }));
    card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' }));
});

// =====================
// STEP ROW stagger reveal
// =====================
if (document.querySelector('#process')) {
    gsap.from(['#step-1', '#step-2', '#step-3'], {
        scrollTrigger: { trigger: '#process', start: 'top 70%' },
        opacity: 0, x: -40, stagger: 0.2, duration: 0.8, ease: 'power2.out'
    });
}

// ========================================
// 3D GALLERY CAROUSEL — Physics Engine
// ========================================
(function initGalleryCarousel() {
    const host = document.getElementById('gc-host');
    const ring = document.getElementById('gc-carousel');
    if (!host || !ring) return;

    const IMAGES = [
        'Images/Birthday Baby.png',
        'Images/Birthday.png',
        'Images/Corporate Event.png',
        'Images/DJ Foreign.png',
        'Images/DJ.png',
        'Images/Gemini_Generated_Image_5d6ihw5d6ihw5d6i.png',
        'Images/Half-Saree.png',
        'Images/Marriage.png',
        'Images/Wedding DJ.png',
        'Images/Founder Images/WhatsApp Image 2026-01-19 at 10.01.34 AM.jpeg',
        'Images/Founder Images/WhatsApp Image 2026-01-19 at 10.01.34 AM (1).jpeg',
        'Images/Founder Images/WhatsApp Image 2026-01-19 at 10.01.34 AM (2).jpeg',
        'Images/Founder Images/WhatsApp Image 2026-01-19 at 10.01.35 AM.jpeg',
        'Images/Founder Images/WhatsApp Image 2026-01-19 at 10.01.35 AM (1).jpeg',
        'Images/Founder Images/WhatsApp Image 2026-01-19 at 10.01.35 AM (2).jpeg',
        'Images/Founder Images/WhatsApp Image 2026-01-19 at 10.01.35 AM (3).jpeg',
    ];

    const TOTAL = IMAGES.length;
    host.style.setProperty('--gc-total', TOTAL);

    // Build ring items
    IMAGES.forEach((src, i) => {
        const li = document.createElement('li');
        li.style.setProperty('--index', i);
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Event photo ' + (i + 1);
        img.loading = 'lazy';
        li.appendChild(img);
        ring.appendChild(li);
    });

    // ── Physics state ────────────────────────────────────
    let angle = 0;      // current rotation (degrees, infinite)
    let velocity = 0.15;   // degrees/frame — gentle idle auto-spin
    let isDragging = false;
    let lastX = 0;
    let lastTime = 0;
    let raf = null;

    // Velocity sample buffer for realistic release impulse
    const VEL_BUF = [];
    const VEL_WIN = 6;

    const FRICTION = 0.955;  // momentum decay (higher = spins longer)
    const DRAG_SENS = 0.45;   // degrees per pixel dragged
    const MIN_VEL = 0.005;  // velocity floor before idle-restore kicks in
    const IDLE_SPIN = 0.12;   // target idle auto-rotate speed
    const IDLE_RESTORE = 0.012;  // how fast it eases back to idle

    // ── CSS computed radius ──────────────────────────────
    function getRadius() {
        return getComputedStyle(host).getPropertyValue('--radius').trim() || '0px';
    }

    // ── Render ───────────────────────────────────────────
    function draw() {
        ring.style.transform =
            `translate3d(0,0,${getRadius()}) rotateY(${angle}deg)`;
    }

    // ── Animation loop (RAF) ─────────────────────────────
    function tick() {
        if (!isDragging) {
            velocity *= FRICTION;
            // Ease toward idle spin when nearly stopped
            if (Math.abs(velocity) < IDLE_SPIN) {
                velocity += (IDLE_SPIN - velocity) * IDLE_RESTORE;
            }
        }
        angle += velocity;
        draw();
        raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick); // start immediately

    // ── Drag start ───────────────────────────────────────
    function onStart(x) {
        isDragging = true;
        lastX = x;
        lastTime = performance.now();
        VEL_BUF.length = 0;
        host.classList.add('dragging');
    }

    // ── Drag move ────────────────────────────────────────
    function onMove(x) {
        if (!isDragging) return;
        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);
        const dx = x - lastX;

        angle += dx * DRAG_SENS;
        lastX = x;
        lastTime = now;
        draw();

        // Sample velocity (deg/frame @ 60fps equivalent)
        const v = (dx / dt) * 16.67 * DRAG_SENS;
        VEL_BUF.push(v);
        if (VEL_BUF.length > VEL_WIN) VEL_BUF.shift();
    }

    // ── Drag end — compute weighted release impulse ───────
    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        host.classList.remove('dragging');

        if (VEL_BUF.length) {
            // Weight later samples more (recency bias)
            let sum = 0, wTotal = 0;
            VEL_BUF.forEach((v, i) => {
                const w = (i + 1) * (i + 1); // quadratic weight
                sum += v * w;
                wTotal += w;
            });
            velocity = sum / wTotal;
        }
    }

    // ── Mouse ────────────────────────────────────────────
    host.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.clientX); });
    window.addEventListener('mousemove', (e) => { onMove(e.clientX); });
    window.addEventListener('mouseup', () => { onEnd(); });
    window.addEventListener('mouseleave', () => { onEnd(); }); // safety

    // ── Touch ────────────────────────────────────────────
    host.addEventListener('touchstart', (e) => {
        onStart(e.touches[0].clientX);
    }, { passive: true });

    host.addEventListener('touchmove', (e) => {
        e.preventDefault();
        onMove(e.touches[0].clientX);
    }, { passive: false });

    host.addEventListener('touchend', () => { onEnd(); });

    // ── Mouse wheel / trackpad ────────────────────────────
    host.addEventListener('wheel', (e) => {
        e.preventDefault();
        velocity += (e.deltaX + e.deltaY) * 0.06;
    }, { passive: false });
})();

// ========================================
// LIGHTBOX FUNCTIONALITY
// ========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');
const zoomImages = document.querySelectorAll('.zoom-img');

if (lightbox && lightboxImg && closeLightbox) {
    zoomImages.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
            // Prevent background scrolling when lightbox is open
            document.body.style.overflow = 'hidden';
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
}
