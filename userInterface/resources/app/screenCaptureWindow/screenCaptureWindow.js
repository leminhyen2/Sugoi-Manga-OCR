const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow; 
let thisWindow = remote.getCurrentWindow(); 


let croppingWindow 
function generateCropWindow() {
    //let keyPositionsObject = getAllKeysPostiionMetrics()

    croppingWindow = new BrowserWindow({
        title: "Screen Cropping Window",
        opacity: 0.3,
        transparent: false,
        frame: true,
        alwaysOnTop: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });
    croppingWindow.loadFile('./screenCroppingWindow/screenCroppingWindow.html')
    croppingWindow.maximize();
    croppingWindow.show();
    setTimeout(function(){ croppingWindow.hide() }, 400);
    //croppingWindow.hide();

}

generateCropWindow()


const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

webSocketConnection.websocket.onopen = () => {
    webSocketConnection.sendDataToWebSocketServer("add screen capture window connection", "no content")
    webSocketConnection.sendDataToWebSocketServer("subscribe to keyboard event", "no content")
};
webSocketConnection.websocket.onmessage = async (info) => {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "activate capture button") {
        document.getElementById("translateButton").click()
    }

    if (message === "activate full screen button") {
        document.getElementById("fullScreenButton").click()
    }

    if (message === "activate go back button") {
        activateGoBackButton()
    }

    if (message === "activate crop button") {
        activateCropButton()
    }

    if (message === "change buttons to manual mode") {
        document.getElementById("bottomButtonsContainer").style.display = "none"
        document.getElementById("manualCropButton").style.display = "block"
    }

    if (message === "change buttons to auto mode") {
        document.getElementById("manualCropButton").style.display = "none"
        document.getElementById("bottomButtonsContainer").style.display = "block"
    }

};

function activateCropButton() {
    croppingWindow.show()
    croppingWindow.focus()
}

function activateFullScreenButton() {
    webSocketConnection.sendDataToWebSocketServer("take full screenshot", "no content")
}

function activateGoBackButton() {
    webSocketConnection.sendDataToWebSocketServer("minimize program windows", "no content")
}

function activateTranslateButton() {
    webSocketConnection.sendDataToWebSocketServer("crop and edit this image", "no content")
}

document.getElementById("manualCropButton").onclick = (e) => {
    activateCropButton()
}

document.body.style.display.onmouseover = (e) => {
    document.getElementById("bottomButtonsContainer").style.display = "block"
}

document.getElementById("cropButton").onclick = (e) => {
    generateTextCaptureWindow("cropMode")
}

document.getElementById("translateButton").onclick = () => {
    activateTranslateButton()
}

document.getElementById("returnButton").onclick = () => {
    activateGoBackButton()
}

document.getElementById("fullScreenButton").onclick = () => {
    activateFullScreenButton()
}


const generateTextCaptureWindow = (mode) => {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let TextCaptureWindow

    switch(mode) {
        case "transparentMode":
            TextCaptureWindow = new BrowserWindow({
                width: keyPositionsObject.width,
                height: keyPositionsObject.height,
                x: keyPositionsObject.x,
                y: keyPositionsObject.y,
                transparent: true,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    enableRemoteModule: true,
                    nodeIntegration: true
                }
            });
            TextCaptureWindow.loadFile('./screenCaptureWindow/transparentWindow/transparentWindow.html')
            break

        case "cropMode":
            TextCaptureWindow = new BrowserWindow({
                title: "Screen Cropping Window",
                opacity: 0.5,
                transparent: false,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    enableRemoteModule: true,
                    nodeIntegration: true
                }
            });
            TextCaptureWindow.loadFile('./screenCroppingWindow/screenCroppingWindow.html')
            TextCaptureWindow.maximize();
            TextCaptureWindow.show();
            break
    }
    //TextCaptureWindow.loadFile('./screenCaptureWindow/screenCaptureWindow.html')
}


async function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getAllKeysPostiionMetrics() {
    return remote.getCurrentWindow().getNormalBounds()
}


const hideEverything = () => {
    document.body.style.display = "none"

    setTimeout (() => {
        webSocketConnection.sendDataToWebSocketServer("crop and edit this image", "no content")
    },200);
    setTimeout (function(){
        document.body.style.display = "block"
    },500);
}



