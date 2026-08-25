import React, { useEffect, useMemo, useState } from "react";
import { TEMPLATES_REGISTRY } from "./templatesRegistry";

const USERS_API =
  "https://6a7700dd63e9caf860c33d99.mockapi.io/users";

const RESUMES_API =
  "https://6a7700dd63e9caf860c33d99.mockapi.io/resumes";

// ============================================================
// EMPTY DATA
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
// JSON HELPER
// ============================================================

function safeJSONParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// ============================================================
// PICK FIRST VALID VALUE
// ============================================================

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

// ============================================================
// GET LOGIN USER ID / EMAIL
// ============================================================

function getLoggedInUserIdentity() {
  const result = {
    id: null,
    email: null,
  };

  // ----------------------------------------------------------
  // OBJECT KEYS
  // ----------------------------------------------------------

  const objectKeys = [
    "currentUser",
    "user",
    "authUser",
    "loggedInUser",
    "userData",
    "profile",
    "auth",
    "loginUser",
  ];

  for (const key of objectKeys) {
    const raw = localStorage.getItem(key);

    if (!raw) continue;

    const parsed = safeJSONParse(raw);

    if (!parsed || typeof parsed !== "object") {
      continue;
    }

    const possibleId = pickFirst(
      parsed.id,
      parsed.userId,
      parsed.user_id,
      parsed.uid,
      parsed.user?.id
    );

    const possibleEmail = pickFirst(
      parsed.email,
      parsed.userEmail,
      parsed.user?.email
    );

    if (possibleId) {
      result.id = String(possibleId);
    }

    if (possibleEmail) {
      result.email = String(possibleEmail);
    }

    if (result.id || result.email) {
      return result;
    }
  }

  // ----------------------------------------------------------
  // DIRECT ID KEYS
  // ----------------------------------------------------------

  const idKeys = [
    "userId",
    "currentUserId",
    "loggedInUserId",
    "authUserId",
    "user_id",
    "uid",
  ];

  for (const key of idKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      result.id = String(value);
      break;
    }
  }

  // ----------------------------------------------------------
  // DIRECT EMAIL KEYS
  // ----------------------------------------------------------

  const emailKeys = [
    "userEmail",
    "currentUserEmail",
    "loggedInUserEmail",
    "authUserEmail",
    "email",
  ];

  for (const key of emailKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      result.email = String(value);
      break;
    }
  }

  return result;
}

// ============================================================
// NAME
// ============================================================

function getNameParts(user) {
  let firstName = pickFirst(
    user.firstName,
    user.firstname,
    user.first_name,
    user.name,
    user.givenName,
    user.given_name
  );

  let lastName = pickFirst(
    user.lastName,
    user.lastname,
    user.last_name,
    user.surname,
    user.familyName,
    user.family_name
  );

  const fullName = pickFirst(
    user.fullName,
    user.full_name,
    user.displayName,
    user.display_name
  );

  if ((!firstName || !lastName) && fullName) {
    const parts = String(fullName)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!firstName) {
      firstName = parts[0] || "";
    }

    if (!lastName && parts.length > 1) {
      lastName = parts.slice(1).join(" ");
    }
  }

  return {
    firstName: String(firstName || ""),
    lastName: String(lastName || ""),
  };
}

// ============================================================
// NORMALIZE SKILLS
// ============================================================

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

      if (typeof skill === "object") {
        return {
          name: pickFirst(
            skill.name,
            skill.title,
            skill.skill
          ),
          level: Number(
            pickFirst(
              skill.level,
              skill.percent,
              skill.rating,
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

// ============================================================
// NORMALIZE LANGUAGES
// ============================================================

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

      if (typeof language === "object") {
        return {
          language: pickFirst(
            language.language,
            language.name,
            language.title
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

// ============================================================
// MAP USER -> RESUME
// ============================================================

function mapUserToResume(user) {
  const empty = createEmptyResume();

  const {
    firstName,
    lastName,
  } = getNameParts(user);

  const profilePhoto = pickFirst(
    user.avatar,
    user.avatarUrl,
    user.profilePhoto,
    user.profile_photo,
    user.photo,
    user.image,
    user.imageUrl,
    user.image_url,
    user.picture,
    user.pictureUrl
  );

  const phone = pickFirst(
    user.phone,
    user.phoneNumber,
    user.phone_number,
    user.mobile,
    user.mobileNumber
  );

  const email = pickFirst(
    user.email,
    user.mail
  );

  const location = pickFirst(
    user.location,
    user.address,
    user.city,
    user.country
  );

  const professionalTitle = pickFirst(
    user.professionalTitle,
    user.professional_title,
    user.jobTitle,
    user.job_title,
    user.position,
    user.role
  );

  const portfolio = pickFirst(
    user.portfolio,
    user.website,
    user.webSite,
    user.site
  );

  const github = pickFirst(
    user.github,
    user.githubUrl
  );

  const linkedin = pickFirst(
    user.linkedin,
    user.linkedinUrl
  );

  const telegram = pickFirst(
    user.telegram,
    user.telegramUrl,
    user.telegramUsername
  );

  const website = pickFirst(
    user.website,
    user.webSite,
    user.site
  );

  return {
    ...empty,

    personalInfo: {
      ...empty.personalInfo,

      firstName,
      lastName,

      professionalTitle: String(
        professionalTitle || ""
      ),

      phone: String(
        phone || ""
      ),

      email: String(
        email || ""
      ),

      location: String(
        location || ""
      ),

      profilePhoto: String(
        profilePhoto || ""
      ),

      portfolio: String(
        portfolio || ""
      ),
    },

    skills: normalizeSkills(
      pickFirst(
        user.skills,
        user.technicalSkills
      )
    ),

    languages: normalizeLanguages(
      pickFirst(
        user.languages,
        user.language
      )
    ),

    socialLinks: {
      github: String(
        github || ""
      ),

      linkedin: String(
        linkedin || ""
      ),

      telegram: String(
        telegram || ""
      ),

      website: String(
        website || ""
      ),
    },
  };
}

// ============================================================
// URL FORMATTER
// ============================================================

function formatURL(value) {
  if (!value) return "";

  const clean = value.trim();

  if (!clean) return "";

  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://")
  ) {
    return clean;
  }

  return `https://${clean}`;
}

// ============================================================
// PHONE FORMATTER
// ============================================================

function formatUzbekPhone(value) {
  let digits = String(value || "")
    .replace(/\D/g, "");

  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }

  digits = digits.slice(0, 9);

  let result = "+998";

  if (digits.length > 0) {
    result += ` (${digits.slice(0, 2)}`;
  }

  if (digits.length >= 2) {
    result += ")";
  }

  if (digits.length > 2) {
    result += ` ${digits.slice(2, 5)}`;
  }

  if (digits.length > 5) {
    result += `-${digits.slice(5, 7)}`;
  }

  if (digits.length > 7) {
    result += `-${digits.slice(7, 9)}`;
  }

  return result;
}

// ============================================================
// EMAIL VALIDATION
// ============================================================

function isValidEmail(email) {
  if (!email) return true;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
}

// ============================================================
// DATE FORMAT
// ============================================================

function formatMonthYear(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );
}

// ============================================================
// APP
// ============================================================

export default function Index() {
  // ----------------------------------------------------------
  // BUILDER
  // ----------------------------------------------------------

  const [isBuilderOpen, setIsBuilderOpen] =
    useState(false);

  const [builderStep, setBuilderStep] =
    useState("form");

  // form
  // templates
  // generating
  // preview

  // ----------------------------------------------------------
  // USER
  // ----------------------------------------------------------

  const [currentUser, setCurrentUser] =
    useState(null);

  const [loadingUser, setLoadingUser] =
    useState(false);

  const [userError, setUserError] =
    useState("");

  // ----------------------------------------------------------
  // RESUME DATA
  // ----------------------------------------------------------

  const [resumeData, setResumeData] =
    useState(
      createEmptyResume()
    );

  // ----------------------------------------------------------
  // RESUMES
  // ----------------------------------------------------------

  const [myResumes, setMyResumes] =
    useState([]);

  const [loadingResumes, setLoadingResumes] =
    useState(false);

  const [resumesError, setResumesError] =
    useState("");

  // ----------------------------------------------------------
  // CURRENT RESUME
  // ----------------------------------------------------------

  const [editingResumeId, setEditingResumeId] =
    useState(null);

  // ----------------------------------------------------------
  // TEMPLATE
  // ----------------------------------------------------------

  const [selectedTemplateId, setSelectedTemplateId] =
    useState(
      TEMPLATES_REGISTRY[0]?.id || ""
    );

  // ----------------------------------------------------------
  // COLOR
  // ----------------------------------------------------------

  const [primaryColor, setPrimaryColor] =
    useState(
      TEMPLATES_REGISTRY[0]?.defaultColor ||
      "#2563eb"
    );

  // ----------------------------------------------------------
  // COUNTDOWN
  // ----------------------------------------------------------

  const [countdown, setCountdown] =
    useState(5);

  // ==========================================================
  // SELECTED TEMPLATE
  // ==========================================================

  const selectedTemplate = useMemo(() => {
    return TEMPLATES_REGISTRY.find(
      (template) =>
        template.id ===
        selectedTemplateId
    );
  }, [selectedTemplateId]);

  // ==========================================================
  // LOAD USER
  // ==========================================================

  const loadCurrentUser = async () => {
    setLoadingUser(true);
    setUserError("");

    try {
      const identity = getLoggedInUserIdentity();

      console.log("LOGIN IDENTITY:", identity);

      if (!identity.id && !identity.email) {
        throw new Error(
          "Login qilgan userning ID yoki email'i topilmadi."
        );
      }

      const response = await fetch(USERS_API);

      if (!response.ok) {
        throw new Error("Users API ishlamadi.");
      }

      const users = await response.json();

      let user = null;

      if (identity.id) {
        user = users.find(
          (item) =>
            String(item.id) === String(identity.id)
        );
      }

      if (!user && identity.email) {
        user = users.find(
          (item) =>
            String(item.email || "")
              .trim()
              .toLowerCase() ===
            String(identity.email)
              .trim()
              .toLowerCase()
        );
      }

      if (!user) {
        throw new Error(
          "MockAPI'da aynan login qilgan user topilmadi."
        );
      }

      console.log("EXACT LOGGED USER:", user);

      setCurrentUser(user);
      setResumeData(mapUserToResume(user));
    } catch (error) {
      console.error("USER LOAD ERROR:", error);

      setUserError(
        error?.message ||
        "User ma'lumotlarini yuklashda xatolik."
      );
    } finally {
      setLoadingUser(false);
    }
  };

  // ==========================================================
  // LOAD MY RESUMES
  // ==========================================================

  const loadMyResumes = async () => {
    setLoadingResumes(true);
    setResumesError("");

    try {
      const identity =
        getLoggedInUserIdentity();

      if (!identity.id) {
        setMyResumes([]);
        setLoadingResumes(false);
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
          "Sizda hali resume yo'q yangi yaratishingiz mumkin."
          
        );
      }

      const data =
        await response.json();

      const parsedResumes =
        data.map((resume) => {
          let parsedData =
            createEmptyResume();

          if (
            resume.resumeData
          ) {
            try {
              parsedData =
                JSON.parse(
                  resume.resumeData
                );
            } catch {
              parsedData =
                createEmptyResume();
            }
          }

          return {
            ...resume,
            parsedData,
          };
        });

      setMyResumes(
        parsedResumes
      );
    } catch (error) {
      console.error(
        error
      );

      setResumesError(
        error?.message ||
        "Resume'larni yuklashda xatolik."
      );
    } finally {
      setLoadingResumes(false);
    }
  };

  // ==========================================================
  // INITIAL
  // ==========================================================

  useEffect(() => {
    loadMyResumes();
  }, []);

  // ==========================================================
  // OPEN BUILDER
  // ==========================================================

  const openCreateResume = () => {
    console.log("CREATE RESUME CLICKED");

    setEditingResumeId(null);
    setBuilderStep("form");
    setCountdown(5);
    setUserError("");
    setResumeData(createEmptyResume());

    // Modal DARHOL ochiladi
    setIsBuilderOpen(true);

    // Keyin user ma'lumotlari yuklanadi
    loadCurrentUser();
  };

  // ==========================================================
  // EDIT EXISTING
  // ==========================================================

  const openExistingResume = (
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
      "#2563eb"
    );

    setBuilderStep(
      "preview"
    );

    setIsBuilderOpen(
      true
    );
  };

  // ==========================================================
  // PERSONAL UPDATE
  // ==========================================================

  const updatePersonalInfo = (
    field,
    value
  ) => {
    setResumeData(
      (prev) => ({
        ...prev,

        personalInfo: {
          ...prev.personalInfo,

          [field]:
            value,
        },
      })
    );
  };

  // ==========================================================
  // SOCIAL UPDATE
  // ==========================================================

  const updateSocial = (
    field,
    value
  ) => {
    setResumeData(
      (prev) => ({
        ...prev,

        socialLinks: {
          ...prev.socialLinks,

          [field]:
            value,
        },
      })
    );
  };

  // ==========================================================
  // SIMPLE UPDATE
  // ==========================================================

  const updateResumeField = (
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

  // ==========================================================
  // ARRAY UPDATE
  // ==========================================================

  const updateArrayItem = (
    arrayName,
    index,
    field,
    value
  ) => {
    setResumeData(
      (prev) => {
        const updated = [
          ...prev[arrayName],
        ];

        updated[index] = {
          ...updated[index],
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

  // ==========================================================
  // ADD ARRAY
  // ==========================================================

  const addArrayItem = (
    arrayName,
    item
  ) => {
    setResumeData(
      (prev) => ({
        ...prev,

        [arrayName]: [
          ...prev[arrayName],
          item,
        ],
      })
    );
  };

  // ==========================================================
  // REMOVE ARRAY
  // ==========================================================

  const removeArrayItem = (
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
  // PROFILE IMAGE UPLOAD
  // ==========================================================

  const handleProfileUpload = (
    event
  ) => {
    const file =
      event.target
        .files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Faqat rasm faylini yuklang."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      updatePersonalInfo(
        "profilePhoto",
        reader.result
      );
    };

    reader.readAsDataURL(
      file
    );
  };

  // ==========================================================
  // SKILLS
  // ==========================================================

  const addSkill = (
    skillText
  ) => {
    const clean =
      skillText.trim();

    if (!clean) return;

    const exists =
      resumeData.skills.some(
        (skill) =>
          skill.name
            .toLowerCase() ===
          clean.toLowerCase()
      );

    if (exists) return;

    addArrayItem(
      "skills",
      {
        name: clean,
        level: 70,
      }
    );
  };

  // ==========================================================
  // LANGUAGES
  // ==========================================================

  const addLanguage = (
    language
  ) => {
    const clean =
      language.trim();

    if (!clean) return;

    const exists =
      resumeData.languages.some(
        (item) =>
          item.language
            .toLowerCase() ===
          clean.toLowerCase()
      );

    if (exists) return;

    addArrayItem(
      "languages",
      {
        language:
          clean,
        level: "",
      }
    );
  };

  // ==========================================================
  // FORM SUBMIT
  // ==========================================================

  const handleFormSubmit = (
    event
  ) => {
    event.preventDefault();

    if (
      !isValidEmail(
        resumeData
          .personalInfo
          .email
      )
    ) {
      alert(
        "Email manzil noto'g'ri."
      );

      return;
    }

    if (
      !resumeData
        .personalInfo
        .firstName
        .trim()
    ) {
      alert(
        "First Name kiriting."
      );

      return;
    }

    if (
      !resumeData
        .personalInfo
        .lastName
        .trim()
    ) {
      alert(
        "Last Name kiriting."
      );

      return;
    }

    setBuilderStep(
      "templates"
    );
  };

  // ==========================================================
  // TEMPLATE SELECT
  // ==========================================================

  const selectTemplate = (
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
  // CREATE / SAVE RESUME
  // ==========================================================

  const saveResumeToAPI =
    async () => {
      const identity =
        getLoggedInUserIdentity();

      if (!identity.id) {
        throw new Error(
          "User ID topilmadi."
        );
      }

      const now =
        new Date().toISOString();

      const payload = {
        userId:
          String(identity.id),

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

        createdAt:
          editingResumeId
            ? undefined
            : now,

        updatedAt:
          now,
      };

      // --------------------------------------------------------
      // UPDATE
      // --------------------------------------------------------

      if (editingResumeId) {
        const updatePayload = {
          userId:
            String(
              identity.id
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

        const response =
          await fetch(
            `${RESUMES_API}/${editingResumeId}`,
            {
              method:
                "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  updatePayload
                ),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Resume update bo'lmadi."
          );
        }

        return await response.json();
      }

      // --------------------------------------------------------
      // CREATE
      // --------------------------------------------------------

      const response =
        await fetch(
          RESUMES_API,
          {
            method:
              "POST",

            headers: {
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
          "Resume saqlanmadi."
        );
      }

      return await response.json();
    };

  // ==========================================================
  // GENERATE RESUME
  // ==========================================================

  const handleGenerateResume =
    () => {
      if (
        !selectedTemplate
      ) {
        return;
      }

      setCountdown(5);

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
      saveResumeToAPI()
        .then(() => {
          loadMyResumes();

          setBuilderStep(
            "preview"
          );
        })
        .catch((error) => {
          console.error(
            error
          );

          alert(
            error?.message ||
            "Resume saqlashda xatolik."
          );

          setBuilderStep(
            "templates"
          );
        });

      return;
    }

    const timer =
      setTimeout(() => {
        setCountdown(
          (prev) =>
            prev - 1
        );
      }, 1000);

    return () =>
      clearTimeout(
        timer
      );
  }, [
    builderStep,
    countdown,
  ]);

  // ==========================================================
  // DELETE RESUME
  // ==========================================================

  const deleteResume =
    async (resumeId) => {
      const confirmed =
        window.confirm(
          "Bu resume'ni o'chirmoqchimisiz?"
        );

      if (!confirmed)
        return;

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
            "Resume o'chirilmadi."
          );
        }

        setMyResumes(
          (prev) =>
            prev.filter(
              (item) =>
                String(
                  item.id
                ) !==
                String(
                  resumeId
                )
            )
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          error?.message ||
          "Resume o'chirishda xatolik."
        );
      }
    };

  // ==========================================================
  // CLOSE
  // ==========================================================

  const closeBuilder =
    () => {
      setIsBuilderOpen(
        false
      );

      setBuilderStep(
        "form"
      );

      setCountdown(5);
    };

  // ==========================================================
  // RELOAD RESUME DATA FROM USER
  // ==========================================================

  const reloadUserData =
    async () => {
      await loadCurrentUser();
    };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div
      style={{
        minHeight:
          "100vh",
        padding:
          "40px",
        background:
          "#f8fafc",
        fontFamily:
          "Inter, Arial, sans-serif",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto",
        }}
      >
        <h1
          style={{
            margin:
              0,
            fontSize:
              "32px",
            fontWeight:
              800,
            color:
              "#0f172a",
          }}
        >
          My Projects
        </h1>

        <p
          style={{
            marginTop:
              "8px",
            color:
              "#64748b",
          }}
        >
          Create and manage your professional resumes.
        </p>

        <button
          type="button"
          onClick={openCreateResume}
          style={{
            marginTop: "25px",
            padding: "14px 24px",
            border: "none",
            borderRadius: "12px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(37,99,235,.25)",
          }}
        >
          + Create Resume
        </button>
      </div>

      {/* =====================================================
          MY RESUMES
      ===================================================== */}

      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "35px auto 0",
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
              "18px",
          }}
        >
          <div>
            <h2
              style={{
                margin:
                  0,
                color:
                  "#0f172a",
                fontSize:
                  "22px",
              }}
            >
              My Resumes
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color:
                  "#64748b",
                fontSize:
                  "13px",
              }}
            >
              Only your own resumes are shown here.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadMyResumes
            }
            style={{
              border:
                "1px solid #cbd5e1",
              background:
                "#fff",
              borderRadius:
                "10px",
              padding:
                "9px 14px",
              cursor:
                "pointer",
              fontWeight:
                600,
            }}
          >
            Refresh
          </button>
        </div>

        {loadingResumes && (
          <div
            style={{
              padding:
                "30px",
              textAlign:
                "center",
              background:
                "#fff",
              borderRadius:
                "16px",
            }}
          >
            Loading resumes...
          </div>
        )}

        {!loadingResumes &&
          resumesError && (
            <div
              style={{
                padding:
                  "18px",
                borderRadius:
                  "12px",
                background:
                  "#fef2f2",
                color:
                  "#b91c1c",
              }}
            >
              {resumesError}
            </div>
          )}

        {!loadingResumes &&
          !resumesError &&
          myResumes.length ===
          0 && (
            <div
              style={{
                padding:
                  "50px",
                textAlign:
                  "center",
                background:
                  "#fff",
                border:
                  "1px solid #e2e8f0",
                borderRadius:
                  "18px",
              }}
            >
              <div
                style={{
                  fontSize:
                    "45px",
                  marginBottom:
                    "12px",
                }}
              >
                📄
              </div>

              <h3
                style={{
                  margin:
                    0,
                  color:
                    "#0f172a",
                }}
              >
                No resumes yet
              </h3>

              <p
                style={{
                  color:
                    "#64748b",
                  margin:
                    "8px 0 20px",
                }}
              >
                Create your first professional resume.
              </p>

              <button
                type="button"
                onClick={
                  openCreateResume
                }
                style={{
                  padding:
                    "12px 20px",
                  border:
                    "none",
                  borderRadius:
                    "10px",
                  background:
                    "#2563eb",
                  color:
                    "#fff",
                  fontWeight:
                    700,
                  cursor:
                    "pointer",
                }}
              >
                Create Resume
              </button>
            </div>
          )}

        {!loadingResumes &&
          myResumes.length >
          0 && (
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0,1fr))",
                gap:
                  "20px",
              }}
            >
              {myResumes.map(
                (resume) => {
                  const data =
                    resume.parsedData ||
                    createEmptyResume();

                  const template =
                    TEMPLATES_REGISTRY.find(
                      (item) =>
                        item.id ===
                        resume.templateId
                    );

                  const photo =
                    data
                      .personalInfo
                      ?.profilePhoto;

                  return (
                    <div
                      key={
                        resume.id
                      }
                      style={{
                        background:
                          "#fff",
                        border:
                          "1px solid #e2e8f0",
                        borderRadius:
                          "18px",
                        overflow:
                          "hidden",
                      }}
                    >
                      <div
                        style={{
                          height:
                            "170px",
                          background:
                            "#f1f5f9",
                          display:
                            "flex",
                          justifyContent:
                            "center",
                          alignItems:
                            "center",
                          overflow:
                            "hidden",
                        }}
                      >
                        {photo ? (
                          <img
                            src={
                              photo
                            }
                            alt="Resume"
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              fontSize:
                                "50px",
                              opacity:
                                0.4,
                            }}
                          >
                            📄
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          padding:
                            "18px",
                        }}
                      >
                        <h3
                          style={{
                            margin:
                              0,
                            color:
                              "#0f172a",
                          }}
                        >
                          {data
                            .personalInfo
                            ?.firstName}{" "}
                          {data
                            .personalInfo
                            ?.lastName}
                        </h3>

                        <p
                          style={{
                            margin:
                              "5px 0",
                            fontSize:
                              "13px",
                            color:
                              "#64748b",
                          }}
                        >
                          {data
                            .personalInfo
                            ?.professionalTitle ||
                            "Resume"}
                        </p>

                        <div
                          style={{
                            marginTop:
                              "8px",
                            fontSize:
                              "12px",
                            color:
                              "#94a3b8",
                          }}
                        >
                          {template
                            ?.name ||
                            resume.templateId}
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "8px",
                            marginTop:
                              "16px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openExistingResume(
                                resume
                              )
                            }
                            style={{
                              flex: 1,
                              padding:
                                "10px",
                              border:
                                "none",
                              borderRadius:
                                "9px",
                              background:
                                "#2563eb",
                              color:
                                "#fff",
                              cursor:
                                "pointer",
                              fontWeight:
                                700,
                            }}
                          >
                            Open
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteResume(
                                resume.id
                              )
                            }
                            style={{
                              padding:
                                "10px 14px",
                              border:
                                "none",
                              borderRadius:
                                "9px",
                              background:
                                "#fee2e2",
                              color:
                                "#b91c1c",
                              cursor:
                                "pointer",
                              fontWeight:
                                700,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
      </div>

      {/* =====================================================
          BUILDER MODAL
      ===================================================== */}

      {isBuilderOpen && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            zIndex:
              9999,
            overflowY:
              "auto",
            padding:
              "30px 20px",
            background:
              "rgba(15,23,42,.68)",
            backdropFilter:
              "blur(6px)",
          }}
        >
          <div
            style={{
              width:
                "100%",
              maxWidth:
                builderStep ===
                  "preview"
                  ? "1450px"
                  : "1150px",
              margin:
                "0 auto",
              background:
                "#fff",
              borderRadius:
                "20px",
              overflow:
                "hidden",
              boxShadow:
                "0 25px 80px rgba(0,0,0,.25)",
            }}
          >
            {/* HEADER */}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                padding:
                  "20px 25px",
                borderBottom:
                  "1px solid #e2e8f0",
              }}
            >
              <div>
                <h2
                  style={{
                    margin:
                      0,
                    color:
                      "#0f172a",
                  }}
                >
                  {builderStep ===
                    "form" &&
                    "Create Your Resume"}

                  {builderStep ===
                    "templates" &&
                    "Choose Template"}

                  {builderStep ===
                    "generating" &&
                    "Creating Your Resume"}

                  {builderStep ===
                    "preview" &&
                    "Your Resume"}
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color:
                      "#64748b",
                    fontSize:
                      "13px",
                  }}
                >
                  {builderStep ===
                    "form" &&
                    "Your existing profile information is already filled."}

                  {builderStep ===
                    "templates" &&
                    "Choose one of the 10 templates."}

                  {builderStep ===
                    "generating" &&
                    "Your resume is being created..."}

                  {builderStep ===
                    "preview" &&
                    "Your resume is ready."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeBuilder
                }
                style={{
                  width:
                    "40px",
                  height:
                    "40px",
                  border:
                    "none",
                  borderRadius:
                    "10px",
                  background:
                    "#f1f5f9",
                  fontSize:
                    "22px",
                  cursor:
                    "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* USER LOAD */}

            {loadingUser &&
              builderStep ===
              "form" && (
                <div
                  style={{
                    padding:
                      "80px 30px",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      width:
                        "50px",
                      height:
                        "50px",
                      border:
                        "4px solid #dbeafe",
                      borderTopColor:
                        "#2563eb",
                      borderRadius:
                        "50%",
                      animation:
                        "spin 0.8s linear infinite",
                      margin:
                        "0 auto 20px",
                    }}
                  />

                  <h3>
                    Loading your profile...
                  </h3>
                </div>
              )}

            {/* USER ERROR */}

            {!loadingUser &&
              userError &&
              builderStep ===
              "form" && (
                <div
                  style={{
                    margin:
                      "25px",
                    padding:
                      "16px",
                    borderRadius:
                      "12px",
                    background:
                      "#fef2f2",
                    color:
                      "#b91c1c",
                  }}
                >
                  {userError}
                </div>
              )}

            {/* =================================================
                FORM
            ================================================= */}

            {!loadingUser &&
              !userError &&
              builderStep ===
              "form" && (
                <form
                  onSubmit={
                    handleFormSubmit
                  }
                  style={{
                    padding:
                      "25px",
                  }}
                >
                  {/* PERSONAL */}

                  <SectionTitle
                    title="Personal Information"
                  />

                  <div
                    className="responsive-grid"
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(2,minmax(0,1fr))",
                      gap:
                        "15px",
                    }}
                  >
                    <Input
                      label="First Name"
                      value={
                        resumeData
                          .personalInfo
                          .firstName
                      }
                      onChange={(
                        value
                      ) =>
                        updatePersonalInfo(
                          "firstName",
                          value
                        )
                      }
                    />

                    <Input
                      label="Last Name"
                      value={
                        resumeData
                          .personalInfo
                          .lastName
                      }
                      onChange={(
                        value
                      ) =>
                        updatePersonalInfo(
                          "lastName",
                          value
                        )
                      }
                    />

                    <TitleInput
                      value={
                        resumeData
                          .personalInfo
                          .professionalTitle
                      }
                      onChange={(
                        value
                      ) =>
                        updatePersonalInfo(
                          "professionalTitle",
                          value
                        )
                      }
                    />

                    <div>
                      <label
                        style={
                          labelStyle
                        }
                      >
                        Phone
                      </label>

                      <input
                        value={
                          resumeData
                            .personalInfo
                            .phone
                        }
                        onChange={(
                          e
                        ) =>
                          updatePersonalInfo(
                            "phone",
                            formatUzbekPhone(
                              e.target
                                .value
                            )
                          )
                        }
                        placeholder="+998 (90) 123-45-67"
                        style={
                          inputStyle
                        }
                      />
                    </div>

                    <div>
                      <label
                        style={
                          labelStyle
                        }
                      >
                        Email
                      </label>

                      <input
                        value={
                          resumeData
                            .personalInfo
                            .email
                        }
                        onChange={(
                          e
                        ) =>
                          updatePersonalInfo(
                            "email",
                            e.target
                              .value
                          )
                        }
                        placeholder="you@example.com"
                        style={{
                          ...inputStyle,
                          borderColor:
                            isValidEmail(
                              resumeData
                                .personalInfo
                                .email
                            )
                              ? "#cbd5e1"
                              : "#ef4444",
                        }}
                      />

                      {!isValidEmail(
                        resumeData
                          .personalInfo
                          .email
                      ) && (
                          <div
                            style={{
                              marginTop:
                                "5px",
                              fontSize:
                                "11px",
                              color:
                                "#ef4444",
                            }}
                          >
                            Email formatini tekshiring.
                          </div>
                        )}
                    </div>

                    <LocationInput
                      value={
                        resumeData
                          .personalInfo
                          .location
                      }
                      onChange={(
                        value
                      ) =>
                        updatePersonalInfo(
                          "location",
                          value
                        )
                      }
                    />

                    <Input
                      label="Portfolio"
                      value={
                        resumeData
                          .personalInfo
                          .portfolio
                      }
                      onChange={(
                        value
                      ) =>
                        updatePersonalInfo(
                          "portfolio",
                          formatURL(
                            value
                          )
                        )
                      }
                      placeholder="https://..."
                    />

                    <Input
                      label="Website"
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
                          formatURL(
                            value
                          )
                        )
                      }
                      placeholder="https://..."
                    />
                  </div>

                  {/* PHOTO */}

                  <div
                    style={{
                      marginTop:
                        "18px",
                    }}
                  >
                    <label
                      style={
                        labelStyle
                      }
                    >
                      Profile Photo
                    </label>

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "18px",
                      }}
                    >
                      <div
                        style={{
                          width:
                            "90px",
                          height:
                            "90px",
                          borderRadius:
                            "16px",
                          overflow:
                            "hidden",
                          border:
                            "1px solid #e2e8f0",
                          background:
                            "#f1f5f9",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        {resumeData
                          .personalInfo
                          .profilePhoto ? (
                          <img
                            src={
                              resumeData
                                .personalInfo
                                .profilePhoto
                            }
                            alt="Profile"
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize:
                                "28px",
                            }}
                          >
                            👤
                          </span>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="profile-upload"
                          style={{
                            display:
                              "inline-flex",
                            padding:
                              "11px 16px",
                            borderRadius:
                              "10px",
                            background:
                              "#2563eb",
                            color:
                              "#fff",
                            fontWeight:
                              700,
                            cursor:
                              "pointer",
                          }}
                        >
                          Upload Photo
                        </label>

                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={
                            handleProfileUpload
                          }
                          style={{
                            display:
                              "none",
                          }}
                        />

                        <div
                          style={{
                            marginTop:
                              "6px",
                            color:
                              "#64748b",
                            fontSize:
                              "11px",
                          }}
                        >
                          PNG, JPG, WEBP
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY */}

                  <SectionTitle
                    title="Professional Summary"
                  />

                  <textarea
                    rows={5}
                    value={
                      resumeData.professionalSummary
                    }
                    onChange={(
                      e
                    ) =>
                      updateResumeField(
                        "professionalSummary",
                        e.target
                          .value
                      )
                    }
                    placeholder="Write a short professional summary..."
                    style={
                      textareaStyle
                    }
                  />

                  {/* EXPERIENCE */}

                  <SectionTitle
                    title="Work Experience"
                  />

                  {resumeData.workExperience.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        style={
                          cardStyle
                        }
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            marginBottom:
                              "15px",
                          }}
                        >
                          <strong>
                            Experience #
                            {index +
                              1}
                          </strong>

                          <RemoveButton
                            onClick={() =>
                              removeArrayItem(
                                "workExperience",
                                index
                              )
                            }
                          />
                        </div>

                        <div
                          style={
                            twoColumnGrid
                          }
                        >
                          <Input
                            label="Position"
                            value={
                              item.position ||
                              ""
                            }
                            onChange={(
                              value
                            ) =>
                              updateArrayItem(
                                "workExperience",
                                index,
                                "position",
                                value
                              )
                            }
                          />

                          <Input
                            label="Company"
                            value={
                              item.company ||
                              ""
                            }
                            onChange={(
                              value
                            ) =>
                              updateArrayItem(
                                "workExperience",
                                index,
                                "company",
                                value
                              )
                            }
                          />
                        </div>

                        <div
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "1fr 1fr",
                            gap:
                              "15px",
                            marginTop:
                              "15px",
                          }}
                        >
                          <div>
                            <label
                              style={
                                labelStyle
                              }
                            >
                              From
                            </label>

                            <input
                              type="month"
                              value={
                                item.from ||
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                updateArrayItem(
                                  "workExperience",
                                  index,
                                  "from",
                                  e.target
                                    .value
                                )
                              }
                              style={
                                inputStyle
                              }
                            />
                          </div>

                          <div>
                            <label
                              style={
                                labelStyle
                              }
                            >
                              To
                            </label>

                            {!item.present && (
                              <input
                                type="month"
                                value={
                                  item.to ||
                                  ""
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateArrayItem(
                                    "workExperience",
                                    index,
                                    "to",
                                    e.target
                                      .value
                                  )
                                }
                                style={
                                  inputStyle
                                }
                              />
                            )}

                            {item.present && (
                              <div
                                style={{
                                  height:
                                    "44px",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  padding:
                                    "0 13px",
                                  border:
                                    "1px solid #cbd5e1",
                                  borderRadius:
                                    "10px",
                                  color:
                                    "#2563eb",
                                  fontWeight:
                                    700,
                                }}
                              >
                                Present
                              </div>
                            )}
                          </div>
                        </div>

                        <label
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap:
                              "8px",
                            marginTop:
                              "12px",
                            fontSize:
                              "13px",
                            cursor:
                              "pointer",
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
                              updateArrayItem(
                                "workExperience",
                                index,
                                "present",
                                e.target
                                  .checked
                              )
                            }
                          />

                          Hozirda ishlayapman
                        </label>

                        <div
                          style={{
                            marginTop:
                              "15px",
                          }}
                        >
                          <label
                            style={
                              labelStyle
                            }
                          >
                            Responsibilities
                          </label>

                          <textarea
                            rows={4}
                            value={
                              item.responsibilities ||
                              ""
                            }
                            onChange={(
                              e
                            ) =>
                              updateArrayItem(
                                "workExperience",
                                index,
                                "responsibilities",
                                e.target
                                  .value
                              )
                            }
                            style={
                              textareaStyle
                            }
                          />
                        </div>
                      </div>
                    )
                  )}

                  <AddButton
                    text="+ Add Experience"
                    onClick={() =>
                      addArrayItem(
                        "workExperience",
                        {
                          position:
                            "",
                          company:
                            "",
                          from:
                            "",
                          to:
                            "",
                          present:
                            false,
                          responsibilities:
                            "",
                        }
                      )
                    }
                  />

                  {/* EDUCATION */}

                  <SectionTitle
                    title="Education"
                  />

                  {resumeData.education.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        style={
                          cardStyle
                        }
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            marginBottom:
                              "15px",
                          }}
                        >
                          <strong>
                            Education #
                            {index +
                              1}
                          </strong>

                          <RemoveButton
                            onClick={() =>
                              removeArrayItem(
                                "education",
                                index
                              )
                            }
                          />
                        </div>

                        <div
                          style={
                            twoColumnGrid
                          }
                        >
                          <Input
                            label="Degree"
                            value={
                              item.degree ||
                              ""
                            }
                            onChange={(
                              value
                            ) =>
                              updateArrayItem(
                                "education",
                                index,
                                "degree",
                                value
                              )
                            }
                          />

                          <Input
                            label="Institution"
                            value={
                              item.institution ||
                              ""
                            }
                            onChange={(
                              value
                            ) =>
                              updateArrayItem(
                                "education",
                                index,
                                "institution",
                                value
                              )
                            }
                          />
                        </div>

                        <div
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "1fr 1fr",
                            gap:
                              "15px",
                            marginTop:
                              "15px",
                          }}
                        >
                          <div>
                            <label
                              style={
                                labelStyle
                              }
                            >
                              From
                            </label>

                            <input
                              type="month"
                              value={
                                item.from ||
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                updateArrayItem(
                                  "education",
                                  index,
                                  "from",
                                  e.target
                                    .value
                                )
                              }
                              style={
                                inputStyle
                              }
                            />
                          </div>

                          <div>
                            <label
                              style={
                                labelStyle
                              }
                            >
                              To
                            </label>

                            <input
                              type="month"
                              value={
                                item.to ||
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                updateArrayItem(
                                  "education",
                                  index,
                                  "to",
                                  e.target
                                    .value
                                )
                              }
                              style={
                                inputStyle
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <AddButton
                    text="+ Add Education"
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
                        }
                      )
                    }
                  />

                  {/* SKILLS */}

                  <SectionTitle
                    title="Skills"
                  />

                  <SkillChips
                    skills={
                      resumeData.skills
                    }
                    onAdd={
                      addSkill
                    }
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
                  />

                  {/* LANGUAGES */}

                  <SectionTitle
                    title="Languages"
                  />

                  <LanguageChips
                    languages={
                      resumeData.languages
                    }
                    onAdd={
                      addLanguage
                    }
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
                  />

                  {/* PROJECTS */}

                  <SectionTitle
                    title="Projects"
                  />

                  {resumeData.projects.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        style={
                          cardStyle
                        }
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                          }}
                        >
                          <strong>
                            Project #
                            {index +
                              1}
                          </strong>

                          <RemoveButton
                            onClick={() =>
                              removeArrayItem(
                                "projects",
                                index
                              )
                            }
                          />
                        </div>

                        <div
                          style={{
                            marginTop:
                              "15px",
                          }}
                        >
                          <Input
                            label="Project Name"
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
                          />
                        </div>

                        <div
                          style={{
                            marginTop:
                              "15px",
                          }}
                        >
                          <Input
                            label="Project Link"
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
                                formatURL(
                                  value
                                )
                              )
                            }
                          />
                        </div>

                        <div
                          style={{
                            marginTop:
                              "15px",
                          }}
                        >
                          <label
                            style={
                              labelStyle
                            }
                          >
                            Description
                          </label>

                          <textarea
                            rows={3}
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
                            style={
                              textareaStyle
                            }
                          />
                        </div>
                      </div>
                    )
                  )}

                  <AddButton
                    text="+ Add Project"
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
                  />

                  {/* CERTIFICATES */}

                  <SectionTitle
                    title="Certificates"
                  />

                  {resumeData.certifications.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        style={
                          cardStyle
                        }
                      >
                        <div
                          style={
                            twoColumnGrid
                          }
                        >
                          <Input
                            label="Certificate"
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
                          />

                          <Input
                            label="Organization"
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
                          />

                          <Input
                            label="Date"
                            type="month"
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
                          />

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "end",
                            }}
                          >
                            <RemoveButton
                              onClick={() =>
                                removeArrayItem(
                                  "certifications",
                                  index
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <AddButton
                    text="+ Add Certificate"
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
                  />

                  {/* SOCIAL */}

                  <SectionTitle
                    title="Social Links"
                  />

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(2,minmax(0,1fr))",
                      gap:
                        "15px",
                    }}
                  >
                    <Input
                      label="GitHub"
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
                          formatURL(
                            value
                          )
                        )
                      }
                      placeholder="github.com/username"
                    />

                    <Input
                      label="LinkedIn"
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
                          formatURL(
                            value
                          )
                        )
                      }
                      placeholder="linkedin.com/in/username"
                    />

                    <Input
                      label="Telegram"
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
                          formatURL(
                            value
                          )
                        )
                      }
                      placeholder="t.me/username"
                    />
                  </div>

                  {/* HOBBIES */}

                  <SectionTitle
                    title="Hobbies"
                  />

                  <textarea
                    rows={3}
                    value={
                      resumeData.hobbies.join(
                        ", "
                      )
                    }
                    onChange={(
                      e
                    ) =>
                      updateResumeField(
                        "hobbies",
                        e.target
                          .value
                          .split(",")
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
                    placeholder="Travel, Reading, Photography..."
                    style={
                      textareaStyle
                    }
                  />

                  {/* SUBMIT */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginTop:
                        "30px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={
                        reloadUserData
                      }
                      style={{
                        padding:
                          "12px 18px",
                        border:
                          "1px solid #cbd5e1",
                        borderRadius:
                          "10px",
                        background:
                          "#fff",
                        cursor:
                          "pointer",
                      }}
                    >
                      Reload Profile Data
                    </button>

                    <button
                      type="submit"
                      style={{
                        padding:
                          "14px 30px",
                        border:
                          "none",
                        borderRadius:
                          "12px",
                        background:
                          "#2563eb",
                        color:
                          "#fff",
                        fontWeight:
                          700,
                        cursor:
                          "pointer",
                      }}
                    >
                      Continue to Templates →
                    </button>
                  </div>
                </form>
              )}

            {/* =================================================
                TEMPLATES
            ================================================= */}

            {builderStep ===
              "templates" && (
                <div
                  style={{
                    padding:
                      "30px",
                  }}
                >
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(5,minmax(0,1fr))",
                      gap:
                        "20px",
                    }}
                  >
                    {TEMPLATES_REGISTRY.map(
                      (
                        template
                      ) => {
                        const selected =
                          template.id ===
                          selectedTemplateId;

                        return (
                          <button
                            type="button"
                            key={
                              template.id
                            }
                            onClick={() =>
                              selectTemplate(
                                template
                              )
                            }
                            style={{
                              padding:
                                "10px",
                              border:
                                selected
                                  ? `3px solid ${template.defaultColor}`
                                  : "1px solid #e2e8f0",
                              borderRadius:
                                "16px",
                              background:
                                "#fff",
                              cursor:
                                "pointer",
                              textAlign:
                                "left",
                            }}
                          >
                            <div
                              style={{
                                position:
                                  "relative",
                                borderRadius:
                                  "10px",
                                overflow:
                                  "hidden",
                                aspectRatio:
                                  "3/4",
                                background:
                                  "#f1f5f9",
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
                                      "10px",
                                    right:
                                      "10px",
                                    width:
                                      "30px",
                                    height:
                                      "30px",
                                    borderRadius:
                                      "50%",
                                    background:
                                      template.defaultColor,
                                    color:
                                      "#fff",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    fontWeight:
                                      800,
                                  }}
                                >
                                  ✓
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                padding:
                                  "10px 3px 3px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight:
                                    700,
                                  color:
                                    "#0f172a",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                {
                                  template.name
                                }
                              </div>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* COLOR */}

                  <div
                    style={{
                      marginTop:
                        "30px",
                      padding:
                        "18px",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        "14px",
                      background:
                        "#f8fafc",
                    }}
                  >
                    <div
                      style={{
                        fontWeight:
                          700,
                        marginBottom:
                          "10px",
                      }}
                    >
                      Primary Color
                    </div>

                    <div
                      style={{
                        display:
                          "flex",
                        gap:
                          "12px",
                        alignItems:
                          "center",
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
                            "55px",
                          height:
                            "40px",
                          border:
                            "none",
                          background:
                            "transparent",
                          cursor:
                            "pointer",
                        }}
                      />

                      <input
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
                          ...inputStyle,
                          maxWidth:
                            "180px",
                        }}
                      />
                    </div>
                  </div>

                  {/* BUTTONS */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginTop:
                        "30px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setBuilderStep(
                          "form"
                        )
                      }
                      style={{
                        padding:
                          "13px 22px",
                        border:
                          "1px solid #cbd5e1",
                        borderRadius:
                          "10px",
                        background:
                          "#fff",
                        cursor:
                          "pointer",
                      }}
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleGenerateResume
                      }
                      style={{
                        padding:
                          "14px 28px",
                        border:
                          "none",
                        borderRadius:
                          "12px",
                        background:
                          primaryColor,
                        color:
                          "#fff",
                        fontWeight:
                          700,
                        cursor:
                          "pointer",
                      }}
                    >
                      Create Resume →
                    </button>
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
                    minHeight:
                      "600px",
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      width:
                        "150px",
                      height:
                        "150px",
                      borderRadius:
                        "50%",
                      border:
                        "8px solid #e2e8f0",
                      borderTopColor:
                        primaryColor,
                      animation:
                        "spin 1s linear infinite",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize:
                          "45px",
                        fontWeight:
                          800,
                        color:
                          "#0f172a",
                      }}
                    >
                      {countdown}
                    </span>
                  </div>

                  <h2
                    style={{
                      marginTop:
                        "30px",
                    }}
                  >
                    Your Resume is being created...
                  </h2>

                  <p
                    style={{
                      color:
                        "#64748b",
                    }}
                  >
                    Saving your resume to your account.
                  </p>
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
                    padding:
                      "25px",
                    background:
                      "#f1f5f9",
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
                        "20px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin:
                            0,
                          color:
                            "#0f172a",
                        }}
                      >
                        Resume Ready 🎉
                      </h3>

                      <p
                        style={{
                          margin:
                            "5px 0 0",
                          color:
                            "#64748b",
                        }}
                      >
                        {editingResumeId
                          ? "Your resume was updated."
                          : "Your resume was saved successfully."}
                      </p>
                    </div>

                    <div
                      style={{
                        display:
                          "flex",
                        gap:
                          "10px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setBuilderStep(
                            "templates"
                          )
                        }
                        style={{
                          padding:
                            "11px 18px",
                          border:
                            "1px solid #cbd5e1",
                          borderRadius:
                            "10px",
                          background:
                            "#fff",
                          cursor:
                            "pointer",
                        }}
                      >
                        Change Template
                      </button>

                      <button
                        type="button"
                        onClick={
                          closeBuilder
                        }
                        style={{
                          padding:
                            "11px 18px",
                          border:
                            "none",
                          borderRadius:
                            "10px",
                          background:
                            primaryColor,
                          color:
                            "#fff",
                          cursor:
                            "pointer",
                          fontWeight:
                            700,
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      padding:
                        "25px",
                      overflowX:
                        "auto",
                      background:
                        "#cbd5e1",
                      borderRadius:
                        "16px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "center",
                        minWidth:
                          "fit-content",
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
      )}

      {/* GLOBAL STYLE */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          * {
            box-sizing: border-box;
          }

          input:focus,
          textarea:focus {
            outline: none;
            border-color: #2563eb !important;
            box-shadow: 0 0 0 3px rgba(37,99,235,.1);
          }

          @media (max-width: 1000px) {
            .responsive-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
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
// TITLE INPUT
// ============================================================

function TitleInput({
  value,
  onChange,
}) {
  const suggestions = [
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
        style={
          labelStyle
        }
      >
        Professional Title
      </label>

      <input
        list="professional-title-list"
        value={
          value
        }
        onChange={(
          e
        ) =>
          onChange(
            e.target.value
          )
        }
        placeholder="Frontend Developer"
        style={
          inputStyle
        }
      />

      <datalist id="professional-title-list">
        {suggestions.map(
          (item) => (
            <option
              key={
                item
              }
              value={
                item
              }
            />
          )
        )}
      </datalist>
    </div>
  );
}

// ============================================================
// LOCATION INPUT
// ============================================================

function LocationInput({
  value,
  onChange,
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

  const filtered =
    locations.filter(
      (location) =>
        location
          .toLowerCase()
          .includes(
            String(
              value ||
              ""
            ).toLowerCase()
          )
    );

  return (
    <div>
      <label
        style={
          labelStyle
        }
      >
        Location
      </label>

      <input
        list="location-list"
        value={
          value
        }
        onChange={(
          e
        ) =>
          onChange(
            e.target
              .value
          )
        }
        placeholder="Uzbekistan, Tashkent"
        style={
          inputStyle
        }
      />

      <datalist id="location-list">
        {filtered.map(
          (item) => (
            <option
              key={
                item
              }
              value={
                item
              }
            />
          )
        )}
      </datalist>

      <div
        style={{
          marginTop:
            "5px",
          fontSize:
            "11px",
          color:
            "#64748b",
        }}
      >
        Masalan: "Uz" yozsangiz Tashkent/Samarqand kabi variantlar chiqadi.
      </div>
    </div>
  );
}

// ============================================================
// SKILL CHIPS
// ============================================================

function SkillChips({
  skills,
  onAdd,
  onRemove,
  onLevelChange,
}) {
  const [value, setValue] =
    useState("");

  const submit =
    () => {
      const clean =
        value.trim();

      if (!clean)
        return;

      onAdd(clean);
      setValue("");
    };

  return (
    <div
      style={{
        padding:
          "15px",
        border:
          "1px solid #e2e8f0",
        borderRadius:
          "14px",
        background:
          "#f8fafc",
      }}
    >
      <div
        style={{
          display:
            "flex",
          flexWrap:
            "wrap",
          gap:
            "8px",
          marginBottom:
            "15px",
        }}
      >
        {skills.map(
          (
            skill,
            index
          ) => (
            <div
              key={
                `${skill.name}-${index}`
              }
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "7px",
                padding:
                  "8px 10px",
                background:
                  "#dbeafe",
                color:
                  "#1d4ed8",
                borderRadius:
                  "999px",
                fontSize:
                  "12px",
                fontWeight:
                  700,
              }}
            >
              <span>
                {
                  skill.name
                }
              </span>

              <input
                type="number"
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
                    "48px",
                  border:
                    "none",
                  background:
                    "transparent",
                  color:
                    "#1d4ed8",
                  fontWeight:
                    700,
                  outline:
                    "none",
                }}
              />

              <span>
                %
              </span>

              <button
                type="button"
                onClick={() =>
                  onRemove(
                    index
                  )
                }
                style={{
                  border:
                    "none",
                  background:
                    "transparent",
                  color:
                    "#1d4ed8",
                  cursor:
                    "pointer",
                  fontWeight:
                    900,
                }}
              >
                ×
              </button>
            </div>
          )
        )}
      </div>

      <div
        style={{
          display:
            "flex",
          gap:
            "10px",
        }}
      >
        <input
          value={
            value
          }
          onChange={(
            e
          ) =>
            setValue(
              e.target
                .value
            )
          }
          onKeyDown={(
            e
          ) => {
            if (
              e.key ===
              "Enter"
            ) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type a skill and press Enter"
          style={
            inputStyle
          }
        />

        <button
          type="button"
          onClick={
            submit
          }
          style={{
            padding:
              "0 18px",
            border:
              "none",
            borderRadius:
              "10px",
            background:
              "#2563eb",
            color:
              "#fff",
            fontWeight:
              700,
            cursor:
              "pointer",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ============================================================
// LANGUAGE CHIPS
// ============================================================

function LanguageChips({
  languages,
  onAdd,
  onRemove,
  onLevelChange,
}) {
  const [value, setValue] =
    useState("");

  const submit =
    () => {
      const clean =
        value.trim();

      if (!clean)
        return;

      onAdd(clean);
      setValue("");
    };

  return (
    <div
      style={{
        padding:
          "15px",
        border:
          "1px solid #e2e8f0",
        borderRadius:
          "14px",
        background:
          "#f8fafc",
      }}
    >
      <div
        style={{
          display:
            "flex",
          flexWrap:
            "wrap",
          gap:
            "10px",
          marginBottom:
            "15px",
        }}
      >
        {languages.map(
          (
            item,
            index
          ) => (
            <div
              key={
                `${item.language}-${index}`
              }
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "8px",
                padding:
                  "8px 10px",
                borderRadius:
                  "999px",
                background:
                  "#dcfce7",
                color:
                  "#166534",
                fontSize:
                  "12px",
                fontWeight:
                  700,
              }}
            >
              <span>
                {
                  item.language
                }
              </span>

              <select
                value={
                  item.level ||
                  ""
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
                  border:
                    "none",
                  background:
                    "transparent",
                  color:
                    "#166534",
                  fontWeight:
                    700,
                  outline:
                    "none",
                }}
              >
                <option value="">
                  Level
                </option>
                <option value="Native">
                  Native
                </option>
                <option value="A1">
                  A1
                </option>
                <option value="A2">
                  A2
                </option>
                <option value="B1">
                  B1
                </option>
                <option value="B2">
                  B2
                </option>
                <option value="C1">
                  C1
                </option>
                <option value="C2">
                  C2
                </option>
              </select>

              <button
                type="button"
                onClick={() =>
                  onRemove(
                    index
                  )
                }
                style={{
                  border:
                    "none",
                  background:
                    "transparent",
                  color:
                    "#166534",
                  cursor:
                    "pointer",
                  fontWeight:
                    900,
                }}
              >
                ×
              </button>
            </div>
          )
        )}
      </div>

      <div
        style={{
          display:
            "flex",
          gap:
            "10px",
        }}
      >
        <input
          value={
            value
          }
          onChange={(
            e
          ) =>
            setValue(
              e.target
                .value
            )
          }
          onKeyDown={(
            e
          ) => {
            if (
              e.key ===
              "Enter"
            ) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="English, Uzbek, Russian..."
          style={
            inputStyle
          }
        />

        <button
          type="button"
          onClick={
            submit
          }
          style={{
            padding:
              "0 18px",
            border:
              "none",
            borderRadius:
              "10px",
            background:
              "#16a34a",
            color:
              "#fff",
            fontWeight:
              700,
            cursor:
              "pointer",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ============================================================
// COMMON COMPONENTS
// ============================================================

function SectionTitle({
  title,
}) {
  return (
    <div
      style={{
        marginTop:
          "30px",
        marginBottom:
          "15px",
      }}
    >
      <h3
        style={{
          margin:
            0,
          fontSize:
            "17px",
          color:
            "#0f172a",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          height:
            "2px",
          marginTop:
            "7px",
          background:
            "#e2e8f0",
        }}
      />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <div>
      <label
        style={
          labelStyle
        }
      >
        {label}
      </label>

      <input
        type={type}
        value={
          value ??
          ""
        }
        placeholder={
          placeholder
        }
        onChange={(
          e
        ) =>
          onChange(
            e.target
              .value
          )
        }
        style={
          inputStyle
        }
      />
    </div>
  );
}

function AddButton({
  text,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      style={{
        marginTop:
          "10px",
        padding:
          "10px 15px",
        border:
          "1px dashed #94a3b8",
        borderRadius:
          "10px",
        background:
          "#f8fafc",
        color:
          "#2563eb",
        fontWeight:
          700,
        cursor:
          "pointer",
      }}
    >
      {text}
    </button>
  );
}

function RemoveButton({
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      style={{
        padding:
          "9px 12px",
        border:
          "none",
        borderRadius:
          "8px",
        background:
          "#fee2e2",
        color:
          "#b91c1c",
        cursor:
          "pointer",
        fontWeight:
          600,
      }}
    >
      Remove
    </button>
  );
}

// ============================================================
// STYLES
// ============================================================

const labelStyle = {
  display:
    "block",
  marginBottom:
    "7px",
  fontSize:
    "12px",
  fontWeight:
    700,
  color:
    "#475569",
};

const inputStyle = {
  width:
    "100%",
  height:
    "44px",
  padding:
    "0 13px",
  border:
    "1px solid #cbd5e1",
  borderRadius:
    "10px",
  outline:
    "none",
  color:
    "#0f172a",
  background:
    "#fff",
};

const textareaStyle = {
  width:
    "100%",
  padding:
    "12px 13px",
  border:
    "1px solid #cbd5e1",
  borderRadius:
    "10px",
  outline:
    "none",
  resize:
    "vertical",
  color:
    "#0f172a",
};

const twoColumnGrid = {
  display:
    "grid",
  gridTemplateColumns:
    "repeat(2,minmax(0,1fr))",
  gap:
    "15px",
};

const cardStyle = {
  marginBottom:
    "15px",
  padding:
    "18px",
  border:
    "1px solid #e2e8f0",
  borderRadius:
    "14px",
  background:
    "#f8fafc",
};