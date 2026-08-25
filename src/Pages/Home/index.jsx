import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Avatar,
  Tag,
  Input,
  Empty,
  Button,
  Row,
  Col,
  ConfigProvider,
  theme,
  Typography,
  Space,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  BankOutlined,
  RocketOutlined,
  AimOutlined,
  ClockCircleOutlined,
  SolutionOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { TRANSLATIONS, ANTD_LOCALES } from "../../utils/themeAndI18n";

const { Title, Text } = Typography;

const PALETTE = {
  sageGreen: "#687864",
  deepSteelBlue: "#31708E",
  slateBlue: "#5085A5",
  skyBlue: "#8FC1E3",
  iceLight: "#F7F9FB",
};

const Feed = () => {
  const canvasRef = useRef(null);

  const [lang, setLang] = useState(localStorage.getItem("app_lang") || "uz");
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("app_dark_mode") || "true")
  );
  const [designStyle, setDesignStyle] = useState(
    localStorage.getItem("app_design_style") || "standard"
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  useEffect(() => {
    const syncSettings = () => {
      setLang(localStorage.getItem("app_lang") || "uz");
      setIsDarkMode(JSON.parse(localStorage.getItem("app_dark_mode") || "true"));
      setDesignStyle(localStorage.getItem("app_design_style") || "standard");
    };

    window.addEventListener("storage", syncSettings);
    return () => window.removeEventListener("storage", syncSettings);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(storedUser);

    fetch("https://6a7700dd63e9caf860c33d99.mockapi.io/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const others = data.filter((u) => u.id !== storedUser?.id);
          setUsers(others);
        }
      });
  }, []);

  // Multi/Creative Canvas (Scrollbarni keltirib chiqarmaydi)
  useEffect(() => {
    if (designStyle !== "multi" && designStyle !== "creative") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const dots = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
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

  const getFilteredUsers = () => {
    if (!currentUser) return [];

    return users.filter((user) => {
      let isRoleMatched = false;

      if (currentUser.userType === "recruiter") {
        isRoleMatched = user.userType === "job_seeker";
      } else if (currentUser.userType === "job_seeker") {
        isRoleMatched = user.userType === "recruiter" || user.userType === "co_founder";
      } else if (currentUser.userType === "co_founder") {
        isRoleMatched = user.userType === "job_seeker" || user.userType === "co_founder";
      }

      if (!isRoleMatched) return false;

      const userTargets = currentUser.lookingFor || [];
      let isTargetMatched = false;

      if (userTargets.length === 0) {
        isTargetMatched = true;
      } else {
        isTargetMatched = userTargets.some((target) => {
          const tLower = target.toLowerCase();
          const matchSkill = user.skills?.some((s) => s.toLowerCase().includes(tLower) || tLower.includes(s.toLowerCase()));
          const matchGoal = user.primaryGoal?.toLowerCase().includes(tLower);
          const matchBio = user.bio?.toLowerCase().includes(tLower) || user.companyBio?.toLowerCase().includes(tLower) || user.startupBio?.toLowerCase().includes(tLower);
          const matchLooking = user.lookingFor?.some((l) => l.toLowerCase().includes(tLower));

          return matchSkill || matchGoal || matchBio || matchLooking;
        });
      }

      if (!isTargetMatched) return false;

      const matchSearch =
        !searchText ||
        user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.skills?.some((s) => s.toLowerCase().includes(searchText.toLowerCase()));

      return matchSearch;
    });
  };

  const filteredData = getFilteredUsers();

  const getBorderRadius = () => {
    if (designStyle === "minimal") return 0;
    if (designStyle === "creative") return 14;
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
          colorBorder: isDarkMode ? PALETTE.slateBlue : "#E0E0E0",
          borderRadius: getBorderRadius(),
        },
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          background: isDarkMode ? "#112530" : "#F4F7F9",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* CANVAS BG (FIXED & NO SCROLL) */}
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

        {/* MAIN CONTENT (PADDING TOP DUB-NAVBAR O'TKAZIB YUBORADI) */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            paddingTop: 96, // Fixed Navbar ostiga tushib qolishini oldini oladi
            paddingBottom: 40,
            paddingLeft: 16,
            paddingRight: 16,
            position: "relative",
            zIndex: 1,
            boxSizing: "border-box",
          }}
        >
          {/* HEADER BANNER */}
          <Card
            style={{
              marginBottom: 20,
              borderRadius: getBorderRadius(),
              borderLeft: designStyle === "creative" ? `6px solid ${PALETTE.deepSteelBlue}` : undefined,
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              {t.welcome}, {currentUser?.fullName || "Foydalanuvchi"}!
            </Title>
            <Space style={{ marginTop: 8 }} wrap>
              <Text type="secondary">
                <IdcardOutlined /> Rolingiz: <Tag color="blue">{currentUser?.userType?.toUpperCase()}</Tag>
              </Text>
              <Text type="secondary">
                <AimOutlined /> Target sohalar: <strong>{currentUser?.lookingFor?.join(", ") || "Barchasi"}</strong>
              </Text>
            </Space>
          </Card>

          {/* QIDIRUV PANELI */}
          <div style={{ marginBottom: 20 }}>
            <Input
              prefix={<SearchOutlined style={{ color: PALETTE.slateBlue }} />}
              placeholder="Ism, username yoki ko'nikmalar bo'yicha qidiruv..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              style={{ borderRadius: getBorderRadius() }}
            />
          </div>

          {/* PROFIL KARTALARI RO'YXATI (YONGA CHO'ZILGAN KO'RINISH) */}
          {filteredData.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredData.map((user) => (
                <Card
                  key={user.id}
                  hoverable
                  style={{
                    width: "100%",
                    borderRadius: getBorderRadius(),
                    borderLeft: designStyle === "creative" ? `5px solid ${PALETTE.slateBlue}` : undefined,
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Row gutter={[20, 16]} align="middle">
                    {/* CHAP USTUN: SHAXSIY MA'LUMOTLAR VA TUGMA */}
                    <Col xs={24} md={8} style={{ borderRight: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #F0F0F0", paddingRight: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <Avatar src={user.avatar} size={54} icon={<UserOutlined />} />
                        <div>
                          <Text strong style={{ fontSize: 16, display: "block", lineHeight: "1.2" }}>
                            {user.fullName}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            @{user.username}
                          </Text>
                        </div>
                      </div>

                      <Tag
                        color={
                          user.userType === "job_seeker"
                            ? "green"
                            : user.userType === "recruiter"
                              ? "purple"
                              : "orange"
                        }
                        style={{ marginBottom: 12 }}
                      >
                        {user.userType === "job_seeker"
                          ? "Ish Izlovchi"
                          : user.userType === "recruiter"
                            ? "Ish Beruvchi"
                            : "Co-Founder"}
                      </Tag>

                      <Button
                        type="primary"
                        icon={<SolutionOutlined />}
                        block
                        style={{
                          marginTop: 8,
                          background: PALETTE.deepSteelBlue,
                          borderColor: PALETTE.deepSteelBlue,
                          borderRadius: getBorderRadius(),
                        }}
                      >
                        Bog'lanish / Profil
                      </Button>
                    </Col>

                    {/* O'NG USTUN: DETALLAR VA KO'NIKMALAR (BO'SH JOYLARNI CHO'ZIB TO'LDIRADI) */}
                    <Col xs={24} md={16}>
                      <Space direction="vertical" style={{ width: "100%" }} size={8}>
                        {/* TIZIMLI DETALLAR */}
                        <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
                          {user.companyName && (
                            <Text><BankOutlined /> Kompaniya: <strong>{user.companyName}</strong></Text>
                          )}
                          {user.startupName && (
                            <Text><RocketOutlined /> Startup: <strong>{user.startupName}</strong> ({user.startupStage})</Text>
                          )}
                          {user.experienceYears && (
                            <Text><ClockCircleOutlined /> Tajriba: <strong>{user.experienceYears} yil</strong></Text>
                          )}
                          {user.primaryGoal && (
                            <Text><AimOutlined /> Maqsad: {user.primaryGoal}</Text>
                          )}
                        </div>

                        {/* KO'NIKMALAR */}
                        {user.skills && user.skills.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>
                              Ko'nikmalar:
                            </Text>
                            <Space wrap size={[4, 6]}>
                              {user.skills.map((skill, i) => (
                                <Tag key={i} color="cyan">
                                  {skill}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        )}
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          ) : (
            <Empty
              description="Sizning sohangizga mos keladigan nomzodlar topilmadi"
              style={{ marginTop: 60 }}
            />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Feed;