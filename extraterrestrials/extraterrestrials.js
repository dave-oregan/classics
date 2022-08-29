const FPS = 60;
const PLAYER_SIZE = 90;
const GAME_LIVES = 3;
const ALIEN_SIZE = 90;
const BULLET_MAX = 50;
const BULLET_SPEED = 500;
const BULLET_DIST = 0.8;
const BULLET_BOOM_TIME = 0.1;
const TXT_SIZE = 60;
const ALIEN_SMALL_POINTS = 30;
const ALIEN_MEDIUM_POINTS = 20;
const ALIEN_LARGE_POINTS = 10;
const BONUS_POINTS = [ 50,100,150,200,250 ];
const VIS_COL = false;
const SAVE_KEY_SCORE = 'highscore_e';
const DELAY_TOP = 30;
const TXT_FADE_TIME = 3.5;

var moon = new Image();
var player_png = new Image();
var bonus_png = new Image();
var alien_s_png = new Image();
var alien_s_png_2 = new Image();
var alien_m_png = new Image();
var alien_m_png_2 = new Image();
var alien_l_png = new Image();
var alien_l_png_2 = new Image();
var playerLeft, playerRight, canShoot, player, aliens, aliens_b, text, tAplha, alien_delay, alien_right, side, offset, alien_bullets, score, hscore, lscore, fx_gun_p, fx_death_a, fx_gun_p, fx_gun_b, playMusic, replayMusic, lowDelay;

/** @type {HTMLCanvasElement} */
var can = document.getElementById('display_game');
var ctx = can.getContext('2d');

var img = new Image();
    if (document.querySelector('#display_game').height == '1080')
        img.src = 'img/play.png';
    else
        img.src = 'extraterrestrials/img/play.png';
    img.width = can.width;
    img.height = can.height;
img.onload = () => { ctx.drawImage(img,0,0,can.width,can.height); };

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function firstStart()
{
    player = new PlayerShip(can.width/2);
    player.b = [];
    aliens = [];
    aliens_b = [];
    alien_bullets = [];
    offset = 0;
    lowDelay = 0;
    side = true;
    alien_delay = DELAY_TOP;
    alien_delay_max = alien_delay;
    alien_right = true;
    playerLeft = false;
    playerRight = false;
    playMusic = true;
    canShoot = true;
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
    initImages();
    initSounds();
    loopMusic();
    window.addEventListener("keydown", (e) =>
    {
        if(["Space","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
    window.requestAnimationFrame(uFrame);
    nextLvl();
}

function initImages()
{
    if (document.querySelector('#display_game').height == '1080')
    {
        moon.src = 'img/moon.png';
        player_png.src = 'img/player.png';
        bonus_png.src = 'img/bonus.png';
        alien_s_png.src = 'img/small.png';
        alien_s_png_2.src = 'img/small2.png';
        alien_m_png.src = 'img/medium.png';
        alien_m_png_2.src = 'img/medium2.png';
        alien_l_png.src = 'img/large.png';
        alien_l_png_2.src = 'img/large2.png';
    }
    else
    {
        moon.src = 'extraterrestrials/img/moon.png';
        player_png.src = 'extraterrestrials/img/player.png';
        bonus_png.src = 'extraterrestrials/img/bonus.png';
        alien_s_png.src = 'extraterrestrials/img/small.png';
        alien_s_png_2.src = 'extraterrestrials/img/small2.png';
        alien_m_png.src = 'extraterrestrials/img/medium.png';
        alien_m_png_2.src = 'extraterrestrials/img/medium2.png';
        alien_l_png.src = 'extraterrestrials/img/large.png';
        alien_l_png_2.src = 'extraterrestrials/img/large2.png';
    }
}

function initSounds()
{
    
    if (document.querySelector('#display_game').height == '1080')
    {
        fx_gun_p = new SFX('sfx/gun_p.mp3',10,.5);
        fx_death_p = new SFX('sfx/boom_p.mp3',1,.4);
        fx_death_a = new SFX('sfx/boom_a.mp3',15,.5);
        fx_death_b = new SFX('sfx/boom_b.mp3',15,.5);
        fx_music = new SFX('sfx/cyber_music.mp3',1,.4);
    }
    else{
        fx_gun_p = new SFX('extraterrestrials/sfx/gun_p.mp3',10,.5);
        fx_death_p = new SFX('extraterrestrials/sfx/boom_p.mp3',1,.4);
        fx_death_a = new SFX('extraterrestrials/sfx/boom_a.mp3',15,.5);
        fx_death_b = new SFX('extraterrestrials/sfx/boom_b.mp3',15,.5);
        fx_music = new SFX('extraterrestrials/sfx/cyber_music.mp3',1,.4);
    }
}

function startGame()
{
    clearTimeout(replayMusic);
    fx_music.stop();
    loopMusic();
    lowDelay = 0;
    playerLeft = false;
    playerRight = false;
    player = new PlayerShip(can.width/2);
    player.b = [];
    aliens = [];
    aliens_b = [];
    alien_bullets = [];
    alien_delay = DELAY_TOP;
    alien_delay_max = alien_delay;
    side = true;
    offset = 0;
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
    nextLvl();
}

function nextLvl()
{
    alien_right = true;
    tAplha = 0.0;
    side = true;
    alien_delay = DELAY_TOP-lowDelay;
    alien_delay_max = alien_delay;
    player.b = [];
    alien_bullets = [];
    setTimeout(() => {addBonus();},Math.floor(Math.random() * 20000) + 2000);
    aliens.push(new Small(can.width*0.1,can.height*.1+offset));
    aliens.push(new Small(can.width*0.17,can.height*.1+offset));
    aliens.push(new Small(can.width*0.24,can.height*.1+offset));
    aliens.push(new Small(can.width*0.31,can.height*.1+offset));
    aliens.push(new Small(can.width*0.38,can.height*.1+offset));
    aliens.push(new Small(can.width*0.45,can.height*.1+offset));
    aliens.push(new Small(can.width*0.52,can.height*.1+offset));
    aliens.push(new Small(can.width*0.59,can.height*.1+offset));
    aliens.push(new Medium(can.width*0.1,can.height*.2+offset));
    aliens.push(new Medium(can.width*0.17,can.height*.2+offset));
    aliens.push(new Medium(can.width*0.24,can.height*.2+offset));
    aliens.push(new Medium(can.width*0.31,can.height*.2+offset));
    aliens.push(new Medium(can.width*0.38,can.height*.2+offset));
    aliens.push(new Medium(can.width*0.45,can.height*.2+offset));
    aliens.push(new Medium(can.width*0.52,can.height*.2+offset));
    aliens.push(new Medium(can.width*0.59,can.height*.2+offset));
    aliens.push(new Medium(can.width*0.1,can.height*.3+offset));
    aliens.push(new Medium(can.width*0.17,can.height*.3+offset));
    aliens.push(new Medium(can.width*0.24,can.height*.3+offset));
    aliens.push(new Medium(can.width*0.31,can.height*.3+offset));
    aliens.push(new Medium(can.width*0.38,can.height*.3+offset));
    aliens.push(new Medium(can.width*0.45,can.height*.3+offset));
    aliens.push(new Medium(can.width*0.52,can.height*.3+offset));
    aliens.push(new Medium(can.width*0.59,can.height*.3+offset));
    aliens.push(new Large(can.width*0.1,can.height*.4+offset));
    aliens.push(new Large(can.width*0.17,can.height*.4+offset));
    aliens.push(new Large(can.width*0.24,can.height*.4+offset));
    aliens.push(new Large(can.width*0.31,can.height*.4+offset));
    aliens.push(new Large(can.width*0.38,can.height*.4+offset));
    aliens.push(new Large(can.width*0.45,can.height*.4+offset));
    aliens.push(new Large(can.width*0.52,can.height*.4+offset));
    aliens.push(new Large(can.width*0.59,can.height*.4+offset));
    aliens.push(new Large(can.width*0.1,can.height*.5+offset));
    aliens.push(new Large(can.width*0.17,can.height*.5+offset));
    aliens.push(new Large(can.width*0.24,can.height*.5+offset));
    aliens.push(new Large(can.width*0.31,can.height*.5+offset));
    aliens.push(new Large(can.width*0.38,can.height*.5+offset));
    aliens.push(new Large(can.width*0.45,can.height*.5+offset));
    aliens.push(new Large(can.width*0.52,can.height*.5+offset));
    aliens.push(new Large(can.width*0.59,can.height*.5+offset));
}


function loopMusic()
{
    fx_music.play();
    replayMusic = setTimeout(() => {fx_music.stop();loopMusic();},165000);
}

class PlayerShip
{
    constructor(startPos)
    {
        this.x = startPos;
        this.y = can.height*0.89;
        this.l = GAME_LIVES;
        this.v = can.width*0.007;
        this.b = [];
        this.r = can.height/PLAYER_SIZE*5;
        this.dead = false;
        this.si = false;
        this.frq = 100;
    }
    draw()
    {
        ctx.imageSmoothingEnabled = false;
        if (!this.si || Math.floor(Date.now()/this.frq)%2) 
        {
            ctx.drawImage(player_png,this.x-((can.width/PLAYER_SIZE*6)/2),this.y,can.width/PLAYER_SIZE*6,can.height/PLAYER_SIZE*7);
        }
        if (VIS_COL)
        {
            ctx.strokeStyle = 'chartreuse';
            ctx.beginPath();
            ctx.arc(this.x,can.height*0.94,this.r,0,Math.PI*2,false);
            ctx.stroke();
        }
    }
    update()
    {
        this.draw();
        if (playerLeft && this.x>can.width*0.01+((can.width/PLAYER_SIZE*6)/2))
            this.x -= this.v;
        if (playerRight && this.x<can.width*0.99-((can.width/PLAYER_SIZE*6)/2))
            this.x += this.v;
        if (this.dead)
            this.x = can.width/2;
    }
}

class PlayerBullet
{
    constructor(x)
    {
        this.x = x;
        this.y = can.height*0.92;
        this.v = can.height*0.011;
    }
    draw()
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x,this.y,can.height/PLAYER_SIZE/1.5,0,Math.PI*2,false);
        ctx.fill();
    }
    update()
    {
        this.draw();
        this.y -= this.v;
        if (this.y<0)
            player.b.splice(player.b.indexOf(this),1);
    }
}

class AlienBullet
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.v = can.height*0.007;
    }
    draw()
    {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x,this.y,can.height/PLAYER_SIZE/1.5,0,Math.PI*2,false);
        ctx.fill();
    }
    update()
    {
        this.draw();
        this.y += this.v;
    }
}

class Small
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.r = can.height/ALIEN_SIZE*5;
        this.size = (can.height/ALIEN_SIZE*5)/2;
        this.shoottime = Math.floor(Math.random() * 500) + 150;
    }
    draw()
    {
        ctx.imageSmoothingEnabled = false;
        if (side)
            ctx.drawImage(alien_s_png,this.x-((can.width/ALIEN_SIZE*5)/2),this.y,can.width/ALIEN_SIZE*5,can.height/ALIEN_SIZE*6);
        else if (!side)
            ctx.drawImage(alien_s_png_2,this.x-((can.width/ALIEN_SIZE*5)/2),this.y,can.width/ALIEN_SIZE*5,can.height/ALIEN_SIZE*6);
        if (VIS_COL)
        {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x,this.y+this.size,this.r,0,Math.PI*2,false);
            ctx.stroke();
        }
    }
    update()
    {
        this.draw();
        if (this.shoottime <= 0)
        {
            alien_bullets.push(new AlienBullet(this.x,this.y));
            this.shoottime = Math.floor(Math.random() * 600) + 200;
        }
        this.shoottime--;
    }
}

class Medium
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.r = can.height/ALIEN_SIZE*5.5;
        this.size = (can.height/ALIEN_SIZE*5.5)/2;
        this.shoottime = Math.floor(Math.random() * 600) + 200;
    }
    draw()
    {
        ctx.imageSmoothingEnabled = false;
        if (side)
            ctx.drawImage(alien_m_png,this.x-((can.width/ALIEN_SIZE*5.5)/2),this.y,can.width/ALIEN_SIZE*5.5,can.height/ALIEN_SIZE*6.5);
        else if (!side)
            ctx.drawImage(alien_m_png_2,this.x-((can.width/ALIEN_SIZE*5.5)/2),this.y,can.width/ALIEN_SIZE*5.5,can.height/ALIEN_SIZE*6.5);
        if (VIS_COL)
        {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x,this.y+this.size,this.r,0,Math.PI*2,false);
            ctx.stroke();
        }
    }
    update()
    {
        this.draw();
        if (this.shoottime <= 0)
        {
            alien_bullets.push(new AlienBullet(this.x,this.y));
            this.shoottime = Math.floor(Math.random() * 700) + 300;
        }
        this.shoottime--;
    }
}

class Large
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.r = can.height/ALIEN_SIZE*5.5;
        this.size = (can.height/ALIEN_SIZE*6)/2;
        this.shoottime = Math.floor(Math.random() * 650) + 100;
    }
    draw()
    {
        ctx.imageSmoothingEnabled = false;
        if (side)
            ctx.drawImage(alien_l_png,this.x-((can.width/ALIEN_SIZE*6.5)/2),this.y,can.width/ALIEN_SIZE*6.5,can.height/ALIEN_SIZE*7.5);
        else if (!side)
            ctx.drawImage(alien_l_png_2,this.x-((can.width/ALIEN_SIZE*6.5)/2),this.y,can.width/ALIEN_SIZE*6.5,can.height/ALIEN_SIZE*7.5);
        if (VIS_COL)
        {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x,this.y+this.size,this.r,0,Math.PI*2,false);
            ctx.stroke();
        }
    }
    update()
    {
        this.draw();
        if (this.shoottime <= 0)
        {
            alien_bullets.push(new AlienBullet(this.x,this.y));
            this.shoottime = Math.floor(Math.random() * 800) + 400;
        }
        this.shoottime--;
    }
}

class Bonus
{
    constructor(x,y,pom)
    {
        this.x = x;
        this.y = y;
        this.r = can.height/ALIEN_SIZE*6;
        this.pom = pom
        this.v = can.width*0.003*this.pom;
        this.size = (can.height/ALIEN_SIZE*7)/2;
    }
    draw()
    {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(bonus_png,this.x-((can.width/ALIEN_SIZE*6)/2),this.y,can.width/ALIEN_SIZE*6,can.height/ALIEN_SIZE*7);
        if (VIS_COL)
        {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x,this.y+this.size/1.5,this.r,0,Math.PI*2,false);
            ctx.stroke();
        }
    }
    update()
    {
        this.draw();
        this.x += this.v;
        
        if(this.x<0-(can.width/ALIEN_SIZE*12) || this.x>can.width+(can.width/ALIEN_SIZE*12))
            aliens_b.splice(aliens_b.indexOf(this),1);
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

function addBonus()
{
    let ot = Math.floor(Math.random()*2+1);
    if (ot == 1)
        aliens_b.push(new Bonus(0-((can.width/ALIEN_SIZE*6)),can.height*0.02,1));
    else if (ot == 2)
        aliens_b.push(new Bonus(can.width+((can.width/ALIEN_SIZE*6)),can.height*0.02,-1));
}

function keyDown(/** @type {KeyBoardEvent} */ ev)
{
    try
    {
        if (!player.dead)
        {
            switch(ev.code)
            {
                case 'KeyA':
                case 'ArrowLeft':
                    playerLeft = true;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    playerRight = true;
                    break;
                case 'KeyM':
                    playMusic = !playMusic;
                    if (playMusic)
                    {
                        fx_music.streams[0].volume = 0.4;
                    }
                    else
                    {
                        fx_music.streams[0].volume = 0.0;
                    }
                    break;
                case 'Space':
                    if (canShoot)
                    {
                        player.b.push(new PlayerBullet(player.x));
                        canShoot = false;
                        setTimeout(() => {canShoot=true},200);
                        fx_gun_p.play();
                    }
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
        if (!player.dead)
        {
            switch(ev.code)
            {
                case 'KeyA':
                case 'ArrowLeft':
                    playerLeft = false;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    playerRight = false;
                    break;
            }
        }
    }
    catch (e) {}
}

function distBetween(px,py,rx,ry)
{
    return Math.sqrt(Math.pow(rx-px,2)+Math.pow(ry-py,2));
}

function uFrame()
{
    if (aliens.length > 0)
    {
        alien_delay--;
    }
    ctx.fillStyle = '#3F3C8C';
    ctx.fillRect(0,0,can.width,can.height);
    ctx.drawImage(moon,can.width*.035,can.height*0.035,can.width*.05,can.width*.05);
    for (let i=0; i<player.b.length; i++)
    {
        player.b[i].update();
    }
    if (!player.dead)
    {
        player.update();
    }
    for (let i=0; i<aliens.length; i++)
    {
        aliens[i].update();
    }
    for (let i=0; i<aliens_b.length; i++)
    {
        aliens_b[i].update();
    }
    for (let i=0; i<aliens.length; i++)
    {
        if (aliens[i].x >= can.width*0.96)
        {
            alien_right = false;
            for (let i=0; i<aliens.length; i++)
            {
                if (alien_delay == alien_delay_max-1)
                {
                    aliens[i].y += can.height*0.05;
                }
            }
            break;
        }
        if (aliens[i].x <= can.width*0.04)
        {
            alien_right = true;
            for (let i=0; i<aliens.length; i++)
            {
                if (alien_delay == alien_delay_max-1)
                {
                    aliens[i].y += can.height*0.05;
                }
            }
            break;
        }
        if (aliens[i].y >= can.height)
        {
            console.log(aliens[i].y);
            player.l = 0;
            break;
        }
    }
    for (let i=0; i<aliens.length; i++)
    {
        if (alien_delay <= 0)
        {
            if (alien_right)
            {
                aliens[i].x += can.width*0.011;
            }
            else if (!alien_right)
            {
                aliens[i].x -= can.width*0.011;
            }
        }
    }
    if (alien_delay <= 0)
    {
        if (side)
            side = false;
        else if (!side)
            side = true;
        alien_delay = alien_delay_max;
    }
    for (let i=0; i<player.b.length; i++)
    {
        for (let k=0; k<aliens.length; k++)
        {
            if(distBetween(player.b[i].x,player.b[i].y,aliens[k].x,aliens[k].y+aliens[k].size/2) <= aliens[k].r)
            {
                if (aliens[k].constructor.name == 'Large')
                {
                    alien_delay_max -= 0.6;
                    score += 10;
                }
                else if (aliens[k].constructor.name == 'Medium')
                {
                    alien_delay_max -= 0.8;
                    score += 20;
                }
                else if (aliens[k].constructor.name == 'Small')
                {
                    if (alien_delay_max > 0)
                    {
                        alien_delay_max--;
                    }
                    score += 30;
                }
                fx_death_a.play();
                aliens.splice(aliens.indexOf(aliens[k]),1);
                player.b.splice(player.b.indexOf(player.b[i]),1);
                if (aliens.length == 0)
                {
                    if (offset <= can.height/4)
                    {
                        offset += can.height*0.035;
                    }
                    else
                    {
                        if (alien_delay_max > 0)
                        {
                            lowDelay++;
                        }
                    }
                    setTimeout(nextLvl,1000);
                }
                break;
            }
        }
    }
    for (let i=0; i<player.b.length; i++)
    {
        for (let k=0; k<aliens_b.length; k++)
        {
            if(distBetween(player.b[i].x,player.b[i].y,aliens_b[k].x,aliens_b[k].y+aliens_b[k].size/2) <= aliens_b[k].r)
            {
                fx_death_b.play();
                aliens_b.splice(aliens_b.indexOf(aliens_b[k]),1);
                player.b.splice(player.b.indexOf(player.b[i]),1);
                score += Math.floor(Math.random()*(250-50+1) +50);
            }
        }
    }
    for (let i=0; i<alien_bullets.length; i++)
    {
        alien_bullets[i].update();
        if (alien_bullets[i].y > can.height)
        {
            alien_bullets.splice(alien_bullets.indexOf(alien_bullets[i]),1);
        }
        else if (distBetween(alien_bullets[i].x,alien_bullets[i].y,player.x,can.height*0.94)<player.r && can.height*.975>alien_bullets[i].y)
        {
            alien_bullets.splice(alien_bullets.indexOf(alien_bullets[i]),1);
            if (!player.si)
            {
                player.l--;
                fx_death_p.play();
                player.si = true;
                setTimeout(() => {player.si=false;},1000);
                player.x = can.width/2;
            }
        }
    }
    if (score > hscore)
    {
        hscore = score;
        localStorage.setItem(SAVE_KEY_SCORE, hscore);
    }
    if (score/1500 > 1)
    {
        player.l += Math.floor(score/1500)-lscore;
        lscore = Math.floor(score/1500);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.font = 'small-caps '+(can.width/TXT_SIZE*2)+'px tahoma';
    ctx.fillText(score,can.width*.99,can.height*.05);

    ctx.textAlign = 'left';
    ctx.font = 'small-caps '+(can.width/TXT_SIZE)+'px tahoma';
    ctx.fillText('Highscore: '+hscore,can.width*0.01,can.height*0.97);
    
    ctx.font = 'small-caps '+(can.width/TXT_SIZE*2)+'px tahoma';
    ctx.fillText('Lives: '+player.l,can.width*0.01,can.height*0.92);
    
    if(tAplha > 0)
    {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(220,20,20,'+tAplha+')';
        ctx.font = 'small-caps '+can.width/TXT_SIZE*3+'px tahoma';
        ctx.fillText(text,can.width/2,can.height*0.75);
        tAplha -= (1.0/TXT_FADE_TIME/FPS);
    }
    if (player.l == 0 && !player.dead)
    {
        gameOver();
    }
    setTimeout(() => {window.requestAnimationFrame(uFrame);},13);
}

function gameOver()
{
    player.dead = true;
    player.si = true;
    text = 'Game Over';
    tAplha = 1.0;
    player.x = can.width*2;
    setTimeout(startGame,4500);
}

