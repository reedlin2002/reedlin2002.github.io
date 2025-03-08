let particles = [];
let countdown = 5;
let numFireflies = 25;
let posX = [];
let posY = [];
let speedX = [];
let speedY = [];
let fireflySize = [];
let fireflyColors = [];
let NYfontSize = 64;
let NYdelta = 0.3;
let colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#00F100']; // 彩虹顏色

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
  
  for (let p of particles) {
    p.move();
    p.display();
  }
}

function timer() {
  fill(255);
  textSize(64);
  if (countdown > 0) {
    text(countdown, width / 2, height / 4);
  } else {
    NewYearText();
  }
  if (frameCount % 60 === 0 && countdown > 0) {
    countdown--;
  }
}

function Grass() {
  fill(34, 139, 34);
  rect(0, 500, 800, 200);
}

function Moon() {
  let moonX = 650;
  let moonY = 140;
  let distance = dist(mouseX, mouseY, moonX, moonY);

  noStroke();
  fill(255, 255, 204);
  if (distance < 60) {
    moonX += random(-2, 2);
    moonY += random(-2, 2);
    textSize(24);
    text(countdown > 0 ? "? ? ?" : "Happy New Year!", moonX - 100, moonY - 70);
  }
  ellipse(moonX, moonY, 120, 120);
}

function building() {
  noStroke();
  fill(100);
  rect(100, 150, 100, 400);
  fill(255, 255, 204);
  rect(150, 250, 20, 30);
  rect(150, 200, 20, 30);
  
  fill(0, 0, 51);
  rect(200, 250, 100, 400);
  fill(255, 255, 204);
  rect(230, 330, 20, 30);
  rect(270, 320, 20, 30);
  
  fill(96, 96, 96);
  rect(0, 200, 100, 400);
  fill(255, 255, 204);
  rect(10, 250, 20, 30);
  rect(50, 350, 20, 30);
  rect(50, 400, 20, 30);
}

function NewYearText() {
  textSize(NYfontSize);
  let index = int(frameCount / 30) % colors.length;
  fill(colors[index]);
  text("Happy New Year!", width / 2, height / 4);
  NYfontSize = map(sin(frameCount * NYdelta), -1, 1, 24, 40);
}

function initializeFireflies() {
  for (let i = 0; i < numFireflies; i++) {
    posX[i] = random(width);
    posY[i] = random(height);
    speedX[i] = random(-1, 1);
    speedY[i] = random(-1, 1);
    fireflySize[i] = random(2, 5);
    fireflyColors[i] = color(200, 255, 0);
  }
}

function moveFireflies() {
  for (let i = 0; i < numFireflies; i++) {
    posX[i] += speedX[i];
    posY[i] += speedY[i];

    if (posX[i] > width || posX[i] < 0) {
      posX[i] = random(width);
    }
    if (posY[i] > height || posY[i] < 0) {
      posY[i] = random(height);
    }
    drawFirefly(posX[i], posY[i], fireflySize[i], fireflyColors[i]);
  }
}

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

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = random(-5, 5);
    this.speedY = random(-5, 5);
    this.col = color(random(255), random(255), random(255));
  }
  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  display() {
    noStroke();
    fill(this.col);
    ellipse(this.x, this.y, 5, 5);
  }
}
