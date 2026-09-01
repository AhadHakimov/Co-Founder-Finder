import logoDark from "../../assets/icons/logoDark.svg";
import logoLight from "../../assets/icons/logoLight.svg";

import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    Divider,
    Empty,
    Spin,
    Tag,
    Typography,
} from "antd";
import {
    ArrowRightOutlined,
    GithubOutlined,
    LinkedinOutlined,
    MailOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    SendOutlined,
    DownloadOutlined,
    LinkOutlined,
    CodeOutlined,
    SafetyCertificateOutlined,
    ReadOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const API =
    "https://6a902ab7ff2484963a5dcadd.mockapi.io/portfolios";

const FONT = "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";

function parse(value) {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function normalizeUrl(value) {
    if (!value) return "";
    const clean = String(value).trim();
    if (/^https?:\/\//i.test(clean)) return clean;
    return `https://${clean}`;
}

function getSlug() {
    const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

    return parts[0] === "p" ? parts[1] || "" : parts.at(-1) || "";
}

export default function PublicPortfolio() {
    const slug = getSlug();

    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadPortfolio() {
            setLoading(true);
            setLoadError(false);

            const local = parse(
                localStorage.getItem(`portfolio:${slug}`)
            );

            if (local) {
                if (!cancelled) {
                    setPortfolio(normalizePortfolio(local));
                    setLoading(false);
                }
                return;
            }

            try {
                const response = await fetch(
                    `${API}?slug=${encodeURIComponent(slug)}&published=true`
                );

                if (!response.ok) {
                    throw new Error("Portfolio request failed");
                }

                const rows = await response.json();
                const item = Array.isArray(rows) ? rows[0] : null;

                if (!item) {
                    throw new Error("Portfolio not found");
                }

                if (!cancelled) {
                    setPortfolio(normalizePortfolio(item));
                }
            } catch (error) {
                console.error("PUBLIC PORTFOLIO ERROR:", error);

                if (!cancelled) {
                    setLoadError(true);
                    setPortfolio(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadPortfolio();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (loading) {
        return (
            <div style={loadingPage}>
                <div style={{ textAlign: "center" }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 14, color: "#71808A" }}>
                        Portfolio yuklanmoqda...
                    </div>
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div style={loadingPage}>
                <div
                    style={{
                        width: "100%",
                        maxWidth: 560,
                        padding: 36,
                        textAlign: "center",
                    }}
                >
                    <Empty
                        description={
                            loadError
                                ? "Portfolio mavjud emas yoki serverdan yuklanmadi."
                                : "Portfolio topilmadi."
                        }
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            window.location.href = "/projects";
                        }}
                        style={{
                            marginTop: 18,
                            borderRadius: 10,
                        }}
                    >
                        CEOBACE Projects
                    </Button>
                </div>
            </div>
        );
    }

    return <PortfolioView portfolio={portfolio} />;
}

function normalizePortfolio(item) {
    const resume =
        typeof item?.resumeData === "string"
            ? parse(item.resumeData) || {}
            : item?.resumeData || {};

    const info = resume.personalInfo || {};

    const firstName = info.firstName || "";
    const lastName = info.lastName || "";

    return {
        ...item,
        resumeData: resume,
        sections:
            item.sections ||
            parse(item.sectionsJson) ||
            {},
        accentColor: item.accentColor || "#31708E",
        theme: item.theme || "light",
        templateId: item.templateId || "modern",
        title:
            item.title ||
            `${firstName} ${lastName}`.trim() ||
            "Portfolio",
    };
}

function PortfolioView({ portfolio }) {
    const resume = portfolio.resumeData || {};
    const info = resume.personalInfo || {};
    const social = resume.socialLinks || {};

    const experience = Array.isArray(resume.workExperience)
        ? resume.workExperience
        : [];

    const skills = Array.isArray(resume.skills)
        ? resume.skills
        : [];

    const projects = Array.isArray(resume.projects)
        ? resume.projects
        : [];

    const education = Array.isArray(resume.education)
        ? resume.education
        : [];

    const certificates = Array.isArray(resume.certifications)
        ? resume.certifications
        : [];

    const sections = portfolio.sections || {};
    const accent = portfolio.accentColor || "#31708E";

    const dark =
        portfolio.theme === "dark" ||
        (portfolio.theme === "auto" &&
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-color-scheme: dark)")?.matches);

    const colors = useMemo(
        () =>
            dark
                ? {
                      page: "#071115",
                      surface: "#0D1C23",
                      surface2: "#11252E",
                      border: "rgba(159,188,199,.16)",
                      text: "#F0F7F9",
                      secondary: "#A4B8C0",
                      muted: "#78909A",
                  }
                : {
                      page: "#F7FAFC",
                      surface: "#FFFFFF",
                      surface2: "#F2F7F9",
                      border: "rgba(22,55,67,.10)",
                      text: "#13212A",
                      secondary: "#667982",
                      muted: "#8799A1",
                  },
        [dark]
    );

    const fullName =
        `${info.firstName || ""} ${info.lastName || ""}`.trim() ||
        "Your Name";

    const title =
        info.professionalTitle ||
        "Professional";

    const summary =
        resume.professionalSummary ||
        "Professional portfolio powered by CEOBACE.";

    const photo =
        info.profilePhoto ||
        info.avatar ||
        "";

    const initial =
        (info.firstName || fullName)
            .charAt(0)
            .toUpperCase();

    const hasSection = (name) =>
        sections[name] !== false;

    const scrollToId = (id) => {
        const target =
            document.getElementById(id);

        if (!target) return;

        target.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const github = normalizeUrl(social.github);
    const linkedin = normalizeUrl(social.linkedin);
    const telegram = normalizeUrl(social.telegram);
    const website = normalizeUrl(
        social.website || info.portfolio
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: colors.page,
                color: colors.text,
                fontFamily: FONT,
            }}
        >
            <style>{`
                html { scroll-behavior: smooth; }
                * { box-sizing: border-box; }
                a { text-decoration: none; }
                .ceo-shell { width: min(1180px, calc(100% - 36px)); margin: 0 auto; }
                .ceo-brand-button {
                    transition: transform .2s ease, opacity .2s ease;
                }
                .ceo-brand-button:hover {
                    transform: translateY(-1px);
                    opacity: .92;
                }
                .ceo-nav-link {
                    color: ${colors.secondary};
                    font-size: 13px;
                    font-weight: 650;
                    cursor: pointer;
                    transition: color .2s ease, transform .2s ease;
                }
                .ceo-nav-link:hover {
                    color: ${accent};
                    transform: translateY(-1px);
                }
                .ceo-card {
                    border: 1px solid ${colors.border};
                    background: ${colors.surface};
                    border-radius: 24px;
                    transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
                }
                .ceo-card:hover {
                    transform: translateY(-4px);
                    border-color: ${accent}44;
                    box-shadow: 0 18px 50px ${dark ? "rgba(0,0,0,.24)" : "rgba(22,55,67,.08)"};
                }
                .ceo-project-link {
                    transition: background .2s ease, transform .2s ease;
                }
                .ceo-project-link:hover {
                    transform: translateY(-1px);
                }
                @media (max-width: 760px) {
                    .ceo-nav-links { display: none !important; }
                    .ceo-shell { width: min(100% - 24px, 1180px); }
                    .ceo-hero { padding: 76px 0 42px !important; }
                    .ceo-avatar { width: 88px !important; height: 88px !important; }
                    .ceo-grid-2 { grid-template-columns: 1fr !important; }
                    .ceo-project-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <nav
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    backdropFilter: "blur(16px)",
                    background: dark
                        ? "rgba(7,17,21,.78)"
                        : "rgba(247,250,252,.78)",
                    borderBottom: `1px solid ${colors.border}`,
                }}
            >
                <div
                    className="ceo-shell"
                    style={{
                        minHeight: 66,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 18,
                    }}
                >
                    <button
                        type="button"
                        aria-label="Go to CEOBACE home"
                        className="ceo-brand-button"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            padding: 0,
                            border: 0,
                            background: "transparent",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src={dark ? logoDark : logoLight}
                            alt="CEOBACE"
                            style={{
                                display: "block",
                                width: 132,
                                height: "auto",
                                maxHeight: 38,
                                objectFit: "contain",
                            }}
                        />
                    </button>

                    <div
                        className="ceo-nav-links"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 24,
                        }}
                    >
                        {[
                            ["About", "about"],
                            ["Experience", "experience"],
                            ["Projects", "projects"],
                            ["Skills", "skills"],
                            ["Contact", "contact"],
                        ]
                            .filter(([, id]) =>
                                id === "contact"
                                    ? hasSection("contact")
                                    : hasSection(id)
                            )
                            .map(([label, id]) => (
                                <button
                                    type="button"
                                    key={id}
                                    className="ceo-nav-link"
                                    onClick={() => scrollToId(id)}
                                    style={{
                                        border: 0,
                                        background: "transparent",
                                        padding: 0,
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                    </div>

                    <Button
                        type="primary"
                        size="middle"
                        icon={<MailOutlined />}
                        href={info.email ? `mailto:${info.email}` : undefined}
                        onClick={() => {
                            if (!info.email) {
                                scrollToId("contact");
                            }
                        }}
                        style={{
                            background: accent,
                            borderColor: accent,
                            borderRadius: 10,
                            fontWeight: 700,
                        }}
                    >
                        Contact
                    </Button>
                </div>
            </nav>

            <header
                className="ceo-hero"
                style={{
                    padding: "110px 0 74px",
                    background: `radial-gradient(circle at 85% 12%, ${accent}22 0%, transparent 32%), linear-gradient(180deg, ${colors.surface2} 0%, ${colors.page} 100%)`,
                }}
            >
                <div className="ceo-shell">
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            borderRadius: 999,
                            border: `1px solid ${accent}35`,
                            background: `${accent}13`,
                            color: accent,
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: ".5px",
                            textTransform: "uppercase",
                        }}
                    >
                        <GlobalOutlined />
                        CEOBACE Public Portfolio
                    </div>

                    <div
                        className="ceo-grid-2"
                        style={{
                            marginTop: 28,
                            display: "grid",
                            gridTemplateColumns: "minmax(0, 1fr) 280px",
                            gap: 40,
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <Text
                                style={{
                                    color: accent,
                                    fontWeight: 750,
                                    fontSize: 15,
                                    letterSpacing: ".2px",
                                }}
                            >
                                {title}
                            </Text>

                            <Title
                                style={{
                                    color: colors.text,
                                    fontSize: "clamp(46px, 8vw, 84px)",
                                    lineHeight: 1.02,
                                    letterSpacing: "-3px",
                                    margin: "10px 0 18px",
                                    maxWidth: 900,
                                }}
                            >
                                {fullName}
                            </Title>

                            <Paragraph
                                style={{
                                    color: colors.secondary,
                                    fontSize: 19,
                                    lineHeight: 1.85,
                                    maxWidth: 760,
                                    marginBottom: 26,
                                }}
                            >
                                {summary}
                            </Paragraph>

                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 10,
                                }}
                            >
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    onClick={() => scrollToId("projects")}
                                    style={{
                                        background: accent,
                                        borderColor: accent,
                                        borderRadius: 12,
                                        height: 48,
                                        padding: "0 18px",
                                        fontWeight: 750,
                                    }}
                                >
                                    View Projects
                                </Button>

                                <Button
                                    size="large"
                                    icon={<MailOutlined />}
                                    href={
                                        info.email
                                            ? `mailto:${info.email}`
                                            : undefined
                                    }
                                    onClick={() => {
                                        if (!info.email) {
                                            scrollToId("contact");
                                        }
                                    }}
                                    style={{
                                        height: 48,
                                        borderRadius: 12,
                                        background: colors.surface,
                                        color: colors.text,
                                        borderColor: colors.border,
                                        fontWeight: 700,
                                    }}
                                >
                                    Get in touch
                                </Button>

                                {info.portfolio && (
                                    <Button
                                        size="large"
                                        icon={<LinkOutlined />}
                                        href={normalizeUrl(info.portfolio)}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            height: 48,
                                            borderRadius: 12,
                                            background: "transparent",
                                            color: colors.text,
                                            borderColor: colors.border,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Website
                                    </Button>
                                )}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 8,
                                    marginTop: 24,
                                }}
                            >
                                {info.location && (
                                    <MetaPill
                                        icon={<EnvironmentOutlined />}
                                        text={info.location}
                                        colors={colors}
                                    />
                                )}

                                {info.email && (
                                    <MetaPill
                                        icon={<MailOutlined />}
                                        text={info.email}
                                        colors={colors}
                                    />
                                )}

                                {social.github && (
                                    <SocialPill
                                        icon={<GithubOutlined />}
                                        href={github}
                                        label="GitHub"
                                        colors={colors}
                                    />
                                )}

                                {social.linkedin && (
                                    <SocialPill
                                        icon={<LinkedinOutlined />}
                                        href={linkedin}
                                        label="LinkedIn"
                                        colors={colors}
                                    />
                                )}
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                className="ceo-avatar"
                                style={{
                                    width: 220,
                                    height: 220,
                                    borderRadius: 42,
                                    padding: 7,
                                    background: `linear-gradient(145deg, ${accent}, ${accent}66)`,
                                    boxShadow: `0 28px 70px ${accent}22`,
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: 36,
                                        overflow: "hidden",
                                        background: colors.surface,
                                        display: "grid",
                                        placeItems: "center",
                                    }}
                                >
                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt={fullName}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: 68,
                                                fontWeight: 850,
                                                color: accent,
                                            }}
                                        >
                                            {initial}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="ceo-shell">
                {hasSection("about") && (
                    <ContentSection
                        id="about"
                        icon={<ReadOutlined />}
                        title="About me"
                        accent={accent}
                        colors={colors}
                    >
                        <Paragraph
                            style={{
                                color: colors.secondary,
                                fontSize: 17,
                                lineHeight: 1.95,
                                maxWidth: 860,
                                margin: 0,
                            }}
                        >
                            {summary}
                        </Paragraph>
                    </ContentSection>
                )}

                {hasSection("experience") && experience.length > 0 && (
                    <ContentSection
                        id="experience"
                        icon={<CodeOutlined />}
                        title="Experience"
                        accent={accent}
                        colors={colors}
                    >
                        <div style={{ display: "grid", gap: 14 }}>
                            {experience.map((item, index) => (
                                <ExperienceCard
                                    key={index}
                                    item={item}
                                    accent={accent}
                                    colors={colors}
                                    dark={dark}
                                />
                            ))}
                        </div>
                    </ContentSection>
                )}

                {hasSection("skills") && skills.length > 0 && (
                    <ContentSection
                        id="skills"
                        icon={<CodeOutlined />}
                        title="Skills"
                        accent={accent}
                        colors={colors}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(220px,1fr))",
                                gap: 12,
                            }}
                        >
                            {skills.map((item, index) => {
                                const name =
                                    typeof item === "string"
                                        ? item
                                        : item?.name || "Skill";

                                const level =
                                    typeof item === "object"
                                        ? Math.max(
                                              0,
                                              Math.min(
                                                  100,
                                                  Number(item?.level) || 70
                                              )
                                          )
                                        : 70;

                                return (
                                    <div
                                        key={`${name}-${index}`}
                                        className="ceo-card"
                                        style={{ padding: 18 }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text
                                                strong
                                                style={{
                                                    color: colors.text,
                                                }}
                                            >
                                                {name}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: accent,
                                                    fontWeight: 750,
                                                    fontSize: 12,
                                                }}
                                            >
                                                {level}%
                                            </Text>
                                        </div>

                                        <div
                                            style={{
                                                height: 7,
                                                borderRadius: 999,
                                                background: colors.surface2,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${level}%`,
                                                    height: "100%",
                                                    borderRadius: 999,
                                                    background: accent,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ContentSection>
                )}

                {hasSection("projects") && (
                    <ContentSection
                        id="projects"
                        icon={<CodeOutlined />}
                        title="Selected projects"
                        accent={accent}
                        colors={colors}
                    >
                        {projects.length > 0 ? (
                            <div
                                className="ceo-project-grid"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit,minmax(280px,1fr))",
                                    gap: 16,
                                }}
                            >
                                {projects.map((project, index) => (
                                    <ProjectCard
                                        key={index}
                                        project={project}
                                        accent={accent}
                                        colors={colors}
                                        dark={dark}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div
                                className="ceo-card"
                                style={{
                                    padding: 28,
                                    color: colors.secondary,
                                }}
                            >
                                Projects will appear here when added to the
                                resume.
                            </div>
                        )}
                    </ContentSection>
                )}

                {hasSection("education") && education.length > 0 && (
                    <ContentSection
                        id="education"
                        icon={<ReadOutlined />}
                        title="Education"
                        accent={accent}
                        colors={colors}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(260px,1fr))",
                                gap: 14,
                            }}
                        >
                            {education.map((item, index) => (
                                <div
                                    key={index}
                                    className="ceo-card"
                                    style={{ padding: 22 }}
                                >
                                    <Text
                                        strong
                                        style={{
                                            color: colors.text,
                                            fontSize: 17,
                                        }}
                                    >
                                        {item.degree || "Education"}
                                    </Text>

                                    <div
                                        style={{
                                            marginTop: 8,
                                            color: accent,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {item.institution || ""}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 8,
                                            color: colors.muted,
                                            fontSize: 13,
                                        }}
                                    >
                                        {item.from || ""}
                                        {item.to
                                            ? ` — ${item.to}`
                                            : ""}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ContentSection>
                )}

                {hasSection("certificates") && certificates.length > 0 && (
                    <ContentSection
                        id="certificates"
                        icon={<SafetyCertificateOutlined />}
                        title="Certificates"
                        accent={accent}
                        colors={colors}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(260px,1fr))",
                                gap: 14,
                            }}
                        >
                            {certificates.map((item, index) => (
                                <div
                                    key={index}
                                    className="ceo-card"
                                    style={{ padding: 22 }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 12,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 11,
                                                display: "grid",
                                                placeItems: "center",
                                                background: `${accent}14`,
                                                color: accent,
                                            }}
                                        >
                                            <SafetyCertificateOutlined />
                                        </div>

                                        <div>
                                            <Text
                                                strong
                                                style={{
                                                    display: "block",
                                                    color: colors.text,
                                                }}
                                            >
                                                {item.title ||
                                                    item.name ||
                                                    "Certificate"}
                                            </Text>

                                            <Text
                                                style={{
                                                    color: colors.secondary,
                                                    fontSize: 12,
                                                }}
                                            >
                                                {item.issuer ||
                                                    item.organization ||
                                                    ""}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ContentSection>
                )}

                {hasSection("contact") && (
                    <section
                        id="contact"
                        style={{
                            padding: "82px 0 90px",
                        }}
                    >
                        <div
                            className="ceo-card"
                            style={{
                                padding:
                                    "clamp(26px,5vw,52px)",
                                background: `linear-gradient(135deg, ${accent}18, ${colors.surface} 55%)`,
                                overflow: "hidden",
                            }}
                        >
                            <Text
                                style={{
                                    color: accent,
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: ".6px",
                                    fontSize: 12,
                                }}
                            >
                                Let’s connect
                            </Text>

                            <Title
                                style={{
                                    color: colors.text,
                                    fontSize: "clamp(34px,6vw,56px)",
                                    margin: "10px 0 14px",
                                }}
                            >
                                Let’s build something great.
                            </Title>

                            <Paragraph
                                style={{
                                    color: colors.secondary,
                                    fontSize: 17,
                                    lineHeight: 1.8,
                                    maxWidth: 720,
                                }}
                            >
                                {info.email
                                    ? `Reach ${fullName} directly at ${info.email}.`
                                    : "Use the social links below to get in touch."}
                            </Paragraph>

                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 10,
                                    marginTop: 20,
                                }}
                            >
                                {info.email && (
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<MailOutlined />}
                                        href={`mailto:${info.email}`}
                                        style={{
                                            background: accent,
                                            borderColor: accent,
                                            borderRadius: 11,
                                            fontWeight: 750,
                                        }}
                                    >
                                        Email me
                                    </Button>
                                )}

                                {telegram && (
                                    <Button
                                        size="large"
                                        icon={<SendOutlined />}
                                        href={telegram}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            borderRadius: 11,
                                            color: colors.text,
                                            borderColor: colors.border,
                                            background: colors.surface,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Telegram
                                    </Button>
                                )}

                                {website && (
                                    <Button
                                        size="large"
                                        icon={<LinkOutlined />}
                                        href={website}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            borderRadius: 11,
                                            color: colors.text,
                                            borderColor: colors.border,
                                            background: colors.surface,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Website
                                    </Button>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer
                style={{
                    borderTop: `1px solid ${colors.border}`,
                    background: dark ? "#061014" : "#EEF4F6",
                }}
            >
                <div
                    className="ceo-shell"
                    style={{
                        padding: "28px 0",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 14,
                        alignItems: "center",
                    }}
                >
                    <div>
                        <Text
                            strong
                            style={{ color: colors.text }}
                        >
                            {fullName}
                        </Text>
                        <div
                            style={{
                                marginTop: 4,
                                color: colors.muted,
                                fontSize: 12,
                            }}
                        >
                            {title}
                        </div>
                    </div>

                    <Text
                        style={{
                            color: colors.muted,
                            fontSize: 12,
                        }}
                    >
                        Built with CEOBACE
                    </Text>
                </div>
            </footer>
        </div>
    );
}

function ContentSection({
    id,
    icon,
    title,
    accent,
    colors,
    children,
}) {
    return (
        <section
            id={id}
            style={{
                padding: "66px 0",
                scrollMarginTop: 82,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    marginBottom: 22,
                }}
            >
                <span
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        display: "grid",
                        placeItems: "center",
                        background: `${accent}14`,
                        color: accent,
                        flex: "0 0 auto",
                    }}
                >
                    {icon}
                </span>

                <div>
                    <Text
                        style={{
                            color: accent,
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: ".7px",
                            textTransform: "uppercase",
                        }}
                    >
                        CEOBACE
                    </Text>

                    <Title
                        level={2}
                        style={{
                            color: colors.text,
                            margin: 2,
                            fontSize: 30,
                        }}
                    >
                        {title}
                    </Title>
                </div>
            </div>

            {children}
        </section>
    );
}

function ExperienceCard({
    item,
    accent,
    colors,
    dark,
}) {
    return (
        <div
            className="ceo-card"
            style={{
                padding: 24,
                display: "grid",
                gridTemplateColumns: "110px minmax(0,1fr)",
                gap: 20,
            }}
        >
            <div>
                <div
                    style={{
                        color: accent,
                        fontSize: 12,
                        fontWeight: 750,
                        lineHeight: 1.5,
                    }}
                >
                    {item.from || ""}
                </div>

                <div
                    style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginTop: 4,
                    }}
                >
                    {item.present
                        ? "Present"
                        : item.to || ""}
                </div>
            </div>

            <div>
                <Text
                    strong
                    style={{
                        color: colors.text,
                        fontSize: 18,
                    }}
                >
                    {item.position || "Position"}
                </Text>

                <div
                    style={{
                        marginTop: 5,
                        color: accent,
                        fontWeight: 750,
                    }}
                >
                    {item.company || ""}
                </div>

                {item.responsibilities && (
                    <Paragraph
                        style={{
                            color: colors.secondary,
                            lineHeight: 1.75,
                            margin: "12px 0 0",
                        }}
                    >
                        {item.responsibilities}
                    </Paragraph>
                )}
            </div>
        </div>
    );
}

function ProjectCard({
    project,
    accent,
    colors,
    dark,
}) {
    return (
        <article
            className="ceo-card"
            style={{
                padding: 0,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    height: 150,
                    background: `linear-gradient(135deg, ${accent}, ${dark ? "#16313B" : "#DCEFF4"})`,
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 20,
                }}
            >
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(255,255,255,.18)",
                        border: "1px solid rgba(255,255,255,.22)",
                        color: "#fff",
                        fontSize: 21,
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <CodeOutlined />
                </div>
            </div>

            <div style={{ padding: 22 }}>
                <Text
                    strong
                    style={{
                        display: "block",
                        color: colors.text,
                        fontSize: 18,
                        marginBottom: 8,
                    }}
                >
                    {project.name || "Project"}
                </Text>

                <Paragraph
                    style={{
                        color: colors.secondary,
                        lineHeight: 1.75,
                        minHeight: 58,
                        marginBottom: 16,
                    }}
                >
                    {project.description ||
                        "Project details are available in the resume."}
                </Paragraph>

                {project.link && (
                    <Button
                        className="ceo-project-link"
                        icon={<LinkOutlined />}
                        href={normalizeUrl(project.link)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            borderRadius: 10,
                            color: accent,
                            borderColor: `${accent}33`,
                            background: `${accent}0D`,
                            fontWeight: 750,
                        }}
                    >
                        View project
                    </Button>
                )}
            </div>
        </article>
    );
}

function MetaPill({ icon, text, colors }) {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 11px",
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: colors.surface,
                color: colors.secondary,
                fontSize: 12,
                maxWidth: "100%",
            }}
        >
            <span>{icon}</span>
            <span
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {text}
            </span>
        </div>
    );
}

function SocialPill({
    icon,
    href,
    label,
    colors,
}) {
    if (!href) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 11px",
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: colors.surface,
                color: colors.secondary,
                fontSize: 12,
                fontWeight: 700,
            }}
        >
            {icon}
            {label}
        </a>
    );
}

const loadingPage = {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#F7FAFC",
    color: "#16212A",
};
