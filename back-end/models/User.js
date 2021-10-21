const dotenv = require('dotenv');
const mysqlConnection = require("../database");

dotenv.config();

class UserClass {
    constructor(pseudo,email,password,avatar,privilege){
        this.pseudo = pseudo;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.privilege = privilege;
    }
    save = () => {
        var query = `INSERT INTO 
                    User (pseudo,email,password,avatar,privilege) 
                    VALUES ("${this.pseudo}", 
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
                resolve(JSON.parse(JSON.stringify(result)));
            }            
        })  
    });
}

findOne = (email) => {
    var query = `SELECT * FROM User WHERE email = "${email}"`;
    return new Promise((resolve, reject) =>{
        mysqlConnection.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else{
                resolve(JSON.parse(JSON.stringify(result[0])));
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
    var query = `DELETE FROM User WHERE id = ${id}`;
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

module.exports = { UserClass, find, findOne, updateOne, deleteOne };



