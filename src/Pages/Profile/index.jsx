import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Tag,
  Button,
  Form,
  Input,
  Modal,
  message,
  Descriptions,
  Space,
  Divider,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  GlobalOutlined,
  CodeOutlined,
  RocketOutlined,
  BankOutlined,
  LinkOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TRANSLATIONS } from "../../utils/themeAndI18n";

const API_URL = "https://6a7700dd63e9caf860c33d99.mockapi.io/users";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  const lang = localStorage.getItem("app_lang") || "uz";
  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    message.success("Tizimdan muvaffaqiyatli chiqdingiz");
    navigate("/login");
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Foydalanuvchi topilmadi yoki tizimga kirmagansiz!</h2>
      </div>
    );
  }

  const handleEditSave = () => {
    form.validateFields().then((values) => {
      const updatedUser = { ...user, ...values };

      fetch(`${API_URL}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          localStorage.setItem("currentUser", JSON.stringify(data));
          message.success("Profil muvaffaqiyatli yangilandi!");
          setIsEditModalOpen(false);
        })
        .catch(() => {
          message.error("Xatolik yuz berdi!");
        });
    });
  };

  const openEditModal = () => {
    form.setFieldsValue({
      fullName: user.fullName,
      bio: user.bio,
      primaryGoal: user.primaryGoal,
      companyName: user.companyName,
      startupName: user.startupName,
      projectUrl: user.projectUrl,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div style={{ maxWidth: 800, margin: "100px auto 30px auto", padding: "0 15px" }}>
      <Card
        actions={[
          <Button type="primary" icon={<EditOutlined />} onClick={openEditModal}>
            Profilni Tahrirlash
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Avatar size={100} src={user.avatar} icon={<UserOutlined />} />
          <h2 style={{ marginTop: 15, marginBottom: 5 }}>{user.fullName}</h2>
          <p style={{ color: "#8c8c8c", margin: 0 }}>@{user.username}</p>
          <Tag color="blue" style={{ marginTop: 10, padding: "2px 10px" }}>
            {user.userType === "job_seeker"
              ? t.jobSeeker
              : user.userType === "recruiter"
                ? t.recruiter
                : t.coFounder}
          </Tag>
        </div>

        <Divider />

        <Descriptions title="Asosiy Ma'lumotlar" column={1} bordered>
          <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
            {user.email}
          </Descriptions.Item>

          <Descriptions.Item label={<Space><GlobalOutlined /> Maqsad</Space>}>
            {user.primaryGoal || "Kiritilmagan"}
          </Descriptions.Item>

          {user.userType === "job_seeker" && (
            <Descriptions.Item label={<Space><CodeOutlined /> Tajriba</Space>}>
              {user.experienceYears ? `${user.experienceYears} yil` : "Kiritilmagan"}
            </Descriptions.Item>
          )}

          {user.userType === "recruiter" && (
            <Descriptions.Item label={<Space><BankOutlined /> Kompaniya</Space>}>
              {user.companyName} ({user.companyBio})
            </Descriptions.Item>
          )}

          {user.userType === "co_founder" && (
            <Descriptions.Item label={<Space><RocketOutlined /> Startup</Space>}>
              {user.startupName} - [{user.startupStage}] ({user.startupBio})
            </Descriptions.Item>
          )}

          {user.bio && (
            <Descriptions.Item label="Bio">
              {user.bio}
            </Descriptions.Item>
          )}

          {user.projectUrl && (
            <Descriptions.Item label={<Space><LinkOutlined /> Portfolio / Link</Space>}>
              <a href={user.projectUrl} target="_blank" rel="noreferrer">
                {user.projectUrl}
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        <div>
          <h4>Ko'nikmalar va Yo'nalishlar:</h4>
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <Tag color="cyan" key={index} style={{ marginBottom: 8, fontSize: 14, padding: "4px 8px" }}>
                {skill}
              </Tag>
            ))
          ) : (
            <p style={{ color: "#999" }}>Ko'nikmalar tanlanmagan</p>
          )}
        </div>

        <Divider style={{ margin: "24px 0 16px 0" }} />

        {/* PROFILNING ENG PASTIDAGI LOGOUT TUGMASI (CONFIRMATION BILAN) */}
        <div style={{ textAlign: "center" }}>
          <Popconfirm
            title="Are you sure you want to log out?"
            okText="Yes"
            cancelText="No"
            onConfirm={handleLogout}
            placement="top"
          >
            <Button
              danger
              type="dashed"
              icon={<LogoutOutlined />}
              size="large"
              style={{ borderRadius: 8, width: "100%", maxWidth: 220 }}
            >
              {t.logout || "Logout"}
            </Button>
          </Popconfirm>
        </div>
      </Card>

      {/* TAHRIRLASH MODALI */}
      <Modal
        title="Profil ma'lumotlarini tahrirlash"
        open={isEditModalOpen}
        onOk={handleEditSave}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="fullName" label="Ism Familiya" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="primaryGoal" label="Asosiy Maqsad">
            <Input />
          </Form.Item>

          <Form.Item name="bio" label="Bio (O'zingiz haqingizda)">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="projectUrl" label="Portfolio / Web sayt manzili">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;