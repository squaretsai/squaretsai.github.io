let data = []

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json
    render(data)
  })

const list = document.getElementById("list")
const search = document.getElementById("search")

search.addEventListener("input", () => {
  const keyword = search.value
  const filtered = data.filter(m =>
    m["魔物名稱"].includes(keyword)
  )
  render(filtered)
})

function render(arr) {
  list.innerHTML = ""

  arr.forEach(mon => {
    const card = document.createElement("div")
    card.className = "card"

    let html = `
      <div class="title">${mon["魔物名稱"]}</div>
    `

    html += `<div class="section">使用招式</div>`
    mon["使用招式"].forEach(x => {
      html += rowHTML(x)
    })

    html += `<div class="section">對應招式</div>`
    mon["對應招式"].forEach(x => {
      html += rowHTML(x)
    })

    card.innerHTML = html
    list.appendChild(card)
  })
}

function rowHTML(x) {
  let cls = ""
  if (x["猜拳"] === "力量") cls = "power"
  if (x["猜拳"] === "速度") cls = "speed"
  if (x["猜拳"] === "技巧") cls = "tech"

  return `
    <div class="row">
      <div>${x["狀態"]}</div>
      <div class="${cls}">${x["猜拳"]}</div>
    </div>
  `
}
