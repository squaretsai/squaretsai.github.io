const state = {
  monsters: [],
  filtered: [],
  mode: "all",
  deferredPrompt: null
};

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const resultsEl = document.getElementById("results");
const resultMeta = document.getElementById("resultMeta");
const speciesChips = document.getElementById("speciesChips");
const installBtn = document.getElementById("installBtn");
const template = document.getElementById("monsterTemplate");

function badgeClass(type){
  if (type === "力量") return "badge power";
  if (type === "速度") return "badge speed";
  if (type === "技巧") return "badge tech";
  if (type === "特殊") return "badge special";
  return "badge unknown";
}

function renderSpeciesChips(){
  const list = [...new Set(state.monsters.map(item => item["種族"]))];
  speciesChips.innerHTML = "";
  list.forEach(species => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.textContent = species;
    btn.addEventListener("click", () => {
      searchInput.value = species;
      runSearch();
    });
    speciesChips.appendChild(btn);
  });
}

function createEntry(item){
  const row = document.createElement("div");
  row.className = "entry-item";
  row.innerHTML = `
    <div class="entry-state">${item["狀態"]}</div>
    <span class="${badgeClass(item["猜拳"])}">${item["猜拳"]}</span>
  `;
  return row;
}

function renderMonsterCard(monster){
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector(".monster-species").textContent = monster["種族"];
  node.querySelector(".monster-name").textContent = monster["魔物名稱"];

  const usageSection = node.querySelector(".usage-section");
  const counterSection = node.querySelector(".counter-section");
  const usageList = node.querySelector(".usage-list");
  const counterList = node.querySelector(".counter-list");

  monster["使用招式"].forEach(item => usageList.appendChild(createEntry(item)));
  monster["對應招式"].forEach(item => counterList.appendChild(createEntry(item)));

  if (state.mode === "usage") counterSection.style.display = "none";
  if (state.mode === "counter") usageSection.style.display = "none";

  const head = node.querySelector(".monster-head");
  head.addEventListener("click", () => {
    node.classList.toggle("open");
  });

  // Auto-open when filtered to few results
  if (state.filtered.length <= 8) {
    node.classList.add("open");
  }

  return node;
}

function renderResults(){
  resultsEl.innerHTML = "";
  resultMeta.textContent = `共 ${state.filtered.length} 筆魔物`;

  if (!state.filtered.length) {
    const empty = document.createElement("div");
    empty.className = "monster-card open";
    empty.innerHTML = `
      <div class="monster-head">
        <div>
          <div class="monster-species">沒有結果</div>
          <h2 class="monster-name">找不到符合的魔物</h2>
        </div>
      </div>
      <div class="monster-body" style="display:block;padding:0 16px 16px;">
        <div class="mode-section">
          請換別的關鍵字，例如：火龍、雷狼、古龍種。
        </div>
      </div>
    `;
    resultsEl.appendChild(empty);
    return;
  }

  state.filtered.forEach(monster => {
    resultsEl.appendChild(renderMonsterCard(monster));
  });
}

function scoreMatch(item, keyword){
  const name = item["魔物名稱"];
  const species = item["種族"];
  if (name === keyword) return 100;
  if (name.startsWith(keyword)) return 80;
  if (name.includes(keyword)) return 60;
  if (species === keyword) return 50;
  if (species.includes(keyword)) return 30;
  return 0;
}

function runSearch(){
  const keyword = searchInput.value.trim();
  if (!keyword) {
    state.filtered = state.monsters;
  } else {
    state.filtered = state.monsters
      .filter(item => item["魔物名稱"].includes(keyword) || item["種族"].includes(keyword))
      .sort((a, b) => scoreMatch(b, keyword) - scoreMatch(a, keyword) || a["魔物名稱"].localeCompare(b["魔物名稱"], "zh-Hant"));
  }
  renderResults();
}

async function init(){
  const res = await fetch("./data.json");
  state.monsters = await res.json();
  state.filtered = state.monsters;
  renderSpeciesChips();
  renderResults();
}

searchInput.addEventListener("input", runSearch);
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  runSearch();
  searchInput.focus();
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    state.mode = btn.dataset.mode;
    renderResults();
  });
});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  state.deferredPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!state.deferredPrompt) return;
  state.deferredPrompt.prompt();
  await state.deferredPrompt.userChoice;
  state.deferredPrompt = null;
  installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

init();
