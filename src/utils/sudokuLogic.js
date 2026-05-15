import _ from 'lodash';

/**
 * Verifica se un numero può essere inserito in una data posizione.
 */
export const isValid = (grid, row, col, num) => {
  // Controlla riga
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Controlla colonna
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Controlla quadratino 3x3
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

/**
 * Risolve il Sudoku usando backtracking.
 */
export const solveSudoku = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const nums = _.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

/**
 * Genera un nuovo schema di Sudoku.
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 */
export const generateSudoku = (difficulty) => {
  // Crea griglia vuota
  const grid = Array(9).fill(0).map(() => Array(9).fill(0));

  // Risolvi per generare uno schema completo
  solveSudoku(grid);

  // Copia la soluzione
  const solution = grid.map(row => [...row]);

  // Rimuovi numeri in base alla difficoltà
  let attempts;
  switch (difficulty) {
    case 'easy': attempts = 30; break;
    case 'medium': attempts = 45; break;
    case 'hard': attempts = 55; break;
    default: attempts = 30;
  }

  const puzzle = grid.map(row => [...row]);
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      attempts--;
    }
  }

  return { puzzle, solution };
};

/**
 * Trova errori nella griglia attuale (duplicati).
 */
export const findErrors = (grid) => {
  const errors = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val === 0) continue;

      // Controllo riga
      for (let i = 0; i < 9; i++) {
        if (i !== c && grid[r][i] === val) errors.push(`${r}-${c}`);
      }

      // Controllo colonna
      for (let i = 0; i < 9; i++) {
        if (i !== r && grid[i][c] === val) errors.push(`${r}-${c}`);
      }

      // Controllo quadratino
      const startRow = r - (r % 3);
      const startCol = c - (c % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const currR = i + startRow;
          const currC = j + startCol;
          if ((currR !== r || currC !== c) && grid[currR][currC] === val) {
            errors.push(`${r}-${c}`);
          }
        }
      }
    }
  }
  return [...new Set(errors)];
};
