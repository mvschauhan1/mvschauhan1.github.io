

const playerNames = document.querySelector('#player_names');
const startGame = document.querySelector('#startgame');
const resetGame = document.querySelector('#resetgame');
const btns = document.querySelectorAll('.btns');
const result = document.querySelector('#result');
const scoreBoard = document.querySelector('#score_board');
const guestName = document.querySelector('#guestname');
const namebtn = document.querySelector('#submit_name_btn');
const humanEmoji = document.getElementById('human_emoji');
const computerEmoji = document.getElementById('computer_emoji');
const youRole = document.getElementById('you_role');
const computerRole = document.getElementById('computer_role');
const nameForm = document.getElementById('name_form');
const smallHead = document.getElementById('smallhead');
const emojiDisplay = document.getElementById('emoji_display');
const themeSelect = document.getElementById('themeSelect');
  themeSelect.addEventListener('change', () => {
    document.body.className = 'theme-' + themeSelect.value;
  });
let playerOne;
let playerTwo;
let pOneScoreCount = 0;
let pTwoScoreCount = 0;
let playerOneInput;
let playerTwoInput;
let pName = '';

let isGameActive = false;
let isFirstInning = true;

const displayPanel = document.getElementById('display_panel');
function fixDisplayPanelHeight() {
  displayPanel.style.height = displayPanel.offsetHeight + 'px';
  displayPanel.style.overflowY = 'auto'; 
}
function resetDisplayPanelHeight() {
  displayPanel.style.height = '';        // remove fixed height
  displayPanel.style.overflowY = '';     // restore any default or CSS value
}
const random = () => Math.floor(Math.random() * 6 + 1);

namebtn.addEventListener('click', (e) => {
  e.preventDefault();
  pName = guestName.value.trim();
  if (pName) {
    startGame.disabled = false;
    playerNames.textContent = `Hello ${pName}!\nPlease press 'Start Game' to play`;
  } else {
    alert('Please enter your name!');
    startGame.disabled = true;
  }
  nameForm.style.display = 'none';
  smallHead.style.display = 'none';
  emojiDisplay.style.display = 'flex';
});

const startGameAction = () => {
  if (!pName) {
    alert('Please enter your name first!');
    return;
  }
  startGame.disabled = true;
  resetGame.disabled = false;
  btns.forEach(b => b.disabled = false);

  isGameActive = true;
  isFirstInning = true;
  pOneScoreCount = 0;
  pTwoScoreCount = 0;
  result.textContent = '';
  scoreBoard.textContent = '';

  const tossResult = Math.random();
  if (tossResult > 0.5) {
    playerOne = pName;
    playerTwo = 'Computer';
  } else {
    playerOne = 'Computer';
    playerTwo = pName;
  }
  playerNames.textContent = `${playerOne} won the toss and will bat first.`;
  humanEmoji.textContent = '';
  computerEmoji.textContent = '';
  fixDisplayPanelHeight()
};

function getHandEmoji(num) {
    const handMap = {
      1: '☝️',
      2: '✌️',
      3: '☝️☝️☝️',
      4: '✌️✌️',
      5: '🖐️',
      6: '👍'
    };
    return handMap[num] || '';
  }

const resetGameAction = () => {
  isGameActive = false;
  isFirstInning = true;
  pOneScoreCount = 0;
  pTwoScoreCount = 0;
  playerOneInput = undefined;
  playerTwoInput = undefined;
  playerNames.textContent = '';
  result.textContent = '';
  scoreBoard.textContent = '';
  startGame.disabled = pName === '';
  resetGame.disabled = true;
  btns.forEach(b => b.disabled = true);
  nameForm.style.display = 'block';
  smallHead.style.display = 'block';
  humanEmoji.textContent = '';
  computerEmoji.textContent = '';
  youRole.textContent = '';
  computerRole.textContent = '';
  humanEmoji.classList.remove('animate');
  computerEmoji.classList.remove('animate');
  resetDisplayPanelHeight();
};

btns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    let battingInput, bowlingInput;
    if (!isGameActive) return;
    if (isFirstInning) {
      if (playerOne === pName) {
        battingInput = Number(event.target.value);  
        bowlingInput = random();                   
      } else {
        battingInput = random();                    
        bowlingInput = Number(event.target.value);  
      }
      playerOneInput = battingInput;
      playerTwoInput = bowlingInput;
    } else {
      if (playerTwo === pName) {
        battingInput = Number(event.target.value);  
        bowlingInput = random();                    
      } else {
        battingInput = random();                    
        bowlingInput = Number(event.target.value); 
      }
      playerTwoInput = battingInput;
      playerOneInput = bowlingInput;
    }
    
    const isHumanBattingNow = (
      (isFirstInning && playerOne === pName) ||
      (!isFirstInning && playerTwo === pName)
    );
    youRole.textContent = isHumanBattingNow ? '(Batsman)' : '(Bowler)';
    computerRole.textContent = isHumanBattingNow ? '(Bowler)' : '(Batsman)';

    humanEmoji.textContent = getHandEmoji(isHumanBattingNow ? battingInput : bowlingInput);
    computerEmoji.textContent = getHandEmoji(isHumanBattingNow ? bowlingInput : battingInput);

    [humanEmoji, computerEmoji].forEach(el => {
        el.classList.remove('animate');
        void el.offsetWidth;
        el.classList.add('animate');
    });

    if (isFirstInning) {
      playerNames.textContent = `Now: ${playerOne} batting`;
      if (playerOneInput === playerTwoInput) {
        result.textContent = `OUT! Final Score: ${pOneScoreCount}`;
        isFirstInning = false;
        playerNames.textContent = `Now: ${playerTwo} batting`;
        scoreBoard.textContent = pOneScoreCount;
      } else {
        pOneScoreCount += playerOneInput;
        result.textContent = `Batsman's Score: ${playerOneInput}, Bowler guessed ${playerTwoInput}. Score: ${pOneScoreCount}`;
        scoreBoard.textContent = pOneScoreCount;
      }
    } else {
      if (playerTwoInput === playerOneInput) {
        if (pTwoScoreCount > pOneScoreCount) {
          result.textContent = `${playerTwo} guessed ${playerTwoInput}. They win by ${pTwoScoreCount - pOneScoreCount} runs!`;
          playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
        } else if (pTwoScoreCount === pOneScoreCount) {
          result.textContent = `It's a tie!`;
          playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
        } else {
          result.textContent = `${playerOne} guessed ${playerOneInput}. They win by ${pOneScoreCount - pTwoScoreCount} runs!`;
          playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
        }
        isGameActive = false;
        btns.forEach(b => b.disabled = true);
      } else {
        pTwoScoreCount += playerTwoInput;
        result.textContent = `${playerTwo}: ${playerTwoInput}, ${playerOne} guessed ${playerOneInput}. Score: ${pTwoScoreCount}`;
        scoreBoard.textContent = ` Current: ${pTwoScoreCount} | Target: ${pOneScoreCount}`;

        if (pTwoScoreCount > pOneScoreCount) {
            result.textContent = `${playerTwo} wins! Final Score: ${pTwoScoreCount} to ${pOneScoreCount}`;
            playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
            isGameActive = false;
            btns.forEach(b => b.disabled = true);
            return;
        }
        if (playerTwoInput === playerOneInput) {
            if (pTwoScoreCount > pOneScoreCount) {
              result.textContent = `${playerTwo} wins by ${pTwoScoreCount - pOneScoreCount} runs!`;
            } else if (pTwoScoreCount === pOneScoreCount) {
              result.textContent = `It's a tie!`;
            } else {
              result.textContent = `${playerOne} wins by ${pOneScoreCount - pTwoScoreCount} runs!`;
            }
            playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
            isGameActive = false;
            btns.forEach(b => b.disabled = true);
        }
      }
    }
  });
});

// btns.forEach((btn) => {
//   btn.addEventListener('click', (event) => {
//     let battingInput, bowlingInput;
//     if (!isGameActive) return;

//     if (isFirstInning) {
//       if (playerOne === pName) {
//         battingInput = Number(event.target.value);  
//         bowlingInput = random();                   
//       } else {
//         battingInput = random();                    
//         bowlingInput = Number(event.target.value);  
//       }
//       playerOneInput = battingInput;
//       playerTwoInput = bowlingInput;
//     } else {
//       if (playerTwo === pName) {
//         battingInput = Number(event.target.value);  
//         bowlingInput = random();                    
//       } else {
//         battingInput = random();                    
//         bowlingInput = Number(event.target.value); 
//       }
//       playerTwoInput = battingInput;
//       playerOneInput = bowlingInput;
//     }
    
//     const isHumanBattingNow = (playerOne === pName && isFirstInning) || (playerTwo === pName && !isFirstInning);

// // Determine humanInput and computerInput explicitly:
//     let humanInput, computerInput;

//     if (isHumanBattingNow) {
//         humanInput = battingInput;   // human is batting
//         computerInput = bowlingInput; // computer is bowling
//     } else {
//         humanInput = bowlingInput;   // human is bowling
//         computerInput = battingInput; // computer is batting
//     }

// youRole.textContent = isHumanBattingNow ? '(Batsman)' : '(Bowler)';
// computerRole.textContent = isHumanBattingNow ? '(Bowler)' : '(Batsman)';

// humanEmoji.textContent = getHandEmoji(humanInput);
// computerEmoji.textContent = getHandEmoji(computerInput);


//     [humanEmoji, computerEmoji].forEach(el => {
//         el.classList.remove('animate');
//         void el.offsetWidth;
//         el.classList.add('animate');
//     });


//     if (isFirstInning) {
//       playerNames.textContent = `Now: ${playerOne} batting`;
//       if (playerOneInput === playerTwoInput) {
//         result.textContent = `OUT! Final Score: ${pOneScoreCount}`;
//         isFirstInning = false;
//         playerNames.textContent = `Now: ${playerTwo} batting`;
//         scoreBoard.textContent = pOneScoreCount;
//       } else {
//         pOneScoreCount += playerOneInput;
//         result.textContent = `Batsman's Score: ${playerOneInput}, Bowler guessed ${playerTwoInput}. Score: ${pOneScoreCount}`;
//         scoreBoard.textContent = pOneScoreCount;
//       }
//     } else {
//       const battingInput = (playerTwo === pName) ? Number(event.target.value) : random();
//       const bowlingInput = (playerTwo === pName) ? random() : Number(event.target.value);

//       if (battingInput === bowlingInput) {
//         if (pTwoScoreCount > pOneScoreCount) {
//           result.textContent = `${playerTwo} guessed ${playerTwoInput}. They win by ${pTwoScoreCount - pOneScoreCount} runs!`;
//           playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
//           playerEmoji.textContent = '';
//         } else if (pTwoScoreCount === pOneScoreCount) {
//           result.textContent = `It's a tie!`;
//           playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
//           playerEmoji.textContent = '';
//         } else {
//           result.textContent = `${playerOne} guessed ${playerOneInput}. They win by ${pOneScoreCount - pTwoScoreCount} runs!`;
//           playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
//           playerEmoji.textContent = '';
//         }
//         isGameActive = false;
//         btns.forEach(b => b.disabled = true);
//       } else {
//         pTwoScoreCount += battingInput;
//         result.textContent = `${playerTwo}: ${battingInput}, ${playerOne} guessed ${bowlingInput}. Score: ${pTwoScoreCount}`;
//         scoreBoard.textContent = ` Current: ${pTwoScoreCount} | Target: ${pOneScoreCount}`;

//         if (pTwoScoreCount > pOneScoreCount) {
//             result.textContent = `${playerTwo} wins! Final Score: ${pTwoScoreCount} to ${pOneScoreCount}`;
//             playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
//             isGameActive = false;
//             btns.forEach(b => b.disabled = true);
//             return;
//         }
//         if (battingInput === bowlingInput) {
//             if (pTwoScoreCount > pOneScoreCount) {
//               result.textContent = `${playerTwo} wins by ${pTwoScoreCount - pOneScoreCount} runs!`;
//             } else if (pTwoScoreCount === pOneScoreCount) {
//               result.textContent = `It's a tie!`;
//             } else {
//               result.textContent = `${playerOne} wins by ${pOneScoreCount - pTwoScoreCount} runs!`;
//             }
//             playerNames.textContent = `${pName} press 'Reset Game' to play again!`;
//             isGameActive = false;
//             btns.forEach(b => b.disabled = true);
//         }
//       }
//     }
//   });
// });

startGame.addEventListener('click', startGameAction);
resetGame.addEventListener('click', resetGameAction);

btns.forEach(b => b.disabled = true);
startGame.disabled = true;
resetGame.disabled = true;
