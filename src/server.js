const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const supabase = require("./config/supabaseClient"); //Importación del modulo de supabase creado
const authRoutes = require("./routes/authRoutes"); //Importamos las rutas
const preferenciasRoutes = require("./routes/preferenciasRoutes");
const materiasRoutes = require("./routes/materiasRoutes");
const tareasRoutes = require("./routes/tareasRoutes");

const {verificarSesion} = require("./middlewares/authMiddleware")

const { iniciarRecordatorioJob } = require("./jobs/recordatorioJob");

require("dotenv").config();

const app = express();

//Middleware para entender JSON
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.get("/tareas.html", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/tareas.html"));
});
app.get("/materias.html", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/materias.html"));
});
app.get("/configuracion.html", verificarSesion, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/configuracion.html"));
});

//Definición de la carpeta "public" como estática.
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/preferencias", verificarSesion, preferenciasRoutes);
app.use("/api/tareas", verificarSesion, tareasRoutes)
app.use("/api/materias", verificarSesion, materiasRoutes);

//Inicio del servidor
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Servidor arrancado en http://localhost:3600");
}) 

iniciarRecordatorioJob();