const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 15, paddleHeight = 100;
const ballSize = 15;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;
const WIN_SCORE = 7;

let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;
let isGameOver = false;
let scoreFlash = 0;
let ballTrail = [];

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
    ballTrail = [];
}

function resetGame() {
    playerScore = 0;
    aiScore = 0;
    isGameOver = false;
    resetBall();
}

function draw() {
    // Flash effect saat skor
    if (scoreFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${scoreFlash / 10})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        scoreFlash--;
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Middle line
    ctx.fillStyle = "#fff4";
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillRect(canvas.width / 2 - 2, i, 4, 18);
    }

    // Ball trail
    for (let i = 0; i < ballTrail.length; i++) {
        ctx.globalAlpha = (i + 1) / ballTrail.length / 2;
        ctx.beginPath();
        ctx.arc(ballTrail[i].x, ballTrail[i].y, ballSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Player paddle
    ctx.fillStyle = "#fff";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);

    // AI paddle
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX + ballSize/2, ballY + ballSize/2, ballSize/2, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores (besar saat baru bertambah)
    ctx.font = scoreFlash > 0 ? "64px monospace" : "48px monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width / 2 - 60, 60);
    ctx.fillText(aiScore, canvas.width / 2 + 60, 60);

    // Game Over
    if (isGameOver) {
        ctx.font = "bold 60px monospace";
        ctx.fillStyle = "#f00";
        ctx.fillText((playerScore >= WIN_SCORE ? "YOU WIN!" : "GAME OVER"), canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = "32px monospace";
        ctx.fillStyle = "#fff";
        ctx.fillText("Press SPACE to restart", canvas.width / 2, canvas.height / 2 + 20);
    }
}

function update() {
    if (isGameOver) return;

    // Ball trail
    ballTrail.push({x: ballX + ballSize/2, y: ballY + ballSize/2});
    if (ballTrail.length > 12) ballTrail.shift();

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
        ballSpeedY += (ballY + ballSize/2 - (aiY + paddleHeight/2)) * 0.15;
        ballX = aiX - ballSize;
        playPaddleSound();
    }

    // Score check (ball out of bounds)
    if (ballX < 0) {
        aiScore++;
        playDeadSound();
        resetBall();
        scoreFlash = 10;
    } else if (ballX > canvas.width) {
        playerScore++;
        playDeadSound();
        resetBall();
        scoreFlash = 10;
    }

    // Cek game over
    if (playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) {
        isGameOver = true;
    }

    // Basic AI: follow the ball (with smoothing)
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY + ballSize / 2) {
        aiY += Math.min(5, ballY + ballSize / 2 - aiCenter);
    } else {
        aiY -= Math.min(5, aiCenter - (ballY + ballSize / 2));
    }
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Mouse controls for player's paddle
canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Keyboard controls
let keyUp = false, keyDown = false;
document.addEventListener("keydown", function(e) {
    if (e.code === "ArrowUp") keyUp = true;
    if (e.code === "ArrowDown") keyDown = true;
    if (isGameOver && e.code === "Space") resetGame();
});
document.addEventListener("keyup", function(e) {
    if (e.code === "ArrowUp") keyUp = false;
    if (e.code === "ArrowDown") keyDown = false;
});

// Update paddle position by keyboard
function updatePaddle() {
    if (keyUp) playerY -= 7;
    if (keyDown) playerY += 7;
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
}

// Main game loop
function loop() {
    updatePaddle();
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
