
import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import PlayerSetup from './components/PlayerSetup';
import Spinner from './components/Spinner';
import TicTacToe from './components/TicTacToe';
import { Screen } from './types';
import type { Player, Settings, StoredData } from './types';
import { LOCAL_STORAGE_KEY } from './constants';

const calculateWinner = (squares: (string | null)[]): { winnerMark: string | null; line: number[] | null } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winnerMark: squares[a], line: lines[i] };
      }
    }
    return { winnerMark: null, line: null };
};

const App: React.FC = () => {
  const [storedData, setStoredData] = useLocalStorage<StoredData>(LOCAL_STORAGE_KEY, {
    players: [],
    settings: { avoidRepeat: true },
    lastPickedPlayerId: null,
  });

  const [screen, setScreen] = useState<Screen>(Screen.Setup);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  // Game state
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player, line: number[] } | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const teamX = storedData.players.filter(p => p.mark === 'X');
    const teamO = storedData.players.filter(p => p.mark === 'O');
    if (teamX.length > 0 && teamO.length > 0) {
      setScreen(Screen.Spinner);
    } else {
      setScreen(Screen.Setup);
    }
  }, []);

  const handleSetupComplete = (players: Player[]) => {
    setStoredData(prev => ({ ...prev, players, lastPickedPlayerId: null }));
    resetGame();
    setScreen(Screen.Spinner);
  }
  
  const handleEditPlayers = () => {
      setScreen(Screen.Setup);
  };
  
  const handleSettingsChange = (settings: Settings) => {
    setStoredData(prev => ({...prev, settings}));
  }

  const handleSpinEnd = (selectedPlayer: Player) => {
    setCurrentPlayer(selectedPlayer);
    setStoredData(prev => ({
        ...prev, 
        lastPickedPlayerId: selectedPlayer.id
    }));
    setScreen(Screen.Game);
  };

  const handleMarkPlaced = (index: number) => {
    if (winnerInfo || isDraw || board[index] || !currentPlayer) {
      return;
    }

    const newBoard = board.slice();
    newBoard[index] = currentPlayer.mark;
    setBoard(newBoard);

    const { winnerMark, line } = calculateWinner(newBoard);
    if (winnerMark) {
      setWinnerInfo({ winner: currentPlayer, line: line! });
      return; 
    }
    
    if (newBoard.every(cell => cell)) {
      setIsDraw(true);
      return;
    }
    
    setScreen(Screen.Spinner);
  };
  
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinnerInfo(null);
    setIsDraw(false);
    setCurrentPlayer(null);
  }

  const handleGameEnd = () => {
    resetGame();
    const teamX = storedData.players.filter(p => p.mark === 'X');
    const teamO = storedData.players.filter(p => p.mark === 'O');
    if (teamX.length > 0 && teamO.length > 0) {
      setScreen(Screen.Spinner);
    } else {
      setScreen(Screen.Setup); 
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.Setup:
        return <PlayerSetup 
            initialPlayers={storedData.players}
            onSetupComplete={handleSetupComplete} 
        />;
      case Screen.Spinner:
        const teamX = storedData.players.filter(p => p.mark === 'X');
        const teamO = storedData.players.filter(p => p.mark === 'O');
        
        if (teamX.length === 0 || teamO.length === 0) {
            // This can happen if players are edited mid-game
            setScreen(Screen.Setup);
            return null;
        }

        return (
          <Spinner
            players={storedData.players}
            settings={storedData.settings}
            onSettingsChange={handleSettingsChange}
            onSpinEnd={handleSpinEnd}
            onEditPlayers={handleEditPlayers}
            lastPickedPlayerId={storedData.lastPickedPlayerId}
          />
        );
      case Screen.Game:
        if (!currentPlayer) {
            setScreen(Screen.Spinner);
            return null;
        }
        return (
          <TicTacToe
            currentPlayer={currentPlayer}
            winnerInfo={winnerInfo}
            board={board}
            isDraw={isDraw}
            onMarkPlaced={handleMarkPlaced}
            onGameEnd={handleGameEnd}
          />
        );
      default:
        return <PlayerSetup initialPlayers={storedData.players} onSetupComplete={handleSetupComplete} />;
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
};

export default App;