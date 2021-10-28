const Post = require('../models/Post');
const { PostClass } = require('../models/Post');
const fs = require('fs');

exports.getAllPostByForum =(req,res,next) => {
    if(!req.params.forum){
        return res.status(403).json({ error: "Parameter 'forum' must be not null"});
    }
    if(req.params.forum !== 'multimedias' && req.params.forum !== 'articles'){
        return res.status(406).json({ error: "Invalid type of forum"});
    }
    Post.findByForum(req.params.forum)
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(404).json({ error }));
}

exports.getOnePostById = (req,res,next) => {
    if(isNaN(req.params.id)){
        return res.status(406).json({ error: "Parameter 'id' must be a number" });
    }
    Post.findOne(req.params.id)
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
}

exports.getAllCommentsByPostId = (req,res,next) => {
    if(isNaN(req.params.id)){
        return res.status(406).json({ error: "Parameter 'id' must be a number" });
    }
    Post.findByPostId(req.params.id)
        .then((comments) => res.status(200).json(comments))
        .catch(error => res.status(404).json({ error }));
}


exports.setOnePost = (req, res, next) => {
    const postObject = req.body.post;
    if(!postObject){
        return res.status(403).json({ error: "Post object is null" });
    } 
    if(!postObject.comment){
        return res.status(403).json({ error: "Post comment must be not null" });
    }
    if(isNaN(postObject.userId)){
        return res.status(406).json({ error: "UserId must be a number" });
    }
    if(!postObject.forum){
        return res.status(403).json({ error: "Forum must be not null"});
    }
    if(postObject.forum !== 'multimedias' && postObject.forum !== 'articles'){
        return res.status(406).json({ error: "Invalid type of forum"});
    }
    const now = new Date();
    const post = new PostClass(
        postObject.userId,
        postObject.forum,
        `${
            now.getFullYear().toString().padStart(4, '0')}-${
            (now.getMonth()+1).toString().padStart(2, '0')}-${
            now.getDate().toString().padStart(2, '0')} ${ 
            now.getHours().toString().padStart(2, '0')}:${
            now.getMinutes().toString().padStart(2, '0')}:${
            now.getSeconds().toString().padStart(2, '0')}`,
            postObject.comment ? postObject.comment : null,
            req.file ? 
                `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null ,
            null  
    );
    post.save()
        .then(() => res.status(201).json({ message: "Post saved !"}))
        .catch(error => res.status(400).json({ error }));
}

exports.setOneComment = (req,res,next) => {
    const commentObject = req.body.comment;
    if(!commentObject){
        return res.status(403).json({ error: "Post object is null" });
    } 
    if(!commentObject.comment){
        return res.status(403).json({ error: "Post comment must be not null" });
    }
    if(isNaN(commentObject.userId)){
        return res.status(406).json({ error: "UserId must be a number" });
    }
    if(!commentObject.forum){
        return res.status(403).json({ error: "Forum must be not null"});
    }
    if(commentObject.forum !== 'multimedias' && commentObject.forum !== 'articles'){
        return res.status(406).json({ error: "Invalid type of forum"});
    }
    if(isNaN(req.params.id)){
        return res.status(403).json({ error: "Parameter 'id' must be a number" });
    }
    var now = new Date();
    const comment = new PostClass(
        commentObject.userId,
        commentObject.forum,
        `${
            now.getFullYear().toString().padStart(4, '0')}-${
            (now.getMonth()+1).toString().padStart(2, '0')}-${
            now.getDate().toString().padStart(2, '0')} ${ 
            now.getHours().toString().padStart(2, '0')}:${
            now.getMinutes().toString().padStart(2, '0')}:${
            now.getSeconds().toString().padStart(2, '0')}`,
            commentObject.comment ? commentObject.comment : null,
            req.file ? 
                `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null ,
            req.params.id  
    );
    comment.save()
        .then(() => res.status(201).json({ message: "Comment saved !"}))
        .catch(error => res.status(400).json({ error }));
}

exports.updateOnePostOrComment = (req,res,next) => {
    const post = req.body.post;
    if(!post){
        return res.status(403).json({ error: "Post object is null" });
    } 
    if(!post.comment){
        return res.status(403).json({ error: "Post comment must be not null" });
    }
    if(isNaN(post.userId)){
        return res.status(406).json({ error: "UserId must be a number" });
    }
    if(!post.forum){
        return res.status(403).json({ error: "Forum must be not null"});
    }
    if(post.forum !== 'multimedias' && post.forum !== 'articles'){
        return res.status(406).json({ error: "Invalid type of forum"});
    }
    if(isNaN(req.params.id)){
        return res.status(406).json({ error: "Parameter 'id' must be a number" });
    }
    const now = new Date();
    const postToSend = {
        dateModification : `${
            now.getFullYear().toString().padStart(4, '0')}-${
            (now.getMonth()+1).toString().padStart(2, '0')}-${
            now.getDate().toString().padStart(2, '0')} ${ 
            now.getHours().toString().padStart(2, '0')}:${
            now.getMinutes().toString().padStart(2, '0')}:${
            now.getSeconds().toString().padStart(2, '0')}`,
        comment : post.comment,
        mediaUrl : req.file ? 
            `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : 
            post.mediaUrl ? post.mediaUrl : null
    }
    Post.updateOne(req.params.id , postToSend)
         .then(() => res.status(200).json({ message: 'Post modified !'}))
         .catch(error => res.status(400).json({ error })); 
}

exports.deletePost = (req, res, next) => {
    if(isNaN(req.params.id)){
        return res.status(406).json({ error: "Parameter 'id' must be a number" });
    }
    Post.findOne(req.params.id)
        .then(post => {
            const filename = post.media_url.split('/images/')[1];
            fs.unlink(`public/images/${filename}`, () => {
                Post.deleteOne(req.params.id)
                .then(() => res.status(200).json({message: "Post deleted !"}))
                .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));  
}