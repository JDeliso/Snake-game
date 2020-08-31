console.log("Hello World");

const $gameBoard = $(".game-board");
const gameSize = 20;
const snakeStart = Math.floor((gameSize * gameSize) / 2)+(gameSize/2);
const snake = [snakeStart, snakeStart + 20, snakeStart + 40];
let currentDirection = 'N';
let currentEggLocation;



// generates the snake each tick
function generateSnake() {
    let $cell = $('.cell');
    console.log($cell);
    for (let i = 0; i < snake.length; i++) {
        for (let j in $cell) {
            if (j == snake[i]) {
                const $snakeCell = $cell[j];
                $snakeCell.classList.add("snake-cell");
                console.log($snakeCell);
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

// generates an egg when needed
function generateEgg() {
    let eggLocation = Math.floor(Math.random() * (gameSize * gameSize));
    let validEgg = true;
    for (let i = 0; i < snake.length; i++){
        if (eggLocation == snake[i]) {
            validEgg = false;
        }
        if (validEgg) {
            let $cell = $('.cell');
            currentEggLocation = eggLocation;
            for (let j in $cell) {
                if (j == eggLocation) {
                    const $eggCell = $cell[j];
                    $eggCell.classList.add("egg-cell");
                }
            }
        }
        else {
            generateEgg();
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
}

function detectInput() {
    document.addEventListener('keydown', function(e) {
        return e.keyCode;
    });
}

function startGame() {
    $(".start-button").remove();
    generateBoard(gameSize);
    generateSnake();
    generateEgg();
    detectInput();
}


// Listens for click on the play button, on click removes menu items and generates board
$(".start-button").on("click", startGame);
