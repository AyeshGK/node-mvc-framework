const express = require('express')
const router = express.Router();
// const path = require('path');

const validate=(req,res,next)=>{
    console.log("validate inputs");
    next();
}

const save=(req,res,next)=>{
    console.log("save in the database");
    next();
}

const redirect_home = (req,res)=>{
    console.log("redircting...!")
    res.redirect(200,'/')
}

router.get('/sign-up',[validate,save,redirect_home]);

module.exports = router;