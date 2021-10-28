const dotenv = require('dotenv');
const mysqlConnection = require("../database");

dotenv.config();

class UserClass {
    constructor(username,email,password,avatar,privilege){
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.privilege = privilege;
    }
    save = () => {
        var query = `INSERT INTO 
                    User (username,email,password,avatar,privilege) 
                    VALUES ("${this.username}", 
                            "${this.email}", 
                            "${this.password}", 
                            "${this.avatar}",
                            ${this.privilege})`;
        return new Promise((resolve, reject) =>{
            mysqlConnection.query(query, (err, result) => {
                if (err){
                    reject(err);
                } else{
                    resolve(JSON.parse(JSON.stringify(result)));
                }               
            })  
        }); 
    }
}

find = () => {
    var query = `SELECT * FROM User`;
    return new Promise((resolve, reject) =>{
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else{
                if(!result[0]){
                    reject("Any user corresponding");
                }else{
                    resolve(JSON.parse(JSON.stringify(result)));
                }  
            }            
        })  
    });
}

findOne = (username) => {
    var query = `SELECT * FROM User WHERE username = "${ username }"`;
    return new Promise((resolve, reject) =>{
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else{
                if(!result[0]){
                    reject("Any user corresponding");
                }else{
                    resolve(JSON.parse(JSON.stringify(result[0])));
                }  
            }            
        })  
    });
}

findOneById = (id) => {
    var query = `SELECT * FROM User WHERE id = "${ id }"`;
    return new Promise((resolve, reject) =>{
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else{
                if(!result[0]){
                    reject("Any user corresponding");
                }else{
                    resolve(JSON.parse(JSON.stringify(result[0])));
                }  
            }            
        })  
    });
}

updateOne = (id, user ) => {
    var query = `UPDATE User 
                SET email = "${user.email}",
                    avatar = "${user.avatar}"
                WHERE id = ${id}`;
    return new Promise((resolve, reject) =>{
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else{
                resolve(JSON.parse(JSON.stringify(result)));
            }            
        })  
    });
}

deleteOne = (id) => {
    var query = `DELETE FROM User 
                WHERE id = ${id}`;
    return new Promise((resolve, reject) =>{
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else{
                resolve(JSON.parse(JSON.stringify(result)));
            }            
        })  
    });
}

module.exports = { UserClass, find, findOne,findOneById, updateOne, deleteOne };



