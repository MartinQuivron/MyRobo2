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

// Function to create the "Options" button
function createOptionsButton() {
    optionsButton = BABYLON.GUI.Button.CreateImageOnlyButton("optionsButton", "./assets/img/options.png");
    optionsButton.width = "10%";
    optionsButton.height = "4.5%";
    optionsButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    optionsButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    optionsButton.left = "-5%";
    optionsButton.top = "5%";
    optionsButton.zIndex = 2;
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

function createExcelButton() {
    const excelButton = BABYLON.GUI.Button.CreateSimpleButton("excelButton", "Generate Excel");
    excelButton.width = "150px";
    excelButton.height = "40px";
    excelButton.color = "white";
    excelButton.cornerRadius = 20;
    excelButton.background = "green";
    excelButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    excelButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    excelButton.left = "0px";
    excelButton.top = "10%";
    excelButton.isVisible = false;
    excelButton.isEnabled = false;

    excelButton.onPointerUpObservable.add(() => {
        // Example of simulation data
        const simulationData = [
            { "Time": "0s", "Value": 10 },
            { "Time": "1s", "Value": 20 },
            { "Time": "2s", "Value": 30 }
        ];

        generateExcel(simulationData);
    });

    advancedTexture.addControl(excelButton);
    allButtons.push(excelButton);

    return excelButton;
}

function createSlider() {
    var panel = new BABYLON.GUI.StackPanel();
    panel.zIndex = 2;
    panel.width = "80%"; 
    panel.height = "20%"; 
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP; 
    panel.top = "30%"; 

    var header = new BABYLON.GUI.TextBlock();
    header.text = "Speed: " + "1";
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
    slider.minimum = 1;
    slider.maximum = 10;
    slider.value = 1;
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
        slider.value = roundedValue; 
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

    // Create and make visible the Excel button
    const excelButton = createExcelButton();
    excelButton.isVisible = true;
    excelButton.isEnabled = true;

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
    var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 1, 0) });
    pointerDragBehavior.moveAttached = false;
    pointerDragBehavior.useObjectOrienationForDragging = false;

    pointerDragBehavior.onDragStartObservable.add((event) => {
        console.log("startDrag");
        draggedMesh = mesh;
        hideAndDisableAllButtons();
        trashButton.isVisible = true;
        trashButton.isEnabled = true;
    });

    pointerDragBehavior.onDragObservable.add((event) => {
        if (draggedMesh) {
            console.log("drag");
            hideAndDisableAllButtons();
            trashButton.isVisible = true;
            trashButton.isEnabled = true;

            pointerDragBehavior.attachedNode.position.x += event.delta.x;
            pointerDragBehavior.attachedNode.position.z += event.delta.z;
        }
    });

    pointerDragBehavior.onDragEndObservable.add((event) => {
        if (draggedMesh) {
            console.log("endDrag");
            hideAndDisableAllButtons();
            if (currentPage === "vaccumObjects") {
                vaccumObjects();
            }
            if (currentPage === "mainPage") {
                mainPage();
            }

            console.log("isPointerOverTrashButton:", isPointerOverTrashButton);

            if (!isPointerOverTrashButton) {
                console.log("Mesh not disposed, isPointerOverTrashButton:", isPointerOverTrashButton);
            }

            draggedMesh = null; // Réinitialise la variable
        }
    });

    mesh.addBehavior(pointerDragBehavior);
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
