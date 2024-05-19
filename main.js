var size, targets, position, gravity, projectiles, dir, force, targetVel, targetAcc;

function setup() {
    size = v(innerWidth, innerHeight);
    createCanvas(size.x, size.y);
    position = v(0, 0);
    gravity = v(0, -0.1);
    projectiles = [];
    targets = [];
    dir = PI / 4;
    force = 10;
    targetVel = v(2, 2);
    targetAcc = gravity.copy();
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
            if (p5.Vector.sub(e.pos, p.pos).mag() < 20 && e.hitBy.indexOf(p.id) == -1) {
                e.hit++;
                e.hitBy.push(p.id);
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
        if (e.hittable == 0) fill("rgb(250,50,0)");
        else if (e.hit >= e.hittable) fill("rgb(0,250,50)");
        else if (e.hit > 0) fill("rgb(250,250,0)");
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
        targets.push({ pos: v(mouseX - 100, -mouseY + size.y - 100), vel: targetVel.copy(), acc: targetAcc.copy(), hit: 0, hittable: 0, hitBy: [] });
        let hits = calcHits(targets[targets.length - 1], 50);
        hits.forEach((d) => {
            dir = d.heading() + PI;
            projectiles.push({ pos: position.copy(), vel: v(force, 0).rotate(dir), id: floor(random() * 1000) });
            targets[targets.length - 1].hittable++;
        });
    }
});
function calcHits(target, steps) {
    let relPos = p5.Vector.sub(position, target.pos);
    let relVel = p5.Vector.div(target.vel, -steps);
    let relAcc = p5.Vector.mult(p5.Vector.sub(gravity, target.acc), steps ** -2);
    let hits = [];
    let inside = false;
    let pastInside = false;
    for (let s = 0; s < size.mag() * 3; s += force / steps) {
        relVel.add(relAcc);
        relPos.add(relVel);
        inside = relPos.mag() <= s;
        if (inside != pastInside) {
            hits.push(relPos.copy());
        }
        pastInside = inside;
    }
    return hits;
}
addEventListener("resize", (e) => {
    size = v(innerWidth, innerHeight);
    resizeCanvas(size.x, size.y);
});