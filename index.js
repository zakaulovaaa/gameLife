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
    game.isAutoplay = true;
    game.autoplay();
};

let stopBtn = document.getElementById('btnStop');
stopBtn.onclick = function () {
    game.isAutoplay = false;
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

// let cellSize = document.getElementById("cellSize");
// cellSize.onchange = () => {
//     game.isAutoplay = false;
//     game.cellSize = cellSize.value;
//     game.clearGrid();
//     game.initGame();
// }






/** Для работы попапа с описанием игры */
document.addEventListener("DOMContentLoaded", () => {
    let btn_open_description = document.getElementById("btn-open_description");
    let close_popup = document.getElementById("close_popup");
    let popup = document.getElementById("popup_description_game");
    let fon = document.getElementById("fon-popup");
    btn_open_description.onclick = () => {
        popup.style.display = "block";
        fon.style.display = "block";
    }
    close_popup.onclick = () => {
        popup.style.display = "none";
        fon.style.display = "none";
    }
});