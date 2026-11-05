let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks(taskArray=tasks) {

    let taskList = document.getElementById("taskList");

    taskList.innerHTML = "";
    let counter = document.getElementById("taskCounter");

counter.textContent = "Total Tasks: " + tasks.length;
let completedCounter = document.getElementById("completedCounter");

let pendingCounter = document.getElementById("pendingCounter");

let completedTotal = tasks.filter(function(task) {
    return task.completed === true;
}).length;

let pendingTotal = tasks.filter(function(task) {
    return task.completed === false;
}).length;

completedCounter.textContent = "Completed: " + completedTotal;

pendingCounter.textContent = "Pending: " + pendingTotal;
let completedCount = tasks.filter(function(task) {
    return task.completed;
}).length;

let progress = tasks.length === 0
    ? 0
    : (completedCount / tasks.length) * 100;

document.getElementById("progressBar").style.width = progress + "%";

document.getElementById("progressText").textContent =
    Math.round(progress) + "% Completed";

    taskArray.forEach(function(task, index) {
    let originalIndex = tasks.indexOf(task);
        let li = document.createElement("li");
        li.dataset.taskId = task.id;
        li.draggable=true;
        li.addEventListener("dragstart", function() {
    li.classList.add("dragging");
});

li.addEventListener("dragend", function() {
    li.classList.remove("dragging");
});

        let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.onclick = function() {
        task.completed = !task.completed;
        saveTasks();
        displayTasks();
    };
        let span = document.createElement("span");

        span.textContent = task.text;
        if (task.date && new Date(task.date) < new Date().setHours(0,0,0,0) && !task.completed) {
    span.classList.add("overdue");
}
        let priorityLabel = document.createElement("small");

priorityLabel.textContent = "Priority: " + (task.priority || "Low");

li.appendChild(priorityLabel);
let dateLabel = document.createElement("small");

dateLabel.textContent = task.dueDate
    ? "Due Date: " + task.dueDate
    : "No deadline";

li.appendChild(dateLabel);
let today = new Date().toISOString().split("T")[0];

if (task.completed) {
    dateLabel.classList.add("done");
}
else if (task.dueDate && task.dueDate < today) {
    dateLabel.classList.add("overdue");
}
else if (task.dueDate) {
    dateLabel.classList.add("upcoming");
}
priorityLabel.classList.add(
    task.priority || "Low"
);

        if (task.completed) {
            span.classList.add("completed");
        }
    li.appendChild(checkbox);
    li.appendChild(span);
    taskList.appendChild(li);
        span.onclick = function() {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
        };

        let deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = function() {
            tasks.splice(originalIndex, 1);
            saveTasks();
            displayTasks();
        };
        let editBtn = document.createElement("button");

editBtn.textContent = "Edit";

editBtn.onclick = function() {

    let newTask = prompt("Enter updated task:", task.text);

    if (newTask !== null && newTask.trim() !== "") {

        task.text = newTask.trim();

        saveTasks();
        displayTasks();
    }
};
        li.appendChild(span);
li.appendChild(editBtn);
li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
    let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {

    let searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(function(task) {

        return task.text.toLowerCase().includes(searchText);

    });

    displayTasks(filteredTasks);

});
}
const taskList = document.getElementById("taskList");

taskList.addEventListener("dragover", function(e) {
    e.preventDefault();
});

taskList.addEventListener("drop", function(e) {
    e.preventDefault();
    console.log("Drop event working");

    const draggingTask = document.querySelector(".dragging");
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest("li");
    console.log("Target:", target);
console.log("Dragging:", draggingTask);

    if (!draggingTask || !target || draggingTask === target) {
        return;
    }

    const draggedId = draggingTask.dataset.taskId;
    const targetId = target.dataset.taskId;

    const draggedIndex = tasks.findIndex(t => String(t.id) === draggedId);
    const targetIndex = tasks.findIndex(t => String(t.id) === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [movedTask] = tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, movedTask);

    saveTasks();
    displayTasks();
});

function addTask() {

let input = document.getElementById("taskInput");

let priority = document.getElementById("taskPriority");
let taskDate = document.getElementById("taskDate");

if (input.value.trim() === "") {
    alert("Please enter a task!");
    return;
}

tasks.push({
    id: Date.now(),
    text: input.value,
    completed: false,
    priority: priority.value,
    dueDate: taskDate.value
});

saveTasks();
displayTasks();

input.value = "";
taskDate.value="";
}
function clearTasks() {

    let confirmClear = confirm("Are you sure you want to delete all tasks?");

    if (confirmClear) {

        tasks = [];

        saveTasks();

        displayTasks();

    }
}

// ALL TASKS
let allTasksBtn = document.getElementById("allTasks");

allTasksBtn.onclick = function() {
    displayTasks(tasks);
};


// COMPLETED TASKS
let completedTasksBtn = document.getElementById("completedTasks");

completedTasksBtn.onclick = function() {

    let completed = tasks.filter(function(task) {
        return task.completed === true;
    });

    displayTasks(completed);
};


// PENDING TASKS
let pendingTasksBtn = document.getElementById("pendingTasks");

pendingTasksBtn.onclick = function() {

    let pending = tasks.filter(function(task) {
        return task.completed === false;
    });

    displayTasks(pending);
};
let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {

    let searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(function(task) {
        return task.text.toLowerCase().includes(searchText);
    });

    displayTasks(filteredTasks);

});
let themeToggle = document.getElementById("themeToggle");

themeToggle.onclick = function() {

    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    }

};
let savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";

} else {

    themeToggle.textContent = "🌙 Dark Mode";

}
let sortBtn = document.getElementById("sortPriority");

sortBtn.onclick = function() {

    let priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    tasks.sort(function(a, b) {
        return priorityOrder[a.priority || "Low"] -
               priorityOrder[b.priority || "Low"];
    });

    saveTasks();
    displayTasks();

};
function exportTasks() {

    let csv = "Task,Priority,Due Date,Status\n";

    tasks.forEach(function(task) {
        csv += `${task.text},${task.priority},${task.dueDate},${task.completed ? "Completed" : "Pending"}\n`;
    });
    let blob = new Blob([csv], {
    type: "text/csv"
});

let url = URL.createObjectURL(blob);

let link = document.createElement("a");

link.href = url;
link.download = "My_Tasks.csv";

link.click();

URL.revokeObjectURL(url);

}
function importTasks() {

    let fileInput = document.getElementById("importFile");

    let file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file!");
        return;
    }

    let reader = new FileReader();

    reader.onload = function(event) {
        let csvData = event.target.result;

        let rows = csvData.split("\n");

rows.shift();
rows = rows.filter(function(row) {
    return row.trim() !== "";
});

let importedTasks = rows.map(function(row) {

    let data = row.split(",");

    return {
        text: data[0],
        priority: data[1],
        dueDate: data[2],
        completed: data[3] === "Completed"
    };

});

console.log(importedTasks);
tasks = tasks.concat(importedTasks);

saveTasks();

displayTasks();
 };

    reader.readAsText(file);
}