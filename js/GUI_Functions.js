// -------------------------------------- Functions -------------------------------------- //

// Function to disable drag for 1 second
function disableDragTemporarily() {
    console.log("Button clicked, disabling drag");
    isDragEnabled = false;
    setTimeout(() => {
        isDragEnabled = true;
        console.log("Drag re-enabled");
    }, 1000); // Re-enable drag after 1 second
}

// Function to create a button to turn on or off a functionality
// we will use it here for the debug mode
function createDebugButton() {
    var debugButton = new BABYLON.GUI.Rectangle();
    debugButton.width = "300px";
    debugButton.height = "100px";
    debugButton.zIndex = 10;
    debugButton.cornerRadius = 10;
    debugButton.color = "white"; 
    debugButton.alpha = 1;
    debugButton.thickness = 4;
    debugButton.background = "white";
    debugButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    debugButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    debugButton.top = "90%";
    debugButton.isPointerBlocker = true;

    var switchText = new BABYLON.GUI.TextBlock();
    switchText.text = "DEBUG MODE";
    switchText.color = "black";
    switchText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    switchText.left = "0%";
    switchText.fontSize = 24;
    debugButton.addControl(switchText);

    var switchRect = new BABYLON.GUI.Rectangle();
    switchRect.width = "60px";
    switchRect.height = "100px";
    switchRect.color = "white";
    switchRect.alpha = 1;
    switchRect.thickness = 4;
    switchRect.background = "white";
    switchRect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    switchRect.left = "0%";
    debugButton.addControl(switchRect);

    var isOn = false;

    debugButton.onPointerUpObservable.add(function() {
        isOn = !isOn;
        debug = isOn; 
        if (isOn) {
            switchText.text = "ON";
            switchText.color = "black";
            debugButton.background = "#b1ff91";
            switchRect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            switchRect.left = "0%";
            debugButton.color = "white"; 
            switchRect.color = "white"; 
        } else {
            switchText.text = "OFF";
            switchText.color = "white";
            debugButton.background = "#f44336";
            switchRect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            switchRect.left = "0%";
            debugButton.color = "white"; 
            switchRect.color = "white"; 
        }
    });

    return debugButton;
}

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
    rectangle.zIndex = 2;
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
    homeButton.zIndex = 10;
    homeButton.thickness = 0;

    homeButton.onPointerUpObservable.add(function() {
        // Redirect to the URL without /mobile.html
        let currentUrl = window.location.href;
        let newUrl = currentUrl.replace("/mobile.html", "");
        window.location.href = newUrl;
    });

    advancedTexture.addControl(homeButton);

    // Add the home button to the global array
    allButtons.push(homeButton);
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
    backButton.zIndex = 10; 
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

// Add the "Trash" button
function createTrashButton() {
    trashButton = BABYLON.GUI.Button.CreateImageOnlyButton("trashButton", "./assets/img/trash.png");
    trashButton.width = "10%";
    trashButton.height = "4.5%";
    trashButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    trashButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    trashButton.left = "-5%";
    trashButton.top = "5%";
    trashButton.zIndex = 10; 
    trashButton.thickness = 0;
    trashButton.isVisible = false;
    trashButton.isEnabled = false;

    advancedTexture.addControl(trashButton);
    allButtons.push(trashButton);
}

// Add the "Options" button
function createOptionsButton() {
    optionsButton = BABYLON.GUI.Button.CreateImageOnlyButton("optionsButton", "./assets/img/options.png");
    optionsButton.width = "10%";
    optionsButton.height = "4.5%";
    optionsButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    optionsButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    optionsButton.left = "-5%";
    optionsButton.top = "5%";
    optionsButton.zIndex = 10; 
    optionsButton.thickness = 0;
    optionsButton.cornerRadius = 10;

    advancedTexture.addControl(optionsButton);
    allButtons.push(optionsButton);

    optionsButton.onPointerUpObservable.add(() => {
        if (currentPage == "optionPage") {
            restorePreviousButtonState(); // Fonctionne comme un bouton retour si on est sur optionsPage
        } else {
            optionPage(); // Sinon, affiche la page des options
        }
    });
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
    button.zIndex = 10; 

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
    buttonContainer.zIndex = 10; 
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

var excelButtonContainer;

function createExcelButton() {
    excelButtonContainer = new BABYLON.GUI.Rectangle();
    excelButtonContainer.width = "350px";
    excelButtonContainer.height = "120px";
    excelButtonContainer.cornerRadius = 10;
    excelButtonContainer.color = "black";
    excelButtonContainer.thickness = 4;
    excelButtonContainer.background = "white";
    excelButtonContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    excelButtonContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    excelButtonContainer.left = "15%";
    excelButtonContainer.top = "50%";
    excelButtonContainer.zIndex = 10;
    excelButtonContainer.isPointerBlocker = true;
    excelButtonContainer.isVisible = false;
    excelButtonContainer.isEnabled = false;

    // Create a grid to hold the image and text
    var grid = new BABYLON.GUI.Grid();
    grid.addColumnDefinition(0.3); // 30% for the image
    grid.addColumnDefinition(0.7); // 70% for the text

    // Create the image for the button
    var logoImage = new BABYLON.GUI.Image("excelLogo", "./assets/img/Excel.png");
    logoImage.width = "80px"; 
    logoImage.height = "65px"; 
    logoImage.paddingRight = "10px";
    grid.addControl(logoImage, 0, 0); 

    // Create the text block for the button
    var textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = "Generate Excel";
    textBlock.color = "black";
    textBlock.fontSize = 30;
    textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    grid.addControl(textBlock, 0, 1); // Add text to the second column

    excelButtonContainer.addControl(grid);

    excelButtonContainer.onPointerUpObservable.add(() => {
        // Example of simulation data
        const simulationData = [
            { "Time": "0s", "Value": 10 },
            { "Time": "1s", "Value": 20 },
            { "Time": "2s", "Value": 30 }
        ];

        generateExcel(simulationData);
    });

    // Add the button container to the advanced texture
    advancedTexture.addControl(excelButtonContainer);
    allButtons.push(excelButtonContainer);

    return excelButtonContainer;
}

var resetButtonContainer;

function createResetButton() {
    resetButtonContainer = new BABYLON.GUI.Rectangle();
    resetButtonContainer.width = "350px";
    resetButtonContainer.height = "120px";
    resetButtonContainer.cornerRadius = 10;
    resetButtonContainer.color = "black";
    resetButtonContainer.thickness = 4;
    resetButtonContainer.background = "white";
    resetButtonContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    resetButtonContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    resetButtonContainer.left = "55%"; 
    resetButtonContainer.top = "50%";
    resetButtonContainer.zIndex = 10;
    resetButtonContainer.isPointerBlocker = true;
    resetButtonContainer.isVisible = false;
    resetButtonContainer.isEnabled = false;

    // Create a grid to hold the image and text
    var grid = new BABYLON.GUI.Grid();
    grid.addColumnDefinition(0.3);
    grid.addColumnDefinition(0.7); 

    // Create the image for the button
    var logoImage = new BABYLON.GUI.Image("resetLogo", "./assets/img/reset.png");
    logoImage.width = "100px"; 
    logoImage.height = "100px"; 
    logoImage.paddingRight = "10px";
    grid.addControl(logoImage, 0, 0); 

    // Create the text block for the button
    var textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = "Reset";
    textBlock.color = "black";
    textBlock.fontSize = 30;
    textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    grid.addControl(textBlock, 0, 1); 

    resetButtonContainer.addControl(grid);

    resetButtonContainer.onPointerUpObservable.add(() => {
        resetScene();
        console.log("Reset button clicked");
    });

    
    advancedTexture.addControl(resetButtonContainer);
    allButtons.push(resetButtonContainer);

    return resetButtonContainer;
}

function createSlider() {
    var panel = new BABYLON.GUI.StackPanel();
    panel.zIndex = 10; // Assurer un zIndex élevé
    panel.width = "80%"; 
    panel.height = "20%"; 
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP; 
    panel.top = "30%"; 

    var header = new BABYLON.GUI.TextBlock();
    header.text = "Speed: " + actualSpeed;
    header.fontSize = "60px"; 
    header.height = "70px"; 
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; 
    header.paddingLeft = "10px"; 
    panel.addControl(header);

    
    var spacer = new BABYLON.GUI.Rectangle();
    spacer.height = "20px"; 
    spacer.width = "100%";
    spacer.thickness = 0;
    spacer.isPointerBlocker = false;
    panel.addControl(spacer);

    var slider = new BABYLON.GUI.Slider();
    slider.minimum = speedMin;
    slider.maximum = speedMax;
    slider.value = actualSpeed;
    slider.isVertical = false;
    slider.color = "white";
    slider.background = "white";
    slider.height = "80px"; 
    slider.width = "100%"; 
    slider.step = 1; 

    slider.thumbWidth = "300px"; 
    slider.thumbHeight = "300px";
    slider.thumbColor = "#7B7B7B";
    slider.thumbHighlightWidth = 5; 
    slider.thumbHighlightColor = "white"; 

    slider.onValueChangedObservable.add(function (value) {
        var roundedValue = Math.round(value); 
        actualSpeed = roundedValue; 
        slider.value = actualSpeed;
        header.text = "Speed: " + roundedValue;
    });
    panel.addControl(slider);

    advancedTexture.addControl(panel);

    
    allButtons.push(panel);
    panel.isVisible = false;
    panel.isEnabled = false;

    return panel;
}

function startPage() {
    hideAndDisableAllButtons();
    // Show the black block and image buttons
    blackBlock.isVisible = true;
    vacumBtn.isVisible = true;
    vacumBtn.isEnabled = true;
    optionsButton.isVisible = true;
    optionsButton.isEnabled = true;
    roboticArmBtn.isVisible = true;
    roboticArmBtn.isEnabled = true;
    droneBtn.isVisible = true;
    droneBtn.isEnabled = true;
    mowerBtn.isVisible = true;
    mowerBtn.isEnabled = true;

    // Ensure the home button remains visible and enabled
    homeButton.isVisible = true;
    homeButton.isEnabled = true;

    // Show the debug button
    debugButton.isVisible = true;
    debugButton.isEnabled = true;

    isDragEnabled = false; // Disable drag on startPage

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
    optionsButton.isVisible = true;
    optionsButton.isEnabled = true;
    blackBgMainPage.isVisible = true;

    isDragEnabled = true; // Enable drag on mainPage

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
    optionsButton.isVisible = true;
    optionsButton.isEnabled = true;
    trashButton.isVisible = false;
    trashButton.isEnabled = false;
    blackBgVaccumObjects.isVisible = true;

    isDragEnabled = true;

    currentPage = "vaccumObjects";
}

function optionPage() {
    saveButtonState();
    hideAndDisableAllButtons();
    blackBgOptionsPage.isVisible = true;
    optionsButton.isVisible = true;
    optionsButton.isEnabled = true;

    sliderPanel.isVisible = true;
    sliderPanel.isEnabled = true;

    excelButtonContainer.isVisible = true;
    excelButtonContainer.isEnabled = true;

    resetButtonContainer.isVisible = true;
    resetButtonContainer.isEnabled = true;

    isDragEnabled = false; // Disable drag on optionPage

    currentPage = "optionPage";
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
    if (currentPage === "optionPage" && buttonStateHistory.length > 0) {
        const previousState = buttonStateHistory.pop();
        currentPage = previousState.page;  // Set the current page to the previous one
        previousState.state.forEach(state => {
            state.button.isVisible = state.isVisible;
            state.button.isEnabled = state.isEnabled;
        });
        if (previousState.page === "mainPage" || previousState.page === "vaccumObjects") {
            isDragEnabled = true; // Re-enable drag if returning to mainPage or vaccumObjects
        }
    } else if (currentPage === "mainPage") {
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
            isDragEnabled = true; // Re-enable drag when restoring to mainPage
        }
    } else if (buttonStateHistory.length > 0) {
        const previousState = buttonStateHistory.pop();
        previousState.state.forEach(state => {
            state.button.isVisible = state.isVisible;
            state.isEnabled = state.isEnabled;
        });
        if (previousState.page === "mainPage" || previousState.page === "vaccumObjects") {
            isDragEnabled = true; // Re-enable drag if restoring to mainPage or vaccumObjects
        }
    }
}

function generateExcel(data) {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Simulation Data");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, "simulation_data.xlsx");
}
