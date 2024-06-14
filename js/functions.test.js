const { Vector3, Mesh, PointerDragBehavior } = require('babylonjs');

// Import or require the functions to be tested
const { lerp, attachOwnPointerDragBehavior } = require('./functions.js');

describe('attachOwnPointerDragBehavior function', () => {
    // Mock objects and functions from Babylon.js
    const mockMesh = new Mesh("mockMesh");
    const mockAttachedNode = { position: new Vector3(0, 0, 0) }; // Mocked attachedNode
    const mockPointerDragBehavior = new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0) });
    mockPointerDragBehavior.attachedNode = mockAttachedNode; // Assign mocked attachedNode to pointerDragBehavior
    mockMesh.addBehavior = jest.fn(); // Mock the addBehavior function

    test('should attach pointer drag behavior to mesh', () => {
        attachOwnPointerDragBehavior(mockMesh);
        expect(mockMesh.addBehavior).toHaveBeenCalled();
    });

    // Simulate drag events and check if the expected behaviors are triggered
    test('should trigger drag events and update visibility accordingly', () => {
        attachOwnPointerDragBehavior(mockMesh);
        const dragStartCallback = mockPointerDragBehavior.onDragStartObservable.add.mock.calls[0][0];
        const dragCallback = mockPointerDragBehavior.onDragObservable.add.mock.calls[0][0];
        const dragEndCallback = mockPointerDragBehavior.onDragEndObservable.add.mock.calls[0][0];

        // Simulate drag start
        dragStartCallback();
        expect(placeBtn.isVisible).toBeFalsy();
        expect(endPoint.isVisible).toBeFalsy();
        expect(block.isVisible).toBeFalsy();

        // Simulate drag
        dragCallback({ delta: { x: 1, z: 2 } });
        expect(placeBtn.isVisible).toBeFalsy();
        expect(endPoint.isVisible).toBeFalsy();
        expect(block.isVisible).toBeFalsy();
        expect(mockAttachedNode.position.x).toBe(1);
        expect(mockAttachedNode.position.z).toBe(2);

        // Simulate drag end
        dragEndCallback();
        expect(placeBtn.isVisible).toBeTruthy();
        expect(endPoint.isVisible).toBeTruthy();
        expect(block.isVisible).toBeTruthy();
    });
});
