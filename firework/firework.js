let colors = [
  color(192),
  color(255, 255, 0),
  color(255, 165, 0),
  color(255, 0, 0),
  color(0, 255, 0),
  color(0, 0, 255),
  color(148, 0, 211)
];
let c_color = 0;
let blockSize = 50;
let spacing = 5;

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
}

function draw() {
  background(0);
  textSize(32);
  text("click to change color!", 180, 180);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let rectX = 250 + i * (blockSize + spacing);
      let rectY = 250 + j * (blockSize + spacing);
      let distance = dist(rectX, rectY, mouseX, mouseY);

      if (distance < blockSize / 2) {
        let randomX = random(-10, 10);
        let randomY = random(-10, 10);
        rectX += randomX;
        rectY += randomY;
        fill(255, 255, 50);
        text(":happy happy happy!", rectX, rectY - 50);
      }
      fill(colors[c_color]);
      rect(rectX, rectY, blockSize, blockSize);
    }
  }
}

function mousePressed() {
  c_color = (c_color + 1) % colors.length;
}
