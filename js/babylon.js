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
    trajectory2 = createButton("trajectory2", "Trajectory", "25%", "10%", "white", 20, "green", "45%", "70%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);

    // Add buttons to the advanced texture
    advancedTexture.addControl(endPoint);
    advancedTexture.addControl(placeBtn);
    advancedTexture.addControl(block);
    advancedTexture.addControl(move);
    advancedTexture.addControl(trajectory);
    advancedTexture.addControl(trajectory2);

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
                collider.material.alpha = 0;
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
            collider1.scaling = new BABYLON.Vector3(clonedMesh1.scaling.x/1.5, clonedMesh1.scaling.y/4, clonedMesh1.scaling.z/1.5);
            collider1.parent = clonedMesh1;
            collider1.material = new BABYLON.StandardMaterial("collidermat", scene);
            collider1.material.alpha = 0.6;
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

/*
    function obstacleDetector(meshInfo, meshWorld, mesh) {

        var localPosition = new BABYLON.Vector3(0.5, localY, -0.5); // Position locale par rapport au cube
        var globalPosition = BABYLON.Vector3.TransformCoordinates(localPosition, mesh.getWorldMatrix());

        var ray = new BABYLON.Ray(intersectionPoint, globalPosition.subtract(intersectionPoint).normalize(), 2);
        
        // Perform ray intersection test with the mesh
        var pickInfo = scene.pickWithRay(ray, function (mesh) {
            return mesh.name === 'collider_box_block'; // Filter by mesh name
        });

        if (pickInfo.pickedMesh) {
            makeSphere(pickInfo.pickedPoint, new BABYLON.Color3(1, 0, 0));
            picks.push(pickInfo);
        }
        else {
            picks.push(null);
        }

        return picks;
    }
*/
    trajectory.onPointerUpObservable.add(async function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const meshToMove = scene.getMeshByName('robot');
            const targetMesh = scene.getMeshByName('endPoint');

            if (meshToMove && targetMesh) {
                var steps = [meshToMove.position, targetMesh.position];
                var pickInfo = frontDetector(meshToMove.position, targetMesh.position, scene);
                //console.log("meshToMove:", meshToMove.position);
                //console.log("targetMesh:", targetMesh.position);
                console.log("PickInfo:", pickInfo);
                
                if (pickInfo == null) {
                    console.log("No intersection");
                    return;
                }
                // Check if there was an intersection
                if (pickInfo.hit) {

                    console.log("pickInfo:", pickInfo);

                    console.log("Intersection");
                    var intersectionPoint = pickInfo.pickedPoint;
                    steps.splice(steps.length - 1, 0, intersectionPoint);

                    while (pickInfo.pickedMesh.name == 'collider_box_block') {

                        intersectionPoint = pickInfo.pickedPoint;

                        var cube = pickInfo.pickedMesh; // Récupérer le mesh du cube par son nom
                        var cubeWorldMatrix = cube.getWorldMatrix(); // Obtenez la matrice de transformation du cube

                        // Matrice de transformation inverse du cube
                        const cubeWorldMatrixInverse = BABYLON.Matrix.Invert(cubeWorldMatrix);

                        // Convertir l'intersection en coordonnées locales par rapport au cube
                        const intersectionLocalPoint = BABYLON.Vector3.TransformCoordinates(intersectionPoint, cubeWorldMatrixInverse);

                        // Maintenant, intersectionLocalPoint contient les coordonnées locales par rapport au cube
                        const localX = intersectionLocalPoint.x;
                        const localY = intersectionLocalPoint.y;
                        const localZ = intersectionLocalPoint.z;
                        console.log("LocalX:", localX);
                        console.log("LocalZ:", localZ);
                        if (Math.abs(localX) >= 0.49 && Math.abs(localZ) <= 0.51) {
                            console.log("je suis sur la largeur Z");

                            if (localZ <= 0){
                                var localPosition = new BABYLON.Vector3(localX, localY, -0.55); // Position locale par rapport au cube
                                console.log("LocalX", localX);
                                console.log("LocalZ", -0.55);
                            }
                            if (localZ > 0){
                                var localPosition = new BABYLON.Vector3(localX, localY, 0.55); // Position locale par rapport au cube
                                console.log("LocalX", localX);
                                console.log("LocalZ", 0.55);
                            }
                            
                            var globalPosition = BABYLON.Vector3.TransformCoordinates(localPosition, cube.getWorldMatrix());

                            var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                            sphere2.position = globalPosition;
                            sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                            sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge
                        }
                        if (Math.abs(localZ) >= 0.49 && Math.abs(localX) <= 0.51) {
                            console.log("je suis sur la largeur X");

                            if (localX <= 0){
                                var localPosition = new BABYLON.Vector3(-0.55, localY, localZ); // Position locale par rapport au cube
                                console.log("LocalX", -0.55);
                                console.log("LocalZ", localZ);
                            }
                            if (localX > 0){
                                var localPosition = new BABYLON.Vector3(0.55, localY, localZ); // Position locale par rapport au cube
                                console.log("LocalX", 0.55);
                                console.log("LocalZ", localZ);
                            }

                            var globalPosition = BABYLON.Vector3.TransformCoordinates(localPosition, cube.getWorldMatrix());

                            var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                            sphere2.position = globalPosition;
                            sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                            sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge
                        }
                        if  (Math.abs(localX) >= 0.49 && Math.abs(localZ) >= 0.49) {
                            console.log("je suis dans le coin");


                            var localPosition = new BABYLON.Vector3(-localX, localY, -localZ);
                            console.log("LocalX", -localX);
                            console.log("LocalZ", -localZ);
                            var globalPosition = BABYLON.Vector3.TransformCoordinates(localPosition, cube.getWorldMatrix());

                            var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                            sphere2.position = globalPosition;
                            sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                            sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge
                        }

                        console.log("sphere:", sphere2.position);
                        steps.splice(steps.length - 1, 0, sphere2.position);
                        pickInfo = frontDetector(sphere2.position, targetMesh.position, scene);
                        if (pickInfo == null) {
                            console.log("No intersection");
                            break;
                        }
                        console.log("Steps:", steps);
                        
                    }
                }
                var line = BABYLON.MeshBuilder.CreateLines("line", { points: steps }, scene);

                    async function animateMesh(mesh, step, scene) {
                        // Assuming meshToMove and targetMesh are defined elsewhere
                        console.log("Animation start");

                        for (let i = 1; i < step.length; i++) {
                            console.log("Step:", step[i]);
                            await startRotationAnimation(mesh, step[i]);
                            await startMoveAnimation(mesh, step[i]);
                            console.log("Animation", i + 1, "finished!");
                        }
                    
                        console.log("All animations finished!");

                        // Delete all meshes named "line"
                        var lineMeshes = [];
                        scene.meshes.forEach(function(mesh) {
                            if (mesh.name === 'line') {
                                lineMeshes.push(mesh);
                            }
                        });

                        // Dispose each line mesh found
                        lineMeshes.forEach(function(mesh) {
                            mesh.dispose(); // Dispose the mesh from the scene
                        });

                        // Delete all meshes named "sphere"
                        var spheremeshes = [];
                        scene.meshes.forEach(function(mesh) {
                            if (mesh.name === 'sphere') {
                                spheremeshes.push(mesh);
                            }
                        });

                        // Dispose each cube mesh found
                        spheremeshes.forEach(function(mesh) {
                            mesh.dispose(); // Dispose the mesh from the scene
                        });
                    }

                    animateMesh(meshToMove, steps, scene)
                    .then(() => {
                        console.log("Entire animation sequence completed.");
                    })
                    .catch((error) => {
                        console.error("An error occurred during animation:", error);
                    });
            }
        }
    });

    function getDistanceBetweenPoints(point1, point2, point3) {
        // Use the distance method of Vector3 to calculate the distance between two points
        var pointA = BABYLON.Vector3.Distance(point1, point3);
        var pointB = BABYLON.Vector3.Distance(point2, point3);
        if (pointA < pointB) {
            return point1;
        }else {
            return point2;
        }
    }

    // Function to detect obstacle
    function simpleDetector(start, end, scene) {
        const ray = new BABYLON.Ray(start, end.subtract(start).normalize(), 2);
        // Display the ray
        var rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(0, 0, 1));
        // Perform ray intersection test with the mesh
        const pickInfo = scene.pickWithRay(ray, function (mesh) {
            return mesh.name === 'collider_box_block'; // Filter by mesh name
        });

        if (pickInfo.pickedMesh) {
            console.log("Obstacle detected avec le simple detector");
            return pickInfo;
            
        } else {
            return null;
        }
    }

    trajectory2.onPointerUpObservable.add(async function() {
        if (hitTest && ar.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const meshToMove = scene.getMeshByName('robot');
            const targetMesh = scene.getMeshByName('endPoint');

            if (meshToMove && targetMesh) {
                var steps = [meshToMove.position, targetMesh.position];
                var pickInfo = frontDetector(meshToMove.position, targetMesh.position, scene);
                //console.log("meshToMove:", meshToMove.position);
                //console.log("targetMesh:", targetMesh.position);
                console.log("PickInfo:", pickInfo);
                
                if (pickInfo == null) {
                    console.log("No intersection");
                    return;
                }
                // Check if there was an intersection
                if (pickInfo.hit) {

                    console.log("pickInfo:", pickInfo);

                    console.log("Intersection");
                    var intersectionPoint = pickInfo.pickedPoint;
                    steps.splice(steps.length - 1, 0, intersectionPoint);

                    while (pickInfo.pickedMesh.name == 'collider_box_block') {

                        intersectionPoint = pickInfo.pickedPoint;

                        var cube = pickInfo.pickedMesh; // Récupérer le mesh du cube par son nom
                        var cubeWorldMatrix = cube.getWorldMatrix(); // Obtenez la matrice de transformation du cube

                        // Matrice de transformation inverse du cube
                        const cubeWorldMatrixInverse = BABYLON.Matrix.Invert(cubeWorldMatrix);

                        // Convertir l'intersection en coordonnées locales par rapport au cube
                        const intersectionLocalPoint = BABYLON.Vector3.TransformCoordinates(intersectionPoint, cubeWorldMatrixInverse);

                        // Maintenant, intersectionLocalPoint contient les coordonnées locales par rapport au cube
                        const localX = intersectionLocalPoint.x;
                        const localY = intersectionLocalPoint.y;
                        const localZ = intersectionLocalPoint.z;
                        console.log("LocalX:", localX);
                        console.log("LocalZ:", localZ);

                        if (Math.abs(localX) >= 0.49 && Math.abs(localZ) <= 0.51) {
                            console.log("je suis sur la largeur Z");

                            var corner1 = new BABYLON.Vector3(0.55, localY, 0.55);
                            var corner12 = new BABYLON.Vector3(-0.55, localY, 0.55)
                            var globalCorner1 = BABYLON.Vector3.TransformCoordinates(corner1, cube.getWorldMatrix());
                            var globalCorner12 = BABYLON.Vector3.TransformCoordinates(corner12, cube.getWorldMatrix());
                            globalCorner1 = getDistanceBetweenPoints(globalCorner1, globalCorner12, intersectionPoint);

                            var corner2 = new BABYLON.Vector3(0.55, localY, -0.55);
                            var corner22 = new BABYLON.Vector3(-0.55, localY, -0.55);
                            var globalCorner2 = BABYLON.Vector3.TransformCoordinates(corner2, cube.getWorldMatrix());
                            var globalCorner22 = BABYLON.Vector3.TransformCoordinates(corner22, cube.getWorldMatrix());
                            globalCorner2 = getDistanceBetweenPoints(globalCorner2, globalCorner22, intersectionPoint);

                            var bestCorner = getDistanceBetweenPoints(globalCorner1, globalCorner2, targetMesh.position);
                            
                            if (bestCorner == globalCorner1){
                                if (simpleDetector(intersectionPoint, globalCorner1, scene) == null) {
                                    console.log("Le coin droit est libre");
                                }else {
                                    console.log("Le coin droit est occupé");
                                }
                            }
                            if (bestCorner == globalCorner2){
                                if (simpleDetector(intersectionPoint, globalCorner2, scene) == null) {
                                    console.log("Le coin gauche est libre");
                                }else {
                                    console.log("Le coin gauche est occupé");
                                }
                            }
/*
                            if (bestCorner == globalCorner1 && simpleDetector(meshToMove.position, globalCorner1, scene) != null && simpleDetector(meshToMove.position, globalCorner2, scene) != null) {
                            
                            }
                            if (bestCorner == globalCorner2 && simpleDetector(meshToMove.position, globalCorner2, scene) != null && simpleDetector(meshToMove.position, globalCorner1, scene) != null) {

                            }

*/
                            var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                            sphere2.position = bestCorner;
                            sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                            sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                        }
                        if (Math.abs(localZ) >= 0.49 && Math.abs(localX) <= 0.51) {
                            console.log("je suis sur la largeur X");

                            var corner1 = new BABYLON.Vector3(0.55, localY, 0.55);
                            var corner12 = new BABYLON.Vector3(0.55, localY, -0.55);
                            var globalCorner1 = BABYLON.Vector3.TransformCoordinates(corner1, cube.getWorldMatrix());
                            var globalCorner12 = BABYLON.Vector3.TransformCoordinates(corner12, cube.getWorldMatrix());
                            globalCorner1 = getDistanceBetweenPoints(globalCorner1, globalCorner12, intersectionPoint);

                            var corner2 = new BABYLON.Vector3(-0.55, localY, 0.55);
                            var corner22 = new BABYLON.Vector3(-0.55, localY, -0.55);
                            var globalCorner2 = BABYLON.Vector3.TransformCoordinates(corner2, cube.getWorldMatrix());
                            var globalCorner22 = BABYLON.Vector3.TransformCoordinates(corner22, cube.getWorldMatrix());
                            globalCorner2 = getDistanceBetweenPoints(globalCorner2, globalCorner22, intersectionPoint);

                            var bestCorner = getDistanceBetweenPoints(globalCorner1, globalCorner2, targetMesh.position);

                            if (bestCorner == globalCorner1){
                                if (simpleDetector(intersectionPoint, globalCorner1, scene) == null) {
                                    console.log("Le coin droit est libre");
                                }else {
                                    console.log("Le coin droit est occupé");
                                }
                            }
                            if (bestCorner == globalCorner2){
                                if (simpleDetector(intersectionPoint, globalCorner2, scene) == null) {
                                    console.log("Le coin gauche est libre");
                                }else {
                                    console.log("Le coin gauche est occupé");
                                }
                            }

                            var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                            sphere2.position = bestCorner;
                            sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                            sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                        }

                        steps.splice(steps.length - 1, 0, sphere2.position);
                        pickInfo = frontDetector(sphere2.position, targetMesh.position, scene);
                        console.log("PickInfo:", pickInfo);
                        if (pickInfo == null) {
                            console.log("No intersection");
                            break;
                        }

                    }


                   
                }
                var line = BABYLON.MeshBuilder.CreateLines("line", { points: steps }, scene);

                    async function animateMesh(mesh, step, scene) {
                        // Assuming meshToMove and targetMesh are defined elsewhere
                        console.log("Animation start");

                        for (let i = 1; i < step.length; i++) {
                            console.log("Step:", step[i]);
                            await startRotationAnimation(mesh, step[i]);
                            await startMoveAnimation(mesh, step[i]);
                            console.log("Animation", i + 1, "finished!");
                        }
                    
                        console.log("All animations finished!");

                        // Delete all meshes named "line"
                        var lineMeshes = [];
                        scene.meshes.forEach(function(mesh) {
                            if (mesh.name === 'line') {
                                lineMeshes.push(mesh);
                            }
                        });

                        // Dispose each line mesh found
                        lineMeshes.forEach(function(mesh) {
                            mesh.dispose(); // Dispose the mesh from the scene
                        });

                        // Delete all meshes named "sphere"
                        var spheremeshes = [];
                        scene.meshes.forEach(function(mesh) {
                            if (mesh.name === 'sphere') {
                                spheremeshes.push(mesh);
                            }
                        });

                        // Dispose each cube mesh found
                        spheremeshes.forEach(function(mesh) {
                            mesh.dispose(); // Dispose the mesh from the scene
                        });
                    }

                    animateMesh(meshToMove, steps, scene)
                    .then(() => {
                        console.log("Entire animation sequence completed.");
                    })
                    .catch((error) => {
                        console.error("An error occurred during animation:", error);
                    });
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