const OverlayCanvas = require("./Components/Canvas/OverlayCanvas.js")
const ImageCanvas = require("./Components/Canvas/ImageCanvas.js")

class ImageSaveData {
    constructor(receivedImageFile, receivedFileName) {
        //this.textBoxArray = []
        this.listOfTextBoxes = new Map()
        this.imageSizeArray = []
        this.imageFile = receivedImageFile
        this.fileName = receivedFileName
    }

    checkIfTextboxExists(textboxID) {
        return this.listOfTextBoxes.has(textboxID)
    }

    getImageFile() {
        return this.imageFile
    }

    setFileName(name) {
        this.fileName = name
    }

    getFileName() {
        return this.fileName
    }

    addTextBoxInfo(infoArray) {
        let textboxID = `${infoArray[0]}${infoArray[1]}`
        infoArray.unshift(textboxID)
        this.listOfTextBoxes.set(textboxID, infoArray)
    }

    getTextbox(textboxID) {
        return this.listOfTextBoxes.get(textboxID)
    }

    getNumberOfTextBoxes() {
        return this.listOfTextBoxes.size
    }

    getExtractedText(textboxID) {
        return this.listOfTextBoxes.get(textboxID)[5]
    }

    saveExtractedText(textboxID, editedText) {
        console.log(textboxID, editedText)

        let currentTextboxArray = this.getTextbox(textboxID)
        currentTextboxArray[5] = editedText
        this.listOfTextBoxes.set(textboxID, currentTextboxArray)
    }

    saveTranslatedText(textboxID, editedText) {
        console.log(typeof textboxID)
        console.log(this.getListOfTextBoxes())

        let currentTextboxArray = this.getTextbox(textboxID)
        currentTextboxArray[6] = editedText
        this.listOfTextBoxes.set(textboxID, currentTextboxArray)
    }

    getTranslatedText(textboxID) {
        return this.listOfTextBoxes.get(textboxID)[6]
    }

    convertToJSON() {
        return JSON.stringify(Object.fromEntries(this.getListOfTextBoxes().entries()))
    }

    getListOfTextBoxes() {
        return this.listOfTextBoxes
    }

    deleteTextBox(textboxID) {
        this.listOfTextBoxes.delete(textboxID)
    }

    reset() {
        this.listOfTextBoxes.clear()
    }

    replaceWithNewData(newData) {
        this.reset()
        this.listOfTextBoxes = newData
    }

    loadPreviousSaveData(previousData) {
        let convertedSaveData = new Map(Object.entries(JSON.parse(previousData)))
        this.replaceWithNewData(convertedSaveData)
    }

    convertAndAddAllCoordinatesArraysFromServer(thisArrayOfCoordinatesArray) {
        
        let minimumWidth = ImageCanvas.getImageWidthHeight().width / 50 //60 to preserve leftover words
    
        this.listOfTextBoxes.clear()
    
        thisArrayOfCoordinatesArray.forEach(coordinatesArray => {            
            let currentWidth = coordinatesArray[2]
            let currentHeight = coordinatesArray[3]
            let textboxID = `${coordinatesArray[0]}${coordinatesArray[1]}`
    
            if (currentWidth < minimumWidth) {
                console.log("this is not a text box")
            }
            else {
                let newX = coordinatesArray[0] - 2
                let newY = coordinatesArray[1] - 2
                let newWidth = coordinatesArray[2] 
                let newHeight = coordinatesArray[3] 
    
                let emptyText = "No text yet"
                let convertedTextboxArray = [textboxID, newX, newY, newWidth, newHeight, emptyText, emptyText]
    
                this.listOfTextBoxes.set(textboxID, convertedTextboxArray)
            }
    
        });
    
    }

    async preprocessListOfTextboxes(listOfCoordinates) {
        function addWidthHeightToArray(coordinatesArray) {
            let arrayToWorkWith = coordinatesArray
            let width = arrayToWorkWith[2] - arrayToWorkWith[0]
            let height = arrayToWorkWith[3] - arrayToWorkWith[1]
            let xCoordinate = arrayToWorkWith[0]
            let yCoordinate = arrayToWorkWith[1]
            let resultArray = [xCoordinate, yCoordinate, width, height]
            return resultArray
        }
    
        let listWithNoWidthHeight = await listOfCoordinates
        let arrayWithWidthHeight = listWithNoWidthHeight.map(coordinatesArray => addWidthHeightToArray(coordinatesArray));
        return arrayWithWidthHeight
    }
    
    processCoordinateArray(thisArrayOfCoordinatesArray) {
        thisArrayOfCoordinatesArray.forEach(coordinatesArray => {
            let textboxID = `${coordinatesArray[0]}${coordinatesArray[1]}`
            coordinatesArray.unshift(textboxID)
            coordinatesArray.push("", "")
            console.log(coordinatesArray)
        });
    }

    saveImageSize(width, height) {
        console.log("saveImageAgain")
        this.imageSizeArray = []
        this.imageSizeArray.push(width, height)
    }

    returnImageSize() {
        return this.imageSizeArray
    }
}

module.exports = new ImageSaveData()
