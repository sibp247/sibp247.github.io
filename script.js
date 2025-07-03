// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('loaded');
        // Ensure it's fully gone after transition
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // --- SETTINGS & LOCALSTORAGE ---
    const settings = {
        theme: localStorage.getItem('theme') || 'dark',
        sound: localStorage.getItem('sound') === 'true', // false by default
        particles: localStorage.getItem('particles') === 'true', // false by default
        cursor: localStorage.getItem('cursor') === 'true' // false by default
    };

    // --- DOM ELEMENT SELECTORS ---
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const muteToggle = document.getElementById('mute-toggle');
    const particlesToggle = document.getElementById('particles-toggle');
    const cursorToggle = document.getElementById('cursor-toggle');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsContainer = document.querySelector('.settings-container');
    const backgroundAudio = document.getElementById('background-audio');

    // --- INITIALIZATION ---
    function applyInitialSettings() {
        // Theme
        body.setAttribute('data-theme', settings.theme);

        // Sound
        backgroundAudio.muted = !settings.sound;
        updateMuteIcon();
        // Try to play audio after first user interaction
        document.addEventListener('click', playAudioOnce, { once: true });

        // Particles
        particlesToggle.checked = settings.particles;
        if (settings.particles) {
            initParticles();
        }

        // Cursor
        cursorToggle.checked = settings.cursor;
        if (settings.cursor) {
            initCustomCursor();
        }
    }
    
    // --- SETTINGS PANEL ---
    settingsToggle.addEventListener('click', () => {
        settingsContainer.classList.toggle('open');
    });

    // Close settings menu if clicking outside of it
    document.addEventListener('click', (e) => {
        if (!settingsContainer.contains(e.target)) {
            settingsContainer.classList.remove('open');
        }
    });


    // --- THEME TOGGLE ---
    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        settings.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        // Particle colors might need to be updated
        if (particlesActive) {
            stopParticles();
            initParticles();
        }
    });

    // --- AUDIO CONTROLS ---
    function playAudioOnce() {
        if (!settings.sound) return;
        backgroundAudio.play().catch(error => console.log("Audio autoplay was prevented. User needs to interact more."));
    }

    function updateMuteIcon() {
        const icon = muteToggle.querySelector('i');
        if (backgroundAudio.muted) {
            icon.classList.remove('fa-volume-high');
            icon.classList.add('fa-volume-xmark');
        } else {
            icon.classList.remove('fa-volume-xmark');
            icon.classList.add('fa-volume-high');
        }
    }

    muteToggle.addEventListener('click', () => {
        backgroundAudio.muted = !backgroundAudio.muted;
        settings.sound = !backgroundAudio.muted;
        localStorage.setItem('sound', settings.sound);
        updateMuteIcon();
        if (!backgroundAudio.muted && backgroundAudio.paused) {
            backgroundAudio.play();
        }
    });


    // --- CUSTOM CURSOR ---
    let cursorHandler = null;
    function initCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .switch, .settings-toggle');

        cursor.style.display = 'block';
        body.classList.add('hide-cursor');

        cursorHandler = (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        };
        window.addEventListener('mousemove', cursorHandler);

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    }

    function destroyCustomCursor() {
        const cursor = document.querySelector('.cursor');
        cursor.style.display = 'none';
        body.classList.remove('hide-cursor');
        if (cursorHandler) {
            window.removeEventListener('mousemove', cursorHandler);
            cursorHandler = null;
        }
    }

    cursorToggle.addEventListener('change', () => {
        settings.cursor = cursorToggle.checked;
        localStorage.setItem('cursor', settings.cursor);
        if (settings.cursor) {
            initCustomCursor();
        } else {
            destroyCustomCursor();
        }
    });


    // --- PARTICLE BACKGROUND ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let particlesActive = false;
    let mouse = { x: null, y: null };

    function getParticleColor() {
        const currentTheme = body.getAttribute('data-theme');
        return currentTheme === 'dark' ? 'rgba(88, 166, 255, 0.5)' : 'rgba(0, 123, 255, 0.5)';
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = getParticleColor();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if(distance < 100){
                this.x -= dx/20;
                this.y -= dy/20;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        canvas.style.opacity = '1';
        particlesActive = true;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
        animateParticles();

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', updateMousePosition);
    }
    
    function updateMousePosition(e) {
        mouse.x = e.x;
        mouse.y = e.y;
    }

    function resizeCanvas() {
        stopParticles();
        initParticles();
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    function stopParticles() {
        particlesActive = false;
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = '0';
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', updateMousePosition);
    }

    particlesToggle.addEventListener('change', () => {
        settings.particles = particlesToggle.checked;
        localStorage.setItem('particles', settings.particles);
        if (settings.particles) {
            initParticles();
        } else {
            stopParticles();
        }
    });

    // --- KICK EVERYTHING OFF ---
    applyInitialSettings();
});
