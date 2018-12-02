var CANVAS_HEIGHT = 512;
var CANVAS_WIDTH = 500;
var GAP = 95;

var gameOver = false;
var gameInitial = true;

var container = document.getElementsByClassName('container')[0];
var msgBoard = document.getElementsByClassName('msg-board')[0];

function Bird() {
  this.x = 70;
  this.y = CANVAS_HEIGHT / 2;
  this.counter = 0;

  this.speed = 0;
  this.gravity = 1.2;
  this.upForce = 20;

  this.width = 34;
  this.height = 24;

  this.rotation = 0;

  this.element;

  this.init = function () {
    this.element = document.createElement('div');
    this.element.style.height = this.height + 'px';
    this.element.style.width = this.width + 'px';
    this.element.classList.add('bird');
    this.element.style.position = 'absolute';
    this.element.style.backgroundImage = "url('./images/bird-bg.png') ";
    this.element.style.backgroundPosition = 'center bottom';
    this.element.style.borderRadius = '0';
    this.element.style.top = this.y + 'px';
    this.element.style.left = this.x + 'px';
    this.element.style.zIndex = '200';
  }

  this.updateBird = function () {

    this.speed += this.gravity;
    if (this.speed > 20) this.speed = 20;
    if (this.speed < -10) this.speed = -10;
    this.y += this.speed;
    this.element.style.top = this.y + 'px';
    this.element.style.transform = `rotate(${this.rotation}deg)`;

    if (this.counter % 16 === 0) {
      this.element.style.backgroundPosition = 'center bottom';
    } else if (this.counter % 16 === 4 || this.counter % 16 === 12) {
      this.element.style.backgroundPosition = 'center center';
    } else if (this.counter % 16 === 8) {
      this.element.style.backgroundPosition = 'center top';
    }

    if (this.speed >= 8 && this.speed < 15) {
      this.rotation = this.speed * 2;
    } else if (this.speed >= 15) {
      this.rotation = this.speed * 4.5;
    } else {
      this.rotation = -30;
    }




    this.counter++;

    if (this.y + 32 >= CANVAS_HEIGHT) {
      gameOver = true;
      this.speed = 0;
      this.y = CANVAS_HEIGHT - 25;
      this.element.style.top = (CANVAS_HEIGHT - 25) + 'px';
    }
    if (this.y < 0) {
      gameOver = true;
      this.speed = 0;
      this.y = 0;
      this.element.style.top = 0 + 'px';
    }

  }

  this.goUp = function () {
    this.speed -= this.upForce;
    this.rotation = -5;
    // if (this.speed < -35) this.speed = 1;
  }

}


function Pipe() {
  this.height = randomGenerator(40, (CANVAS_HEIGHT - GAP - 80));
  this.x = CANVAS_WIDTH;
  var speed = 4;
  this.width = 74;
  this.eleBottom;
  this.eleTop = document.createElement('div');
  this.eleBottom = document.createElement('div');
  this.eleBottomHead = document.createElement('div');
  this.eleTopHead = document.createElement('div');

  this.init = function () {

    this.eleTop.style.position = 'absolute';
    this.eleTop.style.top = '0px';
    this.eleTop.style.width = this.width + 'px';
    this.eleTop.style.backgroundImage = "url('./images/base-bg.png') ";
    this.eleTop.style.height = (this.height - 36) + 'px';
    this.eleTop.style.left = this.x + 'px'


    this.eleBottom.style.position = 'absolute';
    this.eleBottom.style.bottom = '112px';
    this.eleBottom.style.width = this.width + 'px';
    this.eleBottom.style.backgroundImage = "url('./images/base-bg.png')";
    this.eleBottom.style.height = (CANVAS_HEIGHT - this.height - GAP - 36) + 'px';
    this.eleBottom.style.left = this.x + 'px';

    this.eleBottomHead.style.position = 'absolute';
    this.eleBottomHead.style.top = (this.height + GAP) + 'px';
    this.eleBottomHead.style.width = '78px';
    this.eleBottomHead.style.backgroundImage = "url('./images/pipe-bot.png')";
    this.eleBottomHead.style.height = '36px';
    this.eleBottomHead.style.left = (this.x - 2) + 'px';

    this.eleTopHead.style.position = 'absolute';
    this.eleTopHead.style.top = (this.height - 36) + 'px';
    this.eleTopHead.style.width = '78px';
    this.eleTopHead.style.backgroundImage = "url('./images/pipe-top.png')";
    this.eleTopHead.style.height = '36px';
    this.eleTopHead.style.left = (this.x - 2) + 'px';


    container.appendChild(this.eleTop);
    container.appendChild(this.eleBottom);
    container.appendChild(this.eleBottomHead);
    container.appendChild(this.eleTopHead);
  }

  this.updatePipe = function () {
    this.x -= speed;
    this.eleBottom.style.left = this.x + 'px';
    this.eleTop.style.left = this.x + 'px';
    this.eleTopHead.style.left = (this.x - 2) + 'px';
    this.eleBottomHead.style.left = (this.x - 2) + 'px';
  }

  this.remove = function () {
    container.removeChild(this.eleTop);
    container.removeChild(this.eleBottom);
    container.removeChild(this.eleBottomHead);
    container.removeChild(this.eleTopHead);
  }
}

function Base(start) {
  this.element = document.createElement('div');
  this.x = start;
  this.speed = 4;
  this.height = 112;
  this.width = 336;
  this.element.style.height = this.height + 'px';
  this.element.style.width = this.width + 'px';
  this.element.style.backgroundImage = "url('./images/base.png')";
  this.element.style.position = 'absolute';
  this.element.style.left = this.x + 'px';
  this.element.style.bottom = '0';
  container.appendChild(this.element);

  this.update = function () {
    this.x -= this.speed;
    this.element.style.left = this.x + 'px';
  }
  this.remove = function () {
    container.removeChild(this.element);
  }
}


function Game() {

  var bird;
  var mainInterval;
  var gameOverInterval;
  var pipes = [];
  var base;
  var gameScore = 0;
  var gameCounter = 0;
  var that = this;
  var birdFalling;
  var scoreSheet = [document.createElement('div'), document.createElement('div')];

  var gameOverSign = document.createElement('div');
  gameOverSign.style.display = 'none';
  gameOverSign.style.width = '192px';
  gameOverSign.style.height = '42px';
  gameOverSign.style.position = 'absolute';
  gameOverSign.style.top = '291px';
  gameOverSign.style.left = '154px';
  gameOverSign.style.zIndex = '300';
  gameOverSign.style.backgroundImage = "url('./images/gameover.png') ";
  container.appendChild(gameOverSign);

  var gameStartSign = document.createElement('div');
  gameStartSign.style.display = 'block';
  gameStartSign.style.width = '184px';
  gameStartSign.style.height = '93px';
  gameStartSign.style.position = 'absolute';
  gameStartSign.style.top = '291px';
  gameStartSign.style.left = '154px';
  gameStartSign.style.zIndex = '300';
  gameStartSign.style.backgroundImage = "url('./images/gamestart.png') ";
  container.appendChild(gameStartSign);

  function scoreInit() {
    for (var i = 0; i < scoreSheet.length; i++) {
      scoreSheet[i].style.height = '36px';
      scoreSheet[i].style.width = '24px';
      scoreSheet[i].style.position = 'absolute';
      scoreSheet[i].style.zIndex = '100';
      scoreSheet[i].style.top = '15px';
      scoreSheet[i].style.backgroundImage = "url('./images/0.png')";
      container.appendChild(scoreSheet[i]);
    }
    scoreSheet[0].style.left = '225px';
    scoreSheet[0].style.display = 'none';
    scoreSheet[1].style.left = '251px';
  }

  function updateScore() {
    var tens;
    var ones;
    tens = gameScore >= 10 ? parseInt(gameScore / 10) : 0;
    if (tens > 0) scoreSheet[0].style.display = 'block';
    ones = gameScore % 10;
    scoreSheet[0].style.backgroundImage = `url('./images/${tens}.png')`;
    scoreSheet[1].style.backgroundImage = `url('./images/${ones}.png')`;

  }


  this.gameInit = function () {
    bird = new Bird();
    bird.init();
    container.appendChild(bird.element);
    scoreInit();
    pipes = [];
    gameScore = 0;
    gameCounter = 0;
    updateScore();
    birdFalling = false;
    base = [new Base(0), new Base(336), new Base(672)];
  }

  function fallBird() {
    if (bird.y >= CANVAS_HEIGHT - 25) {
      clearInterval(gameOverInterval);
      birdFalling = false;
    } else {
      birdFalling = true;
      bird.updateBird();

    }
  }

  function run() {

    if (!gameOver) {
      gameCounter++;
      bird.updateBird();
      if (gameCounter % 75 === 0) {
        var newPipe = new Pipe();
        newPipe.init();
        pipes.push(newPipe);
      }
      if (base[0].x === -336) {
        base.push(new Base(672));
        base[0].remove();
        base.shift();
      }
      for (var i = 0; i < base.length; i++) {
        base[i].update();
      }

      for (var i = 0; i < pipes.length; i++) {
        pipes[i].updatePipe();
        if (pipes[i].x == 16) {
          gameScore++;
          updateScore();
        }
        checkCollision(bird, pipes[i]);
        if (pipes[i].x < -50) {
          pipes[i].remove();
          pipes.shift();
        }
      }
    } else {
      clearInterval(mainInterval);
      msgBoard.style.display = 'block';
      gameOverSign.style.display = 'block';
      gameOverInterval = setInterval(fallBird, 30);
    }
  }

  var checkCollision = function (bird, pipe) {
    if (pipe.x <= (bird.x + bird.width) && (pipe.x + pipe.width >= bird.x)) {
      if (bird.y <= pipe.height || (bird.y + bird.height) <= pipe.height) {
        gameOver = true;
      } else if (bird.y >= (pipe.height + GAP) || (bird.y + bird.height) >= (pipe.height + GAP)) {
        gameOver = true;
      }
    }
  }

  document.addEventListener('keydown', function (event) {
    if (event.keyCode === 32 && !gameOver && !gameInitial) bird.goUp();

  });

  document.addEventListener('keyup', function (event) {
    if (event.keyCode === 32 && gameInitial) {
      msgBoard.style.display = 'none';
      gameInitial = false;
      gameStartSign.style.display = 'none';
      mainInterval = setInterval(run, 30);
    } else if (event.keyCode === 32 && gameOver && !birdFalling) {
      msgBoard.style.display = 'block';
      gameStartSign.style.display = 'block';
      gameOverSign.style.display = 'none';
      gameInitial = true;
      gameOver = false;
      clearInterval(mainInterval);
      container.removeChild(bird.element);
      for (var i = 0; i < pipes.length; i++) {
        pipes[i].remove();
      }
      that.gameInit();
    }
  });


}



function randomGenerator(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

var game = new Game();

game.gameInit();