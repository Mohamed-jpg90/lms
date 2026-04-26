import React, { useState } from "react";
import "./admin.css";

/* ─────────────────────────────────────────
   MOCK DATA
   GET  /admin/pending-instructors
   PATCH /admin/users/:id/approve  { status: "approved" | "rejected", note? }
───────────────────────────────────────── */
const INIT_PENDING = [
  { id: 7,  firstName: "Hassan",  lastName: "Ali",    email: "hassan@mail.com",  status: "pending" },
  { id: 8,  firstName: "Mona",    lastName: "Saad",   email: "mona@mail.com",    status: "pending" },
  { id: 9,  firstName: "Tarek",   lastName: "Nabil",  email: "tarek@mail.com",    status: "pending" },
  { id: 10, firstName: "Dina",    lastName: "Khalil", email: "dina@mail.com",     status: "pending" },
];

const INIT_HISTORY = [
  { id: 5, firstName: "Sara",  lastName: "Ahmed",  email: "sara@lms.com",  expertise: "React, JavaScript",  },
  { id: 6, firstName: "Karim", lastName: "Hassan", email: "karim@lms.com", expertise: "Spring Boot, Java" },
  { id: 3, firstName: "Yusuf", lastName: "Maged",  email: "yusuf@mail.com",expertise: "DevOps, Docker",     },
];

function getInitials(u) {
  return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}


function ReviewModal({ applicant, onClose, onDecide }) {
  const [decision, setDecision] = useState(null); 
  const [note, setNote]         = useState("");
  const [saving, setSaving]     = useState(false);

  const handleSubmit = async () => {
    if (!decision) return;
    setSaving(true);
    /* PATCH /admin/users/:id/approve { status: decision, note } */
    await new Promise((r) => setTimeout(r, 600));
    onDecide(applicant.id, decision, note);
    setSaving(false);
    onClose();
  };

  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__header">
          <h2 className="ap-modal__title">Review Application</h2>
          <button className="ap-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="ap-modal__body">
          <div className="ap-review-profile">
            <div className="ap-review-avatar">{getInitials(applicant)}</div>
            <div>
              <h3 className="ap-review-name">{applicant.firstName} {applicant.lastName}</h3>
              <p className="ap-review-email">{applicant.email}</p>
              <p className="ap-review-date">Applied {formatDate(applicant.submittedAt)}</p>
            </div>
          </div>

          <div className="ap-field">
            <label className="ap-label">Expertise</label>
            <p className="ap-review-text">{applicant.expertise}</p>
          </div>

          <div className="ap-field">
            <label className="ap-label">Bio / Statement</label>
            <p className="ap-review-text">{applicant.bio}</p>
          </div>

          {/* Decision */}
          <div className="ap-field">
            <label className="ap-label">Decision <span className="ap-req">*</span></label>
            <div className="ap-decision-row">
              <button
                className={`ap-decision-btn ap-decision-btn--approve ${decision === "approved" ? "active" : ""}`}
                onClick={() => setDecision("approved")}
              >
                 Approve
              </button>
              <button
                className={`ap-decision-btn ap-decision-btn--reject ${decision === "rejected" ? "active" : ""}`}
                onClick={() => setDecision("rejected")}
              >
                 Reject
              </button>
            </div>
          </div>

          {decision === "rejected" && (
            <div className="ap-field">
              <label className="ap-label">Rejection Note (sent to applicant)</label>
              <textarea className="ap-textarea" rows={3}
                placeholder="Explain why the application was rejected…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="ap-modal__footer">
          <button className="ad-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={decision === "approved" ? "ad-btn-primary" : "ap-btn-delete"}
            onClick={handleSubmit}
            disabled={!decision || saving}
          >
            {saving ? "Processing…" : decision === "approved" ? " Approve & Notify" : " Reject & Notify"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function InstructorApprovals() {
  const [pending,  setPending]  = useState(INIT_PENDING);
  const [history,  setHistory]  = useState(INIT_HISTORY);
  const [modal,    setModal]    = useState(null);
  const [tab,      setTab]      = useState("pending");
  const [toast,    setToast]    = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleDecide = (id, status, note) => {
    const applicant = pending.find((p) => p.id === id);
    setPending((prev) => prev.filter((p) => p.id !== id));
    setHistory((prev) => [{
      ...applicant,
      status,
      note,
      processedAt: new Date().toISOString(),
    }, ...prev]);
    showToast(status === "approved" ? " Instructor approved! Welcome email sent." : "Application rejected. Notification sent.");
  };

  const displayed = tab === "pending" ? pending : history;

  return (
    <div className="ap-page">
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Instructor Approvals</h1>
          <p className="pg-header__sub">
            {pending.length} pending · {history.filter((h) => h.status === "approved").length} approved · {history.filter((h) => h.status === "rejected").length} rejected
          </p>
        </div>
      </div>

      {toast && <div className="ap-toast">{toast}</div>}

 

      {/* Tabs */}
      <div className="ap-tabs">
        <button className={`ap-tab ${tab === "pending" ? "ap-tab--active" : ""}`} onClick={() => setTab("pending")}>
          Pending
          {pending.length > 0 && <span className="ap-tab__badge">{pending.length}</span>}
        </button>
        <button className={`ap-tab ${tab === "history" ? "ap-tab--active" : ""}`} onClick={() => setTab("history")}>
          History ({history.length})
        </button>
      </div>

      {/* List */}
      <div className="ap-approvals-grid">
        {displayed.length === 0 ? (
          <div className="pg-empty">
            <p>{tab === "pending" ? "All caught up! No pending applications." : "No history yet."}</p>
          </div>
        ) : (
          displayed.map((app) => (
            <div
              key={app.id}
              className={`ap-approval-full-card ${app.status === "approved" ? "ap-approval-full-card--approved" : ""} ${app.status === "rejected" ? "ap-approval-full-card--rejected" : ""}`}
            >
              {/* Card header */}
              <div className="ap-approval-full-card__header">
                <div className="ap-review-avatar ap-review-avatar--sm">{getInitials(app)}</div>
                <div className="ap-approval-full-card__info">
                  <h3 className="ap-approval-full-card__name">{app.firstName} {app.lastName}</h3>
                  <p className="ap-approval-full-card__email">{app.email}</p>
                </div>
                {app.status !== "pending" && (
                  <span className={`ap-status-badge ap-status-badge--${app.status}`}>
                    {app.status === "approved" ? " Approved" : " Rejected"}
                  </span>
                )}
              </div>

              <div className="ap-approval-full-card__expertise">
                {app.expertise.split(",").map((e) => (
                  <span key={e} className="ap-expertise-tag">{e.trim()}</span>
                ))}
              </div>





              {app.status === "pending" && (
                <div className="ap-approval-full-card__actions">
                  <button className="ap-approve-btn" onClick={() => { setModal(app); }}>
                    Approve
                  </button>
                  <button className="ap-reject-btn" onClick={() => { setModal(app); }}>
                     Reject
                  </button>
   
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {modal && (
        <ReviewModal
          applicant={modal}
          onClose={() => setModal(null)}
          onDecide={handleDecide}
        />
      )}
    </div>
  );
}