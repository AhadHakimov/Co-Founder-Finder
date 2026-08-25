import React from "react";

const Template11 = ({ data, user }) => {
  const { personalInfo, experiences, education, skills, languages } = data || {};
  return (
    <div style={{ width: "1123px", height: "794px", backgroundColor: "#F8FAFC", padding: "32px", display: "grid", gridTemplateColumns: "30% 40% 30%", gap: "24px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      {/* COLUMN 1: Profile & Contacts */}
      <div style={{ background: "#FFF", padding: "24px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
        {user?.avatar && <img src={user.avatar} alt="" style={{ width: "100px", height: "100px", borderRadius: "12px", objectFit: "cover", marginBottom: "16px" }} />}
        <h2 style={{ fontSize: "22px", margin: 0 }}>{personalInfo?.fullName}</h2>
        <p style={{ color: "#2563EB", fontWeight: "bold" }}>{personalInfo?.position}</p>
        <hr style={{ border: "none", borderTop: "1px solid #EEE", margin: "16px 0" }} />
        <p style={{ fontSize: "12px" }}><strong>Email:</strong> {personalInfo?.email}</p>
        <p style={{ fontSize: "12px" }}><strong>Phone:</strong> {personalInfo?.phone}</p>
      </div>

      {/* COLUMN 2: Experience Timeline */}
      <div style={{ background: "#FFF", padding: "24px", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <h3 style={{ borderLeft: "4px solid #2563EB", paddingLeft: "8px" }}>WORK EXPERIENCE</h3>
        {experiences?.map((exp, i) => (
          <div key={i} style={{ marginBottom: "16px" }}>
            <h4 style={{ margin: 0 }}>{exp.position}</h4>
            <span style={{ fontSize: "11px", color: "#64748B" }}>{exp.company} | {exp.years}</span>
            <p style={{ fontSize: "12px", marginTop: "6px" }}>{exp.achievements}</p>
          </div>
        ))}
      </div>

      {/* COLUMN 3: Education & Skills Matrix */}
      <div style={{ background: "#FFF", padding: "24px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
        <h3 style={{ borderLeft: "4px solid #10B981", paddingLeft: "8px" }}>SKILLS & TECH</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
          {skills?.map((s, i) => (
            <span key={i} style={{ background: "#ECFDF5", color: "#047857", padding: "4px 8px", borderRadius: "6px", fontSize: "11px" }}>{s}</span>
          ))}
        </div>
        <h3 style={{ borderLeft: "4px solid #10B981", paddingLeft: "8px" }}>EDUCATION</h3>
        {education?.map((edu, i) => (
          <div key={i} style={{ fontSize: "12px", marginBottom: "8px" }}>
            <strong>{edu.institution}</strong>
            <div>{edu.degree} ({edu.years})</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Template11;