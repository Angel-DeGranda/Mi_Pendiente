const express = require("express");
const router = express.Router();

const { obtenerPreferencias, actualizarPreferencias} = require("../controllers/preferenciasController");

router.get("/", obtenerPreferencias);
router.patch("/", actualizarPreferencias);

module.exports = router;