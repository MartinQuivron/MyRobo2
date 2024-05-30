// Function to open PC scene
function openPCScene() {
    // TODO: Add implementation
}

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

// Initialize variables
var engine = null;
var scene = null;
var sceneToRender = null;

// Function to create the default engine
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

// Function to create the scene
var createScene = async function () {
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
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10}, scene, false);
    ground.isVisible = false;

    // Create an advanced texture for GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

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
        model.name = "kobuki";
        model.setEnabled(false);
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "arminv.rdtf.glb", scene, function (meshes) {
        model1 = meshes[0];
        model1.setEnabled(false);
    });

    // Create buttons for user interaction
    var placeBtn = BABYLON.GUI.Button.CreateSimpleButton("placeBtn", "Place model");
    placeBtn.width = "25%";
    placeBtn.height = "10%";
    placeBtn.color = "white";
    placeBtn.cornerRadius = 20;
    placeBtn.background = "green";
    placeBtn.top = "35%";
    placeBtn.left = "5%";
    placeBtn.fontSize = "40px";
    placeBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    var endPoint = BABYLON.GUI.Button.CreateSimpleButton("endPoint", "Place endpoint");
    endPoint.width = "25%";
    endPoint.height = "10%";
    endPoint.color = "white";
    endPoint.cornerRadius = 20;
    endPoint.background = "green";
    endPoint.top = "35%";
    endPoint.left = "38%";
    endPoint.fontSize = "40px";
    endPoint.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    var block = BABYLON.GUI.Button.CreateSimpleButton("block", "Place block");
    block.width = "25%";
    block.height = "10%";
    block.color = "white";
    block.cornerRadius = 20;
    block.background = "green";
    block.top = "35%";
    block.left = "70%";
    block.fontSize = "40px";
    block.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    var move = BABYLON.GUI.Button.CreateSimpleButton("move", "Move model");
    move.width = "25%";
    move.height = "10%";
    move.color = "white";
    move.cornerRadius = 20;
    move.background = "green";
    move.top = "45%";
    move.left = "38%";
    move.fontSize = "40px";
    move.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    // Add buttons to the advanced texture
    advancedTexture.addControl(endPoint);
    advancedTexture.addControl(placeBtn);
    advancedTexture.addControl(block);
    advancedTexture.addControl(move);

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

    // Handle button click events
    placeBtn.onPointerUpObservable.add(function() {
        if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            model.setEnabled(true);
            model.isVisible = true;
            clonedMesh = model.clone('clone');
            model.isVisible = false;
            model.setEnabled(false);
            hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
            attachOwnPointerDragBehavior(clonedMesh);
        }
    });

    endPoint.onPointerUpObservable.add(function() {
        if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            model1.setEnabled(true);
            model1.isVisible = true;
            clonedMesh = model1.clone('clone');
            model1.isVisible = false;
            model1.setEnabled(false);
            hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
            attachOwnPointerDragBehavior(clonedMesh);
        }
    });

    block.onPointerUpObservable.add(function() {
        if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            model2.isVisible = true;
            clonedMesh = model2.clone('clone');
            model2.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
            attachOwnPointerDragBehavior(clonedMesh);
        }
    });

    move.onPointerUpObservable.add(function() {
        if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            model.position = targetPosition;
        }
    });

    // Function to attach pointer drag behavior to a mesh
    function attachOwnPointerDragBehavior(mesh){
        var pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
        pointerDragBehavior.moveAttached = false;
        pointerDragBehavior.useObjectOrienationForDragging = false;
        pointerDragBehavior.onDragStartObservable.add((event)=>{
            console.log("startDrag");
            placeBtn.isVisible = false;
            endPoint.isVisible = false;
            block.isVisible = false;
        })
        pointerDragBehavior.onDragObservable.add((event)=>{
            console.log("drag");
            placeBtn.isVisible = false;
            endPoint.isVisible = false;
            block.isVisible = false;
            pointerDragBehavior.attachedNode.position.x += event.delta.x;
            pointerDragBehavior.attachedNode.position.z += event.delta.z;
        })
        pointerDragBehavior.onDragEndObservable.add((event)=>{
            console.log("endDrag");
            placeBtn.isVisible = true;
            endPoint.isVisible = true;
            block.isVisible = true;
        })
        mesh.addBehavior(pointerDragBehavior);
    }

    return scene;
};

// Initialize the scene and engine
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
    window.scene = createScene();
};

// Start the initialization process
initFunction().then(() => {
    scene.then(returnedScene => {
        sceneToRender = returnedScene;
    });
});

// Resize the canvas when the window is resized
window.addEventListener("resize", function () {
    engine.resize();
});