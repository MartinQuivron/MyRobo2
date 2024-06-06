// Function to create buttons
function createButton(name, text, width, height, color, cornerRadius, background, top, left, fontSize, horizontalAlignment, advancedTexture) {
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
    advancedTexture.addControl(button);
    return button;
}

// Function to open PC scene
function openPCScene() {
    // TODO: Add implementation
}

// Get the canvas element
var canvas = document.getElementById("renderCanvas");

// Function to start the render loop
var startRenderLoop = function(engine, canvas) {
    engine.runRenderLoop(function() {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

// Initialize variables
var engine = null;
var scene = null;
var sceneToRender = null;

// Function to create the default engine
var createDefaultEngine = function() {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
};

// Function to create the scene
var createScene = async function() {
    var scene = new BABYLON.Scene(engine);

    // Create an arc rotate camera
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);

    // Target the camera to the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(canvas, true);

    // Create a hemispheric light
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);

    // Create a ground mesh
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene, false);
    ground.isVisible = false;

    // Create an advanced texture for GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Define start and end positions for animation
    const targetPosition = new BABYLON.Vector3(10, 5, 2); // Specific coordinates

    // Create a box mesh
    var model2 = new BABYLON.MeshBuilder.CreateBox("box", { width: 0.2, height: 0.2, depth: 0.2 }, scene);
    model2.rotationQuaternion = new BABYLON.Quaternion();
    model2.isVisible = false;

    // Initialize model variables
    var model = null;
    var model1 = null;

    // Import meshes from external files
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "kobuki.rdtf.glb", scene, function(meshes) {
        model = meshes[0];
        model.setEnabled(false);
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "flag_in_the_wind.glb", scene, function(meshes) {
        model1 = meshes[0];
        model1.setEnabled(false);
    });

    // Create a GUI rectangle to represent the black block
    var blackBlock = new BABYLON.GUI.Rectangle("blackBlock");
    blackBlock.width = "95%";
    blackBlock.height = "97%";
    blackBlock.color = "black";
    blackBlock.alpha = 0.6;
    blackBlock.thickness = 0;
    blackBlock.background = "black";
    blackBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    blackBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    // Add the GUI rectangle to the advanced texture
    advancedTexture.addControl(blackBlock);

    // Create buttons using the createButton function
    createButton("vaccum", "Vaccum", "42%", "20%", "#9a1673", 50, "white", "0", "6%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture);
    createButton("roboticArm", "Robotic Arm", "42%", "20%", "#9a1673", 50, "white", "0%", "52%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture);
    createButton("drone", "Delivery Drone", "42%", "20%", "#9a1673", 50, "white", "25%", "6%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture);
    createButton("mower", "Land Mower", "42%", "20%", "#9a1673", 50, "white", "25%", "52%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture);

    // Create a marker mesh
    const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05 });
    marker.isVisible = false;
    marker.rotationQuaternion = new BABYLON.Quaternion();

    // Create XR experience
    const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
        optionalFeatures: true,
    });

    const fm = xr.baseExperience.featuresManager;
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

    return scene;
};

// Function to request full screen
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

// Initialize the scene and engine
window.initFunction = async function() {
    var asyncEngineCreation = async function() {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();

    // Request full screen
    requestFullscreen(canvas);
};

// Start the initialization process
initFunction().then(() => {
    scene.then(returnedScene => {
        sceneToRender = returnedScene;
    });
});

// Resize the canvas when the window is resized
window.addEventListener("resize", function() {
    engine.resize();
});
