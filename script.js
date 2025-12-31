const canvas = document.getElementById('chroma-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let mouseX = -1000;
let mouseY = -1000;

// Configuration
const GRID_SIZE = 20; // Size of the squares
const FADE_SPEED = 0.01; // How fast the trail fades
const HOVER_RADIUS = 100; // Radius of the mouse effect

// Store the state of every square in the grid
let grid = [];

class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = 0; // Opacity starts at 0 (invisible)
    }

    update() {
        // Calculate distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If mouse is close, increase opacity
        if (dist < HOVER_RADIUS) {
            // The closer the mouse, the brighter the square
            const targetAlpha = 1 - (dist / HOVER_RADIUS);
            this.alpha = Math.max(this.alpha, targetAlpha * 0.5); // 0.5 limits max brightness
        }

        // Always fade out slowly
        if (this.alpha > 0) {
            this.alpha -= FADE_SPEED;
        }
        if (this.alpha < 0) this.alpha = 0;
    }

    draw() {
        // Only draw if visible
        if (this.alpha > 0.01) {
            ctx.fillStyle = `rgba(100, 255, 218, ${this.alpha})`; // Your accent color (#64ffda)
            ctx.fillRect(this.x, this.y, GRID_SIZE - 1, GRID_SIZE - 1); // -1 creates the grid line effect
        }
        
        // Optional: Draw subtle grid lines always
        ctx.strokeStyle = 'rgba(136, 146, 176, 0.05)';
        ctx.strokeRect(this.x, this.y, GRID_SIZE, GRID_SIZE);
    }
}

function initGrid() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    grid = [];
    
    // Create rows and columns
    for (let x = 0; x < width; x += GRID_SIZE) {
        for (let y = 0; y < height; y += GRID_SIZE) {
            grid.push(new Square(x, y));
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height); // Clear screen
    
    // Update and draw every square
    grid.forEach(square => {
        square.update();
        square.draw();
    });

    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', initGrid);
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Start
initGrid();
animate();