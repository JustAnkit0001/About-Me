"use client";

import { useState } from "react";
import Link from "next/link";

import { portfolio, type PortfolioData } from "@/data/portfolio";

const storageKey = "nova-portfolio-data";

function readSavedPortfolio() {
  if (typeof window === "undefined") return portfolio;
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return portfolio;
  try {
    return JSON.parse(saved) as PortfolioData;
  } catch {
    return portfolio;
  }
}

export default function EditorPage() {
  const [value, setValue] = useState(() => JSON.stringify(readSavedPortfolio(), null, 2));
  const [status, setStatus] = useState("");

  function savePortfolio() {
    try {
      const parsed = JSON.parse(value) as PortfolioData;
      if (!parsed.siteName || !parsed.name || !Array.isArray(parsed.planets)) {
        throw new Error("Include siteName, name, and planets before saving.");
      }
      window.localStorage.setItem(storageKey, JSON.stringify(parsed));
      setValue(JSON.stringify(parsed, null, 2));
      setStatus("Saved locally. Refresh the portfolio to see your updates.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The profile JSON is invalid.");
    }
  }

  function resetPortfolio() {
    window.localStorage.removeItem(storageKey);
    setValue(JSON.stringify(portfolio, null, 2));
    setStatus("Reset to the starter profile.");
  }

  function downloadPortfolio() {
    const blob = new Blob([value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nova-portfolio-profile.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Profile downloaded.");
  }

  return (
    <main className="portfolio-editor">
      <div className="editor-header">
        <div>
          <p className="eyebrow">ANKIT BELBASE PORTFOLIO // EDITOR</p>
          <h1>Build your portfolio profile.</h1>
          <p>
            Replace the starter content with your own identity, story, skills, work,
            education, and contact links. Your changes stay in this browser.
          </p>
        </div>
        <Link className="editor-back-link" href="/">Return to universe</Link>
      </div>

      <section className="editor-card" style={{ width: "min(100%, 76rem)" }} aria-labelledby="profile-data-heading">
        <div className="editor-card-heading">
          <div>
            <p className="eyebrow">PROFILE DATA</p>
            <h2 id="profile-data-heading">Your complete portfolio content</h2>
          </div>
          <span className="editor-local-badge">Saved locally</span>
        </div>
        <label className="editor-label" htmlFor="portfolio-json">
          Edit your profile data
        </label>
        <textarea
          id="portfolio-json"
          className="editor-json"
          style={{ display: "block", width: "100%", minHeight: "52rem", fontSize: "0.84rem" }}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          aria-describedby="editor-help"
        />
        <p id="editor-help" className="editor-help">
          Keep the existing structure. Update the text inside quotes, your links,
          skills, education, projects, and planet details. Use valid JSON.
        </p>
        <div className="editor-actions">
          <button className="primary-button" type="button" onClick={savePortfolio}>Save profile</button>
          <button className="secondary-button" type="button" onClick={downloadPortfolio}>Download backup</button>
          <button className="editor-reset-button" type="button" onClick={resetPortfolio}>Reset starter content</button>
        </div>
        <p className="editor-status" role="status">{status}</p>
      </section>
    </main>
  );
}
