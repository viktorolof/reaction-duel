/*------------- Canvas ------------------*/
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 1194;
canvas.height = 740;
/*--------------------------------------*/


/*--------------- Timers ----------------*/
const timerMin = 4000;
const timerMax = 12000;
const pauseTime = 5000;
const fakeoutProb = 30; //Percent Chance of duel timer being a fakeout timer
/*-----------------------------------------*/


/*------------- Player sprites ------------------------*/
const gokuIdle = new Image()
const gokuIdleFlipped = new Image()
const gokuCharge = new Image()
const gokuChargeFlipped = new Image()
const gokuKame = new Image()
const gokuKameFlipped = new Image()

gokuIdle.src = '../images/characters/Goku/Goku-idle-3.png'
gokuIdleFlipped.src = '../images/characters/Goku/Goku-idle-3-flipped.png'
gokuCharge.src = '../images/characters/Goku/Goku-charge.png'
gokuKame.src = '../images/characters/Goku/Goku-kamehameha.png'
gokuChargeFlipped.src = '../images/characters/Goku/Goku-charge-flipped.png'
gokuKameFlipped.src = '../images/characters/Goku/Goku-kamehameha-flipped.png'

const playerOneIdle = new drawable({cropStart: {x : 0, y : 0}, image: gokuIdle, numSprites: 4,
                                    canvasPosition: {x: 320, y: 400}, scalingConstant: 1})
const playerTwoIdle = new drawable({cropStart: {x : 0, y : 0}, image: gokuIdleFlipped, numSprites: 4,
                                    canvasPosition: {x:730, y:400} , scalingConstant: 1})
const playerOneCharge= new drawable({cropStart: {x : 0, y : 0}, image: gokuCharge, numSprites: 1,
                                    canvasPosition: {x: 320, y: 400}, scalingConstant: 1})
const playerOneKame = new drawable({cropStart: {x : 0, y : 0}, image: gokuKame, numSprites: 1,
                                    canvasPosition: {x: 320, y: 400}, scalingConstant: 1})

const playerTwoCharge = new drawable({cropStart: {x : 0, y : 0}, image: gokuChargeFlipped, numSprites: 1,
                                    canvasPosition: {x:730, y:400} , scalingConstant: 1})
const playerTwoKame = new drawable({cropStart: {x : 0, y : 0}, image: gokuKameFlipped, numSprites: 1,
                                    canvasPosition: {x:400, y:400} , scalingConstant: 1})

const playerOne = new playerSprite({idleDrawable: playerOneIdle, chargingDrawable: playerOneCharge,
                                    kameDrawable: playerOneKame})
const playerTwo= new playerSprite({idleDrawable: playerTwoIdle, chargingDrawable: playerTwoCharge,
                                    kameDrawable: playerTwoKame})
/*---------------------------------------------------------*/


/*---------------- Prompts and background -----------------------*/
const duelPromptImage = new Image()
const fakeOutPromptImage = new Image()

duelPromptImage.src = '../images/exclamation4.png'

const duelPrompt = new drawable({cropStart:{x:0, y:0}, image: duelPromptImage, numSprites: 1, canvasPosition: {x: 535, y: 240}, scalingConstant: 1.5})
const fakeOutPrompt = new drawable({cropStart:{x: 0, y: 0}, image: fakeOutPromptImage, numSprites: 1, canvasPosition:{x: 535, y: 230}, scalingConstant: 1.5})

const backgroundImage = new Image();
const darkenedbackgroundImage = new Image();

darkenedbackgroundImage.src = '../images/db-background-2.png';
backgroundImage.src = '../images/db-background.png';
/*---------------------------------------------------------*/