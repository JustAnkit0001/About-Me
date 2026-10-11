"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { portfolio, type PortfolioData, type ProjectItem } from "@/data/portfolio";

const storageKey = "nova-portfolio-data";

function readSavedPortfolio(): PortfolioData {
  if (typeof window === "undefined") return portfolio;
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return portfolio;
  try {
    return JSON.parse(saved) as PortfolioData;
  } catch {
    return portfolio;
  }
}

function clonePortfolio(data: PortfolioData): PortfolioData {
  return JSON.parse(JSON.stringify(data)) as PortfolioData;
}

export default function EditorPage() {
  const [data, setData] = useState<PortfolioData>(() => clonePortfolio(readSavedPortfolio()));
  const [savedData, setSavedData] = useState<PortfolioData>(() => clonePortfolio(readSavedPortfolio()));
  const [status, setStatus] = useState("Ready to edit.");
  const [statusTone, setStatusTone] = useState<"idle" | "success" | "error">("idle");
  const hasChanges = JSON.stringify(data) !== JSON.stringify(savedData);

  const update = <K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setStatus("Unsaved changes.");
    setStatusTone("idle");
  };

  const updateProject = (index: number, patch: Partial<ProjectItem>) => {
    update("projects", data.projects.map((project, itemIndex) => itemIndex === index ? { ...project, ...patch } : project));
  };

  function savePortfolio() {
    if (!data.name.trim() || !data.role.trim() || !data.intro.trim()) {
      setStatus("Add your name, role, and introduction before saving.");
      setStatusTone("error");
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(data));
    setSavedData(clonePortfolio(data));
    setStatus("Saved locally. Refresh the portfolio to see your updates.");
    setStatusTone("success");
  }

  function resetPortfolio() {
    if (hasChanges && !window.confirm("Discard your unsaved changes and restore the starter profile?")) return;
    const starter = clonePortfolio(portfolio);
    window.localStorage.removeItem(storageKey);
    setData(starter);
    setSavedData(clonePortfolio(starter));
    setStatus("Reset to the starter profile.");
    setStatusTone("success");
  }

  function downloadPortfolio() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nova-portfolio-profile.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Profile downloaded.");
    setStatusTone("success");
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        savePortfolio();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  return (
    <main className="portfolio-editor">
      <div className="editor-header">
        <div>
          <p className="eyebrow">ANKIT BELBASE PORTFOLIO // EDITOR</p>
          <h1>Build your portfolio profile.</h1>
          <p>Enter your details in the fields below. Your changes stay in this browser and appear on the universe homepage after saving.</p>
        </div>
        <Link className="editor-back-link" href="/">Return to universe</Link>
      </div>

      <section className="editor-workspace" aria-labelledby="profile-data-heading">
        <aside className="editor-sidebar">
          <p className="eyebrow">WORKSPACE GUIDE</p>
          <h2>Simple content entry.</h2>
          <p>Start with your identity, then add your story, skills, work, and ways to connect.</p>
          <ol className="editor-steps">
            <li><strong>Identity</strong><span>name, role, intro</span></li>
            <li><strong>Story</strong><span>focus and education</span></li>
            <li><strong>Skills</strong><span>tools and technologies</span></li>
            <li><strong>Work</strong><span>projects and links</span></li>
          </ol>
          <div className="editor-tip">
            <span>LOCAL ONLY</span>
            <p>Your profile stays in this browser. Download a backup before changing devices.</p>
          </div>
        </aside>

        <div className="editor-card editor-form">
          <div className="editor-card-heading">
            <div>
              <p className="eyebrow">PROFILE DATA</p>
              <h2 id="profile-data-heading">Tell your story</h2>
            </div>
            <span className={hasChanges ? "editor-local-badge is-dirty" : "editor-local-badge"}>{hasChanges ? "Unsaved changes" : "Saved locally"}</span>
          </div>

          <fieldset className="form-section">
            <legend>Identity</legend>
            <label>Display name<input value={data.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name or professional title" /></label>
            <label>Role<input value={data.role} onChange={(event) => update("role", event.target.value)} placeholder="What do you do?" /></label>
            <label>Introduction<textarea value={data.intro} onChange={(event) => update("intro", event.target.value)} rows={3} placeholder="A short introduction for the homepage" /></label>
            <label>About summary<textarea value={data.summary} onChange={(event) => update("summary", event.target.value)} rows={3} placeholder="A longer summary of your work" /></label>
          </fieldset>

          <fieldset className="form-section">
            <legend>Journey and education</legend>
            <label>Focus areas <span className="field-help">One item per line</span><textarea value={data.focusAreas.map((item) => `${item.title} | ${item.summary}`).join("\n")} onChange={(event) => update("focusAreas", event.target.value.split("\n").filter(Boolean).map((line) => { const [title, ...summary] = line.split("|"); return { title: title.trim(), summary: summary.join("|").trim() }; }))} rows={5} /></label>
            <label>Education <span className="field-help">One item per line</span><textarea value={data.education.join("\n")} onChange={(event) => update("education", event.target.value.split("\n"))} rows={4} /></label>
          </fieldset>

          <fieldset className="form-section">
            <legend>Skills</legend>
            <div className="form-grid">
              {data.skills.map((group, index) => (
                <label key={group.title}>{group.title} <span className="field-help">Comma separated</span><input value={group.items.join(", ")} onChange={(event) => update("skills", data.skills.map((item, itemIndex) => itemIndex === index ? { ...item, items: event.target.value.split(",").map((entry) => entry.trim()).filter(Boolean) } : item))} /></label>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Selected work</legend>
            <div className="editor-projects">
              {data.projects.map((project, index) => (
                <article className="editor-project" key={`${project.title}-${index}`}>
                  <label>Project name<input value={project.title} onChange={(event) => updateProject(index, { title: event.target.value })} /></label>
                  <label>Short description<textarea value={project.summary} onChange={(event) => updateProject(index, { summary: event.target.value })} rows={2} /></label>
                  <div className="form-grid">
                    <label>My role<input value={project.role} onChange={(event) => updateProject(index, { role: event.target.value })} /></label>
                    <label>Technologies <span className="field-help">Comma separated</span><input value={project.stack.join(", ")} onChange={(event) => updateProject(index, { stack: event.target.value.split(",").map((entry) => entry.trim()).filter(Boolean) })} /></label>
                  </div>
                  <div className="form-grid">
                    <label>Repository URL<input type="url" value={project.repo} onChange={(event) => updateProject(index, { repo: event.target.value })} /></label>
                    <label>Live/demo URL<input type="url" value={project.demo} onChange={(event) => updateProject(index, { demo: event.target.value })} /></label>
                  </div>
                </article>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Contact links</legend>
            <div className="form-grid">
              {data.socialLinks.map((link, index) => (
                <label key={link.title}>{link.title}<input value={link.href} onChange={(event) => update("socialLinks", data.socialLinks.map((item, itemIndex) => itemIndex === index ? { ...item, href: event.target.value } : item))} /></label>
              ))}
            </div>
          </fieldset>

          <div className="editor-actions">
            <button className="primary-button" type="button" onClick={savePortfolio}>Save profile</button>
            <button className="secondary-button" type="button" onClick={downloadPortfolio}>Download backup</button>
            <button className="editor-reset-button" type="button" onClick={resetPortfolio}>Reset starter content</button>
          </div>
          <p className={`editor-status is-${statusTone}`} role="status">{status}</p>
        </div>
      </section>
    </main>
  );
}
