class drawable {
    
    constructor({cropStart, image, numSprites, canvasPosition, scalingConstant}) {
        this.cropStart = cropStart
        this.image = image
        this.numSprites = numSprites
        this.canvasPosition = canvasPosition;
        this.frameCounter = 0;
        this.scalingConstant = scalingConstant
        this.hidden = false;
    }

    draw() {
        if(!this.hidden){
            context.drawImage(
                this.image,                             
                this.cropStart.x,                        // x position of the start of the crop
                this.cropStart.y,                        // y position of the start of the crop
                this.image.width / this.numSprites,     // x position of the end of the crop
                this.image.height,                      // y position of the end of the crop
                this.canvasPosition.x,                  // x position of the image on the canvas
                this.canvasPosition.y,                  // y position of the image on the canvas
                (this.image.width / this.numSprites) * this.scalingConstant,     // The width of the image to be rendered
                this.image.height * this.scalingConstant                    // The height of the image to be rendered
            )
        }
    }

    nextIdle(frameRate) {        
        if(Math.floor(this.frameCounter++ % (frameRate / this.numSprites)) === 0){
            this.cropStart.x += (this.image.width / this.numSprites)
            this.cropStart.x = this.cropStart.x % this.image.width
        }else{
            this.frameCounter += 1;
        }
        
    }

    makeInvisible() {
        this.hidden = true;
    }

    makeVisible(){
        this.hidden = false;
    }
}