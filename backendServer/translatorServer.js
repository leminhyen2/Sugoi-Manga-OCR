
const listOfVariablesData = require("./listOfVariablesData.json")
const TranslatorwebsocketServerPortNumber = listOfVariablesData.TranslatorwebsocketServerPortNumber
const pythonFlaskServerPortNumber = listOfVariablesData.pythonFlaskServerPortNumber

const fetch = require('node-fetch');

const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ port: TranslatorwebsocketServerPortNumber });

let copiedTextSubscribingClients = []
let translatedTextSubscribingClients = []
let mainMenuWindow = []

// const ClipboardListener = require('clipboard-listener');
// let clipboardListener = new ClipboardListener({timeInterval: 100, immediate: false})

const clipboardy = require('clipboardy');
const clipboardListener = require('clipboard-event');
clipboardListener.startListening();

const DeepL = require('./DeepLtranslator.js');
const Papago = require('./Papagotranslator.js');
const requestBingTranslation = require("./requestBingTranslation")

class DeepLtranslator {
    constructor() {
        this.deepL = new DeepL()
        this.deepLinterval 
    }

    async start() {
        await this.deepL.activate()

        this.deepLinterval = setInterval(async () => {
            let result = await this.deepL.checkIfCurrentTranslationTextChanged(this.deepL.page, this.deepL.resultTextboxID)
            if (result === true) {
                //sendMessageAndContentToAllClients(copiedTextSubscribingClients, "copied text from server", this.deepL.copiedText)
                sendMessageAndContentToAllClients(translatedTextSubscribingClients, "translation from server", this.deepL.currentTranslationText)
            }
        }, 300);
    }
    
    stop() {
        this.deepL.stop()
        clearInterval(this.deepLinterval);
    }
}

let deepLtranslator = new DeepLtranslator()
deepLtranslator.start()


class PapagoTranslator {
    constructor() {
        this.deepL = new Papago()
        this.deepLinterval 
    }

    async start() {
        await this.deepL.activate()

        this.deepLinterval = setInterval(async () => {
            let result = await this.deepL.checkIfCurrentTranslationTextChanged(this.deepL.page, this.deepL.resultTextboxID)
            if (result === true) {
                //sendMessageAndContentToAllClients(copiedTextSubscribingClients, "copied text from server", this.deepL.copiedText)
                sendMessageAndContentToAllClients(translatedTextSubscribingClients, "translation from server", this.deepL.currentTranslationText)
            }
        }, 300);
    }
    
    stop() {
        this.deepL.stop()
        clearInterval(this.deepLinterval);
    }
}

let papagoTranslator = new PapagoTranslator()
papagoTranslator.start()


let currentTranslationMethod = "DeepL"
let ocrLanguage = "japanese"
let deepLlanguageCode = "ja"
let papagoLanguageCode = "ja"
let bingLanguageCode = "ja"
let currentCopiedText = ""

clipboardListener.on('change', async () => {
    let value = clipboardy.readSync();

    if ((checkIfJapaneseText(value) === true) && (checkIfCopiedTextHasChanged(value, currentCopiedText) === true)) {

        console.log("this text value", value)

        console.log("Copied text is Japanese. Initiate translation process")
        currentCopiedText = value


        if (currentTranslationMethod === "DeepL") {
            deepLtranslator.deepL.grabCopiedTextThenTranslate(deepLlanguageCode, value)
        }
        if (currentTranslationMethod === "Papago") {
            papagoTranslator.deepL.grabCopiedTextThenTranslate(papagoLanguageCode, value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''))
        }
        if (currentTranslationMethod === "Bing") {
            let translationResult = await requestBingTranslation(bingLanguageCode, value, "en")
            console.log("translation from Bing", translationResult)
            sendMessageAndContentToAllClients(copiedTextSubscribingClients, "copied text from server", value)
            sendMessageAndContentToAllClients(translatedTextSubscribingClients, "translation from server", translationResult)
        }
        // if (currentTranslationMethod === "Offline Translator") {
        //     let translationResult = await requestTranslationFromPythonServer(value, "translate sentences", pythonFlaskServerPortNumber)
        //     // sendMessageToServer("ありがと�?。来てくれて、嬉し�?�?", "translate sentences")
        //     // let translationResult = await requestBingTranslation("ja", value, "en")
        //     sendMessageAndContentToAllClients(copiedTextSubscribingClients, "copied text from server", value)
        //     sendMessageAndContentToAllClients(translatedTextSubscribingClients, "translation from server", translationResult)
        // }

    }
});

webSocketServer.on('connection', (webSocketConnection) => {
    console.log("receive connection request")
	webSocketConnection.on('message', async (data) => {
		let parsedData = JSON.parse(data)

		let message = parsedData.message
		let content = parsedData.content

		console.log('received: %s', message);

        if (message == "add main menu window connection") {
			mainMenuWindow.push(webSocketConnection)
		}

		if (message == "subscribe to copied text updates") {
			copiedTextSubscribingClients.push(webSocketConnection)
		}

		if (message == "subscribe to translated text updates") {
            console.log("received message from client")
			translatedTextSubscribingClients.push(webSocketConnection)
        }

        if (message == "update OCR language") {
			ocrLanguage = content
            if (ocrLanguage === "japaneseVertical" || ocrLanguage === "japaneseHorizontal") {
                deepLlanguageCode = "ja"
                papagoLanguageCode = "ja"
                bingLanguageCode = "ja"
            }
            if (ocrLanguage === "chineseVertical" || ocrLanguage === "chineseHorizontal") {
                deepLlanguageCode = "zh"
                papagoLanguageCode = "zh-CN"
                bingLanguageCode = "zh-Hans"
            }
            if (ocrLanguage === "koreanVertical" || ocrLanguage === "koreanHorizontal") {
                // sendMessageAndContentToAllClients(mainMenuWindow, "change translator method to Bing", "no content")
                currentTranslationMethod = "Papago"
                papagoLanguageCode = "ko"
                bingLanguageCode = "ko"
            }

            console.log(ocrLanguage)
		}
        
        if (message == "user requests new translation method") {
            // if (content === "DeepL") {
            //     deepLtranslator.start()
            // }
            // else {
            //     deepLtranslator.stop()
            // }
            console.log(content)
            currentTranslationMethod = content
		}

	});

	webSocketConnection.on('close', () => {
		removeElementFromArray(webSocketConnection, copiedTextSubscribingClients)
		removeElementFromArray(webSocketConnection, translatedTextSubscribingClients)
        clipboardListener.stopListening();
	});

});


function sendMessageAndContentToAllClients(listOfClients, thisMessage, thisContent) {
	console.log("server sending messages to window")
	listOfClients.forEach((client) => {
		client.send(JSON.stringify({message: thisMessage, content: thisContent}));
	})
}

async function requestTranslationFromPythonServer(thisContent, thisMessage, serverPort) {  
	let translation = await fetch(`http://localhost:${serverPort}/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
        })
    return translation.json()
}

function checkIfCopiedTextHasChanged(copiedText, currentCopiedText) {
    return !(copiedText === currentCopiedText)
}

function checkIfJapaneseText(text) {
    if (text === undefined) {
        text = "エラーが発生しましたので、も�?一度お試しく�?さい�?"
    }
    else {
        const REGEX_Japanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u3131-\uD79D]/;
        const hasJapanese = text.match(REGEX_Japanese);
        if (hasJapanese) {
            return true
        }
        else {
            return false
        }
    }
}












