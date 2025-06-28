import * as THREE from 'three';

export interface GameState {
  isPlaying: boolean;
  score: number;
  level: number;
  timeElapsed: number;
}

export interface GameConfig {
  maxSpeed: number;
  acceleration: number;
  turnSpeed: number;
  waypointThreshold: number;
}

export class GameSystem {
  private state: GameState;
  private config: GameConfig;
  private startTime: number;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = {
      isPlaying: false,
      score: 0,
      level: 1,
      timeElapsed: 0,
    };
    this.startTime = 0;
  }

  start(): void {
    this.state.isPlaying = true;
    this.startTime = Date.now();
    this.state.timeElapsed = 0;
  }

  pause(): void {
    this.state.isPlaying = false;
  }

  resume(): void {
    this.state.isPlaying = true;
  }

  stop(): void {
    this.state.isPlaying = false;
    this.state.score = 0;
    this.state.timeElapsed = 0;
  }

  update(): void {
    if (this.state.isPlaying) {
      this.state.timeElapsed = (Date.now() - this.startTime) / 1000;
    }
  }

  addScore(points: number): void {
    this.state.score += points;
  }

  getState(): GameState {
    return { ...this.state };
  }

  getConfig(): GameConfig {
    return { ...this.config };
  }

  // Game logic methods
  checkWaypointReached(carPosition: THREE.Vector3, waypoint: THREE.Vector3): boolean {
    return carPosition.distanceTo(waypoint) < this.config.waypointThreshold;
  }

  calculateSpeed(distance: number): number {
    return Math.min(this.config.maxSpeed, distance * this.config.acceleration);
  }

  calculateTurnAngle(currentDirection: THREE.Vector3, targetDirection: THREE.Vector3): number {
    const angle = currentDirection.angleTo(targetDirection);
    return Math.min(angle, this.config.turnSpeed);
  }
}

// Default game configuration
export const defaultGameConfig: GameConfig = {
  maxSpeed: 0.15,
  acceleration: 0.01,
  turnSpeed: 0.015,
  waypointThreshold: 5,
};

// Create a singleton instance
export const gameSystem = new GameSystem(defaultGameConfig); 