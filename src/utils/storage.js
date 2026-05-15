const STORAGE_KEY = 'minigames_sudoku_scores';

/**
 * Salva un nuovo tempo nel localStorage.
 * Mantiene solo i migliori 5 tempi per ogni difficoltà.
 * @param {string} username - Nome dell'utente
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @param {number} timeSeconds - Tempo in secondi
 */
export const saveScore = (username, difficulty, timeSeconds) => {
  const scores = getScores();

  if (!scores[difficulty]) {
    scores[difficulty] = [];
  }

  scores[difficulty].push({
    username,
    time: timeSeconds,
    date: new Date().toISOString()
  });

  // Ordina per tempo crescente (il migliore è il più basso)
  scores[difficulty].sort((a, b) => a.time - b.time);

  // Mantieni solo i primi 5
  scores[difficulty] = scores[difficulty].slice(0, 5);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  return scores[difficulty];
};

/**
 * Recupera i punteggi salvati.
 * @returns {Object} Oggetto con le categorie di difficoltà e i relativi punteggi
 */
export const getScores = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      easy: [],
      medium: [],
      hard: []
    };
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Errore nel caricamento dei punteggi:", e);
    return {
      easy: [],
      medium: [],
      hard: []
    };
  }
};

/**
 * Formatta i secondi in stringa MM:SS
 * @param {number} seconds
 * @returns {string}
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
