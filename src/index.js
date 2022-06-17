const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const timerMin = 5000;
const timerMax = 5000;
const pauseTime = 5000;
const fakeoutProb = 50; //Percent Chance of duel timer being a fakeout timer

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

const mumenIdle = new Image()
const mumenIdleFlipped = new Image()
const duelPromptImage = new Image()
const fakeOutPromptImage = new Image()

const playerOnePunch = new Image()
const playerTwoPunch = new Image()

const playerOneLose = new Image();
const playerTwoLose = new Image();

mumenIdle.src = '../images/characters/mumen_rider/mumen_idle.png'
mumenIdleFlipped.src = '../images/characters/mumen_rider/mumen_idle_flipped.png'
playerOnePunch.src = '../images/characters/mumen_rider/mumen_punch.png'
playerTwoPunch.src = '../images/characters/mumen_rider/mumen_punch_flipped.png' // ändra hur flippade ser ut, nu är det fel

playerOneLose.src = '../images/characters/mumen_rider/mumen_punched.png'
playerTwoLose.src = '../images/characters/mumen_rider/mumen_punched.png' // ändra till flippade versionen

duelPromptImage.src = '../images/exclamation4.png'

const playerOneIdle = new drawable({cropStart: {x : 0, y : 0}, image: mumenIdle, numSprites: 4, canvasPosition: {x: 130, y: 120}, scalingConstant: 2})
const playerTwoIdle = new drawable({cropStart: {x : 0, y : 0}, image: mumenIdleFlipped, numSprites: 4, canvasPosition: {x:410, y:135} , scalingConstant: 2})
const duelPrompt = new drawable({cropStart:{x:0, y:0}, image: duelPromptImage, numSprites: 1, canvasPosition: {x: canvas.width, y: canvas.height / 2}, scalingConstant: 1})
const fakeOutPrompt = new drawable({cropStart:{x: 0, y: 0}, image: fakeOutPromptImage, numSprites: 1, canvasPosition:{x: canvas.width, y: canvas.height / 2}, scalingConstant: 1})

const playerOnePunchDrawable = new drawable({cropStart: {x : 0, y: 0}, image: playerOnePunch, numSprites: 4, canvasPosition: {x:130, y: 120}, scalingConstant: 2})
const playerTwoPunchDrawable = new drawable({cropStart: {x : 0, y: 0}, image: playerTwoPunch, numSprites: 4, canvasPosition: {x:410, y: 135}, scalingConstant: 2})

const playerOneLoseDrawable = new drawable({cropStart: {x : 0, y: 0}, image: playerOneLose, numSprites: 7, canvasPosition: {x:130, y: 120}, scalingConstant: 2})
const playerTwoLoseDrawable = new drawable({cropStart: {x : 0, y: 0}, image: playerOneLose, numSprites: 7, canvasPosition: {x:410, y: 135}, scalingConstant: 2})

let frameCounter = 0;

const playerOne = new playerSprite({idleDrawable: playerOneIdle, punchDrawable: playerOnePunchDrawable, punchedDrawable: playerOneLoseDrawable});
const playerTwo= new playerSprite({idleDrawable: playerTwoIdle, punchDrawable: playerTwoPunchDrawable, punchedDrawable: playerTwoLoseDrawable});
let drawables = [playerOne, playerTwo]

const backgroundImage = new Image();
const darkenedbackgroundImage = new Image();

darkenedbackgroundImage.src = '../images/street-darkened.png';
backgroundImage.src = '../images/street.png';
canvas.width = 624;
canvas.height = 304;

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
    drawIntroText();
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
    context.font = "20px Helvetica, Arial, sans-serif";
    context.fillText("P1: " + playerOneWins, 15, 20);
    context.fillText("P2: " + playerTwoWins, canvas.width - 60, 20);
}

function gameloop() {

    if(!pauseActive){
        if(!activeTimer){
            startNewDuelTimer();
        }

        drawCanvas();
        drawScore();
    }else{
        //dax för en ny paus
        console.log("Pause")
        if( Date.now() > pauseStart + pauseTime){
            pauseActive = false;
            console.log("Go")
        }
        resetValues();
    }
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
    // ANIMATE player x punches player y
    clearTimeout(duel);
    if(player === 1){
        playerOne.punch();
        playerTwo.lose();
        playerOneWins += 1;
        lastPlayerWon = 1;
    }else if (player === 2){
        playerTwo.punch();
        playerOne.lose();
        playerTwoWins += 1;
        lastPlayerWon = 2;
    }
}

function playerLoses(player){
    // Kill the timer
    // ANIMATE player loses (vad ska det vara)
    clearTimeout(duel);
    if(player === 1){
        playerTwoWins += 1;
        lastPlayerWon = 2;
    }else if (player === 2){
        playerOneWins += 1;
        lastPlayerWon = 1;
    }
}

function resolvePlayerInput(player){
    if(activeTimer){
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