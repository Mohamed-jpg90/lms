import React, { useState } from "react";
// import "./coursedetail.css";

/* ─────────────────────────────────────────
   In a real app you'd receive the course id
   via useParams() and fetch from the API.
   Here we use a single mock object whose
   shape matches the Course entity exactly.
───────────────────────────────────────── */
const MOCK_COURSE = {
  id: 1,
  title: "React from Zero to Hero",
  description:
    "Master React from the very basics to advanced patterns used in production apps. You'll build real projects, understand the mental model behind hooks, context, routing, and performance optimisation — and leave with a portfolio-ready full-stack application.",
  thumbnailUrl:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=85",
  published: true,
  free: false,
  totalLessons: 42,
  totalDuration: 1380,
  level: "BEGINNER",
  createdAt: "2024-11-10T09:00:00",
  instructor: {
    id: 1,
    firstName: "Sara",
    lastName: "Ahmed",
    avatarUrl: null,
    bio: "Senior Front-End Engineer with 8 years of industry experience. Former tech lead at two Y-Combinator startups. Passionate about teaching and making complex ideas accessible.",
    totalCourses: 5,
    totalStudents: 12400,
  },
  category: { id: 1, name: "Web Development" },
  price: 49.99,
  rating: 4.8,
  reviewCount: 1247,
  enrollments: new Array(1240),
  whatYouLearn: [
    "Build real-world React applications from scratch",
    "Understand hooks: useState, useEffect, useContext, useRef, useMemo, useCallback",
    "Master React Router v6 for multi-page SPAs",
    "Manage global state with Context API and useReducer",
    "Optimise performance with React.memo and lazy loading",
    "Connect your app to a REST API with error handling",
    "Write clean, maintainable, testable component code",
    "Deploy your application to production",
  ],
  requirements: [
    "Basic HTML & CSS knowledge",
    "Familiarity with JavaScript (ES6+)",
    "No prior React experience needed",
  ],
  curriculum: [
    {
      id: 1,
      title: "Getting Started",
      lessons: [
        { id: 1, title: "Introduction & Course Overview",    duration: 10, preview: true  },
        { id: 2, title: "Environment Setup",                 duration: 8,  preview: true  },
        { id: 3, title: "Your First React App",              duration: 14, preview: false },
      ],
    },
    {
      id: 2,
      title: "React Fundamentals",
      lessons: [
        { id: 4, title: "JSX Deep Dive",                    duration: 20, preview: false },
        { id: 5, title: "Components & Props",               duration: 25, preview: false },
        { id: 6, title: "State with useState",              duration: 30, preview: false },
        { id: 7, title: "Handling Events",                  duration: 18, preview: false },
      ],
    },
    {
      id: 3,
      title: "Hooks & Side Effects",
      lessons: [
        { id: 8,  title: "useEffect Explained",             duration: 35, preview: false },
        { id: 9,  title: "Custom Hooks",                    duration: 28, preview: false },
        { id: 10, title: "useRef & the DOM",                duration: 22, preview: false },
      ],
    },
    {
      id: 4,
      title: "Routing & State Management",
      lessons: [
        { id: 11, title: "React Router v6",                 duration: 40, preview: false },
        { id: 12, title: "Context API",                     duration: 32, preview: false },
        { id: 13, title: "useReducer",                      duration: 28, preview: false },
      ],
    },
    {
      id: 5,
      title: "Final Project",
      lessons: [
        { id: 14, title: "Project Architecture",            duration: 20, preview: false },
        { id: 15, title: "Build & Deploy",                  duration: 86, preview: false },
      ],
    },
  ],
  tags: ["React", "JavaScript", "Frontend", "Hooks", "SPA"],
};

/* ── helpers ── */
function fmtDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function StarRating({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  return (
    <span className="cd-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`cd-star ${i < full ? "cd-star--full" : i === full && half ? "cd-star--half" : "cd-star--empty"}`}
        ></span>
      ))}
    </span>
  );
}

const LEVEL_META = {
  BEGINNER:     { label: "Beginner",     bg: "#dcfce7", color: "#15803d" },
  INTERMEDIATE: { label: "Intermediate", bg: "#fef3c7", color: "#92400e" },
  ADVANCED:     { label: "Advanced",     bg: "#fee2e2", color: "#991b1b" },
};

function getInitials(u) {
  return `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase();
}

/* ── Curriculum section ── */
function CurriculumSection({ section, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const totalDur = section.lessons.reduce((s, l) => s + l.duration, 0);

  return (
    <div className={`cd-section ${open ? "cd-section--open" : ""}`}>
      <button className="cd-section__header" onClick={() => setOpen((v) => !v)}>
        <span className="cd-section__chevron">{open ? "▾" : "▸"}</span>
        <span className="cd-section__title">{section.title}</span>
        <span className="cd-section__meta">
          {section.lessons.length} lessons · {fmtDuration(totalDur)}
        </span>
      </button>

      {open && (
        <div className="cd-section__lessons">
          {section.lessons.map((lesson) => (
            <div key={lesson.id} className="cd-lesson-row">
              <span className="cd-lesson-row__icon">{lesson.preview ? "▶" : "🔒"}</span>
              <span className="cd-lesson-row__title">{lesson.title}</span>
              {lesson.preview && (
                <span className="cd-lesson-row__preview">Preview</span>
              )}
              <span className="cd-lesson-row__dur">{fmtDuration(lesson.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function CourseDetails() {
  const course = MOCK_COURSE; // replace with: const { id } = useParams(); fetch(`/api/courses/${id}`)
  const lvl    = LEVEL_META[course.level] || LEVEL_META.BEGINNER;
  const isEnrolled = true; // replace with real enrollment check

  const totalSections = course.curriculum.length;
  const totalLessons  = course.curriculum.reduce((s, sec) => s + sec.lessons.length, 0);

  const handleCTA = () => {
    window.location.href = `/student/player?course=${course.id}`;
  };

  return (
    <div className="cd-page">
      {/* ════════════════════════════════
          HERO  — dark banner
      ════════════════════════════════ */}
      <div className="cd-hero">
        <div className="cd-hero__content">
          {/* Breadcrumb */}
          {/* <div className="cd-breadcrumb">
            <a href="/student/courses" className="cd-breadcrumb__link">Courses</a>
            <span className="cd-breadcrumb__sep">›</span>
            <span className="cd-breadcrumb__cur">{course.category.name}</span>
          </div> */}

          {/* Category + level */}
          <div className="cd-hero__badges">
            <span className="cd-cat-badge">{course.category.name}</span>
            <span
              className="cd-level-badge"
              style={{ background: lvl.bg, color: lvl.color }}
            >
              {lvl.label}
            </span>
            {course.free && <span className="cd-free-badge">Free</span>}
          </div>

          {/* Title */}
          <h1 className="cd-hero__title">{course.title}</h1>

          {/* Short description */}
          <p className="cd-hero__desc">{course.description}</p>

          {/* Rating row */}
          <div className="cd-hero__rating-row">
            <StarRating rating={course.rating} />
            <span className="cd-hero__rating-val">{course.rating}</span>
            <span className="cd-hero__rating-count">({course.reviewCount.toLocaleString()} reviews)</span>
            <span className="cd-hero__dot">·</span>
            <span className="cd-hero__students">
              {course.enrollments.length.toLocaleString()} students
            </span>
          </div>

          {/* Instructor line */}
          <p className="cd-hero__inst-line">
            Created by{" "}
            <span className="cd-hero__inst-name">
              {course.instructor.firstName} {course.instructor.lastName}
            </span>
          </p>

          {/* Meta chips */}
          <div className="cd-hero__chips">
            <span className="cd-chip">📅 Updated {fmtDate(course.createdAt)}</span>
            <span className="cd-chip">🌍 English</span>
            <span className="cd-chip">⏱ {fmtDuration(course.totalDuration)} total</span>
            <span className="cd-chip">📚 {totalLessons} lessons</span>
          </div>
        </div>

        {/* Course thumbnail (desktop: floats right) */}
        {/* <div className="cd-hero__card">
          <div className="cd-hero__thumb-wrap">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="cd-hero__thumb"
            />
            <div className="cd-hero__thumb-overlay">
              <span className="cd-play-icon">▶</span>
            </div>
          </div>

          <div className="cd-hero__cta-block">
            {!course.free && (
              <div className="cd-price-row">
                <span className="cd-price">${course.price}</span>
              </div>
            )}
            {course.free && (
              <div className="cd-price-row">
                <span className="cd-price cd-price--free">Free</span>
              </div>
            )}

            <button className="cd-cta-btn" onClick={handleCTA}>
              {isEnrolled ? "▶  Go to Course" : course.free ? "Enroll Free" : "Enroll Now"}
            </button>

            {!isEnrolled && !course.free && (
              <p className="cd-cta-sub">30-day money-back guarantee</p>
            )}

            <div className="cd-includes">
              <p className="cd-includes__title">This course includes:</p>
              <ul className="cd-includes__list">
                <li>⏱ {fmtDuration(course.totalDuration)} on-demand video</li>
                <li>📚 {totalLessons} lessons across {totalSections} sections</li>
                <li>📄 Downloadable resources</li>
                <li>📱 Access on mobile & desktop</li>
                <li>🏆 Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>

      {/* ════════════════════════════════
          BODY
      ════════════════════════════════ */}
      <div className="cd-body">
        <div className="cd-body__main">

          {/* ── What you'll learn ── */}
          <section className="cd-section-block">
            <h2 className="cd-section-block__title">What you'll learn</h2>
            <ul className="cd-learn-grid">
              {course.whatYouLearn.map((item, i) => (
                <li key={i} className="cd-learn-item">
                  <span className="cd-learn-item__tick">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Requirements ── */}
          <section className="cd-section-block">
            <h2 className="cd-section-block__title">Requirements</h2>
            <ul className="cd-req-list">
              {course.requirements.map((r, i) => (
                <li key={i} className="cd-req-item">
                  <span className="cd-req-item__dot" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Curriculum ── */}
          <section className="cd-section-block">
            <h2 className="cd-section-block__title">Course Curriculum</h2>
            <p className="cd-section-block__sub">
              {totalSections} sections · {totalLessons} lessons ·{" "}
              {fmtDuration(course.totalDuration)} total length
            </p>

            <div className="cd-curriculum">
              {course.curriculum.map((sec, i) => (
                <CurriculumSection key={sec.id} section={sec} defaultOpen={i === 0} />
              ))}
            </div>
          </section>

          {/* ── Tags ── */}
          <section className="cd-section-block">
            <h2 className="cd-section-block__title">Tags</h2>
            <div className="cd-tags-row">
              {course.tags.map((tag) => (
                <span key={tag} className="cd-tag">{tag}</span>
              ))}
            </div>
          </section>

          {/* ── Instructor bio ── */}
          <section className="cd-section-block">
            <h2 className="cd-section-block__title">Your Instructor</h2>
            <div className="cd-instructor-card">
              <div className="cd-instructor-card__avatar">
                {course.instructor.avatarUrl ? (
                  <img src={course.instructor.avatarUrl} alt="instructor" />
                ) : (
                  <div className="cd-instructor-card__initials">
                    {getInitials(course.instructor)}
                  </div>
                )}
              </div>
              <div className="cd-instructor-card__info">
                <h3 className="cd-instructor-card__name">
                  {course.instructor.firstName} {course.instructor.lastName}
                </h3>
                <div className="cd-instructor-card__stats">
                  <span>🎓 {course.instructor.totalStudents.toLocaleString()} students</span>
                  <span>📚 {course.instructor.totalCourses} courses</span>
                </div>
                <p className="cd-instructor-card__bio">{course.instructor.bio}</p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Sticky sidebar CTA (desktop) ── */}
        <aside className="cd-sticky-sidebar">
          <div className="cd-sticky-sidebar__inner">
            {!course.free && (
              <p className="cd-sidebar-price">${course.price}</p>
            )}
            {course.free && (
              <p className="cd-sidebar-price cd-price--free">Free</p>
            )}

            <button className="cd-cta-btn cd-cta-btn--sidebar" onClick={handleCTA}>
              {isEnrolled ? "▶  Go to Course" : course.free ? "Enroll Free" : "Enroll Now"}
            </button>

            {!isEnrolled && !course.free && (
              <p className="cd-cta-sub cd-cta-sub--sm">30-day money-back guarantee</p>
            )}

            <div className="cd-sidebar-stats">
              <div className="cd-sidebar-stat">
                <span className="cd-sidebar-stat__val">{course.rating}</span>
                <span className="cd-sidebar-stat__label">Rating</span>
              </div>
              <div className="cd-sidebar-stat">
                {/* <span className="cd-sidebar-stat__icon"></span> */}
                <span className="cd-sidebar-stat__val">
                  {(course.enrollments.length / 1000).toFixed(1)}k
                </span>
                <span className="cd-sidebar-stat__label">Students</span>
              </div>
              <div className="cd-sidebar-stat">
                {/* <span className="cd-sidebar-stat__icon"></span> */}
                <span className="cd-sidebar-stat__val">{totalLessons}</span>
                <span className="cd-sidebar-stat__label">Lessons</span>
              </div>
              <div className="cd-sidebar-stat">
                <span className="cd-sidebar-stat__val">{fmtDuration(course.totalDuration)}</span>
                <span className="cd-sidebar-stat__label">Duration</span>
              </div>
            </div>

            <div className="cd-includes cd-includes--sidebar">
              <p className="cd-includes__title">Includes:</p>
              <ul className="cd-includes__list">
                <li> {fmtDuration(course.totalDuration)} video</li>
                <li> Downloadable resources</li>
                <li> Mobile & desktop access</li>
                <li> Certificate</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Mobile sticky CTA ── */}
      <div className="cd-mobile-cta">
        <div className="cd-mobile-cta__left">
          {course.free
            ? <span className="cd-price cd-price--free cd-price--sm">Free</span>
            : <span className="cd-price cd-price--sm">${course.price}</span>
          }
        </div>
        <button className="cd-cta-btn cd-cta-btn--mobile" onClick={handleCTA}>
          {isEnrolled ? "▶  Go to Course" : course.free ? "Enroll Free" : "Enroll Now"}
        </button>
      </div>
    </div>
  );
}