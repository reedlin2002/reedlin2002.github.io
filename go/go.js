let bg; // 用來存背景圖片

function preload() {
    bg = loadImage('background.jpg'); // 載入背景圖
}

function setup() {
    initializeFields();
    createCanvas(500, 500);
}

var bx;
var by;
var N;

function draw() {
    background(bg); // 設定背景圖
    drawBoard();
    drawPieces();
    drawHoverPiece();
}

function drawBoard() {
    stroke(0); // 設定線條顏色
    for (let y = 50; y < 500; y += 50) {
        line(0, y, 500, y);
    }
    for (let x = 50; x < 500; x += 50) {
        line(x, 0, x, 500);
    }
}

function drawPieces() {
    for (let i = 0; i < N; i++) {
        fill(i % 2 === 0 ? 0 : 255); // 黑白交替
        ellipse(bx[i], by[i], 40, 40);
    }
}

function drawHoverPiece() {
    fill(N % 2 === 0 ? 0 : 255); // 當前滑鼠棋子顏色
    ellipse(mouseX, mouseY, 40, 40);
}

function mousePressed() {
    bx[N] = mouseX;
    by[N] = mouseY;
    N++;
}

function initializeFields() {
    bx = new Array(100);
    by = new Array(100);
    N = 0;
}
