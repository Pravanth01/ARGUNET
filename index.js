// --- CONSTANTS ---
const STORAGE_KEY = 'argunet_v1_storage';

// --- STATE ---
let state = {
    view: 'SETUP', // SETUP, DEBATE, END
    player1: { name: '', score: 0, votedEnd: false },
    player2: { name: '', score: 0, votedEnd: false },
    topic: '',
    threshold: 30,
    turn: 0, // 0 for P1, 1 for P2
    messages: []
};

// --- INITIALIZATION ---
function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        state = JSON.parse(saved);
    }
    render();
}

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --- RENDERING ---
function render() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    if (state.view === 'SETUP') {
        renderSetup(app);
    } else if (state.view === 'DEBATE') {
        renderDebate(app);
    } else if (state.view === 'END') {
        renderEnd(app);
    }
}

function renderSetup(container) {
    const div = document.createElement('div');
    div.className = 'setup-container';
    div.innerHTML = `
        <h1 class="title">ARGU<span>NET</span></h1>
        <div class="setup-grid">
            <div class="setup-card for">
                <h2>FOR</h2>
                <div class="input-group">
                    <label>Representative Name</label>
                    <input type="text" id="p1-name" value="${state.player1.name}" placeholder="PLAYER 1">
                </div>
            </div>
            <div class="setup-card against">
                <h2>AGAINST</h2>
                <div class="input-group">
                    <label>Representative Name</label>
                    <input type="text" id="p2-name" value="${state.player2.name}" placeholder="PLAYER 2" style="text-align: right;">
                </div>
            </div>
        </div>
        <div class="topic-section">
            <div class="input-group">
                <label>Argument Topic</label>
                <input type="text" id="debate-topic" value="${state.topic}" placeholder="WHAT IS THE DISPUTE?">
            </div>
            <div class="input-group" style="margin-top: 1rem;">
                <label>Victory Threshold (Points)</label>
                <input type="number" id="debate-threshold" value="${state.threshold}">
            </div>
        </div>
        <button class="start-btn" id="start-btn">Commence Simulation</button>
    `;
    container.appendChild(div);

    document.getElementById('start-btn').onclick = () => {
        state.player1.name = document.getElementById('p1-name').value || 'Player 1';
        state.player2.name = document.getElementById('p2-name').value || 'Player 2';
        state.topic = document.getElementById('debate-topic').value || 'Global Ethics';
        state.threshold = parseInt(document.getElementById('debate-threshold').value) || 30;
        state.view = 'DEBATE';
        state.messages = [];
        state.player1.score = 0;
        state.player2.score = 0;
        state.player1.votedEnd = false;
        state.player2.votedEnd = false;
        state.turn = 0;
        save();
        render();
    };
}

function renderDebate(container) {
    const div = document.createElement('div');
    div.className = 'debate-container';
    
    const turnName = state.turn === 0 ? state.player1.name : state.player2.name;

    div.innerHTML = `
        <div class="header">
            <div class="player-info">
                <div class="player-name" style="color: var(--accent-blue)">${state.player1.name}</div>
                <div class="player-score">${state.player1.score}</div>
                <button class="end-vote-btn ${state.player1.votedEnd ? 'voted' : ''}" id="p1-end-btn">
                    ${state.player1.votedEnd ? 'VOTED END' : 'END DEBATE'}
                </button>
            </div>
            <div class="header-topic">
                ${state.topic}
            </div>
            <div class="player-info right">
                <div class="player-name" style="color: var(--accent-purple)">${state.player2.name}</div>
                <div class="player-score">${state.player2.score}</div>
                <button class="end-vote-btn ${state.player2.votedEnd ? 'voted' : ''}" id="p2-end-btn">
                    ${state.player2.votedEnd ? 'VOTED END' : 'END DEBATE'}
                </button>
            </div>
        </div>
        <div class="turn-indicator">
            Turn: ${turnName}
        </div>
        <div class="chat-area" id="chat-area">
            ${state.messages.map(m => `
                <div class="message ${m.role.toLowerCase()}">
                    ${m.text}
                </div>
            `).join('')}
        </div>
        <div class="input-area">
            <div class="input-wrapper">
                <textarea id="msg-input" placeholder="Enter your argument..."></textarea>
                <button class="send-btn" id="send-btn">SUBMIT</button>
            </div>
        </div>
    `;
    container.appendChild(div);

    // Scroll chat to bottom
    const chatArea = document.getElementById('chat-area');
    chatArea.scrollTop = chatArea.scrollHeight;

    document.getElementById('send-btn').onclick = handleSend;
    document.getElementById('p1-end-btn').onclick = () => handleVote(0);
    document.getElementById('p2-end-btn').onclick = () => handleVote(1);
}

function handleSend() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (!text) return;

    const currentTurn = state.turn;
    const role = currentTurn === 0 ? 'FOR' : 'AGAINST';

    state.messages.push({ role, text });

    if (currentTurn === 0) {
        state.player1.score += 2;
        state.turn = 1;
        if (state.player1.score >= state.threshold) state.view = 'END';
    } else {
        state.player2.score += 2;
        state.turn = 0;
        if (state.player2.score >= state.threshold) state.view = 'END';
    }

    save();
    render();
}

function handleVote(idx) {
    if (idx === 0) state.player1.votedEnd = !state.player1.votedEnd;
    else state.player2.votedEnd = !state.player2.votedEnd;

    if (state.player1.votedEnd && state.player2.votedEnd) {
        state.view = 'END';
    }

    save();
    render();
}

function renderEnd(container) {
    let resultText = '';
    if (state.player1.score > state.player2.score) {
        resultText = `Winner: ${state.player1.name}`;
    } else if (state.player2.score > state.player1.score) {
        resultText = `Winner: ${state.player2.name}`;
    } else {
        resultText = "It's a Draw";
    }

    const div = document.createElement('div');
    div.className = 'end-container';
    div.innerHTML = `
        <h1 class="end-title">DEBATE<br>ENDED</h1>
        <div class="end-winner">${resultText}</div>
        <p style="margin-bottom: 2rem; color: var(--text-secondary)">Thank you for playing</p>
        <button class="start-btn" id="restart-btn" style="width: auto; padding: 1.5rem 4rem;">New Simulation</button>
    `;
    container.appendChild(div);

    document.getElementById('restart-btn').onclick = () => {
        state.view = 'SETUP';
        state.player1.score = 0;
        state.player2.score = 0;
        state.messages = [];
        save();
        render();
    };
}

// Start
init();