import React from "react";
import { UserOutlined } from "@ant-design/icons";

export default function Template09({
  data,
  primaryColor = "#5c7365",   // To'q zaytun yashil
  sidebarBg = "#e8e7e3",      // Och kulrang chap ustun
  mainBg = "#e5e9f2",         // Och havorang-kulrang o'ng ustun
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
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden"
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ display: "flex", height: "200px", position: "relative" }}>
        {/* TOP LEFT BG */}
        <div style={{ width: "35%", backgroundColor: sidebarBg }} />

        {/* TOP RIGHT GREEN BANNER */}
        <div
          style={{
            width: "65%",
            backgroundColor: primaryColor,
            color: "#ffffff",
            padding: "22px 28px 18px 105px", // Image aylanasiga joy ajratish uchun padding-left kengaytirildi
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box"
          }}
        >
          {/* NAME */}
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "800",
              letterSpacing: "2px",
              margin: 0,
              textTransform: "uppercase",
              color: "#ffffff",
              lineHeight: "1.2"
            }}
          >
            {personalInfo.firstName || "OLIVIA"} {personalInfo.lastName || "WILSON"}
          </h1>

          {/* TITLE */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "#ffffff",
              opacity: 0.9,
              marginTop: "4px",
              marginBottom: "12px"
            }}
          >
            {personalInfo.professionalTitle || "DESIGNER AND ARCHITECT"}
          </div>

          {/* ABOUT ME WITH USER ICON */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "6px",
                color: "#ffffff"
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  color: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "bold"
                }}
              >
                <UserOutlined />
              </div>
              <span>ABOUT ME</span>
            </div>

            {/* SUMMARY TEXT (HIGH CONTRAST & READABLE) */}
            <p
              style={{
                fontSize: "10px",
                lineHeight: "1.45",
                margin: 0,
                color: "#ffffff",
                opacity: 0.92,
                fontWeight: "400"
              }}
            >
              {professionalSummary ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est tempor, quis tempus arcu elementum. In elementum elit at dui tristique feugiat."}
            </p>
          </div>
        </div>

        {/* OVERLAPPING CIRCLE PROFILE IMAGE */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "22px",
            width: "170px",
            height: "170px",
            borderRadius: "50%",
            border: `7px solid ${primaryColor}`,
            backgroundColor: "#ffffff",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 10
          }}
        >
          {personalInfo.profilePhoto ? (
            <img
              src={personalInfo.profilePhoto}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#d1d5db" }} />
          )}
        </div>
      </div>

      {/* MAIN BODY CONTAINER */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        
        {/* LEFT COLUMN */}
        <div
          style={{
            width: "35%",
            backgroundColor: sidebarBg,
            padding: "30px 20px 30px 25px",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            boxSizing: "border-box"
          }}
        >
          {/* SKILLS */}
          {skills.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  color: primaryColor,
                  fontWeight: "800",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  padding: "5px 12px",
                  marginBottom: "10px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                SKILLS
              </div>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10px", lineHeight: "1.8", color: "#4b5563" }}>
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
                  backgroundColor: "#ffffff",
                  color: primaryColor,
                  fontWeight: "800",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  padding: "5px 12px",
                  marginBottom: "10px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                LANGUAGES
              </div>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10px", lineHeight: "1.8", color: "#4b5563" }}>
                {languages.map((lang, idx) => (
                  <li key={idx}>
                    {lang.language} {lang.level ? `- ${lang.level}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  color: primaryColor,
                  fontWeight: "800",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  padding: "5px 12px",
                  marginBottom: "10px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                EDUCATION
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: "10px", fontWeight: "800", color: "#1f2937", textTransform: "uppercase" }}>
                      {edu.degree}
                    </div>
                    <div style={{ fontSize: "9.5px", color: "#6b7280" }}>{edu.institution}</div>
                    <div style={{ fontSize: "9px", color: "#9ca3af" }}>{edu.dates}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT */}
          <div>
            <div
              style={{
                backgroundColor: "#ffffff",
                color: primaryColor,
                fontWeight: "800",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                padding: "5px 12px",
                marginBottom: "10px",
                width: "100%",
                boxSizing: "border-box"
              }}
            >
              CONTACT
            </div>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "9.5px", lineHeight: "1.8", color: "#4b5563" }}>
              {personalInfo.phone && <li>{personalInfo.phone}</li>}
              {personalInfo.email && <li style={{ wordBreak: "break-all" }}>{personalInfo.email}</li>}
              {socialLinks.website && <li>{socialLinks.website}</li>}
              {personalInfo.location && <li>{personalInfo.location}</li>}
            </ul>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            width: "65%",
            backgroundColor: mainBg,
            padding: "30px 25px 60px 25px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxSizing: "border-box",
            position: "relative"
          }}
        >
          {/* WORK EXPERIENCE */}
          {workExperience.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  fontWeight: "800",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  padding: "6px 14px",
                  marginBottom: "14px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                WORK EXPERIENCE
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {workExperience.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: primaryColor, textTransform: "uppercase" }}>
                      {exp.position}
                    </div>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#4b5563" }}>
                      {exp.company}
                    </div>
                    <div style={{ fontSize: "9.5px", color: "#6b7280", marginBottom: "4px" }}>
                      {exp.dates}
                    </div>
                    {exp.responsibilities && (
                      <p style={{ fontSize: "10px", color: "#4b5563", margin: 0, lineHeight: "1.55" }}>
                        {exp.responsibilities}
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
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  fontWeight: "800",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  padding: "6px 14px",
                  marginBottom: "10px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                PROJECTS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <strong style={{ fontSize: "10.5px", color: primaryColor }}>{proj.name}</strong>
                    <p style={{ fontSize: "10px", color: "#4b5563", margin: "2px 0 0 0", lineHeight: "1.45" }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOTTOM RIGHT SVG DECORATION */}
          <div
            style={{
              position: "absolute",
              bottom: "0px",
              right: "0px",
              width: "180px",
              height: "75px",
              pointerEvents: "none"
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 180 75" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g fill={primaryColor} opacity="0.8">
                <circle cx="45" cy="55" r="2.5" />
                <circle cx="35" cy="52" r="2.2" />
                <circle cx="27" cy="46" r="2.0" />
                <circle cx="21" cy="38" r="1.8" />
                <circle cx="18" cy="28" r="1.6" />
                <circle cx="55" cy="42" r="2.2" />
                <circle cx="48" cy="33" r="2.0" />
                <circle cx="39" cy="26" r="1.8" />
                <circle cx="29" cy="21" r="1.6" />
                <circle cx="60" cy="25" r="2.0" />
                <circle cx="52" cy="17" r="1.8" />
                <circle cx="42" cy="12" r="1.6" />
              </g>
              <path d="M75 75 L95 25 L110 25 L90 75 Z" fill={primaryColor} />
              <path d="M100 75 L120 25 L180 25 L180 75 Z" fill={primaryColor} />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}