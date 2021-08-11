const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const ballz = []
const ballFallz = []
const paddleHeight = 10
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth * 2) / 2
let rightPressed = false
let leftPressed = false
const possibleBalls = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
  f: 'f',
  g: 'g',
  h: 'h',
  i: 'i',
  j: 'j',
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  o: 'o',
  p: 'p',
  q: 'q',
  r: 'r'
}
// canvas.width = 640 canvas.height = 480

//Global Functions///////////////////////////////////////////////

//randomly generates initial x & y velocities
//so all balls can start moving at different angles
function randomX(mag) {
  let x = Math.random()
  if (x < 0.5) {
    x *= mag - Math.random() * mag
  } else {
    x *= -mag + Math.random() * mag
  }
  return x
}
function randomY(x, mag) {
  let y = Math.sqrt(mag ** 2 - x ** 2)
  return -y
}

//draws the paddle onto the canvas
function drawPaddle() {
  context.beginPath()
  context.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth * 2,
    paddleHeight
  )
  context.strokeStyle = 'black'
  context.stroke()
  context.fillStyle = 'blue'
  context.fill()
  context.closePath()
}

//checks for collisions w/ wall
wallCollision = (i) => {
  if (i !== undefined) {
    if (
      ballz[i].x + ballz[i].xVelocity > canvas.width - ballz[i].r ||
      ballz[i].x + ballz[i].xVelocity < ballz[i].r
    ) {
      ballz[i].xVelocity = -ballz[i].xVelocity
    }
    if (ballz[i].y + ballz[i].yVelocity < ballz[i].r) {
      ballz[i].yVelocity = -ballz[i].yVelocity
    } else if (
      ballz[i].y + ballz[i].r / 1.2 + ballz[i].yVelocity >
        canvas.height - paddleHeight ||
      ballz[i].y + ballz[i].yVelocity > canvas.height
    )
      if (
        ballz[i].x > paddleX - ballz[i].r / 3 &&
        ballz[i].x < paddleX + paddleWidth * 2 + ballz[i].r / 3
      ) {
        ballz[i].yVelocity = -ballz[i].yVelocity
      } else {
        ballFallz.push('1')
        ballz.splice(i, 1)
      }
  }
}

function ballCollisionDet(b1, b2) {
  console.log(b2)
  if (b2 !== undefined) {
    if (b1.x + b1.xVelocity + b1.r > b2.x + b2.xVelocity + b2.r) {
      // b1.xVelocity = -b1.xVelocity
      // b2.xVelocity = -b2.xVelocity
      console.log('collision')
    }
    if (b1.y + b1.yVelocity + b1.r > b2.y + b2.yVelocity + b2.r) {
      // b1.yVelocity = -b1.yVelocity
      // b2.yVelocity = -b2.yVelocity
      console.log('collision')
    }
  }
}

function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = true
  } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = true
  }
}
function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = false
  } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = false
  }
}
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth
  }
  if (paddleX + paddleWidth * 2 > canvas.width) {
    paddleX = canvas.width - paddleWidth * 2
  }
  if (paddleX < 0) {
    paddleX = 0
  }
}
keyPressCheck = () => {
  if (rightPressed) {
    paddleX += 10
    if (paddleX + paddleWidth * 2 > canvas.width) {
      paddleX = canvas.width - paddleWidth * 2
    }
  } else if (leftPressed) {
    paddleX -= 10
    if (paddleX < 0) {
      paddleX = 0
    }
  }
}
paddleWallCollision = () => {}
//Event Listeners/////////////////////////////////////////////
document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)
//Ball Classes//////////////////////////////////////////////////

//class for slowest ball
class slowBall {
  constructor() {
    this.r = 30
    this.x = canvas.width / 2
    this.y = canvas.height - 100
    this.mag = 4
    this.xVelocity = randomX(this.mag)
    this.yVelocity = randomY(this.xVelocity, this.mag)
    this.collisionCounter = []
    ballz.push(this)
  }
  //draws ball onto the canvas
  drawBall() {
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.strokeStyle = `black`
    context.stroke()
    context.fillStyle = `grey`
    context.fill()
  }
  //handles movement
  move() {
    this.x += this.xVelocity
    this.y += this.yVelocity
  }
}

//Ball Creation Funtions////////////////////////////////
let ball = new slowBall()
setInterval(function throwBall() {
  ball = new slowBall()
}, 5000)
//Animation Function/////////////////////////////////////
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ballz.forEach((b, index) => {
    b.drawBall()
    b.move()
    wallCollision(index)
    for (let i = index - 1; i < ballz.length; i++) {
      ballCollisionDet(ballz[index], ballz[i])
    }
  })
  drawPaddle()
  keyPressCheck()
  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
