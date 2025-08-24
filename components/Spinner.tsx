
import React, { useState, useEffect } from 'react';
import type { Player, Settings } from '../types';

interface SpinnerProps {
  players: Player[];
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onSpinEnd: (player: Player) => void;
  onEditPlayers: () => void;
  lastPickedPlayerId?: string | null;
}

// A more vibrant, neon-like color palette
const colors = [
    '#00ff9d', '#ff00a0', '#00c3ff', '#ffc400', '#a700ff',
    '#00ffc8', '#ff005d', '#00aeff', '#ffe000', '#c400ff'
];

const Spinner: React.FC<SpinnerProps> = ({ players, settings, onSettingsChange, onSpinEnd, onEditPlayers, lastPickedPlayerId }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [spinDuration, setSpinDuration] = useState(5);
  
  const segmentAngle = players.length > 0 ? 360 / players.length : 360;
  
  const spinnerStyle = {
    background: `conic-gradient(${players.map((p, i) => `${colors[i % colors.length]} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ')})`,
    transition: `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1)`,
    transform: `rotate(${rotation}deg)`,
  };

  const handleSpin = () => {
    if (isSpinning || players.length < 2) return;
    
    // 1. Determine available players from ALL players (respecting avoidRepeat).
    let availablePlayers = players;
    if (settings.avoidRepeat && lastPickedPlayerId && players.length > 1) {
        availablePlayers = players.filter(p => p.id !== lastPickedPlayerId);
    }

    // 2. Handle edge case if filtering removed all players.
    if (availablePlayers.length === 0) {
        availablePlayers = players;
    }
    
    // 3. Select a winner from the available players.
    const winnerIndexInAvailable = Math.floor(Math.random() * availablePlayers.length);
    const targetPlayer = availablePlayers[winnerIndexInAvailable];

    // 4. Find the winner's index in the FULL player list for rotation calculation.
    const originalIndex = players.findIndex(p => p.id === targetPlayer.id);

    setWinner(null);
    setIsSpinning(true);
    
    const newSpinDuration = Math.random() * 3 + 4; // 4s to 7s duration
    setSpinDuration(newSpinDuration);

    const baseRotations = (Math.floor(Math.random() * 4) + 5) * 360;
    const targetSegmentCenter = (originalIndex * segmentAngle) + (segmentAngle / 2);
    const targetAngle = 360 - targetSegmentCenter;

    const randomJitter = (Math.random() - 0.5) * (segmentAngle * 0.8);
    const finalRotation = baseRotations + targetAngle + randomJitter;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(targetPlayer);
      if(window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
      setTimeout(() => onSpinEnd(targetPlayer), 1500);
    }, newSpinDuration * 1000 + 100);
  };
  
  const handleAvoidRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSettingsChange({ ...settings, avoidRepeat: e.target.checked });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-4 left-4">
          <button
              onClick={onEditPlayers}
              className="bg-gray-800 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
              Edit Players
          </button>
      </div>

       <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-300">Who's playing next?</h1>
      </div>

      <div className="relative flex flex-col items-center justify-center mb-8">
        <div className="absolute -top-1 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] z-20"></div>
        <div 
          className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-gray-700 shadow-2xl flex items-center justify-center"
          style={{ ...spinnerStyle, filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.2))' }}
        >
          {players.map((player, i) => (
            <div 
              key={player.id} 
              className="absolute w-full h-full" 
              style={{ transform: `rotate(${i * segmentAngle + segmentAngle / 2}deg)` }}
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center" style={{ transform: 'translateX(-50%)' }}>
                <span className="block text-lg font-bold text-gray-900 break-all px-2">
                    {player.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-3 mb-6">
        <input
            id="avoid-repeat"
            type="checkbox"
            checked={settings.avoidRepeat}
            onChange={handleAvoidRepeatChange}
            className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500"
        />
        <label htmlFor="avoid-repeat" className="text-gray-300">Avoid picking the same player twice</label>
      </div>

      {winner && !isSpinning && (
        <div className="text-center mb-6 animate-fadeIn">
            <h2 className="text-4xl font-bold text-emerald-400 animate-pulse">{winner.name}</h2>
            <p className="text-gray-400">will place the next <span className={winner.mark === 'X' ? 'text-cyan-400 font-bold text-glow-cyan' : 'text-fuchsia-500 font-bold text-glow-fuchsia'}>{winner.mark}</span>!</p>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={isSpinning || winner !== null || players.length < 2}
        className="bg-emerald-500 text-gray-900 font-bold px-12 py-4 rounded-lg text-2xl transition-transform hover:scale-105 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isSpinning ? 'Spinning...' : 'Spin!'}
      </button>
    </div>
  );
};

export default Spinner;