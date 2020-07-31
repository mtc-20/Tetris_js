document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div')) 
    const scoreDisplay = document.querySelector('#score')

    // Buttons
    const startBtn = document.querySelector('#start-button')
    const restartBtn = document.querySelector('#restart-button')
    const audioIcon = document.querySelector('#audio-icon')
    const upBtn = document.querySelector('#up-key')
    const downBtn = document.querySelector('#down-key') 
    const leftBtn = document.querySelector('#left-key') 
    const rightBtn = document.querySelector('#right-key') 

    // Touch events
    document.addEventListener('touchstart', ()=>handleStart, false)
    document.addEventListener('touchmove', handleMove, false)
    alert('TouchlistenerStart added')

    var xDown = null
    var yDown = null

    function getTouches(evt) {
        return evt.touches
    }

    function handleStart(evt) {
        const firstTouch = getTouches(evt)[0]
        xDown = firstTouch.clientX
        yDown = firstTouch.clientY
    }

    function handleMove(evt) {
        if (!xDown || yDown) {
            return
        }
        var xUp = evt.touches[0].clientX
        var yUp = evt.touches[0].clientY

        var xDiff = xDown - xUp
        var yDiff = yDown - yUp

        if(Math.abs(xDiff)> Math.abs(yDiff)) {
            if (xDiff > 0) {
                console.log('left swipe')
            }
            else {
                alert('Right')
            }
        }
        else {
            if(yDiff > 0) {
                console.log('Up swipe')
            }
            else {
                alert('Down')
            }
        }

        xDown = null
        yDown = null
    }

    // Audio
    const bgm = document.getElementById('bgm')
    bgm.loop = true
    bgm.status = true

    const width = 10
    let nextRandom = 0
    let timerID
    let score = 000
    // const colors = [
    //     'orange',
    //     'red',
    //     'purple',
    //     'green',
    //     'blue'
    // ]

    const colors = [
        'linear-gradient(orange ,rgba(95,158,160, 0.7))',
        'linear-gradient(red ,rgba(95,158,160, 0.7))',
        'linear-gradient(purple ,rgba(95,158,160, 0.7))',
        'linear-gradient(green ,rgba(95,158,160, 0.7))',
        'linear-gradient(blue ,rgba(95,158,160, 0.7))',
        
    ]

    let timePeriod = 500
    let point = 10
    paused = false

    // Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
]

    const tTetromino = [
        [0, 1, 2, width+1],
        [width, 1, width+1, width*2+1],
        [1, width, width+1, width+2],
        [1, width+1, width*2+1, width+2]
    ]

    const zTetromino = [
        [0, 1, width+1, width+2],
        [2, width+1, width+2, width*2+1],
        [0, 1, width+1, width+2],
        [2, width+1, width+2, width*2+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominos = [lTetromino,iTetromino,zTetromino,oTetromino,tTetromino]

    // Set variables
    let currentPosition = 3
    let currentRotation = 0

    // Randomly select a tetromino
    let random = Math.floor(Math.random()*theTetrominos.length)
    let current = theTetrominos[random][currentRotation]

    // Function to draw Tetromino
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            // squares[currentPosition + index].style.backgroundColor = colors[random]
            squares[currentPosition + index].style.backgroundImage = colors[random]
        })
    }
    //draw()
    
    // Undraw Tetrommino
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
            squares[currentPosition + index].style.backgroundImage = ''
        })
    }

    // Move Tetromino down every second
    // timerID = setInterval(moveDown, 500)

    // Assign functions to keyCodes
    function control(e){
        if(e.keyCode === 37){
            moveLeft()
        }
        else if(e.keyCode === 39){
            moveRight()
        }
        else if(e.keyCode === 40){
            moveDown()
        }
        else if(e.keyCode === 38 || e.keyCode === 87){
            rotate()
        }
        else if(e.keyCode === 80){
            if(!paused){
                pauseGame()
                
            }
            else{
                paused = false
                playGame()
            }
        }
        else if(e.keyCode === 77){
            toggleMusic()
        }
    }
    document.addEventListener('keydown', control)
    


    function toggleMusic(){
        if(bgm.status){
            bgm.pause()
            bgm.status = false
        }
        else {
            bgm.play()
            bgm.status = true
        }
    }


    function moveDown(){
        if (!paused){
            undraw()
            currentPosition += width
            draw()
            freeze()
        }
        
    }

    //Freeze
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => {
                squares[currentPosition + index].classList.add('taken')
                squares[currentPosition + index].style.backgroundImage = 'linear-gradient(rgba(0,0,0,0), rgba(255,255,255))'
            })

            // Start new Tetromino
            // console.log('Starting new')
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            currentRotation = 0
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // Move Tetromino left within grid
    function moveLeft(){
        if (!paused){
            undraw()
            const isAtLeftEdge = current.some(index => (currentPosition + index)%width === 0)
            
            if (!isAtLeftEdge) currentPosition -= 1
            
            if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition +=1
            }
            draw()
        }
    }

    // Move Tetromino right within grid
    function moveRight(){
        if(!paused){
            undraw()
            const isAtRightEdge = current.some(index => (currentPosition + index)%width === width-1)
            
            if (!isAtRightEdge) currentPosition += 1
            
            if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                currentPosition -=1
            }
            draw()
        }
    }

    // Rotate Tetromino within grid
    function rotate(){
        if (!paused){
            undraw()
            currentRotation++
            if (currentRotation === current.length){
                currentRotation = 0
            }
            current = theTetrominos[random][currentRotation]
            draw()
        }
    }

    // Display next Tetromino
    const displaySquares = document.querySelectorAll('.column .mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    const upNextTetrominos = [
        [1, displayWidth+1, displayWidth*2+1, 2], //l
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //i
        [0, 1, displayWidth+1, displayWidth+2], //z
        [0, 1, displayWidth, displayWidth+1], //o
        [0, 1, 2, displayWidth+1] //t
    ]

    function displayShape(){
        // Remove any trace of tetromino from grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
            square.style.backgroundImage = ''
        })

        // console.log('Displaying next')

        upNextTetrominos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
        })
    }

    // Add functionality to button
    startBtn.addEventListener('click', () => {
        if (timerID){
            pauseGame()
            // bgm.pause()
            // clearInterval(timerID)
            // timerID = null
        }
        else { 
            playGame()
        }
    })

    function pauseGame(){
        bgm.pause()
        clearInterval(timerID)
        timerID = null
        paused = true
    }

    function playGame(){
        if(bgm.status){
            bgm.play()
        }
        draw()
        timerID = setInterval(moveDown, timePeriod)
        nextRandom = Math.floor(Math.random()*theTetrominos.length)
        displayShape()
        paused = false
    }

    restartBtn.addEventListener('click', restart())
    audioIcon.addEventListener('click', () => toggleMusic())
    // upBtn.addEventListener('click', () => rotate())
    // downBtn.addEventListener('click', ()=> moveDown())
    // leftBtn.addEventListener('click', ()=> moveLeft())
    // rightBtn.addEventListener('click', () => moveRight())

    function clicky(){console.log('icon clciked')}


    // TODO: Design a Restart state
    function restart(){




        score = 0
        currentPosition = 4
        currentRotation = 0
    }
    
 

    // Add score
    function addScore(){
        for(let i=0; i < 199; i+= width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            // console.log('Checking score')
            if(row.every(index => squares[index].classList.contains('taken'))){
                // console.log('scored')
                score += point
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                    squares[index].style.backgroundImage = ''
                })
                const squaresRemoved = squares.splice(i, width)
                // console.log(squaresRemoved)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }

        if (score%50 === 0 && score > 0 ){
            timePeriod -= 20
            console.log('Speed bumped! '+timePeriod)
        }
    }

    // Game over state
    function gameOver(){
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerID)
            bgm.pause()
            alert('Game Over!')
            player = prompt('Please enter name: ', 'mtc')
            if (player == null || player == '') {
                txt = 'Player cancelled prompt!'
            }
            else {
                txt = player + ' scored ' + score
            }
            alert(txt)
            

        }
    }

    
    //console.log(theTetrominos)
})