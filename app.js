let data = [];

const list = document.getElementById("list");
const search = document.getElementById("search");
const clearBtn = document.getElementById("clearBtn");

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    render(data);
  });

search.addEventListener("input", () => {
  const keyword = search.value.trim();
  const filtered = !keyword
    ? data
    : data.filter(m =>
        (m["魔物名稱"] || "").includes(keyword) ||
        (m["種族"] || "").includes(keyword)
      );
  render(filtered);
});

clearBtn.addEventListener("click", () => {
  search.value = "";
  render(data);
  search.focus();
});

function badgeClass(type) {
  if (type === "力量") return "badge power";
  if (type === "速度") return "badge speed";
  if (type === "技巧") return "badge tech";
  return "badge unknown";
}

function normalizeMap(entries) {
  const map = {};
  (entries || []).forEach(item => {
    map[item["狀態"]] = item["猜拳"];
  });
  return map;
}

function buildRows(mon) {
  const usageMap = normalizeMap(mon["使用招式"]);
  const counterMap = normalizeMap(mon["對應招式"]);

  const orderedStates = [];
  (mon["使用招式"] || []).forEach(item => {
    if (!orderedStates.includes(item["狀態"])) orderedStates.push(item["狀態"]);
  });
  (mon["對應招式"] || []).forEach(item => {
    if (!orderedStates.includes(item["狀態"])) orderedStates.push(item["狀態"]);
  });

  return orderedStates.map(state => ({
    state,
    usage: usageMap[state] || "",
    counter: counterMap[state] || ""
  }));
}

function render(arr) {
  list.innerHTML = "";

  if (!arr.length) {
    list.innerHTML = '<div class="empty">找不到符合的魔物，請換個關鍵字。</div>';
    return;
  }

  arr.forEach(mon => {
    const card = document.createElement("section");
    card.className = "card";

    const rows = buildRows(mon);

    card.innerHTML = `
      <div class="card-head">
        <div class="monster-name">${mon["魔物名稱"] || ""}</div>
        <div class="monster-species">${mon["種族"] || ""}</div>
      </div>
      <div class="table-wrap">
        <div class="table-head">
          <div>狀態</div>
          <div>使用招式</div>
          <div>對應招式</div>
        </div>
        ${rows.map(r => `
          <div class="row">
            <div class="state">${r.state}</div>
            <div><span class="${badgeClass(r.usage)}">${r.usage || "-"}</span></div>
            <div><span class="${badgeClass(r.counter)}">${r.counter || "-"}</span></div>
          </div>
        `).join("")}
      </div>
    `;
    list.appendChild(card);
  });
}
