const { exec } = require("child_process");

module.exports = new Promise (async resolve => {exec("python ./test.py --additional_filtering ./MangaTextDetection/evangelion2.jpg", (error, stdout, stderr) => {
    let result = []
        if (error) {
            console.log(`error: ${error.message}`);
            resolve(error.message)
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            resolve(stderr)
        }
        //console.log(`stdout: ${stdout}`);
        result = JSON.parse(stdout)
        resolve(result)
    });    
})

