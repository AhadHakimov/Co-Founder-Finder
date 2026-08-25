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

export default function Template05({ data, primaryColor = "#466995" }) {
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
      {/* LEFT COLUMN (32% - LIGHT GRAY BACKGROUND) */}
      <div
        style={{
          width: "32%",
          backgroundColor: "#e5e9f0",
          padding: "35px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "26px"
        }}
      >
        {/* RECTANGLE PROFILE PHOTO */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "160px",
              height: "200px",
              backgroundColor: "#ffffff",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
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

        {/* CONTACT INFO WITH CIRCLE ICONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "11px", color: "#374151" }}>
          {personalInfo.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: primaryColor,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  flexShrink: 0
                }}
              >
                <PhoneOutlined />
              </div>
              <span>{personalInfo.phone}</span>
            </div>
          )}

          {personalInfo.email && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: primaryColor,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  flexShrink: 0
                }}
              >
                <MailOutlined />
              </div>
              <span style={{ wordBreak: "break-all" }}>{personalInfo.email}</span>
            </div>
          )}

          {personalInfo.location && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: primaryColor,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  flexShrink: 0
                }}
              >
                <EnvironmentOutlined />
              </div>
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>

        {/* PROFILES & LINKS */}
        <div>
          <div
            style={{
              backgroundColor: primaryColor,
              color: "#ffffff",
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              marginBottom: "12px"
            }}
          >
            Profiles
          </div>
          <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "8px", color: "#374151" }}>
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

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <div>
            <div
              style={{
                backgroundColor: primaryColor,
                color: "#ffffff",
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                marginBottom: "12px"
              }}
            >
              Languages
            </div>
            <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "6px", color: "#374151" }}>
              {languages.map((lang, idx) => (
                <div key={idx}>
                  <strong>{lang.language}:</strong> {lang.level || "Native"}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <div>
            <div
              style={{
                backgroundColor: primaryColor,
                color: "#ffffff",
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                marginBottom: "12px"
              }}
            >
              Skills
            </div>
            <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#374151", margin: 0 }}>
              {skills.map((s) => s.name).join(", ")}.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN (68%) */}
      <div style={{ width: "68%", display: "flex", flexDirection: "column" }}>
        
        {/* HEADER BLOCK */}
        <div
          style={{
            height: "120px",
            backgroundColor: primaryColor,
            color: "#ffffff",
            padding: "30px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: "1"
            }}
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p
            style={{
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              margin: "8px 0 0 0",
              opacity: 0.9
            }}
          >
            {personalInfo.professionalTitle}
          </p>
        </div>

        {/* CONTENT AREA */}
        <div style={{ padding: "35px 40px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* ABOUT ME */}
          {professionalSummary && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  marginBottom: "10px"
                }}
              >
                About me
              </div>
              <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#4b5563", margin: 0 }}>
                {professionalSummary}
              </p>
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {workExperience.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  marginBottom: "14px"
                }}
              >
                Work experience
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {workExperience.map((exp, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "12px", color: "#111827", display: "block" }}>{exp.position}</strong>
                    <div style={{ fontSize: "10.5px", fontStyle: "italic", color: "#6b7280", margin: "2px 0 6px 0" }}>
                      {exp.company} | {exp.dates}
                    </div>
                    {exp.responsibilities && (
                      <p style={{ fontSize: "11px", color: "#4b5563", margin: 0, lineHeight: "1.6" }}>
                        - {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACADEMIC DATA / EDUCATION */}
          {education.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  marginBottom: "14px"
                }}
              >
                Academic data
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "11.5px", color: "#111827", display: "block" }}>
                      {edu.institution}
                    </strong>
                    <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>
                      {edu.degree} | {edu.dates}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  marginBottom: "12px"
                }}
              >
                Projects
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "11.5px", color: "#111827" }}>{proj.name}</strong>
                    <p style={{ fontSize: "11px", color: "#4b5563", margin: "2px 0 0 0", lineHeight: "1.5" }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES */}
          {certifications.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  marginBottom: "10px"
                }}
              >
                Certifications
              </div>

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
  );
}