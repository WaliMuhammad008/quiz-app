const questions = [
    {
        question: "What is the output of `typeof null` in JavaScript?",
        answers: [
            { text: '"undefined"', correct: false },
            { text: '"null"', correct: false },
            { text: '"object"', correct: true },
            { text: '"string"', correct: false },
        ]
    },
    {
        question: "Which of the following creates a closure in JavaScript?",
        answers: [
            { text: "A function accessing variables outside its scope", correct: true },
            { text: "An object with private properties", correct: false },
            { text: "Using the `const` keyword", correct: false },
            { text: "An immediately invoked function expression (IIFE)", correct: false },
        ]
    },
    {
        question: "What does CSS Grid's `1fr` stand for?",
        answers: [
            { text: "1 fixed row", correct: false },
            { text: "1 flexible ratio", correct: false },
            { text: "1 frame rate", correct: false },
            { text: "1 fraction of available space", correct: true },
        ]
    },
    {
        question: "In React, what hook is used to perform side effects?",
        answers: [
            { text: "useState", correct: false },
            { text: "useEffect", correct: true },
            { text: "useContext", correct: false },
            { text: "useReducer", correct: false },
        ]
    },
    {
        question: "What is the time complexity of binary search?",
        answers: [
            { text: "O(n)", correct: false },
            { text: "O(n log n)", correct: false },
            { text: "O(log n)", correct: true },
            { text: "O(1)", correct: false },
        ]
    }
];

// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const timeDisplay = document.getElementById("time-left");
const progressBar = document.getElementById("progress-bar");
const currentQNum = document.getElementById("current-q-num");
const totalQNum = document.getElementById("total-q-num");
const scoreText = document.getElementById("score-text");
const scoreCircle = document.querySelector(".score-circle");
const feedbackText = document.getElementById("feedback-text");
const restartBtn = document.getElementById("restart-btn");
const highScoreDisplay = document.getElementById("high-score-display");

// Variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;

// Initialize App
totalQNum.innerText = questions.length;
loadHighScore();

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});
restartBtn.addEventListener("click", resetApp);

function startQuiz() {
    startScreen.classList.remove("active");
    startScreen.classList.add("hide");
    quizScreen.classList.remove("hide");
    quizScreen.classList.add("active");
    
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    resetState();
    startTimer();
    
    let currentQuestion = questions[currentQuestionIndex];
    currentQNum.innerText = currentQuestionIndex + 1;
    questionElement.innerHTML = currentQuestion.question;
    
    // Update Progress Bar
    const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn", "answer-btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });
}

function resetState() {
    clearInterval(timerInterval);
    nextBtn.classList.add("hide");
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function startTimer() {
    timeLeft = 15;
    timeDisplay.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    const buttons = Array.from(answerButtons.children);
    buttons.forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextBtn.classList.remove("hide");
}

function selectAnswer(e) {
    clearInterval(timerInterval); // Stop timer on selection
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    // Disable all and show correct
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextBtn.classList.remove("hide");
}

function showResult() {
    quizScreen.classList.remove("active");
    quizScreen.classList.add("hide");
    resultScreen.classList.remove("hide");
    resultScreen.classList.add("active");

    progressBar.style.width = '100%';
    scoreText.innerText = `${score}/${questions.length}`;
    
    // Animate circular progress
    const percentage = Math.round((score / questions.length) * 360);
    scoreCircle.style.background = `conic-gradient(var(--primary-color) ${percentage}deg, #334155 0deg)`;

    // Feedback
    if (score === questions.length) {
        feedbackText.innerText = "Perfect! You're a Pro! 🏆";
        triggerConfetti();
    } else if (score >= questions.length / 2) {
        feedbackText.innerText = "Good Job! Keep practicing. 👍";
    } else {
        feedbackText.innerText = "Needs Improvement! Try Again. 💪";
    }

    updateHighScore();
}

function triggerConfetti() {
    if(typeof confetti !== "undefined") {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function updateHighScore() {
    let highScore = localStorage.getItem("proQuizHighScore") || 0;
    if (score > highScore) {
        localStorage.setItem("proQuizHighScore", score);
        highScoreDisplay.innerText = score;
    }
}

function loadHighScore() {
    let highScore = localStorage.getItem("proQuizHighScore") || 0;
    highScoreDisplay.innerText = highScore;
}

function resetApp() {
    resultScreen.classList.remove("active");
    resultScreen.classList.add("hide");
    startScreen.classList.remove("hide");
    startScreen.classList.add("active");
}