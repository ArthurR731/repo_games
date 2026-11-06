const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const wavesEl = document.getAnimations("wave");

const KEYS = {};

let player, bullets, enemies, score, lives, waves, last, gameOver, pause, spawnTime

window.addEventListener("keydown", (e) => {
    KEYS[e.key.toLocaleLowerCase()] = true;
    if([" ", 
        "arrowleft", 
        "arrowright", 
        "arrowup", 
        "arrowdown"].includes(e.key.toLocaleLowerCase)){
            e.preventDefault();
        }

    if(e.key.toLocaleLowerCase() === "p") pause = true;

    if(e.key.toLocaleLowerCase() === "r" && gameOver) startGame(); 
});

// Axis-Aligned Bounding Box
function aabb(a, b){
    return a.x < b.x + b.w 
        && a.x + a.w > b.x 
        && a.y < b.y + b.h 
        && a.y + a.h > b.y;
};

class Player{
    constructor(){
        this.w = 36;
        this.h = 28;
        this.x = canvas.width / 2 - 18;
        this.y = canvas.height - 56;
        this.speed = 280;
        this.cooldown = 0;
    }
    update(dt){
        
    }
}

class Bullet{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.h = 14;
        this.w = 6;
        this.speed = 420;
        this.dead = false;
    }
    update(dt){

    }
}

class Enemy{
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dead = false;
        this.h = 28;
        this.w = 28;
    }
    update(dt){
        
    }

    draw(){
        
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < 40; i++){
        ctx.fillStyle = "#c4b4b4";
        ctx.fillRect((i * 97) % canvas.width, 
        (i * 53) % canvas.height, 2,2);
    }
    player.draw();
    enemies.forEach((e) => e.draw());
    bullets.forEach((b) => b.draw());

    if(pause){
        drawOverlay("PAUSA", "Pressione P para continuar");
    }
    if(gameOver){
        drawOverlay("GAME OVER", "Pressione R para reiniciar");
    }
};


function startGame(){
    player  = new Player();
    bullets = [];
    enemies = [];
    score = 0;
    lives = 3;
    waves = 1;
    spawnTime = 0;
    pause = false;
    gameOver= false;
    last = 0;
    syncHud();
}

function update(dt){
    if(pause || gameOver) return;

    player.update(dt);
    bullets.forEach((e) => b.update(dt));
    enemies.forEach((e) => e.update(dt));
    };

function syncHud(){
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    wavesEl.textContent = waves;
    spawnWave(dt);

    bullets.forEach((b) => {
        enemies.forEach((e) =>{
            if(!b.dead && !e.dead && aabb()){
                b.dead = true;
                e.dead = true;
                score += 15;
            }
        });
    });

    enemies.forEach((e) => {
        if(!e.dead && aabb(e, player)){
            e.dead = true;
            lives -= 1;
            
            if(lives <= 0) gameOver = true;
        }
    });

    enemies = enemies.filter((e) => !e.dead);
    bullets = bullets.filter((b) => !b.dead);

    if(score > wave * 100){
        waves += 1;
    }
    syncHud();
}

function spawnWave(dt){

}

function drawOverlay(title, subtitle){

}



