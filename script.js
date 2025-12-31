const canvas = document.getElementById('chroma-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let mouseX = -1000;
let mouseY = -1000;

// Configuration
const GRID_SIZE = 20; 
const FADE_SPEED = 0.01; 
const HOVER_RADIUS = 200; 

let grid = [];

class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = 0; 
    }

    update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < HOVER_RADIUS) {
            const targetAlpha = 1 - (dist / HOVER_RADIUS);
            this.alpha = Math.max(this.alpha, targetAlpha * 0.8);
        }

        if (this.alpha > 0) this.alpha -= FADE_SPEED;
        if (this.alpha < 0) this.alpha = 0;
    }

    draw() {
        if (this.alpha > 0.01) {
            // --- SILICON WAFER COLOR LOGIC ---
            
            // We use a base hue of 200 (Blue).
            // We add position variations to shift it towards Purple (280) and Teal (160).
            // The Math.sin creates a "shimmer" band effect like oil on metal.
            const colorShift = Math.sin((this.x + this.y) * 0.005) * 60; 
            const hue = 220 + colorShift; 

            // HSLA: Hue (calculated), Saturation (80% metallic), Lightness (60%), Alpha
            ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${this.alpha})`;
            
            ctx.fillRect(this.x, this.y, GRID_SIZE - 1, GRID_SIZE - 1);
        }
        
        // Grid lines: Very faint Cyan to look like schematic lines
        ctx.strokeStyle = 'rgba(100, 255, 218, 0.03)';
        ctx.strokeRect(this.x, this.y, GRID_SIZE, GRID_SIZE);
    }
}

function initGrid() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    grid = [];
    for (let x = 0; x < width; x += GRID_SIZE) {
        for (let y = 0; y < height; y += GRID_SIZE) {
            grid.push(new Square(x, y));
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    grid.forEach(square => {
        square.update();
        square.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', initGrid);
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.onload = function() {
    initGrid();
    animate();
};