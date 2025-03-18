// DOM elements
const wordElement = document.getElementById('word');
const answerInput = document.getElementById('answer');
const output = document.getElementById('output');
const feedbackModal = document.getElementById('feedback-modal');

// Counters for correct and wrong answers
let correctCount = 0;
let wrongCount = 0;

// Word list (loaded from words.json)
let wordList = {};

// Function to load words from words.json
async function loadWords() {
  try {
    const response = await fetch('words.json');
    wordList = await response.json();
    startGame(); // Start the game after loading words
  } catch (error) {
    console.error('Failed to load words:', error);
    output.innerHTML = `<p class="wrong">Ошибка загрузки слов. Пожалуйста, перезагрузите страницу.</p>`;
  }
}

// Function to get a random word from the word list
function getRandomWord() {
  const russianWords = Object.keys(wordList);
  const randomWord = russianWords[Math.floor(Math.random() * russianWords.length)];
  return randomWord;
}

// Function to compare user's answer with the correct answer and highlight differences
function getDiff(userAnswer, correctAnswer) {
  let diff = '';
  for (let i = 0; i < Math.max(userAnswer.length, correctAnswer.length); i++) {
    const userChar = userAnswer[i] || '';
    const correctChar = correctAnswer[i] || '';
    if (userChar === correctChar) {
      diff += `<span class="correct">${userChar}</span>`;
    } else {
      diff += `<span class="incorrect">${userChar || ' '}</span>`;
    }
  }
  return diff;
}

// Set the first random word
let currentWord;

// Function to start the game
function startGame() {
  currentWord = getRandomWord();
  wordElement.innerText = currentWord;
  answerInput.focus(); // Focus on the input field
}

// Function to check the user's answer
function checkAnswer() {
  const russianWord = currentWord;
  const correctAnswer = wordList[russianWord];
  const userAnswer = answerInput.value.trim();

  if (userAnswer === correctAnswer) {
    correctCount++;
    output.innerHTML = `<p class="correct">✅ Правильно! "${russianWord}" = "${correctAnswer}"</p>`;
  } else {
    wrongCount++;
    const diff = getDiff(userAnswer, correctAnswer);
    output.innerHTML = `
      <p class="wrong">❌ Неправильно. "${russianWord}" = "${correctAnswer}"</p>
      <p>Ваш ответ: <span class="diff">${diff}</span></p>
    `;
  }

  // Update the score
  output.innerHTML += `<p>Текущий счёт: ✅ ${correctCount} | ❌ ${wrongCount}</p>`;

  // Clear the input field
  answerInput.value = '';

  // Get a new random word
  currentWord = getRandomWord();
  wordElement.innerText = currentWord;

  // Focus on the input field for the next answer
  answerInput.focus();
}

// Handle Enter key press
answerInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') { // Check if Enter was pressed
    checkAnswer(); // Call the answer checking function
  }
});

// Open feedback modal
function openFeedbackModal() {
  feedbackModal.style.display = 'block';
}

// Close feedback modal
function closeFeedbackModal() {
  feedbackModal.style.display = 'none';
}

// Close modal if clicked outside of it
window.onclick = function(event) {
  if (event.target === feedbackModal) {
    closeFeedbackModal();
  }
};

// Load words and start the game
loadWords();