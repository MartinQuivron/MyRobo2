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
    homeButton.width = "8%";
    homeButton.height = "3.5%";
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
}

// Function to create buttons
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

    return button;
}

// Function to create buttons with images
function createButtonImaged(name, imageUrl, width, height, top, left, horizontalAlignment, advancedTexture, cornerRadius, background) {
    // Create a button container
    var buttonContainer = new BABYLON.GUI.Rectangle(name);
    buttonContainer.width = width;
    buttonContainer.height = height;
    buttonContainer.top = top;
    buttonContainer.left = left;
    buttonContainer.horizontalAlignment = horizontalAlignment;
    buttonContainer.cornerRadius = cornerRadius;
    buttonContainer.thickness = 0; 
    buttonContainer.zIndex = 1; 
    buttonContainer.background = background; // Set the background color

    // Create an image
    var image = new BABYLON.GUI.Image(name + "_image", imageUrl);
    image.width = "100%";
    image.height = "100%";

    // Add the image to the button container
    buttonContainer.addControl(image);

    // Add the button container to the advanced texture
    advancedTexture.addControl(buttonContainer);

    return buttonContainer;
}

// Function to hide all image buttons
function hideAllButtons() {
    vacumBtn.isVisible = false;
    vacumBtn.isEnabled = false;
    roboticArmBtn.isVisible = false;
    roboticArmBtn.isEnabled = false;
    droneBtn.isVisible = false;
    droneBtn.isEnabled = false;
    mowerBtn.isVisible = false;
    mowerBtn.isEnabled = false;
    simulationButton.isVisible = false;
    simulationButton.isEnabled = false;
    objectBtn.isVisible = false;
    objectBtn.isEnabled = false;
    blackBlock.isVisible = false;
}

// Function to show interaction buttons and hide all image buttons
function showInteractionButtons() {
    placeBtn.isVisible = true;
    placeBtn.isEnabled = true;
    endPoint.isVisible = true;
    endPoint.isEnabled = true;
    block.isVisible = true;
    block.isEnabled = true;
    move.isVisible = true;
    move.isEnabled = true;

    // Hide and disable all image buttons except the Home button
    hideAllButtons();
    homeButton.isVisible = true;
    homeButton.isEnabled = true;
}

// Function to handle interaction button clicks
function handleInteractionButtonClick() {
    showInteractionButtons();
    simulationButton.isVisible = true;
    simulationButton.isEnabled = true;
    objectBtn.isVisible = true;
    objectBtn.isEnabled = true;
}

// Function to hide and disable all buttons
function hideAndDisableAllButtons() {
    // Array of all buttons
    const buttons = [homeButton, vacumBtn, roboticArmBtn, droneBtn, mowerBtn, placeBtn, endPoint, block, move, blackBlock];
  
    // Loop through each button and set isVisible and isEnabled to false
    buttons.forEach(button => {
      if (button) { // Check if the button is not null
        button.isVisible = false;
        button.isEnabled = false;
      }
    });
}
