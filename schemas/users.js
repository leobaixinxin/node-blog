/**
 * Created by baixinxin on 2017/5/6.
 */
var mongoose = require('mongoose');

//定义用户表结构
module.exports = new mongoose.Schema({
    // 用户名
    username:String,
    // 密吗
    password:String,

    isAdmin:{
        type:Boolean,
        default:false
    }
});