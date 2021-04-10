//Using dependencies
const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
//To allow valid comment
router.get('/', (req, res) => {
    Comment.findAll({})
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/', withAuth, (req, res) => {
  // Analyze session
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      // inserting id from the session
      user_id: req.session.user_id,
    })
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
          //400 error
        console.log(err);
        res.status(400).json(err);
      });
  }
});
//function to delete comments
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
          id: req.params.id
        }
      })
      //404 error
        .then(dbCommentData => {
          if (!dbCommentData) {
            res.status(404).json({ message: 'Comment void' });
            return;
          }
          res.json(dbCommentData);
        })
        //500 error
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

module.exports = router;