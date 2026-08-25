import React from "react";
import {
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    TrophyOutlined,
    FolderOpenOutlined,
    GithubOutlined,
    LinkedinOutlined,
    SendOutlined,
    LinkOutlined
} from "@ant-design/icons";

export default function Template01({ data, primaryColor = "#2563eb" }) {
    const {
        personalInfo = {},
        professionalSummary = "",
        workExperience = [],
        education = [],
        skills = [],
        languages = [],
        projects = [],
        certifications = [],
        socialLinks = {} // github, linkedin, telegram, website
    } = data || {};

    return (
        <div
            style={{
                width: "210mm",
                minHeight: "297mm",
                margin: "0 auto",
                backgroundColor: "#ffffff",
                color: "#2b2b2b",
                fontFamily: "'Inter', 'Arial', sans-serif",
                boxSizing: "border-box",
                position: "relative",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}
        >
            <div>
                {/* HEADER BLOCK */}
                <div
                    style={{
                        height: "150px",
                        backgroundColor: primaryColor,
                        borderBottomLeftRadius: "28px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "260px",
                        paddingRight: "40px",
                        position: "relative"
                    }}
                >
                    {/* PROFILE PHOTO */}
                    <div
                        style={{
                            position: "absolute",
                            top: "20px",
                            left: "40px",
                            width: "180px",
                            height: "200px",
                            borderRadius: "32px",
                            overflow: "hidden",
                            backgroundColor: "#f3f4f6",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                            border: "4px solid #ffffff"
                        }}
                    >
                        {personalInfo.profilePhoto && (
                            <img
                                src={personalInfo.profilePhoto}
                                alt="Profile"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        )}
                    </div>

                    {/* NAME & TITLE */}
                    <div style={{ color: "#ffffff" }}>
                        <h1
                            style={{
                                fontSize: "32px",
                                fontWeight: "800",
                                letterSpacing: "2px",
                                textTransform: "uppercase",
                                margin: 0,
                                lineHeight: "1.1"
                            }}
                        >
                            {personalInfo.firstName} {personalInfo.lastName}
                        </h1>
                        <p
                            style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                fontStyle: "italic",
                                margin: "8px 0 0 0",
                                letterSpacing: "1px",
                                opacity: 0.95
                            }}
                        >
                            {personalInfo.professionalTitle}
                        </p>
                    </div>
                </div>

                {/* MAIN TWO-COLUMN BODY */}
                <div style={{ display: "flex", padding: "85px 40px 30px 40px", gap: "45px" }}>

                    {/* LEFT COLUMN (34%) */}
                    <div style={{ width: "34%", display: "flex", flexDirection: "column", gap: "34px" }}>

                        {/* CONTACT */}
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                    CONTACT
                                </h3>
                                <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                            </div>

                            <div style={{ fontSize: "11.5px", display: "flex", flexDirection: "column", gap: "12px", color: "#4b5563" }}>
                                {personalInfo.phone && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ backgroundColor: primaryColor, color: "#fff", padding: "5px 7px", borderRadius: "5px", fontSize: "11px" }}>
                                            <PhoneOutlined />
                                        </div>
                                        <span>{personalInfo.phone}</span>
                                    </div>
                                )}
                                {personalInfo.email && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ backgroundColor: primaryColor, color: "#fff", padding: "5px 7px", borderRadius: "5px", fontSize: "11px" }}>
                                            <MailOutlined />
                                        </div>
                                        <span style={{ wordBreak: "break-all" }}>{personalInfo.email}</span>
                                    </div>
                                )}
                                {personalInfo.location && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ backgroundColor: primaryColor, color: "#fff", padding: "5px 7px", borderRadius: "5px", fontSize: "11px" }}>
                                            <EnvironmentOutlined />
                                        </div>
                                        <span>{personalInfo.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SOCIAL / LINKS (YANGI QO'SHILGAN BO'LIM) */}
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                    PROFILES & LINKS
                                </h3>
                                <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                            </div>

                            <div style={{ fontSize: "11.5px", display: "flex", flexDirection: "column", gap: "12px", color: "#4b5563" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ backgroundColor: primaryColor, color: "#fff", padding: "5px 7px", borderRadius: "5px", fontSize: "11px" }}>
                                        <GithubOutlined />
                                    </div>
                                    <span>{socialLinks.github || "github.com/username"}</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ backgroundColor: primaryColor, color: "#fff", padding: "5px 7px", borderRadius: "5px", fontSize: "11px" }}>
                                        <LinkedinOutlined />
                                    </div>
                                    <span>{socialLinks.linkedin || "linkedin.com/in/username"}</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ backgroundColor: primaryColor, color: "#fff", padding: "5px 7px", borderRadius: "5px", fontSize: "11px" }}>
                                        <SendOutlined />
                                    </div>
                                    <span>{socialLinks.telegram || "t.me/username"}</span>
                                </div>

                                {personalInfo.portfolio && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ backgroundColor: primaryColor, color: "#fff", padding: "5px 7px", borderRadius: "5px", fontSize: "11px" }}>
                                            <GlobalOutlined />
                                        </div>
                                        <span>{personalInfo.portfolio}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* EDUCATION */}
                        {education.length > 0 && (
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                        EDUCATION
                                    </h3>
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    {education.map((edu, idx) => (
                                        <div key={idx}>
                                            <strong style={{ fontSize: "12px", color: "#111827", display: "block", lineHeight: "1.3" }}>
                                                {edu.degree}
                                            </strong>
                                            <div style={{ fontSize: "11.5px", color: "#4b5563", marginTop: "3px" }}>{edu.institution}</div>
                                            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "3px" }}>{edu.dates}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SKILLS */}
                        {skills.length > 0 && (
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                        SKILLS
                                    </h3>
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {skills.map((s, idx) => (
                                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: "11.5px", color: "#374151" }}>{s.name}</span>
                                            <div style={{ width: "65px", height: "6px", backgroundColor: "#e5e7eb", borderRadius: "3px" }}>
                                                <div style={{ width: `${s.level || 70}%`, height: "100%", backgroundColor: primaryColor, borderRadius: "3px" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* LANGUAGE */}
                        {languages.length > 0 && (
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                        LANGUAGE
                                    </h3>
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                                </div>

                                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11.5px", color: "#374151", lineHeight: "2.2" }}>
                                    {languages.map((lang, idx) => (
                                        <li key={idx}>
                                            {lang.language} {lang.level && `(${lang.level})`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN (66%) */}
                    <div style={{ width: "66%", display: "flex", flexDirection: "column", gap: "34px" }}>

                        {/* ABOUT ME */}
                        {professionalSummary && (
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                        ABOUT ME
                                    </h3>
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                                </div>
                                <p style={{ fontSize: "11.5px", lineHeight: "1.8", color: "#4b5563", margin: 0 }}>
                                    {professionalSummary}
                                </p>
                            </div>
                        )}

                        {/* EXPERIENCE (TIMELINE STYLE) */}
                        {workExperience.length > 0 && (
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                        EXPERIENCE
                                    </h3>
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", paddingLeft: "15px" }}>
                                    <div style={{ position: "absolute", top: "6px", bottom: "6px", left: "4px", width: "1px", backgroundColor: "#d1d5db" }} />

                                    {workExperience.map((exp, idx) => (
                                        <div key={idx} style={{ position: "relative" }}>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    left: "-15px",
                                                    top: "4px",
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "50%",
                                                    border: `2px solid ${primaryColor}`,
                                                    backgroundColor: "#ffffff"
                                                }}
                                            />

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                <strong style={{ fontSize: "13px", color: "#111827" }}>{exp.position}</strong>
                                                <span style={{ fontSize: "11px", fontStyle: "italic", color: "#6b7280" }}>{exp.dates}</span>
                                            </div>

                                            <div style={{ fontSize: "11.5px", color: "#4b5563", margin: "3px 0 6px 0" }}>
                                                {exp.company} {exp.location && `| ${exp.location}`}
                                            </div>

                                            {exp.responsibilities && (
                                                <p style={{ fontSize: "11.5px", color: "#6b7280", margin: 0, lineHeight: "1.6" }}>
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
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                        PROJECTS
                                    </h3>
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    {projects.map((proj, idx) => (
                                        <div key={idx}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <FolderOpenOutlined style={{ color: primaryColor, fontSize: "12px" }} />
                                                    <strong style={{ fontSize: "12px", color: "#111827" }}>{proj.name}</strong>
                                                </div>
                                                {proj.link && (
                                                    <span style={{ fontSize: "10.5px", color: primaryColor }}>
                                                        <LinkOutlined style={{ marginRight: "3px" }} />
                                                        {proj.link}
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontSize: "11px", color: "#6b7280", margin: "4px 0 0 0", lineHeight: "1.6" }}>
                                                {proj.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ACHIEVEMENTS & CERTIFICATES */}
                        {certifications.length > 0 && (
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                                        ACHIEVEMENTS & CERTIFICATES
                                    </h3>
                                    <div style={{ flex: 1, height: "1px", backgroundColor: "#d1d5db" }} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {certifications.map((cert, idx) => (
                                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", color: "#4b5563" }}>
                                            <TrophyOutlined style={{ color: primaryColor }} />
                                            <strong>{cert.name}</strong>
                                            <span style={{ color: "#9ca3af" }}>({cert.organization} - {cert.date})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>

            {/* BOTTOM FOOTER BAR */}
            <div style={{ height: "14px", backgroundColor: primaryColor, width: "100%" }} />
        </div>
    );
}