const state = {
  monsters: [],
  filtered: [],
  selectedName: "",
  deferredPrompt: null
};

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const resultsEl = document.getElementById("results");
const resultMeta = document.getElementById("resultMeta");
const emptyState = document.getElementById("emptyState");
const detailCard = document.getElementById("detailCard");
const detailSpecies = document.getElementById("detailSpecies");
const detailName = document.getElementById("detailName");
const usageList = document.getElementById("usageList");
const counterList = document.getElementById("counterList");
const recentChips = document.getElementById("recentChips");
const speciesChips = document.getElementById("speciesChips");
const installBtn = document.getElementById("installBtn");

const RECENT_KEY = "mhs3_recent_searches";
const MAX_RECENT = 8;

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(text) {
  const value = text.trim();
  if (!value) return;
  const current = getRecentSearches().filter(item => item !== value);
  current.unshift(value);
  localStorage.setItem(RECENT_KEY, JSON.stringify(current.slice(0, MAX_RECENT)));
  renderRecentChips();
}

function renderRecentChips() {
  const items = getRecentSearches();
  recentChips.innerHTML = "";
  if (!items.length) {
    recentChips.innerHTML = '<span class="chips-title">尚無紀錄</span>';
    return;
  }
  items.forEach(text => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      searchInput.value = text;
      runSearch();
    });
    recentChips.appendChild(btn);
  });
}

function renderSpeciesChips() {
  const speciesSet = [...new Set(state.monsters.map(item => item["種族"]))];
  speciesChips.innerHTML = "";
  speciesSet.forEach(species => {
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

function badgeClass(type) {
  return `badge badge-${type}`;
}

function renderEntryList(target, entries) {
  target.innerHTML = "";
  if (!entries.length) {
    target.innerHTML = '<div class="entry-item"><span class="entry-state">無資料</span></div>';
    return;
  }

  entries.forEach(entry => {
    const wrap = document.createElement("div");
    wrap.className = "entry-item";
    wrap.innerHTML = `
      <span class="entry-state">${entry["狀態"]}</span>
      <span class="${badgeClass(entry["猜拳"])}">${entry["猜拳"]}</span>
    `;
    target.appendChild(wrap);
  });
}

function renderDetail(monster) {
  if (!monster) {
    detailCard.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  detailCard.classList.remove("hidden");
  detailSpecies.textContent = monster["種族"];
  detailName.textContent = monster["魔物名稱"];
  renderEntryList(usageList, monster["使用招式"]);
  renderEntryList(counterList, monster["對應招式"]);
}

function renderResults() {
  resultsEl.innerHTML = "";

  if (!state.filtered.length) {
    resultMeta.textContent = "找不到符合的魔物。";
    renderDetail(null);
    return;
  }

  resultMeta.textContent = `找到 ${state.filtered.length} 筆魔物資料`;
  state.filtered.forEach(monster => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "result-item" + (monster["魔物名稱"] === state.selectedName ? " active" : "");
    btn.innerHTML = `
      <span class="result-name">${monster["魔物名稱"]}</span>
      <span class="result-species">${monster["種族"]}</span>
    `;
    btn.addEventListener("click", () => {
      state.selectedName = monster["魔物名稱"];
      renderResults();
      renderDetail(monster);
      saveRecentSearch(monster["魔物名稱"]);
    });
    resultsEl.appendChild(btn);
  });

  const selected = state.filtered.find(item => item["魔物名稱"] === state.selectedName) || state.filtered[0];
  state.selectedName = selected["魔物名稱"];
  renderDetail(selected);

  [...resultsEl.children].forEach(btn => {
    if (btn.querySelector(".result-name")?.textContent === selected["魔物名稱"]) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function runSearch() {
  const keyword = searchInput.value.trim();
  if (!keyword) {
    state.filtered = state.monsters;
  } else {
    const lower = keyword.toLowerCase();
    state.filtered = state.monsters.filter(item =>
      item["魔物名稱"].toLowerCase().includes(lower) ||
      item["種族"].toLowerCase().includes(lower)
    );
  }
  renderResults();
}

async function init() {
  const res = await fetch("./data.json");
  state.monsters = await res.json();
  state.filtered = state.monsters;
  renderSpeciesChips();
  renderRecentChips();
  renderResults();
}

searchInput.addEventListener("input", runSearch);
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  runSearch();
  searchInput.focus();
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
