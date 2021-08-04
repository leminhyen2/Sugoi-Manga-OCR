const Canvas = require("./Canvas.js")

var imageCanvas = document.getElementById("imageCanvas")
var imageCtx = imageCanvas.getContext('2d')

class ImageCanvas extends Canvas {
    constructor(receivedCanvas, receivedContext) {
        super(receivedCanvas, receivedContext)
        this.imageHeight = 0
        this.imageWidth = 0
    }

    insertImageToCanvas(imageFile) {
        let imageObj = new Image();
        let URLObj = window.URL || window.webkitURL;
        imageObj.src = imageFile
        //imageObj.src = URLObj.createObjectURL(imageFile);
        imageObj.onload =() => {
            this.resizeCanvas(imageObj.width, imageObj.height)
            // this.overlayCanvas.resizeCanvas(imageObj.width, imageObj.height)
            console.log("testImageDimensions", imageObj.height, imageObj.width)
            this.imageHeight = imageObj.height
            this.imageWidth = imageObj.width
            this.mainContext.drawImage(imageObj, 0, 0, this.mainCanvas.width, this.mainCanvas.height);
        };
    }

    getImageWidthHeight() {
        return {width: this.imageWidth, height: this.imageHeight}
    }

}

module.exports = new ImageCanvas(imageCanvas, imageCtx)