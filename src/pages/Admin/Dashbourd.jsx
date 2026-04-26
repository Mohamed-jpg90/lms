import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";


function AccessDenied({ navigate }) {
  return (
    <div className="ad-denied">
      <div className="ad-denied__card">
        <h2 className="ad-denied__title">Admin Access Only</h2>
        <p className="ad-denied__msg">
          You don't have permission to view this page.
          Only <strong>Admins</strong> can access the admin panel.
        </p>
        <div className="ad-denied__actions">
          <button className="ad-btn-primary" onClick={() => navigate("/student/dashboard")}>
            Go to Dashboard
          </button>
          <button className="ad-btn-ghost" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}


const MOCK_ADMIN = {
  firstName: "Admin",
  lastName:  "User",
  email:     "admin@lms.com",
  role:      "ADMIN",
};

const MOCK_USERS = [
  { id: 1,  firstName: "Youssef", lastName: "Zienhoum", email: "youssef@mail.com", role: "STUDENT",    active: true,  createdAt: "2024-09-01" },
  { id: 2,  firstName: "Sara",    lastName: "Ahmed",    email: "sara@lms.com",     role: "INSTRUCTOR", active: true,  createdAt: "2023-06-01" },
  { id: 3,  firstName: "Nour",    lastName: "Hassan",   email: "nour@mail.com",    role: "STUDENT",    active: true,  createdAt: "2025-01-10" },
  { id: 4,  firstName: "Omar",    lastName: "Fathy",    email: "omar@mail.com",    role: "STUDENT",    active: false, createdAt: "2024-11-20" },
  { id: 5,  firstName: "Karim",   lastName: "Hassan",   email: "karim@lms.com",    role: "INSTRUCTOR", active: true,  createdAt: "2023-09-15" },
  { id: 6,  firstName: "Lina",    lastName: "Mostafa",  email: "lina@mail.com",    role: "STUDENT",    active: true,  createdAt: "2025-03-12" },
];

const MOCK_PENDING = [
  { id: 7,  firstName: "Hassan",  lastName: "Ali",   email: "hassan@mail.com", bio: "10 years in backend dev, Spring Boot expert.", submittedAt: "2025-04-18" },
  { id: 8,  firstName: "Mona",    lastName: "Saad",  email: "mona@mail.com",   bio: "UX designer and React instructor at Udemy.",    submittedAt: "2025-04-19" },
  { id: 9,  firstName: "Tarek",   lastName: "Nabil", email: "tarek@mail.com",  bio: "Data scientist with 5 published ML courses.",  submittedAt: "2025-04-20" },
];

const MOCK_COURSES = [
  { id: 1, title: "React from Zero to Hero",       instructor: "Sara Ahmed",  category: "Web Development", published: true,  enrollments: 1240, revenue: 6200  },
  { id: 2, title: "Spring Boot & Microservices",   instructor: "Karim Hassan",category: "Backend",         published: true,  enrollments: 870,  revenue: 4350  },
  { id: 3, title: "UI/UX Design Fundamentals",     instructor: "Sara Ahmed",  category: "Design",          published: true,  enrollments: 3100, revenue: 0     },
  { id: 4, title: "Data Structures & Algorithms",  instructor: "Karim Hassan",category: "CS",              published: true,  enrollments: 2050, revenue: 6150  },
  { id: 5, title: "Git & GitHub for Teams",        instructor: "Sara Ahmed",  category: "DevOps",          published: false, enrollments: 0,    revenue: 0     },
];

const MOCK_CATEGORIES = [
  { id: 1, name: "Web Development", courseCount: 8  },
  { id: 2, name: "Backend",         courseCount: 5  },
  { id: 3, name: "Design",          courseCount: 3  },
  { id: 4, name: "Data Science",    courseCount: 4  },
  { id: 5, name: "Computer Science",courseCount: 6  },
  { id: 6, name: "DevOps",          courseCount: 2  },
];

const RECENT_SIGNUPS = [
  { id: 1, name: "Youssef Zienhoum", role: "STUDENT",    date: "2025-04-20" },
  { id: 2, name: "Mona Saad",        role: "INSTRUCTOR",  date: "2025-04-19" },
  { id: 3, name: "Tarek Nabil",      role: "INSTRUCTOR",  date: "2025-04-19" },
  { id: 4, name: "Lina Mostafa",     role: "STUDENT",    date: "2025-04-18" },
  { id: 5, name: "Hassan Ali",       role: "INSTRUCTOR",  date: "2025-04-18" },
];

const RECENT_PURCHASES = [
  { id: 1, student: "Youssef Zienhoum", course: "React from Zero to Hero",      amount: 29.99, date: "2025-04-20" },
  { id: 2, student: "Omar Fathy",       course: "Spring Boot & Microservices",  amount: 49.99, date: "2025-04-19" },
  { id: 3, student: "Nour Hassan",      course: "Data Structures & Algorithms", amount: 34.99, date: "2025-04-18" },
  { id: 4, student: "Lina Mostafa",     course: "Spring Boot & Microservices",  amount: 49.99, date: "2025-04-17" },
];


function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatK(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
}

const ROLE_STYLE = {
  STUDENT:    { color: "#1d4ed8", bg: "#dbeafe" },
  INSTRUCTOR: { color: "#7c3aed", bg: "#ede9fe" },
  ADMIN:      { color: "#991b1b", bg: "#fee2e2" },
};


function KpiCard({ label, value, sub, color, onClick }) {
  return (
    <div className="ad-kpi-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="ad-kpi-card__info">
        <span className="ad-kpi-card__val">{value}</span>
        <span className="ad-kpi-card__label">{label}</span>
        {sub && <span className="ad-kpi-card__sub">{sub}</span>}
      </div>
    </div>
  );
}

function ServiceSection({ title, sub, linkLabel, linkPath, navigate, children, alert }) {
  return (
    <div className="ad-section">
      <div className="ad-section__header">
        <div className="ad-section__header-left">
          {/* <span className="ad-section__icon">{icon}</span> */}
          <div>
            <h2 className="ad-section__title">{title}</h2>
            {sub && <p className="ad-section__sub">{sub}</p>}
          </div>
          {alert > 0 && <span className="ad-section__alert">{alert}</span>}
        </div>
        <button className="ad-btn-link" onClick={() => navigate(linkPath)}>
          {linkLabel} →
        </button>
      </div>
      {children}
    </div>
  );
}


export default function Dashbourd() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const role = currentUser?.role?.toUpperCase();
  if (!currentUser || role !== "ADMIN") {
    return <AccessDenied navigate={navigate} />;
  }

  const admin = {
    ...MOCK_ADMIN,
    firstName: currentUser.firstname || MOCK_ADMIN.firstName,
    lastName:  currentUser.lastname  || MOCK_ADMIN.lastName,
    email:     currentUser.email     || MOCK_ADMIN.email,
  };

  /* ── Derived stats ── */
  const totalUsers       = MOCK_USERS.length;
  const totalStudents    = MOCK_USERS.filter((u) => u.role === "STUDENT").length;
  const totalInstructors = MOCK_USERS.filter((u) => u.role === "INSTRUCTOR").length;
  const blockedUsers     = MOCK_USERS.filter((u) => !u.active).length;
  const totalCourses     = MOCK_COURSES.length;
  const publishedCourses = MOCK_COURSES.filter((c) => c.published).length;
  const totalEnrollments = MOCK_COURSES.reduce((s, c) => s + c.enrollments, 0);
  const totalRevenue     = MOCK_COURSES.reduce((s, c) => s + c.revenue, 0);
  const pendingCount     = MOCK_PENDING.length;

  /* ── Local state for quick actions ── */
  const [pendingList, setPendingList] = useState(MOCK_PENDING);
  const [approvedIds, setApprovedIds] = useState(new Set());
  const [rejectedIds, setRejectedIds] = useState(new Set());

  const handleApprove = (id) => {
    setApprovedIds((prev) => new Set([...prev, id]));
    setPendingList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReject = (id) => {
    setRejectedIds((prev) => new Set([...prev, id]));
    setPendingList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="ad-page">
      <div className="ad-hero">
        <div className="ad-hero__left">
          <div className="ad-hero__avatar-wrap">
            <div className="ad-hero__avatar">{getInitials(admin.firstName, admin.lastName)}</div>
            <span className="ad-hero__status" />
          </div>
          <div>
            <p className="ad-hero__greeting">Admin Panel</p>
            <h1 className="ad-hero__name">{admin.firstName} {admin.lastName}</h1>
            <p className="ad-hero__email">{admin.email}</p>
          </div>
        </div>

        {/* KPI pills in hero */}
        <div className="ad-hero__kpis">
          <div className="ad-hero-kpi">
            <span className="ad-hero-kpi__val">{totalUsers}</span>
            <span className="ad-hero-kpi__label">Users</span>
          </div>
          <div className="ad-hero-kpi">
            <span className="ad-hero-kpi__val">{totalCourses}</span>
            <span className="ad-hero-kpi__label">Courses</span>
          </div>
          <div className="ad-hero-kpi ad-hero-kpi--alert">
            <span className="ad-hero-kpi__val">{pendingCount}</span>
            <span className="ad-hero-kpi__label">Pending</span>
          </div>
          <div className="ad-hero-kpi">
            <span className="ad-hero-kpi__val">${formatK(totalRevenue)}</span>
            <span className="ad-hero-kpi__label">Revenue</span>
          </div>
        </div>
      </div>


      <div className="ad-kpi-strip">
        <KpiCard icon="" label="Total Users"     value={totalUsers}       sub={`${blockedUsers} blocked`}       color="#1d4ed8" onClick={() => navigate("/admin/users")} />
        <KpiCard icon="" label="Students"        value={totalStudents}    sub={`${totalInstructors} instructors`} color="#7c3aed" onClick={() => navigate("/admin/users")} />
        <KpiCard icon="" label="Courses"         value={totalCourses}     sub={`${publishedCourses} published`}  color="#15803d" onClick={() => navigate("/admin/courses")} />
        <KpiCard icon="" label="Enrollments"     value={formatK(totalEnrollments)} sub="all time"              color="#92400e" onClick={() => navigate("/admin/reports")} />
        <KpiCard icon="" label="Total Revenue"   value={`$${formatK(totalRevenue)}`} sub="all courses"         color="#b45309" onClick={() => navigate("/admin/reports")} />
        <KpiCard icon="" label="Pending Approvals" value={pendingList.length} sub="instructor requests"       color="#991b1b" onClick={() => navigate("/admin/approvals")} />
      </div>


      <div className="ad-body">

        <div className="ad-col ad-col--main">


          <ServiceSection
            title="User Management"
            sub={`${totalUsers} total users · ${blockedUsers} blocked`}
           
            linkLabel="Manage All Users"
            linkPath="/admin/users"
            navigate={navigate}
          >
            <div className="ad-section__body">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.slice(0, 5).map((u) => {
                    const rs = ROLE_STYLE[u.role] || ROLE_STYLE.STUDENT;
                    return (
                      <tr key={u.id} className="ad-table__row">
                        <td>
                          <div className="ad-user-cell">
                            <div className="ad-user-avatar">{getInitials(u.firstName, u.lastName)}</div>
                            <div>
                              <p className="ad-user-name">{u.firstName} {u.lastName}</p>
                              <p className="ad-user-email">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="ad-role-badge" style={{ background: rs.bg, color: rs.color }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`ad-status-dot ${u.active ? "ad-status-dot--active" : "ad-status-dot--blocked"}`}>
                            {u.active ? "Active" : "Blocked"}
                          </span>
                        </td>
                        <td className="ad-date-cell">{formatDate(u.createdAt)}</td>
                        <td>
                          <div className="ad-row-actions">
                            <button className="ad-action-btn" onClick={() => navigate("/admin/users")}>Edit</button>
                            <button className="ad-action-btn ad-action-btn--danger">
                              {u.active ? "Block" : "Unblock"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="ad-section__table-footer">
                <button className="ad-btn-ghost" onClick={() => navigate("/admin/users")}>
                  View All {totalUsers} Users →
                </button>
              </div>
            </div>
          </ServiceSection>


          <ServiceSection
            title="Instructor Approvals"
            sub="Pending instructor account requests"
           
            linkLabel="Manage Approvals"
            linkPath="/admin/approvals"
            navigate={navigate}
            alert={pendingList.length}
          >
            <div className="ad-section__body">
              {pendingList.length === 0 ? (
                <div className="ad-empty-state">
                  
                  <p>All caught up! No pending approvals.</p>
                </div>
              ) : (
                <div className="ad-approval-list">
                  {pendingList.map((p) => (
                    <div key={p.id} className="ad-approval-card">
                      <div className="ad-approval-card__avatar">{getInitials(p.firstName, p.lastName)}</div>
                      <div className="ad-approval-card__info">
                        <p className="ad-approval-card__name">{p.firstName} {p.lastName}</p>
                        <p className="ad-approval-card__email">{p.email}</p>
                        <p className="ad-approval-card__bio">"{p.bio}"</p>
                        <p className="ad-approval-card__date">Submitted {formatDate(p.submittedAt)}</p>
                      </div>
                      <div className="ad-approval-card__actions">
                        <button className="ad-approve-btn" onClick={() => handleApprove(p.id)}> Approve</button>
                        <button className="ad-reject-btn"  onClick={() => handleReject(p.id)}> Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="ad-section__table-footer">
                <button className="ad-btn-ghost" onClick={() => navigate("/admin/approvals")}>
                  Full Approvals Page →
                </button>
              </div>
            </div>
          </ServiceSection>


          <ServiceSection
            title="Course Management"
            sub={`${totalCourses} courses · ${publishedCourses} published`}
            linkLabel="Manage All Courses"
            linkPath="/admin/courses"
            navigate={navigate}
          >
            <div className="ad-section__body">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Instructor</th>
                    <th>Category</th>
                    <th>Students</th>
                    {/* <th>Status</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_COURSES.map((c) => (
                    <tr key={c.id} className="ad-table__row">
                      <td>
                        <span className="ad-course-title">{c.title}</span>
                      </td>
                      <td className="ad-date-cell">{c.instructor}</td>
                      <td>
                        <span className="ad-cat-tag">{c.category}</span>
                      </td>
                      <td className="ad-date-cell">{formatK(c.enrollments)}</td>
                      {/* <td>
                        <span className={`ad-pub-badge ${c.published ? "ad-pub-badge--live" : "ad-pub-badge--draft"}`}>
                          {c.published ? "● Live" : "○ Draft"}
                        </span>
                      </td> */}
                      <td>
                        <div className="ad-row-actions">
                          <button className="ad-action-btn" onClick={() => navigate("/admin/courses")}>Edit</button>
                          <button className="ad-action-btn ad-action-btn--danger">Unpublish</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="ad-section__table-footer">
                <button className="ad-btn-ghost" onClick={() => navigate("/admin/courses")}>
                  View All Courses →
                </button>
              </div>
            </div>
          </ServiceSection>

        </div>


        <aside className="ad-col ad-col--side">



        </aside>
      </div>
    </div>
  );
}