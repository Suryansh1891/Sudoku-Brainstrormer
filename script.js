// this is js code
const N = 9;

// initialize the Sudoku grid with null values
let grid = Array.from(Array(N), () => new Array(N).fill(null));

//  update the grid with user input

function updateGrid() {
  let table = document.getElementById("sudoku-grid");
  for (let row = 0; row < N; row++) {
    let tableRow = table.insertRow(row);
    for (let col = 0; col < N; col++) {
      let cell = tableRow.insertCell(col);
      let input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.max = "9";
      input.value = grid[row][col] || "";

      // Add event listeners to move to the next/previous block
      input.addEventListener("input", function (e) {
        moveToNextBlock(row, col);
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          moveToNextBlock(row, col);
        } else if (e.key === "Backspace" && input.value === "") {
          e.preventDefault();
          moveToPreviousBlock(row, col);
        }
      });

      cell.appendChild(input);
    }
  }
}

// Function to move to the next block after entering a number
function moveToNextBlock(row, col) {
  let nextRow = row;
  let nextCol = col;
  if (col === N - 1) {
    if (row === N - 1) {
      // Reached the last block, do nothing
      return;
    } else {
      nextRow = row + 1;
      nextCol = 0;
    }
  } else {
    nextCol = col + 1;
  }
  let nextInput = document.querySelector(
    `#sudoku-grid tr:nth-child(${nextRow + 1}) td:nth-child(${
      nextCol + 1
    }) input`
  );
  nextInput.focus();
}

// Function to move to the previous block when Backspace is pressed
function moveToPreviousBlock(row, col) {
  let prevRow = row;
  let prevCol = col;
  if (col === 0) {
    if (row === 0) {
      // Reached the first block, do nothing
      return;
    } else {
      prevRow = row - 1;
      prevCol = N - 1;
    }
  } else {
    prevCol = col - 1;
  }
  let prevInput = document.querySelector(
    `#sudoku-grid tr:nth-child(${prevRow + 1}) td:nth-child(${
      prevCol + 1
    }) input`
  );
  prevInput.focus();
  prevInput.value = ""; // Clear the previous block
}

// handle key press event
function handleKeyPress(event, row, col) {
  const tabKeyCode = 9;
  const enterKeyCode = 13;

  if (event.keyCode === tabKeyCode || event.keyCode === enterKeyCode) {
    event.preventDefault();

    // Move to the next cell
    let nextRow = row;
    let nextCol = col;

    if (col === N - 1) {
      nextRow = row + 1;
      nextCol = 0;
    } else {
      nextCol = col + 1;
    }

    // Check if it is the last cell in the grid
    if (nextRow === N && nextCol === 0) {
      solveSudoku();
    } else {
      // Focus on the next input field
      let nextInput = document.getElementById(`input-${nextRow}-${nextCol}`);
      nextInput.focus();
    }
  }
}

// check if a value is safe to be placed in a cell
function isSafe(row, col, val) {
  for (let i = 0; i < N; i++) {
    // Check for row
    if (grid[row][i] == val) return false;
    // Check for column
    if (grid[i][col] == val) return false;
    // Check for 3x3 matrix
    if (
      grid[Math.floor(row / 3) * 3 + Math.floor(i / 3)][
        Math.floor(col / 3) * 3 + (i % 3)
      ] == val
    )
      return false;
  }
  return true;
}

// solve Sudoku using backtracking
function solveSudoku() {
  // Retrieve the input values from the grid
  let table = document.getElementById("sudoku-grid");
  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      let input = table.rows[row].cells[col].firstChild;
      grid[row][col] = input.value !== "" ? parseInt(input.value) : null;
    }
  }

  // Call the recursive helper function
  if (solveSudokuHelper(0, 0)) {
    // Display the solved Sudoku grid
    let solutionDiv = document.getElementById("solution-grid");
    solutionDiv.innerHTML = "";
    let solutionTable = document.createElement("table");
    for (let row = 0; row < N; row++) {
      let tableRow = solutionTable.insertRow(row);
      for (let col = 0; col < N; col++) {
        let cell = tableRow.insertCell(col);
        // before
        cell.innerText = grid[row][col];

        // after
        let value = grid[row][col];
        cell.innerText = value;

        // add different color to solved cells
        if (value !== null) {
          cell.classList.add("solved-cell");
        }
      }
    }
    solutionDiv.appendChild(solutionTable);
  } else {
    let solutionDiv = document.getElementById("solution-grid");
    solutionDiv.innerHTML = "No solution found.";
  }
}
function resetGrid() {
  let table = document.getElementById("sudoku-grid");
  table.innerHTML = ""; // clear the grid

  // Reinitialize the grid with null values
  grid = Array.from(Array(N), () => new Array(N).fill(null));

  // Update the grid with user input
  updateGrid();

  // Clear the solution
  let solutionDiv = document.getElementById("solution-grid");
  solutionDiv.innerHTML = "";
}

function solveSudokuHelper(row, col) {
  // Base case: If all cells have been filled, return true
  if (row === N) {
    return true;
  }

  // Move to the next column or next row
  let nextRow = col === N - 1 ? row + 1 : row;
  let nextCol = col === N - 1 ? 0 : col + 1;

  // Skip if the current cell is already filled
  if (grid[row][col] !== null) {
    return solveSudokuHelper(nextRow, nextCol);
  }

  // Try all possible values for the current cell
  for (let val = 1; val <= 9; val++) {
    if (isSafe(row, col, val)) {
      grid[row][col] = val;

      if (solveSudokuHelper(nextRow, nextCol)) {
        return true;
      } else {
        grid[row][col] = null; // Backtrack
      }
    }
  }

  return false;
}

// display the solved Sudoku grid
function displaySolution() {
  let solutionDiv = document.getElementById("solution-grid");
  solutionDiv.innerHTML = "";
  let solutionTable = document.createElement("table");
  for (let row = 0; row < N; row++) {
    let tableRow = solutionTable.insertRow(row);
    for (let col = 0; col < N; col++) {
      let cell = tableRow.insertCell(col);
      let value = grid[row][col];
      cell.innerText = value;

      // add diff-diff color to solved cells
      if (value !== null) {
        cell.classList.add("solved-cell");
      }
    }
  }
  solutionDiv.appendChild(solutionTable);
}

// Initialize the sudoku and update HTML
updateGrid();
