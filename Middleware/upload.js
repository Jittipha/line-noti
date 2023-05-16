
const multer = require("multer");


let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"./uploads");
  },
  filename: (req, file, cb) => {
    let datenow = Date.now();
    let filename = datenow+'-'+file.originalname;
    cb(null,filename)
  },
 
});
let uploadFile = multer({
  storage: storage,
});
module.exports = uploadFile;