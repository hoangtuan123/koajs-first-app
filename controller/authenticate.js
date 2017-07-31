
const UsersModel = require('../model/users');
const jwtToken = require('jsonwebtoken');
const config = require('../config');

exports.logon = async ctx => {
    let autho = ctx.header.authorization;
    let user = await UsersModel.findOne({ username: autho });
    console.log(user);
    var token = jwtToken.sign(user, config.secret, { expiresIn: 30 });
    ctx.body = { token: token };
}