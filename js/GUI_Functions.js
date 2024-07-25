/**
 * GUI_Functions.js
 * 
 * This file contains various functions to create and manage the graphical user interface (GUI) elements
 * used in the simulation project. It includes functions for creating buttons, rectangles, sliders, and
 * handling interactions with these elements. The purpose is to facilitate user interaction with the simulation
 * through a graphical interface.
 * 
 * Functions:
 * - disableDragTemporarily: Temporarily disables the drag functionality for 1 second.
 * - createDragDisableArea: Creates an invisible area to block drag actions.
 * - addDragDisableBehavior: Adds behavior to disable drag when interacting with a button.
 * - createDebugButton: Creates a button to toggle debug mode on and off.
 * - createGuiRectangle: Creates a customizable GUI rectangle with text.
 * - createHomeButton: Creates a button that redirects to the home page.
 * - createBackButton: Creates a back button to restore the previous button state.
 * - createTrashButton: Creates a trash button to dispose of dragged meshes.
 * - createOptionsButton: Creates a button to display the options page.
 * - createButton: Creates a simple button with text.
 * - createButtonImaged: Creates a button with an image.
 * - addJSONData: Adds simulation data to the worksheet for Excel generation.
 * - generateExcel: Generates an Excel file with simulation data.
 * - createExcelButton: Creates a button to generate and download an Excel file.
 * - createResetButton: Creates a reset button to reset the simulation.
 * - createSlider: Creates a slider to adjust the robot speed.
 * - startPage: Displays the start page with initial buttons.
 * - mainPage: Displays the main interaction page.
 * - vaccumObjects: Displays the page for interacting with vacuum objects.
 * - obstacleChoice: Displays the obstacle choice page.
 * - optionPage: Displays the options page.
 * - handleObjectButtonClick: Handles the object button click to show vacuum objects.
 * - handleObjectButtonClickDisabled: Restores the previous state from main page.
 * - hideAndDisableAllButtons: Hides and disables all buttons.
 * - saveButtonState: Saves the current state of all buttons.
 * - restorePreviousButtonState: Restores the previous state of all buttons.
 * - adjustDragDisableArea: Adjusts the drag disable area based on the current page.
 */

// Function to disable drag for 1 second
function disableDragTemporarily() {
    console.log("Button clicked, disabling drag");
    isDragEnabled = false;
    setTimeout(() => {
        isDragEnabled = true;
        console.log("Drag re-enabled");
    }, 1000); // Re-enable drag after 1 second
}

// Function to create an invisible area to block drag actions
function createDragDisableArea() {
    var dragDisableArea = new BABYLON.GUI.Rectangle();
    dragDisableArea.width = "95%";
    dragDisableArea.height = "20%";
    dragDisableArea.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    dragDisableArea.top = "75%";
    dragDisableArea.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    dragDisableArea.background = "transparent";
    dragDisableArea.thickness = 0;
    dragDisableArea.isPointerBlocker = true; 
    dragDisableArea.isVisible = false; 
    dragDisableArea.isEnabled = false;

    return dragDisableArea;
}

// Function to add behavior to disable drag when interacting with a button
function addDragDisableBehavior(button) {
    button.onPointerEnterObservable.add(function () {
        isDragEnabled = false;
    });

    button.onPointerOutObservable.add(function () {
        isDragEnabled = true;
    });

    button.onPointerUpObservable.add(function () {
        isDragEnabled = true;
    });
}

// Function to create a button to turn on or off a functionality (e.g., debug mode)
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

// Function to create GUI rectangles with customizable properties
function createGuiRectangle(name, color, width, height, alpha, cornerRadius, text, fontSize, top = "0px", textColor = "white") {
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
    textBlock.color = textColor;
    textBlock.fontSize = fontSize;
    textBlock.fontFamily = "Monaco";
    textBlock.fontWeight = "bold";
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.top = "15%";
    rectangle.addControl(textBlock);

    return rectangle;
}

// Function to create a home button that redirects to the home page
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

// Function to create a back button that restores the previous button state
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

// Function to create a trash button that disposes of dragged meshes
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

// Function to create an options button that displays the options page
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
            restorePreviousButtonState(); // Functions like a back button if on optionsPage
        } else {
            optionPage(); // Otherwise, displays the options page
        }
    });
}

// Function to create a simple button with text
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

// Function to create a button with an image
function createButtonImaged(name, imageUrl, width, height, top, left, horizontalAlignment, advancedTexture, cornerRadius, background, color, disableDrag = false, zIndex = 10, alpha = 1) {
    var buttonContainer = new BABYLON.GUI.Rectangle(name);
    buttonContainer.width = width;
    buttonContainer.height = height;
    buttonContainer.top = top;
    buttonContainer.left = left;
    buttonContainer.horizontalAlignment = horizontalAlignment;
    buttonContainer.cornerRadius = cornerRadius;
    buttonContainer.thickness = 0;
    buttonContainer.zIndex = zIndex;
    buttonContainer.background = background;
    buttonContainer.thickness = 2;
    buttonContainer.color = color;
    buttonContainer.alpha = alpha;

    var image = new BABYLON.GUI.Image(name + "_image", imageUrl);
    image.width = "100%";
    image.height = "100%";

    buttonContainer.addControl(image);
    advancedTexture.addControl(buttonContainer);

    if (disableDrag) {
        buttonContainer.onPointerEnterObservable.add(function () {
            isDragEnabled = false;
        });

        buttonContainer.onPointerOutObservable.add(function () {
            isDragEnabled = true;
        });

        buttonContainer.onPointerUpObservable.add(function () {
            isDragEnabled = true;
        });
    }

    // Add the button to the global array
    allButtons.push(buttonContainer);

    return buttonContainer;
}

function addJSONData(data) {
    // Prepare data for the worksheet
    const worksheetData = [
        { "Key": "----------------", "Value": '----------------' },
        { "Key": "Simulation number", "Value": data.simulationNumber },
        { "Key": "Simulation finished", "Value": data.simulationFinished },
        { "Key": "Robot Name", "Value": data.robotName },
        { "Key": "Start Position", "Value": `(${data.startPosition.x}, ${data.startPosition.z})` },
        { "Key": "End Position", "Value": `(${data.endPosition.x}, ${data.endPosition.z})` },
        { "Key": "Start Time", "Value": data.startTime },
        { "Key": "End Time", "Value": data.endTime },
        { "Key": "Speed", "Value": data.speed },
        { "Key": "Number of Obstacles", "Value": data.obstacles.length },
        ...data.obstacles.map((obstacle, index) => ({
            "Key": `Obstacle ${index + 1} Position`,
            "Value": `(${obstacle.position.x}, ${obstacle.position.z})`
        }))
    ];
    simulationDataArray.push(worksheetData);
    console.log("Simulation data array1: ", simulationDataArray);
}

// Function to generate an Excel file with simulation data
function generateExcel() {
    var totalFinished = 0;
    var totalSimulation = 0;
    for (let i = 0; i < simulationDataArray.length; i++) {
        totalSimulation += 1;
        if (simulationDataArray[i].simulationFinished == true) {
            totalFinished += 1;
        }
    }


    var combinedData = [
        { "Key": "----------------", "Value": '----------------' },
        { "Key": "Total Simulation", "Value": totalSimulation },
        { "Key": "Total finished", "Value": totalFinished }
    ];

    console.log("Simulation data array2: ", simulationDataArray);
    // Combine the data into a single array
    for (let i = 0; i < simulationDataArray.length; i++) {
        combinedData = combinedData.concat(simulationDataArray[i]);
        console.log("Simulation data array: ", simulationDataArray[i]);
    }

    // Convert the combined data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(combinedData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Simulation Data");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, "simulation_data.xlsx");
}

// Function to create a button to generate and download an Excel file
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
        generateExcel();
    });

    // Add the button container to the advanced texture
    advancedTexture.addControl(excelButtonContainer);
    allButtons.push(excelButtonContainer);

    return excelButtonContainer;
}

// Function to create a reset button to reset the simulation
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

// Function to create a slider to adjust the robot speed
function createSlider() {
    var panel = new BABYLON.GUI.StackPanel();
    panel.zIndex = 10; // Ensure a high zIndex
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

// Function to display the start page with initial buttons
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

// Function to display the main interaction page
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

    // Sync dragDisableArea with blackBgMainPage
    dragDisableArea.width = blackBgMainPage.width;
    dragDisableArea.height = blackBgMainPage.height;
    dragDisableArea.top = blackBgMainPage.top;
    dragDisableArea.left = blackBgMainPage.left;
    dragDisableArea.horizontalAlignment = blackBgMainPage.horizontalAlignment;
    dragDisableArea.verticalAlignment = blackBgMainPage.verticalAlignment;

    // Show the drag disable area for the lower half of the page
    dragDisableArea.isVisible = true;
    dragDisableArea.isEnabled = true;

    currentPage = "mainPage";
}

// Function to display the page for interacting with vacuum objects
function vaccumObjects() {
    saveButtonState();  // Save the current state before changing
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
    blackBgVaccumObjects.isVisible = true;

    // Sync dragDisableArea with blackBgVaccumObjects
    dragDisableArea.width = blackBgVaccumObjects.width;
    dragDisableArea.height = blackBgVaccumObjects.height;
    dragDisableArea.top = blackBgVaccumObjects.top;
    dragDisableArea.left = blackBgVaccumObjects.left;
    dragDisableArea.horizontalAlignment = blackBgVaccumObjects.horizontalAlignment;
    dragDisableArea.verticalAlignment = blackBgVaccumObjects.verticalAlignment;

    // Show the drag disable area for the lower half of the page
    dragDisableArea.isVisible = true;
    dragDisableArea.isEnabled = true;

    currentPage = "vaccumObjects";
}

// Function to display the obstacle choice page
function obstacleChoice() {
    saveButtonState();  
    hideAndDisableAllButtons();
    cubicObstacle.isVisible = true;
    cubicObstacle.isEnabled = true;
    sphereObstacle.isVisible = true;
    sphereObstacle.isEnabled = true;
    cylinderObstacle.isVisible = true;
    cylinderObstacle.isEnabled = true;
    simulationButton.isVisible = true;
    simulationButton.isEnabled = true;
    backToVaccumObjects.isVisible = true;
    backToVaccumObjects.isEnabled = true;
    backButton.isVisible = true;
    backButton.isEnabled = true;
    optionsButton.isVisible = true;
    optionsButton.isEnabled = true;
    blackBgVaccumObjects.isVisible = true;

    // Sync dragDisableArea with blackBgVaccumObjects
    dragDisableArea.width = blackBgVaccumObjects.width;
    dragDisableArea.height = blackBgVaccumObjects.height;
    dragDisableArea.top = blackBgVaccumObjects.top;
    dragDisableArea.left = blackBgVaccumObjects.left;
    dragDisableArea.horizontalAlignment = blackBgVaccumObjects.horizontalAlignment;
    dragDisableArea.verticalAlignment = blackBgVaccumObjects.verticalAlignment;

    // Show the drag disable area for the lower half of the page
    dragDisableArea.isVisible = true;
    dragDisableArea.isEnabled = true;

    currentPage = "obstacleChoice";
}

// Function to display the options page
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

// Function to handle the object button click to show vacuum objects
function handleObjectButtonClick() {
    saveButtonState();  // Save the current state before changing
    vaccumObjects();
}

// Function to restore the previous state from main page
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

    // Disable and hide dragDisableArea when hiding and disabling all buttons
    if (dragDisableArea) {
        dragDisableArea.isVisible = false;
        dragDisableArea.isEnabled = false;
    }
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
    if (currentPage === "obstacleChoice") {
        vaccumObjects();
        return;
    }

    if (currentPage === "optionPage" && buttonStateHistory.length > 0) {
        const previousState = buttonStateHistory.pop();
        currentPage = previousState.page;
        previousState.state.forEach(state => {
            state.button.isVisible = state.isVisible;
            state.button.isEnabled = state.isEnabled;
        });
        if (previousState.page === "mainPage" || previousState.page === "vaccumObjects") {
            isDragEnabled = true; // Re-enable drag if returning to mainPage or vaccumObjects
        }
        adjustDragDisableArea();
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
            adjustDragDisableArea();
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
        adjustDragDisableArea();
    }
}

// Function to adjust dragDisableArea based on the current page
function adjustDragDisableArea() {
    if (currentPage === "mainPage") {
        dragDisableArea.width = blackBgMainPage.width;
        dragDisableArea.height = blackBgMainPage.height;
        dragDisableArea.top = blackBgMainPage.top;
        dragDisableArea.left = blackBgMainPage.left;
        dragDisableArea.horizontalAlignment = blackBgMainPage.horizontalAlignment;
        dragDisableArea.verticalAlignment = blackBgMainPage.verticalAlignment;
    } else if (currentPage === "vaccumObjects") {
        dragDisableArea.width = blackBgVaccumObjects.width;
        dragDisableArea.height = blackBgVaccumObjects.height;
        dragDisableArea.top = blackBgVaccumObjects.top;
        dragDisableArea.left = blackBgVaccumObjects.left;
        dragDisableArea.horizontalAlignment = blackBgVaccumObjects.horizontalAlignment;
        dragDisableArea.verticalAlignment = blackBgVaccumObjects.verticalAlignment;
    }
}
