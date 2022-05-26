let index = require('../configs/index');
//文件上传
module.exports = {

    uploads(req, res){
        var paths = [];
        for (var i = 0; i < req.files.length; i++) {
            var path = index.publicUrl + req.files[i].path.replace(/\\/g, "/");
            paths.push(path);
        }
        res.json({code: 200, msg: '', data: paths});
    },

    upload(req, res){
        var path = index.publicUrl + req.file.path.replace(/\\/g, "/");
        res.json({code: 200, msg: '', data: path});
    }
    
};