const canvas = document.getElementById("blocos");
const ctx = canvas.getContext("2d");


const paddle = {w: 86, h: 12, x: 197, y: 530, speed: 420};
const bola = {r: 7, x: 240, y: 500, vx: 180, vy: -240, launched: false};
const teclas = {};

//variaveis do jogo
let bricks = [];
let score = 0;
let lives = 3;
let running = false;
let last = 0;

//construir os blocos
function construirBlocos(){

    bricks = []
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 8; col++) {
            bricks.push({
                x: 16 + col*58,
                y: 40 + row*28,
                w: 52, h: 20,
                color: colors[row],
                alive: true
            });
        }
    }

//Controle raquete (A, D)
window.addEventListener( "keydown", (e) => {
    teclas = [e.key.toLowerCase()] = true;
    if(e.code === "Space") {
        e.preventDefault();
        running = true
        bola.launched = true
    }

    if(e.key.toLowerCase === "r")
    reset();
});

window.addEventListener("keyup", (e) => {
    teclas[e.key.toLowerCase()] = false
});

//uso do mouse para controle da raquete
canvas.addEventListener("movemouse", (e) => {
    const ret = canvas.getBoundingClientRect();
    paddle.x =  e.clientX - ret.left - paddle.w / 2;
    paddle.x = Math.max(8, Math.min(canvas.width - paddle.w - 8, paddle.x))
});

function resetBola(){
    bola.x = paddle.x + paddle.w / 2;
    bola.y = paddle.y - 14;
    bola.vx = 180 * (Math.random() > 0.5 ? 1 : -1);
    bola.vy = 240;
    bola.launched = false;
}
function reset(){
    score = 0;
    lives = 3;
    running = false;
    construirBlocos();
    resetBola();
}

function colidirBloco(b){
    return(
        bola.x > b.x && 
        bola.x , b.x + b.w && 
        bola.y > b.y && 
        bola.y < b.y + b.h
    );
}

function update(dt){

}

function desenhar(){
ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.beginPath();
    ctx.fillStyle = "#f8fafc";
    ctx.arc(bola.x, bola.y, bola.r, 0, Math.PI * 2);
    ctx.fill();
    bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
    });
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "16px Arial";
    ctx.fillText("Pontos " + score + "   Vidas " + lives, 16, 24);
    if (!running && lives > 0) {
        ctx.textAlign = "center";
        ctx.fillText("ESPAÇO para lançar", canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "left";
    }
    if (lives <= 0) {
        ctx.textAlign = "center";
        ctx.font = "bold 28px Arial";
        ctx.fillText(
            "GAME OVER — R reinicia",
            canvas.width / 2,
            canvas.height / 2,
        );
        ctx.textAlign = "left";
    }
}

function loop(ts){
    if(!last) last = ts;
    const dt = Math.min(0.033, (ts - last) /1000);
    last = ts;
    update(dt);
    desenhar();
    requestAnimationFrame(loop); //chamada recurssiva de function
}

reset();
requestAnimationFrame(loop);

}