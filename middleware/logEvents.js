const {format}= require('date-fns');
const {v4:uuid} = require('uuid')

const fs  = require('fs');
const fsPromise = require('fs').promises;
const path = require('path')


const logEvents = async(message,filename)=>{
    const dateTime =  `${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    console.log("",logItem);

    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromise.mkdir(path.join(__dirname,'..','logs'))
        }
        //testing for 
        await fsPromise.appendFile(path.join(__dirname,'..',"logs",filename),logItem);

    }
    catch(err){
        console.error(err);
    }
}

const logger = (req,res,next)=>{
    const message = `${req.method}\t${req.headers.origin}\t${req.url}`;
    // console.log(message);
    logEvents(message,'reqLog.txt')
    next();
}

module.exports = {logger,logEvents};