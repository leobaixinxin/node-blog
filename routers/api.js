/**
 * Created by baixinxin on 2017/5/6.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Content = require('../models/content');

//定义一个注册返回的接口
var  responseData;
router.use(function (req,res,next) {
    responseData = {
        code:'',
        message:''
    };
    next();
});

// 用户注册路由
//    注册信息验证
//         1. 基本输入格式验证
//         2. 数据库验证是否注册
router.post('/user/register',function(req,res,next){
    var username = req.body.username,
        password = req.body.password,
        repassword = req.body.repassword;

    if(username === ''){
        responseData.code = 1;
        responseData.message='用户名不能为空';
        res.json(responseData);
    }
    if(password === ''){
        responseData.code = 2;
        responseData.message='密码不能为空';
        res.json(responseData);
    }

    if(repassword!==password ){
        responseData.code = 3;
        responseData.message='密码不不一样';
        res.json(responseData);
    }

    // 对于数据库的相关操作
    User.findOne({
        username:username
    }).then(function(userInfo){
        console.log(userInfo);
        if(userInfo){
            //表示数据控中有该记录
            responseData.code = 4;
            responseData.message = '用户名已注册';
            res.json(responseData);
        }
        //保存用户注册信息
        var user = new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function(newUserInfo){
        console.log(newUserInfo);
        responseData.code = 0;
        responseData.message = '注册成功';
        responseData.userInfo = {
            _id:newUserInfo._id,
            username:newUserInfo.username
        };
        req.cookies.set("userInfo",JSON.stringify( responseData.userInfo));
        res.json(responseData);
    });



    // res.send(req.body);
});

router.post('/user/login',function(req,res,next){
    var username = req.body.username,
        password = req.body.password;
    if(username===''||password===''){
        responseData.code = 1;
        responseData.message='用户名和密码不能为空';
        res.json(responseData);
    }

    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名和密码错误';
            res.send(responseData);
        }
        responseData.code = 0;
        responseData.message = '用户登录成功';
        responseData.userInfo = {
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify(responseData.userInfo));
        res.send(responseData);
    })

});

router.get('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

// 首次加载评论的条目
router.get('/comment',function(req,res){
    var contentid = req.query.contentid;
    Content.findOne({
        _id:contentid
    }).then(function(content){
        responseData.data = content.comments;
        res.json(responseData);
    })

});
//评论提交
router.post('/comment/post',function (req,res) {
    var contentId = req.body.contentid||'';
    var postdata = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };

    //查询当前内容的信息
    Content.findOne({
        _id:contentId
    }).then(function(content){
        content.comments.push(postdata);
        return content.save();
    }).then(function(newContent){
        responseData.message = "评论成功";
        responseData.code = 0;
        responseData.data = newContent;
        res.json(responseData);
    })

});
module.exports = router;