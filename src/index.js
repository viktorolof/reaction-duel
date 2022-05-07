const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const timerMin = 2000;
const timerMax = 10000;
const fakeoutProb = 30; //Percent Chance of duel timer being a fakeout timer

let timeToTackle = false;
var duelActive = false;
var intro = false;
var duelStartTime = 0;
var duelResponseTime = 0;

var fakeOut = false;
var drawFakeOutPrompt = false;
var realDuel = false;

let tackleTimerMillis = 0; 
let intermission = false;

var playerOneWins = 0;
var playerTwoWins = 0;
var lastPlayerWon;

const mumenIdle = new Image()
const mumenIdleFlipped = new Image()
const duelPromptImage = new Image()
const fakeOutPromptImage = new Image()

mumenIdle.src = '../images/characters/mumen_rider/mumen_biking_nogap.png'
mumenIdleFlipped.src = '../images/characters/mumen_rider/mumen_idle_flipped.png'
duelPromptImage.src = '../images/exclamation4.png'

const playerOne = new drawable({cropStart: {x : 0, y : 0}, image: mumenIdle, numSprites: 8, canvasPosition: {x: 130, y: 210}})
const playerTwo = new drawable({cropStart: {x : 0, y : 0}, image: mumenIdleFlipped, numSprites: 4, canvasPosition: {x:470, y:200}})
const duelPrompt = new drawable({cropStart:{x:0, y:0}, image: duelPromptImage, numSprites: 1, canvasPosition: {x: canvas.width, y: canvas.height / 2}})
const fakeOutPrompt = new drawable({cropStart:{x: 0, y: 0}, image: fakeOutPromptImage, numSprites: 1, canvasPosition:{x: canvas.width, y: canvas.height / 2}})
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
    drawables.forEach((i) => {
        i.draw()
        i.nextIdle(60)
    });

    if(timeToTackle){
        duelPrompt.draw();
    }

    if(drawFakeOutPrompt){
        fakeOutPrompt.draw();
    }
    //context.drawImage(mumenIdle, 0, 0)
    // draw characters, timer, starting guide etc 
}

function drawIntroText(){
    context.fillStyle = "white";
    context.font = "20px Helvetica, Arial, sans-serif";
    context.fillText("PRESS [SPACEBAR] TO START", canvas.width/3.5, canvas.height - 10);
}

function doIntermission(){
    let x = duelResponseTime - duelStartTime;
    
    if(realDuel && timeToTackle){
        context.fillText("PLAYER " + lastPlayerWon + " WINS!",canvas.width/3.5, canvas.height - 90);
        context.fillText("JUSTICE REACTION SPEED: " + x + " MS!" , canvas.width/3.5, canvas.height - 50);
    }else if (fakeOut || !timeToTackle){
        context.fillText("PLAYER " + lastPlayerWon + " WINS!",canvas.width/3.5, canvas.height - 90);
        context.fillText("THAT WAS EMBARRASING FOR PLAYER " + ((lastPlayerWon % 2) + 1) , canvas.width/3.5, canvas.height - 50);
        clearTimeout(duel);
    }
    context.fillText("PRESS [SPACEBAR] TO START", canvas.width/3.5, canvas.height - 10);

    // reset values
    fakeOut = false;
    realDuel = false;
    duelActive = false;
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
            if(intro || intermission){
                intro = false;
                intermission = false;
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
    if(!intermission){
        if(!duelActive){
            startNewDuelTimer();
        }
        drawCanvas();
        window.requestAnimationFrame(gameloop);
    }
    drawScore();
}

function intermissionLoop(){
    intermission = true;
    context.drawImage(darkenedbackgroundImage, 0, 0);
    doIntermission();
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
    duelActive = true;
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
}

function playerWins(player){
    if(player === 1){
        playerOneWins += 1;
        lastPlayerWon = 1;
    }else if (player === 2){
        playerTwoWins += 1;
        lastPlayerWon = 2;
    }
}

function playerLoses(player){
    // Kill the timer
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
    if(duelActive){
        duelResponseTime = new Date().getTime();
        if(timeToTackle){
            playerWins(player)
        } else{
            playerLoses(player)
        }
        
        intermission = true;
        intermissionLoop();
    }
}

function listenForKeys(){
    //Listen for key events
    window.addEventListener('keydown', (e) => { 
        switch (e.key){
            case 's':
                resolvePlayerInput(1);
                break
            case 'l':
                resolvePlayerInput(2);
                break
            default:
                break
        }
    })
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