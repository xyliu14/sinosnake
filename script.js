const canvas = document.getElementById('game'); // Changed from 'game-board' to 'game'
const context = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

const foodCount = 5; // Number of food items you want on the board
const snakeSpeed = 100;

const background = 'rgb(241, 219, 191)';
const snakeColor = 'rgb(170, 86, 86)';
const foodColor = 'rgb(105, 130, 105)';
// const targetWordColor = 'rgb(241, 219, 191)';
const targetWordBackground = document.getElementById('progress-bar');
let correctLettersEaten = 0;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = [];
let growSnake = false;
let eatenLetters = [];
let currentPinyinIndex = 0; 
let pinyinDictionary;
let chineseWords;
let targetWord;
let requiredPinyinLetters;
let isGameOver = false;
let score = 0;
let highScore = 0;

const scoreText = document.getElementById('score-text');
const highScoreText = document.getElementById('high-score-text');
scoreText.innerHTML = 'Score<br>' + score;
highScoreText.innerHTML = 'Best<br>' + highScore;

const playAgainButton = document.getElementById('play-again-button');
playAgainButton.addEventListener('click', function () {
  const overlay = document.getElementById('game-over-overlay');
  overlay.style.display = 'none';
  restartGame();
});

const pinyinLetters = ['ā', 'á', 'ǎ', 'à', 'a', 'ō', 'ó', 'ǒ', 'ò', 'o', 'ē', 'é', 'ě', 'è', 'e', 
                        'ī', 'í', 'ǐ', 'ì', 'i', 'ū', 'ú', 'ǔ', 'ù', 'u', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü', 
                        'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 
                        'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'];


// Load the files and parse them into the appropriate data structures
async function loadFiles() {
  const chineseWordsResponse = await fetch('asset/chinese_words.txt');
  chineseWords = (await chineseWordsResponse.text()).split('\n');

  const pinyinDictionaryResponse = await fetch('pinyin-dictionary.txt');
  const pinyinDictionaryText = await pinyinDictionaryResponse.text();
  pinyinDictionary = parsePinyinDictionary(pinyinDictionaryText);

  startGame(chineseWords, pinyinDictionary);
}


function parsePinyinDictionary(fileContents) {
  const lines = fileContents.split('\n');
  const dictionary = {};

  for (let line of lines) {
    const [char, pinyin] = line.split(',');

    if (!dictionary[pinyin]) {
      dictionary[pinyin] = [];
    }
    dictionary[pinyin].push(char);
  }

  return dictionary;
}

loadFiles();

function generateTargetWord(chineseWords, pinyinDictionary) {
  // Display a random Chinese word
  const randomWordIndex = Math.floor(Math.random() * chineseWords.length);
  targetWord = chineseWords[randomWordIndex];
  displayTargetWord(targetWord);
  const targetWordPinyin = targetWord.split('').map((char) => getPinyinForCharacter(char, pinyinDictionary));
  requiredPinyinLetters = targetWordPinyin.join('').split('');
  currentPinyinIndex = 0;
}

function startGame(chineseWords, pinyinDictionary) {
  // Your existing game initialization code

  generateTargetWord(chineseWords, pinyinDictionary);

  // Generate initial food positions
  for (let i = 0; i < foodCount; i++) {
    if (i === 0) {
      food.push(generateFood(requiredPinyinLetters[currentPinyinIndex])); // Generate food with the first required letter
    } else {
      food.push(generateFood()); // Generate food with a random letter
    }
  }

  food = food.filter((item, index, self) => 
    index === self.findIndex((t) => (t.x === item.x && t.y === item.y))
  );

  // Fill up the food array if duplicates were removed
  while (food.length < foodCount) {
    food.push(generateFood());
  }

  // Your existing game loop code
  gameLoop();
}

function gameLoop() {
  if (isGameOver) {
    return;
  }
  
  moveSnake();
  
  if (isOutOfBounds()) {
    gameOver();
    isGameOver = true;
    return;
  }
  
  checkFoodCollision();
  checkSnakeCollision();
  draw();
  
  setTimeout(gameLoop, snakeSpeed);
}

function displayTargetWord(word) {
  const targetWordElement = document.getElementById('target-word');
  targetWordElement.textContent = word;

  updateTargetWordContainerWidth();
  adjustPinyinFontSize();
}

function updateTargetWordContainerWidth() {
  const targetWordElement = document.getElementById('target-word');
  const targetWordContainer = document.getElementById('target-word-container');

  const targetWordWidth = targetWordElement.clientWidth;
  const containerWidth = (targetWordWidth + 20) * 1.1; // Add 10 for the border width, then multiply by 1.1 to increase by 10%
  targetWordContainer.style.width = `${containerWidth}px`;
}

function moveSnake() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    snake.unshift(head);
    
    if (growSnake) {
      // Add a new segment to the snake and reset the growSnake flag
      growSnake = false;
    } else {
      // Remove the last segment if the snake is not growing
      snake.pop();
    }
  }

function isPositionValid(x, y) {
    // Check if the position is occupied by the snake
    for (let cell of snake) {
      if (cell.x === x && cell.y === y) {
        return false;
      }
    }
  
    // Check if the position is occupied by other food items
    for (let f of food) {
      if (f.x === x && f.y === y) {
        return false;
      }
    }
  
    return true;
}

function generateValidFoodPosition() {
  let x, y;
  do {
    x = Math.floor(Math.random() * (tileCount - 2)) + 1; // Add 1 to avoid the left edge and subtract 2 to avoid the right edge
    y = Math.floor(Math.random() * (tileCount - 2)) + 1; // Add 1 to avoid the top edge and subtract 2 to avoid the bottom edge
  } while (!isPositionValid(x, y));

  return { x, y };
}

function generateFood(letter) {
  const position = generateValidFoodPosition();
  letter = letter || pinyinLetters[Math.floor(Math.random() * pinyinLetters.length)]; // Use the provided letter or pick a random one
  return { x: position.x, y: position.y, letter };
}

function checkFoodCollision() {
  for (let i = 0; i < food.length; i++) {
    if (snake[0].x === food[i].x && snake[0].y === food[i].y) {
      handleFoodCollision(food[i]);
      return;
    }
  }
}

function handleFoodCollision(foodItem) {
  const eatenLetter = foodItem.letter;
  eatenLetters.push(eatenLetter);
  displayEatenLetters();
  growSnake = true;

  if (eatenLetter === requiredPinyinLetters[currentPinyinIndex]) {
    handleCorrectLetterCollision();
  } else {
    gameOver();
  }
}

function handleCorrectLetterCollision() {
  const targetWordContainer = document.getElementById("target-word-container");
  currentPinyinIndex++;
  correctLettersEaten++;
  targetWordBackground.style.width = `${(correctLettersEaten / requiredPinyinLetters.length) * 100}%`;
  score += correctLettersEaten * 100;
  if (score > highScore) {
    highScore = score;
  }
  drawScore();

  if (currentPinyinIndex >= requiredPinyinLetters.length) {
    handleTargetWordComplete();
    correctLettersEaten = 0;
    targetWordContainer.classList.add("glow");
    targetWordContainer.addEventListener('animationend', function() {
      targetWordContainer.classList.remove('glow');
    }, {once: true});
    targetWordBackground.style.width = `${(correctLettersEaten / requiredPinyinLetters.length) * 100}%`;
  } else {
    generateFoodItems();
  }

}

function handleTargetWordComplete() {
  // blinkTargetWord();
  currentPinyinIndex = 0;
  clearEatenLettersDisplay();
  eatenLetters = [];
  generateTargetWord(chineseWords, pinyinDictionary);
  generateFoodItems();
}

function generateFoodItems() {
  food = [];
  for (let i = 0; i < foodCount; i++) {
    if (i === 0) {
      food.push(generateFood(requiredPinyinLetters[currentPinyinIndex])); // Generate food with the next required letter
    } else {
      food.push(generateFood()); // Generate food with a random letter
    }
  }
}


function isOutOfBounds() {
    const head = snake[0];
    return head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
}

function checkSnakeCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      gameOver(); // Call the gameOver function when the snake collides with itself
      return;
    }
  }
}

function draw() {
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (!isGameOver) {
    context.fillStyle = snakeColor;
    for (let cell of snake) {
      context.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize - 2, gridSize - 2);
    }

    context.fillStyle = 'transparent';
    context.font = '18px sans-serif';
    for (let f of food) {
      context.fillRect(f.x * gridSize, f.y * gridSize, gridSize - 2, gridSize - 2);
      context.fillStyle = foodColor;
      context.fillText(f.letter, f.x * gridSize + 4, f.y * gridSize + gridSize / 2 + 4);
      context.fillStyle = 'transparent';
    }
  }
}

function drawScore() {
  scoreText.innerHTML = 'Score<br>' + score;
  highScoreText.innerHTML = 'Best<br>' + highScore;
}

// function blinkTargetWord() {
//   const targetWordContainer = document.getElementById("target-word-container");

//   targetWordContainer.classList.add("highlight");

//   setTimeout(() => {
//     targetWordContainer.classList.remove("highlight");
//   }, 1000);
// }


function gameOver() {
  isGameOver = true;
  clearEatenLettersDisplay();

  // Display the correct target word
  const targetWordElement = document.getElementById('target-word');
  targetWordElement.textContent = requiredPinyinLetters.join('');

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  displayGameOverScreen(score);
}

function displayGameOverScreen(score) {
  const overlay = document.getElementById('game-over-overlay');
  const gameOverText = document.getElementById('game-over-text');
  
  gameOverText.textContent = `You got: ${score} !`;
  overlay.style.display = 'flex';
  playAgainButton.style.display = 'inline-block'; // Add this line
}

function adjustPinyinFontSize() {
  const targetWordElement = document.getElementById('target-word');
  const targetWordContainer = document.getElementById('target-word-container');
  const containerWidth = targetWordContainer.clientWidth;

  let fontSize = 24; // Start with the original font size
  targetWordElement.style.fontSize = `${fontSize}px`;

  while (targetWordElement.clientWidth > containerWidth) {
    fontSize -= 1; // Reduce the font size by 1
    targetWordElement.style.fontSize = `${fontSize}px`;
  }
}


function restartGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  growSnake = false;
  food = [];
  eatenLetters = [];
  isGameOver = false;
  score = 0;
  correctLettersEaten = 0;
  targetWordBackground.style.width = `${(correctLettersEaten / requiredPinyinLetters.length) * 100}%`;

  drawScore();

  // Generate a new target word
  generateTargetWord(chineseWords, pinyinDictionary);

  // Generate initial food positions
  for (let i = 0; i < foodCount; i++) {
    if (i === 0) {
      food.push(generateFood(requiredPinyinLetters[currentPinyinIndex])); // Generate food with the first required letter
    } else {
      food.push(generateFood()); // Generate food with a random letter
    }
  }

  // Remove duplicates from the food array
  food = food.filter((item, index, self) =>
    index === self.findIndex((t) => (t.x === item.x && t.y === item.y))
  );

  // Fill up the food array if duplicates were removed
  while (food.length < foodCount) {
    food.push(generateFood());
  }

  gameLoop();
}


function getPinyinForCharacter(character, pinyinDictionary) {
  for (const pinyin in pinyinDictionary) {
    if (pinyinDictionary[pinyin].includes(character)) {
      return pinyin;
    }
  }

  return ''; // Return an empty string if the character's pinyin is not found
}


function displayEatenLetters() {
  const eatenLettersElement = document.getElementById('eaten-letters');
  eatenLettersElement.innerHTML = '';
  
  for (let i = 0; i < eatenLetters.length; i++) {
    const letterElement = document.createElement('span');
    letterElement.textContent = eatenLetters[i];
    eatenLettersElement.appendChild(letterElement);
  }
}

function clearEatenLettersDisplay() {
    const eatenLettersElement = document.getElementById('eaten-letters');
    eatenLettersElement.innerHTML = '';
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      if (velocity.y === 0) velocity = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
    case 's':
      if (velocity.y === 0) velocity = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
    case 'a':
      if (velocity.x === 0) velocity = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
    case 'd':
      if (velocity.x === 0) velocity = { x: 1, y: 0 };
      break;
  }
});
