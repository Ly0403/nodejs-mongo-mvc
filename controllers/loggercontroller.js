const { Console } = require("console");
const fs = require("fs");

const myLogger = new Console({
  stdout: fs.createWriteStream("./log/console.log"),
  stderr: fs.createWriteStream("./log/error.log"),
});

function consoleLog(message){
    myLogger.log(message);
}

function errorLog(message){
    myLogger.error(message);
}

module.exports={consoleLog,errorLog}