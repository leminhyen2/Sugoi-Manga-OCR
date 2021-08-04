const CreateMode = require("./CreateMode.js")
const OutlinesContainerDiv = require("./OutlinesContainerDiv.js")
const ImageSaveData = require("./ImageSaveData.js")

class ListOfModes {
    constructor() {
        this.currentMode = "OCR Mode"
        this.currentButton = document.getElementById("OCRmode")

        this.OCRmodeButton = document.getElementById("OCRmode")
        this.deleteModeButton = document.getElementById("deleteMode")
        this.createModeButton = document.getElementById("createMode")
        this.readModeButton = document.getElementById("readMode")

        this.arrayOfButtons = [this.OCRmodeButton, this.deleteModeButton, this.createModeButton, this.readModeButton]
    }

    listen() {
        this.OCRmodeButton.addEventListener("click", (e) => {
            this.setOCRmode()
        })
        this.deleteModeButton.addEventListener("click", (e) => {
            console.log("delete button was clicked")
            this.setDeleteMode()
        })
        this.createModeButton.addEventListener("click", (e) => {
            this.setCreateMode()
        })
        this.readModeButton.addEventListener("click", (e) => {
            this.setReadMode()
        })
    }

    initiate() {
        this.currentMode = "OCR Mode"
        this.currentButtons = this.OCRmodeButton
        this.currentButtons.disabled = true
    }

    turnOnAllButtons() {
        this.OCRmodeButton.disabled = false
        this.deleteModeButton.disabled = false
        this.createModeButton.disabled = false    
    }


    enableOtherButtons() {
        for (let i=0; i < this.arrayOfButtons.length; i++) {
            if (this.arrayOfButtons[i] !== this.currentButtons) {
                this.arrayOfButtons[i].disabled = false
            }
        }
    }

    setDeleteMode() {
        OutlinesContainerDiv.show()
        OutlinesContainerDiv.removeAllOutLines()
        OutlinesContainerDiv.injectAllEditModeOutlines(ImageSaveData.getListOfTextBoxes())

        CreateMode.turnOff()

        this.currentMode = "Delete Mode"
        this.currentButtons = this.deleteModeButton
        this.currentButtons.disabled = true
        this.enableOtherButtons()  
    }

    setOCRmode() {
        OutlinesContainerDiv.show()
        OutlinesContainerDiv.removeAllOutLines()
        OutlinesContainerDiv.injectAllEditModeOutlines(ImageSaveData.getListOfTextBoxes())

        CreateMode.turnOff()

        this.currentMode = "OCR Mode"
        this.currentButtons = this.OCRmodeButton
        this.currentButtons.disabled = true
        this.enableOtherButtons()
    }

    setReadMode() {
        OutlinesContainerDiv.show()
        OutlinesContainerDiv.removeAllOutLines()
        OutlinesContainerDiv.injectAllReadModeOutlines(ImageSaveData.getListOfTextBoxes())

        CreateMode.turnOff()

        this.currentMode = "Read Mode"
        this.currentButtons = this.readModeButton
        this.currentButtons.disabled = true
        this.enableOtherButtons()
    }

    setCreateMode() {
        OutlinesContainerDiv.hide()

        this.currentMode = "Create Mode"
        this.currentButtons = this.createModeButton
        this.currentButtons.disabled = true
        this.enableOtherButtons()

        CreateMode.turnOn()
    }

    getCurrentMode() {
        return this.currentMode
    }
}

module.exports = new ListOfModes()
