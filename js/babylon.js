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

    //Enable physics engine
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());

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
        model.setEnabled(false);
        /*
        var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 0.08, diameterTop: 0.35, diameterBottom: 0.35}, scene);
        cylinder.position = model.position;
        cylinder.rotationQuaternion = model.rotationQuaternion;
        cylinder.visibility = 0.5;
        cylinder.isVisible = true;
        cylinder.parent = model;
        cylinder.position.y += 0.06;
        */
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "flag_in_the_wind.glb", scene, function (meshes) {
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
            const meshToMove = scene.getMeshByName('robot');
            if (meshToMove) {
                meshToMove.dispose();
            }
            else {  
                model.setEnabled(true);
                model.isVisible = true;
                clonedMesh = model.clone('robot');
                model.isVisible = false;
                model.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh);
                var collider = BABYLON.Mesh.CreateBox("collider_box", 0, scene, false);		
                var modele = clonedMesh.getBoundingInfo();
                collider.scaling = new BABYLON.Vector3(clonedMesh.scaling.x/2, clonedMesh.scaling.y/4, clonedMesh.scaling.z/2);
                collider.parent = clonedMesh;
                collider.material = new BABYLON.StandardMaterial("collidermat", scene);
                collider.material.alpha = 0.8;
            }
        }
    });

    endPoint.onPointerUpObservable.add(function() {
        if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const targetMesh = scene.getMeshByName('endPoint');
            if (targetMesh) {
                targetMesh.dispose();
            }
            else { 
                model1.setEnabled(true);
                model1.isVisible = true;
                clonedMesh = model1.clone('endPoint');
                model1.isVisible = false;
                model1.setEnabled(false);
                hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
                attachOwnPointerDragBehavior(clonedMesh);
            }
        }
    });

    block.onPointerUpObservable.add(function() {
        if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            model2.isVisible = true;
            clonedMesh = model2.clone('block2');
            model2.isVisible = false;
            hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
            attachOwnPointerDragBehavior(clonedMesh);
        }
    });

    move.onPointerUpObservable.add(async function() {
        if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            const meshToMove = scene.getMeshByName('robot');
            const targetMesh = scene.getMeshByName('endPoint');
            const cylinder = scene.getMeshByName('cylinder');
            const collider1 = scene.getMeshByName('collider_box');
            const cube = scene.getMeshByName('block2');
            /*
            alert(targetMeshPosition);
            alert(meshToMove.position);
            alert(meshToMove.rotationQuaternion)


            const directionVector = targetMesh.position.subtract(meshToMove.position);

            const rotationQuaternion = BABYLON.Quaternion.RotationBetweenVectors(
                BABYLON.Vector3.Forward(), // Mesh's forward direction (usually [0, 0, 1])
                directionVector
              );
              meshToMove.rotationQuaternion = rotationQuaternion;
*/
            if (meshToMove && targetMesh) {
                //meshToMove.position = targetMesh.position;

                // Create a cylinder between meshToMove and targetMesh
                meshToMove.lookAt(targetMesh.position);
                /*
                const updateLookAt = () => {
                    // Calculate the target position based on the current time
                    const time = performance.now() / 1000; // Get time in seconds
                    const targetPosition = targetMesh.position.clone();
                    targetPosition.y += Math.sin(time) * 2; // Add some vertical movement
                  
                    // Update the cylinder's lookAt target
                    cylinder.lookAt(targetPosition);
                  
                    // Request the next frame to continue the animation
                    requestAnimationFrame(updateLookAt);
                  };
                  
                  // Start the animation loop
                  updateLookAt();
                */

                // Create a cylinder between meshToMove and targetMesh
                // Create a line between meshToMove and targetMesh

                function lerp(start, end, t) {
                    return start+(end-start)*t;
                }

                var points = [];
                for (let i = 0; i < 70; i++) {
                    const t = i / 70;
                    const x = lerp(meshToMove.position.x, targetMesh.position.x, t);
                    const y = lerp(meshToMove.position.y, targetMesh.position.y, t);
                    const z = lerp(meshToMove.position.z, targetMesh.position.z, t);
                    points.push(new BABYLON.Vector3(x, y, z));
                }

                //var tube = BABYLON.MeshBuilder.CreateTube("tube", {path: [meshToMove.position, targetMesh.position], radius: 0.015, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, scene);
                //const line = BABYLON.MeshBuilder.CreateLines("line", {points: [meshToMove.position, targetMesh.position]}, scene);
                //tube.color = new BABYLON.Color3(1, 0, 0);
                //tube.isVisible = true;
               // cylinder.scaling.y = BABYLON.Vector3.Distance(meshToMove.position, targetMesh.position);
               // cylinder.isVisible = false;
                

                var moveAnimation = BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", 15, 60, meshToMove.position, targetMesh.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                //var currentFrame = scene.getAnimationByName("moveAnimation").currentFrame;
                //alert(currentFrame);
                //function createTube(){
                //    const tube = BABYLON.MeshBuilder.CreateTube("tube", { path: points, radius: 0.015, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true }, scene);
                //    tube.dispose();
                //}
                for (let i = 0; i < 29; i++) {
                    
                    //alert(points.slice(i));
                   const tube = BABYLON.MeshBuilder.CreateTube("tube", { path: points.slice(i), radius: 0.015, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true }, scene);
                   //tube.dispose();
                }

                function checkCollision(box1, box2) {
                    // Check on X-axis
                    if (box1.minimum.x > box2.maximum.x || box1.maximum.x < box2.minimum.x) {
                      return true;
                    }
                  
                    // Check on Y-axis
                    if (box1.minimum.y > box2.maximum.y || box1.maximum.y < box2.minimum.y) {
                      return true;
                    }
                  
                    // Check on Z-axis
                    if (box1.minimum.z > box2.maximum.z || box1.maximum.z < box2.minimum.z) {
                      return true;
                    }
                  
                    // No separation on any axis, collision detected
                    return false;
                }

                if (collider1 && cube) {
                    console.log("collider1 and cube exist");
                    collider1.physicsImpostor = new BABYLON.PhysicsImpostor(collider1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
                    cube.physicsImpostor = new BABYLON.PhysicsImpostor(cube, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
                    scene.onBeforeRenderObservable.add(() => {
                        if(collider1.intersectsMesh(cube, true)) {
                            console.log("Collision between collider1 and cube!");
                        }
                    });
                }
            }
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