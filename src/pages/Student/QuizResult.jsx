import React, { useMemo } from "react";
// import "./quiz.css";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* Circular progress SVG */
function CircleScore({ score, passed }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg className="score-ring" viewBox="0 0 120 120" width="120" height="120">
      <circle
        cx="60" cy="60" r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="10"
      />
      <circle
        cx="60" cy="60" r={r}
        fill="none"
        stroke={passed ? "var(--gold)" : "var(--error)"}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset="0"
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text
        x="60" y="55"
        textAnchor="middle"
        dominantBaseline="central"
        className="score-ring__pct"
        fill={passed ? "var(--gold)" : "var(--error)"}
      >
        {score}%
      </text>
      <text
        x="60" y="76"
        textAnchor="middle"
        className="score-ring__label"
        fill="var(--text-muted)"
      >
        {passed ? "PASSED" : "FAILED"}
      </text>
    </svg>
  );
}

export default function QuizResult() {
  /* Read result from sessionStorage (written by Quiz.jsx on submit) */
  const result = useMemo(() => {
    const raw = sessionStorage.getItem("lms_quiz_result");
    if (raw) return JSON.parse(raw);
    /* Fallback demo data if navigated directly */
    return {
      quizTitle: "React Fundamentals — Chapter 3",
      passingScore: 70,
      score: 83,
      correct: 5,
      total: 6,
      timeTaken: 312,
      answers: {
        1: "useState",
        2: "When the effect re-runs",
        3: "True",
        4: "setState(state + 1)",   // wrong
        5: "False",
        6: "React.memo",
      },
      questions: [
        { id: 1, text: "Which hook is used to manage local component state?", options: ["useEffect","useState","useContext","useReducer"], correctAnswer: "useState" },
        { id: 2, text: "What does the dependency array in useEffect control?", options: ["Number of renders","When the effect re-runs","Initial state","Render order"], correctAnswer: "When the effect re-runs" },
        { id: 3, text: "React components must return a single root element.", options: ["True","False"], correctAnswer: "True" },
        { id: 4, text: "Correct way to update state based on previous value?", options: ["setState(state + 1)","setState(prev => prev + 1)","state = state + 1","updateState(state++)"], correctAnswer: "setState(prev => prev + 1)" },
        { id: 5, text: "useContext replaces all state management in React.", options: ["True","False"], correctAnswer: "False" },
        { id: 6, text: "Which method prevents unnecessary child re-renders?", options: ["React.memo","React.lazy","React.clone","React.pure"], correctAnswer: "React.memo" },
      ],
    };
  }, []);

  const passed = result.score >= result.passingScore;

  return (
    <div className="quiz-page">
      {/* ── Header ── */}
      <div className="quiz-topbar">
        <div className="quiz-topbar__info">
          <span className="quiz-topbar__lesson">Quiz Complete</span>
          <h1 className="quiz-topbar__title">{result.quizTitle}</h1>
        </div>
        <span className={`result-badge ${passed ? "result-badge--pass" : "result-badge--fail"}`}>
          {passed ? "✓ Passed" : "✗ Failed"}
        </span>
      </div>

      <div className="quiz-body quiz-body--result">
        {/* ── Left: breakdown ── */}
        <div className="quiz-panel">
          <p className="result-section-title">Question Breakdown</p>

          <div className="result-questions">
            {result.questions.map((q, i) => {
              const given   = result.answers?.[q.id];
              const correct = given === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`result-q ${correct ? "result-q--correct" : "result-q--wrong"}`}
                >
                  <div className="result-q__header">
                    <span className="result-q__num">Q{i + 1}</span>
                    <span className={`result-q__status ${correct ? "status--correct" : "status--wrong"}`}>
                      {correct ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>
                  <p className="result-q__text">{q.text}</p>

                  <div className="result-q__answers">
                    {given && given !== q.correctAnswer && (
                      <div className="result-answer result-answer--wrong">
                        <span className="result-answer__label">Your answer</span>
                        <span className="result-answer__val">{given}</span>
                      </div>
                    )}
                    <div className="result-answer result-answer--correct">
                      <span className="result-answer__label">Correct answer</span>
                      <span className="result-answer__val">{q.correctAnswer}</span>
                    </div>
                    {!given && (
                      <div className="result-answer result-answer--skipped">
                        <span className="result-answer__label">Skipped</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: score card ── */}
        <aside className="quiz-sidebar">
          {/* Score ring */}
          <div className="quiz-sidebar__card result-score-card">
            <CircleScore score={result.score} passed={passed} />
            <p className="result-score-card__msg">
              {passed
                ? "Great job! You passed this quiz."
                : `You need ${result.passingScore}% to pass. Keep practicing!`}
            </p>
          </div>

          {/* Stats */}
          <div className="quiz-sidebar__card quiz-sidebar__stats">
            <div className="quiz-stat">
              <span className="quiz-stat__val quiz-stat__val--correct">{result.correct}</span>
              <span className="quiz-stat__label">Correct</span>
            </div>
            <div className="quiz-stat">
              <span className="quiz-stat__val quiz-stat__val--wrong">{result.total - result.correct}</span>
              <span className="quiz-stat__label">Incorrect</span>
            </div>
            <div className="quiz-stat">
              <span className="quiz-stat__val">{formatTime(result.timeTaken)}</span>
              <span className="quiz-stat__label">Time taken</span>
            </div>
          </div>

          {/* Passing info */}
          <div className="quiz-sidebar__card quiz-pass-info">
            <span className="quiz-pass-info__label">Passing score</span>
            <span className="quiz-pass-info__val">{result.passingScore}%</span>
          </div>

          {/* Actions */}
          <div className="result-actions">
            <button
              className="quiz-submit-all"
              onClick={() => {
                sessionStorage.removeItem("lms_quiz_result");
                window.location.href = "/student/quiz";
              }}
            >
              Retake Quiz
            </button>
            <button
              className="quiz-nav__btn quiz-nav__btn--ghost result-back-btn"
              onClick={() => window.location.href = "/student/courses"}
            >
              Back to Course
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}