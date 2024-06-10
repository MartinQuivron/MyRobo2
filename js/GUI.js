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

// Function to handle button clicks
function handleButtonClick(buttonId, advancedTexture) {
    buttonPressed = buttonId;
    console.log("Button pressed: " + buttonPressed);

    // Hide and disable all buttons
    advancedTexture.getDescendants().forEach(control => {
        if (control instanceof BABYLON.GUI.Rectangle || control instanceof BABYLON.GUI.Button) {
            control.isVisible = false;
            control.isEnabled = false;
            console.log("Control hidden: " + control.name);
        }
    });

    // Trigger a render update
    engine.beginFrame();
    scene.render();
    engine.endFrame();
}

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

    button.onPointerClickObservable.add(function() {
        handleButtonClick(button.name, advancedTexture);
    });

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
    

    // Create an image
    var image = new BABYLON.GUI.Image(name + "_image", imageUrl);
    image.width = "100%";
    image.height = "100%";

    // Add the image to the button container
    buttonContainer.addControl(image);

    // Add the button container to the advanced texture
    advancedTexture.addControl(buttonContainer);

    buttonContainer.onPointerClickObservable.add(function() {
        var buttonId = 0;
        switch (name) {
            case "vaccum":
                buttonId = 1;
                break;
            case "roboticArm":
                buttonId = 2;
                break;
            case "drone":
                buttonId = 3;
                break;
            case "mower":
                buttonId = 4;
                break;
        }
        handleButtonClick(buttonId, advancedTexture);
    });

    return buttonContainer;
}



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
    
    // Add the GUI rectangle to the advanced texture
    var blackBlock = createGuiRectangle("blackBlock", "black", "95%", "97%", .8, 20, "My Robo2", "60px");
    advancedTexture.addControl(blackBlock);

    // Create buttons using the createButton function
    createButtonImaged("vaccum", "./assets/img/vaccum_image.jpg", "42%", "20%", "0", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20);
    createButtonImaged("roboticArm", "assets/img/robotic_arm_image.png", "42%", "20%", "0%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20);
    createButtonImaged("drone", "assets/img/drone_image.png", "42%", "20%", "25%", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20);
    createButtonImaged("mower", "assets/img/mower_image.jpg", "42%", "20%", "25%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20);
    
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

    // Variable to track the button presses
    var buttonPressed = 0;

    return scene;
};

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
