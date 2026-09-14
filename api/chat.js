```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

/*
========================================================
K-TUNGSTEN AI VIRTUAL OFFICE
AI DIRECTOR
========================================================
*/

const AGENTS = {

  director: {
    name: "AI Director",
    description: "Boshqaruvchi AI. Vazifani tahlil qiladi va eng mos AI xodimni tanlaydi."
  },

  it: {
    name: "IT Specialist",
    description: "Kompyuterlar, tarmoqlar, GPS, kameralar, printerlar, serverlar va IT muammolari."
  },

  analyst: {
    name: "Analyst AI",
    description: "Excel, jadval, statistik ma'lumotlar va biznes tahlili."
  },

  document: {
    name: "Document AI",
    description: "Rasmiy hujjatlar, xatlar, hisobotlar va matnlar."
  },

  designer: {
    name: "Designer AI",
    description: "Banner, poster, Instagram, reklama va vizual dizayn g'oyalari."
  },

  presentation: {
    name: "Presentation AI",
    description: "PowerPoint taqdimotlari, slaydlar va prezentatsiya strukturasi."
  },

  hr: {
    name: "HR AI",
    description: "Vakansiyalar, ish e'lonlari, HR hujjatlari va xodimlar bilan bog'liq vazifalar."
  },

  safety: {
    name: "Safety AI",
    description: "Mehnat xavfsizligi, sanoat xavfsizligi, karer va ishlab chiqarish xavfsizligi."
  },

  research: {
    name: "Research AI",
    description: "Ma'lumot izlash, tadqiqot, texnologiyalar va yangi g'oyalar."
  },

  translator: {
    name: "Translator AI",
    description: "O'zbek, rus va ingliz tillariga tarjima."
  },

  developer: {
    name: "Developer AI",
    description: "HTML, CSS, JavaScript, backend, API va dasturlash."
  },

  automation: {
    name: "Automation AI",
    description: "Takroriy ishlarni avtomatlashtirish, workflow va integratsiyalar."
  }

};


/*
========================================================
AI DIRECTOR
========================================================
*/

function chooseAgent(message) {

  const text = message.toLowerCase();

  if (
    text.includes("excel") ||
    text.includes("jadval") ||
    text.includes("hisobot") ||
    text.includes("statistika") ||
    text.includes("analiz") ||
    text.includes("tahlil")
  ) {
    return "analyst";
  }

  if (
    text.includes("xavfsizlik") ||
    text.includes("texnika xavfsizligi") ||
    text.includes("karer xavfsizligi") ||
    text.includes("mehnat xavfsizligi")
  ) {
    return "safety";
  }

  if (
    text.includes("vakansiya") ||
    text.includes("xodim") ||
    text.includes("ishchi") ||
    text.includes("hr") ||
    text.includes("rezyume")
  ) {
    return "hr";
  }

  if (
    text.includes("taqdimot") ||
    text.includes("prezentatsiya") ||
    text.includes("powerpoint") ||
    text.includes("slayd")
  ) {
    return "presentation";
  }

  if (
    text.includes("dizayn") ||
    text.includes("banner") ||
    text.includes("instagram") ||
    text.includes("poster") ||
    text.includes("rasm")
  ) {
    return "designer";
  }

  if (
    text.includes("kod") ||
    text.includes("javascript") ||
    text.includes("html") ||
    text.includes("css") ||
    text.includes("sayt") ||
    text.includes("api") ||
    text.includes("backend")
  ) {
    return "developer";
  }

  if (
    text.includes("tarjima") ||
    text.includes("rus til") ||
    text.includes("ingliz til") ||
    text.includes("uzbek til")
  ) {
    return "translator";
  }

  if (
    text.includes("kompyuter") ||
    text.includes("printer") ||
    text.includes("scanner") ||
    text.includes("skaner") ||
    text.includes("gps") ||
    text.includes("kamera") ||
    text.includes("wifi") ||
    text.includes("internet") ||
    text.includes("server") ||
    text.includes("tarmoq")
  ) {
    return "it";
  }

  if (
    text.includes("avtomatlashtir") ||
    text.includes("avtomatik") ||
    text.includes("workflow")
  ) {
    return "automation";
  }

  if (
    text.includes("izla") ||
    text.includes("tadqiqot") ||
    text.includes("yangilik") ||
    text.includes("texnologiya")
  ) {
    return "research";
  }

  if (
    text.includes("hujjat") ||
    text.includes("xat") ||
    text.includes("ariza") ||
    text.includes("buyruq") ||
    text.includes("rasmiy")
  ) {
    return "document";
  }

  return "director";
}


/*
========================================================
SYSTEM PROMPTS
========================================================
*/

function getSystemPrompt(agentKey) {

  const agent = AGENTS[agentKey];

  return `
Siz K-TUNGSTEN AI Virtual Office tizimidagi "${agent.name}"siz.

KONTEXT:

K-TUNGSTEN — wolfram qazib olinadigan sanoat korxonasi.
Foydalanuvchi IT yo'nalishida ishlaydi.
Ish muhiti:
- wolfram kareri
- texnika va transportlar
- GPS tizimlari
- videokameralar
- IT infratuzilma
- ishlab chiqarish
- xavfsizlik
- HR
- hujjatlar
- texnik xizmat

SIZNING ROLINGIZ:

${agent.description}

JAVOB QOIDALARI:

1. Foydalanuvchiga o'zbek tilida javob bering.
2. Zarur bo'lsa ruscha yoki inglizcha terminlardan foydalaning.
3. Javobni amaliy va tushunarli qiling.
4. Keraksiz uzun gaplardan foydalanmang.
5. Agar texnik vazifa bo'lsa, bosqichma-bosqich ko'rsatma bering.
6. Kod kerak bo'lsa, to'liq ishlaydigan kod bering.
7. Foydalanuvchi sanoat korxonasida ishlayotganini hisobga oling.
8. Xavfsizlikka oid masalalarda xavfsiz va ehtiyotkor tavsiyalar bering.

Agar vazifa sizning rolingizga mos bo'lmasa,
AI Director sifatida kerakli mutaxassisga yo'naltirishni tavsiya qiling.
`;
}


/*
========================================================
API HANDLER
========================================================
*/

export default async function handler(req, res) {

  /*
  CORS
  */

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Faqat POST so'rovi qabul qilinadi."
    });
  }

  try {

    /*
    BODY
    */

    const {
      message,
      agent = "director",
      history = []
    } = req.body || {};

    if (!message || !message.trim()) {

      return res.status(400).json({
        success: false,
        error: "Xabar bo'sh."
      });

    }


    /*
    AI DIRECTOR
    */

    let selectedAgent = agent;

    if (agent === "director") {
      selectedAgent = chooseAgent(message);
    }

    const selectedAgentInfo =
      AGENTS[selectedAgent] || AGENTS.director;


    /*
    CHAT HISTORY
    */

    const messages = [

      {
        role: "system",
        content: getSystemPrompt(selectedAgent)
      },

      ...history
        .filter(item =>
          item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string"
        )
        .slice(-10),

      {
        role: "user",
        content: message
      }

    ];


    /*
    OPENAI
    */

    const response = await client.responses.create({

      model: MODEL,

      input: messages,

      max_output_tokens: 4000

    });


    /*
    RESULT
    */

    const answer =
      response.output_text ||
      "AI javob qaytarmadi.";


    return res.status(200).json({

      success: true,

      answer,

      agent: {
        id: selectedAgent,
        name: selectedAgentInfo.name
      },

      model: MODEL

    });

  } catch (error) {

    console.error("AI ERROR:", error);

    return res.status(500).json({

      success: false,

      error:
        error?.message ||
        "AI serverida noma'lum xatolik yuz berdi."

    });

  }

}
```
