// Global array to store all buttons
var allButtons = [];

// Global array to store the history of button states
var buttonStateHistory = [];

// -------------------------------------- Functions -------------------------------------- //

// Function to create GUI rectangles
function createGuiRectangle(name, color, width, height, alpha, cornerRadius, text, fontSize) {
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

    advancedTexture.addControl(trashButton);
    allButtons.push(trashButton);
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


// Function to show interaction buttons and hide all image buttons
function vaccumObjects() {
    placeBtn.isVisible = true;
    placeBtn.isEnabled = true;
    endPoint.isVisible = true;
    endPoint.isEnabled = true;
    block.isVisible = true;
    block.isEnabled = true;
    move.isVisible = true;
    move.isEnabled = true;
    simulationButton.isVisible = false;
    simulationButton.isEnabled = false;
    objectBtn.isVisible = false;
    objectBtn.isEnabled = false;
    backButton.isVisible = true;  
    backButton.isEnabled = true;
    homeButton.isVisible = false;
    homeButton.isEnabled = false;
    trashButton.isVisible = true;
    trashButton.isEnabled = true;

}

// Function to handle interaction button clicks
function mainPage() {
    saveButtonState();  // Save the current state before changing
    hideAndDisableAllButtons();
    simulationButton.isVisible = true;
    simulationButton.isEnabled = true;
    objectBtn.isVisible = true;
    objectBtn.isEnabled = true;
    homeButton.isVisible = true;
    homeButton.isEnabled = true;
}


// Function to handle object button click
function handleObjectButtonClick() {
    saveButtonState();  // Save the current state before changing
    vaccumObjects();
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
    const currentState = allButtons.map(button => ({
        button: button,
        isVisible: button.isVisible,
        isEnabled: button.isEnabled
    }));
    buttonStateHistory.push(currentState);
}

// Function to restore the previous state of all buttons
function restorePreviousButtonState() {
    if (buttonStateHistory.length > 0) {
        const previousState = buttonStateHistory.pop();
        previousState.forEach(state => {
            state.button.isVisible = state.isVisible;
            state.button.isEnabled = state.isEnabled;
        });
    }
}

function checkCollisionWithTrashButton(mesh) {
    // Get the position of the trash button in screen coordinates
    var trashButtonPosition = trashButton._currentMeasure;

    // Get the position of the mesh in screen coordinates
    var meshPosition = BABYLON.Vector3.Project(
        mesh.position,
        BABYLON.Matrix.Identity(),
        scene.getTransformMatrix(),
        camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
    );

    // Calculate the boundaries of the trash button
    var trashButtonLeft = trashButtonPosition.left;
    var trashButtonRight = trashButtonPosition.left + trashButtonPosition.width;
    var trashButtonTop = trashButtonPosition.top;
    var trashButtonBottom = trashButtonPosition.top + trashButtonPosition.height;

    // Check if the mesh is within the bounds of the trash button
    return (
        meshPosition.x >= trashButtonLeft &&
        meshPosition.x <= trashButtonRight &&
        meshPosition.y >= trashButtonTop &&
        meshPosition.y <= trashButtonBottom
    );
}