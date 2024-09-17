/**
 * Sorts and displays the contacts list. Contacts are sorted alphabetically
 * by name, with each contact's details formatted and added to the display.
 */
function renderContacts() {
  const sortedContacts = contacts.sort((a, b) => {
    if (!a.name || !b.name) {return 0;}
    return a.name.localeCompare(b.name);
  });
  const contactsContainer = document.getElementById("contactsList");
  let content = "";
  let currentLetter = "";
  for (let i = 0; i < sortedContacts.length; i++) {
    const contact = sortedContacts[i];
    if (contact.name) {
      const { firstLetter, secondLetter } = extractInitials(contact);
      if (currentLetter !== firstLetter) {
        currentLetter = firstLetter;
        content += generateHeadline(currentLetter);
      }
      content += generateContacts(contact.email, contact.name, secondLetter, firstLetter, i, contact.bgrColor);
    } 
  }
  contactsContainer.innerHTML = content;
}

/**
 * Applies a unique background color to the UI representation of the selected contact
 * and adjusts UI elements for detailed view, based on screen size.
 * @param {number} i - Index of the selected contact.
 */
function openContact(i) {
  if (!contactStatus) {
    closeContactList();
    showContact(i);
    addBgrColorContact(i);
    sloganContainerDesktop.style.display = "none";
  }
  if(screenSize<=1440) {
    contactStatus = true;
  }
}

/**
 * Generates the UI with details of the selected contact, including name, phone, and email,
 * and adjusts the display to focus on this contact.
 * @param {number} i - Index of the contact to display.
 */
function showContact(i) {
  contactIndex = i;
  contactOpenedStatus = true;
  let content = document.getElementById("contact");
  content.innerHTML = "";
  let contact = contacts[i];
  const { firstLetter, secondLetter } = extractInitials(contact);
  const name = contact.name;
  const phone = contact.phone;
  const email = contact.email;
  const bgrColor = contact.bgrColor;
  content.innerHTML += generateContact(firstLetter,secondLetter,name,phone,email,i,bgrColor);
}

/**
 * Applies a unique background color to the UI representation of the selected contact
 * and adjusts UI elements for detailed view, based on screen size.
 * @param {number} i - Index of the selected contact.
 */
function addBgrColorContact(i) {
  if (screenSize > 1440) {
    document.getElementById("sloganContainerDesktop").classList.add("d-none");
    if (lastClickedContactId !== null) {
      let lastContactElement = document.getElementById(lastClickedContactId);
      if (lastContactElement) {
        lastContactElement.classList.remove("contact-background-color-clicked");
      }
    }
    let contactElement = document.getElementById(i.toString());
    if (contactElement) {
      contactElement.classList.add("contact-background-color-clicked");
      lastClickedContactId = i.toString();
    }
  }
}

/**
 * Extracts the first letter of the first and last name from a given contact's name.
 * @param {Object} contact - The contact object, expected to contain a 'name' property.
 * @returns {Object} An object containing the first letters of the first and last name.
 */
function extractInitials(contact) {
  const firstLetter = contact.name[0].toUpperCase();
  const parts = contact.name.split(" ");
  let secondLetter = "";
  if (parts.length > 1) {
    const lastName = parts[parts.length - 1];
    secondLetter = lastName[0].toUpperCase();
  }
  firstLetterGlobal = firstLetter;
  secondLetterGlobal = secondLetter;
  return { firstLetter, secondLetter };
}

/* Templates*/

/**
 * Generates a template string for the contact icon in the edit card.
 * @param {string} bgrColor - The background color of the contact icon.
 * @returns {string} HTML string representing the contact icon.
 */
function generateIconForEditCardTemplate(bgrColor) {
    return /*HTML*/ `
        <div class="contact-header" style="background-color: ${bgrColor};">
          <span>${firstLetterGlobal}${secondLetterGlobal}</span>
        </div>
      `;
  }
  
  /**
   * Generates a headline for the contacts list based on the current letter being processed.
   * @param {string} currentLetter - The current letter used to group contacts.
   * @returns {string} HTML string representing a section headline in the contacts list.
   */
  function generateHeadline(currentLetter) {
    return /*HTML*/ `
      <div>
        <h4 class="contact-headline-letter">${currentLetter}</h4>
        <div class="underline"></div>
      </div>
    `;
  }
  
  /**
   * Generates HTML content for displaying a single contact in the contacts list.
   * @param {string} email - The email of the contact.
   * @param {string} name - The name of the contact.
   * @param {string} secondLetter - The first letter of the contact's last name.
   * @param {string} firstLetter - The first letter of the contact's first name.
   * @param {number} i - The index of the contact in the contacts array.
   * @param {string} bgrColor - The background color for the contact's icon.
   * @returns {string} HTML string representing a single contact in the list.
   */
  function generateContacts(email, name, secondLetter, firstLetter, i, bgrColor) {
    return /*HTML*/ `
        <div class="contact" id="${i}" onclick="openContact(${i})">
            <div class="contact-header height-width-42" style="background-color: ${bgrColor};">
                <span>${firstLetter}${secondLetter}</span>
            </div> 
            <div class="contact-info">
                <div class="name">${name}</div>
                <div class="email-contact">${email}</div>
            </div>
        </div>
        `;
  }
  
  /**
   * Generates HTML content for displaying detailed information about a single contact.
   * @param {string} firstLetter - The first letter of the contact's first name.
   * @param {string} secondLetter - The first letter of the contact's last name.
   * @param {string} name - The full name of the contact.
   * @param {string} phone - The phone number of the contact.
   * @param {string} email - The email address of the contact.
   * @param {number} i - The index of the contact in the contacts array.
   * @param {string} bgrColor - The background color for the contact's icon.
   * @returns {string} HTML string representing detailed information about the contact.
   */
  function generateContact(
    firstLetter,
    secondLetter,
    name,
    phone,
    email,
    i,
    bgrColor
  ) {
    return /*HTML*/ `
   <div class="contact-container" id="${i}">
      <div class="back-to-contacts-img">
        <img onclick="closeContact()" src="assets/img/back.png" alt="" />
      </div>
      <div></div>
      <div class="slogan-show-contact">
        <h1>Contacts</h1>
        <div class="contact-line-desktop" style="display: none"></div>
        <span class="slogan-contact">Better with a Team</span>
        <div class="contact-underline"></div>
      </div>

      <div class="name-container">
        <div
          class="contact-header contact-opened"
          style="background-color: ${bgrColor};"
        >
          <span><h3>${firstLetter}${secondLetter}</h3></span>
        </div>
        <div>
          <div id="contactOpenedName" class="name">
            <h2>${name}</h2>
          </div>
          <div class="edit-delete-desktop" id="editDeleteDesktop">
            <div
              onclick="openEditContactCard(${contactIndex})"
              class="edit-image-contact"
            >
              <img src="assets/img/edit-task.png" alt="" />Edit
            </div>
            <div class="center-img-text" onclick="deleteContact()">
              <img src="assets/img/delete.png" alt="" /> Delete
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4>Contact Information</h4>
        <p class="email-contact-opened">Email</p>
        <div id="contactOpenedEmail" class="email-contact">${email}</div>
        <p class="email-contact-opened">Phone</p>
        <div id="contactOpenedPhone" class="phone-contact">${phone}</div>
      </div>
      <div
        id="editContactImg"
        class="editContactImg"
        onclick="showEditOptions()"
      >
        <img src="assets/img/more_vert.png" alt="" />
      </div>
      <div class="edit-contacts-options" id="editContactOptions">
        <div
          onclick="openEditContactCard(${contactIndex})"
          class="edit-image-contact"
        >
          <img src="assets/img/edit-task.png" alt="" />Edit
        </div>
        <div onclick="deleteContact()">
          <img src="assets/img/delete.png" alt="" />Delete
        </div>
      </div>
    </div>
      `;
  }