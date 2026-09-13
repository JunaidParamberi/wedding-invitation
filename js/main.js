/* ============================================
   CINEMATIC WEDDING INVITATION - Main JS
   GSAP + Lenis + Typewriter + Particles + Door
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // LENIS SMOOTH SCROLL
    // ============================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ============================================
    // TYPEWRITER EFFECT
    // ============================================
    function typeWriter(element, text, speed = 60) {
        return new Promise((resolve) => {
            let i = 0;
            element.textContent = '';
            const cursor = element.nextElementSibling;
            if (cursor) cursor.style.display = 'inline';

            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed + Math.random() * 40);
                } else {
                    setTimeout(() => {
                        if (cursor) cursor.style.display = 'none';
                        resolve();
                    }, 800);
                }
            }
            type();
        });
    }

    // ============================================
    // DOOR PARTICLES
    // ============================================
    const doorCanvas = document.getElementById('doorParticles');
    const doorCtx = doorCanvas.getContext('2d');
    let doorParticles = [];

    function resizeDoorCanvas() {
        doorCanvas.width = window.innerWidth;
        doorCanvas.height = window.innerHeight;
    }

    class DoorParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * doorCanvas.width;
            this.y = doorCanvas.height + Math.random() * 20;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.5 + 0.15);
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.002 + 0.001;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0 || this.y < -10) this.reset();
        }
        draw() {
            doorCtx.save();
            doorCtx.globalAlpha = this.opacity;
            doorCtx.fillStyle = '#C9A96E';
            doorCtx.shadowBlur = this.size * 4;
            doorCtx.shadowColor = 'rgba(201, 169, 110, 0.3)';
            doorCtx.beginPath();
            doorCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            doorCtx.fill();
            doorCtx.restore();
        }
    }

    function initDoorParticles() {
        resizeDoorCanvas();
        doorParticles = [];
        const count = Math.min(Math.floor((doorCanvas.width * doorCanvas.height) / 18000), 60);
        for (let i = 0; i < count; i++) {
            const p = new DoorParticle();
            p.y = Math.random() * doorCanvas.height;
            doorParticles.push(p);
        }
    }

    function animateDoorParticles() {
        doorCtx.clearRect(0, 0, doorCanvas.width, doorCanvas.height);
        doorParticles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateDoorParticles);
    }

    initDoorParticles();
    animateDoorParticles();

    // ============================================
    // STARS CANVAS (Chapter 1)
    // ============================================
    const starsCanvas = document.getElementById('starsCanvas');
    const starsCtx = starsCanvas.getContext('2d');
    let stars = [];

    function resizeStarsCanvas() {
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;
    }

    function initStars() {
        resizeStarsCanvas();
        stars = [];
        const count = Math.min(Math.floor((starsCanvas.width * starsCanvas.height) / 8000), 200);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * starsCanvas.width,
                y: Math.random() * starsCanvas.height,
                size: Math.random() * 1.5 + 0.3,
                twinkleSpeed: Math.random() * 0.03 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                baseOpacity: Math.random() * 0.6 + 0.2,
            });
        }
    }

    function animateStars(time) {
        starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
        stars.forEach(s => {
            const opacity = s.baseOpacity + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.3;
            starsCtx.save();
            starsCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
            starsCtx.fillStyle = '#E8E0D4';
            starsCtx.beginPath();
            starsCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            starsCtx.fill();
            starsCtx.restore();
        });
        requestAnimationFrame(animateStars);
    }

    initStars();
    animateStars(0);

    // ============================================
    // CONSTELLATION CANVAS (Chapter 4)
    // ============================================
    const constCanvas = document.getElementById('constellationCanvas');
    const constCtx = constCanvas.getContext('2d');
    let constellations = [];

    function resizeConstCanvas() {
        constCanvas.width = window.innerWidth;
        constCanvas.height = window.innerHeight;
    }

    function initConstellations() {
        resizeConstCanvas();
        constellations = [];
        const count = Math.min(Math.floor((constCanvas.width * constCanvas.height) / 12000), 100);
        for (let i = 0; i < count; i++) {
            constellations.push({
                x: Math.random() * constCanvas.width,
                y: Math.random() * constCanvas.height,
                size: Math.random() * 1.8 + 0.4,
                speed: Math.random() * 0.15 + 0.05,
                angle: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.5 + 0.2,
                pulse: Math.random() * 0.02 + 0.005,
            });
        }
    }

    function drawConstellations(time) {
        constCtx.clearRect(0, 0, constCanvas.width, constCanvas.height);

        // Draw connecting lines between nearby stars
        for (let i = 0; i < constellations.length; i++) {
            for (let j = i + 1; j < constellations.length; j++) {
                const dx = constellations[i].x - constellations[j].x;
                const dy = constellations[i].y - constellations[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    constCtx.save();
                    constCtx.globalAlpha = (1 - dist / 120) * 0.1;
                    constCtx.strokeStyle = '#C9A96E';
                    constCtx.lineWidth = 0.5;
                    constCtx.beginPath();
                    constCtx.moveTo(constellations[i].x, constellations[i].y);
                    constCtx.lineTo(constellations[j].x, constellations[j].y);
                    constCtx.stroke();
                    constCtx.restore();
                }
            }
        }

        // Draw stars
        constellations.forEach(s => {
            s.angle += s.pulse;
            const opacity = s.opacity + Math.sin(s.angle) * 0.2;
            constCtx.save();
            constCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
            constCtx.fillStyle = '#C9A96E';
            constCtx.shadowBlur = s.size * 3;
            constCtx.shadowColor = 'rgba(201, 169, 110, 0.3)';
            constCtx.beginPath();
            constCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            constCtx.fill();
            constCtx.restore();

            // Drift
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            if (s.x < -10) s.x = constCanvas.width + 10;
            if (s.x > constCanvas.width + 10) s.x = -10;
            if (s.y < -10) s.y = constCanvas.height + 10;
            if (s.y > constCanvas.height + 10) s.y = -10;
        });

        requestAnimationFrame(drawConstellations);
    }

    initConstellations();
    drawConstellations(0);

    // ============================================
    // CLOSING PARTICLES
    // ============================================
    const closingCanvas = document.getElementById('closingParticles');
    const closingCtx = closingCanvas.getContext('2d');
    let closingParticles = [];

    function resizeClosingCanvas() {
        closingCanvas.width = window.innerWidth;
        closingCanvas.height = window.innerHeight;
    }

    class ClosingParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * closingCanvas.width;
            this.y = closingCanvas.height + 20;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.3 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.fadeSpeed = Math.random() * 0.001 + 0.0005;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0 || this.y < -10) this.reset();
        }
        draw() {
            closingCtx.save();
            closingCtx.globalAlpha = this.opacity;
            closingCtx.fillStyle = '#C9A96E';
            closingCtx.shadowBlur = this.size * 3;
            closingCtx.shadowColor = 'rgba(201, 169, 110, 0.2)';
            closingCtx.beginPath();
            closingCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            closingCtx.fill();
            closingCtx.restore();
        }
    }

    function initClosingParticles() {
        resizeClosingCanvas();
        closingParticles = [];
        const count = Math.min(Math.floor((closingCanvas.width * closingCanvas.height) / 20000), 40);
        for (let i = 0; i < count; i++) {
            const p = new ClosingParticle();
            p.y = Math.random() * closingCanvas.height;
            closingParticles.push(p);
        }
    }

    function animateClosingParticles() {
        closingCtx.clearRect(0, 0, closingCanvas.width, closingCanvas.height);
        closingParticles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateClosingParticles);
    }

    initClosingParticles();
    animateClosingParticles();

    // ============================================
    // COUNTDOWN TIMER
    // ============================================
    const WEDDING_DATE = new Date('2026-12-13T12:00:00+05:30').getTime();

    function updateCountdown() {
        const now = Date.now();
        const diff = WEDDING_DATE - now;
        if (diff <= 0) return;

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);

        document.getElementById('fcDays').textContent = days;
        document.getElementById('fcHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('fcMins').textContent = String(mins).padStart(2, '0');
        document.getElementById('fcSecs').textContent = String(secs).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================
    // DOOR OPEN INTERACTION
    // ============================================
    const doorScene = document.getElementById('doorScene');
    const storyWrapper = document.getElementById('storyWrapper');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let doorOpened = false;
    let musicPlaying = false;

    function openDoor() {
        if (doorOpened) return;
        doorOpened = true;

        doorScene.classList.add('opening');

        // Start music
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicToggle.classList.add('visible');
            updateMusicIcon();
        }).catch(() => {
            // Autoplay blocked - show toggle anyway
            musicToggle.classList.add('visible');
        });

        // After door animation, hide door and show story
        setTimeout(() => {
            doorScene.classList.add('hidden');
            storyWrapper.classList.add('visible');
            lenis.start();

            // Trigger first chapter typewriter after a beat
            setTimeout(() => {
                startChapter1();
            }, 600);
        }, 1400);
    }

    doorScene.addEventListener('click', openDoor);
    doorScene.addEventListener('touchend', (e) => {
        e.preventDefault();
        openDoor();
    });

    // ============================================
    // MUSIC TOGGLE
    // ============================================
    function updateMusicIcon() {
        const on = musicToggle.querySelector('.music-on');
        const off = musicToggle.querySelector('.music-off');
        if (musicPlaying) {
            on.style.display = 'block';
            off.style.display = 'none';
        } else {
            on.style.display = 'none';
            off.style.display = 'block';
        }
    }

    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
        } else {
            bgMusic.play();
            musicPlaying = true;
        }
        updateMusicIcon();
    });

    // ============================================
    // SCROLL PROGRESS
    // ============================================
    const progressFill = document.getElementById('progressFill');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressFill.style.width = progress + '%';
    }, { passive: true });

    // ============================================
    // GSAP SCROLL ANIMATIONS
    // ============================================
    gsap.registerPlugin(ScrollTrigger);

    // Chapter 1: Typewriter
    let ch1Started = false;
    function startChapter1() {
        if (ch1Started) return;
        ch1Started = true;
        const el = document.getElementById('tw1');
        typeWriter(el, 'A story written in the stars...', 70);
    }

    // Chapter 2: Groom reveal
    ScrollTrigger.create({
        trigger: '#ch2',
        start: 'top 70%',
        onEnter: () => {
            document.querySelector('.groom-reveal').classList.add('visible');
        },
    });

    // Chapter 3: Bride reveal
    ScrollTrigger.create({
        trigger: '#ch3',
        start: 'top 70%',
        onEnter: () => {
            document.querySelector('.bride-reveal').classList.add('visible');
        },
    });

    // Chapter 4: Union
    let ch4Started = false;
    ScrollTrigger.create({
        trigger: '#ch4',
        start: 'top 60%',
        onEnter: () => {
            if (!ch4Started) {
                ch4Started = true;
                const el = document.getElementById('tw2');
                typeWriter(el, 'And then... their paths crossed.', 60).then(() => {
                    setTimeout(() => {
                        document.getElementById('unionNames').classList.add('visible');
                        setTimeout(() => {
                            document.getElementById('unionVerse').classList.add('visible');
                            document.getElementById('unionVerseRef').classList.add('visible');
                            document.getElementById('unionVerseMal').classList.add('visible');
                        }, 600);
                    }, 400);
                });
            }
        },
    });

    // Chapter 5: Invitation card
    ScrollTrigger.create({
        trigger: '#ch5',
        start: 'top 60%',
        onEnter: () => {
            document.getElementById('invitationCard').classList.add('visible');
        },
    });

    // Chapter 6: Detail cards
    ScrollTrigger.create({
        trigger: '#ch6',
        start: 'top 60%',
        onEnter: () => {
            document.querySelectorAll('.detail-card').forEach((card, i) => {
                setTimeout(() => card.classList.add('visible'), i * 200);
            });
            setTimeout(() => {
                document.getElementById('venueMap').classList.add('visible');
            }, 600);
        },
    });

    // ============================================
    // RESIZE HANDLER
    // ============================================
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeDoorCanvas();
            resizeStarsCanvas();
            resizeConstCanvas();
            resizeClosingCanvas();
        }, 250);
    });

})();
