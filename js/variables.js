
// Initialize variables scene
var engine = null;
var scene = null;
var sceneToRender = null;


// Initialize model variables
var robot = null;
var endPointFlag = null;
var obstacle = null;


// Initialize meshes variables
var meshToMove = null;
var colliderMeshToMove = null;

var targetMesh = null;

var meshBlocks = [];
var colliderMeshBlocks = [];

var spheres = [];
var rays = [];
var lines = [];

var meshess = [];
var obstacles = [];

// Initialize state variables
var rotateAnimation = null;
var moveAnimation = null;
var animationRunning = false;
var animationBreak = false;

/* --- GUI --- */
var advancedTexture = null;
var excelButton = null;
var blackBlock = null;
var homeButton = null; 
var simulationButton = null; 
var excelButton = null;
var objectBtn = null; 
var draggedMesh = null; // the object being dragged
var isPointerOverTrashButton = false; // flag to check if the pointer is over the trash button
var pointerDragBehavior = null; // pointer drag behavior

// Interactive 
var currentPage = "startPage";
var isObjectButtonClicked = false;
var placeBtn = null;
var endPoint = null;
var block = null;
var move = null;
var speedMin = 1;
var speedMax = 10;
var actualSpeed = 1;
var sliderPanel = null;


// Image buttons
var vacumBtn = null;
var roboticArmBtn = null;
var droneBtn = null;
var mowerBtn = null;

// WebXR variables
var xrHelper = null;

var debug = true;