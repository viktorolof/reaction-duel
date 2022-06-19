/*---------------- Variable declarations ------------------*/
var timeToTackle = false;
var activeTimer = false;
var intro = false;
var promptPopupTime = 0;
var duelResponseTime = 0;
var pauseStart = 0;

var fakeOut = false;
var drawFakeOutPrompt = false;
var realDuel = false;
var pauseActive = false;

var tackleTimerMillis = 0; 

var playerOneWins = 0;
var playerTwoWins = 0;
var lastPlayerWon;

var duel; //reference to duel timer
var removeFakeoutTimer //reference to timer that removes fakeout prompt
/*--------------------------------------------------------*/

/*---------------- Function declarations ------------------*/
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
   
    if(pauseActive && Date.now() > pauseStart + 1500){
        // if the kamehameha animations are finished draw pausetext
        let str = calculatePauseText((Date.now() - pauseStart))
        drawPauseText(str)
    }
}

function calculatePauseText(x) {
    if(x <= 2500) {
        return "NEXT ROUND IN 3"
    } else if(x > 2500 && x <= 3500) {
        return"NEXT ROUND IN 2"
    } else if(x > 3500 && x <= 4500) {
        return "NEXT ROUND IN 1"
    } else if(x > 4500) {
        return "GO!"
    } 
}

function drawPauseText(str) {

    context.font = "50px Comic Sans MS";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText(str, canvas.width/2, canvas.height/2 - 50);

    //Print response time in case of real duel or silly message if someone lost to fakeout
    if(realDuel){
        const reactionTime = duelResponseTime - promptPopupTime;
        context.fillText("Response time " + reactionTime + "ms", canvas.width/2, (canvas.height/2) - 100);
    }else{
        context.fillText("Player " + ((lastPlayerWon % 2) + 1) + " needs to chill", canvas.width/2, (canvas.height/2) - 100);
    }
    
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
    promptPopupTime = 0;
    duelResponseTime = 0;
}

function introLoop() {
    intro = true;
    context.drawImage(darkenedbackgroundImage, 0, 0);
    document.addEventListener('keydown', (e) => {
        if(e.key === " "){
            if(intro){
                intro = false;
                drawPauseText("") // Really weird but if we dont draw this empty pause text the score gets off centered
                gameloop();         // untilthe first round is over
            }
        }
    })
}

function drawScore(){
    context.fillStyle = "white";
    context.font = "90px Comic Sans MS";
    context.fillText(playerOneWins, canvas.width - 1060 , 355);
    context.fillText(playerTwoWins, canvas.width - 115, 355);
}

function gameloop() {
    if(!pauseActive){
        if(!activeTimer){
            startNewDuelTimer();
        }
    }else{
        if( Date.now() > pauseStart + pauseTime){
            pauseActive = false; 
            resetValues();
        }
        
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

function removeFakeoutPrompt(){
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
            timeToTackle = false; //Force prompt to disapprear to free up screen space for end of round text
        } else{
            playerLoses(player)
            removeFakeoutPrompt();
            clearTimeout(removeFakeoutTimer); //Remove fakeout promt to free up screen space;
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
    promptPopupTime = new Date().getTime();
    timeToTackle = true;
}

function drawFakeoutPrompt(){
    //Fake prompt, removes itself after a set period of time
    drawFakeOutPrompt = true;
    removeFakeoutTimer = setTimeout(removeFakeoutPrompt, 3000);
}
/*------------- End of function declarations -----------------------*/


// Starts the program when background image is loaded
darkenedbackgroundImage.onload = () => {
    introLoop();
} 
listenForKeys();