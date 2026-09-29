const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");   
const score1 = document.getElementById("score");
const state1 = document.getElementById("state");
const best1 = document.getElementById("snake-best");

//define area
const CELL = 24;
const COLS = canvas.width/CELL; // 480 / 24 = 20
const ROWS = canvas.height/CELL;
const TICKS_MS = 110; // Cobra se mova a uma celula a cada 110 ms

//estados
const STATES = {
    READY: "PRONTO",
    PLAYING: "JOGANDO",
    PAUSED: "PAUSE",
    OVER: "GAME OVER"
};

// x, y - Posicionar o objeto
// w, h - Definir tamanho do personagem
// vx - Define velocidade horizontal

//personagem e onde estara/dimensoes:
//const player = {x: 40, y: 160, w: 32, h: 32, vx: 120, vy: 120}

let state = STATES.READY;
let snake = []
let dir = {x: 1, y: 0} // dir inicial
let nextDir = {x: 1, y: 0} //prox direcao
let food = {x: 10, y: 10} //posicao comida 
let score = 0;
let acc = 0 // acumulador de tempo
let last = 0; //Guarda do tempo do frame anterior:
let best = localStorage.getItem("snake-best") || 0;

function reset(){
    const midX = Math.floor(COLS/2);
    const midY = Math.floor(ROWS/2);

    snake = [
        {x: midX, y: midY},
        {x: midX - 1, y: midY},
        {x: midX - 2, y: midY}
    ];

    dir = {x: 1, y: 0};
    nextDir = {x: 1, y: 0};
    score = 0;
    score1 = textContent = score;
    state = STATES.READY;
    state1 = textContent = state;
}

function spawnApple(){

    do {
        food = {  //spawn random
            x: Math.floor(Math.random() * COLS),
            y: Math.florr(Math.random() * ROWS),
        };
    } while (snake.some((s) => s.x === food.x && s.y === food.y)); 
    //Função some() vai retornar 'TRUE' se algum segmento da snake ocupar determinado ponto
}

function setDirection(x, y){
    if(dir.x + x === 0 && dir.y + y === 0)
        return;
    nextDir= {x, y}
}

//monitora teclas e diz oq fazem
window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if(key === "arrowup" || key =="w")
        setDirection(0, -1);
    if(key === "arrowdown" || key =="s")
        setDirection(0, 1);
    if(key === "arrowleft" || key =="a")
        setDirection(-1, 0);
    if(key === "arrowright" || key =="d")
        setDirection(1, 0);
    if(key === "r")
        reset();
    if(key === " "){
        //Altera PLAYING - PAUSEd e tambem sai de READY
    }
});


//funcao que atualiza frames, a posição do jogador
function update(dt){ 
    //dt é o tempo que passou entre um quadro e outro, 
    //fazendo que o movimento do jogo aconteça baseado no tempo e não na quantidade de frames
    // se fosse por frames andaria mais rapido em um pc que faz mais frames por segundo (fps)
    player.x += player.vx * dt; 
    //Bater na parede esquerda ou direita = Inverter o sinal do vx
    player.y += player.vy * dt; //Bater na parede cima ou debaixo = Inverter o sinal do vy
    if (player.x < 0 || player.x + player.w > canvas.width){ // || = ou
        player.vx *= -1;
        } // * -1 = inverter sinal
        if (player.y < 0 || player.y + player.h > canvas.height){
        player.vy *= -1;
        }
}

//Função desenha o personagem, recriando ele a cada movimento 
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zera valores quando é redesenhado
    ctx.fillStyle = "#4ade80"; //cor personagem
    //ctx.fillRect(player.x, player.y, player.h, player.w); //passa as formas definidas antes RETANGULO
    
    // ctx.fillStyle = "#fff";
    //ctx.fillRect(player.x, player.y, player.h, player.w);  NA COR BRANCA

    ctx.beginPath(); //começa uma nova forma
    ctx.arc(player.x + player.w /2, player.y + player.h /2, player.w /2, 0, Math.PI * 2); // ctx.arc(x, y, raio, inicio, fim) ele faz o circulo 
    // x = onde fica o centro do circulo na horizontal, player.x = começo do jogador e player.w / 2 = metade da largura, 16px depois do inicio(x)
    // y = onde fica o centro do circulo na vertical, player.y = começo do jogador e player.h / 2 = metade da largura, 16px depois do inicio(y)
    // raio = distancia entre centro e a borda
    // inicio = 0 pois comeca no angulo 0
    // fim = Math.PI * 2 pois 180 graus = pi, pi * 2 = 360 graus
    ctx.fill();

    ctx.fillText("O DeltaTime - dt independe da taxa de quadros", 12, 20); //texto dentro do quadro

}

//funcao de loop, taxa de atualizacao, ts= taxa segundos
function loop(ts){
    if(!last) last = ts; // ! = validacao, negação logica
    const dt = Math.min(0.05, (ts - last)/1000); //1000ms = 1seg. mathmin = pega o menor valor dos numeros, compara 0,05 com (ts - last) / 1000
    last = ts;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop); // de fora executa o primeiro disparo do personagem

// Eu uso dt porque ele faz o movimento depender do tempo,
// deixando a velocidade independente da taxa de quadros
