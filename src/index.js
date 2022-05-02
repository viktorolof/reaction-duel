const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = '../images/cyberpunk-street.png';
canvas.width = 608;
canvas.height = 192;

function drawCanvas() {
    context.drawImage(backgroundImage, 0, 0);
    // draw characters, timer, starting guide etc
}

function animate() {
    drawCanvas();
    // gör nåt mer?
    window.requestAnimationFrame(animate);
}
animate();
