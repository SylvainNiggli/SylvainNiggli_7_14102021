const dotenv = require('dotenv');
const mysqlConnection = require("../database");

dotenv.config();

class PostClass {
    constructor(userId,forum,dateCreation,comment, mediaUrl, postParentId){
        this.userId = userId;
        this.forum = forum;
        this.dateCreation = dateCreation;
        this.comment = comment;
        this.mediaUrl = mediaUrl;
        this.postParentId = postParentId;
    }
    save = () => {
        var query = ``;
        if(!this.postParentId){
            query = `INSERT INTO 
                    Post (user_id,
                        forum,
                        date_creation,
                        comment, 
                        media_url)
                    VALUES (${this.userId}, 
                            "${this.forum}", 
                            "${this.dateCreation}", 
                            "${this.comment}",
                            "${this.mediaUrl}")`;
        } else{
            query = `INSERT INTO 
                    Post (user_id,
                        forum,
                        date_creation,
                        comment, 
                        media_url,
                        id_post_parent)
                    VALUES (${this.userId}, 
                            "${this.forum}", 
                            "${this.dateCreation}", 
                            "${this.comment}",
                            "${this.mediaUrl}",
                            ${this.postParentId})`;
        }
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
    var query = `SELECT * FROM Post 
                ORDER BY date_creation DESC`;
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

findByForum = (forum) => {
    var query = `SELECT post.id as id,user_id,forum,date_creation,date_modification,comment,media_url,id_post_parent,username,avatar FROM Post 
                INNER JOIN User ON Post.user_id = User.id
                WHERE forum = "${forum}"
                AND id_post_parent IS NULL
                ORDER BY date_creation DESC`;
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

findByPostId = (id) => {
    var query = `SELECT post.id as id,user_id,forum,date_creation,date_modification,comment,media_url,id_post_parent,username,avatar FROM Post 
    INNER JOIN User ON Post.user_id = User.id
                WHERE id_post_parent = ${id}
                ORDER BY date_creation ASC`;
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

findOne = (id) => {
    var query = `SELECT * FROM Post WHERE id = ${id}`;
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

updateOne = (id, post) => {
    var query = `UPDATE Post 
                SET date_modification = "${post.dateModification}",
                    comment = "${post.comment}"` 
                    + (post.mediaUrl ? `,media_url = "${post.mediaUrl}"` : ``)
                    + ` WHERE id = ${id}`;
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
    var query = `DELETE FROM Post 
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

module.exports = { PostClass, find, findByForum, findByPostId, findOne, updateOne, deleteOne };