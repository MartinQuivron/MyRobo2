/**
 * GUI.js - This file manages the creation and interaction of the graphical user interface (GUI) elements
 * for the MyRobo2 application. It includes functions for creating and handling buttons, sliders, and other
 * interactive elements using the Babylon.js GUI extension.
 */

var createGUI = async function (scene) {
    // Create an advanced texture for GUI
    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    // Add the GUI rectangle to the advanced texture
    blackBlock = createGuiRectangle("blackBlock", "black", "95%", "97%", .8, 20, "MyRobo", "80px");
    blackBgMainPage = createGuiRectangle("blackBgMainPage", "black", "95%", "20%", .6, 20, "", "0px", "35%"); // Adjust the top value as needed
    blackBgVaccumObjects = createGuiRectangle("blackBgVaccumObjects", "black", "95%", "35%", .6, 20, "", "0px", "27%"); // Adjust the top value as needed
    blackBgOptionsPage = createGuiRectangle("blackBgOptionsPage", "black", "95%", "97%", .8, 20, "Options", "80px");
    blackBgOptionsPage.isVisible = false;

    // Create and add essential buttons to the GUI
    createHomeButton();
    createBackButton();
    createTrashButton();
    createOptionsButton();
    sliderPanel = createSlider();
    createExcelButton();
    debugButton = createDebugButton();
    createResetButton();

    // Create and add a drag disable area to the GUI
    dragDisableArea = createDragDisableArea();
    advancedTexture.addControl(dragDisableArea);
    allButtons.push(dragDisableArea);

    // Add buttons and rectangles to the advanced texture
    advancedTexture.addControl(homeButton);
    advancedTexture.addControl(backButton);
    advancedTexture.addControl(trashButton);
    advancedTexture.addControl(optionsButton);
    advancedTexture.addControl(blackBlock);
    allButtons.push(blackBlock);
    advancedTexture.addControl(blackBgMainPage);
    allButtons.push(blackBgMainPage);
    advancedTexture.addControl(blackBgVaccumObjects);
    allButtons.push(blackBgVaccumObjects);
    advancedTexture.addControl(blackBgOptionsPage);
    allButtons.push(blackBgOptionsPage);
    advancedTexture.addControl(debugButton);
    allButtons.push(debugButton);
    advancedTexture.addControl(resetButtonContainer);

    // Create and add image buttons for different robots and simulation controls
    vacumBtn = createButtonImaged("vacum", "./assets/img/vaccum_image.png", "42%", "20%", "0", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "", false, 10, 1);
    vacumBtn.zIndex = 10; 
    roboticArmBtn = createButtonImaged("roboticArm", "assets/img/robotic_arm_image.png", "42%", "20%", "0%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "", false, 10, .5);
    roboticArmBtn.zIndex = 10; 
    droneBtn = createButtonImaged("drone", "assets/img/drone_image.png", "42%", "20%", "25%", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "", false, 10, .5);
    droneBtn.zIndex = 10; 
    mowerBtn = createButtonImaged("mower", "assets/img/mower_image.png", "42%", "20%", "25%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "", false, 10, .5);
    mowerBtn.zIndex = 10; 

    // Create and add simulation button with drag disable behavior
    simulationButton = createButtonImaged("simulationButton", "assets/img/simulation.png", "25%", "12%", "35%", "62%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black", true);
    simulationButton.zIndex = 10; 
    simulationButton.isVisible = false; 
    simulationButton.isEnabled = false;

    // Create and add object button with drag disable behavior
    objectBtn = createButtonImaged("objectBtn", "assets/img/objects.png", "25%", "12%", "35%", "18%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black", true);
    objectBtn.zIndex = 10; 
    objectBtn.isVisible = false;  
    objectBtn.isEnabled = false;

    // Create and add user interaction buttons for placing objects in the scene
    placeBtn = createButtonImaged("placeBtn", "./assets/img/vaccum_image.png", "25%", "12%", "20%", "5%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black", true);
    placeBtn.zIndex = 10; 
    endPoint = createButtonImaged("endPoint", "./assets/img/end_point.png", "25%", "12%", "20%", "38%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black", true);
    endPoint.zIndex = 10; 
    block = createButtonImaged("block", "./assets/img/obstacle.png", "25%", "12%", "20%", "70%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black", true);
    block.zIndex = 10; 

    // Create and add obstacle buttons with drag disable behavior
    cubicObstacle = createButtonImaged("cubicObstacle", "./assets/img/cube.png", "25%", "12%", "20%", "5%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "", "", true);
    cubicObstacle.zIndex = 10;
    cubicObstacle.isVisible = false;
    cubicObstacle.isEnabled = false;
    addDragDisableBehavior(cubicObstacle);

    sphereObstacle = createButtonImaged("sphereObstacle", "./assets/img/sphere2.png", "25%", "12%", "20%", "38%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "", "", true);
    sphereObstacle.zIndex = 10;
    sphereObstacle.isVisible = false;
    sphereObstacle.isEnabled = false;
    addDragDisableBehavior(sphereObstacle);

    cilinderObstacle = createButtonImaged("cilinderObstacle", "./assets/img/cilinder.png", "25%", "12%", "20%", "70%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "", "", true);
    cilinderObstacle.zIndex = 10;
    cilinderObstacle.isVisible = false;
    cilinderObstacle.isEnabled = false;
    addDragDisableBehavior(cilinderObstacle);

    backToVaccumObjects = createButtonImaged("backToVaccumObjects", "assets/img/backSimulation.png", "25%", "12%", "35%", "18%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black", true);
    backToVaccumObjects.zIndex = 10; 
    backToVaccumObjects.isVisible = false; 
    backToVaccumObjects.isEnabled = false;
    addDragDisableBehavior(backToVaccumObjects);

    // Initially hide and disable the user interaction buttons
    placeBtn.isVisible = false;
    placeBtn.isEnabled = false;
    endPoint.isVisible = false;
    endPoint.isEnabled = false;
    block.isVisible = false;
    block.isEnabled = false;

    // Add user interaction buttons to the advanced texture
    advancedTexture.addControl(endPoint);
    advancedTexture.addControl(placeBtn);
    advancedTexture.addControl(block);
    advancedTexture.addControl(simulationButton);
    advancedTexture.addControl(objectBtn);
    advancedTexture.addControl(cubicObstacle);
    advancedTexture.addControl(sphereObstacle);
    advancedTexture.addControl(cilinderObstacle);
    advancedTexture.addControl(backToVaccumObjects);

    // Attach event handlers to buttons
    objectBtn.onPointerUpObservable.add(function() {
        if (isObjectButtonClicked) {
            handleObjectButtonClickDisabled();
        } else {
            handleObjectButtonClick();
        }
        // Toggle the flag
        isObjectButtonClicked = !isObjectButtonClicked;
    });

    vacumBtn.onPointerUpObservable.add(mainPage);
    roboticArmBtn.onPointerUpObservable.add(); // for future use
    droneBtn.onPointerUpObservable.add(); // for future use
    mowerBtn.onPointerUpObservable.add(); // for future use

    block.onPointerUpObservable.add(obstacleChoice); 
    backToVaccumObjects.onPointerUpObservable.add(vaccumObjects);
};
