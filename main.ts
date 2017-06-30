
class TrumpInvaderGame {

    private monster: HTMLImageElement = document.createElement("img");
    private monsterBullet: HTMLImageElement = document.createElement("img");
    private gunImage: HTMLImageElement = document.createElement("img");
    private isGameOver: boolean = false;
    private canShoot: boolean = true;
    private monstersLeft: number = 0;
    private gun:Gun;
    private monsters: Monster[] = [];
    private bullets: Bullet[] = [];
    private whines: Whine[] = [];

    constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D ){
        this.setup();
        this.drawObjects();
    }

    setup(): void {
        this.gun = new Gun( this.canvas, this.canvas.width/2, this.canvas.height - 60 );
        
        for ( let column = 0; column < 15; column++ ){
            for( let row = 0; row < 4; row++ ){
                this.monsters.push( new Monster(this.canvas, column * 41 , row * 50 + 30 ) );
                this.monstersLeft++;
            }
        }

        this.monster.src = 'trump.png';
        this.monsterBullet.src = 'twitter.png';
        this.gunImage.src = 'statue-of-liberty.png';

        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('click', this.handleMouseClick.bind(this));

    }

    moveObjects(): void {
        for( let monster of this.monsters ){
            monster.move();
        }

        for( let bullet of this.bullets ){
            bullet.move();
        }
    }

    makeMonstersShoot(){
        for( let monster of this.monsters ){
            if( monster.isAlive ){
                const diceRoll = Math.random();
                if( diceRoll <= 0.005){
                    this.bullets.push( new Bullet(this.canvas, monster.x + 20, monster.y + 50, 1, 'orange'));
                }
            }
        }
    }

    detectCollisions(): void {

        // detect collision with canvas wall
        let flipMonsters: boolean = false;
        for( let monster of this.monsters ){
            if( monster.isAlive ){
                if( (monster.rightEdgeX() >= this.canvas.width && monster.direction == 1 ) || 
                    (monster.leftEdgeX() <= 0 && monster.direction == -1 ) 
                    ){
                        flipMonsters = true;
                        break;
                    }
            }
        }
        if( flipMonsters ){
            for( let monster of this.monsters ){
                monster.direction *= -1;
                monster.y += 20;
                monster.speed += 0.2;
            }
        }

        // detect monster collisions with bullets
        for( let monster of this.monsters ){
            for( let bullet of this.bullets ){

                if( this.didBulletAndMonsterCollide( bullet, monster ) ){
                    monster.isAlive = false;
                    bullet.isAlive = false;
                    this.whines.push( new Whine(monster.x, monster.y - 10, 3000/30));
                    this.monstersLeft--;
                }

            }
        }

        // detect bullet collisions with the gun
        for( let bullet of this.bullets ){
            if( bullet.isAlive ){
                // did bullet collide with gun?
                if( bullet.x >= this.gun.leftEdgeX()  && 
                    bullet.x <= this.gun.rightEdgeX() && 
                    bullet.y >= this.gun.topEdgeY() && 
                    bullet.y <= this.gun.bottomEdgeY() &&
                    bullet.direction == 1
                ){
                    this.gun.isAlive = false;
                    this.isGameOver = true;
                }

                // did bullet go off the bottom edge of the screen?
                if( bullet.bottomEdgeY() > this.canvas.height ){
                    bullet.isAlive = false;
                }

               // top of the screen
               if( bullet.topEdgeY() <= 0 ){
                    bullet.isAlive = false;
                }

            }
        }

        // detect monster collisions with the gun
        for( let monster of this.monsters ){
            if( monster.isAlive ){
                if( monster.bottomEdgeY() >= this.gun.topEdgeY() &&
                    monster.bottomEdgeY() <= this.gun.bottomEdgeY() &&
                    monster.x >= this.gun.leftEdgeX() && 
                    monster.x <= this.gun.rightEdgeX() ){
                        this.gun.isAlive = false;
                        this.isGameOver = true;
                    }  
            }
        }

        // detect gun at edge of canvas
        if ( this.gun.isAlive ){
            if ( this.gun.rightEdgeX() > this.canvas.width ){
                this.gun.x = this.canvas.width - this.gun.width;
            }

            if( this.gun.leftEdgeX() < 0 ){
                this.gun.x = 0;
            }
        }
    }

    drawObjects(): void {
        this.colorRect( 0, 0, this.canvas.width, this.canvas.height, 'black');

        for( let monster of this.monsters ){
            if( monster.isAlive){
                this.ctx.drawImage(this.monster, monster.x, monster.y);
            }
        }

        for( let bullet of this.bullets ){
            if( bullet.isAlive){
                if( bullet.direction == 1){  // monster bullet
                    this.ctx.drawImage( this.monsterBullet, bullet.x, bullet.y);
                } else {
                    this.colorRect( bullet.x, bullet.y, bullet.width, bullet.height, bullet.color);
                }
            }
        }

        for( let whine of this.whines ){
            if( whine.isAlive ){
                this.colorText( whine.text, whine.x, whine.y, 'yellow');
                whine.ttl -= 1;
                if ( whine.ttl == 0){
                    whine.isAlive = false;
                }
            }
        }

        this.ctx.drawImage(this.gunImage, this.gun.x, this.gun.y);

        this.colorText("Trumps left: " + this.monstersLeft, this.canvas.width - 150, 25, 'white');

        if( this.isGameOver ){
            this.colorText('Oh no! You were destroyed!', this.canvas.width/2 - 25, this.canvas.height/2, 'red');
        }

        if( this.monstersLeft == 0){
            this.colorText("Hooray! You win!!", this.canvas.width/2 - 25, this.canvas.height/2, 'green');
        }
    }

    trimDeadObjects(): void {

        for( let monster of this.monsters ){
            if( !monster.isAlive ){
                this.monsters.splice( this.monsters.indexOf(monster), 1);
            }
        }

        for( let bullet of this.bullets ){
             if( !bullet.isAlive ){
                this.bullets.splice( this.bullets.indexOf(bullet), 1);
            }
        }

    }

    didBulletAndMonsterCollide( bullet: Bullet, monster: Monster ): boolean {

        if ( bullet.isAlive && monster.isAlive && bullet.direction == -1 ){

            if( bullet.topEdgeY() <= monster.bottomEdgeY() &&  
                bullet.topEdgeY() >= monster.topEdgeY() &&
                bullet.x          >= monster.leftEdgeX() && 
                bullet.x          <= monster.rightEdgeX() )
                {
                    return true;
                } else {
                    return false;
                }
        } else {
            return false;
        } 
    }

    updateAll(): void {
        if( !this.isGameOver ){
            this.moveObjects();
            this.detectCollisions();
            this.makeMonstersShoot();
            this.drawObjects();
            this.trimDeadObjects();
        }
    }

    handleMouseMove( evt: MouseEvent){

        let rect = this.canvas.getBoundingClientRect(),
            root = document.documentElement;
        
        if ( this.gun.isAlive ){
            this.gun.x = evt.clientX - rect.left - root.scrollTop + 15;
        }

    }

    handleMouseClick( evt: MouseEvent){
        if( this.canShoot == true){
            this.canShoot = false;
            setTimeout( function(){ this.canShoot = true;}.bind(this), 500)
            this.bullets.push( new Bullet(this.canvas, this.gun.x + 15, this.canvas.height - 33, -1, 'green'));
        }
    }

    start(): void{
        setInterval( this.updateAll.bind(this), 1000/30);
    }

    colorRect( leftX: number, topY: number, width: number, height: number, drawColor: string): void{
        this.ctx.fillStyle = drawColor;
        this.ctx.fillRect(leftX, topY, width, height);
    } 

    colorText( showWords: string, textX: number, textY: number, fillColor: string ){
        this.ctx.fillStyle = fillColor;
        this.ctx.font = "20px Helvetica Neue";
        this.ctx.fillText( showWords, textX, textY);
    }
}

interface Moveable {
    isAlive: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    move():void;
}

class Coord {
    x: number; 
    y: number;
}

abstract class MovingObject {

    constructor( canvas: HTMLCanvasElement, x: number, y: number ){
        this.canvas = canvas;
        this.x = x;
        this.y = y;
    }

    canvas: HTMLCanvasElement;
    isAlive: boolean = true;
    height: number = 40;
    width: number = 40;
    speed: number = 1;
    direction: number = 1;
    x: number = 0;
    y: number = 0;

    move(){
        this.x += this.speed * this.direction;
    }

    topLeft(): Coord {
        return {
                x: this.x, 
                y: this.y
            };
    }
    topRight(): Coord {
        return {
                x: this.x + this.width, 
                y: this.y + this.width
            }
    }
    bottomLeft(): Coord {
        return {
            x: this.x + this.height,
            y: this.y + this.height
        }
    }
    bottomRight(): Coord { 
        return {
            x: this.x + this.height,
            y: this.y + this.width
        }
    }

    topEdgeY(){
        return this.y;
    }
    leftEdgeX(){
        return this.x;
    }
    rightEdgeX(){
        return this.x + this.width;
    }
    bottomEdgeY(){
        return this.y + this.height;
    }


}

class Monster extends MovingObject {

    height: number = 40;
    width: number = 40;
    speed: number = 1;
    direction: number = 1;

    move(){
        this.x += this.speed * this.direction;
    }

}

class Gun extends MovingObject {

    width: number = 26;
    height: number = 60;
    
}

class Bullet extends MovingObject {

    constructor( canvas: HTMLCanvasElement, x: number, y: number, direction: number, color: string){
        super(canvas, x, y);
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
    }

    width: number = 4;
    height: number = 10;
    direction: number = -1;
    speed: number = 6;
    color: string;
    move(){
        this.y += this.speed * this.direction;

        if( this.y > this.canvas.height && this.direction == 1 || 
            this.y <= 0 && this.direction == -1 ){
                this.isAlive = false;
        }
    }

}

class Whine {

    private whineText = ['Sad!', 'So unfair!', 'Fake news!', 'Covfefe!', 'Loser!', 'Unbelievable!', 'Disaster!'];

    constructor( x: number, y: number, ttl: number){
        this.text = this.whineText[ Math.floor(Math.random() * 7 )];
        this.x = x;
        this.y = y;
        this.ttl = ttl;
    }

    text: string;
    x: number;
    y: number;
    ttl: number;
    isAlive: boolean = true;

}

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