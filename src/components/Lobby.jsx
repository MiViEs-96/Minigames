import React from 'react';
import { Grid3X3, LogOut } from 'lucide-react';

const Lobby = ({ username, onStartSudoku, onLogout }) => {
  return (
    <div className="flex flex-col items-center mt-10 animate-fade-in">
      <div className="w-full max-w-2xl">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <button
                onClick={() => onStartSudoku('easy')}
                className="w-full py-2 px-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 font-medium transition-colors border border-green-500/20"
              >
                Facile
              </button>
              <button
                onClick={() => onStartSudoku('medium')}
                className="w-full py-2 px-4 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-medium transition-colors border border-orange-500/20"
              >
                Medio
              </button>
              <button
                onClick={() => onStartSudoku('hard')}
                className="w-full py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium transition-colors border border-red-500/20"
              >
                Difficile
              </button>
            </div>
          </div>

          {/* Placeholder per futuri giochi */}
          <div className="p-6 rounded-2xl bg-app-panel/50 border border-dashed border-app-accent/20 flex flex-col items-center justify-center text-center opacity-50">
            <p className="text-lg font-medium">Prossimamente...</p>
            <p className="text-sm">Nuovi giochi in arrivo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
