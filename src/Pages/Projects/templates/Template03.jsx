import React from "react";
import {
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  GithubOutlined,
  LinkedinOutlined,
  SendOutlined,
  FolderOpenOutlined,
  TrophyOutlined
} from "@ant-design/icons";

export default function Template03({ data, primaryColor = "#b48b57" }) {
  const {
    personalInfo = {},
    professionalSummary = "",
    workExperience = [],
    education = [],
    skills = [],
    languages = [],
    projects = [],
    certifications = [],
    socialLinks = {}
  } = data || {};

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        color: "#333333",
        fontFamily: "'Inter', 'Arial', sans-serif",
        boxSizing: "border-box",
        padding: "45px 40px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div>
        {/* HEADER SECTION */}
        <div style={{ display: "flex", alignItems: "center", gap: "35px", marginBottom: "30px" }}>
          {/* PROFILE PHOTO (CIRCLE) */}
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              overflow: "hidden",
              border: `3px solid ${primaryColor}`,
              backgroundColor: "#f9fafb",
              flexShrink: 0
            }}
          >
            {personalInfo.profilePhoto && (
              <img
                src={personalInfo.profilePhoto}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>

          {/* NAME & TITLE */}
          <div>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#111827",
                letterSpacing: "4px",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: "1.1"
              }}
            >
              {personalInfo.firstName} <span style={{ color: primaryColor }}>{personalInfo.lastName}</span>
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#6b7280",
                margin: "8px 0 0 0",
                letterSpacing: "1px"
              }}
            >
              {personalInfo.professionalTitle}
            </p>
          </div>
        </div>

        {/* MAIN TWO-COLUMN CONTENT WITH LINE SEPARATORS */}
        <div style={{ display: "flex", gap: "35px" }}>

          {/* LEFT COLUMN (32%) */}
          <div
            style={{
              width: "32%",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              paddingRight: "20px",
              borderRight: "1px solid #e5e7eb"
            }}
          >
            {/* CONTACT */}
            <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                Contact
              </h3>
              <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "8px", color: "#4b5563" }}>
                {personalInfo.location && <div>{personalInfo.location}</div>}
                {personalInfo.phone && <div>{personalInfo.phone}</div>}
                {personalInfo.email && <div style={{ wordBreak: "break-all" }}>{personalInfo.email}</div>}
                {personalInfo.portfolio && <div>{personalInfo.portfolio}</div>}
              </div>
            </div>

            {/* PROFILES */}
            <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                Profiles
              </h3>
              <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "8px", color: "#4b5563" }}>
                <div>{socialLinks.github || "github.com/username"}</div>
                <div>{socialLinks.linkedin || "linkedin.com/in/username"}</div>
                <div>{socialLinks.telegram || "t.me/username"}</div>
              </div>
            </div>

            {/* EDUCATION */}
            {education.length > 0 && (
              <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                  Education
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <strong style={{ fontSize: "11.5px", color: "#111827", display: "block" }}>
                        {edu.institution}
                      </strong>
                      <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>{edu.degree}</div>
                      <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>{edu.dates}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                  Skills
                </h3>
                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "#4b5563", lineHeight: "1.8" }}>
                  {skills.map((s, idx) => (
                    <li key={idx}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                  Languages
                </h3>
                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "#4b5563", lineHeight: "1.8" }}>
                  {languages.map((lang, idx) => (
                    <li key={idx}>
                      {lang.language} {lang.level && `(${lang.level})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (68%) */}
          <div style={{ width: "68%", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* SUMMARY */}
            {professionalSummary && (
              <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 10px 0" }}>
                  Summary
                </h3>
                <p style={{ fontSize: "11.5px", lineHeight: "1.7", color: "#4b5563", margin: 0 }}>
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* WORK EXPERIENCE */}
            {workExperience.length > 0 && (
              <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 14px 0" }}>
                  Work Experience
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {workExperience.map((exp, idx) => (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong style={{ fontSize: "12.5px", color: "#111827" }}>
                          {exp.position}, {exp.company}
                        </strong>
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b7280", margin: "2px 0 6px 0" }}>
                        {exp.dates} {exp.location && `| ${exp.location}`}
                      </div>
                      {exp.responsibilities && (
                        <p style={{ fontSize: "11.5px", color: "#4b5563", margin: 0, lineHeight: "1.6" }}>
                          • {exp.responsibilities}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {projects.length > 0 && (
              <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                  Projects
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {projects.map((proj, idx) => (
                    <div key={idx}>
                      <strong style={{ fontSize: "12px", color: "#111827" }}>{proj.name}</strong>
                      <p style={{ fontSize: "11px", color: "#4b5563", margin: "4px 0 0 0", lineHeight: "1.6" }}>
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {certifications.length > 0 && (
              <div style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>
                  Certification & Achievements
                </h3>

                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11.5px", color: "#4b5563", lineHeight: "1.8" }}>
                  {certifications.map((cert, idx) => (
                    <li key={idx}>
                      <strong>{cert.name}</strong> - {cert.organization} ({cert.date})
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}