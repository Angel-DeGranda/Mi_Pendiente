const express = require("express");
const router = express.Router();

//Impotación del controlador
const authController = require("../controllers//authController");

//Ruta: POST /api/auth/login
router.post("/login", authController.login);

router.post("/logout", authController.logout);

module.exports = router