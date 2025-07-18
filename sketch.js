let currentLevel = 0;
let levels = [level1, level2];

function preload() {
	playerSheet = loadImage('assets/sprites/knight.png');
	blockSheet = loadImage('assets/sprites/world_tileset.png');
	coinsSheet = loadImage('assets/sprites/coin.png');
	slimeSheet = loadImage('assets/sprites/slime_green.png');

	coinSound = loadSound('assets/sounds/coin.wav');
	hitSound = loadSound('assets/sounds/hurt.wav');
	jumpSound = loadSound('assets/sounds/jump.wav');
}

function setup() {
	new Canvas(innerWidth / 4, innerHeight / 4, 'pixelated x4');

	//slime
	{
		slime = new Sprite();
		slime.x = 16 * 30
		slime.y = 16 * 11;
		slime.w = 14;
		slime.h = 12;
		slime.spriteSheet = slimeSheet;
		slime.addAni({ w: 24, h: 24, col: 0, row: 1, frames: 4, frameDelay: 13 });
		slime.debug = true;
		slime.anis.offset.y = -4;
		slime.rotationLock = true;
	}

	//player
	{
		player = new Sprite();
		player.color = 'red';
		player.x = 16 * 22;
		player.y = 16 * 6;
		player.w = 11;
		player.h = 13;
		player.anis.offset.y = -4;
		player.rotationLock = true;
		player.spriteSheet = playerSheet;
		allSprites.pixelPerfect = true;
		player.dashCooldown = 100;
		player.coins = 0;
		player.vies = 3;
		player.addAnis({
			idle: { w: 32, h: 32, col: 0, row: 0, frames: 4, frameDelay: 11 },
			dash: { w: 32, h: 32, col: 0, row: 7, frames: 4 },
			endDash: { w: 32, h: 32, col: 3, row: 7, frames: 1 },
			hit: { w: 32, h: 32, col: 0, row: 7, frames: 4 },
			death: { w: 32, h: 32, col: 0, row: 7, frames: 4, frameDelay: 30 }
		});
		player.changeAni('idle');
	}

	{player.feet = new Sprite();
		player.feet.collider = 'none';
		player.feet.debug = true;
		player.feet.w = 8;
		player.feet.h = 5;
	}

	{player.head = new Sprite();
		player.head.collider = 'none';
		player.head.debug = true;
		player.head.w = 8;
		player.head.h = 5;
		player.head.visible = true;
	}

	{grass = new Group();
		grass.collider = 'static';
		grass.w = 15;
		grass.h = 16;
		grass.tile = 'g';
		grass.spriteSheet = blockSheet;
		grass.addAni({ w: 16, h: 16, col: 0, row: 0 });
		grass.friction = 4;
	}

	{fakegrass = new Group();
		fakegrass.collider = 'none';
		fakegrass.w = 15;
		fakegrass.h = 16;
		fakegrass.tile = '1';
		fakegrass.spriteSheet = blockSheet;
		fakegrass.addAni({ w: 16, h: 16, col: 0, row: 0 });
		fakegrass.friction = 2;
	}

	{dirt = new Group();
		dirt.collider = 'static';
		dirt.w = 15;
		dirt.h = 16;
		dirt.tile = 'd';
		dirt.spriteSheet = blockSheet;
		dirt.addAni({ w: 16, h: 16, col: 1, row: 0 });
		dirt.friction = 4;
	}

	{fakedirt = new Group();
		fakedirt.collider = 'none';
		fakedirt.w = 15;
		fakedirt.h = 16;
		fakedirt.tile = '2';
		fakedirt.spriteSheet = blockSheet;
		fakedirt.addAni({ w: 16, h: 16, col: 1, row: 0 });
		fakedirt.friction = 2;
	}

	{wall = new Group();
		wall.collider = 'static';
		wall.w = 15;
		wall.h = 16;
		wall.tile = 'w';
		wall.spriteSheet = blockSheet;
		wall.addAni({ w: 16, h: 16, col: 7, row: 3 });
		wall.friction = 2;
	}

	{champignon = new Group();
		champignon.collider = 'static';
		champignon.w = 15;
		champignon.h = 16;
		champignon.tile = 't';
		champignon.spriteSheet = blockSheet;
		champignon.addAni({ w: 16, h: 16, col: 7, row: 6 });
		champignon.friction = 4;
	}

	{champignon2 = new Group();
		champignon2.collider = 'static';
		champignon2.w = 15;
		champignon2.h = 16;
		champignon2.tile = 'T';
		champignon2.spriteSheet = blockSheet;
		champignon2.addAni({ w: 16, h: 16, col: 7, row: 5 });
		champignon2.friction = 4;
	}

	{ice = new Group();
		ice.collider = 'static';
		ice.w = 15;
		ice.h = 16;
		ice.tile = 'i';
		ice.spriteSheet = blockSheet;
		ice.addAni({ w: 16, h: 16, col: 7, row: 0 });
		ice.friction = 0.5;
	}

	{buisson = new Group();
		buisson.collider = 'none';
		buisson.w = 15;
		buisson.h = 16;
		buisson.tile = 'b';
		buisson.spriteSheet = blockSheet;
		buisson.addAni({ w: 16, h: 16, col: 1, row: 3 });
		buisson.friction = 2;
	}

	{broken_blocks = new Group();
		broken_blocks.collider = 'static';
		broken_blocks.w = 15;
		broken_blocks.h = 16;
		broken_blocks.tile = 'x';
		broken_blocks.spriteSheet = blockSheet;
		broken_blocks.addAni({ w: 16, h: 16, col: 1, row: 0 });
		broken_blocks.friction = 2;
	}

	{dead_knight = new Group();
		dead_knight.collider = 'none';
		dead_knight.w = 15;
		dead_knight.h = 16;
		dead_knight.tile = 'k';
		dead_knight.spriteSheet = playerSheet;
		dead_knight.addAni({ w: 32, h: 32, col: 3, row: 7 });
		dead_knight.friction = 2;
		dead_knight.anis.offset.y = -3;
		dead_knight.anis.offset.x = -4;
	}

	{coins = new Group();
		coins.collider = 'none';
		coins.w = 15;
		coins.h = 16;
		coins.tile = 'c';
		coins.spriteSheet = coinsSheet;
		coins.addAni({ w: 16, h: 16, col: 0, row: 0, frames: 12 });
		coins.friction = 2;
	}

	{signs = new Group();
		signs.collider = 'none';
		signs.w = 15;
		signs.h = 16;
		signs.tile = 's';
		signs.spriteSheet = blockSheet;
		signs.addAni({ w: 16, h: 16, col: 8, row: 3 });
		signs.friction = 2;
	}

	{tree = new Group();
		tree.collider = 'none';
		tree.w = 15;
		tree.h = 16;
		tree.tile = 'a';
		tree.spriteSheet = blockSheet;
		tree.addAni({ w: 16, h: 16 * 3, col: 0, row: 1 });
		tree.friction = 2;
	}

	{bridge = new Group();
		bridge.collider = 'static';
		bridge.w = 15;
		bridge.h = 16;
		bridge.tile = '-';
		bridge.spriteSheet = blockSheet;
		bridge.addAni({ w: 16 * 3, h: 9, col: 3, row: 0 });
		bridge.friction = 2;
	}

	{doors = new Group();
		doors.collider = 'static';
		doors.w = 15;
		doors.h = 16;
		doors.tile = '|';
		doors.spriteSheet = blockSheet;
		doors.addAni({ w: 16, h: 16, col: 9, row: 3 });
		doors.friction = 4;
		doors.openTime = 0;
	}

	{bottle = new Group();
		bottle.collider = 'none';
		bottle.w = 15;
		bottle.h = 16;
		bottle.tile = '$';
		bottle.spriteSheet = blockSheet;
		bottle.addAni({ w: 16, h: 16, col: 1, row: 7 });
		bottle.friction = 4;
	}
	
	world.gravity.y = 9.81;

	tiles = new Tiles(level1, 0, 0, 16, 16);
}

async function draw() {
	background(50, 160, 255);
	//camera, IA du slime
	{
		camera.x = player.x;
		camera.y = player.y;

		player.feet.x = player.x;
		player.feet.y = player.y + 8;

		player.head.x = player.x;
		player.head.y = player.y - 8;
	
	slime.moveTo(player.x, undefined, 1);

	if (slime.x > player.x) {
		slime.mirror = true;
	} else {
		slime.mirror.x = false;
	}}

	for (let sign of signs) {
		if (player.overlapping(sign) && kb.pressing('e')) {
			text('Les blocs ne sont pas tout le temps solides...', width / 2 - 145, height / 2 - 35);
		}
	}
	for (let coin of coins) {
		if (player.overlaps(coin)) {
			coin.remove();
			player.coins = player.coins + 1;
		}
	}
	for (let broken_block of broken_blocks) {
		if (player.colliding(broken_block)) {
			broken_block.collider = 'dinamic';
		}
	}
	{for (let door of doors) {
		if (kb.pressing('d')) {
			door.openTime = 200;
		}
	}
	if (doors.openTime <= 0) {
		doors.collider = 'static';
	} else {
		doors.collider = 'none';
	}
	doors.openTime = doors.openTime - 1;
	}

	//gameOver, slime hit, idle animation
	{
	if (player.vies <= 0 || player.y > 1000) {
		await gameOver();
	} else {
		if (player.feet.overlaps(slime)) {
			await player.changeAni('hit');
			player.vies = player.vies - 1;
			player.changeAni('idle');
			slime.moveAway(player, 0.4);
			player.moveAway(slime, 0.2);
		} else {
			if (abs(player.vel.x) < 0.15) {
			player.changeAni('idle');
		}
		}		
	}}

	//propultion des champignon
	{
	if (player.feet.collide(champignon)) {
		player.vel.y = -4;
	}

	if (player.feet.collide(champignon2)) {
		player.vel.y = -7;
	}
	}
	//player action
	{
	if (player.feet.overlapping(tiles)) {
		if (kb.pressing('up')) {
			player.vel.y = -3;
		}
	}

	if (kb.pressing('left')) {
		player.vel.x = -2;
		player.mirror.x = true;
	}

	if (kb.pressing('right')) {
		player.vel.x = 2;
		player.mirror.x = false;
	}

	if (kb.pressing('down')) {
		player.vel.y = 0.5;
	}

	//dash
	{if (kb.pressing('space') && player.dashCooldown < 0) {
		player.changeAni('dash');
		player.changeAni('endDash');
		if (player.mirror.x) {
			player.vel.x = -5;
		} else {
			player.vel.x = 6;
		}
		player.dashCooldown = 100;
	}
	player.dashCooldown = player.dashCooldown - 1;
	}
	}

text('Coins: ' + player.coins, 5, 15);
text('Vie: ' + player.vies, 5, 30);
text('FPS: ' + round(frameRate()), 5, 45);

	{// changement de niveau
	if (player.overlaps(bottle)) {
		currentLevel = currentLevel + 1;
		tiles.remove();
		tiles = new Tiles(levels[currentLevel], 0, 0, 16, 16);
		player.x = width / 2;
		player.y = 0;
	}
}
}

async function gameOver() {
	player.vel.x = 0;
	player.vel.y = 0;

	push();
	player.changeAni('death');
	textSize(24);
	textAlign(CENTER);
	text('GAME OVER', width / 2, height / 2 + 20);
	pop();
	setTimeout(noLoop, 1700);

}