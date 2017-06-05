/**
 * Created by baixinxin on 2017/5/6.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Content = require('../models/content');

// 首页
router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

// 用户管理
router.get('/user',function (req,res) {
    //实现数据分页
    // limit()方法 限制显示条数
    // skip() 方法 调到那一页显示
    //每页显示条数
    var limit = 2;
    // 当前显示页数
    var page = Number(req.query.page|| 1);
    var pages = 0;
    User.count().then(function(count){
        // 对于pages向上取整
        pages = Math.ceil(count/limit);
        // page最大值
        page = Math.min(page,pages);
        // page最小值
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        // 数据库读取用户模型
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,

                pagedir:'user',
                count:count,
                page:page,
                pages:pages,
                limit:limit
            });
        });

    });



});

router.get('/category',function(req,res){
    //实现数据分页
    // limit()方法 限制显示条数
    // skip() 方法 调到那一页显示
    //每页显示条数
    var limit = 2;
    // 当前显示页数
    var page = Number(req.query.page|| 1);
    var pages = 0;
    Category.count().then(function(count){
        // 对于pages向上取整
        pages = Math.ceil(count/limit);
        // page最大值
        page = Math.min(page,pages);
        // page最小值
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        // 数据库读取用户模型
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (Categories) {
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                Categories:Categories,
                pagedir:'category',
                count:count,
                page:page,
                pages:pages,
                limit:limit
            });
        });

    });

});

router.get('/category/add',function(req,res){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    });
});

router.post('/category/add',function(req,res){
    var name  = req.body.name || '';
    if(name ===''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        });
        return;
    }
    // 如果分类名称存在
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                Userinfo:req.userInfo,
                message:'分类已经存在'
            });
            return Promise.reject();
        }else{
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'添加分类成功',
            url:'/admin/category'
        })
    })
});

router.get('/category/edit',function (req,res) {
    var id = req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    })

});

router.post('/category/edit',function(req,res){
    var id = req.query.id || '';
    var name = req.body.name || '';
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{
            if(name === category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'分类修改成功',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
               return Category.findOne({
                    _id:{$ne:id},
                    name:name
                })
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中已经存在同名分类'
            });
            return Promise.reject();
        }else{
           return Category.update({
                _id:id
            },{
                name:name
            })
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        });
    })
});

router.get('/category/delete',function(req,res){
    var id = req.query.id || '';
    Category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除分类成功',
            url:'/admin/category'
        });
    })
});

//内容相关的路由
router.get('/content',function(req,res){
    //实现数据分页
    // limit()方法 限制显示条数
    // skip() 方法 调到那一页显示
    //每页显示条数
    var limit = 2;
    // 当前显示页数
    var page = Number(req.query.page|| 1);
    var pages = 0;
    Content.count().then(function(count){
        // 对于pages向上取整
        pages = Math.ceil(count/limit);
        // page最大值
        page = Math.min(page,pages);
        // page最小值
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        // 数据库读取用户模型
        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({addTime:-1}).then(function (Contents) {
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                Contents:Contents,
                pagedir:'content',
                count:count,
                page:page,
                pages:pages,
                limit:limit
            });
        });

    });


});
router.get('/content/add',function(req,res){
    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            pagedir:'content',
            categories:categories
        })
    });
});
router.get('/content_edit',function(req,res){
    res.render('admin/content_edit',{
        userInfo:req.userInfo
    })
});

router.post('/content/add',function(req,res){
         var category = req.body.category;
         var title = req.body.title;
         if(category === ''){
             res.render('admin/error',{
                 UserInfo:req.userInfo,
                 message:'分类不能为空'
             });
         }
         if(title === ''){
             res.render('admin/error',{
                 UserInfo:req.userInfo,
                 message:'标题不能为空'
             });
         }

         new Content({
             category:req.body.category,
             title:req.body.title,
             user:req.userInfo._id.toString(),
             description:req.body.description,
             content:req.body.content
        }).save().then(function(rs){
            res.render('admin/success',{
                UserInfo:req.userInfo,
                message:'内容保存成功',
                url:'/admin/content'
            });
        });



});

router.get('/content/edit',function(req,res){
    var id = req.query.id || '';
    var categories = [];
    Category.find().sort({_id:-1}).then(function(rs){
         categories = rs;
         return Content.findOne({
             _id:id
         }).populate('category');
    }).then(function(content){
            console.log(content);
            if(!content){
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'该篇内容已经存在'
                });
                return Promise.reject();
            }else{
                res.render('admin/content_edit',{
                    userInfo:req.userInfo,
                    content:content,
                    categories:categories
                })
            }
        })
});

router.post('/content/edit',function(req,res){
    var id = req.query.id||'';
    var category = req.body.category;
    var title = req.body.title;
    if(category === ''){
        res.render('admin/error',{
            UserInfo:req.userInfo,
            message:'分类不能为空'
        });
    }
    if(title === ''){
        res.render('admin/error',{
            UserInfo:req.userInfo,
            message:'标题不能为空'
        });
    }

    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function(){
        res.render('admin/success',{
            UserInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content/edit?id='+id
        });
    })

});

router.get('/content/delete',function(req,res){
    var id = req.query.id;
    Content.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容删除成功',
            url:'/admin/content'
        });
    })
});
module.exports = router;
// var mongoose = require('mongoose');

