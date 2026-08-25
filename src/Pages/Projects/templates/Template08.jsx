import React from "react";
import {
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined
} from "@ant-design/icons";

export default function Template08({
  data,
  primaryColor = "#848c7c",   // Sage Green / Zaytun rang (Chap ustun va sarlavhalar)
  secondaryColor = "#f0efe9", // Cream / Bej rang (O'ng ustun va footer foni)
  textColor = "#3c3c3c"
}) {
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
        color: textColor,
        fontFamily: "'Inter', 'Arial', sans-serif",
        boxSizing: "border-box",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {/* MAIN CONTENT CONTAINER */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* LEFT COLUMN (SAGE GREEN SIDEBAR) */}
        <div
          style={{
            width: "36%",
            backgroundColor: primaryColor,
            color: "#ffffff",
            padding: "35px 25px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            boxSizing: "border-box"
          }}
        >
          {/* PROFILE IMAGE */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "170px",
                height: "210px",
                backgroundColor: "rgba(255,255,255,0.2)",
                overflow: "hidden"
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

          {/* PROFILE / ABOUT ME */}
          {professionalSummary && (
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                  paddingBottom: "4px",
                  marginBottom: "10px"
                }}
              >
                Profile
              </div>
              <p style={{ fontSize: "10.5px", lineHeight: "1.6", margin: 0, opacity: 0.9 }}>
                {professionalSummary}
              </p>
            </div>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                  paddingBottom: "4px",
                  marginBottom: "10px"
                }}
              >
                Skills
              </div>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10.5px", lineHeight: "1.7", opacity: 0.9 }}>
                {skills.map((skill, idx) => (
                  <li key={idx}>{skill.name || skill}</li>
                ))}
              </ul>
            </div>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                  paddingBottom: "4px",
                  marginBottom: "10px"
                }}
              >
                Languages
              </div>
              <div style={{ fontSize: "10.5px", display: "flex", flexDirection: "column", gap: "4px", opacity: 0.9 }}>
                {languages.map((lang, idx) => (
                  <div key={idx}>
                    <strong>{lang.language}:</strong> {lang.level}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS / AWARDS */}
          {certifications.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                  paddingBottom: "4px",
                  marginBottom: "10px"
                }}
              >
                Awards
              </div>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10.5px", lineHeight: "1.6", opacity: 0.9 }}>
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    <strong>{cert.name || cert}</strong> {cert.organization ? `- ${cert.organization}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            width: "64%",
            backgroundColor: secondaryColor,
            padding: "40px 35px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            boxSizing: "border-box"
          }}
        >
          {/* HEADER */}
          <div style={{ borderBottom: `1px solid ${primaryColor}`, paddingBottom: "16px" }}>
            <h1
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "34px",
                fontWeight: "400",
                color: primaryColor,
                margin: 0,
                lineHeight: "1.1"
              }}
            >
              {personalInfo.firstName || "Catrine"} {personalInfo.lastName || "Ziv"}
            </h1>
            <p
              style={{
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "2.5px",
                color: "#6b7280",
                margin: "8px 0 0 0"
              }}
            >
              {personalInfo.professionalTitle || "IT Project Manager"}
            </p>
          </div>

          {/* WORK EXPERIENCE */}
          {workExperience.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: primaryColor,
                  marginBottom: "14px"
                }}
              >
                Work Experience
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {workExperience.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#1f2937" }}>
                      {exp.position}
                    </div>
                    <div style={{ fontSize: "10px", fontStyle: "italic", color: "#6b7280", margin: "2px 0 6px 0" }}>
                      {exp.company} | {exp.dates}
                    </div>
                    {exp.responsibilities && (
                      <p style={{ fontSize: "10.5px", color: "#4b5563", margin: 0, lineHeight: "1.6" }}>
                        - {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATIONAL HISTORY */}
          {education.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: primaryColor,
                  borderTop: `1px solid ${primaryColor}40`,
                  paddingTop: "16px",
                  marginBottom: "14px"
                }}
              >
                Educational History
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#1f2937" }}>
                      {edu.institution}
                    </div>
                    <div style={{ fontSize: "10px", fontStyle: "italic", color: "#6b7280", margin: "2px 0 4px 0" }}>
                      {edu.degree} | {edu.dates}
                    </div>
                    {edu.description && (
                      <p style={{ fontSize: "10.5px", color: "#4b5563", margin: 0, lineHeight: "1.5" }}>
                        - {edu.description}
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
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: primaryColor,
                  borderTop: `1px solid ${primaryColor}40`,
                  paddingTop: "16px",
                  marginBottom: "12px"
                }}
              >
                Projects
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "11px", color: "#1f2937" }}>{proj.name}</strong>
                    <p style={{ fontSize: "10.5px", color: "#4b5563", margin: "2px 0 0 0", lineHeight: "1.5" }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER BAR */}
      <div
        style={{
          backgroundColor: secondaryColor,
          borderTop: `1px solid ${primaryColor}30`,
          padding: "12px 35px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          fontSize: "10.5px",
          color: "#4b5563"
        }}
      >
        {personalInfo.phone && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <PhoneOutlined style={{ color: primaryColor }} />
            <span>{personalInfo.phone}</span>
          </div>
        )}

        {personalInfo.email && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MailOutlined style={{ color: primaryColor }} />
            <span>{personalInfo.email}</span>
          </div>
        )}

        {socialLinks.website ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <GlobalOutlined style={{ color: primaryColor }} />
            <span>{socialLinks.website}</span>
          </div>
        ) : personalInfo.location && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <GlobalOutlined style={{ color: primaryColor }} />
            <span>{personalInfo.location}</span>
          </div>
        )}
      </div>

    </div>
  );
}