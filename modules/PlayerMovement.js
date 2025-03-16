let isAnimating = false;
let inputQueue = [];

export function handlePlayerMovement(direction, camera, meshes) {
    inputQueue.push({ direction, camera, meshes });
    if (!isAnimating) {
        processInputQueue();
    }
}

function processInputQueue() {
    if (inputQueue.length === 0) return;

    // Check for direction change
    // const currentInput = inputQueue[0];
    // const nextInput = inputQueue[1];
    // if (nextInput && currentInput.direction !== nextInput.direction) {
    //     // Clear previous inputs if a direction change is detected
    //     inputQueue = inputQueue.slice(1);
    // }

    const { direction, camera, meshes } = inputQueue.shift();
    const stepSize = 1; // Size of a grid cell

    if (meshes.pawnMesh && meshes.kingMesh) {
        const forward = camera.getForwardRay().direction;
        const right = BABYLON.Vector3.Cross(forward, BABYLON.Axis.Y).normalize();

        // Determine the dominant direction the camera is facing
        const absForwardX = Math.abs(forward.x);
        const absForwardZ = Math.abs(forward.z);

        let moveDirection;
        if (absForwardX > absForwardZ) {
            // Camera is mostly facing along the x-axis
            moveDirection = forward.x > 0 ? 'x+' : 'x-';
        } else {
            // Camera is mostly facing along the z-axis
            moveDirection = forward.z > 0 ? 'z+' : 'z-';
        }

        const targetRotation = new BABYLON.Vector3(meshes.pawnMesh.rotation.x, meshes.pawnMesh.rotation.y, meshes.pawnMesh.rotation.z);
        const targetPosition = new BABYLON.Vector3(meshes.pawnMesh.position.x, meshes.pawnMesh.position.y, meshes.pawnMesh.position.z);

        switch (direction) {
            case 'up':
                if (moveDirection === 'x+') {
                    targetRotation.y = Math.PI / 2;
                    targetPosition.x += stepSize;
                } else if (moveDirection === 'x-') {
                    targetRotation.y = -Math.PI / 2;
                    targetPosition.x -= stepSize;
                } else if (moveDirection === 'z+') {
                    targetRotation.y = 0;
                    targetPosition.z += stepSize;
                } else if (moveDirection === 'z-') {
                    targetRotation.y = Math.PI;
                    targetPosition.z -= stepSize;
                }
                break;
            case 'down':
                if (moveDirection === 'x+') {
                    targetRotation.y = -Math.PI / 2;
                    targetPosition.x -= stepSize;
                } else if (moveDirection === 'x-') {
                    targetRotation.y = Math.PI / 2;
                    targetPosition.x += stepSize;
                } else if (moveDirection === 'z+') {
                    targetRotation.y = Math.PI;
                    targetPosition.z -= stepSize;
                } else if (moveDirection === 'z-') {
                    targetRotation.y = 0;
                    targetPosition.z += stepSize;
                }
                break;
            case 'left':
                if (moveDirection === 'x+') {
                    targetRotation.y = 0;
                    targetPosition.z += stepSize;
                } else if (moveDirection === 'x-') {
                    targetRotation.y = Math.PI;
                    targetPosition.z -= stepSize;
                } else if (moveDirection === 'z+') {
                    targetRotation.y = -Math.PI / 2;
                    targetPosition.x -= stepSize;
                } else if (moveDirection === 'z-') {
                    targetRotation.y = Math.PI / 2;
                    targetPosition.x += stepSize;
                }
                break;
            case 'right':
                if (moveDirection === 'x+') {
                    targetRotation.y = Math.PI;
                    targetPosition.z -= stepSize;
                } else if (moveDirection === 'x-') {
                    targetRotation.y = 0;
                    targetPosition.z += stepSize;
                } else if (moveDirection === 'z+') {
                    targetRotation.y = Math.PI / 2;
                    targetPosition.x += stepSize;
                } else if (moveDirection === 'z-') {
                    targetRotation.y = -Math.PI / 2;
                    targetPosition.x -= stepSize;
                }
                break;
        }

        animateMesh(meshes.pawnMesh, targetRotation, targetPosition);
        animateMesh(meshes.kingMesh, targetRotation, targetPosition);
    }
}

function animateMesh(mesh, targetRotation, targetPosition) {
    const frameRate = 60; // Reduce frame rate for faster animations
    const animationSpeed = 6; // Increase speed multiplier for snappier animations

    // Calculate shortest rotation
    const currentRotationY = mesh.rotation.y;
    const deltaRotationY = targetRotation.y - currentRotationY;
    if (deltaRotationY > Math.PI) {
        targetRotation.y -= 2 * Math.PI;
    } else if (deltaRotationY < -Math.PI) {
        targetRotation.y += 2 * Math.PI;
    }

    // Rotation animation
    const rotationAnimation = new BABYLON.Animation(
        "rotationAnimation",
        "rotation",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const rotationKeys = [];
    rotationKeys.push({ frame: 0, value: mesh.rotation });
    rotationKeys.push({ frame: frameRate, value: targetRotation });
    rotationAnimation.setKeys(rotationKeys);

    // Position animation
    const positionAnimation = new BABYLON.Animation(
        "positionAnimation",
        "position",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const positionKeys = [];
    positionKeys.push({ frame: 0, value: mesh.position });
    positionKeys.push({ frame: frameRate, value: targetPosition });
    positionAnimation.setKeys(positionKeys);

    // Apply easing function for smoother animations
    const easingFunction = new BABYLON.QuadraticEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    rotationAnimation.setEasingFunction(easingFunction);
    positionAnimation.setEasingFunction(easingFunction);

    // Apply animations
    mesh.animations = [];
    mesh.animations.push(rotationAnimation);
    mesh.animations.push(positionAnimation);

    // Start animations
    isAnimating = true;
    mesh.getScene().beginAnimation(mesh, 0, frameRate, false, animationSpeed, () => {
        // Snap to grid after animation
        mesh.position.x = Math.round(mesh.position.x);
        mesh.position.z = Math.round(mesh.position.z);
        isAnimating = false;
        setTimeout(processInputQueue, 10); // Add a slight delay before processing the next input
    });
}