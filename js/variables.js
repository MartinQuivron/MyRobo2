/**
 * variables.js - This file defines all the global variables used across the MyRobo2 project.
 * These variables are essential for managing the state of the simulation, 3D models, GUI elements, and more.
 */

/* --- Scene Variables --- */
// Babylon.js engine and scene instances
var engine = null;
var scene = null;
var sceneToRender = null;

/* --- Model Variables --- */
// Variables to store the 3D models for the robot, end point flag, and obstacles
var robot = null;
var endPointFlag = null;
var obstacle = null;

/* --- Mesh Variables --- */
// Variables to store the meshes and their colliders
var meshToMove = null;
var colliderMeshToMove = null;
var targetMesh = null;

// Arrays to store multiple mesh blocks and their colliders
var meshBlocks = [];
var colliderMeshBlocks = [];

// Arrays to store additional mesh elements like spheres, rays, and lines
var spheres = [];
var rays = [];
var lines = [];

// Arrays to store all meshes and obstacles in the scene
var meshess = [];
var obstacles = [];

/* --- Animation Variables --- */
// Variables to control animations
var rotateAnimation = null;
var moveAnimation = null;
var animationRunning = false;
var animationBreak = false;
var moreBlock = false;

/* --- GUI Variables --- */
// Global array to store all buttons in the GUI
var allButtons = [];

// Global array to store the history of button states for state restoration
var buttonStateHistory = [];

// Variable to control the drag behavior in the GUI
var isDragEnabled = true;

// GUI-related variables
var advancedTexture = null; // Advanced texture for GUI elements
var draggedMesh = null; // The mesh currently being dragged
var positionDraggedMesh = null; // The starting position of the dragged mesh
var isPointerOverTrashButton = false; // Flag to check if the pointer is over the trash button
var pointerDragBehavior = null; // Pointer drag behavior instance

// Variable to keep track of the current page in the GUI
var currentPage = "startPage";
var isObjectButtonClicked = false; // Flag to check if an object button has been clicked

// Variables for controlling the speed of the robot
var speedMin = 1;
var speedMax = 10;
var actualSpeed = 5;

/* --- WebXR Variables --- */
// Variable for the WebXR helper used in AR/VR experiences
var xrHelper = null;

/* --- Debug Variable --- */
// Debug mode flag
var debug = false;
