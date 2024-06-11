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
var advancedTexture = null;
var blackBlock = null;

// Function to create the default engine
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false}); };

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
  advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  // Define start and end positions for animation
  const targetPosition = new BABYLON.Vector3(10, 5, 2); // Specific coordinates

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

  // Main background
  function createGuiRectangle(name, color, width, height, alpha, cornerRadius, text, fontSize) {
    const rectangle = new BABYLON.GUI.Rectangle(name);
    rectangle.width = width;
    rectangle.height = height;
    rectangle.color = color;
    rectangle.thickness = 0;
    rectangle.background = color; // Use the color for the background
    rectangle.alpha = alpha; // Set the transparency of the rectangle
    rectangle.cornerRadius = cornerRadius;
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rectangle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    // Create a text block
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = "White";
    textBlock.fontSize = fontSize;
    textBlock.fontFamily = "Monaco";
    textBlock.fontWeight = "bold";
    textBlock.alpha = 1; // Keep the text fully opaque
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.top = "15%"; // Adjust position of the text
    rectangle.addControl(textBlock);

    return rectangle;
  }

  // Add the GUI rectangle to the advanced texture
  blackBlock = createGuiRectangle("blackBlock", "black", "95%", "97%", .8, 20, "My Robo2", "60px");

  // Add the "Home" button
  var homeButton = BABYLON.GUI.Button.CreateSimpleButton("homeButton", "Home");
  homeButton.width = "20%";
  homeButton.height = "10%";
  homeButton.color = "white";
  homeButton.cornerRadius = 20;
  homeButton.background = "red";
  homeButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  homeButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  homeButton.left = "0%";
  homeButton.top = "-40%";

  homeButton.onPointerUpObservable.add(function() {
      resetScene();
  });

  advancedTexture.addControl(blackBlock);
  blackBlock.addControl(homeButton);

  // Function to create buttons
  function createButton(name, text, width, height, color, cornerRadius, background, top, left, fontSize, horizontalAlignment) {
    var button = BABYLON.GUI.Button.CreateSimpleButton(name, text);
    button.width = width;
    button.height = height;
    button.color = color;
    button.cornerRadius = cornerRadius;
    button.background = background;
    button.top = top;
    button.left = left;
    button.fontSize = fontSize;
    button.horizontalAlignment = horizontalAlignment;

    return button;
  }

  function createButtonImaged(name, imageUrl, width, height, top, left, horizontalAlignment, advancedTexture, cornerRadius) {
    // Create a button container
    var buttonContainer = new BABYLON.GUI.Rectangle(name);
    buttonContainer.width = width;
    buttonContainer.height = height;
    buttonContainer.top = top;
    buttonContainer.left = left;
    buttonContainer.horizontalAlignment = horizontalAlignment;
    buttonContainer.cornerRadius = cornerRadius;
    buttonContainer.thickness = 0; // optional, to remove border

    // Create an image
    var image = new BABYLON.GUI.Image(name + "_image", imageUrl);
    image.width = "100%";
    image.height = "100%";

    // Add the image to the button container
    buttonContainer.addControl(image);

    // Add the button container to the advanced texture
    advancedTexture.addControl(buttonContainer);

    return buttonContainer;
  }

  // Create image buttons
  var vacumBtn = createButtonImaged("vacum", "./assets/img/vaccum_image.jpg", "42%", "20%", "0", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20);
  var roboticArmBtn = createButtonImaged("roboticArm", "assets/img/robotic_arm_image.png", "42%", "20%", "0%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20);
  var droneBtn = createButtonImaged("drone", "assets/img/drone_image.png", "42%", "20%", "25%", "6%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20);
  var mowerBtn = createButtonImaged("mower", "assets/img/mower_image.jpg", "42%", "20%", "25%", "52%", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, advancedTexture, 20);

  // Create buttons for user interaction
  var placeBtn = createButton("placeBtn", "Place model", "25%", "10%", "white", 20, "green", "35%", "5%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
  var endPoint = createButton("endPoint", "Place endpoint", "25%", "10%", "white", 20, "green", "35%", "38%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
  var block = createButton("block", "Place block", "25%", "10%", "white", 20, "green", "35%", "70%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);
  var move = createButton("move", "Move model", "25%", "10%", "white", 20, "green", "45%", "38%", "40px", BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT);

  // Initially hide and disable the buttons
  placeBtn.isVisible = false;
  placeBtn.isEnabled = false;
  endPoint.isVisible = false;
  endPoint.isEnabled = false;
  block.isVisible = false;
  block.isEnabled = false;
  move.isVisible = false;
  move.isEnabled = false;

  // Add buttons to the advanced texture
  advancedTexture.addControl(endPoint);
  advancedTexture.addControl(placeBtn);
  advancedTexture.addControl(block);
  advancedTexture.addControl(move);

  // Function to hide all image buttons
  function hideAllButtons() {
    vacumBtn.isVisible = false;
    vacumBtn.isEnabled = false;
    roboticArmBtn.isVisible = false;
    roboticArmBtn.isEnabled = false;
    droneBtn.isVisible = false;
    droneBtn.isEnabled = false;
    mowerBtn.isVisible = false;
    mowerBtn.isEnabled = false;
    blackBlock.isVisible = false;
  }

  // Function to show interaction buttons and hide all image buttons
  function showInteractionButtons() {
    placeBtn.isVisible = true;
    placeBtn.isEnabled = true;
    endPoint.isVisible = true;
    endPoint.isEnabled = true;
    block.isVisible = true;
    block.isEnabled = true;
    move.isVisible = true;
    move.isEnabled = true;

    // Hide and disable all image buttons
    hideAllButtons();
  }

  vacumBtn.onPointerUpObservable.add(showInteractionButtons);
  roboticArmBtn.onPointerUpObservable.add(showInteractionButtons);
  droneBtn.onPointerUpObservable.add(showInteractionButtons);
  mowerBtn.onPointerUpObservable.add(showInteractionButtons);

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

  placeBtn.onPointerUpObservable.add(function() {
      if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
          model.setEnabled(true);
          model.isVisible = true;
          clonedMesh = model.clone('robot');
          model.isVisible = false;
          model.setEnabled(false);
          hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
          attachOwnPointerDragBehavior(clonedMesh);
      }
  });

  endPoint.onPointerUpObservable.add(function() {
      if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
          model1.setEnabled(true);
          model1.isVisible = true;
          clonedMesh = model1.clone('endPoint');
          model1.isVisible = false;
          model1.setEnabled(false);
          hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
          attachOwnPointerDragBehavior(clonedMesh);
      }
  });

  block.onPointerUpObservable.add(function() {
      if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
          model2.isVisible = true;
          clonedMesh = model2.clone('block');
          model2.isVisible = false;
          hitTest.transformationMatrix.decompose(clonedMesh.scaling, clonedMesh.rotationQuaternion, clonedMesh.position);
          attachOwnPointerDragBehavior(clonedMesh);
      }
  });

  move.onPointerUpObservable.add(function() {
      if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
          const meshToMove = scene.getMeshByName('robot');
          const targetMesh = scene.getMeshByName('endPoint');

          if (meshToMove && targetMesh) {
              // Visualisation
              const tube = BABYLON.MeshBuilder.CreateTube("tube", {path: [meshToMove.position, targetMesh.position], radius: 0.015, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, scene);
              tube.color = new BABYLON.Color3(1, 0, 0);
              tube.isVisible = true;

              BABYLON.Animation.CreateAndStartAnimation("moveAnimation", meshToMove, "position", 30, 60, meshToMove.position, targetMesh.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
              BABYLON.MeshBuilder.CreateTube("tube", { path: [meshToMove.position, targetMesh.position], radius: 0.015, instance: tube }, scene);
          }
      }
  });

  // Function to attach pointer drag behavior to a mesh
  function attachOwnPointerDragBehavior(mesh) {
      var pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
      pointerDragBehavior.moveAttached = false;
      pointerDragBehavior.useObjectOrienationForDragging = false;
      pointerDragBehavior.onDragStartObservable.add((event) => {
          console.log("startDrag");
          placeBtn.isVisible = false;
          endPoint.isVisible = false;
          block.isVisible = false;
      });
      pointerDragBehavior.onDragObservable.add((event) => {
          console.log("drag");
          placeBtn.isVisible = false;
          endPoint.isVisible = false;
          block.isVisible = false;
          pointerDragBehavior.attachedNode.position.x += event.delta.x;
          pointerDragBehavior.attachedNode.position.z += event.delta.z;
      });
      pointerDragBehavior.onDragEndObservable.add((event) => {
          console.log("endDrag");
          placeBtn.isVisible = true;
          endPoint.isVisible = true;
          block.isVisible = true;
      });
      mesh.addBehavior(pointerDragBehavior);
  }

  return scene;
};

// Function to reset the scene
function resetScene() {
  // Dispose the current scene
  if (scene) {
      scene.dispose();
  }

  // Recreate the scene
  scene = createScene();

  // Hide interaction buttons
  placeBtn.isVisible = false;
  placeBtn.isEnabled = false;
  endPoint.isVisible = false;
  endPoint.isEnabled = false;
  block.isVisible = false;
  block.isEnabled = false;
  move.isVisible = false;
  move.isEnabled = false;

  // Show the black block and image buttons
  blackBlock.isVisible = true;
  vacumBtn.isVisible = true;
  vacumBtn.isEnabled = true;
  roboticArmBtn.isVisible = true;
  roboticArmBtn.isEnabled = true;
  droneBtn.isVisible = true;
  droneBtn.isEnabled = true;
  mowerBtn.isVisible = true;
  mowerBtn.isEnabled = true;
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
