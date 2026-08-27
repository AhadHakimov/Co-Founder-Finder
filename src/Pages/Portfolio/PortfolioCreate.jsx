import React, { useEffect, useMemo, useState } from "react";
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
    SafetyCertificateOutlined,
    UserOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const RESUMES_API =
    "https://6a7700dd63e9caf860c33d99.mockapi.io/resumes";

const PORTFOLIOS_API =
    "https://6a902ab7ff2484963a5dcadd.mockapi.io/portfolios";

const COLORS = {
    ink: "#111317",
    body: "#F4F6F8",
    white: "#FFFFFF",
    muted: "#6F7C86",
    line: "#DCE3E7",
    blue: "#31708E",
    pink: "#D41468",
    yellow: "#F7D229",
};

const DESIGNS = [
    {
        id: "modern",
        name: "Modern",
        text: "Bold agency-style portfolio",
        icon: <LayoutOutlined />,
    },
    {
        id: "research",
        name: "Research",
        text: "Editorial & analytical",
        icon: <GlobalOutlined />,
    },
    {
        id: "developer",
        name: "Developer",
        text: "Split-screen technical",
        icon: <CodeOutlined />,
    },
    {
        id: "case-study",
        name: "Case Study",
        text: "Dark personal-brand & cases",
        icon: <RocketOutlined />,
    },
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
    personalInfo: {
        firstName: "Your",
        lastName: "Name",
        professionalTitle: "Professional",
        email: "",
        phone: "",
        location: "",
        profilePhoto: "",
        portfolio: "",
    },
    professionalSummary:
        "Build a professional portfolio from your resume.",
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    socialLinks: {
        github: "",
        linkedin: "",
        telegram: "",
        website: "",
    },
};

function parse(value, fallback = null) {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function slugify(value) {
    return (
        String(value || "your-name")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 48) || "your-name"
    );
}

function normalizeResume(raw) {
    const r = raw || defaultResume;

    return {
        ...defaultResume,
        ...r,
        personalInfo: {
            ...defaultResume.personalInfo,
            ...(r.personalInfo || {}),
        },
        socialLinks: {
            ...defaultResume.socialLinks,
            ...(r.socialLinks || {}),
        },
        workExperience: Array.isArray(r.workExperience)
            ? r.workExperience
            : [],
        education: Array.isArray(r.education)
            ? r.education
            : [],
        skills: Array.isArray(r.skills) ? r.skills : [],
        projects: Array.isArray(r.projects) ? r.projects : [],
        certifications: Array.isArray(r.certifications)
            ? r.certifications
            : [],
    };
}

function readSourceResume() {
    const params = new URLSearchParams(window.location.search);
    const resumeId = params.get("resumeId");

    const direct = parse(
        localStorage.getItem("portfolioSourceResume")
    );

    if (
        direct?.resumeData &&
        (!resumeId ||
            String(direct.resumeId) === String(resumeId))
    ) {
        return {
            resumeId: direct.resumeId || resumeId,
            resumeTitle: direct.resumeTitle || "Resume",
            resumeData: normalizeResume(direct.resumeData),
        };
    }

    return {
        resumeId,
        resumeTitle: "Resume",
        resumeData: defaultResume,
    };
}

function getCurrentUser() {
    return (
        parse(localStorage.getItem("currentUser")) || {}
    );
}

function getSkillName(item) {
    if (typeof item === "string") return item;
    return item?.name || item?.skill || item?.title || "Skill";
}

function getSkillLevel(item) {
    if (!item || typeof item !== "object") return 70;
    const level = Number(
        item.level ?? item.percent ?? 70
    );
    return Math.max(
        0,
        Math.min(100, Number.isFinite(level) ? level : 70)
    );
}

function normalizeLink(value) {
    if (!value) return "";
    const clean = String(value).trim();
    return /^https?:\/\//i.test(clean)
        ? clean
        : `https://${clean}`;
}

function isDarkTheme(theme) {
    if (theme === "dark") return true;
    if (theme !== "auto") return false;

    return (
        typeof window !== "undefined" &&
        window.matchMedia?.(
            "(prefers-color-scheme: dark)"
        )?.matches
    );
}

export default function PortfolioCreate() {
    const [api, contextHolder] = message.useMessage();
    const source = useMemo(readSourceResume, []);

    const [design, setDesign] = useState("modern");
    const [theme, setTheme] = useState("light");
    const [accent, setAccent] = useState(COLORS.pink);

    const [slug, setSlug] = useState(() =>
        slugify(
            `${source.resumeData?.personalInfo?.firstName || "your"}-${source.resumeData?.personalInfo?.lastName || "name"
            }`
        )
    );

    const [sections, setSections] =
        useState(defaultSections);

    const [aiPrompt, setAiPrompt] = useState("");
    const [saving, setSaving] = useState(false);
    const [published, setPublished] = useState(false);
    const [resumeData, setResumeData] = useState(
        source.resumeData
    );

    useEffect(() => {
        if (!source.resumeId) return;

        const hasData =
            source.resumeData?.personalInfo?.firstName ||
            source.resumeData?.personalInfo?.lastName ||
            source.resumeData?.personalInfo?.email;

        if (hasData) return;

        let cancelled = false;

        fetch(
            `${RESUMES_API}/${encodeURIComponent(
                source.resumeId
            )}`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Resume topilmadi.");
                }
                return response.json();
            })
            .then((item) => {
                if (cancelled) return;

                const parsed = parse(
                    item.resumeData,
                    defaultResume
                );

                setResumeData(normalizeResume(parsed));
            })
            .catch((error) => {
                console.error("RESUME LOAD ERROR:", error);
            });

        return () => {
            cancelled = true;
        };
    }, [source.resumeId, source.resumeData]);

    const fullName =
        `${resumeData.personalInfo?.firstName || ""} ${resumeData.personalInfo?.lastName || ""
            }`.trim() || "Your Name";

    const professionalTitle =
        resumeData.personalInfo?.professionalTitle ||
        "Professional";

    const publicUrl =
        `${window.location.origin}/p/${slug}`;

    const dark = isDarkTheme(theme);

    const builderColors = {
        page: dark ? "#091319" : "#F4F7F9",
        panel: dark ? "#10232C" : "#FFFFFF",
        border: dark ? "#274754" : "#DCE6EB",
        text: dark ? "#ECF5F8" : "#16212A",
        secondary: dark ? "#9EB5BF" : "#6B7D86",
    };

    const updateDesign = (value) => {
        setDesign(value);

        const presets = {
            modern: {
                theme: "light",
                accent: COLORS.pink,
            },
            research: {
                theme: "light",
                accent: COLORS.blue,
            },
            developer: {
                theme: "dark",
                accent: "#49B5E5",
            },
            "case-study": {
                theme: "dark",
                accent: "#D8FF2C",
            },
        };

        const preset = presets[value];

        if (preset) {
            setTheme(preset.theme);
            setAccent(preset.accent);
        }
    };

    const smartGenerate = () => {
        const prompt = aiPrompt.trim().toLowerCase();

        let nextDesign = design;
        let nextTheme = theme;
        let nextAccent = accent;

        if (
            prompt.includes("research") ||
            prompt.includes("editorial") ||
            prompt.includes("analytical")
        ) {
            nextDesign = "research";
        } else if (
            prompt.includes("developer") ||
            prompt.includes("react") ||
            prompt.includes("next.js") ||
            prompt.includes("nextjs") ||
            prompt.includes("code")
        ) {
            nextDesign = "developer";
        } else if (
            prompt.includes("case study") ||
            prompt.includes("case-study") ||
            prompt.includes("personal brand")
        ) {
            nextDesign = "case-study";
        } else if (
            prompt.includes("modern") ||
            prompt.includes("agency")
        ) {
            nextDesign = "modern";
        }

        if (prompt.includes("dark")) {
            nextTheme = "dark";
        } else if (prompt.includes("light")) {
            nextTheme = "light";
        }

        if (
            prompt.includes("pink") ||
            prompt.includes("magenta")
        ) {
            nextAccent = COLORS.pink;
        } else if (
            prompt.includes("blue") ||
            prompt.includes("cyan")
        ) {
            nextAccent = COLORS.blue;
        } else if (
            prompt.includes("green") ||
            prompt.includes("lime")
        ) {
            nextAccent = "#B8E52D";
        }

        const nextSections = {
            ...sections,
            about: true,
            projects: true,
            contact: true,
        };

        if (nextDesign === "research") {
            nextSections.education = true;
            nextSections.experience = false;
        }

        if (nextDesign === "developer") {
            nextSections.skills = true;
            nextSections.experience = true;
            nextSections.education = false;
        }

        if (nextDesign === "case-study") {
            nextSections.projects = true;
            nextSections.experience = true;
        }

        setDesign(nextDesign);
        setTheme(nextTheme);
        setAccent(nextAccent);
        setSections(nextSections);

        api.success(
            `AI design: ${DESIGNS.find((item) => item.id === nextDesign)?.name ||
            nextDesign
            }`
        );
    };

    const toggleSection = (key) => {
        setSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const savePortfolio = async () => {
        if (!slug.trim()) {
            api.error("Portfolio URL slug kerak.");
            return;
        }

        const currentUser = getCurrentUser();

        const payload = {
            userId: String(
                currentUser.id ||
                localStorage.getItem("userId") ||
                ""
            ),

            resumeId: String(source.resumeId || ""),

            slug: String(slug),

            title: String(fullName),

            templateId: String(design),

            theme: String(theme),

            accentColor: String(accent),

            sectionsJson: JSON.stringify(sections),

            resumeData: JSON.stringify(resumeData),

            published: true,

            updatedAt: new Date().toISOString(),
        };

        setSaving(true);

        try {
            // MUHIM:
            // Avval slug bo‘yicha mavjud portfolio bor-yo‘qligini tekshiramiz.
            const checkResponse = await fetch(
                `${PORTFOLIOS_API}?slug=${encodeURIComponent(slug)}`
            );

            let existing = [];

            if (checkResponse.ok) {
                const data = await checkResponse.json();
                existing = Array.isArray(data) ? data : [];
            }

            let response;

            if (existing.length > 0 && existing[0]?.id) {
                // BOR BO‘LSA -> UPDATE
                response = await fetch(
                    `${PORTFOLIOS_API}/${existing[0].id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    }
                );
            } else {
                // YO‘Q BO‘LSA -> CREATE
                response = await fetch(
                    PORTFOLIOS_API,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    }
                );
            }

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    `Portfolio API ${response.status}: ${responseText}`
                );
            }

            const saved = JSON.parse(responseText);

            // Local backup
            localStorage.setItem(
                `portfolioId:${slug}`,
                String(saved.id)
            );

            localStorage.setItem(
                `portfolio:${slug}`,
                JSON.stringify({
                    ...payload,
                    id: saved.id,
                })
            );

            setPublished(true);

            api.success(
                existing.length > 0
                    ? "Portfolio yangilandi."
                    : "Portfolio yaratildi."
            );

            // PUBLIC PAGE OCHISH
            setTimeout(() => {
                window.location.href = `/p/${slug}`;
            }, 500);
        } catch (error) {
            console.error(
                "PORTFOLIO SAVE ERROR:",
                error
            );

            api.error(
                error?.message ||
                "Portfolio saqlanmadi."
            );
        } finally {
            setSaving(false);
        }
    };

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(
                publicUrl
            );
            api.success("Public URL copied.");
        } catch {
            api.error("URL copy qilinmadi.");
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: accent,
                    borderRadius: 12,
                    fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
                },
            }}
        >
            {contextHolder}

            <style>{`
        .portfolio-builder-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .portfolio-builder-scroll::-webkit-scrollbar-thumb {
          background: rgba(100,120,130,.25);
          border-radius: 999px;
        }

        .design-option {
          transition: transform .2s ease, border-color .2s ease, background .2s ease;
        }

        .design-option:hover {
          transform: translateY(-2px);
        }
      `}</style>

            <div
                style={{
                    minHeight: "100vh",
                    background: builderColors.page,
                    color: builderColors.text,
                    padding: "20px",
                }}
            >
                <div
                    style={{
                        maxWidth: 1560,
                        margin: "0 auto",
                    }}
                >
                    {/* TOP BAR */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 14,
                            marginBottom: 18,
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => window.history.back()}
                            style={{
                                borderRadius: 10,
                            }}
                        >
                            Back to Resume
                        </Button>

                        <Space wrap>
                            <Button
                                icon={<CopyOutlined />}
                                onClick={copyUrl}
                            >
                                Copy URL
                            </Button>

                            <Button
                                type="primary"
                                icon={
                                    published ? (
                                        <CheckCircleFilled />
                                    ) : (
                                        <SaveOutlined />
                                    )
                                }
                                loading={saving}
                                onClick={savePortfolio}
                                style={{
                                    background: accent,
                                    borderColor: accent,
                                    borderRadius: 10,
                                    fontWeight: 750,
                                }}
                            >
                                {published
                                    ? "Published"
                                    : "Generate Website"}
                            </Button>
                        </Space>
                    </div>

                    <Row gutter={[20, 20]}>
                        {/* LEFT CONTROL PANEL */}
                        <Col xs={24} xl={8}>
                            <div
                                className="portfolio-builder-scroll"
                                style={{
                                    display: "grid",
                                    gap: 16,
                                    maxHeight: "calc(100vh - 100px)",
                                    overflowY: "auto",
                                    paddingRight: 4,
                                    position: "sticky",
                                    top: 16,
                                }}
                            >
                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: 20,
                                        background: builderColors.panel,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: accent,
                                            fontWeight: 800,
                                            fontSize: 11,
                                            letterSpacing: ".8px",
                                        }}
                                    >
                                        RESUME → PORTFOLIO
                                    </Text>

                                    <Title
                                        level={2}
                                        style={{
                                            color: builderColors.text,
                                            marginTop: 8,
                                            marginBottom: 4,
                                        }}
                                    >
                                        Portfolio Website
                                    </Title>

                                    <Text
                                        style={{
                                            color: builderColors.secondary,
                                        }}
                                    >
                                        {fullName} · {professionalTitle}
                                    </Text>

                                    <Divider />

                                    <Text strong>Public URL</Text>

                                    <Input
                                        addonBefore="ceobace.com/p/"
                                        value={slug}
                                        onChange={(event) =>
                                            setSlug(
                                                slugify(event.target.value)
                                            )
                                        }
                                        style={{
                                            marginTop: 8,
                                        }}
                                    />
                                </Card>

                                {/* AI */}
                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: 20,
                                        background: builderColors.panel,
                                    }}
                                >
                                    <Title
                                        level={4}
                                        style={{
                                            color: builderColors.text,
                                            marginTop: 0,
                                        }}
                                    >
                                        AI Website Assistant
                                    </Title>

                                    <Paragraph
                                        style={{
                                            color: builderColors.secondary,
                                        }}
                                    >
                                        Masalan: “Modern agency portfolio with
                                        bold hero”, “Research editorial” yoki
                                        “Dark developer React/Next.js”.
                                    </Paragraph>

                                    <Input.TextArea
                                        rows={4}
                                        value={aiPrompt}
                                        onChange={(event) =>
                                            setAiPrompt(event.target.value)
                                        }
                                        placeholder="Portfolio qanday ko‘rinsin?"
                                    />

                                    <Button
                                        type="primary"
                                        block
                                        icon={<RocketOutlined />}
                                        onClick={smartGenerate}
                                        style={{
                                            marginTop: 10,
                                            background: accent,
                                            borderColor: accent,
                                            borderRadius: 10,
                                        }}
                                    >
                                        Smart Generate
                                    </Button>
                                </Card>

                                {/* DESIGNS */}
                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: 20,
                                        background: builderColors.panel,
                                    }}
                                >
                                    <Title
                                        level={4}
                                        style={{
                                            color: builderColors.text,
                                            marginTop: 0,
                                        }}
                                    >
                                        Choose Design
                                    </Title>

                                    <Space
                                        direction="vertical"
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        {DESIGNS.map((item) => {
                                            const active =
                                                design === item.id;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="design-option"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() =>
                                                        updateDesign(item.id)
                                                    }
                                                    onKeyDown={(event) => {
                                                        if (
                                                            event.key === "Enter" ||
                                                            event.key === " "
                                                        ) {
                                                            updateDesign(item.id);
                                                        }
                                                    }}
                                                    style={{
                                                        cursor: "pointer",
                                                        padding: 14,
                                                        borderRadius: 15,
                                                        border: `2px solid ${active
                                                            ? accent
                                                            : builderColors.border
                                                            }`,
                                                        background: active
                                                            ? `${accent}14`
                                                            : "transparent",
                                                    }}
                                                >
                                                    <Space align="start">
                                                        <span
                                                            style={{
                                                                width: 38,
                                                                height: 38,
                                                                borderRadius: 11,
                                                                display: "grid",
                                                                placeItems: "center",
                                                                background: active
                                                                    ? `${accent}18`
                                                                    : builderColors.page,
                                                                color: accent,
                                                                flex: "0 0 auto",
                                                            }}
                                                        >
                                                            {item.icon}
                                                        </span>

                                                        <div>
                                                            <Text
                                                                strong
                                                                style={{
                                                                    color:
                                                                        builderColors.text,
                                                                }}
                                                            >
                                                                {item.name}
                                                            </Text>

                                                            <div
                                                                style={{
                                                                    marginTop: 3,
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color:
                                                                            builderColors.secondary,
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    {item.text}
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    </Space>
                                                </div>
                                            );
                                        })}
                                    </Space>
                                </Card>

                                {/* THEME */}
                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: 20,
                                        background: builderColors.panel,
                                    }}
                                >
                                    <Title
                                        level={4}
                                        style={{
                                            color: builderColors.text,
                                            marginTop: 0,
                                        }}
                                    >
                                        Theme
                                    </Title>

                                    <Space wrap>
                                        {[
                                            "light",
                                            "dark",
                                            "auto",
                                        ].map((value) => (
                                            <Button
                                                key={value}
                                                type={
                                                    theme === value
                                                        ? "primary"
                                                        : "default"
                                                }
                                                onClick={() =>
                                                    setTheme(value)
                                                }
                                            >
                                                {value
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    value.slice(1)}
                                            </Button>
                                        ))}
                                    </Space>

                                    <Divider />

                                    <Text strong>Accent Color</Text>

                                    <Input
                                        value={accent}
                                        onChange={(event) =>
                                            setAccent(
                                                event.target.value
                                            )
                                        }
                                        prefix={
                                            <span
                                                style={{
                                                    width: 17,
                                                    height: 17,
                                                    borderRadius: 5,
                                                    background: accent,
                                                    display: "inline-block",
                                                }}
                                            />
                                        }
                                        style={{
                                            marginTop: 8,
                                        }}
                                    />
                                </Card>

                                {/* SECTIONS */}
                                <Card
                                    bordered={false}
                                    style={{
                                        borderRadius: 20,
                                        background: builderColors.panel,
                                    }}
                                >
                                    <Title
                                        level={4}
                                        style={{
                                            color: builderColors.text,
                                            marginTop: 0,
                                        }}
                                    >
                                        Sections
                                    </Title>

                                    {Object.entries(sections).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 10,
                                                    padding: "8px 0",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color:
                                                            builderColors.text,
                                                    }}
                                                >
                                                    {key
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        key.slice(1)}
                                                </Text>

                                                <Switch
                                                    checked={value}
                                                    onChange={() =>
                                                        toggleSection(key)
                                                    }
                                                />
                                            </div>
                                        )
                                    )}
                                </Card>
                            </div>
                        </Col>

                        {/* RIGHT LIVE PREVIEW */}
                        <Col xs={24} xl={16}>
                            <Card
                                bordered={false}
                                bodyStyle={{ padding: 0 }}
                                style={{
                                    borderRadius: 20,
                                    overflow: "hidden",
                                    background: builderColors.panel,
                                }}
                            >
                                <div
                                    style={{
                                        height: 58,
                                        background: "#0D1C23",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 7,
                                        padding: "0 16px",
                                    }}
                                >
                                    <BrowserDot />
                                    <BrowserDot />
                                    <BrowserDot />

                                    <div
                                        style={{
                                            marginLeft: 12,
                                            flex: 1,
                                            padding: "8px 12px",
                                            background:
                                                "rgba(255,255,255,.08)",
                                            borderRadius: 8,
                                            color: "#9EB5BF",
                                            fontSize: 12,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <EyeOutlined />{" "}
                                        {publicUrl}
                                    </div>
                                </div>

                                <PortfolioPreview
                                    resume={resumeData}
                                    design={design}
                                    theme={theme}
                                    accent={accent}
                                    sections={sections}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </ConfigProvider>
    );
}

function BrowserDot() {
    return (
        <span
            style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#6F8088",
                display: "inline-block",
            }}
        />
    );
}

function PortfolioPreview({
    resume,
    design,
    theme,
    accent,
    sections,
}) {
    switch (design) {
        case "research":
            return (
                <ResearchTemplate
                    resume={resume}
                    theme={theme}
                    accent={accent}
                    sections={sections}
                />
            );

        case "developer":
            return (
                <DeveloperTemplate
                    resume={resume}
                    theme={theme}
                    accent={accent}
                    sections={sections}
                />
            );

        case "case-study":
            return (
                <CaseStudyTemplate
                    resume={resume}
                    theme={theme}
                    accent={accent}
                    sections={sections}
                />
            );

        default:
            return (
                <ModernTemplate
                    resume={resume}
                    theme={theme}
                    accent={accent}
                    sections={sections}
                />
            );
    }
}

/* ============================================================
   1. MODERN
   ============================================================ */

function ModernTemplate({
    resume,
    theme,
    accent,
    sections,
}) {
    const dark = isDarkTheme(theme);
    const info = resume.personalInfo || {};
    const social = resume.socialLinks || {};

    const projects = resume.projects || [];
    const experience = resume.workExperience || [];
    const skills = resume.skills || [];

    const fullName =
        `${info.firstName || ""} ${info.lastName || ""
            }`.trim() || "Your Name";

    const summary =
        resume.professionalSummary ||
        "I help teams turn ideas into clear, high-quality digital experiences.";

    const text = dark ? "#F4F6F8" : "#171A1D";
    const soft = dark ? "#13191D" : "#FFFFFF";

    return (
        <div
            style={{
                minHeight: 920,
                background: dark ? "#0B0D0F" : "#FFFFFF",
                color: text,
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
        >
            <style>{`
        @keyframes modernGlow {
          0%,100% { transform: translateY(0); opacity: .75; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        .modern-glow { animation: modernGlow 5s ease-in-out infinite; }
      `}</style>

            {/* NAV */}
            <div
                style={{
                    background: "#090A0B",
                    color: "#fff",
                    padding: "13px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        fontWeight: 900,
                        letterSpacing: "-.4px",
                    }}
                >
                    {fullName.toUpperCase()}
                </div>

                <Space wrap size={18}>
                    {[
                        ["About", "about"],
                        ["Experience", "experience"],
                        ["Projects", "projects"],
                        ["Contact", "contact"],
                    ].map(([label, id]) => (
                        <a
                            key={id}
                            href={`#preview-${id}`}
                            style={{
                                color: "#fff",
                                fontSize: 11,
                                textTransform: "uppercase",
                                letterSpacing: ".7px",
                                opacity: .84,
                            }}
                        >
                            {label}
                        </a>
                    ))}

                    <span
                        style={{
                            padding: "7px 11px",
                            background: accent,
                            borderRadius: 2,
                            fontSize: 10,
                            fontWeight: 800,
                        }}
                    >
                        CONTACT
                    </span>
                </Space>
            </div>

            {/* HERO */}
            <div
                style={{
                    position: "relative",
                    overflow: "hidden",
                    background: accent,
                    padding:
                        "68px clamp(30px,7vw,76px) 64px",
                    color: "#fff",
                }}
            >
                <div
                    className="modern-glow"
                    style={{
                        position: "absolute",
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        border:
                            "1px solid rgba(255,255,255,.18)",
                        right: 40,
                        top: 24,
                    }}
                />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "minmax(0,1fr) 300px",
                        gap: 30,
                        alignItems: "center",
                    }}
                >
                    <div>
                        <Text
                            style={{
                                color: "rgba(255,255,255,.72)",
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                            }}
                        >
                            {info.professionalTitle ||
                                "Digital Professional"}
                        </Text>

                        <Title
                            style={{
                                color: "#fff",
                                fontSize:
                                    "clamp(42px,6vw,76px)",
                                lineHeight: .98,
                                letterSpacing: "-3px",
                                margin: "10px 0 18px",
                                maxWidth: 760,
                            }}
                        >
                            {fullName}
                        </Title>

                        <Paragraph
                            style={{
                                color: "rgba(255,255,255,.84)",
                                fontSize: 17,
                                lineHeight: 1.75,
                                maxWidth: 680,
                                marginBottom: 20,
                            }}
                        >
                            {summary}
                        </Paragraph>

                        <Space wrap>
                            {sections.projects && (
                                <Button
                                    href="#preview-projects"
                                    style={{
                                        background: "#111",
                                        borderColor: "#111",
                                        color: "#fff",
                                        borderRadius: 2,
                                        fontWeight: 800,
                                    }}
                                >
                                    View my work
                                </Button>
                            )}

                            {info.email && (
                                <Button
                                    href={`mailto:${info.email}`}
                                    ghost
                                    style={{
                                        borderRadius: 2,
                                        fontWeight: 800,
                                    }}
                                >
                                    Get in touch
                                </Button>
                            )}
                        </Space>
                    </div>

                    <ModernHeroImage
                        resume={resume}
                        fallbackColor={accent}
                    />
                </div>
            </div>

            {/* BRANDS */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    gap: 24,
                    flexWrap: "wrap",
                    padding: "18px 32px",
                    background: dark
                        ? "#121619"
                        : "#FFFFFF",
                    borderBottom:
                        "1px solid rgba(0,0,0,.08)",
                    color: dark
                        ? "#9BA6AA"
                        : "#6B7175",
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                }}
            >
                <span>VERCEL</span>
                <span>STRIPE</span>
                <span>FIGMA</span>
                <span>NOTION</span>
            </div>

            {/* ABOUT */}
            {sections.about && (
                <div
                    id="preview-about"
                    style={{
                        padding:
                            "58px clamp(30px,7vw,74px)",
                        background: soft,
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1.1fr .9fr",
                            gap: 38,
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <Text
                                style={{
                                    color: accent,
                                    fontSize: 10,
                                    fontWeight: 900,
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                }}
                            >
                                About me
                            </Text>

                            <Title
                                level={2}
                                style={{
                                    color: text,
                                    fontSize: 32,
                                    margin:
                                        "7px 0 15px",
                                }}
                            >
                                Strong ideas.
                                <br />
                                Useful execution.
                            </Title>

                            <Paragraph
                                style={{
                                    color: dark
                                        ? "#ADB7BA"
                                        : "#657279",
                                    lineHeight: 1.8,
                                    maxWidth: 580,
                                    marginBottom: 0,
                                }}
                            >
                                {summary}
                            </Paragraph>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gap: 10,
                            }}
                        >
                            <ModernInfoRow
                                label="Location"
                                value={
                                    info.location ||
                                    "Remote"
                                }
                                accent={accent}
                                dark={dark}
                            />
                            <ModernInfoRow
                                label="Email"
                                value={
                                    info.email ||
                                    "Available on request"
                                }
                                accent={accent}
                                dark={dark}
                            />
                            <ModernInfoRow
                                label="Role"
                                value={
                                    info.professionalTitle ||
                                    "Professional"
                                }
                                accent={accent}
                                dark={dark}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* EXPERIENCE */}
            {sections.experience &&
                experience.length > 0 && (
                    <div
                        id="preview-experience"
                        style={{
                            padding:
                                "54px clamp(30px,7vw,74px)",
                            background: dark
                                ? "#0E1214"
                                : "#F6F7F8",
                        }}
                    >
                        <ModernHeading
                            title="Experience"
                            accent={accent}
                            dark={dark}
                        />

                        <div
                            style={{
                                display: "grid",
                                gap: 10,
                            }}
                        >
                            {experience.map(
                                (item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "150px 1fr",
                                            gap: 24,
                                            padding:
                                                "20px 0",
                                            borderBottom:
                                                "1px solid rgba(100,120,130,.14)",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: dark
                                                    ? "#89969A"
                                                    : "#7A878D",
                                                fontSize: 11,
                                            }}
                                        >
                                            {item.from || ""}
                                            <br />
                                            {item.present
                                                ? "Present"
                                                : item.to || ""}
                                        </Text>

                                        <div>
                                            <Text
                                                strong
                                                style={{
                                                    color: text,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {item.position ||
                                                    "Position"}
                                            </Text>

                                            <div
                                                style={{
                                                    color: accent,
                                                    fontWeight: 750,
                                                    fontSize: 13,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {item.company ||
                                                    "Company"}
                                            </div>

                                            <Paragraph
                                                style={{
                                                    color: dark
                                                        ? "#9EA9AD"
                                                        : "#6A767D",
                                                    lineHeight: 1.65,
                                                    marginTop: 8,
                                                    marginBottom: 0,
                                                }}
                                            >
                                                {item.responsibilities ||
                                                    ""}
                                            </Paragraph>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

            {/* FEATURES / PROJECTS */}
            {sections.projects && (
                <div
                    id="preview-projects"
                    style={{
                        background: "#090A0B",
                        color: "#fff",
                        padding:
                            "62px clamp(30px,7vw,74px)",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 760,
                            marginBottom: 30,
                        }}
                    >
                        <Text
                            style={{
                                color: accent,
                                fontSize: 10,
                                fontWeight: 900,
                                letterSpacing: "1px",
                            }}
                        >
                            SELECTED WORK
                        </Text>
                        <Title
                            style={{
                                color: "#fff",
                                margin:
                                    "9px 0 10px",
                                fontSize: 34,
                            }}
                        >
                            Work that gets remembered.
                        </Title>
                    </div>

                    <Row gutter={[16, 16]}>
                        {projects.length > 0
                            ? projects
                                .slice(0, 3)
                                .map((project, index) => (
                                    <Col
                                        key={index}
                                        xs={24}
                                        md={8}
                                    >
                                        <div
                                            style={{
                                                minHeight: 190,
                                                padding: 22,
                                                border:
                                                    "1px solid rgba(255,255,255,.12)",
                                                background:
                                                    "rgba(255,255,255,.03)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color: accent,
                                                    fontSize: 10,
                                                    fontWeight: 900,
                                                }}
                                            >
                                                0{index + 1}
                                            </div>

                                            <Title
                                                level={4}
                                                style={{
                                                    color: "#fff",
                                                    margin:
                                                        "13px 0 8px",
                                                }}
                                            >
                                                {project.name ||
                                                    "Project"}
                                            </Title>

                                            <Paragraph
                                                style={{
                                                    color:
                                                        "rgba(255,255,255,.64)",
                                                    lineHeight: 1.7,
                                                }}
                                            >
                                                {project.description ||
                                                    ""}
                                            </Paragraph>

                                            {project.link && (
                                                <a
                                                    href={normalizeLink(
                                                        project.link
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        color: accent,
                                                        fontWeight: 750,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    View project →
                                                </a>
                                            )}
                                        </div>
                                    </Col>
                                ))
                            : [1, 2, 3].map(
                                (item) => (
                                    <Col
                                        key={item}
                                        xs={24}
                                        md={8}
                                    >
                                        <div
                                            style={{
                                                minHeight: 190,
                                                padding: 22,
                                                border:
                                                    "1px solid rgba(255,255,255,.12)",
                                                background:
                                                    "rgba(255,255,255,.03)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color: accent,
                                                }}
                                            >
                                                0{item}
                                            </div>
                                            <Text
                                                strong
                                                style={{
                                                    color: "#fff",
                                                    display: "block",
                                                    marginTop: 12,
                                                }}
                                            >
                                                Add a project
                                            </Text>
                                        </div>
                                    </Col>
                                )
                            )}
                    </Row>

                    {sections.skills &&
                        skills.length > 0 && (
                            <div
                                style={{
                                    marginTop: 36,
                                    paddingTop: 26,
                                    borderTop:
                                        "1px solid rgba(255,255,255,.10)",
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            "rgba(255,255,255,.45)",
                                        fontSize: 10,
                                        fontWeight: 800,
                                        letterSpacing: "1px",
                                    }}
                                >
                                    CAPABILITIES
                                </Text>

                                <Space
                                    wrap
                                    style={{
                                        marginTop: 14,
                                    }}
                                >
                                    {skills.map(
                                        (skill, index) => (
                                            <Tag
                                                key={index}
                                                style={{
                                                    color: "#fff",
                                                    background:
                                                        "rgba(255,255,255,.05)",
                                                    border:
                                                        "1px solid rgba(255,255,255,.10)",
                                                    borderRadius: 2,
                                                    padding:
                                                        "6px 11px",
                                                }}
                                            >
                                                {getSkillName(
                                                    skill
                                                )}
                                            </Tag>
                                        )
                                    )}
                                </Space>
                            </div>
                        )}
                </div>
            )}

            {/* CONTACT */}
            {sections.contact && (
                <div
                    id="preview-contact"
                    style={{
                        background: accent,
                        color: "#fff",
                        padding:
                            "52px clamp(30px,7vw,74px)",
                    }}
                >
                    <Title
                        style={{
                            color: "#fff",
                            fontSize: 36,
                            marginTop: 0,
                        }}
                    >
                        Let’s work together.
                    </Title>

                    <Paragraph
                        style={{
                            color: "rgba(255,255,255,.82)",
                            maxWidth: 650,
                            fontSize: 16,
                            lineHeight: 1.7,
                        }}
                    >
                        {info.email ||
                            "Add your email address in the resume to enable contact."}
                    </Paragraph>

                    <Space wrap>
                        {info.email && (
                            <Button
                                href={`mailto:${info.email}`}
                                style={{
                                    background: "#111",
                                    borderColor: "#111",
                                    color: "#fff",
                                    borderRadius: 2,
                                    fontWeight: 800,
                                }}
                            >
                                Email me
                            </Button>
                        )}

                        {social.github && (
                            <Button
                                href={normalizeLink(
                                    social.github
                                )}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    borderRadius: 2,
                                }}
                            >
                                GitHub
                            </Button>
                        )}

                        {social.linkedin && (
                            <Button
                                href={normalizeLink(
                                    social.linkedin
                                )}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    borderRadius: 2,
                                }}
                            >
                                LinkedIn
                            </Button>
                        )}
                    </Space>
                </div>
            )}
        </div>
    );
}

/* ============================================================
   2. RESEARCH
   ============================================================ */

function ResearchTemplate({
    resume,
    theme,
    accent,
    sections,
}) {
    const dark = isDarkTheme(theme);
    const info = resume.personalInfo || {};
    const projects = resume.projects || [];
    const education = resume.education || [];

    const text = dark ? "#F1F5F6" : "#253141";
    const secondary = dark
        ? "#98A5AA"
        : "#68737D";
    const bg = dark ? "#10161A" : "#F8FAFB";
    const blueBand = dark ? "#142C37" : "#EEF7FB";

    const fullName =
        `${info.firstName || ""} ${info.lastName || ""
            }`.trim() || "Your Name";

    const stats = [
        {
            value: "30%",
            label: "Research",
        },
        {
            value: "50%",
            label: "Product thinking",
        },
        {
            value: "90%",
            label: "Delivery",
        },
    ];

    return (
        <div
            style={{
                minHeight: 920,
                background: bg,
                color: text,
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
        >
            <style>{`
        @keyframes researchFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        .research-float {
          animation: researchFloat 5s ease-in-out infinite;
        }
      `}</style>

            <div
                style={{
                    maxWidth: 820,
                    margin: "0 auto",
                    minHeight: 920,
                    background: dark
                        ? "#121A1F"
                        : "#FFFFFF",
                    boxShadow:
                        "0 0 0 1px rgba(20,40,50,.05)",
                }}
            >
                {/* RESEARCH HEADER */}
                <div
                    style={{
                        padding:
                            "42px 54px 30px",
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: accent,
                            letterSpacing: "1px",
                        }}
                    >
                        PORTFOLIO / RESEARCH
                    </div>

                    <Title
                        style={{
                            color: text,
                            margin:
                                "10px 0 4px",
                            fontSize: 34,
                        }}
                    >
                        {fullName}
                    </Title>

                    <Text
                        style={{
                            color: secondary,
                        }}
                    >
                        {info.professionalTitle ||
                            "Research & Product Professional"}
                    </Text>

                    {sections.about && (
                        <Paragraph
                            style={{
                                color: secondary,
                                lineHeight: 1.8,
                                maxWidth: 580,
                                marginTop: 18,
                            }}
                        >
                            {resume.professionalSummary ||
                                "A structured portfolio for thoughtful product work, research and execution."}
                        </Paragraph>
                    )}
                </div>

                {/* CHALLENGES */}
                {sections.about && (
                    <div
                        style={{
                            padding:
                                "42px 54px",
                            background:
                                dark
                                    ? "#11171B"
                                    : "#FFFFFF",
                        }}
                    >
                        <ResearchTitle
                            title="Business Challenges"
                            accent={accent}
                            text={text}
                        />

                        <div
                            style={{
                                display: "grid",
                                gap: 9,
                            }}
                        >
                            {[
                                "Lorem ipsum dolor sit amet, consectetur",
                                "Nunc sagittis amet fames amet",
                                "Selectique molestie eu amet laoreet non malesuada",
                                "quam tincidunt. Nisi cursus",
                                "Risus mollis dictum dolor, quam. Gravida",
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "18px 1fr",
                                        gap: 10,
                                        fontSize: 10,
                                        color: secondary,
                                    }}
                                >
                                    <span
                                        style={{
                                            color: accent,
                                        }}
                                    >
                                        →
                                    </span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* BLUE BAND / PEOPLE */}
                <div
                    style={{
                        minHeight: 190,
                        background: blueBand,
                        position: "relative",
                        display: "grid",
                        placeItems: "center",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            zIndex: 2,
                            padding: "0 80px",
                        }}
                    >
                        <Text
                            strong
                            style={{
                                color: text,
                                fontSize: 18,
                            }}
                        >
                            Product Users
                        </Text>
                        <Paragraph
                            style={{
                                color: secondary,
                                fontSize: 10,
                                lineHeight: 1.6,
                                marginTop: 8,
                            }}
                        >
                            Lorem ipsum dolor sit amet, consectetur
                            <br />
                            amet fames amet
                        </Paragraph>
                    </div>

                    <ResearchCircle
                        photo={
                            info.profilePhoto ||
                            info.avatar ||
                            ""
                        }
                        style={{
                            left: 4,
                            bottom: 16,
                            animationDelay: "0s",
                        }}
                    />

                    <ResearchCircle
                        photo={
                            projects[0]?.image ||
                            projects[0]?.photo ||
                            info.profilePhoto ||
                            ""
                        }
                        style={{
                            right: 26,
                            top: 16,
                            animationDelay: "1.2s",
                        }}
                    />

                    <ResearchCircle
                        photo={
                            projects[1]?.image ||
                            projects[1]?.photo ||
                            info.profilePhoto ||
                            ""
                        }
                        style={{
                            right: 46,
                            bottom: -23,
                            width: 58,
                            height: 58,
                            animationDelay: "2.2s",
                        }}
                    />
                </div>

                {/* QUANTITATIVE RESEARCH */}
                <div
                    style={{
                        padding:
                            "50px 54px 58px",
                    }}
                >
                    <ResearchTitle
                        title="Quantitative Research"
                        accent={accent}
                        text={text}
                    />

                    <Paragraph
                        style={{
                            color: secondary,
                            fontSize: 10,
                            lineHeight: 1.7,
                            maxWidth: 430,
                        }}
                    >
                        Explain your research in detail with observations
                        and inferences.
                    </Paragraph>

                    <div
                        style={{
                            marginTop: 22,
                            fontSize: 10,
                            color: text,
                            fontWeight: 750,
                        }}
                    >
                        Observations
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2,1fr)",
                            gap: 30,
                            marginTop: 30,
                        }}
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                style={{
                                    minHeight: 92,
                                    padding:
                                        index % 2 === 0
                                            ? "0 0 0 0"
                                            : "14px 0 0 18px",
                                }}
                            >
                                <div
                                    style={{
                                        color: accent,
                                        fontWeight: 900,
                                        fontSize: 28,
                                        letterSpacing: "-1px",
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    style={{
                                        color: text,
                                        fontWeight: 700,
                                        fontSize: 10,
                                        marginTop: 2,
                                    }}
                                >
                                    {stat.label}
                                </div>
                                <div
                                    style={{
                                        color: secondary,
                                        fontSize: 9,
                                        lineHeight: 1.55,
                                        marginTop: 4,
                                        maxWidth: 160,
                                    }}
                                >
                                    Lorem ipsum dolor sit amet,
                                    consectetur adipiscing elit.
                                </div>
                            </div>
                        ))}
                    </div>

                    {sections.projects &&
                        projects.length > 0 && (
                            <div
                                style={{
                                    marginTop: 40,
                                }}
                            >
                                <ResearchTitle
                                    title="Selected Work"
                                    accent={accent}
                                    text={text}
                                />

                                <div
                                    style={{
                                        display: "grid",
                                        gap: 10,
                                    }}
                                >
                                    {projects.slice(0, 3).map(
                                        (project, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 16,
                                                    padding:
                                                        "14px 0",
                                                    borderBottom:
                                                        `1px solid ${dark
                                                            ? "#25333A"
                                                            : "#E5EAED"
                                                        }`,
                                                }}
                                            >
                                                <div>
                                                    <Text
                                                        strong
                                                        style={{
                                                            color: text,
                                                        }}
                                                    >
                                                        {project.name ||
                                                            "Project"}
                                                    </Text>
                                                    <div
                                                        style={{
                                                            color: secondary,
                                                            fontSize: 10,
                                                            marginTop: 3,
                                                        }}
                                                    >
                                                        {project.description ||
                                                            ""}
                                                    </div>
                                                </div>

                                                <span
                                                    style={{
                                                        color: accent,
                                                        fontWeight: 800,
                                                        fontSize: 11,
                                                    }}
                                                >
                                                    0{index + 1}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {sections.education &&
                        education.length > 0 && (
                            <div
                                style={{
                                    marginTop: 34,
                                }}
                            >
                                <ResearchTitle
                                    title="Education"
                                    accent={accent}
                                    text={text}
                                />

                                {education.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                color: secondary,
                                                fontSize: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <strong
                                                style={{
                                                    color: text,
                                                }}
                                            >
                                                {item.degree ||
                                                    "Degree"}
                                            </strong>
                                            {" · "}
                                            {item.institution ||
                                                ""}
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                </div>

                {sections.contact && (
                    <div
                        style={{
                            padding:
                                "24px 54px",
                            background:
                                dark
                                    ? "#0C1114"
                                    : "#F7FAFB",
                            borderTop:
                                `1px solid ${dark
                                    ? "#263239"
                                    : "#E7ECEF"
                                }`,
                        }}
                    >
                        <Text
                            style={{
                                color: accent,
                                fontSize: 10,
                                fontWeight: 900,
                            }}
                        >
                            CONTACT
                        </Text>
                        <div
                            style={{
                                marginTop: 7,
                                color: secondary,
                                fontSize: 11,
                            }}
                        >
                            {info.email ||
                                "Add email in your resume"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ResearchCircle({
    photo,
    style,
}) {
    return (
        <div
            className="research-float"
            style={{
                position: "absolute",
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "#D8E1E5",
                border:
                    "3px solid rgba(255,255,255,.65)",
                boxShadow:
                    "0 14px 30px rgba(30,60,80,.18)",
                overflow: "hidden",
                ...style,
            }}
        >
            {photo ? (
                <img
                    src={photo}
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        color: "#4B6672",
                        fontWeight: 800,
                        fontSize: 17,
                    }}
                >
                    U
                </div>
            )}
        </div>
    );
}

function ResearchTitle({
    title,
    accent,
    text,
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
            }}
        >
            <span
                style={{
                    width: 22,
                    height: 2,
                    background: accent,
                    display: "inline-block",
                }}
            />
            <Title
                level={3}
                style={{
                    color: text,
                    margin: 0,
                    fontSize: 18,
                }}
            >
                {title}
            </Title>
        </div>
    );
}

/* ============================================================
   3. DEVELOPER
   ============================================================ */

function DeveloperTemplate({
    resume,
    theme,
    accent,
    sections,
}) {
    const dark = true;
    const info = resume.personalInfo || {};
    const projects = resume.projects || [];
    const experience = resume.workExperience || [];
    const skills = resume.skills || [];

    const fullName =
        `${info.firstName || ""} ${info.lastName || ""
            }`.trim() || "Your Name";

    return (
        <div
            style={{
                minHeight: 920,
                background: "#111",
                color: "#F4F8F9",
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
        >
            <style>{`
        @keyframes devPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(73,181,229,0); }
          50% { box-shadow: 0 0 0 10px rgba(73,181,229,.07); }
        }
        .dev-pulse { animation: devPulse 4s ease-in-out infinite; }
      `}</style>

            {/* HERO */}
            <div
                style={{
                    minHeight: 330,
                    display: "grid",
                    gridTemplateColumns:
                        "45% 55%",
                    background: "#D9D9D9",
                    color: "#111",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        padding:
                            "52px 42px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        clipPath:
                            "polygon(0 0,100% 0,86% 100%,0 100%)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            fontWeight: 900,
                            letterSpacing: "1.5px",
                            marginBottom: 18,
                        }}
                    >
                        HI, I AM
                    </div>

                    <Title
                        style={{
                            color: "#111",
                            fontSize:
                                "clamp(34px,5vw,58px)",
                            lineHeight: .98,
                            letterSpacing: "-2.6px",
                            margin: 0,
                        }}
                    >
                        {fullName}
                    </Title>

                    <Text
                        style={{
                            color: "#556168",
                            marginTop: 11,
                            fontSize: 11,
                            lineHeight: 1.5,
                        }}
                    >
                        {info.professionalTitle ||
                            "Front-end Developer / UI Engineer"}
                    </Text>

                    <Space
                        wrap
                        size={6}
                        style={{
                            marginTop: 18,
                        }}
                    >
                        {info.email && (
                            <span
                                style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 5,
                                    display: "grid",
                                    placeItems: "center",
                                    border:
                                        "1px solid rgba(0,0,0,.14)",
                                    fontSize: 10,
                                }}
                            >
                                @
                            </span>
                        )}

                        {info.location && (
                            <span
                                style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 5,
                                    display: "grid",
                                    placeItems: "center",
                                    border:
                                        "1px solid rgba(0,0,0,.14)",
                                    fontSize: 10,
                                }}
                            >
                                ●
                            </span>
                        )}
                    </Space>
                </div>

                <div
                    style={{
                        position: "relative",
                        background: "#050505",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 25,
                            right: 25,
                            color: "rgba(255,255,255,.72)",
                            fontSize: 9,
                            letterSpacing: "1px",
                        }}
                    >
                        WORK · ABOUT · SKILLS
                    </div>

                    <DeveloperPhoto
                        resume={resume}
                        accent={accent}
                    />
                </div>
            </div>

            {/* IT SERVICES */}
            <div
                style={{
                    background: "#050505",
                    color: "#fff",
                    padding:
                        "21px 38px",
                    borderTop:
                        `1px solid ${accent}20`,
                    borderBottom:
                        `1px solid ${accent}20`,
                }}
            >
                <div
                    style={{
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: "1.3px",
                        color: accent,
                    }}
                >
                    IT SERVICES
                </div>

                <Paragraph
                    style={{
                        color:
                            "rgba(255,255,255,.64)",
                        fontSize: 10,
                        lineHeight: 1.65,
                        maxWidth: 700,
                        marginTop: 8,
                        marginBottom: 0,
                    }}
                >
                    {resume.professionalSummary ||
                        "Designing interfaces, systems and digital products that are simple to use and easy to maintain."}
                </Paragraph>
            </div>

            {/* ABOUT */}
            {sections.about && (
                <div
                    style={{
                        padding:
                            "54px 42px",
                        background: "#E9E9E9",
                        color: "#1B1F22",
                        textAlign: "center",
                    }}
                >
                    <DeveloperSectionTitle
                        title="ABOUT ME"
                        accent="#111"
                    />

                    <Paragraph
                        style={{
                            color: "#6B7479",
                            fontSize: 10,
                            lineHeight: 1.8,
                            maxWidth: 600,
                            margin:
                                "0 auto",
                        }}
                    >
                        {resume.professionalSummary ||
                            "Professional bio goes here."}
                    </Paragraph>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3,1fr)",
                            gap: 18,
                            maxWidth: 700,
                            margin:
                                "30px auto 0",
                            textAlign: "left",
                        }}
                    >
                        <DeveloperMiniBlock
                            title="DESIGN"
                            accent={accent}
                            text="Interfaces, systems and clear visual hierarchy."
                        />
                        <DeveloperMiniBlock
                            title="DEVELOPMENT"
                            accent={accent}
                            text="React, Next.js and modern web architecture."
                        />
                        <DeveloperMiniBlock
                            title="EXPERIENCE"
                            accent={accent}
                            text="Building products that feel fast and intentional."
                        />
                    </div>
                </div>
            )}

            {/* SKILLS */}
            {sections.skills && (
                <div
                    style={{
                        padding:
                            "48px 42px 56px",
                        background: "#E9E9E9",
                        color: "#1B1F22",
                    }}
                >
                    <DeveloperSectionTitle
                        title="SKILLS"
                        accent="#111"
                    />

                    <div
                        style={{
                            maxWidth: 690,
                            margin: "0 auto",
                        }}
                    >
                        <Text
                            style={{
                                color: "#444",
                                fontSize: 10,
                                fontWeight: 850,
                                letterSpacing: "1px",
                            }}
                        >
                            USING NOW:
                        </Text>

                        <TechGrid
                            skills={skills.slice(
                                0,
                                8
                            )}
                            accent={accent}
                        />

                        {skills.length > 8 && (
                            <>
                                <Text
                                    style={{
                                        color: "#444",
                                        fontSize: 10,
                                        fontWeight: 850,
                                        letterSpacing: "1px",
                                        display: "block",
                                        marginTop: 24,
                                    }}
                                >
                                    LEARNING:
                                </Text>

                                <TechGrid
                                    skills={skills.slice(
                                        8,
                                        16
                                    )}
                                    accent={accent}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* EXPERIENCE */}
            {sections.experience &&
                experience.length > 0 && (
                    <div
                        style={{
                            background:
                                "#050505",
                            color: "#fff",
                            padding:
                                "48px 42px",
                        }}
                    >
                        <DeveloperSectionTitle
                            title="EXPERIENCE"
                            accent={accent}
                            light
                        />

                        <div
                            style={{
                                maxWidth: 720,
                                margin: "0 auto",
                            }}
                        >
                            {experience.map(
                                (item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding:
                                                "17px 0",
                                            borderBottom:
                                                "1px solid rgba(255,255,255,.10)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: accent,
                                                fontSize: 10,
                                                fontWeight: 850,
                                            }}
                                        >
                                            {item.from || ""}
                                            {" — "}
                                            {item.present
                                                ? "Present"
                                                : item.to || ""}
                                        </div>

                                        <Text
                                            strong
                                            style={{
                                                color: "#fff",
                                                display: "block",
                                                marginTop: 5,
                                            }}
                                        >
                                            {item.position ||
                                                "Position"}
                                        </Text>

                                        <div
                                            style={{
                                                color:
                                                    "rgba(255,255,255,.56)",
                                                marginTop: 3,
                                                fontSize: 11,
                                            }}
                                        >
                                            {item.company ||
                                                "Company"}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

            {/* PROJECTS */}
            {sections.projects && (
                <div
                    style={{
                        background:
                            "#101010",
                        padding:
                            "48px 42px",
                    }}
                >
                    <DeveloperSectionTitle
                        title="PROJECTS"
                        accent={accent}
                        light
                    />

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(220px,1fr))",
                            gap: 12,
                        }}
                    >
                        {(projects.length
                            ? projects
                            : [{}, {}, {}]
                        )
                            .slice(0, 6)
                            .map(
                                (project, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            minHeight: 150,
                                            padding: 18,
                                            background:
                                                "#171717",
                                            border:
                                                "1px solid rgba(255,255,255,.08)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: accent,
                                                fontSize: 9,
                                                fontWeight: 850,
                                            }}
                                        >
                                            PROJECT_{String(
                                                index + 1
                                            ).padStart(2, "0")}
                                        </div>

                                        <Text
                                            strong
                                            style={{
                                                color: "#fff",
                                                display:
                                                    "block",
                                                marginTop: 10,
                                                fontSize: 15,
                                            }}
                                        >
                                            {project.name ||
                                                "Your project"}
                                        </Text>

                                        <Paragraph
                                            style={{
                                                color:
                                                    "rgba(255,255,255,.56)",
                                                fontSize: 10,
                                                lineHeight: 1.65,
                                                marginTop: 7,
                                            }}
                                        >
                                            {project.description ||
                                                "Project description will appear here."}
                                        </Paragraph>
                                    </div>
                                )
                            )}
                    </div>
                </div>
            )}

            {/* CONTACT */}
            {sections.contact && (
                <div
                    style={{
                        padding:
                            "38px 42px",
                        background:
                            "#050505",
                        color: "#fff",
                        borderTop:
                            `2px solid ${accent}`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            gap: 18,
                            alignItems:
                                "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <Text
                                style={{
                                    color: accent,
                                    fontSize: 10,
                                    fontWeight: 850,
                                }}
                            >
                                CONTACT
                            </Text>

                            <div
                                style={{
                                    marginTop: 7,
                                    fontWeight: 750,
                                }}
                            >
                                {info.email ||
                                    "Add email to your resume"}
                            </div>
                        </div>

                        <UserOutlined
                            style={{
                                fontSize: 30,
                                color: accent,
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function DeveloperPhoto({
    resume,
    accent,
}) {
    const photo =
        resume.personalInfo?.profilePhoto ||
        resume.personalInfo?.avatar ||
        "";

    return (
        <div
            className="dev-pulse"
            style={{
                width: "72%",
                maxWidth: 340,
                height: 285,
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
            }}
        >
            {photo ? (
                <img
                    src={photo}
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        maskImage:
                            "linear-gradient(to top, transparent 0%, black 14%, black 100%)",
                    }}
                />
            ) : (
                <div
                    style={{
                        width: 170,
                        height: 240,
                        borderRadius: 18,
                        background:
                            `linear-gradient(160deg, ${accent}, #E5EEF1)`,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 900,
                        fontSize: 52,
                        color: "#111",
                    }}
                >
                    {(
                        resume.personalInfo?.firstName ||
                        "Y"
                    )
                        .charAt(0)
                        .toUpperCase()}
                </div>
            )}
        </div>
    );
}

function DeveloperSectionTitle({
    title,
    accent,
    light = false,
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent:
                    "center",
                marginBottom: 24,
            }}
        >
            <div
                style={{
                    border:
                        `2px solid ${accent
                        }`,
                    color:
                        light
                            ? "#fff"
                            : "#111",
                    padding:
                        "8px 16px",
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing:
                        "2.2px",
                }}
            >
                {title}
            </div>
        </div>
    );
}

function DeveloperMiniBlock({
    title,
    accent,
    text,
}) {
    return (
        <div>
            <div
                style={{
                    color: accent,
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing:
                        "1px",
                    marginBottom: 5,
                }}
            >
                {title}
            </div>

            <div
                style={{
                    color: "#727B80",
                    fontSize: 9,
                    lineHeight: 1.6,
                }}
            >
                {text}
            </div>
        </div>
    );
}

function TechGrid({
    skills,
    accent,
}) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(4, minmax(60px,1fr))",
                gap: 14,
                marginTop: 14,
            }}
        >
            {skills.map(
                (skill, index) => (
                    <div
                        key={index}
                        style={{
                            minHeight: 60,
                            display: "grid",
                            placeItems: "center",
                            gap: 4,
                            padding: 7,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 33,
                                height: 33,
                                borderRadius: 8,
                                display: "grid",
                                placeItems: "center",
                                border:
                                    `2px solid ${accent}55`,
                                color: accent,
                                fontWeight: 900,
                                fontSize: 12,
                            }}
                        >
                            {getSkillName(
                                skill
                            )
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div
                            style={{
                                fontSize: 8,
                                color: "#5E676B",
                                fontWeight: 750,
                            }}
                        >
                            {getSkillName(
                                skill
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

/* ============================================================
   4. CASE STUDY
   ============================================================ */

function CaseStudyTemplate({
    resume,
    theme,
    accent,
    sections,
}) {
    const info = resume.personalInfo || {};
    const projects = resume.projects || [];
    const social = resume.socialLinks || {};
    const experience = resume.workExperience || [];

    const fullName =
        `${info.firstName || ""} ${info.lastName || ""
            }`.trim() || "Your Name";

    const cases =
        projects.length > 0
            ? projects
            : [
                {
                    name: "Work name here",
                    description:
                        "Case study description will appear here.",
                },
                {
                    name: "Work name here",
                    description:
                        "A second project story can be presented here.",
                },
                {
                    name: "Work name here",
                    description:
                        "Another project story can be presented here.",
                },
            ];

    return (
        <div
            style={{
                minHeight: 920,
                background: "#FFFFFF",
                color: "#151515",
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
        >
            <style>{`
        @keyframes caseFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .case-float {
          animation: caseFloat 5.5s ease-in-out infinite;
        }
      `}</style>

            {/* NAV */}
            <div
                style={{
                    background: "#050505",
                    color: "#fff",
                    padding: "17px 34px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                }}
            >
                <div
                    style={{
                        fontWeight: 900,
                        fontSize: 13,
                    }}
                >
                    {fullName
                        .split(" ")
                        .map((part) =>
                            part.charAt(0)
                        )
                        .join("")
                        .slice(0, 3)}
                </div>

                <Space
                    wrap
                    size={18}
                    style={{
                        fontSize: 9,
                        color:
                            "rgba(255,255,255,.78)",
                    }}
                >
                    <a
                        href="#case-studies"
                        style={{
                            color: "inherit",
                        }}
                    >
                        CASE STUDIES
                    </a>
                    <a
                        href="#case-about"
                        style={{
                            color: "inherit",
                        }}
                    >
                        ABOUT
                    </a>
                    <a
                        href="#case-contact"
                        style={{
                            color: "inherit",
                        }}
                    >
                        LET’S TALK
                    </a>
                </Space>

                <div
                    style={{
                        width: 65,
                        height: 18,
                        background: accent,
                        color: "#111",
                        borderRadius: 999,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 7,
                        fontWeight: 900,
                    }}
                >
                    CONTACT
                </div>
            </div>

            {/* HERO */}
            <div
                style={{
                    background: "#050505",
                    color: "#fff",
                    padding:
                        "48px 42px 42px",
                    display: "grid",
                    gridTemplateColumns:
                        "1.1fr .9fr",
                    gap: 30,
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <div>
                    <Text
                        style={{
                            color:
                                "rgba(255,255,255,.50)",
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing:
                                "1.1px",
                        }}
                    >
                        PERSONAL BRAND
                    </Text>

                    <Title
                        style={{
                            color: "#fff",
                            fontSize:
                                "clamp(40px,6vw,68px)",
                            lineHeight: 1,
                            margin:
                                "10px 0 14px",
                            letterSpacing: "-2.7px",
                        }}
                    >
                        {fullName}
                    </Title>

                    <Text
                        style={{
                            color: accent,
                            fontWeight: 800,
                        }}
                    >
                        {info.professionalTitle ||
                            "Creative Developer"}
                    </Text>

                    <Paragraph
                        style={{
                            color:
                                "rgba(255,255,255,.66)",
                            maxWidth: 600,
                            lineHeight: 1.75,
                            marginTop: 15,
                        }}
                    >
                        {resume.professionalSummary ||
                            "I build products, systems and stories that make complex ideas feel simple."}
                    </Paragraph>

                    <Button
                        href="#case-studies"
                        style={{
                            background: accent,
                            borderColor: accent,
                            color: "#111",
                            borderRadius: 999,
                            fontWeight: 900,
                        }}
                    >
                        Let’s get started →
                    </Button>
                </div>

                <div
                    className="case-float"
                    style={{
                        display: "flex",
                        justifyContent:
                            "center",
                    }}
                >
                    <CasePhoto
                        photo={
                            info.profilePhoto ||
                            info.avatar ||
                            ""
                        }
                        accent={accent}
                    />
                </div>
            </div>

            {/* BRAND LOGOS */}
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-around",
                    alignItems: "center",
                    gap: 18,
                    padding:
                        "18px 30px",
                    flexWrap: "wrap",
                    borderBottom:
                        "1px solid #ECECEC",
                    color: "#8A8A8A",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing:
                        "1.4px",
                }}
            >
                <span>NETFLIX</span>
                <span>VERCEL</span>
                <span>NIKE</span>
                <span>STRIPE</span>
                <span>FIGMA</span>
            </div>

            {/* CASE STUDIES */}
            {sections.projects && (
                <div
                    id="case-studies"
                    style={{
                        padding:
                            "54px 42px 66px",
                        background: "#FFFFFF",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 600,
                            margin:
                                "0 auto 34px",
                            textAlign: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "#999",
                                fontSize: 9,
                                fontWeight: 850,
                                letterSpacing:
                                    "1.4px",
                            }}
                        >
                            CASE STUDIES
                        </Text>

                        <Title
                            style={{
                                color: "#151515",
                                margin:
                                    "8px 0 8px",
                                fontSize: 29,
                            }}
                        >
                            Selected work
                        </Title>

                        <Paragraph
                            style={{
                                color: "#7C8286",
                                fontSize: 10,
                                lineHeight: 1.7,
                            }}
                        >
                            Product stories, experiments
                            and results.
                        </Paragraph>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gap: 36,
                        }}
                    >
                        {cases.slice(0, 5).map(
                            (project, index) => {
                                const right =
                                    index % 2 === 1;

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                right
                                                    ? "flex-end"
                                                    : "flex-start",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width:
                                                    "min(76%, 520px)",
                                                padding: 4,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color: accent,
                                                    fontSize: 8,
                                                    fontWeight: 900,
                                                    marginBottom: 7,
                                                }}
                                            >
                                                {index % 2 === 0
                                                    ? "PITCH"
                                                    : "ATTACK"}
                                            </div>

                                            <Title
                                                level={3}
                                                style={{
                                                    color: "#151515",
                                                    margin:
                                                        "0 0 6px",
                                                    fontSize: 18,
                                                }}
                                            >
                                                {project.name ||
                                                    "Work name here"}
                                            </Title>

                                            <Paragraph
                                                style={{
                                                    color: "#7A7F83",
                                                    fontSize: 10,
                                                    lineHeight: 1.75,
                                                    maxWidth: 430,
                                                }}
                                            >
                                                {project.description ||
                                                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
                                            </Paragraph>

                                            <Button
                                                href={
                                                    project.link
                                                        ? normalizeLink(
                                                            project.link
                                                        )
                                                        : undefined
                                                }
                                                target={
                                                    project.link
                                                        ? "_blank"
                                                        : undefined
                                                }
                                                rel={
                                                    project.link
                                                        ? "noreferrer"
                                                        : undefined
                                                }
                                                style={{
                                                    marginTop: 3,
                                                    borderRadius: 999,
                                                    background: accent,
                                                    borderColor: accent,
                                                    color: "#111",
                                                    fontWeight: 900,
                                                    fontSize: 9,
                                                }}
                                                size="small"
                                            >
                                                View case study →
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            )}

            {/* ABOUT */}
            {sections.about && (
                <div
                    id="case-about"
                    style={{
                        padding:
                            "55px 42px",
                        background:
                            "#F7F7F7",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: 28,
                            alignItems: "start",
                        }}
                    >
                        <div>
                            <Text
                                style={{
                                    color: "#999",
                                    fontSize: 9,
                                    fontWeight: 900,
                                    letterSpacing:
                                        "1.3px",
                                }}
                            >
                                ABOUT
                            </Text>

                            <Title
                                style={{
                                    color: "#151515",
                                    fontSize: 28,
                                    marginTop: 8,
                                }}
                            >
                                The work should speak.
                            </Title>
                        </div>

                        <Paragraph
                            style={{
                                color: "#70777B",
                                lineHeight: 1.8,
                                fontSize: 11,
                                margin: 0,
                            }}
                        >
                            {resume.professionalSummary ||
                                "A focused story of craft, thinking and execution."}
                        </Paragraph>
                    </div>
                </div>
            )}

            {/* EXPERIENCE */}
            {sections.experience &&
                experience.length > 0 && (
                    <div
                        style={{
                            padding:
                                "48px 42px",
                            background:
                                "#FFFFFF",
                        }}
                    >
                        <Text
                            style={{
                                color: "#999",
                                fontSize: 9,
                                fontWeight: 900,
                                letterSpacing:
                                    "1.3px",
                            }}
                        >
                            RECENT EXPERIENCE
                        </Text>

                        <div
                            style={{
                                marginTop: 18,
                                display: "grid",
                                gap: 12,
                            }}
                        >
                            {experience
                                .slice(0, 4)
                                .map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding:
                                                    "14px 0",
                                                borderBottom:
                                                    "1px solid #ECECEC",
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                gap: 16,
                                            }}
                                        >
                                            <div>
                                                <Text
                                                    strong
                                                    style={{
                                                        color: "#151515",
                                                    }}
                                                >
                                                    {item.position ||
                                                        "Position"}
                                                </Text>
                                                <div
                                                    style={{
                                                        color: accent,
                                                        fontSize: 10,
                                                        marginTop: 3,
                                                    }}
                                                >
                                                    {item.company ||
                                                        "Company"}
                                                </div>
                                            </div>

                                            <Text
                                                style={{
                                                    color: "#90979B",
                                                    fontSize: 9,
                                                }}
                                            >
                                                {item.from || ""}
                                                {" — "}
                                                {item.present
                                                    ? "Present"
                                                    : item.to || ""}
                                            </Text>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                )}

            {/* CONTACT */}
            {sections.contact && (
                <div
                    id="case-contact"
                    style={{
                        background: accent,
                        padding:
                            "36px 42px",
                        color: "#111",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 16,
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: 9,
                                    fontWeight: 900,
                                    letterSpacing:
                                        "1.2px",
                                }}
                            >
                                LET’S TALK
                            </div>

                            <div
                                style={{
                                    fontSize: 21,
                                    fontWeight: 900,
                                    marginTop: 4,
                                }}
                            >
                                {info.email ||
                                    "Add your email"}
                            </div>
                        </div>

                        <Space wrap>
                            {social.github && (
                                <Button
                                    href={normalizeLink(
                                        social.github
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        borderRadius: 999,
                                    }}
                                >
                                    GitHub
                                </Button>
                            )}

                            {social.linkedin && (
                                <Button
                                    href={normalizeLink(
                                        social.linkedin
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        borderRadius: 999,
                                    }}
                                >
                                    LinkedIn
                                </Button>
                            )}
                        </Space>
                    </div>
                </div>
            )}
        </div>
    );
}

function CasePhoto({
    photo,
    accent,
}) {
    return (
        <div
            style={{
                width: 230,
                height: 250,
                position: "relative",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius:
                        "46% 46% 42% 42%",
                    background:
                        "radial-gradient(circle at 50% 30%, #71808a 0%, #263038 45%, #0A0A0A 70%)",
                }}
            />

            <div
                style={{
                    position:
                        "absolute",
                    width: 160,
                    height: 160,
                    borderRadius:
                        "50%",
                    right: 16,
                    top: 10,
                    border:
                        `1px solid ${accent}44`,
                    boxShadow:
                        `0 0 60px ${accent}1A`,
                }}
            />

            {photo ? (
                <img
                    src={photo}
                    alt=""
                    style={{
                        position:
                            "absolute",
                        inset: 5,
                        width:
                            "calc(100% - 10px)",
                        height:
                            "calc(100% - 10px)",
                        objectFit:
                            "cover",
                        objectPosition:
                            "center top",
                        borderRadius:
                            "46% 46% 42% 42%",
                        mixBlendMode:
                            "normal",
                    }}
                />
            ) : (
                <div
                    style={{
                        position:
                            "absolute",
                        inset: 5,
                        borderRadius:
                            "46% 46% 42% 42%",
                        display: "grid",
                        placeItems:
                            "center",
                        fontSize: 56,
                        fontWeight: 900,
                        color: accent,
                    }}
                >
                    A
                </div>
            )}

            <div
                style={{
                    position: "absolute",
                    width: 120,
                    height: 120,
                    border:
                        `20px solid ${accent}`,
                    borderRadius:
                        "44% 52% 42% 48%",
                    right: -10,
                    bottom: -12,
                    opacity: .11,
                    transform:
                        "rotate(-18deg)",
                }}
            />
        </div>
    );
}

function ModernHeroImage({
    resume,
    fallbackColor,
}) {
    const photo =
        resume.personalInfo?.profilePhoto ||
        resume.personalInfo?.avatar ||
        "";

    return (
        <div
            style={{
                display: "flex",
                justifyContent:
                    "center",
            }}
        >
            <div
                style={{
                    width: 230,
                    height: 250,
                    position: "relative",
                    background:
                        "rgba(255,255,255,.10)",
                    border:
                        "1px solid rgba(255,255,255,.20)",
                    overflow: "hidden",
                }}
            >
                {photo ? (
                    <img
                        src={photo}
                        alt=""
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition:
                                "center top",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            color: "#fff",
                            fontSize: 60,
                            fontWeight: 900,
                        }}
                    >
                        {(
                            resume.personalInfo
                                ?.firstName ||
                            "Y"
                        )
                            .charAt(0)
                            .toUpperCase()}
                    </div>
                )}

                <div
                    style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        right: 12,
                        padding: 9,
                        background:
                            "rgba(0,0,0,.32)",
                        backdropFilter:
                            "blur(10px)",
                        fontSize: 9,
                        fontWeight: 850,
                        color: "#fff",
                    }}
                >
                    BUILT WITH CEOBACE
                </div>
            </div>
        </div>
    );
}

function ModernInfoRow({
    label,
    value,
    accent,
    dark,
}) {
    return (
        <div
            style={{
                padding:
                    "11px 0",
                borderBottom:
                    `1px solid ${dark
                        ? "rgba(255,255,255,.10)"
                        : "rgba(0,0,0,.08)"
                    }`,
            }}
        >
            <div
                style={{
                    color: accent,
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing:
                        ".8px",
                    textTransform:
                        "uppercase",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    color: dark
                        ? "#E8EEF0"
                        : "#1E2427",
                    fontSize: 13,
                    marginTop: 3,
                }}
            >
                {value}
            </div>
        </div>
    );
}

function ModernHeading({
    title,
    accent,
    dark,
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems:
                    "center",
                gap: 10,
                marginBottom: 20,
            }}
        >
            <span
                style={{
                    width: 30,
                    height: 3,
                    background: accent,
                    display: "inline-block",
                }}
            />

            <Title
                level={3}
                style={{
                    color: dark
                        ? "#fff"
                        : "#161A1D",
                    margin: 0,
                    fontSize: 22,
                }}
            >
                {title}
            </Title>
        </div>
    );
}
