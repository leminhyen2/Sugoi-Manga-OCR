const {
    ipcRenderer,
    desktopCapturer,
    screen,
    shell, 
    remote,
} = require('electron');

const BrowserWindow = remote.BrowserWindow;

let screenCaptureWindowPosition 
let TextCaptureWindow = {}

// let listOfLanguages = new Map(Object.entries({
//     "English": "en",
//     "Spanish": "es",
//     "French": "fr",
//     "Russian": "ru",
//     "Korean": "ko",
//     "Chinese (simplified)": "zh-Hans",
//     "Chinese (traditional)": "zh-Hant",
//     "Indonesian": "id",
//     "Vietnamese": "vi",
//     "Thai": "th",
//     "Afrikaans": "af",
//     "Arabic": "ar",
//     "Bangla": "bn",
//     "Bosnian": "bs",
//     "Bulgarian": "bg",
//     "Cantonese (traditional)": "yue",
//     "Catalan": "ca",
//     "Croatian": "hr",
//     "Czech": "cs",
//     "Danish": "da",
//     "Dutch": "nl",
//     "Estonian": "et",
//     "Fijian": "fj",
//     "Filipino": "fil",
//     "Finnish": "fi",
//     "German": "de",
//     "Greek": "el",
//     "Haitian Creole": "ht",
//     "Hebrew": "he",
//     "Hindi": "hi",
//     "Hmong Daw": "mww",
//     "Hungarian": "hu",
//     "Icelandic": "is",
//     "Irish": "ga",
//     "Italian": "it",
//     "Japanese": "ja",
//     "Kannada": "kn",
//     "Klingon": "tlh",
//     "Latvian": "lv",
//     "Lithuanian": "lt",
//     "Malagasy": "mg",
//     "Malay": "ms",
//     "Malayalam": "ml",
//     "Maltese": "mt",
//     "Maori": "mi",
//     "Norwegian": "nb",
//     "Persian": "fa",
//     "Polish": "pl",
//     "Portuguese (Brazil)": "pt",
//     "Portuguese (Portugal)": "pt-pt",
//     "Punjabi": "pa",
//     "Romanian": "ro",
//     "Samoan": "sm",
//     "Serbian (Cyrillic)": "sr-Cyrl",
//     "Serbian (Latin)": "sr-Latn",
//     "Slovak": "sk",
//     "Slovenian": "sl",
//     "Swahili": "sw",
//     "Swedish": "sv",
//     "Tahitian": "ty",
//     "Tamil": "ta",
//     "Telugu": "te",
//     "Tongan": "to",
//     "Turkish": "tr",
//     "Ukrainian": "uk",
//     "Urdu": "ur",
//     "Welsh": "cy",
//     "Yucatec Maya": "yua"
// }))

// const languagesSelectionElement = document.getElementById("languagesSelection"); 

// for (let [key, value] of listOfLanguages) {
//     let optionElement = document.createElement("option");
//     optionElement.textContent = key;
//     optionElement.value = value;
//     languagesSelectionElement.appendChild(optionElement);
// }

// languagesSelectionElement.addEventListener("change", requestServerToUpdateNewTranslationLanguage);

// function requestServerToUpdateNewTranslationLanguage() {
//     let newLanguage = languagesSelectionElement.value;
//     webSocketConnection.sendDataToWebSocketServer("update translation language", newLanguage)
// }

const translatorsSelection = document.getElementById("translatorsSelection")
translatorsSelection.addEventListener("change", requestServerToUpdateNewTranslators);

function requestServerToUpdateNewTranslators() {
    let newTranslator = translatorsSelection.value;
    DeepLwebSocketConnection.sendDataToWebSocketServer("user requests new translation method", newTranslator)
}


const modesSelection = document.getElementById("modesSelection")
modesSelection.addEventListener("change", requestServerToUpdateNewMode);

function requestServerToUpdateNewMode() {
    let newMode = modesSelection.value;
    webSocketConnection.sendDataToWebSocketServer("update new mode", newMode)
}

const ocrLanguageSelection = document.getElementById("ocrLanguageSelection")
ocrLanguageSelection.addEventListener("change", requestServerToUpdateNewocrLanguage);

function requestServerToUpdateNewocrLanguage() {
    let newMode = ocrLanguageSelection.value;
    if (newMode === "koreanHorizontal" || newMode === "koreanVertical") {
        document.getElementById("translatorsSelection").value = "Papago";
    }
    webSocketConnection.sendDataToWebSocketServer("update OCR language", newMode)
    DeepLwebSocketConnection.sendDataToWebSocketServer("update OCR language", newMode)
}

const app = require('electron').remote.app;

window.onbeforeunload = function(){
    app.quit()
}

// ipcRenderer.on('new coordinates from screen capture window', (event, arg) => {
//     screenCaptureWindowPosition = arg
//     console.log("new position",screenCaptureWindowPosition) 
// })

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"


// ipcRenderer.send('asynchronous-message', 'ping')

sendMessageToUser("If your DeepL Translator doesn't work, edit the DeepL-Setting.json file with notepad to show the DeepL page. If that doesn't work too, let me know")



function sendMessageToUser(message) {
    document.getElementById("messageContainer").innerHTML = message
}

function getAllKeysPostiionMetrics() {
    return remote.getCurrentWindow().getNormalBounds()
}

function minimizeCurrentWindow() {
    return remote.getCurrentWindow().minimize()
}

// let croppingWindow 
// function generateCropWindow() {
//     //let keyPositionsObject = getAllKeysPostiionMetrics()

//     croppingWindow = new BrowserWindow({
//         title: "Screen Cropping Window",
//         opacity: 0.3,
//         transparent: false,
//         frame: true,
//         alwaysOnTop: true,
//         webPreferences: {
//             enableRemoteModule: true,
//             nodeIntegration: true
//         }
//     });
//     croppingWindow.loadFile('./screenCroppingWindow/screenCroppingWindow.html')
//     croppingWindow.maximize();
//     croppingWindow.show();
//     setTimeout(function(){ croppingWindow.hide() }, 400);
//     //croppingWindow.hide();

// }

// generateCropWindow()

let autoModeWindow

const generateAutoModeWindow = () => {
  autoModeWindow = new BrowserWindow({
      title: "Auto Mode Window",
      opacity: 1,
      transparent: false,
      frame: true,
      alwaysOnTop: false,
      webPreferences: {
          enableRemoteModule: true,
          nodeIntegration: true
      }
});
  autoModeWindow.loadFile('./autoModeWindow/autoModeWindow.html')
  autoModeWindow.maximize();
  autoModeWindow.show();
  setTimeout(function(){ autoModeWindow.minimize() }, 400);
  //autoModeWindow.removeMenu()
}

generateAutoModeWindow()


const generateScreenCaptureWindow = (mode) => {
    let keyPositionsObject = getAllKeysPostiionMetrics()
    let screenCaptureWindow

    screenCaptureWindow = new BrowserWindow({
        title: "Screen Capture Window",
        opacity: 1,
        x: 800,
        y: 700,
        width: 270,
        height: 150,
        transparent: false,
        frame: true,
        alwaysOnTop: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    });
    screenCaptureWindow.loadFile('./screenCaptureWindow/screenCaptureWindow.html')

}

generateScreenCaptureWindow()

const WebSocketConnection = require("../WebsocketConnection.js")
const webSocketConnection = new WebSocketConnection(WebSocket);

webSocketConnection.websocket.onopen = () => {
    webSocketConnection.sendDataToWebSocketServer("screen cropping window activated", "no content")
    //webSocketConnection.sendDataToWebSocketServer("subscribe to keyboard event", "no content")
};
webSocketConnection.websocket.onmessage = (info) => {
    console.log(info);
    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    // if (message === "get image coordinates then send to server") {
    //     croppingWindow.show()
    //     croppingWindow.focus()
    //     //generateCropWindow()
    //     // let keyPositionsObject = getAllKeysPostiionMetrics()
    //     // let borderAdjustedPositions = {x: keyPositionsObject.x + 3, y: keyPositionsObject.y + 3, width: keyPositionsObject.width - 6, height: keyPositionsObject.height - 6}
    //     // webSocketConnection.sendDataToWebSocketServer("update new position", borderAdjustedPositions)
    //     // hideEverything()
    // }
};

const DeepLwebsocketServerPortNumber = 15367
const DeepLwebSocketConnection = new WebSocketConnection(WebSocket, DeepLwebsocketServerPortNumber);

DeepLwebSocketConnection.websocket.onopen = function() {
    console.log("connecting to deepL")
    DeepLwebSocketConnection.sendDataToWebSocketServer("add main menu window connection", "no content")
};

DeepLwebSocketConnection.websocket.onmessage = function incoming(info) {
    console.log(info);

    let parsedInfo = JSON.parse(info.data)
    let message = parsedInfo.message
    let content = parsedInfo.content

    if (message === "change translator method to Bing") {
        document.getElementById("translatorsSelection").value = "Bing";
    }
};


