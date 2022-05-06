const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const timerMin = 500;
const timerMax = 3000;
const fakeoutProb = 15; //Percent Chance of duel timer being a fakeout timer

let timeToTackle = false;
var promptActive = false;
var duelActive = false;
var intro = false;
var duelStartTime = 0;
var duelResponseTime = 0;

let tackleTimerMillis = 0; 
let intermission = false;

var playerOneWins = 0;
var playerTwoWins = 0;
var lastPlayerWon;

const mumenIdle = new Image()
const mumenIdleFlipped = new Image()
mumenIdle.src = '../images/characters/mumen_rider/mumen_idle.png'
mumenIdleFlipped.src = '../images/characters/mumen_rider/mumen_idle_flipped.png'
const playerOne = new drawable({position: {x : 0, y : 0}, image: mumenIdle, numSprites: 4})
const playerTwo = new drawable({position: {x : 300, y : 100}, image: mumenIdleFlipped, numSprites: 4})

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
    });
    //context.drawImage(mumenIdle, 0, 0)
    // draw characters, timer, starting guide etc 
}

function drawIntroText(){
    context.fillStyle = "white";
    context.font = "20px Helvetica, Arial, sans-serif";
    context.fillText("PRESS [SPACEBAR] TO START", canvas.width/3.5, canvas.height - 10);
}

function drawInterMissionText(){
    console.log(duelResponseTime);
    let x = duelResponseTime - duelStartTime;
    context.fillText("PLAYER " + lastPlayerWon + " WINS!",canvas.width/3.5, canvas.height - 90);
    context.fillText("JUSTICE REACTION SPEED: " + x + " MS!" , canvas.width/3.5, canvas.height - 50);
    context.fillText("PRESS [SPACEBAR] TO START", canvas.width/3.5, canvas.height - 10);
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
                console.log("spejs")
                intro = false;
                intermission = false;
                gameloop();
            }
        }
    })
}

function gameloop() {
    if(!intermission){
        if(!duelActive){
            startNewDuelTimer();
        }
        drawCanvas();
        window.requestAnimationFrame(gameloop);
    }
}

function intermissionLoop(){
    intermission = true;
    context.drawImage(darkenedbackgroundImage, 0, 0);
    drawInterMissionText();
}

function startNewDuelTimer(){
    duelActive = true;
    timeToTackle = false;
    tackleTimerMillis = Math.floor(Math.random() * timerMax) + timerMin;

    let outcome = Math.floor(Math.random() * 100);

    if(outcome <= fakeoutProb){
        duel = setTimeout(drawFakeoutPrompt, tackleTimerMillis);
    }else{
        duel = setTimeout(drawDuelPrompt, tackleTimerMillis);
    }
}

function removeFakeoutPromt(){
    //Remove the fakeout prompt
    promptActive = false;
    console.clear();
    startNewDuelTimer();
}

function playerWins(player){
    console.log("Player " + player + " wins!")
    if(player === 1){
        playerOneWins += 1;
        lastPlayerWon = 1;
    }else if (player === 2){
        playerTwoWins += 1;
        lastPlayerWon = 2;
    }
}

function playerLoses(player){
    console.log("Player " + player + " loses!")
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
        
        duelActive = false;
        timeToTackle = false;
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
    //This is where the duel goes off and the first player to press their key winss
    console.log("JUSTIZU TAKKURU!");
    duelStartTime = new Date().getTime();
    timeToTackle = true;
}

function drawFakeoutPrompt(){
    //Fake prompt, removes itself after a set period of time
    console.log("FAKURU PUROMPTU! ZA PLAYER PRESSING DA BATTON LOSES!");
    setTimeout(removeFakeoutPromt(), 3000);
}

//END OF FUNCTION DECLARATIONS
darkenedbackgroundImage.onload = () => {
    introLoop(1);
} 
listenForKeys();

