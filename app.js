const agents = [
  {
    icon: "🤖",
    name: "AI Director",
    role: "Boshqaruv",
    description: "Vazifalarni qabul qiladi va boshqa AI xodimlarga taqsimlaydi."
  },
  {
    icon: "💻",
    name: "IT AI",
    role: "IT Specialist",
    description: "Kompyuter, tarmoq, dasturiy ta'minot va texnik muammolar."
  },
  {
    icon: "📊",
    name: "Analyst AI",
    role: "Data Analyst",
    description: "Excel, statistik ma'lumotlar va hisobotlarni tahlil qiladi."
  },
  {
    icon: "📄",
    name: "Document AI",
    role: "Hujjatlar",
    description: "Word, ariza, buyruq, xat va boshqa hujjatlarni tayyorlaydi."
  },
  {
    icon: "🎨",
    name: "Designer AI",
    role: "Designer",
    description: "Banner, A4, Instagram va boshqa grafik materiallar."
  },
  {
    icon: "📽️",
    name: "Presentation AI",
    role: "Presentation",
    description: "PowerPoint va professional taqdimotlar yaratadi."
  },
  {
    icon: "👨‍💼",
    name: "HR AI",
    role: "Human Resources",
    description: "Vakansiya, HR hujjatlari va xodimlar bilan bog‘liq ishlar."
  },
  {
    icon: "🦺",
    name: "Safety AI",
    role: "Safety",
    description: "Mehnat xavfsizligi va texnika xavfsizligi materiallari."
  },
  {
    icon: "🌐",
    name: "Research AI",
    role: "Research",
    description: "Internetdan ma'lumot topadi va tahlil qiladi."
  },
  {
    icon: "🌍",
    name: "Translator AI",
    role: "Translator",
    description: "O‘zbek, rus va ingliz tillari o‘rtasida tarjima."
  },
  {
    icon: "👨‍💻",
    name: "Developer AI",
    role: "Developer",
    description: "Web saytlar, dasturlar, kod va avtomatlashtirish."
  },
  {
    icon: "⚙️",
    name: "Automation AI",
    role: "Automation",
    description: "Takroriy ishlarni avtomatlashtirish va workflow yaratish."
  }
];

let tasks = [
  {
    title: "Karer xavfsizligi taqdimoti",
    agent: "Safety AI",
    status: "done"
  },
  {
    title: "Santexnik vakansiyasi",
    agent: "HR AI",
    status: "progress"
  },
  {
    title: "Oylik Excel hisoboti",
    agent: "Analyst AI",
    status: "waiting"
  }
];


/* NAVIGATION */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {

  item.addEventListener("click", () => {

    const page = item.dataset.page;

    openPage(page);

  });

});


function openPage(page) {

  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active-page");
  });

  const target = document.getElementById(page);

  if (target) {
    target.classList.add("active-page");
  }

  navItems.forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.page === page
    );
  });

  const titles = {
    dashboard: "Dashboard",
    agents: "AI Xodimlar",
    tasks: "Topshiriqlar",
    files: "Fayllar"
  };

  document.getElementById("pageTitle").textContent =
    titles[page] || "Dashboard";

  if (page === "agents") {
    renderAgents();
  }

  if (page === "tasks") {
    renderTasks();
  }

}


/* AI AGENTS */

function renderAgents() {

  const grid = document.getElementById("agentsGrid");

  grid.innerHTML = agents.map(agent => `

    <div class="agent-card">

      <div class="agent-top">

        <div class="agent-icon">
          ${agent.icon}
        </div>

        <div>
          <h3>${agent.name}</h3>
          <small>● ONLINE</small>
        </div>

      </div>

      <p>${agent.description}</p>

      <button
        class="agent-button"
        onclick="startAgent('${agent.name}')"
      >
        Ishga tushirish →
      </button>

    </div>

  `).join("");

}


function startAgent(name) {

  openPage("dashboard");

  addAIMessage(
    `<strong>${name}</strong> ishga tayyor. 
     Vazifangizni yuborishingiz mumkin.`
  );

}


/* CHAT */

function sendMessage(event) {

  event.preventDefault();

  const input = document.getElementById("messageInput");

  const text = input.value.trim();

  if (!text) return;

  addUserMessage(text);

  input.value = "";

  setTimeout(() => {

    processAI(text);

  }, 700);

}


function addUserMessage(text) {

  const chat = document.getElementById("chat");

  const div = document.createElement("div");

  div.className = "message user";

  div.innerHTML = `
    <div class="bubble">${escapeHtml(text)}</div>
  `;

  chat.appendChild(div);

  chat.scrollTop = chat.scrollHeight;

}


function addAIMessage(text) {

  const chat = document.getElementById("chat");

  const div = document.createElement("div");

  div.className = "message ai";

  div.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="bubble">${text}</div>
  `;

  chat.appendChild(div);

  chat.scrollTop = chat.scrollHeight;

}


function processAI(text) {

  const lower = text.toLowerCase();

  let selectedAgent = "AI Director";

  if (
    lower.includes("excel") ||
    lower.includes("hisobot") ||
    lower.includes("jadval")
  ) {
    selectedAgent = "Analyst AI";
  }

  else if (
    lower.includes("vakans") ||
    lower.includes("xodim") ||
    lower.includes("hr")
  ) {
    selectedAgent = "HR AI";
  }

  else if (
    lower.includes("xavfsizlik") ||
    lower.includes("texnika xavfsizligi") ||
    lower.includes("mehnat")
  ) {
    selectedAgent = "Safety AI";
  }

  else if (
    lower.includes("banner") ||
    lower.includes("dizayn") ||
    lower.includes("instagram")
  ) {
    selectedAgent = "Designer AI";
  }

  else if (
    lower.includes("powerpoint") ||
    lower.includes("taqdimot") ||
    lower.includes("prezentatsiya")
  ) {
    selectedAgent = "Presentation AI";
  }

  else if (
    lower.includes("word") ||
    lower.includes("hujjat") ||
    lower.includes("ariza") ||
    lower.includes("buyruq")
  ) {
    selectedAgent = "Document AI";
  }

  else if (
    lower.includes("kod") ||
    lower.includes("sayt") ||
    lower.includes("dastur")
 
