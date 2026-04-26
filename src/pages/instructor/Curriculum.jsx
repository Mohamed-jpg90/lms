import React, { useState } from "react";
import "./instructor.css";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const INITIAL_SECTIONS = [
  {
    id: 1,
    title: "Getting Started",
    lessons: [
      { id: 1, title: "Course Introduction",         type: "VIDEO",    duration: 8,  preview: true,  published: true  },
      { id: 2, title: "Environment Setup",            type: "VIDEO",    duration: 14, preview: true,  published: true  },
      { id: 3, title: "Your First React Component",  type: "VIDEO",    duration: 20, preview: false, published: true  },
    ],
  },
  {
    id: 2,
    title: "Core Concepts",
    lessons: [
      { id: 4, title: "JSX Deep Dive",               type: "VIDEO",    duration: 28, preview: false, published: true  },
      { id: 5, title: "Props & State",               type: "VIDEO",    duration: 32, preview: false, published: true  },
      { id: 6, title: "Core Concepts Quiz",          type: "QUIZ",     duration: 10, preview: false, published: true  },
    ],
  },
  {
    id: 3,
    title: "Hooks",
    lessons: [
      { id: 7, title: "useState & useEffect",        type: "VIDEO",    duration: 40, preview: false, published: false },
      { id: 8, title: "useContext & useReducer",     type: "VIDEO",    duration: 35, preview: false, published: false },
      { id: 9, title: "Hooks Assignment",            type: "ASSIGNMENT", duration: 0,preview: false, published: false },
    ],
  },
];

const TYPE_META = {
  VIDEO:      { icon: "▶",  label: "Video",      color: "#1d4ed8", bg: "#dbeafe" },
  QUIZ:       { icon: "📋", label: "Quiz",       color: "#7c3aed", bg: "#ede9fe" },
  ASSIGNMENT: { icon: "📂", label: "Assignment", color: "#b45309", bg: "#ffedd5" },
  TEXT:       { icon: "📄", label: "Article",    color: "#15803d", bg: "#dcfce7" },
};

/* ─────────────────────────────────────────
   ADD / EDIT LESSON MODAL
───────────────────────────────────────── */
function LessonModal({ lesson, sectionId, onClose, onSave }) {
  const isEdit = !!lesson;
  const [form, setForm] = useState(
    lesson ?? { title: "", type: "VIDEO", duration: "", preview: false, published: false }
  );

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(sectionId, { ...form, id: lesson?.id ?? Date.now(), duration: Number(form.duration) || 0 });
    onClose();
  };

  return (
    <div className="ip-modal-overlay" onClick={onClose}>
      <div className="ip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ip-modal__header">
          <h2 className="ip-modal__title">{isEdit ? "Edit Lesson" : "Add Lesson"}</h2>
          <button className="ip-drawer__close" onClick={onClose}>✕</button>
        </div>
        <div className="ip-modal__body">
          <div className="ip-mfield">
            <label className="ip-mlabel">Title <span style={{ color: "#991b1b" }}>*</span></label>
            <input className="ip-minput" value={form.title} onChange={(e) => onChange("title", e.target.value)} placeholder="Lesson title…" />
          </div>

          <div className="ip-mfield">
            <label className="ip-mlabel">Type</label>
            <div className="ip-type-pills">
              {Object.entries(TYPE_META).map(([val, meta]) => (
                <button key={val} type="button"
                  className={`ip-type-pill ${form.type === val ? "ip-type-pill--active" : ""}`}
                  style={form.type === val ? { background: meta.bg, color: meta.color, borderColor: meta.color } : {}}
                  onClick={() => onChange("type", val)}
                >
                  {meta.icon} {meta.label}
                </button>
              ))}
            </div>
          </div>

          {form.type === "VIDEO" && (
            <div className="ip-mfield">
              <label className="ip-mlabel">Duration (minutes)</label>
              <input className="ip-minput" type="number" min="0"
                value={form.duration} onChange={(e) => onChange("duration", e.target.value)} placeholder="0" />
            </div>
          )}

          <div className="ip-mfield ip-mfield--row">
            <label className="ip-toggle-label">
              <span>Free Preview</span>
              <div className="ip-toggle-wrap">
                <input type="checkbox" checked={form.preview} onChange={(e) => onChange("preview", e.target.checked)} />
                <span className="ip-toggle-track" />
              </div>
            </label>
            <label className="ip-toggle-label">
              <span>Published</span>
              <div className="ip-toggle-wrap">
                <input type="checkbox" checked={form.published} onChange={(e) => onChange("published", e.target.checked)} />
                <span className="ip-toggle-track" />
              </div>
            </label>
          </div>
        </div>
        <div className="ip-modal__footer">
          <button className="ins-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ins-btn-primary" onClick={handleSave} disabled={!form.title.trim()}>
            {isEdit ? "Save Changes" : "Add Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function Curriculum() {
  const [sections,    setSections]    = useState(INITIAL_SECTIONS);
  const [openSections, setOpenSections] = useState(new Set([1, 2, 3]));
  const [modal,        setModal]       = useState(null); // { sectionId, lesson? }
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [dragInfo,     setDragInfo]    = useState(null);

  const toggleSection = (id) => setOpenSections((prev) => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    setSections((prev) => [...prev, { id: Date.now(), title: newSectionTitle.trim(), lessons: [] }]);
    setNewSectionTitle("");
    setAddingSection(false);
  };

  const deleteSection = (sectionId) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const saveLesson = (sectionId, lesson) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const exists = s.lessons.find((l) => l.id === lesson.id);
        return {
          ...s,
          lessons: exists
            ? s.lessons.map((l) => (l.id === lesson.id ? lesson : l))
            : [...s.lessons, lesson],
        };
      })
    );
  };

  const deleteLesson = (sectionId, lessonId) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId ? s : { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
      )
    );
  };

  const togglePublish = (sectionId, lessonId) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId ? s : {
          ...s,
          lessons: s.lessons.map((l) =>
            l.id !== lessonId ? l : { ...l, published: !l.published }
          ),
        }
      )
    );
  };

  /* ── Drag to reorder lessons ── */
  const handleDragStart = (sectionId, lessonId) => setDragInfo({ sectionId, lessonId });

  const handleDragOver = (e, sectionId, lessonId) => {
    e.preventDefault();
    if (!dragInfo || (dragInfo.sectionId === sectionId && dragInfo.lessonId === lessonId)) return;
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId || dragInfo.sectionId !== sectionId) return s;
        const from = s.lessons.findIndex((l) => l.id === dragInfo.lessonId);
        const to   = s.lessons.findIndex((l) => l.id === lessonId);
        if (from === -1 || to === -1) return s;
        const arr = [...s.lessons];
        arr.splice(to, 0, arr.splice(from, 1)[0]);
        return { ...s, lessons: arr };
      })
    );
  };

  const totalLessons = sections.reduce((s, sec) => s + sec.lessons.length, 0);
  const totalDuration = sections.reduce((s, sec) => s + sec.lessons.reduce((a, l) => a + (l.duration || 0), 0), 0);

  return (
    <div className="ins-page">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Curriculum Builder</h1>
          <p className="pg-header__sub">
            {sections.length} sections · {totalLessons} lessons ·{" "}
            {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
          </p>
        </div>
        <button className="ins-btn-primary" onClick={() => setAddingSection(true)}>
          + Add Section
        </button>
      </div>

      <div className="ip-curriculum-wrap">
        {sections.map((section, si) => {
          const isOpen = openSections.has(section.id);
          return (
            <div key={section.id} className="ip-section-card">
              {/* Section header */}
              <div className="ip-section-header" onClick={() => toggleSection(section.id)}>
                <span className="ip-section-num">Section {si + 1}</span>
                <h3 className="ip-section-title">{section.title}</h3>
                <span className="ip-section-meta">{section.lessons.length} lessons</span>
                <div className="ip-section-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="ip-icon-btn" onClick={() => setModal({ sectionId: section.id })} title="Add lesson">＋</button>
                  <button className="ip-icon-btn ip-icon-btn--danger" onClick={() => deleteSection(section.id)} title="Delete section">🗑</button>
                </div>
                <span className={`ip-chevron ${isOpen ? "ip-chevron--open" : ""}`}>›</span>
              </div>

              {/* Lessons */}
              {isOpen && (
                <div className="ip-lessons-list">
                  {section.lessons.length === 0 ? (
                    <div className="ip-empty-lessons">
                      <p>No lessons yet.</p>
                      <button className="ins-btn-ghost" onClick={() => setModal({ sectionId: section.id })}>
                        + Add First Lesson
                      </button>
                    </div>
                  ) : (
                    section.lessons.map((lesson) => {
                      const tm = TYPE_META[lesson.type] || TYPE_META.VIDEO;
                      return (
                        <div
                          key={lesson.id}
                          className={`ip-lesson-row ${!lesson.published ? "ip-lesson-row--draft" : ""}`}
                          draggable
                          onDragStart={() => handleDragStart(section.id, lesson.id)}
                          onDragOver={(e) => handleDragOver(e, section.id, lesson.id)}
                          onDragEnd={() => setDragInfo(null)}
                        >
                          <span className="ip-lesson-drag">⠿</span>

                          <span
                            className="ip-lesson-type-badge"
                            style={{ background: tm.bg, color: tm.color }}
                          >
                            {tm.icon}
                          </span>

                          <span className="ip-lesson-title">{lesson.title}</span>

                          {lesson.preview && (
                            <span className="ip-lesson-preview-tag">Free Preview</span>
                          )}

                          {lesson.duration > 0 && (
                            <span className="ip-lesson-duration">⏱ {lesson.duration}m</span>
                          )}

                          <div className="ip-lesson-actions">
                            <button
                              className={`ip-pub-toggle ${lesson.published ? "ip-pub-toggle--live" : ""}`}
                              onClick={() => togglePublish(section.id, lesson.id)}
                            >
                              {lesson.published ? "● Live" : "○ Draft"}
                            </button>
                            <button className="ip-icon-btn" onClick={() => setModal({ sectionId: section.id, lesson })} title="Edit">✏</button>
                            <button className="ip-icon-btn ip-icon-btn--danger" onClick={() => deleteLesson(section.id, lesson.id)} title="Delete">🗑</button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <button
                    className="ip-add-lesson-btn"
                    onClick={() => setModal({ sectionId: section.id })}
                  >
                    + Add Lesson
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* New section input */}
        {addingSection && (
          <div className="ip-new-section">
            <input
              className="ip-minput"
              placeholder="Section title…"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSection()}
              autoFocus
            />
            <button className="ins-btn-primary" onClick={addSection}>Add</button>
            <button className="ins-btn-ghost" onClick={() => { setAddingSection(false); setNewSectionTitle(""); }}>Cancel</button>
          </div>
        )}

        {sections.length === 0 && !addingSection && (
          <div className="pg-empty">
            <span>📚</span>
            <p>No sections yet. Start by adding a section.</p>
            <button className="ins-btn-primary" onClick={() => setAddingSection(true)}>+ Add Section</button>
          </div>
        )}
      </div>

      {modal && (
        <LessonModal
          lesson={modal.lesson ?? null}
          sectionId={modal.sectionId}
          onClose={() => setModal(null)}
          onSave={saveLesson}
        />
      )}
    </div>
  );
}