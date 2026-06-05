// ==========================================
// BANCO DE DADOS
// ==========================================

const allAspects = [
    "Uniaxial (+)", "Uniaxial (-)", "Biaxial (+)", "Biaxial (-)",
    "Extinção Reta", "Extinção Inclinada",
    "Sistema Isométrico", "Sistema Tetragonal", "Sistema Hexagonal", 
    "Sistema Trigonal", "Sistema Ortorrômbico", "Sistema Monoclínico", "Sistema Triclínico",
    "Elongação (+)", "Elongação (-)", "Cores Altas", "Cores Baixas",
    "Ângulo 2V Pequeno", "Ângulo 2V Grande", "Incolor", "Geminacão Carlsbad", "Geminacão Albita", "Geminacão Periclinio"
];

const mineralsDatabase = [
    { name: "Sodalita", aspects: ["Incolor", "Extinção Reta", "Sistema Isométrico"] },
    { name: "Nefelina", aspects: ["Incolor", "Uniaxial (-)", "Sistema Hexagonal", "Cores Baixas", "Extinção Reta"] },
    { name: "Sanidina", aspects: ["Incolor", "Biaxial (-)", "Sistema Monoclínico", "Cores Baixas", "Extinção Reta", "Ângulo 2V Grande", "Elongação (-)", "Geminacão Carlsbad"] },
    { name: "Faialita", aspects: ["Incolor", "Biaxial (-)", "Sistema Ortorrômbico", "Cores Altas", "Extinção Reta", "Ângulo 2V Grande", "Elongação (+)"] },
    { name: "Forsterita", aspects: ["Incolor", "Biaxial (+)", "Sistema Ortorrômbico", "Cores Altas", "Extinção Reta", "Ângulo 2V Grande", "Elongação (+)"] },
    { name: "Microclínio", aspects: ["Incolor", "Biaxial (-)", "Sistema Triclínico", "Cores Baixas", "Extinção Inclinada", "Ângulo 2V Grande", "Geminacão Albita", "Geminacão Periclinio"] },
    { name: "Ortoclásio", aspects: ["Incolor", "Biaxial (-)", "Sistema Monoclínico", "Cores Baixas", "Extinção Inclinada", "Ângulo 2V Grande", "Geminacão Carlsbad"] },
    { name: "Albita", aspects: ["Incolor", "Biaxial (+)", "Sistema Triclínico", "Cores Baixas", "Extinção Inclinada", "Ângulo 2V Grande", "Geminacão Albita"] },
    { name: "Anortita", aspects: ["Incolor", "Biaxial (-)", "Sistema Triclínico", "Cores Baixas", "Extinção Inclinada", "Ângulo 2V Grande", "Geminacão Albita", "Geminacão Carlsbad"] },
        { name: "Andaluzita", aspects: ["Incolor a Rosa", "Pleocroísmo Fraco", "Biaxial (-)", "Sistema Ortorrômbico", "Cores Baixas", "Extinção Reta", "Ângulo 2V Grande", "Elongação (-)"] },
    { name: "Cianita", aspects: ["Incolor a Azul", "Biaxial (-)", "Sistema Triclínico", "Cores Baixas", "Extinção Inclinada", "Ângulo 2V Grande", "Elongação (+)"] },
    { name: "Estaurolita", aspects: ["Amarelo", "Pleocroísmo Forte", "Biaxial (+)", "Sistema Monoclínico", "Cores Baixas", "Extinção Reta", "Ângulo 2V Grande", "Elongação (+)"] }
];
];

// ==========================================
// LÓGICA DO JOGO
// ==========================================

let currentMineral = null;
let xp = 0;
let unplayedMinerals = [];
let isRoundActive = true; 

// Elementos do DOM
const uiLayer = document.getElementById("ui-layer");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("start-btn");
const boardEl = document.getElementById("board");
const mineralEl = document.getElementById("target-mineral");
const xpEl = document.getElementById("xp-count");
const confirmBtn = document.getElementById("confirm-btn");

const gearBtn = document.getElementById("gear-btn");
const settingsMenu = document.getElementById("settings-menu");

// Elementos do Modal de Resumo
const summaryOverlay = document.getElementById("summary-overlay");
const summaryMineral = document.getElementById("summary-mineral");
const summaryXpMsg = document.getElementById("summary-xp-msg");
const listCorrect = document.getElementById("list-correct");
const listWrong = document.getElementById("list-wrong");
const listMissed = document.getElementById("list-missed");
const nextRoundBtn = document.getElementById("next-round-btn");

// Event Listeners
startBtn.addEventListener("click", startGame);
confirmBtn.addEventListener("click", evaluateRound);
nextRoundBtn.addEventListener("click", nextRound);

gearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle("hidden");
});
document.addEventListener("click", () => settingsMenu.classList.add("hidden"));
settingsMenu.addEventListener("click", (e) => e.stopPropagation());

function setTheme(themeName) {
    document.body.className = "";
    if (themeName !== 'default') {
        document.body.classList.add(themeName);
    }
}

function startGame() {
    xp = 0;
    updateXP();
    unplayedMinerals = [...mineralsDatabase]; 
    
    overlay.classList.add("hidden");
    uiLayer.classList.remove("hidden");
    
    nextRound();
}

function nextRound() {
    summaryOverlay.classList.add("hidden");
    isRoundActive = true;
    confirmBtn.disabled = false;

    if (unplayedMinerals.length === 0) {
        unplayedMinerals = [...mineralsDatabase]; // Reinicia se acabar os minerais
    }

    const randomIndex = Math.floor(Math.random() * unplayedMinerals.length);
    currentMineral = unplayedMinerals.splice(randomIndex, 1)[0];
    
    mineralEl.textContent = currentMineral.name;
    renderOrganizedBoard();
}

function renderOrganizedBoard() {
    boardEl.innerHTML = "";
    
    const shuffledAspects = [...allAspects].sort(() => Math.random() - 0.5);

    shuffledAspects.forEach((aspect) => {
        const btn = document.createElement("button");
        btn.className = "aspect-btn";
        btn.textContent = aspect;
        
        btn.onclick = () => handleAspectClick(btn);
        boardEl.appendChild(btn);
    });
}

function handleAspectClick(btn) {
    // Só permite selecionar se a rodada ainda estiver ativa (antes de confirmar)
    if (!isRoundActive) return;
    
    // Alterna a seleção (marca/desmarca)
    btn.classList.toggle("selected");
}

function evaluateRound() {
    if (!isRoundActive) return;
    isRoundActive = false;
    confirmBtn.disabled = true;

    // Coleta as respostas do usuário
    const selectedBtns = document.querySelectorAll(".aspect-btn.selected");
    const selectedAspects = Array.from(selectedBtns).map(btn => btn.textContent);
    const correctAspects = currentMineral.aspects;

    // Classifica as respostas
    const hits = selectedAspects.filter(a => correctAspects.includes(a));
    const errors = selectedAspects.filter(a => !correctAspects.includes(a));
    const missed = correctAspects.filter(a => !selectedAspects.includes(a));

    // Calcula Pontuação (10 XP por acerto)
    const earnedXp = hits.length * 10;
    xp += earnedXp;
    updateXP();

    // Feedback visual imediato no painel principal
    document.querySelectorAll(".aspect-btn").forEach(btn => {
        const text = btn.textContent;
        // Tira a classe 'selected' para aplicar o resultado final
        btn.classList.remove("selected"); 

        if (hits.includes(text)) {
            btn.classList.add("correct");
        } else if (errors.includes(text)) {
            btn.classList.add("wrong"); // Fica opaco e vermelho conforme o CSS
        }
    });

    // Preenche e exibe o modal de Resumo após um pequeno delay para ele ver o quadro
    setTimeout(() => {
        showSummary(hits, errors, missed, earnedXp);
    }, 800);
}

function showSummary(hits, errors, missed, earnedXp) {
    summaryMineral.textContent = currentMineral.name;
    
    if (earnedXp > 0) {
        summaryXpMsg.textContent = `+${earnedXp} XP ganhos!`;
        summaryXpMsg.style.color = "var(--success)";
    } else {
        summaryXpMsg.textContent = "Nenhum XP nesta rodada.";
        summaryXpMsg.style.color = "var(--danger)";
    }

    // Preenche as listas HTML
    listCorrect.innerHTML = hits.map(item => `<li>${item}</li>`).join('') || "<li>Nenhum</li>";
    listWrong.innerHTML = errors.map(item => `<li>${item}</li>`).join('') || "<li>Nenhum</li>";
    listMissed.innerHTML = missed.map(item => `<li>${item}</li>`).join('') || "<li>Nenhum</li>";

    summaryOverlay.classList.remove("hidden");
}

function updateXP() {
    xpEl.textContent = `${xp} XP`;
}
