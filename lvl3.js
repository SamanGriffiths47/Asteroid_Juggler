const ballz = []
const ballFallz = []
const redAsteroid = new Image()
redAsteroid.src = '/asteroids/Asteroid.png'
const scoreNeeded = 900
const paddleHeight = 10
const paddleWidth = 150
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const restartButton = document.getElementById('restart')
const StartScreen = document.getElementById('start').style
const firstHealth = document.getElementById('firstHealth').style
const gameOverScreen = document.getElementById('gameOver').style
const niceJobScreen = document.getElementById('niceJob').style
const restartButton2 = document.getElementById('restartTwo')
const startButton = document.getElementById('startButton')
let scoreDisplay = document.getElementById('leftScreenTop')
let paddleX = (canvas.width - paddleWidth * 2) / 2
let rightPressed = false
let leftPressed = false
let gameActive = false
let mouseover = false
let playerScore = 0
let bestScores = [
  { name: 'Sheldon Dinkleberg', score: 1240 },
  { name: 'Ricky Bobby', score: 810 },
  { name: 'Meg Griffin', score: 10 }
]

// Classes///////////////////////////////////////////////////////////////////////////////////////////////////

// Class For Score Save
class Score {
  constructor(score) {
    this.name = 'Player'
    this.score = score
  }
  addScore() {
    bestScores.push(this)
  }
}
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
// Class For The Slowest Ball
class slowBall {
  constructor() {
    this.r = 30
    this.position = new Vector(canvas.width / 2, canvas.height - 100)
    this.mag = 3
    this.vx = this.randomX(this.mag)
    this.vy = this.randomY(this.vx, this.mag)
    this.velocity = new Vector(this.vx, this.vy)
    this.height = 89
    this.width = 89
    this.frameX = 0
    this.frameY = 0
    ballz.push(this)
  }
  //draws ball onto the canvas
  drawBall() {
    context.drawImage(
      redAsteroid,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.position.x - this.r * 1.1,
      this.position.y - this.r * 1,
      this.r * 2.1,
      this.r * 2.1
    )
  }
  // Generates A Random Integer For X Component Of Velocity
  //This Way, Balls Can Be Thrown At Random Angle With The Same Speed
  randomX(mag) {
    let x = Math.random()
    if (x < 0.5) {
      x *= mag - Math.random() * mag
    } else {
      x *= -mag + Math.random() * mag
    }
    return x
  }
  //Generates A Random Integer For Y Component Of Velocity
  //Based Off Of X Component And Vector Magnitude
  randomY(x, mag) {
    let y = Math.sqrt(mag ** 2 - x ** 2)
    return -y
  }
  //Handles Movement
  move() {
    this.position = this.position.add(this.velocity)
  }
  spin() {
    if (this.frameX < 19) {
      this.frameX += 1
    } else if (this.frameX === 19 && this.frameY === 0) {
      this.frameX = 0
      this.frameY += 1
    } else if (this.frameX === 19 && this.frameY === 1) {
      this.frameX = 0
      this.frameY += 1
    } else if (this.frameX === 19 && this.frameY === 2) {
      this.frameX = 0
      this.frameY = 0
    }
  }
}
class medBall {
  constructor() {
    this.r = 20
    this.position = new Vector(canvas.width / 2, canvas.height - 100)
    this.mag = 4.5
    this.vx = this.randomX(this.mag)
    this.vy = this.randomY(this.vx, this.mag)
    this.velocity = new Vector(this.vx, this.vy)
    this.height = 89
    this.width = 89
    this.frameX = 0
    this.frameY = 0
    ballz.push(this)
  }
  //draws ball onto the canvas
  drawBall() {
    context.drawImage(
      redAsteroid,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.position.x - this.r * 1.05,
      this.position.y - this.r * 1.05,
      this.r * 2.1,
      this.r * 2.1
    )
  }
  // Generates A Random Integer For X Component Of Velocity
  //This Way, Balls Can Be Thrown At Random Angle With The Same Speed
  randomX(mag) {
    let x = Math.random()
    if (x < 0.5) {
      x *= mag - Math.random() * mag
    } else {
      x *= -mag + Math.random() * mag
    }
    return x
  }
  //Generates A Random Integer For Y Component Of Velocity
  //Based Off Of X Component And Vector Magnitude
  randomY(x, mag) {
    let y = Math.sqrt(mag ** 2 - x ** 2)
    return -y
  }
  //Handles Movement
  move() {
    this.position = this.position.add(this.velocity)
  }
  spin() {
    if (this.frameX < 19) {
      this.frameX += 1
    } else if (this.frameX === 19 && this.frameY === 0) {
      this.frameX = 0
      this.frameY += 1
    } else if (this.frameX === 19 && this.frameY === 1) {
      this.frameX = 0
      this.frameY += 1
    } else if (this.frameX === 19 && this.frameY === 2) {
      this.frameX = 0
      this.frameY = 0
    }
  }
}
class fastBall {
  constructor() {
    this.r = 10
    this.position = new Vector(canvas.width / 2, canvas.height - 100)
    this.mag = 6
    this.vx = this.randomX(this.mag)
    this.vy = this.randomY(this.vx, this.mag)
    this.velocity = new Vector(this.vx, this.vy)
    this.height = 89
    this.width = 89
    this.frameX = 0
    this.frameY = 0
    ballz.push(this)
  }
  //draws ball onto the canvas
  drawBall() {
    context.drawImage(
      redAsteroid,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.position.x - this.r * 1.05,
      this.position.y - this.r * 1.05,
      this.r * 2.1,
      this.r * 2.1
    )
  }
  // Generates A Random Integer For X Component Of Velocity
  //This Way, Balls Can Be Thrown At Random Angle With The Same Speed
  randomX(mag) {
    let x = Math.random()
    if (x < 0.5) {
      x *= mag - Math.random() * mag
    } else {
      x *= -mag + Math.random() * mag
    }
    return x
  }
  //Generates A Random Integer For Y Component Of Velocity
  //Based Off Of X Component And Vector Magnitude
  randomY(x, mag) {
    let y = Math.sqrt(mag ** 2 - x ** 2)
    return -y
  }
  //Handles Movement
  move() {
    this.position = this.position.add(this.velocity)
  }
  spin() {
    if (this.frameX < 19) {
      this.frameX += 1
    } else if (this.frameX === 19 && this.frameY === 0) {
      this.frameX = 0
      this.frameY += 1
    } else if (this.frameX === 19 && this.frameY === 1) {
      this.frameX = 0
      this.frameY += 1
    } else if (this.frameX === 19 && this.frameY === 2) {
      this.frameX = 0
      this.frameY = 0
    }
  }
}
// Ball Creation//////////////////////////////////////////////////////////////////////////////////////////////

// When Game Is Active, Balls Are released at 6sec Intervals
new slowBall()
let counter = 1
const pitcher = () => {
  const throwBall = setInterval(function () {
    if (gameActive) {
      if (counter === 0) {
        new slowBall()
        counter++
      } else if (counter === 1) {
        new medBall()
        counter++
      } else if (counter === 2) {
        new fastBall()
        counter = 0
      }
    } else {
      clearInterval(throwBall)
    }
  }, 5000)
}

// Limits Ball Creation To 4 When Game Is Inactive
const pitcher2 = () => {
  const throwBall2 = setInterval(function () {
    if (!gameActive && ballz.length < 4) {
      new slowBall()
    } else {
      clearInterval(throwBall2)
    }
  }, 5000)
}
pitcher2()
// Scoring//////////////////////////////////////////////////////////////////////////////////////////////////

// Sorts Scores By Amount
const sortBoard = () => {
  bestScores.sort(function (a, b) {
    return b.score - a.score
  })
}
// Clears Previous Score Posting
const clearBoard = () => {
  let scoreboard = document.getElementById('scoreboard')
  scoreboard.innerHTML = ''
}
// Posts New Scores To For User To See
const postScores = () => {
  clearBoard()
  sortBoard()
  bestScores.length = 3
  for (let i = 0; i < bestScores.length; i++) {
    let scoreboard = document.getElementById('scoreboard')
    let scorePost = document.createElement('li')
    scoreboard.appendChild(scorePost)
    document.querySelectorAll('#scoreboard li')[
      i
    ].innerText = `${bestScores[i].name}: ${bestScores[i].score}`
  }
}
postScores()
// Updates Current Score Display
const updateScore = () => {
  scoreDisplay.innerText = `Your Score: ${playerScore}`
}
// Win/Loss Logic//////////////////////////////////////////////////////////////////////////////////////////

// Game Win Sequence
const Win = () => {
  ballFallz.length = 0
  finalScore = new Score(playerScore)
  finalScore.addScore()
  postScores()
  playerScore = 0
  updateScore()
  paddleX = canvas.width / 2 - paddleWidth
  gameActive = false
  niceJobScreen.display = 'flex'
  pitcher2()
}
// Game Loss Sequence
const Lose = () => {
  ballFallz.length = 0
  finalScore = new Score(playerScore)
  finalScore.addScore()
  postScores()
  playerScore = 0
  updateScore()
  paddleX = canvas.width / 2 - paddleWidth
  gameOverScreen.display = 'flex'
  gameActive = false
  pitcher2()
}
// Desides If Player Won Or Lost
const gameOver = () => {
  if (playerScore >= scoreNeeded) {
    Win()
  } else {
    Lose()
  }
}
// Reacts To Turn Losses
const threeStrikes = () => {
  if (ballFallz.length === 1) {
    firstHealth.width = `${600 * (2 / 3)}px`
    firstHealth.backgroundColor = 'yellow'
  }
  if (ballFallz.length === 2) {
    firstHealth.width = `${600 * (1 / 3)}px`
    firstHealth.backgroundColor = 'red'
  }
  if (ballFallz.length >= 3) {
    firstHealth.width = '10px'
    firstHealth.backgroundColor = 'red'
    gameOver()
  }
}
// Collision Resolution///////////////////////////////////////////////////////////////////////////////

// Checks For & Corrects Ball To Wall Collisions/////////////////
wallCollision = (i) => {
  if (i !== undefined) {
    if (ballz[i].position.x + ballz[i].r > canvas.width) {
      ballz[i].position.x = ballz[i].position.x
      canvas.width - 1 - ballz[i].position.x - ballz[i].r + ballz[i].position.x
      ballz[i].velocity.x = -ballz[i].velocity.x
    }
    if (ballz[i].position.x - ballz[i].r < 0) {
      ballz[i].position.x = 1 + ballz[i].r
      ballz[i].velocity.x = -ballz[i].velocity.x
    }
    if (ballz[i].position.y - ballz[i].r < 0) {
      ballz[i].position.y = 1 + ballz[i].r
      ballz[i].velocity.y = -ballz[i].velocity.y
    }
    if (gameActive) {
      if (
        ballz[i].position.y + ballz[i].r > canvas.height - paddleHeight ||
        ballz[i].position.y + ballz[i].r > canvas.height
      )
        if (
          ballz[i].position.x > paddleX - ballz[i].r / 3 &&
          ballz[i].position.x < paddleX + paddleWidth * 2 + ballz[i].r / 3
        ) {
          ballz[i].position.y = canvas.height - paddleHeight - 1 - ballz[i].r
          ballz[i].velocity.y = -ballz[i].velocity.y
          if (ballz[i].mag === 3) {
            playerScore += 10
            updateScore()
          }
          if (ballz[i].mag === 4.5) {
            playerScore += 20
            updateScore()
          }
          if (ballz[i].mag === 6) {
            playerScore += 30
            updateScore()
          }
        } else {
          ballFallz.push('1')
          threeStrikes()
          ballz.length = 0
        }
    } else if (!gameActive) {
      if (ballz[i].position.y + ballz[i].r > canvas.height) {
        ballz[i].position.y =
          canvas.height -
          1 -
          ballz[i].position.y -
          ballz[i].r +
          ballz[i].position.y
        ballz[i].velocity.y = -ballz[i].velocity.y
      }
    }
  }
}
// Ball To Ball Collisions///////////////////////////////////////

// Checks For Ball To Ball Collisions
ballOnBallCollision = (b1, b2) => {
  if (b1.r + b2.r >= b2.position.subtract(b1.position).magnitude()) {
    return true
  } else {
    return false
  }
}
// Repositions Balls Based On Penetration Depth And Collision Normal
courseCorrection = (b1, b2) => {
  let dist = b1.position.subtract(b2.position)
  let pen_depth = b1.r + b2.r - dist.magnitude()
  let pen_res = dist.unit().multiply(pen_depth / 2)
  b1.position = b1.position.add(pen_res)
  b2.position = b2.position.add(pen_res.multiply(-1))
}
// Calculates New Velocity Vectors For Each Ball After Collision
ricochetEffect = (b1, b2) => {
  let normal = b1.position.subtract(b2.position).unit()
  // conservation of momentum broken, lol
  b1.velocity = normal.multiply(b1.mag)
  b2.velocity = normal.multiply(b2.mag).multiply(-1)
}
// Event Listeners, their effects, and what they affect//////////////////////////////////////////////////////

// Game Start////////////////////////////////////////////////

// Initial Game Start Sequence
const gameInit = () => {
  ballz.length = 0
  StartScreen.display = 'none'
  firstHealth.width = `${600}px`
  firstHealth.backgroundColor = 'green'
  document.getElementById(`stamina`).style.display = 'block'
  gameActive = true
  ball = new slowBall()
  pitcher()
}
// Restart Sequence If Win
const winRestart = () => {
  ballz.length = 0
  niceJobScreen.display = 'none'
  firstHealth.display = 'block'
  firstHealth.width = `${600}px`
  firstHealth.backgroundColor = 'green'
  gameActive = true
  ball = new slowBall()
  pitcher()
}
// Restart Sequence If Loss
const lossRestart = () => {
  ballz.length = 0
  gameOverScreen.display = 'none'
  firstHealth.display = 'block'
  firstHealth.width = `${600}px`
  firstHealth.backgroundColor = 'green'
  gameActive = true
  ball = new slowBall()
  pitcher()
}
// Listens For And Reacts To Click On Start Screen
startButton.addEventListener('click', gameInit)
// Listens For And Reacts To Restart Click On Win Screen
restartButton.addEventListener('click', winRestart)
// Listens For And Reacts To Restart Click On Loss Screen
restartButton2.addEventListener('click', lossRestart)
// Gameplay/////////////////////////////////////////////////////

// Key Depression Reaction
const keyDownHandler = (e) => {
  if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = true
  } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = true
  }
}
// Key Release Reaction
const keyUpHandler = (e) => {
  if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = false
  } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = false
  }
}
const mouseMove = (e) => {
  if (mouseover === true) {
    if (e.offsetX > 0 && e.offsetX < canvas.width) {
      paddleX = e.offsetX - paddleWidth
    }
    if (paddleX + paddleWidth * 2 > canvas.width) {
      paddleX = canvas.width - paddleWidth * 2
    }
    if (paddleX < 0) {
      paddleX = 0
    }
  }
}
// Draws Paddle Onto Canvas
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
// Moves Paddle According To Key Depression And Release
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
// Registers Key Depression
document.addEventListener('keydown', keyDownHandler, false)
// Registers Key Release
document.addEventListener('keyup', keyUpHandler, false)
// Registers If Mouse Is Over Game Canvas
canvas.addEventListener('mouseover', function () {
  mouseover = true
})
// Registers When Mouse Leaves The Boundries Of Game Canvas
canvas.addEventListener('mouseout', function () {
  mouseover = false
})
// Tracks Mouse & Moves Paddle Accordingly
document.addEventListener('mousemove', mouseMove)

// Animation Function////////////////////////////////////////////////////////////////////////////////////////

// Runs Canvas Animation

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ballz.forEach((b, index) => {
    b.drawBall()
    b.move()
    b.spin()
    wallCollision(index)
    for (let i = index + 1; i < ballz.length; i++) {
      if (ballOnBallCollision(ballz[index], ballz[i])) {
        courseCorrection(ballz[index], ballz[i])
        ricochetEffect(ballz[index], ballz[i])
      }
    }
  })
  drawPaddle()
  paddleMovement()
  requestAnimationFrame(draw)
}
requestAnimationFrame(draw)
