const { remote } = require('electron')
let thisWindow = remote.getCurrentWindow(); 

const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

const DeepLwebsocketServerPortNumber = 15367
const DeepLwebSocketConnection = new WebSocketConnection(WebSocket, DeepLwebsocketServerPortNumber);

webSocketConnection.websocket.onopen = function() {
    webSocketConnection.sendDataToWebSocketServer("add translation window connection", "no content")
    webSocketConnection.sendDataToWebSocketServer("subscribe to image updates", "no content")
};

DeepLwebSocketConnection.websocket.onopen = function() {
    console.log("connecting to deepL")
    DeepLwebSocketConnection.sendDataToWebSocketServer("subscribe to translated text updates", "no content")
};

DeepLwebSocketConnection.websocket.onmessage = function incoming(info) {
    hideExtraNote()
    console.log(info);

    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "translation from server") {
        let translatedText = content
        console.log(translatedText)
        document.getElementById("translatedText").innerHTML = translatedText
    }
};

webSocketConnection.websocket.onmessage = function incoming(info) {
    hideExtraNote()
    console.log(info);

    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "image from server") {
        document.getElementById("imageHolder").src = content
    }

    if (message === "minimize translation window") {
        thisWindow.minimize()
    }

    if (message === "show translation window") {
        thisWindow.show()
    }

    if (message === "extracted text from server") {
        let extractedText = content.extracted
        document.getElementById("extractedText").innerHTML = extractedText
    }

    if (message === "translated text from server") {
        let translatedText = content.translated
        document.getElementById("translatedText").innerHTML = translatedText
    }
};

let extraNote = document.getElementById("extraNote")

function hideExtraNote() {
    extraNote.style.display = "none"
}



