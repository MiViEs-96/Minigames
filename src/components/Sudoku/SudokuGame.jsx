import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, Pencil, Play, Trash2, Trophy } from 'lucide-react';
import { generateSudoku, findErrors } from '../../utils/sudokuLogic';
import { saveSudokuScore, getSudokuScores, formatTime } from '../../utils/storage';

const SudokuGame = ({ username, difficulty, onBack, darkMode }) => {
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const [bestScores, setBestScores] = useState([]);
  const [gameWon, setGameWon] = useState(false);

  const startNewGame = useCallback(() => {
    const { puzzle, solution: sol } = generateSudoku(difficulty);
    setGrid(puzzle.map(row => [...row]));
    setInitialGrid(puzzle.map(row => [...row]));
    setSolution(sol);
    setNotes({});
    setSelectedCell(null);
    setTime(0);
    setIsActive(true);
    setErrors([]);
    setGameWon(false);

    const scores = getSudokuScores();
    setBestScores(scores[difficulty] || []);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    let interval = null;
    if (isActive && !gameWon) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, gameWon]);

  useEffect(() => {
    if (grid.length === 0) return;

    const isComplete = grid.every(row => row.every(cell => cell !== 0));
    if (isComplete) {
      const currentErrors = findErrors(grid);
      if (currentErrors.length === 0) {
        setGameWon(true);
        setIsActive(false);
        const updatedScores = saveSudokuScore(username, difficulty, time);
        setBestScores(updatedScores);
      }
    }
    setErrors(findErrors(grid));
  }, [grid, username, difficulty, time]);

  const handleCellClick = (r, c) => {
    if (gameWon) return;
    setSelectedCell({ r, c });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell || gameWon) return;
    const { r, c } = selectedCell;

    if (initialGrid[r][c] !== 0) return;

    if (isNoteMode) {
      const key = `${r}-${c}`;
      const currentNotes = notes[key] || [];
      if (currentNotes.includes(num)) {
        setNotes({ ...notes, [key]: currentNotes.filter(n => n !== num) });
      } else {
        setNotes({ ...notes, [key]: [...currentNotes, num].sort() });
      }
      const newGrid = [...grid];
      newGrid[r][c] = 0;
      setGrid(newGrid);
    } else {
      const newGrid = [...grid];
      newGrid[r][c] = newGrid[r][c] === num ? 0 : num;
      setGrid(newGrid);
      const newNotes = { ...notes };
      delete newNotes[`${r}-${c}`];
      setNotes(newNotes);
    }
  };

  const handleHint = () => {
    if (!selectedCell || gameWon) return;
    const { r, c } = selectedCell;
    if (grid[r][c] !== 0) return;

    const newGrid = [...grid];
    newGrid[r][c] = solution[r][c];
    setGrid(newGrid);
  };

  const handleReset = () => {
    if (window.confirm("Vuoi davvero cancellare tutti i tuoi inserimenti?")) {
      setGrid(initialGrid.map(row => [...row]));
      setNotes({});
      setErrors([]);
    }
  };

  const handleKeyPress = useCallback((e) => {
    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      if (selectedCell && initialGrid[selectedCell.r][selectedCell.c] === 0) {
        const newGrid = [...grid];
        newGrid[selectedCell.r][selectedCell.c] = 0;
        setGrid(newGrid);
      }
    }
  }, [selectedCell, grid, initialGrid, isNoteMode, notes, handleNumberInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft size={20} />
            <span>Torna alla Lobby</span>
          </button>
          <div className="flex flex-col items-end">
            <span className="text-sm opacity-60 uppercase tracking-widest font-bold">{difficulty}</span>
            <span className="text-2xl font-mono">{formatTime(time)}</span>
          </div>
        </div>

        <div className="sudoku-grid bg-app-panel text-app-text border-2 border-app-text overflow-hidden rounded-lg shadow-xl">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isFixed = initialGrid[r][c] !== 0;
              const hasError = errors.includes(`${r}-${c}`);
              const noteKey = `${r}-${c}`;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`sudoku-cell
                    ${isSelected ? 'selected' : ''}
                    ${isFixed ? 'fixed bg-app-text/5 font-bold' : 'font-medium'}
                    ${hasError ? 'error text-red-500 bg-red-500/10' : ''}
                    ${(r % 3 === 0 && r !== 0) ? 'border-t-2' : ''}
                    ${(c % 3 === 0 && c !== 0) ? 'border-l-2' : ''}
                  `}
                >
                  {cell !== 0 ? cell : (
                    <div className="notes-grid">
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <div key={n} className="flex items-center justify-center">
                          {notes[noteKey]?.includes(n) ? n : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="py-4 text-xl font-bold rounded-xl bg-app-panel hover:bg-app-accent hover:text-white transition-all shadow-sm border border-app-accent/10"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setIsNoteMode(!isNoteMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${isNoteMode ? 'bg-app-accent text-white' : 'bg-app-panel'}`}
          >
            <Pencil size={18} />
            <span>Note: {isNoteMode ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={handleHint}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-app-panel hover:bg-yellow-500/20 transition-all"
          >
            <Lightbulb size={18} className="text-yellow-500" />
            <span>Suggerimento</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-app-panel hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={18} className="text-red-500" />
            <span>Ripristina</span>
          </button>
          <button
            onClick={startNewGame}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-app-accent text-white transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <RotateCcw size={18} />
            <span>Nuovo Schema</span>
          </button>
        </div>
      </div>

      <div className="w-full lg:w-64 flex flex-col gap-6">
        <div className="p-6 rounded-2xl bg-app-panel border border-app-accent/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-app-accent">
            <Trophy size={20} />
            <h3 className="font-bold uppercase text-sm tracking-widest">Top 5 - {difficulty}</h3>
          </div>
          <div className="space-y-3">
            {bestScores.length === 0 ? (
              <p className="text-sm opacity-50 italic">Nessun risultato ancora</p>
            ) : (
              bestScores.map((score, index) => (
                <div key={index} className="flex justify-between items-center text-sm border-b border-app-accent/5 pb-2">
                  <span className="font-medium">{index + 1}. {score.username}</span>
                  <span className="font-mono font-bold">{formatTime(score.time)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {gameWon && (
          <div className="p-6 rounded-2xl bg-green-500/20 border border-green-500 text-green-700 dark:text-green-400 animate-bounce">
            <h3 className="font-bold text-center">VITTORIA!</h3>
            <p className="text-sm text-center">Hai completato lo schema in {formatTime(time)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SudokuGame;
