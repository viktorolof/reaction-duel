class drawable {
    constructor({position, image, numSprites}) {
        this.position = position
        this.image = image
        this.numSprites = numSprites
    }

    draw() {
        context.drawImage(
            this.image,
            this.position.x,
            this.position.y
        )
    }
}