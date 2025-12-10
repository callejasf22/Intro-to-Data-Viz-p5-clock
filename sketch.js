let track = []

// computes a point on a Catmull-Rom spline
function getPoint(t) {
    let trackLength = track.length;
    let i = Math.floor(t) % trackLength;

    let p0 = track[(i - 1 + trackLength) % trackLength];
    let p1 = track[i % trackLength];
    let p2 = track[(i + 1)% trackLength];
    let p3 = track[(i + 2) % trackLength];

    let u = t - Math.floor(t) % trackLength;

    // Catmull-Rom spline equation 
    let x = 0.5 * (2 * p1.x +
        (-p0.x + p2.x) * u +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u * u +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u * u * u
    );
    
    let y = 0.5 *(2 * p1.y +
        (-p0.y + p2.y) * u +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u * u +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u * u * u
    );

    return createVector(x, y);

}

// setup() is called once at page-load
function setup() {
    createCanvas(800,600); // make an HTML canvas element width x height pixels

    //points that make up the track
    track = [
        createVector(150, 100),
        createVector(300, 150),
        createVector(450, 100),
        createVector(650, 200),
        createVector(480, 300),
        createVector(450, 410),
        createVector(340, 520),
        createVector(260, 440),
        createVector(150, 400),
        createVector(80, 300),
        createVector(120, 200)
    ]
}

function drawSquare(t, size) {
    let position = getPoint(t);
    let nextPosition = getPoint(t+ 0.01);

    //vector for the direction of track
    let tan = p5.Vector.sub(nextPosition, position).normalize();

    //a perpendicular vector for tan
    let norm = createVector(tan.y, -tan.x);

    push();
    translate(position.x, position.y);
    rotate(norm.heading());
    rect(-size/2, -size/2, size, size);
    pop();
}

function drawTrack() {
    background(color(53,56,57));
    let trackLength = track.length;

    //draw the track
    stroke(220);
    strokeWeight(40);
    fill(color(53,56,57));

    beginShape();
    for (let p of track) {
        curveVertex(p.x, p.y);
    }

    for (let i = 0; i < 3; i++) {
        curveVertex(track[i].x, track[i].y);
    }
    endShape();

    //draws the squares at each quarter distance of the track
    stroke(0);
    strokeWeight(0);
    fill(color(159, 159, 146));
    drawSquare(0.25 * trackLength, 39);
    drawSquare(0.5 * trackLength, 39);
    drawSquare(0.75 * trackLength, 39);

    //draw start/finish line
    let position = getPoint(0);
    let nextPosition = getPoint(0.01);

    //vector for the direction of track
    let tan = p5.Vector.sub(nextPosition, position).normalize();

    //a perpendicular vector for tan
    let norm = createVector(tan.y, -tan.x);

    push();
    translate(position.x, position.y);
    rotate(norm.heading());
    stroke(0);
    strokeWeight(10);
    drawingContext.setLineDash([0.1,12]);
    line(-20, 0, 20, 0);
    drawingContext.setLineDash([]);
    pop();
}

function drawCar(t, color) {
    let trackLength = track.length;
    let position = getPoint(t * trackLength);

    push();
    translate(position.x, position.y);
    fill(color);
    noStroke();
    circle(0, 0, 30);
    pop();
}


// draw() is called 60 times per second
function draw() {
    let hr = hour() / 24.0;
    let min = minute() / 60.0;
    let sec = second() /60.0;

    drawTrack();
    drawCar(hr, color(212, 0, 0));
    drawCar(min, color(0, 29, 70));
    drawCar(sec, color(255, 128, 0));
}
