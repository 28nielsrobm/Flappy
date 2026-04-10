const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== GAME SETTINGS (easy to tweak) =====
const GRAVITY = 0.4;
const JUMP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const PIPE_SPEED = 2;

// ===== PLAYER =====
let bird = {
  x: 80,
  y: 200,
  velocity: 0,
  size: 20
};

// ===== PIPES =====
let pipes = [];

// ===== GAME STATE =====
let score = 0;
let gameOver = false;

// ===== INPUT =====
document.addEventListener("keydown", () => {
  if (!gameOver) {
    bird.velocity = JUMP;
  } else {
    resetGame();
  }
});

canvas.addEventListener("click", () => {
  if (!gameOver) {
    bird.velocity = JUMP;
  } else {
    resetGame();
  }
});

// ===== PIPE SPAWNING =====
function spawnPipe() {
  let topHeight = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + PIPE_GAP
  });
}

// ===== RESET =====
function resetGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
}

// ===== UPDATE =====
function update() {
  if (gameOver) return;

  // Bird physics
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // Spawn pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 250) {
    spawnPipe();
  }

  // Move pipes
  pipes.forEach(pipe => pipe.x -= PIPE_SPEED);

  // Collision + scoring
  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + PIPE_WIDTH &&
      bird.x + bird.size > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      gameOver = true;
    }

    // Score when passing pipe
    if (pipe.x + PIPE_WIDTH === bird.x) {
      score++;
    }
  });

  // Ground / ceiling
  if (bird.y < 0 || bird.y + bird.size > canvas.height) {
    gameOver = true;
  }
}

// ===== DRAW =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

  // Pipes
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // Game Over
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 90, 300);

    ctx.font = "20px Arial";
    ctx.fillText("Click or press key to restart", 60, 340);
  }
}

// ===== GAME LOOP =====
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
