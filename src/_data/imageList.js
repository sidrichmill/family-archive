const cloudinaryDirectories = require("./cloudinaryDirectories.json");

var imageList = [];

async function recurseSearch1(folder) {
  for (var subindex in folder) {
    var subfolder = folder[subindex];
    console.log("subfolder", subfolder);
    if (subfolder.images) {
      for (var imageindex in subfolder.images) {
        var image = subfolder.images[imageindex];
        console.log("image", image);
        imageList.push(image);
      }
    }
    if (subfolder.folders) {
      console.log("subfolder.folders", subfolder.folders);
      for (var ssindex in subfolder.folders) {
        var subsubfolder = subfolder.folders[ssindex];
        console.log("susubfolder", subsubfolder);
        recurseSearch(subsubfolder);
      }
    }
  }
}

async function recurseSearch(folder) {
  if (folder.folders) {
    for (var subfolder of folder.folders) {
      //console.log("subfolder", subfolder);
      if (subfolder.images) {
        for (var image of subfolder.images) {
          //console.log("image", image);
          imageList.push(image);
        }
      }
      if (subfolder.folders) {
        //   console.log("subfolder.folders", subfolder.folders);
        for (var subsubfolder of subfolder.folders) {
          //console.log("susubfolder", subsubfolder);
          recurseSearch(subsubfolder);
        }
      }
    }
  }
}

async function getImages() {
  for (var subfolder of cloudinaryDirectories) {
    await recurseSearch(subfolder);
  }
  //   console.log("imageList");
  //   for (image of imageList) {
  //     console.log(image.filename);
  //   }

  return imageList;
}

module.exports = getImages();

// console.log(cloudinaryDirectories[0]);
