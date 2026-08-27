import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Input,
  Row,
  Space,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CodeOutlined,
  CopyOutlined,
  EyeOutlined,
  GlobalOutlined,
  LayoutOutlined,
  RocketOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const API = "https://6a7700dd63e9caf860c33d99.mockapi.io/portfolios";

const DESIGNS = [
  { id: "modern", name: "Modern", icon: <LayoutOutlined />, text: "Clean & professional" },
  { id: "developer", name: "Developer", icon: <CodeOutlined />, text: "Bold developer style" },
  { id: "minimal", name: "Minimal", icon: <GlobalOutlined />, text: "Simple & elegant" },
  { id: "creative", name: "Creative", icon: <RocketOutlined />, text: "Expressive & visual" },
  { id: "corporate", name: "Corporate", icon: <LayoutOutlined />, text: "Executive & formal" },
];

const defaultSections = {
  about: true,
  experience: true,
  skills: true,
  projects: true,
  education: true,
  certificates: true,
  contact: true,
};

const defaultResume = {
  personalInfo: { firstName: "Your", lastName: "Name", professionalTitle: "Professional", email: "", location: "", profilePhoto: "" },
  professionalSummary: "Build a professional portfolio from your resume.",
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  socialLinks: { github: "", linkedin: "", telegram: "", website: "" },
};

function parse(value, fallback = null) {
  try { return JSON.parse(value); } catch { return fallback; }
}

function getSourceResume() {
  const params = new URLSearchParams(window.location.search);
  const resumeId = params.get("resumeId");
  const stored = parse(localStorage.getItem("portfolioSourceResume"));

  if (stored?.resumeData && (!resumeId || String(stored.resumeId) === String(resumeId))) {
    return stored;
  }

  const keys = ["resumeData", "currentResume", "selectedResume"];
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (!value) continue;
    const data = parse(value);
    if (data?.resumeData) {
      return {
        resumeId: resumeId || data.id || null,
        resumeData:
          typeof data.resumeData === "string"
            ? parse(data.resumeData, defaultResume)
            : data.resumeData,
      };
    }
    if (data) return { resumeId: resumeId || data.id || null, resumeData: data };
  }

  return { resumeId, resumeData: defaultResume };
}

function slugify(value) {
  return String(value || "your-name")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "your-name";
}

function normalizeResume(raw) {
  const r = raw || defaultResume;
  return {
    ...defaultResume,
    ...r,
    personalInfo: { ...defaultResume.personalInfo, ...(r.personalInfo || {}) },
    socialLinks: { ...defaultResume.socialLinks, ...(r.socialLinks || {}) },
    workExperience: Array.isArray(r.workExperience) ? r.workExperience : [],
    education: Array.isArray(r.education) ? r.education : [],
    skills: Array.isArray(r.skills) ? r.skills : [],
    projects: Array.isArray(r.projects) ? r.projects : [],
    certifications: Array.isArray(r.certifications) ? r.certifications : [],
  };
}

export default function PortfolioCreate() {
  const [api, contextHolder] = message.useMessage();
  const source = useMemo(getSourceResume, []);
  const [design, setDesign] = useState("modern");
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("#31708E");
  const [slug, setSlug] = useState(() => slugify(`${source.resumeData?.personalInfo?.firstName || "your"}-${source.resumeData?.personalInfo?.lastName || "name"}`));
  const [sections, setSections] = useState(defaultSections);
  const [aiPrompt, setAiPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [liveResume, setLiveResume] = useState(null);

  React.useEffect(() => {
    if (!source.resumeId || liveResume) return;

    const hasUsefulResume =
      source.resumeData &&
      (source.resumeData.personalInfo?.firstName ||
        source.resumeData.personalInfo?.lastName ||
        source.resumeData.personalInfo?.email);

    if (hasUsefulResume) return;

    let cancelled = false;
    setResumeLoading(true);

    fetch(`https://6a7700dd63e9caf860c33d99.mockapi.io/resumes/${encodeURIComponent(source.resumeId)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Resume topilmadi.");
        return response.json();
      })
      .then((item) => {
        if (cancelled) return;
        const data = parse(item.resumeData, defaultResume);
        setLiveResume({
          resumeId: item.id || source.resumeId,
          resumeData: normalizeResume(data),
          resumeTitle: item.title || "Resume",
          templateId: item.templateId || null,
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setResumeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [source.resumeId, source.resumeData, liveResume]);

  const activeResume = liveResume?.resumeData || source.resumeData;
  const activeSource = liveResume || source;
  const resume = useMemo(() => normalizeResume(activeResume), [activeResume]);
  const publicUrl = `${window.location.origin}/p/${slug}`;

  const toggleSection = (key) => setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const smartGenerate = () => {
    const p = aiPrompt.toLowerCase();
    if (p.includes("dark")) setTheme("dark");
    if (p.includes("minimal")) setDesign("minimal");
    else if (p.includes("creative")) setDesign("creative");
    else if (p.includes("developer") || p.includes("react") || p.includes("next")) setDesign("developer");
    else if (p.includes("corporate") || p.includes("formal")) setDesign("corporate");
    if (p.includes("blue")) setAccent("#31708E");
    if (p.includes("green")) setAccent("#687864");
    if (p.includes("purple")) setAccent("#6B5DD3");
    api.success("Portfolio uslubi avtomatik sozlandi.");
  };

  const savePortfolio = async () => {
    const payload = {
      userId: parse(localStorage.getItem("currentUser"))?.id || localStorage.getItem("userId") || "guest",
      resumeId: activeSource.resumeId || null,
      slug,
      templateId: design,
      theme,
      accentColor: accent,
      sections,
      resumeData: JSON.stringify(resume),
      title: fullName || "Portfolio",
      updatedAt: new Date().toISOString(),
      published: true,
    };

    setSaving(true);
    try {
      let response;
      const existingId = localStorage.getItem(`portfolioId:${slug}`);
      if (existingId) {
        response = await fetch(`${API}/${encodeURIComponent(existingId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) throw new Error("Portfolio API ishlamadi.");
      const savedData = await response.json();
      localStorage.setItem(`portfolioId:${slug}`, String(savedData.id));
      localStorage.setItem(`portfolio:${slug}`, JSON.stringify({ ...payload, id: savedData.id }));
      setSaved(true);
      api.success("Portfolio muvaffaqiyatli published qilindi.");
    } catch (error) {
      // Local-first fallback: UI is still usable during API setup.
      localStorage.setItem(`portfolio:${slug}`, JSON.stringify(payload));
      setSaved(true);
      api.warning("API ulanmagan — portfolio lokal saqlandi.");
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async () => {
    await navigator.clipboard?.writeText(publicUrl);
    api.success("Public URL nusxalandi.");
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: accent, borderRadius: 14, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" } }}>
      {contextHolder}
      <div style={{ minHeight: "100vh", background: theme === "dark" ? "#081419" : "#F4F7F9", color: theme === "dark" ? "#ECF5F8" : "#16212A", padding: 24 }}>
        {resumeLoading && (
          <div style={{ maxWidth: 1480, margin: "0 auto 14px", padding: "10px 14px", borderRadius: 12, background: "rgba(49,112,142,.10)", color: accent }}>
            Resume ma'lumotlari yuklanmoqda...
          </div>
        )}
        <div style={{ maxWidth: 1480, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>Back to Resume</Button>
            <Space wrap>
              <Button icon={<CopyOutlined />} onClick={copyUrl}>{publicUrl}</Button>
              <Button type="primary" icon={saved ? <CheckCircleFilled /> : <SaveOutlined />} loading={saving} onClick={savePortfolio}>
                {saved ? "Published" : "Generate Website"}
              </Button>
            </Space>
          </div>

          <Row gutter={[20, 20]}>
            <Col xs={24} xl={8}>
              <Space direction="vertical" size={18} style={{ width: "100%" }}>
                <Card bordered={false} style={{ borderRadius: 20 }}>
                  <Text type="secondary">RESUME → PORTFOLIO</Text>
                  <Title level={2} style={{ marginTop: 6, marginBottom: 4 }}>Portfolio Website</Title>
                  <Text type="secondary">{fullName} · {resume.personalInfo.professionalTitle}</Text>
                  <Divider />
                  <Text strong>Public URL</Text>
                  <Input addonBefore="ceobace.com/p/" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} style={{ marginTop: 8 }} />
                </Card>

                <Card bordered={false} style={{ borderRadius: 20 }}>
                  <Title level={4} style={{ marginTop: 0 }}>AI Website Assistant</Title>
                  <Paragraph type="secondary">Masalan: “Dark developer portfolio, minimal va React/Next.js ko‘rinishida”.</Paragraph>
                  <Input.TextArea rows={4} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Portfolio qanday ko‘rinsin?" />
                  <Button type="primary" block icon={<RocketOutlined />} onClick={smartGenerate} style={{ marginTop: 10 }}>Smart Generate</Button>
                </Card>

                <Card bordered={false} style={{ borderRadius: 20 }}>
                  <Title level={4} style={{ marginTop: 0 }}>Choose Design</Title>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {DESIGNS.map((item) => {
                      const active = design === item.id;
                      return <div key={item.id} onClick={() => setDesign(item.id)} style={{ cursor: "pointer", padding: 13, borderRadius: 14, border: `2px solid ${active ? accent : (theme === "dark" ? "#274754" : "#DCE6EB")}`, background: active ? `${accent}16` : "transparent" }}>
                        <Space><span style={{ color: accent }}>{item.icon}</span><div><Text strong>{item.name}</Text><div><Text type="secondary" style={{ fontSize: 12 }}>{item.text}</Text></div></div></Space>
                      </div>;
                    })}
                  </Space>
                </Card>

                <Card bordered={false} style={{ borderRadius: 20 }}>
                  <Title level={4} style={{ marginTop: 0 }}>Theme</Title>
                  <Space>
                    {["light", "dark"].map((value) => <Button key={value} type={theme === value ? "primary" : "default"} onClick={() => setTheme(value)}>{value[0].toUpperCase() + value.slice(1)}</Button>)}
                  </Space>
                  <Divider />
                  <Text strong>Accent Color</Text>
                  <Input value={accent} onChange={(e) => setAccent(e.target.value)} prefix={<span style={{ width: 16, height: 16, borderRadius: 5, background: accent, display: "inline-block" }} />} style={{ marginTop: 8 }} />
                </Card>

                <Card bordered={false} style={{ borderRadius: 20 }}>
                  <Title level={4} style={{ marginTop: 0 }}>Sections</Title>
                  {Object.entries(sections).map(([key, value]) => <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0" }}><Text>{key[0].toUpperCase() + key.slice(1)}</Text><Switch checked={value} onChange={() => toggleSection(key)} /></div>)}
                </Card>
              </Space>
            </Col>

            <Col xs={24} xl={16}>
              <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 20, overflow: "hidden", position: "sticky", top: 18 }}>
                <div style={{ height: 56, background: "#0D1C23", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}><span>●</span><span>●</span><span>●</span><div style={{ marginLeft: 12, flex: 1, background: "rgba(255,255,255,.08)", padding: "8px 12px", borderRadius: 8, color: "#9EB5BF", fontSize: 12 }}><EyeOutlined />&nbsp; {publicUrl}</div></div>
                <PortfolioPreview resume={resume} design={design} theme={theme} accent={accent} sections={sections} />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  );
}

function PortfolioPreview({ resume, design, theme, accent, sections }) {
  const dark = theme === "dark";
  const bg = dark ? "#0D1C23" : "#FFFFFF";
  const text = dark ? "#ECF5F8" : "#16212A";
  const secondary = dark ? "#9EB5BF" : "#6B7D86";
  const soft = dark ? `${accent}20` : `${accent}12`;
  const fullName = `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim();
  const hero = design === "developer" ? "linear-gradient(135deg,#081419 0%,#163744 100%)" : design === "creative" ? `linear-gradient(135deg,${accent} 0%,#16212A 100%)` : design === "corporate" ? "linear-gradient(135deg,#16212A 0%,#334A57 100%)" : `linear-gradient(135deg,${dark ? "#10232C" : "#F7FBFC"} 0%,${dark ? "#132A34" : soft} 100%)`;
  const sectionStyle = { padding: "38px 52px", background: bg, color: text };

  return <div style={{ background: bg, minHeight: 760, color: text }}>
    <section style={{ padding: "72px 52px 64px", background: hero, color: "#fff" }}>
      <Tag style={{ borderRadius: 999, marginBottom: 16, color: accent, background: "#fff", border: "none" }}>AVAILABLE FOR OPPORTUNITIES</Tag>
      <Title style={{ color: "#fff", fontSize: "clamp(36px,5vw,66px)", margin: 0 }}>{fullName}</Title>
      <Title level={2} style={{ color: "rgba(255,255,255,.8)", fontWeight: 500 }}>{resume.personalInfo.professionalTitle}</Title>
      <Paragraph style={{ maxWidth: 720, color: "rgba(255,255,255,.76)", fontSize: 17 }}>{resume.professionalSummary}</Paragraph>
      <Space wrap><Button type="primary" style={{ background: accent, border: "none" }}>View My Work</Button><Button ghost>Contact Me</Button></Space>
    </section>

    {sections.about && <section style={sectionStyle}><SectionTitle accent={accent} title="About Me" /><Paragraph style={{ color: secondary, lineHeight: 1.8 }}>{resume.professionalSummary}</Paragraph></section>}

    {sections.experience && <section style={sectionStyle}><SectionTitle accent={accent} title="Experience" />{resume.workExperience.length ? resume.workExperience.map((item, i) => <div key={i} style={{ padding: "16px 0", borderBottom: i < resume.workExperience.length - 1 ? `1px solid ${dark ? "#274754" : "#DCE6EB"}` : "none" }}><Text strong style={{ color: text, display: "block", fontSize: 17 }}>{item.position || "Position"}</Text><Text style={{ color: accent }}>{item.company || "Company"}</Text><div><Text type="secondary">{item.from || ""} {item.present ? "— Present" : item.to ? `— ${item.to}` : ""}</Text></div><Paragraph style={{ color: secondary, marginTop: 8 }}>{item.responsibilities || ""}</Paragraph></div>) : <Text type="secondary">Experience will appear here.</Text>}</section>}

    {sections.skills && <section style={sectionStyle}><SectionTitle accent={accent} title="Skills" /><Space wrap>{resume.skills.length ? resume.skills.map((skill, i) => <Tag key={i} style={{ padding: "8px 13px", border: "none", background: soft, color: accent }}>{typeof skill === "string" ? skill : skill.name}</Tag>) : <Text type="secondary">Skills will appear here.</Text>}</Space></section>}

    {sections.projects && <section style={sectionStyle}><SectionTitle accent={accent} title="Featured Projects" /><Row gutter={[16,16]}>{resume.projects.length ? resume.projects.map((project, i) => <Col xs={24} md={12} key={i}><div style={{ border: `1px solid ${dark ? "#274754" : "#DCE6EB"}`, borderRadius: 16, padding: 18, height: "100%" }}><Text strong style={{ color: text, fontSize: 17 }}>{project.name || "Project"}</Text><Paragraph style={{ color: secondary, marginTop: 8 }}>{project.description || ""}</Paragraph>{project.link && <Button size="small" href={project.link} target="_blank">View Project</Button>}</div></Col>) : <Col span={24}><Text type="secondary">Projects will appear here.</Text></Col>}</Row></section>}

    {sections.education && <section style={sectionStyle}><SectionTitle accent={accent} title="Education" />{resume.education.length ? resume.education.map((item, i) => <div key={i} style={{ marginBottom: 12 }}><Text strong style={{ color: text }}>{item.degree}</Text><div><Text style={{ color: accent }}>{item.institution}</Text></div><Text type="secondary">{item.from || ""} {item.to ? `— ${item.to}` : ""}</Text></div>) : <Text type="secondary">Education will appear here.</Text>}</section>}

    {sections.certificates && <section style={sectionStyle}><SectionTitle accent={accent} title="Certificates" />{resume.certifications.length ? resume.certifications.map((item, i) => <Tag key={i} style={{ marginBottom: 8 }}>{item.title || item.name || "Certificate"}</Tag>) : <Text type="secondary">Certificates will appear here.</Text>}</section>}

    {sections.contact && <section style={{ ...sectionStyle, background: dark ? "#10232C" : "#F7FAFB" }}><SectionTitle accent={accent} title="Contact" /><Space direction="vertical"><Text style={{ color: secondary }}>{resume.personalInfo.email}</Text><Text style={{ color: secondary }}>{resume.socialLinks.github}</Text><Text style={{ color: secondary }}>{resume.socialLinks.linkedin}</Text><Text style={{ color: secondary }}>{resume.socialLinks.telegram}</Text></Space></section>}

    <footer style={{ background: "#0D1C23", color: "#fff", padding: "26px 52px", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><Text style={{ color: "#fff" }}>{fullName}</Text><Text style={{ color: "#9EB5BF" }}>Built with CEOBACE</Text></footer>
  </div>;
}

function SectionTitle({ accent, title }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}><span style={{ width: 9, height: 30, borderRadius: 4, background: accent }} /><Title level={2} style={{ margin: 0, fontSize: 25 }}>{title}</Title></div>;
}
