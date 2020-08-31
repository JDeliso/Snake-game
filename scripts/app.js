console.log("Hello World");

const $gameBoard = $(".game-board");
const gameSize = 20;
const snakeStart = Math.floor((gameSize * gameSize) / 2)+(gameSize/2);
const snake = [snakeStart, snakeStart + 20, snakeStart + 40];


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

function startGame() {
    $(".start-button").remove();
    generateBoard(gameSize);
    generateSnake();
}


// Listens for click on the play button, on click removes menu items and generates board
$(".start-button").on("click", startGame);
