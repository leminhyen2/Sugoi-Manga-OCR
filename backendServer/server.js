const listOfVariablesData = require("./listOfVariablesData.json")
const httpServerPortNumber = listOfVariablesData.HTTPserverPortNumber
const websocketServerPortNumber = listOfVariablesData.websocketServerPortNumber
const pythonFlaskServerPortNumber = listOfVariablesData.pythonFlaskServerPortNumber

const keyboardShortcuts = require("./keyboards/keyboardShortcuts.json")

const base64Img = require('base64-img');
const fetch = require('node-fetch');

const translateTextInImage = require("./imgTranslation.js")
const requestBingTranslation = require("./requestBingTranslation.js")

let extractedLanguage = "ja"
let translationLanguage = "en"

let OCRlanguage = "japaneseVertical"

const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ port: websocketServerPortNumber });

let mainMenuWindow = []
let screenCaptureWindow = [] 
let screenCroppingWindow = []
let translationWindow = []
let autoModeWindow = []

let imageSubscribingClients = []
let keyboardSubscribingClients = []

let textPostionObject = { x: 0, y: 0, width: 1000, height: 500 }
let textOrientation = "vertical"

let mode = "Auto"


// const ioHook = require('iohook');

// ioHook.on('keydown', keyboardEvent => {
// 	console.log(keyboardEvent)
// 	if (mode ==="Manual") {
// 		if (checkIfCustomCropButton(keyboardEvent)) {
// 			sendMessageAndContentToAllClients(keyboardSubscribingClients, "activate crop button", "no content")
// 		}
// 	}
// 	if (mode ==="Auto") {
// 		// if (checkIfCustomCaptureButtonShortcut(keyboardEvent)) {
// 		// 	sendMessageAndContentToAllClients(keyboardSubscribingClients, "activate capture button", "no content")
// 		// }
// 		// if (checkIfCustomFullScreenButtonShortcut(keyboardEvent)) {
// 		// 	sendMessageAndContentToAllClients(keyboardSubscribingClients, "activate full screen button", "no content")
// 		// }
// 		if (checkIfCustomGoBackButtonShortcut(keyboardEvent)) {
// 			sendMessageAndContentToAllClients(keyboardSubscribingClients, "activate go back button", "no content")
// 		}
// 	}

// });

// ioHook.start();

// // function checkIfBackTickButton(keyboardEvent) {
// // 	return (keyboardEvent.keycode === 41 || keyboardEvent.rawcode === 192)
// // }

// // function checkIfTabButton(keyboardEvent) {
// // 	return (keyboardEvent.keycode === 15 || keyboardEvent.rawcode === 9)
// // }

// function checkIfCustomCropButton(keyboardEvent) {
// 	return (keyboardEvent.keycode === keyboardShortcuts.cropButton.keycode || keyboardEvent.rawcode === keyboardShortcuts.cropButton.rawcode)
// }

// function checkIfCustomCaptureButtonShortcut(keyboardEvent) {
// 	return (keyboardEvent.keycode === keyboardShortcuts.captureButton.keycode || keyboardEvent.rawcode === keyboardShortcuts.captureButton.rawcode)
// }

// function checkIfCustomFullScreenButtonShortcut(keyboardEvent) {
// 	return (keyboardEvent.keycode === keyboardShortcuts.fullScreenButton.keycode || keyboardEvent.rawcode === keyboardShortcuts.fullScreenButton.rawcode)
// }

// function checkIfCustomGoBackButtonShortcut(keyboardEvent) {
// 	return (keyboardEvent.keycode === keyboardShortcuts.goBackButton.keycode || keyboardEvent.rawcode === keyboardShortcuts.goBackButton.rawcode)
// }

webSocketServer.on('connection', (webSocketConnection) => {
	webSocketConnection.on('message', async (data) => {
		let parsedData = JSON.parse(data)

		let message = parsedData.message
		let content = parsedData.content

		console.log('received: %s', message);

		if (message == "subscribe to image updates") {
			imageSubscribingClients.push(webSocketConnection)
		}

		if (message == "add translation window connection") {
			translationWindow.push(webSocketConnection)
		}

		if (message == "add auto mode window connection") {
			autoModeWindow.push(webSocketConnection)
		}

		if (message == "add screen capture window connection") {
			screenCaptureWindow.push(webSocketConnection)
		}

		if (message == "subscribe to keyboard event") {
			keyboardSubscribingClients.push(webSocketConnection)
		}

		if (message == "update new mode") {
			mode = content
			if (content === "Manual") {
				sendMessageAndContentToAllClients(screenCaptureWindow, "change buttons to manual mode", "no content")
			}
			if (content === "Auto") {
				sendMessageAndContentToAllClients(screenCaptureWindow, "change buttons to auto mode", "no content")
			}
		}

		if (message == "update translation language") {
			translationLanguage = content
		}

		if (message == "update OCR language") {
			OCRlanguage = content
			console.log("OCRlanguage", OCRlanguage)
			//sendMessageAndContentToAllClients(translationWindow, "update OCR language", OCRlanguage)
		}

		if (message == "update new position") {
			textPostionObject = content
		// 	let ImageWidth = content.width
		// 	let ImageHeight = content.height
		// 	if (ImageHeight > ImageWidth) {
		// 		textOrientation = "vertical"
		// 		console.log(textOrientation)
		// 	}
		// 	else {
		// 		textOrientation = "horizontal"
		// 		console.log(textOrientation)
		// 	}
		// }
		}

		if (message == "update text orientation") {
			textOrientation = content
		}

		if (message == "minimize translation window") {
			sendMessageAndContentToAllClients(translationWindow, "minimize translation window", "no content")
		}

		if (message == "minimize program windows") {
			sendMessageAndContentToAllClients(translationWindow, "minimize translation window", "no content")
			sendMessageAndContentToAllClients(autoModeWindow, "minimize auto mode window", "no content")
		}

		if (message == "take full screenshot") {
			if (mode === "Auto") {
				sendMessageToServer("no content", "take full screenshot")
				await delay(350)	
				base64Img.base64('capturedImage.png', function(err, data) {
					sendMessageAndContentToAllClients(autoModeWindow, "image from server", data)
				})
				let listOfTextboxes = await sendMessageToServer("no content", "detect text boxes in image")
				sendMessageAndContentToAllClients(autoModeWindow, "text boxes from server", listOfTextboxes)
				sendMessageAndContentToAllClients(translationWindow, "show translation window", "no content")
			}
		}
		
		if (message == "crop and edit this image") {
			if (mode === "Manual") {
				sendMessageToServer({textPostionObject:textPostionObject}, "crops image at this position")
				await delay(250)
				if (OCRlanguage === "japaneseVertical") {
					sendMessageToServer("capturedImage.png", "remove furigana and save image")
					await delay(250)
				}
				let extractedText = await Promise.resolve(translateTextInImage('capturedImage.png', OCRlanguage))
				sendMessageAndContentToAllClients(translationWindow, "extracted text from server", {extracted: extractedText})
				base64Img.base64('capturedImage.png', function(err, data) {
					sendMessageAndContentToAllClients(imageSubscribingClients, "image from server", data)
				})
			}
			if (mode === "Auto") {
				sendMessageToServer({textPostionObject:textPostionObject}, "crops image at this position")
				await delay(250)
				base64Img.base64('capturedImage.png', function(err, data) {
					sendMessageAndContentToAllClients(autoModeWindow, "image from server", data)
				})
				let listOfTextboxes = await sendMessageToServer("no content", "detect text boxes in image")
				sendMessageAndContentToAllClients(autoModeWindow, "text boxes from server", listOfTextboxes)
				sendMessageAndContentToAllClients(translationWindow, "show translation window", "no content")
			}
		}

		if (message == "save, extract text, then translate image") {
			await base64Img.img(content, '.', 'croppedImage', function(err, filepath) {});
			if (OCRlanguage === "japaneseVertical") {
				sendMessageToServer("croppedImage.png", "remove furigana and save image")
				await delay(250)
			}
			let extractedText = await Promise.resolve(translateTextInImage('croppedImage.png', OCRlanguage))
			sendMessageAndContentToAllClients(translationWindow, "extracted text from server", {extracted: extractedText})
		}

		if (message == "close server") {
			res.send(JSON.stringify({content: "no content", message: "node server closing"}))
			process.exit()
		}

	});

	webSocketConnection.on('close', () => {
		removeElementFromArray(webSocketConnection, imageSubscribingClients)
		removeElementFromArray(webSocketConnection, translationWindow)
		removeElementFromArray(webSocketConnection, capturedImageSubscribingClients)
	});

});


async function sendMessageToServer(thisContent, thisMessage) {  
	let result = await fetch(`http://localhost:${pythonFlaskServerPortNumber}/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
		})
	
	return result.json()
}

async function sendMessageToTranslationServer(thisContent, thisMessage) {  
	let result = await fetch(`http://localhost:${pythonFlaskServerPortNumber}/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
		})
	
	return result.json()
}

function sendMessageAndContentToClient(client, thisMessage, thisContent) {
	if (makeSureClientIsConnectedToWebSocketServer(client)) {
		client.send(JSON.stringify({message: thisMessage, content: thisContent}));
	}
}

function makeSureClientIsConnectedToWebSocketServer(client) {
  return client.readyState === WebSocket.OPEN
}

function sendMessageAndContentToAllClients(listOfClients, thisMessage, thisContent) {
	console.log("SERVER SENDING MESSAGE TO WINDOWS")
	listOfClients.forEach((client) => {
		client.send(JSON.stringify({message: thisMessage, content: thisContent}));
	})
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function removeElementFromArray(thisElement, thisArray) {
	let indexOfElement = thisArray.indexOf(thisElement)
	if (indexOfElement !== -1) {
		thisArray.splice(indexOfElement, 1);
	}
}