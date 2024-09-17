"use strict";

/**
 * Initializes the board.
 *
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
    await includeHTML();
    await checkUserloggedIn();
    await initTasks();
    navigationHighlight("board-link");
    addEventListenersToCards();
}

/**
 * Initializes tasks by using the user object and creating task cards for each task.
 * @returns {Promise<void>} A promise that resolves when the tasks are initialized.
 */
async function initTasks() {
    await useUserObject();
    userObject.tasks.forEach((task, index) => {
        setTaskDefaults(task, index);
        const assignedHTML = createAssignedHTML(task);
        const assignedHTMLforOpenCard = createAssignedHTMLforOpenCard(task);
        const subtasksHTMLforOpenCard = createSubtasksHTMLforOpenCard(task);
        const card = createTaskCard(
            task,
            assignedHTML,
            assignedHTMLforOpenCard,
            subtasksHTMLforOpenCard
        );
        appendCardToParent(task, card);
    });
}

/**
 * Uses the user object.
 * If the user object is not available, it will retry after 3 seconds.
 * @returns {Promise<void>}
 */
async function useUserObject() {
    if (!userObject) setTimeout(useUserObject, 3000);
}

/**
 * Sets default values for a task object.
 *
 * @param {Object} task - The task object to set defaults for.
 * @param {number} index - The index of the task.
 * @returns {void}
 */
function setTaskDefaults(task, index) {
    task.status = task.status || "toDo";
    task.id = index;
    task.subtaskStatus = task.subtaskStatus || [];
}

/**
 * Returns the initials of a full name.
 *
 * @param {string} fullName - The full name.
 * @returns {string} The initials of the full name.
 */
function getInitialss(fullName) {
    return fullName
        ?.split(" ")
        .filter(Boolean)
        .map((n) => n[0].toUpperCase())
        .join("");
}

/**
 * Adds event listeners to the task cards.
 */
function addEventListenersToCards() {
    document.querySelectorAll(".task-card").forEach((card) => {
        card.addEventListener("dragstart", dragStart);
        card.addEventListener("touchstart", handleTouchStart, false);
        card.addEventListener("touchmove", handleTouchMove, false);
        card.addEventListener("touchend", handleTouchEnd, false);
    });
}

/**
 * Appends a card to the parent element based on the task status.
 *
 * @param {Object} task - The task object.
 * @param {HTMLElement} card - The card element to be appended.
 */
function appendCardToParent(task, card) {
    const parentDiv = document.getElementById(task.status);
    parentDiv.appendChild(card);
    document
        .querySelectorAll(".task-cards-container")
        .forEach(updateNoTasksMessage);
}

/**
 * Opens the edit menu for a task.
 */
function openEditMenu() {
    document.querySelector(".overlay-task-edit").classList.remove("d-none");
    document.querySelector(".overlay-task").classList.add("d-none");
}

/**
 * Closes the edit menu and shows the task overlay.
 */
function closeEditMenu() {
    document.querySelector(".overlay-task-edit").classList.add("d-none");
    document.querySelector(".overlay-task").classList.remove("d-none");
}

/**
 * Clears the task containers by setting their innerHTML to a message indicating no tasks to do.
 */
function clearTaskContainer() {
    const containers = document.querySelectorAll(".task-cards-container");
    containers.forEach((container) => {
        container.innerHTML = `<div class="no-tasks" style="display: flex;">No tasks To do</div>`;
    });
}

/**
 * Hides all task cards on the board.
 * @returns {Promise} A promise that resolves after a timeout of 0 milliseconds.
 */
function hideTaskCards() {
    const taskCards = document.getElementsByClassName("task-card");
    Array.from(taskCards).forEach((card) => {
        card.classList.add("hidden");
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 0);
    });
}

/**
 * Shows all task cards by removing the "hidden" class from each card.
 */
function showTaskCards() {
    const taskCards = document.getElementsByClassName("task-card");
    Array.from(taskCards).forEach((card) => {
        card.classList.remove("hidden");
    });
}

/**
 * Reloads the tasks on the board.
 * Clears the task container, hides task cards, initializes tasks,
 * searches for tasks, shows task cards, and adds touch event listeners to task cards.
 * @returns {Promise<void>} A promise that resolves when the tasks are reloaded.
 */
async function reloadTasks() {
    clearTaskContainer();
    await hideTaskCards();
    await initTasks();
    searchTask();
    showTaskCards();
    const taskCards = document.getElementsByClassName("task-card");
    Array.from(taskCards).forEach((card) => {
        card.addEventListener("touchstart", handleTouchStart);
        card.addEventListener("touchend", handleTouchEnd);
        card.addEventListener("touchmove", handleTouchMove);
    });
}

/**
 * Closes the task and performs necessary cleanup actions.
 */
function closeTask() {
    const overlayTask = document.querySelector(".overlay-task");
    const taskCardOpen = document.querySelector(".task-card-open");
    taskCardOpen.style.animation = "slideOutToRight 0.1s ease-in-out forwards";
    taskCardOpen.addEventListener("animationend", () => {
        overlayTask.style.display = "none";
        taskCardOpen.style.animation = "";
    });
    const taskCards = document.getElementsByClassName("task-card");
    Array.from(taskCards).forEach((card) => {
        card.removeEventListener("touchstart", handleTouchStart);
        card.removeEventListener("touchend", handleTouchEnd);
        card.removeEventListener("touchmove", handleTouchMove);
    });
    if (draggedCard) {
        draggedCard.remove();
        draggedCard = null;
    }
    reloadTasks();
}

const overlayTask = document.querySelector(".overlay-task");
overlayTask.addEventListener("click", (event) => {
    /**
     * Represents the task card open element.
     * @type {HTMLElement}
     */
    const taskCardOpen = document.querySelector(".task-card-open");
    if (!taskCardOpen.contains(event.target)) {
        closeTask();
    }
});

/**
 * Deletes a task from the user's task list.
 * @param {number} id - The ID of the task to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted.
 */
async function deleteTask(id) {
    try {
        const userDataBase = JSON.parse(await getItem("userDataBase"));
        const userIndex = userDataBase.findIndex(
            (user) => user.id.toString() === userObject.id.toString()
        );
        if (userIndex !== -1) {
            userObject.tasks = userObject.tasks.filter(
                (task, index) => index !== id
            );
            userDataBase[userIndex] = userObject;
        }

        await setItem("userDataBase", userDataBase);
    } catch (error) {
        console.error("Error while deleting the task:", error);
    }
    location.reload();
}

/**
 * Toggles the status of a subtask for a given task.
 *
 * @param {number} subtaskIndex - The index of the subtask to toggle.
 * @param {number} taskId - The ID of the task containing the subtask.
 * @returns {Promise<void>} - A promise that resolves when the subtask status is successfully updated.
 */
async function toggleSubtaskStatus(subtaskIndex, taskId) {
    let checkboxImg = document.getElementById(`checkbox-img${subtaskIndex}`);
    try {
        const userDataBase = JSON.parse(await getItem("userDataBase"));
        const userIndex = userDataBase.findIndex(
            (user) => user.id.toString() === userObject.id.toString()
        );
        if (userIndex !== -1) {
            const task = userObject.tasks[taskId];
            const isSubtaskChecked = task.subtaskStatus[subtaskIndex];
            task.subtaskStatus[subtaskIndex] = !isSubtaskChecked;
            checkboxImg.src = isSubtaskChecked
                ? "./assets/img/unchecked.png"
                : "./assets/img/checked.png";
            userDataBase[userIndex] = userObject;
        }

        await setItem("userDataBase", userDataBase);
        console.log("Subtask status successfully updated");
    } catch (error) {
        console.error("Error updating subtask status:", error);
    }
}
/**
 * Searches for tasks based on the input value and filters the task cards and columns accordingly.
 */
function searchTask() {
    const input = document.getElementById("searchbar");
    const filter = input.value.toUpperCase();
    const taskCards = Array.from(document.getElementsByClassName("task-card"));
    const columns = Array.from(document.getElementsByClassName("column"));

    taskCards.forEach((taskCard) => {
        const title = taskCard.getElementsByClassName("card-titel")[0];
        const description =
            taskCard.getElementsByClassName("card-description")[0];
        let titleText = title ? title.innerText : "";
        let descriptionText = description ? description.innerText : "";

        taskCard.style.display =
            titleText.toUpperCase().includes(filter) ||
            descriptionText.toUpperCase().includes(filter)
                ? ""
                : "none";
    });

    columns.forEach((column) => {
        const columnCards = Array.from(
            column.getElementsByClassName("task-card")
        );
        const noTasks = column.getElementsByClassName("no-tasks")[0];
        const allCardsHidden = columnCards.every(
            (card) => card.style.display === "none"
        );

        if (noTasks) {
            noTasks.style.display = allCardsHidden ? "flex" : "none";
        }
    });
}

/**
 * Redirects the user to the "addtask.html" page.
 */
function goToAddTask() {
    window.location.href = "addtask.html";
}
