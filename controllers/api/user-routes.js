//Using dependencies
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Using the user model and finding the data.
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// User 1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
          id: req.params.id
        },
        include: [
            {
              model: Post,
              attributes: ['id', 'title', 'post_content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                  model: Post,
                  attributes: ['title']
                }
            }
          ]

    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'User unknown' });
          return;
        }
        res.json(dbUserData);
      })
      //500 error
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// POST /api/users
router.post('/', (req, res) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      twitter: req.body.twitter,
      github: req.body.github
    })
    //Gathering data from id
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.github = dbUserData.github;
        req.session.loggedIn = true;
    
        res.json(dbUserData);
      });
    });
  });

  // Function to create a login action
  router.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
      //400 error
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
      }
      //Displaying an action to return a message if you enter the wrong password.
      const validPassword = dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        // declare session variables
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.github = dbUserData.github;
        req.session.loggedIn = true;
  
        res.json({ user: dbUserData, message: 'Login Successful' });
      });
    });
  });

//Function when you logout it no longer displays your profile info
  router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    }
    else {
      res.status(404).end();
    }
  });

// User 1
router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// Removing User 1
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      //500 error
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;