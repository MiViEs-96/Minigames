import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Timer, Star } from 'lucide-react';
import {
  COLS, ROWS, createGrid, randomTetromino, checkCollision, rotate,
  getInitialSpeed, calculateSpeed
} from '../../utils/tetrisLogic';
import { saveTetrisScore, getTetrisScores, formatTime } from '../../utils/storage';

const TetrisGame = ({ username, mode, difficulty, onBack }) => {
  const [grid, setGrid] = useState(createGrid());
  const [activePiece, setActivePiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(randomTetromino());
  const [holdPiece, setHoldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bestScores, setBestScores] = useState([]);

  const initialSpeed = getInitialSpeed(difficulty);
  const gameLoopRef = useRef();

  // Inizializza gioco
  const startNewGame = useCallback(() => {
    setGrid(createGrid());
    const firstPiece = randomTetromino();
    setActivePiece(firstPiece);
    setNextPiece(randomTetromino());
    setHoldPiece(null);
    setCanHold(true);
    setPos({ x: Math.floor(COLS / 2) - 1, y: 0 });
    setScore(0);
    setLines(0);
    setTime(0);
    setGameOver(false);
    setIsPaused(false);

    const scores = getTetrisScores();
    setBestScores(scores[`${mode}_${difficulty}`] || []);
  }, [mode, difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Timer del tempo
  useEffect(() => {
    let interval;
    if (!gameOver && !isPaused) {
      interval = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameOver, isPaused]);

  // Movimento verso il basso
  const moveDown = useCallback(() => {
    if (!activePiece || gameOver || isPaused) return;

    if (!checkCollision(activePiece, grid, { x: pos.x, y: pos.y + 1 })) {
      setPos(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      // Blocca il pezzo
      if (pos.y <= 0) {
        setGameOver(true);
        saveTetrisScore(username, mode, difficulty, mode === 'score' ? score : time);
        return;
      }

      const newGrid = grid.map(row => [...row]);
      activePiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            newGrid[pos.y + r][pos.x + c] = activePiece.color;
          }
        });
      });

      // Cancella linee
      let linesCleared = 0;
      const filteredGrid = newGrid.filter(row => {
        const isFull = row.every(cell => cell !== 0);
        if (isFull) linesCleared++;
        return !isFull;
      });

      while (filteredGrid.length < ROWS) {
        filteredGrid.unshift(Array(COLS).fill(0));
      }

      setGrid(filteredGrid);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + (linesCleared * 100 * (linesCleared + 1))); // Bonus per linee multiple

      // Nuovo pezzo
      setActivePiece(nextPiece);
      setNextPiece(randomTetromino());
      setPos({ x: Math.floor(COLS / 2) - 1, y: 0 });
      setCanHold(true);
    }
  }, [activePiece, grid, pos, nextPiece, gameOver, isPaused, username, mode, difficulty, score, time]);

  // Game Loop (Velocità variabile)
  useEffect(() => {
    if (!gameOver && !isPaused) {
      const speed = calculateSpeed(initialSpeed, time, lines);
      gameLoopRef.current = setInterval(moveDown, speed);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [moveDown, gameOver, isPaused, initialSpeed, time, lines]);

  // Controlli
  const handleMove = (dir) => {
    if (!checkCollision(activePiece, grid, { x: pos.x + dir, y: pos.y })) {
      setPos(prev => ({ ...prev, x: prev.x + dir }));
    }
  };

  const handleRotate = (dir) => {
    const rotatedShape = rotate(activePiece.shape, dir);
    const rotatedPiece = { ...activePiece, shape: rotatedShape };
    if (!checkCollision(rotatedPiece, grid, pos)) {
      setActivePiece(rotatedPiece);
    }
  };

  const handleHold = () => {
    if (!canHold || gameOver || isPaused) return;

    if (!holdPiece) {
      setHoldPiece(activePiece);
      setActivePiece(nextPiece);
      setNextPiece(randomTetromino());
    } else {
      const temp = activePiece;
      setActivePiece(holdPiece);
      setHoldPiece(temp);
    }
    setPos({ x: Math.floor(COLS / 2) - 1, y: 0 });
    setCanHold(false);
  };

  const hardDrop = () => {
    let newY = pos.y;
    while (!checkCollision(activePiece, grid, { x: pos.x, y: newY + 1 })) {
      newY++;
    }
    setPos(prev => ({ ...prev, y: newY }));
    // Innesca immediatamente il lock chiamando moveDown nell'istante successivo
    setTimeout(moveDown, 0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a': handleMove(-1); break;
        case 'arrowright':
        case 'd': handleMove(1); break;
        case 'arrowdown':
        case 's': moveDown(); break;
        case 'arrowup':
        case 'w': hardDrop(); break;
        case 'q': handleRotate(-1); break;
        case 'e': handleRotate(1); break;
        case 'f': handleHold(); break;
        case 'p': setIsPaused(!isPaused); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleRotate, handleHold, moveDown, hardDrop, gameOver, isPaused]);

  // Rendering griglia combinata (griglia fissa + pezzo attivo)
  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);
    if (activePiece && !gameOver) {
      activePiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0 && pos.y + r >= 0) {
            displayGrid[pos.y + r][pos.x + c] = activePiece.color;
          }
        });
      });
    }
    return displayGrid;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in items-start justify-center">
      <div className="flex flex-col gap-4">
        <button onClick={onBack} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft size={20} />
          <span>Torna alla Lobby</span>
        </button>

        {/* Pannello Hold */}
        <div className="p-4 rounded-xl bg-app-panel border border-app-accent/10 w-32 h-32 flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase opacity-50 mb-2">Hold (F)</span>
          <div className="relative w-16 h-16">
            {holdPiece && holdPiece.shape.map((row, r) =>
              row.map((cell, c) => cell !== 0 && (
                <div key={`${r}-${c}`} className="absolute w-4 h-4 rounded-sm border border-black/10"
                     style={{ backgroundColor: holdPiece.color, top: r * 16, left: c * 16 }} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Game Board */}
      <div className="relative p-2 bg-app-text rounded-lg shadow-2xl border-4 border-app-accent/20">
        <div className="grid grid-cols-10 gap-[1px] bg-app-text/20 overflow-hidden"
             style={{ width: '300px', height: '600px', gridTemplateRows: 'repeat(20, 1fr)' }}>
          {renderGrid().map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-full h-full rounded-sm ${cell === 0 ? 'bg-app-bg/10' : ''}`}
                style={{ backgroundColor: cell !== 0 ? cell : undefined }}
              />
            ))
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-6 text-center rounded-sm">
            <h2 className="text-4xl font-bold mb-4">GAME OVER</h2>
            <p className="text-xl mb-6">
              {mode === 'score' ? `Punteggio: ${score}` : `Tempo: ${formatTime(time)}`}
            </p>
            <button
              onClick={startNewGame}
              className="flex items-center gap-2 px-6 py-3 bg-app-accent rounded-full font-bold hover:scale-105 transition-transform"
            >
              <RotateCcw size={20} /> Riprova
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white rounded-sm">
            <h2 className="text-3xl font-bold">PAUSA</h2>
          </div>
        )}
      </div>

      {/* Sidebar Statistiche e Next */}
      <div className="flex flex-col gap-6 w-64">
        {/* Next Piece */}
        <div className="p-4 rounded-xl bg-app-panel border border-app-accent/10 flex flex-col items-center">
          <span className="text-xs font-bold uppercase opacity-50 mb-4">Next Piece</span>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="relative" style={{ width: nextPiece.shape[0].length * 20, height: nextPiece.shape.length * 20 }}>
              {nextPiece.shape.map((row, r) =>
                row.map((cell, c) => cell !== 0 && (
                  <div key={`${r}-${c}`} className="absolute w-5 h-5 rounded-sm border border-black/10"
                       style={{ backgroundColor: nextPiece.color, top: r * 20, left: c * 20 }} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 rounded-xl bg-app-panel border border-app-accent/10 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 opacity-60"><Star size={16} /> <span className="text-sm">Punti</span></div>
            <span className="font-bold font-mono text-lg">{score}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 opacity-60"><Timer size={16} /> <span className="text-sm">Tempo</span></div>
            <span className="font-bold font-mono text-lg">{formatTime(time)}</span>
          </div>
        </div>

        {/* Best Scores */}
        <div className="p-6 rounded-xl bg-app-panel border border-app-accent/10">
          <div className="flex items-center gap-2 mb-4 text-app-accent">
            <Trophy size={18} />
            <h3 className="font-bold uppercase text-xs tracking-widest">Top 5 - {mode === 'score' ? 'Punti' : 'Tempo'}</h3>
          </div>
          <div className="space-y-2">
            {bestScores.length === 0 ? (
              <p className="text-xs opacity-50 italic">Nessun record</p>
            ) : (
              bestScores.map((s, i) => (
                <div key={i} className="flex justify-between text-xs border-b border-app-accent/5 pb-1">
                  <span>{i+1}. {s.username}</span>
                  <span className="font-bold">{mode === 'score' ? s.value : formatTime(s.value)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
