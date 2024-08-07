/**
 * simulation.js
 *
 * This file initializes and manages the main simulation environment for the MyRobo project. 
 * It sets up the Babylon.js engine, creates the scene, and handles user interactions through the GUI.
 *
 * Functions:
 * 1. startRenderLoop: Starts the render loop for the Babylon.js engine.
 * 2. createDefaultEngine: Creates the default Babylon.js engine with specified options.
 * 3. createScene: Sets up the 3D scene, including the camera, lights, and imported meshes.
 * 4. resetScene: Resets the scene by disposing of all meshes and resetting variables.
 * 5. initFunction: Initializes the Babylon.js engine and scene.
 * 
 * Variables:
 * - canvas: The HTML canvas element for rendering the scene.
 * - engine: The Babylon.js engine.
 * - sceneToRender: The scene to be rendered.
 * - robot, obstacle, endPointFlag, etc.: Meshes used in the scene.
 * - meshToMove, colliderMeshToMove, targetMesh, etc.: Variables for managing the main robot and its interactions.
 */

// Get the canvas element
var canvas = document.getElementById("renderCanvas");

// Function to start the render loop
const startRenderLoop = (engine, scene) => {
    engine.runRenderLoop(() => {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
};

// Function to create the default engine
const createDefaultEngine = () => new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });

// Function to create the scene
var createScene = async function () {
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Create an arc rotate camera
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    
    // Create a hemispheric light
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
   
    // Enable physics engine
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    
    // Create a box mesh
    obstacle = BABYLON.MeshBuilder.CreateBox("box", { size: 0.2 }, scene);
    obstacle.isVisible = false;

    obstacle2 = BABYLON.MeshBuilder.CreateSphere("sphereObs", { diameter: 0.2, segments: 32 }, scene);
    obstacle2.isVisible = false;

    obstacle3 = BABYLON.MeshBuilder.CreateCylinder("cylinderObs", { diameterTop: 0.2, diameterBottom: 0.2, height: 0.2, tessellation: 32 }, scene);
    obstacle3.isVisible = false;
    
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

    // Create advanced texture for GUI
    createGUI(scene);

    // Create AR experience
    const ar = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
        optionalFeatures: true,
    });

    const fm = ar.baseExperience.featuresManager;
    const arTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");

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
            meshToMove = scene.getMeshByName('Vaccum Cleaner');
            if (meshToMove) {
                meshToMove.dispose();
                colliderMeshToMove.dispose();
                deleteAllMeshes();
                animationRunning = false;
            } else {  
                robot.setEnabled(true);
                robot.isVisible = true;
                clonedMesh = robot.clone('Vaccum Cleaner');
                robot.isVisible = false;
                robot.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh); // Attach drag behavior
                meshToMove = clonedMesh;
                colliderMeshToMove = BABYLON.Mesh.CreateBox("collider_box", 0, scene, false);		
                var robote = clonedMesh.getBoundingInfo();
                colliderMeshToMove.scaling = new BABYLON.Vector3(clonedMesh.scaling.x / 3, clonedMesh.scaling.y / 8, clonedMesh.scaling.z / 3);
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
            if (targetMesh) {
                targetMesh.dispose();
                deleteAllMeshes();
                animationRunning = false;
            } else { 
                endPointFlag.setEnabled(true);
                endPointFlag.isVisible = true;
                clonedMesh = endPointFlag.clone('endPoint');
                endPointFlag.isVisible = false;
                endPointFlag.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh); // Attach drag behavior
                targetMesh = clonedMesh;

                // Collect end position
                simulationData.endPosition = clonedMesh.position;
                simulationData.endTime = new Date().toISOString();
            }
        }
    });
    
    cubicObstacle.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            obstacle.isVisible = true;
            clonedMesh1 = obstacle.clone('block2');
            obstacle.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh1.scaling, clonedMesh1.rotationQuaternion, clonedMesh1.position);
            attachOwnPointerDragBehavior(clonedMesh1); // Attach drag behavior
            meshBlocks.push(clonedMesh1);
            const collider1 = BABYLON.Mesh.CreateBox("collider_box_block", 0, scene, false);		
            var robote = clonedMesh1.getBoundingInfo();
            collider1.scaling = new BABYLON.Vector3(clonedMesh1.scaling.x / 1.5, clonedMesh1.scaling.y / 4, clonedMesh1.scaling.z / 1.5);
            collider1.parent = clonedMesh1;
            collider1.material = new BABYLON.StandardMaterial("collidermat", scene);
            if (debug) {
                collider1.material.alpha = 0.6;
            } else {
                collider1.material.alpha = 0;
            }
            collider1.position.y += 0.06;
            collider1.isPickable = false;
            colliderMeshBlocks.push(collider1);

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
                console.log("test avant", meshess);
                meshess = scene.meshes;
                console.log("test après", meshess);
                animationBreak = false;
            
                var isTouching = false;
                if (collider1.intersectsMesh(targetMesh, false)) {
                    isTouching = true;
                    console.log("passer le istouching");
                }

                if (isTouching == false) {
                    console.log("passer la dernière étape");
                    //animationRunning = false;
                    animationBreak = false;
                    animationRunning = false;
                    moreBlock = true;
                    var steps = verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
                    console.log("steps", steps);
                    /*if (steps != null) {
                        runAnimation(meshToMove, steps, targetMesh, scene);
                        moreBlock = false;
                    } else {
                        if (rotateAnimation) {
                            rotateAnimation.stop();
                            rotateAnimation = null;
                        }
                        if (moveAnimation) {
                            moveAnimation.stop();
                            moveAnimation = null;
                        }
                        animationRunning = false;
                        deleteAllMeshes();
                    }*/
                }
            }
        }
    });

    cylinderObstacle.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            obstacle3.isVisible = true;
            clonedMesh1 = obstacle3.clone('block2');
            obstacle3.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh1.scaling, clonedMesh1.rotationQuaternion, clonedMesh1.position);
            attachOwnPointerDragBehavior(clonedMesh1); // Attach drag behavior
            meshBlocks.push(clonedMesh1);
            const collider1 = BABYLON.Mesh.CreateBox("collider_box_block", 0, scene, false);		
            var robote = clonedMesh1.getBoundingInfo();
            collider1.scaling = new BABYLON.Vector3(clonedMesh1.scaling.x / 1.5, clonedMesh1.scaling.y / 4, clonedMesh1.scaling.z / 1.5);
            collider1.parent = clonedMesh1;
            collider1.material = new BABYLON.StandardMaterial("collidermat", scene);
            if (debug) {
                collider1.material.alpha = 0.6;
            } else {
                collider1.material.alpha = 0;
            }
            collider1.position.y += 0.06;
            collider1.isPickable = false;
            colliderMeshBlocks.push(collider1);

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
                console.log("test avant", meshess);
                meshess = scene.meshes;
                console.log("test après", meshess);
                animationBreak = false;
            
                var isTouching = false;
                if (collider1.intersectsMesh(targetMesh, false)) {
                    isTouching = true;
                    console.log("passer le istouching");
                }

                if (isTouching == false) {
                    console.log("passer la dernière étape");
                    //animationRunning = false;
                    animationBreak = false;
                    animationRunning = false;
                    moreBlock = true;
                    var steps = verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
                    console.log("steps", steps);
                    /*if (steps != null) {
                        runAnimation(meshToMove, steps, targetMesh, scene);
                        moreBlock = false;
                    } else {
                        if (rotateAnimation) {
                            rotateAnimation.stop();
                            rotateAnimation = null;
                        }
                        if (moveAnimation) {
                            moveAnimation.stop();
                            moveAnimation = null;
                        }
                        animationRunning = false;
                        deleteAllMeshes();
                    }*/
                }
            }
        }
    });

    sphereObstacle.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            obstacle2.isVisible = true;
            clonedMesh1 = obstacle2.clone('block2');
            obstacle2.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh1.scaling, clonedMesh1.rotationQuaternion, clonedMesh1.position);
            attachOwnPointerDragBehavior(clonedMesh1); // Attach drag behavior
            meshBlocks.push(clonedMesh1);
            const collider1 = BABYLON.Mesh.CreateBox("collider_box_block", 0, scene, false);		
            var robote = clonedMesh1.getBoundingInfo();
            collider1.scaling = new BABYLON.Vector3(clonedMesh1.scaling.x / 1.5, clonedMesh1.scaling.y / 4, clonedMesh1.scaling.z / 1.5);
            collider1.parent = clonedMesh1;
            collider1.material = new BABYLON.StandardMaterial("collidermat", scene);
            if (debug) {
                collider1.material.alpha = 0.6;
            } else {
                collider1.material.alpha = 0;
            }
            collider1.position.y += 0.06;
            collider1.isPickable = false;
            colliderMeshBlocks.push(collider1);

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
                console.log("test avant", meshess);
                meshess = scene.meshes;
                console.log("test après", meshess);
                animationBreak = false;
            
                var isTouching = false;
                if (collider1.intersectsMesh(targetMesh, false)) {
                    isTouching = true;
                    console.log("passer le istouching");
                }

                if (isTouching == false) {
                    console.log("passer la dernière étape");
                    //animationRunning = false;
                    animationBreak = false;
                    animationRunning = false;
                    moreBlock = true;
                    var steps = verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
                    console.log("steps", steps);
                    /*if (steps != null) {
                        runAnimation(meshToMove, steps, targetMesh, scene);
                        moreBlock = false;
                    } else {
                        if (rotateAnimation) {
                            rotateAnimation.stop();
                            rotateAnimation = null;
                        }
                        if (moveAnimation) {
                            moveAnimation.stop();
                            moveAnimation = null;
                        }
                        animationRunning = false;
                        deleteAllMeshes();
                    }*/
                }
            }
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
            if (!isDragEnabled) return; // Check if drag is enabled
            console.log("startDrag");
            if (lines[0] == null) {
                animationRunning = false;
            }
            if (animationRunning == true) {
                deleteAllMeshes();
            }
            draggedMesh = mesh;
            positionDraggedMesh = mesh.position.clone();
            hideAndDisableAllButtons();
            trashButton.isVisible = true;
            trashButton.isEnabled = true;
        });

        pointerDragBehavior.onDragObservable.add((event) => {
            if (!isDragEnabled) return; // Check if drag is enabled
            if (draggedMesh === mesh) {  // Ensure only the selected mesh is moved
                console.log("drag");
                if (animationRunning == true) {
                    if (rotateAnimation) {
                        rotateAnimation.stop();
                        rotateAnimation = null;
                    }
                    if (moveAnimation) {
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
            if (!isDragEnabled) return; // Check if drag is enabled
            if (draggedMesh === mesh) {  // Ensure only the selected mesh triggers end drag
                console.log("endDrag");
                var collider_box_blocks = [];
                scene.meshes.forEach(function(mesh) {
                    if (mesh.name === 'collider_box_block') {
                        collider_box_blocks.push(mesh);
                    }
                });
                const isTouchingTargetMesh = isTouching(draggedMesh, collider_box_blocks);
                if (mesh.name != "block2" && isTouchingTargetMesh) {
                    console.log("isTouchingTargetMesh:", isTouchingTargetMesh);
                    draggedMesh.position = positionDraggedMesh;
                }
                if (animationRunning == true && (isTouchingTargetMesh == false || mesh.name === "block2")) {
                    //animationRunning = false;
                    animationBreak = false;
                    animationRunning = false;
                    var steps = verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
                    if (steps != null) {
                        runAnimation(meshToMove, steps, targetMesh, scene);
                    } else {
                        if (rotateAnimation) {
                            rotateAnimation.stop();
                            rotateAnimation = null;
                        }
                        if (moveAnimation) {
                            moveAnimation.stop();
                            moveAnimation = null;
                        }
                        animationRunning = false;
                        deleteAllMeshes();
                    }
                }

                hideAndDisableAllButtons();
                if (currentPage === "vaccumObjects") {
                    vaccumObjects();
                }
                if (currentPage === "mainPage") {
                    mainPage();
                }
                if (currentPage === "obstacleChoice") {
                    obstacleChoice();  // Réafficher la page obstacleChoice
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
            if (animationRunning == false) {
                meshess = scene.meshes;
                console.log("test avant", meshess);
                var steps = verificationAndTrajectory(meshToMove, targetMesh, scene, meshess);
                if (steps != null) {
                    runAnimation(meshToMove, steps, targetMesh, scene);
                } else {
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
                }
            } else {
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
            }
        }
    });

    return scene;
};

// Function to reset the scene
async function resetScene() {
    // Reset the scene
    deleteAllMeshes(); // Delete all meshes
    animationRunning = false; // Stop the animation
    animationBreak = false; // Reset the animation break flag
    if (meshToMove) {
        meshToMove.dispose(); // Dispose the mesh to move
        meshToMove = null; // Reset the mesh to move
    }
    if (colliderMeshToMove) {
        colliderMeshToMove.dispose(); // Dispose the collider
        colliderMeshToMove = null; // Reset the collider mesh to move
    }
    if (targetMesh) {
        targetMesh.dispose(); // Dispose the target mesh
        targetMesh = null; // Reset the target mesh
    }

    // Delete all meshes named "line"
    meshBlocks.forEach(function(meshBlock) {
        meshBlock.dispose();
    });
    meshBlocks = [];

    // Delete all meshes named "line"
    colliderMeshBlocks.forEach(function(colliderMeshBlock) {
        colliderMeshBlock.dispose();
    });
    colliderMeshBlocks = [];

    spheres = [];
    rays = [];
    lines = [];

    meshess = [];
    obstacles = [];

    // Hide interaction buttons
    startPage(); // Display the start page
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
