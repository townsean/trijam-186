main();


/**
 * App starting point
 */
function main() {
    const startButton = document.getElementById('start-game-button');
    startButton.addEventListener('click', () => {
        const startScene = document.getElementById('start-scene');
        startScene.classList.add('hidden');

        startGame();
    });
}

/**
 * Start new game
 */
function startGame() {
    const gameScene = document.getElementById('game-scene');
    gameScene.classList.remove('hidden');

    
}