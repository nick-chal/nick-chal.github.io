var MIN_SIZE = 15;
var MAX_SIZE = 50;

function Ball(number) {
  var balls = [];
  var container = document.getElementsByClassName('container')[0];
  var ballInterval;
  var moving = false;
  that = this;

  this.toggle = function () {
    if (moving) {
      clearInterval(ballInterval);
      moving = false;
    } else {
      moving = true;
      ballInterval = setInterval(moveAll, 10);
    }
  }

  this.init = function () {
    var deltaX = 1;
    var deltaY = 1;
    for (var i = 0; i < number; i++) {
      var childBall = createBall();
      balls.push(childBall);
      container.appendChild(balls[i].element);
      //'rbg(' + randomGenerator(0, 255) + ',' + randomGenerator(0, 255) + ',' + randomGenerator(0, 255) + ')';
    }
    //console.log(balls);

    this.toggle();


  }



  function moveBall(i) {
    var boundaryPosition = checkBoundary(balls[i]);
    switch (boundaryPosition) {
      case 1:
        balls[i].deltaX *= -1;
        break;
      case 2:
        balls[i].deltaY *= -1;
        break;
      default:
        if (!checkCollision(balls[i], 0, balls.length, i)) {
          balls[i].element.style.left = balls[i].x + 'px';
          balls[i].element.style.top = balls[i].y + 'px';
        } else {
          balls[i].deltaX *= -1;
          balls[i].deltaY *= -1;
        }
    }
    balls[i].x += (balls[i].deltaX * balls[i].speedX);
    balls[i].y += (balls[i].deltaY * balls[i].speedY);
  }

  function moveAll() {
    for (var i = 0; i < balls.length; i++) {
      moveBall(i);
    }
  }


  function createBall() {
    var run = false;
    do {
      var obj = {};
      obj.element = document.createElement('div');
      obj.radius = randomGenerator(MIN_SIZE, MAX_SIZE);
      obj.x = randomGenerator(5, 645);
      obj.y = randomGenerator(5, 345);
      run = checkCollision(obj, 0, balls.length, -1);
      obj.speedX = randomGenerator(.5, 3);
      obj.speedY = randomGenerator(.5, 3);
      obj.deltaX = randomGenerator(1, 10) < 5 ? 1 : -1;
      obj.deltaY = randomGenerator(1, 10) < 5 ? 1 : -1;
      obj.element.style.position = 'absolute';
      obj.element.style.left = obj.x + 'px';
      obj.element.style.top = obj.y + 'px';
      obj.element.style.borderRadius = '50%';
      obj.element.style.height = obj.radius + 'px';
      obj.element.style.width = obj.radius + 'px';
      obj.element.style.backgroundColor = 'rgb(' + randomColor() + ')';
    } while (run);
    return obj;
  }

  function checkCollision(obj, start, end, position) {
    for (var i = start; i < end; i++) {
      if (position !== i) {
        if (obj.x <= (balls[i].x + balls[i].radius) && (obj.x + obj.radius) >= balls[i].x && obj.y <= (balls[i].y + balls[i].radius) && (obj.y + obj.radius) >= balls[i].y) {
          console.log('collide');
          return true;
        }
      }

    }
    return false;
  }

  function checkBoundary(obj) {
    if (obj.x <= 0 || (obj.x + obj.radius) >= 700) return 1
    else if (obj.y <= 0 || (obj.y + obj.radius) >= 400) return 2
    return 3;
  }

}

function randomGenerator(start, end) {
  return Math.floor(Math.random() * (end - start - 1)) + start;
}

function randomColor() {
  var red = randomGenerator(0, 255);
  var green = randomGenerator(0, 255);
  var blue = randomGenerator(0, 255);
  return red + "," + green + ',' + blue;
}

var ball = new Ball(10);
ball.init();

button = document.getElementsByTagName('button')[0];
button.addEventListener('click', ball.toggle);