import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Steps,
  Card,
  Upload,
  message,
  ConfigProvider,
  Segmented,
  Checkbox,
  Avatar,
  Divider,
  theme,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UploadOutlined,
  GlobalOutlined,
  BulbOutlined,
  BgColorsOutlined,
  LinkOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TRANSLATIONS, ANTD_LOCALES } from "../../utils/themeAndI18n";

const API_URL = "https://6a7700dd63e9caf860c33d99.mockapi.io/users";

const PALETTE = {
  sageGreen: "#687864",
  deepSteelBlue: "#31708E",
  slateBlue: "#5085A5",
  skyBlue: "#8FC1E3",
  iceLight: "#F7F9FB",
};

const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@([a-zA-Z0-9-]+\.)+(com|uz|ru|org|net|io|dev|co\.uk|edu|gov)$/i;

// Kengaytirilgan barcha kasb va ko'nikmalar ro'yxati
const ALL_SKILLS = [
  // Marketing, Media & SMM
  "Digital Marketing", "SMM (Social Media Marketing)", "Targeting / Targeted Ads", 
  "Content Making / Mobilografiya", "Video Editing (Premier Pro / CapCut)", 
  "Copywriting", "SEO / SEM", "Brand Management", "PR & Communications",
  "Influencer Marketing", "Growth Hacking", "Email Marketing",

  // Ta'lim & Metodologiya
  "O'qituvchi / Educator", "Mentorship", "Curriculum Development", 
  "EdTech Specialist", "Online Course Instructor",

  // Dizayn & Kreativ
  "UI/UX Design", "Graphic Design", "Motion Design", "3D Modeling", 
  "Figma", "Photoshop", "Illustrator", "Brand Identity",

  // IT & Dasturlash
  "JavaScript", "TypeScript", "React.js", "Vue.js", "Angular", "Next.js", 
  "Node.js", "Express.js", "NestJS", "Python", "Django", "FastAPI", 
  "Java", "Spring Boot", "C#", ".NET", "PHP", "Laravel", "Go (Golang)", 
  "Flutter", "React Native", "Swift", "Kotlin", "SQL", "PostgreSQL", 
  "MongoDB", "Docker", "DevOps", "QA Automation", "Machine Learning",

  // Biznes & Boshqaruv
  "Product Management", "Project Management", "Business Analysis", 
  "Sales / B2B Sales", "Customer Support (CS)", "HR / Talent Acquisition", 
  "Financial Modeling", "Legal & Compliance"
];

const STARTUP_ROLES = [
  "CTO (Chief Technology Officer)",
  "Co-Founder (Texnik / Biznes Hamkor)",
  "CEO / Business Lead",
  "CMO / Marketing Director",
  "CFO / Moliya Mutaxassisi",
  "Sotuv Menejeri (Sales Manager / B2B)",
  "Product Manager (PM)",
  "Product Owner (PO)",
  "Project Manager",
  "Growth Hacker / Marketing Specialist",
  "SMM & Content Manager",
  "Business Analyst (Biznes Tahlilchi)",
  "Lead Software Engineer",
  "AI / Machine Learning Engineer",
  "Full-Stack Dasturchi",
  "Frontend Dasturchi",
  "Backend Dasturchi",
  "Mobile App Dasturchi (iOS/Android)",
  "UI/UX Designer",
  "DevOps Engineer",
  "Data Scientist / Data Engineer",
  "QA Engineer (Tester)",
  "HR / Talent Acquisition Manager",
  "Legal & Compliance Specialist",
  "Copywriter & PR Specialist"
];

const MINIMAL_AVATARS = [
  "https://api.dicebear.com/7.x/miniavs/svg?seed=Felix",
  "https://api.dicebear.com/7.x/miniavs/svg?seed=Avery",
  "https://api.dicebear.com/7.x/miniavs/svg?seed=Jordan",
  "https://api.dicebear.com/7.x/miniavs/svg?seed=Taylor",
];

const Auth = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [lang, setLang] = useState(localStorage.getItem("app_lang") || "uz");
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("app_dark_mode") || "true")
  );
  const [designStyle, setDesignStyle] = useState(
    localStorage.getItem("app_design_style") || "standard"
  );

  const [isLogin, setIsLogin] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(MINIMAL_AVATARS[0]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [lookingForSkills, setLookingForSkills] = useState([]);
  const [hasRealProject, setHasRealProject] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("job_seeker");

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  const fetchUsers = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setExistingUsers(data);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem("app_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("app_dark_mode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("app_design_style", designStyle);
  }, [designStyle]);

  useEffect(() => {
    if (designStyle !== "multi" && designStyle !== "creative") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dotCount = designStyle === "multi" ? 90 : 50;
    const dots = Array.from({ length: dotCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: designStyle === "multi" ? 2.5 : 2,
    }));

    let mouse = { x: null, y: null, radius: designStyle === "multi" ? 180 : 140 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

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

        if (mouse.x && mouse.y) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(143, 193, 227, ${1 - dist / mouse.radius})`;
            ctx.lineWidth = designStyle === "multi" ? 1.2 : 0.8;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [designStyle, isDarkMode]);

  const handleFileUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error(t.errOnlyImg);
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target.result);
      message.success(t.msgImgSuccess);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleNextStep = async () => {
    try {
      if (currentStep === 0) {
        const values = await form.validateFields(["email", "password"]);
        const isEmailExist = existingUsers.some(
          (u) => u.email && u.email.toLowerCase() === values.email.toLowerCase()
        );
        if (isEmailExist) {
          message.error(t.errEmailExist);
          return;
        }
      } else if (currentStep === 1) {
        await form.validateFields(["username", "fullName"]);
      } else if (currentStep === 2) {
        if (selectedRole === "job_seeker") {
          await form.validateFields(["userType", "primaryGoal", "experienceYears"]);
        } else if (selectedRole === "recruiter") {
          await form.validateFields(["userType", "primaryGoal", "companyName", "companyBio"]);
        } else if (selectedRole === "co_founder") {
          await form.validateFields(["userType", "primaryGoal", "startupName", "startupBio", "startupStage"]);
        }
      } else if (currentStep === 3) {
        if (selectedRole === "job_seeker" && selectedSkills.length === 0) {
          message.error(t.errSelectSkill);
          return;
        }
      }
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      message.error(t.errFillAll);
    }
  };

  const onFinishLogin = (values) => {
    fetch(`${API_URL}?email=${values.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && data[0].password === values.password) {
          localStorage.setItem("currentUser", JSON.stringify(data[0]));
          message.success(t.msgLoginSuccess);
          navigate("/feed");
          window.location.reload();
        } else {
          message.error(t.errAuthFailed);
        }
      });
  };

  const getActiveFields = () => {
    const common = ["email", "password", "username", "fullName", "userType", "primaryGoal"];
    if (selectedRole === "job_seeker") {
      return [...common, "experienceYears"];
    } else if (selectedRole === "recruiter") {
      return [...common, "companyName", "companyBio"];
    } else if (selectedRole === "co_founder") {
      return [...common, "startupName", "startupBio", "startupStage"];
    }
    return common;
  };

  const onFinishRegister = () => {
    if (lookingForSkills.length === 0) {
      message.error("Iltimos, izlayotgan yo'nalishingizni tanlang!");
      return;
    }

    const activeFields = getActiveFields();

    form
      .validateFields(activeFields)
      .then(() => {
        const values = form.getFieldsValue(true);

        const isEmailExist = existingUsers.some(
          (u) => u.email && u.email.toLowerCase() === (values.email || "").toLowerCase()
        );

        if (isEmailExist) {
          message.error(t.errEmailExist);
          return;
        }

        const newUser = {
          ...values,
          avatar: avatarUrl,
          skills: selectedSkills,
          lookingFor: lookingForSkills,
          hasRealProject,
          isOnboarded: true,
        };

        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        })
          .then((res) => res.json())
          .then((data) => {
            localStorage.setItem("currentUser", JSON.stringify(data));
            message.success(t.msgRegSuccess);
            navigate("/feed");
            window.location.reload();
          });
      })
      .catch(() => {
        message.error(t.errFillAll);
      });
  };

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
          colorBgContainer: isDarkMode ? "#1B3B4B" : PALETTE.iceLight,
          colorBgElevated: isDarkMode ? "#132D3A" : "#FFFFFF",
          colorTextBase: isDarkMode ? PALETTE.iceLight : PALETTE.deepSteelBlue,
          colorBorder: isDarkMode ? PALETTE.slateBlue : "#D9D9D9",
          borderRadius: getBorderRadius(),
        },
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          padding: "30px 15px",
          background: isDarkMode ? "#112530" : "#EBF2F7",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {(designStyle === "multi" || designStyle === "creative") && (
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 0 }}
          />
        )}

        {/* TOP PANEL */}
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto 20px auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: isDarkMode ? "#1B3B4B" : "#FFFFFF",
            padding: "10px 20px",
            borderRadius: getBorderRadius(),
            position: "relative",
            zIndex: 1,
            border: `1px solid ${PALETTE.slateBlue}`,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <GlobalOutlined style={{ color: PALETTE.skyBlue }} />
            <Segmented
              options={[
                { label: "UZ", value: "uz" },
                { label: "RU", value: "ru" },
                { label: "EN", value: "en" },
              ]}
              value={lang}
              onChange={setLang}
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <BgColorsOutlined style={{ color: PALETTE.sageGreen }} />
            <Select
              value={designStyle}
              onChange={setDesignStyle}
              style={{ width: 110 }}
              options={[
                { value: "standard", label: "Standard" },
                { value: "minimal", label: "Minimal" },
                { value: "multi", label: "Multi" },
                { value: "creative", label: "Creative" },
              ]}
            />
            <Button icon={<BulbOutlined />} onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? "Dark" : "Light"}
            </Button>
          </div>
        </div>

        {/* FORM CARD */}
        <Card
          style={{
            maxWidth: 700,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            borderRadius: getBorderRadius(),
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            background: isDarkMode ? "#1B3B4B" : "#FFFFFF",
            borderLeft: designStyle === "creative" ? `8px solid ${PALETTE.deepSteelBlue}` : undefined,
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 20, color: isDarkMode ? PALETTE.iceLight : PALETTE.deepSteelBlue }}>
            {isLogin ? t.loginTitle : t.registerTitle}
          </h2>

          {!isLogin && (
            <div style={{ marginBottom: 30 }}>
              <Steps
                current={currentStep}
                responsive={false}
                labelPlacement="vertical"
                items={[
                  { title: t.step1 },
                  { title: t.step2 },
                  { title: t.step3 },
                  { title: "Profil va Ko'nikmalar" },
                  { title: "Qidiruv (Target)" },
                ]}
              />
            </div>
          )}

          <Form
            form={form}
            layout="vertical"
            preserve={true}
            onFinish={isLogin ? onFinishLogin : null}
            style={{ maxWidth: 450, margin: "0 auto" }}
          >
            {isLogin ? (
              <>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: t.emailReq },
                    { pattern: STRICT_EMAIL_REGEX, message: t.errEmailFormat },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder={t.emailPlaceholder} size="large" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: t.passReq }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder={t.passPlaceholder} size="large" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block size="large" style={{ background: PALETTE.deepSteelBlue, borderColor: PALETTE.deepSteelBlue }}>
                  {t.loginBtn}
                </Button>
              </>
            ) : (
              <>
                {/* 1-QADAM */}
                {currentStep === 0 && (
                  <>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: t.emailReq },
                        {
                          validator(_, value) {
                            if (!value) return Promise.resolve();
                            if (/\s/.test(value) || /\.\./.test(value) || !STRICT_EMAIL_REGEX.test(value)) {
                              return Promise.reject(new Error(t.errEmailFormat));
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder={t.emailPlaceholder} size="large" />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: t.passReq },
                        {
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: t.errPassWeak,
                        },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder={t.passPlaceholder} size="large" />
                    </Form.Item>
                  </>
                )}

                {/* 2-QADAM */}
                {currentStep === 1 && (
                  <>
                    <Form.Item
                      name="username"
                      rules={[
                        { required: true, message: t.errUsernameReq },
                        { min: 3, max: 30, message: t.errUsernameLength },
                        {
                          pattern: /^[a-z0-9_]+$/,
                          message: t.errUsernameFormat,
                        },
                        () => ({
                          validator(_, value) {
                            if (!value || !existingUsers.some((u) => u.username === value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(t.errUsernameTaken));
                          },
                        }),
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder={t.usernamePlaceholder} size="large" />
                    </Form.Item>

                    <Form.Item
                      name="fullName"
                      rules={[
                        { required: true, message: t.errFullNameReq },
                        {
                          pattern: /^[A-Zʻʼ`'-][a-zʻʼ`'-]+ [A-Zʻʼ`'-][a-zʻʼ`'-]+$/,
                          message: t.errFullNameFormat,
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder={t.fullNamePlaceholder} size="large" />
                    </Form.Item>
                  </>
                )}

                {/* 3-QADAM */}
                {currentStep === 2 && (
                  <>
                    <Form.Item
                      name="userType"
                      label={t.selectRole}
                      initialValue="job_seeker"
                      rules={[{ required: true, message: t.selectRole }]}
                    >
                      <Select size="large" onChange={(val) => setSelectedRole(val)}>
                        <Select.Option value="job_seeker">{t.jobSeeker}</Select.Option>
                        <Select.Option value="recruiter">{t.recruiter}</Select.Option>
                        <Select.Option value="co_founder">{t.coFounder}</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="primaryGoal"
                      label={t.primaryGoal}
                      rules={[{ required: true, message: t.primaryGoal }]}
                    >
                      <Input size="large" placeholder={t.goalPlaceholder} />
                    </Form.Item>

                    {selectedRole === "job_seeker" && (
                      <Form.Item
                        name="experienceYears"
                        label={t.devLevel}
                        rules={[{ required: true, message: t.devLevel }]}
                      >
                        <Select size="large" placeholder={t.selectLevel}>
                          <Select.Option value="0-1">0 - 1 year (Junior)</Select.Option>
                          <Select.Option value="1-3">1 - 3 years (Middle)</Select.Option>
                          <Select.Option value="3-5">3 - 5 years (Senior)</Select.Option>
                          <Select.Option value="5+">5+ years (Team Lead / Architect)</Select.Option>
                        </Select>
                      </Form.Item>
                    )}

                    {selectedRole === "recruiter" && (
                      <>
                        <Form.Item
                          name="companyName"
                          label={t.companyName}
                          rules={[{ required: true, message: t.companyName }]}
                        >
                          <Input size="large" placeholder={t.companyNamePlaceholder} />
                        </Form.Item>

                        <Form.Item
                          name="companyBio"
                          label={t.companyBio}
                          rules={[{ required: true, message: t.companyBio }]}
                        >
                          <Input.TextArea rows={2} placeholder={t.companyBioPlaceholder} />
                        </Form.Item>
                      </>
                    )}

                    {selectedRole === "co_founder" && (
                      <>
                        <Form.Item
                          name="startupName"
                          label={t.startupName}
                          rules={[{ required: true, message: t.startupName }]}
                        >
                          <Input size="large" placeholder={t.startupNamePlaceholder} />
                        </Form.Item>

                        <Form.Item
                          name="startupStage"
                          label={t.startupStage}
                          rules={[{ required: true, message: t.startupStage }]}
                        >
                          <Select size="large" placeholder={t.selectStage}>
                            <Select.Option value="idea">Idea Phase</Select.Option>
                            <Select.Option value="mvp">Prototype / MVP ready</Select.Option>
                            <Select.Option value="pre_seed">Pre-Seed / Seed Round</Select.Option>
                            <Select.Option value="growth">Series A+ / Scaling</Select.Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          name="startupBio"
                          label={t.startupBio}
                          rules={[{ required: true, message: t.startupBio }]}
                        >
                          <Input.TextArea rows={2} placeholder={t.startupBioPlaceholder} />
                        </Form.Item>
                      </>
                    )}
                  </>
                )}

                {/* 4-QADAM: SHAXSIY PROFIL VA KO'NIKMALAR */}
                {currentStep === 3 && (
                  <>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                      <p><strong>{t.avatarChoose}</strong></p>
                      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
                        {MINIMAL_AVATARS.map((url, idx) => (
                          <Avatar
                            key={idx}
                            src={url}
                            size={48}
                            style={{
                              cursor: "pointer",
                              border: avatarUrl === url ? `3px solid ${PALETTE.skyBlue}` : "2px solid transparent",
                            }}
                            onClick={() => setAvatarUrl(url)}
                          />
                        ))}
                      </div>

                      <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />}>{t.uploadBtn}</Button>
                      </Upload>
                    </div>

                    {selectedRole === "job_seeker" && (
                      <>
                        <Form.Item name="bio" label={t.bioLabel}>
                          <Input.TextArea rows={2} placeholder={t.bioPlaceholder} />
                        </Form.Item>

                        <Form.Item valuePropName="checked">
                          <Checkbox checked={hasRealProject} onChange={(e) => setHasRealProject(e.target.checked)}>
                            <strong>{t.hasProject}</strong>
                          </Checkbox>
                        </Form.Item>

                        {hasRealProject && (
                          <Form.Item
                            name="projectUrl"
                            label={t.projectUrl}
                            rules={[{ type: "url", message: t.errInvalidUrl }]}
                          >
                            <Input prefix={<LinkOutlined />} placeholder="https://myportfolio.com" size="large" />
                          </Form.Item>
                        )}

                        <Form.Item label="Sizning ko'nikmalaringiz va yo'nalishingiz (Skills / Profession)">
                          <Select
                            mode="tags"
                            size="large"
                            placeholder="Masalan: Marketing, Mobilografiya, O'qituvchi, React..."
                            value={selectedSkills}
                            onChange={setSelectedSkills}
                            style={{ width: "100%" }}
                            tokenSeparators={[',']}
                            options={ALL_SKILLS.map((item) => ({ label: item, value: item }))}
                          />
                        </Form.Item>
                      </>
                    )}

                    {selectedRole === "recruiter" && (
                      <Form.Item
                        name="companyWebsite"
                        label={t.companyWeb}
                        rules={[{ type: "url", message: t.errInvalidUrl }]}
                      >
                        <Input prefix={<LinkOutlined />} placeholder="https://company.com" size="large" />
                      </Form.Item>
                    )}

                    {selectedRole === "co_founder" && (
                      <Form.Item
                        name="startupWebsite"
                        label={t.startupWeb}
                        rules={[{ type: "url", message: t.errInvalidUrl }]}
                      >
                        <Input prefix={<LinkOutlined />} placeholder="https://startup.com" size="large" />
                      </Form.Item>
                    )}
                  </>
                )}

                {/* 5-QADAM: DYNAMIC TARGET / QIDIRUV BO'LIMI */}
                {currentStep === 4 && (
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <SearchOutlined style={{ fontSize: 40, color: PALETTE.deepSteelBlue, marginBottom: 15 }} />

                    {/* JOB SEEKER UCHUN */}
                    {selectedRole === "job_seeker" && (
                      <>
                        <h3 style={{ marginBottom: 5 }}>Qanday loyiha yoki kompaniyalarda ishlamoqchisiz?</h3>
                        <p style={{ color: "#8c8c8c", marginBottom: 20 }}>
                          Sizga mos keladigan vakansiya va startuplarni tavsiya qilishimiz uchun qiziqqan yo'nalishlaringizni tanlang.
                        </p>

                        <Form.Item
                          label="Sizni qaysi soha / loyihalar qiziqtiradi?"
                          required
                        >
                          <Select
                            mode="tags"
                            size="large"
                            placeholder="Masalan: FinTech Startups, AI Projects, Marketing Agency..."
                            value={lookingForSkills}
                            onChange={setLookingForSkills}
                            style={{ width: "100%", textAlign: "left" }}
                            tokenSeparators={[',']}
                            options={[
                              { label: "FinTech Startups", value: "FinTech Startups" },
                              { label: "AI & Machine Learning", value: "AI & Machine Learning" },
                              { label: "EdTech (Ta'lim)", value: "EdTech" },
                              { label: "E-Commerce / Retail", value: "E-Commerce" },
                              { label: "HealthTech / Tibbiyot", value: "HealthTech" },
                              { label: "GameDev / O'yinlar", value: "GameDev" },
                              { label: "Marketing / Digital Agentliklar", value: "Marketing Agency" },
                              { label: "Outsource / Outstaff Kompaniyalar", value: "Outsource Company" },
                            ]}
                          />
                        </Form.Item>
                      </>
                    )}

                    {/* CO-FOUNDER UCHUN */}
                    {selectedRole === "co_founder" && (
                      <>
                        <h3 style={{ marginBottom: 5 }}>Startupingizga qanday hamkorlar kerak?</h3>
                        <p style={{ color: "#8c8c8c", marginBottom: 20 }}>
                          Loyiha muvaffaqiyati uchun qaysi yo'nalishdagi Co-Founder yoki mutaxassislarni izlayapsiz?
                        </p>

                        <Form.Item
                          label="Sizga qanday hamkor / mutaxassislar kerak?"
                          required
                        >
                          <Select
                            mode="tags"
                            size="large"
                            placeholder="Masalan: CMO / Marketing Director, CTO, Lead Frontend..."
                            value={lookingForSkills}
                            onChange={setLookingForSkills}
                            style={{ width: "100%", textAlign: "left" }}
                            tokenSeparators={[',']}
                            options={STARTUP_ROLES.map((item) => ({
                              label: item,
                              value: item,
                            }))}
                          />
                        </Form.Item>
                      </>
                    )}

                    {/* RECRUITER UCHUN */}
                    {selectedRole === "recruiter" && (
                      <>
                        <h3 style={{ marginBottom: 5 }}>Kompaniyangizga qanday kadrlar qidiryapsiz?</h3>
                        <p style={{ color: "#8c8c8c", marginBottom: 20 }}>
                          Ochiq vakansiyalaringiz uchun mos keladigan nomzodlarni topishga yordam beramiz.
                        </p>

                        <Form.Item
                          label="Qaysi pozitsiyalarga xodimlar kerak?"
                          required
                        >
                          <Select
                            mode="tags"
                            size="large"
                            placeholder="Masalan: Senior React Developer, SMM Specialist, Sales Manager..."
                            value={lookingForSkills}
                            onChange={setLookingForSkills}
                            style={{ width: "100%", textAlign: "left" }}
                            tokenSeparators={[',']}
                            options={STARTUP_ROLES.map((item) => ({
                              label: item,
                              value: item,
                            }))}
                          />
                        </Form.Item>
                      </>
                    )}
                  </div>
                )}

                {/* TUGMALAR */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 25 }}>
                  {currentStep > 0 && (
                    <Button onClick={() => setCurrentStep((prev) => prev - 1)} size="large">
                      {t.backBtn}
                    </Button>
                  )}

                  {currentStep < 4 ? (
                    <Button type="primary" onClick={handleNextStep} size="large" style={{ marginLeft: "auto", background: PALETTE.deepSteelBlue, borderColor: PALETTE.deepSteelBlue }}>
                      {t.nextBtn}
                    </Button>
                  ) : (
                    <Button type="primary" onClick={onFinishRegister} size="large" style={{ marginLeft: "auto", background: PALETTE.slateBlue, borderColor: PALETTE.slateBlue }}>
                      {t.registerBtn}
                    </Button>
                  )}
                </div>
              </>
            )}
          </Form>

          <Divider style={{ margin: "20px 0" }} />

          <Button
            type="link"
            block
            onClick={() => {
              setIsLogin(!isLogin);
              setCurrentStep(0);
            }}
            style={{ color: isDarkMode ? PALETTE.skyBlue : PALETTE.deepSteelBlue }}
          >
            {isLogin ? t.noAccount : t.hasAccount}
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default Auth;