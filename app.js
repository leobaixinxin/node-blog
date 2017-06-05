/**
 * Created by baixinxin on 2017/5/6.
 */
// 应用程序入口文件

var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
// 加载body-parser用来处理post提交过来的数据
var bodyParser = require('body-parser');
// 加载cookies模块
var Cookies = require('cookies');
// 引入用户模型，来查询数据库
var User = require('./models/user');
var app = express();
// var router = express.Router();

// 设置静态资源目录
app.use('/public',express.static(__dirname+'/public'));
//配置应用模板
//定义当前模板使用的模板引擎
//第一个参数是模板引擎的名称，也就是模板的后缀
//  第二个参数用于解析处理模板内容
app.engine('html',swig.renderFile);
//设置模板文件存放目录，第一个文件必须是views，第二个文件是存放目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine，第二个参数参照app.engine 中的第一个参数
app.set('view engine','html');

// 取消模板缓存
swig.setDefaults({cache:false});
// bodyParser 设置
app.use(bodyParser.urlencoded({extended:true}));
// 对cookies进行设置
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);
    // 解析登录用户的cookie信息
    // 1.保存用户登录信息的对象
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
                req.userInfo = JSON.parse(req.cookies.get('userInfo'));
                // console.log(req.userInfo);
                //检查登录用户是否为管理员
                User.findById(req.userInfo._id).then(function(userInfo){
                    console.log(userInfo);
                    req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                    next();
                });

         }catch (e){
                next();
         }
    }else{
        next();
    }
});

// 根据不同功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/',require('./routers/main'));
app.use('/api',require('./routers/api'));

// app.listen(8081,function(){
//     console.log('jianting 8081');
// });

mongoose.connect('mongodb://localhost:27017/nodeblog',function(err){
      if(err){
          console.log('数据库连接失败');
      }else{
          console.log('数据库连接成功');
          app.listen(8081);
          console.log('监听8081端口');
      }
});


// app.get('/',function(req,res,next){
//
//     // res.send('<h1>dgdhdg</h1>');
//     res.render('index');
//
// });

