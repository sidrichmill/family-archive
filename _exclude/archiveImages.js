var fs = require("fs");
var glob = require("glob");
var path = require("path");


async function getImageList(){
    //var years = fs.readdirSync("archive/Dates");
    var imageArray = [];
    var images = await getGlobs();
    console.log(images);

    for (var image in images){
        var name = path.basename(image, '.jpg');
        var path = path.dirname(image);
        var item = {
            "name": name,
            "path": path
        }
        imageArray.push(item);
    }
    console.log(imageArray);
    //return imageArray;
}

async function getGlobs(){
    var images = glob.sync("archive/Dates/**/*.jpg");
    return images;
}

async function readdirEach(dirArray){
    for (subdir of dirArray){
        
    }
}
//getImageList();
//module.exports = getImageList();