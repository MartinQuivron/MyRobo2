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
    var obstacle = BABYLON.MeshBuilder.CreateBox("box", {size: 0.2}, scene);
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
            const meshToMove = scene.getMeshByName('robot');
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
            } else {  
                robot.setEnabled(true);
                robot.isVisible = true;
                clonedMesh = robot.clone('robot');
                robot.isVisible = false;
                robot.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh); // Attach drag behavior
                const collider = BABYLON.Mesh.CreateBox("collider_box", 0, scene, false);		
                var robote = clonedMesh.getBoundingInfo();
                collider.scaling = new BABYLON.Vector3(clonedMesh.scaling.x/3, clonedMesh.scaling.y/8, clonedMesh.scaling.z/3);
                collider.parent = clonedMesh;
                collider.material = new BABYLON.StandardMaterial("collidermat", scene);
                collider.material.alpha = 0;
                collider.position.y += 0.06;
            }
        }
    });
    
    endPoint.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const targetMesh = scene.getMeshByName('endPoint');
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
            }
        }
    });
    
    block.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
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
            obstacle.isVisible = true;
            clonedMesh1 = obstacle.clone('block2');
            obstacle.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh1.scaling, clonedMesh1.rotationQuaternion, clonedMesh1.position);
            attachOwnPointerDragBehavior(clonedMesh1); // Attach drag behavior
            const collider1 = BABYLON.Mesh.CreateBox("collider_box_block", 0, scene, false);		
            var robote = clonedMesh1.getBoundingInfo();
            collider1.scaling = new BABYLON.Vector3(clonedMesh1.scaling.x/1.5, clonedMesh1.scaling.y/4, clonedMesh1.scaling.z/1.5);
            collider1.parent = clonedMesh1;
            collider1.material = new BABYLON.StandardMaterial("collidermat", scene);
            collider1.material.alpha = 0.6;
            collider1.position.y += 0.06;
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
    
    // Handle button click events
    simulationButton.onPointerUpObservable.add(async function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const meshToMove = scene.getMeshByName('robot');
            const targetMesh = scene.getMeshByName('endPoint');

            if (meshToMove && targetMesh) {

                var collider_box_blocks = [];
                scene.meshes.forEach(function(mesh) {
                    if (mesh.name === 'collider_box_block') {
                        collider_box_blocks.push(mesh);
                    }
                });

                var isTouchingTargetMesh = isTouching(targetMesh, collider_box_blocks);
                var isTouchingMeshToMove = isTouching(meshToMove, collider_box_blocks);

                if (isTouchingTargetMesh == false && isTouchingMeshToMove == false) {
                    var steps = [meshToMove.position, targetMesh.position];
                    var pickInfo = frontDetector(meshToMove.position, targetMesh.position, scene);
                    //console.log("meshToMove:", meshToMove.position);
                    //console.log("targetMesh:", targetMesh.position);
                    console.log("PickInfo:", pickInfo);
                    
                    if (pickInfo == null) {
                        console.log("No intersection");
                        new Promise((resolve, reject) => {
                            var directionToTarget = targetMesh.position.subtract(meshToMove.position);
                            var angleToRotate = Math.atan2(directionToTarget.x, directionToTarget.z);
                            var rotateAnimation  = BABYLON.Animation.CreateAndStartAnimation("rotateAnimation", meshToMove, "rotationQuaternion", 60, 60, meshToMove.rotationQuaternion, BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, angleToRotate), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
                        });
                        new Promise((resolve, reject) => {
                            var distance = BABYLON.Vector3.Distance(meshToMove.position, targetMesh.position);
                            var speed = (20 + (distance) * (40-20 / distance)) / 7;
                            var moveAnimation = BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", speed*10, 60, meshToMove.position, targetMesh.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
                        });

                    }
                    // Check if there was an intersection
                    if (pickInfo.hit) {
    
                        console.log("pickInfo:", pickInfo);
    
                        console.log("Intersection");
                        var intersectionPoint = pickInfo.pickedPoint;
                        steps.splice(steps.length - 1, 0, intersectionPoint);
    
                        var allBlock = 0;
    
                        while (pickInfo.pickedMesh.name == 'collider_box_block') {
    
                            intersectionPoint = pickInfo.pickedPoint;
    
                            // Get the cube mesh by name
                            var cube = pickInfo.pickedMesh;
    
                            // Get the transformation matrix of the cube
                            var cubeWorldMatrix = cube.getWorldMatrix();
    
                            // Inverse cube transformation matrix
                            const cubeWorldMatrixInverse = BABYLON.Matrix.Invert(cubeWorldMatrix);
    
                            // Convert the intersection to local coordinates relative to the cube
                            const intersectionLocalPoint = BABYLON.Vector3.TransformCoordinates(intersectionPoint, cubeWorldMatrixInverse);
    
                            // Now intersectionLocalPoint contains the local coordinates relative to the cube
                            const localX = intersectionLocalPoint.x;
                            const localY = intersectionLocalPoint.y;
                            const localZ = intersectionLocalPoint.z;
                            console.log("LocalX:", localX);
                            console.log("LocalZ:", localZ);
    
                            if (Math.abs(localX) >= 0.49 && Math.abs(localZ) <= 0.51) {
                                console.log("I am on the Z width");
    
                                var corner1 = new BABYLON.Vector3(0.52, localY, 0.52);
                                var corner12 = new BABYLON.Vector3(-0.52, localY, 0.52)
                                var globalCorner1 = BABYLON.Vector3.TransformCoordinates(corner1, cube.getWorldMatrix());
                                var globalCorner12 = BABYLON.Vector3.TransformCoordinates(corner12, cube.getWorldMatrix());
                                globalCorner1 = getDistanceBetweenPoints(globalCorner1, globalCorner12, intersectionPoint);
    
                                var corner2 = new BABYLON.Vector3(0.52, localY, -0.52);
                                var corner22 = new BABYLON.Vector3(-0.52, localY, -0.52);
                                var globalCorner2 = BABYLON.Vector3.TransformCoordinates(corner2, cube.getWorldMatrix());
                                var globalCorner22 = BABYLON.Vector3.TransformCoordinates(corner22, cube.getWorldMatrix());
                                globalCorner2 = getDistanceBetweenPoints(globalCorner2, globalCorner22, intersectionPoint);
    
                                var bestCorner = getDistanceBetweenPoints(globalCorner1, globalCorner2, targetMesh.position);
                                
                                var cornerFound = false;
                                while (cornerFound == false) {
                                    if (bestCorner == globalCorner1){
                                        if (simpleDetector(intersectionPoint, globalCorner1, scene) == null) {
                                            console.log("Right corner is free");
                                            cornerFound = true;
                                            break;
                                        }
                                        if (simpleDetector(intersectionPoint, globalCorner2, scene) == null) {
                                            console.log("Left corner is free");
                                            cornerFound = true;
                                            bestCorner = globalCorner2;
                                            break;
                                        }
                                        else{
                                            console.log("Both corners are occupied");
                                            allBlock = 1;
                                            break;       
                                        }
                                    }
                                    if (bestCorner == globalCorner2){
                                        if (simpleDetector(intersectionPoint, globalCorner2, scene) == null) {
                                            console.log("Left corner is free");
                                            cornerFound = true;
                                            break;
                                        }
                                        if (simpleDetector(intersectionPoint, globalCorner1, scene) == null) {
                                            console.log("Right corner is free");
                                            cornerFound = true;
                                            bestCorner = globalCorner1;
                                            break;
                                        }
                                        else{
                                            console.log("Both corners are occupied");
                                            allBlock = 1;
                                            break;
                                        }
                                    }
                                }
    
                                var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                                sphere2.position = bestCorner;
                                sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                                sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                                spheres.push(sphere2);
                            }
                            if (Math.abs(localZ) >= 0.49 && Math.abs(localX) <= 0.51) {
                                console.log("I am on the X width");
    
                                var corner1 = new BABYLON.Vector3(0.52, localY, 0.52);
                                var corner12 = new BABYLON.Vector3(0.52, localY, -0.52);
                                var globalCorner1 = BABYLON.Vector3.TransformCoordinates(corner1, cube.getWorldMatrix());
                                var globalCorner12 = BABYLON.Vector3.TransformCoordinates(corner12, cube.getWorldMatrix());
                                globalCorner1 = getDistanceBetweenPoints(globalCorner1, globalCorner12, intersectionPoint);
    
                                var corner2 = new BABYLON.Vector3(-0.52, localY, 0.52);
                                var corner22 = new BABYLON.Vector3(-0.52, localY, -0.52);
                                var globalCorner2 = BABYLON.Vector3.TransformCoordinates(corner2, cube.getWorldMatrix());
                                var globalCorner22 = BABYLON.Vector3.TransformCoordinates(corner22, cube.getWorldMatrix());
                                globalCorner2 = getDistanceBetweenPoints(globalCorner2, globalCorner22, intersectionPoint);
    
                                var bestCorner = getDistanceBetweenPoints(globalCorner1, globalCorner2, targetMesh.position);
    
                                var cornerFound = false;
                                while (cornerFound == false) {
                                    if (bestCorner == globalCorner1){
                                        if (simpleDetector(intersectionPoint, globalCorner1, scene) == null) {
                                            console.log("Right corner is free");
                                            cornerFound = true;
                                            break;
                                        }
                                        if (simpleDetector(intersectionPoint, globalCorner2, scene) == null) {
                                            console.log("Left corner is free");
                                            cornerFound = true;
                                            bestCorner = globalCorner2;
                                            break;
                                        }
                                        else{
                                            console.log("Both corners are occupied");
                                            allBlock = 1;
                                            break;       
                                        }
                                    }
                                    if (bestCorner == globalCorner2){
                                        if (simpleDetector(intersectionPoint, globalCorner2, scene) == null) {
                                            console.log("Left corner is free");
                                            cornerFound = true;
                                            break;
                                        }
                                        if (simpleDetector(intersectionPoint, globalCorner1, scene) == null) {
                                            console.log("Right corner is free");
                                            cornerFound = true;
                                            bestCorner = globalCorner1;
                                            break;
                                        }
                                        else{
                                            console.log("Both corners are occupied");
                                            allBlock = 1;
                                            break;
                                        }
                                    }
                                }
    
                                var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                                sphere2.position = bestCorner;
                                sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                                sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                                spheres.push(sphere2);
                            }
    
                            steps.splice(steps.length - 1, 0, sphere2.position);
                            if (allBlock === 3) {
                                console.log("allBlock3");
                                allBlock = 0;
                            }
                            if (allBlock === 2){
                                console.log("allBlock2");
                                intersectionPoint = pickInfo.pickedPoint;
                                pickInfo = frontDetector(intersectionPoint, sphere2.position, scene);
                                if (pickInfo == null) {
    
                                    // Now intersectionLocalPoint contains the local coordinates relative to the cube
                                    var localXX = localX;
                                    var localYY = localY;
                                    var localZZ = localZ
    
                                    if (Math.abs(localXX) >= 0.49 && Math.abs(localZZ) <= 0.51) {
                                        localXX = -localXX;
                                        if (sphere2.position.z <= 0){
                                            localZZ = 0.48;
                                        }else{
                                            localZZ = -0.48;
                                        }
                                    }
                                    if (Math.abs(localZZ) >= 0.49 && Math.abs(localXX) <= 0.51) {
                                        localZZ = -localZZ;
                                        if (sphere2.position.x <= 0){
                                            localXX = 0.48;
                                        }else{
                                            localXX = -0.48;
                                        }
                                    }
    
                                    const newPoint = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(localXX, localYY, localZZ), cubeWorldMatrix);
                                    pickInfo = frontDetector(sphere2.position, newPoint, scene);
                                    allBlock = 3;
                                }
                                else{
                                    allBlock = 1;
                                }
                            }
                            if (allBlock === 1){
                                console.log("allBlock1");
                                pickInfo = frontDetector(steps[steps.length - 3], sphere2.position, scene);
                                console.log("veryyyyyyyyyy gooof");
                                steps.splice(steps.length - 2,1);
                                var intersectionPoint2 = pickInfo.pickedPoint;
                                steps.splice(steps.length - 1, 0, intersectionPoint2);
                                allBlock = 2;
                            }
                            if (allBlock === 0){
                                console.log("allBlock0");
                                pickInfo = frontDetector(sphere2.position, targetMesh.position, scene);
                            }
                            console.log("PickInfo:", pickInfo);
                            if (pickInfo == null) {
                                console.log("No intersection");
                                break;
                            }
                        }    
                    }

                    var line = BABYLON.MeshBuilder.CreateLines("line", { points: steps }, scene);
                    lines.push(line);

                    async function animateMesh(mesh, step, scene) {
                        animationRunning = true;
                        // Assuming meshToMove and targetMesh are defined elsewhere
                        console.log("Animation start");

                        for (let i = 1; i < step.length; i++) {
                            if (animationRunning == true) {
                                console.log("Step:", step[i]);
                                await startRotationAnimation(mesh, step[i]);
                                await startMoveAnimation(mesh, step[i], targetMesh.position);
                                console.log("Animation", i + 1, "finished!");
                            }else{
                                break;
                            }
                        }
                    
                        console.log("All animations finished!");

                        deleteAllMeshes();

                    }

                    animateMesh(meshToMove, steps, scene)
                    .then(() => {
                        console.log("Entire animation sequence completed.");
                        animationRunning = false;
                    })
                    .catch((error) => {
                        console.error("An error occurred during animation:", error);
                    });
                }
            }
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