import React, { useState } from "react";
// import "./dashboard.css";
import { Link } from "react-router-dom";

/* ── Read current user from localStorage ── */
const storedUser = JSON.parse(localStorage.getItem("user") || "null");
const token = localStorage.getItem('token')

const MOCK_USER = storedUser
 
// || {
//   id: 1,
//   firstname: "Youssef",
//   lastname: "Zienhoum",
//   email: "youssef@example.com",
//   role: "STUDENT",
//   avatarUrl: null,
//   active: true,
//   createdAt: "2024-09-01T10:00:00",
// };

/* ── Mock enrollments ── */
const MOCK_ENROLLMENTS = [
  {
    id: 1,
    course: {
      id: 1,
      title: "React from Zero to Hero",
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
      instructor: { firstname: "Sara", lastname: "Ahmed" },
      category: { name: "Web Development" },
      totalLessons: 8,
      level: "BEGINNER",
    },
    progressPercentage: 100,
    completed: true,
    completedAt: "2025-03-14T10:00:00",
    certificate: { certificateCode: "LMS-2025-RC-00128", finalScore: 91.5 },
  },
  {
    id: 2,
    course: {
      id: 2,
      title: "Spring Boot & Microservices",
      thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
      instructor: { firstname: "Karim", lastname: "Hassan" },
      category: { name: "Backend" },
      totalLessons: 14,
      level: "ADVANCED",
    },
    progressPercentage: 100,
    completed: true,
    completedAt: "2025-01-28T10:00:00",
    certificate: { certificateCode: "LMS-2025-SB-00204", finalScore: 84.0 },
  },
  {
    id: 3,
    course: {
      id: 4,
      title: "Data Structures & Algorithms",
      thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
      instructor: { firstname: "Omar", lastname: "Fathy" },
      category: { name: "Computer Science" },
      totalLessons: 20,
      level: "INTERMEDIATE",
    },
    progressPercentage: 62,
    completed: false,
    completedAt: null,
    certificate: null,
  },
  {
    id: 4,
    course: {
      id: 5,
      title: "Machine Learning with Python",
      thumbnailUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
      instructor: { firstname: "Layla", lastname: "Morsi" },
      category: { name: "Data Science" },
      totalLessons: 18,
      level: "ADVANCED",
    },
    progressPercentage: 28,
    completed: false,
    completedAt: null,
    certificate: null,
  },
  {
    id: 5,
    course: {
      id: 6,
      title: "Git & GitHub for Teams",
      thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80",
      instructor: { firstname: "Sara", lastname: "Ahmed" },
      category: { name: "Web Development" },
      totalLessons: 10,
      level: "BEGINNER",
    },
    progressPercentage: 80,
    completed: false,
    completedAt: null,
    certificate: null,
  },
];

const LEVEL_COLOR = {
  BEGINNER:     { bg: "#dcfce7", color: "#15803d" },
  INTERMEDIATE: { bg: "#fef3c7", color: "#92400e" },
  ADVANCED:     { bg: "#fee2e2", color: "#991b1b" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getInitials(user) {
  return `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase();
}

/* ── Progress ring (mini) ── */
// function MiniRing({ pct, size = 44 }) {
//   const r = (size - 8) / 2;
//   const circ = 2 * Math.PI * r;
//   const fill = (pct / 100) * circ;
//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mini-ring">
//       <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
//       <circle
//         cx={size/2} cy={size/2} r={r}
//         fill="none"
//         stroke="var(--gold)"
//         strokeWidth="4"
//         strokeLinecap="round"
//         strokeDasharray={`${fill} ${circ}`}
//         transform={`rotate(-90 ${size/2} ${size/2})`}
//       />
//       <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="mini-ring__text">
//         {pct}%
//       </text>
//     </svg>
//   );
// }

/* ── Course card (in-progress) ── */
function ProgressCard({ enrollment }) {
  const { course, progressPercentage } = enrollment;
  const lvl = LEVEL_COLOR[course.level] || LEVEL_COLOR.BEGINNER;
  const lessonsCompleted = Math.round((progressPercentage / 100) * course.totalLessons);

  return (
    <div className="db-course-card">
      <div className="db-course-card__thumb">
        <img src={course.thumbnailUrl} alt={course.title} loading="lazy" />
        <span
          className="db-course-card__level"
          style={{ background: lvl.bg, color: lvl.color }}
        >
          {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
        </span>
      </div>
      <div className="db-course-card__body">
        <p className="db-course-card__cat">{course.category.name}</p>
        <h3 className="db-course-card__title">{course.title}</h3>
        <p className="db-course-card__inst">
          {course.instructor.firstname} {course.instructor.lastname}
        </p>

        {/* Progress bar */}
        <div className="db-prog-bar-wrap">
          <div className="db-prog-bar">
            <div className="db-prog-bar__fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          <span className="db-prog-label">{progressPercentage}%</span>
        </div>
        <p className="db-lessons-count">
          {lessonsCompleted} / {course.totalLessons} lessons
        </p>

        <Link to={`/student/player?course=${course.id}`} className="db-btn-continue">
          Continue →
        </Link>
      </div>
    </div>
  );
}

/* ── Completed course row ── */
function CompletedRow({ enrollment }) {
  const { course, completedAt, certificate } = enrollment;
  const lvl = LEVEL_COLOR[course.level] || LEVEL_COLOR.BEGINNER;

  return (
    <div className="db-completed-row">
      <div className="db-completed-row__thumb">
        <img src={course.thumbnailUrl} alt={course.title} />
        <span className="db-completed-check">✓</span>
      </div>
      <div className="db-completed-row__info">
        <h4 className="db-completed-row__title">{course.title}</h4>
        <p className="db-completed-row__meta">
          <span style={{ background: lvl.bg, color: lvl.color, ...badgeSx }}>
            {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
          </span>
          <span>· {course.instructor.firstname} {course.instructor.lastname}</span>
          <span>· Completed {formatDate(completedAt)}</span>
        </p>
      </div>
      <div className="db-completed-row__right">
        {certificate && (
          <>
            <span className="db-score-badge">{certificate.finalScore}%</span>
            <Link to="/student/certificate" className="db-cert-link">View Certificate →</Link>
          </>
        )}
      </div>
    </div>
  );
}

const badgeSx = {
  fontSize: 10,
  fontWeight: 700,
  padding: "2px 8px",
  borderRadius: 20,
  letterSpacing: "0.04em",
};

/* ── Main dashboard ── */
export default function Dashboard() {
  const user = MOCK_USER;
  const completed  = MOCK_ENROLLMENTS.filter((e) => e.completed);
  const inProgress = MOCK_ENROLLMENTS.filter((e) => !e.completed);

  const totalHours  = MOCK_ENROLLMENTS.reduce((s, e) => s + (e.course.totalLessons * 0.5), 0);
  const avgProgress = inProgress.length
    ? Math.round(inProgress.reduce((s, e) => s + e.progressPercentage, 0) / inProgress.length)
    : 0;

  const [tab, setTab] = useState("progress");

  return (
    <div className="db-page">
      {/* ── Hero / User info ── */}
      <div className="db-hero">
        {/* Avatar */}
        <div className="db-avatar-wrap">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="db-avatar" />
          ) : (
            <div className="db-avatar db-avatar--initials">
              {getInitials(user)}
            </div>
          )}
          <span className="db-avatar__status" title="Active" />
        </div>

        <div className="db-hero__info">
          <div className="db-hero__name-row">
            <h1 className="db-hero__name">
              {user.firstname} {user.lastname}
            </h1>
            <span className="db-role-badge">{user.role}</span>
          </div>
          <p className="db-hero__email">{user.email}</p>
          <p className="db-hero__joined">Member since {formatDate(user.createdAt)}</p>
        </div>

        <div className="db-kpis">
          <div className="db-kpi">
            <span className="db-kpi__val">{MOCK_ENROLLMENTS.length}</span>
            <span className="db-kpi__label">Courses</span>
          </div>
          <div className="db-kpi">
            <span className="db-kpi__val">{completed.length}</span>
            <span className="db-kpi__label">Completed</span>
          </div>
          <div className="db-kpi">
            <span className="db-kpi__val">{Math.round(totalHours)}h</span>
            <span className="db-kpi__label">Learning</span>
          </div>
          <div className="db-kpi">
            <span className="db-kpi__val">{completed.length}</span>
            <span className="db-kpi__label">Certificates</span>
          </div>
        </div>
      </div>



      <div className="db-tabs-row">
        <button
          className={`db-tab ${tab === "progress" ? "db-tab--active" : ""}`}
          onClick={() => setTab("progress")}
        >
          In Progress
          <span className="db-tab__count">{inProgress.length}</span>
        </button>
        <button
          className={`db-tab ${tab === "completed" ? "db-tab--active" : ""}`}
          onClick={() => setTab("completed")}
        >
          Completed
          <span className="db-tab__count">{completed.length}</span>
        </button>
      </div>

      <div className="db-content">
        {tab === "progress" && (
          <>
            {inProgress.length === 0 ? (
              <div className="db-empty">
                <p>No courses in progress. Browse the catalog to start learning!</p>
                <Link to="/student/courses" className="db-btn-browse">Browse Courses</Link>
              </div>
            ) : (
              <div className="db-cards-grid">
                {inProgress.map((e) => (
                  <ProgressCard key={e.id} enrollment={e} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "completed" && (
          <>
            {completed.length === 0 ? (
              <div className="db-empty">
                <span>🏆</span>
                <p>You haven't completed any courses yet. Keep going!</p>
              </div>
            ) : (
              <div className="db-completed-list">
                {completed.map((e) => (
                  <CompletedRow key={e.id} enrollment={e} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}