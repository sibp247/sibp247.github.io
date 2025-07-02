document.addEventListener('DOMContentLoaded', () => {

    // Check for touch device to disable custom cursor
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        const cursor = document.querySelector('.cursor');
        const interactiveElements = document.querySelectorAll('a, button');

        // Follow mouse position
        window.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // Add hover effect class to cursor
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-grow');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-grow');
            });
        });
    }
});