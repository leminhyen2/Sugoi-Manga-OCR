class TranslationTextContainer {
    constructor() {
        this.extractedText = document.getElementById("extractedText")
        this.translatedText = document.getElementById("translatedText")
    }

    displayWaitingMessage(waitMessage) { 
        this.extractedText.innerHTML = waitMessage
        this.translatedText.innerHTML = waitMessage
    }

    displayExtractedText(text) {
        this.extractedText.innerHTML = text
    }
    
    displayText(extracted, translated) {
        if (translated == "") {
            this.translatedText.innerHTML = "This text is hard, try again or move on"
            this.displayExtractedText("This text is hard, try again or move on")
        }
        else{
            this.translatedText.innerHTML = translated
            this.displayExtractedText(extracted) 
        }
    }

    setTextboxIDForEachTextSection(textboxID) {
        this.extractedText.setAttribute('data-textBoxid', textboxID);
        this.translatedText.setAttribute('data-textBoxid', textboxID);
    }

}

class DivOutline {
    constructor (outlineSpecArray) {
        this.dataArray = outlineSpecArray
        this.texboxID = this.dataArray[0]

        this.DivReadModeOutline = document.createElement("div")
        this.DivReadModeOutline.style.position = `absolute`
        this.DivReadModeOutline.id = `${this.texboxID}`

        this.DivReadModeOutline.className = "textboxOutline"

        this.DivReadModeOutline.setAttribute('isTextboxOutlineOrNot', 'isTextboxOutline');

        this.DivReadModeOutline.style.left = `${this.dataArray[1]}px`
        this.DivReadModeOutline.style.top = `${this.dataArray[2]}px`
        this.DivReadModeOutline.style.width = `${this.dataArray[3]}px`
        this.DivReadModeOutline.style.height = `${this.dataArray[4]}px`

        this.extractedText = this.dataArray[5]
        this.translatedText = this.dataArray[6]

        this.DivReadModeOutline.draggable = "true"
        this.DivReadModeOutline.ondragstart = this.drag

        //this.TranslationTextContainer = new TranslationTextContainer()
    }

    drag(e) {
        e.dataTransfer.setData("text", e.target.id);
    }

    animateHoveringOutlines() {
        this.DivReadModeOutline.addEventListener("mouseover", (e) => {
            //this.TranslationTextContainer.displayText(this.extractedText, this.translatedText)
            //this.changeBackgroundColor("rgba(255, 0, 0, 0.5)")
            this.changeBorderColor("3px solid yellow")
        })
        this.DivReadModeOutline.addEventListener("mouseout", (e) => this.changeBorderColor("3px solid rgba(0, 0, 0, 0)"))
        return this.DivReadModeOutline
    }

    animateColorfulRectangle() {
        this.DivReadModeOutline.addEventListener("mouseover", (e) => {
            this.changeBorderColor("3px solid yellow")
            //this.TranslationTextContainer.displayText(this.extractedText, this.translatedText)
            //this.TranslationTextContainer.setTextboxIDForEachTextSection(`${this.texboxID}`)
        })
        
        //this.changeBackgroundColor("rgba(255, 0, 0, 0.5)")
        this.changeBorderColor("1.5px solid rgba(0, 0, 0, 0.3)")

        this.DivReadModeOutline.addEventListener("mouseout", (e) => {
            //this.changeBorderColor("rgba(0, 0, 0, 0)")
            this.changeBorderColor("1.5px solid rgba(0, 0, 0, 0.3)")
        })

        return this.DivReadModeOutline
    }

    changeBorderColor(color) {
        this.DivReadModeOutline.style.border = color
    }

    changeBackgroundColor(color) {
        this.DivReadModeOutline.style.backgroundColor = color
    }

}

class Textbox {
    constructor(textboxInfoArray) {
        this.dataArray = textboxInfoArray

        this.container = document.createElement("div")
        this.container.id = `${this.dataArray[0]}container`
        this.container.style.position = "relative"
    
        //this.container.appendChild(new RetranslateButton(this.dataArray).initiate())
    
    }

    returnHoveringTextbox() {
        let DivReadModeOutline = new DivOutline(this.dataArray).animateHoveringOutlines()
        this.container.appendChild(DivReadModeOutline)
        return this.container
    }

    returnColorfulTextbox() {
        let DivReadModeOutline = new DivOutline(this.dataArray).animateColorfulRectangle()
        this.container.appendChild(DivReadModeOutline)
        return this.container
    }

}

class OutLinesContainerDiv {
    constructor() {
        this.container = document.getElementById("outlinesContainer")
    }

    show() {
        this.container.style.display = "block"
    }

    hide() {
        this.container.style.display = "none"
    }
    
    removeAllOutLines() {
        this.container.innerHTML = ""
    }

    injectOutline(textOutlineElement) {
        this.container.appendChild(textOutlineElement)
    }

    injectAllReadModeOutlines(outlinesList) {
        outlinesList.forEach(outline => {
            this.injectOutline(new Textbox(outline).returnHoveringTextbox())
        });
    }

    injectAllEditModeOutlines(outlinesList) {
        outlinesList.forEach(outline => {
            this.injectOutline(new Textbox(outline).returnColorfulTextbox())
        });
    }

}  

module.exports = new OutLinesContainerDiv() 