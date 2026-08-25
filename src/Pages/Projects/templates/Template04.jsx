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

export default function Template04({ data, primaryColor = "#d6c5b3" }) {
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
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative"
      }}
    >
      <div>
        {/* TOP DECORATIVE BLOCK */}
        <div style={{ width: "75px", height: "75px", backgroundColor: primaryColor }} />

        {/* HEADER SECTION */}
        <div style={{ display: "flex", padding: "0 40px", justifyContent: "space-between", alignItems: "flex-start" }}>

          {/* LEFT: NAME & CONTACTS */}
          <div style={{ flex: 1, paddingRight: "30px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#111827",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: "1.1"
              }}
            >
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#4b5563",
                margin: "6px 0 16px 0",
                fontWeight: "500",
                letterSpacing: "0.5px"
              }}
            >
              {personalInfo.professionalTitle}
            </p>

            {/* CONTACT BAR */}
            <div
              style={{
                borderTop: "1px solid #d1d5db",
                borderBottom: "1px solid #d1d5db",
                padding: "10px 0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                fontSize: "11px",
                color: "#4b5563"
              }}
            >
              {personalInfo.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <PhoneOutlined style={{ color: "#6b7280" }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.portfolio && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <GlobalOutlined style={{ color: "#6b7280" }} />
                  <span>{personalInfo.portfolio}</span>
                </div>
              )}
              {personalInfo.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MailOutlined style={{ color: "#6b7280" }} />
                  <span style={{ wordBreak: "break-all" }}>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <EnvironmentOutlined style={{ color: "#6b7280" }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: RECTANGLE PROFILE PHOTO */}
          <div
            style={{
              width: "160px",
              height: "200px",
              backgroundColor: "#f3f4f6",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
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
        </div>

        {/* MAIN BODY CONTENT */}
        <div style={{ display: "flex", padding: "40px 40px 20px 40px", gap: "40px" }}>

          {/* LEFT COLUMN (60%) */}
          <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: "26px" }}>

            {/* EXPERIENCE */}
            {workExperience.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    margin: "0 0 14px 0"
                  }}
                >
                  EXPERIENCE
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {workExperience.map((exp, idx) => (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong style={{ fontSize: "12.5px", color: "#111827" }}>{exp.position}</strong>
                        <span style={{ fontSize: "10.5px", fontWeight: "700", color: "#374151" }}>{exp.dates}</span>
                      </div>
                      <div style={{ fontSize: "11px", fontStyle: "italic", color: "#6b7280", margin: "2px 0 6px 0" }}>
                        {exp.company} {exp.location && `| ${exp.location}`}
                      </div>
                      {exp.responsibilities && (
                        <p style={{ fontSize: "11px", color: "#4b5563", margin: 0, lineHeight: "1.6" }}>
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
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    margin: "0 0 12px 0"
                  }}
                >
                  PROJECTS
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {projects.map((proj, idx) => (
                    <div key={idx}>
                      <strong style={{ fontSize: "12px", color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FolderOpenOutlined style={{ color: "#6b7280" }} />
                        {proj.name}
                      </strong>
                      <p style={{ fontSize: "11px", color: "#4b5563", margin: "4px 0 0 0", lineHeight: "1.5" }}>
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILES & LINKS */}
            <div>
              <h3
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#111827",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  margin: "0 0 10px 0"
                }}
              >
                PROFILES
              </h3>
              <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "6px", color: "#4b5563" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <GithubOutlined /> {socialLinks.github || "github.com/username"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <LinkedinOutlined /> {socialLinks.linkedin || "linkedin.com/in/username"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <SendOutlined /> {socialLinks.telegram || "t.me/username"}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (40%) */}
          <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: "26px" }}>

            {/* SUMMARY */}
            {professionalSummary && (
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    margin: "0 0 10px 0"
                  }}
                >
                  SUMMARY
                </h3>
                <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#4b5563", margin: 0 }}>
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* EDUCATION */}
            {education.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    margin: "0 0 12px 0"
                  }}
                >
                  EDUCATION
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <strong style={{ fontSize: "11.5px", color: "#111827", display: "block" }}>
                        {edu.degree}
                      </strong>
                      <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>{edu.institution}</div>
                      <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>{edu.dates}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    margin: "0 0 10px 0"
                  }}
                >
                  SKILLS
                </h3>

                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "#4b5563", lineHeight: "1.8" }}>
                  {skills.map((s, idx) => (
                    <li key={idx}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* LANGUAGE */}
            {languages.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    margin: "0 0 10px 0"
                  }}
                >
                  LANGUAGE
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

            {/* ACHIEVEMENTS / CERTIFICATIONS */}
            {certifications.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    margin: "0 0 10px 0"
                  }}
                >
                  CERTIFICATIONS
                </h3>

                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "#4b5563", lineHeight: "1.7" }}>
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

      {/* BOTTOM DECORATIVE BAR */}
      <div style={{ height: "24px", backgroundColor: primaryColor, width: "100%" }} />
    </div>
  );
}