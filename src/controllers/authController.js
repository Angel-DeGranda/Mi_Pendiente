const supabase = require("../config/supabaseClient");

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        //validar que vengan los datos
        if(!email || !password){
            return res.status(400).json({error: "Email y contraseña son requeridos"});
        }

        //Intentar iniciar sesion en Supabase
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if(error){
            return res.status(401).json({error: error.message});
        }

        res.cookie("session", data.session.access_token, {
            httpOnly:true,
            maxAge: 8 * 60 * 60 * 1000
        });

        return res.status(200).json({message: "Login exitoso"});
    }
    catch(err){
        return res.status(500).json({error: "Error interno del servidor"});
    }
}

const logout = async (req, res) => {
    res.clearCookie("session");
    return res.status(200).json({message:"Sessión cerrada"});
}

module.exports = {login, logout};