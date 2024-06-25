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
    
    // Create an advanced texture for GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
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

    // Create buttons for user interaction
    placeBtn = createButton("placeBtn", "Place robot", "25%", "10%", "white", 20, "green", "35%", "5%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
    endPoint = createButton("endPoint", "Place endpoint", "25%", "10%", "white", 20, "green", "35%", "38%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
    block = createButton("block", "Place block", "25%", "10%", "white", 20, "green", "35%", "70%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
    move = createButton("move", "Move robot", "25%", "10%", "white", 20, "green", "45%", "38%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
    trajectory = createButton("trajectory", "Trajectory", "25%", "10%", "white", 20, "green", "45%", "5%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);

    // Add buttons to the advanced texture
    advancedTexture.addControl(endPoint);
    advancedTexture.addControl(placeBtn);
    advancedTexture.addControl(block);
    advancedTexture.addControl(move);
    advancedTexture.addControl(trajectory);

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
            if (meshToMove) {
                meshToMove.dispose();
            }
            else {  
                robot.setEnabled(true);
                robot.isVisible = true;
                clonedMesh = robot.clone('robot');
                robot.isVisible = false;
                robot.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh);
                const collider = BABYLON.Mesh.CreateBox("collider_box", 0, scene, false);		
                var robote = clonedMesh.getBoundingInfo();
                collider.scaling = new BABYLON.Vector3(clonedMesh.scaling.x/3, clonedMesh.scaling.y/8, clonedMesh.scaling.z/3);
                collider.parent = clonedMesh;
                collider.material = new BABYLON.StandardMaterial("collidermat", scene);
                collider.material.alpha = 0.8;
                collider.position.y += 0.06;
            }
        }
    });

    // Handle button click events
    endPoint.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const targetMesh = scene.getMeshByName('endPoint');
            if (targetMesh) {
                targetMesh.dispose();
            }
            else { 
                endPointFlag.setEnabled(true);
                endPointFlag.isVisible = true;
                clonedMesh = endPointFlag.clone('endPoint');
                endPointFlag.isVisible = false;
                endPointFlag.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh);
            }
        }
    });

    // Handle button click events
    block.onPointerUpObservable.add(function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            obstacle.isVisible = true;
            clonedMesh1 = obstacle.clone('block2');
            obstacle.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh1.scaling, clonedMesh1.rotationQuaternion, clonedMesh1.position);
            attachOwnPointerDragBehavior(clonedMesh1);
            const collider1 = BABYLON.Mesh.CreateBox("collider_box_block", 0, scene, false);		
            var robote = clonedMesh1.getBoundingInfo();
            collider1.scaling = new BABYLON.Vector3(clonedMesh1.scaling.x/2, clonedMesh1.scaling.y/4, clonedMesh1.scaling.z/2);
            collider1.parent = clonedMesh1;
            collider1.material = new BABYLON.StandardMaterial("collidermat", scene);
            collider1.material.alpha = 0.8;
            collider1.position.y += 0.06;
        }
    });

    // Handle button click events
    move.onPointerUpObservable.add(async function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const meshToMove = scene.getMeshByName('robot');
            const targetMesh = scene.getMeshByName('endPoint');
            const collider1 = scene.getMeshByName('collider_box');
            const collider2 = scene.getMeshByName('collider_box_block');
            const cube = scene.getMeshByName('block2');

            if (meshToMove && targetMesh) {
                
                meshToMove.lookAt(targetMesh.position);

                var steps = [];
                var trajectory = BABYLON.MeshBuilder.CreateBox("trajectory", {size: 0.2}, scene);
                trajectory.material = new BABYLON.StandardMaterial("collidermat", scene);
                trajectory.material.alpha = 0.5;
                trajectory.position = meshToMove.position;
                //var moveAnimation1 = BABYLON.Animation.CreateAndStartAnimation("moveAnimation2", trajectory, "position", 15, 60, trajectory.position, targetMesh.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                /*scene.onBeforeRenderObservable.add(() => {
                    if (trajectory.intersectsMesh(collider2, true)) {
                        //moveAnimation1.stop();
                        trajectory.rotation.y = Math.PI / 2; // 90 degrés en radians
                        //console.log("Collision between collider2 and trajectory!");
                    }
                });*/

                var points = [];
                for (let i = 0; i < 70; i++) {
                    const t = i / 70;
                    const x = lerp(meshToMove.position.x, targetMesh.position.x, t);
                    const y = lerp(meshToMove.position.y, targetMesh.position.y, t);
                    const z = lerp(meshToMove.position.z, targetMesh.position.z, t);
                    points.push(new BABYLON.Vector3(x, y, z));
                }
                
                var moveAnimation = BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", 15, 60, meshToMove.position, targetMesh.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

                const tubes = [];
                for (let i = 0; i < 69; i++) {
                    //alert(points.slice(i));
                   const tube = BABYLON.MeshBuilder.CreateTube("tube", { path: points.slice(i), radius: 0.015, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true }, scene);
                   tube.physicsImpostor = new BABYLON.PhysicsImpostor(tube, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0, restitution: 0.9 }, scene);
                   collider2.physicsImpostor = new BABYLON.PhysicsImpostor(collider1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
                   if (collider2 && collider2.intersectsMesh(tube, true)) {
                        //alert("Collision between collider2 and tube!");
                        //tube.rotation.y = Math.PI / 2; // 90 degrés en radians
                    //console.log("Collision between collider2 and tube!");
                    }
                   //tube.dispose();
                   tubes.push(tube);
                }

                scene.onBeforeRenderObservable.add(() => {
                    tubes.forEach(tube => {
                        if (collider1.intersectsMesh(tube, true)) {
                            tube.dispose();
                            //console.log("Collision between collider1 and tube!");
                        }
                        if (collider2 && collider2.intersectsMesh(tube, true)) {
                            //console.log("Collision between collider2 and tube!");
                        }
                    });
                });

                if (collider1 && cube) {
                    console.log("collider1 and cube exist");
                    collider1.physicsImpostor = new BABYLON.PhysicsImpostor(collider1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
                    cube.physicsImpostor = new BABYLON.PhysicsImpostor(cube, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
                    scene.onBeforeRenderObservable.add(() => {
                        if(collider1.intersectsMesh(cube, true)) {
                            //cube.dispose();
                            //console.log("Collision between collider1 and cube!");
                        }
                    });
                }
            }
        }
    });

    var makeSphere = (position, color) => {
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2, segments: 32});
        sphere.material = new BABYLON.StandardMaterial("sp");
        sphere.material.diffuseColor = color;
        sphere.position = position;
    }

    trajectory.onPointerUpObservable.add(async function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const meshToMove = scene.getMeshByName('robot');
            const targetMesh = scene.getMeshByName('endPoint');
            const collider1 = scene.getMeshByName('collider_box');
            const collider2 = scene.getMeshByName('collider_box_block');
            //const cube = scene.getMeshByName('block2');

            if (meshToMove && targetMesh) {

                var rayOrigin = meshToMove.position;
                var rayDirection = targetMesh.position.subtract(meshToMove.position).normalize(); // Normalize direction vector
                var rayLength = BABYLON.Vector3.Distance(meshToMove.position, targetMesh.position); // Length of the ray
                var ray = new BABYLON.Ray(rayOrigin, rayDirection, rayLength);
                
                // Perform ray intersection test with the mesh
                var pickInfo = scene.pickWithRay(ray, function (mesh) {
                    return mesh.name === 'collider_box_block'; // Filter by mesh name
                });

                var cube = scene.getMeshByName('collider_box_block'); // Récupérer le mesh du cube par son nom
                var cubeWorldMatrix = cube.getWorldMatrix(); // Obtenez la matrice de transformation du cube
                
                // Check if there was an intersection
                if (pickInfo.hit) {
                    // Intersection point en coordonnées mondiales
                    var intersectionPoint = pickInfo.pickedPoint;

                    // Matrice de transformation inverse du cube
                    var cubeWorldMatrixInverse = BABYLON.Matrix.Invert(cubeWorldMatrix);

                    // Convertir l'intersection en coordonnées locales par rapport au cube
                    var intersectionLocalPoint = BABYLON.Vector3.TransformCoordinates(intersectionPoint, cubeWorldMatrixInverse);

                    // Maintenant, intersectionLocalPoint contient les coordonnées locales par rapport au cube
                    var localX = intersectionLocalPoint.x;
                    var localY = intersectionLocalPoint.y;
                    var localZ = intersectionLocalPoint.z;

                    // Vous pouvez utiliser localX, localY, localZ comme vous le souhaitez
                    console.log("Intersection Point Local Coordinates:", localX, localZ);

                    // Créer une sphère à l'intersection locale
                    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
                    sphere.position = intersectionPoint;
                    sphere.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                    sphere.material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Couleur verte

                    if (localX >= 0) {

                        // Transformer la coordonnée locale (0.5, 0, 0) en coordonnée mondiale par rapport au cube
                        var localPosition = new BABYLON.Vector3(0.5, localY, -0.5); // Position locale par rapport au cube
                        var globalPosition = BABYLON.Vector3.TransformCoordinates(localPosition, cube.getWorldMatrix());

                        var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", { diameter: 0.1 }, scene);
                        sphere2.position = globalPosition;
                        sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                        sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge

                        var localPosition = new BABYLON.Vector3(0.5, localY, 0.5); // Position locale par rapport au cube
                        var globalPosition = BABYLON.Vector3.TransformCoordinates(localPosition, cube.getWorldMatrix());

                        var sphere3 = BABYLON.MeshBuilder.CreateSphere("sphere3", { diameter: 0.1 }, scene);
                        sphere3.position = globalPosition;
                        sphere3.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                        sphere3.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge
                    }
                }
            }
        }
    });
    
    return scene;
};

/* Configuration ---------------------------------------------------------------- */

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