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

        this.init();
    }

    init() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
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

    render() {
        this.todoList.innerHTML = '';

        if (this.todos.length === 0) {
            this.todoList.innerHTML = `
                <div class="todo-empty">
                    No mission objectives assigned. Awaiting input...
                </div>
            `;
        } else {
            this.todos.forEach(todo => {
                const li = this.createTodoElement(todo);
                this.todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-todo-id', todo.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.textContent = 'DELETE';
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(span);
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

// Go Game Implementation
class GoGame {
    constructor() {
        this.canvas = document.getElementById('goGame');
        this.ctx = this.canvas.getContext('2d');
        this.boardSize = 9; // 9x9 board for quicker games
        this.cellSize = this.canvas.width / (this.boardSize + 1);

        this.board = []; // 0 = empty, 1 = black (human), 2 = white (AI)
        this.boardHistory = []; // For ko rule
        this.captures = { black: 0, white: 0 };

        this.currentPlayer = 1; // 1 = black (human), 2 = white (AI)
        this.gameRunning = false;
        this.passCount = 0;
        this.consecutivePasses = 0;
        this.aiThinking = false;

        this.init();
    }

    init() {
        this.setupControls();
        this.setupCanvasClick();
        this.drawBoard();
    }

    setupControls() {
        const startBtn = document.getElementById('goStartBtn');
        const passBtn = document.getElementById('goPassBtn');
        const resetBtn = document.getElementById('goResetBtn');

        startBtn.addEventListener('click', () => this.startGame());
        passBtn.addEventListener('click', () => this.pass());
        resetBtn.addEventListener('click', () => this.resetGame());
    }

    setupCanvasClick() {
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameRunning || this.currentPlayer !== 1 || this.aiThinking) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Convert to grid coordinates
            const col = Math.round(x / this.cellSize - 1);
            const row = Math.round(y / this.cellSize - 1);

            if (col >= 0 && col < this.boardSize && row >= 0 && row < this.boardSize) {
                this.makeMove(row, col);
            }
        });
    }

    startGame() {
        if (this.gameRunning) return;

        this.resetBoard();
        this.gameRunning = true;
        this.consecutivePasses = 0;
        this.currentPlayer = 1;
        this.drawBoard();
        this.updateDisplay();
        logToTerminal('Go Protocol: INITIATED');
    }

    resetGame() {
        this.resetBoard();
        this.gameRunning = false;
        this.consecutivePasses = 0;
        this.captures = { black: 0, white: 0 };
        this.drawBoard();
        this.updateDisplay();
        logToTerminal('Go Protocol: RESET');
    }

    resetBoard() {
        this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(0));
        this.boardHistory = [];
        this.currentPlayer = 1;
        this.passCount = 0;
    }

    makeMove(row, col) {
        // Check if cell is empty
        if (this.board[row][col] !== 0) return false;

        // Temporarily place the stone
        const player = this.currentPlayer;
        const opponent = player === 1 ? 2 : 1;
        this.board[row][col] = player;

        // Check for captures
        const captured = this.checkCaptures(row, col, opponent);
        const capturedCount = captured.length;

        // Check if the move is suicidal (no liberties after captures)
        const liberties = this.getLiberties(row, col);
        if (liberties === 0 && capturedCount === 0) {
            // Suicide move, revert
            this.board[row][col] = 0;
            return false;
        }

        // Check for ko rule
        const boardState = JSON.stringify(this.board);
        if (this.boardHistory.includes(boardState)) {
            // Ko violation, revert
            this.board[row][col] = 0;
            // Restore captured stones
            captured.forEach(([r, c]) => {
                this.board[r][c] = opponent;
            });
            return false;
        }

        // Valid move
        this.consecutivePasses = 0;
        this.boardHistory.push(boardState);
        if (this.boardHistory.length > 3) {
            this.boardHistory.shift();
        }

        // Update captures
        if (capturedCount > 0) {
            if (player === 1) {
                this.captures.black += capturedCount;
            } else {
                this.captures.white += capturedCount;
            }
            logToTerminal(`${player === 1 ? 'Human' : 'AI'} captured ${capturedCount} stone${capturedCount > 1 ? 's' : ''}`);
        }

        // Switch player
        this.currentPlayer = opponent;
        this.drawBoard();
        this.updateDisplay();

        // AI's turn
        if (this.currentPlayer === 2 && this.gameRunning) {
            this.aiThinking = true;
            setTimeout(() => this.aiMove(), 500);
        }

        return true;
    }

    checkCaptures(row, col, opponent) {
        const captured = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;

            if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                if (this.board[nr][nc] === opponent) {
                    const group = this.getGroup(nr, nc);
                    const liberties = this.getGroupLiberties(group);

                    if (liberties === 0) {
                        // Capture this group
                        group.forEach(([r, c]) => {
                            this.board[r][c] = 0;
                            captured.push([r, c]);
                        });
                    }
                }
            }
        }

        return captured;
    }

    getGroup(row, col) {
        const color = this.board[row][col];
        if (color === 0) return [];

        const group = [];
        const visited = new Set();
        const stack = [[row, col]];

        while (stack.length > 0) {
            const [r, c] = stack.pop();
            const key = `${r},${c}`;

            if (visited.has(key)) continue;
            if (r < 0 || r >= this.boardSize || c < 0 || c >= this.boardSize) continue;
            if (this.board[r][c] !== color) continue;

            visited.add(key);
            group.push([r, c]);

            stack.push([r - 1, c]);
            stack.push([r + 1, c]);
            stack.push([r, c - 1]);
            stack.push([r, c + 1]);
        }

        return group;
    }

    getGroupLiberties(group) {
        const liberties = new Set();
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [row, col] of group) {
            for (const [dr, dc] of directions) {
                const nr = row + dr;
                const nc = col + dc;

                if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                    if (this.board[nr][nc] === 0) {
                        liberties.add(`${nr},${nc}`);
                    }
                }
            }
        }

        return liberties.size;
    }

    getLiberties(row, col) {
        const group = this.getGroup(row, col);
        return this.getGroupLiberties(group);
    }

    pass() {
        if (!this.gameRunning) return;

        this.consecutivePasses++;
        logToTerminal(`${this.currentPlayer === 1 ? 'Human' : 'AI'} passed`);

        if (this.consecutivePasses >= 2) {
            this.endGame();
            return;
        }

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateDisplay();

        if (this.currentPlayer === 2 && this.gameRunning) {
            this.aiThinking = true;
            setTimeout(() => this.aiMove(), 500);
        }
    }

    aiMove() {
        if (!this.gameRunning) return;

        const move = this.getBestMove();

        if (move) {
            const { row, col } = move;
            this.makeMove(row, col);
        } else {
            // No valid moves, pass
            this.pass();
        }

        this.aiThinking = false;
    }

    getBestMove() {
        // Simple deterministic AI with basic strategy
        const validMoves = [];

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 0) {
                    if (this.isValidMove(row, col, 2)) {
                        const score = this.evaluateMove(row, col, 2);
                        validMoves.push({ row, col, score });
                    }
                }
            }
        }

        if (validMoves.length === 0) return null;

        // Sort by score and pick the best
        validMoves.sort((a, b) => b.score - a.score);

        // Add some randomness among top moves to make it less predictable
        const topMoves = validMoves.filter(m => m.score >= validMoves[0].score - 2);
        return topMoves[Math.floor(Math.random() * topMoves.length)];
    }

    isValidMove(row, col, player) {
        const opponent = player === 1 ? 2 : 1;

        // Temporarily place stone
        this.board[row][col] = player;

        // Check for captures
        const captured = this.checkCaptures(row, col, opponent);

        // Check liberties
        const liberties = this.getLiberties(row, col);
        const isValid = liberties > 0 || captured.length > 0;

        // Check ko rule
        let notKo = true;
        if (isValid) {
            const boardState = JSON.stringify(this.board);
            notKo = !this.boardHistory.includes(boardState);
        }

        // Revert
        this.board[row][col] = 0;
        captured.forEach(([r, c]) => {
            this.board[r][c] = opponent;
        });

        return isValid && notKo;
    }

    evaluateMove(row, col, player) {
        const opponent = player === 1 ? 2 : 1;
        let score = 0;

        // Temporarily place stone
        this.board[row][col] = player;

        // Factor 1: Capture potential
        const captured = this.checkCaptures(row, col, opponent);
        score += captured.length * 10;

        // Factor 2: Self-defense (avoid being captured)
        const liberties = this.getLiberties(row, col);
        score += liberties * 2;

        // Factor 3: Center control
        const centerDist = Math.abs(row - this.boardSize / 2) + Math.abs(col - this.boardSize / 2);
        score += (this.boardSize - centerDist);

        // Factor 4: Protect weak groups
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                if (this.board[nr][nc] === player) {
                    const neighborLiberties = this.getLiberties(nr, nc);
                    if (neighborLiberties <= 2) {
                        score += 3; // Protect weak stones
                    }
                }
            }
        }

        // Factor 5: Atari (try to put opponent in atari)
        for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                if (this.board[nr][nc] === opponent) {
                    const neighborLiberties = this.getLiberties(nr, nc);
                    if (neighborLiberties === 1) {
                        score += 5; // Put opponent in atari
                    }
                }
            }
        }

        // Revert
        this.board[row][col] = 0;
        captured.forEach(([r, c]) => {
            this.board[r][c] = opponent;
        });

        return score;
    }

    endGame() {
        this.gameRunning = false;
        this.aiThinking = false;

        const blackTerritory = this.countTerritory(1);
        const whiteTerritory = this.countTerritory(2);
        const blackTotal = blackTerritory + this.captures.black;
        const whiteTotal = whiteTerritory + this.captures.white;

        let winner;
        if (blackTotal > whiteTotal) {
            winner = 'HUMAN';
        } else if (whiteTotal > blackTotal) {
            winner = 'AI';
        } else {
            winner = 'DRAW';
        }

        logToTerminal(`Go Protocol: TERMINATED - Winner: ${winner}`);
        logToTerminal(`Black: ${blackTotal} (Territory: ${blackTerritory} + Captures: ${this.captures.black})`);
        logToTerminal(`White: ${whiteTotal} (Territory: ${whiteTerritory} + Captures: ${this.captures.white})`);

        this.drawBoard();

        // Draw game over text
        this.ctx.fillStyle = 'rgba(212, 197, 169, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.font = 'bold 30px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`WINNER: ${winner}`, this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '18px Orbitron';
        this.ctx.fillText(`Black: ${blackTotal} | White: ${whiteTotal}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    countTerritory(player) {
        let territory = 0;
        const counted = new Set();

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 0 && !counted.has(`${row},${col}`)) {
                    const region = this.getEmptyRegion(row, col);
                    const controlledBy = this.checkTerritoryControl(region);

                    if (controlledBy === player) {
                        territory += region.length;
                    }

                    region.forEach(([r, c]) => counted.add(`${r},${c}`));
                }
            }
        }

        return territory;
    }

    getEmptyRegion(startRow, startCol) {
        const region = [];
        const visited = new Set();
        const stack = [[startRow, startCol]];

        while (stack.length > 0) {
            const [row, col] = stack.pop();
            const key = `${row},${col}`;

            if (visited.has(key)) continue;
            if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) continue;
            if (this.board[row][col] !== 0) continue;

            visited.add(key);
            region.push([row, col]);

            stack.push([row - 1, col]);
            stack.push([row + 1, col]);
            stack.push([row, col - 1]);
            stack.push([row, col + 1]);
        }

        return region;
    }

    checkTerritoryControl(region) {
        let touchesBlack = false;
        let touchesWhite = false;

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [row, col] of region) {
            for (const [dr, dc] of directions) {
                const nr = row + dr;
                const nc = col + dc;

                if (nr >= 0 && nr < this.boardSize && nc >= 0 && nc < this.boardSize) {
                    if (this.board[nr][nc] === 1) touchesBlack = true;
                    if (this.board[nr][nc] === 2) touchesWhite = true;
                }
            }
        }

        if (touchesBlack && !touchesWhite) return 1;
        if (touchesWhite && !touchesBlack) return 2;
        return 0; // Neutral or contested
    }

    drawBoard() {
        // Clear canvas
        this.ctx.fillStyle = '#d4c5a9';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = '#3a3a3a';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.boardSize; i++) {
            const pos = (i + 1) * this.cellSize;

            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(this.cellSize, pos);
            this.ctx.lineTo(this.canvas.width - this.cellSize, pos);
            this.ctx.stroke();

            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(pos, this.cellSize);
            this.ctx.lineTo(pos, this.canvas.height - this.cellSize);
            this.ctx.stroke();
        }

        // Draw star points (hoshi) for 9x9 board
        const starPoints = [[2, 2], [2, 6], [4, 4], [6, 2], [6, 6]];
        this.ctx.fillStyle = '#3a3a3a';
        starPoints.forEach(([row, col]) => {
            const x = (col + 1) * this.cellSize;
            const y = (row + 1) * this.cellSize;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw stones
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] !== 0) {
                    this.drawStone(row, col, this.board[row][col]);
                }
            }
        }

        // Draw start message if game not running
        if (!this.gameRunning && this.board.flat().every(cell => cell === 0)) {
            this.ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
            this.ctx.font = '20px Orbitron';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press START to begin', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    drawStone(row, col, color) {
        const x = (col + 1) * this.cellSize;
        const y = (row + 1) * this.cellSize;
        const radius = this.cellSize * 0.4;

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (color === 1) {
            // Black stone with gradient
            const gradient = this.ctx.createRadialGradient(x - radius / 3, y - radius / 3, 0, x, y, radius);
            gradient.addColorStop(0, '#2a2a2a');
            gradient.addColorStop(1, '#0a0a0a');
            this.ctx.fillStyle = gradient;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = 5;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        } else {
            // White stone with gradient
            const gradient = this.ctx.createRadialGradient(x - radius / 3, y - radius / 3, 0, x, y, radius);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#c0c0c0');
            this.ctx.fillStyle = gradient;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            this.ctx.shadowBlur = 5;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }

        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    updateDisplay() {
        document.getElementById('blackScore').textContent = this.captures.black;
        document.getElementById('whiteScore').textContent = this.captures.white;
        document.getElementById('currentTurn').textContent = this.currentPlayer === 1 ? 'HUMAN' : 'AI (THINKING...)';
    }
}

// Initialize Go Game when DOM is ready
let goGame;
document.addEventListener('DOMContentLoaded', () => {
    snakeGame = new SnakeGame();
    initTodoList();
    goGame = new GoGame();
});

