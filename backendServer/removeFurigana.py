import cv2
import numpy as np 

def saveResultImage(imagePath, resultImagePath="result.png"):
    # rotate image to so opencv can read column pixels as row pixels 
    # binarize image so there are only 0, 255 (white) values
    originalImage = cv2.imread(imagePath,0)
    imageFlip = cv2.rotate(originalImage, cv2.ROTATE_90_COUNTERCLOCKWISE)
    ret, binarizedImage = cv2.threshold(imageFlip,127,255,cv2.THRESH_BINARY)

    # get listOfPixelRows in the form of ["nonText", "text"] for easy filtering
    resultImage = []
    listOfPixelRows = []

    # if non text row, then row either has no black pixel or only one
    def checkIfNonText(row):
        return (row == 0).sum() < 5

    for row in binarizedImage:
        if (checkIfNonText(row)):
            listOfPixelRows.append("nonText")
            resultImage.append([155 for color in row])
        else:
            listOfPixelRows.append("text")
            resultImage.append(row)

    cv2.imwrite("test.png", np.array(resultImage))

    # group non text and text columns into separate groups with listOfBlocks. For example: [ ["nonText", "nonText"], ["text", ]  
    listOfBlocks = []
    nontextBlock = []
    textBlock = []

    for index, block in enumerate(listOfPixelRows):
        if (block == "nonText"):
            if (textBlock != []):
                listOfBlocks.append(textBlock)
            textBlock = []
            nontextBlock.append(block)
            if (index == len(listOfPixelRows)-1):
                listOfBlocks.append(nontextBlock)
        else: 
            if (nontextBlock != []):
                listOfBlocks.append(nontextBlock)
            nontextBlock = []
            textBlock.append(block)
            if (index == len(listOfPixelRows)-1):
                listOfBlocks.append(textBlock)


    # convert block from list to object and add properties to each block for further processing 
    listOFilteredBlocks = []

    startingIndexInImage = 0
    for index, block in enumerate(listOfBlocks):
        startingIndex = startingIndexInImage
        startingIndexInImage = startingIndexInImage + len(block)
        if (block[0] == "text"):
            listOFilteredBlocks.append({"isTextBlockOrNot": True, "value": block, "blockLength": len(block), "blockIndex": index, "startingIndex": startingIndex, "endingIndex": startingIndex+len(block)-1})
        else:
            listOFilteredBlocks.append({"isTextBlockOrNot": False, "value": block, "blockLength": len(block), "blockIndex": index, "startingIndex": startingIndex, "endingIndex": startingIndex+len(block)-1})

    # get the width of the biggest text block 
    listOfTextBlocks = [block["blockLength"] for block in listOFilteredBlocks if block["isTextBlockOrNot"] == True]
    widthOfBiggestTextBlock = max(listOfTextBlocks)

    # get only furigana blocks if block is less than or equal to half of biggest block's width
    listOfFuriganaBlocks = [block for block in listOFilteredBlocks if (block["isTextBlockOrNot"] == True and block["blockLength"] <= widthOfBiggestTextBlock/2)]

    # remove furigana block from a copy of the rotated orignal image
    copyOfImageFlip = imageFlip
    for furiganaBlock in listOfFuriganaBlocks:
        copyOfImageFlip[furiganaBlock["startingIndex"]-2:furiganaBlock["endingIndex"]+2] = [255 for pixel in row]

    # cv2.imwrite("images/mask.png", np.array(copyOfImageFlip))

    # rotate image back to normal 
    imageRotatedToOriginal = cv2.rotate(copyOfImageFlip, cv2.ROTATE_90_CLOCKWISE)
    cv2.imwrite(resultImagePath, imageRotatedToOriginal)

