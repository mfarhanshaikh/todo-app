const taskInput = document.getElementById("input-task");
const taskBtn = document.getElementById("task-btn");
const taskList = document.getElementById("task-list");

let tasks = [];
let editingTask = null;

taskBtn.addEventListener("click", () => {
  let newTask = taskInput.value.trim();
  if (!newTask) {
    alert("Please enter a task");
    return;
  }

  if (editingTask !== null) {
    tasks[editingTask] = newTask;
    editingTask = null;
    taskBtn.textContent = "Add Task";
  } else {
    tasks.push(newTask);
  }

  renderTasks();
  taskInput.value = "";
});

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.innerHTML = `
        <div
          class="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-center justify-between"
        >
          <div class="flex items-center gap-4 flex-grow">
            <label class="relative flex items-center cursor-pointer">
              <input
                class="task-checkbox h-5 w-5 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary transition-all"
                type="checkbox"
              />
            </label>
            <span class="text-slate-700 dark:text-slate-200 font-medium"
              >${task}</span
            >
          </div>
          <div
            class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              class="edit-btn p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Edit"
            >
              <span class="material-icons text-xl">edit_note</span>
            </button>
            <button
              class="delete-btn p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
              
            >
              <span class="material-icons text-xl">delete_outline</span>
            </button>
          </div>
        </div>
       `;

    taskList.appendChild(taskItem);

    const deleteBtn = taskItem.querySelector(".delete-btn");
    const editBtn = taskItem.querySelector(".edit-btn");
    const checkbox = taskItem.querySelector(".task-checkbox");
    const taskText = taskItem.querySelector("span");

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((task, i) => i !== index);
      renderTasks();
    });

    editBtn.addEventListener("click", () => {
      editingTask = index;
      taskInput.value = tasks[index];
      taskBtn.textContent = "Update";
    });

    checkbox.addEventListener("change", () => {
      
      if (checkbox.checked) {
        taskText.style.textDecoration = "line-through";
        taskText.style.opacity = "0.5";
        editBtn.disabled = true;
        deleteBtn.disabled = true;
      } else {
        taskText.style.textDecoration = "none";
        taskText.style.opacity = "1";
        editBtn.disabled = false;
        deleteBtn.disabled = false;
      }
    });
  });
}

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    taskBtn.click();
  }
});