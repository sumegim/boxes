import { Game } from './modules/Game.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const game = new Game(canvas);
    game.start();
});