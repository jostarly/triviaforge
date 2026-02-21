const board = document.getElementById("board");
let gameData;

// LOAD MODE
const params = new URLSearchParams(window.location.search);

if (params.get("new") === "true") {
    sessionStorage.removeItem("gameData");

    // RESET USED CELLS BUT KEEP SETTINGS
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
            buildBoard();
        } catch (err) {
            console.error("Stored gameData invalid", err);
            sessionStorage.removeItem("gameData");
            showUploadPrompt();
        }
    } else {
        showUploadPrompt();
    }
}

// SOUND EFFECTS
const sounds = {
    pop:   new Audio("sounds/pop.mp3"),
    chime: new Audio("sounds/chime.mp3")
};

function playSound(name) {
    if (localStorage.getItem("soundEnabled") !== "true") return;

    const s = sounds[name];
    if (!s) return;
    s.currentTime = 0;
    s.play().catch(() => {});
}

// SHOW UPLOAD + PRESETS
function showUploadPrompt() {
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

                // NEW SESSION (but keep settings)
                for (const key in localStorage) {
                    if (key === "soundEnabled") continue;
                    localStorage.removeItem(key);
                }

                sessionStorage.setItem("gameData", JSON.stringify(gameData));

                document.getElementById("upload-container")?.remove();
                buildBoard();
            } catch (err) {
                alert("Invalid JSON file.");
                console.error(err);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// PRESET GAMES
function loadPreset(type) {
    for (const key in localStorage) {
        if (key === "soundEnabled") continue;
        localStorage.removeItem(key);
    }

    if (type === "sports") {
        gameData = {
            categories: [
                {
                    title: "Professional Teams",
                    questions: [
                        { value: 200, question: "Which NBA team dominated the 1990s with multiple championships?", answer: "Chicago Bulls" },
                        { value: 400, question: "Which NFL team has won the most Super Bowls overall?", answer: "New England Patriots and Pittsburgh Steelers (6 each)" },
                        { value: 600, question: "Which MLB franchise has the most World Series titles?", answer: "New York Yankees" },
                        { value: 800, question: "Which soccer club has the most UEFA Champions League titles?", answer: "Real Madrid" }
                    ]
                },
                {
                    title: "Sports Rules",
                    questions: [
                        { value: 200, question: "How many points is a field goal in American football?", answer: "3" },
                        { value: 400, question: "How many players are on the court for one basketball team?", answer: "5" },
                        { value: 600, question: "What is the offside rule in soccer?", answer: "A player cannot be closer to the goal than the ball and last defender when receiving a pass" },
                        { value: 800, question: "What does VAR stand for in soccer?", answer: "Video Assistant Referee" }
                    ]
                },
                {
                    title: "Sports History",
                    questions: [
                        { value: 200, question: "In what year were the first modern Olympic Games held?", answer: "1896" },
                        { value: 400, question: "Which boxer is known as 'The Greatest'?", answer: "Muhammad Ali" },
                        { value: 600, question: "Which country hosted the 2016 Summer Olympics?", answer: "Brazil" },
                        { value: 800, question: "Who broke the 100m world record in 2009?", answer: "Usain Bolt" }
                    ]
                },
                {
                    title: "Sports Records",
                    questions: [
                        { value: 200, question: "Who holds the NFL record for career rushing yards?", answer: "Emmitt Smith" },
                        { value: 400, question: "Who has the most NBA scoring titles?", answer: "Michael Jordan" },
                        { value: 600, question: "Who hit 73 home runs in a single MLB season?", answer: "Barry Bonds" },
                        { value: 800, question: "Who holds the record for most Grand Slam tennis titles?", answer: "Margaret Court" }
                    ]
                }
            ]
        };
    }

    if (type === "geography") {
        gameData = {
            categories: [
                {
                    title: "Countries",
                    questions: [
                        { value: 200, question: "Which country has the largest land area?", answer: "Russia" },
                        { value: 400, question: "Which two countries share the longest land border?", answer: "Canada and United States" },
                        { value: 600, question: "Which country has the most time zones?", answer: "France" },
                        { value: 800, question: "Which microstate is surrounded by Italy?", answer: "San Marino" }
                    ]
                },
                {
                    title: "Capitals",
                    questions: [
                        { value: 200, question: "What is the capital of Japan?", answer: "Tokyo" },
                        { value: 400, question: "What is the capital of Australia?", answer: "Canberra" },
                        { value: 600, question: "What is the capital of Canada?", answer: "Ottawa" },
                        { value: 800, question: "What is the capital of Iceland?", answer: "Reykjavik" }
                    ]
                },
                {
                    title: "Landmarks",
                    questions: [
                        { value: 200, question: "In which city is the Eiffel Tower located?", answer: "Paris" },
                        { value: 400, question: "Which structure is the longest human-made wall?", answer: "Great Wall of China" },
                        { value: 600, question: "In which city is the Colosseum?", answer: "Rome" },
                        { value: 800, question: "What is the tallest mountain on Earth?", answer: "Mount Everest" }
                    ]
                },
                {
                    title: "Physical Geography",
                    questions: [
                        { value: 200, question: "What is the longest river in the world?", answer: "Nile River" },
                        { value: 400, question: "What is the largest ocean?", answer: "Pacific Ocean" },
                        { value: 600, question: "What desert is the largest non-polar desert?", answer: "Sahara Desert" },
                        { value: 800, question: "What tectonic boundary causes the Pacific Ring of Fire?", answer: "Subduction zones" }
                    ]
                }
            ]
        };
    }

    if (type === "games") {
        gameData = {
            categories: [
                {
                    title: "Game Studios",
                    questions: [
                        { value: 200, question: "Which company created Minecraft?", answer: "Mojang" },
                        { value: 400, question: "Which studio developed The Legend of Zelda?", answer: "Nintendo EAD" },
                        { value: 600, question: "Which company created the Unreal Engine?", answer: "Epic Games" },
                        { value: 800, question: "What year was the original PlayStation released?", answer: "1994" }
                    ]
                },
                {
                    title: "Game Mechanics",
                    questions: [
                        { value: 200, question: "What is RNG?", answer: "Random Number Generation" },
                        { value: 400, question: "What is frame data?", answer: "Timing data for animations and advantage" },
                        { value: 600, question: "What is input buffering?", answer: "Queuing inputs to execute on the first valid frame" },
                        { value: 800, question: "What defines a roguelike?", answer: "Procedural generation with permadeath" }
                    ]
                },
                {
                    title: "Game History",
                    questions: [
                        { value: 200, question: "Which game popularized battle royale?", answer: "PUBG" },
                        { value: 400, question: "Which game popularized loot boxes?", answer: "Team Fortress 2" },
                        { value: 600, question: "Which console was first commercially successful?", answer: "Atari 2600" },
                        { value: 800, question: "In what year did the video game crash occur?", answer: "1983" }
                    ]
                },
                {
                    title: "Game Definitions",
                    questions: [
                        { value: 200, question: "What is speedrunning?", answer: "Completing a game as fast as possible" },
                        { value: 400, question: "What is permadeath?", answer: "Permanent death with no respawn" },
                        { value: 600, question: "What defines a metroidvania?", answer: "Nonlinear exploration with ability-gated progression" },
                        { value: 800, question: "What is a sandbox game?", answer: "A game with open-ended player creativity" }
                    ]
                }
            ]
        };
    }

    sessionStorage.setItem("gameData", JSON.stringify(gameData));

    document.getElementById("upload-container")?.remove();
    buildBoard();
}

// BUILD BOARD
function buildBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    const categories = gameData.categories;
    board.style.gridTemplateColumns = `repeat(${categories.length}, 1fr)`;

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
}

// OPEN QUESTION (pop)
function openQuestion(q, key) {
    sessionStorage.setItem("currentQuestion", JSON.stringify(q));
    sessionStorage.setItem("currentKey", key);

    sessionStorage.setItem("playPop", "true");
    window.location.href = "question.html";
}
