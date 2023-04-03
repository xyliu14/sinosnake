const fs = require('fs');
const pinyin = require('pinyin').default;


const fileContents = fs.readFileSync('asset/chinese_characters.txt', 'utf8');
const lines = fileContents.split('\n');
const characters = lines.map(line => line.replace('\n', ''));

const dictionary = characters.map(char => {
  const pinyinStr = pinyin(char).flat().join('');
  return `${char},${pinyinStr}`;
});

fs.writeFile('pinyin-dictionary.txt', dictionary.join('\n'), (err) => {
  if (err) {
    console.error('Error writing the file:', err);
  } else {
    console.log('Pinyin dictionary saved successfully.');
  }
});




// const dictionary = {}; // empty object to store the dictionary
  
  // for (let i = 0; i < characters.length; i++) {
  //   const char = characters[i];
  //   const pinyinList = pinyin(char);
  //   for (let j = 0; j < pinyinList.length; j++) {
  //     const pinyinStr = pinyinList[j];
  //     if (!dictionary[pinyinStr]) {
  //       dictionary[pinyinStr] = [];
  //     }
  //     dictionary[pinyinStr].push(char);
  //   }
  // }
  
  // console.log(dictionary);

//   const canvas = document.getElementById('game-board');
//   const context = canvas.getContext('2d');
  
//   const gridSize = 20;
//   const tileCount = canvas.width / gridSize;
  
//   const foodCount = 3; // Number of food items you want on the board
//   let snake = [{ x: 10, y: 10 }];
//   let velocity = { x: 0, y: 0 };
//   let food = [];
//   let growSnake = false;
//   let eatenLetters = [];
  
  
//   // getting chinese characters and their pinyin in a dictionay
//   const fs = require('fs');
//   const pinyin = require('pinyin').default;
  
//   const filePath = 'test.txt'; // path to your text file
//   const options = {
//     heteronym: true, // enable heteronym mode
//     segment: true, // enable segment mode
//     style: pinyin.STYLE_NORMAL, // set the pinyin style to normal
//   };
  
//   const fileContents = fs.readFileSync('test.txt', 'utf8');
//   const lines = fileContents.split('\n');
//   const characters = lines.map(line => line.replace('\n', ''));
  
//   const dictionary = {}; // empty object to store the dictionary
    
//     for (let i = 0; i < characters.length; i++) {
//       const char = characters[i];
//       const pinyinList = pinyin(char);
//       for (let j = 0; j < pinyinList.length; j++) {
//         const pinyinStr = pinyinList[j];
//         if (!dictionary[pinyinStr]) {
//           dictionary[pinyinStr] = [];
//         }
//         dictionary[pinyinStr].push(char);
//       }
//   }
    
  
//   const pinyinLetters = ['a', 'o', 'e', 'i', 'u', 'ü', 'b', 'p', 'm', 'f', 'd', 
//   't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'];
  
//   function gameLoop() {
//       moveSnake();
    
//       if (isOutOfBounds()) {
//         gameOver();
//         return;
//       }
    
//       checkFoodCollision();
//       checkSnakeCollision();
//       draw();
    
//       setTimeout(gameLoop, 100);
//   }  
  
//   function moveSnake() {
//       const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
//       snake.unshift(head);
      
//       if (growSnake) {
//         // Add a new segment to the snake and reset the growSnake flag
//         growSnake = false;
//       } else {
//         // Remove the last segment if the snake is not growing
//         snake.pop();
//       }
//     }
  
//   function isPositionValid(x, y) {
//       // Check if the position is occupied by the snake
//       for (let cell of snake) {
//         if (cell.x === x && cell.y === y) {
//           return false;
//         }
//       }
    
//       // Check if the position is occupied by other food items
//       for (let f of food) {
//         if (f.x === x && f.y === y) {
//           return false;
//         }
//       }
    
//       return true;
//   }
  
//   function generateValidFoodPosition() {
//       let x, y;
//       do {
//         x = Math.floor(Math.random() * tileCount);
//         y = Math.floor(Math.random() * tileCount);
//       } while (!isPositionValid(x, y));
    
//       return { x, y };
//   }
    
  
//   function randomizeFoodPosition() {
//       for (let i = 0; i < foodCount; i++) {
//         const position = generateValidFoodPosition();
//         const letter = pinyinLetters[Math.floor(Math.random() * pinyinLetters.length)];
//         food.push({ x: position.x, y: position.y, letter });
//       }
//   }
  
//   function checkFoodCollision() {
//       for (let i = 0; i < food.length; i++) {
//         if (snake[0].x === food[i].x && snake[0].y === food[i].y) {
//           // Add the eaten letter to eatenLetters and print it
//           const eatenLetter = food[i].letter;
//           eatenLetters.push(eatenLetter);
//           console.log('Eaten letter:', eatenLetter);
    
//           // Keep only the last two letters in eatenLetters
//           if (eatenLetters.length > 2) {
//             eatenLetters.shift();
//           }
  
//           // Check if the last two letters form a valid pinyin
//           const pinyin = eatenLetters.join('');
//           if (dictionary.hasOwnProperty(pinyin)) {
//             const chineseCharacters = dictionary[pinyin];
//             const randomIndex = Math.floor(Math.random() * chineseCharacters.length);
//             const chineseCharacter = chineseCharacters[randomIndex];
//             console.log(`Chinese character for pinyin '${pinyin}':`, chineseCharacter);
//           }
  
//           displayEatenLetters();
    
//           // Signal to grow the snake in the next iteration
//           growSnake = true;
    
//           // Replace the eaten food with a new one
//           const position = generateValidFoodPosition();
//           const letter = pinyinLetters[Math.floor(Math.random() * pinyinLetters.length)];
//           food[i] = { x: position.x, y: position.y, letter };
    
//           // Break the loop since we've found the food that the snake collided with
//           break;
//         }
//       }
//     }
  
//   function displayEatenLetters() {
//       const eatenLettersElement = document.getElementById('eaten-letters');
//       eatenLettersElement.innerHTML = '';
    
//       for (let i = 0; i < eatenLetters.length; i++) {
//         const letterElement = document.createElement('span');
//         letterElement.textContent = eatenLetters[i];
//         eatenLettersElement.appendChild(letterElement);
//       }
    
//       const pinyin = eatenLetters.join('');
//       const chineseCharacter = getPinyinToChineseCharacter(pinyin);
//       if (chineseCharacter) {
//         const chineseCharacterElement = document.createElement('span');
//         chineseCharacterElement.textContent = chineseCharacter;
//         eatenLettersElement.appendChild(chineseCharacterElement);
//       }
//     }
  
//   function isOutOfBounds() {
//       const head = snake[0];
//       return head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
//   }
  
//   function checkSnakeCollision() {
//     for (let i = 1; i < snake.length; i++) {
//       if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
//         snake = [{ x: 10, y: 10 }];
//         velocity = { x: 0, y: 0 };
//       }
//     }
//   }
  
//   function draw() {
//       context.fillStyle = 'papayawhip';
//       context.fillRect(0, 0, canvas.width, canvas.height);
    
//       context.fillStyle = 'yellowgreen';
//       for (let cell of snake) {
//         context.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize - 2, gridSize - 2);
//       }
    
//       context.fillStyle = 'orangered';
//       context.font = '16px sans-serif';
//       for (let f of food) {
//         // context.fillRect(f.x * gridSize, f.y * gridSize, gridSize - 2, gridSize - 2);
//         context.fillText(f.letter, f.x * gridSize + 4, f.y * gridSize + gridSize / 2 + 4);
//       }
//   }
    
  
//   function gameOver() {
//       // Clear the canvas
//       context.clearRect(0, 0, canvas.width, canvas.height);
    
//       // Display "Game Over" text
//       context.fillStyle = 'black';
//       context.font = '48px sans-serif';
//       context.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 50);
    
//       // Create and display the "Play Again" button
//       const button = document.createElement('button');
//       button.innerHTML = 'Play Again';
//       button.style.position = 'absolute';
//       button.style.left = (canvas.width / 2 - 50) + 'px';
//       button.style.top = (canvas.height / 2) + 'px';
//       document.body.appendChild(button);
    
//       // Restart the game when the button is clicked
//       button.addEventListener('click', () => {
//         document.body.removeChild(button);
//         restartGame();
//       });
//   }
  
//   function restartGame() {
//       snake = [{ x: 10, y: 10 }];
//       velocity = { x: 0, y: 0 };
//       growSnake = false;
//       food = [];
//       randomizeFoodPosition();
//       gameLoop();
//   }
    
  
//   document.addEventListener('keydown', (event) => {
//     switch (event.key) {
//       case 'ArrowUp':
//         if (velocity.y === 0) velocity = { x: 0, y: -1 };
//         break;
//       case 'ArrowDown':
//         if (velocity.y === 0) velocity = { x: 0, y: 1 };
//         break;
//       case 'ArrowLeft':
//         if (velocity.x === 0) velocity = { x: -1, y: 0 };
//         break;
//       case 'ArrowRight':
//         if (velocity.x === 0) velocity = { x: 1, y: 0 };
//         break;
//     }
//   });
  
  
//   displayEatenLetters();
  
//   randomizeFoodPosition(); // Initialize food positions
//   gameLoop(); // Start the game loop


















// const canvas = document.getElementById('game-board');
// const context = canvas.getContext('2d');

// const gridSize = 20;
// const tileCount = canvas.width / gridSize;

// const foodCount = 3; // Number of food items you want on the board
// let snake = [{ x: 10, y: 10 }];
// let velocity = { x: 0, y: 0 };
// let food = [];
// let growSnake = false;
// let eatenLetters = [];

// const pinyinLetters = ['a', 'o', 'e', 'i', 'u', 'ü', 'b', 'p', 'm', 
// 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 
// 'r', 'z', 'c', 's', 'y', 'w'];

// function gameLoop() {
//     moveSnake();
  
//     if (isOutOfBounds()) {
//       gameOver();
//       return;
//     }
  
//     checkFoodCollision();
//     checkSnakeCollision();
//     draw();
  
//     setTimeout(gameLoop, 100);
// }  

// function moveSnake() {
//     const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
//     snake.unshift(head);
    
//     if (growSnake) {
//       // Add a new segment to the snake and reset the growSnake flag
//       growSnake = false;
//     } else {
//       // Remove the last segment if the snake is not growing
//       snake.pop();
//     }
//   }

// function isPositionValid(x, y) {
//     // Check if the position is occupied by the snake
//     for (let cell of snake) {
//       if (cell.x === x && cell.y === y) {
//         return false;
//       }
//     }
  
//     // Check if the position is occupied by other food items
//     for (let f of food) {
//       if (f.x === x && f.y === y) {
//         return false;
//       }
//     }
  
//     return true;
// }

// function generateValidFoodPosition() {
//     let x, y;
//     do {
//       x = Math.floor(Math.random() * tileCount);
//       y = Math.floor(Math.random() * tileCount);
//     } while (!isPositionValid(x, y));
  
//     return { x, y };
// }
  

// function randomizeFoodPosition() {
//     for (let i = 0; i < foodCount; i++) {
//         const position = generateValidFoodPosition();
//         const letter = pinyinLetters[Math.floor(Math.random() * pinyinLetters.length)];
//         food.push({ x: position.x, y: position.y, letter });
//       }
// }

// function checkFoodCollision() {
//     for (let i = 0; i < food.length; i++) {
//         if (snake[0].x === food[i].x && snake[0].y === food[i].y) {
//             // Signal to grow the snake in the next iteration
//             const eatenLetter = food[i].letter;
//             eatenLetters.push(eatenLetter);
//             console.log('Eaten letter:', eatenLetter);

//             if (eatenLetters.length > 2) {
//                 eatenLetters.shift();
//             }

//             const pinyin = eatenLetters.join('');
//             const chineseCharacter = getPinyinToChineseCharacter(pinyin);
//             console.log(`Chinese character for pinyin '${pinyin}':`, chineseCharacter);

//             growSnake = true;
        
//             // Replace all food items with new ones
//             for (let j = 0; j < food.length; j++) {
//                 const position = generateValidFoodPosition();
//                 const letter = pinyinLetters[Math.floor(Math.random() * pinyinLetters.length)];
//                 food[j] = { x: position.x, y: position.y, letter };
//             }
//         }
//     }
// }

// function getPinyinToChineseCharacter(pinyin) {
//     if (dictionary.hasOwnProperty(pinyin)) {
//         const chineseCharacters = dictionary[pinyin];
//         const randomIndex = Math.floor(Math.random() * chineseCharacters.length);
//         const chineseCharacter = chineseCharacters[randomIndex];
//     }
//     return chineseCharacter;
// }

// function isOutOfBounds() {
//     const head = snake[0];
//     return head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
// }

// function checkSnakeCollision() {
//   for (let i = 1; i < snake.length; i++) {
//     if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
//       snake = [{ x: 10, y: 10 }];
//       velocity = { x: 0, y: 0 };
//     }
//   }
// }

// function draw() {
//     context.fillStyle = 'papayawhip';
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     context.fillStyle = 'lime';
//     for (let cell of snake) {
//       context.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize - 2, gridSize - 2);
//     }
  
//     context.fillStyle = 'transparent';
//     context.font = '16px sans-serif';
//     for (let f of food) {
//       context.fillRect(f.x * gridSize, f.y * gridSize, gridSize - 2, gridSize - 2);
//       context.fillStyle = 'darkslategray';
//       context.fillText(f.letter, f.x * gridSize + 4, f.y * gridSize + gridSize / 2 + 4);
//       context.fillStyle = 'transparent';
//     }
// }

// function gameOver() {
//     // Clear the canvas
//     context.clearRect(0, 0, canvas.width, canvas.height);
  
//     // Display "Game Over" text
//     context.fillStyle = 'black';
//     context.font = '48px sans-serif';
//     context.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 50);
  
//     // Create and display the "Play Again" button
//     const button = document.createElement('button');
//     button.innerHTML = 'Play Again';
//     button.style.position = 'absolute';
//     button.style.left = (canvas.width / 2 - 50) + 'px';
//     button.style.top = (canvas.height / 2) + 'px';
//     document.body.appendChild(button);
  
//     // Restart the game when the button is clicked
//     button.addEventListener('click', () => {
//       document.body.removeChild(button);
//       restartGame();
//     });
// }

// function restartGame() {
//     snake = [{ x: 10, y: 10 }];
//     velocity = { x: 0, y: 0 };
//     growSnake = false;
//     food = [];
//     randomizeFoodPosition();
//     gameLoop();
// }
  

// document.addEventListener('keydown', (event) => {
//   switch (event.key) {
//     case 'ArrowUp':
//       if (velocity.y === 0) velocity = { x: 0, y: -1 };
//       break;
//     case 'ArrowDown':
//       if (velocity.y === 0) velocity = { x: 0, y: 1 };
//       break;
//     case 'ArrowLeft':
//       if (velocity.x === 0) velocity = { x: -1, y: 0 };
//       break;
//     case 'ArrowRight':
//       if (velocity.x === 0) velocity = { x: 1, y: 0 };
//       break;
//   }
// });

// randomizeFoodPosition(); // Initialize food positions
// gameLoop(); // Start the game loop