import React, { useState, useEffect, useCallback } from "react";
// import "./quiz.css";

/* ── Mock data matching Quiz + Question entities ── */
const MOCK_QUIZ = {
  id: 1,
  title: "React Fundamentals — Chapter 3",
  timeLimit: 10, // minutes
  totalQuestions: 6,
  passingScore: 70.0,
  published: true,
  lesson: { id: 3, title: "Hooks Deep Dive" },
  questions: [
    {
      id: 1,
      text: "Which hook is used to manage local component state in React?",
      type: "MCQ",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      correctAnswer: "useState",
    },
    {
      id: 2,
      text: "What does the dependency array in useEffect control?",
      type: "MCQ",
      options: [
        "The number of renders",
        "When the effect re-runs",
        "The component's initial state",
        "The render order of children",
      ],
      correctAnswer: "When the effect re-runs",
    },
    {
      id: 3,
      text: "React components must return a single root element.",
      type: "TRUE_FALSE",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      id: 4,
      text: "Which of the following is the correct way to update state based on the previous value?",
      type: "MCQ",
      options: [
        "setState(state + 1)",
        "setState(prev => prev + 1)",
        "state = state + 1",
        "updateState(state++)",
      ],
      correctAnswer: "setState(prev => prev + 1)",
    },
    {
      id: 5,
      text: "useContext replaces the need for all state management in React.",
      type: "TRUE_FALSE",
      options: ["True", "False"],
      correctAnswer: "False",
    },
    {
      id: 6,
      text: "Which method is used to prevent a child component from re-rendering unnecessarily?",
      type: "MCQ",
      options: ["React.memo", "React.lazy", "React.clone", "React.pure"],
      correctAnswer: "React.memo",
    },
  ],
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Quiz({ onSubmit }) {
  const quiz = MOCK_QUIZ;
  const total = quiz.questions.length;
  const totalSeconds = quiz.timeLimit * 60;

  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState({});
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged]   = useState(new Set());

  /* ── Timer ── */
  useEffect(() => {
    if (submitted) return;
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    /* Calculate score and pass to parent / navigate */
    const correct = quiz.questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correct / total) * 100);
    onSubmit?.({ answers, score, correct, total, timeTaken: totalSeconds - timeLeft });
    /* For demo purposes we store in sessionStorage so QuizResult can read it */
    sessionStorage.setItem(
      "lms_quiz_result",
      JSON.stringify({
        quizTitle: quiz.title,
        passingScore: quiz.passingScore,
        answers,
        score,
        correct,
        total,
        timeTaken: totalSeconds - timeLeft,
        questions: quiz.questions,
      })
    );
    window.location.href = "/student/results";
  }, [answers, timeLeft]);

  const q = quiz.questions[current];
  const answered = Object.keys(answers).length;
  const progress = (current / total) * 100;
  const timerWarning = timeLeft <= 60;

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(q.id) ? next.delete(q.id) : next.add(q.id);
      return next;
    });
  };

  return (
    <div className="quiz-page">
      {/* ── Top bar ── */}
      <div className="quiz-topbar">
        <div className="quiz-topbar__info">
          <span className="quiz-topbar__lesson">{quiz.lesson.title}</span>
          <h1 className="quiz-topbar__title">{quiz.title}</h1>
        </div>
        <div className={`quiz-timer${timerWarning ? " quiz-timer--warn" : ""}`}>
          <span className="quiz-timer__icon">{timerWarning ? "⚠" : "⏱"}</span>
          <span className="quiz-timer__value">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-body">
        {/* ── Question panel ── */}
        <div className="quiz-panel">
          <div className="quiz-panel__header">
            <span className="quiz-q-counter">
              Question {current + 1} <span>/ {total}</span>
            </span>
            <button
              className={`quiz-flag-btn${flagged.has(q.id) ? " flagged" : ""}`}
              onClick={toggleFlag}
              title="Flag for review"
            >
              {flagged.has(q.id) ? "🚩 Flagged" : "⚑ Flag"}
            </button>
          </div>

          <p className="quiz-question-text">{q.text}</p>

          {/* Options */}
          <div className="quiz-options">
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt;
              return (
                <button
                  key={opt}
                  className={`quiz-option${selected ? " quiz-option--selected" : ""}`}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                >
                  <span className="quiz-option__dot" />
                  <span className="quiz-option__text">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="quiz-nav">
            <button
              className="quiz-nav__btn quiz-nav__btn--ghost"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              ← Previous
            </button>

            {current < total - 1 ? (
              <button
                className="quiz-nav__btn quiz-nav__btn--primary"
                onClick={() => setCurrent((c) => c + 1)}
              >
                Next →
              </button>
            ) : (
              <button
                className="quiz-nav__btn quiz-nav__btn--submit"
                onClick={handleSubmit}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>

        {/* ── Sidebar overview ── */}
        <aside className="quiz-sidebar">
          <div className="quiz-sidebar__card">
            <p className="quiz-sidebar__heading">Question Map</p>
            <div className="quiz-dot-grid">
              {quiz.questions.map((question, i) => {
                const isAnswered = !!answers[question.id];
                const isCurrent  = i === current;
                const isFlagged  = flagged.has(question.id);
                return (
                  <button
                    key={question.id}
                    className={`quiz-dot
                      ${isCurrent  ? " quiz-dot--current"  : ""}
                      ${isAnswered ? " quiz-dot--answered" : ""}
                      ${isFlagged  ? " quiz-dot--flagged"  : ""}
                    `}
                    onClick={() => setCurrent(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="quiz-legend">
              <span><span className="legend-dot legend-dot--answered" />Answered</span>
              <span><span className="legend-dot legend-dot--unanswered" />Unanswered</span>
              <span><span className="legend-dot legend-dot--flagged" />Flagged</span>
            </div>
          </div>

          <div className="quiz-sidebar__card quiz-sidebar__stats">
            <div className="quiz-stat">
              <span className="quiz-stat__val">{answered}</span>
              <span className="quiz-stat__label">Answered</span>
            </div>
            <div className="quiz-stat">
              <span className="quiz-stat__val">{total - answered}</span>
              <span className="quiz-stat__label">Remaining</span>
            </div>
            <div className="quiz-stat">
              <span className="quiz-stat__val">{flagged.size}</span>
              <span className="quiz-stat__label">Flagged</span>
            </div>
          </div>

          <div className="quiz-sidebar__card quiz-pass-info">
            <span className="quiz-pass-info__label">Passing score</span>
            <span className="quiz-pass-info__val">{quiz.passingScore}%</span>
          </div>

          <button className="quiz-submit-all" onClick={handleSubmit}>
            Submit Quiz
          </button>
        </aside>
      </div>
    </div>
  );
}