let express = require('express');
let common = require('../controls/common');
let file = require('../controls/file');
let upload = require('../utils/upload');
var jwt = require('../utils/jwt');
let path = '/api';


let router = express.Router();

// 登陆验证
let filter = (req, res, next) => {
    let token = req.headers['x-api-token']
    let user = jwt.verifyToken(token);
    if(user){
        req.session.login = user;
        next()
    } else {
        res.json({code: 500, msg: 'session已过期'});
    }
}

router.post(path + "/login", common.login); // 登录
router.post(path + "/reg", common.register); // 注册
router.post(path + "/pwd", common.resetPwd); // 重置密码
router.post(path + "/logout", common.logout); // 注销
router.get(path + "/info", filter, common.info); // 当前用户信息

//多文件上传
router.post(path + '/uploads', upload.array('files', 8), file.uploads);
//单文件上传
router.post(path + '/upload', upload.single('files'), file.upload);

//代码编译
let code = require('../controls/code');
router.post(path + "/code/compile", code.compile);


let folder = require('../controls/folder');
router.post(path + "/folder/page/list", folder.fetchPage);
router.post(path + "/folder/list", folder.fetchList);
router.get(path + "/folder/:id", folder.fetchById);
router.post(path + "/folder/", filter, folder.add);
router.put(path + "/folder/", folder.update);
router.delete(path + "/folder/:id", folder.delete);

let user = require('../controls/user');
router.post(path + "/user/page/list", user.fetchPage);
router.post(path + "/user/list", user.fetchList);
router.get(path + "/user/:id", user.fetchById);
router.post(path + "/user/", user.add);
router.put(path + "/user/", user.update);
router.delete(path + "/user/:id", user.delete);

let feedback = require('../controls/feedback');
router.post(path + "/feedback/page/list", feedback.fetchPage);
router.post(path + "/feedback/list", feedback.fetchList);
router.get(path + "/feedback/:id", feedback.fetchById);
router.post(path + "/feedback/", feedback.add);
router.put(path + "/feedback/", feedback.update);
router.delete(path + "/feedback/:id", feedback.delete);

let star = require('../controls/star');
router.post(path + "/star/page/list", star.fetchPage);
router.post(path + "/star/list", star.fetchList);
router.get(path + "/star/:id", star.fetchById);
router.post(path + "/star/", star.add);
router.put(path + "/star/", star.update);
router.delete(path + "/star/:id", star.delete);

let note = require('../controls/note');
router.post(path + "/note/page/list", note.fetchPage);
router.post(path + "/note/list", note.fetchList);
router.get(path + "/note/:id", note.fetchById);
router.get(path + "/note/down/:id", note.down);
router.get(path + "/note/clear/:id", note.clear);
router.post(path + "/note/", note.add);
router.put(path + "/note/", note.update);
router.delete(path + "/note/:id", note.delete);

module.exports = router;