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

function construirBlocos() {
    bricks = [];

    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];
    const pontos = [50, 40, 30, 20, 10];

    // Layout autoral: pirâmide com buraco central e corredor lateral.
    // O jogador arrisca a bola no topo porque os tijolos superiores valem mais pontos,
    // mas exigem mais precisão para alcançar.

    const layout = [
        [0, 1, 2, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7]
    ];

    for (let row = 0; row < layout.length; row++) {
        for (let col of layout[row]) {
            // Corredor vertical na coluna 3, nas três primeiras fileiras
            if (col === 3 && row < 3) continue;

            bricks.push({
                x: 16 + col * 58,
                y: 40 + row * 28,
                w: 52,
                h: 20,
                color: colors[row],
                pontos: pontos[row],
                hp: (row === 0 && col === 2) ? 2 : 1,
                alive: true
            });
        }
    }
}


//Controle raquete (A, D)
window.addEventListener( "keydown", (e) => {
    teclas[e.key.toLowerCase()] = true;
    if(e.code === "Space") {
        e.preventDefault();
        running = true
        bola.launched = true
    }

    if(e.key.toLowerCase() === "r"){
    reset();
}});

window.addEventListener("keyup", (e) => {
    teclas[e.key.toLowerCase()] = false
});

//uso do mouse para controle da raquete
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    paddle.x =  e.clientX - rect.left - paddle.w / 2;
    paddle.x = Math.max(8, Math.min(canvas.width - paddle.w - 8, paddle.x))
});

function resetbola(){
    bola.x = paddle.x + paddle.w / 2;
    bola.y = paddle.y - 14;
    bola.vx = 300 * (Math.random() > 0.5 ? 1 : -1);
    bola.vy = -600;
    bola.launched = false;
}
function reset(){
    score = 0;
    lives = 3;
    running = false;
    construirBlocos();
    resetbola();
}

function colidirBloco(b) {
    return (
        bola.x + bola.r > b.x &&
        bola.x - bola.r < b.x + b.w &&
        bola.y + bola.r > b.y &&
        bola.y - bola.r < b.y + b.h
    );
}

function update(dt) {
    if (teclas["arrowleft"] || teclas["a"]) paddle.x -= paddle.speed * dt;
    if (teclas["arrowright"] || teclas["d"]) paddle.x += paddle.speed * dt;
    paddle.x = Math.max(8, Math.min(canvas.width - paddle.w - 8, paddle.x));

    if (!bola.launched) {
        bola.x = paddle.x + paddle.w / 2;
        bola.y = paddle.y - 14;
        return; // não integra física ainda
    }
    if (!running) return;

    bola.x += bola.vx * dt;
    bola.y += bola.vy * dt;

    if (bola.x < bola.r || bola.x > canvas.width - bola.r) bola.vx *= -1;
    if (bola.y < bola.r) bola.vy *= -1;
    if (bola.y - bola.r > canvas.height) {
        lives -= 1;
        if (lives <= 0) {
            running = false;
            return;
        }
        resetbola();
    }

    if (
        bola.y + bola.r >= paddle.y &&
        bola.y + bola.r <= paddle.y + paddle.h &&
        bola.x > paddle.x &&
        bola.x < paddle.x + paddle.w &&
        bola.vy > 0 // só quando a bola ESTÁ DESCENDO
    ) {
        const hit = (bola.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        bola.vx = hit * 260;
        bola.vy = -Math.abs(bola.vy); // garante que sobe
    }

    ////Passo 7 — Colisão com tijolo
    for (const b of bricks) {
    if (b.alive && colidirBloco(b)) {
        b.hp--;
        if (b.hp <= 0) {
            b.alive = false;
            score += b.pontos;
        }
        bola.vy *= -1;
        break;
    }
}

    if (bricks.every((b) => !b.alive)) {
        construirBlocos();
        resetbola();
    }
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
        ctx.fillStyle = b.hp === 2 ? "#a855f7" : b.color;
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
