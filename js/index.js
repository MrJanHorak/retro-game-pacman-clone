// import of game assests (sounds, images, etc. if needed)


// imports of game functions



// import classes (Player, Ghost, etc.)


// initial variables for game state
let score = 0, highScore = 0, lives = 0
let gameOver, gameStarted, level, player, bonus

// Cached DOM elements
const body = document.querySelector('body')



// create DOM elements for game play
const gameContainer = document.createElement('div')
gameContainer.classList.add('game-container')
body.appendChild(gameContainer)

const topInfoBar = document.createElement('div')
topInfoBar.classList.add('top-info-bar')
gameContainer.appendChild(topInfoBar)

const oneUpEl = document.createElement('div')
oneUpEl.classList.add('oneUp', 'playerInfo')
oneUpEl.textContent = '1UP'
topInfoBar.appendChild(oneUpEl)

const scoreOneEl = document.createElement('div')
scoreOneEl.classList.add('score')
scoreOneEl.textContent = `${score}`
oneUpEl.appendChild(scoreOneEl)

const highScoreLabelEl = document.createElement('div')
highScoreLabelEl.classList.add('high-score')
highScoreLabelEl.textContent = `High Score`
topInfoBar.appendChild(highScoreLabelEl)

const highScoreEl = document.createElement('div')
highScoreEl.classList.add('high-score-value','score')
highScoreEl.textContent = `${highScore}`
highScoreLabelEl.appendChild(highScoreEl)

const twoUpEl = document.createElement('div')
twoUpEl.classList.add('twoUp','playerInfo')
twoUpEl.textContent = '2UP'
topInfoBar.appendChild(twoUpEl)

const scoreTwoEl = document.createElement('div')
scoreTwoEl.classList.add('score')
scoreTwoEl.textContent = `${score}`
twoUpEl.appendChild(scoreTwoEl)

const gameCanvas = document.createElement('canvas')
gameCanvas.classList.add('game-canvas')
gameContainer.appendChild(gameCanvas)

const bottomInfoBar = document.createElement('div')
bottomInfoBar.classList.add('bottom-info-bar')
gameContainer.appendChild(bottomInfoBar)

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
