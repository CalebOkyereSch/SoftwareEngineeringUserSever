const { existsSync, mkdirSync, createWriteStream } = require("fs");
const jimp = require("jimp"); //fot manipulatingimages
const { v4 } = require("uuid");
const makeDirectory = (directory) => {
  if (!existsSync(directory)) {
    mkdirSync(directory);
    return true;
  }
  return true;
};

const uploadFile = async ({ file }) => {
  try {
    //checking for existence of file
    if (!file) return null;
    const { originalname, buffer } = file; //read file
    let fileDirectory = `${__dirname}/../uploads`;
    let ensureFileDirectoryCreated = makeDirectory(fileDirectory);
    if (!ensureFileDirectoryCreated)
      throw new Error("Folder could not be created");
    const fileUrl = `${v4()}.${originalname.split(".")[1]}`; //create a unique name for file
    let creation = await jimp.read(buffer);
    await creation.write(`${fileDirectory}/${fileUrl}`);
    return fileUrl; // we'd save this in db
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = async (req, res, next) => {
  try {
    if (!req.files.main)
      return res
        .status(422)
        .json({ ok: false, error: "Main image is required" });
    if (!req.files.image)
      return res
        .status(422)
        .json({ ok: false, error: "Other images are required" }); // later you give your own appropriate error messages
    //first create variable to hole the path, this variable go be reg.body so sey y we go fit
    //call am in the other function, the one you dey take save for db
    req.body.main = await uploadFile({ file: req.files.main[0] });
    req.body.image = [];
    //loop over eq.files
    for (let i = 0; i < req.files.image.length; i++) {
      //we dey push the path there
      req.body.image.push(await uploadFile({ file: req.files.image[i] }));
    }

    //now move to the next function
    next();
  } catch (error) {
    console.log(error);
  }
};
