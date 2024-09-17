/**
 * function, reacts on clickevent. Closes Menu (top-right) if clicking outside the open menu container
 * @param {MouseEvent} event - click event
 */
document.addEventListener("click", function(event) {
    let bodyBackground = event.target;
    let menuContainer = document.getElementById("user-menu");
    let userContainer = document.getElementById("user-circle");
    if (!menuContainer.contains(bodyBackground) && !userContainer.contains(bodyBackground)) {
        if (!menuEnabled)
            showMenu();
    }
});