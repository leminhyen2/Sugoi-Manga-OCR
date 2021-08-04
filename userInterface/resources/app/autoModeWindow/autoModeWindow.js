const ImageCanvas = require("./Components/Canvas/ImageCanvas.js")
const OverlayCanvas = require("./Components/Canvas/OverlayCanvas.js")

const OutLinesContainerDiv = require("./OutlinesContainerDiv.js")
const ImageSaveData = require("./ImageSaveData.js")
const RectangleOutline = require("./RectangleOutline.js")
const ListOfModes = require("./ListOfModes.js")

const { remote } = require('electron')
let thisWindow = remote.getCurrentWindow(); 

const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

webSocketConnection.websocket.onopen = function() {
    webSocketConnection.sendDataToWebSocketServer("add auto mode window connection", "no content")
};

webSocketConnection.websocket.onmessage = async (info) => {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    console.log("content", content)

    if (message === "minimize auto mode window") {
        thisWindow.minimize()
    }

    if (message === "image from server") {
        ImageSaveData.reset()
        OutLinesContainerDiv.removeAllOutLines()

        ImageCanvas.insertImageToCanvas(content)

        thisWindow.maximize()
        thisWindow.show()

        // document.getElementById("layersHolder").style.width = `${ImageCanvas.getImageWidthHeight().width}px`
        // document.getElementById("layersHolder").style.height = `${ImageCanvas.getImageWidthHeight().height}px`
    }

    if (message === "text boxes from server") {

        document.getElementById("layersHolder").style.width = `${ImageCanvas.getImageWidthHeight().width}px`
        document.getElementById("layersHolder").style.height = `${ImageCanvas.getImageWidthHeight().height}px`

        document.getElementById("outlinesContainer").style.width = `${ImageCanvas.getImageWidthHeight().width}px`
        document.getElementById("outlinesContainer").style.height = `${ImageCanvas.getImageWidthHeight().height}px`

        OverlayCanvas.resizeCanvas(ImageCanvas.getImageWidthHeight().width, ImageCanvas.getImageWidthHeight().height)
        OverlayCanvas.positionCanvas(ImageCanvas.mainCanvas.getBoundingClientRect().top, ImageCanvas.mainCanvas.getBoundingClientRect().left)

        // console.log("list of textboxes", content)
        // console.log("image dimensions", ImageCanvas.getImageWidthHeight().width, ImageCanvas.getImageWidthHeight().height)

        let processedListOfTextboxes = await ImageSaveData.preprocessListOfTextboxes(content)
        await ImageSaveData.convertAndAddAllCoordinatesArraysFromServer(processedListOfTextboxes)

        OutLinesContainerDiv.injectAllEditModeOutlines(ImageSaveData.listOfTextBoxes)
    }

};

ListOfModes.initiate()
ListOfModes.listen()

document.addEventListener("click", async function(event){
    if (ListOfModes.getCurrentMode() === "Delete Mode") {
        if (event.target.getAttribute("isTextboxOutlineOrNot") === "isTextboxOutline") {
            let textboxID = event.target.id
            document.getElementById(textboxID+"container").remove()
            ImageSaveData.listOfTextBoxes.delete(textboxID)
        }
    }
    if ((ListOfModes.getCurrentMode() === "OCR Mode") || (ListOfModes.getCurrentMode() === "Read Mode")) {
        if (event.target.getAttribute("isTextboxOutlineOrNot") === "isTextboxOutline") {
            let textboxID = event.target.id
            let textboxElement = document.getElementById(textboxID)
            let croppedImage = await RectangleOutline.cropToImage(textboxElement.offsetLeft+1, textboxElement.offsetTop+1, textboxElement.offsetWidth-3, textboxElement.offsetHeight-3)
            // if (textboxElement.offsetWidth > textboxElement.offsetHeight) {
            //     webSocketConnection.sendDataToWebSocketServer("update image orientation", "horizontal")
            // }
            // if (textboxElement.offsetWidth < textboxElement.offsetHeight) {
            //     webSocketConnection.sendDataToWebSocketServer("update image orientation", "vertical")
            // }
            webSocketConnection.sendDataToWebSocketServer("save, extract text, then translate image", croppedImage)
        }
    }
});

// document.getElementById("returnButton").onclick = doStuffsWhenReturnButtonIsClicked

// function doStuffsWhenReturnButtonIsClicked() {
//     webSocketConnection.sendDataToWebSocketServer("minimize translation window", "no content")
//     minimizeCurrentWindow()
// }

// function minimizeCurrentWindow() {
//     return remote.getCurrentWindow().minimize()
// }