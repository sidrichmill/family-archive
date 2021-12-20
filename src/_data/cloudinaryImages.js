require("dotenv").config();
var cloudinary = require('cloudinary');
const { get } = require("https");
const path = require("path");

var args = process.argv.slice(2);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // add your cloud_name
    api_key: process.env.CLOUDINARY_API_KEY, // add your api_key
    api_secret: process.env.CLOUDINARY_API_SECRET, // add your api_secret
    secure: true
});

//film/archive/dates
async function getFolders(folderSlug) {
    //get all subfolders inside of the film folder
    var data = await cloudinary.v2.api.sub_folders(folderSlug, {
        max_results: 500
    },
        function (error, result) { if (error) { console.log("error in cloudinaryTags.js", error) } });
    //

    //getContents()
    //console.log(data.folders)
    return data;
};

async function getFolderStructure(root) {
    // var data = await getFolders(root);
    // var directory = data.folders;
    
    var directory = await recursiveGet(root);
    
    // for (sub of directory) {
    //   var subfolders = await getFolders(sub.path);
    //   if(subfolders.total_count > 0){
    //       sub.folders = subfolders.folders;
    //   }
    //   //console.log("Subfolder", sub.name, subfolders)
    // }
    console.log("Folder Structure", directory);
}

async function recursiveGet(path){
    var data = await getFolders(path);

    if (data.total_count > 0){
        for (sub of data.folders){
            console.log("SUBFOLDER", sub);
            var subdata = await recursiveGet(sub.path);
            console.log("SUBDATA", sub.name, subdata);
            if(subdata){
                sub.folders = subdata.folders;
            }
        }
        //console.log(path, data);
    } else {
        return data;
    }
}

async function getContents(folderPath, maxResults){
    var data = await cloudinary.v2.api.resources({
        type: 'upload',
        prefix: folderPath, //selected folder
        tags: true,
        context: true,
        metadata: true,
        max_results: maxResults
    }, function (error, result) {
        if (error) { console.log("error in cloudinaryImages.js", error) }
    });

    var imageData = [];
    
    var images = data.resources;
    
    for (image of images) {
        //console.log(image);
        if(image.context){
            var camera = image.context.custom.camera;
            var filmStock = image.context.custom.filmStock;
            var altTextData = image.context.custom.alt
            var people = image.context.custom.people
        } else {
            var camera = null;
            var filmStock = null;
            var people = null;
            var altTextData = "placeholder alt text"
        };

        imageData.push(
            {
                file: image.public_id,
                imageSrc: image.url,
                urlSlug: "v" + image.version + "/" + image.public_id,
                altText: altTextData,
                name: path.basename(image.url),
                album: path.basename(path.dirname(image.url)),
                directory: path.dirname(image.public_id) + "/",
                //rating: image.rating,
                //tags: image.tags,
                width: image.width,
                height: image.height,
                people: people
                //camera: camera,
                //filmStock: filmStock
            }
        );
    }
    //console.log(imageData);
    return imageData; //an array of objects representing each image in the folder
};


//getFolders(args);

//getFolderStructure(args);



//module.exports = getContents("film/Archive/Dates", 10);