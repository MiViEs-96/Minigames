import React from 'react';
import { Grid3X3, LayoutGrid, LogOut } from 'lucide-react';

const Lobby = ({ username, onStartSudoku, onStartTetris, onLogout }) => {
  return (
    <div className="flex flex-col items-center mt-10 animate-fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Ciao, {username}!</h2>
            <p className="opacity-70">Cosa vuoi giocare oggi?</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <LogOut size={18} />
            <span>Esci</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Sudoku */}
          <div className="p-6 rounded-2xl bg-app-panel border border-app-accent/10 hover:border-app-accent/50 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-app-accent/20 rounded-xl">
                <Grid3X3 size={32} className="text-app-accent" />
              </div>
              <h3 className="text-xl font-semibold">Sudoku</h3>
            </div>
            <p className="mb-8 opacity-70">Riempi la griglia con i numeri da 1 a 9 senza ripetizioni.</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => onStartSudoku('easy')} className="game-btn-green">Facile</button>
              <button onClick={() => onStartSudoku('medium')} className="game-btn-orange">Medio</button>
              <button onClick={() => onStartSudoku('hard')} className="game-btn-red">Difficile</button>
            </div>
          </div>

          {/* Card Tetris */}
          <div className="p-6 rounded-2xl bg-app-panel border border-app-accent/10 hover:border-app-accent/50 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-app-accent/20 rounded-xl">
                <LayoutGrid size={32} className="text-app-accent" />
              </div>
              <h3 className="text-xl font-semibold">Tetris</h3>
            </div>
            <p className="mb-4 opacity-70">Incastra i pezzi e cancella le righe prima che tocchino il soffitto!</p>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase opacity-50 mb-2 block">Modalità Punti</span>
                <div className="flex flex-col gap-2">
                  <button onClick={() => onStartTetris('score', 'easy')} className="game-btn-green">Punti - Facile</button>
                  <button onClick={() => onStartTetris('score', 'medium')} className="game-btn-orange">Punti - Medio</button>
                  <button onClick={() => onStartTetris('score', 'hard')} className="game-btn-red">Punti - Difficile</button>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold uppercase opacity-50 mb-2 block">Modalità Tempo</span>
                <div className="flex flex-col gap-2">
                  <button onClick={() => onStartTetris('time', 'easy')} className="game-btn-green">Tempo - Facile</button>
                  <button onClick={() => onStartTetris('time', 'medium')} className="game-btn-orange">Tempo - Medio</button>
                  <button onClick={() => onStartTetris('time', 'hard')} className="game-btn-red">Tempo - Difficile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
