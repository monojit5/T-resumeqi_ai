import { useContext, useEffect } from "react";
import { ArrowDownToLine, FilePlus2, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import Navber from "../components/Navber";
import { ResumeContext } from "../context/ResumeContext";
import { SubscriptionContext } from "../context/SubscriptionContext";
import "./ResumeBuilder.css";

const templates = [
  { id: "classic", name: "Classic", note: "Traditional, clean hierarchy" },
  { id: "modern", name: "Modern", note: "Centered header, clear sections" },
  { id: "compact", name: "Compact", note: "Space-conscious and simple" },
];

function ResumeBuilder() {
  const {
    resumes,
    resume,
    setResume,
    setSavedResume,
    loading,
    saving,
    busy,
    hasUnsavedChanges,
    resumeReady,
    loadResumes,
    createResume,
    saveResume,
    deleteResume,
    downloadResume,
    updateField,
    updateEntry,
    addEntry,
    removeEntry,
  } = useContext(ResumeContext);
  const { isPremium, plan, usage } = useContext(SubscriptionContext);
  const canCreateResume = plan.resumeLimit === null || resumes.length < plan.resumeLimit;

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleSave = (event) => {
    event.preventDefault();
    saveResume();
  };

  const entryFields = (section, entry, index, fields) => (
    <div className="builder-entry" key={`${section}-${index}`}>
      <div className="builder-entry-heading">
        <strong>{section} {index + 1}</strong>
        <button type="button" className="builder-icon-button" onClick={() => removeEntry(section, index)} aria-label={`Remove ${section} ${index + 1}`}>
          <Trash2 size={16} />
        </button>
      </div>
      <div className="builder-fields-grid">
        {fields.map(([field, label, multiline]) => (
          <label className={multiline ? "builder-field builder-field-wide" : "builder-field"} key={field}>
            {label}
            {multiline ? (
              <textarea rows={3} value={entry[field] || ""} onChange={(event) => updateEntry(section, index, field, event.target.value)} />
            ) : (
              <input value={entry[field] || ""} onChange={(event) => updateEntry(section, index, field, event.target.value)} />
            )}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <main className="home builder-page">
      <Navber />
      <section className="builder-shell">
        <header className="builder-page-heading">
          <span className="builder-eyebrow">YOUR RESUME WORKSPACE</span>
          <h1>Build a resume that feels <span>like you.</span></h1>
          <p>Create, save and download your ATS-friendly resume. Upgrade for more resumes, AI analyses and templates.</p>
        </header>

        {!resume ? (
          <section className="builder-library">
            <div className="builder-section-heading">
              <div><h2>Your resumes</h2><p>Your drafts are private to your account.</p></div>
              <button type="button" className="primary-btn" onClick={createResume} disabled={busy || !canCreateResume}>
                {busy ? <LoaderCircle className="builder-spin" size={17} /> : <FilePlus2 size={17} />}
                {canCreateResume ? "Create resume" : "Free plan limit reached"}
              </button>
            </div>
            {!isPremium && (
              <div className="builder-plan-notice">
                <span>FREE PLAN · {resumes.length}/{plan.resumeLimit} resumes · {usage?.aiAnalysesUsed ?? 0}/{plan.monthlyAiLimit} AI analyses this month</span>
                <Link to="/pricing">See Premium plans</Link>
              </div>
            )}
            {loading ? (
              <div className="builder-empty"><LoaderCircle className="builder-spin" size={24} /> Loading your resumes…</div>
            ) : resumes.length ? (
              <div className="builder-resume-list">
                {resumes.map((item) => (
                  <article className="builder-resume-card" key={item._id}>
                    <div className="builder-resume-card-icon"><FilePlus2 size={21} /></div>
                    <div className="builder-resume-card-main">
                      <strong>{item.title || "My resume"}</strong>
                      <span>{item.headline || item.name || "Draft resume"}</span>
                      <small>{item.template === "classic" ? "Classic template · PDF download included" : `${item.template} template · PDF download included`}</small>
                    </div>
                    <button className="builder-secondary-button" type="button" onClick={() => {
                      const editable = !isPremium && !plan.templates.includes(item.template)
                        ? { ...item, template: "classic" }
                        : item;
                      setResume(editable);
                      setSavedResume(item);
                    }}>Edit</button>
                    <button className="builder-secondary-button" type="button" onClick={() => downloadResume(item._id)}><ArrowDownToLine size={15} /> Download</button>
                    <button type="button" className="builder-icon-button" onClick={() => deleteResume(item)} aria-label="Delete resume"><Trash2 size={16} /></button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="builder-empty"><FilePlus2 size={26} /><strong>No resumes yet</strong><span>Create your first resume draft to get started.</span></div>
            )}
          </section>
        ) : (
          <div className="builder-workspace">
            <div className="builder-workspace-top">
              <button type="button" className="builder-back-button" onClick={() => {
                if (!hasUnsavedChanges || window.confirm("Discard your unsaved changes?")) setResume(null);
              }}>← All resumes</button>
              <label className="builder-title-field">Resume title
                <input value={resume.title || ""} onChange={(event) => updateField("title", event.target.value)} />
              </label>
            </div>
            <div className="builder-columns">
              <form className="builder-editor" onSubmit={handleSave}>
                <section className="builder-form-section">
                  <div className="builder-form-heading"><span>01</span><div><h2>Personal details</h2><p>Keep contact information clear and up to date.</p></div></div>
                  <div className="builder-fields-grid">
                    {[
                      ["name", "Full name"],
                      ["email", "Email", "email"],
                      ["phone", "Phone"],
                      ["address", "Location"],
                      ["headline", "Professional headline"],
                      ["linkedin", "LinkedIn URL"],
                      ["github", "GitHub URL"],
                      ["portfolio", "Portfolio URL"],
                    ].map(([field, label, type]) => (
                      <label className="builder-field" key={field}>{label}
                        <input type={type || "text"} value={resume[field] || ""} onChange={(event) => updateField(field, event.target.value)} />
                      </label>
                    ))}
                    <label className="builder-field builder-field-wide">Professional summary
                      <textarea rows={4} value={resume.summary || ""} onChange={(event) => updateField("summary", event.target.value)} placeholder="Summarize your experience and strengths using accurate, specific details." />
                    </label>
                    <label className="builder-field builder-field-wide">Skills <span className="builder-field-hint">Separate each skill with a comma.</span>
                      <input value={(resume.skills || []).join(", ")} onChange={(event) => updateField("skills", event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean))} placeholder="Research, Excel, Project management" />
                    </label>
                  </div>
                </section>

                <section className="builder-form-section">
                  <div className="builder-form-heading"><span>02</span><div><h2>Experience</h2><p>Use clear job titles, dates, and factual impact.</p></div></div>
                  {resume.experience?.map((entry, index) => entryFields("experience", entry, index, [
                    ["position", "Job title"], ["company", "Company"], ["startDate", "Start date"], ["endDate", "End date"], ["location", "Location"], ["description", "Responsibilities and achievements", true],
                  ]))}
                  <button type="button" className="builder-add-button" onClick={() => addEntry("experience", { position: "", company: "", startDate: "", endDate: "", location: "", description: "" })}><Plus size={16} /> Add experience</button>
                </section>

                <section className="builder-form-section">
                  <div className="builder-form-heading"><span>03</span><div><h2>Education</h2><p>Add relevant degrees, schools, and dates.</p></div></div>
                  {resume.education?.map((entry, index) => entryFields("education", entry, index, [
                    ["degree", "Degree or qualification"], ["institution", "Institution"], ["startYear", "Start year"], ["endYear", "End year"], ["grade", "Grade or result"],
                  ]))}
                  <button type="button" className="builder-add-button" onClick={() => addEntry("education", { degree: "", institution: "", startYear: "", endYear: "", grade: "" })}><Plus size={16} /> Add education</button>
                </section>

                <section className="builder-form-section">
                  <div className="builder-form-heading"><span>04</span><div><h2>Projects</h2><p>Show useful work and the tools you used.</p></div></div>
                  {resume.projects?.map((entry, index) => (
                    <div className="builder-entry" key={`project-${index}`}>
                      <div className="builder-entry-heading"><strong>Project {index + 1}</strong><button type="button" className="builder-icon-button" onClick={() => removeEntry("projects", index)} aria-label={`Remove project ${index + 1}`}><Trash2 size={16} /></button></div>
                      <div className="builder-fields-grid">
                        <label className="builder-field">Project name<input value={entry.title || ""} onChange={(event) => updateEntry("projects", index, "title", event.target.value)} /></label>
                        <label className="builder-field">Project URL<input value={entry.link || ""} onChange={(event) => updateEntry("projects", index, "link", event.target.value)} /></label>
                        <label className="builder-field builder-field-wide">Technologies<input value={(entry.technologies || []).join(", ")} onChange={(event) => updateEntry("projects", index, "technologies", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></label>
                        <label className="builder-field builder-field-wide">Project details<textarea rows={3} value={entry.description || ""} onChange={(event) => updateEntry("projects", index, "description", event.target.value)} /></label>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="builder-add-button" onClick={() => addEntry("projects", { title: "", description: "", link: "", technologies: [] })}><Plus size={16} /> Add project</button>
                </section>

                <section className="builder-form-section">
                  <div className="builder-form-heading"><span>05</span><div><h2>Choose a template</h2><p>All templates use readable, single-column sections.</p></div></div>
                  <div className="builder-template-options">
                    {templates.map((template) => (
                      <button type="button" key={template.id} className={`builder-template-option${resume.template === template.id ? " selected" : ""}`} disabled={!isPremium && !plan.templates.includes(template.id)} onClick={() => updateField("template", template.id)}>
                        <span className={`builder-template-swatch ${template.id}`} />
                        <strong>{template.name}</strong><small>{!isPremium && !plan.templates.includes(template.id) ? `Premium · ${template.note}` : template.note}</small>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="builder-save-bar">
                  <button type="submit" className="primary-btn" disabled={saving}>
                    {saving ? <LoaderCircle className="builder-spin" size={17} /> : <Save size={17} />}
                    {saving ? "Saving…" : "Save resume"}
                  </button>
                  <span>Your resume is saved privately to your account.</span>
                </div>
              </form>

              <aside className={`builder-preview builder-preview-${resume.template || "classic"}`}>
                <div className="builder-preview-top"><span>LIVE PREVIEW</span><span>{resume.template || "classic"}</span></div>
                <div className="builder-paper">
                  <header className="builder-paper-header">
                    <h2>{resume.name || "Your name"}</h2>
                    {resume.headline && <strong>{resume.headline}</strong>}
                    <p>{[resume.email, resume.phone, resume.address].filter(Boolean).join(" · ") || "Email · Phone · Location"}</p>
                    {[resume.linkedin, resume.github, resume.portfolio].filter(Boolean).length > 0 && <p>{[resume.linkedin, resume.github, resume.portfolio].filter(Boolean).join(" · ")}</p>}
                  </header>
                  {resume.summary && <section><h3>Professional Summary</h3><p>{resume.summary}</p></section>}
                  {!!resume.experience?.length && <section><h3>Experience</h3>{resume.experience.map((entry, index) => <div key={index}><strong>{entry.position || "Job title"}</strong><p>{[entry.company, entry.startDate, entry.endDate].filter(Boolean).join(" · ")}</p>{entry.description && <p>{entry.description}</p>}</div>)}</section>}
                  {!!resume.education?.length && <section><h3>Education</h3>{resume.education.map((entry, index) => <div key={index}><strong>{entry.degree || "Degree"}</strong><p>{[entry.institution, entry.startYear, entry.endYear].filter(Boolean).join(" · ")}</p></div>)}</section>}
                  {!!resume.skills?.length && <section><h3>Skills</h3><p>{resume.skills.join(" · ")}</p></section>}
                  {!!resume.projects?.length && <section><h3>Projects</h3>{resume.projects.map((entry, index) => <div key={index}><strong>{entry.title || "Project"}</strong><p>{entry.description}</p></div>)}</section>}
                </div>
                <p className="builder-preview-note">Preview is a guide. Your downloaded PDF uses selectable text and ATS-friendly section headings.</p>
                <button type="button" className="primary-btn builder-download-button" onClick={() => downloadResume(resume._id)} disabled={busy || hasUnsavedChanges || !resumeReady}>
                  {busy ? <LoaderCircle className="builder-spin" size={17} /> : <ArrowDownToLine size={17} />}
                  {hasUnsavedChanges ? "Save changes to download" : !resumeReady ? "Add resume details first" : "Download PDF"}
                </button>
                {!isPremium && <p className="builder-payment-note">Free plan downloads are included. <Link to="/pricing">Upgrade for unlimited resumes, AI analysis and templates.</Link></p>}
              </aside>
            </div>
          </div>
        )}
      </section>
      <footer className="home-footer"><Brand /><p>Review every detail before applying. AI-assisted content should always be checked for accuracy.</p></footer>
    </main>
  );
}

export default ResumeBuilder;