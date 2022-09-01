const START_LIFE = 3;
const FPS = 60;
const SAVE_KEY_SCORE = 'highscore_p';

var player;

/** @type {HTMLCanvasElement} */
var can = document.getElementById('display_game');
var ctx = can.getContext('2d');

function firstStart()
{
    player = new MAN(can.width,can.height);
    setInterval(uFrame, 1000/FPS);
}

function startGame()
{
    player = new MAN(can.width/2,can.height/2);
}

function nxtLvl()
{

}

function distBetween(px,py,rx,ry)
{
    return Math.sqrt(Math.pow(rx-px,2)+Math.pow(ry-py,2));
}

function keyDown(/** @type {KeyBoardEvent} */ ev)
{
    try
    {
        switch(ev.code)
        {
            case 'ArrowUp':
            case 'KeyW':
                console.log(code);
                break;
            case 'ArrowDown':
            case 'KeyS':
                console.log(code);
                break;
            case 'ArrowLeft':
            case 'KeyA':
                console.log(code);
                break;
            case 'ArrowRight':
            case 'KeyD':
                console.log(code);
                break;
        }
    }
    catch (err) {}
}

class MAN
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.life = START_LIFE;
    }
    draw()
    {
        ctx.fillStyle = 'white';
        ctx.arc(this.x,this.y,2,0,365,false);
        ctx.fill();
        ctx.stroke();
    }
    update()
    {
        this.draw();
    }
}

class CHEFS
{
    constructor()
    {

    }
    draw()
    {

    }
    update()
    {
        this.draw();
    }
}

function uFrame()
{
    ctx.fillStyle = 'black';
    ctx.rect(0,0,can.width,can.height);
    player.update();
}