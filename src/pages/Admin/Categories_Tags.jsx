import React, { useState } from "react";
import "./admin.css";

/* ─────────────────────────────────────────
   MOCK DATA  (replace with API calls)
   GET  /admin/categories
   POST /admin/categories
   PATCH /admin/categories/:id
   DELETE /admin/categories/:id

   GET  /admin/tags
   POST /admin/tags
   DELETE /admin/tags/:id
───────────────────────────────────────── */
const INIT_CATEGORIES = [
  { id: 1, name: "Web Development",  courseCount: 8,  description: "Frontend, backend and fullstack web courses" },
  { id: 2, name: "Backend",          courseCount: 5,  description: "Server-side, databases and APIs" },
  { id: 3, name: "Design",           courseCount: 3,  description: "UI/UX, graphic design and Figma" },
  { id: 4, name: "Data Science",     courseCount: 4,  description: "ML, AI, Python and data analysis" },
  { id: 5, name: "Computer Science", courseCount: 6,  description: "Algorithms, data structures and theory" },
  { id: 6, name: "DevOps",           courseCount: 2,  description: "CI/CD, Docker, Kubernetes and cloud" },
  { id: 7, name: "Mobile",           courseCount: 1,  description: "iOS, Android and React Native" },
];

const INIT_TAGS = [
  { id: 1, name: "react",       courseCount: 5 },
  { id: 2, name: "javascript",  courseCount: 8 },
  { id: 3, name: "python",      courseCount: 4 },
  { id: 4, name: "hooks",       courseCount: 3 },
  { id: 5, name: "typescript",  courseCount: 4 },
  { id: 6, name: "spring-boot", courseCount: 2 },
  { id: 7, name: "machine-learning", courseCount: 3 },
  { id: 8, name: "docker",      courseCount: 2 },
  { id: 9, name: "css",         courseCount: 3 },
  { id: 10,name: "git",         courseCount: 2 },
  { id: 11,name: "sql",         courseCount: 2 },
  { id: 12,name: "nodejs",      courseCount: 3 },
];

/* ─────────────────────────────────────────
   CATEGORY MODAL
───────────────────────────────────────── */
function CategoryModal({ category, onClose, onSave }) {
  const isEdit = !!category;
  const [form, setForm] = useState({
    name:        category?.name        ?? "",
    description: category?.description ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Category name is required"); return; }
    setSaving(true);
    /* API call: POST /admin/categories  OR  PATCH /admin/categories/:id */
    await new Promise((r) => setTimeout(r, 500));
    onSave({ ...category, ...form, id: category?.id ?? Date.now(), courseCount: category?.courseCount ?? 0 });
    setSaving(false);
    onClose();
  };

  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__header">
          <h2 className="ap-modal__title">{isEdit ? "Edit Category" : "Add Category"}</h2>
          <button className="ap-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="ap-modal__body">
          <div className="ap-field">
            <label className="ap-label">Category Name <span className="ap-req">*</span></label>
            <input className={`ap-input ${error ? "ap-input--error" : ""}`}
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(""); }}
              placeholder="e.g. Web Development"
            />
            {error && <p className="ap-error">{error}</p>}
          </div>
          <div className="ap-field">
            <label className="ap-label">Description</label>
            <textarea className="ap-textarea" rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Short description of this category…"
            />
          </div>
        </div>
        <div className="ap-modal__footer">
          <button className="ad-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ad-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DELETE CONFIRM MODAL
───────────────────────────────────────── */
function DeleteConfirm({ item, type, onClose, onConfirm }) {
  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal ap-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__header">
          <h2 className="ap-modal__title">Delete {type}</h2>
          <button className="ap-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="ap-modal__body">
          <p className="ap-confirm-text">
            Are you sure you want to delete <strong>"{item.name}"</strong>?
            {item.courseCount > 0 && (
              <span className="ap-confirm-warn">
                {" "}This {type.toLowerCase()} is used by {item.courseCount} course{item.courseCount !== 1 ? "s" : ""}.
                Those courses will lose this {type.toLowerCase()}.
              </span>
            )}
          </p>
        </div>
        <div className="ap-modal__footer">
          <button className="ad-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ap-btn-delete" onClick={() => { onConfirm(item.id); onClose(); }}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Categories_Tags() {
  const [categories, setCategories] = useState(INIT_CATEGORIES);
  const [tags,       setTags]       = useState(INIT_TAGS);

  const [catSearch,  setCatSearch]  = useState("");
  const [tagSearch,  setTagSearch]  = useState("");
  const [catModal,   setCatModal]   = useState(null);   // null | "new" | category object
  const [deleteTarget, setDeleteTarget] = useState(null); // { item, type }
  const [newTagInput, setNewTagInput]   = useState("");
  const [tagSaving,   setTagSaving]     = useState(false);
  const [toast,       setToast]         = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── Category CRUD ── */
  const saveCategory = (cat) => {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === cat.id);
      return exists ? prev.map((c) => (c.id === cat.id ? cat : c)) : [cat, ...prev];
    });
    showToast(cat.courseCount === 0 && !INIT_CATEGORIES.find((c) => c.id === cat.id)
      ? "Category added!" : "Category updated!");
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast("Category deleted.");
  };

  /* ── Tag CRUD ── */
  const addTag = async () => {
    const name = newTagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name) return;
    if (tags.find((t) => t.name === name)) { showToast("Tag already exists."); return; }
    setTagSaving(true);
    /* API call: POST /admin/tags { name } */
    await new Promise((r) => setTimeout(r, 400));
    setTags((prev) => [{ id: Date.now(), name, courseCount: 0 }, ...prev]);
    setNewTagInput("");
    setTagSaving(false);
    showToast("Tag added!");
  };

  const deleteTag = (id) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    showToast("Tag deleted.");
  };

  const filteredCats = categories.filter((c) =>
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="ap-page">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Categories & Tags</h1>
          <p className="pg-header__sub">
            {categories.length} categories · {tags.length} tags
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="ap-toast">{toast}</div>}

      <div className="ap-two-col">
        {/* ══════════════════════════════
            LEFT — CATEGORIES
        ══════════════════════════════ */}
        <div className="ap-panel">
          <div className="ap-panel__header">
            <div>
              <h2 className="ap-panel__title">Categories</h2>
              <p className="ap-panel__sub">{categories.length} total</p>
            </div>
            <button className="ad-btn-primary" onClick={() => setCatModal("new")}>
              + Add Category
            </button>
          </div>

          {/* Search */}
          <div className="ap-panel__search">
            <div className="ip-search-wrap">
              <input className="ip-search" placeholder="Search categories…"
                value={catSearch} onChange={(e) => setCatSearch(e.target.value)} />
              {catSearch && <button className="ip-search-clear" onClick={() => setCatSearch("")}>✕</button>}
            </div>
          </div>

          {/* List */}
          <div className="ap-cat-list">
            {filteredCats.length === 0 ? (
              <div className="pg-empty"><span>🗂</span><p>No categories found.</p></div>
            ) : (
              filteredCats.map((cat) => (
                <div key={cat.id} className="ap-cat-card">
                  <div className="ap-cat-card__icon">🗂</div>
                  <div className="ap-cat-card__info">
                    <h3 className="ap-cat-card__name">{cat.name}</h3>
                    {cat.description && (
                      <p className="ap-cat-card__desc">{cat.description}</p>
                    )}
                    <span className="ap-cat-card__count">{cat.courseCount} courses</span>
                  </div>
                  <div className="ap-cat-card__actions">
                    <button className="ad-action-btn" onClick={() => setCatModal(cat)}>Edit</button>
                    <button
                      className="ad-action-btn ad-action-btn--danger"
                      onClick={() => setDeleteTarget({ item: cat, type: "Category" })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ══════════════════════════════
            RIGHT — TAGS
        ══════════════════════════════ */}
        <div className="ap-panel">
          <div className="ap-panel__header">
            <div>
              <h2 className="ap-panel__title">Tags</h2>
              <p className="ap-panel__sub">{tags.length} total</p>
            </div>
          </div>

          {/* Add tag input */}
          <div className="ap-tag-add-row">
            <input
              className="ap-input ap-input--tag"
              placeholder="New tag name (e.g. react-native)"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />
            <button className="ad-btn-primary" onClick={addTag} disabled={tagSaving || !newTagInput.trim()}>
              {tagSaving ? "…" : "+ Add"}
            </button>
          </div>

          {/* Search */}
          <div className="ap-panel__search">
            <div className="ip-search-wrap">
              <input className="ip-search" placeholder="Search tags…"
                value={tagSearch} onChange={(e) => setTagSearch(e.target.value)} />
              {tagSearch && <button className="ip-search-clear" onClick={() => setTagSearch("")}>✕</button>}
            </div>
          </div>

          {/* Tag cloud */}
          <div className="ap-tag-cloud">
            {filteredTags.length === 0 ? (
              <div className="pg-empty"><span>🏷</span><p>No tags found.</p></div>
            ) : (
              filteredTags.map((tag) => (
                <div key={tag.id} className="ap-tag-chip">
                  <span className="ap-tag-chip__name">#{tag.name}</span>
                  <span className="ap-tag-chip__count">{tag.courseCount}</span>
                  <button
                    className="ap-tag-chip__del"
                    onClick={() => setDeleteTarget({ item: tag, type: "Tag" })}
                    title="Delete tag"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Legend */}
          <p className="ap-tag-legend">
            Badge number = courses using this tag. Press Enter or click "+ Add" to create.
          </p>
        </div>
      </div>

      {/* ── Modals ── */}
      {catModal && (
        <CategoryModal
          category={catModal === "new" ? null : catModal}
          onClose={() => setCatModal(null)}
          onSave={saveCategory}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          item={deleteTarget.item}
          type={deleteTarget.type}
          onClose={() => setDeleteTarget(null)}
          onConfirm={deleteTarget.type === "Category" ? deleteCategory : deleteTag}
        />
      )}
    </div>
  );
}