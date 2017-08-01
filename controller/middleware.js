const jwtToken = require('jsonwebtoken');
const config = require('../config');

exports.checkAuthetication = async (ctx, next) => {
    let token = ctx.header.authorization;
    token = token.replace('Bearer ', '');
    if (token) {
        try {
            let encodeKey = Buffer.from(config.secret, 'ascii');
            encodeKey = encodeKey.toString('base64');
            let isVerify = await jwtToken.verify(token, encodeKey);
            console.log(isVerify);
            await next();
        } catch (error) {
            ctx.status = 401;
            ctx.body = error;
        }
    }
    else {
        ctx.status = 401;
    }
}