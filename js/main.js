/* ============================================
   WEDDING INVITATION - JUNAID & RAFEEDA
   Main JavaScript - Countdown, Particles, Scroll
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // COUNTDOWN TIMER
    // ============================================
    const WEDDING_DATE = new Date('2026-12-13T12:00:00+05:30').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = WEDDING_DATE - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================
    // GOLD PARTICLE SYSTEM
    // ============================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = -Math.random() * 0.4 - 0.1;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.2;
            this.y += this.speedY;
            this.opacity -= this.fadeSpeed;

            if (this.opacity <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#C9A96E';
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = 'rgba(201, 169, 110, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        resizeCanvas();
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animFrame = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animFrame);
            initParticles();
            animateParticles();
        }, 250);
    });

    // ============================================
    // SCROLL REVEAL (Intersection Observer)
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // NAVIGATION DOTS
    // ============================================
    const sections = ['hero', 'countdown', 'couple', 'event', 'venue', 'closing'];
    const dots = document.querySelectorAll('.nav-dot');

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = document.getElementById(dot.dataset.section);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    function updateActiveDot() {
        let current = sections[0];
        for (const id of sections) {
            const section = document.getElementById(id);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.4) {
                    current = id;
                }
            }
        }
        dots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === current);
        });
    }

    window.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();

    // ============================================
    // HERO PARALLAX SUBTLE EFFECT
    // ============================================
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            const opacity = 1 - (scrollY / (window.innerHeight * 0.8));
            const translateY = scrollY * 0.3;
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
    }, { passive: true });

    // ============================================
    // ISLAMIC PATTERN BORDER ANIMATION
    // ============================================
    const patternDividers = document.querySelectorAll('.islamic-pattern-divider');

    const patternObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.pattern-line').forEach((line, i) => {
                    line.style.transition = `width 0.8s ease ${i * 0.2}s`;
                    line.style.width = '80px';
                });
            }
        });
    }, { threshold: 0.5 });

    patternDividers.forEach(div => {
        div.querySelectorAll('.pattern-line').forEach(line => {
            line.style.width = '0px';
        });
        patternObserver.observe(div);
    });

})();
