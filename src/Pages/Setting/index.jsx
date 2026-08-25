import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Select,
    Switch,
    Segmented,
    ConfigProvider,
    theme,
    Typography,
    Space,
    Divider,
    Row,
    Col,
} from "antd";
import {
    GlobalOutlined,
    BulbOutlined,
    SettingOutlined,
    FormatPainterOutlined,
} from "@ant-design/icons";
import { TRANSLATIONS, ANTD_LOCALES } from "../../utils/themeAndI18n";

const { Title, Text } = Typography;

const PALETTE = {
    deepSteelBlue: "#31708E",
    slateBlue: "#5085A5",
    skyBlue: "#8FC1E3",
};

const Settings = () => {
    const canvasRef = useRef(null);

    const [lang, setLang] = useState(localStorage.getItem("app_lang") || "uz");
    const [isDarkMode, setIsDarkMode] = useState(
        JSON.parse(localStorage.getItem("app_dark_mode") || "true")
    );
    const [designStyle, setDesignStyle] = useState(
        localStorage.getItem("app_design_style") || "standard"
    );

    const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

    useEffect(() => {
        if (designStyle !== "multi" && designStyle !== "creative") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (canvas) {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
        };
        window.addEventListener("resize", handleResize);

        const dots = Array.from({ length: 35 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: 2,
        }));

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            dots.forEach((dot) => {
                dot.x += dot.vx;
                dot.y += dot.vy;
                if (dot.x < 0 || dot.x > width) dot.vx *= -1;
                if (dot.y < 0 || dot.y > height) dot.vy *= -1;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = PALETTE.skyBlue;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [designStyle, isDarkMode]);

    const handleLangChange = (val) => {
        setLang(val);
        localStorage.setItem("app_lang", val);
        window.dispatchEvent(new Event("storage"));
    };

    const handleThemeChange = (checked) => {
        setIsDarkMode(checked);
        localStorage.setItem("app_dark_mode", JSON.stringify(checked));
        window.dispatchEvent(new Event("storage"));
    };

    const handleStyleChange = (val) => {
        setDesignStyle(val);
        localStorage.setItem("app_design_style", val);
        window.dispatchEvent(new Event("storage"));
    };

    const getBorderRadius = () => {
        if (designStyle === "minimal") return 0;
        if (designStyle === "creative") return 16;
        return 8;
    };

    return (
        <ConfigProvider
            locale={ANTD_LOCALES[lang] || ANTD_LOCALES.uz}
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: PALETTE.deepSteelBlue,
                    colorBgContainer: isDarkMode ? "#1B3B4B" : "#FFFFFF",
                    borderRadius: getBorderRadius(),
                },
            }}
        >
            <div
                style={{
                    minHeight: "100vh",
                    padding: "96px 20px 40px 20px", // PADDING TOP NAVBAR UCHUN ZARUR BO'SHLIQ QOLDIRADI (96px)
                    background: isDarkMode ? "#112530" : "#F4F7F9",
                    position: "relative",
                    width: "100%",
                    maxWidth: "100vw",
                    overflowX: "hidden",
                    boxSizing: "border-box",
                }}
            >
                {/* CANVAS FON (FIXED REJIMDA SCROLLBAR CHIQARMASTI ISHLAYDI) */}
                {(designStyle === "multi" || designStyle === "creative") && (
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    />
                )}

                <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={2} style={{ margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                            <SettingOutlined style={{ color: PALETTE.slateBlue }} /> {t.settingsTitle || "Sozlamalar"}
                        </Title>
                        <Text type="secondary">
                            {t.settingsSubtitle || "Tizim tili, UI interfeys mavzusi va UX dizayn uslubini o'zingizga moslang."}
                        </Text>
                    </div>

                    <Card
                        bordered={false}
                        style={{
                            boxShadow: isDarkMode ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.06)",
                            borderRadius: getBorderRadius(),
                            borderLeft: designStyle === "creative" ? `6px solid ${PALETTE.deepSteelBlue}` : undefined,
                        }}
                    >
                        {/* TIZIM TILI */}
                        <Row align="middle" justify="space-between" style={{ padding: "12px 0" }}>
                            <Col xs={24} sm={12}>
                                <Space align="center">
                                    <GlobalOutlined style={{ fontSize: 20, color: PALETTE.slateBlue }} />
                                    <div>
                                        <Text strong style={{ display: "block" }}>
                                            {t.langOptionTitle || "Tizim tili (Language)"}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {t.langOptionDesc || "Interfeys matnlari tilini tanlang"}
                                        </Text>
                                    </div>
                                </Space>
                            </Col>
                            <Col xs={24} sm={12} style={{ textAlign: "right", marginTop: 10 }}>
                                <Segmented
                                    size="large"
                                    options={[
                                        { label: "O'zbekcha", value: "uz" },
                                        { label: "Русский", value: "ru" },
                                        { label: "English", value: "en" },
                                    ]}
                                    value={lang}
                                    onChange={handleLangChange}
                                />
                            </Col>
                        </Row>

                        <Divider style={{ margin: "12px 0" }} />

                        {/* DARK / LIGHT MAVZU */}
                        <Row align="middle" justify="space-between" style={{ padding: "12px 0" }}>
                            <Col xs={24} sm={12}>
                                <Space align="center">
                                    <BulbOutlined style={{ fontSize: 20, color: PALETTE.slateBlue }} />
                                    <div>
                                        <Text strong style={{ display: "block" }}>
                                            {t.themeOptionTitle || "Tizim mavzusi (Theme Mode)"}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {t.themeOptionDesc || "Tungi yoki kunduzgi rejimni yoqing"}
                                        </Text>
                                    </div>
                                </Space>
                            </Col>
                            <Col xs={24} sm={12} style={{ textAlign: "right", marginTop: 10 }}>
                                <Switch
                                    checked={isDarkMode}
                                    onChange={handleThemeChange}
                                    checkedChildren="Dark"
                                    unCheckedChildren="Light"
                                    size="large"
                                />
                            </Col>
                        </Row>

                        <Divider style={{ margin: "12px 0" }} />

                        {/* UX DIZAYN SISTEMASI */}
                        <Row align="middle" justify="space-between" style={{ padding: "12px 0" }}>
                            <Col xs={24} sm={12}>
                                <Space align="center">
                                    <FormatPainterOutlined style={{ fontSize: 20, color: PALETTE.slateBlue }} />
                                    <div>
                                        <Text strong style={{ display: "block" }}>
                                            {t.uxStyleTitle || "UX Dizayn Sistemasini Tanlang"}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {t.uxStyleDesc || "4 xil vizual uslubdan birini tanlang"}
                                        </Text>
                                    </div>
                                </Space>
                            </Col>
                            <Col xs={24} sm={12} style={{ textAlign: "right", marginTop: 10 }}>
                                <Select
                                    value={designStyle}
                                    onChange={handleStyleChange}
                                    size="large"
                                    style={{ width: 200 }}
                                    options={[
                                        { value: "standard", label: "Standard UX" },
                                        { value: "minimal", label: "Minimal UX" },
                                        { value: "multi", label: "Multi Dynamic UX" },
                                        { value: "creative", label: "Creative UX" },
                                    ]}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default Settings;