const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

context.beginPath()
context.rect(20, 40, 50, 50)
context.fillStyle = 'black'
context.fill()
context.closePath()

context.beginPath()
context.arc(240, 160, 20, 0, Math.PI * 2, false)
context.fillStyle = 'green'
context.fill()
context.closePath()
