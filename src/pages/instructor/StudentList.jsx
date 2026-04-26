import React, { useState, useMemo } from "react";
import "./instructor.css";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const MOCK_STUDENTS = [
  { id: 1,  firstName: "Youssef", lastName: "Zienhoum", email: "youssef@mail.com",  course: "React from Zero to Hero",         progress: 100, grade: 91.5, enrolledAt: "2025-02-01", status: "completed",   avatar: null },
  { id: 2,  firstName: "Nour",    lastName: "Hassan",   email: "nour@mail.com",     course: "React from Zero to Hero",         progress: 68,  grade: null, enrolledAt: "2025-02-10", status: "in_progress", avatar: null },
  { id: 3,  firstName: "Ahmed",   lastName: "Tarek",    email: "ahmed@mail.com",    course: "Advanced TypeScript Patterns",    progress: 45,  grade: null, enrolledAt: "2025-03-05", status: "in_progress", avatar: null },
  { id: 4,  firstName: "Lina",    lastName: "Mostafa",  email: "lina@mail.com",     course: "React from Zero to Hero",         progress: 82,  grade: null, enrolledAt: "2025-03-12", status: "in_progress", avatar: null },
  { id: 5,  firstName: "Omar",    lastName: "Fathy",    email: "omar@mail.com",     course: "Advanced TypeScript Patterns",    progress: 100, grade: 88,   enrolledAt: "2025-01-20", status: "completed",   avatar: null },
  { id: 6,  firstName: "Sara",    lastName: "Kamal",    email: "sara.k@mail.com",   course: "Git & GitHub for Teams",          progress: 12,  grade: null, enrolledAt: "2025-04-01", status: "in_progress", avatar: null },
  { id: 7,  firstName: "Kareem",  lastName: "El-Din",   email: "kareem@mail.com",   course: "React from Zero to Hero",         progress: 55,  grade: null, enrolledAt: "2025-02-28", status: "in_progress", avatar: null },
  { id: 8,  firstName: "Mona",    lastName: "Ibrahim",  email: "mona@mail.com",     course: "Advanced TypeScript Patterns",    progress: 0,   grade: null, enrolledAt: "2025-04-10", status: "not_started", avatar: null },
];

const COURSES = ["All Courses", "React from Zero to Hero", "Advanced TypeScript Patterns", "Git & GitHub for Teams"];

const STATUS_META = {
  completed:    { label: "Completed",    color: "#15803d", bg: "#dcfce7" },
  in_progress:  { label: "In Progress",  color: "#1d4ed8", bg: "#dbeafe" },
  not_started:  { label: "Not Started",  color: "#6b6b6b", bg: "#f5f3ef" },
};

function getInitials(s) {
  return `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function progressColor(p) {
  if (p >= 80) return "#15803d";
  if (p >= 40) return "#92400e";
  return "#991b1b";
}

/* ─────────────────────────────────────────
   STUDENT DETAIL DRAWER
───────────────────────────────────────── */
function StudentDrawer({ student, onClose }) {
  if (!student) return null;
  const sm = STATUS_META[student.status];
  const pc = progressColor(student.progress);

  return (
    <div className="ip-drawer-overlay" onClick={onClose}>
      <div className="ip-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ip-drawer__header">
          <div className="ip-drawer__avatar">{getInitials(student)}</div>
          <div>
            <h2 className="ip-drawer__name">{student.firstName} {student.lastName}</h2>
            <p className="ip-drawer__email">{student.email}</p>
          </div>
          <button className="ip-drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="ip-drawer__body">
          <div className="ip-drawer__row">
            <span className="ip-drawer__label">Course</span>
            <span className="ip-drawer__val">{student.course}</span>
          </div>
          <div className="ip-drawer__row">
            <span className="ip-drawer__label">Status</span>
            <span className="ip-status-badge" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
          </div>
          <div className="ip-drawer__row">
            <span className="ip-drawer__label">Enrolled</span>
            <span className="ip-drawer__val">{formatDate(student.enrolledAt)}</span>
          </div>
          <div className="ip-drawer__row">
            <span className="ip-drawer__label">Grade</span>
            <span className="ip-drawer__val">
              {student.grade !== null ? (
                <span className="ip-grade-badge">{student.grade}%</span>
              ) : "Not graded"}
            </span>
          </div>

          {/* Progress */}
          <div className="ip-drawer__progress-section">
            <div className="ip-drawer__prog-header">
              <span className="ip-drawer__label">Progress</span>
              <span style={{ fontWeight: 700, color: pc }}>{student.progress}%</span>
            </div>
            <div className="ip-prog-bar">
              <div className="ip-prog-bar__fill" style={{ width: `${student.progress}%`, background: pc }} />
            </div>
          </div>
        </div>

        <div className="ip-drawer__footer">
          <a href={`mailto:${student.email}`} className="ins-btn-primary">
            ✉ Send Email
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function StudentList() {
  const [search,        setSearch]        = useState("");
  const [courseFilter,  setCourseFilter]  = useState("All Courses");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [sortBy,        setSortBy]        = useState("enrolledAt");
  const [selected,      setSelected]      = useState(null);

  const filtered = useMemo(() => {
    return MOCK_STUDENTS
      .filter((s) => {
        const q = search.toLowerCase();
        if (q && !`${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(q)) return false;
        if (courseFilter !== "All Courses" && s.course !== courseFilter) return false;
        if (statusFilter !== "All" && s.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name")       return a.firstName.localeCompare(b.firstName);
        if (sortBy === "progress")   return b.progress - a.progress;
        if (sortBy === "enrolledAt") return new Date(b.enrolledAt) - new Date(a.enrolledAt);
        return 0;
      });
  }, [search, courseFilter, statusFilter, sortBy]);

  const stats = {
    total:       MOCK_STUDENTS.length,
    completed:   MOCK_STUDENTS.filter((s) => s.status === "completed").length,
    inProgress:  MOCK_STUDENTS.filter((s) => s.status === "in_progress").length,
    notStarted:  MOCK_STUDENTS.filter((s) => s.status === "not_started").length,
  };

  return (
    <div className="ins-page">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Enrolled Students</h1>
          <p className="pg-header__sub">{stats.total} students across all courses</p>
        </div>
        <button className="ins-btn-ghost" onClick={() => {
          const csv = ["Name,Email,Course,Progress,Status,Enrolled"].concat(
            MOCK_STUDENTS.map((s) => `${s.firstName} ${s.lastName},${s.email},${s.course},${s.progress}%,${s.status},${s.enrolledAt}`)
          ).join("\n");
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
          a.download = "students.csv"; a.click();
        }}>
          ⬇ Export CSV
        </button>
      </div>

      {/* Stats strip */}
      <div className="ip-stats-strip">
        {[
          { label: "Total",       val: stats.total,      color: "var(--text-primary)" },
          { label: "Completed",   val: stats.completed,  color: "#15803d" },
          { label: "In Progress", val: stats.inProgress, color: "#1d4ed8" },
          { label: "Not Started", val: stats.notStarted, color: "#6b6b6b" },
        ].map((s) => (
          <div key={s.label} className="ip-stat-box">
            <span className="ip-stat-box__val" style={{ color: s.color }}>{s.val}</span>
            <span className="ip-stat-box__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="ip-controls">
        <div className="ip-search-wrap">
          <input className="ip-search" placeholder="Search by name or email…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="ip-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        <select className="ip-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          {COURSES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select className="ip-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All statuses</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="not_started">Not Started</option>
        </select>

        <select className="ip-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="enrolledAt">Sort: Newest</option>
          <option value="name">Sort: Name</option>
          <option value="progress">Sort: Progress</option>
        </select>
      </div>

      {/* Table */}
      <div className="ip-table-wrap">
        {filtered.length === 0 ? (
          <div className="pg-empty"><span>👥</span><p>No students match your filters.</p></div>
        ) : (
          <table className="ip-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Grade</th>
                <th>Enrolled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const sm = STATUS_META[s.status];
                const pc = progressColor(s.progress);
                return (
                  <tr key={s.id} className="ip-table__row" onClick={() => setSelected(s)}>
                    <td>
                      <div className="ip-student-info">
                        <div className="ip-student-avatar">{getInitials(s)}</div>
                        <div>
                          <p className="ip-student-name">{s.firstName} {s.lastName}</p>
                          <p className="ip-student-email">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="ip-course-tag">{s.course}</span></td>
                    <td>
                      <div className="ip-prog-cell">
                        <div className="ip-prog-bar">
                          <div className="ip-prog-bar__fill" style={{ width: `${s.progress}%`, background: pc }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: pc, minWidth: 30 }}>{s.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="ip-status-badge" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                    </td>
                    <td>
                      {s.grade !== null
                        ? <span className="ip-grade-badge">{s.grade}%</span>
                        : <span className="ip-pending-text">—</span>
                      }
                    </td>
                    <td className="ip-date-cell">{formatDate(s.enrolledAt)}</td>
                    <td><span className="ip-view-btn">View →</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && <StudentDrawer student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}