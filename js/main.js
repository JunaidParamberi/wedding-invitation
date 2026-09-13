/* ============================================
   CINEMATIC DOOR - CONTAINED EXPERIENCE
   GSAP + Slides + Particles + Typewriter
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // GSAP SETUP
    // ============================================
    gsap.registerPlugin();

    // ============================================
    // STATE
    // ============================================
    const TOTAL_SLIDES = 7;
    let currentSlide = 0;
    let isTransitioning = false;
    let doorOpened = false;

    const door = document.getElementById('door');
    const inside = document.getElementById('inside');
    const slides = document.getElementById('slides');
    const navPrev = document.getElementById('navPrev');
    const navNext = document.getElementById('navNext');
    const dots = document.querySelectorAll('.c-dot');
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    let musicPlaying = false;

    // ============================================
    // TYPEWRITER
    // ============================================
    function typeWriter(el, text, speed = 65) {
        return new Promise(resolve => {
            let i = 0;
            el.textContent = '';
            const cursor = el.nextElementSibling;
            if (cursor) cursor.style.display = 'inline';
            (function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed + Math.random() * 35);
                } else {
                    setTimeout(() => {
                        if (cursor) cursor.style.display = 'none';
                        resolve();
                    }, 600);
                }
            })();
        });
    }

    // ============================================
    // DOOR PARTICLES
    // ============================================
    const dCvs = document.getElementById('doorParticles');
    const dCtx = dCvs.getContext('2d');
    let dParts = [];

    function sizeDoor() {
        dCvs.width = window.innerWidth;
        dCvs.height = window.innerHeight;
    }

    class DP {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * dCvs.width;
            this.y = init ? Math.random() * dCvs.height : dCvs.height + 10;
            this.r = Math.random() * 1.8 + 0.4;
            this.vy = -(Math.random() * 0.4 + 0.12);
            this.vx = (Math.random() - 0.5) * 0.15;
            this.o = Math.random() * 0.45 + 0.1;
            this.fs = Math.random() * 0.0015 + 0.0008;
        }
        update() {
            this.y += this.vy;
            this.x += this.vx;
            this.o -= this.fs;
            if (this.o <= 0 || this.y < -5) this.reset(false);
        }
        draw() {
            dCtx.save();
            dCtx.globalAlpha = this.o;
            dCtx.fillStyle = '#C9A96E';
            dCtx.shadowBlur = this.r * 4;
            dCtx.shadowColor = 'rgba(201,169,110,0.3)';
            dCtx.beginPath();
            dCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            dCtx.fill();
            dCtx.restore();
        }
    }

    function initDoorParts() {
        sizeDoor();
        dParts = [];
        const n = Math.min(Math.floor(dCvs.width * dCvs.height / 20000), 50);
        for (let i = 0; i < n; i++) dParts.push(new DP());
    }

    function animDoor() {
        dCtx.clearRect(0, 0, dCvs.width, dCvs.height);
        dParts.forEach(p => { p.update(); p.draw(); });
        if (!doorOpened) requestAnimationFrame(animDoor);
    }

    initDoorParts();
    animDoor();

    // ============================================
    // STARS CANVAS (Slide 0)
    // ============================================
    const sCvs = document.getElementById('starsCanvas');
    const sCtx = sCvs.getContext('2d');
    let stars = [];

    function sizeStars() {
        sCvs.width = window.innerWidth;
        sCvs.height = window.innerHeight;
    }

    function initStars() {
        sizeStars();
        stars = [];
        const n = Math.min(Math.floor(sCvs.width * sCvs.height / 6000), 250);
        for (let i = 0; i < n; i++) {
            stars.push({
                x: Math.random() * sCvs.width,
                y: Math.random() * sCvs.height,
                r: Math.random() * 1.3 + 0.3,
                sp: Math.random() * 0.025 + 0.005,
                off: Math.random() * Math.PI * 2,
                bo: Math.random() * 0.5 + 0.2,
            });
        }
    }

    function animStars(t) {
        sCtx.clearRect(0, 0, sCvs.width, sCvs.height);
        stars.forEach(s => {
            const o = s.bo + Math.sin(t * s.sp + s.off) * 0.25;
            sCtx.save();
            sCtx.globalAlpha = Math.max(0, Math.min(1, o));
            sCtx.fillStyle = '#E8E0D4';
            sCtx.beginPath();
            sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            sCtx.fill();
            sCtx.restore();
        });
        requestAnimationFrame(animStars);
    }

    initStars();
    animStars(0);

    // ============================================
    // UNION CANVAS (Slide 3)
    // ============================================
    const uCvs = document.getElementById('unionCanvas');
    const uCtx = uCvs.getContext('2d');
    let uParts = [];

    function sizeUnion() {
        uCvs.width = window.innerWidth;
        uCvs.height = window.innerHeight;
    }

    function initUnion() {
        sizeUnion();
        uParts = [];
        const n = Math.min(Math.floor(uCvs.width * uCvs.height / 10000), 120);
        for (let i = 0; i < n; i++) {
            uParts.push({
                x: Math.random() * uCvs.width,
                y: Math.random() * uCvs.height,
                r: Math.random() * 1.5 + 0.3,
                a: Math.random() * Math.PI * 2,
                sp: Math.random() * 0.015 + 0.003,
                dr: Math.random() * 0.12 + 0.04,
                o: Math.random() * 0.4 + 0.15,
                p: Math.random() * 0.015 + 0.005,
            });
        }
    }

    function animUnion(t) {
        uCtx.clearRect(0, 0, uCvs.width, uCvs.height);

        // Lines
        for (let i = 0; i < uParts.length; i++) {
            for (let j = i + 1; j < uParts.length; j++) {
                const dx = uParts[i].x - uParts[j].x;
                const dy = uParts[i].y - uParts[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 100) {
                    uCtx.save();
                    uCtx.globalAlpha = (1 - d / 100) * 0.08;
                    uCtx.strokeStyle = '#C9A96E';
                    uCtx.lineWidth = 0.5;
                    uCtx.beginPath();
                    uCtx.moveTo(uParts[i].x, uParts[i].y);
                    uCtx.lineTo(uParts[j].x, uParts[j].y);
                    uCtx.stroke();
                    uCtx.restore();
                }
            }
        }

        // Stars
        uParts.forEach(s => {
            s.a += s.p;
            const o = s.o + Math.sin(s.a) * 0.15;
            uCtx.save();
            uCtx.globalAlpha = Math.max(0, Math.min(1, o));
            uCtx.fillStyle = '#C9A96E';
            uCtx.shadowBlur = s.r * 3;
            uCtx.shadowColor = 'rgba(201,169,110,0.25)';
            uCtx.beginPath();
            uCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            uCtx.fill();
            uCtx.restore();
            s.x += Math.cos(s.a) * s.dr;
            s.y += Math.sin(s.a) * s.dr;
            if (s.x < -5) s.x = uCvs.width + 5;
            if (s.x > uCvs.width + 5) s.x = -5;
            if (s.y < -5) s.y = uCvs.height + 5;
            if (s.y > uCvs.height + 5) s.y = -5;
        });

        requestAnimationFrame(animUnion);
    }

    initUnion();
    animUnion(0);

    // ============================================
    // CLOSING PARTICLES (Slide 6)
    // ============================================
    const cCvs = document.getElementById('closingCanvas');
    const cCtx = cCvs.getContext('2d');
    let cParts = [];

    function sizeClosing() {
        cCvs.width = window.innerWidth;
        cCvs.height = window.innerHeight;
    }

    class CP {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * cCvs.width;
            this.y = init ? Math.random() * cCvs.height : cCvs.height + 10;
            this.r = Math.random() * 1.5 + 0.4;
            this.vy = -(Math.random() * 0.25 + 0.08);
            this.vx = (Math.random() - 0.5) * 0.1;
            this.o = Math.random() * 0.35 + 0.1;
            this.fs = Math.random() * 0.001 + 0.0004;
        }
        update() {
            this.y += this.vy;
            this.x += this.vx;
            this.o -= this.fs;
            if (this.o <= 0 || this.y < -5) this.reset(false);
        }
        draw() {
            cCtx.save();
            cCtx.globalAlpha = this.o;
            cCtx.fillStyle = '#C9A96E';
            cCtx.shadowBlur = this.r * 3;
            cCtx.shadowColor = 'rgba(201,169,110,0.2)';
            cCtx.beginPath();
            cCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            cCtx.fill();
            cCtx.restore();
        }
    }

    function initClosing() {
        sizeClosing();
        cParts = [];
        const n = Math.min(Math.floor(cCvs.width * cCvs.height / 25000), 35);
        for (let i = 0; i < n; i++) cParts.push(new CP());
    }

    function animClosing() {
        cCtx.clearRect(0, 0, cCvs.width, cCvs.height);
        cParts.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animClosing);
    }

    initClosing();
    animClosing();

    // ============================================
    // COUNTDOWN
    // ============================================
    const WEDDING = new Date('2026-12-13T12:00:00+05:30').getTime();
    const TOTAL_DAYS = Math.ceil((WEDDING - Date.now()) / 86400000);

    function updateCountdown() {
        const diff = WEDDING - Date.now();
        if (diff <= 0) return;
        const days = Math.ceil(diff / 86400000);
        document.getElementById('cdDays').textContent = days;

        // Ring progress (max 365 days)
        const progress = Math.max(0, 1 - days / 365);
        const circumference = 2 * Math.PI * 90;
        const offset = circumference * (1 - progress);
        document.getElementById('cdProgress').style.strokeDashoffset = offset;
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);

    // ============================================
    // DOOR OPEN
    // ============================================
    function openDoor() {
        if (doorOpened) return;
        doorOpened = true;
        door.classList.add('opening');

        // Play music
        bgMusic.volume = 0.25;
        bgMusic.play().then(() => {
            musicPlaying = true;
            updateMusicIcon();
        }).catch(() => {});

        setTimeout(() => {
            door.classList.add('opened');
            inside.classList.add('visible');
        }, 800);
    }

    door.addEventListener('click', openDoor);
    door.addEventListener('touchend', e => { e.preventDefault(); openDoor(); });

    // ============================================
    // MUSIC
    // ============================================
    function updateMusicIcon() {
        musicBtn.querySelector('.m-on').style.display = musicPlaying ? 'block' : 'none';
        musicBtn.querySelector('.m-off').style.display = musicPlaying ? 'none' : 'block';
    }

    musicBtn.addEventListener('click', () => {
        musicPlaying ? bgMusic.pause() : bgMusic.play();
        musicPlaying = !musicPlaying;
        updateMusicIcon();
    });

    // ============================================
    // SLIDE NAVIGATION
    // ============================================
    const allSlides = document.querySelectorAll('.slide');
    let slideAnims = {};

    function goToSlide(index) {
        if (index < 0 || index >= TOTAL_SLIDES || index === currentSlide || isTransitioning) return;
        isTransitioning = true;

        const prev = allSlides[currentSlide];
        const next = allSlides[index];
        const dir = index > currentSlide ? 1 : -1;

        // Animate out
        gsap.to(prev, {
            opacity: 0,
            x: -60 * dir,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                prev.classList.remove('active');
                gsap.set(prev, { x: 0 });
            }
        });

        // Animate in
        gsap.set(next, { opacity: 0, x: 60 * dir });
        next.classList.add('active');
        gsap.to(next, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.25,
            onComplete: () => {
                isTransitioning = false;
                onSlideEnter(index);
            }
        });

        // Update dots
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');

        // Update arrows
        navPrev.disabled = index === 0;
        navNext.disabled = index === TOTAL_SLIDES - 1;

        currentSlide = index;
    }

    navPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    navNext.addEventListener('click', () => goToSlide(currentSlide + 1));

    dots.forEach(d => {
        d.addEventListener('click', () => goToSlide(parseInt(d.dataset.index)));
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        if (!inside.classList.contains('visible')) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide(currentSlide + 1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(currentSlide - 1);
    });

    // Touch swipe
    let touchStartX = 0;
    inside.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    inside.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
        }
    });

    // ============================================
    // SLIDE ENTER ANIMATIONS
    // ============================================
    function onSlideEnter(index) {
        switch (index) {
            case 0: // Stars - typewriter
                typeWriter(document.getElementById('tw1'), 'A story written in the stars...');
                break;
            case 1: // Groom
                gsap.from('.groom-name', { opacity: 0, y: 20, duration: 0.8, delay: 0.3 });
                gsap.from('.slide-groom .slide-detail', { opacity: 0, duration: 0.6, delay: 0.6 });
                gsap.from('.slide-groom .slide-location', { opacity: 0, duration: 0.6, delay: 0.8 });
                break;
            case 2: // Bride
                gsap.from('.bride-name', { opacity: 0, y: 20, duration: 0.8, delay: 0.3 });
                gsap.from('.slide-bride .slide-detail', { opacity: 0, duration: 0.6, delay: 0.6 });
                gsap.from('.slide-bride .slide-location', { opacity: 0, duration: 0.6, delay: 0.8 });
                break;
            case 3: // Union
                gsap.from('.union-names', { opacity: 0, scale: 0.9, duration: 0.8, delay: 0.3 });
                gsap.from('.slide-verse', { opacity: 0, duration: 0.6, delay: 0.8 });
                gsap.from('.slide-verse-ref', { opacity: 0, duration: 0.6, delay: 1 });
                gsap.from('.slide-verse-mal', { opacity: 0, duration: 0.6, delay: 1.2 });
                break;
            case 4: // Invitation
                gsap.from('.inv-card', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
                break;
            case 5: // Details
                gsap.from('.det-card', { opacity: 0, y: 20, duration: 0.5, stagger: 0.15, delay: 0.2 });
                gsap.from('.det-map-btn', { opacity: 0, duration: 0.5, delay: 0.7 });
                break;
            case 6: // Closing
                updateCountdown();
                gsap.from('.countdown-ring', { opacity: 0, scale: 0.8, duration: 0.8, delay: 0.2 });
                gsap.from('.closing-dua', { opacity: 0, duration: 0.6, delay: 0.6 });
                break;
        }
    }

    // ============================================
    // RESIZE
    // ============================================
    let rTimer;
    window.addEventListener('resize', () => {
        clearTimeout(rTimer);
        rTimer = setTimeout(() => {
            sizeDoor();
            sizeStars();
            sizeUnion();
            sizeClosing();
        }, 200);
    });

    // Init first slide
    navPrev.disabled = true;

})();
