// Settings:
GRID_SIZE = 10;
LSYSTEM_PASSES = 5;
ACTIONS = ["L", "R", "F", "G", "(", ")", "[", "]"];
MAX_RULE_COMPLEXITY = 5;
AXIOM = "LFRF";
TIME_SCALE = 0.002;
STEPS_P_FRAME = 5;

// Globals:
ls1 = null;
ls2 = null;
ls3 = null;
t1 = null;
t2 = null;
t3 = null;
a1 = "";
a2 = "";
a3 = "";
glow_sh = null;
gfx = null;

function warp(val, dim) {
	return val > 0 ? val % dim : val + dim;
}

class Turtle {
	constructor(pos) {
		this.pos = pos;
		this.dir = 0;
		this.stack = [];
		this.loop_stack = [];
		this.looped = [];
		this.i = 0;
	}

	do(i, action, actions) {

		switch (action) {
			case "L":
				this.dir--;
				if (this.dir == -1) this.dir = 3;
				break;

			case "R":
				this.dir++;
				if (this.dir == 4) this.dir = 0;
				break;

			case "F":
			case "G":
				let prev_pos = {x: this.pos.x, y: this.pos.y};
				switch (this.dir) {
					case 0: this.pos.y -= GRID_SIZE; break;
					case 1: this.pos.x += GRID_SIZE; break;
					case 2: this.pos.y += GRID_SIZE; break;
					case 3: this.pos.x -= GRID_SIZE; break;
				}
				if (action === "F")
					gfx.line(prev_pos.x, prev_pos.y, this.pos.x, this.pos.y);
				this.pos.x = warp(this.pos.x, width);
				this.pos.y = warp(this.pos.y, height);
				break;

			case "(":
				this.stack.push(this.pos);
				break;

			case ")":
				if (this.stack.length > 0)
					this.pos = this.stack.pop();
				break;

			case "[":
				this.loop_stack.push(i);
				break;

			case "]":
				if (!this.looped.includes(i)) {
					if (this.loop_stack.length > 0)
						this.i = this.loop_stack.pop();
					else
						this.i = 0;
					this.looped.push(i);
				}
				break;

			default:
				print("Invalid turtle action. Forgot to implement?")
				break;
		}
	}

	render(actions) {
		if (this.i < actions.length) {
			this.do(this.i, actions[this.i], actions);
			this.i++;
		}
		else {
			this.looped = [];
			this.i = 0;
		}
	}
}

class LSystem {
	constructor() {
		this.rules = [];
	}

	add_rule(rule) { this.rules.push(rule); }

	apply_rules(axiom) {
		let result = "";
		for (let c of axiom) {
			let possible_rules = [];
			for (let rule of this.rules) {
				if (rule[0] === c) possible_rules.push(rule[1]);
			}

			if (possible_rules.length > 0)
				result += possible_rules[possible_rules.length - 1];
			else result += c;
		}
		return result;
	}

	generate(axiom) {
		for (let i = 0; i < LSYSTEM_PASSES; i++) {
			axiom = this.apply_rules(axiom);
		}
		return axiom;
	}

	copy() {
		let ls = new LSystem();
		for (let rule of this.rules) {
			ls.add_rule(rule);
		}
		return ls;
	}
}

function make_random_rule() {
	complexity = random(1, MAX_RULE_COMPLEXITY);
	head = random(ACTIONS);
	body = "";
	for (let i = 0; i < complexity; i++) {
		body += random(ACTIONS);
	}
	return [head, body];
}

function preload() {
	glow_sh = loadShader("pass.vert", "glow.frag");
}

function setup() {
	createCanvas(600, 500, WEBGL);
	gfx = createGraphics(width, height);
	gfx.background(0);
	background(0);
	ls1 = new LSystem();
	ls2 = new LSystem();
	ls3 = new LSystem();
	step();
}

function step() {
	ls1.add_rule(make_random_rule());
	ls2.add_rule(make_random_rule());
	ls3.add_rule(make_random_rule());

	t1 = new Turtle({ x: width / 4, y: height / 2 });
	t2 = new Turtle({ x: width / 2, y: height / 2 });
	t3 = new Turtle({ x: width * 3 / 4, y: height / 2 });

	a1 = ls1.generate(AXIOM);
	a2 = ls2.generate(AXIOM);
	a3 = ls3.generate(AXIOM);

	print("1:" + a1);
	print("2:" + a2);
	print("3:" + a3);
}

function draw() {
	//translate(-width / 2, -height / 2);
	for (let i = 0; i < STEPS_P_FRAME; i++) {
		gfx.noStroke();
		gfx.fill(color(0, 0, 0, 2));
		gfx.rect(0, 0, width, height);
		gfx.strokeWeight(3);

		gfx.stroke(color(255, 0, 0, 40));
		gfx.fill(255, 0, 0);
		t1.render(a1);

		gfx.stroke(color(0, 255, 0, 40));
		gfx.fill(0, 255, 0);
		t2.render(a2);

		gfx.stroke(color(0, 0, 255, 40));
		gfx.fill(0, 0, 255);
		t3.render(a3);
	}

	gfx.stroke(255);
	gfx.strokeWeight(5);
	gfx.noFill();
	gfx.rect(0,0,width,height);

	glow_sh.setUniform("screen", gfx);
	glow_sh.setUniform("time", millis() * TIME_SCALE);
	glow_sh.setUniform("texSize", [width, height]);
	shader(glow_sh);
	rect(0,0,width,height);
	resetShader();
}

/*
function mousePressed() {
	if (mouseX < (width / 3)) {
		ls2 = ls1.copy();
		ls3 = ls1.copy();
	}
	else if (mouseX < (width * 2 / 3)) {
		ls1 = ls2.copy();
		ls3 = ls2.copy();
	}
	else {
		ls1 = ls3.copy();
		ls2 = ls3.copy();
	}
	gfx.background(0);
	step();
}
*/

function evolve(id) {
	if (id == 0) {
		ls2 = ls1.copy();
		ls3 = ls1.copy();
	}
	else if (id == 1) {
		ls1 = ls2.copy();
		ls3 = ls2.copy();
	}
	else {
		ls1 = ls3.copy();
		ls2 = ls3.copy();
	}
	gfx.background(0);
	step();
}