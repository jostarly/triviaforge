const board = document.getElementById("board");
let gameData;
let boardActive = false;

// TITLE
const titleEl = document.getElementById("game-title");

// LOAD MODE
const params = new URLSearchParams(window.location.search);

if (params.get("new") === "true") {
    sessionStorage.removeItem("gameData");
    sessionStorage.removeItem("participantsSetup");

    for (const key in localStorage) {
        if (key === "soundEnabled") continue;
        localStorage.removeItem(key);
    }

    showUploadPrompt();
} else {
    const stored = sessionStorage.getItem("gameData");

    if (stored) {
        try {
            gameData = JSON.parse(stored);

            // If participants were already handled OR participants exist, skip prompt
            if (
                sessionStorage.getItem("participantsSetup") === "true" ||
                Array.isArray(gameData.participants)
            ) {
                buildBoard();
            } else {
                askParticipants().then(() => {
                    sessionStorage.setItem("participantsSetup", "true");
                    buildBoard();
                });
            }
        } catch (err) {
            console.error("Stored gameData invalid", err);
            sessionStorage.removeItem("gameData");
            sessionStorage.removeItem("participantsSetup");
            showUploadPrompt();
        }
    } else {
        showUploadPrompt();
    }
}

// SOUND
const sounds = {
    pop: new Audio("sounds/pop.mp3"),
    chime: new Audio("sounds/chime.mp3")
};

function playSound(name) {
    if (localStorage.getItem("soundEnabled") !== "true") return;

    const s = sounds[name];
    if (!s) return;
    s.currentTime = 0;
    s.play().catch(() => {});
}

// SHOW UPLOAD
function showUploadPrompt() {
    boardActive = false;

    const container = document.createElement("div");
    container.id = "upload-container";

    container.innerHTML = `
        <button onclick="requestJsonUpload()">Upload JSON to Play</button>

        <div id="preset-container">
            <h3>Or Play a Preset</h3>

            <button onclick="loadPreset('sports')">Sports</button>
            <button onclick="loadPreset('geography')">Geography</button>
            <button onclick="loadPreset('games')">Video Games</button>
        </div>
    `;

    const footer = document.getElementById("site-footer");

    if (footer) {
        document.body.insertBefore(container, footer);
    } else {
        document.body.appendChild(container);
    }
}

// REQUEST JSON
function requestJsonUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            try {
                gameData = JSON.parse(ev.target.result);

                for (const key in localStorage) {
                    if (key === "soundEnabled") continue;
                    localStorage.removeItem(key);
                }

                sessionStorage.setItem("gameData", JSON.stringify(gameData));
                sessionStorage.removeItem("participantsSetup");

                document.getElementById("upload-container")?.remove();

                askParticipants().then(() => {
                    sessionStorage.setItem("participantsSetup", "true");
                    buildBoard();
                });
            } catch (err) {
                alert("Invalid JSON file.");
                console.error(err);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// ASK PARTICIPANTS (one-time setup)
function askParticipants() {
    return new Promise(resolve => {
        if (!gameData) return resolve();

        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.inset = "0";
        modal.style.background = "rgba(0,0,0,0.6)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.style.zIndex = "9999";

        const box = document.createElement("div");
        box.style.background = "#222";
        box.style.padding = "20px";
        box.style.borderRadius = "8px";
        box.style.textAlign = "center";
        box.style.minWidth = "260px";

        const text = document.createElement("p");
        text.textContent = "Would you like to add participants for score keeping?";

        const yes = document.createElement("button");
        yes.textContent = "Yes";
        yes.style.margin = "6px";
        yes.onclick = () => {
            document.body.removeChild(modal);
            collectNames().then(resolve);
        };

        const no = document.createElement("button");
        no.textContent = "No";
        no.style.margin = "6px";
        no.onclick = () => {
            document.body.removeChild(modal);
            gameData.participants = [];
            sessionStorage.setItem("gameData", JSON.stringify(gameData));
            resolve();
        };

        box.appendChild(text);
        box.appendChild(yes);
        box.appendChild(no);
        modal.appendChild(box);
        document.body.appendChild(modal);
    });
}

// COLLECT NAMES (only if Yes)
function collectNames() {
    return new Promise(resolve => {
        const names = prompt("Enter participant names (comma separated):");

        if (!names) {
            gameData.participants = [];
        } else {
            gameData.participants = names
                .split(",")
                .map(n => n.trim())
                .filter(n => n)
                .map(n => ({ name: n, score: 0 }));
        }

        sessionStorage.setItem("gameData", JSON.stringify(gameData));
        resolve();
    });
}

// BUILD BOARD
function buildBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    const categories = gameData.categories;
    board.style.gridTemplateColumns = `repeat(${categories.length}, 1fr)`;

    if (titleEl) {
        titleEl.textContent = gameData.gameName || "Trivia Forge";
    }

    categories.forEach(cat => {
        const header = document.createElement("div");
        header.classList.add("cell", "category");
        header.textContent = cat.title;
        board.appendChild(header);
    });

    const rows = categories[0].questions.length;

    for (let i = 0; i < rows; i++) {
        categories.forEach(cat => {
            const q = cat.questions[i];

            const cell = document.createElement("div");
            cell.classList.add("cell");

            const key = `${cat.title}-${q.value}`;
            cell.dataset.key = key;

            if (localStorage.getItem(key) === "used") {
                cell.classList.add("used");
            }

            cell.textContent = q.value;
            cell.addEventListener("click", () => openQuestion(q, key));

            board.appendChild(cell);
        });
    }

    renderScores();
    boardActive = true;
}

// SCOREBOARD
function renderScores() {
    const scoreboard = document.getElementById("scoreboard");
    if (!scoreboard) return;

    scoreboard.innerHTML = "";

    if (!gameData || !Array.isArray(gameData.participants) || gameData.participants.length === 0) {
        return;
    }

    gameData.participants.forEach((p, index) => {
        const box = document.createElement("div");
        box.classList.add("score-box");

        const name = document.createElement("div");
        name.classList.add("name");
        name.textContent = p.name;

        const divider = document.createElement("div");
        divider.classList.add("divider");

        const score = document.createElement("div");
        score.classList.add("score");
        score.textContent = p.score;

        const edit = document.createElement("button");
        edit.textContent = "Edit Score";
        edit.style.marginTop = "6px";

        edit.onclick = () => {
            const newScore = prompt("Enter new score for " + p.name, p.score);
            const num = parseInt(newScore);

            if (!isNaN(num)) {
                gameData.participants[index].score = num;
                sessionStorage.setItem("gameData", JSON.stringify(gameData));
                renderScores();
            }
        };

        box.appendChild(name);
        box.appendChild(divider);
        box.appendChild(score);
        box.appendChild(edit);

        scoreboard.appendChild(box);
    });
}

// MAIN MENU WARNING
function goMainMenu() {
    if (boardActive) {
        const sure = confirm("Game state will not be saved. Are you sure you want to leave?");
        if (!sure) return;
    }

    window.location.href = "mainmenu.html";
}

// OPEN QUESTION
function openQuestion(q, key) {
    sessionStorage.setItem("currentQuestion", JSON.stringify(q));
    sessionStorage.setItem("currentKey", key);

    sessionStorage.setItem("playPop", "true");
    window.location.href = "question.html";
}
