document.addEventListener('DOMContentLoaded', () => {
  const clock = document.getElementById('clock');
  if (clock) {
    const update = () => {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    };
    update();
    setInterval(update, 1000);
  }

  const themeBtn = document.getElementById('theme-btn');
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  themeBtn?.addEventListener('click', () => {
    const isLight = body.getAttribute('data-theme') === 'light';
    body.setAttribute('data-theme', isLight ? 'dark' : 'light');
    if (themeIcon) themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    if (themeText) themeText.textContent = isLight ? 'Light' : 'Dark';
  });

  const audioBtn = document.getElementById('audio-btn');
  const audio = document.getElementById('bgm');
  const status = document.getElementById('audio-status');
  audioBtn?.addEventListener('click', () => {
    if (!audio) return;
    if (audio.paused) { audio.play(); if (status) status.textContent = 'Playing'; }
    else { audio.pause(); if (status) status.textContent = 'Paused'; }
  });
});
