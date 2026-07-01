// import of game assests (sounds, images, etc. if needed)
import { levelsData } from '../data/levels.js';

// initial variables for game state
let gameOver,
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
  clydeDirectionLast,
  pacmanDeterminedDirection,
  pacmanDesiredDirection;

let score = 0,
  lives = 3,
  isScatterMode = false,
  pinkyStarted = false,
  inkyStarted = false,
  clydeStarted = false,
  gameStarted = false,
  ghostChomped = 200,
  pacmanDead = false,
  lastGameUpdateTime = 0,
  level = 1,
  bonusCount = 1,
  bonusIsVisible = false,
  pelletCountTotal = 0,
  powerPelletTimer = null,
  isBlinkyDead = false,
  isBlinkyRegenerated = false,
  isPinkyDead = false,
  isPinkyRegenerated = false,
  isInkyDead = false,
  isInkyRegenerated = false,
  isClydeDead = false,
  isClydeRegenerated = false;

let highScore = Number(localStorage.getItem('highScore')) || 0;

const gameFps = 10;
const gameInterval = 1000 / gameFps;

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

const bonusAssets = {
  apple: '../assets/bonusSprites/apple.svg',
  bell: '../assets/bonusSprites/bell.svg',
  cherry: '../assets/bonusSprites/cherry.svg',
  galaxian: '../assets/bonusSprites/galaxian.svg',
  key: '../assets/bonusSprites/key.svg',
  melon: '../assets/bonusSprites/melon.svg',
  orange: '../assets/bonusSprites/orange.svg',
  strawberry: '../assets/bonusSprites/strawberry.svg',
};

levelData = JSON.parse(JSON.stringify(levelsData.level1));
gameGridData = JSON.parse(JSON.stringify(levelData.gameGrid));
cruiseElroyTrigger = levelData.cruiseElroyTrigger;

pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
blinkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
pinkyPosition = JSON.parse(JSON.stringify(levelData.pinkyStart));
inkyPosition = JSON.parse(JSON.stringify(levelData.inkyStart));
clydePosition = JSON.parse(JSON.stringify(levelData.clydeStart));
bonusPosition = JSON.parse(JSON.stringify(levelData.bonusLocation));
bonus = levelData.bonusInfo[level];

// functions
const gameLoop = (timestamp) => {
  requestAnimationFrame(gameLoop);

  if (pacmanDead) {
    animatePacman(timestamp);
  }

  if (!gameStarted) {
    return;
  }

  if (!lastGameUpdateTime) lastGameUpdateTime = timestamp;
  if (!lastGhostMoveTime) lastGhostMoveTime = timestamp;

  const elapsedSincePacmanTick = timestamp - lastGameUpdateTime;
  const elapsedSinceGhostTick = timestamp - lastGhostMoveTime;

  if (elapsedSincePacmanTick >= gameInterval) {
    lastGameUpdateTime = timestamp - (elapsedSincePacmanTick % gameInterval);

    switch (pacmanDesiredDirection) {
      case 'up':
        !playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1] - 1)
          ? (pacmanDirection = pacmanDesiredDirection)
          : null;
        break;
      case 'down':
        !playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1] + 1)
          ? (pacmanDirection = pacmanDesiredDirection)
          : null;
        break;
      case 'left':
        !playerWallColisionDetection(pacmanPosition[0] - 1, pacmanPosition[1])
          ? (pacmanDirection = pacmanDesiredDirection)
          : null;
        break;
      case 'right':
        !playerWallColisionDetection(pacmanPosition[0] + 1, pacmanPosition[1])
          ? (pacmanDirection = pacmanDesiredDirection)
          : null;
        break;
    }

    checkGameOver();
    placeBonus();
    addBonusLife();
    animatePacman(timestamp);
    animateGhosts(timestamp);

    if (pacmanDirection === 'right') {
      movePacmanRight(pacmanPosition);
      checkTunnelWrapAround(pacmanPosition);
      chompPellet(pacmanPosition);
      chompBonus(pacmanPosition);
      chompPowerPellet(pacmanPosition);
      checkGhostCollision();
    } else if (pacmanDirection === 'left') {
      movePacmanLeft(pacmanPosition);
      checkTunnelWrapAround(pacmanPosition);
      chompBonus(pacmanPosition);
      chompPellet(pacmanPosition);
      chompPowerPellet(pacmanPosition);
      checkGhostCollision();
    } else if (pacmanDirection === 'up') {
      movePacmanUp(pacmanPosition);
      checkTunnelWrapAround(pacmanPosition);
      chompBonus(pacmanPosition);
      chompPellet(pacmanPosition);
      chompPowerPellet(pacmanPosition);
      checkGhostCollision();
    } else if (pacmanDirection === 'down') {
      movePacmanDown(pacmanPosition);
      checkTunnelWrapAround(pacmanPosition);
      chompBonus(pacmanPosition);
      chompPellet(pacmanPosition);
      chompPowerPellet(pacmanPosition);
      checkGhostCollision();
    }

    if (elapsedSinceGhostTick >= ghostMoveInterval) {
      lastGhostMoveTime =
        timestamp - (elapsedSinceGhostTick % ghostMoveInterval);

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
  pacLifeEl.classList.add('pac-life');
  pacLifeEl.src = '../assets/characterSprites/pacman/extra_life.svg';
  pacLifeEl.width = 22;
  return pacLifeEl;
};

const addBonusImage = () => {
  const bonusImageEl = document.createElement('img');
  bonusImageEl.classList.add('bonus-image');
  bonusImageEl.src = bonusAssets[bonus[0]];
  bonusImageEl.width = 22;
  return bonusImageEl;
};

const checkGameOver = () => {
  if (lives <= 0) {
    gameOver = true;
    gameStarted = false;
  }

  if (pelletCount === pelletCountTotal) {
    gameOver = false;
    gameStarted = false;
    level++;
    gameStatusEl.textContent = 'Congrats! Next Level!';
    setTimeout(() => {
      nextLevel();
    }, 2000);
  }
};

const addBonusLife = () => {
  if (score > 10000 && score % 10000 === 0) {
    lives++;
    addLifeImage();
  }
};

const placeBonus = () => {
  if (bonusCount === 1 && pelletCount >= 70) {
    bonusCount = 2;
    bonusIsVisible = true;
    const bonusAppearEl = document.createElement('img');
    bonusAppearEl.classList.add('bonus-element');

    bonusAppearEl.src = bonusAssets[bonus[0]];
    bonusAppearEl.width = 22;
    gameGrid.appendChild(bonusAppearEl);

    bonusAppearEl.style.gridColumnStart = `${levelData.bonusLocation[0] + 1}`;
    bonusAppearEl.style.gridRowStart = `${levelData.bonusLocation[1] + 1}`;

    setTimeout(() => {
      bonusIsVisible = false;
      bonusAppearEl.remove();
    }, 9500);
  }
  if (bonusCount === 2 && pelletCount >= 170) {
    bonusCount = 3;
    bonusIsVisible = true;
    const bonusAppearEl = document.createElement('img');
    bonusAppearEl.classList.add('bonus-element');
    bonusAppearEl.src = bonusAssets[bonus[0]];
    bonusAppearEl.width = 22;

    gameGrid.appendChild(bonusAppearEl);

    bonusAppearEl.style.gridColumnStart = `${levelData.bonusLocation[0] + 1}`;
    bonusAppearEl.style.gridRowStart = `${levelData.bonusLocation[1] + 1}`;
    setTimeout(() => {
      bonusIsVisible = false;
      bonusAppearEl.remove();
    }, 9500);
  }
};

const returnGhostToRegenerator = (ghost) => {
  switch (ghost) {
    case 'blinky':
      isBlinkyDead = true;
      blinky.style.backgroundImage =
        'url(../assets/characterSprites/ghostGeneral/eyes_left.svg )';
      break;
    case 'pinky':
      isPinkyDead = true;
      pinky.style.backgroundImage =
        'url(../assets/characterSprites/ghostGeneral/eyes_left.svg )';
      break;
    case 'inky':
      isInkyDead = true;
      inky.style.backgroundImage =
        'url(../assets/characterSprites/ghostGeneral/eyes_left.svg )';
    case 'clyde':
      isClydeDead = true;
      clyde.style.backgroundImage =
        'url(../assets/characterSprites/ghostGeneral/eyes_left.svg )';
      break;
  }
};

const resetLevelAfterDeath = () => {
  pacman.classList.remove('pacman-death');
  pacman.classList.add('pacman');
  pacmanDead = false;
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_left.svg)';
  pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
  blinkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
  pinkyPosition = JSON.parse(JSON.stringify(levelData.pinkyStart));
  inkyPosition = JSON.parse(JSON.stringify(levelData.inkyStart));
  clydePosition = JSON.parse(JSON.stringify(levelData.clydeStart));
  bonusPosition = JSON.parse(JSON.stringify(levelData.bonusLocation));
  blinky.style.visibility = 'visible';
  pinky.style.visibility = 'visible';
  inky.style.visibility = 'visible';
  clyde.style.visibility = 'visible';
  pinkyStarted = false;
  inkyStarted = false;
  clydeStarted = false;
  isBlinkyDead = false;
  isBlinkyRegenerated = false;
  isPinkyDead = false;
  isPinkyRegenerated = false;
  isInkyDead = false;
  isInkyRegenerated = false;
  isClydeDead = false;
  isClydeRegenerated = false;
  ghostCount = 0;
  gameStarted = true;
  pacmanDesiredDirection = 'right';
  pacmanDirection = 'right';
};

const nextLevel = () => {
  gameGrid.innerHTML = '';
  gameStatusEl.textContent = '';
  bonus = levelData.bonusInfo[level];
  cruiseElroyTrigger = levelData.cruiseElroyTrigger;
  pacmanPosition = JSON.parse(JSON.stringify(levelData.playerStart));
  blinkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
  pinkyPosition = JSON.parse(JSON.stringify(levelData.pinkyStart));
  inkyPosition = JSON.parse(JSON.stringify(levelData.inkyStart));
  clydePosition = JSON.parse(JSON.stringify(levelData.clydeStart));
  bonusPosition = JSON.parse(JSON.stringify(levelData.bonusLocation));
  bonus = levelData.bonusInfo[level];
  pinkyStarted = false;
  inkyStarted = false;
  clydeStarted = false;
  isBlinkyDead = false;
  isBlinkyRegenerated = false;
  isPinkyDead = false;
  isPinkyRegenerated = false;
  isInkyDead = false;
  isInkyRegenerated = false;
  isClydeDead = false;
  isClydeRegenerated = false;
  pelletCount = 0;
  ghostCount = 0;
  gameOver = false;
  gameStarted = true;
  pacmanDirection = 'right';
  bonusCount = 1;
  bonusIsVisible = false;
  pelletCountTotal = 0;
  livesEl.textContent = `Lives:`;
  for (let i = 0; i < lives; i++) {
    livesEl.appendChild(addLifeImage());
  }
  levelData = JSON.parse(JSON.stringify(levelsData.level1));
  gameGridData = JSON.parse(JSON.stringify(levelData.gameGrid));

  gameGridData.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 80) {
        pelletCountTotal++;
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

  bonusEl.appendChild(addBonusImage());
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
  bonusPosition = JSON.parse(JSON.stringify(levelData.bonusLocation));
  bonus = levelData.bonusInfo[level];
  pinkyStarted = false;
  inkyStarted = false;
  clydeStarted = false;
  isBlinkyDead = false;
  isPinkyDead = false;
  isInkyDead = false;
  isClydeDead = false;
  isBlinkyRegenerated = false;
  isPinkyRegenerated = false;
  isInkyRegenerated = false;
  isClydeRegenerated = false;
  pelletCount = 0;
  ghostCount = 0;
  gameOver = false;
  gameStarted = true;
  pacmanDirection = 'right';
  score = 0;
  lives = 3;
  bonusCount = 1;
  bonusIsVisible = false;
  pelletCountTotal = 0;
  livesEl.textContent = `Lives:`;
  for (let i = 0; i < lives; i++) {
    livesEl.appendChild(addLifeImage());
  }
  levelData = JSON.parse(JSON.stringify(levelsData.level1));
  gameGridData = JSON.parse(JSON.stringify(levelData.gameGrid));

  gameGridData.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 80) {
        pelletCountTotal++;
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
    localStorage.setItem('highScore', highScore);
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
    // pelletCount += 1;
    score += 50;
    updateScore();
    activateScatterMode();
  }
};

const chompBonus = (pacmanPosition) => {
  if (bonusIsVisible) {
    if (
      pacmanPosition[1] === levelData.bonusLocation[1] &&
      pacmanPosition[0] === levelData.bonusLocation[0]
    ) {
      score += bonus[1];
      const bonusElement = document.querySelector('.bonus-element').remove();
      updateScore();
    }
  }
};

const checkGhostCollision = () => {
  if (!pacmanDead) {
    if (
      pacmanPosition[0] === blinkyPosition[0] &&
      pacmanPosition[1] === blinkyPosition[1]
    ) {
      if (isScatterMode && !isBlinkyDead && !isBlinkyRegenerated) {
        score += ghostChomped;
        updateScore();
        returnGhostToRegenerator('blinky');
        ghostChomped = ghostChomped * 2;
      } else if (!isBlinkyDead) {
        lives--;
        pacmanDeath();
        setTimeout(() => {
          livesEl.textContent = `Lives:`;
          for (let i = 0; i < lives; i++) {
            livesEl.appendChild(addLifeImage());
          }
        }, 1000);
      }
    }
    if (
      pacmanPosition[0] === pinkyPosition[0] &&
      pacmanPosition[1] === pinkyPosition[1]
    ) {
      if (isScatterMode && !isPinkyDead && !isPinkyRegenerated) {
        score += ghostChomped;
        updateScore();
        returnGhostToRegenerator('pinky');
        ghostChomped = ghostChomped * 2;
      } else if (!isPinkyDead) {
        lives--;
        pacmanDeath();
        setTimeout(() => {
          livesEl.textContent = `Lives:`;
          for (let i = 0; i < lives; i++) {
            livesEl.appendChild(addLifeImage());
          }
        }, 1000);
      }
    }
    if (
      pacmanPosition[0] === inkyPosition[0] &&
      pacmanPosition[1] === inkyPosition[1]
    ) {
      if (isScatterMode && !isInkyDead && !isInkyRegenerated) {
        score += ghostChomped;
        updateScore();
        returnGhostToRegenerator('inky');
        ghostChomped = ghostChomped * 2;
      } else if (!isInkyDead) {
        lives--;
        pacmanDeath();
        setTimeout(() => {
          livesEl.textContent = `Lives:`;
          for (let i = 0; i < lives; i++) {
            livesEl.appendChild(addLifeImage());
          }
        }, 1000);
      }
    }
    if (
      pacmanPosition[0] === clydePosition[0] &&
      pacmanPosition[1] === clydePosition[1]
    ) {
      if (isScatterMode && !isClydeDead && !isClydeRegenerated) {
        score += ghostChomped;
        updateScore();
        returnGhostToRegenerator('clyde');
        ghostChomped = ghostChomped * 2;
      } else if (!isClydeDead) {
        lives--;
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
  }
};

const animatePacman = (timestamp) => {
  if (!lastAnimationTime) lastAnimationTime = timestamp;
  const deltaTime = timestamp - lastAnimationTime;
  if (!pacmanDead) {
    if (deltaTime >= animationInterval) {
      currentFrame = (currentFrame + 1) % totalFrames;
      const positionX = (currentFrame / (totalFrames - 1)) * 100;
      pacman.style.backgroundPosition = `${positionX}% 0%`;
      lastAnimationTime = timestamp - (deltaTime % animationInterval);
    }
  } else {
    if (deltaTime >= animationInterval) {
      currentFrame = (currentFrame + 1) % 12;
      const positionX = (currentFrame / (12 - 1)) * 100;
      pacman.style.backgroundPosition = `${positionX}% 0%`;
      lastAnimationTime = timestamp - (deltaTime % animationInterval);
    }
  }
};

const animateGhosts = (timestamp) => {
  if (!lastGhostAnimationTime) lastGhostAnimationTime = timestamp;
  const deltaTime = timestamp - lastGhostAnimationTime;

  if (deltaTime >= animationInterval) {
    ghostCurrentFrame =
      ((ghostCurrentFrame + 1) % (totalGhostFrames - 1)) * 100;
    const positionX = -(ghostCurrentFrame * ghostFrameWidth);

    blinky.style.backgroundPosition = `${positionX}% 0%`;
    pinky.style.backgroundPosition = `${positionX}% 0%`;
    inky.style.backgroundPosition = `${positionX}% 0%`;
    clyde.style.backgroundPosition = `${positionX}% 0%`;

    lastGhostAnimationTime = timestamp - (deltaTime % animationInterval);
  }
};

const movePacmanRight = (pacmanPosition) => {
  pacmanPosition[0] += 1;
  if (playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1])) {
    pacmanPosition[0] -= 1;
    return;
  }
  pacmanDeterminedDirection = pacmanDirection;
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_right.svg )';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

const movePacmanLeft = (pacmanPosition) => {
  pacmanPosition[0] -= 1;
  if (playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1])) {
    pacmanPosition[0] += 1;
    return;
  }
  pacmanDeterminedDirection = pacmanDirection;
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_left.svg )';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

const movePacmanUp = (pacmanPosition) => {
  pacmanPosition[1] -= 1;
  if (playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1])) {
    pacmanPosition[1] += 1;
    return;
  }
  pacmanDeterminedDirection = pacmanDirection;
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_up.svg )';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

const movePacmanDown = (pacmanPosition) => {
  pacmanPosition[1] += 1;
  if (playerWallColisionDetection(pacmanPosition[0], pacmanPosition[1])) {
    pacmanPosition[1] -= 1;
    return;
  }
  pacmanDeterminedDirection = pacmanDirection;
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_down.svg )';
  pacman.style.gridColumnStart = `${pacmanPosition[0] + 1}`;
  pacman.style.gridRowStart = `${pacmanPosition[1] + 1}`;
};

const pacmanDeath = () => {
  pacmanDead = true;
  gameStarted = false;
  blinky.style.visibility = 'hidden';
  pinky.style.visibility = 'hidden';
  inky.style.visibility = 'hidden';
  clyde.style.visibility = 'hidden';
  currentFrame = 0;
  pacman.classList.remove('pacman');
  pacman.classList.add('pacman-death');
  pacman.style.backgroundImage =
    'url(../assets/characterSprites/pacman/pacman_death.svg)';

  setTimeout(() => {
    resetLevelAfterDeath();
  }, 1000);
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
const endPowerPelletTimer = () => {
  powerPelletTimer = null;
};

const activateScatterMode = () => {
  if (powerPelletTimer !== null) {
    clearTimeout(powerPelletTimer);
  }

  if (isBlinkyRegenerated) {
    isBlinkyRegenerated = false;
  }

  if (isPinkyRegenerated) {
    isPinkyRegenerated = false;
  }

  if (isInkyRegenerated) {
    isInkyRegenerated = false;
  }

  if (isClydeRegenerated) {
    isClydeRegenerated = false;
  }

  isScatterMode = true;
  ghostMoveInterval = GHOST_SPEED_SLOW;
  reverseGhostDirection(blinkyDirection);
  reverseGhostDirection(pinkyDirection);
  reverseGhostDirection(inkyDirection);
  reverseGhostDirection(clydeDirection);

  powerPelletTimer = setTimeout(() => {
    isScatterMode = false;
    blinky.classList.remove('scared-ghost');
    pinky.classList.remove('scared-ghost');
    inky.classList.remove('scared-ghost');
    clyde.classList.remove('scared-ghost');
    ghostMoveInterval = GHOST_SPEED_NORMAL;
    ghostChomped = 200;
    endPowerPelletTimer();
  }, 8000);
};

const calculateGhostPacmanDistance = (ghostPosition, ghostTargetCell) => {
  const distance =
    Math.pow(ghostPosition[0] - ghostTargetCell[0], 2) +
    Math.pow(ghostPosition[1] - ghostTargetCell[1], 2);
  return distance;
};

const calculateGhostHomeDistance = (ghostPosition) => {
  const distance =
    Math.pow(ghostPosition[0] - 13, 2) + Math.pow(ghostPosition[1] - 11, 2);
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

const moveDeadGhost = (ghostPosition, ghostDirectionLast) => {
  if (
    !playerWallColisionDetection(ghostPosition[0], ghostPosition[1] - 1) &&
    ghostDirectionLast !== 'down'
  ) {
    distanceUp = calculateGhostHomeDistance([
      ghostPosition[0],
      ghostPosition[1] - 1,
    ]);
  } else {
    distanceUp = Infinity;
  }
  if (
    ghostInBounds([ghostPosition[0] - 1, ghostPosition[1]]) &&
    !playerWallColisionDetection(ghostPosition[0] - 1, ghostPosition[1]) &&
    ghostDirectionLast !== 'right'
  ) {
    distanceLeft = calculateGhostHomeDistance([
      ghostPosition[0] - 1,
      ghostPosition[1],
    ]);
  } else {
    distanceLeft = Infinity;
  }
  if (
    !playerWallColisionDetection(ghostPosition[0], ghostPosition[1] + 1) &&
    ghostDirectionLast !== 'up'
  ) {
    distanceDown = calculateGhostHomeDistance([
      ghostPosition[0],
      ghostPosition[1] + 1,
    ]);
  } else {
    distanceDown = Infinity;
  }
  if (
    !playerWallColisionDetection(ghostPosition[0] + 1, ghostPosition[1]) &&
    ghostDirectionLast !== 'left'
  ) {
    distanceRight = calculateGhostHomeDistance([
      ghostPosition[0] + 1,
      ghostPosition[1],
    ]);
  } else {
    distanceRight = Infinity;
  }

  return determineShortestDistance(
    distanceUp,
    distanceLeft,
    distanceRight,
    distanceDown,
    ghostDirectionLast,
  );
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

  if (!isScatterMode && !isBlinkyDead && isBlinkyRegenerated) {
    isBlinkyRegenerated = false;
  }

  if (isBlinkyDead) {
    const blinkyStart = JSON.parse(JSON.stringify(levelData.blinkyStart));
    blinkyDirection = moveDeadGhost(blinkyPosition, blinkyDirectionLast);
    if (
      blinkyPosition[0] === blinkyStart[0] &&
      blinkyPosition[1] === blinkyStart[1]
    ) {
      isBlinkyDead = false;
      isBlinkyRegenerated = true;
      console.log('blinky alive again');
      blinky.style.backgroundImage =
        '../assets/characterSprites/blinky/blinky_left.svg';
      blinkyPosition = blinkyStart;
      blinky.style.gridColumnStart = `${blinkyStart[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyStart[1] + 1}`;
    }
  } else if (!isScatterMode || !isBlinkyDead || isBlinkyRegenerated) {
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
      if (isScatterMode && !isBlinkyDead && !isBlinkyRegenerated) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isBlinkyDead) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_up.svg )';
      } else {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/blinky/blinky_up.svg )';
      }
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      break;
    case 'down':
      blinkyPosition[1] += 1;
      if (isScatterMode && !isBlinkyDead && !isBlinkyRegenerated) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isBlinkyDead) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_down.svg )';
      } else {
        blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/blinky/blinky_down.svg )';
      }
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      break;
    case 'left':
      blinkyPosition[0] -= 1;
      if (isScatterMode && !isBlinkyDead && !isBlinkyRegenerated) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isBlinkyDead) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_left.svg )';
      } else {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/blinky/blinky_left.svg )';
      }
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      break;
    case 'right':
      blinkyPosition[0] += 1;
      if (isScatterMode && !isBlinkyDead && !isBlinkyRegenerated) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isBlinkyDead) {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        blinky.style.backgroundImage =
          'url(../assets/characterSprites/blinky/blinky_right.svg )';
      }
      blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
      blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
      break;
  }

  blinky.style.gridColumnStart = `${blinkyPosition[0] + 1}`;
  blinky.style.gridRowStart = `${blinkyPosition[1] + 1}`;
};

const movePinky = () => {
  // pinky targets the cell 4 spaces ahead of pacman in the direction pacman is currently moving

  let pinkyTargetCell;

  if (!isScatterMode && !isPinkyDead && isPinkyRegenerated) {
    isPinkyRegenerated = false;
  }

  if (blinkyPosition !== levelData.blinkyStart && !pinkyStarted) {
    setTimeout(() => {
      pinkyPosition = JSON.parse(JSON.stringify(levelData.blinkyStart));
      pinkyStarted = true;
    }, 2000);
  }

  if (pinkyDirection !== Infinity || pinkyDirection !== undefined) {
    pinkyDirectionLast = pinkyDirection;
  }

  switch (pacmanDeterminedDirection) {
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

  if (isPinkyDead) {
    const blinkyStart = JSON.parse(JSON.stringify(levelData.blinkyStart));
    pinkyDirection = moveDeadGhost(pinkyPosition, pinkyDirectionLast);
    if (
      pinkyPosition[0] === blinkyStart[0] &&
      pinkyPosition[1] === blinkyStart[1]
    ) {
      console.log('pinky regenerated');
      isPinkyDead = false;
      isPinkyRegenerated = true;
      pinky.style.backgroundImage =
        '../assets/characterSprites/blinky/blinky_left.svg';
      pinkyPosition = blinkyStart;
      pinky.style.gridColumnStart = `${blinkyStart[0] + 1}`;
      pinky.style.gridRowStart = `${blinkyStart[1] + 1}`;
    }
  } else if (!isScatterMode || !isPinkyDead || isPinkyRegenerated) {
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
      pinkyPosition[1] -= 1;
      if (isScatterMode && !isPinkyDead && !isPinkyRegenerated) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isPinkyDead) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_up.svg )';
      } else {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/pinky/pinky_up.svg )';
      }
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
      break;
    case 'down':
      pinkyPosition[1] += 1;
      if (isScatterMode && !isPinkyDead && !isPinkyRegenerated) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isPinkyDead) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_down.svg )';
      } else {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/pinky/pinky_down.svg )';
      }
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
      break;
    case 'left':
      pinkyPosition[0] -= 1;
      if (isScatterMode && !isPinkyDead && !isPinkyRegenerated) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isPinkyDead) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_left.svg )';
      } else {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/pinky/pinky_left.svg )';
      }
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
      break;
    case 'right':
      pinkyPosition[0] += 1;
      if (isScatterMode && !isPinkyDead && !isPinkyRegenerated) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isPinkyDead) {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        pinky.style.backgroundImage =
          'url(../assets/characterSprites/pinky/pinky_right.svg )';
      }
      pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
      pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
      break;
  }

  pinky.style.gridColumnStart = `${pinkyPosition[0] + 1}`;
  pinky.style.gridRowStart = `${pinkyPosition[1] + 1}`;
};

const moveInky = () => {
  // inky targets the cell that is the vector from blinky to the cell 2 spaces ahead of pacman in the direction pacman is currently moving, multiplied by 2 (so basically if blinky is at (5,5) and the cell 2 spaces ahead of pacman is (10,10), inky targets the cell (15,15))
  let inkyTargetCell;
  let cellTwoAhead;
  if (!isScatterMode && !isInkyDead && isInkyRegenerated) {
    isInkyRegenerated = false;
  }

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

  if (isInkyDead) {
    const blinkyStart = JSON.parse(JSON.stringify(levelData.blinkyStart));
    inkyDirection = moveDeadGhost(inkyPosition, inkyDirectionLast);
    if (
      inkyPosition[0] === blinkyStart[0] &&
      inkyPosition[1] === blinkyStart[1]
    ) {
      isInkyDead = false;
      isInkyRegenerated = true;
      inky.style.backgroundImage =
        '../assets/characterSprites/blinky/inky_left.svg';
      inkyPosition = blinkyStart;
      inky.style.gridColumnStart = `${blinkyStart[0] + 1}`;
      inky.style.gridRowStart = `${blinkyStart[1] + 1}`;
    }
  } else if (!isScatterMode || !isInkyDead || isInkyRegenerated) {
    inkyDirection = moveGhost(inkyPosition, inkyTargetCell, inkyDirectionLast);
  } else {
    inkyDirection = moveGhost(inkyPosition, [27, 31], inkyDirectionLast);
  }

  switch (inkyDirection) {
    case 'up':
      inkyPosition[1] -= 1;
      if (isScatterMode && !isInkyDead && !isInkyRegenerated) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isInkyDead) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/inky/inky_up.svg )';
      }
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
      break;
    case 'down':
      inkyPosition[1] += 1;
      if (isScatterMode && !isInkyDead && !isInkyRegenerated) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isInkyDead) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/inky/inky_down.svg )';
      }
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
      break;
    case 'left':
      inkyPosition[0] -= 1;
      if (isScatterMode && !isInkyDead && !isInkyRegenerated) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isInkyDead) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/inky/inky_left.svg )';
      }
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
      break;
    case 'right':
      inkyPosition[0] += 1;
      if (isScatterMode && !isInkyDead && !isInkyRegenerated) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isInkyDead) {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        inky.style.backgroundImage =
          'url(../assets/characterSprites/inky/inky_right.svg )';
      }
      inky.style.gridColumnStart = `${inkyPosition[0] + 1}`;
      inky.style.gridRowStart = `${inkyPosition[1] + 1}`;
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

  if (!isScatterMode && !isClydeDead && isClydeRegenerated) {
    isInkyRegenerated = false;
  }

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

  if (isClydeDead) {
    const blinkyStart = JSON.parse(JSON.stringify(levelData.blinkyStart));
    clydeDirection = moveDeadGhost(clydePosition, clydeDirectionLast);
    if (
      clydePosition[0] === blinkyStart[0] &&
      clydePosition[1] === blinkyStart[1]
    ) {
      isClydeDead = false;
      isClydeRegenerated = true;
      clyde.style.backgroundImage =
        '../assets/characterSprites/blinky/clyde_left.svg';
      clydePosition = blinkyStart;
      clyde.style.gridColumnStart = `${blinkyStart[0] + 1}`;
      clyde.style.gridRowStart = `${blinkyStart[1] + 1}`;
    }
  } else if (!isScatterMode || !isClydeDead || isClydeRegenerated) {
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
      clydePosition[1] -= 1;
      if (isScatterMode && !isClydeDead && !isClydeRegenerated) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isClydeDead) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/clyde/clyde_up.svg )';
      }
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
      break;
    case 'down':
      clydePosition[1] += 1;
      if (isScatterMode && !isClydeDead && !isClydeRegenerated) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isClydeDead) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/clyde/clyde_down.svg )';
      }
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
      break;
    case 'left':
      clydePosition[0] -= 1;
      if (isScatterMode && !isClydeDead && !isClydeRegenerated) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isClydeDead) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/clyde/clyde_left.svg )';
      }
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
      break;
    case 'right':
      clydePosition[0] += 1;
      if (isScatterMode && !isClydeDead && !isClydeRegenerated) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/scared_blue.svg )';
      } else if (isClydeDead) {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/ghostGeneral/eyes_right.svg )';
      } else {
        clyde.style.backgroundImage =
          'url(../assets/characterSprites/clyde/clyde_right.svg )';
      }
      clyde.style.gridColumnStart = `${clydePosition[0] + 1}`;
      clyde.style.gridRowStart = `${clydePosition[1] + 1}`;
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
bonusEl.textContent = `Bonus:`;
bonusEl.appendChild(addBonusImage());
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
      pacmanDesiredDirection = 'up';
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      pacmanDesiredDirection = 'down';
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      pacmanDesiredDirection = 'left';
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      pacmanDesiredDirection = 'right';
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
