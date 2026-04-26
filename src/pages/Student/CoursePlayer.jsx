import React, { useState, useRef } from "react";
// import "./pages.css";

/* ── Mock data ── */
const MOCK_LESSONS = [
  { id: 1, title: "Introduction & Environment Setup",   duration: 18, lessonOrder: 1, preview: true,  completed: true,  videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA", quizzes: [] },
  { id: 2, title: "JSX & Component Basics",             duration: 24, lessonOrder: 2, preview: false, completed: true,  videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA", quizzes: [{ id: 1, title: "JSX Quiz" }] },
  { id: 3, title: "Props & State",                      duration: 32, lessonOrder: 3, preview: false, completed: true,  videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA", quizzes: [] },
  { id: 4, title: "useEffect & Side Effects",           duration: 41, lessonOrder: 4, preview: false, completed: false, videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA", quizzes: [{ id: 2, title: "Hooks Quiz" }] },
  { id: 5, title: "Context API & Global State",         duration: 38, lessonOrder: 5, preview: false, completed: false, videoUrl: null, quizzes: [] },
  { id: 6, title: "React Router v6",                    duration: 45, lessonOrder: 6, preview: false, completed: false, videoUrl: null, quizzes: [] },
  { id: 7, title: "Performance Optimization",           duration: 36, lessonOrder: 7, preview: false, completed: false, videoUrl: null, quizzes: [] },
  { id: 8, title: "Final Project — Build a Full App",   duration: 86, lessonOrder: 8, preview: false, completed: false, videoUrl: null, quizzes: [] },
];

const MOCK_COURSE = {
  id: 1,
  title: "React from Zero to Hero",
  instructor: { firstName: "Sara", lastName: "Ahmed" },
  totalLessons: 8,
};

function fmtDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const TABS = ["Overview", "Resources", "Q&A", "Notes"];

export default function CoursePlayer() {
  const [lessons, setLessons]     = useState(MOCK_LESSONS);
  const [currentId, setCurrentId] = useState(4); // start on first incomplete
  const [activeTab, setActiveTab] = useState("Overview");
  const [notes, setNotes]         = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const current = lessons.find((l) => l.id === currentId);
  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPct = Math.round((completedCount / lessons.length) * 100);

  const markComplete = (id) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, completed: true } : l))
    );
  };

  const goNext = () => {
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx < lessons.length - 1) setCurrentId(lessons[idx + 1].id);
  };

  const goPrev = () => {
    const idx = lessons.findIndex((l) => l.id === currentId);
    if (idx > 0) setCurrentId(lessons[idx - 1].id);
  };

  return (
    <div className="player-page">
      {/* ── Top bar ── */}
      <div className="player-topbar">
        <div className="player-topbar__left">
          <button className="player-back-btn" onClick={() => window.history.back()}>
            ← Back
          </button>
          <div>
            <p className="player-topbar__course">{MOCK_COURSE.title}</p>
            <p className="player-topbar__lesson">{current?.title}</p>
          </div>
        </div>
        <div className="player-topbar__right">
          <div className="player-progress-pill">
            <div
              className="player-progress-pill__fill"
              style={{ width: `${progressPct}%` }}
            />
            <span className="player-progress-pill__label">
              {completedCount}/{lessons.length} lessons · {progressPct}%
            </span>
          </div>
          <button
            className="player-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle curriculum"
          >
            {sidebarOpen ? "✕ Hide" : "≡ Curriculum"}
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className={`player-body ${sidebarOpen ? "" : "player-body--full"}`}>
        {/* ── Video + content ── */}
        <div className="player-main">
          {/* Video area */}
          <div className="player-video-wrap">
            {current?.videoUrl ? (
              <iframe
                src={current.videoUrl}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
                className="player-iframe"
              />
            ) : (
              <div className="player-video-placeholder">
                <span className="player-video-placeholder__icon">🎬</span>
                <p>Video not available yet</p>
              </div>
            )}
          </div>

          {/* Video controls bar */}
          <div className="player-controls">
            <div className="player-controls__left">
              <button className="player-ctrl-btn" onClick={goPrev} disabled={currentId === lessons[0].id}>
                ← Prev
              </button>
              <button className="player-ctrl-btn player-ctrl-btn--next" onClick={goNext} disabled={currentId === lessons[lessons.length - 1].id}>
                Next →
              </button>
            </div>
            <div className="player-controls__right">
              {!current?.completed && (
                <button
                  className="player-complete-btn"
                  onClick={() => markComplete(currentId)}
                >
                  ✓ Mark as Complete
                </button>
              )}
              {current?.completed && (
                <span className="player-completed-badge">✓ Completed</span>
              )}
              {current?.quizzes?.length > 0 && (
                <a href={`/student/quiz?quiz=${current.quizzes[0].id}`} className="player-quiz-btn">
                  📝 Take Quiz
                </a>
              )}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="player-tabs">
            {TABS.map((t) => (
              <button
                key={t}
                className={`player-tab ${activeTab === t ? "player-tab--active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="player-tab-content">
            {activeTab === "Overview" && (
              <div className="player-overview">
                <h2 className="player-overview__title">{current?.title}</h2>
                <p className="player-overview__meta">
                  ⏱ {fmtDuration(current?.duration)} &nbsp;·&nbsp;
                  Lesson {current?.lessonOrder} of {lessons.length} &nbsp;·&nbsp;
                  {current?.preview ? "Free Preview" : "Enrolled"}
                </p>
                <p className="player-overview__desc">
                  In this lesson you'll build a solid understanding of the core concepts.
                  Follow along with the code examples and pause whenever you need to.
                </p>
              </div>
            )}

            {activeTab === "Resources" && (
              <div className="player-resources">
                <div className="player-resource-item">
                  <span className="resource-icon">📄</span>
                  <span>Lesson slides.pdf</span>
                  <a href="#" className="resource-dl">Download</a>
                </div>
                <div className="player-resource-item">
                  <span className="resource-icon">💾</span>
                  <span>Starter code.zip</span>
                  <a href="#" className="resource-dl">Download</a>
                </div>
              </div>
            )}

            {activeTab === "Q&A" && (
              <div className="player-qa">
                <p className="player-qa__empty">No questions yet. Be the first to ask!</p>
                <button className="player-qa__ask">Ask a Question</button>
              </div>
            )}

            {activeTab === "Notes" && (
              <div className="player-notes">
                <textarea
                  className="player-notes__area"
                  placeholder="Write your notes for this lesson…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                />
                <button
                  className="player-notes__save"
                  onClick={() => alert("Notes saved!")}
                >
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Curriculum sidebar ── */}
        {sidebarOpen && (
          <aside className="player-sidebar">
            <div className="player-sidebar__header">
              <span>Curriculum</span>
              <span className="player-sidebar__prog">{progressPct}% complete</span>
            </div>
            <div className="player-sidebar__list">
              {lessons.map((lesson) => {
                const active = lesson.id === currentId;
                return (
                  <button
                    key={lesson.id}
                    className={`player-sidebar__item
                      ${active ? "player-sidebar__item--active" : ""}
                      ${lesson.completed ? "player-sidebar__item--done" : ""}
                    `}
                    onClick={() => setCurrentId(lesson.id)}
                  >
                    <span className={`player-sidebar__dot ${lesson.completed ? "dot--done" : ""} ${active ? "dot--active" : ""}`}>
                      {lesson.completed ? "✓" : lesson.lessonOrder}
                    </span>
                    <span className="player-sidebar__item-info">
                      <span className="player-sidebar__item-title">{lesson.title}</span>
                      <span className="player-sidebar__item-dur">{fmtDuration(lesson.duration)}</span>
                    </span>
                    {lesson.quizzes?.length > 0 && (
                      <span className="player-sidebar__quiz-dot" title="Has quiz">📝</span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}