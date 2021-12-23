const express  = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errHandler');

const PORT = process.env.PORT || 3500;

// apply custom middleware before the build in middleware

// custom logger middleware
app.use(logger);



// cross origin resource sharing....

app.use(cors(corsOptions));

//applying build in  middleware
app.use(express.urlencoded({extended:false}));

app.use(express.json());
// set static path for public folder

app.use('/',express.static(path.join(__dirname,'/public')));
app.use('/subdir',express.static(path.join(__dirname,'/public')));
app.use('/auth',express.static(path.join(__dirname,'/public')));


// routing

app.use('/',require('./routes/root'));
app.use('/subdir',require('./routes/subdir'));
app.use('/auth',require('./routes/auth'));
app.use('/api',require('./routes/api/clients'));



app.all('*',(req,res)=>{
    // res.send('404');
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));    
    }else if(req.accepts('json')){
        res.send({error:'404 not found'});
    }else{
        res.send('404|not found')
    }
})


// apply middleware for errors
app.use(errorHandler)



app.listen(PORT,()=>{console.log(`server runnnig on port ${PORT}`)})


// // add listner on log 
// myEmitter.on('log',(msg)=> logEvents(msg));

// console.log("Event listner ::")

// // set event to log
// setTimeout(()=>{
//     myEmitter.emit("log","Log event emitted...!")
// },2000)