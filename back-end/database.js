const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

mysqlConnection.connect(err => {
    if(err){
        throw err;
    }else{
        console.log("Connected !")
    }
})

module.exports = mysqlConnection;