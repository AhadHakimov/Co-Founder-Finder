import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "2mb" }));

// =====================================================
// GROQ API KEY
// =====================================================

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY topilmadi!");
  console.error("❌ .env faylingizni tekshiring.");
}

// =====================================================
// GROQ CLIENT
// =====================================================

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// =====================================================
// TEST
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "running",
    groqKey: Boolean(process.env.GROQ_API_KEY),
  });
});

// =====================================================
// 1. FULL RESUME GENERATION
// =====================================================

app.post("/api/generate-resume-prompt", async (req, res) => {
  try {
    const { prompt, style } = req.body;

    console.log("\n=================================");
    console.log("📥 Resume generation request");
    console.log("Prompt:", prompt);
    console.log("Style:", style);
    console.log("=================================");

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY topilmadi.",
      });
    }

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Prompt bo'sh.",
      });
    }

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are a professional Resume/CV generator.

Generate a professional React JSX resume.

STRICT RULES:

1. Return ONLY JSX.
2. Return exactly one wrapping <div>...</div>.
3. Do not use markdown.
4. Do not use code fences.
5. Do not use import.
6. Do not use export.
7. Do not create functions.
8. Do not create const variables.
9. Use only JSX.
10. Use inline styles only.
11. Every style must use style={{...}}.
12. Do not use external CSS.
13. Do not use external libraries.
14. Do not invent user information.
15. Use the user's information exactly.
16. Make the resume professional and modern.
17. Selected style: ${style || "Modern Minimal"}.

FINAL RESPONSE MUST START WITH <div>
AND END WITH </div>.
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.4,
    });

    const content =
      response?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        error: "AI bo'sh response qaytardi.",
      });
    }

    console.log("✅ Resume generated successfully.");

    return res.json({
      success: true,
      layout: content,
    });
  } catch (error) {
    console.error("\n❌ GROQ ERROR");
    console.error("Name:", error?.name);
    console.error("Message:", error?.message);
    console.error("Status:", error?.status);
    console.error("Code:", error?.code);

    return res.status(error?.status || 500).json({
      success: false,
      error:
        error?.message ||
        "Resume yaratishda noma'lum xatolik.",
      code: error?.code || null,
    });
  }
});

// =====================================================
// 2. AI FIELD GENERATION
// =====================================================

app.post("/api/generate-field", async (req, res) => {
  try {
    const { fieldName, currentData } = req.body;

    console.log("\n=================================");
    console.log("📥 AI FIELD REQUEST");
    console.log("Field:", fieldName);
    console.log("=================================");

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY topilmadi.",
      });
    }

    if (!fieldName) {
      return res.status(400).json({
        success: false,
        error: "fieldName kerak.",
      });
    }

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
Siz professional CV writer siz.

Foydalanuvchi ma'lumotlaridan foydalanib,
"${fieldName}" uchun professional matn yozing.

QOIDALAR:

1. Faqat tayyor matn qaytaring.
2. Izoh yozmang.
3. Salomlashmang.
4. Markdown ishlatmang.
5. Ma'lumotlarni uydirmang.
6. Professional yozing.
`,
        },
        {
          role: "user",
          content: JSON.stringify(
            currentData,
            null,
            2
          ),
        },
      ],

      temperature: 0.5,
    });

    const text =
      response?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return res.status(500).json({
        success: false,
        error: "AI field uchun bo'sh response qaytdi.",
      });
    }

    return res.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("\n❌ FIELD API ERROR");
    console.error("Name:", error?.name);
    console.error("Message:", error?.message);
    console.error("Status:", error?.status);
    console.error("Code:", error?.code);

    return res.status(error?.status || 500).json({
      success: false,
      error:
        error?.message ||
        "AI field generation error.",
      code: error?.code || null,
    });
  }
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log("=================================");
  console.log(`🚀 Server http://localhost:${PORT}`);
  console.log("=================================");
});