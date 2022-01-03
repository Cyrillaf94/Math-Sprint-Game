// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoresArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

let valueY = 0;
let time = 0;

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';


// Check Local storage for Best Scores, set BestScoresArray
function getSavedBestScores() {
// Check if array exists, if not create it 
  if(localStorage.getItem('bestScores')) {
    bestScoresArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoresArray = [
      {questions: 10, bestScore : finalTimeDisplay},
      {questions: 25, bestScore : finalTimeDisplay},
      {questions: 50, bestScore : finalTimeDisplay},
      {questions: 99, bestScore : finalTimeDisplay}
    ]
  }
  // Select last score to update
  bestScoresArray.forEach((score) => {
  if(score.questions == questionAmount && (score.bestScore == 0 || score.bestScore > baseTime)) {
    score.bestScore = baseTime;
  }})
  // Update DOM
  for (let i=0; i<4; i++) {
    bestScores[i].textContent = `${bestScoresArray[i].bestScore}s`; // Dryer than correction?
  }
  // Add  to localStorage 
  localStorage.setItem('bestScores',JSON.stringify(bestScoresArray))
}


// Reset Game
function playAgain() {
  scorePage.hidden = true
  splashPage.hidden = false
  playAgainBtn.hidden = true
}

// Calculate and Show Score
function loadScore() {
  equationsArray.forEach((equation, index) => {
    // Increase Penalty time for each mistake
    if(!equation.evaluated === playerGuessArray[index]) {
     penaltyTime += 1;}})
     // update DOM
     finalTime = timePlayed + penaltyTime
     baseTime = finalTime.toFixed(1)
     console.log(timePlayed, penaltyTime, baseTime); 
     finalTimeEl.textContent = `${baseTime} sec`;
     baseTimeEl.textContent = `Base Time: ${timePlayed.toFixed(1)}sec`;
     penaltyTimeEl.textContent = `Penalty: +${penaltyTime.toFixed(1)}sec`;
      itemContainer.scrollTo({top: 0, behavior: 'smooth'});    
     gamePage.hidden = true
     scorePage.hidden = false
     setTimeout(() => {
    playAgainBtn.hidden = false;
    }, 1000)
    getSavedBestScores();
    }
  

function handler() {
  if (playerGuessArray.length == questionAmount) {
    timePlayed += 0.1;
    clearInterval(timer);
    loadScore();
  } else {
    timePlayed += 0.1;
  }
}

// Start Timer when Gamne page is clicked
function startTimer() {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(handler, 100)
}

// Store Player Values
function storePlayerValues(e) {
  playerGuessArray.push(e);
  valueY = playerGuessArray.length * 80;
  itemContainer.scroll(0, valueY);
}

// Get random integer
function getRandomInt(max) {
  return Math.ceil(Math.random() * max);
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: true };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3) - 1;
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: false };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

function equationsToDOM() {
  equationsArray.forEach((equation) => {
    const item = document.createElement('div');
    item.classList.add('item');
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);
  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Hide Countdown SHow Game
function gameStart() {
  countdownPage.hidden = true;
  gamePage.hidden = false;
  startTimer();
}

// Display 3,2,1, Go!
function countDownStart() {
  let timeLeft = 3;
  countdown.textContent = timeLeft;
  let updateCountDown = setInterval(frame, 1000);
  function frame() {
    if (timeLeft === 1) {
      clearInterval(updateCountDown);
      countdown.textContent = "GO!";
      setTimeout(gameStart, 300);
    } else {
      timeLeft--;
      countdown.textContent = timeLeft;
    }
  }
}

// Show Countdown
function showCountDown() {
  console.log(questionAmount);
  if (!(questionAmount === 0)) {
    countdownPage.hidden = false;
    splashPage.hidden = true;
    countDownStart();
  }
  else alert("Please select the number of questions");
}

// Get Radio Value
function getRadioValue() {
  let radioValue = 0;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  }); return radioValue;
}

// Select Question Amount
function selectQuestionAmount(e) {
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  e.preventDefault();
  questionAmount = getRadioValue();
  showCountDown();
  populateGamePage();
};


// EventListeners

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Styling
    radioEl.classList.remove('selected-label');
    // Add on radio input checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label')
    }
  })
});

startForm.addEventListener('submit', selectQuestionAmount);


getSavedBestScores();