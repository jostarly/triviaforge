// =========================================
// PRESET GAMES
// =========================================

function loadPreset(type) {
    for (const key in localStorage) {
        if (key === "soundEnabled") continue;
        localStorage.removeItem(key);
    }

    if (type === "sports") {
        gameData = {
            gameName: "Sports Trivia",
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
                }
            ]
        };
    }

    if (type === "geography") {
        gameData = {
            gameName: "Geography Trivia",
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
                }
            ]
        };
    }

    if (type === "games") {
        gameData = {
            gameName: "Video Game Trivia",
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
                }
            ]
        };
    }

    sessionStorage.setItem("gameData", JSON.stringify(gameData));

    document.getElementById("upload-container")?.remove();

    // Ask for participants BEFORE building board
    askParticipants().then(buildBoard);
}
