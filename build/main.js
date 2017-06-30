var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TrumpInvaderGame = (function () {
    function TrumpInvaderGame(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.monster = document.createElement("img");
        this.monsterBullet = document.createElement("img");
        this.gunImage = document.createElement("img");
        this.isGameOver = false;
        this.canShoot = true;
        this.monstersLeft = 0;
        this.monsters = [];
        this.bullets = [];
        this.whines = [];
        this.setup();
        this.drawObjects();
    }
    TrumpInvaderGame.prototype.setup = function () {
        this.gun = new Gun(this.canvas, this.canvas.width / 2, this.canvas.height - 60);
        for (var column = 0; column < 15; column++) {
            for (var row = 0; row < 4; row++) {
                this.monsters.push(new Monster(this.canvas, column * 41, row * 50 + 30));
                this.monstersLeft++;
            }
        }
        this.monster.src = 'trump.png';
        this.monsterBullet.src = 'twitter.png';
        this.gunImage.src = 'statue-of-liberty.png';
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('click', this.handleMouseClick.bind(this));
    };
    TrumpInvaderGame.prototype.moveObjects = function () {
        for (var _i = 0, _a = this.monsters; _i < _a.length; _i++) {
            var monster = _a[_i];
            monster.move();
        }
        for (var _b = 0, _c = this.bullets; _b < _c.length; _b++) {
            var bullet = _c[_b];
            bullet.move();
        }
    };
    TrumpInvaderGame.prototype.makeMonstersShoot = function () {
        for (var _i = 0, _a = this.monsters; _i < _a.length; _i++) {
            var monster = _a[_i];
            if (monster.isAlive) {
                var diceRoll = Math.random();
                if (diceRoll <= 0.005) {
                    this.bullets.push(new Bullet(this.canvas, monster.x + 20, monster.y + 50, 1, 'orange'));
                }
            }
        }
    };
    TrumpInvaderGame.prototype.detectCollisions = function () {
        var flipMonsters = false;
        for (var _i = 0, _a = this.monsters; _i < _a.length; _i++) {
            var monster = _a[_i];
            if (monster.isAlive) {
                if ((monster.rightEdgeX() >= this.canvas.width && monster.direction == 1) ||
                    (monster.leftEdgeX() <= 0 && monster.direction == -1)) {
                    flipMonsters = true;
                    break;
                }
            }
        }
        if (flipMonsters) {
            for (var _b = 0, _c = this.monsters; _b < _c.length; _b++) {
                var monster = _c[_b];
                monster.direction *= -1;
                monster.y += 20;
                monster.speed += 0.2;
            }
        }
        for (var _d = 0, _e = this.monsters; _d < _e.length; _d++) {
            var monster = _e[_d];
            for (var _f = 0, _g = this.bullets; _f < _g.length; _f++) {
                var bullet = _g[_f];
                if (this.didBulletAndMonsterCollide(bullet, monster)) {
                    monster.isAlive = false;
                    bullet.isAlive = false;
                    this.whines.push(new Whine(monster.x, monster.y - 10, 3000 / 30));
                    this.monstersLeft--;
                }
            }
        }
        for (var _h = 0, _j = this.bullets; _h < _j.length; _h++) {
            var bullet = _j[_h];
            if (bullet.isAlive) {
                if (bullet.x >= this.gun.leftEdgeX() &&
                    bullet.x <= this.gun.rightEdgeX() &&
                    bullet.y >= this.gun.topEdgeY() &&
                    bullet.y <= this.gun.bottomEdgeY() &&
                    bullet.direction == 1) {
                    this.gun.isAlive = false;
                    this.isGameOver = true;
                }
                if (bullet.bottomEdgeY() > this.canvas.height) {
                    bullet.isAlive = false;
                }
                if (bullet.topEdgeY() <= 0) {
                    bullet.isAlive = false;
                }
            }
        }
        for (var _k = 0, _l = this.monsters; _k < _l.length; _k++) {
            var monster = _l[_k];
            if (monster.isAlive) {
                if (monster.bottomEdgeY() >= this.gun.topEdgeY() &&
                    monster.bottomEdgeY() <= this.gun.bottomEdgeY() &&
                    monster.x >= this.gun.leftEdgeX() &&
                    monster.x <= this.gun.rightEdgeX()) {
                    this.gun.isAlive = false;
                    this.isGameOver = true;
                }
            }
        }
        if (this.gun.isAlive) {
            if (this.gun.rightEdgeX() > this.canvas.width) {
                this.gun.x = this.canvas.width - this.gun.width;
            }
            if (this.gun.leftEdgeX() < 0) {
                this.gun.x = 0;
            }
        }
    };
    TrumpInvaderGame.prototype.drawObjects = function () {
        this.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black');
        for (var _i = 0, _a = this.monsters; _i < _a.length; _i++) {
            var monster = _a[_i];
            if (monster.isAlive) {
                this.ctx.drawImage(this.monster, monster.x, monster.y);
            }
        }
        for (var _b = 0, _c = this.bullets; _b < _c.length; _b++) {
            var bullet = _c[_b];
            if (bullet.isAlive) {
                if (bullet.direction == 1) {
                    this.ctx.drawImage(this.monsterBullet, bullet.x, bullet.y);
                }
                else {
                    this.colorRect(bullet.x, bullet.y, bullet.width, bullet.height, bullet.color);
                }
            }
        }
        for (var _d = 0, _e = this.whines; _d < _e.length; _d++) {
            var whine = _e[_d];
            if (whine.isAlive) {
                this.colorText(whine.text, whine.x, whine.y, 'yellow');
                whine.ttl -= 1;
                if (whine.ttl == 0) {
                    whine.isAlive = false;
                }
            }
        }
        this.ctx.drawImage(this.gunImage, this.gun.x, this.gun.y);
        this.colorText("Trumps left: " + this.monstersLeft, this.canvas.width - 150, 25, 'white');
        if (this.isGameOver) {
            this.colorText('Oh no! You were destroyed!', this.canvas.width / 2 - 25, this.canvas.height / 2, 'red');
        }
        if (this.monstersLeft == 0) {
            this.colorText("Hooray! You win!!", this.canvas.width / 2 - 25, this.canvas.height / 2, 'green');
        }
    };
    TrumpInvaderGame.prototype.trimDeadObjects = function () {
        for (var _i = 0, _a = this.monsters; _i < _a.length; _i++) {
            var monster = _a[_i];
            if (!monster.isAlive) {
                this.monsters.splice(this.monsters.indexOf(monster), 1);
            }
        }
        for (var _b = 0, _c = this.bullets; _b < _c.length; _b++) {
            var bullet = _c[_b];
            if (!bullet.isAlive) {
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
            }
        }
    };
    TrumpInvaderGame.prototype.didBulletAndMonsterCollide = function (bullet, monster) {
        if (bullet.isAlive && monster.isAlive && bullet.direction == -1) {
            if (bullet.topEdgeY() <= monster.bottomEdgeY() &&
                bullet.topEdgeY() >= monster.topEdgeY() &&
                bullet.x >= monster.leftEdgeX() &&
                bullet.x <= monster.rightEdgeX()) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    TrumpInvaderGame.prototype.updateAll = function () {
        if (!this.isGameOver) {
            this.moveObjects();
            this.detectCollisions();
            this.makeMonstersShoot();
            this.drawObjects();
            this.trimDeadObjects();
        }
    };
    TrumpInvaderGame.prototype.handleMouseMove = function (evt) {
        var rect = this.canvas.getBoundingClientRect(), root = document.documentElement;
        if (this.gun.isAlive) {
            this.gun.x = evt.clientX - rect.left - root.scrollTop + 15;
        }
    };
    TrumpInvaderGame.prototype.handleMouseClick = function (evt) {
        if (this.canShoot == true) {
            this.canShoot = false;
            setTimeout(function () { this.canShoot = true; }.bind(this), 500);
            this.bullets.push(new Bullet(this.canvas, this.gun.x + 15, this.canvas.height - 33, -1, 'green'));
        }
    };
    TrumpInvaderGame.prototype.start = function () {
        setInterval(this.updateAll.bind(this), 1000 / 30);
    };
    TrumpInvaderGame.prototype.colorRect = function (leftX, topY, width, height, drawColor) {
        this.ctx.fillStyle = drawColor;
        this.ctx.fillRect(leftX, topY, width, height);
    };
    TrumpInvaderGame.prototype.colorText = function (showWords, textX, textY, fillColor) {
        this.ctx.fillStyle = fillColor;
        this.ctx.font = "20px Helvetica Neue";
        this.ctx.fillText(showWords, textX, textY);
    };
    return TrumpInvaderGame;
}());
var Coord = (function () {
    function Coord() {
    }
    return Coord;
}());
var MovingObject = (function () {
    function MovingObject(canvas, x, y) {
        this.isAlive = true;
        this.height = 40;
        this.width = 40;
        this.speed = 1;
        this.direction = 1;
        this.x = 0;
        this.y = 0;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
    }
    MovingObject.prototype.move = function () {
        this.x += this.speed * this.direction;
    };
    MovingObject.prototype.topLeft = function () {
        return {
            x: this.x,
            y: this.y
        };
    };
    MovingObject.prototype.topRight = function () {
        return {
            x: this.x + this.width,
            y: this.y + this.width
        };
    };
    MovingObject.prototype.bottomLeft = function () {
        return {
            x: this.x + this.height,
            y: this.y + this.height
        };
    };
    MovingObject.prototype.bottomRight = function () {
        return {
            x: this.x + this.height,
            y: this.y + this.width
        };
    };
    MovingObject.prototype.topEdgeY = function () {
        return this.y;
    };
    MovingObject.prototype.leftEdgeX = function () {
        return this.x;
    };
    MovingObject.prototype.rightEdgeX = function () {
        return this.x + this.width;
    };
    MovingObject.prototype.bottomEdgeY = function () {
        return this.y + this.height;
    };
    return MovingObject;
}());
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.height = 40;
        _this.width = 40;
        _this.speed = 1;
        _this.direction = 1;
        return _this;
    }
    Monster.prototype.move = function () {
        this.x += this.speed * this.direction;
    };
    return Monster;
}(MovingObject));
var Gun = (function (_super) {
    __extends(Gun, _super);
    function Gun() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 26;
        _this.height = 60;
        return _this;
    }
    return Gun;
}(MovingObject));
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(canvas, x, y, direction, color) {
        var _this = _super.call(this, canvas, x, y) || this;
        _this.width = 4;
        _this.height = 10;
        _this.direction = -1;
        _this.speed = 6;
        _this.canvas = canvas;
        _this.x = x;
        _this.y = y;
        _this.direction = direction;
        _this.color = color;
        return _this;
    }
    Bullet.prototype.move = function () {
        this.y += this.speed * this.direction;
        if (this.y > this.canvas.height && this.direction == 1 ||
            this.y <= 0 && this.direction == -1) {
            this.isAlive = false;
        }
    };
    return Bullet;
}(MovingObject));
var Whine = (function () {
    function Whine(x, y, ttl) {
        this.whineText = ['Sad!', 'So unfair!', 'Fake news!', 'Covfefe!', 'Loser!', 'Unbelievable!', 'Disaster!'];
        this.isAlive = true;
        this.text = this.whineText[Math.floor(Math.random() * 7)];
        this.x = x;
        this.y = y;
        this.ttl = ttl;
    }
    return Whine;
}());
function exec() {
    var canv = document.createElement("canvas");
    canv.width = 800;
    canv.height = 600;
    document.body.appendChild(canv);
    var ctx = canv.getContext("2d");
    var game = new TrumpInvaderGame(canv, ctx);
    game.start();
}
exec();
//# sourceMappingURL=main.js.map