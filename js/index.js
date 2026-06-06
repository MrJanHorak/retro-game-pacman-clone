// import of game assests (sounds, images, etc. if needed)
import { levelsData } from '../data/levels.js'

// imports of game functions
// import classes (Player, Ghost, etc.)

console.log('levelsData: ', levelsData)

// initial variables for game state
let score = 0, highScore = 0, lives = 0
let gameOver, gameStarted, level, player, bonus, levelData, gameGridData, cruiseElroyTrigger
let pacmanPosition, blinkyPosition, pinkyPosition, inkyPosition, clydePosition, bonusPosition

levelData = levelsData.level1
gameGridData = levelData.gameGrid
cruiseElroyTrigger = levelData.cruiseElroyTrigger   
lives = levelData.lives

pacmanPosition = levelData.playerStart
blinkyPosition = levelData.blinkyStart
pinkyPosition = levelData.pinkyStart
inkyPosition = levelData.inkyStart
clydePosition = levelData.clydeStart
bonusPosition = levelData.bonusInfo.location
bonus = levelData.bonusInfo.type


// functions
const playerWallColisionDetection = (playerPosition0, playerPosition1) => {
    console.log('checking for wall collision')
    console.log('player position: ', playerPosition0, playerPosition1)
    if(gameGridData[playerPosition1][playerPosition0]>0 && gameGridData[playerPosition1][playerPosition0] <= 53 ) {
        console.log('wall collision detected')
        return true
    }

}

const movePacmanRight = (pacmanPosition) => {
    console.log('move pacman right')   
    console.log('pacman position before: ', pacmanPosition)
    pacmanPosition[0] += 1
    if(playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1])) {
        pacmanPosition[0] -= 1
        return
    }
    console.log('pacman position after: ', pacmanPosition)
    pacman.style.gridColumnStart = `${pacmanPosition[0]+1}`
    pacman.style.gridRowStart = `${pacmanPosition[1]+1}`
    console.log(' paceman postion after style change: ', pacmanPosition)
}

const movePacmanLeft = (pacmanPosition) => {
    console.log('move pacman left')    
    pacmanPosition[0] -= 1
    if(playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1])) {
        pacmanPosition[0] += 1
        return
    }
    pacman.style.gridColumnStart = `${pacmanPosition[0]+1}`
    pacman.style.gridRowStart = `${pacmanPosition[1]+1}`
}

const movePacmanUp = (pacmanPosition) => {
    console.log('move pacman up')    
    pacmanPosition[1] -= 1
    if(playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1])) {
        pacmanPosition[1] += 1
        return
    }
    pacman.style.gridColumnStart = `${pacmanPosition[0]+1}`
    pacman.style.gridRowStart = `${pacmanPosition[1]+1}`
}

const movePacmanDown = (pacmanPosition) => {
    console.log('move pacman down')    
    pacmanPosition[1] += 1
    if(playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1])) {
        pacmanPosition[1] -= 1
        return
    }
    pacman.style.gridColumnStart = `${pacmanPosition[0]+1}`
    pacman.style.gridRowStart = `${pacmanPosition[1]+1}`
}

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

const gameCanvas = document.createElement('div')
gameCanvas.classList.add('game-canvas')
gameContainer.appendChild(gameCanvas)

const gameGrid = document.createElement('div')
gameGrid.classList.add('game-grid')
gameCanvas.appendChild(gameGrid)

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
// event listeners for WASD and arrow keys for player movement
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            movePacmanUp(pacmanPosition)
            break
        case 'ArrowDown':
        case 's':
        case 'S':
            movePacmanDown(pacmanPosition)
            break
        case 'ArrowLeft':
        case 'a':
        case 'A':
            movePacmanLeft(pacmanPosition)
            break
        case 'ArrowRight':
        case 'd':
        case 'D':
            movePacmanRight(pacmanPosition)
            break
    }
})

// event listeners for start button (space), restart button (ESC), etc.




// initialize game state

/// temporary pacman placement to check grid allignment
const pacman = document.createElement('div')
pacman.classList.add('pacman')
gameGrid.appendChild(pacman)

pacman.style.gridColumnStart = `${levelData.playerStart[0]+1}`
pacman.style.gridRowStart = `${levelData.playerStart[1]+1}`

const blinky = document.createElement('div')
blinky.classList.add('blinky')
gameGrid.appendChild(blinky)

blinky.style.gridColumnStart = `${levelData.blinkyStart[0]+1}`
blinky.style.gridRowStart = `${levelData.blinkyStart[1]+1}`

const pinky = document.createElement('div')
pinky.classList.add('pinky')
gameGrid.appendChild(pinky)

pinky.style.gridColumnStart = `${levelData.pinkyStart[0]+1}`
pinky.style.gridRowStart = `${levelData.pinkyStart[1]+1}`

const inky = document.createElement('div')
inky.classList.add('inky')
gameGrid.appendChild(inky)

inky.style.gridColumnStart = `${levelData.inkyStart[0]+1}`
inky.style.gridRowStart = `${levelData.inkyStart[1]+1 }`

const clyde = document.createElement('div')
clyde.classList.add('clyde')
gameGrid.appendChild(clyde)

clyde.style.gridColumnStart = `${levelData.clydeStart[0]+1}`
clyde.style.gridRowStart = `${levelData.clydeStart[1]+1}`


//functions


// game loop
