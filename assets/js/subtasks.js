/**
 * function to add subtasks into subtask-array
 * 
 * @returns nothing if no subtask is added
 */
function addSubtasks() {
    let subtask = document.getElementById('subtasks');
    if (subtask.value == '') {
        return;
    }
    subtasksArray.push(subtask.value);
    subtask.value = '';
    refreshSubtasks();
}

/**
 * refreshes the subtask list if something is added or removed
 */
function refreshSubtasks() {
    let subtaskList = document.getElementById('subtasks-list');
    subtaskList.innerHTML = '';
    for (let i = 0; i < subtasksArray.length; i++) {
        subtaskList.innerHTML += generateSubtaskHTML(i)
    }
}

/**
 * generates the HTML code of the subtask-list
 * 
 * @param {number} i - position of the subtask in the subtaskarray
 * @returns HTML code of the subtask-list
 */
function generateSubtaskHTML(i) {
    return `<div id="subtaskID${i}" class="input-button-container">
                <span id="subtaskID${i}">${subtasksArray[i]}
                </span>
                    <div class="subtask-button-container">
                        <button onclick="editSubtask(${i}, 'subtaskID${i}')"><img src="assets/img/edit-task.png"></button>
                            <div id="separator" class="separator"></div>
                        <button onclick="deleteSubtask(${i})"><img src="assets/img/delete.png"></button>
                    </div>
            </div>`
}


/**
 * function to remove subtasks from subtask-array
 * 
 * @param {number} position -  position of the subtask in the subtaskarray
 */
function deleteSubtask(position) {
    subtasksArray.splice(position, 1);
    refreshSubtasks();
}

/**
 * function to generate the editable subtask list
 * 
 * @param {*} position - position of the subtask in the array
 * @param {*} ID - id of the subtask in the html file
 */
function editSubtask(position, ID) {
    refreshSubtasks();
    document.getElementById(ID).innerHTML = `<div class="input-button-container">
                                                <input id="subtaskChangeInput" type="text"></input>
                                                <button onclick="changeSubtask(${position})">
                                                <img src="assets/img/tick.png">
                                                </button>
                                            </div>`
    document.getElementById('subtaskChangeInput').value = subtasksArray[position];
    document.getElementById(ID).style.backgroundColor = "white";
    document.getElementById('subtaskChangeInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            changeSubtask(position);
        }
    })
}

/**
 * changes the value of the subtask in the array
 * 
 * @param {number} position - position of the subtask in the array
 */
function changeSubtask(position) {
    let changedText = document.getElementById('subtaskChangeInput');
    subtasksArray[position] = changedText.value;
    refreshSubtasks();
}

/**
 * events to change the style of the subtasks when hovering
 */
function subtaskEvents() {
    document.getElementById('subtasks').addEventListener('focus', function (event) {
        document.getElementById('subtasks-input-button-container').classList.add('blue-border');
        document.getElementById('erase-subtask').classList.remove('d-none');
        document.getElementById('separator').classList.remove('d-none');

    })
    document.getElementById('subtasks').addEventListener('blur', function (event) {
        document.getElementById('subtasks-input-button-container').classList.remove('blue-border');
        document.getElementById('erase-subtask').classList.add('d-none');
        document.getElementById('separator').classList.add('d-none');
    })
    document.querySelector('.input-button-container #subtasks').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addSubtasks();
        }
    })
}