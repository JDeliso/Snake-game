console.log("Hello World");

const $gameBoard = $(".game-board");
const gameSize = 20;
const snakeStart = Math.floor((gameSize * gameSize) / 2)+(gameSize/2);
const snake = [snakeStart, snakeStart + 20, snakeStart + 40];
let currentDirection = 'N';
let currentEggLocation, newSnakeSegment;
let willGrow = false;



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
    $gameBoard.css('--grid-size', size);
    
    for (let i = 0; i < (size * size); i++) {
        const $cell = $("<div class='cell'></div>");
        $cell.textext = (i + 1);
        $gameBoard.append($cell);
    };
};

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
    move();
    currentDirection = "W";
    let temp = snake[0];
    let temp2 = 0;
    snake[0] = snake[0] - 1;
    for (let i = 1; i < snake.length; i++){
        temp2 = snake[i];
        snake[i] = temp;
        temp = temp2;
    }
    generateSnake();
}

function moveRight() {
    move();
    currentDirection = "E";
    let temp = snake[0];
    let temp2 = 0;
    snake[0] = snake[0] + 1;
    for (let i = 1; i < snake.length; i++){
        temp2 = snake[i];
        snake[i] = temp;
        temp = temp2;
    }
    generateSnake();
}

function moveUp() {
    move();
    currentDirection = "N";
    let temp = snake[0];
    let temp2 = 0;
    snake[0] = snake[0] - gameSize;
    for (let i = 1; i < snake.length; i++){
        temp2 = snake[i];
        snake[i] = temp;
        temp = temp2;
    }
    generateSnake();
}

function moveDown() {
    move();
    currentDirection = "S";
    let temp = snake[0];
    let temp2 = 0;
    snake[0] = snake[0] + gameSize;
    for (let i = 1; i < snake.length; i++){
        temp2 = snake[i];
        snake[i] = temp;
        temp = temp2;
    }
    generateSnake();
}

function detectInput() {
    document.addEventListener('keydown', function(e) {
        // Left Input
        if ((e.keyCode == 37 && currentDirection == "N") || (e.keyCode == 37 && currentDirection == "S")) {
            currentDirection = "W";
        }
        // Up input
        if ((e.keyCode == 38 && currentDirection == "W") || (e.keyCode == 38 && currentDirection == "E")) {
            currentDirection = "N";
        }
        // right input
        if ((e.keyCode == 39 && currentDirection == "N") || (e.keyCode == 39 && currentDirection == "S")) {
            currentDirection = "E";
        }
        // down input
        if ((e.keyCode == 40 && currentDirection == "W") || (e.keyCode == 40 && currentDirection == "E")) {
            currentDirection = "S";
        }
    });
}

function eggPickup() {
    if (snake[0] == currentEggLocation) {
        newSnakeSegment = snake[snake.length - 1];
        $cell = $('.cell');
        $cell[currentEggLocation].classList.remove("egg-cell");
        generateEgg();
        willGrow = true;
    }
}

function grow() {
    if (willGrow) {
        snake.push(newSnakeSegment);
        willGrow = false;
    }
}

function mainLoop() {
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
    grow();
}


function startGame() {
    $(".start-button").remove();
    generateBoard(gameSize);
    generateSnake();
    generateEgg();
    detectInput();
    const game = setInterval(mainLoop, 125);
}


// Listens for click on the play button, on click removes menu items and generates board
$(".start-button").on("click", startGame);
