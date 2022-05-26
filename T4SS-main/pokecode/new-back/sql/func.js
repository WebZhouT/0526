// let mysql = require('mysql');
let mysql = require('mysql2');
let db = require('../configs/db');
let pool = mysql.createPool(db);

module.exports = {
    connPool (sql, val, cb) {
        pool.getConnection((err, conn) => {
            // console.log(conn)
            let q = conn.query(sql, val, (err, rows) => {
                // console.log(sql);
                if (err) {
                    console.log(err);
                }

                // console.log(rows);
                // console.log(rows.insertId)
                cb(err, rows);
                conn.release();
            });
        });
    },

    // json格式
    writeJson(res, code = 200, msg = 'ok', data = null) {
        let obj = {code, msg, data};
        if (!data) {
            delete obj.data;
        }
        res.send(obj);
    },
};