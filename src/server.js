const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const supabase = require("./config/supabaseClient"); //Importación del modulo de supabase creado
const authRoutes = require("./routes/authRoutes"); //Importamos las rutas
const {verificarSesion} = require("./middlewares/authMiddleware")
require("dotenv").config();

const app = express();

//Middleware para entender JSON
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.get("/materias.html", verificarSesion, (req, res) =>{
    res.sendFile(path.join(__dirname, "../public/materias.html"));
});

//Definición de la carpeta "public" como estática.
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/api/auth", authRoutes);

//Inicio del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor arrancado en http://localhost:3600");
}) 