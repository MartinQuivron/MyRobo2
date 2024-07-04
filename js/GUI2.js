// Get the canvas element
var canvas = document.getElementById("renderCanvas");

// Function to start the render loop
var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

/* --- Initialize variables --- */
var engine = null;
var scene = null;
var camera = null;
var sceneToRender = null;
var advancedTexture = null;
var blackBlock = null;
var homeButton = null; 
var simulationButton = null; 
var objectBtn = null; 
var draggedMesh = null; // the object being dragged
var isPointerOverTrashButton = false; // flag to check if the pointer is over the trash button

// Interactive 
var currentPage = "startPage";
var isObjectButtonClicked = false;
var placeBtn = null;
var endPoint = null;
var block = null;
var move = null;

// Image buttons
var vacumBtn = null;
var roboticArmBtn = null;
var droneBtn = null;
var mowerBtn = null;

// WebXR variables
var xrHelper = null;

/* --- Function to create the default engine --- */
var createDefaultEngine = function() {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false});
};

/* --- Function to create the scene --- */
var createScene = async function () {
    var scene = new BABYLON.Scene(engine);

    // Create an arc rotate camera
    camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);

    // Target the camera to the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    // Create a hemispheric light
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);

    // Create a ground mesh
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10}, scene, false);
    ground.isVisible = false;

    // Create an advanced texture for GUI
    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    // Define start and end positions for animation
    const targetPosition = new BABYLON.Vector3(10, 5, 2); // Specific coordinates

    // Create a box mesh
    var model2 = new BABYLON.MeshBuilder.CreateBox("box", {width: 0.2, height: 0.2, depth: 0.2}, scene);
    model2.rotationQuaternion = new BABYLON.Quaternion();
    model2.isVisible = false;

    // Initialize model variables
    var model = null;
    var model1 = null;

    // Import meshes from external files
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "kobuki.rdtf.glb", scene, function (meshes) {
        model = meshes[0];
        model.isVisible = false; 
        model.setEnabled(false);
        attachOwnPointerDragBehavior(model); // Attacher le comportement de glisser-déposer
    });
    
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "flag_in_the_wind.glb", scene, function (meshes) {
        model1 = meshes[0];
        model1.setEnabled(false);
    });

    // Add the GUI rectangle to the advanced texture
    blackBlock = createGuiRectangle("blackBlock", "black", "95%", "97%", .8, 20, "My Robo2", "60px");    
    blackBgMainPage = createGuiRectangle("blackBgMainPage", "black", "95%", "20%", .6, 20, "", "0px", "35%"); // Adjust the top value as needed
    blackBgVaccumObjects = createGuiRectangle("blackBgVaccumObjects", "black", "95%", "35%", .6, 20, "", "0px", "27%"); // Adjust the top value as needed

    createHomeButton();
    createBackButton();
    createTrashButton();
    createOptionsButton();

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

    // Create image buttons
    vacumBtn = createButtonImaged("vacum", "./assets/img/vaccum_image.png", "42%", "20%", "0", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    roboticArmBtn = createButtonImaged("roboticArm", "assets/img/robotic_arm_image.png", "42%", "20%", "0%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    droneBtn = createButtonImaged("drone", "assets/img/drone_image.png", "42%", "20%", "25%", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");
    mowerBtn = createButtonImaged("mower", "assets/img/mower_image.png", "42%", "20%", "25%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white");

    // Create simulation button
    simulationButton = createButtonImaged("simulationButton", "assets/img/simulation.png", "25%", "12%", "35%", "62%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    simulationButton.isVisible = false;  // Initially hide and disable the button
    simulationButton.isEnabled = false;

    // Create object button
    objectBtn = createButtonImaged("objectBtn", "assets/img/objects.png", "25%", "12%", "35%", "18%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    objectBtn.isVisible = false;  // Initially hide and disable the button
    objectBtn.isEnabled = false;


    // Create buttons for user interaction
    placeBtn = createButtonImaged("placeBtn", "./assets/img/vaccum_image.png", "25%", "12%", "20%", "5%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    endPoint = createButtonImaged("endPoint", "./assets/img/end_point.png", "25%", "12%", "20%", "38%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    block = createButtonImaged("block", "./assets/img/obstacle.png", "25%", "12%", "20%", "70%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20, "white", "black");
    
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

    // Create a marker mesh
    const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05 });
    marker.isVisible = false;
    marker.rotationQuaternion = new BABYLON.Quaternion();

    // Create XR experience
    xrHelper = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
        optionalFeatures: true,
    });

    const fm = xrHelper.baseExperience.featuresManager;
    const xrTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");

    // Handle hit test results
    let hitTest;
    xrTest.onHitTestResultObservable.add((results) => {
        if (results.length) {
            hitTest = results[0];
            model.isVisible = false;
            marker.isVisible = true;
            hitTest.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
        } else {
            hitTest = undefined;
            marker.isVisible = false;
        }
    });

    placeBtn.onPointerUpObservable.add(function() {
        if (hitTest && xrHelper.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            model.setEnabled(true);
            model.isVisible = true;
            clonedMesh = model.clone('robot');
            model.isVisible = false;
            model.setEnabled(false);
            hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
            attachOwnPointerDragBehavior(clonedMesh);
        }
    });

    endPoint.onPointerUpObservable.add(function() {
        if (hitTest && xrHelper.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            model1.setEnabled(true);
            model1.isVisible = true;
            clonedMesh = model1.clone('endPoint');
            model1.isVisible = false;
            model1.setEnabled(false);
            hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
            attachOwnPointerDragBehavior(clonedMesh);
        }
    });

    block.onPointerUpObservable.add(function() {
        if (hitTest && xrHelper.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            model2.isVisible = true;
            clonedMesh = model2.clone('block');
            model2.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
            attachOwnPointerDragBehavior(clonedMesh);
        }
    });

    simulationButton.onPointerUpObservable.add(function() {
        if (hitTest && xrHelper.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const meshToMove = scene.getMeshByName('robot');
            const targetMesh = scene.getMeshByName('endPoint');

            if (meshToMove && targetMesh) {
                // Visualisation
                const tube = BABYLON.MeshBuilder.CreateTube("tube", {path: [meshToMove.position, targetMesh.position], radius: 0.015, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, scene);
                tube.color = new BABYLON.Color3(1, 0, 0);
                tube.isVisible = true;

                BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", 30, 60, meshToMove.position, targetMesh.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                BABYLON.MeshBuilder.CreateTube("tube", { path: [meshToMove.position, targetMesh.position], radius: 0.015, instance: tube }, scene);
            }
        }
    });

    return scene;
};

/* --- Function to reset the scene --- */
async function resetScene() {
    // Dispose the current XR session if it exists
    if (xrHelper && xrHelper.baseExperience) {
        await xrHelper.baseExperience.exitXRAsync();
        xrHelper.dispose();
        xrHelper = null;
    }

    // Dispose the current scene
    if (scene) {
        scene.dispose();
    }

    // Recreate the scene
    scene = await createScene();
    sceneToRender = scene;

    // Hide interaction buttons
    startPage(); // Display the start page
  
}

/* --- Initialize the scene and engine --- */
window.initFunction = async function() {
    var asyncEngineCreation = async function() {
        try {
            return createDefaultEngine();
        } catch(e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = await createScene();
    sceneToRender = scene;

    // Add resize event listener
    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
        if (scene && scene.activeCamera && canvas) {
            scene.activeCamera.aspectRatio = engine.getAspectRatio();
        }
    });
};

// Start the initialization process
initFunction().then(() => {
    sceneToRender = scene;
});

// Resize the canvas when the window is resized
window.addEventListener("resize", function () {
    if (engine) {
        engine.resize();
    }
    if (scene && scene.activeCamera && canvas) {
        scene.activeCamera.aspectRatio = engine.getAspectRatio();
    }
});
