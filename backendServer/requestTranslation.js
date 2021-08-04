const fetch = require('node-fetch');

// async function sendMessageToServer(thisContent, thisMessage) {  
// 	let result = await fetch(`http://localhost:7676/`)
// 	console.log(await result.text())
// 		//.then(res => res.json())
// 		//.then(json => console.log(json));
// }

sendMessageToServer("ありがとう。来てくれて、嬉しいよ", "detect text boxes in image")

function sendMessageToServer(thisContent, thisMessage) {  
	fetch(`http://localhost:7676/`, {
			method: 'post',
			body:    JSON.stringify({content: thisContent, message: thisMessage}),
			headers: { 'Content-Type': 'application/json' },
		})
		//.then(res => console.log(res))
		.then(res => res.json())
		.then(json => console.log(json));
}

