const User = require('../models/User');
const { UserClass } = require('../models/User');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

exports.signup = (req, res, next) => {
    const profile = req.body;
    let rgxUsername= /^([a-zA-Z.-_]){3,25}$/;
    let rgxEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let rgxPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if(!profile){
        return res.status(403).json({ error: "User object is null" });
    }
    if(!profile.username){
        return res.status(403).json({ error: "Username must be not null" });
    }
    if(!profile.email){
        return res.status(403).json({ error: "Email must be not null" });
    }
    if(!profile.password){
        return res.status(403).json({ error: "Password must be not null" });
    }
    if(!rgxUsername.test(profile.username)){
        return res.status(406).json({ error: "Username is not valid" });
    }
    if(!rgxEmail.test(profile.email)){
        return res.status(406).json({ error: "Email is not valid" });
    }
    if(!rgxPassword.test(profile.password)){
        return res.status(406).json({ error: "Password is not valid" });
    }
    bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(profile.password, salt)
                .then(hash => {
                    const user = new UserClass(
                        profile.username,
                        profile.email,
                        hash,
                        req.file ? 
                            `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : 
                            `${req.protocol}://${req.get('host')}/images/avatar_default.png`,
                        false
                    );
                    user.save()
                        .then(() => res.status(201).json({ message: 'User created' }))
                        .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));  
};

exports.login = (req, res, next) => {
    const profile = req.body;
    let rgxUsername= /^([a-zA-Z.-_]){3,25}$/;
    let rgxPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if(!profile){
        return res.status(403).json({ error: "User object is null" });
    }
    if(!profile.username || !rgxUsername.test(profile.username ||
        !profile.password || !rgxPassword.test(profile.password))){
        return res.status(406).json({ error: "Bad username or password" });
    }
    User.findOne(profile.username)
        .then(user => {
            bcrypt.compare(profile.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(406).json({ error: "Bad username or password" });
                }
                res.status(200).json({
                    userId: user.id,
                    token: jsonwebtoken.sign(
                        { userId: user.id},
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn : '24h'}
                    ),
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    privilege: user.privilege
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};

exports.getAllUsers = (req,res,next) => {
    User.find()
       .then(user => res.status(200).json(user))
       .catch(error => res.status(404).json({ error }));
};

exports.modifyUser = (req,res,next) => {
    let rgxEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(isNaN(req.params.id)){
        return res.status(406).json({ error: "Parameter 'id' must be a number" });
    }
    if(!req.body.avatar){
        return res.status(403).json({ error: "Email must be not null" });
    }
    if(!req.body.email){
        return res.status(403).json({ error: "Avatar must be not null" });
    }
    if(!rgxEmail.test(req.body.email)){
        return res.status(406).json({ error: "Email is not valid" });
    }
    const avatarUrl = req.file ? 
        `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : 
        req.body.avatar;
    User.updateOne(req.params.id , {email:req.body.email,avatar : avatarUrl})
         .then(() => {
             if(req.file){
                const filename = req.body.avatar.split('/images/')[1];
                if(filename !== "avatar_default.png"){
                    fs.unlink(`public/images/${filename}`, () => {
                        
                    })
                } 
             }
            res.status(200).json({ email: req.body.email, avatar: avatarUrl});
         })            
         .catch(error => res.status(400).json({ error })); 
}

exports.deleteUser = (req,res,next) => {
    if(isNaN(req.params.id)){
        return res.status(406).json({ error: "Parameter 'id' must be a number" });
    }
    User.findOneById(req.params.id)
        .then((user) => {
            const filename = user.avatar.split('/images/')[1];
                if(filename !== "avatar_default.png"){
                    fs.unlink(`public/images/${filename}`, () => {
                        
                    })
                } 
            User.deleteOne(user.id)
                .then(() => res.status(200).json({message: "Post deleted !"}))
                .catch(error => res.status(400).json({ error }));   
        })
        .catch(error => res.status(400).json({ error }));  
};
