//Using dependencies
const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');

router.get('/', inAuth, (req, res) => {
    Post.findAll({
        //Getting the Id from the session
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'created_at',
            'post_content'
        ],
        //Setting up the sections
        include: [
            {
                model: comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                   model: user,
                    attributes: ['username', 'github']
                }
            },
            {
                model: user,
                attributes: ['username', 'github']
            }
        ]
    })
    .then(dbPostData => {
        //Serializing
        const posts = dbPostData.map(post => post.get({plain: true}));
        res.render('main menu', {
            posts, 
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
//Displaying your profile when you login
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});
//Displaying data when your signing up to the website
router.get('/signup', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

router.get('/post/:id', (req, res) =>{
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'created_at',
            'post_content'
        ],
             //Setting up the sections
        include: [
            {
                model: comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                   model: user,
                    attributes: ['username', 'github']
                }
            },
            {
                model: user,
                attributes: ['username', 'github']
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({message: 'Post does not exist'});
            return;
        }

        //serializing
        const post = dbPostData.get({plain: true});

        //importing data to template
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    //500 error
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;