const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 15, paddleHeight = 100;
const ballSize = 15;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;

let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Sound effects (base64 encoded short beep and "death" sound)
// You can replace these with your own .wav or .mp3 files or URLs
const beepPaddle = new Audio("data:audio/wav;base64,UklGRhQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YYQAAAB/AAD/AAD/AAD/AAD/AA==");
const beepDead = new Audio("data:audio/wav;base64,UklGRjAAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVgAAAB/AAB/AAD/AAD/AAH/AAD/AAb/AAD/AA==");

function playPaddleSound() {
    beepPaddle.currentTime = 0;
    beepPaddle.play();
}
function playDeadSound() {
    beepDead.currentTime = 0;
    beepDead.play();
}

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.fillStyle = "#fff4";
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillRect(canvas.width / 2 - 2, i, 4, 18);
    }

    // Player paddle
    ctx.fillStyle = "#fff";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);

    // AI paddle
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX + ballSize/2, ballY + ballSize/2, ballSize/2, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "48px monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width / 2 - 60, 60);
    ctx.fillText(aiScore, canvas.width / 2 + 60, 60);
}

// Update game logic
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY *= -1;
        ballY = Math.max(0, Math.min(ballY, canvas.height-ballSize));
        playPaddleSound();
    }

    // Ball collision with player paddle
    if (
        ballX <= playerX + paddleWidth &&
        ballY + ballSize >= playerY &&
        ballY <= playerY + paddleHeight
    ) {
        ballSpeedX *= -1;
        // Add some "spin"
        ballSpeedY += (ballY + ballSize/2 - (playerY + paddleHeight/2)) * 0.15;
        ballX = playerX + paddleWidth;
        playPaddleSound();
    }

    // Ball collision with AI paddle
    if (
        ballX + ballSize >= aiX &&
        ballY + ballSize >= aiY &&
        ballY <= aiY + paddleHeight
    ) {
        ballSpeedX *= -1;
        // Add some "spin"
        ballSpeedY += (ballY + ballSize/2 - (aiY + paddleHeight/2)) * 0.15;
        ballX = aiX - ballSize;
        playPaddleSound();
    }

    // Score check (ball out of bounds)
    if (ballX < 0) {
        // AI scores
        aiScore++;
        playDeadSound();
        resetBall();
    } else if (ballX > canvas.width) {
        // Player scores
        playerScore++;
        playDeadSound();
        resetBall();
    }

    // Basic AI: follow the ball (with smoothing)
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY + ballSize / 2) {
        aiY += Math.min(5, ballY + ballSize / 2 - aiCenter);
    } else {
        aiY -= Math.min(5, aiCenter - (ballY + ballSize / 2));
    }
    // Stay in bounds
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Mouse controls for player's paddle
canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Main game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
