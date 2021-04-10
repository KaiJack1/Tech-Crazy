//Importing comment data
const { Comment } = require('../models');

//Displaying the functionality to see comments
const commentData = [
    {
        user_id: 1,
        post_id: 5,
        comment_text: "I'll live forever!"
    },
    {
        user_id: 4,
        post_id: 4,
        comment_text: "Anymore salad left?"
    },
    {
        user_id: 1,
        post_id: 4,
        comment_text: "How's it hanging?"
    },
    {
        user_id: 3,
        post_id: 5,
        comment_text: "Where's my car dude?"
    },
    {
        user_id: 3,
        post_id: 2,
        comment_text: "Pizza anyone?"
    },
    {
        user_id: 3,
        post_id: 4,
        comment_text: "Keep stroking the wool!"
    },
    {
        user_id: 5,
        post_id: 3,
        comment_text: "Life's a party!"
    },
    {
        user_id: 2,
        post_id: 1,
        comment_text: "Bonkers"
    }
]

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;