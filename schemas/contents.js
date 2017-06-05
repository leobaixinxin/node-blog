/**
 * Created by baixinxin on 2017/5/16.
 */
/**
 * Created by baixinxin on 2017/5/6.
 */
var mongoose = require('mongoose');

//分类表结构
module.exports = new mongoose.Schema({

    //关联字段 -- 内容分类ID
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    title:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    addTime:{
        type:Date,
        default:new Date()
    },
    views:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        default:''

    },
    content:{
        type:String,
        default:''
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
});/**
 * Created by baixinxin on 2017/5/20.
 */
