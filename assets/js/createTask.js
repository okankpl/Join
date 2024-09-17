/**
 * function to create the task and save into the database
 * 
 * @param {string} timeframe - value, whether task is new or edited
 */
async function createTask(timeframe) {
    let task = {};
    let title = document.getElementById('title');
    let dueDate = document.getElementById('dueDate');
    checkRequiredFields(title);
    checkRequiredFields(dueDate);
    checkCategoryField();
    if (title.value !== '' && dueDate.value !== '' && category !== '') {
        createTheTaskObject(task, title, dueDate);
        checkTaskStatus(task, timeframe);
        await setItem("userDataBase", JSON.stringify(userDataBase));
        if (timeframe === 'edit') {
            location.reload();
        }
        resetEverything();
    }
}

/**
 * creating the task-object 
 */
function createTheTaskObject(task, title, dueDate) {
    task.description = document.getElementById('description').value;
    task.category = category;
    task.prio = priority;
    task.status = taskEditStatus;
    task.subtask = subtasksArray;
    task.title = title.value;
    task.dueDate = dueDate.value;
    task.assignto = assignedContacts;
    task.assigntoID = assignedContactsID;
    task.assigntoColor = assignedContactColor;
    task.initialCircles = initialCircles;
    task.subtasksArray = subtasksArray;
    task.subtaskStatus = subtaskStatus;
}

/**
 * creates a new task or changes an existing one
 * 
 * @param {object} task - task-object
 * @param {string} timeframe - value, whether task is new or edited
 */
function checkTaskStatus(task, timeframe) {
    if (timeframe === 'new') {
        userDataBase[userObject.id].tasks.push(task);
        document.getElementById('task-created-container').classList.remove('d-none')
        redirectToBoard();
    }
    else if (timeframe === 'edit') {
        userDataBase[userObject.id].tasks[taskEditNr] = task;
        document.querySelector('.overlay-task-edit').classList.add('d-none');
    }
}

/**
 * function to reset all the inputs from the add-task-form
 */
function resetEverything() {
    document.getElementById('title').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('description').value = '';
    priority = 'medium';
    taskEditStatus = 'toDo'
    subtasksArray = [];
    assignedContacts = [];
    assignedContactsID = [];
    assignedContactColor = [];
    initialCircles = [];
    subtasksArray = [];
    refreshSubtasks();
    changeButtonText();
    resetButton();
    resetCategoryAndButton();
    renderContactsList();
}

/**
 * function to redirect to board.html if new task is created
 */
function redirectToBoard() {
    setTimeout(() => {
        document.getElementById('task-created-container').classList.add('d-none')
        window.location.href = "./board.html"
    }, 1500);
}

/**
 * function to reset the form of the category-field
 */
function resetCategoryAndButton() {
    document.getElementById('category-selected').innerText = 'Select task category';
    document.getElementById('category-selected').classList.remove('font-black');
    document.getElementById('mediumPrioButton').classList.add('prioMedium');
    document.getElementById('mediumPrioButtonFont').classList.add('colored-white', 'font-weight-clicked');
}

/**
 * function to check if all required fields have a value
 */
function checkRequiredFields(inputField) {
    if (inputField.value === '') {
        document.getElementById(inputField.id).classList.add("red-border");
        document.getElementById(inputField.id + "-required").classList.remove("d-none");
    }
    else {
        document.getElementById(inputField.id).classList.remove("red-border");
        document.getElementById(inputField.id + "-required").classList.add("d-none");
    }
}

/**
 * function to check if category field has a value
 */
function checkCategoryField() {
    if (category === '') {
        document.getElementById('category-btn').classList.add("red-border");
        document.getElementById('category' + "-required").classList.remove("d-none");
    }
    else {
        document.getElementById('category-btn').classList.remove("red-border");
        document.getElementById('category' + "-required").classList.add("d-none");
    }
}