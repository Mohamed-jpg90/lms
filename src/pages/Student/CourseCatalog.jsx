import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

// const MOCK_COURSES = [
//   {
//     id: 1,
//     title: "React from Zero to Hero",
//     description: "Master modern React with hooks, context, and real-world project patterns that scale.",
//     thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
//     published: true,
//     free: false,
//     totalLessons: 42,
//     totalDuration: 1380,
//     level: "BEGINNER",
//     createdAt: "2024-11-10T09:00:00",
//     instructor: { id: 1, firstName: "Sara", lastName: "Ahmed" },
//     category: { id: 1, name: "Web Development" },
//     enrollments: new Array(1240),
//   },
//   {
//     id: 2,
//     title: "Spring Boot & Microservices",
//     description: "Build production-grade Java microservices with Spring Boot, Docker, and Kubernetes.",
//     thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
//     published: true,
//     free: false,
//     totalLessons: 58,
//     totalDuration: 2100,
//     level: "ADVANCED",
//     createdAt: "2024-10-01T09:00:00",
//     instructor: { id: 2, firstName: "Karim", lastName: "Hassan" },
//     category: { id: 2, name: "Backend" },
//     enrollments: new Array(870),
//   },
//   {
//     id: 3,
//     title: "UI/UX Design Fundamentals",
//     description: "Learn design thinking, Figma, user research, and prototyping from scratch.",
//     thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
//     published: true,
//     free: true,
//     totalLessons: 24,
//     totalDuration: 720,
//     level: "BEGINNER",
//     createdAt: "2024-12-05T09:00:00",
//     instructor: { id: 3, firstName: "Nour", lastName: "El-Sayed" },
//     category: { id: 3, name: "Design" },
//     enrollments: new Array(3100),
//   },
//   {
//     id: 4,
//     title: "Data Structures & Algorithms",
//     description: "Crack coding interviews with deep dives into arrays, trees, graphs and dynamic programming.",
//     thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
//     published: true,
//     free: false,
//     totalLessons: 76,
//     totalDuration: 2880,
//     level: "INTERMEDIATE",
//     createdAt: "2024-09-15T09:00:00",
//     instructor: { id: 4, firstName: "Omar", lastName: "Fathy" },
//     category: { id: 4, name: "Computer Science" },
//     enrollments: new Array(2050),
//   },
//   {
//     id: 5,
//     title: "Machine Learning with Python",
//     description: "From linear regression to neural networks — build real ML models with scikit-learn and TensorFlow.",
//     thumbnailUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
//     published: true,
//     free: false,
//     totalLessons: 61,
//     totalDuration: 2460,
//     level: "ADVANCED",
//     createdAt: "2024-08-20T09:00:00",
//     instructor: { id: 5, firstName: "Layla", lastName: "Morsi" },
//     category: { id: 5, name: "Data Science" },
//     enrollments: new Array(1580),
//   },
//   {
//     id: 6,
//     title: "Git & GitHub for Teams",
//     description: "Version control, branching strategies, pull requests, CI/CD basics and team workflows.",
//     thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80",
//     published: true,
//     free: true,
//     totalLessons: 18,
//     totalDuration: 420,
//     level: "BEGINNER",
//     createdAt: "2025-01-08T09:00:00",
//     instructor: { id: 1, firstName: "Sara", lastName: "Ahmed" },
//     category: { id: 1, name: "Web Development" },
//     enrollments: new Array(4200),
//   },
// ];


const token = localStorage.getItem("token")

const CATEGORIES = ["All", "Web Development", "Backend", "Design", "Computer Science", "Data Science"];
const LEVELS = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatCount(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
}

const LEVEL_LABEL = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

function CourseCard({ course }) {
  const studentCount = course.enrollments?.length ?? 0;

  return (
    <article className="course-card">
      <div className="course-card__thumb">
        <img src={course.thumbnailUrl} alt={course.title} loading="lazy" />
        <div className="course-card__badges">
          {course.free && <span className="badge badge--free">Free</span>}
          <span className={`badge badge--level badge--${course.level.toLowerCase()}`}>
            {LEVEL_LABEL[course.level]}
          </span>
        </div>
      </div>

      <div className="course-card__body">
        <p className="course-card__category">{course.category.name}</p>
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__desc">{course.description}</p>

        <p className="course-card__instructor">
          {course.instructor.firstName} {course.instructor.lastName}
        </p>

        <div className="course-card__meta">
          <span className="meta-item">
            <span className="meta-icon">▶</span>
            {course.totalLessons} lessons
          </span>
          <span className="meta-item">
            <span className="meta-icon">⏱</span>
            {formatDuration(course.totalDuration)}
          </span>
          <span className="meta-item">
            <span className="meta-icon">👤</span>
            {formatCount(studentCount)}
          </span>
        </div>

        <div className="course-card__footer">


          <Link
            className="btn-enroll db-btn-continue"
            to={`/student/details/${course.id}`}
          >
            {course.free ? "Enroll Free" : "View Course"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function CourseCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);


  const [courses, setCourses] = useState([]);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const formatted = res.data.map((c) => ({
          id: c.id,
          title: c.title || "",
          description: c.description || "",
          thumbnailUrl: `http://localhost:8080/${c.thumbnailUrl}`,
          free: c.free,
          totalLessons: c.totalLessons || 0,
          totalDuration: c.totalDuration || 0,
          level: c.level || "BEGINNER",

          instructor: {
            firstName: c.instructorName?.split(" ")[0] || "Unknown",
            lastName: c.instructorName?.split(" ")[1] || "",
          },

          category: {
            name: c.categoryName || "Unknown",
          },

          enrollments: [],
        }));

        setCourses(formatted);
      } catch (err) {
        console.log("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);


  // const filtered = useMemo(() => {
  //   return courses.filter((c) => {
  //     if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
  //     if (category !== "All" && c.category.name !== category) return false;
  //     if (level !== "All" && c.level !== level) return false;
  //     if (freeOnly && !c.free) return false;
  //     return true;
  //   });
  // }, [search, category, level, freeOnly]);


  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const keyword = search.trim().toLowerCase();

      const matchesSearch =
        c.title.toLowerCase().includes(keyword) ||
        `${c.instructor.firstName} ${c.instructor.lastName}`
          .toLowerCase()
          .includes(keyword) ||
        c.category.name.toLowerCase().includes(keyword);

      const matchesCategory =
        category === "All" || c.category.name === category;

      const matchesLevel =
        level === "All" || c.level === level;

      const matchesFree =
        !freeOnly || c.free === true;

      return (
        (!search || matchesSearch) &&
        matchesCategory &&
        matchesLevel &&
        matchesFree
      );
    });
  }, [courses, search, category, level, freeOnly]);


  return (
    <div className="cd-page">
      <div className=" db-hero ">
        <div>
          <h1 className="db-hero__name">Course Catalog</h1>
          <p className="catalog-header__sub">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="catalog-filters">
        <div className="filter-search">
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-search__input"
          />
          {search && (
            <button className="filter-search__clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill${category === cat ? " pill--active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          className="filter-select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l === "All" ? "All levels" : LEVEL_LABEL[l]}
            </option>
          ))}
        </select>

        <label className="filter-toggle">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
          />
          <span className="filter-toggle__track" />
          <span className="filter-toggle__label">Free only</span>
        </label>
      </div>

      {filtered.length > 0 ? (
        <div className="catalog-grid">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          {/* <span className="catalog-empty__icon"></span> */}
          <p>No courses match your filters.</p>
          <button
            className="btn-reset"
            onClick={() => { setSearch(""); setCategory("All"); setLevel("All"); setFreeOnly(false); }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}