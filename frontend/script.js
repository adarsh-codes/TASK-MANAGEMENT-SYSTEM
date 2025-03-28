const signupbutton = document.getElementById("signupbtn");
const loginbutton = document.getElementById("loginbtn");

const userMenu = document.getElementById("userMenu");
const userIcon = document.getElementById("userIcon");
const taskContainer = document.querySelector(".taskContainer");

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

document.getElementById('uu').onclick = function(){
  if (!confirm("Are you sure you want to log out?")) return;

  localStorage.removeItem("jwtToken");
  signupbutton.style.display = "block";
  loginbutton.style.display = "block";
  userMenu.style.display = "none";

  document.getElementById("taskList").innerHTML =
    "<p>You have been logged out.</p>";

  setTimeout(() => {
    window.location.href = "entry.html";
  }, 1000);

}
userIcon.onclick = function () {
  if (!confirm("Are you sure you want to log out?")) return;

  localStorage.removeItem("jwtToken");
  signupbutton.style.display = "block";
  loginbutton.style.display = "block";
  userMenu.style.display = "none";

  document.getElementById("taskList").innerHTML =
    "<p>You have been logged out.</p>";

  setTimeout(() => {
    window.location.href = "entry.html";
  }, 1000);

};

async function fetchTasks(token) {
  await fetch("http://localhost:8080/tasks/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((tasks) => {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";

      if (tasks.length === 0) {
        taskList.innerHTML = "<p>No tasks found.</p>";
      } else {
        tasks.sort((a, b) => a.id - b.id);

        tasks.forEach((task) => {
          const taskElement = document.createElement("div");
          taskElement.classList.add("task-item");
          taskElement.setAttribute("data-status", task.status);
          taskElement.setAttribute("data-priority", task.priority);
          taskElement.setAttribute("data-due", task.dueDate || "");

          taskElement.setAttribute("data-task-id", task.id);

          let priorityClass = task.priority.toLowerCase();
          let statusClass = task.status.toLowerCase().replace("_", "");

          let isOverdue = false;
          if (task.dueDate && new Date(task.dueDate) < new Date()) {
            isOverdue = true;
            taskElement.classList.add("overdue");
          } else {
            taskElement.classList.remove("overdue");
          }

          taskElement.innerHTML = `
    <div class="task-title"><h3>${task.title}</h3></div>
    <hr size="5">
    <p>${task.description || "No description"}</p>
    <hr size="2">
    <span class="task-priority priority-${priorityClass}">${
            task.priority
          }</span>
    <span class="task-status status-${statusClass}">${task.status.replace(
            "_",
            " "
          )}</span>
    <br>
   
    <span class="task-due-date">📅 Due Date: ${
      task.dueDate ? formatDate(task.dueDate) : "Not set"
    }</span>

    <div class="task-actions">
        <button class="com-btn" onclick="doneTask(${task.id})">Done ✅</button>
        <button class="edit-btn" onclick="editTask(${task.id})">✏ Edit</button>
        <button class="delete-btn" onclick="deleteTask(${
          task.id
        })">🗑 Delete</button>
    </div>
`;
          taskList.appendChild(taskElement);
        });
      }
    })
    .catch((error) => console.error("Error fetching tasks:", error));
}

function formatDate(dateString) {
  if (!dateString) return "Not set";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
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
    dueDate: document.getElementById("taskDueDate").value,
  };

  const url = taskId
    ? `http://localhost:8080/tasks/${taskId}`
    : "http://localhost:8080/tasks";
  const method = taskId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
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

  alert("Scroll up to edit the task!");
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("You must be logged in to edit tasks!");
    return;
  }

  await fetch(`http://localhost:8080/tasks/${taskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((task) => {
      document.getElementById("taskId").value = task.id;
      document.getElementById("taskTitle").value = task.title;
      document.getElementById("taskDesc").value = task.description || "";
      document.getElementById("taskPriority").value = task.priority;
      document.getElementById("taskStatus").value = task.status;
      document.getElementById("taskDueDate").value = task.dueDate || "";

      document.querySelector(".createoredit").innerHTML = "Edit Task";
      taskFormContainer.style.display = "block";
    })
    .catch((error) => console.error("Error fetching task:", error));
}

function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  const token = localStorage.getItem("jwtToken");

  fetch(`http://localhost:8080/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      alert("Task deleted successfully!");
      fetchTasks(token);
    })
    .catch((error) => console.error("Error deleting task:", error));
}

const addTaskBtn = document.getElementById("addTaskBtn");
const taskFormContainer = document.getElementById("taskFormContainer");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");

addTaskBtn.onclick = function () {
  document.querySelector(".createoredit").innerHTML = "Create A Task";

  taskFormContainer.style.display = "block";
};

cancelTaskBtn.onclick = function () {
  taskFormContainer.style.display = "none";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";
  document.getElementById("taskPriority").value = "";
  document.getElementById("taskStatus").value = "";
  document.getElementById("taskDueDate").value = "";
};

function applyFilters() {
  const deadlineFilter = document.getElementById("deadlineFilter").value;

  const taskCards = document.querySelectorAll(".task-item");

  taskCards.forEach((card) => {
    const taskDueDate = card.getAttribute("data-due");

    let isVisible = true;

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

async function doneTask(taskId) {
  if (!confirm("Are you sure you have completed this task?")) return;

  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("You must be logged in to edit tasks!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch task details.");
    }

    let task = await response.json();

    task.status = "DONE";

    const updateResponse = await fetch(
      `http://localhost:8080/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Failed to update task status.");
    }

    alert("Task marked as DONE!");
    location.reload();
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  }
}

function showpending() {
    const pendbtn = document.getElementById("pend");
    const taskcard = document.querySelectorAll(".task-item");

    let isFiltered = pendbtn.getAttribute("data-filtered") === "true";

    if (isFiltered) {
        taskcard.forEach((task) => {
            task.style.display = "block";
        });

        pendbtn.style.background = ""; 
        pendbtn.setAttribute("data-filtered", "false");
    } else {
        taskcard.forEach((task) => {
            const st = task.getAttribute("data-status");
            if (st === "DONE") {
                task.style.display = "none";
            }
        });

        pendbtn.style.background = "rgba(33, 36, 5, 0.1)"; 
        pendbtn.setAttribute("data-filtered", "true");
    }
}


function showcomplete() {
    const compbtn = document.getElementById("comp");
    const taskcard = document.querySelectorAll(".task-item");

    let isFiltered = compbtn.getAttribute("data-filtered") === "true";

    if (isFiltered) {
        taskcard.forEach((task) => {
            task.style.display = "block";
        });

        compbtn.style.background = ""; 
        compbtn.setAttribute("data-filtered", "false");
    } else {
        taskcard.forEach((task) => {
            const st = task.getAttribute("data-status");
            if (st === "DONE") {
                task.style.display = "block";
            }
            else{
                task.style.display = "none";
            }
        });

        compbtn.style.background = "rgba(33, 36, 5, 0.1)"; 
        compbtn.setAttribute("data-filtered", "true");
    }
}


function showoverdue() {
    const overbtn = document.getElementById("overdue");
    const taskcard = document.querySelectorAll(".task-item");

    let isFiltered = overbtn.getAttribute("data-filtered") === "true";

    if (isFiltered) {
        taskcard.forEach((task) => {
            task.style.display = "block";
        });

        overbtn.style.background = "";
        overbtn.setAttribute("data-filtered", "false");
    } else {
        const today = new Date().toISOString().split("T")[0];

        taskcard.forEach((task) => {
            const dueDate = task.getAttribute("data-due");
            if (dueDate && dueDate < today) {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        });

        overbtn.style.background = "rgba(33, 36, 5, 0.1)";
        overbtn.setAttribute("data-filtered", "true");
    }
}




function showhigh() {
    const hbtn = document.getElementById("h");
    const taskcard = document.querySelectorAll(".task-item");

    let isFiltered = hbtn.getAttribute("data-filtered") === "true";

    if (isFiltered) {
        taskcard.forEach((task) => {
            task.style.display = "block";
        });

        hbtn.style.background = ""; 
        hbtn.setAttribute("data-filtered", "false");
    } else {
        taskcard.forEach((task) => {
            const st = task.getAttribute("data-priority");
            if (st === "HIGH") {
                task.style.display = "block";
            }
            else{
                task.style.display = "none";
            }
        });

        hbtn.style.background = "rgba(33, 36, 5, 0.1)"; 
        hbtn.setAttribute("data-filtered", "true");
    }
}



// Function to decode JWT and get the payload
function getUsernameFromToken() {
  let token = localStorage.getItem("jwtToken"); 

  if (!token) {
      console.log("No token found");
      return null;
  }

  try {
      let base64Url = token.split(".")[1]; 
      let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); 
      let decodedData = JSON.parse(atob(base64)); 

      return decodedData.sub || decodedData.username || null; 
  } catch (e) {
      console.error("Invalid Token", e);
      return null;
  }
}


let username = getUsernameFromToken();

// document.querySelector('.heading').textContent = username;
