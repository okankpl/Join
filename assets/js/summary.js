const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentDate = new Date;


/**
 * Initializes the summary page by onload
 */
async function initSummary() {
    await includeHTML();
    await checkUserloggedIn();
    navigationHighlight('summary-link');
    renderSummary();
    noCssAnimationSummary();
    renderFirstLogin();
    noCssAnimationGreetings()
    changeGreeting();
    guestLogin()
}


/**
 * Initializes the summary page by succesful login
 */
async function initWelcome() {
    await includeHTML();
    await checkUserloggedIn();
    navigationHighlight('summary-link');
    renderSummary();
    renderFirstLogin();
    changeGreeting();
    guestLogin();
}


/**
 * Renders the greeting Code for the first login in the summary page.
 */
function renderFirstLogin() {
    let summaryContainer = document.getElementById('summary-content');
    summaryContainer.innerHTML += firstLoginHtml();
}


/**
 * Renders the summary content in the summary page.
 */
function renderSummary() {
    let summaryContainer = document.getElementById('summary-content');
    summaryContainer.innerHTML += renderSummaryHtml();
}


/**
 * deactivates the greeting animation after the login
 */
function noCssAnimationSummary() {
    document.getElementById('summary-overview').style.opacity = "1"
    document.getElementById('summary-overview').style.animation = "none"
}


/**
 * deactivates the greeting animation in the mobile version
 */
function noCssAnimationGreetings() {
    document.getElementById('greetings').classList.add('hide-greetings')
    document.getElementById('greetings').style.animation = "none"
}


/**
 * Displays the date in a specific format. 
 * @returns the time for urgent todos
 */
function displayDate() {
    let day = currentDate.getDate() +2 ;
    let monthIndex = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let formatedTime = month[monthIndex] + ' ' + day + ', ' + year;
    return formatedTime
}


/**
 * manage the greeting by local time based on the current hour
 * @returns the changed content by time
 */
function changeGreeting() {
    let currentHour = currentDate.getHours()
    if (currentHour >= 4 && currentHour < 12) {
        return document.getElementById('greet-user-time').innerHTML = 'Good morning,';
    }
    if (currentHour >= 12 && currentHour < 19) {
        return document.getElementById('greet-user-time').innerHTML = 'Good day,';
    }
    if (currentHour >= 19 || currentHour < 4) {
        return document.getElementById('greet-user-time').innerHTML = 'Good evening,';
    }
}


/**
 * Filters tasks based on their status and returns the number of tasks with the specified status.
 * @param {Array} tasks - An array of all tasks from a specific user Account
 * @param {string} status - The status of tasks to filter by.
 */
function getTasksLength(tasks, status) {
    return tasks.filter( task => task.status === status)
}


/**
 * Counts the number of tasks with the specified status for the current user.
 * @param {string} status - The status of tasks to count.
 * @returns {number} The number of tasks with the specified status.
 */
function tasksCount(status) {
    const feedbackCount = getTasksLength(userObject.tasks, status)
    return feedbackCount.length
}


/**
 * Filters tasks based on their status and returns the number of tasks with the specified status.
 * @param {Array} tasks - An array of all tasks from a specific user Account
 * @param {string} status - The status of tasks to filter by.
 */
function getPrioLength(tasks, status) {
    return tasks.filter( task => task.prio === status)
}


/**
 * Counts the number of tasks with the specified status for the current user.
 * @param {string} status - The status of tasks to count.
 * @returns {number} The number of tasks with the specified status.
 */
function prioCount(status) {
    const feedbackCount = getPrioLength(userObject.tasks, status)
    return feedbackCount.length
}


/**
 * special display for guestlogin interface, remove gust name and comma
 */
function guestLogin() {
    greet = changeGreeting()
    guestId = localStorage.getItem('userId');
    if (guestId === '8') {
        document.getElementById('greet-user-time').innerHTML = `${greet.slice(0, greet.length - 1)}`;
        document.getElementById('greet-user').remove()
    }
}


/**
 * rendering the greeting content in HTML Code (mobile: only after log in)
 * @returns HTML code
 */
function firstLoginHtml() {
    return /*html*/`
    <div class="align-center">
        <div id="greetings" class="greetings">
            <h2 id="greet-user-time" class="h2-desktop">Good morning,</h2>
            <h1 id="greet-user" class="h1-blue h1-tasks-numbers">${userObject.name}</h1>
        </div>
    </div>
    `
}


/**
 * rendering the whole summary content box HTML Code
 * @returns HTML code
 */
function renderSummaryHtml() {
    return /*html*/`
    <div id="summary-overview">
        <div class="topic-box">
            <h1 class="m-bot8 h1-desktop">Join 360</h1>
            <h4 class="h4-desktop">Key Metrics at a Glance</h4>
            <div class="divider-line"></div>
        </div>
        <div id="summary-box" class="desktop-width">
            <div id="task-row-1">
                <a href="board.html" class="task-card task-card-width-50">
                    <div class="img-box">
                        <div class="img-pencil">
                        </div>
                    </div>
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${tasksCount('toDo')}</h1>
                        <h5 class="h5-desktop-20px">To-do</h5>
                    </div>
                </a>
                <a href="board.html" class="task-card task-card-width-50 scale-left">
                    <div class="img-box">
                        <div class="img-check">
                        </div>
                    </div>
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${tasksCount('done')}</h1>
                        <h5 class="h5-desktop-20px">Done</h5>
                    </div>
                </a>
            </div>
            <div id="task-row-2">
                <a href="board.html" class="task-card task-card-width-100">
                    <div class="task-card-left">
                        <div class="img-box img-urgent">

                            <!-- <img src="./assets/img/urgent.png"> -->
                        </div>
                        <div class="card-info">
                            <h1 class="h1-tasks-numbers">${prioCount('high')}</h1>
                            <h5 class="h5-desktop-20px">Urgent</h5>
                        </div>
                    </div>
                    <div class="vertical-divider"></div>
                    <div class="task-card-right">
                        <span class="actual-date">${displayDate()}</span>
                        <h5 class="h5-desktop-16px">Upcoming Deadline</h5> 
                    </div>
                </a>
            </div>
            <div id="task-row-3">
                <a href="board.html" class="task-card task-card-width-33">
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${userObject.tasks.length}</h1>
                        <h5 class="h5-desktop-20px">Tasks in Board</h5>
                    </div>
                </a>
                <a href="board.html" class="task-card task-card-width-33 scale-center">
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${tasksCount('progress')}</h1>
                        <h5 class="h5-desktop-20px">Tasks in Progress</h5>
                    </div>
                </a>
                <a href="board.html" class="task-card task-card-width-33 scale-left">
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${tasksCount('feedback')}</h1>
                        <h5 class="h5-desktop-20px">Awaiting Feedback</h5>
                    </div>
                </a>
            </div>
        </div>
    </div>
`
}
