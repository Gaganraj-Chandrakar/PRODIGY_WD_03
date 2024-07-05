document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const gameStatus = document.getElementById("game-status");
    const restartButton = document.getElementById("restart-button");
    const backButton = document.getElementById("back-button");
    const singlePlayerButton = document.getElementById("single-player-button");
    const twoPlayerButton = document.getElementById("two-player-button");
    const gameBoard = document.getElementById("game-board");
    const gameInfo = document.getElementById("game-info");
    const modeSelection = document.getElementById("mode-selection");

    let currentPlayer = "X";
    let gameActive = true;
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let isSinglePlayer = false;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (clickedCell, clickedCellIndex) => {
        if (gameState[clickedCellIndex] !== "" || !gameActive || (isSinglePlayer && currentPlayer === "O")) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
        clickedCell.classList.add("animated");

        checkResult();

        if (isSinglePlayer && gameActive && currentPlayer === "O") {
            setTimeout(aiMove, 500); // Adding a small delay for better user experience
        }
    };

    const checkResult = () => {
        let roundWon = false;
        let winningCells = [];
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === "" || b === "" || c === "") {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningCells = winCondition;
                break;
            }
        }

        if (roundWon) {
            gameStatus.innerText = `Player ${currentPlayer} has won!`;
            gameActive = false;
            highlightWinningCells(winningCells);
            gameBoard.style.pointerEvents = 'none';
            return;
        }

        const roundDraw = !gameState.includes("");
        if (roundDraw) {
            gameStatus.innerText = `Game is a draw!`;
            gameActive = false;
            gameBoard.style.pointerEvents = 'none';
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        gameStatus.innerText = `It's ${currentPlayer}'s turn`;
        gameBoard.style.pointerEvents = 'auto';
    };

    const highlightWinningCells = (winningCells) => {
        winningCells.forEach(index => {
            cells[index].style.backgroundColor = "#28a745";
            cells[index].style.color = "#ffffff";
            cells[index].classList.add("highlight");
        });
    };

    const handleRestartGame = () => {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        gameStatus.innerText = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.innerText = "";
            cell.style.backgroundColor = "#f0f0f0";
            cell.style.color = "#333";
            cell.classList.remove("highlight", "animated");
        });
        gameBoard.style.pointerEvents = 'auto';
    };

    const minimax = (newGameState, depth, isMaximizing) => {
        let scores = {
            X: -10,
            O: 10,
            draw: 0
        };

        let result = evaluate(newGameState);
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < newGameState.length; i++) {
                if (newGameState[i] === "") {
                    newGameState[i] = "O";
                    let score = minimax(newGameState, depth + 1, false);
                    newGameState[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < newGameState.length; i++) {
                if (newGameState[i] === "") {
                    newGameState[i] = "X";
                    let score = minimax(newGameState, depth + 1, true);
                    newGameState[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const evaluate = (newGameState) => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (newGameState[a] && newGameState[a] === newGameState[b] && newGameState[a] === newGameState[c]) {
                return newGameState[a];
            }
        }
        return newGameState.includes("") ? null : "draw";
    };

    const aiMove = () => {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = "O";
                let score = minimax(gameState, 0, false);
                gameState[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        gameState[move] = "O";
        cells[move].innerText = "O";
        cells[move].classList.add("animated");

        checkResult();
    };

    singlePlayerButton.addEventListener("click", () => {
        isSinglePlayer = true;
        modeSelection.classList.add("hidden");
        gameBoard.classList.remove("hidden");
        gameBoard.style.pointerEvents = 'auto';
        gameInfo.classList.remove("hidden");
        cells.forEach(cell => cell.classList.remove("hidden"));
        gameStatus.innerText = `It's ${currentPlayer}'s turn`;
    });

    twoPlayerButton.addEventListener("click", () => {
        isSinglePlayer = false;
        modeSelection.classList.add("hidden");
        gameBoard.classList.remove("hidden");
        gameBoard.style.pointerEvents = 'auto';
        gameInfo.classList.remove("hidden");
        cells.forEach(cell => cell.classList.remove("hidden"));
        gameStatus.innerText = `It's ${currentPlayer}'s turn`;
    });

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => handleCellClick(cell, index));
    });

    restartButton.addEventListener("click", handleRestartGame);

    backButton.addEventListener("click", () => {
        handleRestartGame();
        modeSelection.classList.remove("hidden");
        gameBoard.classList.add("hidden");
        gameInfo.classList.add("hidden");
        cells.forEach(cell => cell.classList.add("hidden"));
    });
});