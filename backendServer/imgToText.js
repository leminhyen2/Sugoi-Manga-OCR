 const tesseract = require("./node-tesseract-ocr.js")

module.exports =  async function (imageFile, OCRlanguage="japaneseVertical") {
	let config
	if (OCRlanguage === "japaneseVertical") {
		config = {
			lang: "jpn_vert",
			oem: 1,
			psm: 5,
		}
	}
	else if (OCRlanguage === "japaneseHorizontal") {
		config = {
			lang: "jpn",
			oem: 1,
			psm: 6,
		}
	}
	else if (OCRlanguage === "chineseVertical") {
		config = {
			lang: "chi_sim_vert",
			oem: 1,
			psm: 5,
		}
	}
	else if (OCRlanguage === "chineseHorizontal") {
		config = {
			lang: "chi_sim",
			oem: 1,
			psm: 6,
		}
	}
	else if (OCRlanguage === "koreanVertical") {
		config = {
			lang: "kor",
			oem: 1,
			psm: 5,
		}
	}
	else if (OCRlanguage === "koreanHorizontal") {
		config = {
			lang: "kor",
			oem: 1,
			psm: 6,
		}
	}


	try{
		text = await tesseract.recognize(imageFile, config)
	}
	catch(error){
		console.log(error.message)
	}

	let jpTextWithNoSpace = text
	
	if ( (OCRlanguage != "koreanVertical") && (OCRlanguage != "koreanVertical") )   {
		jpTextWithNoSpace = text.replace(/\s/g, '')
	}

	let processedText = processExtractedText(jpTextWithNoSpace)

	console.log("####################")
	console.log(OCRlanguage)
	console.log(processedText)

	return processedText
}

function processExtractedText(extractedText) {
	let result = ""

	result = extractedText.replace(/:/g, "")
	result = result.replace("先�??", "先輩");
	result = result.replace("{", "")	
	result = result.replace("}", "")	
	result = result.replace("||", "")
	result = result.replace("~", "")	
	result = result.replace("�?", "")
	result = result.replace("<", "")
	result = result.replace("�?", "")
	result = result.replace("(", "")
	result = result.replace(")", "")
	result = result.replace(/カ$/, "");
	result = result.replace(/リ$/, "");
	result = result.replace(/p$/, "");
	result = result.replace(/・$/, "");
	result = result.replace(/�?$/, "");
	result = result.replace(/③$/, "");
	result = result.replace(/②$/, "");
	result = result.replace(/ジ$/, "");
	result = result.replace(/ひ$/, "");
	result = result.replace(/�?$/, "");

	result = result.replace("=", "!")
	result = result.replace("/", "!");
	result = result.replace(/ダグ/g, "!")
	result = result.replace(/グ$/, "!");
	result = result.replace(/ダ$/, "!");
	result = result.replace(/グ!/, "!");
	result = result.replace(/ク$/, "!");
	result = result.replace(/2$/, "!");
	result = result.replace(/�?!$/, "!");
	result = result.replace(/�?!!$/, "!");
	result = result.replace(/リ!$/, "!");

	
	result = result.replace(/9$/, "?");
	result = result.replace("9?", "?")


	result = result.replace(/ー1/g, "ー")
	result = result.replace(/1/g, "ー");
	result = result.replace("|", "")

	
	return result
}
