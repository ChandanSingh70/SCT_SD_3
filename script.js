document.addEventListener("DOMContentLoaded", function() {
    const board = generateFullSudokuBoard();
    createBoard(board);
    fillBoardWithPuzzle(board);
});

function createBoard(board) {
    const sudokuBoard = document.getElementById("sudoku-board");
    sudokuBoard.innerHTML = ''; // Clear existing board
    for (let i = 0; i < 9; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("min", "1");
            input.setAttribute("max", "9");
            input.value = board[i][j] === 0 ? '' : board[i][j];
            input.disabled = board[i][j] !== 0; // Disable pre-filled cells
            cell.appendChild(input);
            row.appendChild(cell);
        }
        sudokuBoard.appendChild(row);
    }
}

function generateFullSudokuBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board;
}

function fillBoard(board) {
    const solve = (board) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    solve(board);
}

function isValid(board, row, col, num) {
    // Check row
    if (board[row].includes(num)) return false;

    // Check column
    if (board.some(r => r[col] === num)) return false;

    // Check 3x3 block
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

function fillBoardWithPuzzle(board) {
    let filledCells = 0;
    while (filledCells < 40) { // Number of cells to remove
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            const temp = board[row][col];
            board[row][col] = 0;
            const boardCopy = board.map(arr => arr.slice());
            if (hasUniqueSolution(boardCopy)) {
                filledCells++;
            } else {
                board[row][col] = temp; // Restore if not unique
            }
        }
    }
}

function hasUniqueSolution(board) {
    let solutions = 0;

    const countSolutions = (board) => {
        if (solutions > 1) return;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            countSolutions(board);
                            board[row][col] = 0;
                        }
                    }
                    return;
                }
            }
        }
        solutions++;
    };

    countSolutions(board);
    return solutions === 1;
}

function solveSudoku() {
    const board = [];
    const rows = document.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("input");
        board[rowIndex] = [];
        cells.forEach((cell, colIndex) => {
            const value = parseInt(cell.value) || 0;
            board[rowIndex][colIndex] = value;
        });
    });

    const solve = (board) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    if (solve(board)) {
        createBoard(board);
    } else {
        alert("No solution exists.");
    }
}

function resetBoard() {
    const cells = document.querySelectorAll("input");
    cells.forEach(cell => {
        cell.value = '';
        cell.disabled = false;
    });
    const board = generateFullSudokuBoard();
    fillBoardWithPuzzle(board);
    createBoard(board);
}
