
const OverlayCanvas = require("./Components/Canvas/OverlayCanvas.js")
const ImageCanvas = require("./Components/Canvas/ImageCanvas.js")
const RectangleOutline = require("./RectangleOutline.js")
//const ServerConnection = require("./ServerConnection.js")

class CreateMode {
    constructor(OverlayCanvas) {
        this.button = document.getElementById("createMode")
        this.eventsListenerMode = "off"
        this.drag = false
        this.rect = {}
        this.overlayCanvas = OverlayCanvas
        this.mainCanvas = OverlayCanvas.mainCanvas
        this.mainContext = OverlayCanvas.mainContext
    }

    turnOn() {
        //this.turnOffButtonColor()
        this.showOverlayCanvas()
        this.removeAllThingsOnCanvas()
        this.listenToDrag()
    }

    turnOff() {
        this.overlayCanvas.mainCanvas.style.display = "none"
    }

    turnOffButtonColor() {
        this.button.disabled = true;
    }

    removeAllThingsOnCanvas() {
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    }

    showOverlayCanvas() {
        this.overlayCanvas.mainCanvas.style.display = "block"
    }

    listenToDrag() {
        if (this.eventsListenerMode == "off") {
            this.eventsListenerMode = "on"
            this.startDrawing()
            this.finishDrawing()
        }
    }

    startDrawing() {
        this.mainCanvas.addEventListener("mousedown", (e) => this.mouseDown(e))
        this.mainCanvas.addEventListener("mousemove", (e) => this.mouseMove(e))
    }

    finishDrawing() {
        this.mainCanvas.addEventListener("mouseup", (e) => this.mouseUp(e))
    }

    mouseDown(e) {
        this.rect.startX = e.offsetX;
        this.rect.startY = e.offsetY;
        this.drag = true;
    }

    mouseMove(e) {
        if (this.drag) {
            this.rect.width = e.offsetX - this.rect.startX;
            this.rect.height = e.offsetY - this.rect.startY;
            RectangleOutline.removeAll()
            RectangleOutline.generate(this.rect.startX, this.rect.startY, this.rect.width, this.rect.height)
        }
    }

    mouseUp(e) {
        this.resetDefault() 
        this.processImageAndText()
        document.getElementById("OCRmode").click()
    }

    resetDefault() {
        this.drag = false;
        RectangleOutline.removeAll()
    }

    async processImageAndText() {
        console.log("success")
        let croppedImage = RectangleOutline.cropToImage(this.rect.startX, this.rect.startY, this.rect.width, this.rect.height)

        //let textDataFromServer = await this.serverConnection.requestImageTranslation(croppedImage)

        ImageSaveData.addTextBoxInfo([this.rect.startX, this.rect.startY, this.rect.width, this.rect.height, "no text", "no text"])
        //console.log(ImagesDataCollection.getCurrentSaveData().getListOfTextBoxes())
    }
}

module.exports = new CreateMode(OverlayCanvas)