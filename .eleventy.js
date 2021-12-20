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

      
    return {
        dir: {
            input: "src",
            output: "public"
        }
    };



}

