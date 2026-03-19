document.addEventListener('DOMContentLoaded', () => {
  const clock = document.getElementById('clock');
  const update = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };
  update();
  setInterval(update, 1000);

  const themeBtn = document.getElementById('theme-btn');
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  themeBtn?.addEventListener('click', () => {
    const isLight = body.getAttribute('data-theme') === 'light';
    body.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    themeText.textContent = isLight ? 'Light' : 'Dark';
  });

  const btn = document.getElementById('audio-btn');
  const audio = document.getElementById('bgm');
  const status = document.getElementById('audio-status');
  btn?.addEventListener('click', () => {
    if (audio.paused) { audio.play(); status.textContent = 'Playing'; }
    else { audio.pause(); status.textContent = 'Paused'; }
  });
});
