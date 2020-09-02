console.log("Hello World");

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

// generates board on tick start
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
};

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

// checks if its supposed to grow and grows
function grow() {
    if (willGrow) {
        snake.push(newSnakeSegment);
        willGrow = false;
    }
}

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
    for (let i = -1; i < gameSize * gameSize; i = i + 20){
        if (snake[0] == i) {
            return true;
        }
    }
}

// checks if snake touches the other walls
function touchWall() {
    if (snake[0] < 1) {
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

// displays the game over screen
function gameOverScreen() {
    const $gameOver = $("<div class='game-over'> Game <span>Over</span><div>");
    const $main = $("main");
    const $retry = $("<div class='retry menu'>retry</div>");
    const $changeDifficulty = $("<div class='change-difficulty menu'>change <span>difficulty</span></div>");
    $main.append($gameOver);
    $main.append($retry);
    $main.append($changeDifficulty);
    $(".retry").on("click", restart);
    $(".change-difficulty").on("click", difficultySelect);
    currentDirection = "N";
}

// starts the game
function startGame() {
    generateBoard(gameSize);
    updateScore();
    startTimer();
    generateSnakeStart();
    generateSnake();
    generateEgg();
    detectInput();
    setTimeout(mainLoop, 4000);
}

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
            clearInterval(game);
        }
        if (touchWall()) {
            console.log("uh oh");
            deadSnake();
            clearInterval(game);
        }
        grow();
        updateScore();
    }, gameSpeed);
}

// resets the snake
function generateSnakeStart() {
    snake.splice(0, snake.length);
    for (let i = 0; i < newSnake.length; i++){
        snake.push(newSnake[i]);
    }
}

// restarts the game
function restart() {
    generateSnake();
    startGame();
}

// starts countdown timer
function startTimer() {
    timerIndex = 3;
    const timer = setInterval(function () {
        $(".timer").remove();
        if (timerIndex == 0) {
            return clearInterval(timer);
        }
        const $time = $(`<div class='timer'>${timerIndex}</div>`);
        $("body").append($time);
        timerIndex--;
        currentDirection = "N";
    }, 1000);
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
        gameSpeed = 125;
        restart();
    });
    $(".hard").on("click", function () {
        gameSpeed = 75;
        restart();
    });
    $(".impossible").on("click", function () {
        gameSpeed = 45;
        restart();
    });
}

function updateScore() {
    const score = (snake.length - 3) * 25;
    const $score = $(`<div class='score'>Score: ${score}</div>`);
    $(".score").remove();
    $("body").append($score);
}

function deadSnake() {
    const $cell = $(".snake-cell");
    $cell.addClass("dead-snake")
}

function eggPickupSound() {
    $("audio").remove();
    const $audio = $("<audio id='audio' src='./sounds/laser1.wav' autoplay='false'></audio>");
    $("body").append($audio);
}

// Listens for click on the play button, on click removes menu items and generates board
$(".start-button").on("click", difficultySelect);
