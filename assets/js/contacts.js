let contacts = [];
let contactStatus = false;
let showEditOptionsStatus;
let contactOpenedStatus = false;
let contactIndex;
let userDataBase;
let lastClickedContactId = null;
let screenSize;
let firstLetterGlobal;
let secondLetterGlobal;

/**
 * Initializes the contacts page. It renders contacts, includes additional HTML,
 * highlights the current page in the navigation, checks the user login status,
 * and determines the current screen size.
 */
async function initContacts() {
  renderContacts();
  await includeHTML();
  navigationHighlight("contact-link");
  checkUserloggedIn();
  loadContacts();
  getScreenSize();
}

/**
 * Fetches and loads contacts from the user database. parsing the
 * data into the contacts array. If the fetch fails, logs an error and sets
 * the contacts array to empty.
 */
async function loadContacts() {
  try {
    const result = await getItem("userDataBase");
    userDataBase = JSON.parse(result);
    contacts = userDataBase[userObject["id"]].contacts;
  } catch (e) {
    console.error("Loading error:", e);
    contacts = [];
  }
  addMyContactToContacts();
  renderContacts();
}

/**
 * Manages the creation of a new contact. Disables the create button to prevent
 * double submissions, calls `addValueToContact` to add the contact, refreshes
 * the contact list display, closes the add contact form, clears the form fields,
 * and triggers a creation animation.
 */
async function createContact() {
  createContactBtn.disabled = true;
  addValueToContact();
  renderContacts();
  closeAddContactCard();
  clearForm();
  createContactAnimation();
}

/**
 * Removes the currently selected contact from the contacts list and updates
 * the database, then closes the contact and edit views.
 */
async function deleteContact() {
  contacts.splice(contactIndex, 1);
  await setItem("userDataBase", JSON.stringify(userDataBase));
  renderContacts();
  closeContact();
  closeEditContactCard();
}

/**
 * Saves the updated contact information to the contacts list and database,
 * rerenders the contacts list, and displays the updated contact's details.
 */
async function updateContact() {
  let newName = document.getElementById("edit-name").value;
  let newEmail = document.getElementById("edit-email").value;
  let newPhone = document.getElementById("edit-phone").value;
  contacts[contactIndex] = { ...contacts[contactIndex], name: newName, email: newEmail, phone: newPhone };
  await setItem("userDataBase", JSON.stringify(userDataBase));
  renderContacts();
  let newIndex = contacts.findIndex(contact => contact.name === newName && contact.email === newEmail);
  contactIndex = newIndex;
  showContact(newIndex);
  closeEditContactCard();
}

/**
 * Adds user's contact to the list if not already present.
 * 
 * Checks for an existing contact with the same email and name. If not found, creates a new contact
 * with these details and a unique color, then adds to the contacts list and updates the database.
 * 
 */
async function addMyContactToContacts() {
  if(userDataBase[userObject["id"]].name !== "Guest"){
    const index = contacts.findIndex(contact => 
    contact.email === userDataBase[userObject["id"]].email ||
    contact.name === userDataBase[userObject["id"]].name ||
    contact.phone === userDataBase[userObject["id"]].phone 
  );
  if (index === -1) {
    const myDetails = {
    id: userObject["id"], name: userDataBase[userObject["id"]].name, 
    email: userDataBase[userObject["id"]].email, 
    phone: "",bgrColor: "#2A3E59",};
    userDataBase[userObject["id"]].contacts.push(myDetails);
    await setItem("userDataBase", JSON.stringify(userDataBase));
  }}}

/**
 * Adds a new contact to the list and updates the database. user input,
 * creates a new contact object with a unique background color, and saves
 * the updated contacts list to the remote database.
 */
 async function addValueToContact() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  const bgrColor = getRandomColor();
  let contact = {name: name, email: email, phone: phone, bgrColor: bgrColor,};
  userDataBase[userObject["id"]].contacts.push(contact);
  await setItem("userDataBase", JSON.stringify(userDataBase));
}

/**
 * Activates a visual animation to indicate the successful addition of a contact.
 */
function createContactAnimation() {
  document.getElementById("centerAddContactAnimation").classList.add("active");
  document.getElementById("createContactAnimation").classList.add("active");
  setTimeout(function () {
    document.getElementById("centerAddContactAnimation").classList.remove("active");
    document.getElementById("createContactAnimation").classList.remove("active");
  }, 2500);
}

/**
 * Clears the input fields in the contact form. Used after successfully adding a new contact.
 */
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

/**
 * Generates a random hexadecimal color string. Used to assign unique colors to
 * contact icons.
 * @returns {string} Hexadecimal color string.
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Closes the contact list view and prepares the UI for displaying a single contact's details.
 */
function closeContactList() {
  contactsList.style.display = "none";
  addContactImg.style.display = "none";
  contact.style.display = "flex";
  contact.style.backgroundColor = "#F6F7F8";
}

window.addEventListener("resize", getScreenSize);

/**
 * Dynamically updates the `screenSize` variable to reflect the current window width.
 * This supports responsive design decisions within the application.
 */

function getScreenSize() {
  screenSize = window.innerWidth;
}

/**
 * Resets the contact view UI to its default state, showing the contacts list.
 */
function closeContactStyles() {
  contactsList.style.display = "block";
  addContactImg.style.display = "flex";
  contact.style.display = "none";
  contact.style.backgroundColor = "#FFFFFF";
  document.getElementById(contactIndex.toString()).classList.remove('contact-background-color-clicked');
  sloganContainerDesktop.style.display = "flex";
}

/**
 * Closes the single contact view and returns to the contact list view.
 */
function closeContact() {
  if (contactStatus || screenSize <= 1440 || screenSize >= 1440) {
   closeContactStyles();
  }
  if (screenSize > 1440) {
    document.getElementById("sloganContainerDesktop").classList.remove("d-none");
  }
  contactStatus = false;
  contactOpenedStatus = false;
}

/**
 * Toggles the visibility of options for editing and deleting a selected contact
 */
function showEditOptions() {
  let editOptions = document.getElementById("editContactOptions");
  editOptions.classList.add("edit-contacts-options-active");
  editContactImg.style.display = "none";
  showEditOptionsStatus = false;
}

/**
 * Closes the edit contact form and resets the UI to its default editing state,
 * hiding the edit options and overlay.
 */
function closeEditContactCard() {
  document.getElementById("editContactCard").classList.remove("active");
  editContactCard.classList.remove("active");
  editContactOptions.style.display = "flex";
  setTimeout(() => {
    centerEditCard.classList.remove("active");
    editContactImg.classList.add("flex");
    overlayContacts.style.display = "none";
  }, 500);
}

/**
 * Opens the edit contact form for a specified contact, allowing the user to
 * modify contact details. Prepares and displays the form with current contact
 * information pre-filled.
 * @param {number} contactIndex - Index of the contact being edited.
 */
function openEditContactCard(contactIndex) {
  document.getElementById("centerEditCard").classList.add("active");
  document.getElementById("editContactCard").classList.add("active");
  editContactOptions.style.display = "none";
  addContactImg.style.display = "none";
  overlayContacts.style.display = "block";
  document.getElementById("edit-name").value = contacts[contactIndex].name;
  document.getElementById("edit-email").value = contacts[contactIndex].email;
  document.getElementById("edit-phone").value = contacts[contactIndex].phone;
  generateIconForEditCard();
}

/**
 * Generates the HTML content for the edit contact card icon, reflecting the
 * contact's assigned background color.
 */
function generateIconForEditCard() {
  const bgrColor = contacts[contactIndex].bgrColor;
  const iconContainer = document.getElementById('editCardIcon');
  if (iconContainer) {
    iconContainer.innerHTML = '';
    iconContainer.innerHTML += generateIconForEditCardTemplate(bgrColor);
  }
}

/**
 * Opens the UI for adding a new contact, preparing and displaying a blank
 * form for contact information entry.
 */
function openAddContact() {
  document.getElementById("center-add-card").classList.add("active");
  document.getElementById("addContactCard").classList.add("active");
  addContactImg.style.display = "none";
  overlayContacts.style.display = "block";
}

/**
 * Closes the add contact card and resets to the default state
 */
function closeAddContactCard() {
  const addContactCard = document.getElementById("addContactCard");
  const centerAddCard = document.getElementById("center-add-card");
  addContactCard.classList.remove("active");
  setTimeout(() => {
    centerAddCard.classList.remove("active");
    addContactImg.style.display = "flex";
    overlayContacts.style.display = "none";
  }, 500);
}

/**
 * Closes the edit contact options if the user clicks outside of the edit contact
 * options area
 */
document.addEventListener("click", function (event) {
  if (contactOpenedStatus) {
    let isClickInsideOptions = document.getElementById("editContactOptions").contains(event.target);
    let isClickInsideImg = document.getElementById("editContactImg").contains(event.target);
    if ((editContactOptions.style.display = "flex" && !isClickInsideImg)) {
      if (!isClickInsideOptions && !showEditOptionsStatus) {
        document.getElementById("editContactOptions").classList.remove("edit-contacts-options-active");
        editContactImg.style.display = "flex";
        showEditOptionsStatus = true;
      }
    }
  }
});

