var createGUI = async function (scene) {

    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    blackBlock = createGuiRectangle("blackBlock", "black", "95%", "97%", .8, 20, "My Robo2", "80px");
    blackBlock.isGUI = true;

    blackBgMainPage = createGuiRectangle("blackBgMainPage", "black", "95%", "20%", .6, 20, "", "0px", "35%");
    blackBgMainPage.isGUI = true;

    blackBgVaccumObjects = createGuiRectangle("blackBgVaccumObjects", "black", "95%", "35%", .6, 20, "", "0px", "27%");
    blackBgVaccumObjects.isGUI = true;

    blackBgOptionsPage = createGuiRectangle("blackBgOptionsPage", "black", "95%", "97%", .8, 20, "Options", "80px");
    blackBgOptionsPage.isGUI = true;
    blackBgOptionsPage.isVisible = false;

    createHomeButton();
    homeButton.isGUI = true;

    createBackButton();
    backButton.isGUI = true;

    createTrashButton();
    trashButton.isGUI = true;

    createOptionsButton();
    optionsButton.isGUI = true;

    sliderPanel = createSlider();
    sliderPanel.isGUI = true;

    excelButton = createExcelButton();
    excelButton.isGUI = true;

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

    vacumBtn = createButtonImaged("vacum", "./assets/img/vaccum_image.png", "42%", "20%", "0", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    vacumBtn.isGUI = true;

    roboticArmBtn = createButtonImaged("roboticArm", "assets/img/robotic_arm_image.png", "42%", "20%", "0%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    roboticArmBtn.isGUI = true;

    droneBtn = createButtonImaged("drone", "assets/img/drone_image.png", "42%", "20%", "25%", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    droneBtn.isGUI = true;

    mowerBtn = createButtonImaged("mower", "assets/img/mower_image.png", "42%", "20%", "25%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    mowerBtn.isGUI = true;

    simulationButton = createButtonImaged("simulationButton", "assets/img/simulation.png", "25%", "12%", "35%", "62%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    simulationButton.isGUI = true;
    simulationButton.isVisible = false;
    simulationButton.isEnabled = false;

    objectBtn = createButtonImaged("objectBtn", "assets/img/objects.png", "25%", "12%", "35%", "18%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    objectBtn.isGUI = true;
    objectBtn.isVisible = false;
    objectBtn.isEnabled = false;

    placeBtn = createButtonImaged("placeBtn", "./assets/img/vaccum_image.png", "25%", "12%", "20%", "5%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    placeBtn.isGUI = true;

    endPoint = createButtonImaged("endPoint", "./assets/img/end_point.png", "25%", "12%", "20%", "38%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    endPoint.isGUI = true;

    block = createButtonImaged("block", "./assets/img/obstacle.png", "25%", "12%", "20%", "70%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    block.isGUI = true;

    placeBtn.isVisible = false;
    placeBtn.isEnabled = false;
    endPoint.isVisible = false;
    endPoint.isEnabled = false;
    block.isVisible = false;
    block.isEnabled = false;

    advancedTexture.addControl(endPoint);
    advancedTexture.addControl(placeBtn);
    advancedTexture.addControl(block);
    advancedTexture.addControl(simulationButton);
    advancedTexture.addControl(objectBtn);

    objectBtn.onPointerUpObservable.add(function() {
        if (isObjectButtonClicked) {
            handleObjectButtonClickDisabled();
        } else {
            handleObjectButtonClick();
        }
        isObjectButtonClicked = !isObjectButtonClicked;
    });

    vacumBtn.onPointerUpObservable.add(mainPage);
    roboticArmBtn.onPointerUpObservable.add(mainPage);
    droneBtn.onPointerUpObservable.add(mainPage);
    mowerBtn.onPointerUpObservable.add(mainPage);
};
