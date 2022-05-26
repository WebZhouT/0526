let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let session = require('express-session');
let cookieParser = require("cookie-parser")
let router = require('./routes/router');
const { initWs } = require('./ws/ws_handler')
const { initTask } = require('./task/cron_task')

let port = process.env.PORT || 9999;
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'wind',
    cookie: {
		secure: false,
		maxAge: 30 * 60 * 1000,
		httpOnly: true,
		sameSite: true
	},
    resave: true,
    saveUninitialized: true,
}));
app.use(cookieParser())

//设置跨域访问
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type,X-API-TOKEN,x-api-token");
    res.header("Access-Control-Expose-Headers","content-type,X-API-TOKEN,x-api-token");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
})

app.use("/uploads", express.static('./uploads'))
app.use("/help", express.static('./Readme.md'))

app.use(router);

app.listen(port, () => {
    console.log(`devServer start on port:${port}`);
});

//初始化定时任务
initTask();
// 初始化wwebsocket
initWs();