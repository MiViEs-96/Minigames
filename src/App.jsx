import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Lobby from './components/Lobby';
import SudokuGame from './components/Sudoku/SudokuGame';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');
  const [difficulty, setDifficulty] = useState('easy');
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = (name) => {
    setUser(name);
    setScreen('lobby');
  };

  const startSudoku = (diff) => {
    setDifficulty(diff);
    setScreen('sudoku');
  };

  const goToLobby = () => {
    setScreen('lobby');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen">
      <header className="p-4 flex justify-between items-center max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold tracking-tight">MiniGames</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full transition-colors bg-app-panel hover:bg-app-accent hover:text-white"
          title={darkMode ? "Attiva Light Mode" : "Attiva Dark Mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {screen === 'login' && <Login onLogin={handleLogin} />}
        {screen === 'lobby' && (
          <Lobby
            username={user}
            onStartSudoku={startSudoku}
            onLogout={() => setScreen('login')}
          />
        )}
        {screen === 'sudoku' && (
          <SudokuGame
            username={user}
            difficulty={difficulty}
            onBack={goToLobby}
            darkMode={darkMode}
          />
        )}
      </main>
    </div>
  );
}

export default App;
