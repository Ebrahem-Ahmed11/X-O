
import React, { useEffect } from 'react';
import type { Player } from '../types';

interface TicTacToeProps {
  currentPlayer: Player;
  winnerInfo: { winner: Player; line: number[] } | null;
  board: (string | null)[];
  isDraw: boolean;
  onMarkPlaced: (index: number) => void;
  onGameEnd: () => void; // To reset and go back to spinner
}

const BoardCell: React.FC<{ value: string | null, onClick: () => void, isWinner: boolean, disabled: boolean }> = ({ value, onClick, isWinner, disabled }) => (
  <button 
    onClick={onClick} 
    className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-6xl font-black rounded-lg transition-all duration-300
      ${isWinner ? 'bg-emerald-500 text-gray-900 animate-pulse-glow-emerald' : 'bg-gray-800 border border-gray-700'}
      ${value === 'X' ? 'text-cyan-400 text-glow-cyan' : 'text-fuchsia-500 text-glow-fuchsia'}
      ${!value && !disabled ? 'hover:bg-gray-700 cursor-pointer' : 'cursor-not-allowed'}`}
    disabled={!!value || disabled}
  >
    {value}
  </button>
);

const TicTacToe: React.FC<TicTacToeProps> = ({ currentPlayer, winnerInfo, board, isDraw, onMarkPlaced, onGameEnd }) => {
  const isGameOver = !!winnerInfo || isDraw;

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => {
        onGameEnd();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [isGameOver, onGameEnd]);
  
  const getStatusMessage = () => {
    if (winnerInfo) {
      const winnerMark = winnerInfo.winner.mark;
      const winnerName = winnerInfo.winner.name;
      return <span className={winnerMark === 'X' ? 'text-cyan-400 text-glow-cyan' : 'text-fuchsia-500 text-glow-fuchsia'}>{winnerName} Wins!</span>;
    }
    if (isDraw) {
      return "It's a Draw!";
    }
    const playerName = currentPlayer.name;
    const playerMark = currentPlayer.mark;
    return <>Turn: <span className={playerMark === 'X' ? 'text-cyan-400 text-glow-cyan' : 'text-fuchsia-500 text-glow-fuchsia'}>{playerName} ({playerMark})</span></>;
  };
  
  const getWinnerMessage = () => {
     if (isDraw) {
      return "It's a Draw!";
    }
    if (winnerInfo) {
      return `${winnerInfo.winner.name} is the Winner!`;
    }
    return '';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {isGameOver && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-fadeIn">
            <h2 className="text-5xl font-bold mb-4 text-emerald-400 animate-pulse">{getWinnerMessage()}</h2>
            <p className="text-gray-300">Returning to spinner...</p>
        </div>
      )}
      
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-400 mb-2">Tic-Tac-Toe</h1>
        <p className="text-3xl font-bold text-gray-300 h-10">{getStatusMessage()}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        {board.map((cell, index) => (
          <BoardCell 
            key={index} 
            value={cell} 
            onClick={() => onMarkPlaced(index)} 
            isWinner={winnerInfo?.line.includes(index) ?? false}
            disabled={isGameOver || !!board[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;