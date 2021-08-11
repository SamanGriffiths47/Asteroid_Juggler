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
      ballz[i].position.x + ballz[i].velocityX > canvas.width - ballz[i].r ||
      ballz[i].position.x + ballz[i].velocityX < ballz[i].r
    ) {
      ballz[i].velocityX = -ballz[i].velocityX
    }
    if (ballz[i].position.y + ballz[i].velocityY < ballz[i].r) {
      ballz[i].velocityY = -ballz[i].velocityY
    } else if (
      ballz[i].position.y + ballz[i].r / 1.2 + ballz[i].velocityY >
        canvas.height - paddleHeight ||
      ballz[i].position.y + ballz[i].velocityY > canvas.height
    )
      if (
        ballz[i].position.x > paddleX - ballz[i].r / 3 &&
        ballz[i].position.x < paddleX + paddleWidth * 2 + ballz[i].r / 3
      ) {
        ballz[i].velocityY = -ballz[i].velocityY
      } else {
        ballFallz.push('1')
        ballz.splice(i, 1)
      }
  }
}

//collision detection between two balls
function coll_det_bb(b1, b2) {
  if (b1.r + b2.r >= b2.position.subtract(b1.position).magnitude()) {
    return true
  } else {
    return false
  }
}

//penetration resolution
//repositions the balls based on the penetration depth and the collision normal
function pen_res_bb(b1, b2) {
  let dist = b1.position.subtract(b2.position)
  let pen_depth = b1.r + b2.r - dist.magnitude()
  let pen_res = dist.unit().mult(pen_depth / 2)
  b1.position = b1.position.add(pen_res)
  b2.position = b2.position.add(pen_res.multiply(-1))
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
class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }
  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  multiply(n) {
    return new Vector(this.x * n, this.y * n)
  }
  normal() {
    return new Vector(-this.y, this.x).unit()
  }
  unit() {
    if (this.magnitude() === 0) {
      return new Vector(0, 0)
    } else {
      return new Vector(this.x / this.magnitude(), this.y / this.magnitude())
    }
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
  }
}

//class for slowest ball
class slowBall {
  constructor() {
    this.r = 30
    this.position = new Vector(canvas.width / 2, canvas.height - 100)
    this.mag = 4
    this.velocityX = randomX(this.mag)
    this.velocityY = randomY(this.velocityX, this.mag)
    this.collisionCounter = []
    ballz.push(this)
  }
  //draws ball onto the canvas
  drawBall() {
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2)
    context.strokeStyle = `black`
    context.stroke()
    context.fillStyle = `grey`
    context.fill()
  }
  //handles movement
  move() {
    this.position.x += this.velocityX
    this.position.y += this.velocityY
  }
}

//Ball Creation Funtions////////////////////////////////
let ball = new slowBall()
let throwBall = setInterval(function () {
  let counter = 0
  ball = new slowBall()
  counter++
  if (counter >= 1) {
    clearInterval(throwBall)
  }
}, 5000)
//Animation Function/////////////////////////////////////
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ballz.forEach((b, index) => {
    b.drawBall()
    b.move()
    wallCollision(index)
    for (let i = index + 1; i < ballz.length; i++) {
      if (coll_det_bb(ballz[index], ballz[i])) {
        pen_res_bb(ballz[index], ballz[i])
      }
    }
  })
  drawPaddle()
  keyPressCheck()
  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
