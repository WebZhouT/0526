let func = require('../sql/func');
let str = require('../utils/str');
let moment = require('moment');
const { user } = require('../configs/db');

module.exports = {

	fetchList(req, res) {
		let id = req.body.id
		let name = req.body.name
		let userId = req.body.userId
		let sql = "select r.id,r.name,r.user_id userId from folder r where 1=1 "
		if (str.isNotEmpty(id)) {
			sql += " and r.id = " + id
		}
		if (str.isNotEmpty(name)) {
			sql += " and r.name like concat('%','" + name + "', '%')"
		}
		if (str.isNotEmpty(userId)) {
			sql += " and r.user_id = " + userId
		}

		func.connPool(sql, '', (err, rows) => {
			res.json({ code: 200, msg: 'ok', data: rows });
		});

	},

	fetchPage(req, res) {
		let pageNumber = req.body.pageNumber || 1;
		let lineNumber = req.body.lineNumber || 10;
		let id = req.body.id
		let name = req.body.name
		let userId = req.body.userId
		let sql = "select r.id,r.name,r.user_id userId from folder r where 1=1 "
		if (str.isNotEmpty(id)) {
			sql += " and r.id = " + id
		}
		if (str.isNotEmpty(name)) {
			sql += " and r.name like concat('%','" + name + "', '%')"
		}
		if (str.isNotEmpty(userId)) {
			sql += " and r.user_id = " + userId
		}

		let countSql = "select count(1) count from (" + sql + ") a";
		func.connPool(countSql, '', (err, rows) => {
			let total = rows[0].count;
			sql += " limit " + (pageNumber - 1) + "," + lineNumber;
			func.connPool(sql, '', (err1, rows1) => {
				res.json({ code: 200, msg: '请求成功', data: { data: rows1, total: total, pageNumber: pageNumber, lineNumber: lineNumber } });
			});
		});
	},

	fetchById(req, res) {
		let id = req.params.id;
		let sql = "select r.id,r.name,r.user_id userId from folder r where id=? "
		func.connPool(sql, [id], (err, rows) => {
			res.json({ code: 200, msg: '请求成功', data: rows[0] });
		});
	},

	// 添加
	add(req, res) {
		let now = new Date()
		let id = req.body.id
		let name = req.body.name
		let userId = req.body.userId
		let sql = "INSERT INTO folder(id,name,user_id) VALUES(?,?,?)";
		let arr = [id, name, userId];
		func.connPool(sql, arr, (err, rows) => {
			res.json({ code: 200, msg: '请求成功', data: rows.insertId });
		});

	},

	// 修改
	update(req, res) {
		let id = req.body.id
		let name = req.body.name
		if (!str.isNotEmpty(id)) {
			res.json({ code: 400, msg: 'id不能为空' });
			return;
		}
		let sql = "update folder set ";
		// if(str.isNotEmpty(id)){
		// 	sql+="id = " + id
		// }
		if (str.isNotEmpty(name)) {
			sql += ",name = '" + name + "'"
		}

		sql += " where id = " + id
		let arr = [];
		func.connPool(sql, arr, (err, rows) => {
			res.json({ code: 200, msg: '请求成功' });
		});

	},

	// 删除
	delete(req, res) {
		let id = req.params.id;
		let sql = "delete from folder WHERE id=?"
		func.connPool(sql, [id], (err, rows) => {
			if (err) {
				console.log('[DELETE ERROR] - ', err.message);
				return;
			}
			func.connPool("delete from note where folder_id = ?", [id], (err1, rows1) => {
				if (err1) {
					console.log('[DELETE ERROR] - ', err1.message);
					return;
				}
				res.json({ code: 200, msg: '请求成功' });
			});
		});

	}
};
