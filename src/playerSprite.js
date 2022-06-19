class playerSprite {
    constructor({idleDrawable, chargingDrawable, kameDrawable}) {
        this.currentDrawable = 0; //0 Idle
        this.idleDrawable = idleDrawable;
        this.chargingDrawable = chargingDrawable
        this.kameDrawable = kameDrawable;
    }
    
    idle(){
       this.currentDrawable = 0;
    }
    
    draw(){
        switch(this.currentDrawable){
            case 0:
                this.idleDrawable.draw();
                this.idleDrawable.nextIdle(60);
                break;
            case 1:
                this.chargingDrawable.draw();
                this.chargingDrawable.nextIdle(60);
                break;
            case 2:
                this.kameDrawable.draw()
                this.kameDrawable.nextIdle()
                break;
        }
    }

}