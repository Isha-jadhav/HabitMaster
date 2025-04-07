let habits = JSON.parse(localStorage.getItem("habits")) || [];

function loadHabits() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = createHabitElement(habit.text, habit.done, index, habit.streak);
    list.appendChild(li);
  });
}

function addHabit() {
  const input = document.getElementById("habitInput");
  const text = input.value.trim();
  if (text === "") return;

  const newHabit = { text: text, done: false, streak: 0 };
  habits.push(newHabit);
  localStorage.setItem("habits", JSON.stringify(habits));
  input.value = "";
  loadHabits();
}

function createHabitElement(text, done, index, streak = 0) {
  const li = document.createElement("li");
  if (done) li.classList.add("done");

  li.innerHTML = `
    <span contenteditable="false">${text}</span>
    <div class="actions">
      <small>🔥 ${streak}</small>
      <button onclick="markDone(${index})">✔</button>
      <button onclick="editHabit(this, ${index})">✏</button>
      <button onclick="deleteHabit(${index})">🗑</button>
    </div>
  `;

  return li;
}

function markDone(index) {
  const today = new Date().toDateString();
  const key = "done_" + today;

  if (!localStorage.getItem(key)) {
    habits.forEach(h => h.done = false); // Reset daily
    localStorage.setItem(key, "true");
  }

  habits[index].done = !habits[index].done;
  habits[index].streak = habits[index].done ? (habits[index].streak + 1) : 0;

  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

function deleteHabit(index) {
  habits.splice(index, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabits();
}

function editHabit(button, index) {
  const span = button.parentElement.parentElement.querySelector("span");

  if (span.isContentEditable) {
    span.contentEditable = "false";
    habits[index].text = span.textContent;
    localStorage.setItem("habits", JSON.stringify(habits));
    button.textContent = "✏";
  } else {
    span.contentEditable = "true";
    span.focus();
    button.textContent = "💾";
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Load data + dark mode on page load
window.onload = () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) document.body.classList.add("dark-mode");

  // Daily reset based on date
  const today = new Date().toDateString();
  const lastChecked = localStorage.getItem("lastCheckedDate");

  if (lastChecked !== today) {
    habits.forEach(h => h.done = false);
    localStorage.setItem("lastCheckedDate", today);
    localStorage.setItem("habits", JSON.stringify(habits));
  }

  loadHabits();
};
