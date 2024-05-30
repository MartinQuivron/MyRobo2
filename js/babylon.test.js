// Import the necessary dependencies
const BABYLON = require('babylonjs');
const { createScene } = require('./babylon');

// Mock the necessary dependencies
jest.mock('babylonjs');

describe('createScene', () => {
  let engine;
  let scene;

  beforeEach(() => {
    // Create a mock engine and scene
    engine = new BABYLON.Engine();
    scene = new BABYLON.Scene(engine);
  });

  afterEach(() => {
    // Reset the mocks
    jest.clearAllMocks();
  });

  it('should create a scene with the expected elements', async () => {
    // Mock the necessary functions and objects
    BABYLON.SceneLoader.ImportMesh.mockImplementationOnce((_, __, ___, ____, callback) => {
      const meshes = [new BABYLON.Mesh()];
      callback(meshes);
    });

    BABYLON.GUI.Button.CreateSimpleButton.mockReturnValueOnce(new BABYLON.GUI.Button());

    // Call the createScene function
    const result = await createScene();

    // Assert that the scene is created correctly
    expect(result).toEqual(scene);

    // Assert that the necessary functions and objects are called
    expect(BABYLON.SceneLoader.ImportMesh).toHaveBeenCalledTimes(2);
    expect(BABYLON.GUI.Button.CreateSimpleButton).toHaveBeenCalledTimes(4);
  });

  it('should handle button click events correctly', async () => {
    // Mock the necessary functions and objects
    BABYLON.SceneLoader.ImportMesh.mockImplementationOnce((_, __, ___, ____, callback) => {
      const meshes = [new BABYLON.Mesh()];
      callback(meshes);
    });

    BABYLON.GUI.Button.CreateSimpleButton.mockReturnValueOnce(new BABYLON.GUI.Button());

    // Call the createScene function
    await createScene();

    // Simulate a button click event
    scene.getPointerObservable().notifyObservers({ event: 'pointerup' });

    // Assert that the necessary functions and objects are called
    expect(BABYLON.Animation.CreateAndStartAnimation).toHaveBeenCalledTimes(1);
  });
});