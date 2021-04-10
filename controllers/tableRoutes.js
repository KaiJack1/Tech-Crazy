//Using dependencies
const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');
const inAuth = require('../utils/auth');

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
        res.render('table', {posts, loggedIn: true});
    })
    //500 error
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
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
        if (!dbPostData) {
            res.status(404).json({message: 'id error'});
            return;
        }

        //Serializing
        const post = dbPostData.get({plain: true});

        res.render('edit-post', {
            post,
            loggedIn: true
        });
        
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json(err);
    });
});
router.get('/create/', inAuth, (req, res) => {
    Post.findAll({
        //Gathering the session
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id', 
            'title',
            'created_at',
            'post_content'
        ],
        //User data next to id
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
        //The data will not serialize data before going through the template
        const posts = dbPostData.map(post => post.get({plain: true}));
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    });

    module.exports = router;
