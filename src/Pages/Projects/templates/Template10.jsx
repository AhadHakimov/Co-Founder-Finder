import React from "react";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined
} from "@ant-design/icons";

export default function Template10({
  data,
  primaryColor = "#1f6059",   // To'q zumrad yashil
  sidebarBg = "#e9e8e6",      // Och kulrang chap ustun
  mainBg = "#e8edfd",         // Och havorang-binafsharang o'ng ustun
  textColor = "#1f2937"
}) {
  const {
    personalInfo = {},
    professionalSummary = "",
    workExperience = [],
    education = [],
    skills = [],
    references = [],
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
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        boxSizing: "border-box",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden"
      }}
    >
      {/* HEADER SECTION WITH BIG PROFILE PHOTO */}
      <div
        style={{
          display: "flex",
          backgroundColor: sidebarBg,
          padding: "25px 25px 20px 25px",
          position: "relative"
        }}
      >
        <div style={{ width: "35%" }} />

        {/* GREEN PILL CONTAINER */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            backgroundColor: primaryColor,
            borderRadius: "70px",
            display: "flex",
            alignItems: "center",
            padding: "10px 35px 10px 15px",
            height: "135px",
            boxSizing: "border-box",
            zIndex: 10
          }}
        >
          {/* EXTRA LARGE PROFILE PHOTO */}
          <div
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              overflow: "hidden",
              border: "5px solid #ffffff",
              flexShrink: 0,
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)"
            }}
          >
            {personalInfo.profilePhoto ? (
              <img
                src={personalInfo.profilePhoto}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", backgroundColor: "#cbd5e1" }} />
            )}
          </div>

          {/* NAME & TITLE */}
          <div style={{ marginLeft: "30px", color: "#ffffff" }}>
            <h1
              style={{
                fontSize: "34px",
                fontWeight: "800",
                margin: 0,
                letterSpacing: "1.2px",
                lineHeight: "1.1"
              }}
            >
              {personalInfo.firstName || "Helene"} {personalInfo.lastName || "Paquet"}
            </h1>
            <div
              style={{
                fontSize: "18px",
                fontStyle: "italic",
                opacity: 0.95,
                marginTop: "6px",
                letterSpacing: "0.8px",
                fontWeight: "500"
              }}
            >
              {personalInfo.professionalTitle || "Dental Assistant"}
            </div>
          </div>
        </div>
      </div>

      {/* BODY CONTENT CONTAINER */}
      <div style={{ display: "flex", flex: 1, paddingTop: "95px" }}>

        {/* LEFT COLUMN */}
        <div
          style={{
            width: "35%",
            backgroundColor: sidebarBg,
            padding: "40px 25px 45px 25px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            boxSizing: "border-box"
          }}
        >
          {/* CONTACT */}
          <div>
            <div
              style={{
                backgroundColor: primaryColor,
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "16px",
                letterSpacing: "1.2px",
                textAlign: "center",
                padding: "10px 0",
                borderRadius: "25px",
                marginBottom: "20px"
              }}
            >
              Contact
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", lineHeight: "1.6" }}>
              {personalInfo.phone && (
                <div>
                  <div style={{ fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", color: primaryColor, letterSpacing: "0.8px", fontSize: "13.5px" }}>
                    <PhoneOutlined /> PHONE
                  </div>
                  <div style={{ color: "#374151", marginTop: "4px" }}>{personalInfo.phone}</div>
                </div>
              )}

              {personalInfo.location && (
                <div>
                  <div style={{ fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", color: primaryColor, letterSpacing: "0.8px", fontSize: "13.5px" }}>
                    <EnvironmentOutlined /> ADDRESS
                  </div>
                  <div style={{ color: "#374151", marginTop: "4px" }}>{personalInfo.location}</div>
                </div>
              )}

              {socialLinks.website && (
                <div>
                  <div style={{ fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", color: primaryColor, letterSpacing: "0.8px", fontSize: "13.5px" }}>
                    <GlobalOutlined /> WEBSITE
                  </div>
                  <div style={{ color: "#374151", marginTop: "4px", wordBreak: "break-all" }}>{socialLinks.website}</div>
                </div>
              )}

              {personalInfo.email && (
                <div>
                  <div style={{ fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", color: primaryColor, letterSpacing: "0.8px", fontSize: "13.5px" }}>
                    <MailOutlined /> EMAIL
                  </div>
                  <div style={{ color: "#374151", marginTop: "4px", wordBreak: "break-all" }}>{personalInfo.email}</div>
                </div>
              )}
            </div>
          </div>

          {/* SKILL */}
          {skills.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "16px",
                  letterSpacing: "1.2px",
                  textAlign: "center",
                  padding: "10px 0",
                  borderRadius: "25px",
                  marginBottom: "18px"
                }}
              >
                Skill
              </div>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13.5px", lineHeight: "1.9", color: "#374151" }}>
                {skills.map((skill, idx) => (
                  <li key={idx} style={{ marginBottom: "6px" }}>
                    {typeof skill === "object" ? skill.name : skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* REFERENCE */}
          <div>
            <div
              style={{
                backgroundColor: primaryColor,
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "16px",
                letterSpacing: "1.2px",
                textAlign: "center",
                padding: "10px 0",
                borderRadius: "25px",
                marginBottom: "18px"
              }}
            >
              Reference
            </div>

            {references.length > 0 ? (
              references.map((ref, idx) => (
                <div key={idx} style={{ fontSize: "13px", color: "#374151", lineHeight: "1.7" }}>
                  <div style={{ fontWeight: "800", color: "#111827", fontSize: "14px" }}>{ref.name}</div>
                  <div style={{ fontStyle: "italic", color: primaryColor, fontWeight: "600" }}>{ref.title}</div>
                  <div>{ref.company}</div>
                  {ref.phone && <div>Phone: {ref.phone}</div>}
                  {ref.address && <div>Address: {ref.address}</div>}
                </div>
              ))
            ) : (
              <div style={{ fontSize: "13px", color: "#374151", lineHeight: "1.7" }}>
                <div style={{ fontWeight: "800", color: "#111827", fontSize: "14px" }}>Chiaki Sato</div>
                <div style={{ fontStyle: "italic", color: primaryColor, fontWeight: "600" }}>Senior Dentist</div>
                <div>Borcelle Dental Clinic</div>
                <div>Phone: +123-456-7890</div>
                <div>Address: 123 Anywhere St., Any City</div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            width: "65%",
            backgroundColor: mainBg,
            padding: "40px 35px 45px 35px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            boxSizing: "border-box"
          }}
        >
          {/* SUMMARY */}
          <div>
            <div
              style={{
                backgroundColor: primaryColor,
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "16px",
                letterSpacing: "1.2px",
                textAlign: "center",
                padding: "10px 0",
                borderRadius: "25px",
                marginBottom: "18px"
              }}
            >
              Summary
            </div>
            <p style={{ fontSize: "13.5px", lineHeight: "1.75", color: "#374151", margin: 0 }}>
              {professionalSummary ||
                "Detail-oriented and compassionate Dental Assistant with experience supporting dentists in clinical procedures, maintaining patient comfort, and ensuring a clean and organized work environment. Skilled in chairside assistance, sterilization, and patient communication. Committed to delivering excellent dental care and teamwork."}
            </p>
          </div>

          {/* EDUCATION HISTORY */}
          {education.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "16px",
                  letterSpacing: "1.2px",
                  textAlign: "center",
                  padding: "10px 0",
                  borderRadius: "25px",
                  marginBottom: "18px"
                }}
              >
                Education history
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div style={{ fontSize: "15px", fontWeight: "800", color: primaryColor }}>
                        {edu.institution}
                      </div>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#6b7280" }}>{edu.dates}</div>
                    </div>
                    <div style={{ fontSize: "13.5px", fontStyle: "italic", color: "#1f2937", margin: "4px 0 8px 0" }}>
                      {edu.degree}
                    </div>
                    {edu.description && (
                      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#374151", lineHeight: "1.7" }}>
                        <li>{edu.description}</li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {workExperience.length > 0 && (
            <div>
              <div
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "16px",
                  letterSpacing: "1.2px",
                  textAlign: "center",
                  padding: "10px 0",
                  borderRadius: "25px",
                  marginBottom: "18px"
                }}
              >
                Experience
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                {workExperience.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div style={{ fontSize: "15px", fontWeight: "800", color: primaryColor }}>
                        {exp.company}
                      </div>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#6b7280" }}>{exp.dates}</div>
                    </div>
                    <div style={{ fontSize: "13.5px", fontStyle: "italic", color: "#1f2937", margin: "4px 0 8px 0" }}>
                      {exp.position}
                    </div>
                    {exp.responsibilities && (
                      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#374151", lineHeight: "1.7" }}>
                        {Array.isArray(exp.responsibilities) ? (
                          exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)
                        ) : (
                          <li>{exp.responsibilities}</li>
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}