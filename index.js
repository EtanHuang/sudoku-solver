let sudokuArray = []
for (let i = 0; i < 9; i++) {
    sudokuArray[i] = [];
    for (let j = 0; j < 9; j++) {
        sudokuArray[i][j] = 0;
    }
}
addEventListener("DOMContentLoaded", () => {
    const sudoku_grid = document.getElementById("grid");
    //console.log("Hello");
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click', solveSudoku);
    const clearButton = document.getElementById("clear-btn");
    clearButton.addEventListener('click', clearSudoku);

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'number';
            input.className = 'cell';
            input.id = `cell-${i}-${j}`;
            let previousValue = '';

            //make the input the last digit the user entered 
            input.addEventListener('input', (event) => {
                let raw_value = event.target.value;
                let value = parseInt(event.target.value, 10);


                if (raw_value == 0) {
                    event.target.value = previousValue;
                    return;
                }
                else if (isNaN(value) || value < 0 || /[^1-9]/.test(raw_value)) {
                    event.target.value = previousValue;
                    return;
                }
                else if (value >= 1 && value <= 9) {
                    event.target.value = value;
                    previousValue = event.target.value;
                } 
                else if (value > 9) {
                    event.target.value = value % 10;
                    previousValue = event.target.value;
                }
                // else {
                //     event.target.value = '';
                // }
                console.log(document.getElementById(`cell-0-0`).value);

            });
            cell.appendChild(input);
            row.appendChild(cell);
        }
        sudoku_grid.appendChild(row);
    }
});


function empty() {
    ret = 0;
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(sudokuArray[i][j] == 0) {
                ret += 1;
            }
        }
    }
    return ret == 81;
}

function clearSudoku() {
    for (let i = 0; i < 9; i++) {
        sudokuArray[i] = [];
        for (let j = 0; j < 9; j++) {
            sudokuArray[i][j] = 0;
            const cellId = `cell-${i}-${j}`;
            const cell = document.getElementById(cellId);
            cell.value = null;
        }
    }
}

function valid() {
    //check rows
    for(let i = 0; i < 9; i++) {
        freq = {}
        for(let j = 0; j < 9; j++) {
            let num = 0;
            if(sudokuArray[i][j] != 0) {
                num = sudokuArray[i][j];
            }
            if (num != 0 && num in freq) {
                freq[num] += 1;
            } else if (num != 0 && !(num in freq)) {
                freq[num] = 1;
            }
        }
        for (const key in freq) {
            if (freq[key] > 1) {
                return false;
            }
        }
    }
    //check columns
    for(let i = 0; i < 9; i++) {
        freq = {}
        for(let j = 0; j < 9; j++) {
            let num = 0
            if(sudokuArray[j][i] != 0) {
                num = sudokuArray[j][i];
            }            
            if (num != 0 && num in freq) {
                freq[num] += 1;
            } else if (num != 0 && !(num in freq)) {
                freq[num] = 1;
            }
        }
        for (const key in freq) {
            if (freq[key] > 1) {
                return false;
            }
        }
        //console.log(freq);
    }
    
    //check 3x3 grid
    for(let i = 0; i < 9; i += 3){
        for(let j = 0; j < 9; j += 3) {
            freq = {}
            for(let k = i; k < i + 3; k++) {
                for(let l = j; l < j + 3; l++) {
                    let num = 0
                    if(sudokuArray[k][l] != 0) {
                        num = sudokuArray[k][l];
                    }
                    if (num != 0 && num in freq) {
                        freq[num] += 1;
                    } else if (num != 0 && !(num in freq)) {
                        freq[num] = 1;
                    }
                }
            }
            for (const key in freq) {
                if (freq[key] > 1 && key != 0) {
                    return false;
                }
            }
        }
    }

    return true;
}

// solves the sudoku using backtracking 
function solve(row, col) {
    if(row == 9) {
        return true;
    }
    if(col == 9) {
        return solve(row + 1, 0);
    }
    if(sudokuArray[row][col] == 0) {
        for(let i = 1; i <= 9; i++) {
            sudokuArray[row][col] = i;
            if (valid()) {
                if(solve(row, col + 1)) {
                    return true;
               }
            }
            sudokuArray[row][col] = 0;
        }
        return false;
    } else {
        return solve(row, col + 1);
    }
    
}


function solveSudoku() {
    // Fill out the Sudoku

    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            const cellId = `cell-${i}-${j}`;
            if(document.getElementById(cellId).value != "") {
                sudokuArray[i][j] = parseInt(document.getElementById(cellId).value);
            } else {
                sudokuArray[i][j] = 0;
            }
        }
    }

    // User did not enter anything
    if (empty()) {
        alert("Please enter a number!");
        return;
    }
    // Repeated numbers in row, column or 3x3 grid 
    if (!valid()) {
        alert("Invalid Sudoku!");
        return;
    }
    // No solution
    if(!solve(0,0)) {
        alert("No solution!");
        return;
    }

    // Fill out the sudoku with generated values
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            const cellId = `cell-${i}-${j}`;
            const cell = document.getElementById(cellId);
            cell.value = sudokuArray[i][j];
        }
    }
}