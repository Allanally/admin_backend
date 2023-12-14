const router = require("express").Router();
const authController = require("../Controllers/authController");
const { checkUser } = require("../Middlewares/AuthMiddlewares");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/view", authController.view);
router.post("/perm", authController.perm);

module.exports = router;