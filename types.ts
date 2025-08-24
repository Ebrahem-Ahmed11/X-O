
export enum Screen {
  Setup = 'SETUP',
  Spinner = 'SPINNER',
  Game = 'GAME',
}

export interface Player {
  id: string;
  name: string;
  mark: 'X' | 'O';
}

export interface Settings {
  avoidRepeat: boolean;
}

export interface StoredData {
  players: Player[];
  settings: Settings;
  lastPickedPlayerId: string | null;
}