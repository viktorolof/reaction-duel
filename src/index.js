const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const timerMin = 500;
const timerMax = 3000;
const fakeoutProb = 50; //Percent Chance of duel timer being a fakeout timer

let timeToTackle = false;
let gameOver = false;
var promptActive = false;
var duelActive = false;
let tackleTimerMillis = Math.floor(Math.random() * timerMax) + timerMin; //The timer can be no longer than 10 seconds


const backgroundImage = new Image();
backgroundImage.src = '../images/street.png';
canvas.width = 624;
canvas.height = 304;

function drawCanvas() {
    context.drawImage(backgroundImage, 0, 0);
    // draw characters, timer, starting guide etc 
}

function animateIntro() {

}

function gameloop() {
    drawCanvas();
    // gör nåt mer?
    
    if(!duelActive){
        startNewDuelTimer();
    }

    window.requestAnimationFrame(gameloop);
}

function startNewDuelTimer(){
    duelActive = true;
    timeToTackle = false;
    let outcome = Math.floor(Math.random() * 100);

    if(outcome <= fakeoutProb){
        setTimeout(drawFakeoutPrompt, tackleTimerMillis);
    }else{
        console.log("Starting new duel")
        setTimeout(drawDuelPrompt, tackleTimerMillis);
    }
}

function removeFakeoutPromt(){
    //Remove the fakeout prompt
    
    promptActive = false;
}

function resolvePlayerInput(player){
    console.log("Player " + player + " pressed")
    if(!gameOver && timeToTackle){
        console.log("Player " + player + " wins!")
    }else{
        console.log("Player " + player + " loses!")
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
    timeToTackle = true;
}

function drawFakeoutPrompt(){
    //Fake prompt, removes itself after a set period of time
    console.log("FAKURU PUROMPTU! ZA PLAYER PRESSING DA BATTON LOSES!");
    setTimeout(removeFakeoutPromt(), 1000);
}

//END OF FUNCTION DECLARATIONS
animateIntro();
gameloop();
listenForKeys();
