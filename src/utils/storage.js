const SUDOKU_KEY = 'minigames_sudoku_scores';
const TETRIS_KEY = 'minigames_tetris_scores';

/**
 * SUDOKU
 */
export const saveSudokuScore = (username, difficulty, timeSeconds) => {
  const scores = getSudokuScores();
  if (!scores[difficulty]) scores[difficulty] = [];

  scores[difficulty].push({ username, time: timeSeconds, date: new Date().toISOString() });
  scores[difficulty].sort((a, b) => a.time - b.time);
  scores[difficulty] = scores[difficulty].slice(0, 5);

  localStorage.setItem(SUDOKU_KEY, JSON.stringify(scores));
  return scores[difficulty];
};

export const getSudokuScores = () => {
  const stored = localStorage.getItem(SUDOKU_KEY);
  if (!stored) return { easy: [], medium: [], hard: [] };
  try { return JSON.parse(stored); } catch (e) { return { easy: [], medium: [], hard: [] }; }
};

/**
 * TETRIS
 */
export const saveTetrisScore = (username, mode, difficulty, value) => {
  const scores = getTetrisScores();
  const key = `${mode}_${difficulty}`; // e.g., 'time_easy' or 'score_easy'
  if (!scores[key]) scores[key] = [];

  scores[key].push({ username, value, date: new Date().toISOString() });

  // Per 'time' e 'score' in Tetris, il valore più ALTO è il migliore
  scores[key].sort((a, b) => b.value - a.value);
  scores[key] = scores[key].slice(0, 5);

  localStorage.setItem(TETRIS_KEY, JSON.stringify(scores));
  return scores[key];
};

export const getTetrisScores = () => {
  const stored = localStorage.getItem(TETRIS_KEY);
  if (!stored) return {};
  try { return JSON.parse(stored); } catch (e) { return {}; }
};

/**
 * UTILS
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
