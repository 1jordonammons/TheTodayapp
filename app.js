const KEY = "today_app_mvp_v1";

const state = JSON.parse(localStorage.getItem(KEY) || "null") || {
  ritualTime: "08:00",
  tasks: [],
  archive: [],
  streak: 0,
};

const dateKey = new Date().toISOString().slice(0, 10);

const els = {
  dateLabel: document.getElementById("dateLabel"),
  ritualTime: document.getElementById("ritualTime"),
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  expressTaskInput: document.getElementById("expressTaskInput"),
  expressBtn: document.getElementById("expressBtn"),
  taskList: document.getElementById("taskList"),
  prioritizeBtn: document.getElementById("prioritizeBtn"),
  finishDayBtn: document.getElementById("finishDayBtn"),
  dailyWin: document.getElementById("dailyWin"),
  searchInput: document.getElementById("searchInput"),
  archiveList: document.getElementById("archiveList"),
  template: document.getElementById("taskTemplate"),
};

function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

function nowTheme() {
  const h = new Date().getHours();
  document.body.classList.remove("morning", "daylight", "night");
  if (h < 11) document.body.classList.add("morning");
  else if (h < 18) document.body.classList.add("daylight");
  else document.body.classList.add("night");
}

function addTask(title, viaExpress = false) {
  if (!title.trim()) return;
  state.tasks.push({ id: crypto.randomUUID(), title: title.trim(), completed: false, category: "general", rolloverDates: [], viaExpress });
  save();
  renderTasks();
}

function renderTasks() {
  els.taskList.innerHTML = "";
  state.tasks.forEach(task => {
    const node = els.template.content.firstElementChild.cloneNode(true);
    node.querySelector(".title").textContent = task.title;
    node.querySelector(".complete").checked = task.completed;
    node.querySelector(".meta").textContent = `Rollovers this week: ${countRolloverWeek(task)}`;

    node.querySelector(".complete").onchange = (e) => {
      task.completed = e.target.checked;
      save();
      renderTasks();
      maybeDailyWin();
    };
    node.querySelector(".del").onclick = () => {
      state.tasks = state.tasks.filter(t => t.id !== task.id);
      save(); renderTasks();
    };
    node.querySelector(".split").onclick = () => {
      const subtasks = prompt("Split into subtasks (comma separated):");
      if (!subtasks) return;
      subtasks.split(",").map(s => s.trim()).filter(Boolean).forEach(s => addTask(`${task.title}: ${s}`));
      state.tasks = state.tasks.filter(t => t.id !== task.id);
      save(); renderTasks();
    };
    node.querySelector(".roll").onclick = () => rolloverTask(task);

    els.taskList.appendChild(node);
  });
}

function countRolloverWeek(task) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return task.rolloverDates.filter(d => new Date(d).getTime() >= weekAgo).length;
}

function rolloverTask(task) {
  const strikes = countRolloverWeek(task);
  if (strikes >= 3) {
    alert("Review Gate: split, delete, or schedule for future date.");
    return;
  }
  task.rolloverDates.push(new Date().toISOString());
  task.completed = false;
  save();
  renderTasks();
}

function maybeDailyWin() {
  if (state.tasks.length > 0 && state.tasks.every(t => t.completed)) {
    els.dailyWin.classList.remove("hidden");
  } else {
    els.dailyWin.classList.add("hidden");
  }
}

function aiPrioritize() {
  state.tasks.sort((a,b) => {
    const aScore = countRolloverWeek(a) * 2 + (a.viaExpress ? 2 : 0);
    const bScore = countRolloverWeek(b) * 2 + (b.viaExpress ? 2 : 0);
    return bScore - aScore;
  });
  save(); renderTasks();
}

function finishDay() {
  const reflection = prompt("One-word reflection:");
  if (!reflection || reflection.trim().split(/\s+/).length !== 1) {
    alert("Please enter exactly one word.");
    return;
  }

  const completed = state.tasks.filter(t => t.completed).length;
  const entry = {
    date: dateKey,
    tasks: state.tasks,
    completionRate: state.tasks.length ? Math.round((completed / state.tasks.length) * 100) : 0,
    reflection: reflection.trim(),
  };

  state.archive.unshift(entry);
  if (entry.completionRate === 100 && state.tasks.length) state.streak += 1;
  else state.streak = 0;

  if (state.streak === 7) alert("✨ Aurora Unlock: Consistency is what turns intention into identity.");

  state.tasks = [];
  save();
  renderTasks();
  renderArchive();
  maybeDailyWin();
}

function renderArchive() {
  const q = els.searchInput.value?.toLowerCase() || "";
  const rows = state.archive.filter(e => `${e.date} ${e.reflection}`.toLowerCase().includes(q));
  els.archiveList.innerHTML = rows.map(e => `<article class="task-item"><strong>${e.date}</strong> · ${e.completionRate}% · <em>${e.reflection}</em></article>`).join("");
}

els.dateLabel.textContent = new Date().toDateString();
els.ritualTime.value = state.ritualTime;
els.ritualTime.onchange = (e) => { state.ritualTime = e.target.value; save(); };
els.addTaskBtn.onclick = () => { addTask(els.taskInput.value); els.taskInput.value = ""; };
els.expressBtn.onclick = () => { addTask(els.expressTaskInput.value, true); els.expressTaskInput.value = ""; };
els.prioritizeBtn.onclick = aiPrioritize;
els.finishDayBtn.onclick = finishDay;
els.searchInput.oninput = renderArchive;

nowTheme();
renderTasks();
renderArchive();
maybeDailyWin();
setInterval(nowTheme, 60_000);
