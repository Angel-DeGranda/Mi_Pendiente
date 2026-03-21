const express = require("express");
const router = express.Router();

//Impotación del controlador
const authController = require("../controllers//authController");
const {verificarSesion} = require("../middlewares/authMiddleware");

//Ruta: POST /api/auth/login
router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/userData", verificarSesion, authController.userData);

module.exports = router;