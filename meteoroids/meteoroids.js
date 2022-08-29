const FPS = 60;
var PLAYER_SIZE = 30;
const FRICTION = 0.65;
const TURN_SPEED = 360;
const PLAYER_THRUST = 5;
const PLAYER_DEATH_TIME = 0.4;
const PLAYER_INV_TIME = 3*(FPS/30);
const PLAYER_BIK_TIME = 0.05;
const ROCK_NUM = 4;
var ROCK_SIZE = 100;
const ROCK_SPEED = 50;
const ROCK_VT = 10;
const ROCK_ODD = 0.4;
const VIS_COL = false;
const BULLET_MAX = 50;
const BULLET_SPEED = 500;
const BULLET_DIST = 0.8;
const BULLET_BOOM_TIME = 0.1;
const MAX_HYP = 3;
const TXT_FADE_TIME = 3.5;
var TXT_SIZE = 60;
const GAME_LIVES = 5;
const RPL = 20;
const RPM = 50;
const RPS = 100;
const SAVE_KEY_SCORE = 'highscore';
const particles = [];

/** @type {HTMLCanvasElement} */
var can = document.getElementById('display_game');
var ctx = can.getContext('2d');

var lvl, rocks, player, lives, hscore, score, lscore, text, tAplha, hyp, rocksleft, rockstotal, fx_gun, fx_death, fx_boom, fx_teleport, fx_rocket, fx_music;

var img = new Image();
    if (document.querySelector('#display_game').height == '1080')
        img.src = 'img/play.png';
    else
        img.src = 'meteoroids/img/play.png';
    img.width = can.width;
    img.height = can.height;
img.onload = () => { ctx.drawImage(img,0,0,can.width,can.height); };

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function firstStart()
{
    if (document.querySelector('#display_game').height == '1080')
    {
        fx_gun = new SFX('sfx/gun.mp3',10,0.5);
        fx_death = new SFX('sfx/death.mp3',1,0.6);
        fx_boom = new SFX('sfx/boom.mp3',15,0.4);
        fx_teleport = new SFX('sfx/teleport.mp3',3,0.5);
        fx_rocket = new SFX('sfx/rocket.mp3',1,0.1);
        fx_music = new BGM('sfx/beat1.mp3','sfx/beat2.mp3');
    }
    else{
        fx_gun = new SFX('meteoroids/sfx/gun.mp3',10,0.5);
        fx_death = new SFX('meteoroids/sfx/death.mp3',1,0.6);
        fx_boom = new SFX('meteoroids/sfx/boom.mp3',15,0.4);
        fx_teleport = new SFX('meteoroids/sfx/teleport.mp3',3,0.5);
        fx_rocket = new SFX('meteoroids/sfx/rocket.mp3',1,0.1);
        fx_music = new BGM('meteoroids/sfx/beat1.mp3','meteoroids/sfx/beat2.mp3');
    }
    window.addEventListener("keydown", (e) =>
    {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
    if (document.querySelector('#display_game').height == '1080')
    {
        PLAYER_SIZE = 50;
        ROCK_SIZE = 160;
        TXT_SIZE = 75;
    }
    setInterval(uFrame, 1000/FPS);
    lives = GAME_LIVES;
    lvl = 0;
    hyp = MAX_HYP;
    fx_music.tempo = 1.0;
    var scoreString = localStorage.getItem(SAVE_KEY_SCORE);
    if (scoreString == null)
    {
        hscore = 0
    }
    else
    {
        hscore = parseInt(scoreString);
    }
    score = 0;
    lscore = 0;
    player = spawnPlayer();
    newLvl();
}

function startGame()
{
    lives = GAME_LIVES;
    lvl = 0;
    hyp = MAX_HYP;
    fx_music.tempo = 1.0;
    var scoreString = localStorage.getItem(SAVE_KEY_SCORE);
    if (scoreString == null)
    {
        hscore = 0
    }
    else
    {
        hscore = parseInt(scoreString);
    }
    score = 0;
    lscore = 0;
    player = spawnPlayer();
    newLvl();
}

function newLvl()
{
    lvl++;
    text = 'Wave '+lvl;
    tAplha = 1.0;
    rocks = [];
    createRockBelt();
    if (lvl % 5 ==0 && hyp < 3)
    {
        hyp++;
    }
}

function gameOver()
{
    player.dead = true;
    text = 'Game Over';
    tAplha = 1.0;
    fx_music.tempo = 1.0;
}

function createRockBelt() 
{
    rocks = [];
    rockstotal = (ROCK_NUM+lvl)*7;
    rocksleft = rockstotal;
    let x,y;
    for (let i=0; i<ROCK_NUM+lvl; i++)
    {
        do
        {
            x = Math.floor(Math.random()*can.width);
            y = Math.floor(Math.random()*can.height);
        } while(distBetween(player.x,player.y,x,y) < ROCK_SIZE*2+player.r)
        rocks.push(newRock(x,y, Math.ceil(ROCK_SIZE/2),lvl));
    }
}

function breakRock(rockdex)
{
    let x = rocks[rockdex].x;
    let y = rocks[rockdex].y;
    let r = rocks[rockdex].r;

    if (r == Math.ceil(ROCK_SIZE/2))
    {
        rocks.push(newRock(x,y,Math.ceil(ROCK_SIZE/4),lvl))
        rocks.push(newRock(x,y,Math.ceil(ROCK_SIZE/4),lvl))
        score += RPL;
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
    }
    else if (r == Math.ceil(ROCK_SIZE/4))
    {
        rocks.push(newRock(x,y,Math.ceil(ROCK_SIZE/8),lvl))
        rocks.push(newRock(x,y,Math.ceil(ROCK_SIZE/8),lvl))
        score += RPM;
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
    }
    else
    {
        score += RPS;
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
        particles.push(new Particle(x,y,2,{x:Math.random()-0.5,y:Math.random()-0.5}));
    }

    if (score/10000 > 1)
    {
        lives += Math.floor(score/10000)-lscore;
        lscore = Math.floor(score/10000);
    }

    if (score > hscore)
    {
        hscore = score;
        localStorage.setItem(SAVE_KEY_SCORE, hscore);
    }

    rocks.splice(rockdex,1);
    fx_boom.play();
    rocksleft--;
    fx_music.setRatio(rocksleft == 0 ? 1 : rocksleft/rockstotal);

    if (rocks.length == 0)
    {
        setTimeout(newLvl(),1000);
    }
}

function distBetween(px,py,rx,ry)
{
    return Math.sqrt(Math.pow(rx-px,2)+Math.pow(ry-py,2));
}

function playerDie()
{
    player.deathTime = Math.ceil(PLAYER_DEATH_TIME*FPS);
    fx_death.play();
}

function hyperspace()
{
    if(player.hp && hyp <= MAX_HYP && hyp > 0)
    {
        hyp--;
        player.x = Math.random()*can.width+1;
        player.y = Math.random()*can.height+1;
        fx_teleport.play();
    }
    player.hp = false;
}

function keyDown(/** @type {KeyBoardEvent} */ ev)
{
    try
    {
        if (!player.dead)
        {
            switch(ev.code)
            {
                case 'Enter':
                    hyperspace();
                    break;
                case 'Space':
                    shoot();
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    player.rt = TURN_SPEED/180*Math.PI/FPS;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                    player.thrusting = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    player.rt = -TURN_SPEED/180*Math.PI/FPS;
                    break;
            }
        }
    }
    catch (e) {}
}

function keyUp(/** @type {KeyBoardEvent} */ ev)
{
    try
    {
        switch(ev.code)
        {
            case 'Enter':
                player.hp = true;
                break;
            case 'Space':
                player.cs = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                player.rt = 0;
                break;
            case 'ArrowUp':
            case 'KeyW':
                player.thrusting = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                player.rt = 0;
                break;
        }
    }
    catch (e) {}
}

function newRock(x,y,r,lvl)
{
    var lM = Math.pow(1.45,0.25*lvl);
    var rock = {
        x: x,
        y: y,
        vx: Math.random()*lM*ROCK_SPEED/FPS*(Math.random()<0.5?1:-1),
        vy: Math.random()*lM*ROCK_SPEED/FPS*(Math.random()<0.5?1:-1),
        r: r,
        f: Math.random()*Math.PI*2,
        vt: Math.floor(Math.random()*(ROCK_VT+1)+ROCK_VT/2),
        of: []
    }
    for (var i = 0; i < rock.vt; i++) 
    {
        rock.of.push(Math.random() * ROCK_ODD * 2 + 1 - ROCK_ODD);
    }
    return rock;
}

function spawnPlayer()
{
    return {
        x: can.width/2,
        y: can.height/2,
        r: PLAYER_SIZE/2,
        f: 90/180*Math.PI,
        dead: false,
        cs: true,
        hp: true,
        bullets: [],
        deathTime: 0,
        bikNum: Math.ceil(PLAYER_INV_TIME/PLAYER_BIK_TIME),
        bikTime: Math.ceil(PLAYER_BIK_TIME*FPS),
        rt: 0,
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        }
    }
}

function shoot()
{
    if(player.cs && player.bullets.length < BULLET_MAX)
    {
        player.bullets.push({
            x: player.x+4.4/3*player.r*Math.cos(player.f),
            y: player.y-4.5/3*player.r*Math.sin(player.f),
            vx: BULLET_SPEED*Math.cos(player.f)/FPS+player.thrust.x/3,
            vy: -BULLET_SPEED*Math.sin(player.f)/FPS-player.thrust.y/3,
            dt: 0,
            et: 0
        });
        fx_gun.play();
    }
    player.cs = false;
}

function drawLives(x,y,f,c)
{
    ctx.strokeStyle = c;
    ctx.lineWidth = PLAYER_SIZE/20;
    ctx.beginPath();
    ctx.moveTo(
        x+4.4/3*player.r*Math.cos(f),
        y-4.5/3*player.r*Math.sin(f)
    );
    ctx.lineTo(
        x-player.r*(2.5/3*Math.cos(f)+Math.sin(f)),
        y+player.r*(2.5/3*Math.sin(f)-Math.cos(f))
    );
    ctx.lineTo(
        x-player.r*(2.5/3*Math.cos(f)-Math.sin(f)),
        y+player.r*(2.5/3*Math.sin(f)+Math.cos(f))
    );
    ctx.closePath();
    ctx.stroke();
}

class Particle
{
    constructor(x,y,r,v)
    {
        this.x = x;
        this.y = y;
        this.c = 'white';
        if (document.querySelector('#display_game').height == '1080')
        {
            this.r = 2*r;
            this.life = 20;
        }
        else
        {
            this.r = r;
            this.life = 15;
        }
        this.v = v;
        this.a = 1.0
        this.ox = x;
        this.oy = y;
    }
    draw() 
    {
        ctx.beginPath();
        ctx.lineWidth = PLAYER_SIZE/20;
        ctx.strokeStyle = this.c;
        ctx.arc(this.x,this.y,this.r,0,Math.PI/2,false);
        ctx.stroke();
    }
    update() 
    {
        if (this.life > 0)
        {
            this.draw();
            this.x += this.v.x*9;
            this.y += this.v.y*9;
        }
        else
        {
            particles.splice(particles.indexOf(this),1);
        }
        this.life--;
    }
}

function SFX(src,maxStreams=1,vol=1.0)
{
    this.streamNum = 0;
    this.streams = [];
    for (let i=0; i<maxStreams; i++)
    {
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;
    }
    this.play = () =>
    {
        this.streamNum = (this.streamNum+1) % maxStreams;
        this.streams[this.streamNum].play();
    }
    this.stop = () =>
    {
        this.streams[this.streamNum].pause();
        this.streams[this.streamNum].currentTime = 0;
    }
}

function BGM(src1,src2)
{
    this.soundL = new Audio(src1);
    this.soundH = new Audio(src2);
    this.low = true;
    this.tempo = 1.0;
    this.beatTime = 0;

    this.play = () =>
    {
        if (this.low)
        {
            this.soundL.play();
        }
        else
        {
            this.soundH.play();
        }
        this.low = !this.low;
    }

    this.setRatio = (ratio) =>
    {
        this.tempo = 1.0-0.75*(1.0-ratio);
    }

    this.tick = () =>
    {
        if (this.beatTime == 0)
        {
            this.play();
            this.beatTime = Math.ceil(this.tempo*FPS);
        }
        else
        {
            this.beatTime--;
        }
    }
}

function uFrame()
{
    var bikOn = player.bikNum % 2 == 0;
    var boom = player.deathTime > 0;

    fx_music.tick();

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,can.width,can.height);

    if (player.thrusting && !player.dead)
    {
        if(player.thrust.x > -10 && player.thrust.x < 10)
        {
            player.thrust.x += PLAYER_THRUST*Math.cos(player.f)/FPS;
        }
        if(player.thrust.y > -10 && player.thrust.y < 10)
        {
            player.thrust.y -= PLAYER_THRUST*Math.sin(player.f)/FPS;
        }
        fx_rocket.play();

        if(!boom && bikOn)
        {
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'black'
            ctx.lineWidth = PLAYER_SIZE / 20;
            ctx.beginPath();
            ctx.moveTo(
                player.x-player.r*(3.4/3*Math.cos(player.f)+0.5*Math.sin(player.f)),
                player.y+player.r*(3.3/3*Math.sin(player.f)-0.5*Math.cos(player.f))
            );
            ctx.lineTo(
                player.x-player.r*6.5/3*Math.cos(player.f),
                player.y+player.r*6.5/3*Math.sin(player.f)
            );
            ctx.lineTo(
                player.x-player.r*(3.4/3*Math.cos(player.f)-0.5*Math.sin(player.f)),
                player.y+player.r*(3.4/3*Math.sin(player.f)+0.5*Math.cos(player.f))
            );
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = 'black';
        }
    }
    else
    {
        player.thrust.x -= FRICTION*player.thrust.x/FPS;
        player.thrust.y -= FRICTION*player.thrust.y/FPS;
        fx_rocket.stop();
    }

    if(!boom)
    {
        if(bikOn && !player.dead)
        {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = PLAYER_SIZE/20;
            ctx.beginPath();
            ctx.moveTo(
                player.x+4.4/3*player.r*Math.cos(player.f),
                player.y-4.5/3*player.r*Math.sin(player.f)
            );
            ctx.lineTo(
                player.x-player.r*(2.5/3*Math.cos(player.f)+Math.sin(player.f)),
                player.y+player.r*(2.5/3*Math.sin(player.f)-Math.cos(player.f))
            );
            ctx.lineTo(
                player.x-player.r*(2.5/3*Math.cos(player.f)-Math.sin(player.f)),
                player.y+player.r*(2.5/3*Math.sin(player.f)+Math.cos(player.f))
            );
            ctx.closePath();
            ctx.stroke();
        }
        if(player.bikNum > 0)
        {
            player.bikTime--;
            if(player.bikTime == 0)
            {
                player.bikTime = Math.ceil(PLAYER_BIK_TIME);
                player.bikNum--;
            }
        }
    }
    else if (!player.dead)
    {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = PLAYER_SIZE/15;
        ctx.beginPath();
        ctx.moveTo(
            player.x+4.4/3*player.r*Math.cos(player.f),
            player.y-4.5/3*player.r*Math.sin(player.f)
        );
        ctx.lineTo(
            player.x-player.r*(2.5/3*Math.cos(player.f)+Math.sin(player.f)),
            player.y+player.r*(2.5/3*Math.sin(player.f)-Math.cos(player.f))
        );
        ctx.lineTo(
            player.x-player.r*(2.5/3*Math.cos(player.f)-Math.sin(player.f)),
            player.y+player.r*(2.5/3*Math.sin(player.f)+Math.cos(player.f))
        );
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = 'white';
    }
    if(VIS_COL)
    {
        ctx.strokeStyle = 'chartreuse';
        ctx.beginPath();
        ctx.arc(player.x,player.y,player.r,0,Math.PI*2,false);
        ctx.stroke();
    }

    for(let i=0; i<player.bullets.length; i++)
    {
        if(player.bullets[i].et == 0)
        {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(player.bullets[i].x,player.bullets[i].y,PLAYER_SIZE/15,0,Math.PI*2,false);
            ctx.fill();
        }
    }
    if (particles.length > 0)
        particles.forEach(particles => {particles.update()});
    ctx.fillStyle = 'black';

    var rx,ry,rr,bx,by
    for (let i=rocks.length-1; i>=0; i--)
    {
        rx = rocks[i].x;
        ry = rocks[i].y;
        rr = rocks[i].r;
        for(let k=player.bullets.length-1; k>=0; k--)
        {
            bx = player.bullets[k].x;
            by = player.bullets[k].y;
            if(player.bullets[k].et == 0 && distBetween(rx,ry,bx,by) < rr)
            {
                breakRock(i);
                player.bullets[k].et = Math.ceil(BULLET_BOOM_TIME*FPS);
                break;
            }
        }
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = PLAYER_SIZE/20;
    let f, r, x, y, of, vt;
    for (let i=0; i<rocks.length; i++)
    {
        f = rocks[i].f;
        r = rocks[i].r;
        x = rocks[i].x;
        y = rocks[i].y;
        of = rocks[i].of;
        vt = rocks[i].vt;
        ctx.beginPath();
        ctx.moveTo(
            x+r*of[0]*Math.cos(f),
            y+r*of[0]*Math.sin(f)
        );
        for (let k=0; k<vt; k++)
        {
            ctx.lineTo(
                x+r*of[k]*Math.cos(f+k*Math.PI*2/vt),
                y+r*of[k]*Math.sin(f+k*Math.PI*2/vt)
            );
        }
        ctx.closePath();
        ctx.stroke();

        if(VIS_COL)
        {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(x,y,0.9*r,0,Math.PI*2,false);
            ctx.stroke();
            ctx.strokeStyle = 'white';
        }
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.font = 'small-caps '+(TXT_SIZE-10)+'px tahoma';
    ctx.fillText(score,can.width-PLAYER_SIZE/2,PLAYER_SIZE*1.25);

    ctx.textAlign = 'left';
    ctx.font = 'small-caps '+(TXT_SIZE-35)+'px tahoma';
    ctx.fillText('Highscore: '+hscore,PLAYER_SIZE/1.9,PLAYER_SIZE*2.5);

    ctx.fillText('Hyperspace',PLAYER_SIZE/1.9,can.height-PLAYER_SIZE*3.5);
    if (hyp == 3)
    {
        ctx.beginPath();
        ctx.moveTo(PLAYER_SIZE,can.height-PLAYER_SIZE*2.5);
        ctx.lineTo(PLAYER_SIZE*3.5,can.height-PLAYER_SIZE*2.5);
        ctx.closePath();
        ctx.stroke();
    }
    else
    {
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(PLAYER_SIZE,can.height-PLAYER_SIZE*2.5);
        ctx.lineTo(PLAYER_SIZE*3.5,can.height-PLAYER_SIZE*2.5);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = 'white';
    }
    if (hyp == 2 || hyp == 3)
    {
        ctx.beginPath();
        ctx.moveTo(PLAYER_SIZE,can.height-PLAYER_SIZE*1.7);
        ctx.lineTo(PLAYER_SIZE*3.5,can.height-PLAYER_SIZE*1.7);
        ctx.closePath();
        ctx.stroke();
    }
    else
    {
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(PLAYER_SIZE,can.height-PLAYER_SIZE*1.7);
        ctx.lineTo(PLAYER_SIZE*3.5,can.height-PLAYER_SIZE*1.7);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = 'white';
    }
    if (hyp == 1 || hyp == 2 || hyp == 3)
    {
        ctx.beginPath();
        ctx.moveTo(PLAYER_SIZE,can.height-PLAYER_SIZE*0.9);
        ctx.lineTo(PLAYER_SIZE*3.5,can.height-PLAYER_SIZE*0.9);
        ctx.closePath();
        ctx.stroke();
    }
    else
    {
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(PLAYER_SIZE,can.height-PLAYER_SIZE*0.9);
        ctx.lineTo(PLAYER_SIZE*3.5,can.height-PLAYER_SIZE*0.9);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = 'white';
    }
    ctx.fillStyle = 'black';

    if(tAplha > 0)
    {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,'+tAplha+')';
        ctx.font = 'small-caps '+TXT_SIZE+'px tahoma';
        ctx.fillText(text,can.width/2,can.height*0.75);
        tAplha -= (1.0/TXT_FADE_TIME/FPS);
        ctx.fillStyle = 'black';
    }
    else if (player.dead)
    {
        startGame();
    }

    var lc;
    for (let i=0; i<lives; i++)
    {
        lc = boom && i == lives - 1 ? 'red' : 'white';
        drawLives(PLAYER_SIZE+i*PLAYER_SIZE*1.2,PLAYER_SIZE,1.5*Math.PI, lc);
    }

    if(!boom)
    {
        if (player.bikNum == 0 && !player.dead)
        {
            for(let i=0; i<rocks.length; i++)
            {
                if(distBetween(player.x,player.y,rocks[i].x,rocks[i].y) < player.r+0.9*rocks[i].r)
                {
                    playerDie();
                    breakRock(i);
                    break;
                }
            }
        }

        player.f += player.rt;

        player.x += player.thrust.x;
        player.y += player.thrust.y;
    }
    else
    {
        player.deathTime--;
        if(player.deathTime == 0)
        {
            lives--;
            if(lives <= 0)
            {
                gameOver();
            }
            else
            {
                player = spawnPlayer();
            }
        }
    }

    if(player.x < 0-player.r)
        player.x = can.width+player.r;
    else if (player.x > can.width+player.r)
        player.x = 0-player.r;

    if(player.y < 0-player.r)
        player.y = can.height+player.r;
    else if (player.y > can.height+player.r)
        player.y = 0-player.r;
    
    for(let i=player.bullets.length-1; i>=0; i--)
    {
        if(player.bullets[i].dt > BULLET_DIST*can.width)
        {
            player.bullets.splice(i,1);
            continue;
        }

        if (player.bullets[i].et > 0)
        {
            player.bullets[i].et--;
            if(player.bullets[i].et == 0)
            {
                player.bullets.splice(i,1);
                continue;
            }
        }
        else
        {
            player.bullets[i].x += player.bullets[i].vx;
            player.bullets[i].y += player.bullets[i].vy;

            player.bullets[i].dt += Math.sqrt(Math.pow(player.bullets[i].vx,2)+Math.pow(player.bullets[i].vy,2));
        }
    }

    for(let i=0; i<rocks.length; i++)
    {
        rocks[i].x += rocks[i].vx;
        rocks[i].y += rocks[i].vy;
        
        if (rocks[i].x < 0 - rocks[i].r)
            rocks[i].x = can.width + rocks[i].r;
        else if (rocks[i].x > can.width + rocks[i].r)
            rocks[i].x = 0 - rocks[i].r
        if (rocks[i].y < 0 - rocks[i].r)
            rocks[i].y = can.height + rocks[i].r;
        else if (rocks[i].y > can.height + rocks[i].r)
            rocks[i].y = 0 - rocks[i].r
    }
}