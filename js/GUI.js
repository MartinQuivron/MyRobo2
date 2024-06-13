function createGuiRectangle(name, color, width, height, alpha, cornerRadius, text, fontSize) {
    const rectangle = new BABYLON.GUI.Rectangle(name);
    rectangle.width = width;
    rectangle.height = height;
    rectangle.color = color;
    rectangle.thickness = 0;
    rectangle.background = color; // Use the color for the background
    rectangle.alpha = alpha; // Set the transparency of the rectangle
    rectangle.cornerRadius = cornerRadius;
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    rectangle.zIndex = 0; // Ensure it's behind the home button

    // Create a text block
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = "White";
    textBlock.fontSize = fontSize;
    textBlock.fontFamily = "Monaco";
    textBlock.fontWeight = "bold";
    textBlock.alpha = 1; // Keep the text fully opaque
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.top = "15%"; // Adjust position of the text
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
    homeButton.zIndex = 1; // Ensure it's in front of the black block

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

    return button;
}

function createButtonImaged(name, imageUrl, width, height, top, left, horizontalAlignment, advancedTexture, cornerRadius) {
    // Create a button container
    var buttonContainer = new BABYLON.GUI.Rectangle(name);
    buttonContainer.width = width;
    buttonContainer.height = height;
    buttonContainer.top = top;
    buttonContainer.left = left;
    buttonContainer.horizontalAlignment = horizontalAlignment;
    buttonContainer.cornerRadius = cornerRadius;
    buttonContainer.thickness = 0; // optional, to remove border

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