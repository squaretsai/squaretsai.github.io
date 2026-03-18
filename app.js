let data = [];

const list = document.getElementById("list");
const search = document.getElementById("search");
const clearBtn = document.getElementById("clearBtn");

fetch("data.json?v=3")
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

  const states = [];
  (mon["使用招式"] || []).forEach(item => {
    if (!states.includes(item["狀態"])) states.push(item["狀態"]);
  });
  (mon["對應招式"] || []).forEach(item => {
    if (!states.includes(item["狀態"])) states.push(item["狀態"]);
  });

  return states.map(state => ({
    state,
    usage: usageMap[state] || "-",
    counter: counterMap[state] || "-"
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
    const rowsHtml = rows.map(r => `
      <tr>
        <td class="state">${r.state}</td>
        <td class="center"><span class="${badgeClass(r.usage)}">${r.usage}</span></td>
        <td class="center"><span class="${badgeClass(r.counter)}">${r.counter}</span></td>
      </tr>
    `).join("");

    card.innerHTML = `
      <div class="card-head">
        <h2 class="monster-name">${mon["魔物名稱"] || ""}</h2>
        <div class="monster-species">${mon["種族"] || ""}</div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 40%;">狀態</th>
              <th style="width: 30%;">使用招式</th>
              <th style="width: 30%;">對應招式</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;
    list.appendChild(card);
  });
}
