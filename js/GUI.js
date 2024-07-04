// Global array to store all buttons
var allButtons = [];

// Global array to store the history of button states
var buttonStateHistory = [];

// -------------------------------------- Functions -------------------------------------- //

// Function to create GUI rectangles
function createGuiRectangle(name, color, width, height, alpha, cornerRadius, text, fontSize, top = "0px") {
    const rectangle = new BABYLON.GUI.Rectangle(name);
    rectangle.width = width;
    rectangle.height = height;
    rectangle.color = color;
    rectangle.thickness = 0;
    rectangle.background = color;
    rectangle.alpha = alpha;
    rectangle.cornerRadius = cornerRadius;
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    rectangle.zIndex = 1;
    rectangle.top = top; // Set the top property to move the rectangle vertically

    // Create a text block
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = "White";
    textBlock.fontSize = fontSize;
    textBlock.fontFamily = "Monaco";
    textBlock.fontWeight = "bold";
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.top = "15%";
    rectangle.addControl(textBlock);

    return rectangle;
}

// Add the "Home" button
function createHomeButton() {
    homeButton = BABYLON.GUI.Button.CreateImageOnlyButton("homeButton", "./assets/img/home2.png");
    homeButton.width = "10%";
    homeButton.height = "4.5%";
    homeButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    homeButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    homeButton.left = "5%";
    homeButton.top = "5%";
    homeButton.zIndex = 2;
    homeButton.thickness = 0;

    homeButton.onPointerUpObservable.add(function() {
        resetScene();
    });

    advancedTexture.addControl(homeButton);

    // Add the home button to the global array
    allButtons.push(homeButton);
}

function createTrashButton() {
    trashButton = BABYLON.GUI.Button.CreateImageOnlyButton("trashButton", "./assets/img/trash.png");
    trashButton.width = "10%";
    trashButton.height = "4.5%";
    trashButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    trashButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    trashButton.left = "-5%";
    trashButton.top = "5%";
    trashButton.zIndex = 2;
    trashButton.thickness = 0;
    trashButton.isVisible = false;
    trashButton.isEnabled = false;

    advancedTexture.addControl(trashButton);
    allButtons.push(trashButton);

    trashButton.onPointerEnterObservable.add(() => {
        if (draggedMesh) {
            isPointerOverTrashButton = true;
            console.log("Pointer is over the trash button");
            console.log("draggedMesh:", draggedMesh.name);
            scene.getMeshByName(draggedMesh.name).dispose();  // Dispose the dragged mesh immediately
            draggedMesh = null;  // Reset the dragged mesh to avoid further interactions
        }
    });

    trashButton.onPointerOutObservable.add(() => {
        if (draggedMesh) {
            isPointerOverTrashButton = false;
            console.log("Pointer left the trash button");
            console.log("draggedMesh:", draggedMesh.name);
        }
    });
}


// Add the "Back" button
function createBackButton() {
    backButton = BABYLON.GUI.Button.CreateImageOnlyButton("backButton", "./assets/img/return.png");
    backButton.width = "10%";
    backButton.height = "4.5%";
    backButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    backButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    backButton.left = "5%";
    backButton.top = "5%";
    backButton.zIndex = 2;
    backButton.thickness = 0;
    backButton.isVisible = false;
    backButton.isEnabled = false;

    backButton.onPointerUpObservable.add(function() {
        restorePreviousButtonState();
    });

    advancedTexture.addControl(backButton);

    // Add the back button to the global array
    allButtons.push(backButton);
}

// Function to create buttons and add them to the global array
function createButton(name, text, width, height, color, cornerRadius, background, top, left, fontSize, horizontalAlignment) {
    var button = BABYLON.GUI.Button.CreateSimpleButton(name, text);
    button.width = width;
    button.height = height;
    button.color = color;
    button.cornerRadius = cornerRadius;
    button.background = background;
    button.top = top;
    button.left = left;
    button.fontSize = fontSize;
    button.horizontalAlignment = horizontalAlignment;
    button.zIndex = 1;

    // Add the button to the global array
    allButtons.push(button);

    return button;
}

// Function to create image buttons and add them to the global array
function createButtonImaged(name, imageUrl, width, height, top, left, horizontalAlignment, advancedTexture, cornerRadius, background, color) {
    var buttonContainer = new BABYLON.GUI.Rectangle(name);
    buttonContainer.width = width;
    buttonContainer.height = height;
    buttonContainer.top = top;
    buttonContainer.left = left;
    buttonContainer.horizontalAlignment = horizontalAlignment;
    buttonContainer.cornerRadius = cornerRadius;
    buttonContainer.thickness = 0;
    buttonContainer.zIndex = 1;
    buttonContainer.background = background;
    buttonContainer.thickness = 2;
    buttonContainer.color = color;

    var image = new BABYLON.GUI.Image(name + "_image", imageUrl);
    image.width = "100%";
    image.height = "100%";

    buttonContainer.addControl(image);
    advancedTexture.addControl(buttonContainer);

    // Add the button to the global array
    allButtons.push(buttonContainer);

    return buttonContainer;
}

function startPage() {
    hideAndDisableAllButtons();
    // Show the black block and image buttons
    blackBlock.isVisible = true;
    vacumBtn.isVisible = true;
    vacumBtn.isEnabled = true;
    roboticArmBtn.isVisible = true;
    roboticArmBtn.isEnabled = true;
    droneBtn.isVisible = true;
    droneBtn.isEnabled = true;
    mowerBtn.isVisible = true;
    mowerBtn.isEnabled = true;

    // Ensure the home button remains visible and enabled
    homeButton.isVisible = true;
    homeButton.isEnabled = true;

    currentPage = "startPage";
}

// Function to handle interaction button clicks
function mainPage() {
    saveButtonState();  // Save the current state before changing
    hideAndDisableAllButtons();
    simulationButton.isVisible = true;
    simulationButton.isEnabled = true;
    objectBtn.isVisible = true;
    objectBtn.isEnabled = true;
    backButton.isVisible = true;
    backButton.isEnabled = true;
    blackBgMainPage.isVisible = true;

    currentPage = "mainPage";
}

// Function to show interaction buttons and hide all image buttons
function vaccumObjects() {
    hideAndDisableAllButtons();
    placeBtn.isVisible = true;
    placeBtn.isEnabled = true;
    endPoint.isVisible = true;
    endPoint.isEnabled = true;
    block.isVisible = true;
    block.isEnabled = true;
    simulationButton.isVisible = true;
    simulationButton.isEnabled = true;
    objectBtn.isVisible = true;
    objectBtn.isEnabled = true;
    backButton.isVisible = true;  
    backButton.isEnabled = true;
    trashButton.isVisible = false;
    trashButton.isEnabled = false;
    blackBgVaccumObjects.isVisible = true;

    currentPage = "vaccumObjects";
}

// Function to handle object button click
function handleObjectButtonClick() {
    saveButtonState();  // Save the current state before changing
    vaccumObjects();
}

function handleObjectButtonClickDisabled() {
    mainPage();  // Restore the previous state
}

// Function to hide and disable all buttons
function hideAndDisableAllButtons() {
    // Loop through each button in the global array and set isVisible and isEnabled to false
    allButtons.forEach(button => {
        if (button) { // Check if the button is not null
            button.isVisible = false;
            button.isEnabled = false;
        }
        blackBlock.isVisible = false;
    });
}

// Function to save the current state of all buttons
function saveButtonState() {
    const currentState = {
        page: currentPage,
        state: allButtons.map(button => ({
            button: button,
            isVisible: button.isVisible,
            isEnabled: button.isEnabled
        }))
    };
    buttonStateHistory.push(currentState);
}

// Function to restore the previous state of all buttons
function restorePreviousButtonState() {
    if (currentPage === "mainPage") {
        startPage();
    } else if (currentPage === "vaccumObjects" && buttonStateHistory.length > 0) {
        // Restore to mainPage from vaccumObjects
        let previousState;
        do {
            previousState = buttonStateHistory.pop();
        } while (previousState && previousState.page !== "mainPage");

        if (previousState) {
            currentPage = "mainPage";
            previousState.state.forEach(state => {
                state.button.isVisible = state.isVisible;
                state.button.isEnabled = state.isEnabled;
            });
        }
    } else if (buttonStateHistory.length > 0) {
        const previousState = buttonStateHistory.pop();
        previousState.state.forEach(state => {
            state.button.isVisible = state.isVisible;
            state.button.isEnabled = state.isEnabled;
        });
    }
}

// Function to reset the scene
function attachOwnPointerDragBehavior(mesh) {
    var pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)});
    pointerDragBehavior.moveAttached = false;
    pointerDragBehavior.useObjectOrienationForDragging = false;

    pointerDragBehavior.onDragStartObservable.add((event) => {
        console.log("startDrag");
        draggedMesh = mesh;
        placeBtn.isVisible = false;
        endPoint.isVisible = false;
        block.isVisible = false;
        trashButton.isVisible = true;
        trashButton.isEnabled = true;
    });

    pointerDragBehavior.onDragObservable.add((event) => {
        if (draggedMesh) {
            console.log("drag");
            placeBtn.isVisible = false;
            endPoint.isVisible = false;
            block.isVisible = false;
            trashButton.isVisible = true;
            trashButton.isEnabled = true;

            pointerDragBehavior.attachedNode.position.x += event.delta.x;
            pointerDragBehavior.attachedNode.position.z += event.delta.z;
        }
    });

    pointerDragBehavior.onDragEndObservable.add((event) => {
        if (draggedMesh) {
            console.log("endDrag");
            placeBtn.isVisible = true;
            endPoint.isVisible = true;
            block.isVisible = true;
            trashButton.isVisible = false;
            trashButton.isEnabled = false;

            console.log("isPointerOverTrashButton:", isPointerOverTrashButton);

            if (!isPointerOverTrashButton) {
                console.log("Mesh not disposed, isPointerOverTrashButton:", isPointerOverTrashButton);
            }

            draggedMesh = null; // Réinitialise la variable
        }
    });

    mesh.addBehavior(pointerDragBehavior);
}
