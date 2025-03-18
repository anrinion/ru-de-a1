// DOM elements
const wordElement = document.getElementById('word');
const answerInput = document.getElementById('answer');
const output = document.getElementById('output');
const feedbackModal = document.getElementById('feedback-modal');

// Counters for correct and wrong answers
let correctCount = 0;
let wrongCount = 0;

// Word list (loaded from words.json)
let wordList = [];

// Function to load words from words.json
async function loadWords() {
  try {
    const response = await fetch('words.json');
    const data = await response.json();
    wordList = data.words;
    nextWord();
  } catch (error) {
    console.error('Failed to load words:', error);
    output.innerHTML = `<p class="wrong">Ошибка загрузки слов. Пожалуйста, перезагрузите страницу.</p>`;
  }
}

// Function to get a random word entry
function getRandomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
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

// Current word state
let currentEntry;

function nextWord() {
  currentEntry = getRandomWord();
  wordElement.innerHTML = `<p><b>${currentEntry.russianWord}</b><br><small>${currentEntry.russianExample}</small></p>`;
  answerInput.value = '';
  answerInput.focus();
}

// Function to check the user's answer
function checkAnswer() {
  output.innerHTML = `<hr><i>${wordElement.innerHTML}</i>`;
  wordElement.innerHTML = ``;

  const userAnswer = answerInput.value.trim();
  const correctAnswer = currentEntry.germanWord;
  const diff = getDiff(userAnswer, correctAnswer);

  output.innerHTML += `<p>Ваш ответ: <span class="diff">${diff}</span><p>`;

  if (userAnswer === correctAnswer) {
    correctCount++;
    output.innerHTML += `<p class="correct">✅ Правильно!</p>`;
  } else {
    wrongCount++;
    output.innerHTML += `<p class="wrong">❌ Неправильно</p>`;
  }

  output.innerHTML += `<p><b>${currentEntry.germanWord}</b><br><small>${currentEntry.germanExample}</small></p>`;

  output.innerHTML +=
    `<a id="leo-link" href="https://dict.leo.org/russisch-deutsch/${encodeURIComponent(correctAnswer)}" target="_blank" class="leo-button">Открыть в словаре</a>`;

  // Update the score
  output.innerHTML += `<p>Текущий счёт: ✅ ${correctCount} | ❌ ${wrongCount}</p>`;

  nextWord();
}

// Handle Enter key press
answerInput.addEventListener('keydown', function (event) {
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
window.onclick = function (event) {
  if (event.target === feedbackModal) {
    closeFeedbackModal();
  }
};

// Load words and start the game
loadWords();