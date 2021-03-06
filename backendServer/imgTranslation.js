let requestBingTranslation = require("./requestBingTranslation.js")
let imgToText = require("./imgToText.js")
const clipboardy = require('clipboardy');

module.exports =  async function translateTextInImage(imageFile, OCRlanguage) {
    console.log("info Text", imageFile, OCRlanguage)

    let jpText = await imgToText(imageFile, OCRlanguage)
    
    let englishText = ""
    if (jpText == "") {
        englishText = "Sorry, couldn't capture the image. Maybe you should re-adjust the image setting for a complete black or colored text on white background"
    }
    else {
        clipboardy.writeSync(jpText);
        //englishText = await Promise.resolve(requestBingTranslation(extractedLanguage, jpText, translationLanguage)).then(result => {return result})
    }
    //return {extracted:jpText, translated:englishText}

    return jpText
}

