export function setupEventHandlers(moveMesh) {
    const keyState = {};

    window.addEventListener("keydown", (event) => {
        if (!keyState[event.key]) {
            keyState[event.key] = true;
            switch (event.key) {
                case 'w':
                case 'W':
                    moveMesh('up');
                    break;
                case 's':
                case 'S':
                    moveMesh('down');
                    break;
                case 'a':
                case 'A':
                    moveMesh('left');
                    break;
                case 'd':
                case 'D':
                    moveMesh('right');
                    break;
            }
        }
    });

    window.addEventListener("keyup", (event) => {
        keyState[event.key] = false;
    });
}