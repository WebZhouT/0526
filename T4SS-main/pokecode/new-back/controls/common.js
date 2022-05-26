let moment = require('moment');
let bcrypt = require('bcryptjs');
let func = require('../sql/func');
var jwt = require('../utils/jwt');

module.exports = {

    // 登录
    login (req, res) {
        let username = req.body.username;
        let pass = req.body.password;

        func.connPool('SELECT * from user where username = ?', [username], (err, rows) => {
            if (rows.length == 0) {
                res.json({code: 400, msg: '账号不存在或者密码错误'});
                return;
            }
            let password = rows[0].password;
            if(password == pass){
                let user = rows[0];
                user['password'] = '';
                user['createTime'] = user['create_time']
                // 授权时效24小时
                var token = jwt.getToken({...user}, 30 * 24 * 60 * 60 * 1000);
                res.header("X-API-TOKEN", token);
                res.json({code: 200, msg: '登录成功', data: user, token: token});
            }else{
                res.json({code: 400, msg: '账号不存在或者密码错误'});
            }

            /*bcrypt.compare(pass, password, (err, sure) => {
                if (sure) {
                    let user = {
                        user_id: rows[0].id,
                        user_name: rows[0].user_name,
                        type: rows[0].type,
                    };

                    req.session.login = user;

                    res.json({code: 200, msg: '登录成功', user: user});
                } else {
                    res.json({code: 400, msg: '密码错误'});
                }
            });*/

        });

    },

    register (req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let type = req.body.type;

        func.connPool('select * from user where username = ?', [username], (err, rows) => {
            console.log(rows);
            if(rows.length > 0){
                res.json({code: 500, msg: '账号已存在'});
                return;
            }
            let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            let sql = 'INSERT INTO user(username, password, create_time) VALUES(?, ?, ?)';
            let arr = [username, password,now];
            func.connPool(sql, arr, (err1, rows) => {
                console.log(rows);
                res.json({code: 200, msg: '请求成功'});
            });

        });
        // 密码加盐
        /*bcrypt.hash(pass, 10, (err, hash) => {
            if (err) console.log(err);

            pass = hash;

            let arr = [name, pass, type];

            func.connPool(query, arr, (err, rows) => {
                console.log(rows);
                res.json({code: 200, msg: 'done'});
            });

        });*/
    },

    resetPwd (req, res) {
        let id = req.body.id;
        let password = req.body.password;
        let newPwd = req.body.newPwd;

        func.connPool('select * from user where id = ?', [id], (err, rows) => {
            console.log(rows);
            if(rows.length == 0){
                res.json({code: 500, msg: '账号不存在'});
                return;
            }
            if(password != rows[0].password){
                res.json({code: 500, msg: '密码不正确'});
                return;
            }
            let sql = 'update user set password = ? where id = ?';
            let arr = [newPwd, id];
            func.connPool(sql, arr, (err1, rows) => {
                console.log(rows);
                res.json({code: 200, msg: '请求成功'});
            });

        });
        // 密码加盐
        /*bcrypt.hash(pass, 10, (err, hash) => {
            if (err) console.log(err);

            pass = hash;

            let arr = [name, pass, type];

            func.connPool(query, arr, (err, rows) => {
                console.log(rows);
                res.json({code: 200, msg: 'done'});
            });

        });*/
    },



    // 注销
    logout (req, res) {
        req.session.login = null;
        res.json({code: 200, msg: '注销成功'});
    },

    //获取用户信息
    info (req, res) {
        res.json({code: 200, msg: '', data: req.session.login});
    }
};