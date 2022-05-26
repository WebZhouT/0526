let func = require('../sql/func');
let str = require('../utils/str');
let moment = require('moment');

module.exports = {

    fetchList (req, res) {
		let id = req.body.id
		let userId = req.body.userId
		let content = req.body.content
		let like = req.body.like
		let createTime = req.body.createTime
		let sql = "select r.id,r.user_id userId,r.content,r.like,r.create_time createTime from feedback r where 1=1 "
		if(str.isNotEmpty(id)){
			sql+=" and r.id = " + id
		}
		if(str.isNotEmpty(userId)){
			sql+=" and r.user_id = " + userId
		}
		if(str.isNotEmpty(content)){
			sql+=" and r.content like concat('%','" + content + "', '%')"
		}
		if(str.isNotEmpty(like)){
			sql+=" and r.like = " + like
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
		let userId = req.body.userId
		let content = req.body.content
		let like = req.body.like
		let createTime = req.body.createTime
		let sql = "select r.id,r.user_id userId,r.content,r.like,r.create_time createTime from feedback r where 1=1 "
		if(str.isNotEmpty(id)){
			sql+=" and r.id = " + id
		}
		if(str.isNotEmpty(userId)){
			sql+=" and r.user_id = " + userId
		}
		if(str.isNotEmpty(content)){
			sql+=" and r.content like concat('%','" + content + "', '%')"
		}
		if(str.isNotEmpty(like)){
			sql+=" and r.like = " + like
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
		let sql = "select r.id,r.user_id userId,r.content,r.like,r.create_time createTime from feedback r where id=? "
        func.connPool(sql, [id], (err, rows) => {
            res.json({code: 200, msg: '请求成功', data: rows[0]});
        });
    },

    // 添加
    add (req, res) {
		let now = new Date()
		let id = req.body.id
		let userId = req.body.userId
		let content = req.body.content
		let like = 0
		let createTime = moment(now).format('YYYY-MM-DD hh:mm:ss');
        let sql = "INSERT INTO feedback(id,user_id,content,`like`,create_time) VALUES(?,?,?,?,?)";
        let arr = [id,userId,content,like,createTime];
        func.connPool(sql, arr, (err, rows) => {
            res.json({code: 200, msg: '请求成功', data: rows.insertId});
        });

    },
	
	// 修改
    update (req, res) {
		let id = req.body.id
		let userId = req.body.userId
		let content = req.body.content
		// let like = req.body.like
		if(!str.isNotEmpty(id)){
			res.json({code: 400, msg: 'id不能为空'});
			return;
		}
        let sql = "update feedback set ";
		if(str.isNotEmpty(id)){
			sql+="id = " + id
		}
		if(str.isNotEmpty(userId)){
			sql+=",user_id = " + userId
		}
		if(str.isNotEmpty(content)){
			sql+=",content = '" + content + "'"
		}
		// if(str.isNotEmpty(like)){
		// 	sql+=",`like` = " + like
		// }
		
		sql +=  " where id = " + id
        let arr = [];
        func.connPool(sql, arr, (err, rows) => {
            res.json({code: 200, msg: '请求成功'});
        });

    },

    // 删除
    delete (req, res) {
        let id = req.params.id;
		let sql = "delete from feedback WHERE id=?"
        func.connPool(sql, [id], (err, rows) => {
            if(err){
                console.log('[DELETE ERROR] - ',err.message);
                return;
            }    
            res.json({code: 200, msg: '请求成功'});
        });

    },

	// 点赞
    like (req, res) {
        let id = req.params.id;
		let sql = "update feedback set `like` = `like` + 1 WHERE id=?"
        func.connPool(sql, [id], (err, rows) => {
            if(err){
                console.log('[DELETE ERROR] - ',err.message);
                return;
            }    
            res.json({code: 200, msg: '请求成功'});
        });

    }
};
