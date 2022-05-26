let fs = require('fs');
let path = require('path');
let moment = require('moment');
let multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {

        let t = moment().format('YYYYMMDD');
        let distPath = `./uploads/${t}`;
        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads');
        }
        // console.log(distPath)
        if (!fs.existsSync(distPath)) {
            fs.mkdirSync(distPath);
        }
        cb(null, distPath);
    },

    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        let name = Date.now() + Math.round(Math.random()*10);
        cb(null, name + ext);
    }
});

let upload = multer({storage: storage});

module.exports = upload;