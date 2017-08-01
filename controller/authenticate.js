
const UsersModel = require('../model/users');
const jwtToken = require('jsonwebtoken');
const config = require('../config');

exports.logon = async ctx => {
    try {
        let autho = ctx.header.authorization;
        autho = autho.replace('Basic ','');
        let authoUser = Buffer.from(autho, 'base64').toString();
        let authoUserArray = authoUser.split(':');
        let user = await UsersModel.findOne({ username: authoUserArray[0], password: authoUserArray[1], });
        if (user) {
            let userInfo = {
                username: user.username,
                admin: user.admin
            };
            let encodeKey = Buffer.from(config.secret, 'ascii');
            encodeKey = encodeKey.toString('base64');
            var token = jwtToken.sign(userInfo, encodeKey, { expiresIn: 1000 });
            ctx.body = { token: token };
        }
        else {
            ctx.status = 401;
        }

    } catch (error) {
        ctx.status = 500;
        ctx.body = error;
    }
}