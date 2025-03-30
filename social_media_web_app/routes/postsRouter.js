const express = require('express');
const postsController = require('../controllers/postsController');
const {identifier,verifyToken,authenticateToken} = require("../middlewares/identification")
const checkRole = require("../middlewares/roleMW");
const router = express.Router();

router.get('/all-posts',authenticateToken ,postsController.getPosts);

router.get('/single-post', postsController.singlePost);

router.post('/create-post', authenticateToken, postsController.createPost);
router.get('/create-post', postsController.createPost_get);


router.put('/update-post', authenticateToken, checkRole(["user","moderator","admin"]),postsController.updatePost);
router.get('/update-post', authenticateToken,checkRole(["user","moderator","admin"]), postsController.updatePost_get);


router.delete('/delete-post', authenticateToken, postsController.deletePost);

router.post('/add-comment', authenticateToken, postsController.addComment);
router.delete('/delete-comment', authenticateToken, postsController.deleteComment);

router.post('/add-like', authenticateToken, postsController.addLike);

module.exports = router;