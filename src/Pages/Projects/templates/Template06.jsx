import React from "react";
import {
  PhoneFilled,
  MailFilled,
  EnvironmentFilled,
  GithubOutlined,
  LinkedinOutlined,
  SendOutlined
} from "@ant-design/icons";

export default function Template06Resume({ data }) {
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

  const primaryColor = "#6e6c67";
  const leftBgColor = "#e0dfda";

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
        flexDirection: "column"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: "200px",
          backgroundColor: primaryColor,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "60px",
          boxSizing: "border-box"
        }}
      >
        <div style={{ textAlign: "right", color: "#ffffff" }}>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              margin: 0,
              lineHeight: "1.15"
            }}
          >
            {personalInfo.firstName || "Ahror"} <br />
            {personalInfo.lastName || "Ahmadov"}
          </h1>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "500",
              margin: "6px 0 0 0",
              letterSpacing: "0.5px",
              opacity: 0.9
            }}
          >
            {personalInfo.professionalTitle || "Senior Frontend Developer"}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* LEFT COLUMN */}
        <div
          style={{
            width: "36%",
            backgroundColor: leftBgColor,
            padding: "0 25px 40px 25px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            boxSizing: "border-box"
          }}
        >
          {/* PROFILE PHOTO */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "150px",
                height: "210px",
                marginTop: "-100px",
                borderRadius: "100px",
                border: `8px solid ${leftBgColor}`,
                backgroundColor: "#cccccc",
                overflow: "hidden",
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

          {/* CONTACT INFO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "10.5px", color: "#374151" }}>
            {personalInfo.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: primaryColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                  <PhoneFilled />
                </div>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: primaryColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                  <MailFilled />
                </div>
                <span style={{ wordBreak: "break-all" }}>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.location && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: primaryColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                  <EnvironmentFilled />
                </div>
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>

          {/* PROFILES */}
          {(socialLinks.github || socialLinks.linkedin || socialLinks.telegram) && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "12px", textTransform: "uppercase", color: "#1f2937", marginBottom: "8px" }}>Profiles</div>
              <div style={{ fontSize: "10.5px", display: "flex", flexDirection: "column", gap: "6px", color: "#4b5563" }}>
                {socialLinks.github && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><GithubOutlined /> {socialLinks.github}</div>}
                {socialLinks.linkedin && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><LinkedinOutlined /> {socialLinks.linkedin}</div>}
                {socialLinks.telegram && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><SendOutlined /> {socialLinks.telegram}</div>}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "12px", textTransform: "uppercase", color: "#1f2937", marginBottom: "8px" }}>Languages</div>
              <div style={{ fontSize: "10.5px", display: "flex", flexDirection: "column", gap: "4px", color: "#4b5563" }}>
                {languages.map((lang, idx) => (
                  <div key={idx}>
                    <strong>{lang.language}:</strong> {lang.level}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "12px", textTransform: "uppercase", color: "#1f2937", marginBottom: "8px" }}>Skills</div>
              <div style={{ fontSize: "10.5px", lineHeight: "1.6", color: "#4b5563" }}>
                {skills.map((s) => s.name || s).join(", ")}.
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: "64%", padding: "35px 35px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ABOUT ME */}
          {professionalSummary && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "13px", textTransform: "uppercase", color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: "3px", marginBottom: "8px" }}>About me</div>
              <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#4b5563", margin: 0 }}>
                {professionalSummary}
              </p>
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {workExperience.length > 0 && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "13px", textTransform: "uppercase", color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: "3px", marginBottom: "10px" }}>Work experience</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {workExperience.map((exp, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "11.5px", color: "#111827", display: "block" }}>{exp.position}</strong>
                    <div style={{ fontSize: "10.5px", fontStyle: "italic", color: "#6b7280", margin: "1px 0 4px 0" }}>
                      {exp.company} | {exp.dates}
                    </div>
                    {exp.responsibilities && (
                      <p style={{ fontSize: "10.5px", color: "#4b5563", margin: 0, lineHeight: "1.5" }}>
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACADEMIC DATA */}
          {education.length > 0 && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "13px", textTransform: "uppercase", color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: "3px", marginBottom: "10px" }}>Academic data</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "11px", color: "#111827", display: "block" }}>{edu.institution}</strong>
                    <div style={{ fontSize: "10.5px", color: "#4b5563" }}>
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
              <div style={{ fontWeight: "700", fontSize: "13px", textTransform: "uppercase", color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: "3px", marginBottom: "8px" }}>Projects</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "11px", color: "#111827" }}>{proj.name}</strong>
                    <p style={{ fontSize: "10.5px", color: "#4b5563", margin: "2px 0 0 0", lineHeight: "1.4" }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "13px", textTransform: "uppercase", color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: "3px", marginBottom: "6px" }}>Certifications</div>
              <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10.5px", color: "#4b5563" }}>
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    <strong>{cert.name || cert}</strong> {cert.organization ? `- ${cert.organization}` : ""}
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