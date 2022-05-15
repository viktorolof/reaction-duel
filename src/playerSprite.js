class playerSprite {
    constructor({idleDrawable, punchDrawable, punchedDrawable}) {
        this.currentDrawable = 0; //0 Idle, 1 Punch, 2 gets punched
        this.idleDrawable = idleDrawable;
        this.punchDrawable = punchDrawable;
        this.punchedDrawable = punchedDrawable;
    }
    
    punch(){
        this.currentDrawable = 1;
    }
    
    lose(){
        this.currentDrawable = 2;
    }
    
    idle(){
       this.currentDrawable = 0;
    }
    
    draw(){
        switch (this.currentDrawable){
            case 0:
                this.idleDrawable.draw();
                this.idleDrawable.nextIdle(60);
                break;
            case 1:
                this.punchDrawable.draw()
                this.punchDrawable.nextIdle(60);
                break;
            case 2:
                this.punchedDrawable.draw();
                this.punchedDrawable.nextIdle(60);
                break
            default:
                break;
        }
    }
}