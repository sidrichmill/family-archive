const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Cache = require("@11ty/eleventy-cache-assets");

module.exports = function(eleventyConfig) {


    eleventyConfig.addPassthroughCopy('./src/style');
    eleventyConfig.addPassthroughCopy('./src/js');

    // eleventyConfig.addNunjucksShortcode("slider", function(currentImage, imageList) { 

    //  });

    eleventyConfig.addCollection("detailsCollection", function (collection) {
        // console.log(collection.getAll());
        return collection.getAll().filter((post) => post.data.details);
      });
    
    eleventyConfig.addCollection("yearsCollection", function(collectionApi) {
        return collectionApi.getAll().filter((posts) => posts.data.year);
    });

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addNunjucksFilter("split", function(value, delim) {
        var pathArray = value.split(delim);
        return pathArray;
     });
      
    return {
        dir: {
            input: "src",
            output: "public"
        }
    };



}

