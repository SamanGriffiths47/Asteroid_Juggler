const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

let ballz = []

// canvas.width = 640 canvas.height = 480

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

class MedBall {
  constructor() {
    this.r = 5
    this.x = canvas.width / 2
    this.y = canvas.height - 50
    this.mag = 4
    this.xVelocity = randomX(this.mag)
    this.yVelocity = randomY(this.xVelocity, this.mag)
    ballz.push(this)
  }

  drawBall() {
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    context.strokeStyle = `black`
    context.stroke()
    context.fillStyle = `grey`
    context.fill()
  }
  move() {
    this.x += this.xVelocity
    this.y += this.yVelocity
  }
  wallCollision() {
    if (
      this.x + this.xVelocity > canvas.width - this.r ||
      this.x + this.xVelocity < this.r
    ) {
      this.xVelocity = -this.xVelocity
    }
    if (
      this.y + this.yVelocity > canvas.height - this.r ||
      this.y + this.yVelocity < this.r
    ) {
      this.yVelocity = -this.yVelocity
    }
  }
}

let ball1 = new MedBall()

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ballz.forEach((b) => {
    b.drawBall()
    b.move()
    b.wallCollision()
  })
  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
