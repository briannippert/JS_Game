var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var raf;
var running = false;
var endGame = false;
var speed = 20;
var maxSpeed = 50;
var blocks = [];
var score = 0;
var mousemode = false;
var paused = true;
var Keys = {
  up: false,
  down: false,
  left: false,
  right: false
};
var hsl = 0;
var mx = 0;

document.addEventListener('keydown', function (e) {
  var kc = e.keyCode;
  e.preventDefault();
  if (running) {
    if (kc === 37 || kc == 65 || kc == 100) Keys.left = true;
    else if (kc === 39 || kc == 68 || kc == 102) Keys.right = true;
    if (kc == 192) {
      paddle.x = 0;
      paddle.width = canvas.width;
      return;
    }
    movePadle();
  }
  if (kc == 77) {
    if (mousemode == false) {
      mousemode = true;
      document.body.style.cursor = 'none';
    } else {
      mousemode = false;
      document.body.style.cursor = '';
    }
    console.log("Mouse Mode: " + mousemode);
  }
  if (kc == 82 && paused == false) {
    console.log("SPACED PRESSED")
    document.location.reload()
  }
  if (kc == 32) {
    if (paused == false) {
      paused = true;
      
      raf = window.requestAnimationFrame(draw);
      raf = window.requestAnimationFrame(draw);
    } else {
      paused = false;
      raf = window.requestAnimationFrame(draw);
    }
    console.log("Paused Mode: " + paused);
  }
});

var ball = {
  x: 100,
  y: 500,
  vx: 1,
  vy: 3,
  radius: 10,
  height: this.radius,
  width: this.radius,
  color: 'hsl(' + hsl + ',100%,50%)',
  draw: function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ball.color = 'hsl(' + hsl + ',100%,50%)';
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};


var paddle = {
  x: 200,
  y: window.innerHeight - 50,
  vx: 2,
  vy: 0,
  height: 15,
  width: 150,
  radius: 25,
  color: 'white',
  draw: function () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
clear();
generateBlocks();
raf = window.requestAnimationFrame(draw);
sleep(1000);
running = true;
raf = window.requestAnimationFrame(draw);

function clear() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameOver() {
  endGame = true;
  running = false;
  var ctx = canvas.getContext("2d");
  ctx.font = "40px Arial";
  ctx.color = 'white'
  ctx.fillStyle = 'white'
  ctx.fillText("You lost! You only got " + score + " points! Press 'R' to reload ", canvas.width / 2 - 450, canvas.height / 2);
}

function draw() {
  clear();
  if(paused == true)
  {
    var ctx = canvas.getContext("2d");
      ctx.font = "40px Arial";
      ctx.color = 'white'
      ctx.fillStyle = 'white'
      ctx.fillText("Press the space key to start! " , canvas.width / 2 - 250, canvas.height / 2);
  }
  getColor();

  checkCollisions();
  ball.draw();
  if (mousemode == true) {
    paddle.x = mx - (paddle.width / 2)
  }
  paddle.draw();
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y + ball.radius + ball.vy > canvas.height) {
    ball.vy = 0;
    ball.vx = 0;
    gameOver();
    return;
  }
  if (ball.y - ball.radius + ball.vy < 0) {
    ball.vy = -ball.vy;
  }
  if (ball.x + ball.radius + ball.vx > canvas.width || ball.x - ball.radius + ball.vx < 0) {
    ball.vx = -ball.vx;
  }
  if (endGame == true) {
    gameOver();
  }
  drawScore();
  if (paused == false && endGame == false) {
    raf = window.requestAnimationFrame(draw);
  }

}

function generateBlocks() {
  for (var i = 0; i < 64; i++) {
    blocks[i] = {
      x: 20,
      y: 25,
      height: 20,
      width: 40,
      color: 'blue',
      draw: function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    };
    blocks[i].height = 25;
    blocks[i].width = 75;
    if (i > 1) {
      blocks[i].x = blocks[i - 1].x + 90;
    }

    if (blocks[i].x + blocks[i].width > canvas.width) {
      blocks[i].x = 20;
      blocks[i].y = blocks[i - 1].y + 40;
      if (blocks[i].y == 65 || blocks[i].y == 145 || blocks[i].y == 225) {
        blocks[i].color = 'yellow';
      } else if (blocks[i].y == 105 || blocks[i].y == 185) {
        blocks[i].color = 'gray';
      }


    } else if (i > 1) {
      blocks[i].y = blocks[i - 1].y;
      if (blocks[i - 1].color == 'yellow') {
        blocks[i].color = 'yellow';
      }
      if (blocks[i - 1].color == 'gray') {
        blocks[i].color = 'gray';
      }
    }

  }
}



function mouse_position(e) {
  mx = e.clientX;
  // console.log(mx);
}


async function movePadle() {
  var dx = 0;
  if (Keys.left) {
    dx = -12;
  } else if (Keys.right) {
    dx = 12;
  }
  Keys.right = false;
  Keys.left = false;
  for (var i = 0; i < Math.abs(dx); i++) {
    await sleep(8);
    paddle.x += dx / 60 * speed;
  }
  paddle.draw;

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawScore() {
  var ctx = canvas.getContext("2d");
  ctx.font = "30px Arial";
  ctx.color = 'white';
  ctx.fillText("Score: " + score, 20, canvas.height - 10);
}

function checkCollisions() {
  for (var i = 0; i < blocks.length; i++) {
    if (ball.y <= blocks[i].y + blocks[i].height) {
      if (ball.x >= blocks[i].x && ball.x < blocks[i].x + blocks[i].width) {
        ball.vy = -ball.vy;
        if (blocks[i].color == 'gray') {
          remove(blocks, blocks[i])
        } else if (blocks[i].color == 'blue') {
          blocks[i].color = 'yellow';
        } else if (blocks[i].color == 'yellow') {
          blocks[i].color = 'gray';
        }
        score += 25;
        ball.draw();
      }
    }
  }

  if (paddle.x <= 0) {
    paddle.x = 0;
  }
  if (paddle.x + paddle.width >= window.innerWidth) {
    paddle.x = window.innerWidth - paddle.width;
  }
  paddle.draw;
  if (ball.y + ball.radius >= paddle.y) {
    if (ball.x >= paddle.x && ball.x < paddle.x + paddle.width) {
      ball.vy = -ball.vy;
      if (ball.vy > -10) {
        ball.vy--;
      }
      if (ball.vx < 0 && ball.vx > -3) {
        ball.vx--;
      } else if (ball.vx < 3) {
        ball.vx++;
      }

      console.log("FASTER" + "X: " + ball.vx + "Y: " + ball.vy)
      ball.draw();
    }
  }
}

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

function getColor() {
  if (hsl <= 360) {
    hsl++;
  } else {
    hsl = 0;
  }
}