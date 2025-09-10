let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedSection = "";

async function loadQuestions() {
  const urlParams = new URLSearchParams(window.location.search);
  selectedSection = urlParams.get("section") || "grund";

  const res = await fetch("questions.json");
  const allQuestions = await res.json();

  questions = shuffle(allQuestions[selectedSection]);
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }

  const q = questions[currentQuestionIndex];
  document.getElementById("question").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    const button = document.createElement("button");
    button.innerText = opt.text;
    button.classList.add("option");
    button.addEventListener("click", () =>
      selectAnswer(button, opt.correct, q.feedbackCorrect, q.feedbackWrong)
    );
    optionsDiv.appendChild(button);
  });

  document.getElementById("feedback").innerText = "";
  document.getElementById("next-btn").disabled = true;
}

function selectAnswer(button, correct, feedbackCorrect, feedbackWrong) {
  const options = document.querySelectorAll(".option");
  options.forEach(b => (b.disabled = true));

  if (correct) {
    button.classList.add("correct");
    score++;
    document.getElementById("feedback").innerText = feedbackCorrect;
  } else {
    button.classList.add("wrong");
    document.getElementById("feedback").innerText = feedbackWrong;
  }

  document.getElementById("next-btn").disabled = false;
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestionIndex++;
  showQuestion();
});

document.getElementById("end-btn").addEventListener("click", () => {
  endQuiz();
});

function endQuiz() {
  localStorage.setItem("score", score);
  localStorage.setItem(
    "total",
    currentQuestionIndex > 0 ? currentQuestionIndex : questions.length
  );
  window.location.href = "results.html";
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

if (window.location.pathname.includes("quiz.html")) {
  loadQuestions();
}
