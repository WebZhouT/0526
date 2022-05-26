let index = require('../configs/index');
let fs = require('fs');
const iconv = require('iconv-lite');
const os = require('os');
const process = require("child_process");
//代码编译
module.exports = {

    compile(req, res){
        let content = req.body.content;
        let type = req.body.type;
        let path = index.code;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        let name = Date.now() + Math.round(Math.random()*10);
        if(content == undefined || content == ''){
            res.json({code: 500, msg: '代码内容不能为空', data: null});
            return;
        }
        let file = path + name
        let cmd = "python " + file
        if(type == 'java'){
            try {
                let str = content.match("public.+class.+{")[0];
                let index = str.indexOf("class")
                let className = str.substring(index + 5, str.length).trim().split(" ")[0].trim()
                file = path + className + ".java"
                cmd = "cd " + path + " && javac "+ file + " && java " + className
            } catch (error) {
                console.log("error:", error)
                res.json({code: 500, msg: '系统异常', data: null});
            }
        }else if(type == 'c'){
            file += ".c"
            cmd = "cd " + path + " && gcc -o main " + file + " && main"
        }else if(type == 'c++'){
            file += ".cpp"
            cmd = "cd " + path + " && g++ -o main1 " + file + " && main1"
        }else if(type == 'python'){
            file += ".py"
            cmd = "python " + file
        }else{
            res.json({code: 500, msg: '语言类型不支持', data: null});
            return;
        }
        fs.writeFileSync(file, content) 
        console.log("cmd", cmd);
        let platform = os.platform();
        console.log("system", platform)
        process.exec(cmd, { encoding: 'binary' }, (error, stdout, stderr) => {
            if (!error) {
              if(platform == 'win32'){
                stdout = iconv.decode(stdout, 'cp936')
              }
              console.log("stdout:", stdout)
              res.json({code: 200, msg: '编译成功', data: stdout});
            } else {
              if(platform == 'win32'){
                stderr = iconv.decode(stderr, 'cp936')
              }
              console.log("stderr:", stderr)
              res.json({code: 400, msg: '编译失败', data: stderr});
            }
        });
    },    
};