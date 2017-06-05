/**
 * Created by baixinxin on 2017/5/6.
 */
var mongoose = require('mongoose');
var userSchema = require('../schemas/users');

module.exports = mongoose.model('User',userSchema);