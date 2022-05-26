let func = require('../sql/func');
let fs = require('fs');
let str = require('../utils/str');
let pdf = require('html-pdf');
let moment = require('moment');

module.exports = {

    fetchList (req, res) {
		let id = req.body.id
		let name = req.body.name
		let folderId = req.body.folderId
		let userId = req.body.userId
		let type = req.body.type
		let content = req.body.content
		let createTime = req.body.createTime
		let updateTime = req.body.updateTime
		let delFlag = req.body.delFlag
		let sql = "select r.id,r.name,r.folder_id folderId,r.user_id userId,r.type,r.content,r.create_time createTime,r.update_time updateTime,"+
			"r.del_flag delFlag from note r where 1=1 "
		if(str.isNotEmpty(id)){
			sql+=" and r.id = " + id
		}
		if(str.isNotEmpty(name)){
			sql+=" and r.name like concat('%','" + name + "', '%')"
		}
		if(str.isNotEmpty(folderId)){
			sql+=" and r.folder_id = " + folderId
		}
		if(str.isNotEmpty(userId)){
			sql+=" and r.user_id = " + userId
		}
		if(str.isNotEmpty(type)){
			sql+=" and r.type = " + type
		}
		if(str.isNotEmpty(content)){
			sql+=" and r.content like concat('%','" + content + "', '%')"
		}
		if(str.isNotEmpty(createTime)){
			sql+=" and r.create_time = '" + createTime + "'"
		}
		if(str.isNotEmpty(updateTime)){
			sql+=" and r.update_time = '" + updateTime + "'"
		}
		if(str.isNotEmpty(delFlag)){
			sql+=" and r.del_flag = " + delFlag
		}
		
        func.connPool(sql, '', (err, rows) => {
            res.json({code: 200, msg: 'ok', data: rows});
        });

    },
	
	fetchPage (req, res) {
		let pageNumber = req.body.pageNumber || 1;
		let lineNumber = req.body.lineNumber || 10;
		let id = req.body.id
		let name = req.body.name
		let folderId = req.body.folderId
		let userId = req.body.userId
		let type = req.body.type
		let content = req.body.content
		let createTime = req.body.createTime
		let updateTime = req.body.updateTime
		let delFlag = req.body.delFlag
		let sql = "select r.id,r.name,r.folder_id folderId,r.user_id userId,r.type,r.content,r.create_time createTime,r.update_time updateTime,"+
			"r.del_flag delFlag from note r where 1=1 "
		if(str.isNotEmpty(id)){
			sql+=" and r.id = " + id
		}
		if(str.isNotEmpty(name)){
			sql+=" and r.name like concat('%','" + name + "', '%')"
		}
		if(str.isNotEmpty(folderId)){
			sql+=" and r.folder_id = " + folderId
		}
		if(str.isNotEmpty(userId)){
			sql+=" and r.user_id = " + userId
		}
		if(str.isNotEmpty(type)){
			sql+=" and r.type = " + type
		}
		if(str.isNotEmpty(content)){
			sql+=" and r.content like concat('%','" + content + "', '%')"
		}
		if(str.isNotEmpty(createTime)){
			sql+=" and r.create_time = '" + createTime + "'"
		}
		if(str.isNotEmpty(updateTime)){
			sql+=" and r.update_time = '" + updateTime + "'"
		}
		if(str.isNotEmpty(delFlag)){
			sql+=" and r.del_flag = " + delFlag
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
		let sql = "select r.id,r.name,r.folder_id folderId,r.user_id userId,r.type,r.content,r.create_time createTime,r.update_time updateTime,"+
			"r.del_flag delFlag from note r where id=? "
        func.connPool(sql, [id], (err, rows) => {
            res.json({code: 200, msg: '请求成功', data: rows[0]});
        });
    },


	down (req, res){
        let id = req.params.id;
		let sql = "select r.id, r.name,r.type,r.content from note r where id=? "
        func.connPool(sql, [id], (err, rows) => {
			if(!rows[0].id){
				res.json({code: 500, msg: '笔记不存在', data: null});
				return;
			}
			let path = './uploads/down/';
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			let name = rows[0].name + ".txt"
			if(rows[0].type == 1){
				name = rows[0].name + ".md"
			}else if(rows[0].type == 2){
				name = rows[0].name + ".pdf"
			}else if(rows[0].type == 3){
				name = rows[0].name + ".java"
			}else if(rows[0].type == 4){
				name = rows[0].name + ".py"
			}else if(rows[0].type == 5){
				name = rows[0].name + ".c"
			}else if(rows[0].type == 6){
				name = rows[0].name + ".cpp"
			}
			let filepath = path + name;
			console.log("content:", rows[0].content)
			if(rows[0].type == 2){
				// let htmlFile = path + rows[0].name + ".html"
				// fs.writeFileSync(htmlFile, rows[0].content) 
				// var html = fs.readFileSync(htmlFile, 'utf8');
				pdf.create(rows[0].content).toStream(function(err, stream){
					stream.pipe(fs.createWriteStream(filepath));	
				});
			}else{
				fs.writeFileSync(filepath, rows[0].content) 
			}
			// 创建可读流，读取当前项目目录下的hello.txt文件
			var rs = fs.createReadStream(filepath);
			// 设置响应请求头，200表示成功的状态码，headers表示设置的请求头
			res.writeHead(200, {
				'Content-Type': 'application/force-download',
				'Content-Disposition': 'attachment; filename=' + name
			});
			// 将可读流传给响应对象response
			rs.pipe(res);
        });
    },

    // 添加
    add (req, res) {
		let now = new Date()
		let id = req.body.id
		let name = req.body.name
		let folderId = req.body.folderId
		let userId = req.body.userId
		let type = req.body.type
		let content = req.body.content
		let createTime = moment(now).format('YYYY-MM-DD hh:mm:ss');
		let updateTime = moment(now).format('YYYY-MM-DD hh:mm:ss');
		let delFlag = req.body.delFlag
        let sql = "INSERT INTO note(id,name,folder_id,user_id,type,content,create_time,update_time,"+
			"del_flag) VALUES(?,?,?,?,?,?,?,?,?)";
        let arr = [id,name,folderId,userId,type,content,createTime,updateTime,
			delFlag];
        func.connPool(sql, arr, (err, rows) => {
            res.json({code: 200, msg: '请求成功', data: rows.insertId});
        });

    },
	
	// 修改
    update (req, res) {
		let id = req.body.id
		let name = req.body.name
		let folderId = req.body.folderId
		let userId = req.body.userId
		let type = req.body.type
		let content = req.body.content
		let updateTime = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
		let delFlag = req.body.delFlag
		if(!str.isNotEmpty(id)){
			res.json({code: 400, msg: 'id不能为空'});
			return;
		}
        let sql = "update note set ";
		if(str.isNotEmpty(id)){
			sql+="id = " + id
		}
		if(str.isNotEmpty(name)){
			sql+=",name = '" + name + "'"
		}
		if(str.isNotEmpty(folderId)){
			sql+=",folder_id = " + folderId
		}
		if(str.isNotEmpty(userId)){
			sql+=",user_id = " + userId
		}
		if(str.isNotEmpty(type)){
			sql+=",type = " + type
		}
		if(str.isNotEmpty(content)){
			sql+=",content = '" + content + "'"
		}
		if(str.isNotEmpty(updateTime)){
			sql+=",update_time = '" + updateTime + "'"
		}
		if(str.isNotEmpty(delFlag)){
			sql+=",del_flag = " + delFlag
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
		let sql = "delete from note WHERE id=?"
        func.connPool(sql, [id], (err, rows) => {
            if(err){
                console.log('[DELETE ERROR] - ',err.message);
                return;
            }    
            res.json({code: 200, msg: '请求成功'});
        });

    },

	// 一键清除回收站笔记
    clear (req, res) {
        let id = req.params.id;
		let sql = "delete from note WHERE del_flag = 1 and user_id = ?"
        func.connPool(sql, [id], (err, rows) => {
            if(err){
                console.log('[DELETE ERROR] - ',err.message);
                return;
            }    
            res.json({code: 200, msg: '请求成功'});
        });

    }
};
