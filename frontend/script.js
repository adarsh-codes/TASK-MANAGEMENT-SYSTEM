const signupbutton = document.getElementById("signupbtn");
const loginbutton = document.getElementById("loginbtn");

const userMenu = document.getElementById("userManage");
const userIcon = document.getElementById("userIcon");
const taskContainer = document.querySelector(".taskContainer");

const token = localStorage.getItem("jwtToken");

if (token) {
  signupbutton.style.display = "none";
  loginbutton.style.display = "none";
  

  fetchTasks(token);
} else {
  signupbutton.style.display = "block";
  loginbutton.style.display = "block";
}

document.getElementById('logOut').onclick = function(){
  if (!confirm("Are you sure you want to log out?")) return;

  localStorage.removeItem("jwtToken");
  signupbutton.style.display = "block";
  loginbutton.style.display = "block";
  
  document.getElementById("taskList").innerHTML =
    "<p>You have been logged out.</p>";

  setTimeout(() => {
    window.location.href = "entry.html";
  }, 1000);

}

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
      taskblur.style.display = "none";
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
      taskblur.style.display = "block";
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
const taskblur = document.querySelector(".task-div-blur");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");

addTaskBtn.onclick = function () {
  document.querySelector(".createoredit").innerHTML = "Create A Task";

  taskblur.style.display = "block";
  taskFormContainer.style.display = "block";
};

cancelTaskBtn.onclick = function () {
  taskFormContainer.style.display = "none";
  taskblur.style.display = "none";
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

// SIDE WINDOW BUTTONS-

function selectMenuItem(clickedItem) {
  document.querySelectorAll(".lists li").forEach((item) => {
    item.classList.remove("selected");
  });

  clickedItem.classList.add("selected");
}

function filterTasks(filterType) {
  const taskcards = document.querySelectorAll(".task-item");
  const today = new Date().toISOString().split("T")[0];

  taskcards.forEach((task) => {
    const status = task.getAttribute("data-status");
    const priority = task.getAttribute("data-priority");
    const dueDate = task.getAttribute("data-due-date");

    let shouldShow = false;

    switch (filterType) {
      case "all":
        shouldShow = true;
        break;
      case "pending":
        shouldShow = status !== "DONE";
        break;
      case "complete":
        shouldShow = status === "DONE";
        break;
      case "overdue":
        shouldShow = dueDate && dueDate < today;
        break;
      case "highP":
        shouldShow = priority === "HIGH";
        break;
    }

    task.style.display = shouldShow ? "block" : "none";
  });

  selectMenuItem(document.getElementById(filterType));
}

// Function to decode JWT and get the payload
function getUserDetailsFromToken() {
  let token = localStorage.getItem("jwtToken");

  if (!token) {
    console.log("No token found");
    return null;
  }

  try {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let decodedData = JSON.parse(atob(base64));

    return { username: decodedData.sub, email: decodedData.email };
  } catch (e) {
    console.error("Invalid Token", e);
    return null;
  }
}

let userdetails = getUserDetailsFromToken();

document.querySelector(".displayUsername").textContent = userdetails.username;
document.querySelector(".emailWrite").value = userdetails.email;
document.querySelector(".userWrite").value = userdetails.username;

// show or hide user manager div
function manageUser() {
  let manageuserdiv = document.querySelector(".userManage");

  manageuserdiv.hidden = !manageuserdiv.hidden;
}

document.getElementById("closeManage").onclick = function () {
  let manageuserdiv = document.querySelector(".userManage");

  manageuserdiv.hidden = !manageuserdiv.hidden;
};



function changeInput(inptype) {
  let emailinput = document.getElementById(inptype);

  if (emailinput.hasAttribute("readonly")) {
    emailinput.removeAttribute("readonly");
    emailinput.focus();
   
  } else {
    emailinput.setAttribute("readonly", true);
  }
}

async function changePass() {
    let passfield = document.querySelector('.newpassWord');
    let userfield = document.querySelector('.userWrite');

    let userdetails = getUserDetailsFromToken();

    if(!confirm('Are you sure to save changes?')){
      return;
    }

    if(passfield.value.trim() == ""){
      if(userfield.value == userdetails.username){
        alert("No changes made!");
        return; 
      }
    }

    if(userfield.value == userdetails.username){
      if(passfield.value.length < 8){
        alert("Password should be atleast 8 characters.");
        return;
      }
    }

   

    let token = localStorage.getItem('jwtToken');


    
    const data = {
      username: userfield.value,
      email: userdetails.email,
      password: passfield.value
    }

    try{
      const response = await fetch('http://localhost:8080/auth/change',{
        "method":"PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      const d = await response.text();

      alert(`Success ${d}`);
      window.location.href = "entry.html";
    }
    catch(error){
      console.log(error);
      alert(`failed! ${d}`)
    }
}
