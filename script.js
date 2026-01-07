// NieR: Automata Inspired Todo List Application

// State management
let todos = [];
let currentFilter = 'all';
let todoIdCounter = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTodosFromStorage();
    initializeEventListeners();
    initGlitchEffect();
    initTerminalAnimation();
    initRandomGlitches();
    renderTodos();
    updateStats();
});

// Load todos from localStorage
function loadTodosFromStorage() {
    const stored = localStorage.getItem('yorha_missions');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            todos = data.todos || [];
            todoIdCounter = data.counter || 0;
        } catch (e) {
            console.error('Failed to load missions from storage');
        }
    }
}

// Save todos to localStorage
function saveTodosToStorage() {
    try {
        localStorage.setItem('yorha_missions', JSON.stringify({
            todos: todos,
            counter: todoIdCounter
        }));
    } catch (e) {
        console.error('Failed to save missions to storage');
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    const addBtn = document.getElementById('add-todo-btn');
    const todoInput = document.getElementById('todo-input');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Add todo on button click
    addBtn.addEventListener('click', addTodo);

    // Add todo on Enter key
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
}

// Add a new todo
function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();

    if (!text) {
        // Flash the input border
        input.style.borderColor = '#ff4444';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 500);
        return;
    }

    const todo = {
        id: todoIdCounter++,
        text: text,
        completed: false,
        timestamp: new Date().toISOString()
    };

    todos.unshift(todo); // Add to beginning
    saveTodosToStorage();
    input.value = '';
    renderTodos();
    updateStats();
    logToTerminal(`Mission assigned: "${text}"`);
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodosToStorage();
        renderTodos();
        updateStats();

        const status = todo.completed ? 'COMPLETED' : 'REACTIVATED';
        logToTerminal(`Mission ${status}: "${todo.text}"`);
    }
}

// Delete a todo
function deleteTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        // Add glitch effect before deletion
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.style.transform = 'translateX(-20px)';
            element.style.opacity = '0';
            setTimeout(() => {
                todos = todos.filter(t => t.id !== id);
                saveTodosToStorage();
                renderTodos();
                updateStats();
            }, 300);
        }
        logToTerminal(`Mission terminated: "${todo.text}"`);
    }
}

// Render todos based on current filter
function renderTodos() {
    const todoList = document.getElementById('todo-list');

    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '';
        return;
    }

    todoList.innerHTML = filteredTodos.map(todo => {
        const date = new Date(todo.timestamp);
        const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <span class="todo-timestamp">${timeStr}</span>
                <button class="todo-delete" onclick="deleteTodo(${todo.id})">×</button>
            </div>
        `;
    }).join('');
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const completionPercentage = total > 0 ? (completed / total) * 100 : 0;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-active').textContent = active;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('completion-bar').style.width = `${completionPercentage}%`;
}

// Log actions to terminal
function logToTerminal(message) {
    const terminalBody = document.querySelector('.terminal-body');
    const newLine = document.createElement('p');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `<span class="prompt">></span> ${escapeHtml(message)}`;
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
    if (lines.length > 12) {
        lines[0].style.transition = 'opacity 0.3s';
        lines[0].style.opacity = '0';
        setTimeout(() => lines[0].remove(), 300);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
    logToTerminal('<span style="color: #d4c5a9; font-weight: bold;">GLORY TO MANKIND</span>');

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
