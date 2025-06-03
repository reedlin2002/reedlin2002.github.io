
var img1, img2, img3, img4, gopher, soil, bg, stone, stone2;

function setup() {
    initializeFields();
    createCanvas(640, 480);
    bg = loadImage("bg.jpg");
    stone = loadImage("stone1.png");
    stone2 = loadImage("stone2.png");
    soil = loadImage("soil8x24.png");
    img1 = loadImage("groundhogIdle.png");
    img2 = loadImage("groundhogDown.png");
    img3 = loadImage("groundhogLeft.png");
    img4 = loadImage("groundhogRight.png");
    gopher = img1;
}

var a;

var x, y, vx, vy;

function draw() {
    // 背景
    image(bg, 0, 0);
    image(soil, 0, 160 - y);
    for (// 左手i 對應y座標
    var i = 0; // 左手i 對應y座標
    i < 24; // 左手i 對應y座標
    i++) {
        for (// 右手j 對應x座標
        var j = 0; // 右手j 對應x座標
        j < 8; // 右手j 對應x座標
        j++) {
            if (a[i][j] == 1)
                image(stone, j * 80, i * 80 + 160 - y);
            if (a[i][j] == 2) {
                image(stone, j * 80, i * 80 + 160 - y);
                image(stone2, j * 80, i * 80 + 160 - y);
            }
        }
    }
    image(gopher, x, 80);
    x += vx * 3;
    y += vy * 3;
}

function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        vx = -1;
        vy = 0;
        gopher = img3;
    }
    if (keyCode == RIGHT_ARROW) {
        vx = +1;
        vy = 0;
        gopher = img4;
    }
    if (keyCode == DOWN_ARROW) {
        vx = 0;
        vy = 1;
        gopher = img2;
    }
}

function keyReleased() {
    vx = 0;
    vy = 0;
    gopher = img1;
}

function initializeFields() {
    img1 = null;
    img2 = null;
    img3 = null;
    img4 = null;
    gopher = null;
    soil = null;
    bg = null;
    stone = null;
    stone2 = null;
    a = [ [ 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 1 ], [ 0, 1, 1, 0, 0, 1, 1, 0 ], [ 1, 0, 0, 1, 1, 0, 0, 1 ], [ 1, 0, 0, 1, 1, 0, 0, 1 ], [ 0, 1, 1, 0, 0, 1, 1, 0 ], [ 0, 1, 1, 0, 0, 1, 1, 0 ], [ 1, 0, 0, 1, 1, 0, 0, 1 ], [ 1, 0, 0, 1, 1, 0, 0, 1 ], [ 0, 1, 1, 0, 0, 1, 1, 0 ], [ 0, 1, 2, 0, 1, 2, 0, 1 ], [ 1, 2, 0, 1, 2, 0, 1, 2 ], [ 2, 0, 1, 2, 0, 1, 2, 0 ], [ 0, 1, 2, 0, 1, 2, 0, 1 ], [ 1, 2, 0, 1, 2, 0, 1, 2 ], [ 2, 0, 1, 2, 0, 1, 2, 0 ], [ 0, 1, 2, 0, 1, 2, 0, 1 ], [ 1, 2, 0, 1, 2, 0, 1, 2 ] ];
    x = 300;
    y = 80;
    vx = 0;
    vy = 0;
}

function preload() {
// TODO: put method calls that load from files into this method
// I found the following calls that you should move here:
// - on line 5: bg = loadImage("bg.jpg")
// - on line 6: stone = loadImage("stone1.png")
// - on line 7: stone2 = loadImage("stone2.png")
// - on line 8: soil = loadImage("soil8x24.png")
// - on line 9: img1 = loadImage("groundhogIdle.png")
// - on line 10: img2 = loadImage("groundhogDown.png")
// - on line 11: img3 = loadImage("groundhogLeft.png")
// - on line 12: img4 = loadImage("groundhogRight.png")
// (note that line numbers are from your Processing code)
}
