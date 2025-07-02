document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    const getSetting = (key, defaultValue) => localStorage.getItem(key) ?? defaultValue;
    const setSetting = (key, value) => localStorage.setItem(key, value);

    // --- DOM ELEMENT SELECTION ---
    const body = document.body;
    const preloader = document.getElementById('preloader');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsMenu = document.getElementById('settings-menu');
    const themeToggleButton = document.getElementById('theme-toggle');
    const muteToggleButton = document.getElementById('mute-toggle');
    const particlesToggle = document.getElementById('particles-toggle');
    const cursorToggle = document.getElementById('cursor-toggle');
    const backgroundAudio = document.getElementById('background-audio');
    const cursor = document.querySelector('.cursor');
    const particleCanvas = document.getElementById('particle-canvas');
    
    // --- PRELOADER ---
    window.addEventListener('load', () => preloader.classList.add('loaded'));

    // --- SETTINGS PANEL ---
    settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsMenu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!settingsMenu.contains(e.target) && !settingsToggle.contains(e.target)) {
            settingsMenu.classList.remove('active');
        }
    });

    // --- THEME SWITCHER ---
    const applyTheme = (theme) => {
        body.dataset.theme = theme;
        setSetting('theme', theme);
    };
    themeToggleButton.addEventListener('click', () => {
        const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // --- BACKGROUND AUDIO ---
    const unmuteIcon = '<i class="fas fa-volume-high"></i>';
    const muteIcon = '<i class="fas fa-volume-xmark"></i>';
    let isAudioPlaying = false;
    
    const startAudio = () => {
        const audioMuted = getSetting('audioMuted', 'true') === 'true';
        if (!audioMuted) {
            backgroundAudio.volume = 0.2;
            backgroundAudio.play().then(() => {
                isAudioPlaying = true;
                muteToggleButton.innerHTML = unmuteIcon;
            }).catch(e => console.error("Audio autoplay failed.", e));
        }
        document.removeEventListener('click', startAudio);
    };
    document.addEventListener('click', startAudio);

    muteToggleButton.addEventListener('click', () => {
        isAudioPlaying = !isAudioPlaying;
        if (isAudioPlaying) {
            backgroundAudio.play();
            muteToggleButton.innerHTML = unmuteIcon;
        } else {
            backgroundAudio.pause();
            muteToggleButton.innerHTML = muteIcon;
        }
        setSetting('audioMuted', !isAudioPlaying);
    });
    
    // --- FIXED & ENHANCED: CUSTOM CURSOR ---
    const applyCursor = (enabled) => {
        body.classList.toggle('custom-cursor-disabled', !enabled);
        cursorToggle.checked = enabled;
        setSetting('customCursor', enabled);
    };
    cursorToggle.addEventListener('change', () => applyCursor(cursorToggle.checked));
    
    // List of elements that should trigger the cursor's 'hover' state
    const interactiveElements = 'a, button, .project-card, .slider, .settings-gear, .control-btn, .theme-toggle-btn';

    // Event listener for mouse movement
    document.addEventListener('mousemove', e => {
        if (cursor) {
            // Use clientX/Y for position:fixed elements. This is the main fix for the gap.
            cursor.style.top = e.clientY + 'px';
            cursor.style.left = e.clientX + 'px';
        }
    });

    // Event listeners to add/remove the 'hover' class from the cursor
    document.addEventListener('mouseover', e => {
        // Use .closest() to check if the target or its parent is interactive
        if (e.target.closest(interactiveElements)) {
            cursor.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(interactiveElements)) {
            cursor.classList.remove('hover');
        }
    });


    // --- PARTICLE EFFECT ---
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    };

    const createParticles = () => {
        particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 80;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5
            });
        }
    };
    
    const animateParticles = () => {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        ctx.fillStyle = getComputedStyle(body).getPropertyValue('--primary-text-color') + '33'; // Faintly colored particles

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        animationFrameId = requestAnimationFrame(animateParticles);
    };

    const applyParticles = (enabled) => {
        particlesToggle.checked = enabled;
        setSetting('particlesEnabled', enabled);
        if (enabled) {
            particleCanvas.style.opacity = '1';
            resizeCanvas();
            createParticles();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animateParticles();
        } else {
            particleCanvas.style.opacity = '0';
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };
    particlesToggle.addEventListener('change', () => applyParticles(particlesToggle.checked));
    window.addEventListener('resize', () => { if(particlesToggle.checked) { resizeCanvas(); createParticles(); }});

    // --- INITIALIZE SETTINGS ON PAGE LOAD ---
    const initializeSettings = () => {
        // Theme
        const savedTheme = getSetting('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(savedTheme);

        // Audio
        const audioMuted = getSetting('audioMuted', 'true') === 'true';
        muteToggleButton.innerHTML = audioMuted ? muteIcon : unmuteIcon;
        isAudioPlaying = !audioMuted;

        // Cursor
        const cursorEnabled = getSetting('customCursor', 'true') === 'true';
        applyCursor(cursorEnabled);

        // Particles
        const particlesEnabled = getSetting('particlesEnabled', 'true') === 'true';
        applyParticles(particlesEnabled);
    };
    initializeSettings();

    // --- SCROLL-REVEAL ANIMATIONS ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card').forEach(card => revealObserver.observe(card));
});
