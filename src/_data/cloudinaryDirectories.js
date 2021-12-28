// paginate index.html file for each directory
    // archive
        // Dates
            //1994
                //April
                    //Roll 1
                //May
                //June
                    
            //1995
            //1996

require("dotenv").config();
var cloudinary = require('cloudinary');
const { get } = require("https");
const path = require("path");
const Cache = require("@11ty/eleventy-cache-assets");

var args = process.argv.slice(2);

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME; // add your cloud_name
const api_key = process.env.CLOUDINARY_API_KEY; // add your api_key
const api_secret = process.env.CLOUDINARY_API_SECRET; // add your api_secret

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // add your cloud_name
    api_key: process.env.CLOUDINARY_API_KEY, // add your api_key
    api_secret: process.env.CLOUDINARY_API_SECRET, // add your api_secret
    secure: true
});

async function getChildren(parentPath) {
    //get all subfolders inside of the film folder
    var data = await cloudinary.v2.api.sub_folders(parentPath, {
        max_results: 500
    },
        function (error, result) { if (error) { console.log("error in cloudinaryTags.js", error) } });

    if(data.folders.length > 0){

    }

    return data;
}

async function recurseCheck(data){
    if (data.folders.length > 0){
        for(var subfolder of data.folders){
            var children = await getChildren(subfolder.path);
            await recurseCheck(children);
            subfolder.folders = children.folders; //add data to object
            //console.log(subfolder);
        }
    }
    //console.log(data);
    return data;
}

async function getImages(path) {
    var data = cloudinary.v2.api.resources({
        type: 'upload',
        prefix: path // add your folder
      },
        function(error, result) { if (error) { console.log("error in flatDirectoryMap.js > getImages()", error)} });

    return data;
}

async function directoryDive(){
   var data = await getChildren('film/Archive/');
    await recurseCheck(data);
    //console.log(data.folders[0].folders[0].folders);
    return data.folders;
}

async function cacheData() {
    let url = "https://api.cloudinary.com/${cloud_name}/upload/list/";
  
    /* This returns a promise */
    return Cache(url, {
      duration: "1d", // save for 1 day
      type: "json"    // we’ll parse JSON for you
    });
  };

module.exports = directoryDive();

