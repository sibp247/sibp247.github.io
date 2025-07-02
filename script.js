document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');

    document.addEventListener('mousemove', e => {
        // Move the cursor to the mouse position
        cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;")
    });

    document.addEventListener('click', () => {
        // Add a click animation
        cursor.classList.add("expand");
        setTimeout(() => {
            cursor.classList.remove("expand");
        }, 500);
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderWidth = '3px';
            cursor.style.backgroundColor = 'var(--accent-glow)';
        });
        el.addEventListener('mouseout', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderWidth = '2px';
            cursor.style.backgroundColor = 'transparent';
        });
    });
});
