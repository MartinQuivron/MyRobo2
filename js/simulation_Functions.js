/**
 * @file simulation_functions.js
 * @description This file contains various utility functions used in the MyRobo2 project. These functions are crucial for handling 3D mesh operations,
 *              detecting obstacles, calculating trajectories, and managing animations within the Babylon.js environment.
 * 
 * Functions and their roles:
 * 1. lerp: Performs linear interpolation between two values.
 * 2. importMeshes: Imports 3D meshes from external files into the scene.
 * 3. makeSphere: Creates a sphere at a given position and with a specified color.
 * 4. frontDetector: Detects obstacles in front of the robot using raycasting.
 * 5. simpleDetector: A simplified version of frontDetector for obstacle detection.
 * 6. getDistanceBetweenPoints: Calculates the shortest distance between two distances.
 * 7. isTouching: Checks if two meshes are intersecting.
 * 8. deleteAllMeshes: Deletes all simulation meshes used in debug.
 * 9. getTrajectory: Calculates the trajectory of the robot avoiding obstacles.
 * 10. startRotationAnimation: Initiates a rotation animation for the robot.
 * 11. startMoveAnimation: Initiates a movement animation for the robot.
 * 12. runAnimation: Manages the execution of animations based on the calculated steps.
 * 13. verificationAndTrajectory: Verifies the trajectory for the robot ensuring no collisions with obstacles.
 */


// Linear interpolation function
function lerp(start, end, t) {
    return start+(end-start)*t;
}

// Function to import meshes from external files
function importMeshes(fileName, scene, callback) {
    BABYLON.SceneLoader.ImportMesh("", "./assets/", fileName, scene, function (meshes) {
        callback(meshes[0]);
        meshes[0].setEnabled(false);
    });
}

// Function to create a sphere
var makeSphere = (position, color) => {
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.05, segments: 32});
    sphere.material = new BABYLON.StandardMaterial("sp");
    if (debug) {
        sphere.material.alpha = 0.6;
    }else{
        sphere.material.alpha = 0;
    }
    sphere.material.diffuseColor = color;
    sphere.position = position;
    spheres.push(sphere);
}

// Function to detect obstacle in front of the robot
function frontDetector(start, end, scene) {
    const ray = new BABYLON.Ray(start, end.subtract(start).normalize(), 10);
    // Perform ray intersection test with the mesh
    const pickInfo = scene.pickWithRay(ray, function (mesh) {
        // Filter by mesh name
        return mesh.name === 'collider_box_block'; 
    });

    if (pickInfo.pickedMesh) {
        intersectionPoint = pickInfo.pickedPoint;

        // Retrieve the cube mesh by its name
        const cube = pickInfo.pickedMesh; 

        // Get the transformation matrix of the cube
        const cubeWorldMatrix = cube.getWorldMatrix();
        
        // Inverse transformation matrix of the cube
        const cubeWorldMatrixInverse = BABYLON.Matrix.Invert(cubeWorldMatrix);
        
        // Convert the intersection point to local coordinates relative to the cube
        const intersectionLocalPoint = BABYLON.Vector3.TransformCoordinates(intersectionPoint, cubeWorldMatrixInverse);
        
        // Now, intersectionLocalPoint contains the local coordinates relative to the cube
        var localX = intersectionLocalPoint.x;
        var localY = intersectionLocalPoint.y;
        var localZ = intersectionLocalPoint.z;
        
        // Check if the robot is in front of Z side of the cube
        if (Math.abs(localX) >= 0.49 && Math.abs(localZ) <= 0.51) {

            //Check wich side of Z the robot is in front
            if (localX > 0.4){
                localX += 0.02;
            }else{
                localX -= 0.02;
            }
        }

        // Check if the robot is in front of X side of the cube
        if (Math.abs(localZ) >= 0.49 && Math.abs(localX) <= 0.51) {

            //Check wich side of X the robot is in front
            if (localZ > 0.4){
                localZ += 0.02;
            }else{
                localZ -= 0.02;
            }
        }

        // Convert local coordinates to world coordinates
        const newIntersectionPoint = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(localX, localY, localZ), cubeWorldMatrix);
        pickInfo.pickedPoint = newIntersectionPoint;
        
        // Create sphere at the intersection point
        makeSphere(pickInfo.pickedPoint, new BABYLON.Color3(1, 0, 0));
        return pickInfo;
    } else {

        // Create sphere at the end of the ray
        makeSphere(ray.origin.add(ray.direction.scale(2)), new BABYLON.Color3(0, 1, 0));
    }
}

// Function to detect obstacle
function simpleDetector(start, end, scene) {

    const distance = BABYLON.Vector3.Distance(start, end) + 0.05;
    // Create a ray from the start point to the end point
    const ray = new BABYLON.Ray(start, end.subtract(start).normalize(), distance);

    if (debug) {
        // Display the ray
        var rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(0, 0, 1));
        rays.push(rayHelper);
    }

    // Perform ray intersection test with the mesh
    const pickInfo = scene.pickWithRay(ray, function (mesh) {

        // Filter by mesh name
        return mesh.name === 'collider_box_block';
    });

    if (pickInfo.pickedMesh) {
        console.log("Obstacle detected");
        return pickInfo;
        
    } else {
        return null;
    }
}

// Function to get the shortest distance between two points
function getDistanceBetweenPoints(point1, point2, point3) {

    // Use the distance method of Vector3 to calculate the distance between two points
    const pointA = BABYLON.Vector3.Distance(point1, point3);
    const pointB = BABYLON.Vector3.Distance(point2, point3);

    // Return the shortest distance
    if (pointA < pointB) {
        return point1;
    }else {
        return point2;
    }
}

function isTouching(mesh1, mesh2) {
    var isTouching = false;

    mesh2.forEach(function(colliderMesh) {
        // Check intersection between 'endpoint' and each 'collider_box_block'
        if (mesh1.intersectsMesh(colliderMesh, false)) {
            isTouching = true;
            return; // Exit loop early if collision detected
        }
    });

    return isTouching;
}

// Delete all meshes used for simulation
function deleteAllMeshes(){

    // Delete all meshes named "line"
    lines.forEach(function(line) {
        line.dispose();
    });
    lines = [];

    // Delete all meshes named "sphere"
    spheres.forEach(function(sphere) {
        sphere.dispose();
    });
    spheres = [];

    // Delete all meshes named "ray"
    rays.forEach(rayHelper => {
        rayHelper.dispose();
    });
    rays = [];
}

// Function to get the trajectory of the robot
function getTrajectory(meshToMove, targetMesh, scene){
    var steps = [meshToMove.position, targetMesh.position];
    var pickInfo = frontDetector(meshToMove.position, targetMesh.position, scene);
    console.log("PickInfo:", pickInfo);
    var crashCounter = 0;

    // Check if there was no intersection
    if (pickInfo == null || pickInfo == undefined) {
        steps = [meshToMove.position, targetMesh.position];
        console.log("No intersection", steps);
    }

    // Check if there was an intersection
    if (pickInfo != undefined && pickInfo != null) {

        if (pickInfo.hit) {

            console.log("pickInfo:", pickInfo);

            console.log("Intersection");
            var intersectionPoint = pickInfo.pickedPoint;
            steps.splice(steps.length - 1, 0, intersectionPoint);

            var allBlock = 0;
            while (pickInfo.pickedMesh.name == 'collider_box_block') {
                crashCounter += 1;
                console.log("CrashCounter:", crashCounter);
                if (crashCounter >= 25) {
                    steps = [meshToMove.position, targetMesh.position];
                    allBlock = 0;
                    break;
                } 
                intersectionPoint = pickInfo.pickedPoint;

                // Get the cube mesh by name
                const cube = pickInfo.pickedMesh;

                // Get the transformation matrix of the cube
                const cubeWorldMatrix = cube.getWorldMatrix();

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

                // If the robot is in front of the Z side of the cube
                if (Math.abs(localX) >= 0.49 && Math.abs(localZ) <= 0.51) {
                    console.log("I am on the Z side");

                    // Check which corner is the closest to the target
                    // Check the right corner
                    var corner1 = new BABYLON.Vector3(0.52, localY, 0.52);
                    var corner12 = new BABYLON.Vector3(-0.52, localY, 0.52)
                    var globalCorner1 = BABYLON.Vector3.TransformCoordinates(corner1, cube.getWorldMatrix());
                    var globalCorner12 = BABYLON.Vector3.TransformCoordinates(corner12, cube.getWorldMatrix());
                    globalCorner1 = getDistanceBetweenPoints(globalCorner1, globalCorner12, intersectionPoint);

                    // Check the left corner
                    var corner2 = new BABYLON.Vector3(0.52, localY, -0.52);
                    var corner22 = new BABYLON.Vector3(-0.52, localY, -0.52);
                    var globalCorner2 = BABYLON.Vector3.TransformCoordinates(corner2, cube.getWorldMatrix());
                    var globalCorner22 = BABYLON.Vector3.TransformCoordinates(corner22, cube.getWorldMatrix());
                    globalCorner2 = getDistanceBetweenPoints(globalCorner2, globalCorner22, intersectionPoint);

                    // Get the best corner
                    var bestCorner = getDistanceBetweenPoints(globalCorner1, globalCorner2, targetMesh.position);
                    
                    // Check each possibility and get the best one
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

                    // Create a sphere at the best corner
                    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                    sphere2.position = bestCorner;
                    sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                    sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                    if (debug) {
                        sphere2.material.alpha = 0.6;
                    }else{
                        sphere2.material.alpha = 0;
                    }
                    spheres.push(sphere2);
                }

                // If the robot is in front of the X side of the cube
                if (Math.abs(localZ) >= 0.49 && Math.abs(localX) <= 0.51) {
                    console.log("I am on the X side");

                    // Check which corner is the closest to the target
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

                    // Get the best corner
                    var bestCorner = getDistanceBetweenPoints(globalCorner1, globalCorner2, targetMesh.position);

                    // Check each possibility and get the best one
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

                    // Create a sphere at the best corner
                    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.05 }, scene);
                    sphere2.position = bestCorner;
                    sphere2.material = new BABYLON.StandardMaterial("sphereMaterial", scene);
                    sphere2.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                    if (debug) {
                        sphere2.material.alpha = 0.6;
                    }else{
                        sphere2.material.alpha = 0;
                    }
                    spheres.push(sphere2);
                }

                // Add the point to the steps array
                steps.splice(steps.length - 1, 0, sphere2.position);

                // System if every corner is blocked
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
    }

    if (crashCounter < 45) {
        // Create the trajectory line
        var line = BABYLON.MeshBuilder.CreateLines("line", { points: steps }, scene);
        lines.push(line);
        crashCounter = 0;
        return steps;
    }else{
        crashCounter = 0;
        steps = null;
        return steps;
    }
}


//-------------Animation Functions----------------

// Function to start rotation animation
function startRotationAnimation(meshToMove, targetMeshPosition) {
    return new Promise((resolve, reject) => {

        // Calculate the direction to the target
        const directionToTarget = targetMeshPosition.subtract(meshToMove.position);

        // Calculate the angle to rotate
        const angleToRotate = Math.atan2(directionToTarget.x, directionToTarget.z);

        // Create and start the rotation animation
        rotateAnimation  = BABYLON.Animation.CreateAndStartAnimation("rotateAnimation", meshToMove, "rotationQuaternion", 60, 60, meshToMove.rotationQuaternion, BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, angleToRotate), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
    });
}

// Function to start move animation
function startMoveAnimation(meshToMove, targetMeshPosition, step) {
    return new Promise((resolve, reject) => {

        const stepLength = step.length;

        // Calculate the maximum distance
        const distanceMax = BABYLON.Vector3.Distance(step[0], step[stepLength - 1]);

        // Calculate the distance
        const distance = BABYLON.Vector3.Distance(meshToMove.position, targetMeshPosition);
        const speed = speedMin + ((distanceMax - distance) * (speedMax - speedMin) / distanceMax) ;
        moveAnimation = BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", (speed*actualSpeed)/2, 60, meshToMove.position, targetMeshPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
    });
}

function runAnimation(meshToMove, steps, targetMesh, scene) {

    // Collect start position
    simulationData.robotName = meshToMove.name;
    simulationData.startPosition = meshToMove.position;
    simulationData.speed = actualSpeed;
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    const timePart = isoString.split('T')[1];
    const minuteSecondPart = timePart.split(':')[1] + ':' + timePart.split(':')[2];
    simulationData.startTime = minuteSecondPart;
    simulationData.obstacles = meshBlocks;

    async function animateMesh(mesh, step, scene) {
        animationRunning = true;
        console.log("Animation start");

        for (let i = 1; i < step.length; i++) {
            if (animationRunning == true) {
                console.log("Step:", step[i]);
                await startRotationAnimation(mesh, step[i]);
                await startMoveAnimation(mesh, step[i], step);
                console.log("Animation", i + 1, "finished!");
            }else{
                break;
            }
        }
    
        console.log("All animations finished!");
        const currentDate = new Date();
        const isoString = currentDate.toISOString();
        const timePart = isoString.split('T')[1];
        const minuteSecondPart = timePart.split(':')[1] + ':' + timePart.split(':')[2];
        simulationData.endTime = minuteSecondPart;
        deleteAllMeshes();

    }

    async function runStraightAnimation(meshToMove, targetMesh, step) {
        animationRunning = true;
        console.log("Animation start");

        function startRotateAnimationStraight(){
            return new Promise((resolve, reject) => {
                const directionToTarget = targetMesh.position.subtract(meshToMove.position);
                const angleToRotate = Math.atan2(directionToTarget.x, directionToTarget.z);
                rotateAnimation  = BABYLON.Animation.CreateAndStartAnimation("rotateAnimation", meshToMove, "rotationQuaternion", 60, 60, meshToMove.rotationQuaternion, BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, angleToRotate), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
            });
        }
        function startMoveAnimationStraight(){
            return new Promise((resolve, reject) => {
                // Calculate the maximum distance
                const distanceMax = BABYLON.Vector3.Distance(step[0], step[step.length - 1]);
    
                const distance = BABYLON.Vector3.Distance(meshToMove.position, targetMesh.position);
                const speed = speedMin + ((distanceMax - distance) * (speedMax - speedMin) / distanceMax);
                moveAnimation = BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", (speed*actualSpeed)/2, 60, meshToMove.position, targetMesh.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
            });
        }
        
        if (animationRunning == true) {
            await startRotateAnimationStraight()
            if (animationRunning == true) {
                await startMoveAnimationStraight()
            }
        }

        console.log("All animations finished!");
        const currentDate = new Date();
        const isoString = currentDate.toISOString();
        const timePart = isoString.split('T')[1];
        const minuteSecondPart = timePart.split(':')[1] + ':' + timePart.split(':')[2];
        simulationData.endTime = minuteSecondPart;
        deleteAllMeshes();
    }


    
    if (steps.length == 2) {
        runStraightAnimation(meshToMove, targetMesh, steps)
        .then(() => {

            console.log("Entire animation sequence completed.");
            simulationData.simulationNumber += 1;
            addJSONData(simulationData);
            if (meshToMove.position == targetMesh.position) {
                animationRunning = false;
            }

        })
        .catch((error) => {
            console.error("An error occurred during animation:", error);
        });
    }
    else{
        animateMesh(meshToMove, steps, scene)
        .then(() => {

            console.log("Entire animation sequence completed.");
            simulationData.simulationNumber += 1;
            addJSONData(simulationData);
            if (meshToMove.position == targetMesh.position) {
                animationRunning = false;
            }

        })
        .catch((error) => {
            console.error("An error occurred during animation:", error);
        });    
    }
}

function verificationAndTrajectory(meshToMove, targetMesh, scene, meshess){

    if (meshToMove && targetMesh) {

        var collider_box_blocks = [];
        scene.meshes.forEach(function(mesh) {
            if (mesh.name === 'collider_box_block') {
                collider_box_blocks.push(mesh);
            }
        });
        
        var pickInfo = frontDetector(meshToMove.position, targetMesh.position, scene);

        if (pickInfo == null) {
            var steps = getTrajectory(meshToMove, targetMesh, scene);
            console.log("Steps:", steps);
        }

        const isTouchingTargetMesh = isTouching(targetMesh, collider_box_blocks);
        const isTouchingMeshToMove = isTouching(meshToMove, collider_box_blocks);

        if (isTouchingTargetMesh == false && isTouchingMeshToMove == false) {
            var steps = getTrajectory(meshToMove, targetMesh, scene);
            console.log("Steps:", steps);
        }
        
    }
    return steps;
}