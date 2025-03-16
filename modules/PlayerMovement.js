export function handlePlayerMovement(direction, camera, meshes) {
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

        switch (direction) {
            case 'up':
                if (moveDirection === 'x+') {
                    meshes.pawnMesh.position.x += stepSize;
                    meshes.kingMesh.position.x += stepSize;
                } else if (moveDirection === 'x-') {
                    meshes.pawnMesh.position.x -= stepSize;
                    meshes.kingMesh.position.x -= stepSize;
                } else if (moveDirection === 'z+') {
                    meshes.pawnMesh.position.z += stepSize;
                    meshes.kingMesh.position.z += stepSize;
                } else if (moveDirection === 'z-') {
                    meshes.pawnMesh.position.z -= stepSize;
                    meshes.kingMesh.position.z -= stepSize;
                }
                break;
            case 'down':
                if (moveDirection === 'x+') {
                    meshes.pawnMesh.position.x -= stepSize;
                    meshes.kingMesh.position.x -= stepSize;
                } else if (moveDirection === 'x-') {
                    meshes.pawnMesh.position.x += stepSize;
                    meshes.kingMesh.position.x += stepSize;
                } else if (moveDirection === 'z+') {
                    meshes.pawnMesh.position.z -= stepSize;
                    meshes.kingMesh.position.z -= stepSize;
                } else if (moveDirection === 'z-') {
                    meshes.pawnMesh.position.z += stepSize;
                    meshes.kingMesh.position.z += stepSize;
                }
                break;
            case 'left':
                if (moveDirection === 'x+') {
                    meshes.pawnMesh.position.z += stepSize;
                    meshes.kingMesh.position.z += stepSize;
                } else if (moveDirection === 'x-') {
                    meshes.pawnMesh.position.z -= stepSize;
                    meshes.kingMesh.position.z -= stepSize;
                } else if (moveDirection === 'z+') {
                    meshes.pawnMesh.position.x -= stepSize;
                    meshes.kingMesh.position.x -= stepSize;
                } else if (moveDirection === 'z-') {
                    meshes.pawnMesh.position.x += stepSize;
                    meshes.kingMesh.position.x += stepSize;
                }
                break;
            case 'right':
                if (moveDirection === 'x+') {
                    meshes.pawnMesh.position.z -= stepSize;
                    meshes.kingMesh.position.z -= stepSize;
                } else if (moveDirection === 'x-') {
                    meshes.pawnMesh.position.z += stepSize;
                    meshes.kingMesh.position.z += stepSize;
                } else if (moveDirection === 'z+') {
                    meshes.pawnMesh.position.x += stepSize;
                    meshes.kingMesh.position.x += stepSize;
                } else if (moveDirection === 'z-') {
                    meshes.pawnMesh.position.x -= stepSize;
                    meshes.kingMesh.position.x -= stepSize;
                }
                break;
        }

        // Snap the positions to the grid
        meshes.pawnMesh.position.x = Math.round(meshes.pawnMesh.position.x);
        meshes.pawnMesh.position.z = Math.round(meshes.pawnMesh.position.z);
        meshes.kingMesh.position.x = Math.round(meshes.kingMesh.position.x);
        meshes.kingMesh.position.z = Math.round(meshes.kingMesh.position.z);
    }
}