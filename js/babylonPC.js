
function openPCScene() {

}


var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = async function () {
var scene = new BABYLON.Scene(engine);

var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 12, BABYLON.Vector3.Zero(), scene);

// This targets the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);

var ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10}, scene, false);
ground.isVisible = false;

var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

//var model = new BABYLON.MeshBuilder.CreateBox("box", {width: 0.2, height: 0.2, depth: 0.2}, scene);
//model.rotationQuaternion = new BABYLON.Quaternion();
//model.position.y += 0.1;
//model.isVisible = false;

var model = BABYLON.Mesh.CreateFromGeometry(scene, "./assets/kobuki.rdtf.glb");
model.rotationQuaternion = new BABYLON.Quaternion();
model.position.y += 0.1;




var placeBtn = BABYLON.GUI.Button.CreateSimpleButton("placeBtn", "Place model");
placeBtn.width = "600px";
placeBtn.height = "200px";
placeBtn.color = "white";
placeBtn.cornerRadius = 20;
placeBtn.background = "green";
placeBtn.top = "40%";

advancedTexture.addControl(placeBtn);

//marker
const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05 });
marker.isVisible = false;
marker.rotationQuaternion = new BABYLON.Quaternion();

//XR
const xr = await scene.createDefaultXRExperienceAsync({
uiOptions: {
    sessionMode: "immersive-ar",
},
optionalFeatures: true,
});

const fm = xr.baseExperience.featuresManager;
const xrTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");
const anchors = fm.enableFeature(BABYLON.WebXRAnchorSystem, 'latest');
const xrBackgroundRemover = fm.enableFeature(BABYLON.WebXRBackgroundRemover.Name);

//hitTest

let hitTest;

xrTest.onHitTestResultObservable.add((results) => {
if (results.length) {
    hitTest = results[0];
    model.isVisible = false;
    marker.isVisible = true;
    hitTest.transformationMatrix.decompose(model.scaling, model.rotationQuaternion, model.position);
    hitTest.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
} else {
    hitTest = undefined;
    model.isVisible = false;
    marker.isVisible = false;
}
});

//Anchors

/*if (anchors) {
anchors.onAnchorAddedObservable.add(anchor => {
    model.isVisible = true;
    anchor.attachedNode = model.clone('clone');
    model.isVisible = false;
})

anchors.onAnchorRemovedObservable.add(anchor => {
    if (anchor) {
        anchor.attachedNode.isVisible = false;
        anchor.attachedNode.dispose();
    }
});
}*/

/*scene.onPointerDown = (evt, pickInfo) => {
if (hitTest && anchors && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
    anchors.addAnchorPointUsingHitTestResultAsync(hitTest);
}
}*/

placeBtn.onPointerUpObservable.add(function() {
if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
    model.isVisible = true;
    clonedMesh = model.clone('clone');
    model.isVisible = false;
    hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
    attachOwnPointerDragBehavior(clonedMesh);
}
});

function attachOwnPointerDragBehavior(mesh){
// Create pointerDragBehavior in the desired mode
var pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});

// If handling drag events manually is desired, set move attached to false
pointerDragBehavior.moveAttached = false;

// Use drag plane in world space
pointerDragBehavior.useObjectOrienationForDragging = false;

// Listen to drag events
pointerDragBehavior.onDragStartObservable.add((event)=>{
    console.log("startDrag");
})
pointerDragBehavior.onDragObservable.add((event)=>{
    console.log("drag");

    //attachedNode could be also mesh here again...
    pointerDragBehavior.attachedNode.position.x += event.delta.x;
    pointerDragBehavior.attachedNode.position.z += event.delta.z;
})
pointerDragBehavior.onDragEndObservable.add((event)=>{
    console.log("endDrag");
})

mesh.addBehavior(pointerDragBehavior);
}

return scene;
};
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
window.scene = createScene();};
initFunction().then(() => {scene.then(returnedScene => { sceneToRender = returnedScene; });
                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});