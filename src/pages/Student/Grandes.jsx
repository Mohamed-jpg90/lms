import React, { useState } from "react";

const MOCK_GRADE_DATA = [
  {
    courseId: 1,
    courseTitle: "React from Zero to Hero",
    category: "Web Development",
    level: "BEGINNER",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=60",
    enrolled: true,
    completed: true,
    overallGrade: 89.3,
    items: [
      { id: "q1",  type: "QUIZ",       title: "JSX Quiz",               score: 90,  maxScore: 100, date: "2025-02-10", attempts: 1, maxAttempts: 3 },
      { id: "q2",  type: "QUIZ",       title: "Hooks Quiz",             score: 85,  maxScore: 100, date: "2025-02-18", attempts: 2, maxAttempts: 3 },
      { id: "e1",  type: "EXAM",       title: "Midterm Exam",           score: 78,  maxScore: 100, date: "2025-03-01", attempts: 1, maxAttempts: 1 },
      { id: "a1",  type: "ASSIGNMENT", title: "Build a React Todo App", score: 88,  maxScore: 100, date: "2025-03-08", attempts: 1, maxAttempts: 2 },
      { id: "e2",  type: "EXAM",       title: "Final Exam",             score: 92,  maxScore: 100, date: "2025-03-14", attempts: 1, maxAttempts: 1 },
    ],
  },
  {
    courseId: 2,
    courseTitle: "Spring Boot & Microservices",
    category: "Backend",
    level: "ADVANCED",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=60",
    enrolled: true,
    completed: true,
    overallGrade: 84.0,
    items: [
      { id: "q3",  type: "QUIZ",       title: "Spring Basics Quiz",         score: 80, maxScore: 100, date: "2025-01-05", attempts: 2, maxAttempts: 3 },
      { id: "q4",  type: "QUIZ",       title: "JPA & Hibernate Quiz",       score: 88, maxScore: 100, date: "2025-01-12", attempts: 1, maxAttempts: 3 },
      { id: "a2",  type: "ASSIGNMENT", title: "REST API Design Document",   score: null, maxScore: 100, date: "2025-01-19", attempts: 1, maxAttempts: 1 },
      { id: "e3",  type: "EXAM",       title: "Final Exam",                 score: 84, maxScore: 100, date: "2025-01-28", attempts: 1, maxAttempts: 1 },
    ],
  },
  {
    courseId: 4,
    courseTitle: "Data Structures & Algorithms",
    category: "Computer Science",
    level: "INTERMEDIATE",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&q=60",
    enrolled: true,
    completed: false,
    overallGrade: null,
    items: [
      { id: "q5",  type: "QUIZ",       title: "Arrays & Strings Quiz",        score: 72, maxScore: 100, date: "2025-03-20", attempts: 1, maxAttempts: 3 },
      { id: "q6",  type: "QUIZ",       title: "Linked Lists Quiz",            score: 68, maxScore: 100, date: "2025-03-27", attempts: 2, maxAttempts: 3 },
      { id: "a3",  type: "ASSIGNMENT", title: "Algorithm Complexity Analysis", score: null, maxScore: 100, date: null, attempts: 0, maxAttempts: 2 },
    ],
  },
  {
    courseId: 5,
    courseTitle: "Machine Learning with Python",
    category: "Data Science",
    level: "ADVANCED",
    thumbnailUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200&q=60",
    enrolled: true,
    completed: false,
    overallGrade: null,
    items: [
      { id: "q7",  type: "QUIZ",       title: "Linear Algebra Recap Quiz", score: 90, maxScore: 100, date: "2025-04-02", attempts: 1, maxAttempts: 3 },
      { id: "a4",  type: "ASSIGNMENT", title: "Neural Network from Scratch", score: null, maxScore: 100, date: null, attempts: 0, maxAttempts: 2 },
    ],
  },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function gradeLabel(pct) {
  if (pct === null || pct === undefined) return { letter: "—",  color: "#6b6b6b", bg: "#f5f3ef" };
  if (pct >= 90) return { letter: "A",  color: "#15803d", bg: "#dcfce7" };
  if (pct >= 80) return { letter: "B",  color: "#1d4ed8", bg: "#dbeafe" };
  if (pct >= 70) return { letter: "C",  color: "#92400e", bg: "#fef3c7" };
  if (pct >= 60) return { letter: "D",  color: "#b45309", bg: "#ffedd5" };
  return               { letter: "F",  color: "#991b1b", bg: "#fee2e2" };
}

function pct(score, max) {
  if (score === null || score === undefined) return null;
  return Math.round((score / max) * 100);
}

const TYPE_META = {
  QUIZ:       {  label: "Quiz",       color: "#1d4ed8", bg: "#dbeafe" },
  EXAM:       {  label: "Exam",       color: "#7c3aed", bg: "#ede9fe" },
  ASSIGNMENT: {  label: "Assignment", color: "#b45309", bg: "#ffedd5" },
};


function GradeBar({ score, maxScore }) {
  const p = pct(score, maxScore);
  if (p === null) return <span className="grade-bar-empty">Not graded</span>;
  const g = gradeLabel(p);
  return (
    <div className="grade-bar-wrap">
      <div className="grade-bar">
        <div
          className="grade-bar__fill"
          style={{ width: `${p}%`, background: g.color }}
        />
      </div>
      <span className="grade-bar__pct" style={{ color: g.color }}>{p}%</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   COURSE GRADE ACCORDION
───────────────────────────────────────── */
function CourseGradeCard({ course }) {
  const [open, setOpen] = useState(false);
  const overall = course.overallGrade;
  const g = gradeLabel(overall);

  const gradedItems  = course.items.filter((i) => i.score !== null);
  const pendingItems = course.items.filter((i) => i.score === null);

  return (
    <div className={`gc-card ${open ? "gc-card--open" : ""}`}>
      {/* ── Course header row ── */}
      <div className="gc-card__header" onClick={() => setOpen(!open)}>
        <div className="gc-card__thumb">
          <img src={course.thumbnailUrl} alt={course.courseTitle} />
        </div>

        <div className="gc-card__info">
          <p className="gc-card__cat">{course.category}</p>
          <h3 className="gc-card__title">{course.courseTitle}</h3>
          <p className="gc-card__sub">
            {gradedItems.length}/{course.items.length} graded
            {course.completed && <span className="gc-card__completed-badge">✓ Completed</span>}
          </p>
        </div>

        <div className="gc-card__grade-area">
          {overall !== null ? (
            <>
              <span
                className="gc-card__letter"
                style={{ background: g.bg, color: g.color }}
              >
                {g.letter}
              </span>
              <span className="gc-card__pct">{overall.toFixed(1)}%</span>
            </>
          ) : (
            <span className="gc-card__in-progress">In progress</span>
          )}
        </div>

        <span className={`asgn-chevron ${open ? "asgn-chevron--open" : ""}`}>›</span>
      </div>

      {/* ── Items table ── */}
      {open && (
        <div className="gc-card__body">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Date</th>
                <th>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {course.items.map((item) => {
                const tm  = TYPE_META[item.type];
                const p   = pct(item.score, item.maxScore);
                const gl  = gradeLabel(p);
                return (
                  <tr key={item.id} className={item.score === null ? "grades-table__row--pending" : ""}>
                    <td className="grades-table__name">{item.title}</td>
                    <td>
                      <span
                        className="grades-table__type-badge"
                        style={{ background: tm.bg, color: tm.color }}
                      >
                         {tm.label}
                      </span>
                    </td>
                    <td>
                      {item.score !== null
                        ? <span className="grades-table__score">{item.score}<span className="grades-table__max">/{item.maxScore}</span></span>
                        : <span className="grades-table__pending">Pending</span>
                      }
                    </td>
                    <td>
                      <GradeBar score={item.score} maxScore={item.maxScore} />
                    </td>
                    <td className="grades-table__date">{formatDate(item.date)}</td>
                    <td className="grades-table__attempts">
                      {item.attempts}/{item.maxAttempts}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Course average summary */}
          {gradedItems.length > 0 && (
            <div className="gc-card__summary">
              <div className="gc-summary-item">
                <span className="gc-summary-item__label">Graded items avg</span>
                <span className="gc-summary-item__val">
                  {(gradedItems.reduce((s, i) => s + pct(i.score, i.maxScore), 0) / gradedItems.length).toFixed(1)}%
                </span>
              </div>
              <div className="gc-summary-item">
                <span className="gc-summary-item__label">Highest score</span>
                <span className="gc-summary-item__val" style={{ color: "#15803d" }}>
                  {Math.max(...gradedItems.map((i) => pct(i.score, i.maxScore)))}%
                </span>
              </div>
              <div className="gc-summary-item">
                <span className="gc-summary-item__label">Lowest score</span>
                <span className="gc-summary-item__val" style={{ color: "#991b1b" }}>
                  {Math.min(...gradedItems.map((i) => pct(i.score, i.maxScore)))}%
                </span>
              </div>
              {pendingItems.length > 0 && (
                <div className="gc-summary-item">
                  <span className="gc-summary-item__label">Pending</span>
                  <span className="gc-summary-item__val">{pendingItems.length} item{pendingItems.length !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const TYPE_FILTERS = ["All", "QUIZ", "EXAM", "ASSIGNMENT"];

export default function Grades() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  /* Flatten all items for summary table */
  const allItems = MOCK_GRADE_DATA.flatMap((c) =>
    c.items.map((i) => ({ ...i, courseTitle: c.courseTitle, courseId: c.courseId }))
  );

  const filteredItems = allItems.filter((i) => {
    if (typeFilter   !== "All" && i.type !== typeFilter)           return false;
    if (courseFilter !== "All" && i.courseId !== +courseFilter)    return false;
    return true;
  });

  const gradedAll   = allItems.filter((i) => i.score !== null);
  const overallAvg  = gradedAll.length
    ? (gradedAll.reduce((s, i) => s + pct(i.score, i.maxScore), 0) / gradedAll.length).toFixed(1)
    : null;

  const completedCourses = MOCK_GRADE_DATA.filter((c) => c.completed).length;

  return (
    <div className="db-page">
      {/* ── Page header ── */}
      <div className="db-hero">
        <div>
          <h1 className="db-hero__name">My Grades</h1>
          <p className="catalog-header__sub">
            All courses, quizzes, exams and assignments
          </p>
        </div>
      </div>

      {/* ── Summary KPI strip ── */}
      <div className="grades-kpi-strip">
        <div className="grades-kpi">
          <span className="grades-kpi__val">{overallAvg !== null ? `${overallAvg}%` : "—"}</span>
          <span className="grades-kpi__label">Overall avg</span>
        </div>
        <div className="grades-kpi">
          <span className="grades-kpi__val">{MOCK_GRADE_DATA.length}</span>
          <span className="grades-kpi__label">Courses</span>
        </div>
        <div className="grades-kpi">
          <span className="grades-kpi__val">{completedCourses}</span>
          <span className="grades-kpi__label">Completed</span>
        </div>
        <div className="grades-kpi">
          <span className="grades-kpi__val">{gradedAll.length}</span>
          <span className="grades-kpi__label">Graded items</span>
        </div>
        <div className="grades-kpi">
          <span className="grades-kpi__val">{allItems.length - gradedAll.length}</span>
          <span className="grades-kpi__label">Pending</span>
        </div>
      </div>

      {/* ── Section: By Course ── */}
      <div className="grades-section">
        <h2 className="grades-section__title">By Course</h2>
        <p className="grades-section__sub">Click a course to see individual item grades</p>
        <div className="gc-list">
          {MOCK_GRADE_DATA.map((c) => (
            <CourseGradeCard key={c.courseId} course={c} />
          ))}
        </div>
      </div>

      {/* ── Section: All Items ── */}
      <div className="grades-section">
        <div className="grades-section__header-row">
          <div>
            <h2 className="grades-section__title">All Items</h2>
            <p className="grades-section__sub">Every quiz, exam and assignment in one view</p>
          </div>
          <div className="grades-all-filters">
            {/* Type filter */}
            <div className="pg-filter-row pg-filter-row--inline">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f}
                  className={`pg-pill pg-pill--sm ${typeFilter === f ? "pg-pill--active" : ""}`}
                  onClick={() => setTypeFilter(f)}
                >
                  {f === "All" ? "All types" : TYPE_META[f]?.label ?? f}
                </button>
              ))}
            </div>
            {/* Course filter */}
            <select
              className="grades-course-select"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All">All courses</option>
              {MOCK_GRADE_DATA.map((c) => (
                <option key={c.courseId} value={c.courseId}>{c.courseTitle}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="pg-empty">
            <span>📊</span>
            <p>No items match this filter.</p>
          </div>
        ) : (
          <div className="grades-all-table-wrap">
            <table className="grades-table grades-table--full">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Course</th>
                  <th>Type</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const tm = TYPE_META[item.type];
                  const p  = pct(item.score, item.maxScore);
                  return (
                    <tr key={item.id} className={item.score === null ? "grades-table__row--pending" : ""}>
                      <td className="grades-table__name">{item.title}</td>
                      <td className="grades-table__course">{item.courseTitle}</td>
                      <td>
                        <span
                          className="grades-table__type-badge"
                          style={{ background: tm.bg, color: tm.color }}
                        >
                           {tm.label}
                        </span>
                      </td>
                      <td>
                        {item.score !== null
                          ? <span className="grades-table__score">{item.score}<span className="grades-table__max">/{item.maxScore}</span></span>
                          : <span className="grades-table__pending">Pending</span>
                        }
                      </td>
                      <td><GradeBar score={item.score} maxScore={item.maxScore} /></td>
                      <td className="grades-table__date">{formatDate(item.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}