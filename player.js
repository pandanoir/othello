class Game {
    constructor() {
        this.turn = null;
        this.turnIndex = 0;
        this.players = [];
        this.listener = [];
        this.board = new Board(8, 8);
    }
    trigger(name, arg) {
        for (var i = 0, _i = this.listener[name].length; i < _i; i++) {
            this.listener[name][i].call(this, arg);
        }
    }
    listen(name, f) {
        if (!this.listener[name]) this.listener[name] = [];
        this.listener[name].push(f.bind(this));
    }
};
var game = new Game();
game.listen('attend', function(arg) {
    this.players.push(arg);
    if (this.turn === null) {
        this.turn = arg.id;
    }
});
game.listen('put', function(arg) {
    var counter = [];
    for (var i = 0, _i = this.board.statusList.length; i < _i; i++) counter[this.board.statusList[i]] = 0;
    for (var x = 0; x < this.board.width; x++) {
        for (var y = 0; y < this.board.height; y++) {
            counter[this.board.get(x, y)]++;
        }
    }
    console.log('put');
    if (counter[Board.EMPTY] === 0) {
        this.trigger('end');
    } else if (counter[Board.BLACK] === 0 || counter[Board.WHITE] === 0) {
        this.trigger('end');
    } else {
        this.turnIndex = (this.turnIndex + 1) % this.players.length;
        this.turn = this.players[this.turnIndex].id;
    }
});
game.listen('put', function() {
    if (!this.players[this.turnIndex].canPut()) this.players[this.turnIndex].pass();
});
game.listen('pass', function() {
    this.turnIndex = (this.turnIndex + 1) % this.players.length;
    this.turn = this.players[this.turnIndex].id;
});
game.listen('end', function() {
    console.log('end');
    var counter = [];
    for (var i = 0, _i = this.board.statusList.length; i < _i; i++) counter[this.board.statusList[i]] = 0;
    for (var x = 0; x < this.board.width; x++) {
        for (var y = 0; y < this.board.height; y++) {
            counter[this.board.get(x, y)]++;
        }
    }

    var max = Math.max.apply(Math, counter);
    if (counter[Board.EMPTY] === 0) {
        if (max === this.board.width * this.board.height / 2) {
            this.trigger('draw');
        } else {
            var winnerColor = counter.findIndex(function(x) {return x === max});
            for (var i = 0, _i = this.players.length; i < _i; i++) {
                if (this.players[i].color === winnerColor) this.trigger('win', i);
            }
        }
    } else {
        var winnerColor = counter[Board.BLACK] === 0 ? Board.WHITE : Board.BLACK;
        for (var i = 0, _i = this.players.length; i < _i; i++) {
            if (this.players[i].color === Board.WHITE) this.trigger('win', i);
        }
    }
})
var id = 0;
class Player {
    constructor(name, color) {
        this.id = id++;
        this.name = name;
        this.color = color;
        game.trigger('attend', this);
    }
    put(x, y) {
        if (game.turn === this.id && game.board.canPut(x, y, this.color)) {
            game.board.put(x, y, this.color);
            console.log(x, y, this.color);
            game.trigger('put');
            return true;
        }
        return false;
    }
    pass() {
        game.trigger('pass');
    }
    canPut() {
        for (var x = 0; x < game.board.width; x++) {
            for (var y = 0; y < game.board.height; y++) {
                if (game.board.canPut(x, y, this.color)) return true;
            }
        }
        return false;
    }
}