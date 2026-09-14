````javascript
/* =========================================================
   K-TUNGSTEN AI VIRTUAL OFFICE
   FRONTEND APPLICATION
   Real AI API + AI Director
   ========================================================= */


/* =========================================================
   GLOBAL STATE
   ========================================================= */

window.currentAgent = "director";

window.chatHistory = [];

let selectedFiles = [];

let tasks = [];

let isSending = false;


/* =========================================================
   AI AGENTS
   ========================================================= */

const agents = {

    director: {
        name: "AI Director",
        icon: "👨‍💼",
        description: "Barcha AI xodimlarini boshqaradi va topshiriqni kerakli mutaxassisga beradi."
    },

    it: {
        name: "IT Specialist",
        icon: "💻",
        description: "Kompyuterlar, tarmoqlar, GPS, kameralar, printerlar va IT infratuzilmasi."
    },

    analyst: {
        name: "Analyst AI",
        icon: "📊",
        description: "Excel, jadval, statistika va ma'lumotlarni tahlil qiladi."
    },

    document: {
        name: "Document AI",
        icon: "📄",
        description: "Rasmiy hujjatlar, xatlar, hisobotlar va hujjatlarni tayyorlaydi."
    },

    designer: {
        name: "Designer AI",
        icon: "🎨",
        description: "Banner, poster, Instagram va boshqa dizaynlar uchun g'oyalar beradi."
    },

    presentation: {
        name: "Presentation AI",
        icon: "📽️",
        description: "PowerPoint va boshqa taqdimotlar strukturasi va matnlarini tayyorlaydi."
    },

    hr: {
        name: "HR AI",
        icon: "👥",
        description: "Vakansiya, ish e'loni, HR va xodimlar bilan bog'liq ishlar."
    },

    safety: {
        name: "Safety AI",
        icon: "🦺",
        description: "Mehnat xavfsizligi, sanoat xavfsizligi va karer xavfsizligi."
    },

    research: {
        name: "Research AI",
        icon: "🔎",
        description: "Tadqiqot, yangi texnologiyalar va ma'lumot izlash."
    },

    translator: {
        name: "Translator AI",
        icon: "🌐",
        description: "O'zbek, rus va ingliz tillariga tarjima."
    },

    developer: {
        name: "Developer AI",
        icon: "👨‍💻",
        description: "HTML, CSS, JavaScript, API, backend va dasturlash."
    },

    automation: {
        name: "Automation AI",
        icon: "⚙️",
        description: "Takroriy ishlarni avtomatlashtirish va workflow yaratish."
    }

};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeOffice();

});


function initializeOffice() {

    renderAgents();

    setupNavigation();

    setupChat();

    setupModal();

    setupSearch();

    setupTheme();

    setupMobileMenu();

    setupKeyboardShortcuts();

    setupFileUpload();

    loadSavedData();

    updateDashboard();

}


/* =========================================================
   AGENTS
   ========================================================= */

function renderAgents() {

    const container =
        document.querySelector("#agentGrid") ||
        document.querySelector(".agent-grid") ||
        document.querySelector("[data-agent-grid]");

    if (!container) return;

    container.innerHTML = "";

    Object.entries(agents).forEach(([id, agent]) => {

        const card = document.createElement("div");

        card.className = "agent-card";

        card.dataset.agent = id;

        card.innerHTML = `

            <div class="agent-icon">
                ${agent.icon}
            </div>

            <div class="agent-info">

                <h3>
                    ${escapeHtml(agent.name)}
                </h3>

                <p>
                    ${escapeHtml(agent.description)}
                </p>

            </div>

        `;

        card.addEventListener("click", () => {

            selectAgent(id);

        });

        container.appendChild(card);

    });

}


/* =========================================================
   SELECT AGENT
   ========================================================= */

function selectAgent(agentId) {

    if (!agents[agentId]) {

        agentId = "director";

    }

    window.currentAgent = agentId;

    const agent = agents[agentId];


    /*
    Highlight selected agent
    */

    document
        .querySelectorAll(".agent-card")
        .forEach(card => {

            card.classList.toggle(
                "active",
                card.dataset.agent === agentId
            );

        });


    /*
    Update selected agent labels
    */

    document
        .querySelectorAll("[data-current-agent]")
        .forEach(element => {

            element.textContent = agent.name;

        });


    /*
    Open chat
    */

    showPage("chat");


    /*
    Welcome message
    */

    const chatMessages =
        document.querySelector("#chatMessages") ||
        document.querySelector(".chat-messages");

    if (
        chatMessages &&
        chatMessages.children.length === 0
    ) {

        addChatMessage(
            "assistant",
            `${agent.icon} <strong>${agent.name}</strong> ishga tayyor. Vazifangizni yozing.`
        );

    }

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    document
        .querySelectorAll("[data-page]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const page =
                    button.dataset.page;

                showPage(page);

            });

        });


    /*
    Old-style navigation buttons
    */

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.addEventListener("click", () => {

                const page =
                    item.dataset.page ||
                    item.getAttribute("data-target");

                if (page) {

                    showPage(page);

                }

            });

        });

}


function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove("active");

        });


    const target =
        document.getElementById(page) ||
        document.querySelector(`[data-page-content="${page}"]`);

    if (target) {

        target.classList.add("active");

    }


    /*
    Navigation active state
    */

    document
        .querySelectorAll("[data-page], .nav-item")
        .forEach(item => {

            const itemPage =
                item.dataset.page ||
                item.getAttribute("data-target");

            item.classList.toggle(
                "active",
                itemPage === page
            );

        });


    /*
    Mobile sidebar close
    */

    closeMobileMenu();

}


/* =========================================================
   CHAT
   ========================================================= */

function setupChat() {

    const input =
        document.querySelector("#chatInput") ||
        document.querySelector("textarea[name='message']") ||
        document.querySelector(".chat-input textarea");

    const sendButton =
        document.querySelector("#sendMessage") ||
        document.querySelector("#sendBtn") ||
        document.querySelector(".send-btn");


    if (input) {

        input.addEventListener(
            "keydown",
            handleEnter
        );

    }


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendMessage
        );

    }

}


function handleEnter(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }

}


/* =========================================================
   REAL AI REQUEST
   ========================================================= */

async function sendMessage() {

    if (isSending) return;


    const input =
        document.querySelector("#chatInput") ||
        document.querySelector("textarea[name='message']") ||
        document.querySelector(".chat-input textarea");


    if (!input) {

        showToast(
            "Chat input topilmadi.",
            "error"
        );

        return;

    }


    const message =
        input.value.trim();


    if (!message) return;


    /*
    USER MESSAGE
    */

    addChatMessage(
        "user",
        escapeHtml(message)
    );


    input.value = "";


    /*
    Disable sending
    */

    isSending = true;


    /*
    Loading message
    */

    const loadingId =
        "ai-loading-" + Date.now();


    addChatMessage(
        "assistant",
        `
        <div id="${loadingId}" class="ai-loading">
            <span>AI o'ylayapti</span>
            <span class="loading-dots">...</span>
        </div>
        `
    );


    try {

        /*
        Send last 12 messages
        */

        const history =
            window.chatHistory
                .slice(-12);


        /*
        API
        */

        const response =
            await fetch(
                "/api/chat",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message,

                        agent:
                            window.currentAgent ||
                            "director",

                        history

                    })

                }
            );


        /*
        Parse response
        */

        const data =
            await response.json();


        /*
        API error
        */

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Server xatosi"
            );

        }


        /*
        Save history
        */

        window.chatHistory.push({

            role: "user",

            content: message

        });


        window.chatHistory.push({

            role: "assistant",

            content: data.answer

        });


        /*
        Limit history
        */

        if (
            window.chatHistory.length > 20
        ) {

            window.chatHistory =
                window.chatHistory.slice(-20);

        }


        /*
        Remove loading
        */

        const loading =
            document.getElementById(
                loadingId
            );


        if (loading) {

            loading.outerHTML =
                formatAIResponse(
                    data.answer
                );

        }


        /*
        AI Director selected agent
        */

        if (
            data.agent &&
            data.agent.id
        ) {

            showAgentNotification(
                data.agent
            );

        }


        /*
        Update dashboard
        */

        updateDashboard();


    } catch (error) {

        console.error(
            "AI ERROR:",
            error
        );


        const loading =
            document.getElementById(
                loadingId
            );


        if (loading) {

            loading.outerHTML = `

                <div class="ai-error">

                    ❌ <strong>AI bilan aloqa xatosi</strong>

                    <br><br>

                    ${escapeHtml(
                        error.message
                    )}

                </div>

            `;

        }


        showToast(
            "AI serverida xatolik yuz berdi.",
            "error"
        );


    } finally {

        isSending = false;

    }

}


/* =========================================================
   ADD CHAT MESSAGE
   ========================================================= */

function addChatMessage(
    type,
    content
) {

    const container =
        document.querySelector("#chatMessages") ||
        document.querySelector(".chat-messages");


    if (!container) return;


    const message =
        document.createElement("div");


    message.className =
        `chat-message ${type}`;


    if (type === "user") {

        message.innerHTML = `

            <div class="message-content">

                ${content}

            </div>

        `;

    } else {

        message.innerHTML = `

            <div class="message-avatar">
                🤖
            </div>

            <div class="message-content">

                ${content}

            </div>

        `;

    }


    container.appendChild(message);


    /*
    Scroll bottom
    */

    container.scrollTop =
        container.scrollHeight;

}


/* =========================================================
   FORMAT AI RESPONSE
   ========================================================= */

function formatAIResponse(text) {

    if (!text) {

        return `
            <div class="chat-message assistant">
                AI javob qaytarmadi.
            </div>
        `;

    }


    let result =
        escapeHtml(text);


    /*
    Code blocks
    */

    result =
        result.replace(
            /```([\s\S]*?)```/g,
            `
            <pre class="code-block"><code>$1</code></pre>
            `
        );


    /*
    Bold
    */

    result =
        result.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    /*
    Bullet points
    */

    result =
        result.replace(
            /^\s*[-•]\s(.+)$/gm,
            "<li>$1</li>"
        );


    /*
    New lines
    */

    result =
        result.replace(
            /\n/g,
            "<br>"
        );


    return `

        <div class="chat-message assistant">

            <div class="message-avatar">
                🤖
            </div>

            <div class="message-content">

                ${result}

            </div>

        </div>

    `;

}


/* =========================================================
   AGENT NOTIFICATION
   ========================================================= */

function showAgentNotification(agent) {

    if (!agent || !agent.name) return;


    showToast(
        `AI Director: ${agent.name} tanlandi.`,
        "success"
    );

}


/* =========================================================
   NEW TASK
   ========================================================= */

function newTask() {

    const modal =
        document.querySelector("#taskModal") ||
        document.querySelector(".modal");


    if (!modal) {

        showPage("tasks");

        return;

    }


    modal.classList.add("active");

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.classList.remove("active");

        });

}


/* =========================================================
   MODAL
   ========================================================= */

function setupModal() {

    document
        .querySelectorAll(
            "[data-close-modal], .modal-close"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                closeModal
            );

        });


    document
        .querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        closeModal();

                    }

                }
            );

        });


    const createButton =
        document.querySelector(
            "#createTask"
        );


    if (createButton) {

        createButton.addEventListener(
            "click",
            createTask
        );

    }

}


/* =========================================================
   CREATE TASK
   ========================================================= */

function createTask() {

    const titleInput =
        document.querySelector(
            "#taskTitle"
        ) ||
        document.querySelector(
            "input[name='taskTitle']"
        );


    const descriptionInput =
        document.querySelector(
            "#taskDescription"
        ) ||
        document.querySelector(
            "textarea[name='taskDescription']"
        );


    const agentInput =
        document.querySelector(
            "#taskAgent"
        ) ||
        document.querySelector(
            "select[name='taskAgent']"
        );


    const title =
        titleInput?.value.trim() ||
        "Yangi topshiriq";


    const description =
        descriptionInput?.value.trim() ||
        "";


    const agent =
        agentInput?.value ||
        "director";


    const task = {

        id:
            Date.now(),

        title,

        description,

        agent,

        status:
            "Jarayonda",

        created:
            new Date()
                .toLocaleString("uz-UZ")

    };


    tasks.unshift(task);


    saveTasks();

    renderTasks();

    closeModal();


    /*
    Open chat
    */

    window.currentAgent = agent;

    showPage("chat");


    /*
    Put task into chat
    */

    const input =
        document.querySelector(
            "#chatInput"
        );


    if (input) {

        input.value =
            `${title}\n${description}`;

        input.focus();

    }


    showToast(
        "Topshiriq yaratildi.",
        "success"
    );

}


/* =========================================================
   QUICK TASK
   ========================================================= */

function quickTask(
    text,
    agent = "director"
) {

    window.currentAgent = agent;


    showPage("chat");


    const input =
        document.querySelector(
            "#chatInput"
        );


    if (input) {

        input.value = text;

        input.focus();

    }


    sendMessage();

}


/* =========================================================
   TASKS
   ========================================================= */

function renderTasks() {

    const container =
        document.querySelector(
            "#taskList"
        ) ||
        document.querySelector(
            ".task-list"
        );


    if (!container) return;


    container.innerHTML = "";


    if (tasks.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                Hozircha topshiriqlar yo'q.

            </div>

        `;

        return;

    }


    tasks.forEach(task => {

        const agent =
            agents[task.agent] ||
            agents.director;


        const item =
            document.createElement("div");


        item.className =
            "task-item";


        item.innerHTML = `

            <div class="task-icon">
                ${agent.icon}
            </div>

            <div class="task-info">

                <h4>
                    ${escapeHtml(task.title)}
                </h4>

                <p>
                    ${escapeHtml(task.description)}
                </p>

                <small>
                    ${escapeHtml(task.created)}
                </small>

            </div>

            <div class="task-status">
                ${escapeHtml(task.status)}
            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================================
   FILE UPLOAD
   ========================================================= */

function setupFileUpload() {

    const input =
        document.querySelector(
            "#fileInput"
        );


    const zone =
        document.querySelector(
            "#uploadZone"
        ) ||
        document.querySelector(
            ".upload-zone"
        );


    if (!input) return;


    input.addEventListener(
        "change",
        event => {

            handleFiles(
                event.target.files
            );

        }
    );


    if (zone) {

        zone.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                zone.classList.add(
                    "dragging"
                );

            }
        );


        zone.addEventListener(
            "dragleave",
            () => {

                zone.classList.remove(
                    "dragging"
                );

            }
        );


        zone.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                zone.classList.remove(
                    "dragging"
                );

                handleFiles(
                    event.dataTransfer.files
                );

            }
        );

    }

}


function handleFiles(fileList) {

    if (!fileList) return;


    Array.from(fileList)
        .forEach(file => {

            selectedFiles.push(file);

            showToast(
                `${file.name} yuklandi.`,
                "success"
            );

        });


    renderFiles();

}


/* =========================================================
   FILE LIST
   ========================================================= */

function renderFiles() {

    const container =
        document.querySelector(
            "#fileList"
        ) ||
        document.querySelector(
            ".file-list"
        );


    if (!container) return;


    container.innerHTML = "";


    selectedFiles.forEach(
        (file, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "file-item";


            item.innerHTML = `

                <div class="file-icon">
                    📄
                </div>

                <div class="file-info">

                    <strong>
                        ${escapeHtml(file.name)}
                    </strong>

                    <small>
                        ${formatFileSize(
                            file.size
                        )}
                    </small>

                </div>

                <button
                    class="file-remove"
                    data-index="${index}"
                >
                    ×
                </button>

            `;


            container.appendChild(item);

        }
    );


    container
        .querySelectorAll(
            ".file-remove"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    selectedFiles.splice(
                        index,
                        1
                    );

                    renderFiles();

                }
            );

        });

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.querySelector(
            "#globalSearch"
        ) ||
        document.querySelector(
            ".global-search input"
        );


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        event => {

            const query =
                event.target.value
                    .toLowerCase()
                    .trim();


            document
                .querySelectorAll(
                    ".agent-card, .task-item"
                )
                .forEach(item => {

                    const text =
                        item.textContent
                            .toLowerCase();


                    item.style.display =
                        !query ||
                        text.includes(query)
                            ? ""
                            : "none";

                });

        }
    );

}


/* =========================================================
   THEME
   ========================================================= */

function setupTheme() {

    const savedTheme =
        localStorage.getItem(
            "kt_theme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light"
        );

    }


    document
        .querySelectorAll(
            "#themeToggle, .theme-toggle"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                toggleTheme
            );

        });

}


function toggleTheme() {

    document.body.classList.toggle(
        "light"
    );


    const theme =
        document.body.classList.contains(
            "light"
        )
            ? "light"
            : "dark";


    localStorage.setItem(
        "kt_theme",
        theme
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    document
        .querySelectorAll(
            "#menuToggle, .menu-toggle"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                toggleMobileMenu
            );

        });

}


function toggleMobileMenu() {

    document.body.classList.toggle(
        "sidebar-open"
    );

}


function closeMobileMenu() {

    document.body.classList.remove(
        "sidebar-open"
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            /*
            Ctrl + K
            */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                const search =
                    document.querySelector(
                        "#globalSearch"
                    );

                if (search) {

                    search.focus();

                }

            }


            /*
            Ctrl + N
            */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "n"
            ) {

                event.preventDefault();

                newTask();

            }


            /*
            Escape
            */

            if (
                event.key === "Escape"
            ) {

                closeModal();

                closeMobileMenu();

            }

        }
    );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    /*
    Active AI
    */

    document
        .querySelectorAll(
            "[data-stat='agents']"
        )
        .forEach(element => {

            element.textContent =
                Object.keys(agents).length;

        });


    /*
    Completed
    */

    document
        .querySelectorAll(
            "[data-stat='completed']"
        )
        .forEach(element => {

            element.textContent =
                tasks.filter(
                    task =>
                        task.status ===
                        "Bajarildi"
                ).length;

        });


    /*
    In progress
    */

    document
        .querySelectorAll(
            "[data-stat='progress']"
        )
        .forEach(element => {

            element.textContent =
                tasks.filter(
                    task =>
                        task.status ===
                        "Jarayonda"
                ).length;

        });

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = "info"
) {

    let container =
        document.querySelector(
            "#toastContainer"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "toastContainer";

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast ${type}`;


    toast.innerHTML = `

        <span>
            ${escapeHtml(message)}
        </span>

    `;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "hide"
            );

            setTimeout(
                () => toast.remove(),
                300
            );

        },
        3500
    );

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveTasks() {

    localStorage.setItem(
        "kt_tasks",
        JSON.stringify(tasks)
    );

}


function loadSavedData() {

    try {

        const savedTasks =
            localStorage.getItem(
                "kt_tasks"
            );


        if (savedTasks) {

            tasks =
                JSON.parse(
                    savedTasks
                );

        }

    } catch (error) {

        console.error(
            "Local storage error:",
            error
        );

        tasks = [];

    }


    renderTasks();

}


/* =========================================================
   FILE SIZE
   ========================================================= */

function formatFileSize(bytes) {

    if (!bytes) return "0 B";


    const units = [
        "B",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        bytes /
        Math.pow(1024, index)
    ).toFixed(1)
    + " "
    + units[index];

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.selectAgent =
    selectAgent;

window.showPage =
    showPage;

window.newTask =
    newTask;

window.closeModal =
    closeModal;

window.createTask =
    createTask;

window.quickTask =
    quickTask;

window.sendMessage =
    sendMessage;

window.handleEnter =
    handleEnter;

window.toggleTheme =
    toggleTheme;

window.toggleMobileMenu =
    toggleMobileMenu;

window.closeMobileMenu =
    closeMobileMenu;

window.showToast =
    showToast;


/* =========================================================
   START
   ========================================================= */

console.log(
    "%cK-TUNGSTEN AI Virtual Office",
    "font-size:20px;font-weight:bold;"
);

console.log(
    "AI Director: ONLINE"
);

console.log(
    "Agents:",
    Object.keys(agents).length
);
````
