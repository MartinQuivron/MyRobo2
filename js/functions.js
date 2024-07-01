// Linear interpolation function
function lerp(start, end, t) {
    return start+(end-start)*t;
}

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
        return mesh.name === 'collider_box_block'; // Filter by mesh name
    });
    if (pickInfo.pickedMesh) {
        makeSphere(pickInfo.pickedPoint, new BABYLON.Color3(1, 0, 0));
        return pickInfo;
    } else {
        makeSphere(ray.origin.add(ray.direction.scale(2)), new BABYLON.Color3(0, 1, 0));
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
function startMoveAnimation(meshToMove, targetMeshPosition) {
    return new Promise((resolve, reject) => {
        var moveAnimation = BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", 60, 60, meshToMove.position, targetMeshPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => { resolve();});
    });
}