const ImageCanvas = require("./Components/Canvas/ImageCanvas.js")
const OverlayCanvas = require("./Components/Canvas/OverlayCanvas.js")

class RectangleOutline {
    constructor(ImageCanvasClass, OverlayCanvasClass) {
        this.imageCanvas = ImageCanvasClass
        this.mainCanvas = OverlayCanvasClass.mainCanvas
        this.mainContext = OverlayCanvasClass.mainContext
    }

    generate(x, y, width, height) {
        this.mainContext.beginPath(); 
        this.mainContext.fillStyle='rgba(255, 0, 0, 0.5)';
        this.mainContext.fillRect(x, y, width, height);
        this.mainContext.stroke();
    }

    remove(x, y, width, height) {
        this.mainContext.clearRect(x, y, width, height);
    }

    removeAll() {
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    }

    // cropToImage(pointX,pointY,cropWidth,cropHeight, thisCanvas=this.imageCanvas.mainCanvas){
    cropToImage(pointX,pointY,cropWidth,cropHeight){
        // create a temporary canvas sized to the cropped size
        const canvas1=document.createElement('canvas');
        const ctx1=canvas1.getContext('2d');
        canvas1.width=cropWidth;
        canvas1.height=cropHeight;
        // use the extended from of drawImage to draw the
        // cropped area to the temp canvas
        ctx1.drawImage(this.imageCanvas.mainCanvas,pointX,pointY,cropWidth,cropHeight,0,0,cropWidth,cropHeight);
        // return the .toDataURL of the temp canvas

        //To display Image on Chrome for testing
        // const win = window.open();
        // win.document.write("<img src='"+canvas1.toDataURL()+"'/>");
        document.getElementById("croppedImage").src = canvas1.toDataURL()

        //console.log(canvas1.toDataURL())
        return canvas1.toDataURL();
    }

}

module.exports = new RectangleOutline(ImageCanvas, OverlayCanvas)
