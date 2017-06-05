/**
 * Created by baixinxin on 2017/5/6.
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Content = require('../models/content');

var data = {};
// 中间件处理通用数据
router.use(function (req,res,next) {
    data = {
        userInfo:req.userInfo,
        categories:[]
    };
    Category.find().then(function(categories){
        data.categories = categories;
        next();
    })
});

router.get('/',function(req,res,next){

        data.category=req.query.category||'';
        data.limit=4;
        data.page=Number(req.query.page|| 1);
        data.pages=0;
        data.count=0;
        data.contents='';

    var where = {};
    if(data.category){
        where.category = data.category;
    }

  Content.where(where).count().then(function(count){
        data.count = count;
        data.pages = Math.ceil(data.count/data.limit);
        // page最大值
        data.page = Math.min(data.page,data.pages);
        // page最小值
        data.page = Math.max(data.page,1);
        var skip = (data.page-1)*data.limit;
       return  Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1})
    }).then(function(contents){
        data.contents = contents;
        console.log(data);
        res.render('main/index',data);
    });
});

router.get('/view',function (req,res) {
   var contentId = req.query.contentid;
   Content.findOne({
       _id:contentId
   }).populate('user').then(function(content){
       data.content = content;
       content.views++;
       content.save();
       console.log(data);
       res.render('main/view',data);
   })
});
module.exports = router;