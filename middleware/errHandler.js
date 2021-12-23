const { logEvents } = require("./logEvents");


const errorHandler=(err,req,res,next)=>{
    console.log(err.stack);
    // internal server error
    logEvents(`${err.name}\t${err.message}`,'errLog.txt');
    res.status(500).send(err.message);
}

module.exports = errorHandler;