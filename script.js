const taskInput = document.getElementById("input-task");
const taskBtn = document.getElementById("task-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const hideCompletedBtn = document.querySelector(".hide-completed-task");
const themeToggle = document.getElementById("theme-toggle");
const clearCompletedBtn = document.getElementById("clear-completed");
const cancelEditBtn = document.getElementById("cancel-edit");

// Custom Priority Selector Elements
const priorityDropdownBtn = document.getElementById("priority-dropdown-btn");
const priorityOptions = document.getElementById("priority-options");
const priorityOpts = document.querySelectorAll(".priority-opt");
const currentPriorityText = document.getElementById("current-priority-text");
const dropdownArrow = priorityDropdownBtn.querySelector(".dropdown-arrow");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let editingTaskIndex = null;
let currentFilter = localStorage.getItem("currentFilter") || "all";
let isHidden = JSON.parse(localStorage.getItem("isHidden")) || false;
let selectedPriority = "medium";

// Initialize Theme
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Initialize UI
updateFilterButtons();
updateHideBtnUI();
renderTasks();

// Priority Dropdown Logic
priorityDropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  priorityOptions.classList.toggle("hidden");
  priorityOptions.classList.toggle("show");
  dropdownArrow.classList.toggle("open");
});

priorityOpts.forEach(opt => {
  opt.addEventListener("click", (e) => {
    selectedPriority = opt.getAttribute("data-value");
    currentPriorityText.textContent = opt.textContent.trim();
    priorityOptions.classList.add("hidden");
    priorityOptions.classList.remove("show");
    dropdownArrow.classList.remove("open");
  });
});

document.addEventListener("click", () => {
  priorityOptions.classList.add("hidden");
  priorityOptions.classList.remove("show");
  dropdownArrow.classList.remove("open");
});

themeToggle.addEventListener("click", () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  } else {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    currentFilter = e.target.getAttribute("data-filter");
    localStorage.setItem("currentFilter", currentFilter);
    updateFilterButtons();
    renderTasks();
  });
});

function updateFilterButtons() {
  filterBtns.forEach((b) => {
    if (b.getAttribute("data-filter") === currentFilter) {
      b.classList.add("text-primary", "font-semibold", "border-b-2", "border-primary");
      b.classList.remove("text-slate-500");
    } else {
      b.classList.remove("text-primary", "font-semibold", "border-b-2", "border-primary");
      b.classList.add("text-slate-500");
    }
  });
}

taskBtn.addEventListener("click", () => {
  let taskText = taskInput.value.trim();
  let priority = selectedPriority;
  if (!taskText) return showToast("Please enter a task", "info");

  if (editingTaskIndex !== null) {
    tasks[editingTaskIndex].text = taskText;
    tasks[editingTaskIndex].priority = priority;
    editingTaskIndex = null;
    resetInputUI();
    showToast("Task updated successfully!", "info");
  } else {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      priority: priority,
      isNew: true // Flag for animation
    };
    tasks.push(newTask);
    showToast("Task added successfully!", "success");
  }

  saveAndRender();
  taskInput.value = "";
  setPriorityDisplay("medium");
});

cancelEditBtn.addEventListener("click", () => {
  editingTaskIndex = null;
  resetInputUI();
  taskInput.value = "";
  setPriorityDisplay("medium");
});

function setPriorityDisplay(value) {
  selectedPriority = value;
  const opt = Array.from(priorityOpts).find(o => o.getAttribute("data-value") === value);
  if (opt) currentPriorityText.textContent = opt.textContent.trim();
}

function resetInputUI() {
  taskBtn.innerHTML = `<span class="material-icons text-sm">add</span> <span class="btn-text">Add</span>`;
  cancelEditBtn.classList.add("hidden");
  taskBtn.classList.remove("bg-yellow-500", "hover:bg-yellow-600");
  taskBtn.classList.add("bg-primary", "hover:bg-primary/90");
}

function renderTasks() {
  const filteredTasks = tasks.filter((task) => {
    let matchesFilter = true;
    if (currentFilter === "active") matchesFilter = !task.completed;
    if (currentFilter === "completed") matchesFilter = task.completed;
    if (isHidden && task.completed) return false;
    return matchesFilter;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <span class="material-icons text-6xl mb-4 text-slate-200 dark:text-slate-800">task_alt</span>
        <p class="text-lg font-medium">No tasks found</p>
        <p class="text-sm">Enjoy your day or add a new task!</p>
      </div>
    `;
    updateCount();
    return;
  }

  // Clear list for simple re-render but manage animation flag
  taskList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const actualIndex = tasks.findIndex((t) => t.id === task.id);
    const taskItem = document.createElement("div");

    // Only animate if it's new
    taskItem.className = `task-item group ${task.isNew ? 'new-task' : ''}`;
    if (task.isNew) {
      // Remove flag after first render
      setTimeout(() => { task.isNew = false; }, 300);
    }

    const priorityClass = `priority-${task.priority}`;

    taskItem.innerHTML = `
        <div class="glass p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between mb-3 gap-3">
          <div class="flex items-center gap-3 flex-grow min-w-0">
            <label class="relative flex items-center cursor-pointer shrink-0">
              <input class="task-checkbox h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-colors" 
                     type="checkbox" ${task.completed ? "checked" : ""} />
            </label>
            <div class="flex flex-col min-w-0">
              <span class="task-text text-slate-700 dark:text-slate-200 font-medium ${task.completed ? "line-through opacity-50" : ""}"></span>
              <span class="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full w-fit mt-1 ${priorityClass}">
                ${task.priority}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button class="edit-btn p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><span class="material-icons text-lg">edit_note</span></button>
            <button class="delete-btn p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><span class="material-icons text-lg">delete_outline</span></button>
          </div>
        </div>`;

    taskItem.querySelector(".task-text").textContent = task.text;
    taskList.appendChild(taskItem);

    const deleteBtn = taskItem.querySelector(".delete-btn");
    const editBtn = taskItem.querySelector(".edit-btn");
    const checkbox = taskItem.querySelector(".task-checkbox");

    deleteBtn.addEventListener("click", () => {
      taskItem.classList.add("scale-95", "opacity-0");
      setTimeout(() => {
        tasks.splice(actualIndex, 1);
        showToast("Task deleted", "danger");
        saveAndRender();
      }, 200);
    });

    editBtn.addEventListener("click", () => {
      editingTaskIndex = actualIndex;
      taskInput.value = tasks[actualIndex].text;
      setPriorityDisplay(tasks[actualIndex].priority || "medium");
      taskBtn.innerHTML = `<span class="material-icons text-sm">edit</span> <span class="btn-text">Update</span>`;
      taskBtn.classList.remove("bg-primary", "hover:bg-primary/90");
      taskBtn.classList.add("bg-yellow-500", "hover:bg-yellow-600");
      cancelEditBtn.classList.remove("hidden");
      cancelEditBtn.classList.add("flex");
      taskInput.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    checkbox.addEventListener("change", () => {
      tasks[actualIndex].completed = checkbox.checked;
      if (checkbox.checked) {
        showToast("To-Do! Task completed 🎉", "success");
      }
      saveAndRender();
    });
  });

  updateCount();
}

function saveAndRender() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
  renderTasks();
}

function updateCount() {
  const remaining = tasks.filter((t) => !t.completed).length;
  const countSpan = document.getElementById("task-count");
  if (countSpan) countSpan.textContent = `${remaining} tasks remaining`;
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") taskBtn.click();
  if (e.key === "Escape" && editingTaskIndex !== null) cancelEditBtn.click();
});

function showToast(message, type = "success") {
  const existingToasts = document.querySelectorAll(".toast");
  existingToasts.forEach(t => t.remove());

  const toast = document.createElement("div");
  let typeClass = "toast-success";
  let icon = "check_circle";

  if (type === "info") {
    typeClass = "toast-info";
    icon = "info";
  } else if (type === "danger") {
    typeClass = "toast-danger";
    icon = "delete";
  }

  toast.className = `toast ${typeClass}`;
  toast.innerHTML = `
        <span class="material-icons text-sm">${icon}</span>
        <span>${message}</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.add("show"); }, 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => { toast.remove(); }, 500);
  }, 2500);
}

hideCompletedBtn.addEventListener("click", () => {
  isHidden = !isHidden;
  localStorage.setItem("isHidden", isHidden);
  updateHideBtnUI();
  renderTasks();
});

function updateHideBtnUI() {
  const hideText = hideCompletedBtn.querySelector(".hide-text");
  const hideIcon = hideCompletedBtn.querySelector(".material-icons");

  if (isHidden) {
    if (hideText) hideText.textContent = "Show Completed";
    if (hideIcon) hideIcon.textContent = "visibility";
    hideCompletedBtn.classList.add("text-primary");
    hideCompletedBtn.classList.remove("text-slate-500");
  } else {
    if (hideText) hideText.textContent = "Hide Completed";
    if (hideIcon) hideIcon.textContent = "visibility_off";
    hideCompletedBtn.classList.remove("text-primary");
    hideCompletedBtn.classList.add("text-slate-500");
  }
}

clearCompletedBtn.addEventListener("click", () => {
  const completedCount = tasks.filter(t => t.completed).length;
  if (completedCount === 0) return showToast("No completed tasks", "info");

  if (confirm(`Clear all ${completedCount} completed tasks?`)) {
    tasks = tasks.filter(t => !t.completed);
    showToast("Cleared completed tasks", "danger");
    saveAndRender();
  }
});
