const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

let player, obstacles, frames, score, speed, running, gameOver;

function reset(){
	frames = 0;
	score = 0;
	speed = 4;
	gameOver = false;
	running = false;
	player = { x:50, w:40, h:40, y: H-40, vy:0, grounded:true };
	obstacles = [];
	draw();
}

function spawnObstacle(){
	const h = 20 + Math.random()*40;
	obstacles.push({ x: W + 20, w: 20 + Math.random()*20, h, y: H - h });
}

function update(){
	if(gameOver) return;
	frames++;
	// start running after first jump or space
	if(running){
		score += 0.05;
		if(frames % Math.max(40,120 - Math.floor(score)) === 0) spawnObstacle();
		// increase speed slowly
		speed = 4 + Math.floor(score/10);
		// update obstacles
		for(let i = obstacles.length-1; i>=0; i--){
			obstacles[i].x -= speed;
			if(obstacles[i].x + obstacles[i].w < 0) obstacles.splice(i,1);
		}
	}
	// player physics
	player.vy += 0.8; // gravity
	player.y += player.vy;
	if(player.y + player.h >= H){
		player.y = H - player.h;
		player.vy = 0;
		player.grounded = true;
	} else player.grounded = false;

	// collision
	for(const o of obstacles){
		if(player.x < o.x + o.w && player.x + player.w > o.x &&
		   player.y < o.y + o.h && player.y + player.h > o.y){
			gameOver = true;
		}
	}
}

function draw(){
	// clear
	ctx.fillStyle = '#fff';
	ctx.fillRect(0,0,W,H);
	// ground
	ctx.fillStyle = '#e9e9e9';
	ctx.fillRect(0, H-10, W, 10);
	// player
	ctx.fillStyle = '#2b2b2b';
	ctx.fillRect(player.x, player.y, player.w, player.h);
	// obstacles
	ctx.fillStyle = '#4a4a4a';
	for(const o of obstacles) ctx.fillRect(o.x, o.y, o.w, o.h);
	// score
	ctx.fillStyle = '#222';
	ctx.font = '16px Arial';
	ctx.fillText('Score: ' + Math.floor(score), 10, 20);
	// game over
	if(gameOver){
		ctx.fillStyle = 'rgba(0,0,0,0.6)';
		ctx.fillRect(0,0,W,H);
		ctx.fillStyle = '#fff';
		ctx.font = '28px Arial';
		ctx.textAlign = 'center';
		ctx.fillText('Game Over', W/2, H/2 - 10);
		ctx.font = '16px Arial';
		ctx.fillText('กด Space เพื่อเริ่มใหม่', W/2, H/2 + 20);
		ctx.textAlign = 'start';
	}
}

function loop(){
	update();
	draw();
	if(!gameOver) requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
	if(e.code === 'Space'){
		if(gameOver){ reset(); running = true; loop(); return; }
		// jump
		if(player.grounded){
			player.vy = -12;
			player.grounded = false;
			running = true;
			if(frames === 0) loop();
		}
		e.preventDefault();
	}
});

canvas.addEventListener('mousedown', () => {
	if(gameOver){ reset(); running = true; loop(); return; }
	if(player.grounded){
		player.vy = -12;
		player.grounded = false;
		running = true;
		if(frames === 0) loop();
	}
});

// initial
reset();
draw();
