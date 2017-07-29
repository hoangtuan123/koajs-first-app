const ImagesModel = require('../model/images');
let request = require('request');

exports.getImages = async (ctx) => {
    console.log(ctx.query);
    let limit = ctx.query.limit ? parseInt(ctx.query.limit) : 20; 
    let pageCurrent = ctx.query.page ? parseInt(ctx.query.page) : 1; 
    let offset = (pageCurrent - 1)*limit;
    let totalRow = await ImagesModel.find({}).count(); 
    let images = await ImagesModel.find({}).skip(offset).limit(limit);
    let totalPage = Math.floor(totalRow/limit);
    images = {
        page: pageCurrent,
        totalRow: totalRow,
        limit:limit,
        totalPage:totalPage,
        images:images
    }
    if (!images)
        throw new Error("There was an error retrieving your images");
    else
        ctx.body = images;
}


exports.createImages = async (ctx) => {
    let access_token = ctx.query.access_token;
    let sexy = [1786207988368795, 637445302949772, 1224869587565040, 169974406437267];
    let isResSuccess = [];
    for (let i = 0; i < sexy.length; i++) {
        let pageId = sexy[i];
        let linkFacebook = `https://graph.facebook.com/v2.9/${pageId}/photos/`;
        let images = await getRandomImage(linkFacebook, access_token, 500, 0, pageId);
        console.log('images:', images.length);
        for (let j = 0; j < images.length; j++) {
            let image = images[j];
            image.pageId = pageId;
            let isSuccess = await ImagesModel.create(image);
            if (!isSuccess) {
                isResSuccess.push({ isResSuccess: isSuccess, src: image.source })
            }
        }
    }

    ctx.body = isResSuccess;
}

function getRandomImage(linkFacebook, token, limit, maxIndex, pageId) {
    var randomIndex = 1;
    return new Promise((resolve, reject) => {
        request({
            url: linkFacebook,
            qs: {
                fields: "images",
                limit: limit,
                offset: randomIndex,
                access_token: token
            },
            method: "GET"
        }, (err, response, body) => {
            if (err) {
                reject(err);
                return;
            }
            var rs = JSON.parse(body);
            var imageUrls;
            if (rs.data)
                imageUrls = rs.data.map(data => data.images[0]);
            else
                imageUrls = [];
            //var imageUrl = rs.data[0].images[0].source;
            resolve(imageUrls);
        });
    });
};