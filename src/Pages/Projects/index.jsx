import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Avatar,
  Button,
  Card,
  Progress,
  Col,
  ConfigProvider,
  Empty,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
  message,
  theme,
} from "antd";

import {
  CheckOutlined,
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  AppstoreOutlined,
  MoreOutlined,
  PlusOutlined,
  QrcodeOutlined,
  ShareAltOutlined,
  ReloadOutlined,
  UploadOutlined,
  UserOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

import {
  ANTD_LOCALES,
} from "../../utils/themeAndI18n";

import {
  TEMPLATES_REGISTRY,
} from "./templatesRegistry";

import { QRCodeSVG } from "qrcode.react";

const { Title, Text } = Typography;

// ============================================================
// API
// ============================================================

const USERS_API =
  "https://6a7700dd63e9caf860c33d99.mockapi.io/users";

const RESUMES_API =
  "https://6a7700dd63e9caf860c33d99.mockapi.io/resumes";

// ============================================================
// PALETTE
// ============================================================

const PALETTE = {
  sageGreen: "#687864",
  deepSteelBlue: "#31708E",
  slateBlue: "#5085A5",
  skyBlue: "#8FC1E3",
  iceLight: "#F7F9FB",
};

// ============================================================
// DARK / LIGHT BUILDER COLORS
// ============================================================

const BUILDER_LIGHT = {
  page: "#F4F7F9",
  panel: "#FFFFFF",
  section: "#FFFFFF",
  input: "#FFFFFF",
  inputHover: "#F8FBFC",
  border: "#DCE6EB",
  divider: "#E8EEF1",
  text: "#16212A",
  textSecondary: "#6B7D86",
  accent: "#31708E",
  accentSoft: "#EAF5F9",
  chipBg: "#EAF5F9",
  chipText: "#225E78",
  previewBg: "#D7E0E5",
};

const BUILDER_DARK = {
  page: "#081419",
  topbar: "#0D1C23",
  panel: "#10232C",
  section: "#132A34",
  input: "#17303A",
  inputHover: "#1B3743",
  border: "#274754",
  divider: "#22404C",
  text: "#ECF5F8",
  textSecondary: "#9EB5BF",
  accent: "#4D9CBF",
  accentSoft: "#163744",
  chipBg: "#173F4F",
  chipText: "#BFE5F4",
  previewBg: "#C8D2D8",
};

// ============================================================
// TRANSLATIONS
// ============================================================

const UI = {
  uz: {
    projects: "Mening loyihalarim",
    projectsSubtitle:
      "Professional rezyumelaringizni yarating va boshqaring.",
    createResume: "Rezyume yaratish",
    myResumes: "Mening rezyumelarim",
    myResumesSubtitle:
      "Bu yerda faqat sizga tegishli rezyumelar ko‘rsatiladi.",
    refresh: "Yangilash",
    noResumes: "Hozircha rezyume yo‘q",
    createFirst:
      "Birinchi professional rezyumeni yarating.",
    open: "Ochish",
    edit: "Tahrirlash",
    delete: "O‘chirish",
    back: "Orqaga",
    continue: "Shablonlarga o‘tish",
    chooseTemplate: "Shablonni tanlang",
    create: "Rezyumeni yaratish",
    changeTemplate: "Shablonni almashtirish",
    resumeReady: "Rezyume tayyor",
    resumeCreated:
      "Rezyume muvaffaqiyatli saqlandi.",
    generating:
      "Rezyumeyingiz yaratilmoqda...",
    generatingSubtitle:
      "Ma’lumotlaringiz tanlangan shablonga joylashtirilmoqda.",
    personalInfo: "Shaxsiy ma’lumotlar",
    firstName: "Ism",
    lastName: "Familiya",
    professionalTitle: "Mutaxassislik",
    phone: "Telefon",
    email: "Email",
    location: "Manzil",
    portfolio: "Portfolio",
    website: "Website",
    profilePhoto: "Profil rasmi",
    uploadPhoto: "Rasm yuklash",
    summary: "Professional xulosa",
    workExperience: "Ish tajribasi",
    education: "Ta’lim",
    skills: "Ko‘nikmalar",
    languages: "Tillar",
    projects: "Loyihalar",
    certificates: "Sertifikatlar",
    socialLinks: "Ijtimoiy tarmoqlar",
    hobbies: "Qiziqishlar",
    addExperience: "Tajriba qo‘shish",
    addEducation: "Ta’lim qo‘shish",
    addProject: "Loyiha qo‘shish",
    addCertificate: "Sertifikat qo‘shish",
    position: "Lavozim",
    company: "Kompaniya",
    from: "Boshlanish",
    to: "Tugash",
    present: "Hozirda ishlayapman",
    responsibilities: "Vazifalar",
    degree: "Daraja",
    institution: "Ta’lim muassasasi",
    skillPlaceholder:
      "Ko‘nikma yozing va Enter bosing",
    languagePlaceholder:
      "Til yozing va Enter bosing",
    projectName: "Loyiha nomi",
    projectLink: "Loyiha havolasi",
    description: "Tavsif",
    certificate: "Sertifikat",
    organization: "Tashkilot",
    date: "Sana",
    github: "GitHub",
    linkedin: "LinkedIn",
    telegram: "Telegram",
    remove: "O‘chirish",
    reloadProfile: "Profilni qayta yuklash",
    primaryColor: "Asosiy rang",
    allYourData:
      "Ro‘yxatdan o‘tishda mavjud bo‘lgan ma’lumotlar avtomatik to‘ldiriladi.",
    connected: "Ulangan user",
    deleteConfirm:
      "Ushbu rezyumeni o‘chirmoqchimisiz?",
    invalidEmail: "Email formati noto‘g‘ri.",
    requiredFirstName: "Ismni kiriting.",
    requiredLastName: "Familiyani kiriting.",
  },

  en: {
    projects: "My Projects",
    projectsSubtitle:
      "Create and manage your professional resumes.",
    createResume: "Create Resume",
    myResumes: "My Resumes",
    myResumesSubtitle:
      "Only your own resumes are displayed here.",
    refresh: "Refresh",
    noResumes: "No resumes yet",
    createFirst:
      "Create your first professional resume.",
    open: "Open",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    continue: "Continue to Templates",
    chooseTemplate: "Choose Template",
    create: "Create Resume",
    changeTemplate: "Change Template",
    resumeReady: "Resume Ready",
    resumeCreated:
      "Your resume was saved successfully.",
    generating:
      "Your Resume is being created...",
    generatingSubtitle:
      "Your information is being applied to the selected template.",
    personalInfo: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    professionalTitle: "Professional Title",
    phone: "Phone",
    email: "Email",
    location: "Location",
    portfolio: "Portfolio",
    website: "Website",
    profilePhoto: "Profile Photo",
    uploadPhoto: "Upload Photo",
    summary: "Professional Summary",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    projects: "Projects",
    certificates: "Certificates",
    socialLinks: "Social Links",
    hobbies: "Hobbies",
    addExperience: "Add Experience",
    addEducation: "Add Education",
    addProject: "Add Project",
    addCertificate: "Add Certificate",
    position: "Position",
    company: "Company",
    from: "From",
    to: "To",
    present: "I currently work here",
    responsibilities: "Responsibilities",
    degree: "Degree",
    institution: "Institution",
    skillPlaceholder:
      "Type a skill and press Enter",
    languagePlaceholder:
      "Type a language and press Enter",
    projectName: "Project Name",
    projectLink: "Project Link",
    description: "Description",
    certificate: "Certificate",
    organization: "Organization",
    date: "Date",
    github: "GitHub",
    linkedin: "LinkedIn",
    telegram: "Telegram",
    remove: "Remove",
    reloadProfile: "Reload Profile",
    primaryColor: "Primary Color",
    allYourData:
      "Existing registration data is automatically filled.",
    connected: "Connected user",
    deleteConfirm:
      "Do you want to delete this resume?",
    invalidEmail: "Invalid email format.",
    requiredFirstName: "First name is required.",
    requiredLastName: "Last name is required.",
  },

  ru: {
    projects: "Мои проекты",
    projectsSubtitle:
      "Создавайте и управляйте профессиональными резюме.",
    createResume: "Создать резюме",
    myResumes: "Мои резюме",
    myResumesSubtitle:
      "Здесь отображаются только ваши резюме.",
    refresh: "Обновить",
    noResumes: "Резюме пока нет",
    createFirst:
      "Создайте свое первое профессиональное резюме.",
    open: "Открыть",
    edit: "Редактировать",
    delete: "Удалить",
    back: "Назад",
    continue: "К шаблонам",
    chooseTemplate: "Выберите шаблон",
    create: "Создать резюме",
    changeTemplate: "Изменить шаблон",
    resumeReady: "Резюме готово",
    resumeCreated:
      "Резюме успешно сохранено.",
    generating:
      "Ваше резюме создается...",
    generatingSubtitle:
      "Ваши данные применяются к выбранному шаблону.",
    personalInfo: "Личная информация",
    firstName: "Имя",
    lastName: "Фамилия",
    professionalTitle: "Специальность",
    phone: "Телефон",
    email: "Email",
    location: "Местоположение",
    portfolio: "Портфолио",
    website: "Website",
    profilePhoto: "Фото профиля",
    uploadPhoto: "Загрузить фото",
    summary: "Профессиональное резюме",
    workExperience: "Опыт работы",
    education: "Образование",
    skills: "Навыки",
    languages: "Языки",
    projects: "Проекты",
    certificates: "Сертификаты",
    socialLinks: "Социальные сети",
    hobbies: "Интересы",
    addExperience: "Добавить опыт",
    addEducation: "Добавить образование",
    addProject: "Добавить проект",
    addCertificate: "Добавить сертификат",
    position: "Должность",
    company: "Компания",
    from: "Начало",
    to: "Окончание",
    present: "Работаю здесь сейчас",
    responsibilities: "Обязанности",
    degree: "Степень",
    institution: "Учебное заведение",
    skillPlaceholder:
      "Введите навык и нажмите Enter",
    languagePlaceholder:
      "Введите язык и нажмите Enter",
    projectName: "Название проекта",
    projectLink: "Ссылка проекта",
    description: "Описание",
    certificate: "Сертификат",
    organization: "Организация",
    date: "Дата",
    github: "GitHub",
    linkedin: "LinkedIn",
    telegram: "Telegram",
    remove: "Удалить",
    reloadProfile: "Перезагрузить профиль",
    primaryColor: "Основной цвет",
    allYourData:
      "Данные, указанные при регистрации, заполняются автоматически.",
    connected: "Подключенный пользователь",
    deleteConfirm:
      "Удалить это резюме?",
    invalidEmail:
      "Неверный формат email.",
    requiredFirstName:
      "Введите имя.",
    requiredLastName:
      "Введите фамилию.",
  },
};

// ============================================================
// EMPTY RESUME
// ============================================================

const createEmptyResume = () => ({
  personalInfo: {
    firstName: "",
    lastName: "",
    professionalTitle: "",
    phone: "",
    email: "",
    location: "",
    profilePhoto: "",
    portfolio: "",
  },

  professionalSummary: "",

  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],

  socialLinks: {
    github: "",
    linkedin: "",
    telegram: "",
    website: "",
  },

  hobbies: [],
});

// ============================================================
// HELPERS
// ============================================================

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function pickFirst(...values) {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return "";
}

function normalizeSkills(skills) {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return {
          name: skill,
          level: 70,
        };
      }

      if (
        skill &&
        typeof skill === "object"
      ) {
        return {
          name: pickFirst(
            skill.name,
            skill.skill,
            skill.title
          ),
          level: Number(
            pickFirst(
              skill.level,
              skill.percent,
              70
            )
          ),
        };
      }

      return null;
    })
    .filter(
      (item) =>
        item &&
        item.name
    );
}

function normalizeLanguages(languages) {
  if (!Array.isArray(languages)) {
    return [];
  }

  return languages
    .map((language) => {
      if (typeof language === "string") {
        return {
          language,
          level: "",
        };
      }

      if (
        language &&
        typeof language === "object"
      ) {
        return {
          language: pickFirst(
            language.language,
            language.name
          ),
          level: pickFirst(
            language.level,
            language.proficiency
          ),
        };
      }

      return null;
    })
    .filter(
      (item) =>
        item &&
        item.language
    );
}

function getNameParts(user) {
  let firstName = pickFirst(
    user.firstName,
    user.firstname,
    user.first_name,
    user.name
  );

  let lastName = pickFirst(
    user.lastName,
    user.lastname,
    user.last_name,
    user.surname
  );

  const fullName = pickFirst(
    user.fullName,
    user.full_name,
    user.displayName
  );

  if (
    (!firstName || !lastName) &&
    fullName
  ) {
    const parts = String(
      fullName
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!firstName) {
      firstName =
        parts[0] || "";
    }

    if (
      !lastName &&
      parts.length > 1
    ) {
      lastName =
        parts.slice(1).join(" ");
    }
  }

  return {
    firstName:
      String(firstName || ""),
    lastName:
      String(lastName || ""),
  };
}

function mapUserToResume(user) {
  const empty =
    createEmptyResume();

  if (!user) {
    return empty;
  }

  const {
    firstName,
    lastName,
  } =
    getNameParts(user);

  return {
    ...empty,

    personalInfo: {
      ...empty.personalInfo,

      firstName,
      lastName,

      professionalTitle:
        String(
          pickFirst(
            user.professionalTitle,
            user.jobTitle,
            user.position,
            user.role
          ) || ""
        ),

      phone:
        String(
          pickFirst(
            user.phone,
            user.phoneNumber,
            user.phone_number
          ) || ""
        ),

      email:
        String(
          pickFirst(
            user.email,
            user.mail
          ) || ""
        ),

      location:
        String(
          pickFirst(
            user.location,
            user.address,
            user.city
          ) || ""
        ),

      profilePhoto:
        String(
          pickFirst(
            user.avatar,
            user.avatarUrl,
            user.profilePhoto,
            user.image,
            user.imageUrl
          ) || ""
        ),

      portfolio:
        String(
          pickFirst(
            user.portfolio,
            user.website
          ) || ""
        ),
    },

    professionalSummary:
      String(
        pickFirst(
          user.bio,
          user.summary,
          user.about
        ) || ""
      ),

    skills:
      normalizeSkills(
        user.skills
      ),

    languages:
      normalizeLanguages(
        user.languages
      ),

    socialLinks: {
      github:
        String(
          pickFirst(
            user.github,
            user.githubUrl
          ) || ""
        ),

      linkedin:
        String(
          pickFirst(
            user.linkedin,
            user.linkedinUrl
          ) || ""
        ),

      telegram:
        String(
          pickFirst(
            user.telegram,
            user.telegramUrl,
            user.telegramUsername
          ) || ""
        ),

      website:
        String(
          pickFirst(
            user.website,
            user.webSite
          ) || ""
        ),
    },
  };
}

function getLoggedInIdentity() {
  const currentUser =
    safeParse(
      localStorage.getItem(
        "currentUser"
      )
    );

  if (
    currentUser &&
    typeof currentUser ===
      "object"
  ) {
    return {
      id:
        currentUser.id ||
        currentUser.userId ||
        null,

      email:
        currentUser.email ||
        null,
    };
  }

  return {
    id:
      localStorage.getItem(
        "userId"
      ) ||
      localStorage.getItem(
        "currentUserId"
      ),

    email:
      localStorage.getItem(
        "userEmail"
      ) ||
      localStorage.getItem(
        "email"
      ),
  };
}

function isValidEmail(email) {
  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
}

function formatUrl(value) {
  if (!value) {
    return "";
  }

  const clean =
    String(value).trim();

  if (!clean) {
    return "";
  }

  if (
    clean.startsWith(
      "http://"
    ) ||
    clean.startsWith(
      "https://"
    )
  ) {
    return clean;
  }

  return `https://${clean}`;
}

function formatPhone(value) {
  let digits =
    String(
      value || ""
    ).replace(
      /\D/g,
      ""
    );

  if (
    digits.startsWith(
      "998"
    )
  ) {
    digits =
      digits.slice(3);
  }

  digits =
    digits.slice(
      0,
      9
    );

  let result =
    "+998";

  if (digits.length > 0) {
    result += ` (${digits.slice(
      0,
      2
    )}`;
  }

  if (digits.length >= 2) {
    result += ")";
  }

  if (digits.length > 2) {
    result += ` ${digits.slice(
      2,
      5
    )}`;
  }

  if (digits.length > 5) {
    result += `-${digits.slice(
      5,
      7
    )}`;
  }

  if (digits.length > 7) {
    result += `-${digits.slice(
      7,
      9
    )}`;
  }

  return result;
}

function makeExperienceDates(
  item
) {
  const from =
    item.from
      ? new Date(
          `${item.from}-01`
        ).toLocaleDateString(
          "en-US",
          {
            month:
              "short",
            year:
              "numeric",
          }
        )
      : "";

  if (item.present) {
    return from
      ? `${from} — Present`
      : "Present";
  }

  const to =
    item.to
      ? new Date(
          `${item.to}-01`
        ).toLocaleDateString(
          "en-US",
          {
            month:
              "short",
            year:
              "numeric",
          }
        )
      : "";

  return `${from}${
    from || to
      ? " — "
      : ""
  }${to}`;
}

// ============================================================
// IMAGE COMPRESSION
// ============================================================

function compressImage(
  file,
  maxWidth = 900,
  quality = 0.82
) {
  return new Promise(
    (resolve, reject) => {
      if (!file) {
        reject(
          new Error(
            "Image file not found."
          )
        );
        return;
      }

      const reader =
        new FileReader();

      reader.onload =
        () => {
          const image =
            new Image();

          image.onload =
            () => {
              const scale =
                Math.min(
                  1,
                  maxWidth /
                    image.width
                );

              const width =
                Math.round(
                  image.width *
                    scale
                );

              const height =
                Math.round(
                  image.height *
                    scale
                );

              const canvas =
                document.createElement(
                  "canvas"
                );

              canvas.width =
                width;

              canvas.height =
                height;

              const ctx =
                canvas.getContext(
                  "2d"
                );

              if (!ctx) {
                reject(
                  new Error(
                    "Canvas context yaratilmadi."
                  )
                );

                return;
              }

              ctx.drawImage(
                image,
                0,
                0,
                width,
                height
              );

              resolve(
                canvas.toDataURL(
                  "image/jpeg",
                  quality
                )
              );
            };

          image.onerror =
            () => {
              reject(
                new Error(
                  "Rasmni o‘qib bo‘lmadi."
                )
              );
            };

          image.src =
            reader.result;
        };

      reader.onerror =
        () => {
          reject(
            new Error(
              "Faylni o‘qishda xatolik."
            )
          );
        };

      reader.readAsDataURL(
        file
      );
    }
  );
}

// ============================================================
// CERTIFICATE STORAGE (IndexedDB)
// ============================================================

const CERTIFICATE_DB_NAME = "resume_builder_storage";
const CERTIFICATE_STORE = "certificates";
const CERTIFICATE_DB_VERSION = 1;
const ACTIVITY_KEY_PREFIX = "resume_builder_activity_";
const FAVORITES_KEY = "resume_builder_favorite_resumes";

function openCertificateDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported by this browser."));
      return;
    }

    const request = window.indexedDB.open(
      CERTIFICATE_DB_NAME,
      CERTIFICATE_DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CERTIFICATE_STORE)) {
        db.createObjectStore(CERTIFICATE_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(
      request.error || new Error("IndexedDB could not be opened.")
    );
  });
}

async function saveCertificateBlob(userId, certificateId, file) {
  const db = await openCertificateDB();
  const key = `${String(userId)}:${String(certificateId)}`;

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(CERTIFICATE_STORE, "readwrite");
    transaction.objectStore(CERTIFICATE_STORE).put({
      key,
      userId: String(userId),
      certificateId: String(certificateId),
      blob: file,
      savedAt: new Date().toISOString(),
    });
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(
      transaction.error || new Error("Could not store the PDF file.")
    );
  });

  db.close();
}

async function getCertificateBlob(userId, certificateId) {
  const db = await openCertificateDB();
  const key = `${String(userId)}:${String(certificateId)}`;

  const result = await new Promise((resolve, reject) => {
    const transaction = db.transaction(CERTIFICATE_STORE, "readonly");
    const request = transaction.objectStore(CERTIFICATE_STORE).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(
      request.error || new Error("Could not read the PDF file.")
    );
  });

  db.close();
  return result?.blob || null;
}

async function deleteCertificateBlob(userId, certificateId) {
  const db = await openCertificateDB();
  const key = `${String(userId)}:${String(certificateId)}`;

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(CERTIFICATE_STORE, "readwrite");
    transaction.objectStore(CERTIFICATE_STORE).delete(key);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(
      transaction.error || new Error("Could not delete the PDF file.")
    );
  });

  db.close();
}

function dataUrlToBlob(dataUrl) {
  try {
    const [header, base64] = String(dataUrl || "").split(",");
    if (!header || !base64) return null;

    const mime =
      header.match(/data:([^;]+);base64/i)?.[1] ||
      "application/pdf";

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type: mime });
  } catch {
    return null;
  }
}

function normalizeCertificates(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      id: String(item.id || `${Date.now()}-${Math.random()}`),
      name: String(item.name || "certificate.pdf"),
      size: Number(item.size || 0),
      type: "application/pdf",
      title: String(item.title || item.name || ""),
      credentialType:
        item.credentialType === "diploma" ? "diploma" : "certificate",
      issuer: String(item.issuer || ""),
      issueDate: String(item.issueDate || ""),
      credentialId: String(item.credentialId || ""),
      description: String(item.description || ""),
      uploadedAt: item.uploadedAt || new Date().toISOString(),
    }));
}

function formatFileSize(bytes) {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function readActivities(userId) {
  try {
    return safeParse(
      localStorage.getItem(`${ACTIVITY_KEY_PREFIX}${userId}`)
    ) || [];
  } catch {
    return [];
  }
}

function writeActivity(userId, activity) {
  if (!userId) return;

  const current = readActivities(userId);
  const next = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...activity,
      createdAt: new Date().toISOString(),
    },
    ...current,
  ].slice(0, 12);

  localStorage.setItem(
    `${ACTIVITY_KEY_PREFIX}${userId}`,
    JSON.stringify(next)
  );
}

function readFavoriteIds() {
  try {
    return safeParse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function writeFavoriteIds(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Index() {
  const canvasRef =
    useRef(null);

  const [lang, setLang] =
    useState(
      localStorage.getItem(
        "app_lang"
      ) || "uz"
    );

  const [
    isDarkMode,
    setIsDarkMode,
  ] = useState(
    JSON.parse(
      localStorage.getItem(
        "app_dark_mode"
      ) || "true"
    )
  );

  const [
    designStyle,
    setDesignStyle,
  ] = useState(
    localStorage.getItem(
      "app_design_style"
    ) || "standard"
  );

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);

  const [
    myResumes,
    setMyResumes,
  ] = useState([]);

  const [
    loadingResumes,
    setLoadingResumes,
  ] = useState(false);

  const [
    isBuilderOpen,
    setIsBuilderOpen,
  ] = useState(false);

  const [
    builderStep,
    setBuilderStep,
  ] = useState("form");

  const [
    loadingUser,
    setLoadingUser,
  ] = useState(false);

  const [
    userError,
    setUserError,
  ] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [resumeFilter, setResumeFilter] = useState("all");
  const [resumeSort, setResumeSort] = useState("newest");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [activities, setActivities] = useState([]);

  const [certificateDetailsOpen, setCertificateDetailsOpen] = useState(false);
  const [pendingCertificateFile, setPendingCertificateFile] = useState(null);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [certificateForm, setCertificateForm] = useState({
    title: "",
    credentialType: "certificate",
    issuer: "",
    issueDate: "",
    credentialId: "",
    description: "",
  });

  const [certificatePreview, setCertificatePreview] = useState(null);
  const [shareResume, setShareResume] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [qrResume, setQrResume] = useState(null);
  const [sharedViewResume, setSharedViewResume] = useState(null);
  const [sharedViewOpen, setSharedViewOpen] = useState(false);

  const [
    resumeData,
    setResumeData,
  ] = useState(
    createEmptyResume()
  );

  const [
    selectedTemplateId,
    setSelectedTemplateId,
  ] = useState(
    TEMPLATES_REGISTRY[0]
      ?.id || ""
  );

  const [
    primaryColor,
    setPrimaryColor,
  ] = useState(
    TEMPLATES_REGISTRY[0]
      ?.defaultColor ||
      PALETTE.deepSteelBlue
  );

  const [
    editingResumeId,
    setEditingResumeId,
  ] = useState(null);

  const [
    countdown,
    setCountdown,
  ] = useState(5);

  const t =
    UI[lang] || UI.uz;

  // ----------------------------------------------------------
  // BUILDER COLORS
  // ----------------------------------------------------------

  const colors = isDarkMode
    ? BUILDER_DARK
    : BUILDER_LIGHT;

  // ==========================================================
  // SETTINGS SYNC
  // ==========================================================

  const syncSettings = () => {
    setLang(
      localStorage.getItem(
        "app_lang"
      ) || "uz"
    );

    setIsDarkMode(
      JSON.parse(
        localStorage.getItem(
          "app_dark_mode"
        ) || "true"
      )
    );

    setDesignStyle(
      localStorage.getItem(
        "app_design_style"
      ) || "standard"
    );
  };

  useEffect(() => {
    syncSettings();

    const events = [
      "storage",
      "focus",
      "visibilitychange",
      "app-settings-change",
    ];

    events.forEach(
      (name) => {
        window.addEventListener(
          name,
          syncSettings
        );
      }
    );

    return () => {
      events.forEach(
        (name) => {
          window.removeEventListener(
            name,
            syncSettings
          );
        }
      );
    };
  }, []);

  useEffect(() => {
    const ids = readFavoriteIds();
    setFavoriteIds(ids);

    const identity = getLoggedInIdentity();
    if (identity.id) {
      setActivities(readActivities(identity.id));
    }
  }, []);

  // ==========================================================
  // CANVAS
  // ==========================================================

  useEffect(() => {
    if (
      designStyle !==
        "multi" &&
      designStyle !==
        "creative"
    ) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext(
        "2d"
      );

    let width =
      (canvas.width =
        window.innerWidth);

    let height =
      (canvas.height =
        window.innerHeight);

    let animationFrameId;

    const handleResize =
      () => {
        width =
          canvas.width =
            window.innerWidth;

        height =
          canvas.height =
            window.innerHeight;
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    const dots =
      Array.from(
        {
          length: 50,
        },
        () => ({
          x:
            Math.random() *
            width,

          y:
            Math.random() *
            height,

          vx:
            (Math.random() -
              0.5) *
            0.7,

          vy:
            (Math.random() -
              0.5) *
            0.7,

          radius: 2,
        })
      );

    const render =
      () => {
        ctx.clearRect(
          0,
          0,
          width,
          height
        );

        dots.forEach(
          (dot) => {
            dot.x +=
              dot.vx;

            dot.y +=
              dot.vy;

            if (
              dot.x < 0 ||
              dot.x > width
            ) {
              dot.vx *=
                -1;
            }

            if (
              dot.y < 0 ||
              dot.y > height
            ) {
              dot.vy *=
                -1;
            }

            ctx.beginPath();

            ctx.arc(
              dot.x,
              dot.y,
              dot.radius,
              0,
              Math.PI * 2
            );

            ctx.fillStyle =
              PALETTE.skyBlue;

            ctx.globalAlpha =
              isDarkMode
                ? 0.45
                : 0.7;

            ctx.fill();

            ctx.globalAlpha =
              1;
          }
        );

        animationFrameId =
          requestAnimationFrame(
            render
          );
      };

    render();

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [
    designStyle,
    isDarkMode,
  ]);

  // ==========================================================
  // TEMPLATE
  // ==========================================================

  const selectedTemplate =
    useMemo(
      () =>
        TEMPLATES_REGISTRY.find(
          (item) =>
            item.id ===
            selectedTemplateId
        ),
      [
        selectedTemplateId,
      ]
    );

  // ==========================================================
  // LOAD USER
  // ==========================================================

  const loadCurrentUser =
    async () => {
      setLoadingUser(
        true
      );

      setUserError("");

      try {
        const identity =
          getLoggedInIdentity();

        if (
          !identity.id &&
          !identity.email
        ) {
          throw new Error(
            "Login qilgan user ma’lumoti topilmadi."
          );
        }

        const response =
          await fetch(
            USERS_API
          );

        if (!response.ok) {
          throw new Error(
            "Users API ishlamadi."
          );
        }

        const users =
          await response.json();

        let user =
          null;

        if (
          identity.id
        ) {
          user =
            users.find(
              (item) =>
                String(
                  item.id
                ) ===
                String(
                  identity.id
                )
            );
        }

        if (
          !user &&
          identity.email
        ) {
          user =
            users.find(
              (item) =>
                String(
                  item.email ||
                    ""
                )
                  .trim()
                  .toLowerCase() ===
                String(
                  identity.email
                )
                  .trim()
                  .toLowerCase()
            );
        }

        if (!user) {
          throw new Error(
            "MockAPI'da login qilgan user topilmadi."
          );
        }

        setCurrentUser(
          user
        );
        setActivities(readActivities(user.id));
        setFavoriteIds(readFavoriteIds());

        setResumeData(
          mapUserToResume(
            user
          )
        );
      } catch (error) {
        console.error(
          error
        );

        setUserError(
          error.message
        );
      } finally {
        setLoadingUser(
          false
        );
      }
    };

  // ==========================================================
  // LOAD RESUMES
  // ==========================================================

  const loadMyResumes =
    async () => {
      setLoadingResumes(
        true
      );

      try {
        const identity =
          getLoggedInIdentity();

        if (!identity.id) {
          setMyResumes(
            []
          );

          return;
        }

        const response =
          await fetch(
            `${RESUMES_API}?userId=${encodeURIComponent(
              identity.id
            )}`
          );

        if (!response.ok) {
          throw new Error(
            "Resumes API ishlamadi."
          );
        }

        const data =
          await response.json();

        const parsed =
          data.map(
            (resume) => {
              let parsedData =
                createEmptyResume();

              try {
                parsedData =
                  JSON.parse(
                    resume.resumeData ||
                      "{}"
                  );
              } catch {
                parsedData =
                  createEmptyResume();
              }

              return {
                ...resume,
                parsedData,
              };
            }
          );

        setMyResumes(
          parsed
        );
      } catch (error) {
        console.error(
          error
        );

      } finally {
        setLoadingResumes(
          false
        );
      }
    };

  useEffect(() => {
    const storedUser =
      safeParse(
        localStorage.getItem(
          "currentUser"
        )
      );

    if (storedUser) {
      setCurrentUser(
        storedUser
      );
    }

    loadMyResumes();
  }, []);

  // ==========================================================
  // OPEN
  // ==========================================================

  const openCreateResume =
    () => {
      setEditingResumeId(
        null
      );

      setBuilderStep(
        "form"
      );

      setCountdown(
        5
      );

      setUserError("");

      setResumeData(
        createEmptyResume()
      );

      setIsBuilderOpen(
        true
      );

      loadCurrentUser();
    };

  // ==========================================================
  // OPEN EXISTING
  // ==========================================================

  const openExistingResume =
    (
      resume
    ) => {
      setEditingResumeId(
        resume.id
      );

      setResumeData(
        resume.parsedData ||
          createEmptyResume()
      );

      setSelectedTemplateId(
        resume.templateId
      );

      setPrimaryColor(
        resume.primaryColor ||
          PALETTE.deepSteelBlue
      );

      setBuilderStep(
        "preview"
      );

      setIsBuilderOpen(
        true
      );
    };

  // ==========================================================
  // UPDATE
  // ==========================================================

  const updatePersonal =
    (
      field,
      value
    ) => {
      setResumeData(
        (prev) => ({
          ...prev,

          personalInfo:
            {
              ...prev.personalInfo,
              [field]:
                value,
            },
        })
      );
    };

  const updateSocial =
    (
      field,
      value
    ) => {
      setResumeData(
        (prev) => ({
          ...prev,

          socialLinks:
            {
              ...prev.socialLinks,
              [field]:
                value,
            },
        })
      );
    };

  const updateField =
    (
      field,
      value
    ) => {
      setResumeData(
        (prev) => ({
          ...prev,
          [field]:
            value,
        })
      );
    };

  const updateArrayItem =
    (
      arrayName,
      index,
      field,
      value
    ) => {
      setResumeData(
        (prev) => {
          const updated =
            [
              ...prev[
                arrayName
              ],
            ];

          updated[
            index
          ] = {
            ...updated[
              index
            ],
            [field]:
              value,
          };

          return {
            ...prev,
            [arrayName]:
              updated,
          };
        }
      );
    };

  const addArrayItem =
    (
      arrayName,
      item
    ) => {
      setResumeData(
        (prev) => ({
          ...prev,

          [arrayName]:
            [
              ...prev[
                arrayName
              ],
              item,
            ],
        })
      );
    };

  const removeArrayItem =
    (
      arrayName,
      index
    ) => {
      setResumeData(
        (prev) => ({
          ...prev,

          [arrayName]:
            prev[
              arrayName
            ].filter(
              (_, i) =>
                i !==
                index
            ),
        })
      );
    };

  // ==========================================================
  // EXPERIENCE
  // ==========================================================

  const updateExperience =
    (
      index,
      field,
      value
    ) => {
      setResumeData(
        (prev) => {
          const updated =
            [
              ...prev.workExperience,
            ];

          const item =
            {
              ...updated[
                index
              ],
              [field]:
                value,
            };

          item.dates =
            makeExperienceDates(
              item
            );

          updated[
            index
          ] = item;

          return {
            ...prev,
            workExperience:
              updated,
          };
        }
      );
    };

  // ==========================================================
  // EDUCATION
  // ==========================================================

  const updateEducation =
    (
      index,
      field,
      value
    ) => {
      setResumeData(
        (prev) => {
          const updated =
            [
              ...prev.education,
            ];

          const item =
            {
              ...updated[
                index
              ],
              [field]:
                value,
            };

          const from =
            item.from
              ? new Date(
                  `${item.from}-01`
                ).toLocaleDateString(
                  "en-US",
                  {
                    month:
                      "short",
                    year:
                      "numeric",
                  }
                )
              : "";

          const to =
            item.to
              ? new Date(
                  `${item.to}-01`
                ).toLocaleDateString(
                  "en-US",
                  {
                    month:
                      "short",
                    year:
                      "numeric",
                  }
                )
              : "";

          item.dates =
            `${from}${
              from || to
                ? " — "
                : ""
            }${to}`;

          updated[
            index
          ] = item;

          return {
            ...prev,
            education:
              updated,
          };
        }
      );
    };

  // ==========================================================
  // PHOTO
  // ==========================================================

  const handlePhotoUpload =
    async (file) => {
      try {
        const actualFile =
          file?.originFileObj ||
          file;

        if (!actualFile) {
          throw new Error(
            "Rasm fayli topilmadi."
          );
        }

        if (
          !actualFile.type ||
          !actualFile.type.startsWith(
            "image/"
          )
        ) {
          message.error(
            "Faqat rasm faylini yuklang."
          );

          return Upload.LIST_IGNORE;
        }

        const compressed =
          await compressImage(
            actualFile,
            900,
            0.82
          );

        updatePersonal(
          "profilePhoto",
          compressed
        );

        message.success(
          t.uploadPhoto
        );

        return false;
      } catch (error) {
        console.error(
          "PHOTO UPLOAD ERROR:",
          error
        );

        message.error(
          "Rasmni yuklashda xatolik."
        );

        return Upload.LIST_IGNORE;
      }
    };

  // ==========================================================
  // FORM
  // ==========================================================

  const handleFormSubmit =
    (
      event
    ) => {
      event.preventDefault();

      if (
        !resumeData.personalInfo.firstName.trim()
      ) {
        message.error(
          t.requiredFirstName
        );

        return;
      }

      if (
        !resumeData.personalInfo.lastName.trim()
      ) {
        message.error(
          t.requiredLastName
        );

        return;
      }

      if (
        !isValidEmail(
          resumeData
            .personalInfo
            .email
        )
      ) {
        message.error(
          t.invalidEmail
        );

        return;
      }

      setBuilderStep(
        "templates"
      );
    };

  // ==========================================================
  // TEMPLATE
  // ==========================================================

  const selectTemplate =
    (
      template
    ) => {
      setSelectedTemplateId(
        template.id
      );

      setPrimaryColor(
        template.defaultColor
      );
    };

  // ==========================================================
  // SAVE RESUME
  // ==========================================================

  const saveResume =
    async () => {
      const identity =
        getLoggedInIdentity();

      if (!identity.id) {
        throw new Error(
          "User ID topilmadi."
        );
      }

      const now =
        new Date().toISOString();

      const payload =
        {
          userId:
            String(
              identity.id
            ),

          title:
            String(
              resumeData.personalInfo?.professionalTitle ||
                "Resume"
            ),

          templateId:
            String(
              selectedTemplateId
            ),

          primaryColor:
            String(
              primaryColor
            ),

          resumeData:
            JSON.stringify(
              resumeData
            ),

          updatedAt:
            now,
        };

      if (
        editingResumeId
      ) {
        const response =
          await fetch(
            `${RESUMES_API}/${editingResumeId}`,
            {
              method:
                "PUT",

              headers:
                {
                  "Content-Type":
                    "application/json",
                },

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Rezyumeni yangilab bo‘lmadi."
          );
        }

        const saved = await response.json();
        writeActivity(identity.id, {
          type: "resume",
          title: editingResumeId ? "Resume updated" : "Resume created",
          subtitle: resumeData.personalInfo?.professionalTitle || "Resume",
        });
        setActivities(readActivities(identity.id));
        return saved;
      }

      const response =
        await fetch(
          RESUMES_API,
          {
            method:
              "POST",

            headers:
              {
                "Content-Type":
                  "application/json",
              },

            body:
              JSON.stringify({
                ...payload,

                createdAt:
                  now,
              }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Rezyumeni saqlab bo‘lmadi."
        );
      }

      const saved = await response.json();
      writeActivity(identity.id, {
        type: "resume",
        title: "Resume created",
        subtitle: resumeData.personalInfo?.professionalTitle || "Resume",
      });
      setActivities(readActivities(identity.id));
      return saved;
    };

  // ==========================================================
  // GENERATE
  // ==========================================================

  const generateResume =
    () => {
      setCountdown(
        5
      );

      setBuilderStep(
        "generating"
      );
    };

  // ==========================================================
  // COUNTDOWN
  // ==========================================================

  useEffect(() => {
    if (
      builderStep !==
      "generating"
    ) {
      return;
    }

    if (
      countdown <= 0
    ) {
      saveResume()
        .then(() => {
          loadMyResumes();

          message.success(
            t.resumeCreated
          );

          setBuilderStep(
            "preview"
          );
        })
        .catch(
          (error) => {
            console.error(
              error
            );

            message.error(
              error.message
            );

            setBuilderStep(
              "templates"
            );
          }
        );

      return;
    }

    const timer =
      setTimeout(
        () => {
          setCountdown(
            (prev) =>
              prev - 1
          );
        },
        1000
      );

    return () =>
      clearTimeout(
        timer
      );
  }, [
    builderStep,
    countdown,
  ]);

  // ==========================================================
  // DELETE
  // ==========================================================

  const deleteResume =
    async (
      resumeId
    ) => {
      if (
        !window.confirm(
          t.deleteConfirm
        )
      ) {
        return;
      }

      try {
        const response =
          await fetch(
            `${RESUMES_API}/${resumeId}`,
            {
              method:
                "DELETE",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Rezyumeni o‘chirib bo‘lmadi."
          );
        }

        setMyResumes(
          (prev) =>
            prev.filter(
              (item) =>
                String(item.id) !==
                String(resumeId)
            )
        );

        const nextFavorites = favoriteIds.filter(
          (id) => String(id) !== String(resumeId)
        );
        setFavoriteIds(nextFavorites);
        writeFavoriteIds(nextFavorites);

        const activity = {
          type: "delete",
          title: "Resume deleted",
          subtitle: "A resume was removed from your collection.",
        };
        writeActivity(currentUser?.id, activity);
        setActivities(readActivities(currentUser?.id));

        message.success(
          t.delete
        );
      } catch (error) {
        console.error(
          error
        );

        message.error(
          error.message
        );
      }
    };

  const duplicateResume = async (resume) => {
    try {
      const now = new Date().toISOString();
      const baseData =
        resume.parsedData ||
        safeParse(resume.resumeData) ||
        createEmptyResume();

      const response = await fetch(RESUMES_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: String(resume.userId || currentUser?.id || ""),
          title: `${resume.title || baseData.personalInfo?.professionalTitle || "Resume"} Copy`,
          templateId: String(resume.templateId || ""),
          primaryColor: String(resume.primaryColor || PALETTE.deepSteelBlue),
          resumeData: JSON.stringify(baseData),
          createdAt: now,
          updatedAt: now,
        }),
      });

      if (!response.ok) {
        throw new Error("Rezyumeni nusxalab bo‘lmadi.");
      }

      const created = await response.json();
      setMyResumes((prev) => [
        {
          ...created,
          parsedData: baseData,
        },
        ...prev,
      ]);

      writeActivity(currentUser?.id, {
        type: "duplicate",
        title: "Resume duplicated",
        subtitle: resume.title || baseData.personalInfo?.professionalTitle || "Resume",
      });
      setActivities(readActivities(currentUser?.id));
      message.success("Resume nusxalandi.");
    } catch (error) {
      console.error("DUPLICATE RESUME ERROR:", error);
      message.error(error.message || "Resume nusxalanmadi.");
    }
  };

  const toggleFavorite = (resumeId) => {
    const exists = favoriteIds.some(
      (id) => String(id) === String(resumeId)
    );

    const next = exists
      ? favoriteIds.filter((id) => String(id) !== String(resumeId))
      : [...favoriteIds, resumeId];

    setFavoriteIds(next);
    writeFavoriteIds(next);
  };

  const buildResumeShareUrl = (resumeId) => {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("sharedResume", String(resumeId));
    return url.toString();
  };

  const openShareModal = (resume) => {
    setShareResume(resume);
    setShareOpen(true);
  };

  const copyShareLink = async (resume) => {
    const url = buildResumeShareUrl(resume.id);

    try {
      await navigator.clipboard.writeText(url);
      message.success("Resume link copied.");
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      message.success("Resume link copied.");
    }
  };

  const openQrModal = (resume) => {
    setQrResume(resume);
  };

  useEffect(() => {
    const sharedId = new URLSearchParams(window.location.search).get(
      "sharedResume"
    );

    if (!sharedId) return;

    fetch(`${RESUMES_API}/${encodeURIComponent(sharedId)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Shared resume not found.");
        return response.json();
      })
      .then((resume) => {
        const parsedData =
          safeParse(resume.resumeData || "{}") ||
          createEmptyResume();

        setSharedViewResume({
          ...resume,
          parsedData,
        });
        setSharedViewOpen(true);
      })
      .catch((error) => {
        console.error("SHARED RESUME ERROR:", error);
      });
  }, []);

  const filteredResumes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = myResumes.filter((resume) => {
      const data = resume.parsedData || createEmptyResume();
      const name = `${data.personalInfo?.firstName || ""} ${data.personalInfo?.lastName || ""}`.trim();
      const title = resume.title || data.personalInfo?.professionalTitle || "Resume";
      const template = TEMPLATES_REGISTRY.find(
        (item) => item.id === resume.templateId
      );

      const haystack = `${name} ${title} ${template?.name || ""}`.toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesFilter =
        resumeFilter === "all" ||
        (resumeFilter === "favorites" && favoriteIds.some((id) => String(id) === String(resume.id))) ||
        (resumeFilter === "templates" && !!template);

      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) => {
      if (resumeSort === "az") {
        const an = `${a.parsedData?.personalInfo?.firstName || ""} ${a.parsedData?.personalInfo?.lastName || ""}`.trim();
        const bn = `${b.parsedData?.personalInfo?.firstName || ""} ${b.parsedData?.personalInfo?.lastName || ""}`.trim();
        return an.localeCompare(bn);
      }

      if (resumeSort === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
    });

    return result;
  }, [myResumes, searchQuery, resumeFilter, resumeSort, favoriteIds]);

  // ==========================================================
  // CERTIFICATES
  // ==========================================================

  const updateUserCertificates = async (certificates) => {
    if (!currentUser?.id) {
      throw new Error("User ID topilmadi.");
    }

    const safeCertificates = certificates.map((item) => ({
      id: String(item.id),
      name: String(item.name || "certificate.pdf"),
      size: Number(item.size || 0),
      type: "application/pdf",
      title: String(item.title || item.name || ""),
      credentialType:
        item.credentialType === "diploma" ? "diploma" : "certificate",
      issuer: String(item.issuer || ""),
      issueDate: String(item.issueDate || ""),
      credentialId: String(item.credentialId || ""),
      description: String(item.description || ""),
      uploadedAt: item.uploadedAt || new Date().toISOString(),
    }));

    const response = await fetch(`${USERS_API}/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...currentUser,
        certificates: safeCertificates,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(
        response.status === 413
          ? "Certificate metadata hajmi juda katta."
          : "User ma’lumotlarini yangilab bo‘lmadi."
      );
    }

    const saved = await response.json();
    setCurrentUser(saved);
    localStorage.setItem("currentUser", JSON.stringify(saved));
    return saved;
  };

  const prepareCertificateUpload = async (file) => {
    const actualFile = file?.originFileObj || file;
    if (!actualFile) return Upload.LIST_IGNORE;

    const isPdf =
      actualFile.type === "application/pdf" ||
      actualFile.name?.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      message.error("Faqat PDF fayl yuklash mumkin.");
      return Upload.LIST_IGNORE;
    }

    if (actualFile.size > 5 * 1024 * 1024) {
      message.error("PDF hajmi 5 MB dan oshmasligi kerak.");
      return Upload.LIST_IGNORE;
    }

    setPendingCertificateFile(actualFile);
    setCertificateForm({
      title: actualFile.name.replace(/\.pdf$/i, ""),
      credentialType: "certificate",
      issuer: "",
      issueDate: "",
      credentialId: "",
      description: "",
    });
    setCertificateDetailsOpen(true);
    return Upload.LIST_IGNORE;
  };

  const submitCertificate = async () => {
    if (!pendingCertificateFile || !currentUser?.id) return;

    try {
      setUploadingCertificate(true);

      const existing = normalizeCertificates(currentUser.certificates);
      const id = `cert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const newCertificate = {
        id,
        name: pendingCertificateFile.name,
        size: pendingCertificateFile.size,
        type: "application/pdf",
        title:
          certificateForm.title.trim() ||
          pendingCertificateFile.name.replace(/\.pdf$/i, ""),
        credentialType:
          certificateForm.credentialType === "diploma"
            ? "diploma"
            : "certificate",
        issuer: certificateForm.issuer.trim(),
        issueDate: certificateForm.issueDate,
        credentialId: certificateForm.credentialId.trim(),
        description: certificateForm.description.trim(),
        uploadedAt: new Date().toISOString(),
      };

      await saveCertificateBlob(
        currentUser.id,
        id,
        pendingCertificateFile
      );

      try {
        await updateUserCertificates([
          ...existing,
          newCertificate,
        ]);
      } catch (error) {
        await deleteCertificateBlob(currentUser.id, id);
        throw error;
      }

      setCertificateDetailsOpen(false);
      setPendingCertificateFile(null);
      writeActivity(currentUser.id, {
        type: "certificate",
        title: "Certificate added",
        subtitle: newCertificate.title,
      });
      setActivities(readActivities(currentUser.id));
      message.success("Certificate saqlandi.");
    } catch (error) {
      console.error("CERTIFICATE UPLOAD ERROR:", error);
      message.error(error.message || "Certificate saqlanmadi.");
    } finally {
      setUploadingCertificate(false);
    }
  };

  const removeCertificate = async (certificateId) => {
    if (!currentUser?.id) return;

    try {
      const existing = normalizeCertificates(currentUser.certificates);
      const next = existing.filter(
        (item) => String(item.id) !== String(certificateId)
      );

      await updateUserCertificates(next);
      await deleteCertificateBlob(currentUser.id, certificateId);
      writeActivity(currentUser.id, {
        type: "certificate",
        title: "Certificate removed",
        subtitle: "A certificate was removed.",
      });
      setActivities(readActivities(currentUser.id));
      message.success("Certificate o‘chirildi.");
    } catch (error) {
      console.error("CERTIFICATE DELETE ERROR:", error);
      message.error(error.message || "Certificate o‘chirilmadi.");
    }
  };

  const openCertificate = async (certificate) => {
    try {
      const stored = await getCertificateBlob(
        currentUser?.id,
        certificate.id
      );

      const fallback = dataUrlToBlob(certificate.data);
      const blob = stored || fallback;

      if (!blob) {
        message.error("PDF fayl topilmadi.");
        return;
      }

      const url = URL.createObjectURL(blob);
      setCertificatePreview({
        certificate,
        url,
      });
    } catch (error) {
      console.error("CERTIFICATE PREVIEW ERROR:", error);
      message.error("PDFni ochib bo‘lmadi.");
    }
  };

  const downloadCertificateFile = async (certificate) => {
    try {
      const stored = await getCertificateBlob(
        currentUser?.id,
        certificate.id
      );
      const fallback = dataUrlToBlob(certificate.data);
      const blob = stored || fallback;

      if (!blob) {
        message.error("PDF fayl topilmadi.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = certificate.name || "certificate.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("CERTIFICATE DOWNLOAD ERROR:", error);
      message.error("PDFni yuklab bo‘lmadi.");
    }
  };

  const certificates = normalizeCertificates(currentUser?.certificates);

  const profileCompletion = useMemo(() => {
    const data = resumeData || createEmptyResume();
    const checks = [
      data.personalInfo?.firstName,
      data.personalInfo?.lastName,
      data.personalInfo?.professionalTitle,
      data.personalInfo?.email,
      data.personalInfo?.phone,
      data.personalInfo?.location,
      data.personalInfo?.profilePhoto,
      data.professionalSummary,
      data.workExperience?.length,
      data.education?.length,
      data.skills?.length,
      data.projects?.length,
    ];

    const completed = checks.filter((value) =>
      Array.isArray(value) ? value.length > 0 : !!String(value || "").trim()
    ).length;

    return Math.round((completed / checks.length) * 100);
  }, [resumeData]);

  const totalProjects = useMemo(
    () => myResumes.reduce((sum, resume) => {
      const data = resume.parsedData || createEmptyResume();
      return sum + (data.projects?.length || 0);
    }, 0),
    [myResumes]
  );

  const totalExperience = useMemo(
    () => myResumes.reduce((sum, resume) => {
      const data = resume.parsedData || createEmptyResume();
      return sum + (data.workExperience?.length || 0);
    }, 0),
    [myResumes]
  );

  // ==========================================================
  // RESET
  // ==========================================================

  const resetBuilder =
    () => {
      setEditingResumeId(
        null
      );

      setResumeData(
        createEmptyResume()
      );

      setSelectedTemplateId(
        TEMPLATES_REGISTRY[0]
          ?.id || ""
      );

      setPrimaryColor(
        TEMPLATES_REGISTRY[0]
          ?.defaultColor ||
          PALETTE.deepSteelBlue
      );

      setBuilderStep(
        "form"
      );

      setCountdown(
        5
      );

      loadCurrentUser();
    };

  // ==========================================================
  // RADIUS / PAGE
  // ==========================================================

  const radius =
    designStyle ===
    "minimal"
      ? 0
      : designStyle ===
        "creative"
      ? 16
      : designStyle ===
        "multi"
      ? 20
      : 10;

  const pageBg = isDarkMode
    ? "#112530"
    : "#F4F7F9";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <ConfigProvider
      locale={
        ANTD_LOCALES[
          lang
        ] ||
        ANTD_LOCALES.uz
      }
      theme={{
        algorithm:
          isDarkMode
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,

        token: {
          colorPrimary:
            PALETTE.deepSteelBlue,

          colorTextBase:
            colors.text,

          colorBgBase:
            colors.page,

          colorBgContainer:
            colors.panel,

          colorBorder:
            colors.border,

          colorTextSecondary:
            colors.textSecondary,

          borderRadius:
            radius,

          fontFamily:
            "Inter, Arial, sans-serif",
        },

        components: {
          Input: {
            colorBgContainer:
              colors.input,

            colorBorder:
              colors.border,

            colorText:
              colors.text,

            colorTextPlaceholder:
              colors.textSecondary,

            activeBorderColor:
              colors.accent,

            hoverBorderColor:
              colors.accent,

            activeShadow:
              isDarkMode
                ? "0 0 0 3px rgba(77,156,191,.15)"
                : "0 0 0 3px rgba(49,112,142,.10)",
          },

          Select: {
            colorBgContainer:
              colors.input,

            colorBorder:
              colors.border,

            colorText:
              colors.text,

            optionSelectedBg:
              isDarkMode
                ? "#1A4050"
                : "#EAF5F9",

            optionActiveBg:
              isDarkMode
                ? "#183945"
                : "#F2F8FA",
          },

          Card: {
            colorBgContainer:
              colors.section,

            colorBorderSecondary:
              colors.border,
          },

          Modal: {
            contentBg:
              colors.topbar ||
              colors.panel,

            headerBg:
              colors.topbar ||
              colors.panel,

            titleColor:
              colors.text,

            colorIcon:
              colors.textSecondary,

            colorIconHover:
              colors.text,
          },
        },
      }}
    >
      <div
        style={{
          minHeight:
            "100vh",

          width:
            "100%",

          background:
            pageBg,

          position:
            "relative",

          overflowX:
            "hidden",
        }}
      >
        {/* ====================================================
            BACKGROUND CANVAS
        ==================================================== */}

        {(designStyle ===
          "multi" ||
          designStyle ===
            "creative") && (
          <canvas
            ref={
              canvasRef
            }
            style={{
              position:
                "fixed",

              inset:
                0,

              width:
                "100%",

              height:
                "100%",

              pointerEvents:
                "none",

              zIndex:
                0,
            }}
          />
        )}

        {/* ====================================================
            PAGE
        ==================================================== */}

        <div
          style={{
            position:
              "relative",

            zIndex:
              1,

            maxWidth:
              1200,

            margin:
              "0 auto",

            padding:
              "96px 20px 60px",
          }}
        >
          {/* HEADER */}

          <Card
            style={{
              marginBottom:
                24,

              borderRadius:
                radius,

              background:
                isDarkMode
                  ? "#1B3B4B"
                  : "#FFFFFF",

              border:
                `1px solid ${
                  isDarkMode
                    ? "rgba(255,255,255,.08)"
                    : "#E4EBEF"
                }`,
            }}
          >
            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                gap:
                  20,

                flexWrap:
                  "wrap",
              }}
            >
              <div>
                <Title
                  level={
                    3
                  }
                  style={{
                    margin:
                      0,
                  }}
                >
                  {
                    t.projects
                  }
                </Title>

                <Text type="secondary">
                  {
                    t.projectsSubtitle
                  }
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                icon={
                  <PlusOutlined />
                }
                onClick={
                  openCreateResume
                }
                style={{
                  background:
                    PALETTE.deepSteelBlue,

                  borderColor:
                    PALETTE.deepSteelBlue,

                  height:
                    48,

                  fontWeight:
                    700,
                }}
              >
                {
                  t.createResume
                }
              </Button>
            </div>
          </Card>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {[
              ["Resumes", myResumes.length, <FilePdfOutlined />],
              ["Certificates", certificates.length, <CheckCircleFilled />],
              ["Projects", totalProjects, <AppstoreOutlined />],
              ["Profile complete", profileCompletion, <UserOutlined />, "%"],
            ].map(([label, value, icon, suffix]) => (
              <Col xs={12} sm={12} lg={6} key={label}>
                <Card style={{ height: "100%", borderRadius: radius }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center", background: isDarkMode ? "#163743" : "#EAF5F9", color: PALETTE.deepSteelBlue }}>{icon}</div>
                    <div>
                      <div style={{ color: colors.textSecondary, fontSize: 11 }}>{label}</div>
                      <div style={{ color: colors.text, fontWeight: 800, fontSize: 22 }}>{value}{suffix || ""}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Card
            style={{ borderRadius: radius, background: isDarkMode ? "#1B3B4B" : "#FFFFFF", border: `1px solid ${isDarkMode ? "rgba(255,255,255,.08)" : "#E4EBEF"}` }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 15, flexWrap: "wrap", marginBottom: 18 }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>{t.myResumes}</Title>
                <Text type="secondary">{t.myResumesSubtitle}</Text>
              </div>
              <Space orientation="horizontal">
                <Button icon={<ReloadOutlined />} onClick={loadMyResumes}>{t.refresh}</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateResume}>{t.createResume}</Button>
              </Space>
            </div>

            <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
              <Col xs={24} md={12} lg={14}>
                <Input size="large" allowClear value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search resumes..." prefix={<span style={{ color: colors.textSecondary }}>⌕</span>} />
              </Col>
              <Col xs={12} md={6} lg={5}>
                <Select size="large" value={resumeFilter} onChange={setResumeFilter} style={{ width: "100%" }} options={[{ label: "All resumes", value: "all" }, { label: "Favorites", value: "favorites" }, { label: "Templates", value: "templates" }]} />
              </Col>
              <Col xs={12} md={6} lg={5}>
                <Select size="large" value={resumeSort} onChange={setResumeSort} style={{ width: "100%" }} options={[{ label: "Newest", value: "newest" }, { label: "Oldest", value: "oldest" }, { label: "A–Z", value: "az" }]} />
              </Col>
            </Row>

            {loadingResumes ? (
              <div style={{ padding: 70, textAlign: "center" }}><Text type="secondary">Loading...</Text></div>
            ) : filteredResumes.length === 0 ? (
              <Empty description={searchQuery ? "No matching resumes" : <div><div>{t.noResumes}</div><Text type="secondary">{t.createFirst}</Text></div>}>
                {!searchQuery && <Button type="primary" onClick={openCreateResume} icon={<PlusOutlined />}>{t.createResume}</Button>}
              </Empty>
            ) : (
              <Row gutter={[18, 18]}>
                {filteredResumes.map((resume) => {
                  const data = resume.parsedData || createEmptyResume();
                  const template = TEMPLATES_REGISTRY.find((item) => item.id === resume.templateId);
                  const avatar = data.personalInfo?.profilePhoto || currentUser?.avatar || currentUser?.avatarUrl || currentUser?.profilePhoto || currentUser?.image || currentUser?.imageUrl;
                  const isFavorite = favoriteIds.some((id) => String(id) === String(resume.id));

                  return (
                    <Col xs={24} sm={12} lg={8} xl={6} key={resume.id}>
                      <Card
                        hoverable
                        style={{ height: "100%", borderRadius: radius + 2, overflow: "hidden", border: `1px solid ${isDarkMode ? "rgba(255,255,255,.08)" : "#E2EBEF"}` }}
                        styles={{ body: { padding: 14 } }}
                        cover={
                          <div style={{ position: "relative", height: 185, overflow: "hidden", background: isDarkMode ? "#142E39" : "#EAF0F3" }}>
                            {template?.thumbnail ? <img src={template.thumbnail} alt={template.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.72)" }} /> : <div style={{ height: "100%", display: "grid", placeItems: "center", fontSize: 48 }}><FilePdfOutlined /></div>}
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(8,20,25,.03),rgba(8,20,25,.84))" }} />
                            <Avatar size={56} src={avatar} icon={<UserOutlined />} style={{ position: "absolute", left: 14, bottom: 14, border: "2px solid #fff", background: PALETTE.deepSteelBlue }} />
                            <button type="button" onClick={(e) => { e.stopPropagation(); toggleFavorite(resume.id); }} style={{ position: "absolute", top: 11, right: 11, width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(255,255,255,.32)", background: "rgba(255,255,255,.16)", color: "#fff", cursor: "pointer", fontSize: 18 }}>{isFavorite ? "★" : "☆"}</button>
                            <div style={{ position: "absolute", left: 80, right: 48, bottom: 15, color: "#fff" }}>
                              <div style={{ fontSize: 14, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{data.personalInfo?.firstName} {data.personalInfo?.lastName}</div>
                              <div style={{ fontSize: 10, opacity: .82, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{resume.title || data.personalInfo?.professionalTitle || "Resume"}</div>
                            </div>
                          </div>
                        }
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <Tag color="cyan" style={{ margin: 0 }}>{template?.name || "Resume"}</Tag>
                          <Text type="secondary" style={{ fontSize: 10 }}>{data.projects?.length || 0} projects</Text>
                        </div>
                        <Space orientation="horizontal" wrap size={[5, 6]} style={{ marginTop: 12 }}>
                          <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => openExistingResume(resume)}>{t.open}</Button>
                          <Button size="small" icon={<CopyOutlined />} onClick={() => duplicateResume(resume)}>Duplicate</Button>
                          <Button size="small" icon={<ShareAltOutlined />} onClick={() => openShareModal(resume)}>Share</Button>
                          <Button size="small" icon={<QrcodeOutlined />} onClick={() => openQrModal(resume)}>QR</Button>
                          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => deleteResume(resume.id)}>{t.delete}</Button>
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Card>

          <Card
            style={{ marginTop: 24, borderRadius: radius, background: isDarkMode ? "#1B3B4B" : "#FFFFFF", border: `1px solid ${isDarkMode ? "rgba(255,255,255,.08)" : "#E4EBEF"}` }}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{ padding: "23px 26px", borderBottom: `1px solid ${colors.divider}`, background: isDarkMode ? "linear-gradient(135deg,#163743,#10252D)" : "linear-gradient(135deg,#F3F8FA,#ECF4F7)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center", background: isDarkMode ? "#1C5368" : "#DFF0F6", color: PALETTE.deepSteelBlue, fontSize: 19 }}><FilePdfOutlined /></div>
                  <div><Title level={4} style={{ margin: 0 }}>Sertifikatlar va diplomlar</Title><Text type="secondary">Faqat PDF formatdagi hujjatlaringiz.</Text></div>
                </div>
                <Tag color="blue" style={{ margin: 0, borderRadius: 999 }}>{certificates.length} PDF</Tag>
              </div>
            </div>
            <div style={{ padding: 26 }}>
              <Upload.Dragger accept=".pdf,application/pdf" multiple={false} showUploadList={false} beforeUpload={prepareCertificateUpload}>
                <div style={{ padding: "14px 10px" }}><div style={{ width: 52, height: 52, borderRadius: 15, margin: "0 auto 12px", display: "grid", placeItems: "center", background: isDarkMode ? "#1A4351" : "#EAF5F9", color: PALETTE.deepSteelBlue, fontSize: 24 }}><CloudUploadOutlined /></div><div style={{ fontWeight: 800, color: colors.text }}>PDF faylni shu yerga tashlang</div><div style={{ marginTop: 5, color: colors.textSecondary, fontSize: 12 }}>yoki fayl tanlang · Maksimal 5 MB</div></div>
              </Upload.Dragger>
              {certificates.length ? (
                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                  {certificates.map((certificate) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={certificate.id}>
                      <Card size="small" hoverable style={{ borderRadius: 15, overflow: "hidden", height: "100%" }} styles={{ body: { padding: 12 } }}>
                        <CertificateThumbnail userId={currentUser?.id} certificateId={certificate.id} fallbackData={certificate.data} dark={isDarkMode} />
                        <div style={{ marginTop: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}><div title={certificate.title || certificate.name} style={{ minWidth: 0, fontWeight: 800, color: colors.text, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{certificate.title || certificate.name}</div><Tag color={certificate.credentialType === "diploma" ? "purple" : "blue"} bordered={false} style={{ margin: 0, fontSize: 9 }}>{certificate.credentialType === "diploma" ? "Diplom" : "Sertifikat"}</Tag></div>
                          {certificate.issuer && <div title={certificate.issuer} style={{ marginTop: 4, color: colors.textSecondary, fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{certificate.issuer}</div>}
                          <div style={{ marginTop: 5, color: colors.textSecondary, fontSize: 9 }}>{formatFileSize(certificate.size)}{certificate.issueDate ? ` · ${certificate.issueDate}` : ""}</div>
                          {certificate.description && <div style={{ marginTop: 7, color: colors.textSecondary, fontSize: 10, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{certificate.description}</div>}
                          <Space orientation="horizontal" size={2} style={{ marginTop: 8 }}><Button type="text" size="small" icon={<EyeOutlined />} onClick={() => openCertificate(certificate)} /><Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => downloadCertificateFile(certificate)} /><Button danger type="text" size="small" icon={<DeleteOutlined />} onClick={() => removeCertificate(certificate.id)} /></Space>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : <div style={{ marginTop: 18, textAlign: "center", color: colors.textSecondary, fontSize: 12 }}>Hali sertifikat yoki diplom yuklanmagan.</div>}
            </div>
          </Card>

          <Row gutter={[18, 18]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={10}><Card style={{ height: "100%", borderRadius: radius }}><Title level={4} style={{ marginTop: 0 }}>Profile completeness</Title><div style={{ display: "flex", alignItems: "center", gap: 18 }}><Progress type="circle" percent={profileCompletion} size={88} /><div><Text strong>{profileCompletion}% complete</Text><div style={{ marginTop: 7, color: colors.textSecondary, fontSize: 11 }}>Add missing profile data to make your CV stronger.</div><div style={{ marginTop: 8, color: colors.textSecondary, fontSize: 10 }}>{totalExperience} work experiences · {totalProjects} projects</div></div></div></Card></Col>
            <Col xs={24} lg={14}><Card style={{ height: "100%", borderRadius: radius }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><Title level={4} style={{ margin: 0 }}>Recent activity</Title><Tag style={{ margin: 0 }}>{activities.length}</Tag></div>{activities.length ? <div style={{ display: "grid", gap: 9 }}>{activities.slice(0,5).map((activity) => <div key={activity.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 12, background: isDarkMode ? "#122A35" : "#F8FAFB" }}><CheckOutlined style={{ color: PALETTE.deepSteelBlue }} /><div style={{ minWidth: 0 }}><div style={{ color: colors.text, fontWeight: 700, fontSize: 11 }}>{activity.title}</div><div style={{ color: colors.textSecondary, fontSize: 9, marginTop: 2 }}>{activity.subtitle}</div></div><div style={{ marginLeft: "auto", color: colors.textSecondary, fontSize: 8, whiteSpace: "nowrap" }}>{new Date(activity.createdAt).toLocaleDateString()}</div></div>)}</div> : <Text type="secondary">Your resume activity will appear here.</Text>}</Card></Col>
          </Row>

          </div>
        {/* ====================================================
            FULLSCREEN RESUME MODAL
        ==================================================== */}

        <Modal
          open={
            isBuilderOpen
          }
          onCancel={() =>
            setIsBuilderOpen(
              false
            )
          }
          footer={
            null
          }
          centered={
            false
          }
          width="100%"
          closable={
            true
          }
          destroyOnHidden
          className={`resume-builder-modal ${
            isDarkMode
              ? "resume-builder-dark"
              : "resume-builder-light"
          }`}
          styles={{
            wrapper: {
              padding:
                0,
            },

            content: {
              padding:
                0,

              margin:
                0,

              borderRadius:
                0,

              minHeight:
                "100vh",

              height:
                "100vh",

              overflow:
                "hidden",

              background:
                colors.topbar ||
                colors.panel,
            },

            header: {
              margin:
                0,

              padding:
                "16px 28px",

              borderBottom:
                `1px solid ${colors.border}`,

              background:
                colors.topbar ||
                colors.panel,
            },

            body: {
              padding:
                0,

              height:
                "calc(100vh - 72px)",

              overflow:
                "hidden",

              background:
                colors.page,
            },
          }}
          title={
            <div
              style={{
                color:
                  colors.text,

                fontWeight:
                  800,

                fontSize:
                  18,
              }}
            >
              {builderStep ===
                "form"
                ? t.createResume
                : builderStep ===
                  "templates"
                ? t.chooseTemplate
                : builderStep ===
                  "generating"
                ? t.generating
                : t.resumeReady}
            </div>
          }
        >
          <div
            className="resume-builder-root"
            style={{
              height:
                "100%",

              display:
                "flex",

              flexDirection:
                "column",

              background:
                colors.page,

              color:
                colors.text,
            }}
          >
            {/* =================================================
                TOP BUILDER NAV
            ================================================= */}

            <div
              style={{
                flexShrink:
                  0,

                height:
                  76,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                gap:
                  20,

                padding:
                  "0 32px",

                background:
                  colors.topbar ||
                  colors.panel,

                borderBottom:
                  `1px solid ${colors.border}`,

                boxShadow:
                  isDarkMode
                    ? "0 4px 18px rgba(0,0,0,.16)"
                    : "0 4px 14px rgba(0,0,0,.04)",

                position:
                  "relative",

                zIndex:
                  10,
              }}
            >
              <div>
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      10,
                  }}
                >
                  <div
                    style={{
                      width:
                        34,

                      height:
                        34,

                      borderRadius:
                        10,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      background:
                        colors.accentSoft,

                      color:
                        colors.accent,

                      fontWeight:
                        900,
                    }}
                  >
                    CV
                  </div>

                  <div
                    style={{
                      fontWeight:
                        800,

                      fontSize:
                        16,

                      color:
                        colors.text,
                    }}
                  >
                    Resume Builder
                  </div>
                </div>

                <div
                  style={{
                    marginTop:
                      3,

                    color:
                      colors.textSecondary,

                    fontSize:
                      12,
                  }}
                >
                  {builderStep ===
                    "form" &&
                    "Step 1 · Information"}

                  {builderStep ===
                    "templates" &&
                    "Step 2 · Template"}

                  {builderStep ===
                    "generating" &&
                    "Step 3 · Generating"}

                  {builderStep ===
                    "preview" &&
                    "Step 4 · Preview"}
                </div>
              </div>

              {currentUser && (
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      10,

                    padding:
                      "7px 12px",

                    borderRadius:
                      14,

                    border:
                      `1px solid ${colors.border}`,

                    background:
                      colors.section,
                  }}
                >
                  <Avatar
                    size={
                      38
                    }
                    src={
                      currentUser.avatar
                    }
                    icon={
                      <UserOutlined />
                    }
                  />

                  <div>
                    <div
                      style={{
                        fontWeight:
                          700,

                        fontSize:
                          13,

                        color:
                          colors.text,
                      }}
                    >
                      {currentUser.fullName ||
                        currentUser.name ||
                        currentUser.email}
                    </div>

                    <div
                      style={{
                        fontSize:
                          11,

                        color:
                          colors.textSecondary,
                      }}
                    >
                      {currentUser.email ||
                        ""}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                BODY
            ================================================= */}

            <div
              style={{
                flex:
                  1,

                minHeight:
                  0,

                overflow:
                  "hidden",

                position:
                  "relative",
              }}
            >
              {/* =================================================
                  FORM
              ================================================= */}

              {builderStep ===
                "form" && (
                <div
                  style={{
                    height:
                      "100%",

                    overflowY:
                      "auto",

                    padding:
                      "34px 40px 120px",

                    background:
                      colors.page,
                  }}
                >
                  <div
                    style={{
                      width:
                        "100%",

                      maxWidth:
                        1450,

                      margin:
                        "0 auto",
                    }}
                  >
                    {loadingUser ? (
                      <div
                        style={{
                          minHeight:
                            600,

                          display:
                            "flex",

                          flexDirection:
                            "column",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",
                        }}
                      >
                        <div
                          className="loader-ring"
                          style={{
                            borderTopColor:
                              colors.accent,

                            borderColor:
                              colors.border,
                          }}
                        />

                        <div
                          style={{
                            marginTop:
                              18,

                            fontWeight:
                              700,

                            color:
                              colors.text,
                          }}
                        >
                          Loading profile...
                        </div>
                      </div>
                    ) : userError ? (
                      <Card
                        style={{
                          background:
                            colors.section,

                          borderColor:
                            colors.border,
                        }}
                      >
                        <Text type="danger">
                          {
                            userError
                          }
                        </Text>
                      </Card>
                    ) : (
                      <form
                        onSubmit={
                          handleFormSubmit
                        }
                      >
                        {/* INFO NOTICE */}

                        <div
                          style={{
                            marginBottom:
                              30,

                            padding:
                              "18px 20px",

                            borderRadius:
                              16,

                            background:
                              colors.accentSoft,

                            border:
                              `1px solid ${colors.border}`,

                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap:
                              14,
                          }}
                        >
                          <CheckCircleFilled
                            style={{
                              color:
                                colors.accent,

                              fontSize:
                                22,
                            }}
                          />

                          <div>
                            <div
                              style={{
                                fontWeight:
                                  700,

                                color:
                                  colors.text,
                              }}
                            >
                              {
                                t.allYourData
                              }
                            </div>

                            <div
                              style={{
                                marginTop:
                                  3,

                                fontSize:
                                  12,

                                color:
                                  colors.textSecondary,
                              }}
                            >
                              {
                                currentUser?.email ||
                                ""
                              }
                            </div>
                          </div>
                        </div>

                        {/* PERSONAL */}

                        <ResumeSectionDark
                          title={
                            t.personalInfo
                          }
                          colors={
                            colors
                          }
                        >
                          <Row
                            gutter={[
                              24,
                              24,
                            ]}
                          >
                            <Col
                              xs={
                                24
                              }
                              md={
                                12
                              }
                              xl={
                                8
                              }
                            >
                              <LargeField
                                label={
                                  t.firstName
                                }
                                value={
                                  resumeData
                                    .personalInfo
                                    .firstName
                                }
                                onChange={(
                                  value
                                ) =>
                                  updatePersonal(
                                    "firstName",
                                    value
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                12
                              }
                              xl={
                                8
                              }
                            >
                              <LargeField
                                label={
                                  t.lastName
                                }
                                value={
                                  resumeData
                                    .personalInfo
                                    .lastName
                                }
                                onChange={(
                                  value
                                ) =>
                                  updatePersonal(
                                    "lastName",
                                    value
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                12
                              }
                              xl={
                                8
                              }
                            >
                              <TitleField
                                label={
                                  t.professionalTitle
                                }
                                value={
                                  resumeData
                                    .personalInfo
                                    .professionalTitle
                                }
                                onChange={(
                                  value
                                ) =>
                                  updatePersonal(
                                    "professionalTitle",
                                    value
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                12
                              }
                              xl={
                                8
                              }
                            >
                              <LargeField
                                label={
                                  t.email
                                }
                                value={
                                  resumeData
                                    .personalInfo
                                    .email
                                }
                                onChange={(
                                  value
                                ) =>
                                  updatePersonal(
                                    "email",
                                    value
                                  )
                                }
                                status={
                                  resumeData
                                    .personalInfo
                                    .email &&
                                  !isValidEmail(
                                    resumeData
                                      .personalInfo
                                      .email
                                  )
                                    ? "error"
                                    : ""
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                12
                              }
                              xl={
                                8
                              }
                            >
                              <PhoneField
                                label={
                                  t.phone
                                }
                                value={
                                  resumeData
                                    .personalInfo
                                    .phone
                                }
                                onChange={(
                                  value
                                ) =>
                                  updatePersonal(
                                    "phone",
                                    formatPhone(
                                      value
                                    )
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                12
                              }
                              xl={
                                8
                              }
                            >
                              <LocationField
                                label={
                                  t.location
                                }
                                value={
                                  resumeData
                                    .personalInfo
                                    .location
                                }
                                onChange={(
                                  value
                                ) =>
                                  updatePersonal(
                                    "location",
                                    value
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                12
                              }
                              xl={
                                8
                              }
                            >
                              <LargeField
                                label={
                                  t.portfolio
                                }
                                value={
                                  resumeData
                                    .personalInfo
                                    .portfolio
                                }
                                onChange={(
                                  value
                                ) =>
                                  updatePersonal(
                                    "portfolio",
                                    formatUrl(
                                      value
                                    )
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                12
                              }
                              xl={
                                8
                              }
                            >
                              <LargeField
                                label={
                                  t.website
                                }
                                value={
                                  resumeData
                                    .socialLinks
                                    .website
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSocial(
                                    "website",
                                    formatUrl(
                                      value
                                    )
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>
                          </Row>

                          {/* PHOTO */}

                          <div
                            style={{
                              marginTop:
                                28,

                              padding:
                                24,

                              borderRadius:
                                18,

                              background:
                                colors.input,

                              border:
                                `1px solid ${colors.border}`,
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  20,

                                flexWrap:
                                  "wrap",
                              }}
                            >
                              <Avatar
                                size={
                                  104
                                }
                                src={
                                  resumeData
                                    .personalInfo
                                    .profilePhoto
                                }
                                icon={
                                  <UserOutlined />
                                }
                                style={{
                                  flexShrink:
                                    0,

                                  border:
                                    `3px solid ${colors.border}`,
                                }}
                              />

                              <div>
                                <Text
                                  strong
                                  style={{
                                    display:
                                      "block",

                                    marginBottom:
                                      10,

                                    color:
                                      colors.text,

                                    fontSize:
                                      14,
                                  }}
                                >
                                  {
                                    t.profilePhoto
                                  }
                                </Text>

                                <Upload
                                  accept="image/png,image/jpeg,image/webp"
                                  showUploadList={
                                    false
                                  }
                                  beforeUpload={
                                    handlePhotoUpload
                                  }
                                >
                                  <Button
                                    size="large"
                                    icon={
                                      <UploadOutlined />
                                    }
                                    style={{
                                      height:
                                        46,
                                    }}
                                  >
                                    {
                                      t.uploadPhoto
                                    }
                                  </Button>
                                </Upload>

                                <div
                                  style={{
                                    marginTop:
                                      8,

                                    fontSize:
                                      12,

                                    color:
                                      colors.textSecondary,
                                  }}
                                >
                                  JPG, PNG, WEBP
                                </div>
                              </div>
                            </div>
                          </div>
                        </ResumeSectionDark>

                        {/* SUMMARY */}

                        <ResumeSectionDark
                          title={
                            t.summary
                          }
                          colors={
                            colors
                          }
                        >
                          <Input.TextArea
                            rows={
                              7
                            }
                            value={
                              resumeData.professionalSummary
                            }
                            onChange={(
                              e
                            ) =>
                              updateField(
                                "professionalSummary",
                                e.target
                                  .value
                              )
                            }
                            style={{
                              background:
                                colors.input,

                              color:
                                colors.text,

                              borderColor:
                                colors.border,

                              fontSize:
                                15,

                              padding:
                                15,
                            }}
                          />
                        </ResumeSectionDark>

                        {/* EXPERIENCE */}

                        <ResumeSectionDark
                          title={
                            t.workExperience
                          }
                          colors={
                            colors
                          }
                        >
                          <Space
                            direction="vertical"
                            size={
                              22
                            }
                            style={{
                              width:
                                "100%",
                            }}
                          >
                            {resumeData.workExperience.map(
                              (
                                item,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  style={{
                                    padding:
                                      24,

                                    borderRadius:
                                      18,

                                    background:
                                      colors.section,

                                    border:
                                      `1px solid ${colors.border}`,

                                    boxShadow:
                                      isDarkMode
                                        ? "0 8px 24px rgba(0,0,0,.12)"
                                        : "0 5px 18px rgba(0,0,0,.04)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display:
                                        "flex",

                                      alignItems:
                                        "center",

                                      justifyContent:
                                        "space-between",

                                      marginBottom:
                                        22,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize:
                                          17,

                                        fontWeight:
                                          800,

                                        color:
                                          colors.text,
                                      }}
                                    >
                                      {
                                        t.workExperience
                                      }{" "}
                                      #
                                      {index +
                                        1}
                                    </div>

                                    <Button
                                      danger
                                      icon={
                                        <DeleteOutlined />
                                      }
                                      onClick={() =>
                                        removeArrayItem(
                                          "workExperience",
                                          index
                                        )
                                      }
                                    >
                                      {
                                        t.remove
                                      }
                                    </Button>
                                  </div>

                                  <Row
                                    gutter={[
                                      20,
                                      20,
                                    ]}
                                  >
                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        12
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.position
                                        }
                                        value={
                                          item.position ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateExperience(
                                            index,
                                            "position",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        12
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.company
                                        }
                                        value={
                                          item.company ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateExperience(
                                            index,
                                            "company",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        8
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.location
                                        }
                                        value={
                                          item.location ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateExperience(
                                            index,
                                            "location",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        8
                                      }
                                    >
                                      <MonthField
                                        label={
                                          t.from
                                        }
                                        value={
                                          item.from ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateExperience(
                                            index,
                                            "from",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        8
                                      }
                                    >
                                      <MonthField
                                        label={
                                          t.to
                                        }
                                        value={
                                          item.to ||
                                          ""
                                        }
                                        disabled={
                                          !!item.present
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateExperience(
                                            index,
                                            "to",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      span={
                                        24
                                      }
                                    >
                                      <label
                                        style={{
                                          display:
                                            "flex",

                                          alignItems:
                                            "center",

                                          gap:
                                            10,

                                          color:
                                            colors.text,

                                          cursor:
                                            "pointer",

                                          fontSize:
                                            14,
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={
                                            !!item.present
                                          }
                                          onChange={(
                                            e
                                          ) =>
                                            updateExperience(
                                              index,
                                              "present",
                                              e
                                                .target
                                                .checked
                                            )
                                          }
                                        />

                                        {
                                          t.present
                                        }
                                      </label>
                                    </Col>

                                    <Col
                                      span={
                                        24
                                      }
                                    >
                                      <Text
                                        strong
                                        style={{
                                          display:
                                            "block",

                                          marginBottom:
                                            9,

                                          color:
                                            colors.text,
                                        }}
                                      >
                                        {
                                          t.responsibilities
                                        }
                                      </Text>

                                      <Input.TextArea
                                        rows={
                                          6
                                        }
                                        value={
                                          item.responsibilities ||
                                          ""
                                        }
                                        onChange={(
                                          e
                                        ) =>
                                          updateExperience(
                                            index,
                                            "responsibilities",
                                            e.target
                                              .value
                                          )
                                        }
                                        style={{
                                          background:
                                            colors.input,

                                          color:
                                            colors.text,

                                          borderColor:
                                            colors.border,

                                          fontSize:
                                            15,

                                          padding:
                                            15,
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              )
                            )}

                            <Button
                              type="dashed"
                              size="large"
                              icon={
                                <PlusOutlined />
                              }
                              onClick={() =>
                                addArrayItem(
                                  "workExperience",
                                  {
                                    position:
                                      "",
                                    company:
                                      "",
                                    location:
                                      "",
                                    from:
                                      "",
                                    to:
                                      "",
                                    present:
                                      false,
                                    dates:
                                      "",
                                    responsibilities:
                                      "",
                                  }
                                )
                              }
                              style={{
                                height:
                                  54,

                                width:
                                  "100%",
                              }}
                            >
                              {
                                t.addExperience
                              }
                            </Button>
                          </Space>
                        </ResumeSectionDark>

                        {/* EDUCATION */}

                        <ResumeSectionDark
                          title={
                            t.education
                          }
                          colors={
                            colors
                          }
                        >
                          <Space
                            direction="vertical"
                            size={
                              22
                            }
                            style={{
                              width:
                                "100%",
                            }}
                          >
                            {resumeData.education.map(
                              (
                                item,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  style={{
                                    padding:
                                      24,

                                    borderRadius:
                                      18,

                                    background:
                                      colors.section,

                                    border:
                                      `1px solid ${colors.border}`,
                                  }}
                                >
                                  <div
                                    style={{
                                      display:
                                        "flex",

                                      justifyContent:
                                        "space-between",

                                      alignItems:
                                        "center",

                                      marginBottom:
                                        22,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize:
                                          17,

                                        fontWeight:
                                          800,

                                        color:
                                          colors.text,
                                      }}
                                    >
                                      {
                                        t.education
                                      }{" "}
                                      #
                                      {index +
                                        1}
                                    </div>

                                    <Button
                                      danger
                                      icon={
                                        <DeleteOutlined />
                                      }
                                      onClick={() =>
                                        removeArrayItem(
                                          "education",
                                          index
                                        )
                                      }
                                    >
                                      {
                                        t.remove
                                      }
                                    </Button>
                                  </div>

                                  <Row
                                    gutter={[
                                      20,
                                      20,
                                    ]}
                                  >
                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        12
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.degree
                                        }
                                        value={
                                          item.degree ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateEducation(
                                            index,
                                            "degree",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        12
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.institution
                                        }
                                        value={
                                          item.institution ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateEducation(
                                            index,
                                            "institution",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        12
                                      }
                                      md={
                                        12
                                      }
                                    >
                                      <MonthField
                                        label={
                                          t.from
                                        }
                                        value={
                                          item.from ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateEducation(
                                            index,
                                            "from",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        12
                                      }
                                      md={
                                        12
                                      }
                                    >
                                      <MonthField
                                        label={
                                          t.to
                                        }
                                        value={
                                          item.to ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateEducation(
                                            index,
                                            "to",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              )
                            )}

                            <Button
                              type="dashed"
                              size="large"
                              icon={
                                <PlusOutlined />
                              }
                              onClick={() =>
                                addArrayItem(
                                  "education",
                                  {
                                    degree:
                                      "",
                                    institution:
                                      "",
                                    from:
                                      "",
                                    to:
                                      "",
                                    dates:
                                      "",
                                  }
                                )
                              }
                              style={{
                                height:
                                  54,

                                width:
                                  "100%",
                              }}
                            >
                              {
                                t.addEducation
                              }
                            </Button>
                          </Space>
                        </ResumeSectionDark>

                        {/* SKILLS */}

                        <ResumeSectionDark
                          title={
                            t.skills
                          }
                          colors={
                            colors
                          }
                        >
                          <SkillChips
                            skills={
                              resumeData.skills
                            }
                            onAdd={(
                              value
                            ) => {
                              const clean =
                                value.trim();

                              if (
                                !clean
                              )
                                return;

                              const exists =
                                resumeData.skills.some(
                                  (
                                    item
                                  ) =>
                                    item.name
                                      .toLowerCase() ===
                                    clean.toLowerCase()
                                );

                              if (
                                !exists
                              ) {
                                addArrayItem(
                                  "skills",
                                  {
                                    name:
                                      clean,
                                    level:
                                      70,
                                  }
                                );
                              }
                            }}
                            onRemove={(
                              index
                            ) =>
                              removeArrayItem(
                                "skills",
                                index
                              )
                            }
                            onLevelChange={(
                              index,
                              level
                            ) =>
                              updateArrayItem(
                                "skills",
                                index,
                                "level",
                                Number(
                                  level
                                )
                              )
                            }
                            placeholder={
                              t.skillPlaceholder
                            }
                            colors={
                              colors
                            }
                          />
                        </ResumeSectionDark>

                        {/* LANGUAGES */}

                        <ResumeSectionDark
                          title={
                            t.languages
                          }
                          colors={
                            colors
                          }
                        >
                          <LanguageChips
                            languages={
                              resumeData.languages
                            }
                            onAdd={(
                              value
                            ) => {
                              const clean =
                                value.trim();

                              if (
                                !clean
                              )
                                return;

                              const exists =
                                resumeData.languages.some(
                                  (
                                    item
                                  ) =>
                                    item.language
                                      .toLowerCase() ===
                                    clean.toLowerCase()
                                );

                              if (
                                !exists
                              ) {
                                addArrayItem(
                                  "languages",
                                  {
                                    language:
                                      clean,
                                    level:
                                      "",
                                  }
                                );
                              }
                            }}
                            onRemove={(
                              index
                            ) =>
                              removeArrayItem(
                                "languages",
                                index
                              )
                            }
                            onLevelChange={(
                              index,
                              level
                            ) =>
                              updateArrayItem(
                                "languages",
                                index,
                                "level",
                                level
                              )
                            }
                            placeholder={
                              t.languagePlaceholder
                            }
                            colors={
                              colors
                            }
                          />
                        </ResumeSectionDark>

                        {/* PROJECTS */}

                        <ResumeSectionDark
                          title={
                            t.projects
                          }
                          colors={
                            colors
                          }
                        >
                          <Space
                            direction="vertical"
                            size={
                              22
                            }
                            style={{
                              width:
                                "100%",
                            }}
                          >
                            {resumeData.projects.map(
                              (
                                item,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  style={{
                                    padding:
                                      24,

                                    borderRadius:
                                      18,

                                    background:
                                      colors.section,

                                    border:
                                      `1px solid ${colors.border}`,
                                  }}
                                >
                                  <div
                                    style={{
                                      display:
                                        "flex",

                                      alignItems:
                                        "center",

                                      justifyContent:
                                        "space-between",

                                      marginBottom:
                                        22,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize:
                                          17,

                                        fontWeight:
                                          800,

                                        color:
                                          colors.text,
                                      }}
                                    >
                                      {
                                        t.projects
                                      }{" "}
                                      #
                                      {index +
                                        1}
                                    </div>

                                    <Button
                                      danger
                                      icon={
                                        <DeleteOutlined />
                                      }
                                      onClick={() =>
                                        removeArrayItem(
                                          "projects",
                                          index
                                        )
                                      }
                                    >
                                      {
                                        t.remove
                                      }
                                    </Button>
                                  </div>

                                  <Row
                                    gutter={[
                                      20,
                                      20,
                                    ]}
                                  >
                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        12
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.projectName
                                        }
                                        value={
                                          item.name ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateArrayItem(
                                            "projects",
                                            index,
                                            "name",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        12
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.projectLink
                                        }
                                        value={
                                          item.link ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateArrayItem(
                                            "projects",
                                            index,
                                            "link",
                                            formatUrl(
                                              value
                                            )
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      span={
                                        24
                                      }
                                    >
                                      <Text
                                        strong
                                        style={{
                                          display:
                                            "block",

                                          marginBottom:
                                            9,

                                          color:
                                            colors.text,
                                        }}
                                      >
                                        {
                                          t.description
                                        }
                                      </Text>

                                      <Input.TextArea
                                        rows={
                                          5
                                        }
                                        value={
                                          item.description ||
                                          ""
                                        }
                                        onChange={(
                                          e
                                        ) =>
                                          updateArrayItem(
                                            "projects",
                                            index,
                                            "description",
                                            e.target
                                              .value
                                          )
                                        }
                                        style={{
                                          background:
                                            colors.input,

                                          color:
                                            colors.text,

                                          borderColor:
                                            colors.border,

                                          padding:
                                            15,

                                          fontSize:
                                            15,
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              )
                            )}

                            <Button
                              type="dashed"
                              size="large"
                              icon={
                                <PlusOutlined />
                              }
                              onClick={() =>
                                addArrayItem(
                                  "projects",
                                  {
                                    name:
                                      "",
                                    link:
                                      "",
                                    description:
                                      "",
                                  }
                                )
                              }
                              style={{
                                height:
                                  54,

                                width:
                                  "100%",
                              }}
                            >
                              {
                                t.addProject
                              }
                            </Button>
                          </Space>
                        </ResumeSectionDark>

                        {/* CERTIFICATES */}

                        <ResumeSectionDark
                          title={
                            t.certificates
                          }
                          colors={
                            colors
                          }
                        >
                          <Space
                            direction="vertical"
                            size={
                              18
                            }
                            style={{
                              width:
                                "100%",
                            }}
                          >
                            {resumeData.certifications.map(
                              (
                                item,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
                                  style={{
                                    padding:
                                      24,

                                    borderRadius:
                                      18,

                                    background:
                                      colors.section,

                                    border:
                                      `1px solid ${colors.border}`,
                                  }}
                                >
                                  <Row
                                    gutter={[
                                      20,
                                      20,
                                    ]}
                                    align="bottom"
                                  >
                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        8
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.certificate
                                        }
                                        value={
                                          item.name ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateArrayItem(
                                            "certifications",
                                            index,
                                            "name",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        24
                                      }
                                      md={
                                        8
                                      }
                                    >
                                      <LargeField
                                        label={
                                          t.organization
                                        }
                                        value={
                                          item.organization ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateArrayItem(
                                            "certifications",
                                            index,
                                            "organization",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        18
                                      }
                                      md={
                                        6
                                      }
                                    >
                                      <MonthField
                                        label={
                                          t.date
                                        }
                                        value={
                                          item.date ||
                                          ""
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          updateArrayItem(
                                            "certifications",
                                            index,
                                            "date",
                                            value
                                          )
                                        }
                                        colors={
                                          colors
                                        }
                                      />
                                    </Col>

                                    <Col
                                      xs={
                                        6
                                      }
                                      md={
                                        2
                                      }
                                    >
                                      <Button
                                        danger
                                        icon={
                                          <DeleteOutlined />
                                        }
                                        onClick={() =>
                                          removeArrayItem(
                                            "certifications",
                                            index
                                          )
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              )
                            )}

                            <Button
                              type="dashed"
                              size="large"
                              icon={
                                <PlusOutlined />
                              }
                              onClick={() =>
                                addArrayItem(
                                  "certifications",
                                  {
                                    name:
                                      "",
                                    organization:
                                      "",
                                    date:
                                      "",
                                  }
                                )
                              }
                              style={{
                                height:
                                  54,

                                width:
                                  "100%",
                              }}
                            >
                              {
                                t.addCertificate
                              }
                            </Button>
                          </Space>
                        </ResumeSectionDark>

                        {/* SOCIAL */}

                        <ResumeSectionDark
                          title={
                            t.socialLinks
                          }
                          colors={
                            colors
                          }
                        >
                          <Row
                            gutter={[
                              20,
                              20,
                            ]}
                          >
                            <Col
                              xs={
                                24
                              }
                              md={
                                8
                              }
                            >
                              <LargeField
                                label={
                                  t.github
                                }
                                value={
                                  resumeData
                                    .socialLinks
                                    .github
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSocial(
                                    "github",
                                    formatUrl(
                                      value
                                    )
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                8
                              }
                            >
                              <LargeField
                                label={
                                  t.linkedin
                                }
                                value={
                                  resumeData
                                    .socialLinks
                                    .linkedin
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSocial(
                                    "linkedin",
                                    formatUrl(
                                      value
                                    )
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>

                            <Col
                              xs={
                                24
                              }
                              md={
                                8
                              }
                            >
                              <LargeField
                                label={
                                  t.telegram
                                }
                                value={
                                  resumeData
                                    .socialLinks
                                    .telegram
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSocial(
                                    "telegram",
                                    formatUrl(
                                      value
                                    )
                                  )
                                }
                                colors={
                                  colors
                                }
                              />
                            </Col>
                          </Row>
                        </ResumeSectionDark>

                        {/* HOBBIES */}

                        <ResumeSectionDark
                          title={
                            t.hobbies
                          }
                          colors={
                            colors
                          }
                        >
                          <Input.TextArea
                            rows={
                              5
                            }
                            value={
                              resumeData.hobbies.join(
                                ", "
                              )
                            }
                            onChange={(
                              e
                            ) =>
                              updateField(
                                "hobbies",
                                e.target.value
                                  .split(
                                    ","
                                  )
                                  .map(
                                    (
                                      item
                                    ) =>
                                      item.trim()
                                  )
                                  .filter(
                                    Boolean
                                  )
                              )
                            }
                            style={{
                              background:
                                colors.input,

                              color:
                                colors.text,

                              borderColor:
                                colors.border,

                              padding:
                                15,

                              fontSize:
                                15,
                            }}
                          />
                        </ResumeSectionDark>

                        {/* STICKY FOOTER */}

                        <div
                          style={{
                            bottom:
                              0,

                            zIndex:
                              30,

                            marginTop:
                              30,

                            padding:
                              "18px 0",

                            background:
                              colors.page,

                            borderTop:
                              `1px solid ${colors.border}`,

                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems:
                              "center",

                            gap:
                              15,
                          }}
                        >
                          <Button
                            size="large"
                            icon={
                              <ReloadOutlined />
                            }
                            onClick={
                              loadCurrentUser
                            }
                          >
                            {
                              t.reloadProfile
                            }
                          </Button>

                          <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            style={{
                              height:
                                52,

                              padding:
                                "0 30px",

                              background:
                                PALETTE.deepSteelBlue,

                              borderColor:
                                PALETTE.deepSteelBlue,

                              fontWeight:
                                800,
                            }}
                          >
                            {
                              t.continue
                            }{" "}
                            →
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* =================================================
                  TEMPLATE SELECTION
              ================================================= */}

              {builderStep ===
                "templates" && (
                <div
                  style={{
                    height:
                      "100%",

                    overflowY:
                      "auto",

                    padding:
                      "40px 40px 100px",

                    background:
                      colors.page,
                  }}
                >
                  <div
                    style={{
                      maxWidth:
                        1450,

                      margin:
                        "0 auto",
                    }}
                  >
                    <div
                      style={{
                        marginBottom:
                          30,
                      }}
                    >
                      <Title
                        level={
                          2
                        }
                        style={{
                          margin:
                            0,

                          color:
                            colors.text,
                        }}
                      >
                        {
                          t.chooseTemplate
                        }
                      </Title>

                      <Text
                        style={{
                          color:
                            colors.textSecondary,
                        }}
                      >
                        10 ta professional template'dan birini tanlang.
                      </Text>
                    </div>

                    <Row
                      gutter={[
                        24,
                        24,
                      ]}
                    >
                      {TEMPLATES_REGISTRY.map(
                        (
                          template
                        ) => {
                          const selected =
                            template.id ===
                            selectedTemplateId;

                          return (
                            <Col
                              key={
                                template.id
                              }
                              xs={
                                24
                              }
                              sm={
                                12
                              }
                              md={
                                8
                              }
                              lg={
                                6
                              }
                              xl={
                                4
                              }
                            >
                              <div
                                onClick={() =>
                                  selectTemplate(
                                    template
                                  )
                                }
                                style={{
                                  background:
                                    colors.section,

                                  border:
                                    selected
                                      ? `2px solid ${primaryColor}`
                                      : `1px solid ${colors.border}`,

                                  borderRadius:
                                    18,

                                  overflow:
                                    "hidden",

                                  cursor:
                                    "pointer",

                                  transition:
                                    "all .2s ease",

                                  boxShadow:
                                    selected
                                      ? `0 12px 30px rgba(77,156,191,.16)`
                                      : "none",
                                }}
                              >
                                <div
                                  style={{
                                    position:
                                      "relative",

                                    aspectRatio:
                                      "3 / 4",

                                    overflow:
                                      "hidden",

                                    background:
                                      "#E6EDF0",
                                  }}
                                >
                                  <img
                                    src={
                                      template.thumbnail
                                    }
                                    alt={
                                      template.name
                                    }
                                    style={{
                                      width:
                                        "100%",

                                      height:
                                        "100%",

                                      objectFit:
                                        "cover",
                                    }}
                                  />

                                  {selected && (
                                    <div
                                      style={{
                                        position:
                                          "absolute",

                                        top:
                                          14,

                                        right:
                                          14,

                                        width:
                                          38,

                                        height:
                                          38,

                                        borderRadius:
                                          "50%",

                                        background:
                                          primaryColor,

                                        display:
                                          "flex",

                                        alignItems:
                                          "center",

                                        justifyContent:
                                          "center",

                                        color:
                                          "#fff",

                                        fontSize:
                                          19,

                                        boxShadow:
                                          "0 5px 15px rgba(0,0,0,.2)",
                                      }}
                                    >
                                      ✓
                                    </div>
                                  )}
                                </div>

                                <div
                                  style={{
                                    padding:
                                      16,
                                  }}
                                >
                                  <div
                                    style={{
                                      color:
                                        colors.text,

                                      fontWeight:
                                        800,

                                      fontSize:
                                        14,
                                    }}
                                  >
                                    {
                                      template.name
                                    }
                                  </div>

                                  <div
                                    style={{
                                      marginTop:
                                        5,

                                      fontSize:
                                        11,

                                      textTransform:
                                        "uppercase",

                                      letterSpacing:
                                        1,

                                      color:
                                        colors.textSecondary,
                                    }}
                                  >
                                    {
                                      template.orientation
                                    }
                                  </div>
                                </div>
                              </div>
                            </Col>
                          );
                        }
                      )}
                    </Row>

                    {/* COLOR */}

                    <div
                      style={{
                        marginTop:
                          34,

                        padding:
                          24,

                        borderRadius:
                          18,

                        background:
                          colors.section,

                        border:
                          `1px solid ${colors.border}`,
                      }}
                    >
                      <div
                        style={{
                          fontWeight:
                            800,

                          color:
                            colors.text,

                          marginBottom:
                            12,
                        }}
                      >
                        {
                          t.primaryColor
                        }
                      </div>

                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            12,
                        }}
                      >
                        <input
                          type="color"
                          value={
                            primaryColor
                          }
                          onChange={(
                            e
                          ) =>
                            setPrimaryColor(
                              e.target
                                .value
                            )
                          }
                          style={{
                            width:
                              60,

                            height:
                              44,

                            border:
                              "none",

                            background:
                              "transparent",

                            cursor:
                              "pointer",
                          }}
                        />

                        <Input
                          size="large"
                          value={
                            primaryColor
                          }
                          onChange={(
                            e
                          ) =>
                            setPrimaryColor(
                              e.target
                                .value
                            )
                          }
                          style={{
                            maxWidth:
                              240,

                            background:
                              colors.input,

                            color:
                              colors.text,
                          }}
                        />
                      </div>
                    </div>

                    {/* NAV */}

                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        marginTop:
                          30,
                      }}
                    >
                      <Button
                        size="large"
                        onClick={() =>
                          setBuilderStep(
                            "form"
                          )
                        }
                      >
                        ←{" "}
                        {
                          t.back
                        }
                      </Button>

                      <Button
                        type="primary"
                        size="large"
                        onClick={
                          generateResume
                        }
                        style={{
                          minWidth:
                            240,

                          height:
                            52,

                          background:
                            primaryColor,

                          borderColor:
                            primaryColor,

                          fontWeight:
                            800,
                        }}
                      >
                        {
                          t.create
                        }{" "}
                        →
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  GENERATING
              ================================================= */}

              {builderStep ===
                "generating" && (
                <div
                  style={{
                    height:
                      "100%",

                    minHeight:
                      600,

                    display:
                      "flex",

                    flexDirection:
                      "column",

                    justifyContent:
                      "center",

                    alignItems:
                      "center",

                    textAlign:
                      "center",

                    background:
                      colors.page,
                  }}
                >
                  <div
                    style={{
                      width:
                        190,

                      height:
                        190,

                      borderRadius:
                        "50%",

                      background:
                        colors.section,

                      border:
                        `10px solid ${colors.border}`,

                      borderTopColor:
                        primaryColor,

                      boxShadow:
                        isDarkMode
                          ? "0 15px 50px rgba(0,0,0,.3)"
                          : "0 15px 50px rgba(0,0,0,.08)",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      animation:
                        "resumeSpin 1s linear infinite",
                    }}
                  >
                    <div
                      style={{
                        width:
                          130,

                        height:
                          130,

                        borderRadius:
                          "50%",

                        background:
                          colors.accentSoft,

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        animation:
                          "resumePulse 1.6s ease-in-out infinite",
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            52,

                          fontWeight:
                            900,

                          color:
                            colors.text,
                        }}
                      >
                        {
                          countdown
                        }
                      </span>
                    </div>
                  </div>

                  <Title
                    level={
                      2
                    }
                    style={{
                      marginTop:
                        35,

                      marginBottom:
                        10,

                      color:
                        colors.text,
                    }}
                  >
                    {
                      t.generating
                    }
                  </Title>

                  <Text
                    style={{
                      color:
                        colors.textSecondary,

                      fontSize:
                        15,
                    }}
                  >
                    {
                      t.generatingSubtitle
                    }
                  </Text>

                  <div
                    style={{
                      marginTop:
                        25,

                      width:
                        330,

                      height:
                        8,

                      background:
                        colors.border,

                      borderRadius:
                        999,

                      overflow:
                        "hidden",
                    }}
                  >
                    <div
                      style={{
                        height:
                          "100%",

                        width: `${
                          ((5 -
                            countdown) /
                            5) *
                          100
                        }%`,

                        background:
                          primaryColor,

                        transition:
                          "width 1s linear",

                        borderRadius:
                          999,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* =================================================
                  PREVIEW
              ================================================= */}

              {builderStep ===
                "preview" &&
                selectedTemplate && (
                <div
                  style={{
                    height:
                      "100%",

                    display:
                      "flex",

                    flexDirection:
                      "column",

                    background:
                      colors.page,
                  }}
                >
                  {/* PREVIEW BAR */}

                  <div
                    style={{
                      flexShrink:
                        0,

                      minHeight:
                        82,

                      padding:
                        "14px 25px",

                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      gap:
                        15,

                      flexWrap:
                        "wrap",

                      background:
                        colors.topbar ||
                        colors.panel,

                      borderBottom:
                        `1px solid ${colors.border}`,

                      zIndex:
                        10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize:
                            18,

                          fontWeight:
                            800,

                          color:
                            colors.text,
                        }}
                      >
                        {
                          t.resumeReady
                        }{" "}
                        🎉
                      </div>

                      <div
                        style={{
                          fontSize:
                            12,

                          marginTop:
                            3,

                          color:
                            colors.textSecondary,
                        }}
                      >
                        {
                          t.resumeCreated
                        }
                      </div>
                    </div>

                    <Space wrap>
                      <Button
                        size="large"
                        icon={
                          <EditOutlined />
                        }
                        onClick={() =>
                          setBuilderStep(
                            "form"
                          )
                        }
                      >
                        {
                          t.edit
                        }
                      </Button>

                      <Button
                        size="large"
                        onClick={() =>
                          setBuilderStep(
                            "templates"
                          )
                        }
                      >
                        {
                          t.changeTemplate
                        }
                      </Button>

                      <Button
                        type="primary"
                        size="large"
                        icon={
                          <PlusOutlined />
                        }
                        onClick={
                          resetBuilder
                        }
                        style={{
                          background:
                            PALETTE.deepSteelBlue,

                          borderColor:
                            PALETTE.deepSteelBlue,
                        }}
                      >
                        {
                          t.createResume
                        }
                      </Button>
                    </Space>
                  </div>

                  {/* RESUME CANVAS */}

                  <div
                    style={{
                      flex:
                        1,

                      minHeight:
                        0,

                      overflow:
                        "auto",

                      padding:
                        30,

                      background:
                        colors.previewBg,
                    }}
                  >
                    <div
                      style={{
                        width:
                          "fit-content",

                        margin:
                          "0 auto",
                      }}
                    >
                      <ResumeTemplatePreview
                        template={
                          selectedTemplate
                        }
                        data={
                          resumeData
                        }
                        primaryColor={
                          primaryColor
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>

        <HubModals
          certificateDetailsOpen={certificateDetailsOpen}
          setCertificateDetailsOpen={setCertificateDetailsOpen}
          pendingCertificateFile={pendingCertificateFile}
          certificateForm={certificateForm}
          setCertificateForm={setCertificateForm}
          uploadingCertificate={uploadingCertificate}
          submitCertificate={submitCertificate}
          certificatePreview={certificatePreview}
          setCertificatePreview={setCertificatePreview}
          shareOpen={shareOpen}
          setShareOpen={setShareOpen}
          shareResume={shareResume}
          copyShareLink={copyShareLink}
          openQrModal={openQrModal}
          qrResume={qrResume}
          setQrResume={setQrResume}
          buildResumeShareUrl={buildResumeShareUrl}
          sharedViewOpen={sharedViewOpen}
          setSharedViewOpen={setSharedViewOpen}
          sharedViewResume={sharedViewResume}
        />

        {/* ====================================================
            GLOBAL CSS
        ==================================================== */}

        <style>
          {`
            @keyframes resumeSpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            @keyframes resumePulse {
              0% {
                transform: scale(1);
              }

              50% {
                transform: scale(1.04);
              }

              100% {
                transform: scale(1);
              }
            }

            .resume-builder-modal {
              margin: 0 !important;
              padding: 0 !important;
              top: 0 !important;
              max-width: none !important;
            }

            .resume-builder-modal .ant-modal-content {
              padding: 0 !important;
              border-radius: 0 !important;
              overflow: hidden !important;
              min-height: 100vh !important;
              height: 100vh !important;
            }

            .resume-builder-modal .ant-modal-close {
              top: 16px !important;
              right: 22px !important;
              z-index: 100 !important;
              color: currentColor !important;
            }

            .resume-builder-modal .ant-modal-close:hover {
              background: rgba(127,127,127,.12) !important;
            }

            .resume-builder-dark .ant-modal-close {
              color: #D7E7EC !important;
            }

            .resume-builder-light .ant-modal-close {
              color: #334155 !important;
            }

            .resume-builder-modal .ant-modal-header {
              margin: 0 !important;
            }

            .resume-builder-dark .ant-card {
              background: ${BUILDER_DARK.section} !important;
              border-color: ${BUILDER_DARK.border} !important;
            }

            .resume-builder-dark .ant-input,
            .resume-builder-dark .ant-input-affix-wrapper,
            .resume-builder-dark .ant-select-selector {
              background: ${BUILDER_DARK.input} !important;
              color: ${BUILDER_DARK.text} !important;
              border-color: ${BUILDER_DARK.border} !important;
            }

            .resume-builder-dark .ant-input::placeholder {
              color: ${BUILDER_DARK.textSecondary} !important;
            }

            .resume-builder-dark .ant-input:hover,
            .resume-builder-dark .ant-input-affix-wrapper:hover,
            .resume-builder-dark .ant-select-selector:hover {
              background: ${BUILDER_DARK.inputHover} !important;
            }

            .resume-builder-dark .ant-select-selection-item {
              color: ${BUILDER_DARK.text} !important;
            }

            .resume-builder-dark .ant-select-arrow {
              color: ${BUILDER_DARK.textSecondary} !important;
            }

            .resume-builder-dark .ant-upload {
              color: ${BUILDER_DARK.text} !important;
            }

            .resume-builder-dark input[type="month"] {
              color-scheme: dark;
              background: ${BUILDER_DARK.input} !important;
              color: ${BUILDER_DARK.text} !important;
              border-color: ${BUILDER_DARK.border} !important;
            }

            .resume-builder-dark input[type="range"] {
              accent-color: ${BUILDER_DARK.accent};
            }

            .resume-builder-light input[type="range"] {
              accent-color: ${BUILDER_LIGHT.accent};
            }

            .resume-builder-dark input[type="checkbox"] {
              accent-color: ${BUILDER_DARK.accent};
            }

            .resume-builder-light input[type="checkbox"] {
              accent-color: ${BUILDER_LIGHT.accent};
            }

            .resume-builder-dark .ant-select-dropdown,
            .resume-builder-dark .ant-picker-dropdown {
              background: ${BUILDER_DARK.panel} !important;
            }

            .resume-builder-dark .ant-select-item {
              color: ${BUILDER_DARK.text} !important;
            }

            .resume-builder-dark .ant-select-item-option-active {
              background: #183945 !important;
            }

            .resume-builder-dark .ant-select-item-option-selected {
              background: #1A4050 !important;
            }

            .resume-builder-dark .ant-btn-default {
              color: ${BUILDER_DARK.text} !important;
              background: ${BUILDER_DARK.input} !important;
              border-color: ${BUILDER_DARK.border} !important;
            }

            .resume-builder-dark .ant-btn-default:hover {
              color: #FFFFFF !important;
              border-color: ${BUILDER_DARK.accent} !important;
              background: ${BUILDER_DARK.inputHover} !important;
            }

            .resume-builder-dark .ant-modal-title {
              color: ${BUILDER_DARK.text} !important;
            }

            .resume-builder-dark .ant-modal-body {
              background: ${BUILDER_DARK.page} !important;
            }

            .resume-builder-light .ant-modal-body {
              background: ${BUILDER_LIGHT.page} !important;
            }

            .loader-ring {
              width: 52px;
              height: 52px;
              border: 4px solid;
              border-radius: 50%;
              animation: resumeSpin .8s linear infinite;
            }

            * {
              box-sizing: border-box;
            }

            @media (max-width: 900px) {
              .resume-builder-root {
                font-size: 14px;
              }
            }

            @media (max-width: 600px) {
              .resume-builder-modal .ant-modal-header {
                padding-right: 55px !important;
              }
            }
          `}
        </style>
      </div>
    </ConfigProvider>
  );
}

// ============================================================
// CERTIFICATE THUMBNAIL
// ============================================================

function CertificateThumbnail({ userId, certificateId, fallbackData, dark }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrl = "";

    const load = async () => {
      try {
        const stored = userId && certificateId
          ? await getCertificateBlob(userId, certificateId)
          : null;

        const blob = stored || dataUrlToBlob(fallbackData);

        if (!blob) return;

        objectUrl = URL.createObjectURL(blob);
        if (active) setUrl(objectUrl);
      } catch (error) {
        console.error("CERTIFICATE THUMBNAIL ERROR:", error);
      }
    };

    load();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userId, certificateId, fallbackData]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 185,
        overflow: "hidden",
        borderRadius: 10,
        background: dark
          ? "linear-gradient(145deg,#1B414F,#10242B)"
          : "linear-gradient(145deg,#F2F7F9,#E6EEF1)",
      }}
    >
      {url ? (
        <iframe
          title="Certificate preview"
          src={`${url}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
            background: "#fff",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div style={{ height: "100%", display: "grid", placeItems: "center" }}>
          <FilePdfOutlined style={{ fontSize: 32, color: "#D4380D" }} />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          padding: "4px 7px",
          borderRadius: 6,
          background: "rgba(255,255,255,.94)",
          color: "#D4380D",
          fontSize: 9,
          fontWeight: 800,
          boxShadow: "0 3px 10px rgba(0,0,0,.13)",
        }}
      >
        PDF
      </div>
    </div>
  );
}

function HubModals({
  certificateDetailsOpen,
  setCertificateDetailsOpen,
  pendingCertificateFile,
  certificateForm,
  setCertificateForm,
  uploadingCertificate,
  submitCertificate,
  certificatePreview,
  setCertificatePreview,
  shareOpen,
  setShareOpen,
  shareResume,
  copyShareLink,
  openQrModal,
  qrResume,
  setQrResume,
  buildResumeShareUrl,
  sharedViewOpen,
  setSharedViewOpen,
  sharedViewResume,
}) {
  return (
    <>
      <Modal
        open={certificateDetailsOpen}
        onCancel={() => { if (!uploadingCertificate) setCertificateDetailsOpen(false); }}
        title="Sertifikat ma’lumotlari"
        centered
        confirmLoading={uploadingCertificate}
        onOk={submitCertificate}
        okText="Sertifikatni saqlash"
        cancelText="Bekor qilish"
      >
        <div style={{ display: "grid", gap: 14 }}>
          <Input size="large" value={certificateForm.title} onChange={(e) => setCertificateForm((p) => ({ ...p, title: e.target.value }))} placeholder="Advanced Frontend Certificate" />
          <Select size="large" value={certificateForm.credentialType} onChange={(v) => setCertificateForm((p) => ({ ...p, credentialType: v }))} options={[{ label: "Sertifikat", value: "certificate" }, { label: "Diplom", value: "diploma" }]} />
          <Input size="large" value={certificateForm.issuer} onChange={(e) => setCertificateForm((p) => ({ ...p, issuer: e.target.value }))} placeholder="IT Park Uzbekistan" />
          <Row gutter={12}><Col span={12}><Input type="date" size="large" value={certificateForm.issueDate} onChange={(e) => setCertificateForm((p) => ({ ...p, issueDate: e.target.value }))} /></Col><Col span={12}><Input size="large" value={certificateForm.credentialId} onChange={(e) => setCertificateForm((p) => ({ ...p, credentialId: e.target.value }))} placeholder="CERT-2026-001" /></Col></Row>
          <Input.TextArea value={certificateForm.description} onChange={(e) => setCertificateForm((p) => ({ ...p, description: e.target.value }))} autoSize={{ minRows: 3, maxRows: 5 }} placeholder="Advanced frontend development course..." />
          <Text type="secondary">{pendingCertificateFile?.name || "certificate.pdf"}</Text>
        </div>
      </Modal>

      <Modal open={!!certificatePreview} onCancel={() => { if (certificatePreview?.url) URL.revokeObjectURL(certificatePreview.url); setCertificatePreview(null); }} title={certificatePreview?.certificate?.title || "Certificate PDF"} footer={null} width={900} centered styles={{ body: { padding: 0, height: "72vh", overflow: "hidden" } }}>
        {certificatePreview?.url && <iframe title="Certificate PDF" src={`${certificatePreview.url}#toolbar=1&navpanes=0`} style={{ width: "100%", height: "72vh", border: 0, display: "block" }} />}
      </Modal>

      <Modal open={shareOpen} onCancel={() => setShareOpen(false)} title="Share resume" footer={null} centered>
        {shareResume && <div style={{ display: "grid", gap: 12 }}><Input size="large" readOnly value={buildResumeShareUrl(shareResume.id)} /><Button type="primary" icon={<ShareAltOutlined />} onClick={() => copyShareLink(shareResume)}>Copy public link</Button><Button icon={<QrcodeOutlined />} onClick={() => { setShareOpen(false); openQrModal(shareResume); }}>Show QR code</Button></div>}
      </Modal>

      <Modal open={!!qrResume} onCancel={() => setQrResume(null)} title="Resume QR code" footer={null} centered>
        {qrResume && <div style={{ display: "grid", justifyItems: "center", gap: 12, padding: "10px 0" }}><QRCodeSVG value={buildResumeShareUrl(qrResume.id)} size={220} level="H" includeMargin /><Text type="secondary">Scan to open this public resume.</Text></div>}
      </Modal>

      <Modal open={sharedViewOpen} onCancel={() => setSharedViewOpen(false)} footer={null} width="100%" centered={false} styles={{ content: { padding: 0, minHeight: "100vh" }, body: { padding: 0 } }}>
        {sharedViewResume && <div style={{ minHeight: "100vh", background: "#EEF3F5", padding: 30 }}><div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "center" }}><ResumeTemplatePreview template={TEMPLATES_REGISTRY.find((item) => item.id === sharedViewResume.templateId)} data={sharedViewResume.parsedData || createEmptyResume()} primaryColor={sharedViewResume.primaryColor || PALETTE.deepSteelBlue} /></div></div>}
      </Modal>
    </>
  );
}

// ============================================================
// TEMPLATE PREVIEW
// ============================================================

function ResumeTemplatePreview({
  template,
  data,
  primaryColor,
}) {
  const TemplateComponent =
    template.component;

  return (
    <TemplateComponent
      data={data}
      primaryColor={
        primaryColor
      }
    />
  );
}

// ============================================================
// SECTION
// ============================================================

function ResumeSectionDark({
  title,
  children,
  colors,
}) {
  return (
    <section
      style={{
        marginBottom:
          42,
      }}
    >
      <div
        style={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            12,

          marginBottom:
            20,
        }}
      >
        <div
          style={{
            width:
              5,

            height:
              26,

            borderRadius:
              999,

            background:
              colors.accent,
          }}
        />

        <div
          style={{
            fontSize:
              19,

            fontWeight:
              850,

            color:
              colors.text,
          }}
        >
          {title}
        </div>
      </div>

      {children}
    </section>
  );
}

// ============================================================
// LARGE FIELD
// ============================================================

function LargeField({
  label,
  value,
  onChange,
  status,
  colors,
}) {
  return (
    <div>
      <label
        style={{
          display:
            "block",

          marginBottom:
            9,

          color:
            colors.text,

          fontSize:
            13,

          fontWeight:
            700,
        }}
      >
        {label}
      </label>

      <Input
        size="large"
        status={
          status
        }
        value={
          value ?? ""
        }
        onChange={(
          e
        ) =>
          onChange(
            e.target
              .value
          )
        }
        style={{
          height:
            50,

          background:
            colors.input,

          color:
            colors.text,

          borderColor:
            colors.border,

          fontSize:
            15,

          borderRadius:
            10,
        }}
      />
    </div>
  );
}

// ============================================================
// PHONE
// ============================================================

function PhoneField({
  label,
  value,
  onChange,
  colors,
}) {
  return (
    <LargeField
      label={
        label
      }
      value={
        value
      }
      onChange={
        onChange
      }
      colors={
        colors
      }
    />
  );
}

// ============================================================
// TITLE
// ============================================================

function TitleField({
  label,
  value,
  onChange,
  colors,
}) {
  const options = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Software Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Data Analyst",
    "DevOps Engineer",
    "Mobile Developer",
    "QA Engineer",
    "Graphic Designer",
  ];

  return (
    <div>
      <label
        style={{
          display:
            "block",

          marginBottom:
            9,

          color:
            colors.text,

          fontSize:
            13,

          fontWeight:
            700,
        }}
      >
        {label}
      </label>

      <Select
        showSearch
        allowClear
        value={
          value || undefined
        }
        onChange={
          onChange
        }
        options={options.map(
          (
            item
          ) => ({
            label:
              item,
            value:
              item,
          })
        )}
        style={{
          width:
            "100%",
        }}
        size="large"
      />
    </div>
  );
}

// ============================================================
// LOCATION
// ============================================================

function LocationField({
  label,
  value,
  onChange,
  colors,
}) {
  const locations = [
    "Uzbekistan, Tashkent",
    "Uzbekistan, Samarkand",
    "Uzbekistan, Bukhara",
    "Uzbekistan, Andijan",
    "Uzbekistan, Fergana",
    "Uzbekistan, Namangan",
    "Uzbekistan, Qarshi",
    "Uzbekistan, Nukus",
    "Uzbekistan, Jizzakh",
    "Uzbekistan, Termez",
  ];

  return (
    <div>
      <label
        style={{
          display:
            "block",

          marginBottom:
            9,

          color:
            colors.text,

          fontSize:
            13,

          fontWeight:
            700,
        }}
      >
        {label}
      </label>

      <Select
        showSearch
        allowClear
        value={
          value || undefined
        }
        onChange={
          onChange
        }
        options={locations.map(
          (
            item
          ) => ({
            label:
              item,
            value:
              item,
          })
        )}
        style={{
          width:
            "100%",
        }}
        size="large"
      />
    </div>
  );
}

// ============================================================
// MONTH
// ============================================================

function MonthField({
  label,
  value,
  onChange,
  disabled,
  colors,
}) {
  return (
    <div>
      <label
        style={{
          display:
            "block",

          marginBottom:
            9,

          color:
            colors.text,

          fontSize:
            13,

          fontWeight:
            700,
        }}
      >
        {label}
      </label>

      <input
        type="month"
        value={
          value || ""
        }
        disabled={
          disabled
        }
        onChange={(
          e
        ) =>
          onChange(
            e.target
              .value
          )
        }
        style={{
          width:
            "100%",

          height:
            50,

          border:
            `1px solid ${colors.border}`,

          borderRadius:
            10,

          padding:
            "0 14px",

          background:
            disabled
              ? colors.page
              : colors.input,

          color:
            colors.text,

          fontSize:
            15,

          colorScheme:
            colors ===
            BUILDER_DARK
              ? "dark"
              : "light",
        }}
      />
    </div>
  );
}

// ============================================================
// SKILLS
// ============================================================

function SkillChips({
  skills,
  onAdd,
  onRemove,
  onLevelChange,
  placeholder,
  colors,
}) {
  const [
    inputValue,
    setInputValue,
  ] = useState("");

  const addSkill =
    () => {
      const value =
        inputValue.trim();

      if (!value)
        return;

      onAdd(value);
      setInputValue("");
    };

  return (
    <div
      style={{
        padding:
          24,

        borderRadius:
          18,

        background:
          colors.input,

        border:
          `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          display:
            "flex",

          flexWrap:
            "wrap",

          gap:
            9,

          marginBottom:
            18,
        }}
      >
        {skills.map(
          (
            skill,
            index
          ) => (
            <Tag
              key={
                `${skill.name}-${index}`
              }
              closable
              color="blue"
              onClose={() =>
                onRemove(
                  index
                )
              }
              style={{
                padding:
                  "8px 11px",

                borderRadius:
                  999,

                fontSize:
                  13,
              }}
            >
              {
                skill.name
              }{" "}
              <span
                style={{
                  opacity:
                    0.75,
                }}
              >
                {
                  skill.level
                }
                %
              </span>
            </Tag>
          )
        )}
      </div>

      <div
        style={{
          display:
            "flex",

          gap:
            10,
        }}
      >
        <Input
          size="large"
          value={
            inputValue
          }
          placeholder={
            placeholder
          }
          onChange={(
            e
          ) =>
            setInputValue(
              e.target
                .value
            )
          }
          onPressEnter={
            addSkill
          }
          style={{
            background:
              colors.input,

            color:
              colors.text,

            borderColor:
              colors.border,
          }}
        />

        <Button
          type="primary"
          size="large"
          icon={
            <PlusOutlined />
          }
          onClick={
            addSkill
          }
        />
      </div>

      {skills.length >
        0 && (
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",

            gap:
              18,

            marginTop:
              24,
          }}
        >
          {skills.map(
            (
              skill,
              index
            ) => (
              <div
                key={
                  `${skill.name}-${index}-range`
                }
              >
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    color:
                      colors.text,

                    marginBottom:
                      6,
                  }}
                >
                  <Text
                    style={{
                      color:
                        colors.text,
                    }}
                  >
                    {
                      skill.name
                    }
                  </Text>

                  <Text
                    style={{
                      color:
                        colors.textSecondary,
                    }}
                  >
                    {
                      skill.level
                    }
                    %
                  </Text>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={
                    skill.level ??
                    70
                  }
                  onChange={(
                    e
                  ) =>
                    onLevelChange(
                      index,
                      e.target
                        .value
                    )
                  }
                  style={{
                    width:
                      "100%",
                  }}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// LANGUAGES
// ============================================================

function LanguageChips({
  languages,
  onAdd,
  onRemove,
  onLevelChange,
  placeholder,
  colors,
}) {
  const [
    inputValue,
    setInputValue,
  ] = useState("");

  const addLanguage =
    () => {
      const value =
        inputValue.trim();

      if (!value)
        return;

      onAdd(value);
      setInputValue("");
    };

  return (
    <div
      style={{
        padding:
          24,

        borderRadius:
          18,

        background:
          colors.input,

        border:
          `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          display:
            "flex",

          flexWrap:
            "wrap",

          gap:
            9,

          marginBottom:
            18,
        }}
      >
        {languages.map(
          (
            item,
            index
          ) => (
            <Tag
              key={
                `${item.language}-${index}`
              }
              closable
              color="green"
              onClose={() =>
                onRemove(
                  index
                )
              }
              style={{
                padding:
                  "8px 11px",

                borderRadius:
                  999,

                fontSize:
                  13,
              }}
            >
              {
                item.language
              }

              {item.level
                ? ` · ${item.level}`
                : ""}
            </Tag>
          )
        )}
      </div>

      <div
        style={{
          display:
            "flex",

          gap:
            10,
        }}
      >
        <Input
          size="large"
          value={
            inputValue
          }
          placeholder={
            placeholder
          }
          onChange={(
            e
          ) =>
            setInputValue(
              e.target
                .value
            )
          }
          onPressEnter={
            addLanguage
          }
          style={{
            background:
              colors.input,

            color:
              colors.text,

            borderColor:
              colors.border,
          }}
        />

        <Button
          type="primary"
          size="large"
          icon={
            <PlusOutlined />
          }
          onClick={
            addLanguage
          }
        />
      </div>

      {languages.length >
        0 && (
        <div
          style={{
            display:
              "flex",

            flexDirection:
              "column",

            gap:
              14,

            marginTop:
              22,
          }}
        >
          {languages.map(
            (
              item,
              index
            ) => (
              <div
                key={
                  `${item.language}-${index}-level`
                }
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    15,
                }}
              >
                <Text
                  strong
                  style={{
                    minWidth:
                      110,

                    color:
                      colors.text,
                  }}
                >
                  {
                    item.language
                  }
                </Text>

                <Select
                  size="large"
                  value={
                    item.level ||
                    undefined
                  }
                  placeholder="Level"
                  onChange={(
                    value
                  ) =>
                    onLevelChange(
                      index,
                      value
                    )
                  }
                  options={[
                    {
                      label:
                        "Native",
                      value:
                        "Native",
                    },
                    {
                      label:
                        "A1",
                      value:
                        "A1",
                    },
                    {
                      label:
                        "A2",
                      value:
                        "A2",
                    },
                    {
                      label:
                        "B1",
                      value:
                        "B1",
                    },
                    {
                      label:
                        "B2",
                      value:
                        "B2",
                    },
                    {
                      label:
                        "C1",
                      value:
                        "C1",
                    },
                    {
                      label:
                        "C2",
                      value:
                        "C2",
                    },
                  ]}
                  style={{
                    width:
                      180,
                  }}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}