const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router();
const {identifier,verifyToken,authenticateToken} = require("../middlewares/identification")
const verifyRole = require('../middlewares/roleMW');

router.post('/signup',authController.signup);
router.get("/signup",authController.signup_get);

router.post('/signin',authController.signin);
router.get("/signin",authController.signin_get);
router.get("/signout",identifier,authController.signout);

router.post("/sendCode",authController.sendCode)
router.post("/verifyCode",authController.verifyCode)
router.get("/verifyCode",authController.verifyCode_get)

router.post("/sendforgotPasswordCode",authController.sendforgotPasswordCode)
router.get("/forgotPassword",authController.forgotPassword_get);

router.post("/verifyForgotPasswordCode",authController.verifyForgotPasswordCode);
router.get("/verifyForgotPasswordCode",authController.verifyForgotPasswordCode_get);

router.post("/resetPassword",authController.resetPassword);
router.get("/resetPassword",authController.resetPassword_get);

router.post("/changePassword",authenticateToken,authController.changePassword);
router.get("/changePassword",authController.changePassword_get);

router.get("/adminPanel",authenticateToken,verifyRole(["admin"]),authController.adminPanel);

router.get("/adminPanel/users",authenticateToken,verifyRole(["admin"]),authController.adminPanel_users);
router.get("/adminPanel/moderators",authenticateToken,verifyRole(["admin"]),authController.adminPanel_moderators);
router.get("/adminPanel/posts",authenticateToken,verifyRole(["admin"]),authController.adminPanel_posts);

router.put('/adminPanel/users/update-user', authenticateToken, verifyRole(["admin"]),authController.updateUser);
router.get('/adminPanel/users/update-user', authenticateToken,verifyRole(["admin"]), authController.updateUser_get);

router.put('/adminPanel/users/update-moderator', authenticateToken, verifyRole(["admin"]),authController.updateModerator);
router.get('/adminPanel/users/update-moderator', authenticateToken,verifyRole(["admin"]), authController.updateModerator_get);

router.delete('/adminPanel/users/delete-user', authenticateToken,verifyRole(["admin"]), authController.deleteUser)
router.delete('/adminPanel/users/delete-moderator', authenticateToken,verifyRole(["admin"]), authController.deleteModerator)

router.put('/activate-mfa',authenticateToken,authController.activateMFA)

router.get('/single-user', authController.singleUser);

module.exports = router;