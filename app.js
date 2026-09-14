/* =====================================================
   K-TUNGSTEN AI VIRTUAL OFFICE
   FRONTEND MVP
===================================================== */


const agents = {

  director: {
    name: "AI Director",
    icon: "🤖",
    description: "Barcha AI xodimlarni boshqaradi.",
    color: "blue"
  },

  it: {
    name: "IT Specialist",
    icon: "💻",
    description: "IT, kompyuter va tarmoq masalalari.",
    color: "blue"
  },

  analyst: {
    name: "Analyst AI",
    icon: "📊",
    description: "Excel va ma'lumotlarni tahlil qiladi.",
    color: "green"
  },

  document: {
    name: "Document AI",
    icon: "📄",
    description: "Word va professional hujjatlar.",
    color: "purple"
  },

  designer: {
    name: "Designer AI",
    icon: "🎨",
    description: "Banner, poster va grafik dizayn.",
    color: "purple"
  },

  presentation: {
    name: "Presentation AI",
    icon: "📽️",
    description: "Professional PowerPoint taqdimotlar.",
    color: "gold"
  },

  hr: {
    name: "HR AI",
    icon: "👨‍💼",
    description: "Vakansiya va HR jarayonlari.",
    color: "blue"
  },

  safety: {
    name: "Safety AI",
    icon: "🦺",
    description: "Mehnat va sanoat xavfsizligi.",
    color: "gold"
  },

  research: {
    name: "Research AI",
    icon: "🌐",
    description: "Internet va ma'lumot izlash.",
    color: "blue"
  },

  translator: {
    name: "Translator AI",
    icon: "🌍",
    description: "O‘zbek, rus va ingliz tillari.",
    color: "green"
  },

  developer: {
    name: "Developer AI",
    icon: "👨‍💻",
    description: "Kod, sayt va dasturlar.",
    color: "blue"
  },

  automation: {
    name: "Automation AI",
    icon: "⚙️",
    description: "Takroriy ishlarni avtomatlashtiradi.",
    color: "gold"
  }

};


let selectedAgent = "director";
let taskTotal = 3;
let completed = 27;


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  renderAgents();

  renderChatAgents();

  loadTheme();

  document.addEventListener("keydown", keyboardShortcuts);

});


/* =====================================================
   DASHBOARD AGENTS
===================================================== */

function renderAgents() {

  const grid = document.getElementById("agentsGrid");

  if (!grid) return;

  const keys = Object.keys(agents);

  grid.innerHTML = keys.map(key => {

    const a = agents[key];

    return `
      <div class="agent-card" onclick="selectAgent('${key}')">

        <div class="agent-top">

          <div class="agent-icon">
            ${a.icon}
          </div>

          <div class="agent-status"></div>

        </div>

        <h3>${a.name}</h3>

        <p>${a.description}</p>

      </div>
    `;

  }).join("");

}


/* =====================================================
   CHAT AGENTS
===================================================== */

function renderChatAgents() {

  const list = document.getElementById("chatAgentList");

  if (!list) return;

  list.innerHTML = Object.keys(agents).map(key => {

    const a = agents[key];

    return `
      <div
        class="chat-agent ${key === selectedAgent ? "selected" : ""}"
        onclick="selectAgent('${key}')"
      >

        <div class="chat-agent-icon">
          ${a.icon}
        </div>

        <div class="chat-agent-info">
          <strong>${a.name}</strong>
          <span>${a.description}</span>
        </div>

        <div class="chat-online"></div>

      </div>
    `;

  }).join("");

}


/* =====================================================
   SELECT AI AGENT
===================================================== */

function selectAgent(key) {

  if (!agents[key]) return;

  selectedAgent = key;

  showPage("chat");

  updateChatAgent();

  renderChatAgents();

}


function updateChatAgent() {

  const agent = agents[selectedAgent];

  document.getElementById("chatIcon").textContent = agent.icon;

  document.getElementById("chatName").textContent = agent.name;

  const messages = document.getElementById("messages");

  messages.innerHTML = `
    <div class="message ai-message">

      <div class="message-avatar">
        ${agent.icon}
      </div>

      <div>

        <div class="message-name">
          ${agent.name}
        </div>

        <div class="bubble">
          Salom! Men <strong>${agent.name}</strong>man. 👋
          <br><br>
          ${agent.description}
          <br><br>
          Menga topshiriq bering.
        </div>

        <small>Hozir</small>

      </div>

    </div>
  `;

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId, clickedButton = null) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active-page");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active-page");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (clickedButton) {
    clickedButton.classList.add("active");
  }

  if (pageId === "dashboard") {
    document.querySelectorAll(".nav-item")[1]?.classList.add("active");
  }

  if (pageId === "chat") {
    document.querySelectorAll(".nav-item")[2]?.classList.add("active");
  }

  if (pageId === "tasks") {
    document.querySelectorAll(".nav-item")[3]?.classList.add("active");
  }

  if (pageId === "files") {
    document.querySelectorAll(".nav-item")[4]?.classList.add("active");
  }

  closeMobileSidebar();

}


/* =====================================================
   NEW TASK
===================================================== */

function newTask() {

  document.getElementById("modal").classList.add("open");

  setTimeout(() => {
    document.getElementById("taskInput").focus();
  }, 100);

}


function closeModal() {

  document.getElementById("modal").classList.remove("open");

}


/* =====================================================
   CREATE TASK
===================================================== */

function createTask() {

  const input = document.getElementById("taskInput");

  const task = input.value.trim();

  const agent = document.getElementById("taskAgent").value;

  if (!task) {

    showToast("Avval topshiriqni yozing.");

    input.focus();

    return;

  }

  taskTotal++;

  document.getElementById("taskCount").textContent = taskTotal;

  document.getElementById("activeStat").textContent = taskTotal;

  closeModal();

  input.value = "";

  showToast(
    `${agents[agent].name} topshiriqni qabul qildi ✓`
  );

  setTimeout(() => {

    selectAgent(agent);

    document.getElementById("chatInput").value = task;

    sendMessage();

  }, 500);

}


/* =====================================================
   QUICK TASK
===================================================== */

function quickTask(text) {

  document.getElementById("modal").classList.add("open");

  document.getElementById("taskInput").value = text;

}


/* =====================================================
   CHAT
===================================================== */

function handleEnter(event) {

  if (event.key === "Enter") {

    event.preventDefault();

    sendMessage();

  }

}


function sendMessage() {

  const input = document.getElementById("chatInput");

  const text = input.value.trim();

  if (!text) return;

  const messages = document.getElementById("messages");

  const agent = agents[selectedAgent];

  messages.insertAdjacentHTML(
    "beforeend",
    `
    <div class="message user-message">

      <div class="message-content">

        <div class="bubble">
          ${escapeHTML(text)}
        </div>

        <small>Hozir</small>

      </div>

    </div>
    `
  );

  input.value = "";

  messages.scrollTop = messages.scrollHeight;


  /* DEMO AI RESPONSE */

  setTimeout(() => {

    const response = generateDemoResponse(text, selectedAgent);

    messages.insertAdjacentHTML(
      "beforeend",
      `
      <div class="message ai-message">

        <div class="message-avatar">
          ${agent.icon}
        </div>

        <div>

          <div class="message-name">
            ${agent.name}
          </div>

          <div class="bubble">
            ${response}
          </div>

          <small>Hozir</small>

        </div>

      </div>
      `
    );

    messages.scrollTop = messages.scrollHeight;

  }, 800);

}


/* =====================================================
   DEMO AI RESPONSES
===================================================== */

function generateDemoResponse(text, agent) {

  const lower = text.toLowerCase();

  if (agent === "director") {

    return `
      Topshiriqni qabul qildim. 🤖
      <br><br>
      Men uni tahlil qilib, kerakli AI xodimlarga
      taqsimlayman.
      <br><br>
      <strong>Keyingi bosqich:</strong> real AI API
      ulangandan so‘ng bu jarayon avtomatik bajariladi.
    `;

  }

  if (agent === "it") {

    return `
      IT Specialist topshirig‘ingizni qabul qildi. 💻
      <br><br>
      Muammoni aniqlash uchun qurilma, operatsion
      tizim yoki tarmoq ma'lumotlarini yuboring.
    `;

  }

  if (agent === "analyst") {

    return `
      📊 Excel yoki CSV faylini yuklang.
      <br><br>
      Men jadvalni tahlil qilish, formulalarni
      tekshirish va hisobot tayyorlash jarayonini
      boshlashga tayyorman.
    `;

  }

  if (agent === "document") {

    return `
      📄 Hujjatni tayyorlashga tayyorman.
      <br><br>
      Word hujjati, buyruq, ariza, xizmat xati
      yoki boshqa rasmiy hujjat formatini
      tayyorlash mumkin.
    `;

  }

  if (agent === "designer") {

    return `
      🎨 Dizayn topshirig‘i qabul qilindi.
      <br><br>
      Banner, A4 e'lon, Instagram post yoki
      boshqa grafik material uchun brief tayyor.
    `;

  }

  if (agent === "presentation") {

    return `
      📽️ Taqdimot strukturasini tayyorlashga tayyorman.
      <br><br>
      Mavzu, auditoriya va kerakli rasmlarni
      yuborsangiz, slaydlar ketma-ketligini tuzaman.
    `;

  }

  if (agent === "hr") {

    return `
      👨‍💼 HR topshirig‘i qabul qilindi.
      <br><br>
      Vakansiya, ish e'loni, lavozim tavsifi
      yoki HR hujjatini tayyorlash mumkin.
    `;

  }

  if (agent === "safety") {

    return `
      🦺 Safety AI topshirig‘ingizni qabul qildi.
      <br><br>
      Xavfsizlik bo‘yicha material, yo‘riqnoma,
      checklist yoki o‘quv taqdimoti tayyorlash
      mumkin.
    `;

  }

  if (agent === "research") {

    return `
      🌐 Research AI tayyor.
      <br><br>
      Real web-search integratsiyasi ulanganda
      kerakli ma'lumotlarni internetdan topib,
      manbalar bilan qaytaraman.
    `;

  }

  if (agent === "translator") {

    return `
      🌍 Tarjima qilishga tayyorman.
      <br><br>
      O‘zbekcha, Русский yoki English matnni
      yuboring.
    `;

  }

  if (agent === "developer") {

    return `
      👨‍💻 Developer AI tayyor.
      <br><br>
      HTML, CSS, JavaScript, Python va boshqa
      texnologiyalar bo‘yicha kod yozish yoki
      mavjud kodni tuzatish mumkin.
    `;

  }

  if (agent === "automation") {

    return `
      ⚙️ Automation AI topshirig‘ini qabul qildi.
      <br><br>
      Takroriy ishlarni avtomatlashtirish uchun
      jarayonni bosqichma-bosqich ishlab chiqamiz.
    `;

  }

  return `
    Topshiriq qabul qilindi. 🤖
    <br><br>
    Real AI backend ulangandan so‘ng men bu
    topshiriqni to‘liq bajaraman.
  `;

}


/* =====================================================
   FILE HANDLING
===================================================== */

function handleFile(input) {

  if (!input.files.length) return;

  const file = input.files[0];

  document.getElementById("attachmentPreview").textContent =
    `📎 ${file.name}`;

  showToast(`${file.name} tanlandi.`);

}


function uploadOfficeFile(input) {

  if (!input.files.length) return;

  const file = input.files[0];

  const size = formatBytes(file.size);

  const extension =
    file.name.split(".").pop().toUpperCase();

  const list = document.getElementById("fileList");

  list.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="file-item">

        <div class="file-icon">
          ${extension.substring(0, 4)}
        </div>

        <div>
          <strong>${escapeHTML(file.name)}</strong>
          <span>Yuklandi · ${size}</span>
        </div>

        <button>⋮</button>

      </div>
    `
  );

  showToast("Fayl Virtual Office'ga qo‘shildi ✓");

}


/* =====================================================
   SEARCH
===================================================== */

function globalSearch(value) {

  if (!value.trim()) return;

  const query = value.toLowerCase();

  const found = Object.keys(agents).find(key => {

    return (
      agents[key].name.toLowerCase().includes(query) ||
      agents[key].description.toLowerCase().includes(query)
    );

  });

  if (found) {

    selectAgent(found);

  }

}


/* =====================================================
   THEME
===================================================== */

function toggleTheme() {

  document.body.classList.toggle("light");

  localStorage.setItem(
    "officeTheme",
    document.body.classList.contains("light")
      ? "light"
      : "dark"
  );

}


function loadTheme() {

  const theme = localStorage.getItem("officeTheme");

  if (theme === "light") {

    document.body.classList.add("light");

  }

}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

function toggleSidebar() {

  document
    .getElementById("sidebar")
    .classList.toggle("open");

}


function closeMobileSidebar() {

  document
    .getElementById("sidebar")
    .classList.remove("open");

}


/* =====================================================
   NOTIFICATIONS
===================================================== */

function showNotifications() {

  showToast("3 ta yangi bildirishnoma mavjud.");

}


/* =====================================================
   SETTINGS
===================================================== */

function openSettings() {

  showToast("Sozlamalar bo‘limi keyingi versiyada.");

}


/* =====================================================
   KEYBOARD
===================================================== */

function keyboardShortcuts(event) {

  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  ) {

    event.preventDefault();

    const search =
      document.getElementById("globalSearch");

    search.style.display = "flex";

    search.focus();

  }

  if (event.key === "Escape") {

    closeModal();

  }

}


/* =====================================================
   HELPERS
===================================================== */

function showToast(message) {

  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);

}


function formatBytes(bytes) {

  if (bytes === 0) return "0 Bytes";

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];

  const index =
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

  return (
    parseFloat(
      (bytes / Math.pow(1024, index)).toFixed(2)
    ) +
    " " +
    units[index]
  );

}


function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =====================================================
   CLOSE MODAL WHEN CLICK OUTSIDE
===================================================== */

document.addEventListener("click", event => {

  const modal =
    document.getElementById("modal");

  if (
    event.target === modal
  ) {

    closeModal();

  }

});
