console.log("Hello World");

// SECTION global variables
const gameSize = 20;
const snakeStart = Math.floor((gameSize * gameSize) / 2) + (gameSize / 2);
const newSnake = [snakeStart, snakeStart + 20, snakeStart + 40];
const snake = [snakeStart, snakeStart + 20, snakeStart + 40];
let currentDirection = 'N';
let lastDirection = "N";
let currentEggLocation, newSnakeSegment;
let willGrow = false;
let gameSpeed = 75;
let restartGame = false;
let highScores = window.localStorage;
let currentDifficulty;

// SECTION snake functions
// generates the snake each tick
function generateSnake() {
    let $cell = $('.cell');
    for (let i = 0; i < snake.length; i++) {
        for (let j in $cell) {
            if (j == snake[i]) {
                const $snakeCell = $cell[j];
                $snakeCell.classList.add("snake-cell");
            }
        }
    }
}

// resets the snake
function generateSnakeStart() {
    snake.splice(0, snake.length);
    for (let i = 0; i < newSnake.length; i++){
        snake.push(newSnake[i]);
    }
}


// SECTION snake eggPickup functions
// checks if you pickup an egg and will allow growth on next move
function eggPickup() {
    if (snake[0] == currentEggLocation) {
        newSnakeSegment = snake[snake.length - 1];
        $cell = $('.cell');
        $cell[currentEggLocation].classList.remove("egg-cell");
        generateEgg();
        willGrow = true;
        eggPickupSound();
    }
}

function eggPickupSound() {
    $("#pickup-audio").remove();
    const $audio = $("<audio id='pickup-audio' src='./sounds/laser1.wav' autoplay='false'></audio>");
    $("body").append($audio);
}

// SECTION snake moving functions
// deletes the last bit of the snake in preperation to move
function move() {
    const tail = snake[snake.length - 1];
    let $cell = $('.cell');
    for (let i in $cell) {
        if (i == tail) {
            const $tail = $cell[i];
            $tail.classList.remove("snake-cell");
        }
    }
}


function moveLeft() {
    currentDirection = "W";
    let temp = snake[0];
    let temp2 = 0;
    snake[0] = snake[0] - 1;
    move();
    for (let i = 1; i < snake.length; i++){
        temp2 = snake[i];
        snake[i] = temp;
        temp = temp2;
    }
    lastDirection = "W";
    generateSnake();
}

function moveRight() {
    currentDirection = "E";
    let temp = snake[0];
    let temp2 = 0;
    snake[0] = snake[0] + 1;
    move();
    for (let i = 1; i < snake.length; i++){
        temp2 = snake[i];
        snake[i] = temp;
        temp = temp2;
    }
    lastDirection = "E";
    generateSnake();
}

function moveUp() {
    currentDirection = "N";
    let temp = snake[0];
    let temp2 = 0;
    snake[0] = snake[0] - gameSize;
    move();
    for (let i = 1; i < snake.length; i++){
        temp2 = snake[i];
        snake[i] = temp;
        temp = temp2;
    }
    lastDirection = "N";
    generateSnake();
}

function moveDown() {
    currentDirection = "S";
    let temp = snake[0];
    let temp2 = 0;
    snake[0] = snake[0] + gameSize;
    move();
    for (let i = 1; i < snake.length; i++){
        temp2 = snake[i];
        snake[i] = temp;
        temp = temp2;
    }
    lastDirection = "S";
    generateSnake();
}

// checks if its supposed to grow and grows
function grow() {
    if (willGrow) {
        snake.push(newSnakeSegment);
        willGrow = false;
    }
}

// SECTION snake death check functions
// checks if snake touches its tail
function touchTail() {
    for (let i = 1; i < snake.length; i++){
        if (snake[0] == snake[i]) {
            gameOverScreen();
            return true;
        }
    }
}

// checks if snake touches the west wall
function westWallCheck() {
    for (let i = -1; i < gameSize * gameSize; i = i + gameSize){
        if (snake[0] == i) {
            return true;
        }
    }
}

// checks if snake touches the other walls
function touchWall() {
    if (snake[0] < 0) {
        gameOverScreen();
        return true;
    }
    else if (snake[0] > gameSize * gameSize) {
        gameOverScreen();
        return true;
    }
    else if ((currentDirection == "E") && (snake[0] % gameSize == 0)) {
        cutSnake();
        gameOverScreen();
        return true;
    }
    else if ((currentDirection == "W") && (westWallCheck())) {
        cutSnake();
        gameOverScreen();
        return true;
    }
}

function deadSnake() {
    const $snakeCell = $(".snake-cell");
    const $eggCell = $(".egg-cell");
    $snakeCell.addClass("dead-snake");
    $eggCell.addClass("dead-snake");
}

function deathSound() {
    $("#death-audio").remove();
    const $audio = $("<audio id='death-audio' src='./sounds/8bit_bomb_explosion.wav' autoplay='false'></audio>");
    $("body").append($audio);
}

// if you hit the left or right wall you will scroll so this cuts off the head so you dont see it pop out on the other side when you game over
function cutSnake() {
    const $cell = $(".cell");
    for (let i in $cell) {
        if (i == snake[0]) {
            const $snakeHead = $cell[i];
            $snakeHead.classList.remove("snake-cell");
        }
    }
}

// SECTION input function
// detects input and sets current direction to corresponding input
function detectInput() {
    document.addEventListener('keydown', function(e) {
        // Left Input
        if ((e.keyCode == 37 && lastDirection == "N") || (e.keyCode == 37 && lastDirection == "S")) {
            currentDirection = "W";
        }
        // Up input
        if ((e.keyCode == 38 && lastDirection == "W") || (e.keyCode == 38 && lastDirection == "E")) {
            currentDirection = "N";
        }
        // right input
        if ((e.keyCode == 39 && lastDirection == "N") || (e.keyCode == 39 && lastDirection == "S")) {
            currentDirection = "E";
        }
        // down input
        if ((e.keyCode == 40 && lastDirection == "W") || (e.keyCode == 40 && lastDirection == "E")) {
            currentDirection = "S";
        }
    });
}


// SECTION board functions
// generates board on game start
function generateBoard(size) {
    $("main").empty();
    $("main").append("<section class='game-board'></section>");
    const $gameBoard = $(".game-board");
    $gameBoard.css('--grid-size', size);
    
    for (let i = 0; i < (size * size); i++) {
        const $cell = $("<div class='cell'></div>");
        $cell.textext = (i + 1);
        $gameBoard.append($cell);
    };
}

// finds a valid egg and generates it on the game board
function generateEgg() {
    let validEgg = false;
    let eggLocation;
    while (!validEgg) {
        validEgg = true;
        eggLocation = Math.floor(Math.random() * (gameSize * gameSize));
        for (let i = 0; i < snake.length; i++) {
            if (eggLocation == snake[i]) {
                validEgg = false;
            }
        }
    }
    let $cell = $('.cell');
    currentEggLocation = eggLocation;
    for (let j in $cell) {
        if (j == eggLocation) {
            const $eggCell = $cell[j];
            $eggCell.classList.add("egg-cell");
        }
    }
}

// SECTION starts and restarts the game
// restarts the game
function restart() {
    generateSnake();
    startGame();
}

// starts the game
function startGame() {
    generateBoard(gameSize);
    startTimer();
    generateSnakeStart();
    generateSnake();
    updateScore();
    updateHighScore();
    generateEgg();
    detectInput();
    setTimeout(mainLoop, 4000);
}

// SECTION menu functions
// displays the main menu
function displayMenu() {
    $('.window').empty();
    const $title = $("<div class='title'>Snek</div>");
    const $play = $("<div class='start-button menu'>PLAY</div>");
    const $instructions = $("<div class='instructions-button menu'>INSTRUCTIONS</div>");
    $('.window').append($title);
    $('.window').append($play);
    $('.window').append($instructions);
    // Listens for click on the play button, on click removes menu items and generates board
    $(".start-button").on("click", difficultySelect);
    $(".instructions-button").on("click", displayInstructions);
}

// displays the instructions
function displayInstructions() {
    $(".window").empty();
    const $instructions = $("<div class='instructions'>Use your arrow keys to collect eggs to grow your snake, but don't forget to avoid your own tail and the walls!</div>");
    const $back = $("<div class='menu back'>back</div>");
    $(".window").append($instructions);
    $(".window").append($back);
    $(".menu").on("click", displayMenu);
}

// displays the game over screen
function gameOverScreen() {
    endOfGame = true;
    updateScore();
    const $gameOver = $("<div class='game-over'> Game <span>Over</span><div>");
    const $main = $("main");
    const $retry = $("<div class='retry menu'>retry</div>");
    const $changeDifficulty = $("<div class='change-difficulty menu'>change <span>difficulty</span></div>");
    $main.append($gameOver);
    $main.append($retry);
    $main.append($changeDifficulty);
    $(".retry").on("click", restart);
    $(".change-difficulty").on("click", difficultySelect);
    document.addEventListener('keydown', function(e){
        if((e.keyCode == 32 || e.keyCode == 13) && endOfGame){
            endOfGame = false;
            restart();
        }
    });    
    currentDirection = "N";
}

// displays the difficulty select screen
function difficultySelect() {
    $("main").empty();
    const $normal = $("<div class='menu normal'>normal</div>");
    $("main").append($normal);
    const $hard = $("<div class='menu hard'>hard</div>");
    $("main").append($hard);
    const $impossible = $("<div class='menu impossible'>impossible</div>");
    $("main").append($impossible);
    $(".normal").on("click", function () {
        currentDifficulty = "n";
        gameSpeed = 125;
        restart();
    });
    $(".hard").on("click", function () {
        currentDifficulty = "h";
        gameSpeed = 75;
        restart();
    });
    $(".impossible").on("click", function () {
        currentDifficulty = "i";
        gameSpeed = 45;
        restart();
    });
}

function updateScore() {
    const score = (snake.length - 3) * 25;
    const $score = $(`<div class='score'>Score: ${score}</div>`);
    $(".score").remove();
    $("body").append($score);
    updateHighScore();
}

function updateHighScore(){
    switch (currentDifficulty){
        case "n":
            if(highScores.getItem(`n`) == null){
                highScores.setItem('n', (snake.length-3)*25);
                displayHighScore("n");
            }
            else if(highScores.getItem('n') > (snake.length-3)*25){
                displayHighScore("n");
            }
            else if(highScores.getItem(`n`) < (snake.length-3)*25){
                highScores.setItem('n', (snake.length-3)*25);
                displayHighScore("n");
            }
            break;
        case "h":
            if(highScores.getItem(`h`) == null){
                highScores.setItem('h', (snake.length-3)*25);
                displayHighScore("h");
            }
            else if(highScores.getItem('h') > (snake.length-3)*25){
                displayHighScore("h");
            }
            else if(highScores.getItem(`h`) < (snake.length-3)*25){
                highScores.setItem('h', (snake.length-3)*25);
                displayHighScore("h");
            }
            break;
        case "i":
            if(highScores.getItem(`i`) == null){
                highScores.setItem('i', (snake.length-3)*25);
                displayHighScore("i");
            }
            else if(highScores.getItem('i') > (snake.length-3)*25){
                displayHighScore("i");
            }
            else if(highScores.getItem(`i`) < (snake.length-3)*25){
                highScores.setItem('i', (snake.length-3)*25);
                displayHighScore("i");
            }
            break;
    }

}

function displayHighScore(difficulty){
    const $highScore = $(`<div class='high-score'>High Score: ${highScores.getItem(difficulty, (snake.length-3)*25)}</div>`);
        $(".high-score").remove();
        $("body").append($highScore);
}

// SECTION countdown functions
// starts countdown timer
function startTimer() {
    timerIndex = 3;
    const timer = setInterval(function () {
        $(".timer").remove();
        if (timerIndex == 0) {
            startSound();
            return clearInterval(timer);
        }
        countdownSound();
        const $time = $(`<div class='timer'>${timerIndex}</div>`);
        $("body").append($time);
        timerIndex--;
        currentDirection = "N";
    }, 1000);
}

function countdownSound() {
    $("#countdown-audio").remove();
    const $audio = $("<audio id='countdown-audio' src='./sounds/countdown.wav' autoplay='false'></audio>");
    $("body").append($audio);
}

function startSound() {
    $("#start-audio").remove();
    const $audio = $("<audio id='countdown-audio' src='./sounds/start.wav' autoplay='false'></audio>");
    $("body").append($audio);
}


// SECTION MAIN GAME LOOP
// main logic loop
function mainLoop() {
    const game = setInterval(function () {
        eggPickup();
        switch (currentDirection) {
            case "W":
                moveLeft();
                break;
            case "N":
                moveUp();
                break;
            case "E":
                moveRight();
                break;
            case "S":
                moveDown();
                break;
        }
        if (touchTail()) {
            console.log("uh oh");
            deadSnake();
            deathSound();
            clearInterval(game);
        }
        if (touchWall()) {
            console.log("uh oh");
            deadSnake();
            deathSound();
            clearInterval(game);
        }
        grow();
        updateScore();
    }, gameSpeed);
}

displayMenu();