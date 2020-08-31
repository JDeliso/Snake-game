console.log("Hello World");

const $gameBoard = $(".game-board");

function generateBoard(size) {
    $gameBoard.css('--grid-size', size);
    
    for (let i = 0; i < (size * size); i++) {
        const $cell = $("<div class='cell'></div>");
        $cell.textext = (i + 1);
        $gameBoard.append($cell);
  };
};

generateBoard(20);