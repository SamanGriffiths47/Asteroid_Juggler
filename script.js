const paddleHeight = 10
const paddleWidth = 75
const firstHealth = document.getElementById('firstHealth').style
const gameOverScreen = document.getElementById('gameOver').style
const niceJobScreen = document.getElementById('niceJob').style
const StartScreen = document.getElementById('start').style
const ballz = []
let gameActive = false
let bestScores = [
  { name: 'Smitty Werbenjagermanjensen', score: 640 },
  { name: 'Sheldon Dinkleberg', score: 410 },
  { name: 'Meg Griffin', score: 3 }
]

const sortBoard = () => {
  bestScores.sort(function (a, b) {
    return b.score - a.score
  })
}
const clearBoard = () => {
  let scoreboard = document.getElementById('scoreboard')
  scoreboard.innerHTML = ''
}
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

const gameON = () => {
  // import/////////////////////////////////////////////////////////////

  // import///////////////////////////////////////////////////////////////
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
  //Global Functions//////////////////////////////////////////////////////////////////////////////////
  //  Score Save
  class Score {
    constructor(score) {
      this.name = 'player'
      this.score = score
    }
    addScore() {
      bestScores.push(this)
    }
  }

  // Interactivity
  const updateScore = () => {
    scoreDisplay.innerText = `Your Score: ${playerScore}`
  }

  const gameOver = () => {
    if (playerScore > scoreNeeded) {
      let finalScore = new Score(playerScore)
      finalScore.addScore()
      postScores()
      playerScore = 0
      updateScore()
      niceJobScreen.display = 'flex'
      gameActive = false
      // test//////////////////////////////////////////

      // canvas.style.display = 'none'
      // document.getElementById('canvasTwo').style.display = 'block'
      // gameOFF()
    }
    if (playerScore < scoreNeeded) {
      let finalScore = new Score(playerScore)
      finalScore.addScore()
      postScores()
      playerScore = 0
      updateScore()
      gameOverScreen.display = 'flex'
      gameActive = false
      // canvas.style.display = 'none'
      // document.getElementById('canvasTwo').style.display = 'block'
      // gameOFF()
    }
  }
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
            ballz[i].velocity.y = -ballz[i].velocity.y
            if (ballz[i].mag === 3) {
              playerScore += 10
              updateScore()
            }
            // if (ballz[i].mag === 3) {
            //   playerScore += 10
            // updateScore()
            // }
            // if (ballz[i].mag === 3) {
            //   playerScore += 10
            // updateScore()
            // }
          } else {
            ballFallz.push('1')
            threeStrikes()
            ballz.length = 0
          }
      } else if (!gameActive) {
        if (ballz[i].position.y + ballz[i].r > canvas.height) {
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
          return new Vector(
            this.x / this.magnitude(),
            this.y / this.magnitude()
          )
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

    //Ball Creation Funtions////////////////////////////////////////////////////////////////////////////
    let counter = 0
    let throwball = setInterval(function () {
      if (!gameActive) {
        ++counter
        if (counter > 2) {
          clearInterval(throwball)
        }
      }
      if (gameActive) {
        ball = new slowBall()
      }
    }, 5000)
    //Event Listeners///////////////////////////////////////////////////////////////////////////////////
    if (gameActive) {
      document.addEventListener('keydown', keyDownHandler, false)
      document.addEventListener('keyup', keyUpHandler, false)
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
      canvas.addEventListener('mouseover', function () {
        mouseover = true
      })
      canvas.addEventListener('mouseout', function () {
        mouseover = false
      })
    }
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
  gameON()
}
const gameOFF = () => {
  const canvas = document.getElementById('canvasTwo')
  const context = canvas.getContext('2d')
  let paddleX = (canvas.width - paddleWidth * 2) / 2
  // Game Start Functions////////////////////////////////////////////////////////////////
  // Event Listeners
  const startButton = document.getElementById('startButton')
  const restartButton = document.getElementById('restart')
  const restartButton2 = document.getElementById('restartTwo')
  startButton.addEventListener('click', function () {
    ballz.length = 0
    StartScreen.display = 'none'
    firstHealth.width = `${500}px`
    firstHealth.backgroundColor = 'green'
    canvas.style.display = 'none'
    document.getElementById('canvas').style.display = 'block'

    return gameActive
  })
  restartButton.addEventListener('click', function () {
    ballz.length = 0
    niceJobScreen.display = 'none'
    firstHealth.width = `${500}px`
    firstHealth.backgroundColor = 'green'
    gameActive = true
    canvas.style.display = 'none'
    document.getElementById('canvas').style.display = 'block'
    return gameActive
  })
  restartButton2.addEventListener('click', function () {
    ballz.length = 0
    canvas.style.display = 'none'
    firstHealth.width = `${500}px`
    firstHealth.backgroundColor = 'green'
    gameActive = true
    document.getElementById('canvas').style.display = 'block'
    gameOverScreen.display = 'none'
    return gameActive
  })

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
