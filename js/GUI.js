/* --- Function to create the scene --- */
var createGUI = async function (scene) {

    // Create an advanced texture for GUI
    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    // Add the GUI rectangle to the advanced texture
    blackBlock = createGuiRectangle("blackBlock", "black", "95%", "97%", .8, 20, "My Robo2", "80px");    
    blackBgMainPage = createGuiRectangle("blackBgMainPage", "black", "95%", "20%", .6, 20, "", "0px", "35%"); // Adjust the top value as needed
    blackBgVaccumObjects = createGuiRectangle("blackBgVaccumObjects", "black", "95%", "35%", .6, 20, "", "0px", "27%"); // Adjust the top value as needed
    blackBgOptionsPage = createGuiRectangle("blackBgOptionsPage", "black", "95%", "97%", .8, 20, "Options", "80px");
    blackBgOptionsPage.isVisible = false;

    createHomeButton();
    createBackButton();
    createTrashButton();
    createOptionsButton();
    sliderPanel = createSlider();
    excelButton = createExcelButton();

    advancedTexture.addControl(homeButton); // Call the function to create and add the home button
    advancedTexture.addControl(backButton); // Call the function to create and add the back button
    advancedTexture.addControl(trashButton); // Call the function to create and add the trash button
    advancedTexture.addControl(optionsButton); // Call the function to create and add the options button
    advancedTexture.addControl(blackBlock); // Add the black block to the advanced texture
    allButtons.push(blackBlock);
    advancedTexture.addControl(blackBgMainPage); 
    allButtons.push(blackBgMainPage);
    advancedTexture.addControl(blackBgVaccumObjects);
    allButtons.push(blackBgVaccumObjects);
    advancedTexture.addControl(blackBgOptionsPage);
    allButtons.push(blackBgOptionsPage);

    // Create image buttons
    vacumBtn = createButtonImaged("vacum", "./assets/img/vaccum_image.png", "42%", "20%", "0", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    vacumBtn.zIndex = 10; // Assurer un zIndex élevé
    roboticArmBtn = createButtonImaged("roboticArm", "assets/img/robotic_arm_image.png", "42%", "20%", "0%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    roboticArmBtn.zIndex = 10; // Assurer un zIndex élevé
    droneBtn = createButtonImaged("drone", "assets/img/drone_image.png", "42%", "20%", "25%", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    droneBtn.zIndex = 10; // Assurer un zIndex élevé
    mowerBtn = createButtonImaged("mower", "assets/img/mower_image.png", "42%", "20%", "25%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    mowerBtn.zIndex = 10; // Assurer un zIndex élevé

    // Create simulation button
    simulationButton = createButtonImaged("simulationButton", "assets/img/simulation.png", "25%", "12%", "35%", "62%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    simulationButton.zIndex = 10; // Assurer un zIndex élevé
    simulationButton.isVisible = false;  // Initially hide and disable the button
    simulationButton.isEnabled = false;

    // Create object button
    objectBtn = createButtonImaged("objectBtn", "assets/img/objects.png", "25%", "12%", "35%", "18%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    objectBtn.zIndex = 10; // Assurer un zIndex élevé
    objectBtn.isVisible = false;  // Initially hide and disable the button
    objectBtn.isEnabled = false;

    // Create buttons for user interaction
    placeBtn = createButtonImaged("placeBtn", "./assets/img/vaccum_image.png", "25%", "12%", "20%", "5%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    placeBtn.zIndex = 10; // Assurer un zIndex élevé
    endPoint = createButtonImaged("endPoint", "./assets/img/end_point.png", "25%", "12%", "20%", "38%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    endPoint.zIndex = 10; // Assurer un zIndex élevé
    block = createButtonImaged("block", "./assets/img/obstacle.png", "25%", "12%", "20%", "70%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    block.zIndex = 10; // Assurer un zIndex élevé
    
    // Initially hide and disable the buttons
    placeBtn.isVisible = false;
    placeBtn.isEnabled = false;
    endPoint.isVisible = false;
    endPoint.isEnabled = false;
    block.isVisible = false;
    block.isEnabled = false;

    // Add buttons to the advanced texture
    advancedTexture.addControl(endPoint);
    advancedTexture.addControl(placeBtn);
    advancedTexture.addControl(block);
    advancedTexture.addControl(simulationButton);  // Add the simulation button to the advanced texture
    advancedTexture.addControl(objectBtn);  // Add the object button to the advanced texture

    // Attach event handlers
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
    roboticArmBtn.onPointerUpObservable.add(mainPage);
    droneBtn.onPointerUpObservable.add(mainPage);
    mowerBtn.onPointerUpObservable.add(mainPage);
};