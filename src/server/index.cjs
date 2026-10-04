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

// ============================================================
// AI FALLBACK / RETRY CONFIG
// ============================================================

const OPENROUTER_MODELS = (
  process.env.OPENROUTER_MODELS ||
  [
    OPENROUTER_MODEL,
    "google/gemma-4-31b-it:free",
    "openrouter/free",
  ].join(",")
)
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean)
  .filter((model, index, list) => list.indexOf(model) === index);

const AI_MAX_RETRIES = Math.max(
  1,
  Number(process.env.AI_MAX_RETRIES || 2)
);

const AI_RETRY_BASE_DELAY_MS = Math.max(
  500,
  Number(process.env.AI_RETRY_BASE_DELAY_MS || 2000)
);

const AI_REQUEST_TIMEOUT_MS = Math.max(
  10000,
  Number(process.env.AI_REQUEST_TIMEOUT_MS || 45000)
);

const AI_MAX_TOKENS = Math.max(
  2500,
  Number(process.env.AI_MAX_TOKENS || 4000)
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfter(response, data) {
  const header = response?.headers?.get?.("retry-after");
  const seconds = Number(header);

  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, 30000);
  }

  const message = text(data?.error?.message || data?.error?.metadata?.raw);
  const match = message.match(/retry(?: after)?\s+(\d+(?:\.\d+)?)\s*(ms|s|sec|seconds)?/i);

  if (!match) return 0;

  const value = Number(match[1]);
  const unit = String(match[2] || "s").toLowerCase();
  const ms = unit === "ms" ? value : value * 1000;

  return Math.min(ms, 30000);
}


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
  if (value === null || value === undefined) {
    return null;
  }

  let content = "";

  if (typeof value === "string") {
    content = value.trim();
  } else if (Array.isArray(value)) {
    content = value
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.text || item?.content || "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  } else if (typeof value === "object") {
    if (value.type === "text") {
      content = text(value.text);
    } else {
      content = JSON.stringify(value);
    }
  }

  if (!content) return null;

  content = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // 1) Exact JSON response.
  try {
    return JSON.parse(content);
  } catch {}

  // 2) Remove common prose around a JSON object.
  const firstObject = content.indexOf("{");
  const lastObject = content.lastIndexOf("}");

  if (firstObject !== -1 && lastObject > firstObject) {
    const candidate = content.slice(firstObject, lastObject + 1);
    try {
      return JSON.parse(candidate);
    } catch {}
  }

  // 3) Balanced-brace scan. This handles prose containing more than one
  // brace pair and JSON wrapped in Markdown/code fences.
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0 && start !== -1) {
        const candidate = content.slice(start, i + 1);
        try {
          return JSON.parse(candidate);
        } catch {
          start = -1;
        }
      }
    }
  }

  return null;
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

async function requestAI(resume, language) {
  const prompt = buildPrompt(resume, language);
  let lastError = null;

  for (let attempt = 1; attempt <= AI_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

    try {
      console.log(`\\n[AI] Request ${attempt}/${AI_MAX_RETRIES}`);
      console.log("[AI] Model priority:", OPENROUTER_MODELS.join(" -> "));

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": APP_URL,
            "X-Title": APP_NAME,
          },
          body: JSON.stringify({
            // OpenRouter tries these models in priority order.
            models: OPENROUTER_MODELS,
            messages: [
              {
                role: "system",
                content:
                  "You are a JSON-only API. Return exactly one compact valid JSON object and nothing else. Do not show analysis, reasoning, thinking, Markdown fences, or commentary. Start your response with { and end it with }. Keep comments concise so the complete JSON fits within the output limit.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.1,
            max_tokens: AI_MAX_TOKENS,
            // Free routed models may spend output tokens on hidden/visible reasoning.
            // Keep reasoning minimal so the JSON has enough output budget.
            reasoning: {
              effort: "none",
            },
          }),
          signal: controller.signal,
        }
      );

      const raw = await response.text();
      let data = null;

      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }

      if (!response.ok) {
        const error = new Error(
          data?.error?.message || `OpenRouter HTTP ${response.status}`
        );
        error.status = response.status;
        error.retryAfterMs = parseRetryAfter(response, data);
        error.response = data;
        error.rawError = raw;

        console.error("OPENROUTER HTTP STATUS:", response.status);
        console.error("OPENROUTER RAW ERROR:", raw.slice(0, 4000));
        throw error;
      }

      const choice = data?.choices?.[0];
      const message = choice?.message || {};
      const contentCandidates = [
        message?.content,
        choice?.text,
        data?.output_text,
      ];

      let content = "";
      let parsed = null;

      for (const candidate of contentCandidates) {
        if (!candidate) continue;
        const possible = extractJson(candidate);
        if (possible) {
          parsed = possible;
          content =
            typeof candidate === "string"
              ? candidate
              : JSON.stringify(candidate);
          break;
        }

        if (!content) {
          content =
            typeof candidate === "string"
              ? candidate
              : JSON.stringify(candidate);
        }
      }

      console.log("OPENROUTER HTTP STATUS:", response.status);
      console.log("AI MODEL:", data?.model || "unknown");
      console.log(
        "AI RAW RESPONSE:",
        String(content || raw).slice(0, 3000)
      );

      if (!parsed) {
        const error = new Error(
          "AI JSON qaytarmadi. Model javobi AI RAW RESPONSE orqali tekshirilishi mumkin."
        );
        error.status = 502;
        error.model = data?.model || null;
        error.rawError = String(content || raw).slice(0, 4000);
        throw error;
      }

      return normalizeReview(parsed);
    } catch (error) {
      lastError = error;

      const is429 = Number(error?.status) === 429;
      const is502 = Number(error?.status) === 502;
      const canRetry = attempt < AI_MAX_RETRIES;

      console.error(
        `[AI] attempt ${attempt} failed:`,
        error?.message || error
      );

      if (!canRetry || (!is429 && !is502)) {
        break;
      }

      const retryAfter = Number(error?.retryAfterMs || 0);
      const exponential = AI_RETRY_BASE_DELAY_MS * attempt;
      const delay = Math.max(retryAfter, exponential);

      console.log(`[AI] Retrying after ${delay}ms...`);
      await sleep(delay);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("AI analizida xatolik.");
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

      console.log(
        `AI fallback models: ${OPENROUTER_MODELS.join(" -> ")}`
      );

      console.log(
        `AI retries: ${AI_MAX_RETRIES}, timeout: ${AI_REQUEST_TIMEOUT_MS}ms`
      );
    }

    else {
      console.log(
        "DIQQAT: OPENROUTER_API_KEY topilmadi"
      );
    }
  }
);