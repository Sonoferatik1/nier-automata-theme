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

// Snake Game Implementation
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snakeGame');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;

        this.snake = [{ x: 10, y: 10 }];
        this.velocity = { x: 0, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;

        this.gameRunning = false;
        this.gamePaused = false;
        this.gameLoop = null;
        this.speed = 100;

        this.init();
    }

    init() {
        this.updateScoreDisplay();
        this.setupControls();
        this.setupKeyboardControls();
        this.draw();
    }

    setupControls() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');

        startBtn.addEventListener('click', () => this.startGame());
        pauseBtn.addEventListener('click', () => this.togglePause());
        resetBtn.addEventListener('click', () => this.resetGame());
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Prevent default for arrow keys to avoid page scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
                e.preventDefault();
            }

            // Space to start/pause
            if (e.key === ' ' && this.gameRunning) {
                this.togglePause();
                return;
            }

            // WASD controls
            if (e.key === 'w' || e.key === 'W') {
                if (this.velocity.y !== 1) this.velocity = { x: 0, y: -1 };
            }
            if (e.key === 's' || e.key === 'S') {
                if (this.velocity.y !== -1) this.velocity = { x: 0, y: 1 };
            }
            if (e.key === 'a' || e.key === 'A') {
                if (this.velocity.x !== 1) this.velocity = { x: -1, y: 0 };
            }
            if (e.key === 'd' || e.key === 'D') {
                if (this.velocity.x !== -1) this.velocity = { x: 1, y: 0 };
            }

            // Arrow key controls
            if (e.key === 'ArrowUp') {
                if (this.velocity.y !== 1) this.velocity = { x: 0, y: -1 };
            }
            if (e.key === 'ArrowDown') {
                if (this.velocity.y !== -1) this.velocity = { x: 0, y: 1 };
            }
            if (e.key === 'ArrowLeft') {
                if (this.velocity.x !== 1) this.velocity = { x: -1, y: 0 };
            }
            if (e.key === 'ArrowRight') {
                if (this.velocity.x !== -1) this.velocity = { x: 1, y: 0 };
            }
        });
    }

    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }

    startGame() {
        if (this.gameRunning) return;

        this.gameRunning = true;
        this.gamePaused = false;
        this.velocity = { x: 1, y: 0 }; // Start moving right
        this.gameLoop = setInterval(() => this.update(), this.speed);
        logToTerminal('Snake Protocol: INITIATED');
    }

    togglePause() {
        if (!this.gameRunning) return;

        this.gamePaused = !this.gamePaused;
        if (this.gamePaused) {
            clearInterval(this.gameLoop);
            logToTerminal('Snake Protocol: PAUSED');
        } else {
            this.gameLoop = setInterval(() => this.update(), this.speed);
            logToTerminal('Snake Protocol: RESUMED');
        }
    }

    resetGame() {
        clearInterval(this.gameLoop);
        this.snake = [{ x: 10, y: 10 }];
        this.velocity = { x: 0, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.updateScoreDisplay();
        this.draw();
        logToTerminal('Snake Protocol: RESET');
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameRunning = false;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            logToTerminal(`NEW HIGH SCORE: ${this.highScore}`);
        }

        this.updateScoreDisplay();

        // Flash the canvas
        this.ctx.fillStyle = 'rgba(212, 197, 169, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game over text
        this.ctx.fillStyle = '#d4c5a9';
        this.ctx.font = 'bold 30px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TERMINATED', this.canvas.width / 2, this.canvas.height / 2);

        logToTerminal(`Snake Protocol: TERMINATED - Final Score: ${this.score}`);
    }

    update() {
        if (this.gamePaused) return;

        // Move snake
        const head = {
            x: this.snake[0].x + this.velocity.x,
            y: this.snake[0].y + this.velocity.y
        };

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScoreDisplay();
            this.food = this.generateFood();
            logToTerminal(`Data packet collected. Score: ${this.score}`);
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(212, 197, 169, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }

        // Draw food (data packet)
        this.ctx.fillStyle = '#d4c5a9';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#d4c5a9';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Draw snake
        this.snake.forEach((segment, index) => {
            const gradient = this.ctx.createLinearGradient(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                segment.x * this.gridSize + this.gridSize,
                segment.y * this.gridSize + this.gridSize
            );

            if (index === 0) {
                // Head
                gradient.addColorStop(0, '#d4c5a9');
                gradient.addColorStop(1, '#a09890');
            } else {
                // Body
                const alpha = 1 - (index / this.snake.length) * 0.5;
                gradient.addColorStop(0, `rgba(212, 197, 169, ${alpha})`);
                gradient.addColorStop(1, `rgba(160, 152, 144, ${alpha})`);
            }

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw start message if game not running
        if (!this.gameRunning && this.velocity.x === 0 && this.velocity.y === 0) {
            this.ctx.fillStyle = 'rgba(212, 197, 169, 0.5)';
            this.ctx.font = '20px Orbitron';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press START to begin', this.canvas.width / 2, this.canvas.height / 2);
        }

        // Draw pause message
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(212, 197, 169, 0.7)';
            this.ctx.font = 'bold 30px Orbitron';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }
}

// Initialize Snake Game when DOM is ready
let snakeGame;
document.addEventListener('DOMContentLoaded', () => {
    snakeGame = new SnakeGame();
    initTodoList();
});

// Todo List Implementation
class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('nierTodos')) || [];
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addTodoBtn');
        this.todoList = document.getElementById('todoList');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        this.categorySelect = document.getElementById('todoCategory');
        this.prioritySelect = document.getElementById('todoPriority');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';

        this.init();
    }

    init() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.render();
            });
        });

        this.render();
    }

    addTodo() {
        const text = this.todoInput.value.trim();

        if (!text) {
            this.todoInput.style.borderColor = '#ff4444';
            setTimeout(() => {
                this.todoInput.style.borderColor = '';
            }, 1000);
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            category: this.categorySelect.value,
            priority: this.prioritySelect.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.save();
        this.render();
        this.todoInput.value = '';

        logToTerminal(`Mission objective added: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`);
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();

            const status = todo.completed ? 'COMPLETED' : 'REACTIVATED';
            logToTerminal(`Mission objective ${status}: ${todo.text.substring(0, 30)}${todo.text.length > 30 ? '...' : ''}`);
        }
    }

    deleteTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        const todoElement = document.querySelector(`[data-todo-id="${id}"]`);

        if (todoElement) {
            todoElement.classList.add('removing');
            setTimeout(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                this.save();
                this.render();

                if (todo) {
                    logToTerminal(`Mission objective terminated: ${todo.text.substring(0, 30)}${todo.text.length > 30 ? '...' : ''}`);
                }
            }, 300);
        }
    }

    save() {
        localStorage.setItem('nierTodos', JSON.stringify(this.todos));
    }

    getFilteredTodos() {
        if (this.currentFilter === 'all') {
            return this.todos;
        }
        return this.todos.filter(todo => todo.category === this.currentFilter);
    }

    render() {
        this.todoList.innerHTML = '';

        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            const message = this.currentFilter === 'all'
                ? 'No mission objectives assigned. Awaiting input...'
                : `No mission objectives in ${this.currentFilter.toUpperCase()} category.`;
            this.todoList.innerHTML = `
                <div class="todo-empty">
                    ${message}
                </div>
            `;
        } else {
            filteredTodos.forEach(todo => {
                const li = this.createTodoElement(todo);
                this.todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`;
        li.setAttribute('data-todo-id', todo.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'todo-meta';

        const categorySpan = document.createElement('span');
        categorySpan.className = 'todo-category';
        categorySpan.textContent = todo.category.toUpperCase();
        categorySpan.setAttribute('data-category', todo.category);

        const prioritySpan = document.createElement('span');
        prioritySpan.className = 'todo-priority';
        prioritySpan.textContent = todo.priority.toUpperCase();
        prioritySpan.setAttribute('data-priority', todo.priority);

        metaDiv.appendChild(categorySpan);
        metaDiv.appendChild(prioritySpan);

        contentDiv.appendChild(span);
        contentDiv.appendChild(metaDiv);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.textContent = 'DELETE';
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        return li;
    }

    updateStats() {
        const active = this.todos.filter(t => !t.completed).length;
        const completed = this.todos.filter(t => t.completed).length;

        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
    }
}

// Initialize Todo List
function initTodoList() {
    new TodoList();
}
