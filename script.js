let menuEnabled = true;
let checkboxChecked = true;
let userObject;

/**
 * loads the same header and navigation on all .html files
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


/**
 * Initializes the application on the body Element and rendering the login interface
 */
async function init() {
    loadUserDataBase()
    renderLogIn();
    loadLogInInfo();
}


/**
 * Hide the signup html code on login interface and rendering the signup interface
 */
function renderSignUp() {
    document.getElementById('sign-up-box').classList.add('d-none')
    let logInBox = document.getElementById('login-container');
    logInBox.innerHTML = '';
    logInBox.innerHTML += renderSignUpHtml();
}


/**
 * Show the signup html code and rendering the login interface
 */
function renderLogIn() {
    document.getElementById('sign-up-box').classList.remove('d-none')
    let logInBox = document.getElementById('login-container');
    logInBox.innerHTML = '';
    logInBox.innerHTML += renderLogInHtml();
    let signUpBox = document.getElementById('sign-up-box');
    signUpBox.innerHTML = renderSignUpBoxHtml();
}


/**
 * help function to get the values from HTML Elements
 * @param {string} id - the Id of the HTML element.
 * @returns The value of the element.
 */
function getValueFromId(id) {
    return document.getElementById(id).value
}


/**
 * help function that returns The ID of the element.
 * @param {string} id - the Id of the HTML element.
 */
function getHtmlElementById(id) {
    return document.getElementById(id);
}


/**
 * manage the user login process, true login succesful, false show the password dont match box.
 */
async function login() {
    let email = getValueFromId('email');
    let password = getValueFromId('password');
    rememberLogInInformation();
    let searchedUser = userDataBase.find((user) => user['email'] === email && user['password'] === password);
    if (searchedUser) {
        localStorage.setItem('userId', searchedUser.id);
        window.location.href = 'welcome.html';
    } else {
      document.getElementById('password-dont-match').classList.remove('d-none')
      document.getElementById('password').classList.add('pw-dont-match-border')
    }
}


/**
 * saves the guest account id in local storage and redirects to the demo interface.
 * @param {string} guestId - the guest ID (guest account) from user datebase.
 */
function guestLogin(guestId) {
    resetLogInForm()
    localStorage.setItem('userId', guestId);
    window.location.href = 'welcome.html';
}


/**
 * reset Log in Form to avoid the form onsubmit (only for guest login)
 */
function resetLogInForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}


/**
 * Checks if a user is logged in by verifying the presence of a user ID in local storage.
 * If a user is logged in, it loads the user object. If not, it redirects the user to the index page.
 */
async function checkUserloggedIn() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        await loadUserObject(userId);
    } else {
        window.location.href = 'index.html';
    }
}


/**
 * Loads the user object corresponding to the provided user ID.
 * @param {string} userId - The ID of the user to load.
 */
async function loadUserObject(userId) {
    try {
        const userDataBase = JSON.parse(await getItem('userDataBase'));
        userObject = userDataBase.find((user) => user.id.toString() === userId);
        getInitials();
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * removes the user ID from local storage on logout
 */
function userLogout() {
    localStorage.removeItem('userId')
}


/**
 * Highlights the navigation element with the specified ID and removes highlight from other navigation elements.
 * @param {string} id - The ID of the navigation element to highlight.
 */
function navigationHighlight(id) {
    let navigationElements = document.getElementById('navigation').children;
    for (let i = 0; i < navigationElements.length; i++) {
        navigationElements[i].classList.remove('navbox-bg-color')
        }
    document.getElementById(id).classList.add('navbox-bg-color');
}


/**
 * Toggles the visibility of the user menu (top right) with a global variable.
 */
function showMenu() {
    if (menuEnabled) {
        toggleHiddenBox();
        setTimeout(animateMenuSlider, 125)
        menuEnabled = false;
    } else {
        animateMenuSlider()
        setTimeout(toggleHiddenBox, 125)
        menuEnabled = true;
    }
}


/**
 * Toggles the visibility of the hidden box element.
 */
function toggleHiddenBox() {
    document.getElementById('hidden-box').classList.toggle('d-none');
}


/**
 * Toggles the visibility of the user menu slider.
 */
function animateMenuSlider() {
    document.getElementById('user-menu').classList.toggle('show-menu');
}


/**
 * Initializes the privacy settings.
 */
async function initPrivacy() {
    await includeHTML();
    checkLocalStorage()
    deleteDivElement('user-circle')
}


/**
 * Checks if the user ID exists in the local storage and deletes the navigation div element if it doesn't.
 */
function checkLocalStorage() {
    let localStorageExist = localStorage.getItem('userId')
    if (!localStorageExist) {
        deleteDivElement('navigation')
    } 
}


/**
 * Deletes the HTML div element with the specified ID.
 * @param {string} divId - The ID of the HTML div element to delete. 
 */
function deleteDivElement(divId) {
    document.getElementById(divId).remove();
}


/**
 * links back to the last visited URL
 */
function linkToPreviousPage() {
    history.back()
}


/**
 * Retrieves the initials of the user's name and sets them in the user circle element (top right).
 */
async function getInitials() {
    let initials = ''
    let splittedName = userObject.name.split(' ')
    for (let i = 0; i < splittedName.length; i++) {
        initials += splittedName[i].charAt(0).toUpperCase();
    }  
    document.getElementById('user-circle').innerHTML = `${initials}`
}


/**
 * changes the the icon image, if user accepted the privacy policy
 */
function changeCheckboxStatus() {
    if (checkboxChecked) {
        document.getElementById('checkbox-img').src = "./assets/img/checked.png"
        checkboxChecked = false;
    } else {
        document.getElementById('checkbox-img').src = "./assets/img/unchecked.png"
        checkboxChecked = true;
    }
}


/**
 * If Remember me checkbox is checked, the data is saved to local storage
 */
function rememberLogInInformation() {
    let checkState = document.getElementById('checkbox').checked;
    let email = getValueFromId('email');
    let password = encryptPassword(getValueFromId('password'))
    if (checkState) {
        localStorage.setItem('userMail', email)
        localStorage.setItem('password', password)
    } 
}


/**
 * loads login information from local storage if exists
 */
function loadLogInInfo() {
    let email = localStorage.getItem('userMail')
    let password = decryptPassword(localStorage.getItem('password'))
    if (email && password) {
        document.getElementById('email').value = email
        document.getElementById('password').value = password
    }
}


/**
 * encrypts user password
 * @param {string} password - user password information
 * @returns enrypted password information
 */
function encryptPassword(password) {
    return btoa(password);
}


/**
 * decrypt user password
 * @param {string} encryptedPassword - enrypted userpassword
 * @returns decrypted password information
 */
function decryptPassword(encryptedPassword) {
    return atob(encryptedPassword);
}


/**
 * rendering the login HTML code in the index.html file
 * @returns HTML Code
 */
function renderLogInHtml() {
    return /*html*/`
        <h1>Log in</h1>
        <div class="divider-line"></div>
        <form class="form-width" onsubmit="login(); return false">
            <div class="input-container" >
                <input required type="email" id="email" placeholder="Email" class="login-input" value=''>
                <img src="./assets/img/mail.png" alt="mail">
            </div>
            <div class="input-container">
                <input 
                required
                value = ''
                type="password" 
                id="password" 
                placeholder="Password" 
                class="login-input" 
                minlength="8" 
                autocomplete="off" 
                onkeyup="changePasswordIcon('password', 'img-login-pw')" 
                onclick="hideDontMatchBox('password', 'password')">
                <img id="img-login-pw" src="./assets/img/lock.png" alt="password" onclick="showPassword('password', 'img-login-pw')">
                <div id="password-dont-match" class="d-none">
                    <span class="dont-match">Wrong password Ups! Try again.</span>
                </div>
            </div>
            <div id="checkbox-container">
                <label for="checkbox" class="checkbox-label">
                <img src="./assets/img/unchecked.png" id="checkbox-img">
                <input type="checkbox" id="checkbox" class="checkbox" onclick="changeCheckboxStatus()">
                Remember me</label>
            </div>
            <div class="button-box">
                <button class="button btn-login">Log in</button>
                <button class="button btn-gust-login" onclick="guestLogin('8')">Guest Log in</button>
                </div>
        </form>
    `
}


/**
 * rendering the signup HTML button on the login 
 * @returns HTML Code
 */
function renderSignUpBoxHtml() {
    return /*html*/`
        <h4>Not a Join user?</h4>
        <button class="button btn-login btn-signup" onclick="renderSignUp()">Sign up</button>
    `
}


/**
 * rendering the signup HTML code in the index.html file
 * @returns HTML Code
 */
function renderSignUpHtml() {
    return /*html*/`
    <img src="./assets/img/arrow-left-line.png" class="arrow-left-line" onclick="renderLogIn()">
    <h1>Sign up</h1>
    <div class="divider-line"></div>
    <form class="form-width" onsubmit="registerUser(); return false">
        <div class="input-container">
            <input required id="name" type="text" placeholder="Name" class="login-input" minlength="2">
            <img src="./assets/img/person.png" alt="person">
        </div>
        <div class="input-container">
            <input required id="email-sign" type="email" placeholder="Email" class="login-input">
            <img src="./assets/img/mail.png" alt="mail">
        </div>
        <div class="input-container">
            <input  
            id="password-signup" type="password" placeholder="Password" class="login-input" autocomplete="off"
            minlength="8" pattern="^(?=.*[A-Z]).{8,}$" title="At least 8 chracters and 1 capital letter are required" required
            onkeyup="changePasswordIcon('password-signup', 'pw-signup-img')"
            onclick="hideDontMatchBox('password-signup', 'password-proof')"
            >
            <img src="./assets/img/lock.png" alt="password" id="pw-signup-img" onclick="showPassword('password-signup', 'pw-signup-img')">
        </div>
        <div class="input-container">
            <input 
            required id="password-proof" type="password" placeholder="Confirm Password" class="login-input" autocomplete="off" 
            minlength="8" required 
            onkeyup="changePasswordIcon('password-proof', 'pw-proof-lock-img')"
            onclick="hideDontMatchBox('password-proof', 'password-proof')"
            >
            <img src="./assets/img/lock.png" alt="password" id="pw-proof-lock-img" onclick="showPasswordProof('password-proof', 'pw-proof-lock-img')">
            <div id="password-dont-match" class="d-none">
                <span class="dont-match">Your Passwords don't match. Try again.</span>
            </div>
        </div>
        <div id="checkbox-container" class="align-center">
            <label for="checkbox" class="checkbox-label j-center">
                <img src="./assets/img/unchecked.png" id="checkbox-img">
                <input type="checkbox" id="checkbox" class="checkbox" onclick="changeCheckboxStatus()">I Accept the Privacy policy
            </label>
        </div>
        <div class="button-box">
            <button class="button btn-login">Sign up</button>
        </div>
    </form>
    `
}