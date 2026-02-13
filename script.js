const taskInput = document.getElementById("input-task");
const taskBtn = document.getElementById("task-btn");
const taskList = document.getElementById("task-list");

let tasks = [];
let editingTask = null;

taskBtn.addEventListener("click", () => {
   let newTask = taskInput.value.trim();
   if(!newTask) {
    alert("Please enter a task");
    return;
   }

   tasks.push(newTask);
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
              class="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Edit"
            >
              <span class="material-icons text-xl">edit_note</span>
            </button>
            <button
              class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <span class="material-icons text-xl">delete_outline</span>
            </button>
          </div>
        </div>
       `;

       taskList.appendChild(taskItem);
    });
}