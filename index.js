'use strict'; //ES5 строгий режим
var console;

var CELL_SIZE = 7; //размер клетки
var cells = [], buffCells = [];
var timeout = 30; //задержка для автоплея
var canvas, game;
canvas = document.getElementById('back').getContext('2d');
canvas.translate(0.5, 0.5);

var length = 1; 
var isAutoPlay = false

function init() {
    //back-grid

    canvas.clearRect(0, 0, 1400, 1400)
    // canvas.translate(0.5, 0.5);
    canvas.width =  CELL_SIZE * document.getElementById('width').value;
    canvas.height =  CELL_SIZE * document.getElementById('height').value;

    //game
    game = document.getElementById('game').getContext('2d');

    /* Сетка */
    function Grid() {
        this.size = { x : 0, y : 0 };
        this.width = canvas.width;
        this.height = canvas.height;
        // canvas.clear()
        //grid functions


        this.size.x = parseInt(canvas.width / CELL_SIZE, 10); //округляем к наименьшему
        this.size.y = parseInt(canvas.height / CELL_SIZE, 10);

        /* заполняем массив cells */
        this.fill = function () {
            var i, j;
            for (i = 0; i < this.size.x; i += 1) {
                cells[i] = [];
                buffCells[i] = [];
                for (j = 0; j < this.size.y; j += 1) {
                    cells[i][j] = false; //false - нет жизни, true есть
                    buffCells[i][j] = false;
                }
            }
        };

        var marginGor = (1400 - CELL_SIZE * document.getElementById('width').value) / 2;

        /* рисуем сетку */
        this.draw = function () {
            var i;

            // canvas.transform(1, 0, 0, -1, 0, canvas.height)
            // canvas.translate(0.5, 0.5);
            canvas.beginPath();

            for (i = 0; i <= this.size.y; i += 1) {
                canvas.moveTo(marginGor, i * CELL_SIZE);
                canvas.lineWidth = 1;
                canvas.lineTo(this.width + marginGor, i * CELL_SIZE);
                canvas.strokeStyle = "rgb(80, 80, 80)"; // цвет линии
            }

            for (i = 0; i <= this.size.x; i += 1) {
                canvas.lineWidth = 1;
                canvas.moveTo(i * CELL_SIZE + marginGor, 0);
                canvas.lineTo(i * CELL_SIZE + marginGor, canvas.height);
                canvas.strokeStyle = "rgb(80, 80, 80)"; // цвет линии
            }

            canvas.stroke();
        };
    }


    /* обновляем отрисовку */
    function Update() {

        /* Очистка ячеек */
        this.clear = function () {
            var marginGor = (1400 - CELL_SIZE * document.getElementById('width').value) / 2
            game.clearRect(marginGor, 0, canvas.width, canvas.height);
        };

        /* Заполнить конкретную ячейку */
        this.fillCell = function (x, y) {
            var marginGor = (1400 - CELL_SIZE * document.getElementById('width').value) / 2
            game.fillStyle="rgb(200, 200, 200)";
            game.fillRect(x * CELL_SIZE + marginGor, y * CELL_SIZE, CELL_SIZE + 1, CELL_SIZE + 1);
        };

        /* Заполнить всё поле */
        this.fill = function () {
            var i, j, grid = new Grid(), upd = new Update();

            //Очищаем предыдущий кадр
            upd.clear();

            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    //Тут можно устроить инверсию цвета
                    if (cells[i][j] === true) {
                        upd.fillCell(i, j);
                    }
                }
            }
            //Пересчитываем ячейки
            upd.cells();
        };

        /* рандомная заливка для тестов */
        this.randomFill = function () {
            var i, j, fill, fillRnd, grid = new Grid(), upd = new Update();
            //очищаем предыдущий рисунок
            upd.clear();

            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    //рандомизация boolean
                    fill = [true, false][Math.round(Math.random())];
                    cells[i][j] = Boolean(fill);
                }
            }
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    fill = cells[i][j];
                    if (fill === true) {
                        //заполняем новый рисунок
                        fillRnd = new Update();
                        fillRnd.fillCell(i, j);
                    }
                }
            }
        };

        /* АВТОШАГ */
        this.autoplay = function () {
            if (isAutoPlay) {
                var upd = new Update();
                upd.fill();
                timeout = document.getElementById('timeout').value
                setTimeout(function () { upd.autoplay(); }, timeout);
            }
        };

        /* Проверяем количество живых соседей */
        this.getLivingNeighbors = function (x, y) {
            var grid = new Grid(), count = 0, sx = grid.size.x, sy = grid.size.y;
            //ПРАВИЛА ИГРЫ
            //Проверяем верхнюю левую ячейку !
            if (x !== 0 && y !== 0 && cells[x - 1][y - 1] === true) {
                count += 1;
            }
            //Проверяем верхнюю ячейку !
            if (y !== 0 && cells[x][y - 1] === true) {
                count += 1;
            }
            //Проверяем верхнюю правую ячейку !
            if (x !== sx - 1 && y !== 0 && cells[x + 1][y - 1] === true) {
                count += 1;
            }
            //Проверяем левую ячейку !
            if (x !== 0 && cells[x - 1][y] === true) {
                count += 1;
            }
            //Проверяем правую ячейку !
            if (x !== sx - 1 && cells[x + 1][y] === true) {
                count += 1;
            }
            //Проверяем нижнюю левую ячейку !
            if (x !== 0 && y !== sy - 1 && cells[x - 1][y + 1] === true) {
                count += 1;
            }
            //Проверяем нижнюю ячейку !
            if (y !== sy - 1 && cells[x][y + 1] === true) {
                count += 1;
            }
            //Проверяем нижнюю правую ячейку !
            if (x !== sx - 1 && y !== sy - 1 && cells[x + 1][y + 1] === true) {
                count += 1;
            }
            //топология тор
            if (x === 0 && cells[sx - 1][y] === true) {
                count += 1
            }
            if (x === 0 && y !== sy - 1 && cells[sx - 1][y + 1] === true) {
                count += 1
            }
            if (x === 0 && y !== 0 && cells[sx - 1][y - 1] === true) {
                count += 1
            }
            if (x === sx - 1 && cells[0][y] === true) {
                count += 1
            }
            if (x === sx - 1 && y !== sy - 1 && cells[0][y + 1] === true) {
                count += 1
            }
            if (x === sx - 1 && y !== 0 && cells[0][y - 1] === true) {
                count += 1
            }
            if (y === 0 && cells[x][sy - 1] === true) {
                count += 1
            }
            if (y === 0 && x !== 0 &&  cells[x - 1][sy - 1] === true) {
                count += 1
            }
            if (y === 0 && x !== sx - 1 &&  cells[x + 1][sy - 1] === true) {
                count += 1
            }
            if (y === sy - 1 && cells[x][0] === true) {
                count += 1
            }
            if (y === sy - 1 && x !== 0 &&  cells[x - 1][0] === true) {
                count += 1
            }
            if (y === sy - 1 && x !== sx - 1 &&  cells[x + 1][0] === true) {
                count += 1
            }

            return count;
        };

        /* Проверяем клетки по правилам игры */
        this.cells = function () {
            var i, j, isAlive, count, result = false, gameUpd = new Update(), grid = new Grid();
            //сначала нужно скопировать массив
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    result = false;
                    //Проверяем состояние ячейки
                    isAlive = cells[i][j];
                    //считаем живых соседей
                    count = gameUpd.getLivingNeighbors(i, j);
                    //применяем правила
                    if (isAlive && count < 2) {
                        result = false;
                    }
                    if (isAlive && (count === 2 || count === 3)) {
                        result = true;
                    }
                    if (isAlive && count > 3) {
                        result = false;
                    }
                    if (!isAlive && count === 3) {
                        result = true;
                    }
                    //записываем результат
                    buffCells[i][j] = result;
                }
            }

            //копируем массив. Сделаю через цикл, чтобы наверняка))0
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    cells[i][j] = buffCells[i][j];
                }
            }
        };

    }

    var gameGrid = new Grid(), gameUpd = new Update(), clearBtn, randBtn, stepBtn, stopBtn, saveBtn, saveField, loadField, data ;
    gameGrid.draw();
    gameGrid.fill();
    //gameUpd.fillCell(10, 10);

    //Кнопка очистки
    clearBtn = document.getElementById('clear');
    clearBtn.onclick = function () {
        // alert('qqq')
        isAutoPlay = false;
        gameUpd.clear();
    };

    //Кнопка рандомизации
    randBtn = document.getElementById('rand');
    randBtn.onclick = function () { gameUpd.randomFill(); };

    //Кнопка шага
    stepBtn = document.getElementById('step');
    stepBtn.onclick = function () { gameUpd.fill(); };

    //Кнопка autoplay
    stepBtn = document.getElementById('autoplay');
    stepBtn.onclick = function () {
        isAutoPlay = true;
        var upd = new Update();
        upd.autoplay();
    };

    //Остановить автоплей
    stopBtn = document.getElementById('btnStop');
    stopBtn.onclick = function () {
        // alert('!');
        isAutoPlay = false;
    };

    function download(filename) {
      var canvas2 = document.getElementById('game')
      var lnk = document.createElement('a'), e;
      lnk.download = filename;
      lnk.href = canvas2.toDataURL("image/png;base64");

      if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);

        lnk.dispatchEvent(e);
      } else if (lnk.fireEvent) {
        lnk.fireEvent("onclick");
      }
    }


    saveBtn = document.getElementById('savePNG');
    saveBtn.onclick = function () {
        download("filename.png")
    };

    function getField() {
      var ans = ""
      ans += document.getElementById('height').value + " " + document.getElementById('width').value + "\n";

      for (var i = 0; i < document.getElementById('height').value; i += 1) {
          for (var j = 0; j < document.getElementById('width').value; j += 1) {
              ans += cells[i][j] === true ? "1 " : "0 ";
          }
          ans += "\n";
      }

      return ans;
    }

    saveField = document.getElementById('saveField');
    saveField.onclick = function () {
      var text = getField();
      let a = document.createElement("a");
      let file = new Blob([text], {type: 'application/json'});
      a.href = URL.createObjectURL(file);
      a.download = "example.txt";
      a.click();
    };

    loadField = document.getElementById('loadField');
    loadField.addEventListener("change", handleFiles, false);

    function handleFiles() {
      var file = this.files[0]; /* now you can work with the file list */
      let reader = new FileReader();

      reader.readAsText(file);


      var fileLine;
      reader.onload = function() {
        fileLine = reader.result;
        var mass = fileLine.split("\n")

        document.getElementById('height').value = mass[0].split(" ")[0]
        document.getElementById('width').value = mass[0].split(" ")[1]

        init()
        var i, j, fill, fillRnd, grid = new Grid(), upd = new Update();
        //очищаем предыдущий рисунок
        upd.clear();


        for (var i = 1; i < document.getElementById('height').value; i++) {
          var massi = mass[i].split(" ")
          for (var j = 1; j < document.getElementById('width').value; j++) {
            cells[i][j] = massi[j] === "1" ? true : false
          }
        }

        for (i = 0; i < grid.size.x; i += 1) {
            for (j = 0; j < grid.size.y; j += 1) {
                fill = cells[i][j];
                if (fill === true) {
                    //заполняем новый рисунок
                    fillRnd = new Update();
                    fillRnd.fillCell(i, j);
                }
            }
        }



      };


    }


}

window.onload = init();