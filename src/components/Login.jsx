import React, { useState } from 'react';
import { User } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 animate-fade-in">
      <div className="w-full max-w-md p-8 rounded-2xl bg-app-panel shadow-sm border border-app-accent/10">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-app-accent/20 rounded-full">
            <User size={48} className="text-app-accent" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Benvenuto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 opacity-70">
              Inserisci il tuo nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Il tuo nome..."
              autoFocus
              className="w-full p-3 rounded-lg bg-app-bg border border-app-accent/30 focus:outline-none focus:ring-2 focus:ring-app-accent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-app-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Inizia a Giocare
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
