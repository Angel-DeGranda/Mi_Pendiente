//Cargamos las variables de entorno del archivo .env
require("dotenv").config();

//Importa la función para crear el cliente de Supabase
const { createClient } = require("@supabase/supabase-js");

//Estraer las variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

//Validar que las variables existan
if(!supabaseUrl || !supabaseKey){
    console.error("ERROR: Faltan las variables de entorno de Supabase");
    process.exit(1); //Detiene la app si no hay conexión
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;