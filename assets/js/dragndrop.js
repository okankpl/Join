let draggedCard = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

/**
 * Handles the drag start event for a card element.
 * @param {Event} event - The drag start event.
 */
function dragStart(event) {
    draggedCard = event.target;
    event.dataTransfer.setData("text", event.target.id);
    event.target.style.transform = "rotate(5deg)";
}

/**
 * Removes the placeholder card from the DOM.
 */
function removePlaceholderCard() {
    const placeholderCard = document.querySelector(".placeholder-card");
    if (placeholderCard) {
        placeholderCard.remove();
    }
}

/**
 * The timer for touch long press.
 * @type {number}
 */
let dragTimer;

/**
 * Indicates whether the touch has moved.
 * @type {boolean}
 */
let touchMoved = false;

/**
 * Handles the touch start event for the task cards.
 * @param {TouchEvent} event - The touch event object.
 */
function handleTouchStart(event) {
    const touchedCard = event.target.closest(".task-card");
    if (!touchedCard) return;
    dragTimer = setTimeout(() => {
        event.preventDefault();
        setupDraggedCard(touchedCard, event.touches[0]);
        document.body.style.overflow = "hidden";
    }, 200);
    touchMoved = false;
}

/**
 * Handles the touch move event for dragging and dropping cards.
 *
 * @param {TouchEvent} event - The touch move event.
 */
function handleTouchMove(event) {
    touchMoved = true;
    if (!draggedCard) return;
    if (event.cancelable) {
        event.preventDefault();
    }
    const touch = event.touches[0];
    moveAt(touch.pageX, touch.pageY, touch.clientX, touch.clientY);
    const elementUnderTouch = document.elementFromPoint(
        touch.clientX,
        touch.clientY
    );
    if (elementUnderTouch) {
        updatePlaceholderCard(
            elementUnderTouch.closest(".task-cards-container")
        );
    }
}

/**
 * Handles the touch cancel event.
 *
 * @param {TouchEvent} event - The touch cancel event object.
 */
function handleTouchCancel(event) {
    if (!draggedCard) return;
    removePlaceholderCard();
    document.body.style.overflow = "auto";
    draggedCard.remove();
    draggedCard = null;
}

document.addEventListener("touchcancel", handleTouchCancel);

window.addEventListener("touchmove", function (event) {
    /**
     * Represents the touch event object.
     * @type {Touch}
     */
    const touch = event.touches[0];
    const threshold = 50;
    const scrollAmount = 10;

    if (touch.clientY < threshold) {
        window.scrollBy(0, -scrollAmount);
    } else if (window.innerHeight - touch.clientY < threshold) {
        window.scrollBy(0, scrollAmount);
    }
});

/**
 * Handles the touch end event for drag and drop functionality.
 * @param {TouchEvent} event - The touch end event.
 * @returns {Promise<void>} - A promise that resolves when the event handling is complete.
 */
async function handleTouchEnd(event) {
    clearTimeout(dragTimer);
    if (!draggedCard || !touchMoved) return;
    const originalCard = document.getElementById(
        draggedCard.dataset.originalCard
    );
    resetOriginalCard(originalCard);
    removePlaceholderCard();
    document.body.style.overflow = "auto";
    await handleDrop(event.changedTouches[0], originalCard);
    draggedCard.remove();
    draggedCard = null;
}

/**
 * Sets up a dragged card by cloning the touched card, assigning styles, and appending it to the document body.
 * @param {HTMLElement} touchedCard - The card element that was touched.
 * @param {TouchEvent} touch - The touch event object.
 */
function setupDraggedCard(touchedCard, touch) {
    draggedCard = touchedCard.cloneNode(true);
    Object.assign(draggedCard.style, {
        position: "fixed",
        zIndex: 0,
        opacity: 0.8,
    });
    document.body.appendChild(draggedCard);
    touchOffsetX = touch.clientX - touchedCard.getBoundingClientRect().left;
    touchOffsetY = touch.clientY - touchedCard.getBoundingClientRect().top;

    draggedCard.style.left = `${
        touchedCard.getBoundingClientRect().left + window.scrollX
    }px`;
    draggedCard.style.top = `${
        touchedCard.getBoundingClientRect().top + window.scrollY
    }px`;

    moveAt(touch.pageX, touch.pageY);
    Object.assign(touchedCard.style, { transform: "rotate(5deg)", opacity: 1 });
    draggedCard.dataset.originalCard = touchedCard.id;
    draggedCard.dataset.originalContainer = touchedCard.parentNode.id;
}

/**
 * Resets the original card by clearing the transform and opacity styles.
 * @param {HTMLElement} originalCard - The original card element to be reset.
 */
function resetOriginalCard(originalCard) {
    originalCard.style.transform = "";
    originalCard.style.opacity = 1;
}

/**
 * Handles the drop event for drag and drop functionality.
 * @param {TouchEvent} touch - The touch event object.
 * @param {HTMLElement} originalCard - The original card element being dragged.
 * @returns {Promise<void>} - A promise that resolves when the drop event is handled.
 */
async function handleDrop(touch, originalCard) {
    let taskCardsContainer = document
        .elementFromPoint(touch.clientX, touch.clientY)
        .closest(".task-cards-container");
    if (!taskCardsContainer) {
        taskCardsContainer = getContainerFromTouch(touch);
    }
    if (
        taskCardsContainer &&
        taskCardsContainer.id !== draggedCard.dataset.originalContainer
    ) {
        taskCardsContainer.appendChild(originalCard);
        await updateTaskStatus(originalCard.id, taskCardsContainer.id);
        document
            .querySelectorAll(".task-cards-container")
            .forEach(updateNoTasksMessage);
    } else {
        const originalContainer = document.getElementById(
            draggedCard.dataset.originalContainer
        );
        if (originalContainer) {
            originalContainer.appendChild(originalCard);
        }
    }
}

/**
 * Retrieves the container element that contains the given touch coordinates.
 *
 * @param {Touch} touch - The touch object containing the clientX and clientY coordinates.
 * @returns {Element|null} - The container element that contains the touch coordinates, or null if no container is found.
 */
function getContainerFromTouch(touch) {
    const containers = document.querySelectorAll(".task-cards-container");
    for (const container of containers) {
        const rect = container.getBoundingClientRect();
        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        ) {
            return container;
        }
    }
    return null;
}

/**
 * Updates the status of a task and saves it to the user's database.
 *
 * @param {string} originalCardId - The ID of the original task card.
 * @param {string} containerId - The ID of the container where the task is moved to.
 * @returns {Promise<void>} - A promise that resolves when the task status is updated and saved successfully.
 */
async function updateTaskStatus(originalCardId, containerId) {
    const task = userObject.tasks.find(
        (t) => t.id.toString() === originalCardId
    );
    if (!task) return;
    task.status = containerId;
    try {
        const userDataBase = JSON.parse(await getItem("userDataBase"));
        const userIndex = userDataBase.findIndex(
            (user) => user.id.toString() === userObject.id.toString()
        );
        if (userIndex !== -1) {
            userDataBase[userIndex] = userObject;
        }
        await setItem("userDataBase", userDataBase);
    } catch (error) {
        console.error("Fehler beim Speichern des aktualisierten Tasks:", error);
    }
}

/**
 * Moves the dragged card to the specified position.
 *
 * @param {number} pageX - The X-coordinate of the mouse pointer relative to the whole document.
 * @param {number} pageY - The Y-coordinate of the mouse pointer relative to the whole document.
 * @param {number} clientX - The X-coordinate of the mouse pointer relative to the viewport.
 * @param {number} clientY - The Y-coordinate of the mouse pointer relative to the viewport.
 */
function moveAt(pageX, pageY, clientX, clientY) {
    draggedCard.style.left = `${clientX - touchOffsetX}px`;
    draggedCard.style.top = `${clientY - touchOffsetY}px`;
}

/**
 * Creates a placeholder card element.
 *
 * @returns {HTMLElement} The created placeholder card element.
 */
function createPlaceholderCard() {
    const placeholderCard = document.createElement("div");
    placeholderCard.className = "placeholder-card";
    placeholderCard.style.width = `${draggedCard.offsetWidth}px`;
    placeholderCard.style.height = `${draggedCard.offsetHeight}px`;
    return placeholderCard;
}

/**
 * Updates the placeholder card based on the position of the dragged card.
 */
function updatePlaceholderCard() {
    const containers = document.querySelectorAll(".task-cards-container");
    const targetRect = draggedCard.getBoundingClientRect();

    containers.forEach((container) => {
        const containerRect = container.getBoundingClientRect();
        const existingPlaceholderCard =
            container.querySelector(".placeholder-card");
        const isWithinContainer =
            targetRect.top + targetRect.height / 2 < containerRect.bottom &&
            targetRect.top + targetRect.height / 2 > containerRect.top;

        if (isWithinContainer && !existingPlaceholderCard) {
            const placeholderCard = createPlaceholderCard();
            container.appendChild(placeholderCard);
        } else if (!isWithinContainer && existingPlaceholderCard) {
            existingPlaceholderCard.remove();
        }
    });
}

/**
 * Handles the "drop" event and allows dropping elements into a container.
 * @param {Event} ev - The drop event object.
 */
const allowDrop = (ev) => {
    ev.preventDefault();
    const taskCardsContainer = ev.target.closest(".task-cards-container");

    if (taskCardsContainer) {
        const existingPlaceholderCard =
            taskCardsContainer.querySelector(".placeholder-card");

        if (!existingPlaceholderCard) {
            const placeholderCard = createPlaceholderCard();
            const taskCard = ev.target.closest(".task-card");

            if (taskCard) {
                taskCard.parentNode.insertBefore(
                    placeholderCard,
                    taskCard.nextSibling
                );
            } else {
                taskCardsContainer.appendChild(placeholderCard);
            }
        }
    }
};

/**
 * Removes the drag highlight by removing the placeholder card if it exists.
 * @param {Event} ev - The drag event object.
 */
const removeDragHighlight = (ev) => {
    const taskCardsContainer = ev.target.closest(".task-cards-container");

    if (taskCardsContainer) {
        const placeholderCard =
            taskCardsContainer.querySelector(".placeholder-card");
        if (placeholderCard && !taskCardsContainer.contains(ev.relatedTarget)) {
            placeholderCard.remove();
        }
    }
};

/**
 * Handles the drop event when an element is dropped onto a drop target.
 * @param {DragEvent} ev - The drop event object.
 * @returns {Promise<void>} - A promise that resolves when the drop event is handled.
 */
const drop = async (ev) => {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    let dropTarget = ev.target;

    while (
        !dropTarget.classList.contains("task-cards-container") &&
        dropTarget.parentNode
    ) {
        dropTarget = dropTarget.parentNode;
    }

    if (dropTarget.classList.contains("task-cards-container")) {
        const element = document.getElementById(data);
        dropTarget.appendChild(element);
        element.style.transform = "";

        const task = userObject.tasks.find((t) => t.id.toString() === data);
        if (task) {
            task.status = dropTarget.id;
            await updateTaskStatus(data, dropTarget.id);
        }

        document
            .querySelectorAll(".task-cards-container")
            .forEach(updateNoTasksMessage);
    }
};

document.querySelectorAll(".task-cards-container").forEach((column) => {
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("dragleave", removeDragHighlight);
    column.addEventListener("drop", removeDragHighlight);
});

document.querySelectorAll(".task-cards-container").forEach((card) => {
    card.addEventListener("dragend", (event) => {
        event.target.style.transform = "rotate(0deg)";
    });
});

/**
 * Updates the display of the "no tasks" message based on the presence of task cards.
 *
 * @param {HTMLElement} taskCardsContainer - The container element that holds the task cards.
 */
const updateNoTasksMessage = (taskCardsContainer) => {
    const noTasksElement = taskCardsContainer.querySelector(".no-tasks");
    const hasTasks =
        taskCardsContainer.querySelectorAll(".task-card").length > 0;

    noTasksElement.style.display = hasTasks ? "none" : "flex";
};
