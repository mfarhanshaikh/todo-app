const inpTask = document.querySelector('.todo-input');
const btnTask = document.querySelector('.todo-add-button');
const listTask = document.querySelector('.todo-list');

let tasks = [];
let editIndex = null;

function addTask() {

    let task = inpTask.value.trim();
    
    if(!task) {
        alert('Please enter a task');
        return;
    }

    if(tasks.includes(task)) {
        alert('Task already exists');
        return;
    }

    if(editIndex !== null) {
        tasks[editIndex] = task;
        editIndex = null;
        btnTask.textContent = "Add";
    } else {
        tasks.push(task);
    }

    
    inpTask.value = '';
    renderTasks();

}

btnTask.addEventListener('click', addTask);

function renderTasks() {
    listTask.innerHTML = '';
    
    tasks.forEach(( task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('todo-item');
        taskItem.innerHTML = `
            <span class="todo-item-text">${task}</span>
            <button class="todo-item-delete">Delete</button>
            <button class="todo-item-edit">Edit</button>
        `;
        listTask.appendChild(taskItem);

        const deleteButton = taskItem.querySelector('.todo-item-delete');
        deleteButton.addEventListener('click', () => {
          tasks = tasks.filter((_, i) => i !== index);
            renderTasks();
        });


        const editButton = taskItem.querySelector('.todo-item-edit');
        

        editButton.addEventListener('click', () => {
           
            inpTask.value = task;
            editIndex = index;
            btnTask.textContent = "Update";
                

        });
    });
        
}