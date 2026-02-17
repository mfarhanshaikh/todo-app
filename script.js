const taskInput = document.getElementById("input-task");
const taskBtn = document.getElementById("task-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const hideCompletedBtn = document.querySelector(".hide-completed-task");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let editingTaskIndex = null;
let currentFilter = "all";
let isHidden = false;



filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach((b) => {
      b.classList.remove(
        "text-primary",
        "font-semibold",
        "border-b-2",
        "border-primary",
      );
      b.classList.add("text-slate-500");
    });
    e.target.classList.add(
      "text-primary",
      "font-semibold",
      "border-b-2",
      "border-primary",
    );
    e.target.classList.remove("text-slate-500");

    currentFilter = e.target.getAttribute("data-filter");
    renderTasks();
  });
});

taskBtn.addEventListener("click", () => {
  let taskText = taskInput.value.trim();
  if (!taskText) return alert("Please enter a task");

  if (editingTaskIndex !== null) {
    tasks[editingTaskIndex].text = taskText;
    editingTaskIndex = null;
    taskBtn.innerHTML = `<span class="material-icons text-sm">add</span> Add Task`;
    showToast("Task updated successfully!", "info");
  } else {
    tasks.push({
      id: Date.now(),
      text: taskText,
      completed: false,
    });
  }

  saveAndRender();
  taskInput.value = "";
});

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    let matchesFilter = true;
    if (currentFilter === "active") matchesFilter = !task.completed;
    if (currentFilter === "completed") matchesFilter = task.completed;

    if (isHidden && task.completed) {
      return false;
    }

    return matchesFilter;
  });

  filteredTasks.forEach((task) => {
    const actualIndex = tasks.findIndex((t) => t.id === task.id);

    const taskItem = document.createElement("div");
    taskItem.className =
      "task-item transition-all animate-in fade-in duration-300";

    taskItem.innerHTML = `
        <div class="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between mb-3">
          <div class="flex items-center gap-4 flex-grow">
            <label class="relative flex items-center cursor-pointer">
              <input class="task-checkbox h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" 
                     type="checkbox" ${task.completed ? "checked" : ""} />
            </label>
            <span class="task-text text-slate-700 dark:text-slate-200 font-medium ${task.completed ? "line-through opacity-50" : ""}"></span>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="edit-btn p-2 text-slate-400 hover:text-primary rounded-lg transition-colors"><span class="material-icons text-xl">edit_note</span></button>
            <button class="delete-btn p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><span class="material-icons text-xl">delete_outline</span></button>
          </div>
        </div>`;

    taskItem.querySelector(".task-text").textContent = task.text;
    taskList.appendChild(taskItem);

    const deleteBtn = taskItem.querySelector(".delete-btn");
    const editBtn = taskItem.querySelector(".edit-btn");
    const checkbox = taskItem.querySelector(".task-checkbox");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(actualIndex, 1);
      showToast("Task deleted successfully!", "danger");
      saveAndRender();
    });

    editBtn.addEventListener("click", () => {
      editingTaskIndex = actualIndex;
      taskInput.value = tasks[actualIndex].text;
      taskBtn.textContent = "Update";
      taskInput.focus();
    });

    checkbox.addEventListener("change", () => {
      tasks[actualIndex].completed = checkbox.checked;
      if (checkbox.checked) {
        showToast("Task marked as completed! 🎉", "success");
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
  const countSpan = document.querySelector(".tracking-wider");
  if (countSpan) countSpan.textContent = `${remaining} tasks remaining`;
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") taskBtn.click();
});

renderTasks();

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  let typeClass = "toast-success";
  let icon = "check_circle";
  
  if (type === "info") {
      typeClass = "toast-info";
      icon = "edit";
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
  setTimeout(() => { toast.classList.add("show"); }, 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => { toast.remove(); }, 500);
  }, 3000);
}

hideCompletedBtn.addEventListener("click", () => {
  isHidden = !isHidden;

  if (isHidden) {
    hideCompletedBtn.innerHTML = `
      <span class="material-icons text-base">visibility</span>
      Show Completed
    `;
    hideCompletedBtn.classList.add("text-primary"); 
    hideCompletedBtn.classList.remove("text-slate-500");
  } else {
    hideCompletedBtn.innerHTML = `
      <span class="material-icons text-base">visibility_off</span>
      Hide Completed
    `;
    hideCompletedBtn.classList.remove("text-primary");
    hideCompletedBtn.classList.add("text-slate-500");
  }

  renderTasks();
});