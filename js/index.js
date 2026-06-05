// import of game assests (sounds, images, etc. if needed)


// imports of game functions



// import classes (Player, Ghost, etc.)


// initial variables for game state
let score, highScore, lives, gameOver, gameStarted, level, player, bonus

// Cached DOM elements
const body = document.querySelector('body')



// create DOM elements for game play
const topInfoBar = document.createElement('div')
topInfoBar.classList.add('top-info-bar')
body.appendChild(topInfoBar)

const scoreEl = document.createElement('div')
scoreEl.classList.add('score')
scoreEl.textContent = `Score: ${score}`
topInfoBar.appendChild(scoreEl)

const highScoreEl = document.createElement('div')
highScoreEl.classList.add('high-score')
highScoreEl.textContent = `High Score: ${highScore}`
topInfoBar.appendChild(highScoreEl)

const gameCanvas = document.createElement('canvas')
gameCanvas.classList.add('game-canvas')
body.appendChild(gameCanvas)

const bottomInfoBar = document.createElement('div')
bottomInfoBar.classList.add('bottom-info-bar')
body.appendChild(bottomInfoBar)

const livesEl = document.createElement('div')
livesEl.classList.add('lives')
livesEl.textContent = `Lives: ${lives}`
bottomInfoBar.appendChild(livesEl)

const bonusEl = document.createElement('div')
bonusEl.classList.add('bonus')
bonusEl.textContent = `Bonus: ${bonus}`
bottomInfoBar.appendChild(bonusEl)


// event listeners (for keyboard input, buttons, etc.)




// initialize game state


// game loop
