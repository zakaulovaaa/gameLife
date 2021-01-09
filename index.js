'use strict'; //ES5 строгий режим

let game = new GameLife();
game.initGame();

let randBtn = document.getElementById('rand');
randBtn.onclick = function () {
    game.randomFill();
};

//Кнопка autoplay
let autoplayBtn = document.getElementById('autoplay');
autoplayBtn.onclick = function () {
    autoplayBtn.value = (game.isAutoplay ? "Плей" : "Стоп");
    game.isAutoplay = !game.isAutoplay;
    game.autoplay();
};



let stepBtn = document.getElementById('step');
stepBtn.onclick = function () {
    game.updateCells();
};

let clearBtn = document.getElementById('clear');
clearBtn.onclick = function () {
    game.isAutoplay = false;
    game.clearGrid();
    game.initGame();
};

let saveBtn = document.getElementById('savePNG');
saveBtn.onclick = function () {
    game.downloadPng("file.png")
};

let widthGrid = document.getElementById("width");
widthGrid.onchange = () => {
    game.isAutoplay = false;
    game.clearGrid();
    game.initGame();
}

let heightGrid = document.getElementById("height");
heightGrid.onchange = () => {
    game.isAutoplay = false;
    game.clearGrid();
    game.initGame();
}

let cellSize = document.getElementById("cellSize");
cellSize.onchange = () => {
    game.isAutoplay = false;

    game.setSizeCanvases();
    game.clearGrid();
    game.initGame();
}

let btnPaint = document.getElementById("btnPaint");
btnPaint.onclick = () => {
    btnPaint.value = (game.isPaint ? "Рисовать" : "Прекратить рисование");
    game.isPaint = !game.isPaint;
}

let backCanvas = document.getElementById('back');
backCanvas.addEventListener('click', (event) => {
    let x = event.pageX - (backCanvas.offsetLeft + backCanvas.clientLeft),
        y = event.pageY - (backCanvas.offsetTop + backCanvas.clientTop);
    game.changeValueCell(x, y);
}, false);


