let particles;
let countdown = 5;
let numFireflies = 25;
let posX = new Array(numFireflies);
let posY = new Array(numFireflies);
let speedX = new Array(numFireflies);
let speedY = new Array(numFireflies);
let fireflySize = new Array(numFireflies);
let fireflyColors = new Array(numFireflies);
let NYfontSize = 64;
let NYdelta = 0.3;
let colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#00F100']; // Rainbow colors

function setup() {
  createCanvas(800, 600);
  background(0); 
  textSize(64);
  initializeFireflies();
  textAlign(CENTER, CENTER);
}

function draw() {
  background(76, 0, 153);
  timer();
  moveFireflies();
  building();
  Moon();
  Grass();
  if (particles !== null) {
    for (let p of particles) {
      p.move();
      p.display();
    }
  }
}

function timer() {
  if (countdown > 0) {
    textSize(64);
    fill(255);
    text(countdown, width / 2, height / 4);
  } 
  else if (countdown <= 0) {
    NewYearText();
  }
  
  if (frameCount % 60 === 0 && countdown > 0) {
    countdown--;
  }
}

function Grass() { // Grass
  fill(34, 139, 34); // Green
  rect(0, 500, 800, 200); 
}

function Moon() { // Moon
  let moonX = 650; // Moon position
  let moonY = 140;
  let distance = dist(mouseX, mouseY, moonX, moonY); // Distance between mouse and moon
  
  noStroke();
  fill(255, 255, 204); 
  if (distance < 60) { // If mouse is near moon
    moonX += random(-2, 2); // Randomly move moon
    moonY += random(-2, 2);
    textSize(24);
    if(countdown > 0) {
      text("? ? ?", moonX - 100, moonY - 70);
    } else {
      text("Happy New Year!", moonX - 100, moonY - 70);
    }
  }
  ellipse(moonX, moonY, 120, 120);
}

function building() {
  noStroke();
  fill(100);
  rect(100, 150, 100, 400); // Building body
  fill(255, 255, 204);
  rect(150, 250, 20, 30); // Window 1
  rect(150, 200, 20, 30); // Window 2
  
  fill(0, 0, 51);
  rect(200, 250, 100, 400); // Building body
  fill(255, 255, 204);
  rect(230, 330, 20, 30); // Window 1
  rect(270, 320, 20, 30); // Window 2
  
  fill(96, 96, 96);
  rect(0, 200, 100, 400); // Building body
  fill(255, 255, 204);
  rect(10, 250, 20, 30); // Window 1
  rect(50, 350, 20, 30); // Window 2
  rect(50, 400, 20, 30); // Window 3
}

function NewYearText() {
  textSize(NYfontSize);
  let index = Math.floor(frameCount / 30) % colors.length; // Control color change speed
  fill(colors[index]);
  text("Happy New Year!", width / 2, height / 4);

  NYfontSize = map(Math.sin(frameCount * NYdelta), -1, 1, 24, 40); // Scaling effect
}

// Initialize fireflies
function initializeFireflies() {
  for (let i = 0; i < numFireflies; i++) {
    posX[i] = random(width); // Random X position for fireflies
    posY[i] = random(height); // Random Y position for fireflies
    speedX[i] = random(-1, 1); // Random X speed
    speedY[i] = random(-1, 1); // Random Y speed
    fireflySize[i] = random(2, 5); // Random firefly size
    fireflyColors[i] = color(200, 255, 0); // Firefly color (yellow)
  }
}

// Move fireflies
function moveFireflies() {
  for (let i = 0; i < numFireflies; i++) {
    posX[i] += speedX[i]; // Update X position
    posY[i] += speedY[i]; // Update Y position

    if (posX[i] > width || posX[i] < 0) { // Check for boundary
      posX[i] = random(width); // Reposition firefly if out of bounds
    }
    if (posY[i] > height || posY[i] < 0) {
      posY[i] = random(height);
    }

    drawFirefly(posX[i], posY[i], fireflySize[i], fireflyColors[i]); // Draw firefly
  }
}

// Draw a single firefly
function drawFirefly(x, y, size, col) {
  fill(col);
  noStroke();
  ellipse(x, y, size, size);
}

function mousePressed() {
  createFirework(mouseX, mouseY);
}

function createFirework(x, y) {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(x, y));
  }
}

// Fireworks
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = random(-5, 5);
    this.speedY = random(-5, 5);
    this.col = color(random(255), random(255), random(255));
  }

  // Update position
  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  // Display particle
  display() {
    noStroke();
    fill(this.col);
    ellipse(this.x, this.y, 5, 5); // Draw circle
  }
}
