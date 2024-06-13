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

// Initialize variables
var engine = null;
var scene = null;
var sceneToRender = null;

// Function to create the default engine
const createDefaultEngine = () => new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });

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
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "flag_in_the_wind.glb", scene, function (meshes) {
        model1 = meshes[0];
        model1.setEnabled(false);
    });

    // Create buttons for user interaction
    placeBtn = createButton("placeBtn", "Place model", "25%", "10%", "white", 20, "green", "35%", "5%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
    endPoint = createButton("endPoint", "Place endpoint", "25%", "10%", "white", 20, "green", "35%", "38%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
    block = createButton("block", "Place block", "25%", "10%", "white", 20, "green", "35%", "70%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
    move = createButton("move", "Move model", "25%", "10%", "white", 20, "green", "45%", "38%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);

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
                collider.scaling = new BABYLON.Vector3(clonedMesh.scaling.x/3, clonedMesh.scaling.y/8, clonedMesh.scaling.z/3);
                collider.parent = clonedMesh;
                collider.material = new BABYLON.StandardMaterial("collidermat", scene);
                collider.material.alpha = 0;
                collider.position.y += 0.06;
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

            if (meshToMove && targetMesh) {

                // Create a cylinder between meshToMove and targetMesh
                meshToMove.lookAt(targetMesh.position);

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
                   //tube.dispose();
                   tubes.push(tube);
                }

                scene.onBeforeRenderObservable.add(() => {
                    tubes.forEach(tube => {
                        if (collider1.intersectsMesh(tube, true)) {
                            tube.dispose();
                            //console.log("Collision between collider1 and tube!");
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