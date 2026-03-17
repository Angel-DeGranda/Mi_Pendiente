const express = require("express");
const router = express.Router();

//Impotación del controlador
const {getMaterias, createMateria, editMateria, deleteMateria} = require("../controllers/materiasController");

router.get("/", getMaterias);

router.post("/", createMateria);

router.put("/:id", editMateria);

router.delete("/:id", deleteMateria);

module.exports = router;