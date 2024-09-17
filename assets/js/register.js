let userDataBase = [];

let id;
let showPwEnabled = true;
let showPwProoEnabled = true;


/**
 * This function load the User Database from Backend Server
 */
async function loadUserDataBase() {
    try {
        userDataBase = JSON.parse(await getItem('userDataBase'));
    } catch(e) {
        console.error('Loading error:', e)
    }
}


/**
 * Checks whether the entered password matches the confirmation at registration.
 * @returns True, if the password and confirmation match, otherwise false to abort the registration process
 */
function passworVerification() {
    let password = getValueFromId('password-signup');
    let confirmPassword = getValueFromId('password-proof')
    if (password !== confirmPassword) {
        document.getElementById('password-dont-match').classList.remove('d-none')
        document.getElementById('password-proof').classList.add('pw-dont-match-border')
        return false;
    }
    return true;
}


/**
 * Hides the "Password does not match" notification box and removes the red border around the input field.
 * @param {string} id - The ID of the element on which a click event will be added to hide the notification box.
 * @param {string} redBorderId - The ID of the element that has a red border and is being removed.
 */
function hideDontMatchBox(id, redBorderId) {
    let selectedElement = getHtmlElementById(id)
    let redBorderInput = getHtmlElementById(redBorderId)
    selectedElement.addEventListener('click', function() {
        document.getElementById('password-dont-match').classList.add('d-none');
        document.getElementById(redBorderId).classList.remove('pw-dont-match-border');
    })
}


/**
 * changes the Icon inside the password input based on the current state
 * @param {string} pwId - the Id from the password input
 * @param {string} imgId - the ID from the image, by changing the password icon
 */
function changePasswordIcon(pwId, imgId) {
    let password = getValueFromId(pwId);
    let element = getHtmlElementById(imgId)
    let passwordType = getHtmlElementById(pwId)
    if (password.length >= 1 && passwordType.type === "password") {
        element.src = "./assets/img/visibility_off.png"
    }    
    if (password.length === 0) { 
        element.src = "./assets/img/lock.png"
        passwordType.type = "password";
        showPwEnabled = true;
        showPwProoEnabled = true;
    }
}


/**
 * Toggles the password visibility from the FIRST password input and changes the password icon
 * @param {string} pwId - the Id from the password input
 * @param {string} imgId - the ID from the image, by changing the password icon
 */
function showPassword(pwId, imgId) {
    let element = getHtmlElementById(imgId)
    if (showPwEnabled) {
        element.src = "./assets/img/visibility.png";
        showPwEnabled = false;
        togglePassword(pwId);
    } else {
        element.src = "./assets/img/visibility_off.png";
        showPwEnabled = true;
        togglePassword(pwId);
    }
}


/**
 * Toggles the password visibility from the SECOND passwort input and changes the password icon (to Avoid the toggle state from first password input)
 * @param {string} pwId - the Id from the password input
 * @param {string} imgId - the ID from the image, by changing the password icon
 */
function showPasswordProof(pwId, imgId) {
    let element = getHtmlElementById(imgId)
    if (showPwProoEnabled) {
        element.src = "./assets/img/visibility.png";
        showPwProoEnabled = false;
        togglePassword(pwId);
    } else {
        element.src = "./assets/img/visibility_off.png";
        showPwProoEnabled = true;
        togglePassword(pwId);
    }
}


/**
 * Changes the Type from the input Element to show the password for user
 * @param {string} pwId - the Id from the password input
 */
function togglePassword(pwId) {
    let passwordInput = getHtmlElementById(pwId)
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }


/**
 * Registers a new user or aborts the process if all requirements are not met
 */
async function registerUser() {
    if (!passworVerification()) {
        return;
    }

    let emailSign = getValueFromId('email-sign');
    let emailExists = userDataBase.find(user => user['email'] === emailSign);
    if (emailExists) {
        alert('E-Mail-Adresse bereits registriert');
    } else {
        id = userDataBase[userDataBase.length - 1]['id'];
        let user = {
            "id": id += 1,
            "name": getValueFromId('name'),
            "email": emailSign,
            "password": getValueFromId('password-signup'),
            "tasks": [],
            "contacts": [],
        };
        userDataBase.push(user);
        await setItem('userDataBase', JSON.stringify(userDataBase));
        resetForm();
        renderRegSuccesInfo();
    }
}


/**
 * Renders the registration succes information on the page.
 */
function renderRegSuccesInfo() {
    let content = document.getElementById('content');
    content.innerHTML += renderRegSuccesInfoHtml();
    setTimeout(FadeInOutRegSuccesBox, 250);
}


/**
 * Fades in and out the registration succes box and triggers the  render for the login after a delay
 */
function FadeInOutRegSuccesBox() {
    document.getElementById('registration-succes-box').classList.add('show-reg-box')
    setTimeout(removeQuickinfo, 2000); 
    setTimeout(renderLogIn, 2000)
}


/**
 * removes the empty "registration succesful" animation box
 */
function removeQuickinfo() {
    let div = document.getElementById('animation-box')
    div.remove()
}


/**
 * resets als inputs on the registration form
 */
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email-sign').value = '';
    document.getElementById('password-signup').value = '';
    document.getElementById('password-proof').value = '';
}


/**
 * return the HTML code for "registration succesful"
 * @returns - the HTML Code
 */
function renderRegSuccesInfoHtml() {
    return /*html*/ `
        <div id="animation-box" class="animation-box">
            <div id="registration-succes-box" class="registration-succes-box">
                <h4>You Signed Up successfully</h4>
            </div>
        </div>
    `;
}



