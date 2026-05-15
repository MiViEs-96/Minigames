export const COLS = 10;
export const ROWS = 20;

export const TETROMINOS = {
  I: { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], color: '#00f0f0' },
  J: { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], color: '#0000f0' },
  L: { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], color: '#f0a000' },
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' },
  S: { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: '#00f000' },
  T: { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], color: '#a000f0' },
  Z: { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: '#f00000' }
};

export const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return { ...TETROMINOS[key], type: key };
};

export const createGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export const checkCollision = (piece, grid, { x, y }) => {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] !== 0) {
        const newX = x + c;
        const newY = y + r;
        if (
          newX < 0 ||
          newX >= COLS ||
          newY >= ROWS ||
          (newY >= 0 && grid[newY][newX] !== 0)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const rotate = (matrix, dir) => {
  // Trasponi
  const m = matrix.map((_, i) => matrix.map(col => col[i]));
  // Inverti righe per rotazione oraria, o colonne per antioraria
  if (dir > 0) return m.map(row => row.reverse());
  return m.reverse();
};

export const getInitialSpeed = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 800;
    case 'medium': return 500;
    case 'hard': return 200;
    default: return 800;
  }
};

export const calculateSpeed = (initialSpeed, timeElapsed, linesCleared) => {
  // La velocità aumenta linearmente col tempo (ogni 30s riduce l'intervallo di 50ms)
  // e con le linee cancellate (ogni linea riduce l'intervallo di 10ms)
  const timeFactor = Math.floor(timeElapsed / 30) * 50;
  const lineFactor = linesCleared * 10;
  const newSpeed = initialSpeed - timeFactor - lineFactor;
  return Math.max(newSpeed, 100); // Non scendere sotto i 100ms
};
