const whiteList = [
    'https://www.google.com',
    'http://127.0.0.1:3000',
    'http://localhost:3500'
];
const corsOptions = {
    origin:(origin,callback)=>{
        if(whiteList.indexOf(origin)!==-1 || !origin){
            callback(null,true);
        }else{
            callback(new Error('NOT ALLOWED BY CORS'));
        }
    },
    optionsSuccessStatus:200
}

module.exports = corsOptions;