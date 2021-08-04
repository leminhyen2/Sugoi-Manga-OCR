const Canvas = require("./Canvas.js")

var drawingCanvas = document.getElementById("overlayCanvas")
var overlayCtx = drawingCanvas.getContext("2d")

class OverlayCanvas extends Canvas {
    constructor(receivedCanvas, receivedContext) {
        super(receivedCanvas, receivedContext)
    }

    moveToNewPosition(newTop, newLeft, newWidth, newHeight) {
        this.mainCanvas.style.top = `${newTop}px` 
        this.mainCanvas.style.left = `${newLeft}px` 
        this.mainCanvas.width = `${newWidth}px` 
        this.mainCanvas.height = `${newHeight}px` 
    }


}

module.exports = new OverlayCanvas(drawingCanvas, overlayCtx)