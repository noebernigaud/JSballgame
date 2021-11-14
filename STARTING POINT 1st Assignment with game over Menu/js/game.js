// useful to have them as global variables
var canvas, ctx, w, h;
var mousePos;

// an empty array!
var balls = [];
var fireballs = [];
var initialNumberOfBalls;
var globalSpeedMutiplier = 1;
var wrongBallsEaten = goodBallsEaten = 0;
var numberOfGoodBalls = 0;
var level = 1;
var bestScore = 0;
var previousBestScore = 0;
var highscores = [{ name: "no player", score: 0 }, { name: "no player", score: 0 }, { name: "no player", score: 0 }]
var playerName = "anonymous"
var scoreUpdated = 1;
var isThereNewRecord = "No new record, try again!"

// game state (game over, game running, starting screen, hi score screen, options  etc.)
let gameState = "StartMenu";
let currentScore = 0;

//setting up images
let hero = new Image();
hero.src = 'Mario.png';
let badBall = new Image();
badBall.src = 'Gumba.png';
let coin = new Image();
coin.src = 'Coin.png';
let heart = new Image();
heart.src = 'Heart.png'
let imgObstacle = new Image();
imgObstacle.src = 'Water.png'
let imgBackground = new Image();
imgBackground.src = 'Grass.jpg'
let bowser = new Image();
bowser.src = 'Bowser.png';
let imgFireball = new Image();
imgFireball.src = 'Fireball.png';

var delayFireball = 30;
var cooldown = delayFireball;

var player = {
  x: 10,
  y: 10,
  radius: 20,
  image: hero
}

var obstacle = {
  x: 200,
  y: 200,
  width: 300,
  height: 300,
  image: imgObstacle
}

var background = {
  x: 0,
  y: 0,
  width: 800,
  height: 800,
  image: imgBackground
}

let numberOfLives = 5;

window.onload = function init() {
  //calls the highscores and write them
  writeHighscores();

  // called AFTER the page has been loaded
  canvas = document.querySelector("#myCanvas");

  // often useful
  w = canvas.width;
  h = canvas.height;

  //obstacle occupant le tier central du canvas
  obstacle.x = w / 3;
  obstacle.y = h / 3;
  obstacle.width = w / 3;
  obstacle.height = h / 3;

  //redimmensione le background pour le canvas
  background.width = w;
  background.height = h;

  // important, we will draw with this object
  ctx = canvas.getContext('2d');

  // add a mousemove event listener to the canvas
  canvas.addEventListener('mousemove', mouseMoved);
  document.addEventListener('keydown', keyPressed);


  // ready to go !
  mainLoop();
};

function writeHighscores() {
  var leaderBoardScores = document.querySelector("#leaderScores");
  leaderBoardScores.innerHTML = "";
  highscores.forEach(function (high) {
    leaderBoardScores.innerHTML += "" + high.name + " : " + high.score + "</br>";
  });
}

function keyPressed(event) {
  console.log('key pressed : ' + event.key);
  if (event.key === " ") {
    if (gameState === "GameOverMenu") {
      // reset the level to 0, the score to 0 etc.
      restartGame();
    } else if (gameState === "StartMenu") {
      gameState = "GameRunning";
      startGame(level);
    }
  }
  //suggest to press space if on a menu, look to fire a fireball if in game and key is z/q/s/d
  else {
    if (gameState === "GameOverMenu" || gameState === "StartMenu") {
      alert("press the spacebar to start a game")
    } else if (gameState === "GameRunning" && cooldown>=delayFireball) {
      cooldown = 0;
      switch (event.key) {
        case "z": launchFireball(0, -10); break;
        case "q": launchFireball(-10, 0); break;
        case "s": launchFireball(0, 10); break;
        case "d": launchFireball(10, 0); break;
        default: break;
      }
    }
  }
}

function restartGame() {
  //reset game variables to initial state
  level = 1;
  wrongBallsEaten = goodBallsEaten = 0;
  currentScore = 0;
  numberOfLives = 5;
  globalSpeedMutiplier = 1;
  fireballs = [];

  previousBestScore = bestScore;
  isThereNewRecord = "No new record, try again!"

  startGame(level);

  gameState = "GameRunning";
}

function startGame(level) {
  globalSpeedMutiplier += 0.1;
  createBalls(); //le tableau balls est initialisé pour le level GOOD
  fireballs=[];
  wrongBallsEaten = goodBallsEaten = 0;
}

//utilitaire pour compter les bonne balles
function countNumberOfGoodBalls(balls, coin) {
  var nb = 0;
  balls.forEach(function (b) {
    if (b.image === coin)
      nb++;
  });
  return nb;
}

function ruleDisplay() {
  alert("Hello and welcome to my first Javascript game! You must catch the coins without getting caught by Bowser or his minions. Hearts will increase your life number by one. Use the ZQSD keys to use fireballs on minions - be careful, Bowser is invincible! You can't go in the water or lava, but you can jump over it! Use the settings parameters to custom your epxerience. Have fun! :-)")
}

function changeNbBalls(nb) {
  startGame(nb);
}

function changePlayerHero(selectedHero) {
  hero.src = selectedHero;
}

function changeMinions(selectedMinion) {
  badBall.src = selectedMinion;
}

function changeEnv(selectedEnv) {
  if (selectedEnv === "prairie") {
    imgBackground.src = 'Grass.png';
    imgObstacle.src = 'Water.png';
  } else {
    imgBackground.src = 'Metal.jfif';
    imgObstacle.src = 'Lava.jpg';
  }
}

function changeBallSpeed(coef) {
  globalSpeedMutiplier = coef;
}

function changeDelayFireball(newDelay) {
  delayFireball = newDelay;
}

function mouseMoved(evt) {
  mousePos = getMousePos(canvas, evt);
}

function getMousePos(canvas, evt) {
  // necessary work in the canvas coordinate system
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function movePlayerWithMouse() {
  if (mousePos !== undefined && !mouseIntoObstacle()) {
    player.x = mousePos.x;
    player.y = mousePos.y;
  }
}

function mouseIntoObstacle() {
  if (mousePos.x > obstacle.x && mousePos.x < (obstacle.x + obstacle.width)) {
    if (mousePos.y > obstacle.y && mousePos.y < (obstacle.y + obstacle.height)) {
      console.log("la souris est dans l'obstacle")
      return true;
    }
  }
  return false;
}

function mainLoop() {
  // 1 - clear the canvas
  ctx.clearRect(0, 0, w, h);

  switch (gameState) {
    case "StartMenu":
      ctx.font = 'italic 20pt Calibri';
      ctx.fillText("Press <SPACE> to start the game", 20, 180);
      break;
    case "GameRunning":
      updateGame();
      break;
    case "GameOverMenu":
      ctx.font = 'italic 40pt Calibri';
      ctx.fillText("Your score was: " + currentScore, 20, 100);
      if (currentScore > highscores[highscores.length - 1].score && (scoreUpdated != 1)) {
        playerName = prompt("Please enter your name", playerName);
        updateHighScore();
        isThereNewRecord = "NEW RECORD, CONGRATULATIONS!"
        scoreUpdated = 1;
      }
      ctx.fillText(isThereNewRecord, 20, 160);
      ctx.fillText("GAME OVER", 20, 260);
      ctx.fillText("Press <SPACE> to start a new game", 20, 340);
      break;
  }

  // ask the browser to call mainloop in 1/60 of  for a new animation frame
  requestAnimationFrame(mainLoop);
}

function updateHighScore() {
  for (var i = 0; i < highscores.length; i++) {
    if (highscores[i].score < currentScore) {
      highscores.splice(i, 0, { name: playerName, score: currentScore });
      highscores.pop();
      writeHighscores();
      break;
    }
  }
}

function updateGame() {
  // draw the background
  drawBackground(background);
  drawBackground(obstacle);

  // draw the ball and the player
  drawPlayer(player);
  drawAllBalls(balls);

  //draw the fireballs
  drawAllBalls(fireballs);

  //compte le nombre de good ball
  numberOfGoodBalls = 0;
  balls.forEach(function (b) { if (b.image === coin) { numberOfGoodBalls++; } });

  drawBallNumbers(balls);

  // animate the ball that is bouncing all over the walls
  moveAllBalls(balls);
  moveAllFireballs(fireballs);

  movePlayerWithMouse();

  //verifies if all good balls have been eaten
  if (numberOfGoodBalls === 0) {
    level++;
    startGame(level);
  }

  cooldown = Math.min((cooldown+1), delayFireball);
}

// Collisions between 2 circles
function circsOverlap(b1, b2) {
  var dx = b1.x - b2.x;
  var dy = b1.y - b2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  return (distance < b1.radius + b2.radius)
}

function createBalls() {
  // empty array
  balls = [];

  // create level good balls
  for (var i = 0; i < level; i++) {
    balls.push(createOneBall(20, randomSpeed(1, 5), randomSpeed(1, 5), coin));
  }
  //create bad balls
  for (var i = 0; i < Math.round(level * Math.log(level)); i++) {
    balls.push(createOneBall(30, randomSpeed(1, 5), randomSpeed(1, 5), badBall));
  }
  //create hearts
  for (var i = 0; i < Math.round(level / 5); i++) {
    balls.push(createOneBall(30, randomSpeed(1, 5), randomSpeed(1, 5), heart));
  }

  //always 1 bowser
  balls.push(createOneBall(60, randomSpeed(1, 2), randomSpeed(1, 2), bowser));
}

//auxiliaire de createBalls
function createOneBall(radius, speedX, speedY, image) {
  var b = {
    x: w / 2,
    y: h / 2,
    radius: radius,
    speedX: speedX, // between -5 and + 5
    speedY: speedY, // between -5 and + 5
    image: image
  }
  // return the created ball
  return b;
}

//auxiliaire de createBalls gérant les vitesses aleatoires
function randomSpeed(min, max) {
  var randomGenerator = -(max) + 2 * max * Math.random();
  if (Math.abs(randomGenerator) < min) { randomGenerator = Math.sign(randomGenerator) * min; }
  return randomGenerator
}

function drawBallNumbers(balls) {
  ctx.save();
  ctx.font = "20px Arial";

  if (balls.length === 0) {
    level++;
    startGame(level);
  } else {
    ctx.fillText("Balls still alive: " + balls.length, 30, 30);
    ctx.fillText("Good Balls in level: " + numberOfGoodBalls, 30, 50);
    ctx.fillText("Good Balls eaten: " + goodBallsEaten, 30, 70);
    ctx.fillText("Wrong Balls eaten: " + wrongBallsEaten, 30, 90);
    ctx.fillText("Lives left : " + numberOfLives, 30, 110);
    ctx.fillText("SCORE = " + currentScore, 30, 130);
    ctx.fillText("LEVEL : " + level, 680, 50);
  }
  ctx.restore();
}

function drawAllBalls(ballArray) {
  ballArray.forEach(function (b) {
    drawFilledCircle(b);
  });
}

function moveAllBalls(ballArray) {
  // iterate on all balls in array
  ballArray.forEach(function (b, index) {
    // b is the current ball in the array
    if (b.image !== bowser) {
      b.x += (b.speedX * globalSpeedMutiplier);
      b.y += (b.speedY * globalSpeedMutiplier);
    }

    if (b.image === bowser) {
      b.x += (b.speedX * globalSpeedMutiplier) * Math.sign((player.x - b.x) * Math.sign(b.speedX));
      b.y += (b.speedY * globalSpeedMutiplier) * Math.sign((player.y - b.y) * Math.sign(b.speedY));
    }

    testCollisionBallWithWalls(b);

    testCollisionWithPlayer(b, index);
  });
}

function moveAllFireballs(ballArray) {
  // iterate on all balls in array
  ballArray.forEach(function (b, index) {
    // b is the current ball in the array
    b.x += (b.speedX);
    b.y += (b.speedY);

    testCollisionWithFireballs(b, index);
  });
}

function launchFireball(xSpeed, ySpeed) {
  var fireball = {
    x: player.x,
    y: player.y,
    radius: 10,
    speedX: xSpeed,
    speedY: ySpeed,
    image: imgFireball
  }
  fireballs.push(fireball);
}

function testCollisionWithPlayer(b, index) {
  if (circsOverlap(player, b)) {
    // we remove the element located at index
    // from the balls array
    // splice: first parameter = starting index
    //         second parameter = number of elements to remove
    if (b.image === coin) {
      // Yes, we remove it and increment the score
      goodBallsEaten += 1;
      currentScore++;

      if (numberOfGoodBalls === 0) {
        level++;
        startGame(level);
      }
    } else if (b.image === heart) {
      numberOfLives++;
    } else {
      wrongBallsEaten += 1;

      // we decrement the number of lives
      numberOfLives--;

      if (numberOfLives === 0) {
        // display game over menu
        gameState = "GameOverMenu";
        scoreUpdated = 0;
      }
    }

    balls.splice(index, 1);

  }
}

function testCollisionBallWithWalls(b) {
  // COLLISION WITH VERTICAL WALLS ?
  if ((b.x + b.radius) > w) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedX = -b.speedX;

    // put the ball at the collision point
    b.x = w - b.radius;
  } else if ((b.x - b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedX = -b.speedX;

    // put the ball at the collision point
    b.x = b.radius;
  }

  // COLLISIONS WTH HORIZONTAL WALLS ?
  // Not in the else as the ball can touch both
  // vertical and horizontal walls in corners
  if ((b.y + b.radius) > h) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedY = -b.speedY;

    // put the ball at the collision point
    b.y = h - b.radius;
  } else if ((b.y - b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedY = -b.speedY;

    // put the ball at the collision point
    b.Y = b.radius;
  }
}

function testCollisionWithFireballs(f, index) {
  //verifie une eventuelle collision avec une autre ball
  var i = 0;
  balls.forEach(function (b) {
    if (circsOverlap(b, f)) {
      switch (b.image) {
        case bowser:
          fireballs.splice(index, 1);
          break;
        case badBall:
          fireballs.splice(index, 1);
          balls.splice(i, 1);
          break;
        default:
          break;
      }
    }
    i++;
  });
  //verifie que la fireball n'est pas sortie du jeu
  if(f.x > w + 100 || f.x < -100 || f.y > h + 100 || f.y < -100){
    fireballs.splice(index, 1);
  }
}

function drawPlayer(r) {
  drawFilledCircle(r);
}

function drawFilledCircle(c) {
  // GOOD practice: save the context, use 2D trasnformations
  ctx.save();
  // translate the coordinate system, draw relative to it
  ctx.translate(c.x - c.radius, c.y - c.radius);
  ctx.drawImage(c.image, 0, 0, c.radius * 2, c.radius * 2);
  // GOOD practice: restore the context
  ctx.restore();
}

function drawBackground(o) {
  // GOOD practice: save the context, use 2D trasnformations
  ctx.save();
  // translate the coordinate system, draw relative to it
  ctx.translate(o.x, o.y);
  ctx.drawImage(o.image, 0, 0, o.width, o.height);
  // GOOD practice: restore the context
  ctx.restore();
}