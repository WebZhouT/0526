let func = require('../sql/func');
let str = require('../utils/str');
let moment = require('moment');

module.exports = {

    fetchList (req, res) {
		let id = req.body.id
		let username = req.body.username
		let name = req.body.name
		let password = req.body.password
		let email = req.body.email
		let img = req.body.img
		let createTime = req.body.createTime
		let sql = "select r.id,r.username,r.name,r.password,r.email,r.img,r.create_time createTime from user r where 1=1 "
		if(str.isNotEmpty(id)){
			sql+=" and r.id = " + id
		}
		if(str.isNotEmpty(username)){
			sql+=" and r.username like concat('%','" + username + "', '%')"
		}
		if(str.isNotEmpty(name)){
			sql+=" and r.name like concat('%','" + name + "', '%')"
		}
		if(str.isNotEmpty(password)){
			sql+=" and r.password like concat('%','" + password + "', '%')"
		}
		if(str.isNotEmpty(email)){
			sql+=" and r.email like concat('%','" + email + "', '%')"
		}
		if(str.isNotEmpty(img)){
			sql+=" and r.img like concat('%','" + img + "', '%')"
		}
		if(str.isNotEmpty(createTime)){
			sql+=" and r.create_time = '" + createTime + "'"
		}
		
        func.connPool(sql, '', (err, rows) => {
            res.json({code: 200, msg: 'ok', data: rows});
        });

    },
	
	fetchPage (req, res) {
		let pageNumber = req.body.pageNumber || 1;
		let lineNumber = req.body.lineNumber || 10;
		let id = req.body.id
		let username = req.body.username
		let name = req.body.name
		let password = req.body.password
		let email = req.body.email
		let img = req.body.img
		let createTime = req.body.createTime
		let sql = "select r.id,r.username,r.name,r.password,r.email,r.img,r.create_time createTime from user r where 1=1 "
		if(str.isNotEmpty(id)){
			sql+=" and r.id = " + id
		}
		if(str.isNotEmpty(username)){
			sql+=" and r.username like concat('%','" + username + "', '%')"
		}
		if(str.isNotEmpty(name)){
			sql+=" and r.name like concat('%','" + name + "', '%')"
		}
		if(str.isNotEmpty(password)){
			sql+=" and r.password like concat('%','" + password + "', '%')"
		}
		if(str.isNotEmpty(email)){
			sql+=" and r.email like concat('%','" + email + "', '%')"
		}
		if(str.isNotEmpty(img)){
			sql+=" and r.img like concat('%','" + img + "', '%')"
		}
		if(str.isNotEmpty(createTime)){
			sql+=" and r.create_time = '" + createTime + "'"
		}
		
		let countSql = "select count(1) count from (" + sql + ") a";
		func.connPool(countSql, '', (err, rows) => {
            let total = rows[0].count;
			sql += " limit " + (pageNumber - 1) + "," + lineNumber;
			func.connPool(sql, '', (err1, rows1) => {
				res.json({code: 200, msg: '请求成功', data: {data: rows1, total: total, pageNumber: pageNumber, lineNumber: lineNumber}});
			});
        });
    },

    fetchById (req, res){
        let id = req.params.id;
		let sql = "select r.id,r.username,r.name,r.password,r.email,r.img,r.create_time createTime from user r where id=? "
        func.connPool(sql, [id], (err, rows) => {
            res.json({code: 200, msg: '请求成功', data: rows[0]});
        });
    },

    // 添加
    add (req, res) {
		let now = new Date()
		let id = req.body.id
		let username = req.body.username
		let name = req.body.name
		let password = req.body.password
		let email = req.body.email
		let img = req.body.img
		let createTime = moment(now).format('YYYY-MM-DD hh:mm:ss');
        let sql = "INSERT INTO user(id,username,name,password,email,img,create_time) VALUES(?,?,?,?,?,?,?)";
        let arr = [id,username,name,password,email,img,createTime];
        func.connPool(sql, arr, (err, rows) => {
            res.json({code: 200, msg: '请求成功', data: rows.insertId});
        });

    },
	
	// 修改
    update (req, res) {
		let id = req.body.id
		let username = req.body.username
		let name = req.body.name
		let password = req.body.password
		let email = req.body.email
		let img = req.body.img
		if(!str.isNotEmpty(id)){
			res.json({code: 400, msg: 'id不能为空'});
			return;
		}
        let sql = "update user set ";
		if(str.isNotEmpty(id)){
			sql+="id = " + id
		}
		if(str.isNotEmpty(username)){
			sql+=",username = '" + username + "'"
		}
		if(str.isNotEmpty(name)){
			sql+=",name = '" + name + "'"
		}
		if(str.isNotEmpty(password)){
			sql+=",password = '" + password + "'"
		}
		if(str.isNotEmpty(email)){
			sql+=",email = '" + email + "'"
		}
		if(str.isNotEmpty(img)){
			sql+=",img = '" + img + "'"
		}
		
		sql +=  " where id = " + id
        let arr = [];
        func.connPool(sql, arr, (err, rows) => {
            res.json({code: 200, msg: '请求成功'});
        });

    },

    // 删除
    delete (req, res) {
        let id = req.params.id;
		let sql = "delete from user WHERE id=?"
        func.connPool(sql, [id], (err, rows) => {
            if(err){
                console.log('[DELETE ERROR] - ',err.message);
                return;
            }    
            res.json({code: 200, msg: '请求成功'});
        });

    }
};
