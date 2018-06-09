var file = require('../db/file');
var express = require('express');
var router = express.Router();

router.post('/',function(req,res){
    return res.send('1');
})

router.post('/create',function(req,res){
    if(req.isAuthenticated()){
        if(!req.body.ident || !req.body.name){
            return res.send({status : 1, success : false, message : "인자값이 전달되지 않았습니다."});
        }
        file.create(req.body.ident,req.body.name,function(data){
            return res.send(data);
        })
    }else{
        return res.send({status : -1, success : false, message : "로그인이 되지 않았습니다."});
    }
})

router.post('/updateContent',function(req,res){
    if(req.isAuthenticated()){
        if(!req.body.ident || !req.body.content){
            return res.send({status : 1, success : false, message : "인자값이 전달되지 않았습니다."});
        }
        file.updateContent(req.body.ident,req.body.content,function(date){
            return res.send(date);
        })
    }else{
        return res.send({status : -1, success : false, message : "로그인이 되지 않았습니다."});
    }
})

router.post('/get',function(req,res){
    if(req.isAuthenticated()){
        if(!req.body.ident){
            return res.send({status : 1, success : false, message : "인자값이 전달되지 않았습니다."});
        }
        file.get(req.body.ident, function(date){
            return res.send(date);
        })
    }else{
        return res.send({status : -1, success : false, message : "로그인이 되지 않았습니다."});
    }
})

module.exports = router;