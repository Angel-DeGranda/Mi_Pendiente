const supabase = require("../config/supabaseClient");
 const { createClient } = require("@supabase/supabase-js");

const verificarSesion = async (req, res, next) => {
    const token = req.cookies.session;

    if(!token){
        return res.status(401).json({error: "No autorizado"});
    }

    const {data, error} = await supabase.auth.getUser(token);

    if(error || !data.user){
        return res.status(401).json({error: "No autorizado"});
    }

    req.user = data.user;
    req.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    next();
}

module.exports = {verificarSesion};