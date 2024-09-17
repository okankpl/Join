let assignedContacts = [];
let assignedContactsID = [];
let assignedContactColor = [];
let prioButtonsColor = document.querySelectorAll('.prio-container button');
let prioButtonsColorFont = document.querySelectorAll('.prio-container button div');
let categoryMenuOpen = false;
let category = '';
let assignedToMenuOpen = false;
let priority = 'medium';
let initialCircles = [];
let subtasksArray = [];
let contacts;
let taskEditNr = 0;
let taskEditStatus = 'toDo';
let subtaskStatus = [];

/**
 * function to initialize the addtask-page
 */
async function initAddTaskPage() {
    checkUserloggedIn();
    loadContacts();
    await includeHTML();
    navigationHighlight('addtask-link');
    subtaskEvents();
}
/**
 * Function to load the userdatabase from the webserver and generate the contacts
 * 
 */
async function loadContacts() {
    try {
        const result = await getItem("userDataBase");
        userDataBase = JSON.parse(result);
        contacts = userDataBase[userObject.id].contacts;
        renderContactsList();
    } catch (e) {
        console.error("Loading error:", e);
        contacts = [];
    }
}
/**
 * this function is getting the task, that the user wants to edit from the board.html
 * 
 * @param {object} task - task to be edited 
 */
async function sendTaskToEdit(task) {
    taskEditNr = task.id;
    await initAddTaskPage();
    await editTaskpage(task);
}

/**
 * function assigns the values of the edited task into the inputfields of the addtask-site 
 * 
 * @param {object} task - task to be edited 
 */
function editTaskpage(task) {
    document.getElementById('title').value = task.title;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('description').value = task.description;
    document.getElementById('category-selected').innerText = task.category;
    category = task.category;
    assignedContacts = task.assignto;
    assignedContactsID = task.assigntoID;
    assignedContactColor = task.assigntoColor;
    initialCircles = task.initialCircles;
    subtasksArray = task.subtasksArray;
    taskEditStatus = task.status;
    priority = '';
    setPriority(task.prio);
    refreshSubtasks();
    changeButtonText();
}

/**
 * function takes the name of a contact and generates the initials
 * 
 * @param {number} contactNr - number of the contact in the contact list
 * @returns - initials of the contact in capital letters
 */
function generateInitials(contactNr) {
    let fullname = contacts[contactNr].name;
    return splitAndUpperCaseInitials(fullname);
}

/**
 * splits the name of the contact to get the first letters
 *  
 * @param {string} fullname - name of the contact
 * @returns - initials of the contact
 */
function splitAndUpperCaseInitials(fullname) {
    let name = fullname.split(' ');
    let initials = "";
    for (let i = 0; i < name.length; i++) {
        name[i] = name[i].charAt(0).toUpperCase();
        initials += name[i];
    }
    return initials;
}

/**
 * function sets the color and the priority of the pressed button
 * 
 * @param {string} pressedButton - prio of the pressed button 
 */
function setPriority(pressedButton) {
    prioButtonsColor = document.querySelectorAll('.prio-container button');
    prioButtonsColorFont = document.querySelectorAll('.prio-container button div');
    resetButton();
    if (pressedButton == 'high') {
        setHighPriority()
    }
    else if (pressedButton == 'medium') {
        setMediumPriority()

    }
    else if (pressedButton == 'low') {
        setLowPriority()
    }
}

function setHighPriority() {
    if (priority == 'high') {
        resetButton();
        priority = '';
    }
    else {
        priority = 'high';
        document.getElementById('highPrioButton').classList.add('prioHigh')
        document.getElementById('highPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
    }
}

function setMediumPriority() {
    if (priority == 'medium') {
        resetButton();
        priority = '';
    }
    else {
        priority = 'medium';
        document.getElementById('mediumPrioButton').classList.add('prioMedium')
        document.getElementById('mediumPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
    }
}

function setLowPriority() {
    if (priority == 'low') {
        resetButton();
        priority = '';
    }
    else {
        priority = 'low';
        document.getElementById('lowPrioButton').classList.add('prioLow')
        document.getElementById('lowPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
    }
}

/**
 * function resets the style of the not-pressed buttons
 *  
 */
function resetButton() {
    for (let i = 0; i < 3; i++) {
        prioButtonsColor[i].setAttribute('class', '');
        prioButtonsColorFont[i].setAttribute('class', '');
    }
}

/**
 * opens and closes the assign list 
 */
function openAssignContainer() {

    if (assignedToMenuOpen == false) {
        document.getElementById('contacts-to-assign-container').classList.remove('d-none');
        document.getElementById('assigned-to-btn').classList.add('blue-border');
        assignedToMenuOpen = true;
    }
    else {
        document.getElementById('contacts-to-assign-container').classList.add('d-none');
        document.getElementById('assigned-to-btn').classList.remove('blue-border');
        assignedToMenuOpen = false;
    }
}

/**
 * opens and closes the category list
 */
function openCategoryContainer() {
    if (categoryMenuOpen == false) {
        document.getElementById('category-dropdown-menu').classList.remove('d-none');
        document.getElementById('category-btn').classList.add('blue-border');
        categoryMenuOpen = true;
    }
    else {
        document.getElementById('category-dropdown-menu').classList.add('d-none');
        document.getElementById('category-btn').classList.remove('blue-border');
        categoryMenuOpen = false;
    }
}

/**
 * sets the category of the task and gives it the correct style
 * 
 * @param {string} categorySelected - name of the selected task-category
 */
function selectCategory(categorySelected) {
    closeCategoryAndRemoveBorder()
    category = categorySelected;
    document.getElementById('category-selected').innerText = categorySelected;
    document.getElementById('category-selected').classList.add('font-black');
}

document.addEventListener('click', function (event) {
    if (event.target.id !== 'category-selected' && event.target.id !== 'category-btn') {
        closeCategoryAndRemoveBorder()
    }
});

function closeCategoryAndRemoveBorder() {
    document.getElementById('category-dropdown-menu').classList.add('d-none');
    document.getElementById('category-btn').classList.remove('blue-border');
    categoryMenuOpen = false;
}

/**
 * eventlistener to close the container with the contacts when clicked outside
 */
document.addEventListener('click', function (event) {
    if (event.target.id !== 'assigned-to-btn' && event.target.id !== 'buttontext' && event.target.parentNode.className !== 'listItem' && event.target.className !== 'nameFrame' &&
        event.target.className !== 'contactAssignCheck' && event.target.className !== 'contact-circle') {
        document.getElementById('contacts-to-assign-container').classList.add('d-none');
        document.getElementById('assigned-to-btn').classList.remove('blue-border');
        assignedToMenuOpen = false;
    }
});

/**
 * renders the list of the contact-container and check if contact is already assigned to a task
 */
function renderContactsList() {
    let assignedToList = document.getElementById('contacts-to-assign-list');
    assignedToList.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let firstAndLastLetter = generateInitials(i);
        let backgroundColor = contacts[i].bgrColor;
        assignedToList.innerHTML += renderContactsListHTML(firstAndLastLetter, backgroundColor, i);
        if (assignedContacts.includes(contacts[i].name)) {
            document.getElementById('contactID' + i).classList.add('checked');
            document.getElementById('checkButtonID' + i).src = './assets/img/check_button_checked.png';
        }
    };
}

/**
 * renders the html code for the Contactlist
 *  
 * @param {string} firstAndLastLetter - first and last letter of the contact 
 * @param {string} backgroundColor - backgroundcolor of the contact
 * @param {number} i - position of the contact in the object
 * @returns 
 */
function renderContactsListHTML(firstAndLastLetter, backgroundColor, i) {
    return `<div class="listItem">
                <li class="clickable" id="contactID${i}" onclick="assignContact('${contacts[i].name}', 'contactID${i}', 'checkButtonID${i}', '${backgroundColor}')">
                    <div class="nameFrame">
                 <div class="contact-circle" style="background-color: ${backgroundColor}">
                    ${firstAndLastLetter}
                </div>${contacts[i].name}
                </div>
                    <img class="contactAssignCheck" id="checkButtonID${i}" src="./assets/img/check_button.png"> 
                </li>
            </div>`
}

/**
 * assignes the selected contact to the task
 * 
 * @param {string} contactName - name of the selected contact
 * @param {string} contactID - id of the selected contact
 * @param {string} checkButtonID - id of the check button
 * @param {string} color - backgroundcolor of the contact
 */
function assignContact(contactName, contactID, checkButtonID, color) {
    highlightSelectedContact(contactName, contactID, checkButtonID, color);
    changeButtonText(contactID);

}

/**
 * pushes the assigned contacts into an array of all selected contacts of removes it 
 * 
 * @param {string} contactName - name of the selected contact
 * @param {string} contactID - id of the selected contact
 * @param {string} checkButtonID - id of the check button
 * @param {string} color - backgroundcolor of the contact
 */
function highlightSelectedContact(contactName, contactID, checkButtonID, color) {
    let index = assignedContacts.indexOf(contactName);
    if (index === -1) {
        assignedContacts.push(contactName);
        assignedContactsID.push(contactID);
        assignedContactColor.push(color);
        document.getElementById(contactID).classList.add('checked');
        document.getElementById(checkButtonID).src = './assets/img/check_button_checked.png';
    }
    else {
        removeContactInArray(index, contactID);
        document.getElementById(checkButtonID).src = './assets/img/check_button.png';
    }
}

/**
 * changes the text of "Select contacts to assign" button
 */
function changeButtonText() {
    addCirclesToContainer();
    let buttonText = document.getElementById('buttontext');
    if (assignedContacts.length == 0) {
        buttonText.innerHTML = `Select contacts to assign`;
    }
    else {
        buttonText.innerHTML = `An:`;
    }
}

/**
 * adds the colored circles for the initials under the assign-field
 */
function addCirclesToContainer() {
    initialCircles = assignedContacts.map((element) => {
        return splitAndUpperCaseInitials(element);
    })
    let circle = document.getElementById("contact-circles-container");
    circle.innerHTML = '';

    for (let i = 0; i < initialCircles.length; i++) {
        circle.innerHTML += `<div class="contact-circle" style="background-color: ${assignedContactColor[i]}">${initialCircles[i]}</div>`
    }
}

/**
 * removes the assigned contacts from the array
 * 
 * @param {event} event - event to prevent closing of the container
 * @param {string} name - name of the contact in the array
 * @param {string} id - id of the contact in the array
 */
function removeContactInList(event, name, id) {
    event.stopPropagation();
    let index = assignedContacts.indexOf(name);
    removeContactInArray(index, id);
    changeButtonText(id);
}

function removeContactInArray(index, id) {
    assignedContacts.splice(index, 1);
    assignedContactsID.splice(index, 1);
    assignedContactColor.splice(index, 1);
    document.getElementById(id).classList.remove('checked');
    document.querySelector(`#${id} img`).src = './assets/img/check_button.png';
}