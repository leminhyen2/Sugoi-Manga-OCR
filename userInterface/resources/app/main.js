const listOfVariablesData = require("./listOfVariablesData.json")
const websocketServerPortNumber = listOfVariablesData.websocketServerPortNumber
const pythonFlaskServerPortNumber = listOfVariablesData.pythonFlaskServerPortNumber

const {app, BrowserWindow, globalShortcut, screen, ipcMain} = require('electron');

const fetch = require('node-fetch');

let mainWindow 
let translationWindow 

const generateMainWindow = () => {
    mainWindow = new BrowserWindow({
        title: "Menu Window",
        x: 200,
        y: 400,
        width: 550,
        height: 350,
        alwaysOnTop: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
});

  mainWindow.loadFile('./mainMenuWindow/mainMenuWindow.html')
}

const generateTranslationWindow = () => {
  translationWindow = new BrowserWindow({
      title: "Translation Display Window",
      opacity: 1,
      x: 800,
      y: 300,
      width: 600,
      height: 250,
      alwaysOnTop: true,
      webPreferences: {
          enableRemoteModule: true,
          nodeIntegration: true
      }
});
  translationWindow.loadFile('./translationWindow/translationWindow.html')
  //translationWindow.hide()
}

// let autoModeWindow

// const generateAutoModeWindow = () => {
//   autoModeWindow = new BrowserWindow({
//       title: "Auto Mode Window",
//       opacity: 1,
//       transparent: false,
//       frame: true,
//       alwaysOnTop: true,
//       webPreferences: {
//           enableRemoteModule: true,
//           nodeIntegration: true
//       }
// });
//   autoModeWindow.loadFile('./autoModeWindow/autoModeWindow.html')
//   autoModeWindow.maximize();
//   autoModeWindow.show();
//   setTimeout(function(){ autoModeWindow.minimize() }, 400);
//   //autoModeWindow.removeMenu()
// }

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// })

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })


// This method will be called when Electron has finished
// initialization and is rea browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  generateMainWindow()
  generateTranslationWindow()
  //generateAutoModeWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      generateMainWindow()
      generateTranslationWindow()
      //generateAutoModeWindow()
    }
  })
})

app.on('will-quit', () => {  
	// Unregister all shortcuts.
  globalShortcut.unregisterAll()

  closeTranslationAggregator()

  sendMessageToServer(pythonFlaskServerPortNumber, "no content", "close server") //close python flask server
  sendMessageToServer(websocketServerPortNumber, "no content", "close server") //close node server
})



app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


function sendMessageToServer(serverPort, thisContent, thisMessage) {  
	fetch(`http://localhost:${serverPort}/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => res.json())
		.then(json => console.log(json));

}

const exec = require('child_process').exec;

function closeTranslationAggregator() {
  exec('taskkill /f /im TranslationAggregator.exe');
};