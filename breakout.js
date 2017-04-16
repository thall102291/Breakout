var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var color = "#1F7A1F"; //color for all objects
var score = 0; //players score
var lives = 3; //players lives

var ball = {
	x: 0,
	y: 0,
	dx: 2,
	dy: -2,
	radius: 10,
	update: updateBall
};

function updateBall(){
	var x = ball.x;
	var y = ball.y;
	var dx = ball.dx;
	var dy = ball.dy;
	var r = ball.radius;

	if(x + dx < r || x + dx > canvas.width - r){
		ball.dx = -dx;
	}
	if(y + dy < r){
		ball.dy = -dy;
	}
	else if(y + dy > canvas.height - r){
		if(x >= paddle.x - r && x <= paddle.x + paddle.width + r){
			ball.dy = -dy;
		}
		else{
			lives--;
			if(!lives){
				alert("GAME OVER");
				document.location.reload();
			}else{
				resetBallPos();
				ball.dx = 2;
				ball.dy = -2;
				paddle.x = (canvas.width - paddle.width) / 2;
			}
		}	
	}

	ball.x += ball.dx;
	ball.y += ball.dy;
}

resetBallPos();

var paddle = {
	height: 10,
	width: 75,
	x: 0,
	speed: 5,
	update: updatePaddle
};

resetPaddlePos();

function updatePaddle(){
	if(leftPressed && paddle.x > 0){
		paddle.x -= paddle.speed;
	} else if(rightPressed && paddle.x < canvas.width - paddle.width){
		paddle.x += paddle.speed;
	}
}

var brickRows = 3;
var brickCols = 5;

function Brick(c, r) {
	this.status = 1;	//1 is alive, 0 is dead
	this.width = 75;
	this.height = 15;
	this.padding = 10;
	this.offsetTop = 30;
	this.offsetLeft = 30;
	this.x = (c *(this.width + this.padding)) + this.offsetLeft;
	this.y = (r *(this.height + this.padding)) + this.offsetTop;
}

// Initialize bricks
var bricks = [];
 for(r = 0; r < brickRows; r++){
	bricks[r] = [];
	for(c = 0; c < brickCols; c++){
        bricks[r][c] =  new Brick(c, r);
    }
}

//Controls variables
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

function keyDown(e){
	if(e.keyCode == 39){
		rightPressed = true;
	}
	else if(e.keyCode == 37){
		leftPressed = true;
	}
}

function keyUp(e){
	if(e.keyCode == 39){
		rightPressed = false;
	}
	else if(e.keyCode == 37){
		leftPressed = false;
	}
}

function update(){
	ball.update();
	paddle.update();
	collisionDetection();
}

function draw(){
	update();
	ctx.clearRect(0,0,canvas.width, canvas.height);
	drawBricks();
	drawPaddle();
	drawBall();
	drawHud();

	requestAnimationFrame(draw);
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddle.x, canvas.height - paddle.height,
	paddle.width, paddle.height);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawBricks(){
	for(r = 0; r < brickRows; r++){
		for(c = 0; c < brickCols; c++){
			var b = bricks[r][c];
			if(b.status == 1){
				ctx.beginPath();
				ctx.rect(b.x, b.y, b.width, b.height);
				ctx.fillStyle = color;
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawHud(){
	ctx.font = "16px Ariel";
	ctx.fillStyle = color;
	ctx.fillText("Score: " + score, 8, 20);
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function resetBallPos(){
	ball.x = canvas.width / 2;
	ball.y = canvas.height -30;
	//adjust the angle of the ball release so game isn't always the same
	ball.dx = (Math.random() * (3 - -6)) + -6;
}

function resetPaddlePos(){
	paddle.x = (canvas.width - paddle.width) / 2;
}

function collisionDetection(){
	for(r=0; r < brickRows; r++){
		for(c=0; c < brickCols; c++){
			var b = bricks[r][c];
			if(b.status){
				if(ball.x > b.x && ball.x < b.x + b.width &&
				ball.y > b.y && ball.y < b.y + b.height){
					ball.dy = -(ball.dy);
					b.status = 0;
					score++;
					if(score >= brickRows * brickCols){
						alert("YOU WIN!");
						document.location.reload();
					}
				}
			}
		}
	}
}

draw();