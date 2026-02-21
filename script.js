const board = document.getElementById("board");

let gameData;

fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        gameData = data;
        buildBoard();
    });

function buildBoard() {
    gameData.categories.forEach(category => {
        // Category header
        const header = document.createElement("div");
        header.classList.add("cell");
        header.textContent = category.title;
        header.style.background = "darkblue";
        board.appendChild(header);

        // Questions
        category.questions.forEach(q => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = q.value;

            cell.addEventListener("click", () => openQuestion(q, cell));

            board.appendChild(cell);
        });
    });
}

function openQuestion(q, cell) {
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("question-text").textContent = q.question;
    document.getElementById("answer-text").textContent = q.answer;
    document.getElementById("answer-text").classList.add("hidden");

    document.getElementById("show-answer").onclick = () => {
        document.getElementById("answer-text").classList.remove("hidden");
    };

    document.getElementById("close-modal").onclick = () => {
        document.getElementById("modal").classList.add("hidden");
        cell.classList.add("used");
    };
}
