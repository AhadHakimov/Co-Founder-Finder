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

export default function Template02({ data, primaryColor = "#2c3e50" }) {
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
        display: "flex"
      }}
    >
      {/* LEFT SIDEBAR (DARK COLUMN - 33%) */}
      <div
        style={{
          width: "33%",
          backgroundColor: primaryColor,
          color: "#ffffff",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "28px"
        }}
      >
        {/* PROFILE PHOTO (CIRCLE) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid rgba(255, 255, 255, 0.2)",
              backgroundColor: "#ffffff"
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

        {/* CONTACT */}
        <div>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "1px",
              marginBottom: "12px",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              paddingBottom: "6px"
            }}
          >
            Contact
          </h3>
          <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "10px", opacity: 0.9 }}>
            {personalInfo.location && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <EnvironmentOutlined />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <PhoneOutlined />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MailOutlined />
                <span style={{ wordBreak: "break-all" }}>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.portfolio && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <GlobalOutlined />
                <span>{personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        {/* PROFILES & LINKS */}
        <div>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "1px",
              marginBottom: "12px",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              paddingBottom: "6px"
            }}
          >
            Profiles
          </h3>
          <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "10px", opacity: 0.9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <GithubOutlined />
              <span>{socialLinks.github || "github.com/username"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <LinkedinOutlined />
              <span>{socialLinks.linkedin || "linkedin.com/in/username"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SendOutlined />
              <span>{socialLinks.telegram || "t.me/username"}</span>
            </div>
          </div>
        </div>

        {/* EDUCATION */}
        {education.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "1px",
                marginBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                paddingBottom: "6px"
              }}
            >
              Education
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <strong style={{ fontSize: "11.5px", color: "#ffffff", display: "block" }}>
                    {edu.institution}
                  </strong>
                  <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "2px" }}>{edu.degree}</div>
                  <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "2px" }}>{edu.dates}</div>
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
                fontSize: "15px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "1px",
                marginBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                paddingBottom: "6px"
              }}
            >
              Skills
            </h3>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", lineHeight: "1.8", opacity: 0.9 }}>
              {skills.map((s, idx) => (
                <li key={idx}>{s.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "1px",
                marginBottom: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                paddingBottom: "6px"
              }}
            >
              Languages
            </h3>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", lineHeight: "1.8", opacity: 0.9 }}>
              {languages.map((lang, idx) => (
                <li key={idx}>
                  {lang.language} {lang.level && `(${lang.level})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT CONTENT (67%) */}
      <div
        style={{
          width: "67%",
          padding: "45px 35px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>

          {/* HEADER NAME & TITLE */}
          <div>
            <h1
              style={{
                fontSize: "34px",
                fontWeight: "800",
                color: primaryColor,
                margin: 0,
                lineHeight: "1.1"
              }}
            >
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#555555",
                margin: "6px 0 14px 0",
                fontWeight: "500"
              }}
            >
              {personalInfo.professionalTitle}
            </p>
            {professionalSummary && (
              <p style={{ fontSize: "11.5px", lineHeight: "1.7", color: "#555555", margin: 0 }}>
                {professionalSummary}
              </p>
            )}
          </div>

          {/* WORK EXPERIENCE */}
          {workExperience.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: primaryColor,
                  margin: "0 0 14px 0",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "4px"
                }}
              >
                Work Experience
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {workExperience.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <strong style={{ fontSize: "13px", color: "#111827" }}>
                        {exp.position}, {exp.company}
                      </strong>
                    </div>
                    <div style={{ fontSize: "11px", color: "#777777", margin: "2px 0 6px 0" }}>
                      {exp.dates} {exp.location && `| ${exp.location}`}
                    </div>
                    {exp.responsibilities && (
                      <p style={{ fontSize: "11.5px", color: "#555555", margin: 0, lineHeight: "1.6" }}>
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
                  fontSize: "16px",
                  fontWeight: "700",
                  color: primaryColor,
                  margin: "0 0 14px 0",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "4px"
                }}
              >
                Projects
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "12.5px", color: "#111827", display: "flex", alignItems: "center", gap: "6px" }}>
                      <FolderOpenOutlined style={{ color: primaryColor }} />
                      {proj.name}
                    </strong>
                    <p style={{ fontSize: "11.5px", color: "#555555", margin: "4px 0 0 0", lineHeight: "1.6" }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS / ACHIEVEMENTS */}
          {certifications.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: primaryColor,
                  margin: "0 0 14px 0",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "4px"
                }}
              >
                Certification & Achievements
              </h3>

              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "11.5px", color: "#555555", lineHeight: "1.8" }}>
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
  );
}