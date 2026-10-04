require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = Number(process.env.PORT || 5000);

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY;

const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ||
  "google/gemma-4-26b-a4b-it:free";

const APP_URL =
  process.env.APP_URL ||
  "http://localhost:5173";

const APP_NAME =
  process.env.APP_NAME ||
  "CEOBACE";

app.use(
  cors({
    origin: true,
  })
);

app.use(
  express.json({
    limit: "2mb",
  })
);

// ============================================================
// BASIC HELPERS
// ============================================================

function text(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}

function score(value) {
  const n = Number(value);

  if (!Number.isFinite(n)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(n)
    )
  );
}

function stringArray(
  value,
  limit = 8
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => text(item))
    .filter(Boolean)
    .slice(0, limit);
}

function section(value) {
  return {
    score: score(
      value?.score
    ),
    comment: text(
      value?.comment
    ),
  };
}

// ============================================================
// AI RESPONSE NORMALIZATION
// ============================================================

function normalizeReview(raw) {
  const sections =
    raw?.sections || {};

  return {
    score: score(
      raw?.score
    ),

    summary: text(
      raw?.summary
    ),

    strengths:
      stringArray(
        raw?.strengths
      ),

    improvements:
      stringArray(
        raw?.improvements
      ),

    recommendation:
      text(
        raw?.recommendation
      ),

    sections: {
      personalInfo:
        section(
          sections.personalInfo
        ),

      summary:
        section(
          sections.summary
        ),

      experience:
        section(
          sections.experience
        ),

      education:
        section(
          sections.education
        ),

      skills:
        section(
          sections.skills
        ),

      projects:
        section(
          sections.projects
        ),

      certificates:
        section(
          sections.certificates
        ),

      socialLinks:
        section(
          sections.socialLinks
        ),
    },
  };
}

// ============================================================
// EXTRACT JSON FROM AI RESPONSE
// ============================================================

function extractJson(value) {
  if (!value) {
    return null;
  }

  let content = "";

  if (
    typeof value === "string"
  ) {
    content = value.trim();
  }

  else if (
    Array.isArray(value)
  ) {
    content = value
      .map((item) => {
        if (
          typeof item ===
          "string"
        ) {
          return item;
        }

        return (
          item?.text ||
          item?.content ||
          ""
        );
      })
      .join("\n")
      .trim();
  }

  else if (
    typeof value === "object"
  ) {
    if (
      value.type === "text"
    ) {
      content = text(
        value.text
      );
    }

    else {
      content =
        JSON.stringify(
          value
        );
    }
  }

  if (!content) {
    return null;
  }

  // Markdown JSON block
  content = content
    .replace(
      /^```json\s*/i,
      ""
    )
    .replace(
      /^```\s*/i,
      ""
    )
    .replace(
      /\s*```$/i,
      ""
    )
    .trim();

  // Direct JSON
  try {
    return JSON.parse(
      content
    );
  }

  catch {
    // JSON ichini textdan qidirish
    const start =
      content.indexOf("{");

    const end =
      content.lastIndexOf("}");

    if (
      start === -1 ||
      end === -1 ||
      end <= start
    ) {
      return null;
    }

    try {
      return JSON.parse(
        content.slice(
          start,
          end + 1
        )
      );
    }

    catch {
      return null;
    }
  }
}

// ============================================================
// RESUME CLEANER
// ============================================================

function compactResume(resume) {
  const data =
    resume?.data || {};

  return {
    title:
      text(
        resume?.title
      ),

    personalInfo: {
      firstName:
        text(
          data.personalInfo
            ?.firstName
        ),

      lastName:
        text(
          data.personalInfo
            ?.lastName
        ),

      professionalTitle:
        text(
          data.personalInfo
            ?.professionalTitle
        ),

      email:
        text(
          data.personalInfo
            ?.email
        ),

      phone:
        text(
          data.personalInfo
            ?.phone
        ),

      location:
        text(
          data.personalInfo
            ?.location
        ),
    },

    professionalSummary:
      text(
        data.professionalSummary
      ),

    workExperience:
      Array.isArray(
        data.workExperience
      )
        ? data.workExperience
            .slice(0, 10)
            .map((item) => ({
              position:
                text(
                  item?.position
                ),

              company:
                text(
                  item?.company
                ),

              from:
                text(
                  item?.from
                ),

              to:
                text(
                  item?.to
                ),

              present:
                Boolean(
                  item?.present
                ),

              responsibilities:
                text(
                  item?.responsibilities
                ).slice(
                  0,
                  3000
                ),
            }))
        : [],

    education:
      Array.isArray(
        data.education
      )
        ? data.education
            .slice(0, 10)
            .map((item) => ({
              degree:
                text(
                  item?.degree
                ),

              institution:
                text(
                  item?.institution
                ),

              from:
                text(
                  item?.from
                ),

              to:
                text(
                  item?.to
                ),
            }))
        : [],

    skills:
      Array.isArray(
        data.skills
      )
        ? data.skills
            .slice(0, 30)
            .map((item) => ({
              name:
                text(
                  item?.name ||
                    item?.skill ||
                    item
                ),

              level:
                score(
                  item?.level
                ),
            }))
        : [],

    languages:
      Array.isArray(
        data.languages
      )
        ? data.languages
            .slice(0, 20)
            .map((item) => ({
              language:
                text(
                  item?.language ||
                    item?.name ||
                    item
                ),

              level:
                text(
                  item?.level ||
                    item?.proficiency
                ),
            }))
        : [],

    projects:
      Array.isArray(
        data.projects
      )
        ? data.projects
            .slice(0, 15)
            .map((item) => ({
              name:
                text(
                  item?.name ||
                    item?.projectName
                ),

              description:
                text(
                  item?.description
                ).slice(
                  0,
                  3000
                ),

              link:
                text(
                  item?.link ||
                    item?.projectLink
                ),
            }))
        : [],

    certifications:
      Array.isArray(
        data.certifications
      )
        ? data.certifications
            .slice(0, 15)
            .map((item) => ({
              title:
                text(
                  item?.title ||
                    item?.name
                ),

              organization:
                text(
                  item?.organization ||
                    item?.issuer
                ),

              date:
                text(
                  item?.date ||
                    item?.issueDate
                ),

              credentialId:
                text(
                  item?.credentialId
                ),
            }))
        : [],

    socialLinks: {
      github:
        text(
          data.socialLinks
            ?.github
        ),

      linkedin:
        text(
          data.socialLinks
            ?.linkedin
        ),

      telegram:
        text(
          data.socialLinks
            ?.telegram
        ),

      website:
        text(
          data.socialLinks
            ?.website
        ),
    },

    hobbies:
      Array.isArray(
        data.hobbies
      )
        ? data.hobbies
            .map(text)
            .filter(Boolean)
            .slice(0, 15)
        : [],
  };
}

// ============================================================
// BUILD AI PROMPT
// ============================================================

function buildPrompt(
  resume,
  language
) {
  const languageName =
    language === "ru"
      ? "Russian"
      : language === "en"
      ? "English"
      : "Uzbek";

  const cleanResume =
    compactResume(
      resume
    );

  return `
You are CEOBACE AI Resume Reviewer.

Analyze the resume honestly.

DO NOT invent:
- jobs
- companies
- skills
- achievements
- education
- certificates
- numbers
- technologies

Only evaluate information that actually exists.

Evaluate:

1. Personal information
2. Professional summary
3. Work experience
4. Education
5. Skills
6. Projects
7. Certificates
8. Social links

The overall score must be between 0 and 100.

Every text field must be written in ${languageName}.

IMPORTANT:
Return ONLY JSON.
Do not write:
- "Here's..."
- "Sure"
- Markdown
- explanations before JSON
- explanations after JSON

Use EXACTLY this JSON structure:

{
  "score": 0,
  "summary": "",
  "strengths": [],
  "improvements": [],
  "recommendation": "",
  "sections": {
    "personalInfo": {
      "score": 0,
      "comment": ""
    },
    "summary": {
      "score": 0,
      "comment": ""
    },
    "experience": {
      "score": 0,
      "comment": ""
    },
    "education": {
      "score": 0,
      "comment": ""
    },
    "skills": {
      "score": 0,
      "comment": ""
    },
    "projects": {
      "score": 0,
      "comment": ""
    },
    "certificates": {
      "score": 0,
      "comment": ""
    },
    "socialLinks": {
      "score": 0,
      "comment": ""
    }
  }
}

Resume:

${JSON.stringify(
  cleanResume,
  null,
  2
)}
`;
}

// ============================================================
// OPENROUTER
// ============================================================

async function requestAI(
  resume,
  language
) {
  const prompt =
    buildPrompt(
      resume,
      language
    );

  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 45000);

  try {
    const response =
      await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${OPENROUTER_API_KEY}`,

            "Content-Type":
              "application/json",

            "HTTP-Referer":
              APP_URL,

            "X-Title":
              APP_NAME,
          },

          body: JSON.stringify({
            model:
              OPENROUTER_MODEL,

            messages: [
              {
                role: "system",
                content:
                  "Return ONLY valid JSON. No extra text.",
              },

              {
                role: "user",
                content:
                  prompt,
              },
            ],

            temperature: 0.2,

            max_tokens: 1800,

            response_format: {
              type:
                "json_object",
            },
          }),

          signal:
            controller.signal,
        }
      );

    const raw =
      await response.text();

    let data = null;

    try {
      data =
        JSON.parse(raw);
    }

    catch {
      data = null;
    }

    if (!response.ok) {
      console.error(
        "OPENROUTER STATUS:",
        response.status
      );

      console.error(
        "OPENROUTER ERROR:",
        data?.error ||
          raw
      );

      throw new Error(
        data?.error?.message ||
          `OpenRouter HTTP ${response.status}`
      );
    }

    console.log(
      "AI MODEL:",
      data?.model ||
        OPENROUTER_MODEL
    );

    const message =
      data?.choices?.[0]
        ?.message;

    const content =
      message?.content ??
      data?.choices?.[0]
        ?.text ??
      data?.output_text ??
      "";

    if (!content) {
      console.error(
        "AI RESPONSE KEYS:",
        Object.keys(
          message || {}
        )
      );

      console.error(
        "AI CHOICE:",
        JSON.stringify(
          data?.choices?.[0] ||
            null,
          null,
          2
        )
      );

      throw new Error(
        "AI javobi bo‘sh qaytdi."
      );
    }

    console.log(
      "AI RAW RESPONSE:",
      String(content).slice(
        0,
        1000
      )
    );

    const parsed =
      extractJson(
        content
      );

    if (!parsed) {
      throw new Error(
        "AI JSON qaytarmadi. Model javobi yuqoridagi AI RAW RESPONSE orqali tekshirilishi mumkin."
      );
    }

    return normalizeReview(
      parsed
    );
  }

  finally {
    clearTimeout(
      timeout
    );
  }
}

// ============================================================
// ROUTES
// ============================================================

app.get(
  "/",
  (_req, res) => {
    res.json({
      success: true,
      server:
        "CEOBACE AI Server",
      model:
        OPENROUTER_MODEL,
    });
  }
);

app.get(
  "/api/ai/health",
  (_req, res) => {
    res.json({
      success: true,
      apiKey:
        Boolean(
          OPENROUTER_API_KEY
        ),
      model:
        OPENROUTER_MODEL,
    });
  }
);

// ============================================================
// AI REVIEW
// ============================================================

app.post(
  "/api/ai/review",
  async (
    req,
    res
  ) => {
    if (
      !OPENROUTER_API_KEY
    ) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            "OPENROUTER_API_KEY topilmadi.",
        });
    }

    const resume =
      req.body?.resume;

    const language =
      ["uz", "en", "ru"].includes(
        req.body?.language
      )
        ? req.body.language
        : "uz";

    if (
      !resume ||
      typeof resume !==
        "object"
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Resume ma'lumoti yuborilmadi.",
        });
    }

    try {
      const review =
        await requestAI(
          resume,
          language
        );

      return res.json({
        success: true,
        review,
        model:
          OPENROUTER_MODEL,
      });
    }

    catch (error) {
      console.error(
        "AI REVIEW ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            error?.message ||
            "AI analizida xatolik.",
        });
    }
  }
);

// ============================================================
// START
// ============================================================

app.listen(
  PORT,
  () => {
    console.log(
      `Server http://localhost:${PORT} da ishlayapti`
    );

    if (
      OPENROUTER_API_KEY
    ) {
      console.log(
        "OpenRouter API key topildi"
      );

      console.log(
        `AI model: ${OPENROUTER_MODEL}`
      );
    }

    else {
      console.log(
        "DIQQAT: OPENROUTER_API_KEY topilmadi"
      );
    }
  }
);