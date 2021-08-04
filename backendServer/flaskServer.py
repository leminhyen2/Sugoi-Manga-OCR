from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin

import json

import takeScreenshot as screenshot 
import takeFullScreenshot as fullScreenshot 

import removeBackground as background

import ImageTextExtraction.mainSegmentation as computerVision

import removeFurigana 

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods = ['POST'])
@cross_origin()

def sendImage():
    data = request.get_json()
    message = data.get("message")
    content = data.get("content")

    print("this content", content)
    # if (message == "crops then changes image color"):
    #     textPostionObject = content["textPostionObject"]
    #     x = textPostionObject["x"]
    #     y = textPostionObject["y"]
    #     width = textPostionObject["width"]
    #     height = textPostionObject["height"]
    #     screenshot.takeScreenshot(y, x, width, height)

    #     imageColorValuesObject = content["imageColorValuesObject"]
    #     print(imageColorValuesObject)
    #     hMin = imageColorValuesObject["hMin"]
    #     sMin = imageColorValuesObject["sMin"]
    #     vMin = imageColorValuesObject["vMin"]
    #     hMax = imageColorValuesObject["hMax"]
    #     sMax = imageColorValuesObject["sMax"]
    #     vMax = imageColorValuesObject["vMax"]
    #     binarizedValue = imageColorValuesObject["binarizedValue"]
    #     background.removeBackground(hMin, sMin, vMin, hMax, sMax, vMax, binarizedValue)

    if (message == "crops image at this position"):
        textPostionObject = content["textPostionObject"]
        x = textPostionObject["x"]
        y = textPostionObject["y"]
        width = textPostionObject["width"]
        height = textPostionObject["height"]
        screenshot.takeScreenshot(y, x, width, height)

    if (message == "take full screenshot"):
        fullScreenshot.takeFullScreenshot()

    if (message == "remove furigana and save image"):
        imagePath = content
        print(imagePath)
        removeFurigana.saveResultImage(imagePath, imagePath)

    if (message == "changes image color"):
        hMin = content["hMin"]
        sMin = content["sMin"]
        vMin = content["vMin"]
        hMax = content["hMax"]
        sMax = content["sMax"]
        vMax = content["vMax"]
        binarizedValue = content["binarizedValue"]

        background.removeBackground(hMin, sMin, vMin, hMax, sMax, vMax, binarizedValue)
        print(content)

    if (message == "detect text boxes in image"):
        listOfTextboxes = computerVision.segment_image_file("capturedImage.png", "none")
        print(listOfTextboxes)
        return json.dumps(listOfTextboxes)

    if (message == "close server"):
        shutdown_server()

    return json.dumps(content)

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

if __name__ == "__main__":
    app.run()