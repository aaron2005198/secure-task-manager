// js/app.js
// Secure Dynamic Task Manager
// Every task is built with createElement(); user text is only ever written
// with textContent / input.value, and one delegated click listener on
// #taskList handles Complete, Edit/Save, and Remove for every task.

(function () {
  "use strict";

  const EMPTY_MESSAGE = "Task cannot be empty";

  const SAMPLE_TASKS = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  // ---- DOM selection (looked up once) --------------------------------
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const loadSamplesBtn = document.getElementById("loadSamplesBtn");
  const taskList = document.getElementById("taskList");
  const taskMessage = document.getElementById("taskMessage");
  const totalCount = document.getElementById("totalCount");
  const pendingCount = document.getElementById("pendingCount");
  const completedCount = document.getElementById("completedCount");

  let nextTaskNumber = 1;

  // ---- Helpers -------------------------------------------------------

  function generateTaskId() {
    const id = "task-" + nextTaskNumber;
    nextTaskNumber += 1;
    return id;
  }

  function isBlank(text) {
    return typeof text !== "string" || text.trim().length === 0;
  }

  function createButton(className, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    return button;
  }

  // ---- Required functions --------------------------------------------

  // Builds one task <li>. Does NOT attach it to the list.
  function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const textSpan = document.createElement("span");
    textSpan.classList.add("task-text");
    textSpan.textContent = taskText;

    const completeBtn = createButton("complete-btn", "Complete");
    const editBtn = createButton("edit-btn", "Edit");
    const removeBtn = createButton("remove-btn", "Remove");

    taskItem.append(textSpan, completeBtn, editBtn, removeBtn);
    return taskItem;
  }

  // Calculates all counts from the current DOM.
  function updateTaskCounts() {
    const items = taskList.querySelectorAll(".task-item");
    let completed = 0;

    items.forEach(function (item) {
      if (item.dataset.state === "completed") completed += 1;
    });

    totalCount.textContent = items.length;
    completedCount.textContent = completed;
    pendingCount.textContent = items.length - completed;
  }

  function addTask(taskText) {
    if (isBlank(taskText)) {
      taskMessage.textContent = EMPTY_MESSAGE;
      return;
    }

    const taskItem = createTaskElement(taskText.trim(), generateTaskId());
    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskMessage.textContent = "";
    updateTaskCounts();
  }

  function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle("completed");
    taskItem.dataset.state = isCompleted ? "completed" : "pending";
    updateTaskCounts();
  }

  function beginTaskEdit(taskItem) {
    const textSpan = taskItem.querySelector(".task-text");
    const editBtn = taskItem.querySelector(".edit-btn");
    if (!textSpan || !editBtn) return;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = textSpan.textContent;

    textSpan.replaceWith(editInput);
    editBtn.textContent = "Save";
    editInput.focus();
  }

  function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editBtn = taskItem.querySelector(".edit-btn");
    if (!editInput || !editBtn) return;

    if (isBlank(editInput.value)) {
      taskMessage.textContent = EMPTY_MESSAGE;
      return;
    }

    const textSpan = document.createElement("span");
    textSpan.classList.add("task-text");
    textSpan.textContent = editInput.value.trim();

    editInput.replaceWith(textSpan);
    editBtn.textContent = "Edit";
    taskMessage.textContent = "";
  }

  function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
  }

  // The single delegated click handler for all task-level actions.
  function handleTaskListClick(event) {
    const target = event.target;
    const taskItem = target.closest(".task-item");
    if (!taskItem || !taskList.contains(taskItem)) return;

    if (target.matches(".complete-btn")) {
      toggleTaskComplete(taskItem);
    } else if (target.matches(".edit-btn")) {
      if (taskItem.querySelector(".edit-input")) {
        saveTaskEdit(taskItem);
      } else {
        beginTaskEdit(taskItem);
      }
    } else if (target.matches(".remove-btn")) {
      removeTask(taskItem);
    }
  }

  // Builds all sample tasks in a fragment, then appends once.
  function loadSampleTasks() {
    const fragment = document.createDocumentFragment();

    SAMPLE_TASKS.forEach(function (text) {
      fragment.appendChild(createTaskElement(text, generateTaskId()));
    });

    taskList.appendChild(fragment);
    taskMessage.textContent = "";
    updateTaskCounts();
  }

  // ---- Event wiring ----------------------------------------------------
  taskList.addEventListener("click", handleTaskListClick);

  addTaskBtn.addEventListener("click", function () {
    addTask(taskInput.value);
  });

  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addTask(taskInput.value);
  });

  loadSamplesBtn.addEventListener("click", loadSampleTasks);

  updateTaskCounts();
})();
