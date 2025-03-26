const signupbutton = document.getElementById("signupbtn"); 
const loginbutton = document.getElementById("loginbtn"); 

const userMenu = document.getElementById("userMenu"); 
const userIcon = document.getElementById("userIcon"); 
const taskContainer = document.querySelector(".taskContainer")


const token = localStorage.getItem("jwtToken");

if (token) {
    signupbutton.style.display = "none";
    loginbutton.style.display = "none";
    userMenu.style.display = "block";

    fetchTasks(token);

} else {
    signupbutton.style.display = "block";
    loginbutton.style.display = "block";
    userMenu.style.display = "none";
}


userIcon.onclick = function(){
    localStorage.removeItem("jwtToken");
    signupbutton.style.display = "block";
    loginbutton.style.display = "block";
    userMenu.style.display = "none";

    document.getElementById("taskList").innerHTML = "<p>You have been logged out.</p>";

    setTimeout(() => {
        window.location.href = "entry.html"; 
    }, 1000); 
}


async function fetchTasks(token) {
    await fetch("http://localhost:8080/tasks/user", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(tasks => {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = ""; 

        if (tasks.length === 0) {
            taskList.innerHTML = "<p>No tasks found.</p>";
        } else {
            tasks.forEach(task => {
                const taskElement = document.createElement("div");
                taskElement.classList.add("task-item");
                taskElement.setAttribute("data-status", task.status);
                taskElement.setAttribute("data-priority", task.priority);
                taskElement.setAttribute("data-due", task.dueDate || "");

                let priorityClass = task.priority.toLowerCase();
                let statusClass = task.status.toLowerCase().replace("_", "");

                taskElement.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description || "No description"}</p>
    <span class="task-priority priority-${priorityClass}">${task.priority}</span>
    <span class="task-status status-${statusClass}">${task.status.replace("_", " ")}</span>
    <span class="task-due-date">📅 Due Date: ${task.dueDate ? formatDate(task.dueDate) : "Not set"}</span>

    <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">✏ Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑 Delete</button>
    </div>
`;
                taskList.appendChild(taskElement);
            });
        }
    })
    .catch(error => console.error("Error fetching tasks:", error));
}

function formatDate(dateString) {
    if (!dateString) return "Not set"; 
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options); 
}




document.getElementById("taskForm").onsubmit = async function (e) {
    e.preventDefault();
    
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        alert("You must be logged in to add or edit tasks!");
        return;
    }

    const taskId = document.getElementById("taskId").value.trim();
    const taskData = {
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDesc").value,
        priority: document.getElementById("taskPriority").value,
        status: document.getElementById("taskStatus").value,
        dueDate: document.getElementById("taskDueDate").value
    };

    const url = taskId ? `http://localhost:8080/tasks/${taskId}` : "http://localhost:8080/tasks";
    const method = taskId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            alert(taskId ? "Task updated successfully!" : "Task added successfully!");
            taskFormContainer.style.display = "none"; 
            document.getElementById("taskForm").reset(); 
            document.getElementById("taskId").value = "";
            fetchTasks(token); 
        } else {
            alert("Failed to save task!");
        }
    } catch (error) {
        console.error("Error saving task:", error);
        alert("Something went wrong!");
    }
};





async function editTask(taskId) {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        alert("You must be logged in to edit tasks!");
        return;
    }

    await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(task => {
        document.getElementById("taskId").value = task.id;
        document.getElementById("taskTitle").value = task.title;
        document.getElementById("taskDesc").value = task.description || "";
        document.getElementById("taskPriority").value = task.priority;
        document.getElementById("taskStatus").value = task.status;
        document.getElementById("taskDueDate").value = task.dueDate || "";

            
        taskFormContainer.style.display = "block";
    })
    .catch(error => console.error("Error fetching task:", error));
}


function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const token = localStorage.getItem("jwtToken");

    fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete task");
        }
        alert("Task deleted successfully!");
        fetchTasks(token);
    })
    .catch(error => console.error("Error deleting task:", error));
}


const addTaskBtn = document.getElementById("addTaskBtn");
const taskFormContainer = document.getElementById("taskFormContainer");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");

addTaskBtn.onclick = function () {
    taskFormContainer.style.display = "block";
};

cancelTaskBtn.onclick = function () {
    taskFormContainer.style.display = "none";
};







function applyFilters() {
    const statusFilter = document.getElementById("statusFilter").value;
    const priorityFilter = document.getElementById("priorityFilter").value;
    const deadlineFilter = document.getElementById("deadlineFilter").value;

    const taskCards = document.querySelectorAll(".task-item");

    taskCards.forEach((card) => {
        const taskStatus = card.getAttribute("data-status");
        const taskPriority = card.getAttribute("data-priority");
        const taskDueDate = card.getAttribute("data-due");

        let isVisible = true;

        // Filter by Status
        if (statusFilter && statusFilter !== taskStatus) {
            isVisible = false;
        }

        // Filter by Priority
        if (priorityFilter && priorityFilter !== taskPriority) {
            isVisible = false;
        }

        // Filter by Deadline
        if (deadlineFilter && taskDueDate) {
            const taskDate = new Date(taskDueDate);
            const filterDate = new Date(deadlineFilter);
            if (taskDate > filterDate) {
                isVisible = false;
            }
        }

        card.style.display = isVisible ? "block" : "none";
    });
}





