const paddleHeight = 10
const paddleWidth = 150
const firstHealth = document.getElementById('firstHealth').style
const gameOverScreen = document.getElementById('gameOver').style
const niceJobScreen = document.getElementById('niceJob').style
const StartScreen = document.getElementById('start').style
const ballz = []
let gameActive = false
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const ballFallz = []
let mouseover = false
let paddleX = (canvas.width - paddleWidth * 2) / 2
let rightPressed = false
let leftPressed = false
let playerScore = 0
const scoreNeeded = 350
let scoreDisplay = document.getElementById('playerScore')
const startButton = document.getElementById('startButton')
const restartButton = document.getElementById('restart')
const restartButton2 = document.getElementById('restartTwo')
let bestScores = [
  { name: 'Smitty Werbenjagermanjensen', score: 640 },
  { name: 'Sheldon Dinkleberg', score: 410 },
  { name: 'Meg Griffin', score: 3 }
]

//Classes///////////////////////////////////////////////////////////////////////////////////////////////////

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
//Class For The Slowest Ball
class slowBall {
  constructor() {
    this.r = 30
    this.position = new Vector(canvas.width / 2, canvas.height - 100)
    this.mag = 3
    this.vx = this.randomX(this.mag)
    this.vy = this.randomY(this.vx, this.mag)
    this.velocity = new Vector(this.vx, this.vy)
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
}
//Ball Creation//////////////////////////////////////////////////////////////////////////////////////////////

// When Game Is Active, Balls Are released at 6sec Intervals
const throwBall = () => {
  setInterval(function () {
    if (gameActive) {
      ball = new slowBall()
    } else clearInterval(setInterval)
  }, 6000)
}
//Limits Ball Creation To 4 When Game Is Inactive
const throwBall2 = () => {
  setInterval(function () {
    if (!gameActive && ballz.length < 4) {
      ball = new slowBall()
    } else clearInterval(setInterval)
  }, 6000)
}
ball = new slowBall()
throwBall2()
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
//Updates Current Score Display
const updateScore = () => {
  scoreDisplay.innerText = `Your Score: ${playerScore}`
}
//Win/Loss Logic//////////////////////////////////////////////////////////////////////////////////////////

// Game Win Sequence
const Win = () => {
  finalScore = new Score(playerScore)
  finalScore.addScore()
  postScores()
  playerScore = 0
  updateScore()
  niceJobScreen.display = 'flex'
  ballFallz.length = 0
  gameActive = false
  paddleX = canvas.width / 2 - paddleWidth
  ball = new slowBall()
  throwBall2()
}
// Game Loss Sequence
const Lose = () => {
  finalScore = new Score(playerScore)
  finalScore.addScore()
  postScores()
  playerScore = 0
  updateScore()
  gameOverScreen.display = 'flex'
  gameActive = false
  ball = new slowBall()
  throwBall2
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
    firstHealth.width = `${500 * (2 / 3)}px`
    firstHealth.backgroundColor = 'yellow'
  }
  if (ballFallz.length === 2) {
    firstHealth.width = `${500 * (1 / 3)}px`
    firstHealth.backgroundColor = 'red'
  }
  if (ballFallz.length >= 3) {
    firstHealth.display = 'none'
    gameOver()
  }
}
//Collision Resolution///////////////////////////////////////////////////////////////////////////////

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
        ballz[i].position.y + ballz[i].r + 1 > canvas.height - paddleHeight ||
        ballz[i].position.y + ballz[i].r + 1 > canvas.height
      )
        if (
          ballz[i].position.x > paddleX - ballz[i].r &&
          ballz[i].position.x < paddleX + paddleWidth * 2 + ballz[i].r
        ) {
          ballz[i].position.y =
            canvas.height -
            paddleHeight -
            1 -
            ballz[i].position.y -
            ballz[i].r +
            ballz[i].position.y
          ballz[i].velocity.y = -ballz[i].velocity.y
          if (ballz[i].mag === 3) {
            playerScore += 10
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

//Checks For Ball To Ball Collisions
ballOnBallCollision = (b1, b2) => {
  if (b1.r + b2.r >= b2.position.subtract(b1.position).magnitude()) {
    return true
  } else {
    return false
  }
}
//Repositions Balls Based On Penetration Depth And Collision Normal
courseCorrection = (b1, b2) => {
  let dist = b1.position.subtract(b2.position)
  let pen_depth = b1.r + b2.r - dist.magnitude()
  let pen_res = dist.unit().multiply(pen_depth / 2)
  b1.position = b1.position.add(pen_res)
  b2.position = b2.position.add(pen_res.multiply(-1))
}
//Calculates New Velocity Vectors For Each Ball After Collision
ricochetEffect = (b1, b2) => {
  let normal = b1.position.subtract(b2.position).unit()
  // conservation of momentum broken, lol
  b1.velocity = normal.multiply(b1.mag)
  b2.velocity = normal.multiply(b2.mag).multiply(-1)
}
//Event Listeners, their effects, and what they affect//////////////////////////////////////////////////////

// Game Start////////////////////////////////////////////////

// Initial Game Start Sequence
const gameInit = () => {
  ballz.length = 0
  StartScreen.display = 'none'
  firstHealth.width = `${500}px`
  firstHealth.backgroundColor = 'green'
  gameActive = true
  ball = new slowBall()
  throwBall()
}
// Listens For And Reacts To Click On Start Screen
startButton.addEventListener('click', function () {
  gameInit()
})
// Game Restart Sequence If Win
const winRestart = () => {
  ballz.length = 0
  niceJobScreen.display = 'none'
  firstHealth.display = 'block'
  firstHealth.width = `${500}px`
  firstHealth.backgroundColor = 'green'
  gameActive = true
  ball = new slowBall()
  throwBall()
}
// Listens For And Reacts To Restart Click On Win Screen
restartButton.addEventListener('click', function () {
  winRestart()
})
// Game Restart If Loss
restartButton2.addEventListener('click', function () {
  ballz.length = 0
  gameOverScreen.display = 'none'
  firstHealth.display = 'block'
  firstHealth.width = `${500}px`
  firstHealth.backgroundColor = 'green'
  gameActive = true
  ball = new slowBall()
  throwBall()
})
// Gameplay////////////////////////////////////////////////////
// Key Depression Reaction
keyDownHandler = (e) => {
  if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = true
  } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = true
  }
}
// Key Release Reaction
keyUpHandler = (e) => {
  if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = false
  } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = false
  }
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
// Moves Paddle According to key depression and release
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
//Tracks Mouse & Moves Paddle Accordingly
document.addEventListener('mousemove', function (e) {
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
})

//Animation Function////////////////////////////////////////////////////////////////////////////////////////

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  ballz.forEach((b, index) => {
    b.drawBall()
    b.move()
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
