class drawable {
    constructor({position, image, numSprites}) {
        this.position = position
        this.image = image
        this.numSprites = numSprites
    }

    draw() {
        context.drawImage(
            this.image,                             
            this.position.x,                        // x position of the start of the crop
            this.position.y,                        // y position of the start of the crop
            this.image.width / this.numSprites,     // x position of the end of the crop
            this.image.height,                      // y position of the end of the crop
            this.position.x,                        // x position of the image on the canvas
            this.position.y,                        // y position of the image on the canvas
            this.image.width / this.numSprites,     // The width of the image to be rendered
            this.image.height                       // The height of the image to be rendered
        )
    }
}