class Canvas {
    constructor(receivedCanvas, receivedContext) {
        this.mainCanvas = receivedCanvas
        this.mainContext = receivedContext
    }

    resizeCanvas(width, height) {
        this.mainCanvas.width = width
        this.mainCanvas.height = height

        this.mainCanvas.style.width = width
        this.mainCanvas.style.height = height

        //this.setCanvasBorder("5px solid black")
    }

    positionCanvas(top, left) {
        this.mainCanvas.top = top
        this.mainCanvas.left = left

        this.mainCanvas.style.top = top
        this.mainCanvas.style.left = left
    }

    setCanvasBorder(border) {
        this.mainCanvas.style.border = border;
    }
}

module.exports = Canvas