const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const timerMin = 5000;
const timerMax = 5000;
const pauseTime = 5000;
const fakeoutProb = 25; //Percent Chance of duel timer being a fakeout timer

let timeToTackle = false;
var activeTimer = false;
var intro = false;
var duelStartTime = 0;
var duelResponseTime = 0;
var pauseStart = 0;

var fakeOut = false;
var drawFakeOutPrompt = false;
var realDuel = false;
var pauseActive = false;

let tackleTimerMillis = 0; 

var playerOneWins = 0;
var playerTwoWins = 0;
var lastPlayerWon;

const gokuIdle = new Image()
const gokuIdleFlipped = new Image()
const gokuCharge = new Image()
const gokuChargeFlipped = new Image()
const gokuKame = new Image()
const gokuKameFlipped = new Image()

const duelPromptImage = new Image()
const fakeOutPromptImage = new Image()

gokuIdle.src = '../images/characters/Goku/Goku-idle-3.png'
gokuIdleFlipped.src = '../images/characters/Goku/Goku-idle-3-flipped.png'
gokuCharge.src = '../images/characters/Goku/Goku-charge.png'
gokuKame.src = '../images/characters/Goku/Goku-kamehameha.png'
gokuChargeFlipped.src = '../images/characters/Goku/Goku-charge-flipped.png'
gokuKameFlipped.src = '../images/characters/Goku/Goku-kamehameha-flipped.png'


duelPromptImage.src = '../images/exclamation4.png'

const playerOneIdle = new drawable({cropStart: {x : 0, y : 0}, image: gokuIdle, numSprites: 4, canvasPosition: {x: 320, y: 400}, scalingConstant: 1})
const playerTwoIdle = new drawable({cropStart: {x : 0, y : 0}, image: gokuIdleFlipped, numSprites: 4, canvasPosition: {x:730, y:400} , scalingConstant: 1})
const playerOneCharge= new drawable({cropStart: {x : 0, y : 0}, image: gokuCharge, numSprites: 1, canvasPosition: {x: 320, y: 400}, scalingConstant: 1})
const playerOneKame = new drawable({cropStart: {x : 0, y : 0}, image: gokuKame, numSprites: 1, canvasPosition: {x: 320, y: 400}, scalingConstant: 1})

const playerTwoCharge = new drawable({cropStart: {x : 0, y : 0}, image: gokuChargeFlipped, numSprites: 1, canvasPosition: {x:730, y:400} , scalingConstant: 1})
const playerTwoKame = new drawable({cropStart: {x : 0, y : 0}, image: gokuKameFlipped, numSprites: 1, canvasPosition: {x:400, y:400} , scalingConstant: 1})

const duelPrompt = new drawable({cropStart:{x:0, y:0}, image: duelPromptImage, numSprites: 1, canvasPosition: {x: 535, y: 240}, scalingConstant: 1.5})
const fakeOutPrompt = new drawable({cropStart:{x: 0, y: 0}, image: fakeOutPromptImage, numSprites: 1, canvasPosition:{x: 535, y: 230}, scalingConstant: 1.5})


let frameCounter = 0;

const playerOne = new playerSprite({idleDrawable: playerOneIdle, chargingDrawable: playerOneCharge, kameDrawable: playerOneKame});
const playerTwo= new playerSprite({idleDrawable: playerTwoIdle, chargingDrawable: playerTwoCharge, kameDrawable: playerTwoKame});


const backgroundImage = new Image();
const darkenedbackgroundImage = new Image();

darkenedbackgroundImage.src = '../images/db-background-2.png';
backgroundImage.src = '../images/db-background.png';
canvas.width = 1194;
canvas.height = 740;

var duel;

function drawCanvas() {
    context.drawImage(backgroundImage, 0, 0);
    playerOne.draw();
    playerTwo.draw();
    
    if(timeToTackle){
        duelPrompt.draw();
    }

    if(drawFakeOutPrompt){
        fakeOutPrompt.draw();
    }
    // draw characters, timer, starting guide etc 
}

function drawIntroText(){
    context.fillStyle = "white";
    context.font = "20px Helvetica, Arial, sans-serif";
    context.fillText("PRESS [SPACEBAR] TO START", canvas.width/3.5, canvas.height - 10);
}

function resetValues(){
    // reset values
    fakeOut = false;
    realDuel = false;
    activeTimer = false;
    timeToTackle = false;
    drawFakeOutPrompt = false;
    duelStartTime = 0;
    duelResponseTime = 0;
}

function introLoop() {
    intro = true;
    //draw darkened image
    //overlay instructions
    context.drawImage(darkenedbackgroundImage, 0, 0);
    //drawIntroText();
    document.addEventListener('keydown', (e) => {
        if(e.key === " "){
            if(intro){
                intro = false;
                gameloop();
            }
        }
    })
}

function drawScore(){
    context.fillStyle = "white";
    context.font = "90px Helvetica, Arial, sans-serif";
    context.fillText(playerOneWins, 115, 355);
    context.fillText(playerTwoWins, 1060, 355);
}

function gameloop() {
    if(!pauseActive){
        if(!activeTimer){
            startNewDuelTimer();
        }
    }else{
        if( Date.now() > pauseStart + pauseTime){
            pauseActive = false; 
        }
        resetValues();
    }
    drawCanvas();
    drawScore();
    window.requestAnimationFrame(gameloop);
}

function setRandomFakeoutPicture(){
    let outcome = Math.floor(Math.random() * 100);
    if(outcome <= 49){
        fakeOutPromptImage.src = '../images/mumen_face_64px.png'
    }else{
        fakeOutPromptImage.src = '../images/fruit_fakeout.png'
    }
}

function startNewDuelTimer(){
    activeTimer = true;
    timeToTackle = false;
    tackleTimerMillis = Math.floor(Math.random() * timerMax) + timerMin;

    let outcome = Math.floor(Math.random() * 100);

    if(outcome <= fakeoutProb){
        duel = setTimeout(drawFakeoutPrompt, tackleTimerMillis);
        setRandomFakeoutPicture();
        fakeOut = true;
    }else{
        duel = setTimeout(drawDuelPrompt, tackleTimerMillis);
        realDuel = true;
    }
}

function removeFakeoutPromt(){
    //Remove the fakeout prompt
    drawFakeOutPrompt = false;
    fakeOut = false;
    resetValues();
}

function playerWins(player){
    clearTimeout(duel);
    if(player === 1){
        animateKamehameha(playerOne)
        playerOneWins += 1;
        lastPlayerWon = 1;
    }else if (player === 2){
        animateKamehameha(playerTwo)
        playerTwoWins += 1;
        lastPlayerWon = 2;
    }
    // skriv ut vilken reaktionstid
    // TODO: set timeout för att rita ut nästa runda text
}

function animateKamehameha(player) {
    player.currentDrawable = 1
    setTimeout(() => {
        player.currentDrawable = 2
    }, 1000)
    setTimeout(() => {
        player.currentDrawable = 0
    }, 2000)
}

function playerLoses(player){
    clearTimeout(duel);
    if(player === 1){
        animateKamehameha(playerTwo)
        playerTwoWins += 1;
        lastPlayerWon = 2;
    }else if (player === 2){
        animateKamehameha(playerOne)
        playerOneWins += 1;
        lastPlayerWon = 1;
    }
}

function resolvePlayerInput(player){
    if(!pauseActive){
        duelResponseTime = new Date().getTime();
        if(timeToTackle){
            playerWins(player)
        } else{
            playerLoses(player)
        }

        pauseActive = true;
        pauseStart = Date.now();
    }
}

function resolvekeyPress(event){
    switch (event.key){
        case 's':
            resolvePlayerInput(1);
            break
        case 'l':
            resolvePlayerInput(2);
            break
        default:
            break
    }
}

function listenForKeys(){
    //Listen for key events
    window.addEventListener('keydown', resolvekeyPress);
}

function drawDuelPrompt(){
    duelStartTime = new Date().getTime();
    timeToTackle = true;
}

function drawFakeoutPrompt(){
    //Fake prompt, removes itself after a set period of time
    drawFakeOutPrompt = true;
    setTimeout(removeFakeoutPromt, 3000);
}

//END OF FUNCTION DECLARATIONS
darkenedbackgroundImage.onload = () => {
    introLoop();
} 
listenForKeys();