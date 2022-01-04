const exiftool = require("exiftool-vendored").exiftool;

exiftool
  .read(
    "archive/Dates/1994/April/Granny Paris Roll 1/940401_Miller_Paris Granny Roll 1_001.jpg"
  )
  .then((tags /*: Tags */) => console.log("read 1", tags.PersonInImage))
  .catch((err) => console.error("Something terrible happened: ", err));

exiftool
  .write(
    "archive/Dates/1994/April/Granny Paris Roll 1/940401_Miller_Paris Granny Roll 1_001.jpg",
    { PersonInImage: "Lydia Miller, Ian Miller, Tim Miller" }
  )
  .catch((err) => console.error("Something terrible happened: ", err));

exiftool
  .read(
    "archive/Dates/1994/April/Granny Paris Roll 1/940401_Miller_Paris Granny Roll 1_001.jpg"
  )
  .then((tags /*: Tags */) => console.log("read 2", tags.PersonInImage))
  .catch((err) => console.error("Something terrible happened: ", err));
