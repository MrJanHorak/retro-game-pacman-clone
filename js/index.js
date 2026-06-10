// import of game assests (sounds, images, etc. if needed)
import { levelsData } from '../data/levels.js';
console.log('levelsData: ', levelsData);

// initial variables for game state
let score = 0,
  highScore = 0,
  lives = 0;
let gameOver,
  gameStarted,
  level,
  player,
  bonus,
  levelData,
  pelletCount,
  ghostCount,
  distanceUp,
  distanceDown,
  distanceLeft,
  distanceRight;
let gameGridData,
  cruiseElroyTrigger,
  pacmanPosition,
  blinkyPosition,
  pinkyPosition,
  inkyPosition,
  clydePosition,
  bonusPosition,
  pacmanDirection;
let blinkyDirection, pinkyDirection, inkyDirection, clydeDirection;
let blinkyDirectionLast,
  pinkyDirectionLast,
  inkyDirectionLast,
  clydeDirectionLast;

levelData = levelsData.level1;
gameGridData = levelData.gameGrid;
cruiseElroyTrigger = levelData.cruiseElroyTrigger;
lives = levelData.lives;

pacmanPosition = levelData.playerStart;
blinkyPosition = levelData.blinkyStart;
pinkyPosition = levelData.pinkyStart;
inkyPosition = levelData.inkyStart;
clydePosition = levelData.clydeStart;
bonusPosition = levelData.bonusInfo.location;
bonus = levelData.bonusInfo.type;

// functions
const gameLoop = () => {
  if (pacmanDirection === 'right') {
    checkTunnelWrapAround(pacmanPosition);
    movePacmanRight(pacmanPosition);
    chompPellet(pacmanPosition);
    chompPowerPellet(pacmanPosition);
    moveBlinky();
    movePinky();
    moveInky();
    moveClyde();
  } else if (pacmanDirection === 'left') {
    checkTunnelWrapAround(pacmanPosition);
    movePacmanLeft(pacmanPosition);
    chompPellet(pacmanPosition);
    chompPowerPellet(pacmanPosition);
    moveBlinky();
    movePinky();
    moveInky();
    moveClyde();
  } else if (pacmanDirection === 'up') {
    checkTunnelWrapAround(pacmanPosition);
    movePacmanUp(pacmanPosition);
    chompPellet(pacmanPosition);
    chompPowerPellet(pacmanPosition);
    moveBlinky();
    movePinky();
    moveInky();
    moveClyde();
  } else if (pacmanDirection === 'down') {
    checkTunnelWrapAround(pacmanPosition);
    movePacmanDown(pacmanPosition);
    chompPellet(pacmanPosition);
    chompPowerPellet(pacmanPosition);
    moveBlinky();
    movePinky();
    moveInky();
    moveClyde();
  }
  // check for ghost collision
  // check for bonus collection
  // update score, lives, and other game state variables as needed
  // render updated game state to the DOM
  if (gameOver) {
    console.log('Game Over!');
    return;
  }

  setTimeout(gameLoop, 100);
};

const playerWallColisionDetection = (playerPosition0, playerPosition1) => {
  if (
    gameGridData[playerPosition1][playerPosition0] > 0 &&
    gameGridData[playerPosition1][playerPosition0] <= 53
  ) {
    return true;
  }
};

const updateScore = () => {
  console.log('score updated: ', score);
  scoreOneEl.textContent = `${score}`;
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = `${highScore}`;
  }
};

const chompPellet = (pacmanPosition) => {
  if (gameGridData[pacmanPosition[1]][pacmanPosition[0]] === 80) {
    console.log('pellet collected');
    gameGridData[pacmanPosition[1]][pacmanPosition[0]] = 0;
    const pelletEl = document
      .querySelector(
        `.pellet[style="grid-column-start: ${pacmanPosition[0] + 1}; grid-row-start: ${pacmanPosition[1] + 1};"]`,
      )
      .classList.remove('pellet');
    pelletCount += 1;
    score += 10;
    updateScore();
  }
};

const chompPowerPellet = (pacmanPosition) => {
  if (gameGridData[pacmanPosition[1]][pacmanPosition[0]] === 81) {
    console.log('power pellet collected');
    gameGridData[pacmanPosition[1]][pacmanPosition[0]] = 0;
    const powerPelletEl = document
      .querySelector(
        `.power-pellet[style="grid-column-start: ${pacmanPosition[0] + 1}; grid-row-start: ${pacmanPosition[1] + 1};"]`,
      )
      .classList.remove('power-pellet');
    pelletCount += 1;
    score += 50;
    updateScore();
    // set ghosts to frightened mode for a limited time
  }
};

const movePacmanRight = (pacmanPosition) => {
  pacmanPosition[0] += 1;
  if (
    playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1], 'pacman')
  ) {
    pacmanPosition[0] -= 1;
    return;
  }
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_right.svg )';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

const movePacmanLeft = (pacmanPosition) => {
  pacmanPosition[0] -= 1;
  if (
    playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1], 'pacman')
  ) {
    pacmanPosition[0] += 1;
    return;
  }
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_left.svg )';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

const movePacmanUp = (pacmanPosition) => {
  pacmanPosition[1] -= 1;
  if (
    playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1], 'pacman')
  ) {
    pacmanPosition[1] += 1;
    return;
  }
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_up.svg )';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

const movePacmanDown = (pacmanPosition) => {
  pacmanPosition[1] += 1;
  if (
    playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1], 'pacman')
  ) {
    pacmanPosition[1] -= 1;
    return;
  }
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_down.svg )';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

// check of moving through tunnels and wrap around to the other side of the grid
// the game grid is 28 columns wide, so if pacman moves left from column 0, he should appear in column 27, and vice versa
// the game grid is 31 rows high, so if pacman moves up from row 0, he should appear in row 30, and vice versa

const checkTunnelWrapAround = (pacmanPosition) => {
  if (pacmanPosition[0] <= 0 && pacmanDirection === 'left') {
    pacmanPosition[0] = 28;
  } else if (pacmanPosition[0] >= 27 && pacmanDirection === 'right') {
    pacmanPosition[0] = -1;
  }

  if (pacmanPosition[1] === 0 && pacmanDirection === 'up') {
    pacmanPosition[1] = 31;
  } else if (pacmanPosition[1] === 30 && pacmanDirection === 'down') {
    pacmanPosition[1] = -1;
  }
};

// Begin atempt at Ghost chase logic. Ghosts will check each direction they can move (not a wall) and
// calculate the distance from pacman if they were to move in that direction, then move in the direction
// that results in the shortest distance to pacman.
//
// Each ghost will have a different target cell that they are trying to get to
// (blinky targets pacman's current position,
// pinky targets the cell 4 spaces ahead of pacman in the direction pacman is currently moving,
// inky targets the cell that is the vector from blinky to the cell 2 spaces ahead of pacman in the direction pacman is currently moving, multiplied by 2,
// and clyde targets pacman if clyde is more than 8 spaces away from pacman, but if clyde is within 8 spaces
// of pacman, clyde targets his scatter corner (bottom left corner of the grid))

const calculateGhostPacmanDistance = (ghostPosition, ghostTargetCell) => {
  console.log('calculating distance from ghost to pacman');
  console.log('ghost position: ', ghostPosition);
  console.log('ghost target cell: ', ghostTargetCell);
  const distance =
    Math.pow(ghostPosition[0] - ghostTargetCell[0], 2) +
    Math.pow(ghostPosition[1] - ghostTargetCell[1], 2);
  return distance;
};

const determineShortestDistance = (
  distanceUp,
  distanceLeft,
  distanceRight,
  distanceDown,
  ghostDirectionLast,
) => {
  const minDistance = Math.min(
    distanceUp,
    distanceLeft,
    distanceDown,
    distanceRight,
  );
  console.log('min distance: ', minDistance);
  switch (minDistance) {
    case distanceUp:
      return 'up';
    case distanceLeft:
      return 'left';
    case distanceDown:
      return 'down';
    case distanceRight:
      return 'right';
  }
};

const moveGhost = (ghostPosition, ghostTargetCell, ghostDirectionLast) => {
  //check each direction of the ghost postition and see if it is not a wall, then calculate the distance from pacman if the ghost were to move in that direction, then move the ghost in the direction that results in the shortest distance to pacman
  if (gameGridData[ghostPosition[0]][ghostPosition[1] - 1] === 9) {
    console.log(True)
    distanceUp = calculateGhostPacmanDistance(
      [ghostPosition[0], ghostPosition[1] - 1],
      ghostTargetCell,
    );
    // break
  }
  if (
    !playerWallColisionDetection(ghostPosition[0], ghostPosition[1] - 1) &&
    ghostDirectionLast !== 'down'
  ) {
    distanceUp = calculateGhostPacmanDistance(
      [ghostPosition[0], ghostPosition[1] - 1],
      ghostTargetCell,
    );
  } else {
    distanceUp = Infinity;
  }
  if (
    !playerWallColisionDetection(ghostPosition[0] - 1, ghostPosition[1]) &&
    ghostDirectionLast !== 'right'
  ) {
    distanceLeft = calculateGhostPacmanDistance(
      [ghostPosition[0] - 1, ghostPosition[1]],
      ghostTargetCell,
    );
  } else {
    distanceLeft = Infinity;
  }
  if (
    !playerWallColisionDetection(ghostPosition[0], ghostPosition[1] + 1) &&
    ghostDirectionLast !== 'up'
  ) {
    distanceDown = calculateGhostPacmanDistance(
      [ghostPosition[0], ghostPosition[1] + 1],
      ghostTargetCell,
    );
  } else {
    distanceDown = Infinity;
  }
  if (
    !playerWallColisionDetection(ghostPosition[0] + 1, ghostPosition[1]) &&
    ghostDirectionLast !== 'left'
  ) {
    distanceRight = calculateGhostPacmanDistance(
      [ghostPosition[0] + 1, ghostPosition[1]],
      ghostTargetCell,
    );
  } else {
    distanceRight = Infinity;
  }
  console.log('distance up: ', distanceUp);
  console.log('distance left: ', distanceLeft);
  console.log('distance down: ', distanceDown);
  console.log('distance right: ', distanceRight);
  console.log('ghost direction last: ', ghostDirectionLast);
  return determineShortestDistance(
    distanceUp,
    distanceLeft,
    distanceRight,
    distanceDown,
    ghostDirectionLast,
  );
};

const moveBlinky = () => {
  if (blinkyDirection !== Infinity || blinkyDirection !== undefined) {
    blinkyDirectionLast = blinkyDirection;
  }
  blinkyDirection = moveGhost(
    blinkyPosition,
    pacmanPosition,
    blinkyDirectionLast,
  );
  switch (blinkyDirection) {
    case 'up':
      blinkyPosition[1] -= 1;
      break;
    case 'down':
      blinkyPosition[1] += 1;
      break;
    case 'left':
      blinkyPosition[0] -= 1;
      break;
    case 'right':
      blinkyPosition[0] += 1;
      break;
  }
  blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
  blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
};

const movePinky = () => {
  // pinky targets the cell 4 spaces ahead of pacman in the direction pacman is currently moving
  let pinkyTargetCell;
  switch (pacmanDirection) {
    case 'up':
      pinkyTargetCell = [pacmanPosition[0], pacmanPosition[1] - 4];
      break;
    case 'down':
      pinkyTargetCell = [pacmanPosition[0], pacmanPosition[1] + 4];
      break;
    case 'left':
      pinkyTargetCell = [pacmanPosition[0] - 4, pacmanPosition[1]];
      break;
    case 'right':
      pinkyTargetCell = [pacmanPosition[0] + 4, pacmanPosition[1]];
      break;
  }
  const pinkyDirection = moveGhost(pinkyPosition, pinkyTargetCell);

    switch (pinkyDirection) {
    case 'up':
      pinkyPosition[1] -= 1;
      break;
    case 'down':
      pinkyPosition[1] += 1;
      break;
    case 'left':
      pinkyPosition[0] -= 1;
      break;
    case 'right':
      pinkyPosition[0] += 1;
      break;
  }
  console.log('moving PINKY: ', pinkyDirection);
  pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
  pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
}

const moveInky = () => {
  // inky targets the cell that is the vector from blinky to the cell 2 spaces ahead of pacman in the direction pacman is currently moving, multiplied by 2 (so basically if blinky is at (5,5) and the cell 2 spaces ahead of pacman is (10,10), inky targets the cell (15,15))
  let inkyTargetCell;
  let cellTwoAhead;
  switch (pacmanDirection) {
    case 'up':
      cellTwoAhead = [pacmanPosition[0], pacmanPosition[1] - 2];
      break;
    case 'down':
      cellTwoAhead = [pacmanPosition[0], pacmanPosition[1] + 2];
      break;
    case 'left':
      cellTwoAhead = [pacmanPosition[0] - 2, pacmanPosition[1]];
      break;
    case 'right':
      cellTwoAhead = [pacmanPosition[0] + 2, pacmanPosition[1]];
      break;
  }
  inkyTargetCell = [
    cellTwoAhead[0] + (cellTwoAhead[0] - blinkyPosition[0]),
    cellTwoAhead[1] + (cellTwoAhead[1] - blinkyPosition[1]),
  ];
  moveGhost(inkyPosition, inkyTargetCell);
  inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
  inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
};

const moveClyde = () => {
  // clyde targets pacman if clyde is more than 8 spaces away from pacman, but if clyde is within 8 spaces of pacman, clyde targets his scatter corner (bottom left corner of the grid)
  const distanceToPacman = calculateGhostPacmanDistance(
    clydePosition,
    pacmanPosition,
  );
  let clydeTargetCell;
  if (distanceToPacman > 64) {
    clydeTargetCell = pacmanPosition;
  } else {
    clydeTargetCell = [0, 31];
  }
  moveGhost(clydePosition, clydeTargetCell);
  clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
  clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
};

// Cached DOM elements
const body = document.querySelector('body');

// create DOM elements for game play
const gameContainer = document.createElement('div');
gameContainer.classList.add('game-container');
body.appendChild(gameContainer);

const topInfoBar = document.createElement('div');
topInfoBar.classList.add('top-info-bar');
gameContainer.appendChild(topInfoBar);

const oneUpEl = document.createElement('div');
oneUpEl.classList.add('oneUp', 'playerInfo');
oneUpEl.textContent = '1UP';
topInfoBar.appendChild(oneUpEl);

const scoreOneEl = document.createElement('div');
scoreOneEl.classList.add('score');
scoreOneEl.textContent = `${score}`;
oneUpEl.appendChild(scoreOneEl);

const highScoreLabelEl = document.createElement('div');
highScoreLabelEl.classList.add('high-score');
highScoreLabelEl.textContent = `High Score`;
topInfoBar.appendChild(highScoreLabelEl);

const highScoreEl = document.createElement('div');
highScoreEl.classList.add('high-score-value', 'score');
highScoreEl.textContent = `${highScore}`;
highScoreLabelEl.appendChild(highScoreEl);

const twoUpEl = document.createElement('div');
twoUpEl.classList.add('twoUp', 'playerInfo');
twoUpEl.textContent = '2UP';
topInfoBar.appendChild(twoUpEl);

const scoreTwoEl = document.createElement('div');
scoreTwoEl.classList.add('score');
scoreTwoEl.textContent = `${score}`;
twoUpEl.appendChild(scoreTwoEl);

const gameCanvas = document.createElement('div');
gameCanvas.classList.add('game-canvas');
gameContainer.appendChild(gameCanvas);

const gameGrid = document.createElement('div');
gameGrid.classList.add('game-grid');
gameCanvas.appendChild(gameGrid);

const bottomInfoBar = document.createElement('div');
bottomInfoBar.classList.add('bottom-info-bar');
gameContainer.appendChild(bottomInfoBar);

const livesEl = document.createElement('div');
livesEl.classList.add('lives');
livesEl.textContent = `Lives: ${lives}`;
bottomInfoBar.appendChild(livesEl);

const bonusEl = document.createElement('div');
bonusEl.classList.add('bonus');
bonusEl.textContent = `Bonus: ${bonus}`;
bottomInfoBar.appendChild(bonusEl);

levelsData.level1.gameGrid.forEach((row, rowIndex) => {
  row.forEach((cell, cellIndex) => {
    if (cell === 80) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('pellet');
      cellEl.style.gridColumnStart = `${cellIndex + 1}`;
      cellEl.style.gridRowStart = `${rowIndex + 1}`;
      gameGrid.appendChild(cellEl);
    }
    if (cell === 81) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('power-pellet');
      cellEl.style.gridColumnStart = `${cellIndex + 1}`;
      cellEl.style.gridRowStart = `${rowIndex + 1}`;
      gameGrid.appendChild(cellEl);
    }
  });
});

// event listeners (for keyboard input, buttons, etc.)

// event listeners for start button (space), restart button (ESC), etc.

// initialize game state

/// temporary pacman placement to check grid allignment
const pacman = document.createElement('div');
pacman.classList.add('pacman');
gameGrid.appendChild(pacman);

pacman.style.gridColumnStart = `${levelData.playerStart[0] + 1}`;
pacman.style.gridRowStart = `${levelData.playerStart[1] + 1}`;

const blinky = document.createElement('div');
blinky.classList.add('blinky');
gameGrid.appendChild(blinky);

blinky.style.gridColumnStart = `${levelData.blinkyStart[0] + 1}`;
blinky.style.gridRowStart = `${levelData.blinkyStart[1] + 1}`;

const pinky = document.createElement('div');
pinky.classList.add('pinky');
gameGrid.appendChild(pinky);

pinky.style.gridColumnStart = `${levelData.pinkyStart[0] + 1}`;
pinky.style.gridRowStart = `${levelData.pinkyStart[1] + 1}`;

const inky = document.createElement('div');
inky.classList.add('inky');
gameGrid.appendChild(inky);

inky.style.gridColumnStart = `${levelData.inkyStart[0] + 1}`;
inky.style.gridRowStart = `${levelData.inkyStart[1] + 1}`;

const clyde = document.createElement('div');
clyde.classList.add('clyde');
gameGrid.appendChild(clyde);

clyde.style.gridColumnStart = `${levelData.clydeStart[0] + 1}`;
clyde.style.gridRowStart = `${levelData.clydeStart[1] + 1}`;

// event listeners for WASD and arrow keys for player movement
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      pacmanDirection = 'up';
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      pacmanDirection = 'down';
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      pacmanDirection = 'left';
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      pacmanDirection = 'right';
      break;
  }
});

// game loop
pelletCount = 0;
ghostCount = 0;
gameOver = false;
score = 0;
highScore = 0;
pacmanDirection = 'right';

gameLoop();
