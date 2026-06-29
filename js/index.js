// import of game assests (sounds, images, etc. if needed)
import { levelsData } from '../data/levels.js';
console.log('levelsData: ', levelsData);

// initial variables for game state
let gameOver,
  level,
  player,
  bonus,
  levelData,
  pelletCount,
  ghostCount,
  distanceUp,
  distanceDown,
  distanceLeft,
  distanceRight,
  gameGridData,
  cruiseElroyTrigger,
  pacmanPosition,
  blinkyPosition,
  pinkyPosition,
  inkyPosition,
  clydePosition,
  bonusPosition,
  pacmanDirection,
  ghostStartPosition,
  blinkyDirection,
  pinkyDirection,
  inkyDirection,
  clydeDirection,
  blinkyDirectionLast,
  pinkyDirectionLast,
  inkyDirectionLast,
  clydeDirectionLast;

let score = 0,
  highScore = 0,
  lives = 3,
  isScatterMode = false,
  pinkyStarted = false,
  inkyStarted = false,
  clydeStarted = false,
  gameStarted = false,
  ghostChomped = 200,
  pacmanDead = false;

const gameFps = 10;
const gameInterval = 1000 / gameFps;
let lastGameUpdateTime = 0;

const GHOST_SPEED_NORMAL = 100;
const GHOST_SPEED_SLOW = 200;

const frameWidth = 19;
const totalFrames = 4;
const totalGhostFrames = 2;
const ghostFrameWidth = 19;
const animationFps = 12;
const animationInterval = 1000 / animationFps;

let currentFrame = 0;
let lastAnimationTime = 0;
let ghostCurrentFrame = 0;
let ghostMoveInterval = GHOST_SPEED_NORMAL;
let lastGhostMoveTime = 0;
let lastGhostAnimationTime = 0;

const startingTimestamp = performance.now();

levelData = JSON.parse(JSON.stringify(levelsData.level1));
gameGridData = JSON.parse(JSON.stringify(levelData.gameGrid));
cruiseElroyTrigger = levelData.cruiseElroyTrigger;

pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
blinkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
pinkyPosition = JSON.parse(JSON.stringify(levelData.pinkyStart));
inkyPosition = JSON.parse(JSON.stringify(levelData.inkyStart));
clydePosition = JSON.parse(JSON.stringify(levelData.clydeStart));
bonusPosition = JSON.parse(JSON.stringify(levelData.bonusInfo.location));
bonus = levelData.bonusInfo.type;

// functions
const gameLoop = (timestamp) => {
  requestAnimationFrame(gameLoop);

  if (!gameStarted) {
    return;
  }

  // Initialize anchors
  if (!lastGameUpdateTime) lastGameUpdateTime = timestamp;
  if (!lastGhostMoveTime) lastGhostMoveTime = timestamp;

  // Track elapsed time for both entities separately
  const elapsedSincePacmanTick = timestamp - lastGameUpdateTime;
  const elapsedSinceGhostTick = timestamp - lastGhostMoveTime;

  if (elapsedSincePacmanTick >= gameInterval) {
    lastGameUpdateTime = timestamp - (elapsedSincePacmanTick % gameInterval);

    checkGameOver();
    animatePacman(timestamp);
    animateGhosts(timestamp); // Keeps ghost legs wiggling smoothly

    checkGameOver();
    animatePacman(timestamp);
    animateGhosts(timestamp);
    if (pacmanDirection === 'right') {
      checkTunnelWrapAround(pacmanPosition);
      movePacmanRight(pacmanPosition);
      chompPellet(pacmanPosition);
      chompPowerPellet(pacmanPosition);
      checkGhostCollision();
    } else if (pacmanDirection === 'left') {
      checkTunnelWrapAround(pacmanPosition);
      checkGhostCollision();
      movePacmanLeft(pacmanPosition);
      chompPellet(pacmanPosition);
      chompPowerPellet(pacmanPosition);
    } else if (pacmanDirection === 'up') {
      checkTunnelWrapAround(pacmanPosition);
      movePacmanUp(pacmanPosition);
      chompPellet(pacmanPosition);
      chompPowerPellet(pacmanPosition);
      checkGhostCollision();
    } else if (pacmanDirection === 'down') {
      checkTunnelWrapAround(pacmanPosition);
      checkGhostCollision();
      movePacmanDown(pacmanPosition);
      chompPellet(pacmanPosition);
      chompPowerPellet(pacmanPosition);
    }

    if (elapsedSinceGhostTick >= ghostMoveInterval) {
      lastGhostMoveTime =
        timestamp - (elapsedSinceGhostTick % ghostMoveInterval);

      // Run ghost movement functions inside this block
      checkGhostTunnelReverse(blinkyPosition, blinkyDirection, 'blinky');
      checkGhostTunnelReverse(pinkyPosition, pinkyDirection, 'pinky');
      checkGhostTunnelReverse(inkyPosition, inkyDirection, 'inky');
      checkGhostTunnelReverse(clydePosition, clydeDirection, 'clyde');

      moveBlinky();
      movePinky();
      moveInky();
      moveClyde();

      checkGhostCollision();
    }

    if (gameOver) {
      gameStatusEl.textContent = 'Game Over!';
      gameStarted = false;
      return;
    }
    requestAnimationFrame(gameLoop);
  }
};

const addLifeImage = () => {
  const pacLifeEl = document.createElement('img');
  pacLifeEl.classList.add('pacLife');
  pacLifeEl.src = '../assets/characterSprites/pacman/extra_life.svg';
  pacLifeEl.width = 22;
  return pacLifeEl;
};

const checkGameOver = () => {
  if (lives <= 0) {
    gameOver = true;
    gameStarted = false;
  }
};

const gameStartPlayerPlacement = () => {
  gameGrid.innerHTML = '';
  gameStatusEl.textContent = '';
  cruiseElroyTrigger = levelData.cruiseElroyTrigger;
  pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
  blinkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
  pinkyPosition = JSON.parse(JSON.stringify(levelData.pinkyStart));
  inkyPosition = JSON.parse(JSON.stringify(levelData.inkyStart));
  clydePosition = JSON.parse(JSON.stringify(levelData.clydeStart));
  bonusPosition = JSON.parse(JSON.stringify(levelData.bonusInfo.location));
  bonus = levelData.bonusInfo.type;
  pinkyStarted = false;
  inkyStarted = false;
  clydeStarted = false;
  pelletCount = 0;
  ghostCount = 0;
  gameOver = false;
  gameStarted = true;
  pacmanDirection = 'right';
  score = 0;
  lives = 3;
  livesEl.textContent = `Lives:`;
  for (let i = 0; i < lives; i++) {
    livesEl.appendChild(addLifeImage());
  }
  levelData = JSON.parse(JSON.stringify(levelsData.level1));
  gameGridData = JSON.parse(JSON.stringify(levelData.gameGrid));

  gameGridData.forEach((row, rowIndex) => {
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

  gameGrid.appendChild(pacman);
  gameGrid.appendChild(blinky);
  gameGrid.appendChild(pinky);
  gameGrid.appendChild(inky);
  gameGrid.appendChild(clyde);
};

const playerWallColisionDetection = (playerPosition0, playerPosition1) => {
  if (
    gameGridData[playerPosition1][playerPosition0] > 0 &&
    gameGridData[playerPosition1][playerPosition0] <= 53
  ) {
    return true;
  }
};

const ghostWallColisionDetection = (
  ghostPosition0,
  ghostPosition1,
  direction,
) => {
  if (
    gameGridData[ghostPosition1][ghostPosition0] > 0 &&
    gameGridData[ghostPosition1][ghostPosition0] < 9 &&
    gameGridData[ghostPosition1][ghostPosition0] > 9 &&
    gameGridData[ghostPosition1][ghostPosition0] < 53
  ) {
    return true;
  }
};

const updateScore = () => {
  scoreOneEl.textContent = `${score}`;
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = `${highScore}`;
  }
};

const chompPellet = (pacmanPosition) => {
  if (gameGridData[pacmanPosition[1]][pacmanPosition[0]] === 80) {
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
    gameGridData[pacmanPosition[1]][pacmanPosition[0]] = 0;
    const powerPelletEl = document
      .querySelector(
        `.power-pellet[style="grid-column-start: ${pacmanPosition[0] + 1}; grid-row-start: ${pacmanPosition[1] + 1};"]`,
      )
      .classList.remove('power-pellet');
    pelletCount += 1;
    score += 50;
    updateScore();
    activateScatterMode();
  }
};

const checkGhostCollision = () => {
  if (
    pacmanPosition[0] === blinkyPosition[0] &&
    pacmanPosition[1] === blinkyPosition[1]
  ) {
    if (isScatterMode) {
      score += ghostChomped;
      updateScore();
      blinkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      ghostChomped = ghostChomped * 2;
    } else {
      lives -= 1;
      pacmanDeath();
      setTimeout(() => {
        livesEl.textContent = `Lives:`;
        for (let i = 0; i < lives; i++) {
          livesEl.appendChild(addLifeImage());
        }
        pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
        pacman.classList.remove('pacman-death');
        pacman.classList.add('pacman');
        pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
        pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
        pacmanDead = false;
      }, 1000);
    }
  }
  if (
    pacmanPosition[0] === pinkyPosition[0] &&
    pacmanPosition[1] === pinkyPosition[1]
  ) {
    if (isScatterMode) {
      score += 200;
      updateScore();
      pinkyPosition = JSON.parse(JSON.stringify(levelData.pinkyStart));
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
    } else {
      lives -= 1;
      livesEl.textContent = `Lives:`;
      for (let i = 0; i < lives; i++) {
        livesEl.appendChild(addLifeImage());
      }
      pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
      pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
      pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
    }
  }
  if (
    pacmanPosition[0] === inkyPosition[0] &&
    pacmanPosition[1] === inkyPosition[1]
  ) {
    if (isScatterMode) {
      score += 200;
      updateScore();
      inkyPosition = JSON.parse(JSON.stringify(levelData.inkyStart));
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
    } else {
      lives -= 1;
      livesEl.textContent = `Lives:`;
      for (let i = 0; i < lives; i++) {
        livesEl.appendChild(addLifeImage());
      }
      pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
      pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
      pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
    }
  }
  if (
    pacmanPosition[0] === clydePosition[0] &&
    pacmanPosition[1] === clydePosition[1]
  ) {
    if (isScatterMode) {
      score += 200;
      updateScore();
      clydePosition = JSON.parse(JSON.stringify(levelData.clydeStart));
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
    } else {
      lives -= 1;
      livesEl.textContent = `Lives:`;
      for (let i = 0; i < lives; i++) {
        livesEl.appendChild(addLifeImage());
      }
      pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
      pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
      pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
    }
  }
};

const animatePacman = (timestamp) => {
  if (!lastAnimationTime) lastAnimationTime = timestamp;
  const deltaTime = timestamp - lastAnimationTime;
  if (!pacmanDead) {
    if (deltaTime >= animationInterval) {
      currentFrame = (currentFrame + 1) % totalFrames;
      const positionX = -(currentFrame * frameWidth);
      pacman.style.backgroundPosition = `${positionX}px 0px`;
      lastAnimationTime = timestamp - (deltaTime % animationInterval);
    }
  } else {
    if (deltaTime >= animationInterval) {
      currentFrame = (currentFrame + 1) % 12;
      const positionX = -(currentFrame * frameWidth);
      pacman.style.backgroundPosition = `${positionX}px 0px`;
      lastAnimationTime = timestamp - (deltaTime % animationInterval);
    }
  }
};

const animateGhosts = (timestamp) => {
  if (!lastGhostAnimationTime) lastGhostAnimationTime = timestamp;
  const deltaTime = timestamp - lastGhostAnimationTime;

  if (deltaTime >= animationInterval) {
    ghostCurrentFrame = (ghostCurrentFrame + 1) % totalGhostFrames;
    const positionX = -(ghostCurrentFrame * ghostFrameWidth);

    blinky.style.backgroundPosition = `${positionX}px 0px`;
    pinky.style.backgroundPosition = `${positionX}px 0px`;
    inky.style.backgroundPosition = `${positionX}px 0px`;
    clyde.style.backgroundPosition = `${positionX}px 0px`;

    lastGhostAnimationTime = timestamp - (deltaTime % animationInterval);
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

const pacmanDeath = () => {
  pacmanDead = true;
  currentFrame = 0;
  pacman.classList.remove('pacman');
  pacman.classList.add('pacman-death');
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_death.svg)';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

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

const checkGhostTunnelReverse = (ghostPosition, ghostDirection, ghostName) => {
  if (ghostPosition[0] <= 0 && ghostDirection === 'left') {
    ghostPosition[0] = 0;
    ghostDirection = 'right';
  } else if (ghostPosition[0] >= 27 && ghostDirection === 'right') {
    ghostPosition[0] = 27;
    ghostDirection = 'left';
  }
  if (ghostName === 'blinky') {
    blinkyDirection = ghostDirection;
  } else if (ghostName === 'pinky') {
    pinkyDirection = ghostDirection;
  } else if (ghostName === 'inky') {
    inkyDirection = ghostDirection;
  } else if (ghostName === 'clyde') {
    clydeDirection = ghostDirection;
  }
};

const reverseGhostDirection = (ghostDirection) => {
  switch (ghostDirection) {
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
};

const activateScatterMode = () => {
  isScatterMode = true;
  ghostMoveInterval = GHOST_SPEED_SLOW;
  reverseGhostDirection(blinkyDirection);
  reverseGhostDirection(pinkyDirection);
  reverseGhostDirection(inkyDirection);
  reverseGhostDirection(clydeDirection);

  setTimeout(() => {
    isScatterMode = false;
    blinky.classList.remove('scared-ghost');
    pinky.classList.remove('scared-ghost');
    inky.classList.remove('scared-ghost');
    clyde.classList.remove('scared-ghost');
    ghostMoveInterval = GHOST_SPEED_NORMAL;
    ghostChomped = 200;
  }, 8000);
};

const calculateGhostPacmanDistance = (ghostPosition, ghostTargetCell) => {
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

const ghostInBounds = (ghostPosition) => {
  if (ghostPosition[0] >= 0 && ghostPosition[0] <= 27) {
    return true;
  }
};

const moveGhost = (ghostPosition, ghostTargetCell, ghostDirectionLast) => {
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
    ghostInBounds([ghostPosition[0] - 1, ghostPosition[1]]) &&
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
  // }

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
  if (!isScatterMode) {
    blinkyDirection = moveGhost(
      blinkyPosition,
      pacmanPosition,
      blinkyDirectionLast,
    );
  } else {
    blinkyDirection = moveGhost(blinkyPosition, [27, 0], blinkyDirectionLast);
  }
  switch (blinkyDirection) {
    case 'up':
      blinkyPosition[1] -= 1;
      if (isScatterMode) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/blinky/blinky_up.svg )';
      }
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      break;
    case 'down':
      blinkyPosition[1] += 1;
      if (isScatterMode) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/blinky/blinky_down.svg )';
      }
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      break;
    case 'left':
      if (isScatterMode) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/blinky/blinky_left.svg )';
      }
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      blinkyPosition[0] -= 1;
      break;
    case 'right':
      if (isScatterMode) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/blinky/blinky_right.svg )';
      }
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      blinkyPosition[0] += 1;
      break;
  }

  blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
  blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
};

const movePinky = () => {
  // pinky targets the cell 4 spaces ahead of pacman in the direction pacman is currently moving

  let pinkyTargetCell;

  if (blinkyPosition !== levelData.blinkyStart && !pinkyStarted) {
    setTimeout(() => {
      pinkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
      pinkyStarted = true;
    }, 2000);
  }

  if (pinkyDirection !== Infinity || pinkyDirection !== undefined) {
    pinkyDirectionLast = pinkyDirection;
  }

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

  if (!isScatterMode) {
    pinkyDirection = moveGhost(
      pinkyPosition,
      pinkyTargetCell,
      pinkyDirectionLast,
    );
  } else {
    pinkyDirection = moveGhost(pinkyPosition, [0, 0], pinkyDirectionLast);
  }

  switch (pinkyDirection) {
    case 'up':
      if (isScatterMode) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/pinky/pinky_up.svg )';
      }
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
      pinkyPosition[1] -= 1;
      break;
    case 'down':
      if (isScatterMode) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/pinky/pinky_down.svg )';
      }
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
      pinkyPosition[1] += 1;
      break;
    case 'left':
      if (isScatterMode) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/pinky/pinky_left.svg )';
      }
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
      pinkyPosition[0] -= 1;
      break;
    case 'right':
      if (isScatterMode) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/pinky/pinky_right.svg )';
      }
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
      pinkyPosition[0] += 1;
      break;
  }

  pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
  pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
};

const moveInky = () => {
  // inky targets the cell that is the vector from blinky to the cell 2 spaces ahead of pacman in the direction pacman is currently moving, multiplied by 2 (so basically if blinky is at (5,5) and the cell 2 spaces ahead of pacman is (10,10), inky targets the cell (15,15))
  let inkyTargetCell;
  let cellTwoAhead;

  if (blinkyPosition !== levelData.blinkyStart && !inkyStarted) {
    setTimeout(() => {
      inkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
      inkyStarted = true;
    }, 4000);
  }

  if (inkyDirection !== Infinity || inkyDirection !== undefined) {
    inkyDirectionLast = inkyDirection;
  }

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

  if (!isScatterMode) {
    inkyDirection = moveGhost(inkyPosition, inkyTargetCell, inkyDirectionLast);
  } else {
    inkyDirection = moveGhost(inkyPosition, [27, 31], inkyDirectionLast);
  }

  switch (inkyDirection) {
    case 'up':
      if (isScatterMode) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/inky/inky_up.svg )';
      }
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
      inkyPosition[1] -= 1;
      break;
    case 'down':
      if (isScatterMode) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/inky/inky_down.svg )';
      }
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
      inkyPosition[1] += 1;
      break;
    case 'left':
      if (isScatterMode) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/inky/inky_left.svg )';
      }
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
      inkyPosition[0] -= 1;
      break;
    case 'right':
      if (isScatterMode) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/inky/inky_right.svg )';
      }
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
      inkyPosition[0] += 1;
      break;
  }

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

  if (clydePosition !== levelData.blinkyStart && !clydeStarted) {
    setTimeout(() => {
      clydePosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
      clydeStarted = true;
    }, 6000);
  }

  if (clydeDirection !== Infinity || clydeDirection !== undefined) {
    clydeDirectionLast = clydeDirection;
  }

  if (distanceToPacman > 64) {
    clydeTargetCell = pacmanPosition;
  } else {
    clydeTargetCell = [0, 31];
  }

  if (!isScatterMode) {
    clydeDirection = moveGhost(
      clydePosition,
      clydeTargetCell,
      clydeDirectionLast,
    );
  } else {
    clydeDirection = moveGhost(clydePosition, [0, 31], clydeDirectionLast);
  }

  switch (clydeDirection) {
    case 'up':
      if (isScatterMode) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/clyde/clyde_up.svg )';
      }
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
      clydePosition[1] -= 1;
      break;
    case 'down':
      if (isScatterMode) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/clyde/clyde_down.svg )';
      }
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
      clydePosition[1] += 1;
      break;
    case 'left':
      if (isScatterMode) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/clyde/clyde_left.svg )';
      }
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
      clydePosition[0] -= 1;
      break;
    case 'right':
      if (isScatterMode) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/clyde/clyde_right.svg )';
      }
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
      clydePosition[0] += 1;
      break;
  }

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
livesEl.textContent = `Lives:`;
for (let i = 0; i < lives; i++) {
  livesEl.appendChild(addLifeImage());
}
bottomInfoBar.appendChild(livesEl);

const bonusEl = document.createElement('div');
bonusEl.classList.add('bonus');
bonusEl.textContent = `Bonus: ${bonus}`;
bottomInfoBar.appendChild(bonusEl);

const gameStatusEl = document.createElement('div');
gameStatusEl.classList.add('game-status');
gameStatusEl.textContent = 'Start Game!';
gameContainer.appendChild(gameStatusEl);

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
    case 'Space':
    case ' ':
      if (!gameStarted || gameOver) {
        setTimeout(gameLoop(startingTimestamp), 100);
        gameStartPlayerPlacement();
      } else {
        gameStarted = false;
        gameStatusEl.textContent = 'Game Paused';
      }

      break;
  }
});
