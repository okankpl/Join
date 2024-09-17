/**
 * Creates HTML for displaying assigned users' initials.
 * @param {Object} task - The task object containing assigned users' information.
 * @returns {string} - The HTML string representing the assigned users' initials.
 */
function createAssignedHTML(task) {
    let assignedHTML = "";
    const maxInitials = 5;
    const assignedCount = task.assignto.length;

    task.assignto.forEach((fullName, index) => {
        if (index < maxInitials) {
            const initials = getInitialss(fullName);
            const color = task.assigntoColor[index];
            assignedHTML += `<div class="card-contacts" style="background-color: ${color}">${initials}</div>`;
        }
    });

    if (assignedCount > maxInitials) {
        const remainingCount = assignedCount - maxInitials;
        assignedHTML += `<div class="card-contacts-more">+${remainingCount}</div>`;
    }

    return assignedHTML;
}

/**
 * Creates HTML for displaying assigned users on an open card.
 * @param {Object} task - The task object containing assigned users.
 * @returns {string} - The HTML string representing the assigned users.
 */
function createAssignedHTMLforOpenCard(task) {
    return task.assignto
        .map((fullName, index) => {
            const initials = getInitialss(fullName);
            const color = task.assigntoColor[index];
            return `<div class="card-contacts-wrapper"><div class="card-contacts" style="background-color: ${color}">${initials}</div><div>${fullName}</div></div>`;
        })
        .join("");
}

/**
 * Creates HTML markup for displaying subtasks of an open card.
 * @param {Object} task - The task object containing subtasks and their statuses.
 * @returns {string} - The HTML markup for displaying subtasks.
 */
function createSubtasksHTMLforOpenCard(task) {
    return task.subtask
        .map((subtask, index) => {
            const isChecked =
                task.subtaskStatus[index] === true ? "checked" : "unchecked";
            return `<div id="checkbox-container"><label for="checkbox${index}" class="checkbox-label"><img src="./assets/img/${isChecked}.png" id="checkbox-img${index}"><input type="checkbox" id="checkbox${index}" class="checkbox" onclick="toggleSubtaskStatus(${index}, ${task.id})"></label>${subtask}</div>`;
        })
        .join("");
}

/**
 * Creates a task card element.
 *
 * @param {Object} task - The task object.
 * @param {string} assignedHTML - The HTML content for assigned users.
 * @param {string} assignedHTMLforOpenCard - The HTML content for assigned users in the open card view.
 * @param {string} subtasksHTMLforOpenCard - The HTML content for subtasks in the open card view.
 * @returns {HTMLElement} The created task card element.
 */
function createTaskCard(
    task,
    assignedHTML,
    assignedHTMLforOpenCard,
    subtasksHTMLforOpenCard
) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.id = task.id;
    card.setAttribute("draggable", true);
    card.setAttribute("ondragstart", "dragStart(event)");
    card.setAttribute(
        "onclick",
        `openTask(this.id, '${assignedHTMLforOpenCard}', '${subtasksHTMLforOpenCard}')`
    );
    const trueCount = task.subtaskStatus.filter(
        (status) => status === true
    ).length;
    const completedPercentage = (trueCount / task.subtask.length) * 100;
    card.innerHTML = getCardHTML(
        task,
        assignedHTML,
        trueCount,
        completedPercentage
    );
    return card;
}

/**
 * Generates the HTML markup for a card based on the provided task object.
 *
 * @param {Object} task - The task object containing information about the card.
 * @param {string} assignedHTML - The HTML markup for the assigned users.
 * @param {number} trueCount - The number of completed subtasks.
 * @param {number} completedPercentage - The percentage of completed subtasks.
 * @returns {string} The HTML markup for the card.
 */
function getCardHTML(task, assignedHTML, trueCount, completedPercentage) {
    return `
        <div class="card-category-wrapper">
            <div class="card-category" style="${
                task.category === "Technical Task"
                    ? "background-color: #1FD7C1;"
                    : ""
            }">${task.category}</div>
            <img src="./assets/img/drag.png" alt="drag icon" class="drag-icon" />
        </div>
        <div class="card-titel">${task.title}</div>
        <div class="card-description">${task.description}</div>
        <div class="card-progress" style="display: ${
            task.subtask.length < 1 ? "none" : ""
        };">
            <div class="card-progressbar-container">
                <div class="card-progressbar" style="width: ${completedPercentage}%;"></div>
            </div>
            <div class="card-subtasks"> ${trueCount} / ${
        task.subtask.length
    } Subtasks</div>
        </div>
        <div class="card-footer">
            <div class="card-assigned">
                ${assignedHTML}
            </div>
            <div class="card-priority">
                <img src="./assets/img/${task.prio}.png" alt="priority icon" />
            </div>
        </div>
    `;
}

/**
 * Opens a task and displays its details in an overlay.
 * @param {string} id - The ID of the task to be opened.
 * @param {string} assignedHTML - The HTML content for the assigned users.
 * @param {string} subtasksHTMLforOpenCard - The HTML content for the subtasks.
 */
function openTask(id, assignedHTML, subtasksHTMLforOpenCard) {
    const overlayTask = document.querySelector(".overlay-task");
    const task = userObject.tasks[id];
    const dateString = task.dueDate;
    const date = new Date(dateString);
    const usDate = date.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    sendTaskToEdit(task);
    const taskCardOpenHTML = `
    <div class="task-card-open">
      <div class="card-category-wrapper">
        <div class="card-category" style="${
            task.category === "Technical Task"
                ? "background-color: #1FD7C1;"
                : ""
        }">${task.category}</div>
        <div class="card-close" onclick="closeTask()">
        <img src="./assets/img/close_black.png" alt="close icon"/>
        </div>
      </div>
      <div class="card-titel">${task.title}</div>
      <div class="card-description">${task.description}</div>
      <div class="card-due-date"><span class="txt-gray">Due date:</span> ${usDate}</div>
      <div class="card-priority">
        <span class="txt-gray">Priority:</span> ${task.prio}
        <img src="./assets/img/${task.prio}.png" alt="priority icon" />
      </div>
      <div class="card-assigned" style="display: ${
          task.assignto.length === 0 ? "none" : ""
      };">
        <div class="txt-gray">Assigned To:</div>
        <div class="card-assigned">${assignedHTML}</div>
      </div>
      <div class="card-subtasks" style="display: ${
          task.subtask.length === 0 ? "none" : ""
      };">
        <div class="txt-gray">Subtasks</div>${subtasksHTMLforOpenCard}
      </div>
      <div class="card-edit">
        <div onclick="deleteTask(${id})">
          <img src="./assets/img/delete.png" alt="delete icon" /><span>Delete</span>
        </div>
        <div class="card-line"></div>
        <div onclick="openEditMenu()">
          <img src="./assets/img/edit-task.png" alt="edit icon" /><span>Edit</span>
        </div>
      </div>
    </div>`;

    overlayTask.innerHTML = taskCardOpenHTML;
    overlayTask.style.display = "flex";
}
