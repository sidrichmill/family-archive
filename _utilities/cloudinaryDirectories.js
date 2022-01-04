require("dotenv").config();
var fs = require("fs");
var cloudinary = require("cloudinary");
const { get } = require("https");
const path = require("path");

var args = process.argv.slice(2);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // add your cloud_name
  api_key: process.env.CLOUDINARY_API_KEY, // add your api_key
  api_secret: process.env.CLOUDINARY_API_SECRET, // add your api_secret
  secure: true,
});

//const fileName = path.basename(process.argv[1], ".js");
const fileName = "cloudinaryDirectories";
const cacheExt = ".json";
const cacheName = fileName + cacheExt;
const cacheDir = "./src/_data/";
const cachePath = cacheDir + cacheName;

async function checkCache(bust = false, path = "film/Archive/") {
  if (bust) {
    console.log("Busting Cache");
  }

  fs.readFile(cachePath, "utf8", (err, data) => {
    var cacheData;

    if (err) {
      cacheData = null;
      console.error(err);
    } else {
      cacheData = data;
    }

    if (cacheData && !bust) {
      console.log(fileName + " -- returning data from Cache", cachePath);
      return cacheData;
    } else {
      cacheRefresh(path);
    }
  });
}

async function cacheRefresh(path) {
  console.log("Fetching fresh data...");
  var data = await getChildren(path);
  await recurseCheck(data);
  var freshData = data.folders;
  // writeImageCache(freshData);
  // writeFlatCache(freshData);
  var dataString = JSON.stringify(freshData);
  fs.writeFile(cachePath, dataString, (err) => {
    if (err) throw err;
    console.log(fileName + " -- Data written to file!", cachePath);
  });

  // console.log(fileName + " -- Returned fresh data!");
  // return freshData;
}

async function getChildren(parentPath) {
  //get all subfolders inside of the film folder
  var data = await cloudinary.v2.api.sub_folders(
    parentPath,
    {
      max_results: 500,
    },
    function (error, result) {
      if (error) {
        console.log("error in " + fileName, error);
      }
    }
  );

  return data;
}

async function recurseCheck(data) {
  if (data.folders.length > 0) {
    for (var subfolder of data.folders) {
      var children = await getChildren(subfolder.path);
      // Get Images in subfolder
      var expressionString = "folder=" + subfolder.path;
      await cloudinary.v2.search
        .expression(expressionString)
        .execute()
        .then((result) => {
          // if images exist in subfolder - add image list to parent
          if (result.resources.length > 0) {
            console.log(subfolder.path);
            var imageList = [];
            for (var image of result.resources) {
              if (image.folder == subfolder.path) {
                console.log(image.folder);
                imageList.push(image);
              }
            }
            subfolder.images = imageList;
          }
        });

      await recurseCheck(children);
      // if subfolders exist in folder - add folder list to parent
      if (children.folders.length > 0) {
        subfolder.folders = children.folders; //add data to object
      }

      //console.log(subfolder);
    }
  }
  //console.log(data);
  return data;
}

async function readJSON() {
  var data = fs.readFileSync(cachePath, "utf8");
  var parsedData = JSON.parse(data);
  //console.log("Parsed Data", parsedData);
  return parsedData;
}

function writeImageCache(data) {
  var dataString = JSON.stringify(imageData);
  fs.writeFile(cacheDir + "cloudinaryImages", dataString, (err) => {
    if (err) throw err;
    console.log(fileName + " -- Data written to file!", cachePath);
  });
}

// module.exports = readJSON();

checkCache(args[0], args[1]);
