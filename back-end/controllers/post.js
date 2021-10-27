const Post = require('../models/Post');
const { PostClass } = require('../models/Post');
const fs = require('fs');

exports.getAllPostByForum =(req,res,next) => {
    Post.findByForum(req.params.forum)
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(404).json({ error }));
}

exports.getOnePostById = (req,res,next) => {
    Post.findOne(req.params.id)
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
}

exports.getAllCommentsByPostId = (req,res,next) => {
    Post.findByPostId(req.params.id)
        .then((comments) => res.status(200).json(comments))
        .catch(error => res.status(404).json({ error }));
}


exports.setOnePost = (req, res, next) => {
    const postObject = req.body.post;
    var now = new Date();
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