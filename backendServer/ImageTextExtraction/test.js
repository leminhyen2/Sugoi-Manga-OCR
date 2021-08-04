let listOfCoordinates = require("./listOfCoordinates.js")
let processingList = require("./processedList.js")

let completeList = processingList(listOfCoordinates)

async function seePromise() {
    console.log(await completeList)
}

seePromise()
