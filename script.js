document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Live Clock
    const updateClock = () => {
        const now = new Date();
        const dhakaTime = now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Dhaka', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        document.getElementById('clock').textContent = dhakaTime;
    };
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Theme Toggle
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    themeBtn.addEventListener('click', () => {
        const isLight = body.getAttribute('data-theme') === 'light';
        body.setAttribute('data-theme', isLight ? 'dark' : 'light');
        themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        themeText.textContent = isLight ? 'Light' : 'Dark';
    });

    // 3. Audio Player
    const audioBtn = document.getElementById('audio-btn');
    const audio = document.getElementById('bgm');
    const wave = document.getElementById('wave');
    const status = document.getElementById('audio-status');

    audioBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            wave.classList.add('playing');
            status.textContent = "Playing";
        } else {
            audio.pause();
            wave.classList.remove('playing');
            status.textContent = "Paused";
        }
    });

    // 4. Generate Random Contribution Squares
    const statsGrid = document.getElementById('stats-grid');
    for (let i = 0; i < 28; i++) {
        const sq = document.createElement('div');
        sq.className = 'square';
        sq.style.opacity = Math.random() * 0.9 + 0.1;
        statsGrid.appendChild(sq);
    }
});