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