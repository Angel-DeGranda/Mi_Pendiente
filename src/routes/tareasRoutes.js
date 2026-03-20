const express = require("express");
const router = express.Router();

const {getTareas, createTarea, editTarea, deleteTarea, cambiarEstado} = require("../controllers/tareasController");

router.get("/", getTareas);
router.post("/", createTarea);
router.put("/:id", deleteTarea);
router.delete("/:id", deleteTarea);
router.patch("/:id/estado", cambiarEstado);

module.exports = router;