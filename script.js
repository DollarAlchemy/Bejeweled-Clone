// Initialize Game Variables
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const resetButton = document.getElementById("reset-button");

const rows = 8;
const columns = 8;
const jewelColors = ["red", "blue", "green", "yellow", "purple", "orange"];
let board = [];
let score = 0;
let selectedJewel = null;

// Create the Game Board
function createBoard() {
    board = [];
    gameBoard.innerHTML = "";

    for (let row = 0; row < rows; row++) {
        let rowArray = [];
        for (let col = 0; col < columns; col++) {
            const jewel = document.createElement("div");
            const randomColor =
                jewelColors[Math.floor(Math.random() * jewelColors.length)];
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
        // Select the first jewel
        selectedJewel = { row, col, element: jewel };
        jewel.classList.add("selected");
    } else {
        // Attempt to swap with the selected jewel
        const prevRow = selectedJewel.row;
        const prevCol = selectedJewel.col;

        if (isAdjacent(prevRow, prevCol, row, col)) {
            swapJewels(prevRow, prevCol, row, col);
            if (checkMatches()) {
                updateBoard();
            } else {
                // Swap back if no matches are found
                setTimeout(() => swapJewels(row, col, prevRow, prevCol), 300);
            }
        }

        // Clear selection
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
    // Swap colors in the board array
    const temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;

    // Update the DOM
    const jewel1 = document.querySelector(
        `[data-row="${row1}"][data-col="${col1}"]`
    );
    const jewel2 = document.querySelector(
        `[data-row="${row2}"][data-col="${col2}"]`
    );
    jewel1.style.backgroundColor = board[row1][col1];
    jewel2.style.backgroundColor = board[row2][col2];
}

// Detect matches of 3 or more jewels
function checkMatches() {
    const matches = [];

    // Check rows for matches
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

    // Check columns for matches
    for (let col = 0; col < columns; col++) {
        let match = [0];
        for (let row = 1; row < rows; row++) {
            if (board[row][col] === board[row - 1][col]) {
                match.push(row);
            } else {
                if (match.length >= 3)
                    matches.push({ col, rows: [...match] });
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
       if(box.matches.mound.up(triggers.col==0)
// Clear matches and update the board
function updateBoard() {
    const matches = checkMatches();

    matches.forEach((match) => {
        if (match.cols) {
            // Clear row matches
            match.cols.forEach((col) => {
                board[match.row][col] = null;
                const jewel = document.querySelector(
                    `[data-row="${match.row}"][data-col="${col}"]`
                );
                jewel.style.backgroundColor = "transparent";
            });
        } else if (match.rows) {
            // Clear column matches
            match.rows.forEach((row) => {
                board[row][match.col] = null;
                const jewel = document.querySelector(
                    `[data-row="${row}"][data-col="${match.col}"]`
                );
                jewel.style.backgroundColor = "transparent";
            });
        }
    });

    // Add score for cleared jewels
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
                // Find the next non-null jewel above
                for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                    if (board[aboveRow][col] !== null) {
                        board[row][col] = board[aboveRow][col];
                        board[aboveRow][col] = null;

                        // Update the DOM
                        const jewel = document.querySelector(
                            `[data-row="${row}"][data-col="${col}"]`
                        );
                        const aboveJewel = document.querySelector(
                            `[data-row="${aboveRow}"][data-col="${col}"]`
                        );
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
                const randomColor =
                    jewelColors[Math.floor(Math.random() * jewelColors.length)];
                board[row][col] = randomColor;

                // Update the DOM
                const jewel = document.querySelector(
                    `[data-row="${row}"][data-col="${col}"]`
                );
                jewel.style.backgroundColor = randomColor;
            }
        }
    }

    // Check for new matches after board update
    if (checkMatches().length > 0) {
        setTimeout(updateBoard, 300);
    }
}
