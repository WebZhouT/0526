const { initEventHandle } = require('./ws')
const func = require('../sql/func')

let cons = [];//连接存放数组
let userMap = {};
const connectionHandle = (ws, req) => {
    let url = req.url
    if(url == "/"){
        return
    }
    let id = url.substring(1)
    if(id){
        ws.id = id;
        // console.log(ws);
        cons.push(ws)
        userMap[id] = ws
        ws.on('message', (message) => {
            console.log("client msg:" + message)
            // const data = JSON.parse(message)
            // const projectId = data.toContactId;
            // sql = "select user_id from project where id = ? union all select user_id from member where project_id = ? and user_id != 0"
            // func.connPool(sql, [projectId, projectId], (err, rows) => {
            //     if(err){
            //         console.log('[DELETE ERROR] - ',err.message);
            //         return;
            //     }    
            //     for(var i = 0; i < rows.length; i++){
            //         const id = rows[i].user_id
            //         const ss = userMap[id]
            //         if(ss != undefined){
            //             ss.send('' + message);
            //         }
            //     }
            // });
            cons.forEach((con, index) => {
                // console.log(con)
            	con.send('' + message);
            })
        });
    }
    // console.log(id);
	console.log("连接数:" + cons.length);
}

/**
 * 接收信息方法
 * @param  {string} message 消息json字符串
 * @return void
 */
const messageHandle = (message) => {
	console.log("client msg:" + message)
    // cons.forEach((con, index) => {
    //     // console.log(con)
	// 	con.send(message);
	// })
}

/**
 * 关闭连接方法
 * @param  {Number} code   错误码
 * @param  {Object} reason 错误原因
 * @param  {Object} ws     websocket实例
 * @return void
 */
const closeHandle = (code, reason, ws) => {
	let popNum = -1;
	cons.forEach((con, index) => {
		con == ws && (popNum = index)
	})
	cons.splice(popNum, 1)
	console.log("已断开webSocket连接,code:" + code + ",reason:" + reason);
	console.log(`当前连接数:${cons.length}`)
}

/**
 * 错误监听方法
 * @param  {Object} e 异常对象
 * @return void
 */
const errorHandle = e => console.error(e)



let initWs = function() {
    initEventHandle({
        connection: connectionHandle,
        // message: messageHandle,
        close: closeHandle,
        error: errorHandle
    })
}

// 初始化事件方法
module.exports = {
    initWs
}
