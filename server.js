require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;

// connect the db at the first time if it cannot we stop the process
connectDB();

// apply custom middleware before the build in middleware

// custom logger middleware
app.use(logger);

// add this before cores options 
// fetch cookies  credentials requirement
app.use(credentials);

// cross origin resource sharing....
app.use(cors(corsOptions));

//applying build in  middleware
app.use(express.urlencoded({ extended: false }));

/* middleware for cookies */
app.use(cookieParser());

app.use(express.json());
// set static path for public folder

app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));
app.use('/auth', express.static(path.join(__dirname, '/public')));


// routing

app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/auth', require('./routes/old_auth'));
app.use('/auth', require('./routes/auth'));

/* add middleware for verifyJWT  */
app.use(verifyJWT); /* everything after this go through this middleware */
app.use('/api', require('./routes/api/clients'));




app.all('*', (req, res) => {
    // res.send('404');
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.send({ error: '404 not found' });
    } else {
        res.send('404|not found')
    }
})


// apply middleware for errors
app.use(errorHandler)


mongoose.connection.once('open', () => {
    console.log("DB connected");
    app.listen(PORT, () => { console.log(`server runnnig on port ${PORT}`) })
})




// // add listner on log
// myEmitter.on('log',(msg)=> logEvents(msg));

// console.log("Event listner ::")

// // set event to log
// setTimeout(()=>{
//     myEmitter.emit("log","Log event emitted...!")
// },2000)