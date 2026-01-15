const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

//  Load tasks on page load
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const li = document.createElement("li");
    li.innerText = task.text;

    if (task.completed) {
      li.classList.add("completed");
    }

    // toggle complete
    li.addEventListener("click", function () {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // delete
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";

    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// 💾 Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ➕ Add task
addBtn.addEventListener("click", function () {
  const taskText = taskInput.value;
  if (taskText === "") return;

  tasks.push({
    text: taskText,
    completed: false,
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
});

// Initial render
renderTasks();
