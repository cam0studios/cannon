var size, size2, targets, position, gravity, projectiles, dir, force, targetVel, targetAcc;

function setup() {
    size = v(innerWidth, innerHeight);
    size2 = p5.Vector.div(size, 2);
    createCanvas(size.x, size.y);
    position = v(0, 0);
    gravity = v(0, -0.1);
    projectiles = [];
    targets = [];
    dir = PI / 4;
    force = 10;
    targetVel = v(2, 2);
    targetAcc = gravity;
    projectiles.push({ pos: position.copy(), vel: v(force, 0).rotate(dir) });
}
function draw() {
    background(230);
    translate(100, size.y - 100);
    scale(1, -1);

    push();
    translate(position);
    rotate(dir);
    fill("rgb(255,0,0)");
    stroke(0);
    strokeWeight(5);
    rect(0, -15, 50, 30);
    circle(0, 0, 50);
    pop();

    targets.forEach((e, i) => {
        e.pos.add(e.vel);
        e.vel.add(e.acc);
        projectiles.forEach((p, pi) => {
            if (p5.Vector.sub(e.pos, p.pos).mag() < 20) {
                e.hit = true;
            }
        });
        if ((!e.hittable || e.hit) && (e.pos.x <= -110 || e.pos.y <= -110 || e.pos.x > size.x - 90/* || e.pos.y > size.y - 90*/)) {
            targets.splice(i, 1);
            i--;
        }
    });

    projectiles.forEach((e, i) => {
        e.pos.add(e.vel);
        e.vel.add(gravity);
        if (e.pos.x <= -110 || e.pos.y <= -110 || e.pos.x > size.x - 90/* || e.pos.y > size.y - 90*/) {
            projectiles.splice(i, 1);
            i--;
        }
    });
    targets.forEach((e) => {
        if (!e.hittable) fill("rgb(250,50,0)");
        else if (e.hit) fill("rgb(0,250,50)");
        else fill(200);
        stroke(50);
        strokeWeight(5);
        circle(e.pos.x, e.pos.y, 30);
    });
    projectiles.forEach((e) => {
        fill(255);
        stroke(0);
        strokeWeight(5);
        circle(e.pos.x, e.pos.y, 20);
    });
}
function v(x, y) {
    return new p5.Vector(x, y);
}
document.addEventListener("keydown", (e) => {
    if (e.key == " ") {
        targets.push({ pos: v(mouseX - 100, -mouseY + size.y - 100), vel: targetVel.copy(), acc: targetAcc.copy(), hit: false, hittable: false });
        let d = calcPath(targets[targets.length - 1], 50);
        if (d != null) {
            dir = d.heading() + PI;
            projectiles.push({ pos: position.copy(), vel: v(force, 0).rotate(dir) });
            targets[targets.length - 1].hittable = true;
        }
    }
});
function calcPath(target, steps) {
    let relPos = p5.Vector.sub(position, target.pos);
    let relVel = p5.Vector.div(target.vel, -steps);
    let relAcc = p5.Vector.mult(p5.Vector.sub(gravity, target.acc), steps ** -2);
    for (let s = 0; s < size.mag(); s += force / steps) {
        relVel.add(relAcc);
        relPos.add(relVel);
        if (relPos.mag() <= s) {
            return relPos;
        }
    }
    return null;
}