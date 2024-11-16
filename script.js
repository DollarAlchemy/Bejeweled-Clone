// Initialize Game Variables
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const resetButton = document.getElementById("reset-button");
const timerDisplay = document.getElementById("timer");

const rows = 8;
const columns = 8;
const jewelColors = ["red", "blue", "green", "yellow", "purple", "orange"];
let board = [];
let score = 0;
let selectedJewel = null;
let timer = 120;  // Timer for 2 minutes
let timerInterval;

// Load Sound Effects
const swapSound = new Audio('sounds/swap.mp3');
const clearSound = new Audio('sounds/clear.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');

// Play a sound
function playSound(sound) {
    sound.currentTime = 0; // Reset playback position
    sound.play();
}

// Create the Game Board
function createBoard() {
    board = [];
    gameBoard.innerHTML = "";

    for (let row = 0; row < rows; row++) {
        let rowArray = [];
        for (let col = 0; col < columns; col++) {
            const jewel = document.createElement("div");
            const randomColor = jewelColors[Math.floor(Math.random() * jewelColors.length)];
            jewel.style.backgroundColor = randomColor;
            jewel.classList.add("jewel");
            jewel.dataset.row = row;
            jewel.dataset.col = col;
            jewel.addEventListener("click", handleJewelClick);
            gameBoard.appendChild(jewel);
            rowArray.push(randomColor);
        }
        board.push(rowArray);
    }
}

// Handle Jewel Click
function handleJewelClick(e) {
    const jewel = e.target;
    const row = parseInt(jewel.dataset.row);
    const col = parseInt(jewel.dataset.col);

    if (!selectedJewel) {
        selectedJewel = { row, col, element: jewel };
        jewel.classList.add("selected");
    } else {
        const prevRow = selectedJewel.row;
        const prevCol = selectedJewel.col;

        if (isAdjacent(prevRow, prevCol, row, col)) {
            swapJewels(prevRow, prevCol, row, col);
            playSound(swapSound); // Play swap sound

            if (checkMatches().length > 0) {
                updateBoard();
            } else {
                setTimeout(() => swapJewels(row, col, prevRow, prevCol), 300);
            }
        }

        selectedJewel.element.classList.remove("selected");
        selectedJewel = null;
    }
}

// Check if two jewels are adjacent
function isAdjacent(row1, col1, row2, col2) {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Swap two jewels
function swapJewels(row1, col1, row2, col2) {
    const temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;

    const jewel1 = document.querySelector(`[data-row="${row1}"][data-col="${col1}"]`);
    const jewel2 = document.querySelector(`[data-row="${row2}"][data-col="${col2}"]`);
    jewel1.style.backgroundColor = board[row1][col1];
    jewel2.style.backgroundColor = board[row2][col2];
}

// Detect matches of 3 or more jewels
function checkMatches() {
    const matches = [];

    for (let row = 0; row < rows; row++) {
        let match = [0];
        for (let col = 1; col < columns; col++) {
            if (board[row][col] === board[row][col - 1]) {
                match.push(col);
            } else {
                if (match.length >= 3) matches.push({ row, cols: [...match] });
                match = [col];
            }
        }
        if (match.length >= 3) matches.push({ row, cols: [...match] });
    }

    for (let col = 0; col < columns; col++) {
        let match = [0];
        for (let row = 1; row < rows; row++) {
            if (board[row][col] === board[row - 1][col]) {
                match.push(row);
            } else {
                if (match.length >= 3) matches.push({ col, rows: [...match] });
                match = [row];
            }
        }
        if (match.length >= 3) matches.push({ col, rows: [...match] });
    }

    return matches;
}

// Clear matches and update board
function updateBoard() {
    const matches = checkMatches();

    matches.forEach((match) => {
        if (match.cols) {
            match.cols.forEach((col) => {
                board[match.row][col] = null;
                const jewel = document.querySelector(`[data-row="${match.row}"][data-col="${col}"]`);
                jewel.style.backgroundColor = "transparent";
            });
        } else if (match.rows) {
            match.rows.forEach((row) => {
                board[row][match.col] = null;
                const jewel = document.querySelector(`[data-row="${row}"][data-col="${match.col}"]`);
                jewel.style.backgroundColor = "transparent";
            });
        }
    });

    if (matches.length > 0) {
        playSound(clearSound); // Play clear sound
    }

    score += matches.length * 10;
    scoreDisplay.textContent = score;

    setTimeout(() => {
        fillEmptySpaces();
        createNewJewels();
    }, 300);
}

// Fill empty spaces by shifting jewels down
function fillEmptySpaces() {
    for (let col = 0; col < columns; col++) {
        for (let row = rows - 1; row >= 0; row--) {
            if (board[row][col] === null) {
                for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                    if (board[aboveRow][col] !== null) {
                        board[row][col] = board[aboveRow][col];
                        board[aboveRow][col] = null;

                        const jewel = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        const aboveJewel = document.querySelector(`[data-row="${aboveRow}"][data-col="${col}"]`);
                        jewel.style.backgroundColor = board[row][col];
                        aboveJewel.style.backgroundColor = "transparent";
                        break;
                    }
                }
            }
        }
    }
}

// Generate new jewels at the top
function createNewJewels() {
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
            if (board[row][col] === null) {
                const randomColor = jewelColors[Math.floor(Math.random() * jewelColors.length)];
                board[row][col] = randomColor;

                const jewel = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                jewel.style.backgroundColor = randomColor;
            }
        }
    }

    if (checkMatches().length > 0) {
        setTimeout(updateBoard, 300);
    }
}

// Start countdown timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerDisplay.textContent = timer;
        } else {
            clearInterval(timerInterval);
            playSound(gameOverSound); // Play game over sound
            alert("Game Over!");
        }
    }, 1000);
}

// Reset the game
function resetGame() {
    clearInterval(timerInterval);
    timer = 120;
    score = 0;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;
    startGame();
}

// Event Listener for Reset Button
resetButton.addEventListener("click", resetGame);

// Start the game
function startGame() {
    createBoard();
    startTimer();
}

// Initialize the game
startGame();
