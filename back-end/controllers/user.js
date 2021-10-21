const User = require('../models/User');
const { UserClass } = require('../models/User');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(req.body.password, salt)
                .then(hash => {
                    const user = new UserClass(
                        req.body.pseudo,
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
    User.findOne(req.body.email)
        .then(user => {
            if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
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
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
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
         .then(() => res.status(200).json({ message: 'Objet modifié !'}))
         .catch(error => res.status(400).json({ error })); 
}

exports.deleteUser = (req,res,next) => {
    User.deleteOne(req.params.id )
         .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
         .catch(error => res.status(400).json({ error }));  
};
