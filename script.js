// Clean Developer Blog Interactive Elements

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive features
    initButtonEffects();
    initTerminalAnimation();
    initSmoothHovers();
});

// Terminal typing animation
function initTerminalAnimation() {
    const terminalLines = document.querySelectorAll('.terminal-line');

    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.opacity = '1';
        }, index * 300);
    });
}

// Smooth hover interactions
function initSmoothHovers() {
    const cards = document.querySelectorAll('.data-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Button interaction effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.nier-button');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);

            // Log action to terminal
            logToTerminal(button.textContent);
        });
    });

    // Add ripple animation
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Log button actions to terminal
function logToTerminal(action) {
    const terminalBody = document.querySelector('.terminal-body');
    const newLine = document.createElement('p');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `<span class="prompt">></span> Command executed: ${action}`;
    newLine.style.opacity = '0';

    terminalBody.appendChild(newLine);

    // Fade in new line
    setTimeout(() => {
        newLine.style.opacity = '1';
    }, 10);

    // Keep terminal scrolled to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;

    // Remove old lines if too many
    const lines = terminalBody.querySelectorAll('.terminal-line');
    if (lines.length > 10) {
        lines[0].style.transition = 'opacity 0.3s';
        lines[0].style.opacity = '0';
        setTimeout(() => lines[0].remove(), 300);
    }
}

// Smooth cursor effect
let mouseX = 0;
let mouseY = 0;
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, var(--accent-color), var(--accent-secondary));
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
    opacity: 0.6;
    mix-blend-mode: screen;
`;
document.body.appendChild(cursor);

let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor follow animation
function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.left = `${cursorX - 4}px`;
    cursor.style.top = `${cursorY - 4}px`;

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Pulse cursor on click
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(2)';
    cursor.style.opacity = '1';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.opacity = '0.6';
});

// Hide cursor when hovering over interactive elements
const interactiveElements = document.querySelectorAll('button, a, .data-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.opacity = '0.6';
    });
});
