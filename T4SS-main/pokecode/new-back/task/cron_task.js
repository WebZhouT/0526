const schedule = require("node-schedule");
let func = require('../sql/func');


const noteTask = function(){

    //每隔10分钟定时清理一次垃圾站过期笔记回收
    schedule.scheduleJob("* */10 * * * *", function (fireDate) {
        // console.log(
        //   "每隔3秒就会执行我一次，This job was supposed to run at " +
        //     fireDate +
        //     ", but actually ran at " +
        //     new Date()
        // );
        func.connPool("delete from note where del_flag = 1 and datediff(update_time, now()) >= 30", [], (err1, rows1) => {
            if(err1){
                console.log('[DELETE ERROR] - ', err1.message);
                return;
            }    
            console.log("开启自动回收", rows1)
        });
    });
}

module.exports = {
    initTask(){
        noteTask();
    },
}

