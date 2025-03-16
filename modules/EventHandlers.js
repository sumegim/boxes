export function setupEventHandlers(moveMesh) {
    window.addEventListener("keydown", (event) => {
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
    });
}