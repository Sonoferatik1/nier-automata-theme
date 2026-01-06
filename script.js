// NieR: Automata Inspired Interactive Elements

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive features
    initGlitchEffect();
    initButtonEffects();
    initTerminalAnimation();
    initRandomGlitches();
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

// Enhanced glitch effect on hover
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'glitch 0.3s infinite';
            }, 10);
        });

        element.addEventListener('mouseleave', () => {
            element.style.animation = 'glitch 2s infinite';
        });
    });
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

// Random glitch effects
function initRandomGlitches() {
    // Random glitch on data cards
    const dataCards = document.querySelectorAll('.data-card');

    setInterval(() => {
        const randomCard = dataCards[Math.floor(Math.random() * dataCards.length)];
        if (randomCard) {
            randomCard.style.transform = 'translateX(2px)';
            setTimeout(() => {
                randomCard.style.transform = 'translateX(-2px)';
            }, 50);
            setTimeout(() => {
                randomCard.style.transform = 'translateX(0)';
            }, 100);
        }
    }, 5000);

    // Random text glitch
    const textElements = document.querySelectorAll('.panel-content p, .card-body p');

    setInterval(() => {
        const randomText = textElements[Math.floor(Math.random() * textElements.length)];
        if (randomText) {
            const originalText = randomText.textContent;
            const glitchedText = glitchText(originalText);
            randomText.textContent = glitchedText;

            setTimeout(() => {
                randomText.textContent = originalText;
            }, 100);
        }
    }, 8000);
}

// Helper function to create glitched text
function glitchText(text) {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    const chars = text.split('');
    const numGlitches = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numGlitches; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        chars[randomIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }

    return chars.join('');
}

// Konami code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const terminalBody = document.querySelector('.terminal-body');
    const easterEggLine = document.createElement('p');
    easterEggLine.className = 'terminal-line';
    easterEggLine.innerHTML = `<span class="prompt">></span> <span style="color: #d4c5a9; font-weight: bold;">GLORY TO MANKIND</span>`;
    easterEggLine.style.opacity = '0';

    terminalBody.appendChild(easterEggLine);

    setTimeout(() => {
        easterEggLine.style.opacity = '1';
    }, 10);

    // Flash effect
    document.body.style.transition = 'background-color 0.1s';
    document.body.style.backgroundColor = '#d4c5a9';
    setTimeout(() => {
        document.body.style.backgroundColor = '#0a0a0a';
    }, 100);
}

// Cursor trail effect
let mouseX = 0;
let mouseY = 0;
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(212, 197, 169, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.1s ease;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX - 10}px`;
    cursor.style.top = `${mouseY - 10}px`;
});

// Pulse cursor on click
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(1.5)';
    cursor.style.borderColor = 'rgba(212, 197, 169, 1)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.borderColor = 'rgba(212, 197, 169, 0.5)';
});
