
import React, { useState } from 'react';
import type { Player } from '../types';

interface PlayerSetupProps {
  initialPlayers: Player[];
  onSetupComplete: (players: Player[]) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ initialPlayers, onSetupComplete }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedMark, setSelectedMark] = useState<'X' | 'O'>('X');
  const [error, setError] = useState<string | null>(null);

  const teamXPlayers = players.filter(p => p.mark === 'X');
  const teamOPlayers = players.filter(p => p.mark === 'O');

  const handleAddPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (!trimmedName) {
      setError('Player name cannot be empty.');
      return;
    }
    if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Player name must be unique across both teams.');
      return;
    }
     if (players.length >= 10) {
      setError('You can add a maximum of 10 players in total.');
      return;
    }

    setPlayers([...players, { id: Date.now().toString(), name: trimmedName, mark: selectedMark }]);
    setNewPlayerName('');
    setError(null);
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const canStart = teamXPlayers.length > 0 && teamOPlayers.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white relative">
      <div className="w-full max-w-2xl">
        <h1 className="text-6xl font-black mb-2 text-center bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text">Spinner XO</h1>
        <p className="text-gray-400 mb-8 text-center">Assign players to Team X and Team O.</p>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-4 rounded-xl mb-6">
            <div className="flex gap-2 items-center mb-4">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="flex-grow bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              <button onClick={handleAddPlayer} className="bg-cyan-500 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-cyan-400 transition-transform hover:scale-105">Add Player</button>
            </div>
             <div className="flex justify-center gap-6 mb-2">
                <label className="flex items-center gap-2 text-xl font-bold cursor-pointer">
                  <input type="radio" name="mark" value="X" checked={selectedMark === 'X'} onChange={() => setSelectedMark('X')} className="form-radio h-5 w-5 text-cyan-400 bg-gray-700 border-gray-600 focus:ring-cyan-500"/>
                  <span className="text-cyan-400 text-glow-cyan">Add to Team X</span>
                </label>
                <label className="flex items-center gap-2 text-xl font-bold cursor-pointer">
                  <input type="radio" name="mark" value="O" checked={selectedMark === 'O'} onChange={() => setSelectedMark('O')} className="form-radio h-5 w-5 text-fuchsia-500 bg-gray-700 border-gray-600 focus:ring-fuchsia-500"/>
                  <span className="text-fuchsia-500 text-glow-fuchsia">Add to Team O</span>
                </label>
            </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800/50 border border-cyan-500/30 p-3 rounded-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-3 text-center text-glow-cyan">Team X ({teamXPlayers.length})</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {teamXPlayers.map(player => (
                <div key={player.id} className="flex items-center justify-between bg-gray-900/70 p-3 rounded-lg">
                  <span className="font-medium">{player.name}</span>
                  <button onClick={() => handleDeletePlayer(player.id)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800/50 border border-fuchsia-500/30 p-3 rounded-xl">
            <h2 className="text-2xl font-bold text-fuchsia-500 mb-3 text-center text-glow-fuchsia">Team O ({teamOPlayers.length})</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {teamOPlayers.map(player => (
                <div key={player.id} className="flex items-center justify-between bg-gray-900/70 p-3 rounded-lg">
                  <span className="font-medium">{player.name}</span>
                  <button onClick={() => handleDeletePlayer(player.id)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onSetupComplete(players)}
          disabled={!canStart}
          className="w-full bg-emerald-500 text-gray-900 font-bold py-4 rounded-lg text-xl hover:bg-emerald-400 transition-transform hover:scale-105 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100"
        >
          {canStart ? 'Start Spinning' : 'Each team needs at least one player'}
        </button>
      </div>
      <div className="absolute bottom-4 text-gray-600 text-sm font-mono">
        Made by: M Ebrahem Ahmed
      </div>
    </div>
  );
};

export default PlayerSetup;