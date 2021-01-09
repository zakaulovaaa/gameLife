class GameLife {

    getWidthBlockById(id) {
        let block = document.getElementById(id);
        if (block !== null) {
            return block.offsetWidth;
        }
        return 0;
    }

    getHeightBlockById(id) {
        let block = document.getElementById(id);
        if (block !== null) {
            return block.offsetHeight;
        }
        return 0;
    }

    setSizeCanvases() {
        //если блок с настройками и канвас влезают в один скрин
        if (window.innerWidth - this.settingsWidth >= this.minWidthCanvas) {
            this.cellSize= document.getElementById("cellSize").value;

            /** Установили количество ячеек */
            let width = div(window.innerWidth - this.settingsWidth, this.cellSize);
            // width = width - 1 + width % 2;
            this.inputWidth.value = width;

            let height = div(window.innerHeight - this.titleHeight, this.cellSize);
            // height = height - 1 + height % 2;
            this.inputHeight.value = height;

            /** установили новый размер канвасов */
            this.canvas.canvas.height = window.innerHeight - this.titleHeight;
                // height * this.cellSize + 1;
            this.canvas.canvas.width = window.innerWidth - this.settingsWidth; // width * this.cellSize + 1;

            this.game.canvas.height = window.innerHeight - this.titleHeight;
            //height * this.cellSize + 1;
            this.game.canvas.width = window.innerWidth - this.settingsWidth; //width * this.cellSize + 1;

        } else {
            /** TODO: Написать правила для маленьких экранов */

        }
    }

    constructor() {
        /** Устанавливаем переменные */
        this.settingsWidth = this.getWidthBlockById("block_settings"); //ширина блока с настройками -- для отступов
        this.minWidthCanvas = 400;
        this.titleHeight = this.getHeightBlockById("main_title");
        this.cellSize = 7; //размер клетки
        this.canvas = document.getElementById('back').getContext('2d');
        this.game = document.getElementById('game').getContext('2d');
        this.canvas.translate(0.5, 0.5);
        this.isPaint = false;

        this.inputWidth = document.getElementById('width');
        this.inputHeight = document.getElementById('height');
        this.inputTimeout = document.getElementById('timeout');


        this.size = {x: this.inputWidth.value, y: this.inputHeight.value};

        this.cells = [];
        this.buffCells = [];

        this.isAutoplay = false;

        /** Выполняем основные функции */
        this.setSizeCanvases();

    }

    newGridFill() {
        for (let i = 0; i < this.size.x; i++) {
            this.cells[i] = [];
            this.buffCells[i] = [];
            for (let j = 0; j < this.size.y; j++) {
                this.cells[i][j] = false;
                this.buffCells[i][j] = false;
            }
        }
    }
    gridDraw() {
        this.canvas.beginPath();
        let widthCanvas = this.inputWidth.value * this.cellSize;
        let heightCanvas = this.inputHeight.value * this.cellSize;

        for (let i = 0; i <= this.size.y; i++) {
            this.canvas.moveTo(0, i * this.cellSize + 0.5);
            this.canvas.lineWidth = 1;
            this.canvas.lineTo(widthCanvas, i * this.cellSize + 0.5);
            this.canvas.strokeStyle = "rgb(50, 50, 50)"; // цвет линии
        }

        for (let i = 0; i <= this.size.x; i++) {
            this.canvas.lineWidth = 1;
            this.canvas.moveTo(i * this.cellSize + 0.5, 0);
            this.canvas.lineTo(i * this.cellSize + 0.5, heightCanvas);
            this.canvas.strokeStyle = "rgb(50, 50, 50)"; // цвет линии
        }

        this.canvas.stroke();

        this.canvas.beginPath();
        this.canvas.fillStyle = "#213b32";
        this.canvas.fillRect(this.inputWidth.value * this.cellSize, 0, 10000, 10000);
        this.canvas.fillRect(0, this.inputHeight.value * this.cellSize, 10000, 10000);

        this.canvas.stroke();
    }

    clearGrid() {
        this.game.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearCell(x, y) {
        this.game.fillStyle = "white";
        this.game.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }

    fillCell(x, y) {
        this.game.fillStyle = "rgb(150, 170, 150)";
        this.game.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }

    fillGrid() {
        this.clearGrid();
        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                if (this.cells[i][j] === true) {
                    this.fillCell(i, j);
                }
            }
        }
    }

    changeValueCell(x, y) {

        if (x < 0 || y < 0 || x > this.cellSize * this.inputWidth.value || y > this.cellSize * this.inputHeight.value ||
            !this.isPaint) {
            return;
        }
        let i = div(x, this.cellSize), j = div(y, this.cellSize);
        if (this.cells[i][j]) {
            this.clearCell(i, j);
        } else {
            this.fillCell(i, j);
        }
        this.cells[i][j] = !this.cells[i][j];

    }

    randomFill() {
        /** Заполняем матрицу */
        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                let fill = (Math.random() < 0.5);
                this.cells[i][j] = Boolean(fill);
            }
        }
        /** Отрисовываем */
        this.fillGrid();
    }

    getLivingNeighbors(x, y) {
        let ans = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                let cntX = x + i, cntY = y + j;

                if (cntX < 0) cntX = this.size.x - 1;

                if (cntX >= this.size.x) cntX = 0;

                if (cntY < 0) cntY = this.size.y - 1;
                if (cntY >= this.size.y) cntY = 0;

                if (this.cells[cntX][cntY]) ans++;
            }
        }
        return ans;
    }

    updateCells() {
        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                let res = false, cnt = this.getLivingNeighbors(i, j);

                if (this.cells[i][j] === true && cnt === 2) {
                    res = true;
                }
                if (cnt === 3) {
                    res = true;
                }
                this.buffCells[i][j] = res;
            }
        }

        for (let i = 0; i < this.size.x; i += 1) {
            for (let j = 0; j < this.size.y; j += 1) {
                this.cells[i][j] = this.buffCells[i][j];
            }
        }

        this.fillGrid();
    }


    autoplay() {
        if (this.isAutoplay) {
            this.updateCells();
            setTimeout(() => {
                this.autoplay();
            }, this.inputTimeout.value);
        }
    }

    initGame() {
        /** очищаем поле */
        this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);

        /** устанавливаем размеры */
        this.canvas.width = this.cellSize * this.inputWidth.value;
        this.canvas.height = this.cellSize * this.inputHeight.value;

        this.size = {x: this.inputWidth.value, y: this.inputHeight.value};

        this.newGridFill();
        this.gridDraw();
    }

    downloadPng (filename) {
        let canvas2 = document.getElementById('game')
        let lnk = document.createElement('a'), e;
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
}