'use strict';
class Board {
    constructor(width, height) {
        this.cell = [];
        this.width = width;
        this.height = height;
        this.statusList = [Board.EMPTY, Board.BLACK, Board.WHITE];
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.cell.push(Board.EMPTY);
            }
        }
    }
    get(x, y) {
        if (!this.assert(x, y)) return null;
        return this.cell[x * this.width + y];
    }
    put(x, y, color) {
        if (!this.assert(x, y)) return null;
        if (!this.canPut(x, y, color)) {
            return this;
        }
        this.cell[x * this.width + y] = color;
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                var cell = this.get(x + dx, y + dy);
                if (cell === null || cell === Board.EMPTY || cell === color) {
                    continue;
                }
                // found the neighbor cell that has another color stone.
                var n = 1;
                while(cell !== null) {
                    n++;
                    cell = this.get(x + dx * n, y + dy * n);
                    if (cell === Board.EMPTY) break;
                    if (cell !== color) {
                        continue;
                    }
                    while(n >= 1) {
                        this.change(x + dx * n, y + dy * n, color);
                        n--;
                    }
                    break;
                }
            }
        }
        return this;
    }
    change (x, y, color) {
        this.cell[x * this.width + y] = color;
        return this;
    }
    canPut(x, y, color) {
        var res = this.countChangeableStones(x, y, color);
        return res !== 0 && res !== null;
    }
    countChangeableStones(x, y, color) {
        if (!this.assert(x, y)) return null;
        if (this.get(x, y) !== Board.EMPTY) return 0;

        var res = 0;
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                var cell = this.get(x + dx, y + dy);
                if (cell !== null && cell !== Board.EMPTY && cell !== color) {
                    var n = 1;
                    while(cell !== null) {
                        n++;
                        cell = this.get(x + dx * n, y + dy * n);
                        if (cell === Board.EMPTY) {
                            break;
                        }
                        if (cell === color) {
                            if (x === 1 && y === 5 && color === 1) console.log(x + dx * n, y + dy * n);
                            res += n - 1;
                            break;
                        }
                    }
                }
            }
        }
        return res;
    }
    assert(x, y) {
        if (!(x >= 0 && x < this.width) || !(y >= 0 && y < this.height)) return false;
        return true;
    }
    static get EMPTY() {return 0}
    static get BLACK() {return 1}
    static get WHITE() {return 2}
};
if (typeof module !== 'undefined') {
    module.exports = Board;
}