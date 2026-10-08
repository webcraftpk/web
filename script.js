const TARGET = 90000;
const TOTAL_DAYS = 120;
const STORAGE_KEY = "target90k_120days_entries";

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const $ = id => document.getElementById(id);

function money(n) {
  return "Rs " + Math.max(0, Math.round(n)).toLocaleString("en-PK");
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-PK", {
    day:"2-digit", month:"short", year:"numeric"
  });
}
function update() {
  const collected = entries.reduce((sum,e)=>sum + Number(e.amount),0);
  const remaining = Math.max(TARGET-collected,0);
  const daysUsed = entries.length;
  const daysLeft = Math.max(TOTAL_DAYS-daysUsed,0);
  const needed = daysLeft > 0 ? Math.ceil(remaining/daysLeft) : remaining;
  const percent = Math.min((collected/TARGET)*100,100);

  $("collected").textContent = money(collected);
  $("remaining").textContent = money(remaining);
  $("neededPerDay").textContent = money(needed);
  $("daysLeft").textContent = daysLeft;
  $("progressPercent").textContent = Math.round(percent) + "%";
  $("progressBar").style.width = percent + "%";
  $("entryCount").textContent = `${entries.length} ${entries.length===1?"entry":"entries"}`;

  const history = $("history");
  if (!entries.length) {
    history.innerHTML = `<div class="empty">No income added yet.<br><span>Start with today's income.</span></div>`;
    return;
  }
  history.innerHTML = entries.map((e,i)=>`
    <div class="entry">
      <div class="entry-left">
        <div class="entry-day">DAY ${i+1}</div>
        <div class="entry-date">${formatDate(e.date)}</div>
      </div>
      <div>
        <span class="entry-amount">+${money(e.amount)}</span>
        <button class="delete" onclick="removeEntry(${i})" title="Delete">×</button>
      </div>
    </div>
  `).join("");
}

function removeEntry(index) {
  entries.splice(index,1);
  save(); update();
}

$("incomeForm").addEventListener("submit", e=>{
  e.preventDefault();
  const input = $("incomeInput");
  const amount = Number(input.value);
  if (!amount || amount < 0) return;
  entries.push({amount, date:new Date().toISOString().slice(0,10)});
  save(); update();
  input.value = "";
  $("formMsg").textContent = "Income added successfully ✓";
  setTimeout(()=>$("formMsg").textContent="",1800);
});

$("resetBtn").addEventListener("click", ()=>{
  if(confirm("Reset all saved income entries?")) {
    entries=[]; save(); update();
  }
});

$("today").textContent = new Date().toLocaleDateString("en-PK",{day:"2-digit",month:"short",year:"numeric"});
update();

setTimeout(()=> $("splash").classList.add("hide"), 1700);
