const User = require('../models/User');
const { UserClass } = require('../models/User');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

exports.signup = (req, res, next) => {
    bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
                .then(hash => {
                    const user = new UserClass(
                        req.body.username,
                        req.body.email,
                        hash,
                        req.file ? 
                            `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : 
                            `${req.protocol}://${req.get('host')}/images/avatar_default.png`,
                        false
                    );
                    user.save()
                        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                        .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));  
};

exports.login = (req, res, next) => {
    User.findOne(req.body.username)
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
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
