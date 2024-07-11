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
    sphere.material.diffuseColor = color;
    sphere.position = position;
}

// Function to detect obstacle in front of the robot
function frontDetector(start, end, scene) {
    const ray = new BABYLON.Ray(start, end.subtract(start).normalize(), 2);
    // Perform ray intersection test with the mesh
    const pickInfo = scene.pickWithRay(ray, function (mesh) {
        // Filter by mesh name
        return mesh.name === 'collider_box_block'; 
    });

    if (pickInfo.pickedMesh) {
        intersectionPoint = pickInfo.pickedPoint;

        // Retrieve the cube mesh by its name
        var cube = pickInfo.pickedMesh; 

        // Get the transformation matrix of the cube
        var cubeWorldMatrix = cube.getWorldMatrix();
        
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

    // Create a ray from the start point to the end point
    const ray = new BABYLON.Ray(start, end.subtract(start).normalize(), 2);

    // Display the ray
    var rayHelper = new BABYLON.RayHelper(ray);
    rayHelper.show(scene, new BABYLON.Color3(0, 0, 1));

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
    var pointA = BABYLON.Vector3.Distance(point1, point3);
    var pointB = BABYLON.Vector3.Distance(point2, point3);

    // Return the shortest distance
    if (pointA < pointB) {
        return point1;
    }else {
        return point2;
    }
}


//-------------Animation Functions----------------

// Function to start rotation animation
function startRotationAnimation(meshToMove, targetMeshPosition) {
    return new Promise((resolve, reject) => {
        var directionToTarget = targetMeshPosition.subtract(meshToMove.position);
        var angleToRotate = Math.atan2(directionToTarget.x, directionToTarget.z);
        var rotateAnimation  = BABYLON.Animation.CreateAndStartAnimation("rotateAnimation", meshToMove, "rotationQuaternion", 60, 60, meshToMove.rotationQuaternion, BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, angleToRotate), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
    });
}

// Function to start move animation
function startMoveAnimation(meshToMove, targetMeshPosition, finalTargetMeshPosition) {
    return new Promise((resolve, reject) => {
        var distanceMax = BABYLON.Vector3.Distance(meshToMove.position, targetMeshPosition);
        var distance = BABYLON.Vector3.Distance(meshToMove.position, targetMeshPosition);
        var speed = (20 + (distanceMax - distance) * (40-20 / distanceMax)) / 7;
        var moveAnimation = BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", speed*10, 60, meshToMove.position, targetMeshPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
    });
}