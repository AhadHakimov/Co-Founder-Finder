import React from "react";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GithubOutlined,
  LinkedinOutlined,
  SendOutlined
} from "@ant-design/icons";

export default function Template07({
  data,
  primaryColor = "#2b4374",    // To'q rang (Header, Chap blok tepasi, pastki banner)
  secondaryColor = "#e8ecf8",  // Och rang (Kartochkalar foni)
  accentColor = "#00d494"      // Yorqin rang (Badge, Progress-bar, ikonkalar)
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
        color: primaryColor,
        fontFamily: "'Inter', 'Arial', sans-serif",
        boxSizing: "border-box",
        padding: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        display: "flex",
        gap: "16px"
      }}
    >
      {/* LEFT COLUMN */}
      <div style={{ width: "36%", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* PROFILE PHOTO + EDUCATION CARD */}
        <div
          style={{
            backgroundColor: primaryColor,
            borderRadius: "20px",
            color: "#ffffff",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* PROFILE IMAGE */}
          <div style={{ width: "100%", height: "230px", backgroundColor: "rgba(255,255,255,0.1)", position: "relative" }}>
            {personalInfo.profilePhoto && (
              <img
                src={personalInfo.profilePhoto}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: accentColor,
                color: primaryColor,
                padding: "4px 14px",
                borderRadius: "12px",
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                whiteSpace: "nowrap"
              }}
            >
              {personalInfo.professionalTitle || "Developer"}
            </div>
          </div>

          {/* EDUCATION */}
          {education.length > 0 && (
            <div style={{ padding: "20px 18px" }}>
              <div style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>
                Education
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "11px", color: "#ffffff", display: "block" }}>
                      {edu.degree}
                    </strong>
                    <div style={{ fontSize: "10px", opacity: 0.8, marginTop: "2px" }}>
                      {edu.institution}
                    </div>
                    <div style={{ fontSize: "9.5px", opacity: 0.6, marginTop: "1px" }}>
                      {edu.dates}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* EXPERTISE & CONTACT CARD */}
        <div
          style={{
            backgroundColor: secondaryColor,
            borderRadius: "20px",
            padding: "20px 18px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* SKILLS */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", color: primaryColor }}>
              Expertise
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {skills.slice(0, 6).map((skill, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", fontWeight: "600", marginBottom: "3px" }}>
                    <span>{skill.name || skill}</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${85 - idx * 7}%`,
                        height: "100%",
                        backgroundColor: accentColor,
                        borderRadius: "3px"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <div style={{ marginTop: "18px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: primaryColor, marginBottom: "6px" }}>
                  Languages
                </div>
                {languages.map((lang, idx) => (
                  <div key={idx} style={{ fontSize: "10px", color: "#475569", marginBottom: "2px" }}>
                    <strong>{lang.language}:</strong> {lang.level}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTACT INFO */}
          <div style={{ marginTop: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={{
                backgroundColor: accentColor,
                borderRadius: "20px",
                padding: "10px 8px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                color: primaryColor,
                fontSize: "12px",
                alignItems: "center"
              }}
            >
              <PhoneOutlined />
              <MailOutlined />
              <EnvironmentOutlined />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "10px", color: primaryColor, fontWeight: "500" }}>
              <div>
                <span style={{ fontWeight: "700", display: "block" }}>Phone</span>
                {personalInfo.phone}
              </div>
              <div>
                <span style={{ fontWeight: "700", display: "block" }}>Email</span>
                <span style={{ wordBreak: "break-all" }}>{personalInfo.email}</span>
              </div>
              <div>
                <span style={{ fontWeight: "700", display: "block" }}>Location</span>
                {personalInfo.location}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN */}
      <div style={{ width: "64%", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* HEADER CARD */}
        <div
          style={{
            backgroundColor: secondaryColor,
            borderRadius: "20px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: primaryColor, margin: 0, lineHeight: "1.1" }}>
              {personalInfo.firstName} <span style={{ fontWeight: "400" }}>{personalInfo.lastName}</span>
            </h1>
            <div
              style={{
                display: "inline-block",
                backgroundColor: accentColor,
                color: primaryColor,
                padding: "3px 10px",
                borderRadius: "8px",
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                marginTop: "8px"
              }}
            >
              {personalInfo.professionalTitle}
            </div>
          </div>
        </div>

        {/* PROFILE CARD */}
        {professionalSummary && (
          <div style={{ backgroundColor: secondaryColor, borderRadius: "20px", padding: "20px 24px" }}>
            <div style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", color: primaryColor, marginBottom: "8px" }}>
              Profile
            </div>
            <p style={{ fontSize: "10.5px", lineHeight: "1.6", color: "#475569", margin: 0 }}>
              {professionalSummary}
            </p>
            <div style={{ width: "100%", height: "4px", backgroundColor: accentColor, borderRadius: "2px", marginTop: "12px" }} />
          </div>
        )}

        {/* WORK EXPERIENCE CARD */}
        {workExperience.length > 0 && (
          <div style={{ backgroundColor: secondaryColor, borderRadius: "20px", padding: "20px 24px", flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", color: primaryColor, marginBottom: "14px" }}>
              Work Experience
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {workExperience.map((exp, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: "11.5px", fontWeight: "700", color: primaryColor }}>
                    {exp.position}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "3px 0 6px 0" }}>
                    <span
                      style={{
                        backgroundColor: accentColor,
                        color: primaryColor,
                        fontSize: "9px",
                        fontWeight: "700",
                        padding: "1px 6px",
                        borderRadius: "4px"
                      }}
                    >
                      {exp.dates}
                    </span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>{exp.company}</span>
                  </div>
                  {exp.responsibilities && (
                    <p style={{ fontSize: "10.5px", color: "#475569", margin: 0, lineHeight: "1.5" }}>
                      {exp.responsibilities}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* PROJECTS */}
            {projects.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", color: primaryColor, marginBottom: "6px" }}>
                  Projects
                </div>
                {projects.map((proj, idx) => (
                  <div key={idx} style={{ fontSize: "10px", color: "#475569" }}>
                    <strong style={{ color: primaryColor }}>{proj.name}:</strong> {proj.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOTTOM BANNER CARD */}
        <div style={{ backgroundColor: primaryColor, borderRadius: "20px", padding: "16px 20px", color: "#ffffff" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
            Design That Connects
          </div>
          <p style={{ fontSize: "9.5px", lineHeight: "1.5", opacity: 0.8, margin: 0 }}>
            Creating clean, scalable, and user-friendly web solutions that leave a lasting impression.
          </p>
        </div>

      </div>
    </div>
  );
}