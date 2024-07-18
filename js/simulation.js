// Get the canvas element
var canvas = document.getElementById("renderCanvas");

// Function to start the render loop
const startRenderLoop = (engine, scene) => {
    engine.runRenderLoop(() => {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

// Function to create the default engine
const createDefaultEngine = () => new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });

// Function to create the scene
var createScene = async function () {

/* Configuration of the scene BabylonJS ---------------------------------------------------------------- */

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Create an arc rotate camera
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    
    // Create a hemispheric light
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
   
    // Enable physics engine
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    
/* Import objects in the scene ---------------------------------------------------------------- */

    // Create a box mesh
    obstacle = BABYLON.MeshBuilder.CreateBox("box", {size: 0.2}, scene);
    obstacle.isVisible = false;
    
    // Import meshes
    importMeshes("kobuki.rdtf.glb", scene, function (robotMesh) {
        robot = robotMesh;
    });
    importMeshes("flag_in_the_wind.glb", scene, function (flagMesh) {
        endPointFlag = flagMesh;
    });

    // Create a marker mesh
    const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05, updatable: true }, scene);
    marker.isVisible = false;

/* GUI creation ---------------------------------------------------------------- */

    // Create advanced texture for GUI
    createGUI(scene);

/* Enable AR experience ---------------------------------------------------------------- */
    
    // Create AR experience
    const ar = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
        optionalFeatures: true,
    });

    const fm = ar.baseExperience.featuresManager;
    const arTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");

/* Add action to buttons in GUI ---------------------------------------------------------------- */

    // Handle hit test results
    let hitTest;
    arTest.onHitTestResultObservable.add((results) => {
        if (results.length) {
            hitTest = results[0];
            robot.isVisible = false;
            marker.isVisible = true;
            hitTest.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
        } else {
            hitTest = undefined;
            marker.isVisible = false;
        }
    });

    // Handle button click events
    placeBtn.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            meshToMove = scene.getMeshByName('robot');
            if (animationRunning) {
                if (rotateAnimation){
                    rotateAnimation.stop();
                    rotateAnimation = null;
                }
                if (moveAnimation){
                    moveAnimation.stop();
                    moveAnimation = null;
                }
                animationRunning = false;
                deleteAllMeshes();
                //simulationButton.onPointerUpObservable.notifyObservers();
            }
            if (meshToMove) {
                meshToMove.dispose();
                colliderMeshToMove.dispose();
            } else {  
                robot.setEnabled(true);
                robot.isVisible = true;
                clonedMesh = robot.clone('robot');
                robot.isVisible = false;
                robot.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh); // Attach drag behavior
                meshToMove = clonedMesh;
                colliderMeshToMove = BABYLON.Mesh.CreateBox("collider_box", 0, scene, false);		
                var robote = clonedMesh.getBoundingInfo();
                colliderMeshToMove.scaling = new BABYLON.Vector3(clonedMesh.scaling.x/3, clonedMesh.scaling.y/8, clonedMesh.scaling.z/3);
                colliderMeshToMove.parent = clonedMesh;
                colliderMeshToMove.material = new BABYLON.StandardMaterial("collidermat", scene);
                colliderMeshToMove.material.alpha = 0;
                colliderMeshToMove.position.y += 0.06;
            }
        }
    });
    
    endPoint.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            targetMesh = scene.getMeshByName('endPoint');
            if (animationRunning) {
                if (rotateAnimation){
                    rotateAnimation.stop();
                    rotateAnimation = null;
                }
                if (moveAnimation){
                    moveAnimation.stop();
                    moveAnimation = null;
                }
                animationRunning = false;
                deleteAllMeshes();
                //simulationButton.onPointerUpObservable.notifyObservers();
            }
            if (targetMesh) {
                targetMesh.dispose();
            } else { 
                endPointFlag.setEnabled(true);
                endPointFlag.isVisible = true;
                clonedMesh = endPointFlag.clone('endPoint');
                endPointFlag.isVisible = false;
                endPointFlag.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh); // Attach drag behavior
                targetMesh = clonedMesh;
            }
        }
    });
    
    block.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            if (animationRunning == true) {
                if (rotateAnimation){
                    rotateAnimation.stop();
                    rotateAnimation = null;
                }
                if (moveAnimation){
                    moveAnimation.stop();
                    moveAnimation = null;
                }
                deleteAllMeshes();
                meshess = scene.meshes;
                animationBreak = false;
                var steps = verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
                runAnimation(meshToMove, steps, targetMesh, scene);
            }
            obstacle.isVisible = true;
            clonedMesh1 = obstacle.clone('block2');
            obstacle.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh1.scaling, clonedMesh1.rotationQuaternion, clonedMesh1.position);
            attachOwnPointerDragBehavior(clonedMesh1); // Attach drag behavior
            meshBlocks.push(clonedMesh1);
            const collider1 = BABYLON.Mesh.CreateBox("collider_box_block", 0, scene, false);		
            var robote = clonedMesh1.getBoundingInfo();
            collider1.scaling = new BABYLON.Vector3(clonedMesh1.scaling.x/1.5, clonedMesh1.scaling.y/4, clonedMesh1.scaling.z/1.5);
            collider1.parent = clonedMesh1;
            collider1.material = new BABYLON.StandardMaterial("collidermat", scene);
            collider1.material.alpha = 0.6;
            collider1.position.y += 0.06;
            colliderMeshBlocks.push(collider1);
        }
    });

    // Control trash button
    trashButton.onPointerEnterObservable.add(() => {
        if (draggedMesh) {
            isPointerOverTrashButton = true;
            scene.getMeshByName(draggedMesh.name).dispose();  // Dispose the dragged mesh immediately
            draggedMesh = null;  // Reset the dragged mesh to avoid further interactions
        }
    });

    trashButton.onPointerOutObservable.add(() => {
        if (draggedMesh) {
            isPointerOverTrashButton = false;
        }
    });

    function attachOwnPointerDragBehavior(mesh) {
        var pointerDragBehavior = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 1, 0) });
        pointerDragBehavior.moveAttached = false;
        pointerDragBehavior.useObjectOrienationForDragging = false;
    
        pointerDragBehavior.onDragStartObservable.add((event) => {
            console.log("startDrag");
            if (animationRunning == true) {
                deleteAllMeshes();
            }
            draggedMesh = mesh;
            hideAndDisableAllButtons();
            trashButton.isVisible = true;
            trashButton.isEnabled = true;
        });
    
        pointerDragBehavior.onDragObservable.add((event) => {
            if (draggedMesh === mesh) {  // Ensure only the selected mesh is moved
                console.log("drag");
                if (animationRunning == true) {
                    if (rotateAnimation){
                        rotateAnimation.stop();
                        rotateAnimation = null;
                    }
                    if (moveAnimation){
                        moveAnimation.stop();
                        moveAnimation = null;
                    }
                    deleteAllMeshes();
                    meshess = scene.meshes;
                    verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
                }
    
                hideAndDisableAllButtons();
                trashButton.isVisible = true;
                trashButton.isEnabled = true;
    
                pointerDragBehavior.attachedNode.position.x += event.delta.x;
                pointerDragBehavior.attachedNode.position.z += event.delta.z;
            }
        });
    
        pointerDragBehavior.onDragEndObservable.add((event) => {
            if (draggedMesh === mesh) {  // Ensure only the selected mesh triggers end drag
                console.log("endDrag");
                if (animationRunning == true) {
                    //animationRunning = false;
                    animationBreak = false;
                    var steps = verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
                    runAnimation(meshToMove, steps, targetMesh, scene);
                }
    
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
    
                draggedMesh = null; // Reset the variable
            }
        });
    
        mesh.addBehavior(pointerDragBehavior);
    }
    
    
    // Handle button click events
    simulationButton.onPointerUpObservable.add(async function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {

            meshess = scene.meshes;
            console.log("test avant", meshess);
            var steps = verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
            runAnimation(meshToMove, steps, targetMesh, scene);

        }
    });
    
    return scene;
};

/* Configuration ---------------------------------------------------------------- */

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