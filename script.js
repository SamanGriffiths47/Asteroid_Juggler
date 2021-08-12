const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const ballz = []
const ballFallz = []
const paddleHeight = 10
const paddleWidth = 75
const firstHealth = document.getElementById('firstHealth').style
const secondHealth = document.getElementById('secondHealth').style
const thirdHealth = document.getElementById('thirdHealth').style
let paddleX = (canvas.width - paddleWidth * 2) / 2
let rightPressed = false
let leftPressed = false
let gameActive = false
let playerScore = 0

if (gameActive === false) {
  // DEFAULT GAME DISPLAY FUNCTIONS///////////////////////////////////////////////////////
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
  drawPaddle = () => {
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

  wallCollision = (i) => {
    if (i !== undefined) {
      if (
        ballz[i].position.x + ballz[i].r > canvas.width ||
        ballz[i].position.x - ballz[i].r < 0
      ) {
        ballz[i].velocity.x = -ballz[i].velocity.x
      }
      if (
        ballz[i].position.y + ballz[i].r > canvas.height ||
        ballz[i].position.y - ballz[i].r < 0
      ) {
        ballz[i].velocity.y = -ballz[i].velocity.y
      }
    }
  }

  //collision detection between two balls
  ballOnBallCollision = (b1, b2) => {
    if (b1.r + b2.r >= b2.position.subtract(b1.position).magnitude()) {
      return true
    } else {
      return false
    }
  }
  //repositions the balls based on the penetration depth and the collision normal
  noPenetration = (b1, b2) => {
    // calculates the distance between position vectors
    let dist = b1.position.subtract(b2.position)
    //defines the depth of penetration
    let pen_depth = b1.r + b2.r - dist.magnitude()
    //undoes penetration
    let pen_res = dist.unit().multiply(pen_depth / 2)
    b1.position = b1.position.add(pen_res)
    b2.position = b2.position.add(pen_res.multiply(-1))
  }
  //calculates the balls new velocity vectors after the collision
  ricochetEffect = (b1, b2) => {
    //collision normal vector
    let normal = b1.position.subtract(b2.position).unit()
    //setting velocity to the angle of the normal vector at original magnitude
    //(effectively breaking conservation of momentum)
    b1.velocity = normal.multiply(b1.mag)
    b2.velocity = normal.multiply(b2.mag).multiply(-1)
  }

  class Vector {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
    //allows two vectors to be added together
    add(v) {
      return new Vector(this.x + v.x, this.y + v.y)
    }
    //allows a vector to be subtracted from the vector
    subtract(v) {
      return new Vector(this.x - v.x, this.y - v.y)
    }
    //calculates the magnitude of the vector
    magnitude() {
      return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
    // allows the vector to be multiplied by a number
    multiply(n) {
      return new Vector(this.x * n, this.y * n)
    }
    // finds the normal vector of a collision
    normal() {
      return new Vector(-this.y, this.x).unit()
    }
    // sets magnitude to zero, so magnitude goes unaffected
    // when multiplying a vector by the normal
    unit() {
      if (this.magnitude() === 0) {
        return new Vector(0, 0)
      } else {
        return new Vector(this.x / this.magnitude(), this.y / this.magnitude())
      }
    }
    // finds the dot product of two vectors
    static dot(v1, v2) {
      return v1.x * v2.x + v1.y * v2.y
    }
  }

  //class for slowest ball
  class slowBall {
    constructor() {
      this.r = 30
      this.position = new Vector(canvas.width / 2, canvas.height - 100)
      this.mag = 3
      this.vx = randomX(this.mag)
      this.vy = randomY(this.vx, this.mag)
      this.velocity = new Vector(this.vx, this.vy)

      this.collisionCounter = []
      ballz.push(this)
    }
    //draws ball onto the canvas
    drawBall() {
      context.beginPath()
      context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2)
      context.strokeStyle = `black`
      context.stroke()
      context.fillStyle = `blue`
      context.fill()
    }
    //handles movement
    move() {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }

  let counter = 0
  ball = new slowBall()
  let throwball = setInterval(function () {
    ball = new slowBall()
    ++counter
    if (counter > 2) {
      clearInterval(throwball)
    }
  }, 5000)

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    ballz.forEach((b, index) => {
      b.drawBall()
      b.move()
      wallCollision(index)
      for (let i = index + 1; i < ballz.length; i++) {
        if (ballOnBallCollision(ballz[index], ballz[i])) {
          noPenetration(ballz[index], ballz[i])
          ricochetEffect(ballz[index], ballz[i])
        }
      }
    })
    drawPaddle()
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
}

if (gameActive === true) {
  //Global Functions//////////////////////////////////////////////////////////////////////////////////
  // Interactivity

  threeStrikes = () => {
    if (ballFallz.length === 1) {
      thirdHealth.display = 'none'
      secondHealth.backgroundColor = 'yellow'
      firstHealth.backgroundColor = 'yellow'
    }
    if (ballFallz.length === 2) {
      secondHealth.display = 'none'
      firstHealth.backgroundColor = 'red'
    }
    if (ballFallz.length >= 3) {
      firstHealth.display = 'none'
      gameActive = false
    }
  }
  threeStrikes()

  // Canvas Display
  //randomly generates initial x & y velocities so all balls can
  //start moving at different angles but the same overall speed based on class
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
  drawPaddle = () => {
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

  //Collision Resolution///////////////////////////////////////////////////////////////////////////////
  //checks for ball collisions w/ wall
  wallCollision = (i) => {
    if (i !== undefined) {
      if (
        ballz[i].position.x + ballz[i].r > canvas.width ||
        ballz[i].position.x - ballz[i].r < 0
      ) {
        ballz[i].velocity.x = -ballz[i].velocity.x
      }
      if (ballz[i].position.y - ballz[i].r < 0) {
        ballz[i].velocity.y = -ballz[i].velocity.y
      } else if (
        ballz[i].position.y + ballz[i].r > canvas.height - paddleHeight ||
        ballz[i].position.y + ballz[i].r > canvas.height
      )
        if (
          ballz[i].position.x > paddleX - ballz[i].r / 3 &&
          ballz[i].position.x < paddleX + paddleWidth * 2 + ballz[i].r / 3
        ) {
          ballz[i].velocity.y = -ballz[i].velocity.y
          if (ballz[i].mag === 3) {
            playerScore += 10
          }
          if (ballz[i].mag === 3) {
            playerScore += 10
          }
          if (ballz[i].mag === 3) {
            playerScore += 10
          }
        } else {
          ballFallz.push('1')
          ballz.length = 0
        }
    }
  }

  //collision detection between two balls
  ballOnBallCollision = (b1, b2) => {
    if (b1.r + b2.r >= b2.position.subtract(b1.position).magnitude()) {
      return true
    } else {
      return false
    }
  }
  //repositions the balls based on the penetration depth and the collision normal
  noPenetration = (b1, b2) => {
    // calculates the distance between position vectors
    let dist = b1.position.subtract(b2.position)
    //defines the depth of penetration
    let pen_depth = b1.r + b2.r - dist.magnitude()
    //undoes penetration
    let pen_res = dist.unit().multiply(pen_depth / 2)
    b1.position = b1.position.add(pen_res)
    b2.position = b2.position.add(pen_res.multiply(-1))
  }
  //calculates the balls new velocity vectors after the collision
  ricochetEffect = (b1, b2) => {
    //collision normal vector
    let normal = b1.position.subtract(b2.position).unit()
    //setting velocity to the angle of the normal vector at original magnitude
    //(effectively breaking conservation of momentum)
    b1.velocity = normal.multiply(b1.mag)
    b2.velocity = normal.multiply(b2.mag).multiply(-1)
  }

  //User Interface////////////////////////////////////////////////////////////////////////////////////
  //allows for keyboard manipulation of ball
  keyDownHandler = (e) => {
    if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
      rightPressed = true
    } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
      leftPressed = true
    }
  }
  keyUpHandler = (e) => {
    if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
      rightPressed = false
    } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
      leftPressed = false
    }
  }
  // function for mouse movement
  mouseMoveHandler = (e) => {
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
  //in charge of paddle movement
  paddleMovement = () => {
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
  //Classes///////////////////////////////////////////////////////////////////////////////////////////
  // Class Defining vectors and their methods
  class Vector {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
    //allows two vectors to be added together
    add(v) {
      return new Vector(this.x + v.x, this.y + v.y)
    }
    //allows a vector to be subtracted from the vector
    subtract(v) {
      return new Vector(this.x - v.x, this.y - v.y)
    }
    //calculates the magnitude of the vector
    magnitude() {
      return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
    // allows the vector to be multiplied by a number
    multiply(n) {
      return new Vector(this.x * n, this.y * n)
    }
    // finds the normal vector of a collision
    normal() {
      return new Vector(-this.y, this.x).unit()
    }
    // sets magnitude to zero, so magnitude goes unaffected
    // when multiplying a vector by the normal
    unit() {
      if (this.magnitude() === 0) {
        return new Vector(0, 0)
      } else {
        return new Vector(this.x / this.magnitude(), this.y / this.magnitude())
      }
    }
    // finds the dot product of two vectors
    static dot(v1, v2) {
      return v1.x * v2.x + v1.y * v2.y
    }
  }

  //class for slowest ball
  class slowBall {
    constructor() {
      this.r = 30
      this.position = new Vector(canvas.width / 2, canvas.height - 100)
      this.mag = 3
      this.vx = randomX(this.mag)
      this.vy = randomY(this.vx, this.mag)
      this.velocity = new Vector(this.vx, this.vy)

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
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }

  //Ball Creation Funtions////////////////////////////////////////////////////////////////////////////
  let ball = new slowBall()
  setInterval(function () {
    ball = new slowBall()
  }, 5000)

  //Event Listeners///////////////////////////////////////////////////////////////////////////////////
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)
  document.addEventListener('mousemove', mouseMoveHandler, false)

  //Animation Function////////////////////////////////////////////////////////////////////////////////
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    ballz.forEach((b, index) => {
      b.drawBall()
      b.move()
      wallCollision(index)
      for (let i = index + 1; i < ballz.length; i++) {
        if (ballOnBallCollision(ballz[index], ballz[i])) {
          noPenetration(ballz[index], ballz[i])
          ricochetEffect(ballz[index], ballz[i])
        }
      }
    })
    drawPaddle()
    paddleMovement()
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
}
//Game Logic///////////////////////////////////////////////////////////////////////////////////////
